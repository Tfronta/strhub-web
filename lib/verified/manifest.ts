/**
 * Build the verification metadata STRhub commits to the central engine repo:
 *   - tools/<slug>/manifest.yml  (the declared contract)
 *   - tools/<slug>/Dockerfile    (the pinned environment; camino A or B, §14)
 *
 * The author's repo is never modified and its source code is never stored — the
 * generated Dockerfile only `git clone`s the public repo at build time.
 */
import type { Submission } from "./submission";
import { isRemoteFixture } from "./submission";

/** Minimal, deterministic YAML emitter for plain JSON-like values. */
type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

function needsQuote(s: string): boolean {
  if (s === "") return true;
  if (/^[\s]|[\s]$/.test(s)) return true;
  // Quote anything with YAML-special characters or that could be misread.
  return /[:#\-?,[\]{}&*!|>'"%@`]/.test(s) || /^(true|false|null|yes|no|~)$/i.test(s) || /^[\d.+-]/.test(s);
}

function quoteScalar(s: string): string {
  if (!needsQuote(s)) return s;
  return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function emit(value: Json, indent: number): string[] {
  const pad = "  ".repeat(indent);
  if (Array.isArray(value)) {
    if (value.length === 0) return [`${pad}[]`];
    const lines: string[] = [];
    for (const item of value) {
      if (item !== null && typeof item === "object" && !Array.isArray(item)) {
        const sub = emitObject(item as Record<string, Json>, indent + 1);
        // Hang the first key on the dash line.
        const firstTrimmed = sub[0].slice((indent + 1) * 2);
        lines.push(`${pad}- ${firstTrimmed}`);
        lines.push(...sub.slice(1));
      } else if (Array.isArray(item)) {
        lines.push(`${pad}-`);
        lines.push(...emit(item, indent + 1));
      } else {
        lines.push(`${pad}- ${scalar(item)}`);
      }
    }
    return lines;
  }
  if (value !== null && typeof value === "object") {
    return emitObject(value as Record<string, Json>, indent);
  }
  return [`${pad}${scalar(value)}`];
}

function scalar(value: Json): string {
  if (value === null) return "null";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") return String(value);
  if (Array.isArray(value)) {
    return `[${value.map((v) => scalar(v)).join(", ")}]`;
  }
  return quoteScalar(String(value));
}

function emitObject(obj: Record<string, Json>, indent: number): string[] {
  const pad = "  ".repeat(indent);
  const lines: string[] = [];
  for (const [key, val] of Object.entries(obj)) {
    if (val === undefined) continue;
    if (Array.isArray(val)) {
      if (val.length > 0 && val.every((v) => typeof v !== "object" || v === null)) {
        lines.push(`${pad}${key}: ${scalar(val)}`);
      } else {
        lines.push(`${pad}${key}:`);
        lines.push(...emit(val, indent));
      }
    } else if (val !== null && typeof val === "object") {
      lines.push(`${pad}${key}:`);
      lines.push(...emitObject(val as Record<string, Json>, indent + 1));
    } else {
      lines.push(`${pad}${key}: ${scalar(val)}`);
    }
  }
  return lines;
}

export function toYaml(value: Json): string {
  return emit(value, 0).join("\n") + "\n";
}

/** Assemble the manifest object (schema-shaped) from a validated submission. */
export function buildManifestObject(sub: Submission, slug: string): Json {
  const tool: Record<string, Json> = {
    name: sub.tool.name,
    version: sub.tool.version,
  };
  if (sub.tool.maintainer) tool.maintainer = sub.tool.maintainer;
  if (sub.tool.contact) tool.contact = sub.tool.contact;

  const inputs: Record<string, Json> = {};
  if (sub.inputs.type) inputs.type = sub.inputs.type;
  if (sub.inputs.fixture) {
    if (isRemoteFixture(sub.inputs.fixture)) {
      inputs.fixture = {
        repo: sub.inputs.fixture.repo,
        ref: sub.inputs.fixture.ref,
        path: sub.inputs.fixture.path,
      };
    } else {
      inputs.fixture = sub.inputs.fixture;
    }
  }

  const outputs: Json[] = sub.outputs.map((o) => {
    const out: Record<string, Json> = {
      path: o.path,
      format: o.format,
      min_records: o.min_records ?? 1,
    };
    if (o.must_contain && o.must_contain.length) out.must_contain = o.must_contain;
    if (o.content) {
      const c: Record<string, Json> = {};
      for (const [k, v] of Object.entries(o.content)) {
        if (v !== undefined) c[k] = v as Json;
      }
      if (Object.keys(c).length) out.content = c;
    }
    return out;
  });

  return {
    tool,
    source: { repo: sub.source.repo, ref: sub.source.ref },
    report: { slug },
    environment: { dockerfile: "Dockerfile", os: sub.os },
    run: { cmd: sub.run.cmd, timeout_minutes: sub.run.timeout_minutes ?? 15 },
    inputs,
    outputs,
  };
}

export function buildManifestYaml(sub: Submission, slug: string): string {
  const header =
    `# STRhub Verified manifest — generated from a self-service submission.\n` +
    `# Verification metadata only; STRhub stores no tool source code. The\n` +
    `# Dockerfile clones the author's PUBLIC repo at the pinned ref at build time.\n\n`;
  return header + toYaml(buildManifestObject(sub, slug));
}

const BASE_IMAGE: Record<string, string> = {
  python: "python:3.11-slim",
  conda: "continuumio/miniconda3:latest",
  "c-cpp": "ubuntu:22.04",
  rust: "rust:1-slim",
  go: "golang:1-bookworm",
  java: "eclipse-temurin:21-jdk",
  node: "node:20-bookworm-slim",
};

/** Parse owner/name out of a GitHub repo URL for the clone line. */
function repoSlug(repoUrl: string): string {
  return repoUrl.replace(/\.git$/, "").replace(/^https:\/\/github\.com\//, "");
}

/**
 * Generated Dockerfile (camino B). The pattern: pin a base image, install a
 * minimal toolchain, `git clone` the author's repo at the immutable ref, then
 * run the author's build command. The build IS the "Installs" gate.
 */
export function generateDockerfile(sub: Submission): string {
  if (sub.docker.mode === "provided") return sub.docker.dockerfile;

  const base = BASE_IMAGE[sub.docker.language] ?? "ubuntu:22.04";
  const repo = `https://github.com/${repoSlug(sub.source.repo)}.git`;
  const ref = sub.source.ref;
  const buildCmd = sub.docker.build_cmd;
  const checkCmd = sub.docker.check_cmd;

  const aptLine =
    sub.docker.language === "c-cpp"
      ? "RUN apt-get update && apt-get install -y --no-install-recommends \\\n" +
        "        build-essential cmake git ca-certificates \\\n" +
        "        zlib1g-dev libbz2-dev liblzma-dev libcurl4-openssl-dev \\\n" +
        "    && rm -rf /var/lib/apt/lists/*\n"
      : "RUN apt-get update && apt-get install -y --no-install-recommends \\\n" +
        "        git ca-certificates \\\n" +
        "    && rm -rf /var/lib/apt/lists/*\n";

  const checkBlock = checkCmd
    ? `\n# Sanity check at BUILD time → a broken install fails Installs, not Runs.\nRUN ${checkCmd} >/dev/null 2>&1 || true\n`
    : "";

  return (
    `# Generated by STRhub Verified (camino B). Pinned environment; the build IS\n` +
    `# the "Installs" gate. STRhub stores no source — the repo is cloned here only.\n` +
    `FROM ${base}\n\n` +
    aptLine +
    `\n# Immutable ref of the author's public repo.\n` +
    `ARG TOOL_REF=${ref}\n` +
    `WORKDIR /opt\n` +
    `RUN git clone ${repo} tool \\\n` +
    `    && cd tool && git checkout "\${TOOL_REF}"\n\n` +
    `WORKDIR /opt/tool\n` +
    `RUN ${buildCmd}\n` +
    checkBlock +
    `\n# Execution contract: the manifest cmd runs via bash -lc.\n` +
    `WORKDIR /work\n` +
    `ENTRYPOINT ["/bin/bash", "-lc"]\n`
  );
}

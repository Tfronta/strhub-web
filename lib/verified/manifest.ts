/**
 * Build the verification metadata STRhub commits to the central engine repo:
 *   - tools/<slug>/manifest.yml  (the declared contract)
 *   - tools/<slug>/Dockerfile    (the pinned environment; camino A or B, §14)
 *
 * The author's repo is never modified and its source code is never stored — the
 * generated Dockerfile only `git clone`s the public repo at build time.
 */
import type { Submission } from "./submission";
import { isRemotePointer } from "./submission";

/**
 * Where an uploaded regions BED is committed, relative to the tool's directory.
 * prepare.py already stages `tools/<slug>/assets/*` into both legs, so an upload
 * lands on a path the harness has always read — no engine plumbing needed.
 */
export const REGIONS_ASSET_PATH = "assets/regions.bed";

/** Minimal, deterministic YAML emitter for plain JSON-like values. */
type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

// Control characters have no literal form in a YAML plain scalar. A newline in
// particular used to slip through unquoted whenever the value happened to carry
// no other special character, splitting one scalar across two lines and
// committing a manifest the engine could not parse. They are matched here so
// such a value is always quoted, and escaped below so it stays one scalar.
const CONTROL_CHARS = /[\x00-\x1f\x7f]/;

function needsQuote(s: string): boolean {
  if (s === "") return true;
  if (/^[\s]|[\s]$/.test(s)) return true;
  if (CONTROL_CHARS.test(s)) return true;
  // Quote anything with YAML-special characters or that could be misread.
  return /[:#\-?,[\]{}&*!|>'"%@`]/.test(s) || /^(true|false|null|yes|no|~)$/i.test(s) || /^[\d.+-]/.test(s);
}

function quoteScalar(s: string): string {
  if (!needsQuote(s)) return s;
  const escaped = s
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t")
    // Anything else in the control range gets the \xNN form YAML defines for it.
    .replace(/[\x00-\x1f\x7f]/g, (c) =>
      `\\x${c.charCodeAt(0).toString(16).padStart(2, "0")}`,
    );
  return `"${escaped}"`;
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
    if (isRemotePointer(sub.inputs.fixture)) {
      inputs.fixture = {
        repo: sub.inputs.fixture.repo,
        ref: sub.inputs.fixture.ref,
        path: sub.inputs.fixture.path,
      };
    } else {
      inputs.fixture = sub.inputs.fixture;
    }
  }
  // The author uploaded the BED; the API commits it here. `provided_by` keeps the
  // choice of loci attributed to them — the file lives in our repo, but they picked
  // the regions, and the report must not credit STRhub for that.
  if (sub.inputs.regions_bed) {
    inputs.regions = {
      path: `tools/${slug}/${REGIONS_ASSET_PATH}`,
      provided_by: "author",
    };
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

  // Pre-flight answers, carried into the manifest so the engine can stamp
  // level-2 eligibility from the author's own declaration (trigger A) without
  // the web having to decide anything. Only the ticked flags are emitted: an
  // all-false block would be noise in every manifest.
  const compatibility: Record<string, Json> = {};
  for (const [flag, on] of Object.entries(sub.compatibility ?? {})) {
    if (on) compatibility[flag] = true;
  }

  const manifest: Record<string, Json> = {
    tool,
    source: { repo: sub.source.repo, ref: sub.source.ref },
    report: { slug },
    environment: { dockerfile: "Dockerfile", os: sub.os },
    run: { cmd: sub.run.cmd, timeout_minutes: sub.run.timeout_minutes ?? 15 },
    inputs,
    outputs,
  };
  if (Object.keys(compatibility).length) manifest.compatibility = compatibility;
  return manifest;
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
  return repoUrl.replace(/\/+$/, "").replace(/\.git$/, "").replace(/^https:\/\/github\.com\//, "");
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
    `    && cd tool && git checkout "\${TOOL_REF}" \\\n` +
    `    && git submodule update --init --recursive\n\n` +
    `WORKDIR /opt/tool\n` +
    `RUN ${buildCmd}\n` +
    checkBlock +
    `\nENV PATH="/opt/tool:$PATH"\n` +
    `\n# Execution contract: the manifest cmd runs via bash -lc.\n` +
    `WORKDIR /work\n` +
    `ENTRYPOINT ["/bin/bash", "-lc"]\n`
  );
}

import fs from "fs/promises";
import path from "path";
import { parse } from "yaml";
import { gatherRepoContext } from "../lib/verified/autoconfig-context";
import { runAutoConfig, type AutoConfig } from "../lib/verified/autoconfig";
import { AutoConfigError } from "../lib/verified/autoconfig-errors";

/**
 * Measures the generator against the hand-written manifests in the engine repo,
 * which are the closest thing to ground truth this system has. Nulls are scored
 * apart from wrong answers: a null costs the author a field to fill in, a wrong
 * value costs them a failed run.
 */

interface Manifest {
  tool?: { name?: string };
  source?: { repo?: string; ref?: string };
  run?: { cmd?: string; timeout_minutes?: number };
  inputs?: { type?: string; fixture?: string };
  environment?: { dockerfile?: string };
}

type Verdict = "match" | "close" | "wrong" | "null";

interface FieldScore {
  field: string;
  verdict: Verdict;
  expected: string;
  actual: string;
}

const ENGINE_TOOLS =
  process.env.EVAL_TOOLS_DIR ??
  path.resolve(import.meta.dirname, "../../strhub-verified/tools");

function normalizeCmd(cmd: string): string {
  return cmd.trim().replace(/\s+/g, " ").toLowerCase();
}

/** Flags and paths, which is what actually decides whether a run works. */
function cmdTokens(cmd: string): Set<string> {
  return new Set(
    normalizeCmd(cmd)
      .split(" ")
      .filter((t) => t.startsWith("--") || t.startsWith("/data/")),
  );
}

function scoreCmd(expected: string | undefined, actual: string | null): Verdict {
  if (actual === null) return "null";
  if (!expected) return "wrong";
  if (normalizeCmd(expected) === normalizeCmd(actual)) return "match";
  const want = cmdTokens(expected);
  const got = cmdTokens(actual);
  if (want.size === 0) return "wrong";
  const overlap = [...want].filter((t) => got.has(t)).length / want.size;
  return overlap >= 0.6 ? "close" : "wrong";
}

function scoreExact(expected: string | undefined, actual: string | null): Verdict {
  if (actual === null) return "null";
  if (!expected) return "wrong";
  return expected.trim().toLowerCase() === actual.trim().toLowerCase() ? "match" : "wrong";
}

function scoreOne(manifest: Manifest, config: AutoConfig): FieldScore[] {
  const cmd = config.run.cmd.value;
  const type = config.inputs.type.value;
  const name = config.tool.name.value;
  return [
    {
      field: "run.cmd",
      verdict: scoreCmd(manifest.run?.cmd, cmd),
      expected: manifest.run?.cmd ?? "",
      actual: cmd ?? "(null)",
    },
    {
      field: "inputs.type",
      verdict: scoreExact(manifest.inputs?.type, type),
      expected: manifest.inputs?.type ?? "",
      actual: type ?? "(null)",
    },
    {
      field: "tool.name",
      verdict: scoreExact(manifest.tool?.name, name),
      expected: manifest.tool?.name ?? "",
      actual: name ?? "(null)",
    },
  ];
}

async function readManifests(): Promise<{ slug: string; manifest: Manifest }[]> {
  const dirs = await fs.readdir(ENGINE_TOOLS, { withFileTypes: true });
  const out: { slug: string; manifest: Manifest }[] = [];
  for (const dir of dirs) {
    if (!dir.isDirectory()) continue;
    try {
      const raw = await fs.readFile(path.join(ENGINE_TOOLS, dir.name, "manifest.yml"), "utf-8");
      out.push({ slug: dir.name, manifest: parse(raw) as Manifest });
    } catch {
      // A tool directory without a manifest is not an eval case.
    }
  }
  return out;
}

async function main(): Promise<void> {
  const limit = Number(process.env.EVAL_LIMIT ?? "0");
  const effort = process.env.EVAL_EFFORT === "medium" ? "medium" : "high";

  const cases = await readManifests();
  const runnable = cases.filter((c) => c.manifest.source?.repo && c.manifest.source?.ref);
  const selected = limit > 0 ? runnable.slice(0, limit) : runnable;

  console.log(`${selected.length} tool(s), effort=${effort}\n`);

  const tally: Record<Verdict, number> = { match: 0, close: 0, wrong: 0, null: 0 };
  let inputTokens = 0;
  let outputTokens = 0;

  for (const { slug, manifest } of selected) {
    const repo = manifest.source?.repo ?? "";
    const ref = manifest.source?.ref ?? "";
    process.stdout.write(`${slug} … `);
    try {
      const ctx = await gatherRepoContext(repo, ref);
      const result = await runAutoConfig(ctx, {
        effort,
        dockerfileProvided: false,
      });
      inputTokens += result.usage.inputTokens;
      outputTokens += result.usage.outputTokens;

      const scores = scoreOne(manifest, result.config);
      for (const s of scores) tally[s.verdict]++;
      console.log(scores.map((s) => `${s.field}=${s.verdict}`).join(" "));
      for (const s of scores) {
        if (s.verdict === "wrong" || s.verdict === "close") {
          console.log(`    expected: ${s.expected}`);
          console.log(`    actual:   ${s.actual}`);
        }
      }
      if (result.config.caveats.length) {
        console.log(`    caveats: ${result.config.caveats.join(" | ")}`);
      }
    } catch (e) {
      console.log(e instanceof AutoConfigError ? `error: ${e.code}` : `error: ${String(e)}`);
    }
  }

  const total = tally.match + tally.close + tally.wrong + tally.null;
  console.log("\n--- totals ---");
  console.log(`match ${tally.match}/${total}`);
  console.log(`close ${tally.close}/${total}`);
  console.log(`wrong ${tally.wrong}/${total}   <- the number that matters`);
  console.log(`null  ${tally.null}/${total}   <- safe, costs the author a field`);
  console.log(`tokens in=${inputTokens} out=${outputTokens}`);
}

void main();

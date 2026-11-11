/**
 * Trials: a rehearsal of a verification that publishes nothing.
 *
 * Maintainers, reviewers and users submit a public repository and an optional
 * ref. The engine evaluates the procedure at the resolved commit.
 *
 * Mechanics. A trial is one `workflow_dispatch` with mode=trial and repo+ref,
 * correlated by a dispatch id in the run name exactly like a verification. The
 * engine commits nothing; its report, the recipe it ran and its logs come back
 * as the run's artifact (kept 30 days), which this module downloads and unzips.
 * A finished trial is immutable, so it is cached per process; while it runs,
 * every poll is one GitHub call.
 */
import { unzipSync, strFromU8 } from "fflate";
import { LOG_LEGS, TRIAL_FILE_NAMES, type TrialFileName } from "./log-files";
import {
  ENGINE_REPO,
  dispatchTrial,
  findRunByDispatchId,
  ghBinary,
  ghPublic,
  listRunArtifacts,
  type WorkflowRun,
} from "./github";
import type { VerifiedReport, VerifiedBlocker, VerifiedVerdict } from "@/types/verified";

export const TRIAL_ROLES = ["owner", "reviewer", "user"] as const;
export type TrialRole = (typeof TRIAL_ROLES)[number];

export type TrialBlocker = VerifiedBlocker;

export interface TrialRecipe {
  schema: string;
  slug: string;
  manifest_yml: string;
  dockerfile: string;
  /** Plan B (manifest environment.fallback), built only if `dockerfile` fails. */
  dockerfile_fallback?: string;
  regions_bed?: string;
  proposal?: unknown;
}

export type TrialReport = VerifiedReport & {
  mode?: "trial" | "publish";
  verdict?: VerifiedVerdict;
  example_detail?: unknown;
};

export interface TrialStatus {
  id: string;
  state: "pending" | "queued" | "in_progress" | "completed" | "expired";
  conclusion: string | null;
  runUrl: string | null;
  slug: string | null;
  startedAt: string | null;
  report: TrialReport | null;
  recipe: TrialRecipe | null;
  summaryMd: string | null;
  logs: Record<string, string>;
  files?: Partial<Record<TrialFileName, string>>;
}

/** Trial dispatch ids are distinguishable from verification ones (sv_…). */
export const TRIAL_ID_RE = /^tr_[a-z0-9]+_[a-z0-9]+$/;

export function newTrialId(): string {
  const t = Date.now().toString(36);
  const r = Array.from(crypto.getRandomValues(new Uint8Array(6)))
    .map((b) => (b % 36).toString(36))
    .join("");
  return `tr_${t}_${r}`;
}

// Pure, and shared with the browser: the start form reads a pasted URL with it.
export { repoRefOf, repoSlugOf } from "./repo-url";
import { repoRefOf, repoSlugOf } from "./repo-url";

/**
 * The slug a trial's report is filed under. Not the catalogue's slug scheme
 * (tool + version + input type): a trial is about one commit of one
 * repository and nothing else, and its report is never listed.
 */
export function trialSlug(repoSlug: string, ref: string): string {
  const name = repoSlug.split("/")[1].toLowerCase().replace(/[^a-z0-9.-]+/g, "-");
  const short = ref.replace(/[^A-Za-z0-9.-]+/g, "-").slice(0, 12).toLowerCase();
  return `trial-${name}-${short}`.replace(/-+/g, "-").slice(0, 80);
}

/**
 * Resolve what to verify when the submitter did not say. The latest release is
 * what a paper cites and what a user installs; failing that the newest tag;
 * failing that the head of the default branch, which is at least a commit.
 * Always returns a SHA, so the trial is pinned however it was asked for.
 */
export async function resolveRef(
  repoSlug: string,
  ref: string | undefined
): Promise<{ sha: string; label: string; how: "given" | "release" | "tag" | "head" } | null> {
  try {
    const repo = await ghPublic<{ default_branch: string; fork?: boolean }>(`/repos/${repoSlug}`);
    if (!repo) return null;
    const commitOf = async (r: string) =>
      (await ghPublic<{ sha: string }>(`/repos/${repoSlug}/commits/${encodeURIComponent(r)}`))?.sha ?? null;

    if (ref && ref.trim()) {
      const sha = await commitOf(ref.trim());
      return sha ? { sha, label: ref.trim(), how: "given" } : null;
    }
    const release = await ghPublic<{ tag_name: string }>(`/repos/${repoSlug}/releases/latest`);
    if (release?.tag_name) {
      const sha = await commitOf(release.tag_name);
      if (sha) return { sha, label: release.tag_name, how: "release" };
    }
    // Forks inherit historical tags from the upstream repository; on a fork with
    // no release, the fork's own current work is on default_branch, not an old tag.
    if (!repo.fork) {
      const tags = await ghPublic<{ name: string }[]>(`/repos/${repoSlug}/tags?per_page=1`);
      if (tags?.[0]?.name) {
        const sha = await commitOf(tags[0].name);
        if (sha) return { sha, label: tags[0].name, how: "tag" };
      }
    }
    const sha = await commitOf(repo.default_branch);
    return sha ? { sha, label: repo.default_branch, how: "head" } : null;
  } catch (err) {
    if (process.env.NODE_ENV !== "production" && process.env.VERIFIED_TRIAL_FIXTURE_DIR) {
      return resolveRefViaLocalGit(repoSlug, ref);
    }
    throw err;
  }
}

async function resolveRefViaLocalGit(
  repoSlug: string,
  ref: string | undefined
): Promise<{ sha: string; label: string; how: "given" | "release" | "tag" | "head" } | null> {
  const { execFile } = await import("child_process");
  const { promisify } = await import("util");
  const path = await import("path");
  const execFileAsync = promisify(execFile);
  const script = path.resolve(process.cwd(), "../strhub-verified/harness/local_trial.py");
  try {
    const args = [script, "--repo", `https://github.com/${repoSlug}`, "--out-dir", "/tmp", "--resolve-only"];
    if (ref && ref.trim()) args.push("--ref", ref.trim());
    const { stdout } = await execFileAsync("python3", args, { timeout: 30000 });
    const parsed = JSON.parse(stdout.trim());
    if (parsed.ok && parsed.sha) {
      return { sha: parsed.sha, label: parsed.label || parsed.sha.slice(0, 7), how: parsed.how || "head" };
    }
    return null;
  } catch {
    return null;
  }
}

export interface StartedTrial {
  id: string;
  slug: string;
  repo: string;
  ref: string;
  refLabel: string;
  refHow: "given" | "release" | "tag" | "head";
}

/**
 * Development only: answer the form from the trials on disk instead of
 * dispatching, so the whole flow can be walked without GitHub.
 *
 * Lets a local UI inspect completed artifacts without GitHub credentials or a
 * matching workflow on the configured engine branch.
 *
 * Matches on the repository only, and only against a fixture that already
 * exists. An unknown repository falls through to the real path and gets the
 * real error: inventing a result for a repository nobody ran is the failure
 * mode this project exists to remove, and it would be worse in the tool that
 * demonstrates the rule. The ref the form asked for is not honoured either —
 * the fixture is pinned to the commit it was written for, and the page says so.
 */
async function startFixtureTrial(repoSlug: string, ref?: string): Promise<StartedTrial | null> {
  const dir = process.env.VERIFIED_TRIAL_FIXTURE_DIR;
  if (!dir || process.env.NODE_ENV === "production") return null;
  const fs = await import("fs/promises");
  const path = await import("path");
  const want = repoSlug.toLowerCase();
  let entries: string[];
  try {
    entries = await fs.readdir(dir);
  } catch {
    return null;
  }
  const available: string[] = [];
  const matches: StartedTrial[] = [];
  if (process.env.VERIFIED_LOCAL_LIVE !== "1") {
    // Sorted, so a repository with more than one scenario always resolves to the
    // same one rather than to whatever the filesystem listed first.
    for (const id of entries.filter((e) => TRIAL_ID_RE.test(e)).sort()) {
      let report: { source?: { repo?: string; ref_resolved?: string } };
      try {
        report = JSON.parse(await fs.readFile(path.join(dir, id, "report.json"), "utf-8"));
      } catch {
        continue;
      }
      const repo = report.source?.repo ?? "";
      const slug = repoSlugOf(repo);
      if (!slug) continue;
      available.push(`${slug} -> ${id}`);
      if (slug.toLowerCase() === want) {
        const sha = report.source?.ref_resolved ?? "";
        matches.push({ id, slug: trialSlug(slug, sha.slice(0, 7)), repo, ref: sha,
                       refLabel: sha.slice(0, 7), refHow: "given" });
      }
    }
    if (matches.length > 1) {
      console.warn(
        `[trial fixtures] ${repoSlug} has ${matches.length} scenarios; using ${matches[0].id}. ` +
          `Open the others directly: ${matches.slice(1).map((m) => m.id).join(", ")}`
      );
    }
    if (matches.length) return matches[0];
  }

  // Run the local engine (detect_recipe -> propose_manifest -> procedure ->
  // report -> generate_pdf) on any public GitHub repository so new tools can be
  // tested end-to-end from the local web UI without touching production CI.
  const { execFile } = await import("child_process");
  const { promisify } = await import("util");
  const execFileAsync = promisify(execFile);
  const script = path.resolve(process.cwd(), "../strhub-verified/harness/local_trial.py");
  const id = newTrialId();
  const outDir = path.resolve(process.cwd(), dir, id);
  try {
    const args = [script, "--repo", `https://github.com/${repoSlug}`, "--out-dir", outDir];
    if (ref && ref.trim()) args.push("--ref", ref.trim());
    const { stdout } = await execFileAsync("python3", args, { timeout: 60000 });
    const parsed = JSON.parse(stdout.trim());
    const sha = (parsed.ref as string) || ref || "HEAD";
    return {
      id,
      slug: trialSlug(repoSlug, sha.slice(0, 7)),
      repo: `https://github.com/${repoSlug}`,
      ref: sha,
      refLabel: sha.slice(0, 7),
      refHow: ref ? "given" : "head",
    };
  } catch (err) {
    console.warn(`[local trial] could not evaluate ${repoSlug}:`, err);
    return null;
  }
}

export async function startTrial(repoUrl: string, ref: string | undefined): Promise<StartedTrial | { error: string }> {
  const repoSlug = repoSlugOf(repoUrl);
  if (!repoSlug) return { error: "not_a_github_repo" };
  const effectiveRef = (ref && ref.trim()) ? ref.trim() : (repoRefOf(repoUrl) ?? undefined);
  const fixture = await startFixtureTrial(repoSlug, effectiveRef);
  if (fixture) return fixture;
  const resolved = await resolveRef(repoSlug, effectiveRef);
  if (!resolved) return { error: ref ? "ref_not_found" : "repo_not_found" };
  const id = newTrialId();
  const slug = trialSlug(repoSlug, resolved.label === resolved.sha ? resolved.sha.slice(0, 7) : resolved.label);
  const refLabel =
    resolved.how === "release" ||
    resolved.how === "tag" ||
    (resolved.how === "given" &&
      !/^[0-9a-f]{7,40}$/i.test(resolved.label) &&
      !/^(main|master|HEAD|develop|dev|trunk)$/i.test(resolved.label))
      ? resolved.label
      : "";
  await dispatchTrial({
    tool: slug,
    repo: `https://github.com/${repoSlug}`,
    ref: resolved.sha,
    refLabel,
    dispatchId: id,
  });
  return { id, slug, repo: `https://github.com/${repoSlug}`, ref: resolved.sha, refLabel: resolved.label, refHow: resolved.how };
}

// ---------------------------------------------------------------------------

const g = globalThis as unknown as {
  __strhubFinishedTrials?: Map<string, TrialStatus>;
  __strhubTrialBinaries?: Map<string, Record<string, Uint8Array>>;
};
const finished = (g.__strhubFinishedTrials ??= new Map<string, TrialStatus>());
/** Original artifact bytes served by /api/verify/trial/file. */
const binaries = (g.__strhubTrialBinaries ??= new Map<string, Record<string, Uint8Array>>());

export function getTrialFile(id: string, name: TrialFileName): Uint8Array | null {
  return binaries.get(id)?.[name] ?? null;
}

function artifactUrls(id: string, files: Record<string, Uint8Array>): TrialStatus["files"] {
  return Object.fromEntries(Object.keys(files).map((name) =>
    [name, `/api/verify/trial/file?id=${encodeURIComponent(id)}&name=${name}`],
  ));
}

/** Keep the existing status payload for callers that use the log tails. */
function logTails(files: Record<string, Uint8Array>): TrialStatus["logs"] {
  return Object.fromEntries(LOG_LEGS.flatMap((leg) => {
    const log = files[`log-${leg}`];
    return log ? [[leg, strFromU8(log).slice(-20_000)]] : [];
  }));
}

/** "Trial <slug> [tr_…]" is the run-name the engine gives a trial. */
function slugFromRunName(name: string | undefined): string | null {
  const m = (name ?? "").match(/^Trial\s+(\S+)\s+\[/);
  return m ? m[1] : null;
}

function baseStatus(id: string, run: WorkflowRun | null): TrialStatus {
  return {
    id,
    state: run ? (run.status === "completed" ? "completed" : (run.status as TrialStatus["state"])) : "pending",
    conclusion: run?.conclusion ?? null,
    runUrl: run?.html_url ?? null,
    slug: slugFromRunName(run?.name),
    startedAt: run?.run_started_at ?? run?.created_at ?? null,
    report: null,
    recipe: null,
    summaryMd: null,
    logs: {},
  };
}

async function readArtifact(runId: number, slug: string, id: string): Promise<(Partial<TrialStatus> & { _bin?: Record<string, Uint8Array> }) | "expired" | null> {
  const artifacts = await listRunArtifacts(runId);
  const art = artifacts.find((a) => a.name === `trial-${slug}`) ?? artifacts.find((a) => a.name.startsWith("trial-"));
  if (!art) return null;
  if (art.expired) return "expired";
  const zip = await ghBinary(`/repos/${ENGINE_REPO}/actions/artifacts/${art.id}/zip`);
  const files = unzipSync(new Uint8Array(zip));
  const text = (name: string) => (files[name] ? strFromU8(files[name]) : null);
  // The files are named after the report's slug, which need not be the
  // run-name's: a trial from a URL is filed under the tool's catalogue slug
  // (the engine works that out from the repository) while its artifact keeps
  // the run's own name. So find the report first, and key everything else
  // off the stem it was written under.
  const isReport = (f: string) => f.endsWith(".json") && !f.endsWith(".recipe.json") && !f.endsWith(".badge.json") && !f.includes("/");
  const reportName = files[`${slug}.json`] ? `${slug}.json` : Object.keys(files).find(isReport);
  const stem = reportName ? reportName.replace(/\.json$/, "") : slug;
  const reportText = reportName ? text(reportName) : null;
  const recipeText = text(`${stem}.recipe.json`);
  const bin: Record<string, Uint8Array> = {};
  for (const name of TRIAL_FILE_NAMES) {
    const filename = name === "pdf" || name === "html" ? name : `${name}.txt`;
    const file = files[`${stem}.${filename}`];
    if (file) bin[name] = file;
  }
  return {
    report: reportText ? (JSON.parse(reportText) as TrialReport) : null,
    recipe: recipeText ? (JSON.parse(recipeText) as TrialRecipe) : null,
    summaryMd: text(`${stem}.summary.md`),
    logs: logTails(bin),
    files: artifactUrls(id, bin),
    _bin: bin,
  } as Partial<TrialStatus> & { _bin: Record<string, Uint8Array> };
}

/**
 * Development only: serve a trial from files on disk instead of GitHub, so the
 * page can be built and looked at without dispatching anything to the
 * production engine (which a non-production process is refused anyway).
 * VERIFIED_TRIAL_FIXTURE_DIR/<id>/{report.json,recipe.json,summary.md,log-*.txt}
 */
async function fixtureTrial(id: string): Promise<TrialStatus | null> {
  const dir = process.env.VERIFIED_TRIAL_FIXTURE_DIR;
  if (!dir || process.env.NODE_ENV === "production") return null;
  const fs = await import("fs/promises");
  const path = await import("path");
  const base = path.join(dir, id);
  try {
    const report = JSON.parse(await fs.readFile(path.join(base, "report.json"), "utf-8")) as TrialReport;
    const recipe = await fs.readFile(path.join(base, "recipe.json"), "utf-8").then((x) => JSON.parse(x) as TrialRecipe).catch(() => null);
    const summaryMd = await fs.readFile(path.join(base, "summary.md"), "utf-8").catch(() => null);
    const bin: Record<string, Uint8Array> = {};
    for (const name of TRIAL_FILE_NAMES) {
      const file = name === "pdf" || name === "html" ? `report.${name}` : `${name}.txt`;
      try { bin[name] = new Uint8Array(await fs.readFile(path.join(base, file))); } catch { /* optional */ }
    }
    binaries.set(id, bin);
    return { id, state: "completed", conclusion: "success", runUrl: report.ci_run ?? null,
             slug: recipe?.slug ?? null, startedAt: report.generated, report, recipe, summaryMd,
             logs: logTails(bin), files: artifactUrls(id, bin) };
  } catch {
    return null;
  }
}

export async function getTrial(id: string): Promise<TrialStatus> {
  const cached = finished.get(id);
  if (cached) return cached;
  const fixture = await fixtureTrial(id);
  if (fixture) return fixture;
  const run = await findRunByDispatchId(id);
  const status = baseStatus(id, run);
  if (!run || status.state !== "completed") return status;

  const slug = status.slug ?? "";
  const art = slug ? await readArtifact(run.id, slug, id) : null;
  if (art === "expired") {
    status.state = "expired";
  } else if (art) {
    const { _bin, ...rest } = art;
    Object.assign(status, rest);
    if (_bin) binaries.set(id, _bin);
    if (status.recipe?.slug) status.slug = status.recipe.slug;
  }
  // A run that stopped before producing a report (a pre-flight rejection) still
  // completes; it is cached too, since it will not change.
  finished.set(id, status);
  return status;
}

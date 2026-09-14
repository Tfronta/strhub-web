/**
 * Trials: a rehearsal of a verification that publishes nothing.
 *
 * The three people STRhub Verified is for all start here. A tool's owner tries
 * a recipe before anything lands on the catalogue; a paper reviewer, who does
 * not write code, pastes the URL from the manuscript and reads a verdict; a
 * user who cannot get the tool running at home sees whether it runs in a clean
 * environment. None of them types a command: the engine reads the repository
 * and proposes the recipe itself (harness/detect_recipe.py).
 *
 * Mechanics. A trial is one `workflow_dispatch` with mode=trial and repo+ref,
 * correlated by a dispatch id in the run name exactly like a verification. The
 * engine commits nothing; its report, the recipe it ran and its logs come back
 * as the run's artifact (kept 30 days), which this module downloads and unzips.
 * A finished trial is immutable, so it is cached per process; while it runs,
 * every poll is one GitHub call.
 */
import { unzipSync, strFromU8 } from "fflate";
import {
  ENGINE_REPO,
  dispatchWorkflow,
  findRunByDispatchId,
  ghBinary,
  ghPublic,
  listRunArtifacts,
  type WorkflowRun,
} from "./github";
import type { VerifiedReport } from "@/types/verified";

export const TRIAL_ROLES = ["owner", "reviewer", "user"] as const;
export type TrialRole = (typeof TRIAL_ROLES)[number];

export type TrialVerdictCode = "runs" | "fails" | "undetermined" | "out_of_scope";

export interface TrialVerdict {
  code: TrialVerdictCode;
  title: string;
  reason: string;
  basis?: string;
  readme_gaps?: { item: string; text: string }[];
}

export interface TrialRecipe {
  schema: string;
  slug: string;
  manifest_yml: string;
  dockerfile: string;
  regions_bed?: string;
  proposal?: unknown;
}

export type TrialReport = VerifiedReport & {
  mode?: "trial" | "publish";
  verdict?: TrialVerdict;
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

export function repoSlugOf(url: string): string | null {
  const m = url
    .trim()
    .replace(/\.git$/, "")
    .replace(/\/+$/, "")
    .match(/^https:\/\/github\.com\/([A-Za-z0-9._-]+)\/([A-Za-z0-9._-]+)$/);
  return m ? `${m[1]}/${m[2]}` : null;
}

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
  const repo = await ghPublic<{ default_branch: string }>(`/repos/${repoSlug}`);
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
  const tags = await ghPublic<{ name: string }[]>(`/repos/${repoSlug}/tags?per_page=1`);
  if (tags?.[0]?.name) {
    const sha = await commitOf(tags[0].name);
    if (sha) return { sha, label: tags[0].name, how: "tag" };
  }
  const sha = await commitOf(repo.default_branch);
  return sha ? { sha, label: repo.default_branch, how: "head" } : null;
}

export interface StartedTrial {
  id: string;
  slug: string;
  repo: string;
  ref: string;
  refLabel: string;
  refHow: "given" | "release" | "tag" | "head";
}

export async function startTrial(repoUrl: string, ref: string | undefined): Promise<StartedTrial | { error: string }> {
  const repoSlug = repoSlugOf(repoUrl);
  if (!repoSlug) return { error: "not_a_github_repo" };
  const resolved = await resolveRef(repoSlug, ref);
  if (!resolved) return { error: ref ? "ref_not_found" : "repo_not_found" };
  const id = newTrialId();
  const slug = trialSlug(repoSlug, resolved.label === resolved.sha ? resolved.sha.slice(0, 7) : resolved.label);
  await dispatchWorkflow({
    tool: slug,
    mode: "trial",
    repo: `https://github.com/${repoSlug}`,
    ref: resolved.sha,
    dispatch_id: id,
  });
  return { id, slug, repo: `https://github.com/${repoSlug}`, ref: resolved.sha, refLabel: resolved.label, refHow: resolved.how };
}

// ---------------------------------------------------------------------------

const finished = new Map<string, TrialStatus>();

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

async function readArtifact(runId: number, slug: string): Promise<Partial<TrialStatus> | "expired" | null> {
  const artifacts = await listRunArtifacts(runId);
  const art = artifacts.find((a) => a.name === `trial-${slug}`) ?? artifacts.find((a) => a.name.startsWith("trial-"));
  if (!art) return null;
  if (art.expired) return "expired";
  const zip = await ghBinary(`/repos/${ENGINE_REPO}/actions/artifacts/${art.id}/zip`);
  const files = unzipSync(new Uint8Array(zip));
  const text = (name: string) => (files[name] ? strFromU8(files[name]) : null);
  const reportText = text(`${slug}.json`) ?? Object.keys(files).filter((f) => f.endsWith(".json") && !f.endsWith(".recipe.json") && !f.endsWith(".badge.json")).map(text)[0] ?? null;
  const recipeText = text(`${slug}.recipe.json`);
  const logs: Record<string, string> = {};
  for (const f of Object.keys(files)) {
    const m = f.match(/\.log-(own|external|example|build)\.txt$/);
    if (m) logs[m[1]] = strFromU8(files[f]).slice(-20_000);
  }
  return {
    report: reportText ? (JSON.parse(reportText) as TrialReport) : null,
    recipe: recipeText ? (JSON.parse(recipeText) as TrialRecipe) : null,
    summaryMd: text(`${slug}.summary.md`),
    logs,
  };
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
    const logs: Record<string, string> = {};
    for (const f of await fs.readdir(base)) {
      const m = f.match(/^log-(own|external|example|build)\.txt$/);
      if (m) logs[m[1]] = (await fs.readFile(path.join(base, f), "utf-8")).slice(-20_000);
    }
    return { id, state: "completed", conclusion: "success", runUrl: report.ci_run ?? null,
             slug: recipe?.slug ?? null, startedAt: report.generated, report, recipe, summaryMd, logs };
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
  const art = slug ? await readArtifact(run.id, slug) : null;
  if (art === "expired") {
    status.state = "expired";
  } else if (art) {
    Object.assign(status, art);
    if (status.recipe?.slug) status.slug = status.recipe.slug;
  }
  // A run that stopped before producing a report (a pre-flight rejection) still
  // completes; it is cached too, since it will not change.
  finished.set(id, status);
  return status;
}

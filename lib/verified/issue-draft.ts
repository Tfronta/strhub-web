/**
 * Draft an issue for the maintainer of a tool STRhub verified.
 *
 * A verification run often turns up something its maintainer would want to
 * know — a pinned dependency that no longer resolves, a flag the tool no longer
 * accepts, no test data to run it against. Until now that knowledge stopped at
 * our own report. Telling them is the point of doing this at all.
 *
 * Two rules shape everything here.
 *
 * Nothing is sent. This builds text; a person reads it, edits it, and files it
 * themselves. There is no API call anywhere in this file and there must not be
 * one: an automated system opening issues on strangers' repositories is a
 * different, worse product, and the mistake it would make at scale — filing a
 * confident report about somebody's software over a fault of our own — is one
 * this project has already made once by hand.
 *
 * And a run with nothing to report produces NO draft. `buildIssueDraft` returns
 * null for a green run with no errors and no unmet requirements, because a
 * button that always yields a draft becomes a button that manufactures issues,
 * and the person holding it will eventually send one.
 */
import type { VerifiedReport } from "@/types/verified";
import { summarizeErrors, shortItems } from "./diagnostics";

/** Where a reader can see the run for themselves. */
const ENGINE_REPO_URL = "https://github.com/Tfronta/strhub-verified";
const SITE = "https://strhub.app";

export interface IssueDraft {
  title: string;
  body: string;
  /** GitHub's new-issue URL with the draft prefilled, for the human to submit. */
  url: string;
  /** Why this run is worth writing about, for the dialog to show up front. */
  reasons: string[];
}

export interface IssueDraftOptions {
  /**
   * Include the notes taken while READING the repository (manifest `caveats`).
   *
   * Off by default. They are often the most useful thing we have — for STRsearch
   * they named the unresolvable pins before the build proved it — but they are
   * machine-extracted and unverified by execution, and a confident wrong claim
   * about somebody's repository is exactly the thing not to send a stranger
   * without reading it first. Opt in, having read them.
   */
  includeRepoNotes?: boolean;
}

/** owner/name from a GitHub URL, or null if it is not one. */
export function repoSlug(repoUrl: string | undefined): string | null {
  if (!repoUrl) return null;
  const m = repoUrl.match(/^https:\/\/github\.com\/([^/]+\/[^/]+?)(?:\.git)?\/?$/);
  return m ? m[1] : null;
}

const LADDER = ["available", "installs", "runs", "io", "content"] as const;

/** The furthest gate cleared, bottom-up — the same rule the engine's badge uses. */
function clearedLevel(report: VerifiedReport): string {
  let level = "none";
  for (const g of LADDER) {
    if (report.gates?.[g]) level = g;
    else break;
  }
  return level;
}

const STOPPED_AT: Record<string, string> = {
  none: "it could not be confirmed that the pinned source exists",
  available: "the environment did not build from source",
  installs: "it did not run end-to-end",
  runs: "it did not produce a non-empty file in the declared format",
  io: "its output did not look like plausible genotype-bearing data",
};

/**
 * Why this run is worth a maintainer's attention, most concrete first.
 *
 * Empty means there is nothing to tell them, and the caller must not offer a
 * draft. A tool that installed, ran, produced its declared output and reported
 * no errors has given us nothing to say that its maintainer does not know.
 */
export function draftReasons(report: VerifiedReport): string[] {
  const reasons: string[] = [];
  const level = clearedLevel(report);
  if (level !== "content") {
    reasons.push(STOPPED_AT[level] ?? `it stopped at ${level}`);
  }
  const errors = summarizeErrors(report.diagnostics);
  if (errors.length) {
    const items = errors.reduce((n, e) => n + e.count, 0);
    reasons.push(`the tool reported errors on ${items} item(s) during the run`);
  }
  // Only the test-data line: the other requirements (a regions file, a container)
  // describe how STRhub ran the tool, not a gap the maintainer would want raised.
  if ((report.needed_beyond_repo ?? []).some((n) => /test data/i.test(n))) {
    reasons.push("no test data from the repository was used, so a public sample stood in");
  }
  return reasons;
}

function toolLabel(report: VerifiedReport): string {
  const v = report.tool?.version;
  return v ? `${report.tool.name} ${v}` : report.tool?.name ?? "the tool";
}

/**
 * The draft, or null when the run has nothing to say.
 *
 * `slug` names the published attestation, which every claim below links back to:
 * the maintainer must be able to check every sentence of this against evidence
 * they did not have to take our word for.
 */
export function buildIssueDraft(
  report: VerifiedReport,
  slug: string,
  options: IssueDraftOptions = {},
): IssueDraft | null {
  const reasons = draftReasons(report);
  if (reasons.length === 0) return null;

  const name = toolLabel(report);
  const ref = report.source?.ref_resolved ?? report.source?.ref ?? "";
  const shortRef = /^[0-9a-f]{7,40}$/i.test(ref) ? ref.slice(0, 7) : ref;
  // A tool's version is usually derived from the very ref it was pinned at, so
  // naming both gives "STRsearch c70179b at c70179b", or "GangSTR 2.5 at v2.5".
  // Compared with a leading v stripped, which is the only way the two spellings
  // of a release tag differ in practice.
  const bare = (s: string) => s.trim().toLowerCase().replace(/^v/, "");
  const version = report.tool?.version ?? "";
  const at =
    version && bare(version) === bare(shortRef) ? name : `${name} at ${shortRef}`;
  const level = clearedLevel(report);
  const errors = summarizeErrors(report.diagnostics);

  const title =
    level !== "content"
      ? `STRhub Verified: ${at} — ${STOPPED_AT[level] ?? level}`
      : errors.length
        ? `STRhub Verified: ${at} — errors reported during the run`
        : `STRhub Verified: ${at} — notes from a verification run`;

  const L: string[] = [];

  // Who is writing and why, before anything that could read as a complaint.
  L.push(
    "Hello — this is an automated reproducible-execution check from STRhub " +
      "Verified, opened by hand after reading it.",
    "",
    `We installed ${name} from its public source at a pinned commit, in a clean ` +
      "container, and ran it on an open reference sample. It is not an " +
      "assessment of accuracy, of genotype correctness, or of fitness for " +
      "casework — only of whether the published code installs and runs. " +
      "Nothing here is a request, and no action is needed on your part.",
    "",
    `Full result, with logs and the exact configuration: ${SITE}/verified/${slug}`,
    "",
    "## What was run",
    "",
    `- Source: ${report.source?.repo ?? "—"} @ \`${ref}\``,
    `- Environment: ${(report.environment?.os ?? []).join(", ") || "ubuntu-22.04"}, container built for this run`,
    `- Manifest (the exact command, inputs and expected output): ${ENGINE_REPO_URL}/blob/main/tools/${slug}/manifest.yml`,
  );
  if (report.ci_run) L.push(`- CI run: ${report.ci_run}`);
  L.push(`- Date: ${report.generated?.slice(0, 10) ?? "—"}`);

  L.push("", "## What happened", "");
  if (level !== "content") {
    L.push(
      `The run cleared **${level}** and stopped there: ${STOPPED_AT[level] ?? ""}.`,
      "",
      "Stopping here is not a finding that the software is faulty — it records " +
        "how far this particular attempt got in one environment. That gap is " +
        "often what a new user meets on their first day, which is why we think " +
        "it is worth passing on.",
    );
  } else {
    L.push(
      "The run cleared every gate: the tool installed, ran end-to-end, and " +
        "produced output in the declared format that looks like genotype-bearing data.",
    );
  }

  if (errors.length) {
    L.push(
      "",
      "The tool's own log reported errors while it ran. This says nothing about " +
        "whether the results it did produce are correct:",
      "",
      "| What happened | Times | Affected |",
      "|---|---|---|",
    );
    for (const e of errors) {
      const items = shortItems(e.items).join(", ") || "—";
      L.push(`| ${e.title} | ${e.count} | ${items} |`);
    }
  }

  const needsTestData = (report.needed_beyond_repo ?? []).some((n) => /test data/i.test(n));
  if (needsTestData) {
    L.push(
      "",
      "## Test data",
      "",
      "No sample from the repository was used, so a public reference sample stood " +
        "in. A small test file in the repository lets a new user run the tool on " +
        "their first day and see it working before trusting it with their own " +
        "data. Publishing the output that file should produce helps just as much: " +
        "it shows what a correct run looks like, which is what a reader needs to " +
        "tell one from a run that merely finished.",
    );
  }

  if (options.includeRepoNotes && report.caveats?.items?.length) {
    L.push(
      "",
      "## Notes from reading the repository",
      "",
      "Recorded automatically from public files while working out how to run the " +
        "tool. **Not established by running anything** — please treat them as " +
        "questions, not findings:",
      "",
    );
    for (const item of report.caveats.items) L.push(`- ${item}`);
  }

  L.push(
    "",
    "---",
    "",
    "If any of this is wrong, or reflects how we configured the run rather than " +
      "the tool, tell us and we will correct the published result — " +
      `${ENGINE_REPO_URL}/issues. Re-verification is free and repeatable. ` +
      "If you would rather we did not open issues like this, say so and we will stop.",
  );

  const body = L.join("\n");
  const slugPath = repoSlug(report.source?.repo);
  const url = slugPath
    ? `https://github.com/${slugPath}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`
    : "";

  return { title, body, url, reasons };
}

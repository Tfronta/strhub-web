import type { TrialBlocker, TrialReport } from "./trial";

const ENGINE_RUNS = "https://github.com/Tfronta/strhub-verified/actions/runs";

/** GitHub's new-issue URL with the blocker's request filled in. */
export function ownerIssueUrl(report: TrialReport, blocker: TrialBlocker, trialUrl: string): string | null {
  const m = report.source.repo.match(/^https:\/\/github\.com\/([^/]+\/[^/]+?)(?:\.git)?\/?$/);
  if (!m) return null;
  const ref = report.source.ref_resolved ?? report.source.ref ?? "";
  const runId = report.ci_run?.match(/\/runs\/(\d+)/)?.[1];
  const body = [
    blocker.ask_owner.body,
    "",
    `Commit tried: \`${ref}\``,
    runId ? `Run: ${ENGINE_RUNS}/${runId}` : null,
    `Result page: ${trialUrl}`,
    "",
    "Filed by a reader of STRhub Verified, which rehearses forensic STR tools in a clean container from their public source. " +
      "The check concerns reproducible execution only and makes no claim about accuracy.",
  ].filter((l) => l !== null).join("\n");
  return `https://github.com/${m[1]}/issues/new?title=${encodeURIComponent(blocker.ask_owner.title)}&body=${encodeURIComponent(body)}`;
}

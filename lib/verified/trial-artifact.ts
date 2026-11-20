/**
 * The trial artifact, as the engine uploads it and as the web reads it.
 *
 * The engine names the files after the report's slug, which need not be the
 * run-name's: a trial from a URL is filed under the tool's catalogue slug
 * (worked out from the repository) while its artifact keeps the run's own
 * name. So the report is found first, and everything else — recipe, summary,
 * PDF, HTML, logs — is keyed off the stem it was written under.
 *
 * Two layouts exist. Until engine c485b42 the files sat at the artifact's
 * root (`hipstr.json`, `hipstr.recipe.json`, …). Since then the workflow
 * uploads `reports/` as a directory, so they sit under it
 * (`reports/hipstr.json`), next to a `run_record.json` at the root: the
 * engine's own record of every stage's command and exit status, not a
 * report. Trials of both kinds stay readable for the artifact's 30 days.
 *
 * `__fixtures__/` holds one real artifact of each layout, byte for byte as
 * GitHub served it; the test reads them through this module end to end, so
 * a change on the engine's side of the contract fails here before a deploy.
 */
import { unzipSync, strFromU8 } from "fflate";
import { LOG_LEGS, TRIAL_FILE_NAMES } from "./log-files";
import type { TrialRecipe, TrialReport, TrialStatus } from "./trial";

const COMPANION = /\.(recipe|badge)\.json$/;

export function locateReport(
  names: string[],
  slug: string,
): { reportName: string; stem: string } | null {
  const isReport = (f: string) =>
    f.endsWith(".json") &&
    !COMPANION.test(f) &&
    f !== "run_record.json" &&
    (!f.includes("/") || /^reports\/[^/]+$/.test(f));
  const preferred = [`reports/${slug}.json`, `${slug}.json`].find((n) => names.includes(n));
  const reportName = preferred ?? names.filter(isReport).sort()[0];
  if (!reportName) return null;
  return { reportName, stem: reportName.replace(/\.json$/, "") };
}

export type ParsedArtifact = Pick<TrialStatus, "report" | "recipe" | "summaryMd" | "logs" | "files"> & {
  /** Original bytes, served by /api/verify/trial/file. */
  _bin: Record<string, Uint8Array>;
};

export function artifactUrls(id: string, files: Record<string, Uint8Array>): TrialStatus["files"] {
  return Object.fromEntries(Object.keys(files).map((name) =>
    [name, `/api/verify/trial/file?id=${encodeURIComponent(id)}&name=${name}`],
  ));
}

/** Keep the existing status payload for callers that use the log tails. */
export function logTails(files: Record<string, Uint8Array>): TrialStatus["logs"] {
  return Object.fromEntries(LOG_LEGS.flatMap((leg) => {
    const log = files[`log-${leg}`];
    return log ? [[leg, strFromU8(log).slice(-20_000)]] : [];
  }));
}

/** Everything the status carries from one artifact zip, as GitHub serves it. */
export function parseArtifactZip(zip: Uint8Array, slug: string, id: string): ParsedArtifact {
  const files = unzipSync(zip);
  const text = (name: string) => (files[name] ? strFromU8(files[name]) : null);
  const located = locateReport(Object.keys(files), slug);
  const stem = located?.stem ?? slug;
  const reportText = located ? text(located.reportName) : null;
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
  };
}

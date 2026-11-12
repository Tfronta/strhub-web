/**
 * Where the report is inside a trial's artifact.
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
 */

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

/**
 * The two ways out of a trial that could not run: fix it yourself, or ask the
 * tool's owner.
 *
 * "Fix it yourself" turns the trial's recipe into the advanced form's stored
 * state (the form restores it on mount, see verified-submit-form.tsx) and
 * points at the section that needs the missing piece. Nothing is retyped: the
 * command, the environment, the input type and the outputs the engine
 * proposed are all there; the person adds the regions file, or corrects the
 * command, and the next run is a trial again, not a publication.
 *
 * "Ask the owner" is a GitHub new-issue link with the blocker's text, the
 * run and the trial page filled in. Nothing is sent: a person reads it,
 * edits it, and files it (the same rule as issue-draft.ts).
 */
import type { TrialBlocker, TrialRecipe, TrialReport, SelfFix } from "./trial";

export const FORM_STORAGE_KEY = "strhub-verified-submit-form";

const ENGINE_RUNS = "https://github.com/Tfronta/strhub-verified/actions/runs";

/** Which section of the advanced form each self-fix lands on. */
export const SELF_FIX_SECTION: Record<SelfFix, string> = {
  upload_regions: "section-inputs",
  edit_command: "section-run",
  choose_install: "section-env",
  edit_install: "section-env",
  edit_output: "section-outputs",
};

/**
 * A scalar under a two-space indent (`  cmd: …`), whether written inline,
 * quoted, or as a folded block (`cmd: >` followed by indented lines).
 */
function scalar(yml: string, key: string): string {
  const lines = yml.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(new RegExp(`^  ${key}:\\s*(.*)$`));
    if (!m) continue;
    const rest = m[1].trim();
    if (rest === ">" || rest === ">-" || rest === "|" || rest === "|-" || rest === "") {
      const parts: string[] = [];
      for (let j = i + 1; j < lines.length && /^\s{4,}\S/.test(lines[j]); j++) parts.push(lines[j].trim());
      return parts.join(" ").trim();
    }
    return rest.replace(/^(["'])(.*)\1$/, "$2").trim();
  }
  return "";
}

/** The tool's own command out of the engine's capture wrapper. */
export function innerCommand(cmd: string): string {
  const inner = cmd.match(/&&\s*\(\s*(.+?)\s*\);\s*rc=\$\?/);
  return (inner ? inner[1] : cmd).trim();
}

/**
 * The advanced form's stored state, built from what the trial ran. Field
 * names follow the form's INITIAL_F; unknown ones are ignored by the form.
 */
export function formStateFromTrial(report: TrialReport, recipe: TrialRecipe) {
  const yml = recipe.manifest_yml;
  const repo = report.source.repo;
  const ref = report.source.ref_resolved ?? report.source.ref ?? "";
  const cmd = innerCommand(scalar(yml, "cmd"));
  const inputType = scalar(yml, "type");
  const outputPath = (yml.match(/^\s*- path:\s*["']?([^"'\n]+?)["']?\s*$/m)?.[1] ?? "").trim();
  const outputFormat = (yml.match(/^\s*format:\s*["']?([^"'\n]+?)["']?\s*$/m)?.[1] ?? "tsv").trim();
  const fromRepo = /source:\s*repository/.test(yml);
  const dockerMode: "generated" | "provided" = fromRepo || recipe.dockerfile.trim().startsWith("FROM") ? "provided" : "generated";
  return {
    f: {
      name: report.tool.name ?? "",
      variant: "",
      maintainer: report.tool.maintainer ?? "",
      contact: report.tool.contact ?? "",
      repo,
      ref,
      dockerfile: dockerMode === "provided" ? recipe.dockerfile : "",
      language: "python",
      buildCmd: "",
      checkCmd: "",
      cmd,
      timeout: "20",
      inputType,
      inputTypeCustom: "",
      fixtureFilePath: "",
      fixtureRepo: "",
      fixtureRef: "",
      outputPath: outputPath || "**/*",
      outputFormat,
      minRecords: "1",
      columns: "",
      dnaColumn: "",
      countColumns: "",
      locusColumn: "",
      minDistinctLoci: "",
      expectLoci: "",
      minTotalReads: "",
    },
    // The library file the trial used, so the form opens with it selected and
    // the person can switch to another layout or upload their own.
    regionsLibrary: (yml.match(/^\s+library:\s*([a-z0-9]+)/m)?.[1] ?? ""),
    dockerMode,
    needsBuild: false,
    fixtureSource: "none" as const,
    showContent: false,
    submitterRole: "" as const,
  };
}

/** Store the state and return the URL of the section to land on. */
export function prepareSelfFix(report: TrialReport, recipe: TrialRecipe, fix: SelfFix): string {
  try {
    sessionStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formStateFromTrial(report, recipe)));
  } catch {
    /* the form still opens; it will just be empty */
  }
  return `/verified/submit/advanced?from=trial#${SELF_FIX_SECTION[fix]}`;
}

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

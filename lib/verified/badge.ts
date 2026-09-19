/**
 * The label, in words, wherever a run is shown: the catalogue card, a
 * history row, the report's header. One rule, so the three never disagree,
 * and the same rule the engine's badge, copies and certificate follow
 * (harness/certificate_text.py::headline):
 *
 *   Runs as documented                          the documented run produced its output
 *   Runs as documented (errors reported)        … and the tool's log reported errors
 *   Does not run as documented · stops at run   the documented run did not, and where
 *   Could not be determined                     nobody knew how to attempt it (the README)
 *   Out of scope                                the free runner cannot provide something
 *   Not verified as documented                  the run is of a recipe STRhub wrote
 *
 * What the tool does AS IT IS in its repository is the label; the rung it
 * reached is a detail under it, in the ladder. A rung as the label read as a
 * result ("Installs" on a run that then failed), and a green from a recipe
 * STRhub wrote read as the tool's own — which would make every first-time
 * user repeat STRhub's work to find out.
 */
import { VERIFIED_LEVELS, type VerifiedInstrument, type VerifiedLevel, type VerifiedVerdictCode } from "@/types/verified";

export type BadgeTone = "green" | "amber" | "red" | "grey";

export interface BadgeDisplay {
  label: string;
  tone: BadgeTone;
}

export const TONE: Record<BadgeTone, string> = {
  green: "bg-teal-600 text-white border-transparent",
  amber: "bg-amber-500 text-white border-transparent",
  red: "bg-red-600 text-white border-transparent",
  grey: "bg-slate-500 text-white border-transparent",
};

/** The verdict's own colours, on the trial page and the published one alike. */
export const VERDICT_TONE: Record<VerifiedVerdictCode, string> = {
  runs: "bg-teal-600 text-white",
  fails: "bg-red-600 text-white",
  undetermined: "bg-slate-500 text-white",
  out_of_scope: "bg-slate-500 text-white",
};

export interface BadgeInput {
  level: VerifiedLevel;
  verdict?: string | null;
  errors_reported?: boolean;
  instrument?: VerifiedInstrument | null;
}

type Translate = (key: string, params?: Record<string, string>) => string;

export function badgeFor(run: BadgeInput, t: Translate): BadgeDisplay {
  if (run.instrument === "curated") return { label: t("verified.headline.notDocumented"), tone: "grey" };
  if (run.verdict === "undetermined") return { label: t("verified.headline.undetermined"), tone: "grey" };
  if (run.verdict === "out_of_scope") return { label: t("verified.headline.outOfScope"), tone: "grey" };
  // A report from before the verdict is read off the rung.
  const runs = run.verdict ? run.verdict === "runs" : run.level === "io" || run.level === "content";
  if (runs) {
    return run.errors_reported
      ? { label: t("verified.headline.runsErrors"), tone: "amber" }
      : { label: t("verified.headline.runs"), tone: "green" };
  }
  return { label: t("verified.headline.notRun", { where: t(`verified.headline.stopsAt.${run.level}`) }), tone: "red" };
}

/** The rung reached, for the line under the label. */
export function reachedLabel(level: VerifiedLevel): string {
  return (VERIFIED_LEVELS[level] ?? VERIFIED_LEVELS.none).label;
}

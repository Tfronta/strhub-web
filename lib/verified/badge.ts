/**
 * What the badge says for one run, wherever a run is shown: the catalogue
 * card, a history row, the report's header. One rule, so the three never
 * disagree, and the same rule the engine's shields badge follows
 * (harness/report.py):
 *
 *   the verdict first — "could not be determined" is neither a pass nor a
 *   failure and must not read as the rung the run happened to reach;
 *   then a green qualified by the errors the tool reported;
 *   then, on request, a run of STRhub's own recipe marked as such, so its
 *   result never reads as the tool's own.
 */
import { VERIFIED_LEVELS, type VerifiedInstrument, type VerifiedLevel, type VerifiedVerdictCode } from "@/types/verified";
import { errorAwareLevel } from "./diagnostics";

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

export function badgeFor(
  run: BadgeInput,
  t: (key: string) => string,
  options: { markCurated?: boolean } = {},
): BadgeDisplay {
  let out: BadgeDisplay;
  if (run.verdict === "undetermined") {
    out = { label: t("verified.trial.verdict.undetermined"), tone: "grey" };
  } else if (run.verdict === "out_of_scope") {
    out = { label: t("verified.trial.verdict.out_of_scope"), tone: "grey" };
  } else {
    out = errorAwareLevel(
      VERIFIED_LEVELS[run.level] ?? VERIFIED_LEVELS.none,
      !!run.errors_reported,
      t("verified.errorsBadgeSuffix"),
    );
  }
  if (options.markCurated && run.instrument === "curated") {
    out = { ...out, label: `${out.label} · ${t("verified.instrument.badgeSuffix")}` };
  }
  return out;
}

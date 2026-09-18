/**
 * Which instrument a run is, and what may rest on it.
 *
 * The badge claims "installs and runs from its public source at the pinned
 * commit". Only a run of the repository's own instructions, or of a recipe
 * its maintainer handed in, can hold that up; a recipe STRhub wrote by hand
 * shows how far the tool can be MADE to run, which is a different fact, and
 * is shown as a note under the documented result — never as the badge. The
 * engine's docs/PLAN-Documented-Is-The-Badge.md; the rules here mirror
 * harness/certificate_text.py and harness/publish_layout.py, kept in step.
 */
import type { VerifiedInstrument, VerifiedReport } from "@/types/verified";

export const BADGE_INSTRUMENTS: readonly VerifiedInstrument[] = ["documented", "maintainer"];

/**
 * Whether a run of this instrument may stand behind the badge. An instrument
 * the index did not record (from before the engine told them apart) counts
 * as one that may: the page claims only what it was told.
 */
export function mayStandBehindBadge(instrument: VerifiedInstrument | null | undefined): boolean {
  return instrument !== "curated";
}

/**
 * The instrument of a report, as the engine reads it: the recorded one; else
 * derived — a recipe proposed from the repository is the documented one, a
 * maintainer's submission is theirs, and anything else was written by hand
 * to fill the catalogue. Mirrors certificate_text.instrument_of_report.
 */
export function instrumentOfReport(report: VerifiedReport): VerifiedInstrument {
  if (report.instrument) return report.instrument;
  const origin = report.recipe?.origin;
  if (origin === "proposed") return "documented";
  if (origin === "maintainer" || origin === "curated") return origin;
  if (report.caveats?.source === "detect_recipe") return "documented";
  if (report.submission?.by === "maintainer") return "maintainer";
  return "curated";
}

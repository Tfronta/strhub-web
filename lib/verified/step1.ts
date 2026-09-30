/**
 * Step 1, the documented run, in the reader's language.
 *
 * The engine decides which of the four things happened and writes it into the
 * report (harness/certificate_text.py::step1_says); this only says it in es,
 * en or pt. The wording is fixed in the engine's docs/PLAN-Paso-1.md, and two
 * rules survive translation:
 *
 *   - no sentence says the tool does not work, because no run established
 *     that. `does_not_run` says a third party following the README did not
 *     reach the end, and invites a fix;
 *   - `ours` is a limitation of STRhub's reference data or of its own reader.
 *     It is never rendered as the tool failing, and it asks nothing of the
 *     author's README.
 *
 * A report written before the engine carried `step1` returns null, and the
 * page shows the verdict alone rather than inventing a sentence for it.
 */
import type { VerifiedStep1, VerifiedStep1Block } from "@/types/verified";

export type Step1Tone = "green" | "red" | "grey";

export interface Step1Display {
  code: VerifiedStep1["code"];
  headline: string;
  body: string;
  /** The guide's blocks, named in the reader's language. Empty unless the gap is the commit's. */
  missing: string[];
  missingTitle: string;
  guideHref: string;
  guideLabel: string;
  tone: Step1Tone;
}

const TONE: Record<VerifiedStep1["code"], Step1Tone> = {
  runs: "green",
  does_not_run: "red",
  cannot_tell: "grey",
  ours: "grey",
  none: "grey",
};

/** The guide lives in the engine repository, which is public. */
export const GUIDE_URL =
  "https://github.com/Validacion-Softwares-NGS/strhub-verified/blob/main/docs/GUIA-PASO-1.md";

type Translate = (key: string, params?: Record<string, string>) => string;

export function step1For(step1: VerifiedStep1 | null | undefined, t: Translate): Step1Display | null {
  if (!step1?.code || step1.code === "none") return null;
  const blocks: VerifiedStep1Block[] = step1.missing ?? [];
  return {
    code: step1.code,
    headline: t(`verified.trial.step1.headline.${step1.code}`),
    body: t(`verified.trial.step1.body.${step1.code}`),
    missing: blocks.map((b) => t(`verified.trial.step1.blocks.${b}`)),
    missingTitle: t("verified.trial.step1.missingTitle"),
    guideHref: GUIDE_URL,
    guideLabel: t("verified.trial.step1.guideLink"),
    tone: TONE[step1.code],
  };
}

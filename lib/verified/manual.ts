/**
 * STRhub Verified level 2 — manual verification, the paid human-run tier.
 *
 * The design constraint this file exists to hold: **the web never decides who
 * qualifies.** `harness/diagnose_log.py` stamps `manual_verification` onto the
 * report from the run's own evidence, and everything here only reads it. So the
 * offer cannot be granted by hand, cannot appear on a run that produced its
 * expected output, and every instance of it is auditable against a public CI run
 * plus a reason code.
 *
 * The one thing that is deliberately NOT a trigger is an author struggling with
 * the submission form. That is our UX to fix, handled free on the contact
 * channel; charging for it would mean profiting from our own friction.
 *
 * Two ways in, both objective:
 *   - `declared`  — the author ticked a pre-flight box stating a property of the
 *                   tool the free runner cannot provide (trigger A).
 *   - `detected`  — the execution log proves we hit one of those ceilings (B).
 */
import type { VerifiedManualVerification, VerifiedReport } from "@/types/verified";

/**
 * The pre-flight questions (trigger A). Each is a factual property of the tool
 * that the free automated environment structurally cannot provide — a public
 * runner is headless, CPU-only, and memory/disk capped, and an attestation is a
 * pinned snapshot, so nothing may be fetched at run time.
 *
 * Mirrors `compatibility` in the engine's schema/manifest.schema.json. Keep in
 * step with that file; it is the source of truth for what the manifest accepts.
 */
export const COMPATIBILITY_FLAGS = [
  "requires_gui",
  "requires_gpu",
  "requires_runtime_network",
  "requires_licensed_reference",
  "requires_unsupported_os",
  "opaque_output_format",
] as const;

export type CompatibilityFlag = (typeof COMPATIBILITY_FLAGS)[number];

/** The pre-flight answers, as the form collects them. */
export type CompatibilityAnswers = Partial<Record<CompatibilityFlag, boolean>>;

/** The flags the author ticked, in declaration order. */
export function declaredIncompatibilities(
  answers: CompatibilityAnswers | undefined,
): CompatibilityFlag[] {
  if (!answers) return [];
  return COMPATIBILITY_FLAGS.filter((flag) => answers[flag]);
}

/**
 * True when the pre-flight already rules out the automated path, so the form can
 * route to the manual request instead of spending a CI run to learn the same
 * thing. A GUI tool should not have to fail a build to be told the runner is
 * headless.
 */
export function preflightBlocksAutoRun(
  answers: CompatibilityAnswers | undefined,
): boolean {
  return declaredIncompatibilities(answers).length > 0;
}

/** Whether a string is one of the pre-flight flags (validates a URL parameter). */
export function isCompatibilityFlag(value: string): value is CompatibilityFlag {
  return (COMPATIBILITY_FLAGS as readonly string[]).includes(value);
}

/**
 * The eligibility record for a declared incompatibility, built without a run.
 *
 * The pre-flight exists precisely so a tool that cannot run does not have to
 * burn a CI run proving it, which means this path has no report to read a verdict
 * from — the author's declaration is the evidence. That is sound here in a way it
 * would not be for a free benefit: the only thing on the other side of this door
 * is an invoice, so there is nothing to gain by overstating the tool's needs. The
 * property we actually care about holds either way — STRhub is not the one
 * choosing who qualifies.
 *
 * `reason` is left null: the human wording lives in i18n, keyed off the code.
 */
export function declaredManualRecord(
  flag: CompatibilityFlag,
): VerifiedManualVerification {
  return {
    eligible: true,
    basis: "declared",
    reason_code: `declared_incompat:${flag}`,
    reason: null,
  };
}

/** The bare cause id from a reason code: "detected_incompat:oom" -> "oom". */
export function reasonCodeId(code: string | null | undefined): string | null {
  if (!code) return null;
  const id = code.includes(":") ? code.slice(code.indexOf(":") + 1) : code;
  return id || null;
}

/**
 * i18n key for a reason code's explanation. Reason ids are shared between the
 * declared and detected paths (`requires_gpu` reads the same either way), so one
 * set of strings covers both. Callers should fall back to the engine's English
 * `reason` when the key is missing, so a new engine rule degrades to plain text
 * rather than rendering a raw key.
 */
export function reasonI18nKey(code: string | null | undefined): string | null {
  const id = reasonCodeId(code);
  return id ? `verified.manual.reasons.${id}` : null;
}

/** Whether this report carries a level-2 offer. Pure read of the engine verdict. */
export function isManualEligible(
  report: Pick<VerifiedReport, "manual_verification"> | null | undefined,
): boolean {
  return Boolean(report?.manual_verification?.eligible);
}

/**
 * Build the prefilled contact request for a level-2 enquiry.
 *
 * The reason code travels with the message so the request arrives already
 * carrying the machine's justification: neither side has to argue about whether
 * the tool qualified, and the CI run backing it is one click away.
 */
export function manualRequestMailto({
  email,
  slug,
  toolName,
  manual,
  ciRun,
  reportUrl,
  subjectLabel,
  bodyIntro,
}: {
  email: string;
  slug: string;
  toolName: string;
  manual: VerifiedManualVerification;
  ciRun?: string;
  reportUrl?: string;
  subjectLabel: string;
  bodyIntro: string;
}): string {
  // The pre-flight path has no attestation yet, so tool/slug/report lines are
  // omitted rather than sent empty — the reason code alone identifies the case.
  const subject = slug ? `${subjectLabel}: ${toolName} (${slug})` : subjectLabel;
  const body = [
    bodyIntro,
    "",
    toolName ? `Tool: ${toolName}` : "",
    slug ? `Attestation: ${slug}` : "",
    `Reason code: ${manual.reason_code ?? "-"} (${manual.basis ?? "-"})`,
    manual.reason ? `Reason: ${manual.reason}` : "",
    slug && reportUrl ? `Report: ${reportUrl}` : "",
    ciRun ? `CI run: ${ciRun}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  return `mailto:${email}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
}

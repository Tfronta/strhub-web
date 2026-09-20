/**
 * The certificate's words for a report that predates the engine writing
 * them. Mirrors harness/certificate_text.py; keep the two in step. A report
 * that carries `certificate` is printed as it is; only the conclusion, which
 * is derived per run, has no fallback and is simply not shown.
 */
import type { VerifiedCertificate, VerifiedReport } from "@/types/verified";
import { VERIFIED_LEVELS } from "@/types/verified";

export const PURPOSE = "Verify that the tool installs, runs end-to-end, and produces structurally valid output.";
export const EXEC_SCOPE = "Installation, execution, and output structure verification.";
export const NOT_EVALUATED = ["Genotype accuracy", "Concordance", "Forensic validity", "Regulatory compliance"];
export const SCOPE_STATEMENT =
  "Independent automated verification of reproducible execution. It confirms the tool installs, runs end-to-end, and produces structurally valid output in a standardized environment.";
export const SCOPE_NOT =
  "This is not an analytical validation. Genotype accuracy, concordance, forensic suitability, and regulatory compliance are out of scope.";
export const DISCLAIMER =
  "Each result is a dated snapshot, verified on the tool's public repository at a pinned commit. STRhub does not store tool source code.";
export const OUT_OF_SCOPE = [
  "Genotype correctness or accuracy",
  "Concordance against known truth sets",
  "Sensitivity, specificity, or stutter performance",
  "Allele calling accuracy or forensic casework suitability",
  "Regulatory compliance or ISO accreditation",
  "Multi-laboratory or multi-dataset reproducibility",
];
export const LIMITATIONS = [
  "Single reference dataset per input type",
  "Single containerized environment (Docker / ubuntu-22.04)",
  "No truth-set comparison or ground-truth genotypes",
  "No accuracy or concordance assessment",
  "No forensic validation of results",
  "Short-read limitations apply (very long STR alleles may not span reads)",
];

const GATES = ["available", "installs", "runs", "io", "content"] as const;

/** The block the report carries, or the same texts assembled for an older one. */
export function certificateOf(report: VerifiedReport, label: string): VerifiedCertificate {
  if (report.certificate?.schema) return report.certificate;
  const reached = (VERIFIED_LEVELS[report.level] ?? VERIFIED_LEVELS.none).label;
  const passed = GATES.filter((g) => report.gates?.[g]).length;
  return {
    schema: "strhub-verified/certificate/fallback",
    label,
    reached,
    summary: {
      purpose: PURPOSE,
      result: label,
      reached: `${reached}, ${passed}/${GATES.length} gates passed`,
      ...(report.verdict?.reason ? { why: report.verdict.reason } : {}),
      scope: EXEC_SCOPE,
      not_evaluated: NOT_EVALUATED,
    },
    conclusion: [],
    out_of_scope: OUT_OF_SCOPE,
    limitations: LIMITATIONS,
    scope: { statement: SCOPE_STATEMENT, not: SCOPE_NOT, disclaimer: DISCLAIMER },
  };
}

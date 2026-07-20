/**
 * Reviewer-facing shaping of the execution-log diagnostics for the web report.
 *
 * The static PDF/HTML/markdown already do this in the harness (diagnose_log.py);
 * this is the same shaping in TS so the web detail page matches. It reads the
 * `count` and `examples` the harness now stores on each diagnostic — no new data,
 * only presentation. Keep in step with harness/diagnose_log.py.
 */
import type { VerifiedDiagnostic } from "@/types/verified";

export interface ErrorSummary {
  id: string;
  /** Short clause for the "what happened" column. */
  title: string;
  count: number;
  /** The distinguishing tokens, e.g. the loci whose files failed to open. */
  items: string[];
}

/** Longest suffix shared by every string. */
function commonSuffix(values: string[]): string {
  if (values.length < 2) return "";
  const first = values[0];
  for (let i = 0; i < first.length; i++) {
    const suffix = first.slice(i);
    if (values.every((v) => v.endsWith(suffix))) return suffix;
  }
  return "";
}

/**
 * Reduce captured paths to the part that varies between them:
 *   /data/out/IntersectMappedReads/vWA_input.bam_alignment.sorted.bam -> vWA
 * Pure string work: basename, then drop the suffix every example shares. Falls
 * back to plain basenames when they share none.
 */
export function shortItems(examples: string[] | undefined): string[] {
  if (!examples || examples.length === 0) return [];
  let bases = examples.map((e) => e.split("/").pop() || e);
  const suffix = commonSuffix(bases);
  if (suffix) {
    const trimmed = bases.map((b) => b.slice(0, b.length - suffix.length));
    if (trimmed.every((t) => t.trim())) bases = trimmed;
  }
  return [...new Set(bases)].sort();
}

/**
 * Flatten both legs' error-severity diagnostics into one review list. Both legs
 * run the same tool, so the same fault appears twice; merged once with the wider
 * evidence. Warnings are excluded (normal tool chatter).
 */
export function summarizeErrors(
  diagnostics: Record<string, VerifiedDiagnostic[]> | undefined,
): ErrorSummary[] {
  if (!diagnostics) return [];
  const merged = new Map<string, ErrorSummary & { examples: string[] }>();
  for (const issues of Object.values(diagnostics)) {
    for (const issue of issues) {
      if (issue.severity !== "error") continue;
      const entry =
        merged.get(issue.id) ??
        merged
          .set(issue.id, {
            id: issue.id,
            title: issue.title,
            count: 0,
            items: [],
            examples: [],
          })
          .get(issue.id)!;
      entry.count += issue.count ?? 1;
      for (const ex of issue.examples ?? []) {
        if (!entry.examples.includes(ex)) entry.examples.push(ex);
      }
    }
  }
  return [...merged.values()].map((e) => ({
    id: e.id,
    title: e.title,
    count: e.count,
    items: shortItems(e.examples),
  }));
}

/** True when the STRhub reference leg reported errors: those may reflect the
 *  slice's coverage rather than the tool, so the report adds context. */
export function externalLegHasErrors(
  diagnostics: Record<string, VerifiedDiagnostic[]> | undefined,
): boolean {
  return (diagnostics?.external ?? []).some((i) => i.severity === "error");
}

/** Any error-severity diagnostic on any leg. */
export function hasReportedErrors(
  diagnostics: Record<string, VerifiedDiagnostic[]> | undefined,
): boolean {
  if (!diagnostics) return false;
  return Object.values(diagnostics).some((issues) =>
    issues.some((i) => i.severity === "error"),
  );
}

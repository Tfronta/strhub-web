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

/**
 * Which sentence names the side a failed build falls on.
 *
 * Ours wins over every other, and is said plainly: a reader who has just been
 * told a tool did not build will otherwise take that as a fact about the
 * software, and the only thing worse than no explanation is a wrong one. Mirrors
 * harness/diagnose_log.py::install_fault_sentence — keep the two in step.
 */
export function installFaultKey(faults: string[] | undefined): string {
  if (faults?.includes("strhub")) return "verified.install.faultStrhub";
  if (faults?.includes("harness")) return "verified.install.faultHarness";
  if (faults?.includes("author")) return "verified.install.faultAuthor";
  return "verified.install.faultUnknown";
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

// Error classes a coverage-limited reference slice could plausibly cause (too few
// reads to call, a BAM STRhub's own slicing left short); we hedge on these.
const SAMPLE_ATTRIBUTABLE = new Set([
  "zero_genotyped",
  "bad_bam",
  "no_read_groups",
]);

// Structural failures — read depth cannot make a file fail to open, a flag be
// unrecognized, or a build be incomplete — so the slice is not to blame and we
// say so. Ids in neither set are ambiguous and get no note. Keep in step with
// harness/diagnose_log.py.
const STRUCTURAL = new Set([
  "cannot_open",
  "bad_option",
  "vcf_gz_required",
  "cmd_not_found",
  "missing_module",
  "import_error",
]);

/**
 * Which slice-context notes the external leg's errors warrant, in render order.
 * Whether an error reflects STRhub's slice depends on its KIND: a coverage-limited
 * sample yields fewer reads but cannot make a file fail to open. So we hedge only
 * on sample-attributable errors, state plainly that structural ones are not ours,
 * and close with the demo-data ask when either applies. Mirror of
 * harness/diagnose_log.py `external_leg_notes`.
 */
export type ExternalLegNoteKey =
  | "sliceCaveat"
  | "structuralNote"
  | "demoDataRecommendation";

export function externalLegNoteKeys(
  diagnostics: Record<string, VerifiedDiagnostic[]> | undefined,
): ExternalLegNoteKey[] {
  const errorIds = new Set(
    (diagnostics?.external ?? [])
      .filter((i) => i.severity === "error")
      .map((i) => i.id),
  );
  if (errorIds.size === 0) return [];

  const keys: ExternalLegNoteKey[] = [];
  if ([...errorIds].some((id) => SAMPLE_ATTRIBUTABLE.has(id))) {
    keys.push("sliceCaveat");
  }
  if ([...errorIds].some((id) => STRUCTURAL.has(id))) {
    keys.push("structuralNote");
  }
  if (keys.length > 0) keys.push("demoDataRecommendation");
  return keys;
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

/**
 * Qualify a level for display when the run reported errors: a green level with
 * errors becomes amber and gains a suffix, so a partial-output run never reads as
 * clean. Shared by the catalogue cards and the detail page so they never disagree.
 */
export function errorAwareLevel(
  base: { label: string; tone: "green" | "amber" | "red" },
  hadErrors: boolean,
  suffix: string,
): { label: string; tone: "green" | "amber" | "red" } {
  if (hadErrors && base.tone === "green") {
    return { label: `${base.label} ${suffix}`, tone: "amber" };
  }
  return base;
}

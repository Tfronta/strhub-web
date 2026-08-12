/**
 * Types for the STRhub Verified attestations consumed by the read-only dashboard.
 *
 * Source of truth is the strhub-verified engine, which publishes static JSON to
 * its `gh-pages` branch:
 *   - index.json        → VerifiedIndex (compact catalogue, one entry per tool)
 *   - <slug>.json        → VerifiedReport (full attestation)
 *
 * The dashboard only READS these files; it never stores tool source code.
 */

export type VerifiedLevel =
  | "none"
  | "available"
  | "installs"
  | "runs"
  | "io"
  | "content";

/** Compact state of a verification matrix leg in index.json. */
export type LegState = "pass" | "fail" | "na" | null;

/** One row in index.json — enough to render a card without fetching the report. */
export interface VerifiedIndexEntry {
  slug: string;
  name: string;
  level: VerifiedLevel;
  label: string;
  /** The run reported error-severity diagnostics (absent on older reports). */
  errors_reported?: boolean;
  generated: string | null;
  source_repo: string | null;
  source_ref: string | null;
  ci_run: string | null;
  distinct_str_loci: number | null;
  distinct_snp_markers: number | null;
  total_reads: number | null;
  // Fase 3: matrix + advisory README summary (absent on older reports).
  own_state?: LegState;
  external_state?: LegState;
  readme_score?: number | null;
  readme_max?: number | null;
  // Input dataset types across all legs (e.g. ["illumina-bam-hg38-y"]).
  dataset_types?: string[] | null;
  report: string;
  page: string;
}

export interface VerifiedIndex {
  schema: string;
  generated: string;
  count: number;
  tools: VerifiedIndexEntry[];
}

export interface VerifiedContentStats {
  rows?: number;
  malformed_rows?: number;
  distinct_loci?: number;
  distinct_str_loci?: number;
  distinct_snp_markers?: number;
  str_loci?: string[];
  snp_markers?: string[];
  total_reads?: number;
  max_sequence_depth?: number;
  top_loci_by_depth?: [string, number][];
}

/** A leg of the verification matrix (own data / external dataset). */
export interface VerifiedMatrixLeg {
  leg: "own" | "external" | string;
  label: string;
  available: boolean;
  io?: boolean;
  content?: boolean;
  passed?: boolean;
  type?: string | null;
  dataset?: string | null;
  fixture_source?: "tool" | "strhub" | null;
}

/** The advisory README "minimum-to-run" check. Never gates the badge. */
export interface VerifiedReadmeCheck {
  gate: "readme";
  advisory: true;
  score: number;
  max: number;
  empty?: boolean;
  checks: Record<string, { present: boolean; matched?: string | null }>;
}

/** How a run became eligible for manual (level 2) verification. */
export type ManualBasis = "declared" | "detected";

/**
 * The engine's verdict on whether this run may be offered manual verification.
 *
 * Level 2 is paid and human-run, so eligibility is never a judgement the web
 * makes: `harness/diagnose_log.py` decides it mechanically from the run's own
 * evidence and stamps a reason code here. The UI only reads it. A report with
 * this field absent predates the check; `eligible: false` means it was checked
 * and did not qualify.
 */
export interface VerifiedManualVerification {
  eligible: boolean;
  basis: ManualBasis | null;
  /** e.g. "declared_incompat:requires_gpu" or "detected_incompat:oom". */
  reason_code: string | null;
  reason: string | null;
}

export interface VerifiedReport {
  schema: string;
  tool: { name: string; version?: string; maintainer?: string; contact?: string };
  source: { repo: string; ref?: string; ref_resolved?: string };
  environment: { dockerfile?: string; os?: string[] };
  generated: string;
  ci_run?: string;
  gates: Record<VerifiedLevel, boolean>;
  level: VerifiedLevel;
  io_detail?: unknown;
  content_detail?: { outputs?: { stats?: VerifiedContentStats }[] };
  logs?: Record<string, string>;
  diagnostics?: Record<string, VerifiedDiagnostic[]>;
  // Fase 3 additions (optional for backward compatibility with older reports).
  datasets?: VerifiedMatrixLeg[];
  readme_check?: VerifiedReadmeCheck | null;
  /** Level-2 eligibility. Absent on reports generated before the check existed. */
  manual_verification?: VerifiedManualVerification | null;
  scope: string;
}

export interface VerifiedDiagnostic {
  id: string;
  severity: "error" | "warning" | "info";
  title: string;
  suggestion?: string;
  /** How many log lines matched this rule (the scale of the failure). */
  count?: number;
  /** Distinct captured values, e.g. the per-locus files that failed to open. */
  examples?: string[];
}

/** Per-level presentation: human label + a Tailwind-friendly tone. */
export const VERIFIED_LEVELS: Record<
  VerifiedLevel,
  { label: string; tone: "green" | "amber" | "red" }
> = {
  content: { label: "Runs + Plausible output", tone: "green" },
  io: { label: "Runs + Expected IO", tone: "green" },
  runs: { label: "Runs", tone: "green" },
  installs: { label: "Installs", tone: "amber" },
  available: { label: "Available", tone: "amber" },
  none: { label: "Not run", tone: "red" },
};

/**
 * A gate is one check; a level is how far the run got. They are different things
 * and now read as different things.
 *
 * The gate rows used to borrow the LEVEL labels, so the last check appeared as
 * "Runs + Plausible output" on the site while the PDF called the same check
 * "Output Structure Validation". A reviewer can have both open at once, and two
 * names for one thing is two things. Short names here; the cumulative label stays
 * on the badge, where the accumulation is the point. Keep in step with
 * GATE_DISPLAY in harness/generate_pdf.py.
 */
export const VERIFIED_GATES: {
  key: VerifiedLevel;
  label: string;
  meaningKey: string;
}[] = [
  { key: "available", label: "Available", meaningKey: "verified.gate.available" },
  { key: "installs", label: "Installs", meaningKey: "verified.gate.installs" },
  { key: "runs", label: "Runs", meaningKey: "verified.gate.runs" },
  { key: "io", label: "Expected IO", meaningKey: "verified.gate.io" },
  { key: "content", label: "Plausible Output", meaningKey: "verified.gate.content" },
];

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

/** One row in index.json — enough to render a card without fetching the report. */
export interface VerifiedIndexEntry {
  slug: string;
  name: string;
  level: VerifiedLevel;
  label: string;
  generated: string | null;
  source_repo: string | null;
  source_ref: string | null;
  ci_run: string | null;
  distinct_str_loci: number | null;
  distinct_snp_markers: number | null;
  total_reads: number | null;
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
  scope: string;
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

export const VERIFIED_GATES: { key: VerifiedLevel; meaningKey: string }[] = [
  { key: "available", meaningKey: "verified.gate.available" },
  { key: "installs", meaningKey: "verified.gate.installs" },
  { key: "runs", meaningKey: "verified.gate.runs" },
  { key: "io", meaningKey: "verified.gate.io" },
  { key: "content", meaningKey: "verified.gate.content" },
];

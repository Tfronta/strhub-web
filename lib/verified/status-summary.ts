/**
 * Pure classification, sorting, and filtering rules for STRhub Verified's
 * 2-line Automatic vs Manual status tags across the catalogue, submit notice,
 * and report headers.
 */
import type { VerifiedInstrument, VerifiedLevel } from "@/types/verified";

export const LEVEL_RANK: Record<VerifiedLevel, number> = {
  none: 0,
  available: 1,
  installs: 2,
  runs: 3,
  io: 4,
  content: 5,
};

export interface StatusRowInput {
  level: VerifiedLevel;
  verdict?: string | null;
  errors_reported?: boolean;
  instrument?: VerifiedInstrument | null;
}

export type AutoStatusKind =
  | "pass"
  | "pass_errors"
  | "fail"
  | "undetermined"
  | "out_of_scope"
  | "none";

export type ManualStatusKind = "pass" | "pass_errors" | "fail";

export interface AutoStatusSummary {
  kind: AutoStatusKind;
  gatesPassed: number;
}

export interface ManualStatusSummary {
  kind: ManualStatusKind;
  gatesPassed: number;
}

export type CatalogFilter =
  | "all"
  | "verified"
  | "auto"
  | "manual"
  | "fail"
  | "undetermined";

function isPassingRun(row: StatusRowInput): boolean {
  if (row.verdict) return row.verdict === "runs";
  return row.level === "io" || row.level === "content";
}

export function classifyAuto(
  row: StatusRowInput | null | undefined,
): AutoStatusSummary {
  if (!row || row.instrument === "curated") {
    return { kind: "none", gatesPassed: 0 };
  }
  const gatesPassed = LEVEL_RANK[row.level] ?? 0;
  if (row.verdict === "undetermined") {
    return { kind: "undetermined", gatesPassed };
  }
  if (row.verdict === "out_of_scope") {
    return { kind: "out_of_scope", gatesPassed };
  }
  if (isPassingRun(row)) {
    return {
      kind: row.errors_reported ? "pass_errors" : "pass",
      gatesPassed,
    };
  }
  return { kind: "fail", gatesPassed };
}

export function classifyManual(
  row: StatusRowInput | null | undefined,
): ManualStatusSummary | null {
  if (!row) return null;
  const gatesPassed = LEVEL_RANK[row.level] ?? 0;
  if (isPassingRun(row)) {
    return {
      kind: row.errors_reported ? "pass_errors" : "pass",
      gatesPassed,
    };
  }
  return { kind: "fail", gatesPassed };
}

/**
 * Smart catalogue ordering:
 *   1. Automatic pass (clean before errors, higher gates first)
 *   2. Manual verified pass (actionable guide available)
 *   3. Automatic fail (reproducible build/run failure)
 *   4. Undetermined / out of scope / unverified without a manual pass
 */
export function rankToolGroup(
  autoRow: StatusRowInput | null | undefined,
  manualRow: StatusRowInput | null | undefined,
): number {
  const auto = classifyAuto(autoRow);
  const manual = classifyManual(manualRow);

  if (auto.kind === "pass") return 400 + auto.gatesPassed;
  if (auto.kind === "pass_errors") return 390 + auto.gatesPassed;
  if (manual?.kind === "pass") return 300 + manual.gatesPassed;
  if (manual?.kind === "pass_errors") return 290 + manual.gatesPassed;
  if (auto.kind === "fail") return 200 + auto.gatesPassed;
  return 100 + auto.gatesPassed;
}

export function matchesCatalogFilter(
  filter: CatalogFilter,
  autoRow: StatusRowInput | null | undefined,
  manualRow: StatusRowInput | null | undefined,
): boolean {
  if (filter === "all") return true;
  const auto = classifyAuto(autoRow);
  const manual = classifyManual(manualRow);
  const autoPassed = auto.kind === "pass" || auto.kind === "pass_errors";
  const manualPassed =
    manual?.kind === "pass" || manual?.kind === "pass_errors";

  switch (filter) {
    case "verified":
      return autoPassed || manualPassed;
    case "auto":
      return autoPassed;
    case "manual":
      return manual !== null;
    case "fail":
      return auto.kind === "fail";
    case "undetermined":
      return (
        (auto.kind === "undetermined" ||
          auto.kind === "out_of_scope" ||
          auto.kind === "none") &&
        !manualPassed
      );
  }
}

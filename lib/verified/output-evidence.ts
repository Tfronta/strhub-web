/**
 * What the output section can say, worked out from the report alone.
 *
 * Pure so it can be tested without a DOM: the numbers here are claims about a
 * tool's output ("21 of 24 panel loci called; D21S11, D2S1338 and SE33 were
 * not"), and a claim the page derives has to be held to the same standard as
 * one the engine wrote.
 */
import type { VerifiedContentStats, VerifiedIoOutput } from "@/types/verified";

/** "PentaD", "Penta D" and "PENTA_D" are one locus. */
export function normaliseLocus(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export interface PanelCoverage {
  given: number;
  hit: number;
  /** The panel loci the output does not name — only when the page can be sure. */
  notCalled: string[];
}

/**
 * How much of the regions file the output covers.
 *
 * The counts are the engine's (`regions_given` / `regions_hit`). The names are
 * the page's, and it names loci only when the regions file was STRhub's own
 * panel — the counts then agree with the panel list and the difference is
 * exactly the loci that were not called. A BED the submitter supplied could
 * name loci the panel does not, and the page would be guessing; it says the
 * numbers and no more.
 */
export function panelCoverage(
  stats: VerifiedContentStats | undefined,
  panelLoci: string[] | undefined,
): PanelCoverage | null {
  const given = stats?.regions_given;
  const hit = stats?.regions_hit;
  if (typeof given !== "number" || typeof hit !== "number" || given <= 0) return null;
  let notCalled: string[] = [];
  if (panelLoci && panelLoci.length === given) {
    const called = new Set((stats?.loci ?? stats?.str_loci ?? []).map(normaliseLocus));
    const missing = panelLoci.filter((l) => !called.has(normaliseLocus(l)));
    if (missing.length === given - hit) notCalled = missing;
  }
  return { given, hit, notCalled };
}

export interface IoCheck {
  key: string;
  passed: boolean;
  /** For `parses_as_<format>`: the format, upper-cased, so the label can name it. */
  format?: string;
}

/** The Expected IO gate's checks, in the order they were run. */
export function ioChecks(io: VerifiedIoOutput | undefined): IoCheck[] {
  if (!io?.checks) return [];
  return Object.entries(io.checks).map(([key, passed]) => {
    const m = key.match(/^parses_as_(.+)$/);
    return m ? { key: "parses", passed, format: m[1].toUpperCase() } : { key, passed };
  });
}

export interface DepthRow {
  locus: string;
  depth: number;
  /** 0–1, against the deepest locus. */
  share: number;
}

/** Loci by read depth, deepest first, each with its share of the deepest. */
export function depthRows(stats: VerifiedContentStats | undefined): DepthRow[] {
  const top = stats?.top_loci_by_depth ?? [];
  const max = Math.max(1, ...top.map(([, d]) => d));
  return top.map(([locus, depth]) => ({ locus, depth, share: depth / max }));
}

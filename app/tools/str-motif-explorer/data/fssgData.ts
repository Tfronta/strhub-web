// FSSG-derived motif data for the STR Motif Explorer.
//
// Source: FSSG v6.1 (STRidER; distributed as FSSG_v6-1_beta.xlsx), sheet
// "Common Locus Information". FSSG_SOURCE (lib/fssgSource.ts) holds the access
// date and hash.
// Extracted per marker: the ISFG minimum range and full range (GRCh38, 1-based
// inclusive), the CE equivalent, the STRNaming-formatted canonical bracketing
// (2024 onward), the historical 2016-2023 bracketing, the reference sequence
// (sliced to the minimum range), and each MPS kit's sequenced range.
//
// The FSSG gives every sequence on the GRCh38 forward strand ("sequence strings
// (forward strand)" in its sheet title) and the canonical bracketing reads
// left-to-right on it, so the UI slices and highlights forward without
// reverse-complementing. No per-locus strand is stored: the old field had no
// STRidER source and disagreed with the FSSG notes on which loci were first
// characterized on the reverse strand.

import raw from "@/data/fssg_motif_data.json";

export type GenomicRange = {
  chrom: string;
  start: number; // 1-based inclusive
  end: number;
  length?: number;
};

export type KitRange = {
  chrom: string;
  start: number;
  end: number;
  length: number;
  sequence: string;
  clippedToFullRange: boolean;
  /**
   * STRidER's qualifier written in the same FSSG cell, verbatim: "MainstAY only"
   * (SE33, DYS393) or "Included in range of DYS460" (DYS461, whose range is the
   * DYS460 ForenSeq range given in the FSSG DYS460 row).
   */
  note?: string;
};

// Authoritative repeat/interruption/flank segmentation of the minimum-range
// sequence, read from STRidER's own FSSG "Common Use" grid (the boxed repeat
// units and side-boxed interruptions). Not derived by heuristic.
export type MotifSegment = {
  seq: string;
  // "minorRepeat" = a secondary/variant repeat block (STRidER writes it lowercase
  // in the historical bracketing); it repeats but is not the primary motif that
  // names the allele. Shown same color as repeat, in lowercase.
  role: "repeat" | "minorRepeat" | "interruption" | "flank";
};

export type FssgMarker = {
  locus: string;
  ce: number | string | null;
  minimumRange: GenomicRange | null;
  fullRange: GenomicRange | null;
  canonicalBracketing: string[];
  canonicalReference: string | null;
  historicalBracketing: string | null;
  fullRangeSequence: string | null;
  sequenceReference: string | null;
  minimumRangeSequence: string | null;
  segments?: MotifSegment[];
  kits: Record<string, KitRange>;
  notes: string | null;
};

export const FSSG_MARKERS = raw as unknown as Record<string, FssgMarker>;

// Markers we can visualise: those with both a sliced reference sequence and a
// canonical bracketing. The four cross-reference rows (DYS389II, DYS385 a,
// DYS460, DYF387S1 fragment 2) store their sequence in a sibling row and are
// excluded here.
export function isDisplayable(m: FssgMarker): boolean {
  return Boolean(m.minimumRangeSequence && m.canonicalBracketing.length);
}

// Classified by the FSSG chromosome, not the locus name: HPRTB is an X-STR
// without a DXS prefix.
function classOf(name: string): "autosomal" | "x" | "y" {
  const m = FSSG_MARKERS[name];
  const chrom = (m?.minimumRange ?? m?.fullRange)?.chrom;
  if (chrom === "chrX") return "x";
  if (chrom === "chrY") return "y";
  return "autosomal";
}

// Ordered marker list for the selector: autosomal first, then X, then Y,
// alphabetical within each group.
export const DISPLAY_MARKERS: string[] = Object.entries(FSSG_MARKERS)
  .filter(([, m]) => isDisplayable(m))
  .map(([name]) => name)
  .sort((a, b) => {
    const order = { autosomal: 0, x: 1, y: 2 } as const;
    const ca = order[classOf(a)];
    const cb = order[classOf(b)];
    if (ca !== cb) return ca - cb;
    return a.localeCompare(b);
  });

export function markerClass(name: string): "autosomal" | "x" | "y" {
  return classOf(name);
}

export { FSSG_SOURCE } from "@/lib/fssgSource";

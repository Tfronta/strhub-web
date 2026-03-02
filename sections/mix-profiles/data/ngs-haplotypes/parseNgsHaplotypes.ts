/**
 * Parser for NGS haplotype JSON: supports both legacy (array of loci) and
 * new wrapper schema { sample, dateProcessed, source, loci }.
 * Builds display sequence as left_flank_in_fullX + repeat_seqX + right_flank_in_fullX
 * with safe fallbacks. Overlaps are metadata only; never used to trim repeat_seq.
 *
 * Checklist (implementation confirmation):
 * - Loader detects wrapper vs array: parseRawNgsPayload() branches on Array.isArray(raw) vs object with .loci
 * - Sample name resolved correctly: from json.sample when present, else deriveSampleFromFilename(filename)
 * - display_seq built from *_in_full + repeat_seq: getDisplaySequenceForAllele() uses left + repeat + right (no trimming)
 * - Overlaps not used to trim repeat_seq: overlap_left_bp_X / overlap_right_bp_X are never read in this file
 */

/** Raw locus record as in JSON (HipSTR-derived). All segment fields optional for fallbacks. */
export type LocusRecord = {
  locus: string;
  genotype_forense: string;
  bracketed1: string;
  bracketed2: string;
  repeat_seq1?: string;
  repeat_seq2?: string;
  full_seq1?: string;
  full_seq2?: string;
  allele_seq1?: string;
  allele_seq2?: string;
  left_flank_in_full1?: string;
  left_flank_in_full2?: string;
  right_flank_in_full1?: string;
  right_flank_in_full2?: string;
  coverage1?: number;
  coverage2?: number;
  [key: string]: unknown;
};

/** New wrapper schema (source of truth). */
export type NgsSampleWrapper = {
  sample: string;
  dateProcessed?: string;
  source?: Record<string, unknown>;
  loci: LocusRecord[];
};

export type ParseResult = {
  loci: LocusRecord[];
  sample: string | null;
};

/**
 * Loader: supports BOTH schemas.
 * - If parsed JSON is an array -> treat as loci array; sample from filename.
 * - If parsed JSON is an object with `loci` -> use json.loci; sample from json.sample or filename.
 */
export function parseRawNgsPayload(
  raw: unknown,
  filenameForSample?: string
): ParseResult {
  if (Array.isArray(raw)) {
    const sample =
      filenameForSample != null
        ? deriveSampleFromFilename(filenameForSample)
        : null;
    return { loci: raw as LocusRecord[], sample };
  }
  if (
    raw != null &&
    typeof raw === "object" &&
    "loci" in raw &&
    Array.isArray((raw as NgsSampleWrapper).loci)
  ) {
    const obj = raw as NgsSampleWrapper;
    const sample =
      typeof obj.sample === "string" && obj.sample.length > 0
        ? obj.sample
        : filenameForSample != null
          ? deriveSampleFromFilename(filenameForSample)
          : null;
    return { loci: obj.loci, sample };
  }
  return { loci: [], sample: null };
}

function deriveSampleFromFilename(filename: string): string {
  const base = filename.replace(/\.json$/i, "").trim();
  return base || "unknown";
}

export type DisplaySequenceResult = {
  displaySeq: string;
  segments: { flank5?: string; repeat: string; flank3?: string } | null;
  partialDisplay?: boolean;
};

/**
 * Build display sequence for one allele (1 or 2) per spec:
 * display_seqX = left_flank_in_fullX + repeat_seqX + right_flank_in_fullX.
 * Overlaps are NOT used to trim repeat_seq.
 * Fallbacks (code only, never mutate JSON):
 * - If any of left_flank_in_fullX, repeat_seqX, right_flank_in_fullX missing
 *   -> use full_seqX for display, mark partialDisplay.
 * - If full_seqX also missing -> use allele_seqX (repeat only), warn in console.
 */
export function getDisplaySequenceForAllele(
  entry: LocusRecord,
  alleleIndex: 1 | 2
): DisplaySequenceResult {
  const left =
    alleleIndex === 1 ? entry.left_flank_in_full1 : entry.left_flank_in_full2;
  const repeat =
    alleleIndex === 1 ? entry.repeat_seq1 : entry.repeat_seq2;
  const right =
    alleleIndex === 1 ? entry.right_flank_in_full1 : entry.right_flank_in_full2;
  const fullSeq = alleleIndex === 1 ? entry.full_seq1 : entry.full_seq2;
  const alleleSeq = alleleIndex === 1 ? entry.allele_seq1 : entry.allele_seq2;

  const hasAllThree =
    left != null &&
    left !== "" &&
    repeat != null &&
    repeat !== "" &&
    right != null &&
    right !== "";

  if (hasAllThree) {
    const displaySeq = left + repeat + right;
    return {
      displaySeq,
      segments: { flank5: left, repeat, flank3: right },
      partialDisplay: false,
    };
  }

  if (fullSeq != null && fullSeq !== "") {
    const displaySeq = fullSeq.replace(/\s+/g, "").trim();
    return {
      displaySeq,
      segments: null,
      partialDisplay: true,
    };
  }

  if (alleleSeq != null && alleleSeq !== "") {
    if (typeof console !== "undefined" && console.warn) {
      console.warn(
        "[parseNgsHaplotypes] Missing full_seq and segment fields for locus",
        entry.locus,
        "allele",
        alleleIndex,
        "; using allele_seq only."
      );
    }
    return {
      displaySeq: alleleSeq.replace(/\s+/g, "").trim(),
      segments: null,
      partialDisplay: true,
    };
  }

  return {
    displaySeq: "",
    segments: null,
    partialDisplay: true,
  };
}

// lib/strFormatting.ts
// Helpers for STR allele and microvariant display (bracketed notation, CE labels).

import { markerData } from "@/lib/markerData";

/**
 * Normalize a sequence string for comparison: remove all whitespace, uppercase.
 */
export function normalizeSeq(seq: string): string {
  return (seq ?? "").replace(/\s+/g, "").toUpperCase();
}

/**
 * True when CE allele values are equal and repeat-region sequences differ (isoallele pair).
 * Use normalized repeat strings (e.g. from normalizeSeq(repeat_seq1), normalizeSeq(repeat_seq2)).
 */
export function isIsoAllele(
  ce1: string | number,
  ce2: string | number,
  repeat1: string,
  repeat2: string
): boolean {
  if (String(ce1) !== String(ce2)) return false;
  return normalizeSeq(repeat1) !== normalizeSeq(repeat2);
}

/**
 * Whether to show the "iso" badge for a row: there are ≥2 rows with the same CE allele
 * and ≥2 distinct normalized repeat sequences among them.
 */
export function shouldShowIsoBadge<
  T extends { allele: string | number; repeatSequence?: string | "—" }
>(row: T, allRows: T[]): boolean {
  const ce = String(row.allele);
  const sameCe = allRows.filter((r) => String(r.allele) === ce);
  if (sameCe.length < 2) return false;
  const normalized = sameCe.map((r) =>
    normalizeSeq(String(r.repeatSequence ?? ""))
  );
  const unique = new Set(normalized);
  return unique.size >= 2;
}

/**
 * Formats an allele for didactic "Estructura" display (bracketed notation).
 * - Integer allele (e.g. "15") → "[motif]15"
 * - Microvariant .1 / .2 / .3 (e.g. "17.3" or "17,3") → "[motif]17 + 3 bp"
 * Accepts comma or dot as decimal separator.
 *
 * @param alleleCE - Allele string as used in CE (e.g. "15", "17.3", "17,3")
 * @param motif - Repeat motif (e.g. "TCTA", "ATCT")
 * @param repeatsInt - Optional override for integer repeat count (default: derived from alleleCE)
 * @returns Formatted string for UI display only; does not replace the original allele value.
 */
export function formatMicrovariant(
  alleleCE: string,
  motif: string,
  repeatsInt?: number
): string {
  const normalized = alleleCE.replace(/,/g, ".").trim();
  const num = parseFloat(normalized);

  if (Number.isNaN(num)) {
    return motif ? `[${motif}]?` : "?";
  }

  const intPart =
    repeatsInt !== undefined && Number.isInteger(repeatsInt)
      ? repeatsInt
      : Math.floor(num);
  const frac = num - intPart;

  // Integer allele (no meaningful decimal)
  if (frac < 0.01) {
    return motif ? `[${motif}]${intPart}` : String(intPart);
  }

  // Microvariant: decimal .1 / .2 / .3 → extra bp
  const extraBp = Math.round(frac * 10);
  return motif
    ? `[${motif}]${intPart}+${extraBp} bp`
    : `${intPart}+${extraBp} bp`;
}

/**
 * Extracts the primary repeat motif for a locus from markerData (e.g. "TCTA" from "[TCTA]n").
 * Returns the first [ACGT]+ segment inside brackets, or null if not found.
 */
export function getPrimaryMotifForLocus(locusId: string): string | null {
  try {
    const key = locusId.toLowerCase().replace(/\s+/g, "_").replace(/-/g, "_");
    const entry = markerData[key as keyof typeof markerData];
    const motifStr = entry?.motif;
    if (typeof motifStr !== "string" || !motifStr) return null;
    const match = motifStr.match(/\[([ACGT]+)\]/i);
    return match ? match[1].toUpperCase() : null;
  } catch {
    return null;
  }
}

/**
 * Parses a full sequence string "LEFT_FLANK REPEAT_REGION RIGHT_FLANK" (space-separated)
 * into three segments for didactic display (flanks muted, repeat highlighted).
 *
 * @param fullSeq - Raw full_seq string, possibly with multiple spaces between segments
 * @returns { left, repeat, right }. If not exactly 3 segments, fallback: repeat = fullSeq, left = right = ""
 */
export function parseFullSequence(fullSeq: string): {
  left: string;
  repeat: string;
  right: string;
} {
  const trimmed = fullSeq.trim();
  if (!trimmed) {
    return { left: "", repeat: "", right: "" };
  }
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length >= 3) {
    return {
      left: parts[0],
      repeat: parts[1],
      right: parts.slice(2).join(" "),
    };
  }
  return { left: "", repeat: trimmed, right: "" };
}

/**
 * For "Sequência completa" column: build one continuous sequence (no internal spaces)
 * and the index range of the repeat region so the UI can highlight it.
 *
 * @param fullSeq - full_seq string (may contain spaces between flank/repeat/flank)
 * @param repeatSeq - optional repeat_seq string; if omitted, derived from parseFullSequence(fullSeq)
 * @returns { continuous, repeatStart?, repeatEnd? }. Highlight continuous.slice(repeatStart, repeatEnd).
 */
export function getContinuousSequenceWithRepeat(
  fullSeq: string,
  repeatSeq?: string
): {
  continuous: string;
  repeatStart?: number;
  repeatEnd?: number;
} {
  const continuous = fullSeq.replace(/\s+/g, "").trim();
  if (!continuous) return { continuous: "" };

  const repeatSource =
    repeatSeq?.trim() ||
    parseFullSequence(fullSeq).repeat;
  const repeatContinuous = repeatSource.replace(/\s+/g, "");
  if (!repeatContinuous) return { continuous };

  const idx = continuous.indexOf(repeatContinuous);
  if (idx >= 0)
    return {
      continuous,
      repeatStart: idx,
      repeatEnd: idx + repeatContinuous.length,
    };
  return { continuous };
}

// ---------------------------------------------------------------------------
// Example usage (for documentation / manual testing):
//
// formatMicrovariant("15", "TCTA")           // "[TCTA]15"
// formatMicrovariant("17.3", "TCTA")        // "[TCTA]17+3 bp"
// formatMicrovariant("17,3", "TCTA")         // "[TCTA]17+3 bp"
// formatMicrovariant("14.2", "AGAT")        // "[AGAT]14+2 bp"
// formatMicrovariant("12", "ATCT")           // "[ATCT]12"
// formatMicrovariant("17.3", "TCTA", 17)     // "[TCTA]17+3 bp" (repeatsInt used for int part)
//
// parseFullSequence("FLANK1 REPEAT FLANK2")  // { left: "FLANK1", repeat: "REPEAT", right: "FLANK2" }
// parseFullSequence("A  B   C")               // { left: "A", repeat: "B", right: "C" } (spaces collapsed)
//

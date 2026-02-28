/**
 * NGS haplotypes per sample (real sequences for mix-profiles NGS table).
 * When available, used to show sample-specific sequences with flank/repeat highlighting.
 */

export type NgsLocusEntry = {
  locus: string;
  genotype_forense: string;
  repeat_seq1: string;
  full_seq1: string;
  bracketed1: string;
  repeat_seq2: string;
  full_seq2: string;
  bracketed2: string;
  /** Allelic coverage (PDP) for allele 1, from HipSTR when available */
  coverage1?: number;
  /** Allelic coverage (PDP) for allele 2, from HipSTR when available */
  coverage2?: number;
};

type NgsSamplePayload = {
  sample: string;
  dateProcessed?: string;
  loci: NgsLocusEntry[];
};

import HG00097Data from "./HG00097.json";
import HG00145Data from "./HG00145.json";
import HG00372Data from "./HG00372.json";
import HG01063Data from "./HG01063.json";
import HG02944Data from "./HG02944.json";

const NGS_HAPLOTYPES_BY_SAMPLE: Record<string, NgsLocusEntry[]> = {
  HG00097: (HG00097Data as NgsSamplePayload).loci,
  HG00145: (HG00145Data as NgsSamplePayload).loci,
  HG00372: (HG00372Data as NgsSamplePayload).loci,
  HG01063: (HG01063Data as NgsSamplePayload).loci,
  HG02944: (HG02944Data as NgsSamplePayload).loci,
};

export function getSampleNgsLocus(
  sampleId: string | null,
  locusId: string
): NgsLocusEntry | null {
  if (!sampleId) return null;
  const loci = NGS_HAPLOTYPES_BY_SAMPLE[sampleId];
  if (!loci) return null;
  return loci.find((e) => e.locus === locusId) ?? null;
}

/**
 * Parse genotype_forense "a/b" into [a, b] (strings, e.g. "17.3").
 */
export function parseGenotypeForense(genotype_forense: string): [string, string] {
  const parts = genotype_forense.split("/");
  const a = (parts[0] ?? "").trim();
  const b = (parts[1] ?? "").trim();
  return [a, b];
}

/**
 * From full_seq and the known repeat_seq, return segments so the repeat region
 * is painted exactly (repeat_seq may appear in full_seq with spaces around it).
 */
export function parseFullSeqSegments(
  fullSeq: string,
  repeatSeq?: string
): {
  flank5?: string;
  repeat: string;
  flank3?: string;
} | null {
  const cleaned = fullSeq.trim();
  if (!cleaned) return null;

  if (repeatSeq && repeatSeq.length > 0) {
    const fullNoSpaces = cleaned.replace(/\s+/g, "");
    const repeatNoSpaces = repeatSeq.replace(/\s+/g, "");
    const idx = fullNoSpaces.indexOf(repeatNoSpaces);
    if (idx >= 0) {
      let nonSpaceCount = 0;
      let repeatStart = -1;
      let repeatEnd = -1;
      for (let i = 0; i < cleaned.length; i++) {
        if (/\s/.test(cleaned[i])) continue;
        if (nonSpaceCount === idx) repeatStart = i;
        if (nonSpaceCount === idx + repeatNoSpaces.length) {
          repeatEnd = i;
          break;
        }
        nonSpaceCount++;
      }
      if (repeatStart >= 0) {
        if (repeatEnd < 0) repeatEnd = cleaned.length;
        const flank5 = repeatStart > 0 ? cleaned.slice(0, repeatStart).trim() : undefined;
        const repeat = cleaned.slice(repeatStart, repeatEnd);
        const flank3 = repeatEnd < cleaned.length ? cleaned.slice(repeatEnd).trim() : undefined;
        return { flank5, repeat, flank3 };
      }
    }
  }

  const parts = cleaned.split(/\s+/);
  if (parts.length >= 3) {
    return { flank5: parts[0], repeat: parts[1], flank3: parts.slice(2).join(" ") };
  }
  if (parts.length === 2) {
    return { repeat: parts[0], flank3: parts[1] };
  }
  if (parts.length === 1 && parts[0]) {
    return { repeat: parts[0] };
  }
  return null;
}

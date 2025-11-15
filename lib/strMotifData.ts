// lib/strMotifData.ts

export type MotifSegmentKind = "flank5" | "flank3" | "core" | "interruption" | "nc";

export type MotifSegment = {
  kind: MotifSegmentKind;
  seq: string;         // e.g. "ATCT" or "AGAC"
  counts?: boolean;    // true if this repeat contributes to the allele count
};

export type MotifAlleleDef = {
  markerId: string;        // e.g. "CSF1PO"
  kitId: string;           // e.g. "ForenSeq"
  allele: number;          // e.g. 13
  canonicalMotif: string;  // e.g. "ATCT"
  fullSequence: string;    // full allele sequence including 5' and 3' flanks
  flank5: string;          // 5' flank as substring of fullSequence
  flank3: string;          // 3' flank as substring of fullSequence
  repeatCore?: string;     // optional descriptor like "ATCT×13"
  source?: string;         // e.g. "STRider"
  // Keep segments for backward compatibility with existing visualization code
  segments?: MotifSegment[];
};

export const motifAlleles: MotifAlleleDef[] = [
  {
    markerId: "CSF1PO",
    kitId: "ForenSeq",
    allele: 13,
    canonicalMotif: "ATCT",
    fullSequence:
      "CTTCCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTAATCTATCTATCTT",
    flank5: "CTTCCT",
    flank3: "AATCTATCTATCTT",
    repeatCore: "ATCT×13",
    source: "STRider",
    segments: [
      { kind: "flank5", seq: "CTTCCT" },
      // 13 core repeats, one segment per motif that COUNTS
      { kind: "core", seq: "ATCT", counts: true },
      { kind: "core", seq: "ATCT", counts: true },
      { kind: "core", seq: "ATCT", counts: true },
      { kind: "core", seq: "ATCT", counts: true },
      { kind: "core", seq: "ATCT", counts: true },
      { kind: "core", seq: "ATCT", counts: true },
      { kind: "core", seq: "ATCT", counts: true },
      { kind: "core", seq: "ATCT", counts: true },
      { kind: "core", seq: "ATCT", counts: true },
      { kind: "core", seq: "ATCT", counts: true },
      { kind: "core", seq: "ATCT", counts: true },
      { kind: "core", seq: "ATCT", counts: true },
      { kind: "core", seq: "ATCT", counts: true },
      // finally the 3' flank
      { kind: "flank3", seq: "AATCTATCTATCTT" },
    ],
  },
];

export function getMotifAllelesForMarker(markerId: string): MotifAlleleDef[] {
  const key = markerId.toUpperCase();
  return motifAlleles.filter((m) => m.markerId.toUpperCase() === key);
}

export function getMotifAllele(
  markerId: string,
  kitId: string,
  allele: number
): MotifAlleleDef | undefined {
  const mk = markerId.toUpperCase();
  const kk = kitId.toUpperCase();
  return motifAlleles.find(
    (m) =>
      m.markerId.toUpperCase() === mk &&
      m.kitId.toUpperCase() === kk &&
      m.allele === allele
  );
}

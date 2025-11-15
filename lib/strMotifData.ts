// lib/strMotifData.ts

import csf1poMotifs from "@/data/CSF1PO_STRhub.json";

export type MotifSegmentKind = "flank" | "core" | "interruption" | "nc";

export type MotifSegment = {
  kind: MotifSegmentKind;
  label: string; // what we show in the pill, e.g. "ATCT" or "CTTCCT"
};

export type MotifAlleleDef = {
  markerId: string; // e.g. "CSF1PO"
  kitId: string; // e.g. "ForenSeq"
  allele: string; // e.g. "13"
  canonicalMotif: string;
  fullSequence: string;
  flank5: string; // 5' flank as substring of fullSequence
  flank3: string; // 3' flank as substring of fullSequence
  repeatCore?: string; // optional descriptor like "ATCT×13"
  source?: string; // e.g. "STRider"
  segments: MotifSegment[];
};

export const motifAlleles: MotifAlleleDef[] = csf1poMotifs as MotifAlleleDef[];

export function getMotifAllelesForMarker(markerId: string): MotifAlleleDef[] {
  const key = markerId.toUpperCase();
  return motifAlleles.filter((m) => m.markerId.toUpperCase() === key);
}

export function getMotifAllele(
  markerId: string,
  kitId: string,
  allele: string
): MotifAlleleDef | undefined {
  const mk = markerId.toUpperCase();
  const kk = kitId.trim().toUpperCase();
  return motifAlleles.find(
    (m) =>
      m.markerId.toUpperCase() === mk &&
      m.kitId.trim().toUpperCase() === kk &&
      m.allele === allele
  );
}

// lib/strMotifData.ts

export type MotifSegmentKind = "flank" | "core" | "interruption" | "nc" | "insertion";

export type MotifSegment = {
  kind: MotifSegmentKind;
  label: string; // what we show in the pill, e.g. "ATCT" or "CTTCCT"
};

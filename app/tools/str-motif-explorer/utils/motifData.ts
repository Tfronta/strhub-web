import strKitsData from "@/data/str_kits.json";

export type StrKitsData = typeof strKitsData;
export type StrKitType =
  | "ForenSeq MainstAY/Signature"
  | "IDSeek OmniSTR Global"
  | "Precision ID GlobalFiler NGS STR Panel v2"
  | "PowerSeq 46GY";
export type StrKitData = typeof strKitsData.CSF1PO['ForenSeq MainstAY/Signature'];

export type MotifToken = {
  label: string; // e.g. "TCTA"
  type: "repeat" | "interruption" | "other";
  note?: string; // optional explanation
};

export type MotifSegmentType = "flank" | "repeat" | "interruption";

export type MotifSegment = {
  label: string; // e.g. "TCTA", "ATCT", "FLANK_L"
  repeatCount: number; // number of times this unit is repeated
  type: MotifSegmentType; // "flank" | "repeat" | "interruption"
  note?: string; // optional: "indel", "SNV", etc.
};

export type SequenceBlock = {
  text: string;
  type: MotifSegmentType;
};

export type MotifExampleSequenceSegment =
  | string
  | {
      type: "core" | "insertion";
      sequence: string;
    };

export type MotifExampleAllele = {
  alleleLabel: string; // "10" or "10.3", etc.
  /**
   * Full allele sequence data.
   * Historically this was a string[] of segments; it is now an array of
   * objects describing each segment (core vs insertion). Some legacy
   * entries may still be a raw string, so we allow either representation.
   */
  sequence: string | MotifExampleSequenceSegment[];
};

export type MarkerMotif = {
  id: string; // e.g. "CSF1PO"
  name: string; // e.g. "CSF1PO (Chr 5)"
  motifPattern: string; // human-readable pattern, e.g. "[TCTA]n"
  pattern: string; // pattern from markerData, e.g. "[ATCT]n"
  tokens: MotifToken[]; // ordered schematic of the pattern (for schematic view)
  segments?: MotifSegment[]; // conceptual structure with repeat counts (for sequence highlight)
  exampleAllele?: MotifExampleAllele; // real sequence example from STRbase
  notes?: string; // short explanation of motif complexity
};

export function buildSequenceBlocks(
  segments: MotifSegment[]
): SequenceBlock[] {
  return segments.map((seg) => {
    // For flanks, show a short placeholder; for repeats/interruptions, repeat the label
    if (seg.type === "flank") {
      const flankLabel = "flank";
      return {
        text: flankLabel,
        type: seg.type,
      };
    }
    return {
      text: seg.label.toUpperCase().repeat(seg.repeatCount),
      type: seg.type,
    };
  });
}

export function buildMotifSummary(segments: MotifSegment[]): string {
  return segments
    .map((seg) => {
      if (seg.type === "flank") return "flank";
      if (seg.repeatCount === 1) return seg.label;
      return `${seg.label}[${seg.repeatCount}]`;
    })
    .join(" ");
}

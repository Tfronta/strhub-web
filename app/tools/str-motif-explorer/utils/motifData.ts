// app/tools/str-motif-explorer/utils/motifData.ts

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

export type MotifExampleAllele = {
  alleleLabel: string; // "10" or "10.3", etc.
  sequence: string;
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

// Helper to extract canonical motif from pattern like "[AGAT]n" -> "AGAT"
function extractCanonicalMotif(pattern: string): string | undefined {
  const match = pattern.match(/\[([ACGT]+)\]/);
  return match ? match[1] : undefined;
}

export const STR_MOTIFS: MarkerMotif[] = [
  {
    id: "CSF1PO",
    name: "CSF1PO (Chr 5)",
    motifPattern: "[AGAT]n",
    canonicalPattern: "[AGAT]n",
    canonicalMotif: "AGAT",
    tokens: [{ label: "AGAT", type: "repeat" }],
    segments: [
      { label: "FLANK_L", repeatCount: 1, type: "flank" },
      { label: "AGAT", repeatCount: 10, type: "repeat" },
      { label: "FLANK_R", repeatCount: 1, type: "flank" },
    ],
    exampleAllele: {
      alleleLabel: "10",
      // Using a CSF1PO sequence from markerData - allele 10, first variant
      // Note: CSF1PO sequences use ATCT (reverse complement of AGAT), so we'll handle both
      sequence:
        "CTGTGTCAGACCCTGTTCTAAGTACTTCCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTAATCTATCTATCTTCTATCTATGAAGGCAGTTACTGTTAATATCTTCATTTTACAGGTAGGAAAACTGAGACACAGGGTGGTTAGCAACCTGCTAGTCCTTGGCAGACTCAG",
    },
    notes: "Simple tetranucleotide repeat.",
  },
  {
    id: "D21S11",
    name: "D21S11 (Chr 21)",
    motifPattern: "[TCTA]n [TCTG]n [TCTA]n TA [TCTA]n TCA [TCTA]n TCCATA [TCTA]n",
    canonicalPattern: "[TCTA]n [TCTG]n [TCTA]n TA [TCTA]n TCA [TCTA]n TCCATA [TCTA]n",
    tokens: [
      { label: "TCTA", type: "repeat", note: "Main repeat unit" },
      { label: "TCTG", type: "repeat", note: "Variant repeat" },
      { label: "TA", type: "interruption", note: "Internal interruption" },
      { label: "TCA", type: "interruption" },
      { label: "TCCATA", type: "interruption" },
    ],
    segments: [
      { label: "FLANK_L", repeatCount: 1, type: "flank" },
      { label: "TCTA", repeatCount: 6, type: "repeat" },
      { label: "TCTG", repeatCount: 3, type: "repeat" },
      { label: "TCTA", repeatCount: 4, type: "repeat" },
      { label: "TA", repeatCount: 1, type: "interruption", note: "indel" },
      { label: "TCTA", repeatCount: 5, type: "repeat" },
      { label: "TCA", repeatCount: 1, type: "interruption", note: "SNV" },
      { label: "TCTA", repeatCount: 3, type: "repeat" },
      { label: "TCCATA", repeatCount: 1, type: "interruption", note: "indel" },
      { label: "TCTA", repeatCount: 2, type: "repeat" },
      { label: "FLANK_R", repeatCount: 1, type: "flank" },
    ],
    notes:
      "Complex, multi-block motif with internal interruptions and variant repeats.",
  },
  {
    id: "FGA",
    name: "FGA (Chr 4)",
    motifPattern: "Mixture of CTTT/TTCC-type repeats and interruptions",
    canonicalPattern: "[CTTT]n [TTCC]n",
    tokens: [
      { label: "CTTT", type: "repeat" },
      { label: "TTCC", type: "repeat" },
      { label: "other", type: "interruption" },
    ],
    notes: "Representative schematic only; real motif is more complex.",
  },
  {
    id: "D18S51",
    name: "D18S51 (Chr 18)",
    motifPattern: "[AGAA]n",
    canonicalPattern: "[AGAA]n",
    tokens: [{ label: "AGAA", type: "repeat" }],
    segments: [
      { label: "FLANK_L", repeatCount: 1, type: "flank" },
      { label: "AGAA", repeatCount: 12, type: "repeat" },
      { label: "FLANK_R", repeatCount: 1, type: "flank" },
    ],
    notes: "Simple tetranucleotide repeat.",
  },
  {
    id: "D2S1338",
    name: "D2S1338 (Chr 2)",
    motifPattern: "[TGCC]n [TTCC]n",
    canonicalPattern: "[TGCC]n [TTCC]n",
    tokens: [
      { label: "TGCC", type: "repeat" },
      { label: "TTCC", type: "repeat", note: "Variant repeat unit" },
    ],
    segments: [
      { label: "FLANK_L", repeatCount: 1, type: "flank" },
      { label: "TGCC", repeatCount: 8, type: "repeat" },
      { label: "TTCC", repeatCount: 4, type: "repeat" },
      { label: "FLANK_R", repeatCount: 1, type: "flank" },
    ],
    notes: "Compound repeat with two variant units.",
  },
  {
    id: "TH01",
    name: "TH01 (Chr 11)",
    motifPattern: "[AATG]n",
    canonicalPattern: "[AATG]n",
    tokens: [{ label: "AATG", type: "repeat" }],
    segments: [
      { label: "FLANK_L", repeatCount: 1, type: "flank" },
      { label: "AATG", repeatCount: 9, type: "repeat" },
      { label: "FLANK_R", repeatCount: 1, type: "flank" },
    ],
    notes: "Simple tetranucleotide repeat.",
  },
];


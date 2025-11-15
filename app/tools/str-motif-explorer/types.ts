export type MotifBlockKind = "flank" | "coreRepeat" | "interruption" | "otherRepeat";

export type MotifBlock = {
  label: string;          // text shown in the pill / span, e.g. "AGAT", "flank", "AGAC"
  kind: MotifBlockKind;   // determines color and tooltip content
  note?: string;          // optional extra info for tooltip
};

export type AlleleStructure = {
  marker: string;               // e.g. "CSF1PO"
  allele: string;               // e.g. "10"
  canonicalMotif: string;       // e.g. "AGAT"
  canonicalPatternBlocks: MotifBlock[];  // used for the top row
  internalSequenceBlocks: MotifBlock[];  // used for the internal sequence box
  fullSequence: string;         // plain sequence, if needed for raw text display
};


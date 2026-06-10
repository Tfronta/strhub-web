import type { AlleleStructure } from "../types";

export const csf1poAllele10: AlleleStructure = {
  marker: "CSF1PO",
  allele: "10",
  canonicalMotif: "AGAT",

  // This describes the conceptual pattern, NOT the raw sequence.
  canonicalPatternBlocks: [
    { label: "flank", kind: "flank" },
    { label: "AGAT", kind: "coreRepeat" },
    { label: "AGAT", kind: "coreRepeat" },
    { label: "AGAT", kind: "coreRepeat" },
    { label: "AGAT", kind: "coreRepeat" },
    { label: "AGAT", kind: "coreRepeat" },
    { label: "AGAT", kind: "coreRepeat" },
    { label: "AGAT", kind: "coreRepeat" },
    { label: "AGAT", kind: "coreRepeat" },
    { label: "AGAT", kind: "coreRepeat" },
    { label: "AGAT", kind: "coreRepeat" },
    { label: "flank", kind: "flank" },
  ],

  // IMPORTANT: keep the internal sequence structure compatible
  // with the current UI, but use TODO placeholders for the exact sequence.
  internalSequenceBlocks: [
    // Example structure – do NOT claim these are biologically exact.
    // I will adjust these manually.
    { label: "CTGTGTCAGAGCCCTGTTCTAAGTACTTCCT", kind: "flank" },
    { label: "AGAT", kind: "coreRepeat" },
    { label: "AGAT", kind: "coreRepeat" },
    { label: "AGAC", kind: "interruption", note: "Internal variant within repeat block" },
    { label: "AGAT", kind: "coreRepeat" },
    { label: "AGAT", kind: "coreRepeat" },
    { label: "AGAT", kind: "coreRepeat" },
    { label: "AGAT", kind: "coreRepeat" },
    { label: "AGAT", kind: "coreRepeat" },
    { label: "AGAT", kind: "coreRepeat" },
    { label: "AGAT", kind: "coreRepeat" },
    { label: "CAGACTCAG", kind: "flank" },
  ],

  // TODO: Replace with the exact full sequence from STRBase.
  fullSequence: "TODO_FILL_WITH_REAL_CSF1PO_ALLELE_10_SEQUENCE",
};


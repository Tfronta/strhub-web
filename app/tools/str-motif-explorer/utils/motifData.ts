// app/tools/str-motif-explorer/utils/motifData.ts

export type MotifToken = {
  label: string; // e.g. "TCTA"
  type: "repeat" | "interruption" | "other";
  note?: string; // optional explanation
};

export type MarkerMotif = {
  id: string; // e.g. "CSF1PO"
  name: string; // e.g. "CSF1PO (Chr 5)"
  motifPattern: string; // human-readable pattern, e.g. "[TCTA]n"
  tokens: MotifToken[]; // ordered schematic of the pattern
  notes?: string; // short explanation of motif complexity
};

export const STR_MOTIFS: MarkerMotif[] = [
  {
    id: "CSF1PO",
    name: "CSF1PO (Chr 5)",
    motifPattern: "[AGAT]n",
    tokens: [{ label: "AGAT", type: "repeat" }],
    notes: "Simple tetranucleotide repeat.",
  },
  {
    id: "D21S11",
    name: "D21S11 (Chr 21)",
    motifPattern: "[TCTA]n [TCTG]n [TCTA]n TA [TCTA]n TCA [TCTA]n TCCATA [TCTA]n",
    tokens: [
      { label: "TCTA", type: "repeat", note: "Main repeat unit" },
      { label: "TCTG", type: "repeat", note: "Variant repeat" },
      { label: "TA", type: "interruption", note: "Internal interruption" },
      { label: "TCA", type: "interruption" },
      { label: "TCCATA", type: "interruption" },
    ],
    notes:
      "Complex, multi-block motif with internal interruptions and variant repeats.",
  },
  {
    id: "FGA",
    name: "FGA (Chr 4)",
    motifPattern: "Mixture of CTTT/TTCC-type repeats and interruptions",
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
    tokens: [{ label: "AGAA", type: "repeat" }],
    notes: "Simple tetranucleotide repeat.",
  },
  {
    id: "D2S1338",
    name: "D2S1338 (Chr 2)",
    motifPattern: "[TGCC]n [TTCC]n",
    tokens: [
      { label: "TGCC", type: "repeat" },
      { label: "TTCC", type: "repeat", note: "Variant repeat unit" },
    ],
    notes: "Compound repeat with two variant units.",
  },
  {
    id: "TH01",
    name: "TH01 (Chr 11)",
    motifPattern: "[AATG]n",
    tokens: [{ label: "AATG", type: "repeat" }],
    notes: "Simple tetranucleotide repeat.",
  },
];


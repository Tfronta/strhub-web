export type ChromosomeSpec = {
  id: string;
  label: string;
  lengthMb: number;
  centromereRatio: number;
};

// GRCh38 approximate chromosome lengths (Mb) and centromere positions.
// centromereRatio = centromere midpoint / total length.
export const CHROMOSOMES: ChromosomeSpec[] = [
  { id: "1", label: "1", lengthMb: 248.96, centromereRatio: 0.50 },
  { id: "2", label: "2", lengthMb: 242.19, centromereRatio: 0.38 },
  { id: "3", label: "3", lengthMb: 198.30, centromereRatio: 0.46 },
  { id: "4", label: "4", lengthMb: 190.21, centromereRatio: 0.26 },
  { id: "5", label: "5", lengthMb: 181.54, centromereRatio: 0.27 },
  { id: "6", label: "6", lengthMb: 170.81, centromereRatio: 0.36 },
  { id: "7", label: "7", lengthMb: 159.35, centromereRatio: 0.37 },
  { id: "8", label: "8", lengthMb: 145.14, centromereRatio: 0.31 },
  { id: "9", label: "9", lengthMb: 138.39, centromereRatio: 0.35 },
  { id: "10", label: "10", lengthMb: 133.80, centromereRatio: 0.30 },
  { id: "11", label: "11", lengthMb: 135.09, centromereRatio: 0.39 },
  { id: "12", label: "12", lengthMb: 133.28, centromereRatio: 0.27 },
  { id: "13", label: "13", lengthMb: 114.36, centromereRatio: 0.15 },
  { id: "14", label: "14", lengthMb: 107.04, centromereRatio: 0.16 },
  { id: "15", label: "15", lengthMb: 101.99, centromereRatio: 0.18 },
  { id: "16", label: "16", lengthMb: 90.34, centromereRatio: 0.42 },
  { id: "17", label: "17", lengthMb: 83.26, centromereRatio: 0.29 },
  { id: "18", label: "18", lengthMb: 80.37, centromereRatio: 0.22 },
  { id: "19", label: "19", lengthMb: 58.62, centromereRatio: 0.44 },
  { id: "20", label: "20", lengthMb: 64.44, centromereRatio: 0.42 },
  { id: "21", label: "21", lengthMb: 46.71, centromereRatio: 0.27 },
  { id: "22", label: "22", lengthMb: 50.82, centromereRatio: 0.30 },
  { id: "X", label: "X", lengthMb: 156.04, centromereRatio: 0.39 },
  { id: "Y", label: "Y", lengthMb: 57.23, centromereRatio: 0.21 },
];

export const MAX_CHROMOSOME_LENGTH = Math.max(
  ...CHROMOSOMES.map((c) => c.lengthMb),
);

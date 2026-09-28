import type { ForensicParameters } from "./forensicParameters";

// Forensic parameters of the RAO sample (Ribeirão Preto, Brazil) as published in
// Valle-Silva et al. 2022 (FSI Genet 58:102676), Supplementary Table 9: genotypes
// called with HipSTR alone. Values as printed there (four decimals). N is the number
// of individuals typed: Ho x N and every allele frequency x 2N are whole numbers.

export const markerStatisticsRAO: Record<string, ForensicParameters> = {
  csf1po: { N: 457, Na: 10, Ho: 0.7199, He: 0.7396, MP: 0.1135, PD: 0.8865, PIC: 0.6941, PE: 0.4597 },
  d1s1656: { N: 379, Na: 17, Ho: 0.9446, He: 0.8958, MP: 0.0247, PD: 0.9753, PIC: 0.8867, PE: 0.8871 },
  d2s441: { N: 417, Na: 14, Ho: 0.8058, He: 0.7766, MP: 0.0892, PD: 0.9108, PIC: 0.7437, PE: 0.6098 },
  d2s1338: { N: 326, Na: 13, Ho: 0.9264, He: 0.8824, MP: 0.0306, PD: 0.9694, PIC: 0.8714, PE: 0.8496 },
  d3s1358: { N: 453, Na: 9, Ho: 0.8278, He: 0.7845, MP: 0.0860, PD: 0.9140, PIC: 0.7506, PE: 0.6516 },
  d5s818: { N: 441, Na: 10, Ho: 0.7166, He: 0.7312, MP: 0.1132, PD: 0.8868, PIC: 0.6866, PE: 0.4543 },
  d7s820: { N: 431, Na: 8, Ho: 0.8306, He: 0.8039, MP: 0.0711, PD: 0.9289, PIC: 0.7752, PE: 0.6571 },
  d8s1179: { N: 399, Na: 11, Ho: 0.8246, He: 0.8246, MP: 0.0556, PD: 0.9444, PIC: 0.8021, PE: 0.6454 },
  d10s1248: { N: 434, Na: 9, Ho: 0.8018, He: 0.7694, MP: 0.0927, PD: 0.9073, PIC: 0.7337, PE: 0.6025 },
  d12s391: { N: 368, Na: 21, Ho: 0.8832, He: 0.8865, MP: 0.0251, PD: 0.9749, PIC: 0.8760, PE: 0.7611 },
  d13s317: { N: 445, Na: 8, Ho: 0.8090, He: 0.7938, MP: 0.0709, PD: 0.9291, PIC: 0.7657, PE: 0.6158 },
  d16s539: { N: 440, Na: 9, Ho: 0.8000, He: 0.7898, MP: 0.0789, PD: 0.9211, PIC: 0.7591, PE: 0.5990 },
  d18s51: { N: 442, Na: 18, Ho: 0.9186, He: 0.8872, MP: 0.0261, PD: 0.9739, PIC: 0.8762, PE: 0.8335 },
  d19s433: { N: 431, Na: 15, Ho: 0.8260, He: 0.8178, MP: 0.0568, PD: 0.9432, PIC: 0.7958, PE: 0.6481 },
  d21s11: { N: 435, Na: 19, Ho: 0.8460, He: 0.8448, MP: 0.0420, PD: 0.9580, PIC: 0.8274, PE: 0.6870 },
  d22s1045: { N: 360, Na: 10, Ho: 0.8000, He: 0.7535, MP: 0.1131, PD: 0.8869, PIC: 0.7174, PE: 0.5990 },
  fga: { N: 373, Na: 23, Ho: 0.8767, He: 0.8776, MP: 0.0290, PD: 0.9710, PIC: 0.8651, PE: 0.7481 },
  pentad: { N: 357, Na: 13, Ho: 0.8319, He: 0.8549, MP: 0.0404, PD: 0.9596, PIC: 0.8379, PE: 0.6596 },
  pentae: { N: 374, Na: 14, Ho: 0.8717, He: 0.8998, MP: 0.0207, PD: 0.9793, PIC: 0.8914, PE: 0.7380 },
  th01: { N: 446, Na: 7, Ho: 0.7758, He: 0.7977, MP: 0.0725, PD: 0.9275, PIC: 0.7660, PE: 0.5549 },
  tpox: { N: 435, Na: 9, Ho: 0.7218, He: 0.7021, MP: 0.1374, PD: 0.8626, PIC: 0.6585, PE: 0.4628 },
  vwa: { N: 364, Na: 10, Ho: 0.8132, He: 0.8116, MP: 0.0627, PD: 0.9373, PIC: 0.7853, PE: 0.6237 },
};

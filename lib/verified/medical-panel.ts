/**
 * The loci of STRhub Verified's medical STR slices, by gene symbol.
 *
 * Mirrors datasets/illumina-bam-hg38-med/loci.bed in the engine: the STRchive
 * disease-associated loci that at least 3 of 4 medical tool catalogs ship
 * (ExpansionHunter, TRGT, STRipy, str-analysis), as chosen by
 * harness/build_medical_candidates.py and kept by harness/build_panel.py. The
 * PacBio HiFi medical slice covers the same loci. Source of truth is that BED;
 * keep in sync.
 */
export const MEDICAL_PANEL_LOCI = [
  "DAB1", "NOTCH2NLC", "STARD7", "AFF3", "HOXD13", "GLS", "ATXN7", "CNBP",
  "FOXL2", "YEATS2", "HTT", "RFC1", "PHOX2B", "RAPGEF2", "MARCHF6", "PPP2R2B",
  "ATXN1", "RUNX2", "TBP", "HOXA13", "LRP12", "SAMD12", "C9orf72", "FXN",
  "NUTM2B-AS1", "CBL", "ATN1", "DIP2B", "ATXN2", "ATXN8OS", "ZIC2", "PABPN1",
  "ATXN3", "NIPA1", "XYLT1", "TNRC6A", "BEAN1", "JPH3", "TCF4", "CACNA1A",
  "GIPC1", "COMP", "DMPK", "NOP56", "CSTB", "ATXN10", "ARX", "AR", "SOX3",
  "FMR1", "AFF2",
];

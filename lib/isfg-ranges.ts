// ISFG minimum ranges in GRCh38 for the 22 loci the FASTA Generator builds: the
// 20 CODIS core loci plus Penta D and Penta E.
//
// Copy of data/isfg_ranges_grch38.tsv in github.com/Tfronta/strhub-demo-data
// (main, commit 1c431bc; SHA-256 of the file
// 891ca09b1cbc48505aa443ce19fa8245196f641d06ae4cb939ab6401be0c079b), same rows
// in the same order. That table comes from the STRidER Forensic STR Sequence
// Guide (FSSG v6-1, sheet "Common Locus Information", column "ISFG Minimum
// Range GRCh38 Coordinates"), the material associated with Recommendation 3 of
// Gettings et al. (2024), Forensic Science International: Genetics 68:102946,
// https://doi.org/10.1016/j.fsigen.2023.102946.
// lib/isfg-ranges.test.ts checks every row against this repo's own FSSG
// extraction (data/fssg_motif_data.json).
//
// - start/end: 1-based, inclusive (lengthBp = end - start + 1).
// - ceRef: CE allele designation of the GRCh38 reference over the range.
// - strnaming: forward-strand repeat structure in STRNaming format; [n] marks
//   the blocks whose copy number varies between alleles. D7S820 ends in
//   "_-1T>-", a flank variant in STRNaming notation (the T at position -1 of
//   GRCh38, just before the repeat region, deleted). It is not part of the
//   repeat structure.

export interface IsfgRange {
  locus: string;
  chrom: string;
  start: number;
  end: number;
  lengthBp: number;
  ceRef: number;
  strnaming: string;
}

export const ISFG_RANGES_SOURCE = {
  file: "data/isfg_ranges_grch38.tsv",
  repo: "https://github.com/Tfronta/strhub-demo-data",
  commit: "1c431bc",
  sha256: "891ca09b1cbc48505aa443ce19fa8245196f641d06ae4cb939ab6401be0c079b",
  fssg: "FSSG v6-1 (STRidER), sheet Common Locus Information",
  doi: "10.1016/j.fsigen.2023.102946",
} as const;

export const ISFG_RANGES_GRCH38: readonly IsfgRange[] = [
  { locus: "PentaE", chrom: "chr15", start: 96831008, end: 96831044, lengthBp: 37, ceRef: 5, strnaming: "TTTTC[n]" },
  { locus: "TH01", chrom: "chr11", start: 2171082, end: 2171120, lengthBp: 39, ceRef: 7, strnaming: "TGAA[n]" },
  { locus: "TPOX", chrom: "chr2", start: 1489647, end: 1489692, lengthBp: 46, ceRef: 8, strnaming: "TGAA[n]" },
  { locus: "D16S539", chrom: "chr16", start: 86352698, end: 86352749, lengthBp: 52, ceRef: 11, strnaming: "GATA[n]" },
  { locus: "D5S818", chrom: "chr5", start: 123775548, end: 123775603, lengthBp: 56, ceRef: 11, strnaming: "TCTA[n]" },
  { locus: "D2S441", chrom: "chr2", start: 68011943, end: 68011999, lengthBp: 57, ceRef: 12, strnaming: "TCTA[n]" },
  { locus: "D22S1045", chrom: "chr22", start: 37140283, end: 37140341, lengthBp: 59, ceRef: 17, strnaming: "ATT[n]ACT[1]ATT[2]" },
  { locus: "D10S1248", chrom: "chr10", start: 129294239, end: 129294299, lengthBp: 61, ceRef: 13, strnaming: "GGAA[n]" },
  { locus: "CSF1PO", chrom: "chr5", start: 150076318, end: 150076380, lengthBp: 63, ceRef: 13, strnaming: "TCTA[n]" },
  { locus: "D8S1179", chrom: "chr8", start: 124894859, end: 124894922, lengthBp: 64, ceRef: 13, strnaming: "TATC[n]" },
  { locus: "D3S1358", chrom: "chr3", start: 45540733, end: 45540807, lengthBp: 75, ceRef: 16, strnaming: "TATC[2]TGTC[n]TATC[n]" },
  { locus: "D7S820", chrom: "chr7", start: 84160200, end: 84160281, lengthBp: 82, ceRef: 13, strnaming: "A[n]CTAT[1]CAATCTGT[1]CTAT[n]_-1T>-" },
  { locus: "D13S317", chrom: "chr13", start: 82148021, end: 82148104, lengthBp: 84, ceRef: 11, strnaming: "TATC[n]AATC[2]ATCT[3]" },
  { locus: "D1S1656", chrom: "chr1", start: 230769601, end: 230769687, lengthBp: 87, ceRef: 17, strnaming: "AC[n]CTAT[n]" },
  { locus: "D12S391", chrom: "chr12", start: 12297011, end: 12297099, lengthBp: 89, ceRef: 19, strnaming: "TAGA[n]CAGA[n]" },
  { locus: "D19S433", chrom: "chr19", start: 29926212, end: 29926303, lengthBp: 92, ceRef: 14, strnaming: "TCCT[n]" },
  { locus: "D18S51", chrom: "chr18", start: 63281663, end: 63281756, lengthBp: 94, ceRef: 18, strnaming: "GAAA[n]A[1]AG[4]GAAA[2]" },
  { locus: "vWA", chrom: "chr12", start: 5983954, end: 5984049, lengthBp: 96, ceRef: 17, strnaming: "GGAT[n]AGAT[1]GGAT[1]AGAT[n]AGAC[n]AGAT[2]" },
  { locus: "PentaD", chrom: "chr21", start: 43636185, end: 43636282, lengthBp: 98, ceRef: 13, strnaming: "A[8]GAAAG[1]AAAAG[n]A[6]" },
  { locus: "FGA", chrom: "chr4", start: 154587729, end: 154587827, lengthBp: 99, ceRef: 22, strnaming: "GAAG[1]AAAG[1]GAAG[2]GAG[1]AAAG[n]AGAAA[1]AAAG[3]" },
  { locus: "D2S1338", chrom: "chr2", start: 218014855, end: 218014954, lengthBp: 100, ceRef: 23, strnaming: "GGAA[n]GGCA[n]" },
  { locus: "D21S11", chrom: "chr21", start: 19181969, end: 19182105, lengthBp: 137, ceRef: 29, strnaming: "TCTA[n]TCTG[n]TCTA[n]TATC[n]A[1]TCTA[2]TCCA[1]TATC[n]" },
];

/** ISFG minimum range of a locus, by the name the slices use ("PentaD", "vWA"). */
export function getIsfgRange(locus: string): IsfgRange | undefined {
  return ISFG_RANGES_GRCH38.find((r) => r.locus === locus);
}

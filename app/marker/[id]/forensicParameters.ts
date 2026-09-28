/**
 * Forensic parameters of one locus in one population, as printed in the source
 * table: N (individuals typed) and Na (distinct alleles) whole, the rest to four
 * decimals. Used for the NGS datasets (1000 Genomes ST3, RAO ST9).
 */
export type ForensicParameters = {
  N: number;
  Na: number;
  Ho: number;
  He: number;
  MP: number;
  PD: number;
  PIC: number;
  PE: number;
};

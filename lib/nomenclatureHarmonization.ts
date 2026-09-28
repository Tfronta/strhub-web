/**
 * Loci counted differently across kits, harmonized by Bodner et al. 2024,
 * "Harmonizing the forensic nomenclature for STR loci D6S474 and DYS612"
 * (FSI Genet 70:103012), which asks that the difference be pointed out wherever
 * the locus is reported. Each id needs a marker.nomenclatureNotes.<id> string.
 * Kept free of data imports so client pages (the Motif Explorer) can use it.
 */
export const HARMONIZED_NOMENCLATURE = new Set(["d6s474", "dys612"]);

export const HARMONIZATION_PAPER_URL = "https://doi.org/10.1016/j.fsigen.2024.103012";

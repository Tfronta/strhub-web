// Citation for every FSSG-derived value on STRhub (marker pages, STR Motif
// Explorer, STRNaming names, Mix Profiles ranges), written everywhere as
// "FSSG v6.1 (STRidER; distributed as FSSG_v6-1_beta.xlsx)". Kept apart from the
// FSSG data so client components can cite it without bundling the data file.
//
// STRidER's nomenclature page links this file as the most recent FSSG. The copy
// downloaded on the access date below has the same SHA-256 as the one the data
// were extracted from.
export const FSSG_SOURCE = {
  version: "FSSG v6.1",
  publisher: "STRidER",
  file: "FSSG_v6-1_beta.xlsx",
  accessed: "2026-09-28",
  sha256: "acf2fa7f16e911474152e52654e77c160d7b34f3d7a72e158def303fff9449e1",
  url: "https://strider.online/nomenclature",
} as const;

// Multilingual glossary library for STR-related terms
// Terms are organized alphabetically by English term

export interface GlossaryTerm {
  en: string;
  es: string;
  pt: string;
}

export const glossary: GlossaryTerm[] = [
  {
    en: "Tetranucleotide",
    es: "Tetranucleótido",
    pt: "Tetranucleotídeo",
  },
  {
    en: "Trinucleotide",
    es: "Trinucleótido",
    pt: "Trinucleotídeo",
  },
];

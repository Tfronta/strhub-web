// Single source of truth for STR nomenclature glossary terms.
// Used by the <InfoTip> component (short, on-hover definitions) and, when the
// Foundations article is published, deep-linked to its glossary section.
//
// Keep definitions short (1-2 lines): they render inside a tooltip.

import type { Language } from "@/lib/translations";

export type GlossaryTermKey =
  | "ceAllele"
  | "mpsAllele"
  | "strnamingName"
  | "minimumRange"
  | "kitRange"
  | "lengthAdjustment"
  | "isoallele"
  | "coreRepeat"
  | "flankingRegion"
  | "strbaseSequence"
  | "alleleRange"
  | "canonicalMotif"
  | "historicalMotif";

type Entry = { term: string; short: string; anchor: string };

export const NOMENCLATURE_GLOSSARY: Record<GlossaryTermKey, Record<Language, Entry>> = {
  ceAllele: {
    en: { term: "CE allele", anchor: "ce-allele", short: "Length-based allele number from capillary electrophoresis (fragment size). The traditional, kit-independent designation, e.g. 8 or 9.3." },
    es: { term: "Alelo CE", anchor: "ce-allele", short: "Número de alelo por longitud (electroforesis capilar). La designación tradicional, independiente del kit, ej. 8 o 9.3." },
    pt: { term: "Alelo CE", anchor: "ce-allele", short: "Número de alelo por comprimento (eletroforese capilar). A designação tradicional, independente do kit, ex. 8 ou 9.3." },
  },
  mpsAllele: {
    en: { term: "Sequence-based (MPS) allele", anchor: "mps-allele", short: "Allele defined by its actual sequence, not only length. Two alleles of the same CE size can differ in sequence." },
    es: { term: "Alelo por secuencia (MPS)", anchor: "mps-allele", short: "Alelo definido por su secuencia real, no solo por longitud. Dos alelos del mismo tamaño CE pueden diferir en secuencia." },
    pt: { term: "Alelo por sequência (MPS)", anchor: "mps-allele", short: "Alelo definido pela sua sequência real, não só pelo comprimento. Dois alelos do mesmo tamanho CE podem diferir na sequência." },
  },
  strnamingName: {
    en: { term: "STRNaming name", anchor: "strnaming-name", short: "Standardized sequence allele name: CE<n>_ plus the repeat structure in MOTIF[n] blocks, plus any sequence variants." },
    es: { term: "Nombre STRNaming", anchor: "strnaming-name", short: "Nombre estandarizado del alelo por secuencia: CE<n>_ más la estructura en bloques MOTIF[n], más las variantes de secuencia." },
    pt: { term: "Nome STRNaming", anchor: "strnaming-name", short: "Nome padronizado do alelo por sequência: CE<n>_ mais a estrutura em blocos MOTIF[n], mais as variantes de sequência." },
  },
  minimumRange: {
    en: { term: "ISFG minimum range", anchor: "minimum-range", short: "The minimum genomic window the ISFG 2024 recommendations define for reporting a locus. It is the region common to all kits, so names stay comparable. STRhub reports on it." },
    es: { term: "ISFG minimum range", anchor: "minimum-range", short: "La ventana genómica mínima que la recomendación ISFG 2024 define para reportar un locus. Es la región común a todos los kits, así los nombres son comparables. STRhub reporta sobre ella." },
    pt: { term: "ISFG minimum range", anchor: "minimum-range", short: "A janela genômica mínima que a recomendação ISFG 2024 define para reportar um locus. É a região comum a todos os kits, mantendo os nomes comparáveis. O STRhub reporta sobre ela." },
  },
  kitRange: {
    en: { term: "Kit range", anchor: "kit-range", short: "The window a specific MPS kit actually sequences. It varies by kit and usually differs from the minimum range, so raw kit output can look longer or shorter." },
    es: { term: "Kit range", anchor: "kit-range", short: "La ventana que realmente secuencia un kit MPS. Varía por kit y suele diferir del minimum range, por eso la salida cruda puede verse más larga o corta." },
    pt: { term: "Kit range", anchor: "kit-range", short: "A janela que um kit MPS realmente sequencia. Varia por kit e costuma diferir do minimum range, por isso a saída bruta pode parecer maior ou menor." },
  },
  lengthAdjustment: {
    en: { term: "Length adjustment", anchor: "length-adjustment", short: "A fixed per-locus offset (historical ladder calibration) that makes the CE number differ from the raw block count, e.g. vWA subtracts 5 repeats." },
    es: { term: "Length adjustment", anchor: "length-adjustment", short: "Un offset fijo por locus (calibración histórica de la escalera) que hace que el número CE difiera del conteo crudo de bloques, ej. vWA resta 5 repeticiones." },
    pt: { term: "Length adjustment", anchor: "length-adjustment", short: "Um deslocamento fixo por locus (calibração histórica da escada) que faz o número CE diferir da contagem bruta de blocos, ex. vWA subtrai 5 repetições." },
  },
  isoallele: {
    en: { term: "Isoallele", anchor: "isoallele", short: "Two alleles with the same CE number but a different sequence within the reported range." },
    es: { term: "Isoalelo", anchor: "isoallele", short: "Dos alelos con el mismo número CE pero secuencia distinta dentro del rango reportado." },
    pt: { term: "Isoalelo", anchor: "isoallele", short: "Dois alelos com o mesmo número CE mas sequência diferente dentro do intervalo reportado." },
  },
  coreRepeat: {
    en: { term: "Core repeat region", anchor: "core-repeat", short: "The run of repeat units that defines the allele. Only these count toward the allele designation." },
    es: { term: "Región core de repetición", anchor: "core-repeat", short: "El bloque de repeticiones que define el alelo. Solo estas cuentan para la designación." },
    pt: { term: "Região core de repetição", anchor: "core-repeat", short: "O bloco de repetições que define o alelo. Apenas estas contam para a designação." },
  },
  flankingRegion: {
    en: { term: "Flanking region", anchor: "flanking-region", short: "Sequence just outside the core repeat. It is not counted in the allele size, but it can carry variants named by position." },
    es: { term: "Región flanqueante", anchor: "flanking-region", short: "Secuencia justo por fuera del core. No cuenta para el tamaño del alelo, pero puede llevar variantes nombradas por posición." },
    pt: { term: "Região flanqueadora", anchor: "flanking-region", short: "Sequência logo fora do core. Não conta para o tamanho do alelo, mas pode carregar variantes nomeadas por posição." },
  },
  strbaseSequence: {
    en: { term: "STRbase sequence", anchor: "mps-allele", short: "Full allele sequences catalogued by STRbase (NIST), reported over STRbase's own sequence window, which can differ from the ISFG minimum range used for STRNaming names. Ranges can vary between databases, so compare alleles with the sequence range in mind." },
    es: { term: "Secuencia STRbase", anchor: "mps-allele", short: "Secuencias completas del alelo catalogadas por STRbase (NIST), reportadas sobre la ventana propia de STRbase, que puede diferir del ISFG minimum range que usan los nombres STRNaming. Los rangos pueden variar entre bases de datos, así que compará los alelos teniendo en cuenta el rango de secuencia." },
    pt: { term: "Sequência STRbase", anchor: "mps-allele", short: "Sequências completas do alelo catalogadas pelo STRbase (NIST), reportadas sobre a janela do próprio STRbase, que pode diferir do ISFG minimum range usado pelos nomes STRNaming. Os intervalos podem variar entre bases de dados, então compare os alelos considerando o intervalo de sequência." },
  },
  alleleRange: {
    en: { term: "Allele range", anchor: "ce-allele", short: "The range of allele sizes (length-based, CE) reported for this marker. It reflects the alleles seen in the reference data and can vary by population and kit, so treat it as typical rather than an absolute limit." },
    es: { term: "Rango de alelos", anchor: "ce-allele", short: "El rango de tamaños de alelo (por longitud, CE) reportado para este marcador. Refleja los alelos vistos en los datos de referencia y puede variar por población y kit, así que tomalo como típico y no como un límite absoluto." },
    pt: { term: "Faixa de alelos", anchor: "ce-allele", short: "A faixa de tamanhos de alelo (por comprimento, CE) reportada para este marcador. Reflete os alelos vistos nos dados de referência e pode variar por população e kit, então trate-a como típica e não como um limite absoluto." },
  },
  canonicalMotif: {
    en: { term: "Canonical motif (2024)", anchor: "canonical-motif", short: "The repeat structure of the ISFG minimum range written in STRNaming (2024) format as MOTIF[n] blocks. This is the current standard bracketing and can differ from older schemes." },
    es: { term: "Motivo canónico (2024)", anchor: "canonical-motif", short: "La estructura de repetición del ISFG minimum range en formato STRNaming (2024), como bloques MOTIF[n]. Es el bracketing estándar actual y puede diferir de esquemas anteriores." },
    pt: { term: "Motivo canônico (2024)", anchor: "canonical-motif", short: "A estrutura de repetição do ISFG minimum range no formato STRNaming (2024), como blocos MOTIF[n]. É o bracketing padrão atual e pode diferir de esquemas anteriores." },
  },
  historicalMotif: {
    en: { term: "Historical bracketing (2016)", anchor: "historical-motif", short: "The 2016-2023 bracketing (STRbase / NIST style, e.g. [AATG]8), often defined over a wider window than the ISFG minimum range. Shown for continuity with legacy reports." },
    es: { term: "Bracketing histórico (2016)", anchor: "historical-motif", short: "El bracketing 2016-2023 (estilo STRbase / NIST, ej. [AATG]8), a menudo definido sobre una ventana más ancha que el ISFG minimum range. Se muestra para continuidad con reportes previos." },
    pt: { term: "Bracketing histórico (2016)", anchor: "historical-motif", short: "O bracketing 2016-2023 (estilo STRbase / NIST, ex. [AATG]8), muitas vezes definido sobre uma janela mais ampla que o ISFG minimum range. Mostrado para continuidade com relatórios anteriores." },
  },
};

// Foundations article that will host the full glossary. Flip
// GLOSSARY_ARTICLE_PUBLISHED to true (and confirm the slug) once the Contentful
// article exists, so the "learn more" link appears in tooltips and deep-links
// to each term anchor.
export const GLOSSARY_ARTICLE_SLUG = "str-sequence-nomenclature";
export const GLOSSARY_ARTICLE_PUBLISHED = false;

export function glossaryArticleHref(language: Language, anchor?: string): string {
  const base = `/basics/${language}/${GLOSSARY_ARTICLE_SLUG}`;
  return anchor ? `${base}#${anchor}` : base;
}

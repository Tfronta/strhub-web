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
  | "strbaseStrnamingName"
  | "canonicalMotif"
  | "historicalMotif";

type Entry = { term: string; short: string; anchor: string };

export const NOMENCLATURE_GLOSSARY: Record<GlossaryTermKey, Record<Language, Entry>> = {
  ceAllele: {
    en: { term: "CE allele", anchor: "ce-allele", short: "Length-based allele number from capillary electrophoresis (fragment size), e.g. 8 or 9.3. It follows the calibrated length convention of each locus; check compatibility between kits and systems, since a flanking indel inside the amplicon also changes the size." },
    es: { term: "Alelo CE", anchor: "ce-allele", short: "Número de alelo por longitud (electroforesis capilar), ej. 8 o 9.3. Sigue la convención de longitud calibrada de cada locus; conviene verificar la compatibilidad entre kits y sistemas, porque un indel flanqueante dentro del amplicón también cambia el tamaño." },
    pt: { term: "Alelo CE", anchor: "ce-allele", short: "Número de alelo por comprimento (eletroforese capilar), ex. 8 ou 9.3. Segue a convenção de comprimento calibrada de cada locus; convém verificar a compatibilidade entre kits e sistemas, porque um indel flanqueador dentro do amplicon também altera o tamanho." },
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
    en: { term: "ISFG minimum range", anchor: "minimum-range", short: "The minimum genomic window the ISFG 2024 recommendations define for reporting and comparing alleles by sequence. Not every kit covers it completely; any bases filled in from the reference should be flagged, with their source. STRhub reports on it." },
    es: { term: "ISFG minimum range", anchor: "minimum-range", short: "La ventana genómica mínima que la recomendación ISFG 2024 define para reportar y comparar alelos por secuencia. No todos los kits la cubren completamente; si se completan bases desde la referencia, deben identificarse junto con su fuente. STRhub reporta sobre ella." },
    pt: { term: "ISFG minimum range", anchor: "minimum-range", short: "A janela genômica mínima que a recomendação ISFG 2024 define para reportar e comparar alelos por sequência. Nem todos os kits a cobrem completamente; se bases forem completadas a partir da referência, devem ser identificadas junto com sua fonte. O STRhub reporta sobre ela." },
  },
  kitRange: {
    en: { term: "Kit range", anchor: "kit-range", short: "The window a specific MPS kit actually sequences. It varies by kit, usually differs from the minimum range and does not always cover all of it, so raw kit output can look longer or shorter." },
    es: { term: "Kit range", anchor: "kit-range", short: "La ventana que realmente secuencia un kit MPS. Varía por kit, suele diferir del minimum range y no siempre lo cubre por completo, por eso la salida cruda puede verse más larga o corta." },
    pt: { term: "Kit range", anchor: "kit-range", short: "A janela que um kit MPS realmente sequencia. Varia por kit, costuma diferir do minimum range e nem sempre o cobre por completo, por isso a saída bruta pode parecer maior ou menor." },
  },
  lengthAdjustment: {
    en: { term: "Length adjustment", anchor: "length-adjustment", short: "A per-locus offset (historical ladder calibration) that makes the CE number differ from the raw block count over the ISFG minimum range, e.g. in vWA 19 blocks give CE 14. It is specific to each locus, not a general rule." },
    es: { term: "Length adjustment", anchor: "length-adjustment", short: "Un offset por locus (calibración histórica de la escalera) que hace que el número CE difiera del conteo crudo de bloques sobre el ISFG minimum range, ej. en vWA 19 bloques dan CE 14. Es propio de cada locus, no una regla general." },
    pt: { term: "Length adjustment", anchor: "length-adjustment", short: "Um deslocamento por locus (calibração histórica da escada) que faz o número CE diferir da contagem bruta de blocos sobre o ISFG minimum range, ex. no vWA 19 blocos dão CE 14. É próprio de cada locus, não uma regra geral." },
  },
  isoallele: {
    en: { term: "Isoallele", anchor: "isoallele", short: "Two alleles with the same CE number but a different sequence within the reported range." },
    es: { term: "Isoalelo", anchor: "isoallele", short: "Dos alelos con el mismo número CE pero secuencia distinta dentro del rango reportado." },
    pt: { term: "Isoalelo", anchor: "isoallele", short: "Dois alelos com o mesmo número CE mas sequência diferente dentro do intervalo reportado." },
  },
  coreRepeat: {
    en: { term: "Core repeat region", anchor: "core-repeat", short: "The run of repeat units that gives the allele its structure and most of its length variation. The CE number follows each locus's length convention, so adding up blocks does not always give it (e.g. vWA, D6S474)." },
    es: { term: "Región core de repetición", anchor: "core-repeat", short: "El bloque de repeticiones que da al alelo su estructura y la mayor parte de su variación de longitud. El número CE sigue la convención de longitud de cada locus, así que sumar los bloques no siempre lo da (ej. vWA, D6S474)." },
    pt: { term: "Região core de repetição", anchor: "core-repeat", short: "O bloco de repetições que dá ao alelo sua estrutura e a maior parte de sua variação de comprimento. O número CE segue a convenção de comprimento de cada locus, então somar os blocos nem sempre o dá (ex. vWA, D6S474)." },
  },
  flankingRegion: {
    en: { term: "Flanking region", anchor: "flanking-region", short: "Sequence just outside the core repeat. It can carry SNPs and indels, named by position; an indel inside the amplicon changes the fragment length and can affect CE concordance." },
    es: { term: "Región flanqueante", anchor: "flanking-region", short: "Secuencia justo por fuera del core. Puede llevar SNP e indels, nombrados por posición; un indel dentro del amplicón cambia la longitud del fragmento y puede afectar la concordancia con CE." },
    pt: { term: "Região flanqueadora", anchor: "flanking-region", short: "Sequência logo fora do core. Pode carregar SNPs e indels, nomeados por posição; um indel dentro do amplicon altera o comprimento do fragmento e pode afetar a concordância com CE." },
  },
  strbaseSequence: {
    en: { term: "STRbase sequence", anchor: "mps-allele", short: "Full allele sequences catalogued by STRbase (NIST), reported over STRbase's own sequence window, which can differ from the ISFG minimum range used for STRNaming names. Ranges can vary between databases, so compare alleles with the sequence range in mind." },
    es: { term: "Secuencia STRbase", anchor: "mps-allele", short: "Secuencias completas del alelo catalogadas por STRbase (NIST), reportadas sobre la ventana propia de STRbase, que puede diferir del ISFG minimum range que usan los nombres STRNaming. Los rangos pueden variar entre bases de datos, así que compará los alelos teniendo en cuenta el rango de secuencia." },
    pt: { term: "Sequência STRbase", anchor: "mps-allele", short: "Sequências completas do alelo catalogadas pelo STRbase (NIST), reportadas sobre a janela do próprio STRbase, que pode diferir do ISFG minimum range usado pelos nomes STRNaming. Os intervalos podem variar entre bases de dados, então compare os alelos considerando o intervalo de sequência." },
  },
  strbaseStrnamingName: {
    en: { term: "STRNaming name (ISFG 2024)", anchor: "strnaming-name", short: "Name generated with STRNaming 1.2.1 over the ISFG minimum range (GRCh38 forward strand), as CE allele plus repeat blocks. STRbase sequences that differ only outside that range share a name. A name is shown only when its CE matches the STRbase designation; n/a means the STRbase sequence does not span that range; a blank cell means the name is still being validated." },
    es: { term: "Nombre STRNaming (ISFG 2024)", anchor: "strnaming-name", short: "Nombre generado con STRNaming 1.2.1 sobre el ISFG minimum range (hebra forward de GRCh38), como alelo CE más bloques de repetición. Las secuencias de STRbase que solo difieren fuera de ese rango comparten nombre. Se muestra solo cuando su CE coincide con la designación de STRbase; n/a indica que la secuencia de STRbase no cubre ese rango; una celda vacía indica que el nombre todavía se está validando." },
    pt: { term: "Nome STRNaming (ISFG 2024)", anchor: "strnaming-name", short: "Nome gerado com o STRNaming 1.2.1 sobre o ISFG minimum range (fita forward do GRCh38), como alelo CE mais blocos de repetição. Sequências do STRbase que diferem só fora dessa faixa compartilham o nome. É mostrado só quando seu CE coincide com a designação do STRbase; n/a indica que a sequência do STRbase não cobre essa faixa; uma célula vazia indica que o nome ainda está sendo validado." },
  },
  canonicalMotif: {
    en: { term: "Canonical motif (2024)", anchor: "canonical-motif", short: "STRidER's template for the common alleles of a locus over the ISFG minimum range, in STRNaming format: MOTIF[count] blocks, with [n] where the count varies between alleles. A full allele name adds the CE prefix and every count, e.g. CE13_TCTA[13]. It can differ from older bracketing schemes." },
    es: { term: "Motivo canónico (2024)", anchor: "canonical-motif", short: "Plantilla de STRidER para los alelos comunes de un locus sobre el ISFG minimum range, en formato STRNaming: bloques MOTIF[número], con [n] donde el número varía entre alelos. Un nombre de alelo completo agrega el prefijo CE y todos los números, ej. CE13_TCTA[13]. Puede diferir de esquemas de bracketing anteriores." },
    pt: { term: "Motivo canônico (2024)", anchor: "canonical-motif", short: "Modelo do STRidER para os alelos comuns de um locus sobre o ISFG minimum range, no formato STRNaming: blocos MOTIF[número], com [n] onde o número varia entre alelos. Um nome de alelo completo acrescenta o prefixo CE e todos os números, ex. CE13_TCTA[13]. Pode diferir de esquemas de bracketing anteriores." },
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

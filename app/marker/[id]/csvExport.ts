// CSV contracts for the marker page downloads. Column names are stable and in
// English so a file can be read by scripts; every row says where its values
// come from, so a file still makes sense apart from the page it came from.

import type { VariantName } from "@/lib/marker-summary";

/** RFC 4180: every cell quoted, inner quotes doubled. */
export function toCsv(rows: ReadonlyArray<ReadonlyArray<string | number | null>>): string {
  return rows
    .map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","))
    .join("\n");
}

// ---------------------------------------------------------------------------
// Variant Alleles (STRbase sequences and their STRNaming names)

export const VARIANT_CSV_COLUMNS = [
  "locus",
  "strbase_allele",
  "strbase_sequence",
  "isfg_minimum_range",
  "isfg_minimum_sequence",
  "strnaming_name",
  "status",
  "status_note",
  "strnaming_version",
  "fssg_version",
] as const;

const STRNAMING_VERSION = "STRNaming 1.2.1";

function variantNote(name: VariantName | undefined, allele: string): string {
  if (!name) return "No STRNaming name computed for this locus";
  if (name.status === "ok") {
    return "Name given by STRNaming for isfg_minimum_sequence over isfg_minimum_range";
  }
  if (name.status === "held") {
    return `Held for review: STRNaming gives CE${name.heldCe ?? "?"} for isfg_minimum_sequence, the STRbase designation is ${allele}; no name published`;
  }
  return "The STRbase sequence does not span the ISFG minimum range; no name";
}

export function variantAllelesCsv(input: {
  locus: string;
  sequences: ReadonlyArray<{ allele: string | number; sequence: string }>;
  names: ReadonlyArray<VariantName> | null;
  minimumRange: { chrom: string; start: number; end: number } | null;
  fssgVersion: string;
}): string {
  const range = input.minimumRange
    ? `${input.minimumRange.chrom}:${input.minimumRange.start}-${input.minimumRange.end} (GRCh38, forward strand)`
    : "";
  return toCsv([
    [...VARIANT_CSV_COLUMNS],
    ...input.sequences.map((seq, i) => {
      const allele = String(seq.allele);
      const name = input.names?.[i];
      return [
        input.locus,
        allele,
        seq.sequence,
        name?.isfg ? range : "",
        name?.isfg ?? "",
        name?.name ?? "",
        name?.status ?? "",
        variantNote(name, allele),
        name ? STRNAMING_VERSION : "",
        name?.isfg ? input.fssgVersion : "",
      ];
    }),
  ]);
}

// ---------------------------------------------------------------------------
// Population frequencies

export const FREQUENCY_CSV_COLUMNS = [
  "locus",
  "technology",
  "allele_type",
  "population",
  "allele",
  "frequency",
  "count",
  "source",
  "reference",
] as const;

export type FrequencySource = {
  /** "CE", "NGS", or "" when the dataset does not state it. */
  technology: "CE" | "NGS" | "";
  alleleType: string;
  source: string;
  reference: string;
  /** False when the dataset gives no allele counts (pop.STR, X-STR tables): count is left empty, not 0. */
  countKnown: boolean;
};

const LENGTH_FROM_NGS =
  "Length-based allele (fragment length from NGS data; no sequence reported)";

export const POPSTR_CE: FrequencySource = {
  technology: "CE",
  alleleType: "Length-based allele (capillary electrophoresis)",
  source: "pop.STR / SP-SMART, STRs Local dataset (CESGA)",
  reference:
    "Amigo J, Phillips C, Lareu MV, Carracedo A (2008). The SNPforID and SP-SMART databases: Resources for forensic population genetics. Forensic Sci Int Genet 2(3):212-217. http://spsmart.cesga.es/",
  countKnown: false,
};

export const NGS_1000G: FrequencySource = {
  technology: "NGS",
  alleleType: LENGTH_FROM_NGS,
  source: "1000 Genomes Project, high-coverage whole-genome sequencing genotyped with HipSTR",
  reference:
    "Frontanilla TS, Valle-Silva G, Ayala J, Mendes-Junior CT (2022). Open-Access Worldwide Population STR Database Constructed Using High-Coverage Massively Parallel Sequencing Data Obtained from the 1000 Genomes Project. Genes 13(12):2205. https://doi.org/10.3390/genes13122205",
  countKnown: true,
};

export const NGS_RAO: FrequencySource = {
  technology: "NGS",
  alleleType: LENGTH_FROM_NGS,
  source: "Ribeirão Preto (São Paulo, Brazil), genotyped with HipSTR (Supplementary Table 9)",
  reference:
    "Valle-Silva G, Frontanilla T, Ayala J, Donadi EA et al. (2022). Analysis and comparison of the STR genotypes called with HipSTR, STRait Razor and toaSTR by using next generation sequencing data in a Brazilian population sample. Forensic Sci Int Genet 58:102676. https://doi.org/10.1016/j.fsigen.2022.102676",
  countKnown: true,
};

/** X-STR tables: the technology is the one described in the cited publication. */
export function xstrSource(citation: string, url: string): FrequencySource {
  return {
    technology: "",
    alleleType: "Allele designation as published",
    source: "Published X-STR population table",
    reference: [citation, url].filter(Boolean).join(". "),
    countKnown: false,
  };
}

export type FrequencyRow = {
  population: string;
  allele: string;
  frequency: number;
  count?: number | null;
};

export function frequencyCsv(
  locus: string,
  rows: ReadonlyArray<FrequencyRow>,
  sourceFor: (population: string) => FrequencySource,
): string {
  return toCsv([
    [...FREQUENCY_CSV_COLUMNS],
    ...rows.map((row) => {
      const src = sourceFor(row.population);
      return [
        locus,
        src.technology,
        src.alleleType,
        row.population,
        row.allele,
        // The stored value, unrounded.
        String(row.frequency),
        src.countKnown && row.count != null ? String(row.count) : "",
        src.source,
        src.reference,
      ];
    }),
  ]);
}

/** e.g. CSF1PO_CE_AFR_frequencies.csv, CSF1PO_NGS_ALL_frequencies.csv. */
export function frequencyCsvFilename(locus: string, dataset: string, population: string): string {
  return `${locus}_${dataset}_${population}_frequencies.csv`;
}

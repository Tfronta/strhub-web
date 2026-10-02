// Per-marker summary derived from the static datasets (markerData, pop.STR CE
// frequencies and statistics, 1000 Genomes NGS frequencies, STRidER FSSG).
//
// The marker page is a client component whose tabs mount lazily, so search
// engines only see the Overview. Everything here is plain data computed on the
// server and rendered into that Overview, which is also what makes each marker
// page distinct from the other 227.

import { markerData } from "@/lib/markerData";
import {
  markerFrequenciesCE,
  markerFrequenciesNGS,
  type CEPop,
} from "@/app/marker/[id]/markerFrequencies";
import { markerStatisticsCE } from "@/app/marker/[id]/markerStatisticsCE";
import {
  FSSG_MARKERS,
  isDisplayable,
  type FssgMarker,
} from "@/app/tools/str-motif-explorer/data/fssgData";
import { IGV_MARKER_IDS } from "@/app/tools/igv-viewer/markers";
import strnamingNames from "@/data/strnaming_names.json";
import { HARMONIZED_NOMENCLATURE } from "@/lib/nomenclatureHarmonization";

export type VariantNameStatus = "ok" | "held" | "not_covered";

type StrnamingNames = {
  reference: Record<string, string>;
  strbase: Record<string, Array<{ h: string; name: string | null; status: VariantNameStatus }>>;
};
// STRNaming 1.2.1 names over the ISFG minimum range, generated offline and
// verified (see the file's `source` block). Only verified names are stored.
const STRNAMING = strnamingNames as unknown as StrnamingNames;

/**
 * Date of the last change to what marker pages show: the datasets (markerData,
 * frequencies, statistics, FSSG file) or the page template itself. Bump it with
 * such changes: the sitemap reports it as lastmod for /catalog and every
 * marker page, and a stale value tells crawlers there is nothing new to fetch.
 */
export const MARKER_DATA_UPDATED = "2026-09-28";

export const CE_POPS: readonly CEPop[] = [
  "AFR",
  "NAM",
  "EAS",
  "CSA",
  "EUR",
  "MES",
  "OCE",
];

export type MarkerKind = "codis" | "ess" | "autosomal" | "x" | "y";

export type MarkerLink = { id: string; name: string };

export type GenomicSpan = {
  start: number;
  end: number;
  /** Repeat region length in bp (1-based inclusive coordinates). */
  lengthBp: number;
};

export type PopulationSummary = {
  pop: CEPop;
  /** Most frequent allele in this population and its frequency. */
  modalAllele: string;
  modalFrequency: number;
  /** Alleles with a non-zero frequency. */
  alleleCount: number;
  sampleSize: number | null;
  expectedHeterozygosity: number | null;
};

export type FrequencyTable = {
  pops: CEPop[];
  rows: Array<{ allele: string; byPop: Partial<Record<CEPop, number>> }>;
};

export type MarkerSummary = {
  id: string;
  name: string;
  chromosome: string;
  cytogeneticLocation: string | null;
  motif: string | null;
  alternativeMotifs: string[];
  /** "Tetranucleotide", "Pentanucleotide", ... as stored in markerData. */
  repeatType: string | null;
  kind: MarkerKind;
  referenceAllele: string | null;
  /**
   * True for the loci whose length-based designation differs between kits and was
   * harmonized by Bodner et al. 2024; the page states the difference, as the paper asks.
   */
  nomenclatureNote: boolean;
  grch38: GenomicSpan | null;
  grch37: GenomicSpan | null;
  fssg: {
    canonicalBracketing: string[];
    historicalBracketing: string | null;
    minimumRange: { chrom: string; start: number; end: number; lengthBp: number } | null;
    /** STRNaming 1.2.1 name of the GRCh38 reference allele over the ISFG minimum range, e.g. "CE13_TCTA[13]". */
    referenceName: string | null;
    /** MPS kits whose amplicon covers the locus, per STRidER's FSSG, each with the range it sequences (GRCh38). */
    kits: Array<{
      /** The product the range applies to: the FSSG column header, narrowed where the FSSG itself narrows it (see kitProduct). */
      name: string;
      /** The FSSG column header, verbatim. */
      fssgColumn: string;
      chrom: string;
      start: number;
      end: number;
      length: number;
      /** STRidER's qualifier from the same FSSG cell, verbatim (e.g. "Included in range of DYS460"), unless folded into name. */
      note: string | null;
    }>;
    /** The row's Notes cell, verbatim, in English as STRidER writes it. */
    notes: string | null;
  } | null;
  ce: { populations: PopulationSummary[]; table: FrequencyTable } | null;
  ngs: { populations: string[]; hasRao: boolean } | null;
  variants: { count: number; alleles: string[] } | null;
  /**
   * STRNaming names for the STRbase Variant Alleles, index-aligned with
   * markerData[id].sequences; name is null unless status is "ok".
   */
  variantNames: Array<{ name: string | null; status: VariantNameStatus }> | null;
  related: { sameChromosome: MarkerLink[]; sameKind: MarkerLink[] };
  tools: { motifExplorer: boolean; igv: boolean };
};

// markerData is typed from an `as const` literal; read it through a loose view.
type RawMarker = {
  name: string;
  chromosome: string;
  cytogeneticLocation: string | null;
  motif: string | null;
  alternativeMotifs: readonly string[] | null;
  type: string | null;
  category: string;
  coordinates: {
    start: number | null;
    end: number | null;
    grch37: { start: number | null; end: number | null } | null;
  } | null;
  sequences: readonly { allele: string }[];
  nistReference: { referenceAllele: string | number | null } | null;
};

const rawMarkers = markerData as unknown as Record<string, RawMarker>;

export function markerKind(category: string): MarkerKind {
  if (category === "CODIS Core") return "codis";
  if (category === "European Standard Set") return "ess";
  if (category === "X STRs" || category === "X-Chromosome STRs") return "x";
  if (category === "Y STRs" || category === "Y-Chromosome STRs") return "y";
  return "autosomal";
}

// FSSG rows are keyed by display name ("Penta E", "Y-GATA-H4", "DYS385 b");
// markerData by a slug. Match on a stripped lowercase form, with the few rows
// whose slug differs from the name listed by hand.
const FSSG_ALIASES: Record<string, string> = {
  dys385ab: "DYS385 b",
  dyf387s1: "DYF387S1 fragment 1",
};

const fssgByStrippedName: Record<string, string> = Object.fromEntries(
  Object.keys(FSSG_MARKERS).map((locus) => [
    locus.toLowerCase().replace(/[\s-]/g, ""),
    locus,
  ])
);

export function fssgFor(id: string): FssgMarker | null {
  const key = id.toLowerCase();
  const locus =
    FSSG_ALIASES[key] ?? fssgByStrippedName[key.replace(/[\s_-]/g, "")];
  return locus ? (FSSG_MARKERS[locus] ?? null) : null;
}

// The FSSG has one ForenSeq column, headed "ForenSeq Signature Prep/Plus and
// MainstAY". Two FSSG statements narrow it for a row, and a badge with the bare
// header would claim both kits:
// - the cell itself reads "MainstAY only" (SE33, DYS393);
// - the row's Notes read "Locus included ForenSeq Signature Prep only, not
//   MainstAY" (seven X-STRs). Plus is not named there, so it is not claimed.
const FORENSEQ_COLUMN = "ForenSeq Signature Prep/Plus and MainstAY";
const SIGNATURE_PREP_ONLY = "Locus included ForenSeq Signature Prep only, not MainstAY";

function kitProduct(
  column: string,
  cellNote: string | null,
  rowNotes: string | null
): { name: string; note: string | null } {
  if (column !== FORENSEQ_COLUMN) return { name: column, note: cellNote };
  if (cellNote === "MainstAY only") return { name: "ForenSeq MainstAY", note: null };
  if (rowNotes?.includes(SIGNATURE_PREP_ONLY))
    return { name: "ForenSeq Signature Prep", note: cellNote };
  return { name: column, note: cellNote };
}

/**
 * Whether the page has enough locus-specific data to be worth indexing:
 * coordinates, STRbase sequences, frequency data or an FSSG structure record.
 * A marker with none of these renders a name and a chromosome and nothing
 * else; the layout marks it noindex and the sitemap leaves it out.
 */
export function markerHasContent(id: string): boolean {
  const key = id.toLowerCase();
  const marker = rawMarkers[key];
  if (!marker) return false;
  return (
    marker.coordinates?.start != null ||
    (marker.sequences?.length ?? 0) > 0 ||
    key in markerFrequenciesCE ||
    key in markerFrequenciesNGS ||
    fssgFor(key) !== null
  );
}

/** Marker ids that pass `markerHasContent`, in catalog order. */
export function indexableMarkerIds(): string[] {
  return Object.keys(rawMarkers).filter(markerHasContent);
}

// The curated `alleles` string is unreliable when no frequency data backs it
// (22 records read "0-N", a few "1-N" or a single number); only keep a range
// that could be a real set of repeat alleles.
function span(start: number | null, end: number | null): GenomicSpan | null {
  if (start == null || end == null) return null;
  return { start, end, lengthBp: end - start + 1 };
}

function alleleNumber(allele: string): number {
  return Number.parseFloat(allele.replace(",", "."));
}

function sortAlleles(a: string, b: string): number {
  const na = alleleNumber(a);
  const nb = alleleNumber(b);
  if (Number.isFinite(na) && Number.isFinite(nb)) return na - nb;
  return a.localeCompare(b);
}

function ceSummary(id: string): MarkerSummary["ce"] {
  const data = markerFrequenciesCE[id];
  if (!data) return null;
  const stats = markerStatisticsCE[id] ?? {};
  const pops = CE_POPS.filter((pop) =>
    (data[pop] ?? []).some((e) => e.frequency > 0)
  );
  if (pops.length === 0) return null;

  const populations: PopulationSummary[] = pops.map((pop) => {
    const entries = (data[pop] ?? []).filter((e) => e.frequency > 0);
    const modal = entries.reduce(
      (best, e) => (e.frequency > best.frequency ? e : best),
      entries[0]
    );
    return {
      pop,
      modalAllele: modal.allele,
      modalFrequency: modal.frequency,
      alleleCount: entries.length,
      sampleSize: stats[pop]?.N ?? null,
      expectedHeterozygosity: stats[pop]?.Hexp ?? null,
    };
  });

  const byAllele = new Map<string, Partial<Record<CEPop, number>>>();
  for (const pop of pops) {
    for (const entry of data[pop] ?? []) {
      if (entry.frequency <= 0) continue;
      const row = byAllele.get(entry.allele) ?? {};
      row[pop] = entry.frequency;
      byAllele.set(entry.allele, row);
    }
  }
  const rows = [...byAllele.entries()]
    .sort(([a], [b]) => sortAlleles(a, b))
    .map(([allele, byPop]) => ({ allele, byPop }));

  return { populations, table: { pops, rows } };
}

function ngsSummary(id: string): MarkerSummary["ngs"] {
  const data = markerFrequenciesNGS[id];
  if (!data) return null;
  const populations = Object.keys(data).filter(
    (k) => k !== "kit" && k !== "technology" && Array.isArray((data as Record<string, unknown>)[k])
  );
  if (populations.length === 0) return null;
  return { populations, hasRao: populations.includes("RAO") };
}

function relatedMarkers(id: string, marker: RawMarker): MarkerSummary["related"] {
  const kind = markerKind(marker.category);
  const candidates = indexableMarkerIds()
    .filter((other) => other !== id)
    .map((other) => ({ id: other, name: rawMarkers[other].name, raw: rawMarkers[other] }))
    .sort((a, b) => a.name.localeCompare(b.name, "en", { numeric: true }));
  // For X and Y loci "same chromosome" and "same kind" are the same list.
  const sexChromosome = kind === "x" || kind === "y";
  const sameChromosome = sexChromosome
    ? []
    : candidates
        .filter((c) => c.raw.chromosome === marker.chromosome)
        .slice(0, 12)
        .map(({ id, name }) => ({ id, name }));
  const listed = new Set(sameChromosome.map((c) => c.id));
  // The CODIS core set is small enough to link in full; other groups are capped.
  const kindLimit = kind === "codis" ? 20 : sexChromosome ? 24 : 12;
  const sameKind = candidates
    .filter((c) => markerKind(c.raw.category) === kind && !listed.has(c.id))
    .slice(0, kindLimit)
    .map(({ id, name }) => ({ id, name }));
  return { sameChromosome, sameKind };
}

// Drop the names entirely if the stored list no longer lines up with the
// STRbase sequences (the alignment itself is checked by strnaming-names.test).
function variantNamesFor(id: string, sequenceCount: number): MarkerSummary["variantNames"] {
  const rows = STRNAMING.strbase[id];
  if (!rows || rows.length !== sequenceCount) return null;
  return rows.map(({ name, status }) => ({ name, status }));
}

export function buildMarkerSummary(id: string): MarkerSummary | null {
  const key = id.toLowerCase();
  const marker = rawMarkers[key];
  if (!marker) return null;

  const fssg = fssgFor(key);
  // STRBase's GRCh38 reference allele, replaced by STRidER's CE equivalent when
  // the FSSG has one. They agree everywhere except D6S474, where our STRBase copy
  // counts with the Hill motif (17) and the FSSG uses the harmonized Becker
  // designation (16) recommended by Bodner et al. 2024 (FSI Genet 70:103012).
  // Loci without a STRBase value show none, so one FSSG row of the two-copy
  // DYF387S1 is never shown as the locus reference allele.
  const nistReferenceAllele =
    marker.nistReference?.referenceAllele != null
      ? String(marker.nistReference.referenceAllele)
      : null;
  const referenceAllele =
    nistReferenceAllele != null && fssg?.ce != null ? String(fssg.ce) : nistReferenceAllele;

  const sequences = marker.sequences ?? [];
  const variantAlleles = [...new Set(sequences.map((s) => s.allele))].sort(sortAlleles);

  return {
    id: key,
    name: marker.name,
    chromosome: marker.chromosome,
    cytogeneticLocation: marker.cytogeneticLocation || null,
    motif: marker.motif || null,
    alternativeMotifs: [...(marker.alternativeMotifs ?? [])],
    repeatType: marker.type || null,
    kind: markerKind(marker.category),
    referenceAllele,
    nomenclatureNote: HARMONIZED_NOMENCLATURE.has(key),
    grch38: span(marker.coordinates?.start ?? null, marker.coordinates?.end ?? null),
    grch37: span(
      marker.coordinates?.grch37?.start ?? null,
      marker.coordinates?.grch37?.end ?? null
    ),
    fssg: fssg
      ? {
          canonicalBracketing: fssg.canonicalBracketing,
          historicalBracketing: fssg.historicalBracketing,
          minimumRange: fssg.minimumRange
            ? {
                chrom: fssg.minimumRange.chrom,
                start: fssg.minimumRange.start,
                end: fssg.minimumRange.end,
                lengthBp:
                  fssg.minimumRange.length ??
                  fssg.minimumRange.end - fssg.minimumRange.start + 1,
              }
            : null,
          referenceName: STRNAMING.reference[fssg.locus] ?? null,
          kits: Object.entries(fssg.kits ?? {}).map(([column, range]) => ({
            ...kitProduct(column, range.note ?? null, fssg.notes),
            fssgColumn: column,
            chrom: range.chrom,
            start: range.start,
            end: range.end,
            length: range.length,
          })),
          notes: fssg.notes,
        }
      : null,
    ce: ceSummary(key),
    ngs: ngsSummary(key),
    variants:
      sequences.length > 0
        ? { count: sequences.length, alleles: variantAlleles }
        : null,
    variantNames: variantNamesFor(key, sequences.length),
    related: relatedMarkers(key, marker),
    tools: {
      motifExplorer: fssg ? isDisplayable(fssg) : false,
      igv: IGV_MARKER_IDS.has(key),
    },
  };
}

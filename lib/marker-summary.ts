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
  type AlleleEntry,
  type CEPop,
} from "@/app/marker/[id]/markerFrequencies";
import { markerStatisticsCE } from "@/app/marker/[id]/markerStatisticsCE";
import {
  FSSG_MARKERS,
  isDisplayable,
  type FssgMarker,
} from "@/app/tools/str-motif-explorer/data/fssgData";
import { IGV_MARKER_IDS } from "@/app/tools/igv-viewer/markers";
import { computeAlleleRangeFromFrequencies } from "@/lib/alleleRange";

/**
 * Date of the last change to what marker pages show: the datasets (markerData,
 * frequencies, statistics, FSSG file) or the page template itself. Bump it with
 * such changes: the sitemap reports it as lastmod for /catalog and every
 * marker page, and a stale value tells crawlers there is nothing new to fetch.
 */
export const MARKER_DATA_UPDATED = "2026-09-17";

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
  /** "6-20", computed from frequencies when available, else the curated range if plausible. */
  alleleRange: string | null;
  referenceAllele: string | null;
  strand: string | null;
  grch38: GenomicSpan | null;
  grch37: GenomicSpan | null;
  fssg: {
    canonicalBracketing: string[];
    historicalBracketing: string | null;
    minimumRange: { chrom: string; start: number; end: number; lengthBp: number } | null;
    /** MPS kits whose amplicon covers the locus, per STRidER's FSSG. */
    kits: string[];
  } | null;
  ce: { populations: PopulationSummary[]; table: FrequencyTable } | null;
  ngs: { populations: string[]; hasRao: boolean } | null;
  variants: { count: number; alleles: string[] } | null;
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
  alleles: string | null;
  category: string;
  coordinates: {
    start: number | null;
    end: number | null;
    strand: string | null;
    grch37: { start: number | null; end: number | null } | null;
  } | null;
  sequences: readonly { allele: string }[];
  nistReference: { referenceAllele: string | number | null } | null;
  populationFrequencies: Record<string, readonly AlleleEntry[]>;
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
function curatedAlleleRange(alleles: string | null): string | null {
  const match = alleles?.match(/^(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)$/);
  if (!match) return null;
  const [, low, high] = match;
  return Number(low) >= 2 && Number(high) > Number(low) ? `${low}-${high}` : null;
}

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

export function buildMarkerSummary(id: string): MarkerSummary | null {
  const key = id.toLowerCase();
  const marker = rawMarkers[key];
  if (!marker) return null;

  const fssg = fssgFor(key);
  const points = Object.entries(marker.populationFrequencies ?? {}).flatMap(
    ([pop, entries]) =>
      (entries ?? []).map((e) => ({ allele: e.allele, frequency: e.frequency, population: pop }))
  );
  const alleleRange =
    computeAlleleRangeFromFrequencies(points) ?? curatedAlleleRange(marker.alleles);

  const referenceAllele =
    fssg?.ce != null
      ? String(fssg.ce)
      : marker.nistReference?.referenceAllele != null
        ? String(marker.nistReference.referenceAllele)
        : null;

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
    alleleRange,
    referenceAllele,
    strand: fssg?.strand ?? marker.coordinates?.strand ?? null,
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
          kits: Object.keys(fssg.kits ?? {}),
        }
      : null,
    ce: ceSummary(key),
    ngs: ngsSummary(key),
    variants:
      sequences.length > 0
        ? { count: sequences.length, alleles: variantAlleles }
        : null,
    related: relatedMarkers(key, marker),
    tools: {
      motifExplorer: fssg ? isDisplayable(fssg) : false,
      igv: IGV_MARKER_IDS.has(key),
    },
  };
}

// The repeat region STRidER marks in the FSSG grid row "STRNaming Bracketing of
// ISFG Minimum Range" (cells left unnumbered between the -n..-1 and +1..+n
// flank numbers), as offsets into the minimum-range sequence. Provenance in
// data/fssg_strnaming_regions.json. Used to say, per locus, whether the region
// of the STRNaming name agrees with STRidER's grid.

import raw from "@/data/fssg_strnaming_regions.json";

export type FssgStrnamingRegion = {
  sheet: string;
  row: number;
  start: number;
  end: number;
};

const REGIONS = raw.regions as Record<string, FssgStrnamingRegion[]>;

export function fssgStrnamingRegions(locus: string): FssgStrnamingRegion[] {
  return REGIONS[locus] ?? [];
}

/** True when STRidER's grid row marks exactly [start, end) as the repeat region. */
export function agreesWithFssgGrid(
  locus: string,
  start: number,
  end: number,
): boolean {
  const regions = fssgStrnamingRegions(locus);
  return (
    regions.length > 0 &&
    regions.every((r) => r.start === start && r.end === end)
  );
}

const FLANK_IUPAC =
  (raw as { flankIupac?: Record<string, Record<string, string>> }).flankIupac ??
  {};

/** IUPAC code STRidER writes over a flank position ("-4", "+1") of the locus, if any. */
export function flankIupacOf(locus: string, position: string): string | null {
  return FLANK_IUPAC[locus]?.[position] ?? null;
}

export type TemplateVariantFrequency = {
  rs: string;
  alt: string;
  min: number;
  max: number;
};

const VARIANT_FREQ =
  (
    raw as {
      templateVariantFrequencies?: Record<
        string,
        Record<string, TemplateVariantFrequency>
      >;
    }
  ).templateVariantFrequencies ?? {};

/** rsID and alternate-allele frequency range the FSSG gives for a template variant ("-4C>T"). */
export function templateVariantFrequencyOf(
  locus: string,
  variant: string,
): TemplateVariantFrequency | null {
  return VARIANT_FREQ[locus]?.[variant] ?? null;
}

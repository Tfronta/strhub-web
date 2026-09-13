/**
 * Reference assemblies the FASTA Generator can slice flanking sequence from.
 *
 * Slice files live in the public data repo (NEXT_PUBLIC_SLICES_BASE):
 *   GRCh38:  <base>/<MARKER>__slice.fa            (historical layout, root)
 *   others:  <base>/<build id>/<MARKER>__slice.fa
 * Each slice header carries the region it was cut from, e.g.
 *   >CSF1PO_|chr5:150076125-150076575(+)
 *
 * To add an assembly: cut the slices (samtools faidx on the assembly FASTA,
 * plus strand, same marker names), commit them under `slices/<id>/`, then add
 * the entry here with `available: true`.
 *
 * Note: GRCh38 patch releases (p13, p14, ...) only add alt/patch scaffolds;
 * primary chromosome sequence and coordinates are unchanged, so a single
 * GRCh38 entry covers all of them (UCSC hg38 is the same primary assembly).
 */
export type ReferenceGenomeId = "GRCh38" | "GRCh37" | "T2T-CHM13v2.0";

export interface ReferenceGenome {
  id: ReferenceGenomeId;
  /** Short label for the selector. */
  label: string;
  /** UCSC genome name, for links to the browser. */
  ucsc: string;
  /** Sub-directory under NEXT_PUBLIC_SLICES_BASE ("" = root). */
  slicesDir: string;
  /** Slices exist in the data repo. */
  available: boolean;
}

export const REFERENCE_GENOMES: readonly ReferenceGenome[] = [
  {
    id: "GRCh38",
    label: "GRCh38 / hg38",
    ucsc: "hg38",
    slicesDir: "",
    available: true,
  },
  {
    id: "GRCh37",
    label: "GRCh37 / hg19",
    ucsc: "hg19",
    slicesDir: "GRCh37/",
    available: false,
  },
  {
    id: "T2T-CHM13v2.0",
    label: "T2T-CHM13 v2.0 (hs1)",
    ucsc: "hs1",
    slicesDir: "T2T-CHM13v2.0/",
    available: false,
  },
];

export const DEFAULT_REFERENCE_GENOME: ReferenceGenomeId = "GRCh38";

export function getReferenceGenome(id: string): ReferenceGenome {
  return (
    REFERENCE_GENOMES.find((g) => g.id === id) ??
    REFERENCE_GENOMES.find((g) => g.id === DEFAULT_REFERENCE_GENOME)!
  );
}

import { describe, expect, it } from "vitest";
import { DATASET_PROVENANCE, panelKind } from "./dataset-provenance";
import { deriveSlug, INPUT_TYPES } from "./submission";

/**
 * What a run was fed, named the same way wherever it is named. The catalogue
 * list, the history rows and the report header each had their own copy of the
 * type → panel rule; the list's never learned ONT, so a nanopore run was
 * "Autosomal STR" in the list and "ONT CODIS" on its own page.
 */
describe("panelKind", () => {
  it("names each dataset family once, for every place that shows it", () => {
    expect(panelKind(["illumina-bam-hg38"])).toBe("autosomal");
    expect(panelKind(["illumina-str-fastq"])).toBe("autosomal");
    expect(panelKind(["illumina-bam-hg38-y"])).toBe("ystr");
    expect(panelKind(["ont-bam-hg38"])).toBe("ont");
    expect(panelKind(["pacbio-hifi-bam-hg38"])).toBe("hifi");
    expect(panelKind([])).toBeNull();
    expect(panelKind(undefined)).toBeNull();
  });
});

describe("the PacBio HiFi dataset", () => {
  it("is offered with its source and files under its own card", () => {
    const hifi = INPUT_TYPES.find((t) => t.slug === "pacbio-hifi-bam-hg38");
    expect(hifi?.hasExternalDataset).toBe(true);
    expect(DATASET_PROVENANCE["pacbio-hifi-bam-hg38"].source).toContain("PacBio_HiFi-Revio_20231031");
    // Not the last hyphen-segment, which would have filed it as "-hg38".
    expect(deriveSlug("TRGT", "v5.1.0", "pacbio-hifi-bam-hg38")).toBe("trgt-v5-1-0-hifi");
  });

  it("lists the loci the long-read slices hold, and only those", () => {
    // datasets/{ont-bam-hg38,pacbio-hifi-bam-hg38}/loci.bed: the 20 autosomal
    // CODIS loci inside the ±10 kb windows. SE33, PentaD, PentaE, D17S1301
    // and D20S482 were listed once and are in neither slice.
    for (const type of ["ont-bam-hg38", "pacbio-hifi-bam-hg38"]) {
      const loci = DATASET_PROVENANCE[type].loci;
      expect(loci).toHaveLength(20);
      for (const absent of ["SE33", "PentaD", "PentaE", "D17S1301", "D20S482"]) {
        expect(loci).not.toContain(absent);
      }
    }
  });
});

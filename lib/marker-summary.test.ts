import { describe, expect, it } from "vitest";
import {
  buildMarkerSummary,
  fssgFor,
  indexableMarkerIds,
  markerHasContent,
  markerKind,
} from "./marker-summary";
import { markerData } from "./markerData";
import { markerFrequenciesCE } from "@/app/marker/[id]/markerFrequencies";
import { markerStatisticsCE } from "@/app/marker/[id]/markerStatisticsCE";

describe("markerHasContent / indexableMarkerIds", () => {
  it("keeps loci with coordinates, sequences, frequencies or an FSSG record", () => {
    expect(markerHasContent("d3s1358")).toBe(true);
    expect(markerHasContent("D3S1358")).toBe(true);
    // FSSG-only locus: no coordinates in markerData, but a structure record.
    expect(markerHasContent("dys389ii")).toBe(true);
  });

  it("drops loci that would render a name and a chromosome only", () => {
    expect(markerHasContent("dys434")).toBe(false);
    expect(markerHasContent("not-a-marker")).toBe(false);
  });

  it("lists a subset of markerData, every id passing the rule", () => {
    const ids = indexableMarkerIds();
    expect(ids.length).toBeGreaterThan(0);
    expect(ids.length).toBeLessThan(Object.keys(markerData).length);
    for (const id of ids) {
      expect(id in markerData).toBe(true);
      expect(markerHasContent(id)).toBe(true);
    }
  });
});

describe("fssgFor", () => {
  it("matches FSSG display names to markerData ids", () => {
    expect(fssgFor("d3s1358")?.locus).toBe("D3S1358");
    expect(fssgFor("pentae")?.locus).toBe("Penta E");
    expect(fssgFor("ygatah4")?.locus).toBe("Y-GATA-H4");
    expect(fssgFor("dys385ab")?.locus).toBe("DYS385 b");
    expect(fssgFor("dyf387s1")?.locus).toBe("DYF387S1 fragment 1");
    expect(fssgFor("dys434")).toBeNull();
  });
});

describe("markerKind", () => {
  it("maps the category spellings used in markerData", () => {
    expect(markerKind("CODIS Core")).toBe("codis");
    expect(markerKind("European Standard Set")).toBe("ess");
    expect(markerKind("Other Autosomal STRs")).toBe("autosomal");
    expect(markerKind("X STRs")).toBe("x");
    expect(markerKind("X-Chromosome STRs")).toBe("x");
    expect(markerKind("Y STRs")).toBe("y");
    expect(markerKind("Y-Chromosome STRs")).toBe("y");
  });
});

describe("buildMarkerSummary", () => {
  const summary = buildMarkerSummary("D3S1358")!;

  it("returns null for unknown ids", () => {
    expect(buildMarkerSummary("nope")).toBeNull();
  });

  it("describes the locus from markerData and the FSSG record", () => {
    expect(summary.id).toBe("d3s1358");
    expect(summary.name).toBe("D3S1358");
    expect(summary.kind).toBe("codis");
    expect(summary.chromosome).toBe("3");
    expect(summary.cytogeneticLocation).toBe("3p21.31");
    expect(summary.repeatType).toBe("Tetranucleotide");
    expect(summary.grch38).toEqual({ start: 45540739, end: 45540802, lengthBp: 64 });
    expect(summary.grch37?.lengthBp).toBe(64);
    expect(summary.referenceAllele).toBe("16");
    expect(summary.fssg?.canonicalBracketing).toEqual(["TATC[2]TGTC[n]TATC[n]"]);
    expect(summary.fssg?.minimumRange?.lengthBp).toBe(75);
    expect(summary.fssg?.kits).toContain("PowerSeq 46GY");
    expect(summary.tools.motifExplorer).toBe(true);
  });

  it("computes the allele range from the frequency data, like the page", () => {
    expect(summary.alleleRange).toBe("6-20");
  });

  it("finds the modal allele of every CE population with its statistics", () => {
    const ce = summary.ce!;
    const raw = markerFrequenciesCE.d3s1358;
    expect(ce.populations.map((p) => p.pop)).toEqual([
      "AFR", "NAM", "EAS", "CSA", "EUR", "MES", "OCE",
    ]);
    for (const p of ce.populations) {
      const entries = raw[p.pop]!;
      const best = entries.reduce((a, b) => (b.frequency > a.frequency ? b : a));
      expect(p.modalAllele).toBe(best.allele);
      expect(p.modalFrequency).toBe(best.frequency);
      expect(p.alleleCount).toBe(entries.filter((e) => e.frequency > 0).length);
      expect(p.sampleSize).toBe(markerStatisticsCE.d3s1358[p.pop]!.N);
      expect(p.expectedHeterozygosity).toBe(markerStatisticsCE.d3s1358[p.pop]!.Hexp);
    }
  });

  it("builds an allele-by-population table sorted numerically, without empty alleles", () => {
    const rows = summary.ce!.table.rows;
    const numbers = rows.map((r) => Number.parseFloat(r.allele));
    expect([...numbers].sort((a, b) => a - b)).toEqual(numbers);
    for (const row of rows) {
      const values = Object.values(row.byPop);
      expect(values.length).toBeGreaterThan(0);
      expect(values.every((v) => v > 0)).toBe(true);
    }
  });

  it("counts STRbase variants and lists their allele designations once each", () => {
    const sequences = markerData.d3s1358.sequences;
    expect(summary.variants?.count).toBe(sequences.length);
    expect(summary.variants?.alleles).toEqual(
      [...new Set(sequences.map((s) => s.allele))].sort(
        (a, b) => Number.parseFloat(a) - Number.parseFloat(b)
      )
    );
  });

  it("links only to indexable markers and never to itself", () => {
    const indexable = new Set(indexableMarkerIds());
    const links = [...summary.related.sameChromosome, ...summary.related.sameKind];
    expect(links.length).toBeGreaterThan(0);
    for (const link of links) {
      expect(link.id).not.toBe("d3s1358");
      expect(indexable.has(link.id)).toBe(true);
    }
    expect(summary.related.sameChromosome.every((m) => markerData[m.id as keyof typeof markerData].chromosome === "3")).toBe(true);
    expect(summary.related.sameKind.every((m) => markerData[m.id as keyof typeof markerData].category === "CODIS Core")).toBe(true);
  });

  it("collapses the two related lists into one for X and Y loci", () => {
    const y = buildMarkerSummary("dys391")!;
    expect(y.kind).toBe("y");
    expect(y.related.sameChromosome).toEqual([]);
    expect(y.related.sameKind.length).toBeGreaterThan(12);
    expect(y.ce).toBeNull();
    expect(y.alleleRange).toBe(markerData.dys391.alleles);
  });
});

describe("curated allele ranges", () => {
  it("drops implausible curated ranges when no frequency data exists", () => {
    // SE33 is curated as "0-49" and has no CE frequencies.
    expect(buildMarkerSummary("se33")?.alleleRange).toBeNull();
    // D1S1677 is curated as the single value "13".
    expect(buildMarkerSummary("d1s1677")?.alleleRange).toBeNull();
    // DXS10135 is curated as "13-39".
    expect(buildMarkerSummary("dxs10135")?.alleleRange).toBe("13-39");
  });
});

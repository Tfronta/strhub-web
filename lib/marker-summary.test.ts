import { describe, expect, it } from "vitest";
import {
  buildMarkerSummary,
  fssgFor,
  indexableMarkerIds,
  markerHasContent,
  markerKind,
} from "./marker-summary";
import { markerData } from "./markerData";
import { HARMONIZED_NOMENCLATURE } from "./nomenclatureHarmonization";
import enMarker from "./i18n/locales/en/marker";
import esMarker from "./i18n/locales/es/marker";
import ptMarker from "./i18n/locales/pt/marker";
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
  const loci = (id: string) => fssgFor(id).map((row) => row.locus);

  it("matches FSSG display names to markerData ids", () => {
    expect(loci("d3s1358")).toEqual(["D3S1358"]);
    expect(loci("pentae")).toEqual(["Penta E"]);
    expect(loci("ygatah4")).toEqual(["Y-GATA-H4"]);
    expect(loci("dys434")).toEqual([]);
  });

  it("returns every copy of the two multi-copy loci, not one of them", () => {
    expect(loci("dys385ab")).toEqual(["DYS385 a", "DYS385 b"]);
    expect(loci("dyf387s1")).toEqual(["DYF387S1 fragment 1", "DYF387S1 fragment 2"]);
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
    const [fssg] = summary.fssg!.components;
    expect(summary.fssg?.components).toHaveLength(1);
    expect(fssg.canonicalBracketing).toEqual(["TATC[2]TGTC[n]TATC[n]"]);
    expect(fssg.minimumRange?.lengthBp).toBe(75);
    expect(fssg.kits.map((k) => k.name)).toContain("PowerSeq 46GY");
    expect(fssg.crossReference).toBeNull();
    expect(summary.tools.motifExplorer).toBe("D3S1358");
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
  });
});

describe("reference allele", () => {
  it("uses the harmonized D6S474 designation (Bodner et al. 2024), not STRBase's Hill count", () => {
    expect(markerData.d6s474.nistReference.referenceAllele).toBe("17");
    expect(buildMarkerSummary("d6s474")?.referenceAllele).toBe("16");
  });

  it("never shows one FSSG fragment as the reference allele of a locus STRBase leaves blank", () => {
    expect(buildMarkerSummary("dyf387s1")?.referenceAllele).toBeNull();
  });

  it("flags only the two loci harmonized by Bodner et al. 2024, with a cited note in every locale", () => {
    expect(buildMarkerSummary("d6s474")?.nomenclatureNote).toBe(true);
    expect(buildMarkerSummary("dys612")?.nomenclatureNote).toBe(true);
    expect(buildMarkerSummary("d3s1358")?.nomenclatureNote).toBe(false);
    for (const locale of [enMarker, esMarker, ptMarker]) {
      const notes = locale.marker.nomenclatureNotes as Record<string, string>;
      expect(Object.keys(notes).sort()).toEqual([...HARMONIZED_NOMENCLATURE].sort());
      for (const text of Object.values(notes)) expect(text.split("{citation}")).toHaveLength(2);
    }
    expect(buildMarkerSummary("dys612")?.referenceAllele).toBe("36");
  });

  it("gives DYS385ab the CE equivalent of each copy, named, where STRBase gives copy b only", () => {
    expect(markerData.dys385ab.nistReference.referenceAllele).toBe("11");
    expect(buildMarkerSummary("dys385ab")?.referenceAllele).toBe("14 (DYS385 a) · 11 (DYS385 b)");
  });

  it("agrees with STRBase on every other locus that has both sources", () => {
    for (const id of Object.keys(markerData)) {
      const nist = markerData[id as keyof typeof markerData].nistReference?.referenceAllele;
      if (nist == null || id === "d6s474" || id === "dys385ab") continue;
      expect(buildMarkerSummary(id)?.referenceAllele).toBe(String(nist));
    }
  });
});

describe("FSSG kit ranges", () => {
  const FORENSEQ = "ForenSeq Signature Prep/Plus and MainstAY";
  const components = (id: string) => buildMarkerSummary(id)?.fssg?.components ?? [];
  const forenseq = (id: string, copy = 0) =>
    components(id)[copy]?.kits.find((k) => k.fssgColumn === FORENSEQ);

  it("includes the ForenSeq ranges whose FSSG cells carry a qualifier", () => {
    // FSSG v6.1 (STRidER; distributed as FSSG_v6-1_beta.xlsx), Common Locus Information.
    // "MainstAY only" in the cell names the kit; the badge says MainstAY, not both.
    expect(forenseq("se33")).toMatchObject({
      name: "ForenSeq MainstAY", note: null,
      chrom: "chr6", start: 88277130, end: 88277367, length: 238,
    });
    expect(forenseq("dys393")).toMatchObject({
      name: "ForenSeq MainstAY", note: null,
      chrom: "chrY", start: 3263111, end: 3263183, length: 73,
    });
    // DYS461's cell reads "Included in range of DYS460"; the range is DYS460's ForenSeq range.
    expect(forenseq("dys461")).toMatchObject({
      chrom: "chrY", start: 18888748, end: 18889046, length: 299, note: "Included in range of DYS460",
    });
  });

  it("does not claim MainstAY for the X-STRs the FSSG restricts to Signature Prep", () => {
    // Each row's Notes: "Locus included ForenSeq Signature Prep only, not MainstAY".
    const xStrs = ["dxs10074", "dxs10103", "dxs10135", "dxs7132", "dxs7423", "dxs8378", "hprtb"];
    for (const id of xStrs) {
      expect(forenseq(id)?.name, id).toBe("ForenSeq Signature Prep");
    }
    for (const id of indexableMarkerIds()) {
      const notes = components(id).map((c) => c.notes ?? "").join(" ");
      if (!notes.includes("Signature Prep only, not MainstAY")) continue;
      expect(xStrs, id).toContain(id);
    }
  });

  it("carries the FSSG row notes verbatim", () => {
    expect(components("hprtb")[0].notes).toBe(
      "Locus included ForenSeq Signature Prep only, not MainstAY. Originally characterized on the reverse strand."
    );
    expect(components("d12ata63")[0].notes).toBeNull();
  });

  it("keeps every kit range well formed", () => {
    for (const id of indexableMarkerIds()) {
      for (const kit of components(id).flatMap((c) => c.kits)) {
        expect(kit.start, `${id} ${kit.name}`).toBeLessThanOrEqual(kit.end);
        expect(kit.length, `${id} ${kit.name}`).toBe(kit.end - kit.start + 1);
      }
    }
  });
});

describe("multi-copy loci and FSSG cross-references", () => {
  const components = (id: string) => buildMarkerSummary(id)?.fssg?.components ?? [];

  it("shows both copies of DYS385 and DYF387S1, each with its own range and CE", () => {
    // FSSG v6.1, Common Locus Information.
    expect(components("dys385ab").map((c) => [c.locus, c.ce, c.minimumRange?.start])).toEqual([
      ["DYS385 a", "14", 18680604],
      ["DYS385 b", "11", 18639700],
    ]);
    expect(components("dyf387s1").map((c) => [c.locus, c.ce, c.minimumRange?.start])).toEqual([
      ["DYF387S1 fragment 1", "35", 23785357],
      ["DYF387S1 fragment 2", "36", 25884573],
    ]);
  });

  it("generates no name for a row whose sequence the FSSG gives by pointer, and shows the pointer", () => {
    const [a, b] = components("dys385ab");
    expect(a.referenceName).toBeNull();
    expect(a.canonicalBracketing).toEqual([]);
    expect(a.crossReference).toEqual({
      formatting: "See DYS385b formatting",
      sequence: "See DYS385b sequence",
    });
    expect(b.referenceName).toBe("CE11_CTTT[2]TTCT[1]CTTT[11]C[1]CCTT[6]");
    expect(b.crossReference).toBeNull();

    for (const [id, pointer, ce] of [
      ["dys389ii", "See DYS389I sequence", "29"],
      ["dys460", "See DYS461 sequence", "10"],
    ] as const) {
      const [row] = components(id);
      expect(row.referenceName, id).toBeNull();
      expect(row.ce, id).toBe(ce);
      expect(row.crossReference, id).toEqual({ formatting: null, sequence: pointer });
    }
  });

  it("imports the ten kit ranges of the four cross-reference rows", () => {
    const kits = (id: string, copy = 0) =>
      components(id)[copy].kits.map((k) => [k.fssgColumn, k.start, k.end, k.reversedInSource]);
    const FORENSEQ = "ForenSeq Signature Prep/Plus and MainstAY";
    expect(kits("dys385ab", 0)).toEqual([
      ["PowerSeq 46GY", 18680490, 18680694, false],
      // Written 18680702-18680491 in the FSSG (reverse strand).
      [FORENSEQ, 18680491, 18680702, true],
      ["IDSeek mYSTR", 18680485, 18680695, false],
    ]);
    expect(kits("dyf387s1", 1)).toEqual([
      [FORENSEQ, 25884560, 25884738, true],
      ["IDSeek mYSTR", 25884573, 25884756, false],
    ]);
    expect(kits("dys389ii")).toEqual([
      ["PowerSeq 46GY", 12500439, 12500613, false],
      [FORENSEQ, 12500387, 12500633, false],
      ["IDSeek mYSTR", 12500394, 12500617, false],
    ]);
    expect(kits("dys460")).toEqual([
      [FORENSEQ, 18888748, 18889046, false],
      ["IDSeek mYSTR", 18888780, 18889001, false],
    ]);
  });

  it("names the copy STRBase's single region lies in, on multi-copy loci only", () => {
    // STRBase chrY:18,639,713-756 lies in the FSSG full range of DYS385 b (18,639,600-904).
    expect(buildMarkerSummary("dys385ab")?.coordinatesCopy).toBe("DYS385 b");
    expect(buildMarkerSummary("dyf387s1")?.coordinatesCopy).toBeNull(); // no STRBase coordinates
    expect(buildMarkerSummary("tpox")?.coordinatesCopy).toBeNull();
  });

  it("opens the Motif Explorer on a copy it can show, or not at all", () => {
    expect(buildMarkerSummary("dys385ab")?.tools.motifExplorer).toBe("DYS385 b");
    expect(buildMarkerSummary("dyf387s1")?.tools.motifExplorer).toBe("DYF387S1 fragment 1");
    expect(buildMarkerSummary("dys389ii")?.tools.motifExplorer).toBeNull();
  });
});

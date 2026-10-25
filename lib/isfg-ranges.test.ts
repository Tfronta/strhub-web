import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { FSSG_MARKERS } from "@/app/tools/str-motif-explorer/data/fssgData";
import { parseStrnamingFormat } from "./find-core";
import { ISFG_RANGES_GRCH38 } from "./isfg-ranges";
import { parseSliceHeader } from "./load-slice";

const CODIS_CORE = [
  "CSF1PO", "D1S1656", "D2S441", "D2S1338", "D3S1358", "D5S818", "D7S820",
  "D8S1179", "D10S1248", "D12S391", "D13S317", "D16S539", "D18S51", "D19S433",
  "D21S11", "D22S1045", "FGA", "TH01", "TPOX", "vWA",
];

describe("ISFG minimum ranges (GRCh38)", () => {
  it("cover the 20 CODIS core loci plus Penta D and Penta E", () => {
    expect(ISFG_RANGES_GRCH38.map((r) => r.locus).sort()).toEqual(
      [...CODIS_CORE, "PentaD", "PentaE"].sort(),
    );
  });

  describe.each(ISFG_RANGES_GRCH38.map((r) => [r.locus, r] as const))("%s", (locus, r) => {
    it("matches the FSSG minimum range, CE reference allele and STRNaming structure", () => {
      const fssg = FSSG_MARKERS[locus.replace(/^Penta/, "Penta ")];
      expect(fssg.minimumRange).toEqual({
        chrom: r.chrom,
        start: r.start,
        end: r.end,
        length: r.lengthBp,
      });
      expect(r.end - r.start + 1).toBe(r.lengthBp);
      expect(fssg.ce).toBe(r.ceRef);
      expect(fssg.canonicalBracketing[0]).toBe(r.strnaming);
    });

    it("has a parseable structure with at least one [n] block", () => {
      expect(parseStrnamingFormat(r.strnaming).some((u) => u.count === "n")).toBe(true);
    });

    it("lies inside the locus slice served from public/slices/", () => {
      const file = path.join(import.meta.dirname, "..", "public", "slices", `${locus}__slice.fa`);
      const [header] = readFileSync(file, "utf8").split("\n");
      const region = parseSliceHeader(header.slice(1))!;
      expect(region.chrom).toBe(r.chrom);
      expect(region.strand).toBe("+");
      expect(region.start).toBeLessThanOrEqual(r.start);
      expect(region.end).toBeGreaterThanOrEqual(r.end);
    });
  });
});

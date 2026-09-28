import { describe, expect, it } from "vitest";
import { markerFrequenciesNGS } from "./markerFrequencies";
import { markerStatisticsRAO } from "./markerStatisticsRAO";

// Both files come from Valle-Silva et al. 2022, Supplementary Table 9; each one
// checks the other, so a set filed under the wrong locus cannot pass.
describe("RAO forensic parameters (Valle-Silva et al. 2022, ST9)", () => {
  const ids = Object.keys(markerStatisticsRAO);

  it("cover the same 22 loci as the RAO allele frequencies", () => {
    const withRao = Object.keys(markerFrequenciesNGS).filter((id) => markerFrequenciesNGS[id].RAO?.length);
    expect(ids.sort()).toEqual(withRao.sort());
    expect(ids).toHaveLength(22);
  });

  it("agree with the frequency table: 2N alleles and Na distinct alleles per locus", () => {
    for (const id of ids) {
      const s = markerStatisticsRAO[id];
      const rao = markerFrequenciesNGS[id].RAO!;
      expect(rao.reduce((sum, e) => sum + e.count, 0)).toBe(2 * s.N);
      expect(rao.length).toBe(s.Na);
    }
  });

  it("are internally consistent: Ho x N is whole and PD = 1 - MP", () => {
    for (const id of ids) {
      const s = markerStatisticsRAO[id];
      expect(Math.abs(s.Ho * s.N - Math.round(s.Ho * s.N))).toBeLessThan(0.05);
      expect(Math.abs(s.PD + s.MP - 1)).toBeLessThanOrEqual(0.0001);
    }
  });
});

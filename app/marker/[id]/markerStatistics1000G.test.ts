import { describe, expect, it } from "vitest";
import { markerFrequenciesNGS } from "./markerFrequencies";
import { markerStatistics1000G } from "./markerStatistics1000G";

// Genes 2022, Supplementary Table 3. Cross-checked against the allele frequency
// table so both stay filed under the same locus and population.
const POPS = ["AFR", "AMR", "EUR", "EAS", "SAS"] as const;

describe("1000 Genomes forensic parameters (Genes 2022, ST3)", () => {
  const ids = Object.keys(markerStatistics1000G);

  it("cover the 21 loci of the 1000 Genomes frequency sets, all five groups", () => {
    const withG1k = Object.keys(markerFrequenciesNGS).filter((id) => markerFrequenciesNGS[id].AFR?.length);
    expect(ids.sort()).toEqual(withG1k.sort());
    expect(ids).toHaveLength(21);
    for (const id of ids) expect(Object.keys(markerStatistics1000G[id]).sort()).toEqual([...POPS].sort());
  });

  it("agree with the frequency table: 2N alleles and Na distinct alleles", () => {
    for (const id of ids) {
      for (const pop of POPS) {
        const s = markerStatistics1000G[id][pop]!;
        const set = markerFrequenciesNGS[id][pop]!.filter((e) => e.frequency > 0);
        expect(set.reduce((sum, e) => sum + e.count, 0), `${id} ${pop}`).toBe(2 * s.N);
        expect(set.length, `${id} ${pop}`).toBe(s.Na);
      }
    }
  });

  it("keep PD = 1 - MP", () => {
    for (const id of ids) {
      for (const pop of POPS) {
        const s = markerStatistics1000G[id][pop]!;
        expect(Math.abs(s.PD + s.MP - 1), `${id} ${pop}`).toBeLessThanOrEqual(0.0001);
      }
    }
  });
});

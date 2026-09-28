import { describe, expect, it } from "vitest";
import { markerFrequenciesNGS } from "./markerFrequencies";

// The RAO sets are Valle-Silva et al. 2022, Supplementary Table 9 (HipSTR only).
// Until 2026-09-28 four sets sat under the wrong locus (D21S11 data shown as
// D20S482, D16S539 as D17S1301, D7S820 as D6S1043, D8S1179 as D7S820) and D21S11
// itself was corrupted; these checks keep that from happening again.
const ST9_LOCI = [
  "csf1po", "d1s1656", "d2s441", "d2s1338", "d3s1358", "d5s818", "d7s820", "d8s1179",
  "d10s1248", "d12s391", "d13s317", "d16s539", "d18s51", "d19s433", "d21s11", "d22s1045",
  "fga", "pentad", "pentae", "th01", "tpox", "vwa",
];

const rao = (id: string) => markerFrequenciesNGS[id]?.RAO;

describe("RAO NGS frequencies (Valle-Silva et al. 2022, ST9)", () => {
  it("cover exactly the 22 loci of the study", () => {
    const withRao = Object.keys(markerFrequenciesNGS).filter((id) => rao(id)?.length);
    expect(withRao.sort()).toEqual([...ST9_LOCI].sort());
  });

  it("are internally consistent: frequencies sum to 1 and equal count / 2N", () => {
    for (const id of ST9_LOCI) {
      const set = rao(id)!;
      const twoN = set.reduce((sum, e) => sum + e.count, 0);
      expect(twoN % 2).toBe(0);
      expect(Math.abs(set.reduce((sum, e) => sum + e.frequency, 0) - 1)).toBeLessThan(0.0005);
      for (const e of set) expect(Math.abs(e.frequency - e.count / twoN)).toBeLessThan(0.000006);
    }
  });

  it("keep the published values and the corrected D21S11 microvariant", () => {
    expect(rao("csf1po")!.find((e) => e.allele === "10")).toEqual({ allele: "10", frequency: 0.26696, count: 244 });
    expect(rao("d21s11")!.reduce((sum, e) => sum + e.count, 0)).toBe(870);
    const alleles = rao("d21s11")!.map((e) => e.allele);
    expect(alleles).toContain("29.2");
    expect(alleles).not.toContain("29.5");
    expect(rao("d20s482")).toBeUndefined();
  });
});

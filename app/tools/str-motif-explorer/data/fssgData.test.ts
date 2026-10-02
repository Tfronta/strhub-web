import { describe, expect, it } from "vitest";
import { DISPLAY_MARKERS, FSSG_MARKERS, markerClass } from "./fssgData";

describe("markerClass", () => {
  it("puts HPRTB with the X-STRs: it is on chrX despite its name", () => {
    expect(markerClass("HPRTB")).toBe("x");
  });

  it("agrees with the FSSG chromosome for every selectable marker", () => {
    const expected = { chrX: "x", chrY: "y" } as Record<string, string>;
    for (const name of DISPLAY_MARKERS) {
      const chrom = FSSG_MARKERS[name].minimumRange?.chrom ?? "";
      expect(markerClass(name), name).toBe(expected[chrom] ?? "autosomal");
    }
  });
});

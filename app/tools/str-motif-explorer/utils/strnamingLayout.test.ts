import { describe, expect, it } from "vitest";
import names from "@/data/strnaming_reference_names.json";
import { FSSG_MARKERS } from "../data/fssgData";
import { agreesWithFssgGrid } from "../data/strnamingRegions";
import { strnamingLayout } from "./bracketing";

const reference = names.reference as Record<string, string>;

describe("strnamingLayout", () => {
  it("rebuilds the minimum-range sequence from flank + named blocks + flank", () => {
    for (const [locus, name] of Object.entries(reference)) {
      const m = FSSG_MARKERS[locus];
      const layout = strnamingLayout(m.minimumRangeSequence!, name, m.canonicalBracketing);
      expect(layout, locus).not.toBeNull();
      const body = layout!.blocks.flatMap((b) => b.units.map((u) => u.seq)).join("");
      expect(layout!.flank5 + body + layout!.flank3, locus).toBe(m.minimumRangeSequence);
    }
  });

  it("lays out FGA as its STRNaming name, with the 3' flank +1..+7", () => {
    const m = FSSG_MARKERS.FGA;
    const layout = strnamingLayout(m.minimumRangeSequence!, reference.FGA, m.canonicalBracketing)!;
    expect(layout.flank5).toBe("");
    expect(layout.blocks.map((b) => `${b.motif}[${b.count}]${b.variable ? "n" : ""}`)).toEqual([
      "GAAG[1]", "AAAG[1]", "GAAG[2]", "GAG[1]", "AAAG[14]n", "AGAAA[1]", "AAAG[3]",
    ]);
    expect(layout.flank3).toBe("AAACTAG");
  });

  it("matches the repeat region of STRidER's FSSG STRNaming row, except two Y rows", () => {
    const differ: string[] = [];
    for (const [locus, name] of Object.entries(reference)) {
      const m = FSSG_MARKERS[locus];
      const layout = strnamingLayout(m.minimumRangeSequence!, name, m.canonicalBracketing)!;
      if (!agreesWithFssgGrid(locus, layout.start, layout.end)) differ.push(locus);
    }
    // DYS389I sits in the shared DYS389I/II grid block and DYS461 in the shared
    // DYS461/DYS460 block; in both the FSSG row starts the region one base after
    // the STRNaming name does.
    expect(differ.sort()).toEqual(["DYS389I", "DYS461"]);
  });
});

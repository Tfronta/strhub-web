import { describe, expect, it } from "vitest";
import { toolsDetailsData } from "./toolsDetailsData";
import { translate, type Language } from "@/lib/translations";

// STRspy README: long reads from ONT and PacBio; fastq (raw reads, usually ONT)
// or bam (pre-aligned, usually PacBio); READ_TYPE ont | pb.
describe("STRspy profile", () => {
  const strspy = toolsDetailsData.find((t) => t.id === "strspy")!;

  it("lists ONT and PacBio and no ONT-only wording", () => {
    expect(strspy.tech).toEqual(["ONT", "PacBio"]);
    const text = [...(strspy.limitations ?? []), strspy.notes ?? ""].join(" ");
    expect(text).toMatch(/ONT or PacBio/);
    expect(text).not.toMatch(/Optimized for ONT|Oxford Nanopore data/);
  });

  it("has matching translations in all three languages", () => {
    for (const lang of ["en", "es", "pt"] as Language[]) {
      const key = "marker.tools.strspy.limitations.longReadPanels";
      expect(translate(lang, key), lang).not.toBe(key);
      expect(translate(lang, key), lang).toMatch(/PacBio/);
      expect(translate(lang, "marker.tools.strspy.notes"), lang).toMatch(/PacBio/);
    }
  });
});

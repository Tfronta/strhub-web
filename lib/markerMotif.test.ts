import { describe, expect, it } from "vitest";
import templates from "@/data/fssg_template_by_marker.json";
import { markerData } from "@/lib/markerData";
import { fssgFor } from "@/lib/marker-summary";
import { markerMotif } from "@/lib/markerMotif";

const byMarker = templates.byMarker as Record<string, { locus: string; template: string }>;
const markers = markerData as unknown as Record<string, { motif: string | null }>;

describe("markerMotif", () => {
  it("keeps the template extract identical to the FSSG rows of each marker", () => {
    for (const id of Object.keys(markers)) {
      const row = fssgFor(id).find((r) => r.canonicalBracketing.length > 0);
      expect(byMarker[id] ?? null, id).toEqual(
        row ? { locus: row.locus, template: row.canonicalBracketing[0] } : null
      );
    }
  });

  it("shows the FSSG template for an FSSG locus, not the STRbase motif", () => {
    expect(markerMotif("csf1po", "[ATCT]n")).toEqual({
      kind: "fssgTemplate",
      value: "TCTA[n]",
      fssgLocus: "CSF1PO",
    });
  });

  it("falls back to the STRbase motif for markers the FSSG does not cover", () => {
    const id = Object.keys(markers).find((k) => !byMarker[k] && markers[k].motif)!;
    const motif = markers[id].motif!;
    expect(markerMotif(id, motif)).toEqual({ kind: "strbaseMotif", value: motif });
  });
});

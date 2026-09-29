import { describe, expect, it, vi } from "vitest";
import { FSSG_MARKERS } from "@/app/tools/str-motif-explorer/data/fssgData";
import { markerData } from "@/lib/markerData";
import { CONSTRUCTION_MOTIF_OVERRIDES, generateContentFromSlice } from "./fasta-export-from-slice";

// Serve the slice from the FSSG full-range sequence (GRCh38, forward strand)
// instead of fetching it, so the test is deterministic and offline.
vi.mock("@/lib/load-slice", async () => {
  const { FSSG_MARKERS } = await import("@/app/tools/str-motif-explorer/data/fssgData");
  return {
    fetchSliceFA: async (markerName: string) => {
      const m = FSSG_MARKERS[markerName];
      const seq = m.fullRangeSequence!.toUpperCase();
      const r = m.fullRange!;
      return {
        header: `${markerName}_|${r.chrom}:${r.start}-${r.end}(+)`,
        seq,
        url: `test://${markerName}__slice.fa`,
        region: { chrom: r.chrom, start: r.start, end: r.end, strand: "+" as const },
      };
    },
  };
});

/** GRCh38 bases from..to (1-based, inclusive) of a marker's FSSG full range. */
const ref = (marker: string, from: number, to: number) => {
  const m = FSSG_MARKERS[marker];
  return m.fullRangeSequence!.toUpperCase().slice(from - m.fullRange!.start, to - m.fullRange!.start + 1);
};

// Construction motif, reference copy count and the block the detector selects
// in GRCh38. The copy count counts motif copies; it is not a CE designation.
const BLOCKS = [
  { marker: "D1S1656", id: "d1s1656", motif: "CTAT", copies: 16, chrom: "chr1", start: 230769617, end: 230769680, catalog: "[CCTA]n [TCTA]n" },
  { marker: "CSF1PO", id: "csf1po", motif: "CTAT", copies: 13, chrom: "chr5", start: 150076322, end: 150076373, catalog: "[ATCT]n" },
  { marker: "D5S818", id: "d5s818", motif: "TCTA", copies: 11, chrom: "chr5", start: 123775553, end: 123775596, catalog: "[ATCT]n" },
  { marker: "D7S820", id: "d7s820", motif: "TCTA", copies: 13, chrom: "chr7", start: 84160224, end: 84160275, catalog: "[TATC]n" },
  { marker: "TH01", id: "th01", motif: "TGAA", copies: 7, chrom: "chr11", start: 2171086, end: 2171113, catalog: "[AATG]n" },
  { marker: "TPOX", id: "tpox", motif: "TGAA", copies: 8, chrom: "chr2", start: 1489651, end: 1489682, catalog: "[AATG]n" },
] as const;

describe("FASTA Generator construction motifs (bounded phase correction)", () => {
  it("covers exactly these six loci", () => {
    expect(CONSTRUCTION_MOTIF_OVERRIDES).toEqual(
      Object.fromEntries(BLOCKS.map((b) => [b.marker, b.motif])),
    );
  });

  describe.each(
    BLOCKS.map((b) => [`${b.marker}: ${b.motif} x ${b.copies} at ${b.chrom}:${b.start}-${b.end}`, b] as const),
  )("%s", (_title, b) => {
    const catalogMotif =
      (markerData as Record<string, { motif: string | null }>)[b.id].motif ?? "";

    it("is the block the detector selects in GRCh38", () => {
      expect(ref(b.marker, b.start, b.end)).toBe(b.motif.repeat(b.copies));
    });

    it("rebuilds the selected block and its flanks with the reference copy count", async () => {
      const flank = 20;
      const { fasta, info } = await generateContentFromSlice(b.marker, catalogMotif, [b.copies], flank, "standard");
      const window = `${b.chrom}:${b.start - flank}-${b.end + flank}(+)`;
      expect(info.motif).toBe(b.motif);
      expect(info.window).toMatchObject({ chrom: b.chrom, start: b.start - flank, end: b.end + flank });
      const [header, ...lines] = fasta.split("\n");
      expect(header).toBe(
        `>${b.marker}_repeats_${b.copies} motif=${b.motif} GRCh38 ref_window=${window} flank=${flank}bp simplified_construct`,
      );
      expect(lines.join("")).toBe(ref(b.marker, b.start - flank, b.end + flank));
    });

    it("reports the construction motif in the CSV and changes only the block for other counts", async () => {
      const flank = 10;
      const { fasta } = await generateContentFromSlice(b.marker, catalogMotif, [b.copies - 1, b.copies], flank, "tabular");
      const [head, ...rows] = fasta.split("\n");
      expect(head).toBe("marker,repeat_count,motif,build,ref_window,flank_bp,sequence");
      const cols = rows.map((r) => r.split(","));
      expect(cols.map((c) => [c[1], c[2]])).toEqual([
        [String(b.copies - 1), b.motif],
        [String(b.copies), b.motif],
      ]);
      expect(cols[1][6]).toBe(ref(b.marker, b.start - flank, b.end + flank));
      expect(cols[0][6]).toBe(
        ref(b.marker, b.start - flank, b.start - 1) +
          b.motif.repeat(b.copies - 1) +
          ref(b.marker, b.end + 1, b.end + flank),
      );
    });

    it("leaves the catalog motif unchanged", () => {
      expect(catalogMotif).toBe(b.catalog);
    });
  });
});

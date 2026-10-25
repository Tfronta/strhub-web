import { readFileSync } from "node:fs";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import referenceNames from "@/data/strnaming_reference_names.json";
import { FastaGeneratorError } from "./fasta-errors";
import { generateContentFromSlice } from "./fasta-export-from-slice";
import { parseStrnamingFormat } from "./find-core";
import { getIsfgRange, ISFG_RANGES_GRCH38 } from "./isfg-ranges";
import { parseSliceHeader } from "./load-slice";

const PUBLIC = path.join(import.meta.dirname, "..", "public");

// The page fetches /slices/<marker>__slice.fa from its own origin. Serve the
// same files from public/, so these tests run on the real slices, offline.
beforeAll(() => {
  vi.stubGlobal("fetch", async (url: string) => {
    try {
      return new Response(readFileSync(path.join(PUBLIC, url), "utf8"));
    } catch {
      return new Response("", { status: 404 });
    }
  });
});
afterAll(() => {
  vi.unstubAllGlobals();
});

/** A slice file as the generator reads it: header region and sequence. */
function slice(locus: string) {
  const [header, ...lines] = readFileSync(path.join(PUBLIC, "slices", `${locus}__slice.fa`), "utf8")
    .trim()
    .split(/\r?\n/);
  return { region: parseSliceHeader(header.slice(1))!, seq: lines.join("").toUpperCase() };
}

/** GRCh38 bases from..to (1-based, inclusive) of a locus slice. */
function ref(locus: string, from: number, to: number) {
  const { region, seq } = slice(locus);
  return seq.slice(from - region.start, to - region.start + 1);
}

/** Sequence of a single-record FASTA, without its header and line breaks. */
const sequenceOf = (fasta: string) => fasta.split("\n").slice(1).join("");

// The variable block of each locus in GRCh38 (1-based, inclusive): the longest
// exact, in-phase run of an [n] motif of its STRNaming structure inside the
// ISFG minimum range.
const BLOCKS = [
  { locus: "PentaE", motif: "TTTTC", copies: 5, start: 96831012, end: 96831036 },
  { locus: "TH01", motif: "TGAA", copies: 7, start: 2171086, end: 2171113 },
  { locus: "TPOX", motif: "TGAA", copies: 8, start: 1489651, end: 1489682 },
  { locus: "D16S539", motif: "GATA", copies: 11, start: 86352702, end: 86352745 },
  { locus: "D5S818", motif: "TCTA", copies: 11, start: 123775553, end: 123775596 },
  { locus: "D2S441", motif: "TCTA", copies: 12, start: 68011947, end: 68011994 },
  { locus: "D22S1045", motif: "ATT", copies: 14, start: 37140287, end: 37140328 },
  { locus: "D10S1248", motif: "GGAA", copies: 13, start: 129294244, end: 129294295 },
  { locus: "CSF1PO", motif: "TCTA", copies: 13, start: 150076325, end: 150076376 },
  { locus: "D8S1179", motif: "TATC", copies: 10, start: 124894875, end: 124894914 },
  { locus: "D3S1358", motif: "TATC", copies: 13, start: 45540749, end: 45540800 },
  { locus: "D7S820", motif: "CTAT", copies: 13, start: 84160225, end: 84160276 },
  { locus: "D13S317", motif: "TATC", copies: 11, start: 82148025, end: 82148068 },
  { locus: "D1S1656", motif: "CTAT", copies: 16, start: 230769617, end: 230769680 },
  { locus: "D12S391", motif: "TAGA", copies: 12, start: 12297019, end: 12297066 },
  { locus: "D19S433", motif: "TCCT", copies: 13, start: 29926234, end: 29926285 },
  { locus: "D18S51", motif: "GAAA", copies: 18, start: 63281668, end: 63281739 },
  { locus: "vWA", motif: "AGAT", copies: 10, start: 5983978, end: 5984017 },
  { locus: "PentaD", motif: "AAAAG", copies: 12, start: 43636209, end: 43636268 },
  { locus: "FGA", motif: "AAAG", copies: 14, start: 154587748, end: 154587803 },
  { locus: "D2S1338", motif: "GGAA", copies: 13, start: 218014871, end: 218014922 },
  { locus: "D21S11", motif: "TATC", copies: 12, start: 19182054, end: 19182101 },
] as const;

// FSSG / STRNaming spell the Penta loci with a space; the slices do not.
const fssgName = (locus: string) => locus.replace(/^Penta/, "Penta ");

describe("FASTA Generator: CE alleles over the ISFG minimum range", () => {
  it("covers the 22 loci of the ISFG range table", () => {
    expect(BLOCKS.map((b) => b.locus)).toEqual(ISFG_RANGES_GRCH38.map((r) => r.locus));
  });

  describe.each(BLOCKS.map((b) => [`${b.locus}: ${b.motif} x ${b.copies}`, b] as const))(
    "%s",
    (_title, b) => {
      const range = getIsfgRange(b.locus)!;
      const period = b.motif.length;

      it("varies that block, which lies inside the ISFG minimum range", async () => {
        const { info } = await generateContentFromSlice(b.locus, [range.ceRef], 0, "standard");
        expect(info.motif).toBe(b.motif);
        expect(info.refCopies).toBe(b.copies);
        expect(info.ceRef).toBe(range.ceRef);
        expect(info.block).toEqual({ chrom: range.chrom, start: b.start, end: b.end, strand: "+" });
        expect(b.start).toBeGreaterThanOrEqual(range.start);
        expect(b.end).toBeLessThanOrEqual(range.end);
        expect(ref(b.locus, b.start, b.end)).toBe(b.motif.repeat(b.copies));
        // The block is maximal: the motif does not continue on either side.
        expect(ref(b.locus, b.start - period, b.start - 1)).not.toBe(b.motif);
        expect(ref(b.locus, b.end + 1, b.end + period)).not.toBe(b.motif);
      });

      it("matches the block of the STRNaming name of the GRCh38 reference", () => {
        // e.g. CE22_GAAG[1]AAAG[1]GAAG[2]GAG[1]AAAG[14]AGAAA[1]AAAG[3] for FGA.
        const name = (referenceNames.reference as Record<string, string>)[fssgName(b.locus)];
        const [ce, structure] = name.split("_");
        expect(ce).toBe(`CE${range.ceRef}`);
        const counts = parseStrnamingFormat(structure)
          .filter((u) => u.motif === b.motif)
          .map((u) => u.count);
        expect(Math.max(...(counts as number[]))).toBe(b.copies);
      });

      it("rebuilds the reference slice exactly for N = ce_ref", async () => {
        const { region, seq } = slice(b.locus);
        // A flank longer than the slice takes everything on both sides.
        const { fasta, info } = await generateContentFromSlice(b.locus, [range.ceRef], 1000, "standard");
        expect(sequenceOf(fasta)).toBe(seq);
        expect(info.window).toEqual(region);
        expect(info.flank5Bp).toBe(b.start - region.start);
        expect(info.flank3Bp).toBe(region.end - b.end);
      });

      it("writes the reference window and its flanks for N = ce_ref", async () => {
        const flank = 20;
        const { fasta } = await generateContentFromSlice(b.locus, [range.ceRef], flank, "standard");
        const window = `${range.chrom}:${b.start - flank}-${b.end + flank}(+)`;
        const [header] = fasta.split("\n");
        expect(header).toBe(
          `>${b.locus}_CE${range.ceRef} motif=${b.motif} copies=${b.copies} GRCh38 ref_window=${window} flank=${flank}bp simplified_construct`,
        );
        expect(sequenceOf(fasta)).toBe(ref(b.locus, b.start - flank, b.end + flank));
      });

      it("changes only the block, by one motif, for N = ce_ref - 1 and ce_ref + 1", async () => {
        const { seq, region } = slice(b.locus);
        const before = seq.slice(0, b.start - region.start);
        const after = seq.slice(b.end - region.start + 1);
        const alleles = [range.ceRef - 1, range.ceRef, range.ceRef + 1];
        const { fasta } = await generateContentFromSlice(b.locus, alleles, 1000, "tabular");
        const rows = fasta.split("\n").slice(1).map((r) => r.split(","));
        expect(rows.map((c) => [c[1], c[2], c[3]])).toEqual(
          alleles.map((a, i) => [String(a), b.motif, String(b.copies - 1 + i)]),
        );
        const seqs = rows.map((c) => c[8]);
        expect(seqs[1]).toBe(seq);
        expect(seqs[0].length).toBe(seq.length - period);
        expect(seqs[2].length).toBe(seq.length + period);
        expect(seqs[0]).toBe(before + b.motif.repeat(b.copies - 1) + after);
        expect(seqs[2]).toBe(before + b.motif.repeat(b.copies + 1) + after);
      });
    },
  );

  it("varies the AAAG run of FGA, not the CTTC AGGA CTTC block upstream of the ISFG range", async () => {
    const { region, seq } = slice("FGA");
    const range = getIsfgRange("FGA")!;
    // The old detector replaced this block (mixed CTTC/AGGA units) and left
    // the AAAG repeat untouched.
    const upstream = seq.indexOf("CTTCAGGACTTC");
    expect(upstream).toBeGreaterThanOrEqual(0);
    expect(region.start + upstream + 12).toBeLessThan(range.start);

    const { fasta, info } = await generateContentFromSlice("FGA", [23], 1000, "standard");
    expect(info.motif).toBe("AAAG");
    expect(info.block.start).toBeGreaterThanOrEqual(range.start);
    const out = sequenceOf(fasta);
    expect(out.slice(upstream, upstream + 12)).toBe("CTTCAGGACTTC");
    expect(out.slice(0, info.block.start - region.start)).toBe(seq.slice(0, info.block.start - region.start));
    expect(out).toContain("AAAG".repeat(15));
    expect(out).not.toContain("AAAG".repeat(16));
  });
});

describe("FASTA Generator output", () => {
  it("names the CE allele, the varied motif and its copies in the header", async () => {
    const { fasta } = await generateContentFromSlice("TH01", [9], 100, "standard");
    expect(fasta.split("\n")[0]).toBe(
      ">TH01_CE9 motif=TGAA copies=9 GRCh38 ref_window=chr11:2170986-2171213(+) flank=100bp simplified_construct",
    );
  });

  it("states each flank's real length when the slice cuts one short", async () => {
    // The TH01 slice has 197 bases before the TGAA block and 202 after it.
    const { fasta, info } = await generateContentFromSlice("TH01", [7, 8], 200, "multi");
    const headers = fasta.split("\n").filter((l) => l.startsWith(">"));
    expect(headers).toEqual([
      ">TH01_CE7 motif=TGAA copies=7 GRCh38 ref_window=chr11:2170889-2171313(+) flank5=197bp flank3=200bp simplified_construct",
      ">TH01_CE8 motif=TGAA copies=8 GRCh38 ref_window=chr11:2170889-2171313(+) flank5=197bp flank3=200bp simplified_construct",
    ]);
    expect(info).toMatchObject({ flankBp: 200, flank5Bp: 197, flank3Bp: 200 });

    const csv = await generateContentFromSlice("TH01", [7], 200, "tabular");
    const [head, row] = csv.fasta.split("\n");
    expect(head).toBe("marker,ce_allele,motif,copies,build,ref_window,flank5_bp,flank3_bp,sequence");
    expect(row.split(",").slice(0, 8)).toEqual([
      "TH01", "7", "TGAA", "7", "GRCh38", "chr11:2170889-2171313(+)", "197", "200",
    ]);
  });

  it("writes only the varied block in upper case in the reference style", async () => {
    const { fasta } = await generateContentFromSlice("D21S11", [30], 10, "reference");
    expect(sequenceOf(fasta)).toBe(
      ref("D21S11", 19182044, 19182053).toLowerCase() +
        "TATC".repeat(13) +
        ref("D21S11", 19182102, 19182111).toLowerCase(),
    );
  });

  it("rejects CE alleles that would leave the block with no copies", async () => {
    // D21S11: GRCh38 is CE 29 with 12 copies of the last TATC block, so the
    // smallest allele is 18 (one copy).
    const { info } = await generateContentFromSlice("D21S11", [18], 0, "standard");
    expect(info.minAllele).toBe(18);
    const error = await generateContentFromSlice("D21S11", [16, 17, 18], 0, "standard").catch((e) => e);
    expect(error).toBeInstanceOf(FastaGeneratorError);
    expect(error).toMatchObject({
      code: "alleleTooSmall",
      params: { marker: "D21S11", alleles: "16, 17", min: "18", motif: "TATC" },
    });
  });

  it("rejects microvariants, bad flanks, loci without an ISFG range and other assemblies", async () => {
    await expect(generateContentFromSlice("TH01", [9.3])).rejects.toBeInstanceOf(RangeError);
    await expect(generateContentFromSlice("TH01", [9], -1)).rejects.toBeInstanceOf(RangeError);
    await expect(generateContentFromSlice("SE33", [20])).rejects.toMatchObject({
      code: "rangeUnavailable",
    });
    await expect(generateContentFromSlice("TH01", [9], 10, "standard", "GRCh37")).rejects.toMatchObject({
      code: "genomeUnavailable",
    });
  });
});

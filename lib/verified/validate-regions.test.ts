import { describe, expect, it } from "vitest";
import { parseBed3, validateRegions, type BedInterval } from "./validate-regions";

/**
 * These cases are the contract with `harness/validate_bed.py` in the engine.
 * A BED accepted here and rejected there aborts a run with no report, so any
 * case added below must be added to the Python fixture too.
 */
describe("parseBed3", () => {
  it("reads a plain BED3", () => {
    const rows = parseBed3("chr1\t100\t200\nchr2\t300\t400\n");
    expect(rows.map((r) => [r.chrom, r.start, r.end])).toEqual([
      ["chr1", 100, 200],
      ["chr2", 300, 400],
    ]);
  });

  it("adds the chr prefix when the file omits it", () => {
    expect(parseBed3("1\t100\t200\n")[0].chrom).toBe("chr1");
  });

  it("ignores comments, track and browser lines", () => {
    const rows = parseBed3("# a note\ntrack name=x\nbrowser hide all\nchr1\t100\t200\n");
    expect(rows.length).toBe(1);
  });

  it("keeps extra columns out of the way (HipSTR/GangSTR layouts)", () => {
    const rows = parseBed3("chr1\t100\t200\t4\t25\tD1S1656\tGATA\n");
    expect(rows[0].name).toBe("4");
    expect(rows[0].end).toBe(200);
  });

  it("reports the real line number after skipped lines", () => {
    expect(() => parseBed3("# note\nchr1\t100\t50\n")).toThrow(/line 2/);
  });

  it("accepts space-separated files", () => {
    expect(parseBed3("chr1 100 200\n")[0].end).toBe(200);
  });

  it("accepts CRLF line endings", () => {
    expect(parseBed3("chr1\t100\t200\r\nchr2\t300\t400\r\n").length).toBe(2);
  });

  it("returns nothing for an empty file rather than throwing", () => {
    expect(parseBed3("\n\n# only comments\n")).toEqual([]);
  });

  // The case that failed in production: STRsearch's ref bed.
  it("skips a header row", () => {
    const strsearch =
      "Chr\tStart\tEnd\tPeriod\tReference allele\tMarker\tSTR sequence structure\tStand\n" +
      "chr1\t7442891\t7442934\t4\t11\tMarker1\tD1GATA113\t[GATA]n\t+\n" +
      "chr21\t20554291\t20554417\t4\t29\tMarker2\tD21S11\t[TCTA]n\t+\n";
    const rows = parseBed3(strsearch);
    expect(rows.length).toBe(2);
    expect(rows[0].chrom).toBe("chr1");
    expect(rows[0].start).toBe(7442891);
    expect(rows[0].end).toBe(7442934);
    // Line numbers still refer to the file the author is looking at.
    expect(rows[0].line).toBe(2);
  });

  it("does not mistake a single data row for a header", () => {
    expect(parseBed3("chr1\t100\t200\n").length).toBe(1);
  });

  it("finds coordinates that are not in the first three columns", () => {
    const shifted =
      "D1S1656\tchr1\t100\t200\nD21S11\tchr21\t300\t400\nvWA\tchr12\t500\t600\n";
    const rows = parseBed3(shifted);
    expect(rows.map((r) => [r.chrom, r.start, r.end])).toEqual([
      ["chr1", 100, 200],
      ["chr21", 300, 400],
      ["chr12", 500, 600],
    ]);
  });

  it("prefers the BED convention when both layouts would parse", () => {
    // Columns 0-2 are a valid triple; so are 3-5. The convention wins.
    const rows = parseBed3("chr1\t100\t200\tchr2\t300\t400\n");
    expect(rows[0].chrom).toBe("chr1");
    expect(rows[0].start).toBe(100);
  });

  it("throws with the offending line when no coordinate columns exist", () => {
    expect(() => parseBed3("name,description\nD1S1656,a marker\nvWA,another\n")).toThrow(
      /could not find chromosome, start and end columns/,
    );
  });

  it("rejects end <= start", () => {
    expect(() => parseBed3("chr1\t200\t100\n")).toThrow(/end must be greater than start/);
  });
});

/**
 * The pre-flight rule, mirrored by harness/tests/test_validate_rule.py: a BED is
 * rejected for reaching too few panel loci, never for listing loci beyond the
 * slice (a medical tool's shipped catalog lists dozens).
 */
describe("validateRegions", () => {
  const panel: BedInterval[] = [
    { chrom: "chr4", start: 3073876, end: 3075933, name: "HTT", line: 1 },
    { chrom: "chrX", start: 147911049, end: 147913111, name: "FMR1", line: 2 },
    { chrom: "chr9", start: 27572484, end: 27574546, name: "C9orf72", line: 3 },
  ];
  const row = (chrom: string, start: number, end: number, line: number): BedInterval => ({
    chrom, start, end, name: `${chrom}:${start}-${end}`, line,
  });

  it("accepts a BED whose extra rows fall outside the panel", () => {
    const r = validateRegions(
      [row("chr4", 3074876, 3074933, 1), row("chrX", 147912049, 147912111, 2), row("chr1", 100, 200, 3)],
      panel,
      2,
    );
    expect(r.ok).toBe(true);
    expect(r.coveredLoci).toEqual(["FMR1", "HTT"]);
    expect(r.outOfPanel.map((x) => x.line)).toEqual([3]);
    expect(r.reasons).toEqual([]);
  });

  it("rejects too few loci and names the rows outside the panel", () => {
    const r = validateRegions([row("chr4", 3074876, 3074933, 1), row("chr1", 100, 200, 2)], panel, 2);
    expect(r.ok).toBe(false);
    expect(r.reasons[0]).toMatch(/covers 1 supported loci, at least 2 required/);
    expect(r.reasons[1]).toMatch(/chr1:100-200 \(line 2\)/);
  });
});

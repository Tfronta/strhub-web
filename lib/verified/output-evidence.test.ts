import { describe, expect, it } from "vitest";
import { depthRows, ioChecks, normaliseLocus, panelCoverage } from "./output-evidence";

const PANEL = ["CSF1PO", "D1S1656", "D2S1338", "D21S11", "PentaD", "SE33", "vWA"];

describe("panel coverage", () => {
  it("names the loci the output did not call when the regions file was the panel", () => {
    const cov = panelCoverage(
      { regions_given: 7, regions_hit: 4, loci: ["CSF1PO", "D1S1656", "Penta D", "VWA"] },
      PANEL,
    );
    expect(cov).toEqual({ given: 7, hit: 4, notCalled: ["D2S1338", "D21S11", "SE33"] });
  });

  it("says the numbers and no names when the regions file was not the panel", () => {
    // A submitter's own BED with 9 regions: the panel list cannot say which
    // three were missed, so the page must not guess.
    const cov = panelCoverage({ regions_given: 9, regions_hit: 6, loci: ["CSF1PO"] }, PANEL);
    expect(cov).toEqual({ given: 9, hit: 6, notCalled: [] });
  });

  it("stays silent about names when its own arithmetic disagrees with the engine", () => {
    // Engine says one locus was missed; the list finds three. Something is
    // off in the naming, and a wrong name is worse than none.
    const cov = panelCoverage({ regions_given: 7, regions_hit: 6, loci: ["CSF1PO", "D1S1656", "PentaD", "vWA"] }, PANEL);
    expect(cov?.notCalled).toEqual([]);
  });

  it("is absent when the engine recorded no regions", () => {
    expect(panelCoverage({ rows: 3 }, PANEL)).toBeNull();
    expect(panelCoverage(undefined, PANEL)).toBeNull();
  });
});

describe("locus names", () => {
  it("treats spelling variants as one locus", () => {
    expect(normaliseLocus("Penta D")).toBe(normaliseLocus("PentaD"));
    expect(normaliseLocus("vWA")).toBe(normaliseLocus("VWA"));
    expect(normaliseLocus("DYS385a/b")).toBe("dys385ab");
  });
});

describe("IO checks", () => {
  it("keeps the engine's order and names the format the file parsed as", () => {
    const checks = ioChecks({
      checks: { confined: true, exists: true, non_empty: true, parses_as_vcf: true, min_records: false },
    });
    expect(checks.map((c) => c.key)).toEqual(["confined", "exists", "non_empty", "parses", "min_records"]);
    expect(checks[3]).toEqual({ key: "parses", passed: true, format: "VCF" });
    expect(checks[4].passed).toBe(false);
  });

  it("is empty when the IO gate did not run", () => {
    expect(ioChecks(undefined)).toEqual([]);
    expect(ioChecks({ path: "x" })).toEqual([]);
  });
});

describe("depth rows", () => {
  it("scales every bar against the deepest locus", () => {
    const rows = depthRows({ top_loci_by_depth: [["D18S51", 500], ["TPOX", 250], ["SE33", 0]] });
    expect(rows.map((r) => r.share)).toEqual([1, 0.5, 0]);
    expect(rows[0].locus).toBe("D18S51");
  });

  it("does not divide by zero on an output with no reads", () => {
    expect(depthRows({ top_loci_by_depth: [["A", 0]] })[0].share).toBe(0);
    expect(depthRows(undefined)).toEqual([]);
  });
});

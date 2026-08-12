import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { parseBed3 } from "./validate-regions";
import cases from "./bed-cases.json";

/**
 * The shared contract with the engine's harness/validate_bed.py, which runs the
 * same cases from its own copy. A BED accepted here and rejected there aborts a
 * run with no report and no badge, so the two must agree on which files parse
 * and to what rows.
 */
const ENGINE_COPY = path.resolve(
  import.meta.dirname,
  "../../../strhub-verified/harness/testdata/bed_cases.json",
);

describe("shared BED cases", () => {
  for (const c of cases.cases) {
    it(c.name, () => {
      if ("throws" in c && c.throws) {
        expect(() => parseBed3(c.bed)).toThrow();
        return;
      }
      const rows = parseBed3(c.bed).map((r) => ({
        chrom: r.chrom,
        start: r.start,
        end: r.end,
        name: r.name,
      }));
      expect(rows).toEqual(c.rows);
    });
  }

  it("is byte-identical to the engine's copy", () => {
    if (!fs.existsSync(ENGINE_COPY)) {
      // Only checkable where both repositories are present; the engine's own
      // runner performs the same check from its side.
      return;
    }
    const ours = fs.readFileSync(
      path.resolve(import.meta.dirname, "bed-cases.json"),
      "utf-8",
    );
    expect(fs.readFileSync(ENGINE_COPY, "utf-8")).toBe(ours);
  });
});

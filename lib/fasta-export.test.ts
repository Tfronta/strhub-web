import { describe, expect, it } from "vitest";
import { MAX_REPEAT_COUNT, parseRepeatCounts } from "./fasta-export";

describe("parseRepeatCounts", () => {
  it("accepts whole numbers as a list and/or ranges", () => {
    expect(parseRepeatCounts("10")).toEqual({ ok: true, counts: [10] });
    expect(parseRepeatCounts("10-12")).toEqual({ ok: true, counts: [10, 11, 12] });
    expect(parseRepeatCounts("12-10")).toEqual({ ok: true, counts: [10, 11, 12] });
    expect(parseRepeatCounts(" 9, 10-11 ,14 ")).toEqual({ ok: true, counts: [9, 10, 11, 14] });
    expect(parseRepeatCounts("11,11,10")).toEqual({ ok: true, counts: [10, 11] });
  });

  it("rejects microvariants instead of truncating them", () => {
    // String.repeat(9.3) used to give 9 copies labelled as 9.3.
    expect(parseRepeatCounts("9.3")).toEqual({ ok: false, reason: "decimal" });
    expect(parseRepeatCounts("9, 9.3")).toEqual({ ok: false, reason: "decimal" });
    expect(parseRepeatCounts("9.3-10")).toEqual({ ok: false, reason: "decimal" });
    expect(parseRepeatCounts("10.")).toEqual({ ok: false, reason: "decimal" });
  });

  it("rejects empty, non-numeric and out-of-range input", () => {
    expect(parseRepeatCounts("")).toEqual({ ok: false, reason: "empty" });
    expect(parseRepeatCounts(" , ")).toEqual({ ok: false, reason: "empty" });
    expect(parseRepeatCounts("abc")).toEqual({ ok: false, reason: "invalid" });
    expect(parseRepeatCounts("0")).toEqual({ ok: false, reason: "invalid" });
    expect(parseRepeatCounts("0-29")).toEqual({ ok: false, reason: "invalid" });
    expect(parseRepeatCounts(String(MAX_REPEAT_COUNT + 1))).toEqual({ ok: false, reason: "invalid" });
    expect(parseRepeatCounts("-5")).toEqual({ ok: false, reason: "invalid" });
  });
});

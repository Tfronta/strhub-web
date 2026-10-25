import { describe, expect, it } from "vitest";
import { findVariableBlock, parseStrnamingFormat } from "./find-core";

describe("parseStrnamingFormat", () => {
  it("reads fixed and [n] units in order", () => {
    expect(parseStrnamingFormat("TATC[n]AATC[2]ATCT[3]")).toEqual([
      { motif: "TATC", count: "n" },
      { motif: "AATC", count: 2 },
      { motif: "ATCT", count: 3 },
    ]);
  });

  it("drops a STRNaming variant suffix", () => {
    expect(parseStrnamingFormat("A[n]CTAT[1]CAATCTGT[1]CTAT[n]_-1T>-")).toEqual([
      { motif: "A", count: "n" },
      { motif: "CTAT", count: 1 },
      { motif: "CAATCTGT", count: 1 },
      { motif: "CTAT", count: "n" },
    ]);
  });

  it("rejects anything that is not a run of MOTIF[count] units", () => {
    expect(() => parseStrnamingFormat("")).toThrow();
    expect(() => parseStrnamingFormat("[ATCT]n")).toThrow();
    expect(() => parseStrnamingFormat("TCTA[n] TCTG[n]")).toThrow();
  });
});

describe("findVariableBlock", () => {
  it("takes the motif as written: no rotations", () => {
    // CTAT x 3 holds TATC x 2 in another phase.
    expect(findVariableBlock("CTATCTATCTAT", "TATC[n]")).toEqual({
      start: 1,
      end: 9,
      motif: "TATC",
      copies: 2,
    });
  });

  it("does not search the reverse complement", () => {
    expect(findVariableBlock("GATAGATAGATA", "TATC[n]")).toBeNull();
  });

  it("keeps the longest run in bases across the [n] motifs, not the fixed ones", () => {
    // AC x 6 (12 bp) and CTAT x 4 (16 bp); the fixed AATC[3] is ignored.
    const seq = "TT" + "AC".repeat(6) + "CTAT".repeat(4) + "AATC".repeat(5) + "GG";
    expect(findVariableBlock(seq, "AC[n]CTAT[n]AATC[3]")).toEqual({
      start: 14,
      end: 30,
      motif: "CTAT",
      copies: 4,
    });
  });

  it("breaks ties with the leftmost run", () => {
    const seq = "GG" + "TAGA".repeat(3) + "C" + "TAGA".repeat(3);
    expect(findVariableBlock(seq, "TAGA[n]")).toMatchObject({ start: 2, copies: 3 });
  });
});

import { describe, expect, it } from "vitest";
import { extraGateRowsFor } from "./extra-gates";

const t = (k: string) => k;

describe("the checks outside the ladder", () => {
  it("shows Starts then the example, only when the run made them", () => {
    expect(extraGateRowsFor(undefined, t)).toEqual([]);
    expect(extraGateRowsFor({ installs: true, runs: false }, t)).toEqual([]);
    const rows = extraGateRowsFor({ installs: true, example: false, starts: true }, t);
    expect(rows.map((r) => [r.key, r.passed])).toEqual([["starts", true], ["example", false]]);
    expect(rows[0].label).toBe("verified.trial.starts");
    expect(rows[0].meaning).toBe("verified.trial.startsMeaning");
  });
});

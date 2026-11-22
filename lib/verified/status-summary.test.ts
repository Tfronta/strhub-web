import { describe, expect, it } from "vitest";
import {
  classifyAuto,
  classifyManual,
  matchesCatalogFilter,
  rankToolGroup,
} from "./status-summary";

describe("status-summary", () => {
  it("classifies automatic statuses cleanly", () => {
    expect(classifyAuto({ level: "content", verdict: "runs" })).toEqual({
      kind: "pass",
      gatesPassed: 5,
    });
    expect(
      classifyAuto({ level: "content", verdict: "runs", errors_reported: true }),
    ).toEqual({
      kind: "pass_errors",
      gatesPassed: 5,
    });
    expect(classifyAuto({ level: "available", verdict: "fails" })).toEqual({
      kind: "fail",
      gatesPassed: 1,
    });
    expect(classifyAuto({ level: "available", verdict: "undetermined" })).toEqual({
      kind: "undetermined",
      gatesPassed: 1,
    });
    expect(classifyAuto({ level: "available", verdict: "out_of_scope" })).toEqual({
      kind: "out_of_scope",
      gatesPassed: 1,
    });
    expect(classifyAuto({ level: "content", instrument: "curated" })).toEqual({
      kind: "none",
      gatesPassed: 0,
    });
    expect(classifyAuto(null)).toEqual({ kind: "none", gatesPassed: 0 });
  });

  it("classifies manual statuses cleanly", () => {
    expect(classifyManual(null)).toBeNull();
    expect(
      classifyManual({ level: "content", verdict: "runs", instrument: "curated" }),
    ).toEqual({
      kind: "pass",
      gatesPassed: 5,
    });
    expect(
      classifyManual({
        level: "io",
        verdict: "runs",
        errors_reported: true,
        instrument: "curated",
      }),
    ).toEqual({
      kind: "pass_errors",
      gatesPassed: 4,
    });
    expect(
      classifyManual({ level: "installs", verdict: "fails", instrument: "curated" }),
    ).toEqual({
      kind: "fail",
      gatesPassed: 2,
    });
  });

  it("ranks automatic pass > manual verified pass > automatic fail > undetermined", () => {
    const autoPass = rankToolGroup({ level: "content", verdict: "runs" }, null);
    const manualPass = rankToolGroup(
      { level: "available", verdict: "undetermined" },
      { level: "content", verdict: "runs", instrument: "curated" },
    );
    const autoFail = rankToolGroup({ level: "available", verdict: "fails" }, null);
    const undetermined = rankToolGroup(
      { level: "available", verdict: "undetermined" },
      null,
    );

    expect(autoPass).toBeGreaterThan(manualPass);
    expect(manualPass).toBeGreaterThan(autoFail);
    expect(autoFail).toBeGreaterThan(undetermined);
  });

  it("matches catalogue filter chips accurately", () => {
    const autoPass = { level: "content" as const, verdict: "runs" };
    const autoFail = { level: "available" as const, verdict: "fails" };
    const autoUndet = { level: "available" as const, verdict: "undetermined" };
    const manualPass = {
      level: "content" as const,
      verdict: "runs",
      instrument: "curated" as const,
    };

    expect(matchesCatalogFilter("verified", autoPass, null)).toBe(true);
    expect(matchesCatalogFilter("auto", autoPass, null)).toBe(true);
    expect(matchesCatalogFilter("manual", autoPass, null)).toBe(false);

    expect(matchesCatalogFilter("verified", autoUndet, manualPass)).toBe(true);
    expect(matchesCatalogFilter("manual", autoUndet, manualPass)).toBe(true);
    expect(matchesCatalogFilter("undetermined", autoUndet, manualPass)).toBe(false);

    expect(matchesCatalogFilter("undetermined", autoUndet, null)).toBe(true);
    expect(matchesCatalogFilter("verified", autoUndet, null)).toBe(false);

    expect(matchesCatalogFilter("fail", autoFail, null)).toBe(true);
    expect(matchesCatalogFilter("undetermined", autoFail, null)).toBe(false);
  });
});

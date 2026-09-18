import { describe, expect, it } from "vitest";
import { instrumentOfReport, mayStandBehindBadge } from "./instrument";
import type { VerifiedReport } from "@/types/verified";

/** Mirror of harness/tests/test_instrument.py: the same reading, on the web. */
function report(over: Partial<VerifiedReport>): VerifiedReport {
  return { schema: "strhub-verified/1", tool: { name: "x" }, source: { repo: "r" }, environment: {},
    generated: "", gates: { none: false, available: true, installs: true, runs: true, io: true, content: true },
    level: "content", scope: "", ...over } as VerifiedReport;
}

describe("which instrument a report is", () => {
  it("is what the report recorded", () => {
    expect(instrumentOfReport(report({ instrument: "documented" }))).toBe("documented");
    expect(instrumentOfReport(report({ instrument: "curated", caveats: { source: "detect_recipe", items: [] } }))).toBe("curated");
  });

  it("is derived the way the engine derives it for a report from before", () => {
    expect(instrumentOfReport(report({ recipe: { origin: "proposed" } }))).toBe("documented");
    expect(instrumentOfReport(report({ recipe: { origin: "maintainer" } }))).toBe("maintainer");
    expect(instrumentOfReport(report({ recipe: { origin: "curated" } }))).toBe("curated");
    expect(instrumentOfReport(report({ caveats: { source: "detect_recipe", items: [] } }))).toBe("documented");
    expect(instrumentOfReport(report({ submission: { by: "maintainer" } }))).toBe("maintainer");
    expect(instrumentOfReport(report({ submission: { by: "third_party" } }))).toBe("curated");
    expect(instrumentOfReport(report({}))).toBe("curated");
  });

  it("lets only a documented or maintainer run stand behind the badge, and claims nothing of an unknown one", () => {
    expect(mayStandBehindBadge("documented")).toBe(true);
    expect(mayStandBehindBadge("maintainer")).toBe(true);
    expect(mayStandBehindBadge("curated")).toBe(false);
    expect(mayStandBehindBadge(null)).toBe(true);
  });
});

import { describe, expect, it } from "vitest";
import { locateReport } from "./trial-artifact";

describe("locating the report in a trial artifact", () => {
  it("reads the root layout of engines before c485b42", () => {
    const names = ["gangstr.badge.json", "gangstr.html", "gangstr.json", "gangstr.log-build.txt", "gangstr.pdf", "gangstr.recipe.json", "gangstr.summary.md"];
    expect(locateReport(names, "trial-gangstr-v2.5")).toEqual({ reportName: "gangstr.json", stem: "gangstr" });
  });

  it("reads the reports/ layout and never takes run_record.json for the report", () => {
    const names = ["reports/hipstr.badge.json", "reports/hipstr.html", "reports/hipstr.json", "reports/hipstr.pdf", "reports/hipstr.recipe.json", "reports/hipstr.summary.md", "run_record.json"];
    expect(locateReport(names, "trial-hipstr-v0.7")).toEqual({ reportName: "reports/hipstr.json", stem: "reports/hipstr" });
    expect(locateReport(["run_record.json"], "trial-hipstr-v0.7")).toBeNull();
  });

  it("prefers the file named after the slug when the artifact holds more than one report", () => {
    const names = ["reports/a.json", "reports/hipstr.json", "run_record.json"];
    expect(locateReport(names, "hipstr")?.reportName).toBe("reports/hipstr.json");
    expect(locateReport(["hipstr.json", "reports/hipstr.json"], "hipstr")?.reportName).toBe("reports/hipstr.json");
  });
});

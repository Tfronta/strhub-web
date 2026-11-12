import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { locateReport, parseArtifactZip } from "./trial-artifact";

/**
 * Real artifacts, byte for byte as GitHub served them, one per layout the
 * engine has uploaded. If the engine changes its side of the contract, the
 * fixture of a fresh trial goes here and this test says what the web stopped
 * reading.
 */
const fixture = (name: string) =>
  new Uint8Array(readFileSync(new URL(`./__fixtures__/${name}.zip`, import.meta.url)));

describe("a trial artifact of the reports/ layout (engine ≥ c485b42, run 43307658279)", () => {
  const parsed = parseArtifactZip(fixture("trial-hipstr-new-layout"), "trial-hipstr-v0.7", "tr_x");

  it("reads the report, never run_record.json", () => {
    expect(parsed.report?.schema).toBe("strhub-verified/1");
    expect(parsed.report?.tool.name).toBe("HipSTR");
    expect(parsed.report?.verdict?.code).toBe("undetermined");
    expect(parsed.report?.level).toBe("available");
    expect(parsed.report?.gates).toMatchObject({ available: true, installs: false });
  });

  it("reads the recipe, the summary, the PDF and the HTML written under the same stem", () => {
    expect(parsed.recipe?.slug).toBe("hipstr");
    expect(parsed.recipe?.manifest_yml).toContain("tfwillems/HipSTR");
    expect(parsed.summaryMd).toContain("HipSTR");
    expect(Object.keys(parsed.files ?? {}).sort()).toEqual(["html", "pdf"]);
    expect(parsed.files?.pdf).toBe("/api/verify/trial/file?id=tr_x&name=pdf");
    expect(parsed._bin.pdf?.length).toBeGreaterThan(1000);
  });

  it("carries no log and no terminal, because no leg ran", () => {
    // The review refused to build (no proven upstream install procedure), so
    // the only text is the verdict's reason. A leg that runs writes
    // `reports/<slug>.log-<leg>.txt` and `.terminal-<leg>.txt`, read off the
    // same stem.
    expect(parsed.logs).toEqual({});
    expect(parsed.report?.terminals ?? {}).toEqual({});
    expect(parsed.report?.verdict?.reason).toContain("no proven installation profile");
  });
});

describe("a trial artifact of the root layout (engine < c485b42, run 42488855247)", () => {
  const parsed = parseArtifactZip(fixture("trial-gangstr-root-layout"), "trial-gangstr-v2.5", "tr_y");

  it("still reads the report filed under the catalogue slug, not the run name", () => {
    expect(parsed.report?.schema).toBe("strhub-verified/1");
    expect(parsed.report?.tool.name).toBe("gangstr");
    expect(parsed.report?.verdict?.code).toBe("fails");
    expect(parsed.recipe?.slug).toBe("gangstr");
    expect(parsed.summaryMd).toContain("GangSTR");
  });

  it("reads the build log it carried", () => {
    expect(Object.keys(parsed.files ?? {}).sort()).toEqual(["html", "log-build", "pdf"]);
    expect(parsed.logs.build?.length).toBeGreaterThan(100);
  });
});

describe("locating the report by name", () => {
  it("prefers the file named after the slug when the artifact holds more than one report", () => {
    expect(locateReport(["reports/a.json", "reports/hipstr.json", "run_record.json"], "hipstr")?.reportName).toBe("reports/hipstr.json");
    expect(locateReport(["hipstr.json", "reports/hipstr.json"], "hipstr")?.reportName).toBe("reports/hipstr.json");
  });

  it("finds nothing in an artifact that holds only the run record", () => {
    expect(locateReport(["run_record.json"], "trial-hipstr-v0.7")).toBeNull();
  });
});

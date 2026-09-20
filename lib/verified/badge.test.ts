import { describe, expect, it } from "vitest";
import { badgeFor, reachedLabel } from "./badge";

const t = (k: string, p?: Record<string, string>) => {
  const table: Record<string, string> = {
    "verified.headline.runs": "Runs as documented",
    "verified.headline.runsErrors": "Runs as documented (errors reported)",
    "verified.headline.notRun": "Does not run as documented: {where}",
    "verified.headline.stopsAt.none": "source not available",
    "verified.headline.stopsAt.available": "stops at install",
    "verified.headline.stopsAt.installs": "stops at run",
    "verified.headline.stopsAt.runs": "no output",
    "verified.headline.undetermined": "Could not be determined",
    "verified.headline.outOfScope": "Out of scope",
    "verified.headline.notDocumented": "Not verified as documented",
  };
  let s = table[k] ?? k;
  for (const [key, v] of Object.entries(p ?? {})) s = s.replace(`{${key}}`, v);
  return s;
};

/**
 * The label says the result as it is in the repository, in words — the same
 * rule as harness/certificate_text.py::headline — and never the rung reached.
 */
describe("the label", () => {
  it("says the documented run runs, qualified by reported errors", () => {
    expect(badgeFor({ level: "content", verdict: "runs" }, t)).toEqual({ label: "Runs as documented", tone: "green" });
    expect(badgeFor({ level: "io", verdict: "runs", errors_reported: true }, t)).toEqual({ label: "Runs as documented (errors reported)", tone: "amber" });
  });

  it("says where a documented run that does not run stopped, not the rung it reached", () => {
    expect(badgeFor({ level: "installs", verdict: "fails" }, t)).toEqual({ label: "Does not run as documented: stops at run", tone: "red" });
    expect(badgeFor({ level: "available", verdict: "fails" }, t)).toEqual({ label: "Does not run as documented: stops at install", tone: "red" });
    expect(badgeFor({ level: "runs", verdict: "fails" }, t).label).toBe("Does not run as documented: no output");
  });

  it("leads with the verdict when nobody knew how to attempt the run", () => {
    expect(badgeFor({ level: "installs", verdict: "undetermined" }, t)).toEqual({ label: "Could not be determined", tone: "grey" });
    expect(badgeFor({ level: "runs", verdict: "out_of_scope" }, t).tone).toBe("grey");
  });

  it("never shows a run of STRhub's recipe as the tool's own, whatever it reached", () => {
    expect(badgeFor({ level: "content", verdict: "runs", instrument: "curated" }, t)).toEqual({ label: "Not verified as documented", tone: "grey" });
  });

  it("reads a report from before the verdict off the rung", () => {
    expect(badgeFor({ level: "content" }, t).label).toBe("Runs as documented");
    expect(badgeFor({ level: "installs" }, t).label).toBe("Does not run as documented: stops at run");
  });

  it("keeps the rung as a detail", () => {
    expect(reachedLabel("io")).toBe("Runs + Expected IO");
    expect(reachedLabel("none")).toBe("Not run");
  });
});

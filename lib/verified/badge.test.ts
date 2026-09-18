import { describe, expect, it } from "vitest";
import { badgeFor } from "./badge";

const t = (k: string) => ({
  "verified.trial.verdict.undetermined": "Could not be determined",
  "verified.trial.verdict.out_of_scope": "Out of scope",
  "verified.errorsBadgeSuffix": "(errors reported)",
  "verified.instrument.badgeSuffix": "STRhub's recipe",
})[k] ?? k;

/** One rule for the badge everywhere; the same one harness/report.py writes. */
describe("the badge", () => {
  it("is the level reached, qualified by reported errors", () => {
    expect(badgeFor({ level: "content" }, t)).toEqual({ label: "Runs + Plausible output", tone: "green" });
    expect(badgeFor({ level: "io", errors_reported: true }, t)).toEqual({ label: "Runs + Expected IO (errors reported)", tone: "amber" });
    expect(badgeFor({ level: "installs", verdict: "fails" }, t)).toEqual({ label: "Installs", tone: "amber" });
  });

  it("leads with the verdict when nobody knew how to attempt the run", () => {
    // Not "Installs": that rung says nothing about a tool whose README does not say how to run it.
    expect(badgeFor({ level: "installs", verdict: "undetermined" }, t)).toEqual({ label: "Could not be determined", tone: "grey" });
    expect(badgeFor({ level: "runs", verdict: "out_of_scope" }, t).tone).toBe("grey");
  });

  it("marks a run of STRhub's recipe only when asked to, so a row's tag and a header's suffix do not double up", () => {
    expect(badgeFor({ level: "content", instrument: "curated" }, t).label).toBe("Runs + Plausible output");
    expect(badgeFor({ level: "content", instrument: "curated" }, t, { markCurated: true }).label).toBe("Runs + Plausible output · STRhub's recipe");
    expect(badgeFor({ level: "content", instrument: "documented" }, t, { markCurated: true }).label).toBe("Runs + Plausible output");
  });
});

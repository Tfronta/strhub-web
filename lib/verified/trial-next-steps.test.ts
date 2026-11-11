import { describe, expect, it } from "vitest";
import { ownerIssueUrl } from "./trial-next-steps";
import type { TrialReport } from "./trial";

const report = {
  schema: "strhub-verified/1",
  tool: { name: "GangSTR" },
  source: { repo: "https://github.com/gymreklab/gangstr", ref: "6ea9b2b8daca51dcab1f0e46210622b94b52ff17" },
  environment: {},
  generated: "2026-09-14T00:00:00Z",
  ci_run: "https://github.com/Tfronta/strhub-verified/actions/runs/34881617486",
  gates: { none: false, available: true, installs: true, runs: false, io: false, content: false },
  level: "installs",
  scope: "",
} as unknown as TrialReport;

describe("trial next steps", () => {
  it("drafts an owner issue with the blocker's request, the commit and the run", () => {
    const url = ownerIssueUrl(report, {
      code: "regions_format_unknown",
      what: "needs a regions file",
      self_fix: "upload_regions",
      self_fix_text: "",
      ask_owner: { title: "Publish a regions file (hg38) for forensic STR loci", body: "Please." },
    }, "https://strhub.app/verified/trial/tr_x");
    expect(url).toContain("https://github.com/gymreklab/gangstr/issues/new?title=");
    const body = decodeURIComponent(url!.split("&body=")[1]);
    expect(body).toContain("6ea9b2b8daca51dcab1f0e46210622b94b52ff17");
    expect(body).toContain("actions/runs/34881617486");
    expect(body).toContain("https://strhub.app/verified/trial/tr_x");
  });
});

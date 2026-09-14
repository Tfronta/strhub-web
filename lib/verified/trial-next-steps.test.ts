import { describe, expect, it } from "vitest";
import { formStateFromTrial, innerCommand, ownerIssueUrl } from "./trial-next-steps";
import type { TrialRecipe, TrialReport } from "./trial";

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

const recipe: TrialRecipe = {
  schema: "strhub-verified/recipe/1",
  slug: "trial-gangstr",
  manifest_yml: [
    "tool:",
    "  name: GangSTR",
    "run:",
    "  cmd: cd '/opt/tool' && touch /tmp/.strhub_mark && ( GangSTR --bam /data/in/input.bam --ref /data/ref/hg38.fa --regions /data/in/regions.bed --out out ); rc=$?; find . ; exit $rc",
    "inputs:",
    "  type: illumina-bam-hg38",
    "outputs:",
    "- path: '**/*.vcf*'",
    "  format: vcf",
  ].join("\n"),
  dockerfile: "FROM mambaorg/micromamba:1.5.8\nRUN micromamba install gangstr\n",
};

describe("trial next steps", () => {
  it("strips the engine's capture wrapper from the command", () => {
    expect(innerCommand("cd '/x' && touch /tmp/.strhub_mark && ( tool -i a -o b ); rc=$?; find .; exit $rc")).toBe("tool -i a -o b");
    expect(innerCommand("tool -i a")).toBe("tool -i a");
  });

  it("builds the advanced form's state from what the trial ran", () => {
    const st = formStateFromTrial(report, recipe);
    expect(st.f.repo).toBe("https://github.com/gymreklab/gangstr");
    expect(st.f.ref).toBe("6ea9b2b8daca51dcab1f0e46210622b94b52ff17");
    expect(st.f.cmd).toBe("GangSTR --bam /data/in/input.bam --ref /data/ref/hg38.fa --regions /data/in/regions.bed --out out");
    expect(st.f.inputType).toBe("illumina-bam-hg38");
    expect(st.f.outputPath).toBe("**/*.vcf*");
    expect(st.f.outputFormat).toBe("vcf");
    expect(st.dockerMode).toBe("provided");
    expect(st.f.dockerfile).toContain("micromamba install gangstr");
  });

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

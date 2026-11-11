import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { VerifiedReportBody } from "@/components/verified/report/verified-report-body";
import type { VerifiedReport } from "@/types/verified";
import { certificateOf } from "./certificate";
import { blockedBeforeInstall } from "./gate-state";
import { translate } from "@/lib/translations";
import { getPublishedFailureExcerpt } from "@/lib/verified";

vi.mock("@/contexts/language-context", () => ({
  useLanguage: () => ({ t: (key: string) => key, language: "en" }),
}));

const report: VerifiedReport = {
  schema: "strhub-verified/1",
  tool: { name: "Example" },
  source: { repo: "https://github.com/example/tool", ref: "a".repeat(40) },
  environment: { os: ["ubuntu-22.04"] },
  generated: "2026-11-11T00:00:00Z",
  level: "available",
  gates: { none: false, available: true, installs: false, runs: false, io: false, content: false },
  scope: "",
  verdict: { code: "undetermined", title: "Could not be determined", basis: "strhub", reason: "Installation profile unsupported." },
  procedure_validation: { schema: "strhub-procedure-evidence/1", valid: true, reason: "Matched" },
  procedure_review: { install_ready: false, may_say_runs: false },
  run: { cmd: "candidate-command", step_outcome: "skipped" },
  needed_beyond_repo: ["A proposed test dataset."],
};

describe("procedure blocked before installation", () => {
  it("renders the evidence and blocked gate without presenting the proposed configuration as an attempt", () => {
    const html = renderToStaticMarkup(createElement(VerifiedReportBody, {
      report,
      slug: "example",
      logs: [{
        leg: "build",
        label: "Build",
        text: "Procedure classifier blocker: install_profile_unsupported\nReason: documented file not found",
      }],
      afterSource: "candidate Dockerfile",
    }));
    expect(html).toContain("Installation profile unsupported.");
    expect(html).toContain("verified.gate.state.blocked");
    expect(html).toContain("verified.gate.state.skipped");
    expect(html).toContain("verified.certificate.conclusion.blockedTitle");
    expect(html).toContain("verified.trial.preflightExcerptTitle");
    expect(html).toContain("Procedure classifier blocker: install_profile_unsupported");
    expect(html).not.toContain("verified.trial.probableCauseLabel");
    expect(html).not.toContain("verified.trial.errorExcerptTitle");
    expect(html).not.toContain("verified.gate.state.fail");
    expect(html).not.toContain("verified.whatVerified.installation");
    expect(html).not.toContain("candidate-command");
    expect(html).not.toContain("candidate Dockerfile");
    expect(html).not.toContain("A proposed test dataset.");
  });

  it("localizes the blocked conclusion", () => {
    const certificate = certificateOf(report, "No se pudo determinar", (key, vars) => translate("es", key, vars));
    expect(certificate.conclusion.map((item) => item.title)).toEqual(["La instalación no se intentó"]);
  });

  it("requires explicit procedure evidence and leaves observed execution outside the pre-install case", () => {
    expect(blockedBeforeInstall({ ...report, procedure_review: undefined })).toBe(false);
    expect(blockedBeforeInstall({ ...report, run: { step_outcome: "failure" } })).toBe(false);
  });
});

describe("archived failure log", () => {
  const page = "https://archive.example/tool/sha/report.html";
  const filename = "tool.log-external.txt";
  const log = "FATAL: cannot open <input.bam>";
  const failure: VerifiedReport = {
    ...report,
    procedure_validation: undefined,
    procedure_review: undefined,
    verdict: { code: "fails", title: "Failed", reason: "Execution stopped." },
    gates: { ...report.gates, installs: true },
    run: { step_outcome: "failure" },
    logs: { external: filename, build: "tool.log-build.txt" },
  };

  it("reads the archived log next to the report and renders its escaped text and possible cause", async () => {
    const fetchLog = vi.fn<typeof fetch>().mockResolvedValue(new Response(log));
    vi.stubGlobal("fetch", fetchLog);
    try {
      const logExcerpt = await getPublishedFailureExcerpt(failure, page);
      expect(fetchLog).toHaveBeenCalledTimes(1);
      expect(String(fetchLog.mock.calls[0][0])).toBe(new URL(filename, page).href);
      const html = renderToStaticMarkup(createElement(VerifiedReportBody, {
        report: failure,
        slug: "example",
        logs: [{ leg: "external", label: "Execution", href: new URL(filename, page).href }],
        logExcerpt,
      }));
      expect(html).toContain("FATAL: cannot open &lt;input.bam&gt;");
      expect(html).toContain("verified.trial.probableCauseLabel");
      expect(html).toContain("verified.trial.hint.pathOrFile");
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("does not read a log outside the report's directory", async () => {
    const fetchLog = vi.fn<typeof fetch>();
    vi.stubGlobal("fetch", fetchLog);
    try {
      await expect(getPublishedFailureExcerpt({
        ...failure, logs: { external: "../other.log.txt" },
      }, page)).resolves.toBeNull();
      expect(fetchLog).not.toHaveBeenCalled();
    } finally {
      vi.unstubAllGlobals();
    }
  });
});

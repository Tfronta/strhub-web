import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { VerifiedReportBody } from "@/components/verified/report/verified-report-body";
import type { VerifiedReport } from "@/types/verified";
import { certificateOf } from "./certificate";
import { blockedBeforeInstall } from "./gate-state";
import { translate } from "@/lib/translations";

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
      logs: [],
      afterSource: "candidate Dockerfile",
    }));
    expect(html).toContain("Installation profile unsupported.");
    expect(html).toContain("verified.gate.state.blocked");
    expect(html).toContain("verified.gate.state.skipped");
    expect(html).toContain("verified.certificate.conclusion.blockedTitle");
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

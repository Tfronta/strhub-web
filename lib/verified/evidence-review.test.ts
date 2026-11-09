import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { VerifiedEditorialNotice, VerifiedIndex } from "@/types/verified";
import { badgeFor } from "./badge";
import { commandPresentation } from "./command";
import { VerifiedDetail } from "@/components/verified/verified-detail";
import { VerifiedList } from "@/components/verified/verified-list";
import { RunCommandCard } from "@/components/verified/report/source-card";

vi.mock("@/contexts/language-context", () => ({
  useLanguage: () => ({ t: (key: string) => key, language: "en" }),
}));
vi.mock("@/components/verified/report/verified-report-body", () => ({
  VerifiedReportBody: () => { throw new Error("an editorial notice is not an execution report"); },
}));

// Real notices intentionally carry no execution fields. Do not fill gates with
// false just to satisfy the legacy report renderer: that would invent failures.
const notice: VerifiedEditorialNotice = {
  schema: "strhub-verified/1", record_type: "editorial_review", tool: { name: "GangSTR" },
  source: { repo: "https://github.com/gymreklab/gangstr" },
  generated: "2026-11-09T00:00:00Z", ci_run: null, scope: "Editorial review, no execution.",
  evidence_review: {
    id: "review-1", reviewed_at: "2026-11-09T00:00:00Z", reason: "The linked CI belongs to another recipe.",
    archive_url: "https://github.com/example/archive", review_url: "https://github.com/example/review",
    recovered_evidence_note: "A separate trial was recovered and is preserved independently.",
  },
};

describe("editorial evidence notices", () => {
  it("renders a notice without execution fields, gates, or repair suggestions", () => {
    const html = renderToStaticMarkup(createElement(VerifiedDetail, {
      report: notice, slug: "gangstr", staticPageUrl: "/notice.html", pdfUrl: "/notice.pdf", jsonUrl: "/notice.json",
    }));
    expect(html).toContain("verified.evidenceReview.title");
    expect(html).toContain(notice.evidence_review!.reason);
    expect(html).toContain("https://github.com/example/archive");
    expect(html).not.toContain("verified.gate");
    expect(html).not.toContain("verified.trial.reproTips");
  });

  it("keeps an insufficient-evidence card when every historical run is retired", () => {
    const index = { tools: [{
      slug: "gangstr", name: "GangSTR", record_type: "editorial_review",
      source_repo: notice.source.repo, level: "none", verdict: "undetermined",
      versions: [{ sha: "a".repeat(40), retired: { retired: "2026-11-09", reason: "unsupported" } }],
    }] } as unknown as VerifiedIndex;
    const html = renderToStaticMarkup(createElement(VerifiedList, { index }));
    expect(html).toContain('href="/verified/gangstr"');
    expect(html).toContain("verified.evidenceReview.title");
    expect(html).not.toContain("verified.summary.gatesPassed");
    expect(html).not.toContain("verified.history.verifiedOn");
    expect(badgeFor({ level: "content", verdict: "runs", record_type: "editorial_review" }, (k) => k).tone).toBe("grey");
  });
});

describe("command execution evidence", () => {
  it.each([undefined, "skipped", "cancelled", "unknown"])("does not call outcome %s an executed command", (outcome) => {
    expect(commandPresentation(outcome).heading).toBe("verified.commandEvidence.planned");
    const html = renderToStaticMarkup(createElement(RunCommandCard, { cmd: "tool --threshold 30", outcome }));
    expect(html).toContain("verified.commandEvidence.planned");
    expect(html).not.toContain("verified.run.note");
  });
  it.each(["success", "failure"])("records submission for outcome %s", (outcome) => {
    expect(commandPresentation(outcome).heading).toBe("verified.commandEvidence.submitted");
  });
});

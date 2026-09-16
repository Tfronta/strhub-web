import { describe, expect, it } from "vitest";
import { buildDisputeLink } from "./dispute";
import type { VerifiedReport } from "@/types/verified";

/**
 * The dispute link is the reader's way to say a published attestation is wrong.
 * What matters is where it points (STRhub's own repo, never the tool's), that it
 * carries enough to find the exact attestation, and that it only prefills a form
 * the reader submits — it never posts.
 */
function report(overrides: Partial<VerifiedReport> = {}): VerifiedReport {
  return {
    schema: "strhub-verified/1",
    tool: { name: "STRspy", version: "2.0" },
    source: {
      repo: "https://github.com/unique379r/strspy",
      ref_resolved: "dafdee7",
    },
    generated: "2026-09-01T10:00:00+00:00",
    ci_run: "https://github.com/Tfronta/strhub-verified/actions/runs/42",
    gates: { none: false, available: true, installs: true, runs: true, io: true, content: false },
    level: "io",
    ...overrides,
  } as VerifiedReport;
}

const PAGE = "https://strhub.app/verified/strspy-v2-0-ont";

describe("dispute link", () => {
  it("files against STRhub's engine repo, not the tool's", () => {
    const { url } = buildDisputeLink(report(), "strspy-v2-0-ont", PAGE);
    // The reader is questioning what STRhub published, so the issue lands on
    // STRhub's own repository — the tool's URL rides along in the body only as
    // context, never as the destination.
    expect(url.split("?")[0]).toBe("https://github.com/Tfronta/strhub-verified/issues/new");
  });

  it("carries what it takes to find the exact attestation", () => {
    const { url } = buildDisputeLink(report(), "strspy-v2-0-ont", PAGE);
    const body = decodeURIComponent(url.split("&body=")[1]);
    expect(body).toContain("strspy-v2-0-ont");
    expect(body).toContain("https://github.com/unique379r/strspy @ `dafdee7`");
    expect(body).toContain(PAGE);
    expect(body).toContain("actions/runs/42");
    expect(body).toContain("2026-09-01");
  });

  it("names the tool and the slug in the title", () => {
    const { url } = buildDisputeLink(report(), "strspy-v2-0-ont", PAGE);
    expect(url).toContain(encodeURIComponent("Possible error in the STRspy 2.0 attestation (strspy-v2-0-ont)"));
  });

  it("prompts for the finding and the reader's grounds", () => {
    const body = decodeURIComponent(buildDisputeLink(report(), "s", PAGE).url.split("&body=")[1]);
    expect(body).toContain("## What looks wrong");
    expect(body).toContain("## How you know");
  });

  it("degrades to a bare repo and ref rather than printing undefined", () => {
    const { url } = buildDisputeLink(
      report({ source: { repo: undefined as unknown as string }, ci_run: undefined }),
      "s",
      PAGE,
    );
    const body = decodeURIComponent(url.split("&body=")[1]);
    expect(body).toContain("Source: — @ `—`");
    expect(body).not.toContain("undefined");
    expect(body).not.toContain("CI run:");
  });

  it("stays well under the prefill ceiling for a normal report", () => {
    expect(buildDisputeLink(report(), "strspy-v2-0-ont", PAGE).tooLong).toBe(false);
  });
});

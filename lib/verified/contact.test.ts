import { describe, expect, it } from "vitest";
import { attestationContactMailto, CONTACT_EMAIL } from "./contact";

/**
 * The contact link is for the reader who will not, or cannot, open a GitHub
 * issue. What matters is that it reaches the same address the rest of Verified
 * uses, that it names the exact attestation, and that it sends nothing itself.
 */
const report = {
  tool: { name: "HipSTR", version: "12e989b" },
  source: { repo: "https://github.com/tfwillems/HipSTR", ref_resolved: "12e989be4a8f" },
  ci_run: "https://github.com/Tfronta/strhub-verified/actions/runs/42",
};

describe("attestation contact mailto", () => {
  it("addresses the one STRhub inbox and names the attestation in the subject", () => {
    const url = attestationContactMailto(report, "hipstr", "https://strhub.app/verified/hipstr", "About the attestation");
    expect(url.startsWith(`mailto:${CONTACT_EMAIL}?`)).toBe(true);
    const subject = decodeURIComponent(url.split("subject=")[1].split("&")[0]);
    expect(subject).toBe("About the attestation: HipSTR 12e989b (hipstr)");
  });

  it("carries what it takes to find the exact attestation", () => {
    const url = attestationContactMailto(report, "hipstr", "https://strhub.app/verified/hipstr", "About the attestation");
    const body = decodeURIComponent(url.split("&body=")[1]);
    expect(body).toContain("Attestation: hipstr");
    expect(body).toContain("Source: https://github.com/tfwillems/HipSTR @ 12e989be4a8f");
    expect(body).toContain("Report: https://strhub.app/verified/hipstr");
    expect(body).toContain("CI run: https://github.com/Tfronta/strhub-verified/actions/runs/42");
  });

  it("omits what the report does not have rather than sending blanks", () => {
    const url = attestationContactMailto({ tool: { name: "x" }, source: { repo: "" } }, "x", "", "About");
    const body = decodeURIComponent(url.split("&body=")[1]);
    expect(body).not.toContain("Source:");
    expect(body).not.toContain("Report:");
    expect(body).not.toContain("CI run:");
  });
});

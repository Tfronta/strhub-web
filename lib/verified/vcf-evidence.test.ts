import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { VerifiedIoOutput } from "@/types/verified";
import { OutputContent } from "@/components/verified/report/output";
import { vcfFileEvidence } from "./output-evidence";

vi.mock("@/contexts/language-context", () => ({ useLanguage: () => ({ t: (k: string) => k, language: "en" }) }));

describe("VCF structural evidence", () => {
  it("does not reinterpret a legacy call count as a data-row count", () => {
    expect(vcfFileEvidence({ format: "vcf", records: 0, uncalled_rows: 5 })).toEqual([]);
  });
  it("shows every inspected file even without plausibility stats", () => {
    const io: VerifiedIoOutput = { validation_profile: "strhub-vcf-structure/1", files: [
      { resolved: "a.vcf", validation_status: "valid", records: 7, called_records: 3, uncalled_rows: 4, records_without_gt: 0 },
      { resolved: "b.vcf", validation_status: "invalid", records: 0, parse_error: "line 8: invalid GT syntax" },
    ] };
    const html = renderToStaticMarkup(createElement(OutputContent, { stats: undefined, io }));
    expect(html).toContain("a.vcf"); expect(html).toContain("b.vcf");
    expect(html).toContain("invalid GT syntax");
    expect(html).not.toContain("verified.content.noOutputGenerated");
    expect(html).toContain("verified.vcfEvidence.called");
    const failedRow = html.slice(html.indexOf("b.vcf"));
    expect(failedRow).toContain("—");
    expect(failedRow).not.toContain(">0<");
  });
  it("labels unsupported features as evaluator limits", () => {
    const io: VerifiedIoOutput = { validation_profile: "strhub-vcf-structure/1", files: [
      { resolved: "future.vcf", validation_status: "unsupported", records: 0 },
    ] };
    const html = renderToStaticMarkup(createElement(OutputContent, { stats: undefined, io }));
    expect(html).toContain("verified.vcfEvidence.unsupported");
    expect(html).not.toContain("verified.vcfEvidence.invalid");
  });
});

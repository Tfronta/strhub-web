import { describe, expect, it } from "vitest";
import en from "@/lib/i18n/locales/en/verified";
import es from "@/lib/i18n/locales/es/verified";
import pt from "@/lib/i18n/locales/pt/verified";
import type { VerifiedReport } from "@/types/verified";
import { badgeFor } from "./badge";
import { certificateOf } from "./certificate";
import { isTrialFileName, LOG_LEGS } from "./log-files";
import {
  classifyAuto,
  matchesCatalogFilter,
  rankToolGroup,
} from "./status-summary";

type Dict = Record<string, unknown>;

function makeT(localeObj: Dict) {
  return (key: string, params?: Record<string, string>): string => {
    const parts = key.split(".");
    let cur: unknown = localeObj;
    for (const part of parts) {
      if (cur && typeof cur === "object" && part in (cur as Dict)) {
        cur = (cur as Dict)[part];
      } else {
        return key;
      }
    }
    if (typeof cur !== "string") return key;
    let out = cur;
    for (const [k, v] of Object.entries(params ?? {})) {
      out = out.replaceAll(`{${k}}`, v);
    }
    return out;
  };
}

describe("Phase 3 — Assisted track ('Corre con ajustes') & canonical report", () => {
  const tEs = makeT(es as unknown as Dict);
  const tEn = makeT(en as unknown as Dict);
  const tPt = makeT(pt as unknown as Dict);

  it("renders 'Corre con ajustes' / 'Runs with adjustments' / 'Executa com ajustes' in amber when assisted_runs is true", () => {
    expect(
      badgeFor(
        { level: "installs", verdict: "undetermined", assisted_runs: true },
        tEs,
      ),
    ).toEqual({ label: "Corre con ajustes", tone: "amber" });

    expect(
      badgeFor(
        { level: "available", verdict: "fails", assisted_runs: true },
        tEn,
      ),
    ).toEqual({ label: "Runs with adjustments", tone: "amber" });

    expect(
      badgeFor(
        { level: "installs", verdict: "undetermined", assisted_runs: true },
        tPt,
      ),
    ).toEqual({ label: "Executa com ajustes", tone: "amber" });

    // Literal Track 1 pass always keeps green 'Corre según su documentación'
    expect(
      badgeFor({ level: "content", verdict: "runs", assisted_runs: true }, tEs),
    ).toEqual({ label: "Corre según su documentación", tone: "green" });
  });

  it("classifies, ranks, and filters assisted runs between literal auto pass and manual pass", () => {
    const autoClean = { level: "content" as const, verdict: "runs" };
    const autoAdjusted = {
      level: "installs" as const,
      verdict: "undetermined",
      assisted_runs: true,
      assisted_level: "content" as const,
    };
    const manualPass = {
      level: "content" as const,
      verdict: "runs",
      instrument: "curated" as const,
    };
    const autoFail = { level: "available" as const, verdict: "fails" };

    expect(classifyAuto(autoAdjusted)).toEqual({
      kind: "pass_adjusted",
      gatesPassed: 5,
    });

    expect(rankToolGroup(autoClean, null)).toBeGreaterThan(
      rankToolGroup(autoAdjusted, null),
    );
    expect(rankToolGroup(autoAdjusted, null)).toBeGreaterThan(
      rankToolGroup({ level: "available", verdict: "undetermined" }, manualPass),
    );
    expect(
      rankToolGroup({ level: "available", verdict: "undetermined" }, manualPass),
    ).toBeGreaterThan(rankToolGroup(autoFail, null));

    expect(matchesCatalogFilter("verified", autoAdjusted, null)).toBe(true);
    expect(matchesCatalogFilter("assisted", autoAdjusted, null)).toBe(true);
    expect(matchesCatalogFilter("auto", autoAdjusted, null)).toBe(false);
    expect(matchesCatalogFilter("undetermined", autoAdjusted, null)).toBe(false);
  });

  it("exposes assisted-build and assisted-external log & terminal files", () => {
    expect(LOG_LEGS).toContain("assisted-build");
    expect(LOG_LEGS).toContain("assisted-external");
    expect(isTrialFileName("log-assisted-build")).toBe(true);
    expect(isTrialFileName("terminal-assisted-external")).toBe(true);
  });

  it("localizes the assisted conclusion item across ES, EN, and PT", () => {
    const mockReport: VerifiedReport = {
      schema: "strhub-verified/1",
      tool: { name: "straglr", version: "v1.5.5" },
      source: { repo: "https://github.com/bcgsc/straglr", ref_resolved: "edfa209" },
      environment: { source: "documented", os: ["ubuntu-22.04"] },
      generated: "2026-11-26T12:00:00Z",
      gates: {
        none: false,
        available: true,
        installs: true,
        runs: false,
        io: false,
        content: false,
      },
      level: "installs",
      verdict: {
        code: "undetermined",
        title: "Could not be determined",
        reason: "This evaluator cannot establish that the cited command reads the declared reference input; no config or input list was rewritten to make it do so.",
      },
      procedure_validation: {
        schema: "strhub-procedure-evidence/1",
        valid: true,
        reason: "ok",
      },
      procedure_review: { install_ready: true, may_say_runs: false },
      certificate: {
        schema: "strhub-verified/certificate/1",
        label: "Runs with adjustments",
        reached: "Installs",
        summary: {
          purpose: "Evaluate execution",
          result: "Runs with adjustments",
          reached: "Installs, 2/5 gates passed",
          scope: "Execution",
          not_evaluated: [],
        },
        conclusion: [
          { title: "Procedure not established", body: "Not established." },
          {
            title: "Automated verification with adjustments",
            body: "Assisted track ran.",
          },
        ],
        out_of_scope: [],
        limitations: [],
        scope: { statement: "s", not: "n", disclaimer: "d" },
      },
      assisted_run: {
        attempted: true,
        passed: true,
        level: "content",
        content_verified: true,
        gates: {
          available: true,
          installs: true,
          runs: true,
          io: true,
          content: true,
        },
        adjustments: [
          {
            rule_id: "positional_reads_arg",
            category: "cli_invocation",
            what_failed_strict: "Positional BAM",
            adjustment_applied: "Bound sample.mm2.bam -> /data/in/input.bam",
            author_fix: "Document --bam flag or ship sample",
          },
        ],
      },
      scope: "Execution scope",
    };

    const certEs = certificateOf(mockReport, "Corre con ajustes", tEs, "es");
    expect(
      certEs.conclusion.some(
        (c) => c.title === "Verificación automática con ajustes",
      ),
    ).toBe(true);
  });
});

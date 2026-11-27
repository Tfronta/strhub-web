import { describe, expect, it } from "vitest";
import en from "@/lib/i18n/locales/en/verified";
import es from "@/lib/i18n/locales/es/verified";
import pt from "@/lib/i18n/locales/pt/verified";
import { buildHumanConclusion } from "@/components/verified/report/human-conclusion";
import type { VerifiedReport } from "@/types/verified";
import { badgeFor } from "./badge";
import { certificateOf, localizeNeededItem } from "./certificate";
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

  it("contains zero leaked /app:ro, em-dashes, or arrow glyphs in assisted & annex locales and localizes Run 2 needed_beyond_repo", () => {
    for (const loc of [es, en, pt]) {
      const v = (loc as unknown as { verified: { assisted: Record<string, string>; annex: Record<string, string> } }).verified;
      for (const str of [...Object.values(v.assisted), ...Object.values(v.annex)]) {
        expect(str.toLowerCase()).not.toContain("/app:ro");
        expect(str).not.toContain("—");
        expect(str).not.toContain("↓");
        expect(str).not.toContain("→");
        expect(str).not.toContain("->");
      }
    }

    const assistedDataItem =
      "Test data: no sample from the repository was used; STRhub executed the assisted verification run using its public reference sample.";
    const assistedEnvItem =
      "Base environment and assisted adjustments: STRhub ran the assisted verification on Ubuntu 22.04 with Ubuntu build packages (cmake, autoconf, zlib1g-dev). Unpinned system and package versions can vary over time.";

    expect(localizeNeededItem(assistedDataItem, tEs)).toContain(
      "STRhub ejecutó la verificación con su muestra pública de referencia",
    );
    expect(localizeNeededItem(assistedEnvItem, tEs)).toContain(
      "Entorno base y paquetes adicionales aplicados en la corrida 2",
    );
    expect(localizeNeededItem(assistedEnvItem, tEn)).toContain(
      "Base environment and Run 2 adjustments",
    );
    expect(localizeNeededItem(assistedEnvItem, tPt)).toContain(
      "Ambiente base e ajustes da Execução 2",
    );
  });

  it("builds a short, everyday-language 4-topic conclusion free of git/Docker/CLI jargon in ES, EN, and PT", () => {
    const bannedWords = [
      "git",
      "commit",
      "sha",
      "docker",
      "container",
      "contenedor",
      "contêiner",
      "cli",
      "readme",
      "vcf",
      "bam",
    ];
    const bannedTokens = ["/app:ro", "—", "->", "→"];
    for (const loc of [es, en, pt]) {
      const hc = (loc as unknown as { verified: { humanConclusion: Record<string, string> } }).verified
        .humanConclusion;
      for (const [k, val] of Object.entries(hc)) {
        const lower = val.toLowerCase();
        for (const word of bannedWords) {
          expect(new RegExp(`(^|[^a-záéíóúâêôãõç])${word}($|[^a-záéíóúâêôãõç])`, "i").test(lower), `${k} (${word}): ${val}`).toBe(false);
        }
        for (const tok of bannedTokens) {
          expect(lower, `${k}: ${val}`).not.toContain(tok);
        }
      }
    }

    const adjustedReport: VerifiedReport = {
      schema: "strhub-verified/1",
      tool: { name: "LongTR", version: "v1.2" },
      source: { repo: "https://github.com/gymrek-lab/LongTR", ref_resolved: "2be6cf5" },
      environment: { source: "documented", os: ["ubuntu-22.04"] },
      generated: "2026-11-26T12:00:00Z",
      gates: {
        none: false,
        available: true,
        installs: false,
        runs: false,
        io: false,
        content: false,
      },
      level: "available",
      verdict: { code: "fails", title: "Fails", reason: "Build failed." },
      assisted_run: {
        attempted: true,
        passed: true,
        level: "content",
        adjustments: [],
        gates: {
          available: true,
          installs: true,
          runs: true,
          io: true,
          content: true,
        },
      },
      scope: "Execution scope",
    };

    const resEs = buildHumanConclusion(adjustedReport, false, tEs);
    expect(resEs.items).toHaveLength(4);
    expect("lead" in resEs).toBe(false);
    expect(resEs.items[0].title).toBe("¿El programa funciona?");
    expect(resEs.items[0].body).toContain("funciona de inicio a fin");
    expect(resEs.items[1].body).toContain("Sección 2");
    expect(resEs.items[2].body).toContain("muestra pública independiente");
    expect(resEs.items[3].title).toBe("¿Qué NO evalúa este informe?");

    // Reference genome localization omits internal container mount path /data/ref/hg38.fa
    const refGenomeLegacy =
      "A reference genome (GRCh38 / hg38): the command names one, and STRhub mounted the public copy at /data/ref/hg38.fa.";
    const refGenomeNew =
      "A reference genome (GRCh38 / hg38): the command names one, and STRhub supplied the public reference copy.";
    expect(localizeNeededItem(refGenomeLegacy, tEs)).not.toContain("/data/ref");
    expect(localizeNeededItem(refGenomeNew, tEs)).toContain("GRCh38 / hg38");
    expect(localizeNeededItem(refGenomeNew, tEs)).not.toContain("/data/ref");

    // Step 2 diagnostic skip reasons localize cleanly across ES, EN, and PT when evaluated && !attempted
    for (const tFn of [tEs, tEn, tPt]) {
      expect(tFn("verified.assisted.notExecutableTitle")).not.toContain("verified.assisted.");
      expect(tFn("verified.assisted.dualStep2NotExecutable")).not.toContain("verified.assisted.");
      expect(tFn("verified.assisted.skip_unresolved_placeholders")).toContain("path/to/");
      expect(tFn("verified.assisted.skip_custom_input_layout")).not.toContain("verified.assisted.");
    }
  });
});

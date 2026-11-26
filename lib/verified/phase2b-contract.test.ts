import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import {
  formatFileReplaces,
  InlineCodeText,
  normalizeRecommendationText,
  normalizeWithoutPreparation,
} from "@/components/verified/report/inline-code";
import { VerifiedReportBody } from "@/components/verified/report/verified-report-body";
import { translate } from "@/lib/translations";
import { resolveVerifiedToolPage, type VerifiedFetcherDeps } from "@/lib/verified";
import type { VerifiedIndex, VerifiedReport } from "@/types/verified";

const tEs = (key: string, vars?: Record<string, string>) =>
  translate("es", key, vars);

vi.mock("@/contexts/language-context", () => ({
  useLanguage: () => ({
    t: (key: string, vars?: Record<string, string>) => translate("es", key, vars),
    language: "es",
  }),
}));

function makeBaseReport(overrides: Partial<VerifiedReport> = {}): VerifiedReport {
  return {
    schema: "strhub-verified/1",
    tool: { name: "STRsearch", version: "1.0.0" },
    source: {
      repo: "https://github.com/AnJingwd/STRsearch",
      ref: "51842ca000000000000000000000000000000000",
    },
    environment: { os: ["ubuntu-22.04"] },
    generated: "2026-11-25T12:00:00Z",
    level: "runs",
    gates: {
      none: false,
      available: true,
      installs: true,
      runs: true,
      io: true,
      content: false,
    },
    scope: "Runs cleanly on reference slice.",
    verdict: {
      code: "runs",
      title: "Runs cleanly",
      basis: "execution",
      reason:
        "Installed and executed cleanly; output generated; STR content not automatically verified.",
      failure_phase: null,
      content_verified: false,
      output_status: "output_only_content_unverified",
    },
    ...overrides,
  };
}

describe("Phase 2b — A. JSON union normalization and InlineCodeText safety", () => {
  it("formats string, object, boolean, and null inputs in InlineCodeText without crashing", () => {
    expect(
      renderToStaticMarkup(createElement(InlineCodeText, { text: "Run `pip install .` first" })),
    ).toContain("<code");
    expect(
      renderToStaticMarkup(
        createElement(InlineCodeText, {
          text: { code: "pin_python", text: "Pin `python>=3.10` in setup.py" },
        }),
      ),
    ).toContain("python&gt;=3.10");
    expect(renderToStaticMarkup(createElement(InlineCodeText, { text: true }))).toBe("");
    expect(renderToStaticMarkup(createElement(InlineCodeText, { text: null }))).toBe("");
    expect(renderToStaticMarkup(createElement(InlineCodeText, { text: undefined }))).toBe("");
  });

  it("normalizes recommendations, without_preparation, and files[].replaces across legacy and engine shapes", () => {
    expect(normalizeRecommendationText("Plain recommendation")).toBe("Plain recommendation");
    expect(
      normalizeRecommendationText({ code: "fix_deps", text: "Add `cmake` to README." }),
    ).toBe("Add `cmake` to README.");

    expect(normalizeWithoutPreparation("Fails on missing config")).toBe("Fails on missing config");
    expect(
      normalizeWithoutPreparation({
        blocker: "missing_config",
        basis: "readme",
        reason: "Requires an undocumented JSON config file.",
      }),
    ).toBe("Requires an undocumented JSON config file.");

    expect(formatFileReplaces(true, "replaces repository file")).toBe("replaces repository file");
    expect(formatFileReplaces(false, "replaces repository file")).toBeNull();
    expect(formatFileReplaces("config/default.json", "replaces repository file")).toBe(
      "config/default.json",
    );
  });

  it("renders a manual curated report carrying engine-shaped objects and booleans without crashing", () => {
    const manualReport = makeBaseReport({
      instrument: "curated",
      preparation: {
        file: "tools/strsearch/preparation.yaml",
        without_preparation: {
          blocker: "missing_config",
          basis: "readme",
          reason: "Fails before execution without `conf.py`.",
        },
        steps: ["Provide minimal configuration file `conf.py`."],
        files: [
          {
            path: "conf.py",
            replaces: true,
          },
          {
            path: "loci.txt",
            replaces: "example/loci.txt",
          },
        ],
      },
      recommendations: [
        { code: "doc_config", text: "Document `conf.py` in README." },
        "Pin `pysam` version explicitly.",
      ],
    });

    const html = renderToStaticMarkup(
      createElement(VerifiedReportBody, {
        report: manualReport,
        slug: "strsearch",
        logs: [],
      }),
    );

    expect(html).toContain("Fails before execution without");
    expect(html).toContain("conf.py");
    expect(html).toContain(tEs("verified.strhubDid.fileReplaced"));
    expect(html).toContain("example/loci.txt");
    expect(html).toContain("Document");
    expect(html).toContain("pysam");
    expect(html).toContain(tEs("verified.content.unverifiedTitle"));
  });
});

describe("Phase 2b — B. Contract fields: content_verified, output_preview, slice_scope_note, failure_phase", () => {
  it("visually distinguishes content_verified === false from content_verified === true and renders preview + slice note", () => {
    const unverifiedReport = makeBaseReport({
      output_verification: {
        io_passed: true,
        content_verified: false,
        status: "output_only_content_unverified",
        note: "Salida generada; contenido STR no verificado automáticamente.",
      },
      output_preview: {
        leg: "external",
        file: "results/calls.tsv",
        size_bytes: 2048,
        truncated: true,
        binary: false,
        lines: ["locus\tallele1\tallele2", "CSF1PO\t10\t12", "FGA\t21\t24"],
      },
      slice_scope_note:
        "STRhub reference slice covers a bounded subset of forensic STR loci on hg38.",
    });

    const unverifiedHtml = renderToStaticMarkup(
      createElement(VerifiedReportBody, {
        report: unverifiedReport,
        slug: "strsearch",
        logs: [],
      }),
    );

    expect(unverifiedHtml).toContain(tEs("verified.content.unverifiedBadge"));
    expect(unverifiedHtml).toContain(tEs("verified.content.unverifiedTitle"));
    expect(unverifiedHtml).not.toContain(tEs("verified.content.verifiedBadge"));
    expect(unverifiedHtml).toContain("results/calls.tsv");
    expect(unverifiedHtml).toContain("CSF1PO");
    expect(unverifiedHtml).toContain(tEs("verified.content.previewTruncated", { lines: "3" }));
    expect(unverifiedHtml).toContain(
      "STRhub reference slice covers a bounded subset of forensic STR loci on hg38.",
    );

    const verifiedReport = makeBaseReport({
      gates: {
        none: false,
        available: true,
        installs: true,
        runs: true,
        io: true,
        content: true,
      },
      verdict: {
        code: "runs",
        title: "Runs cleanly",
        basis: "execution",
        reason: "Installed, executed, and produced verified STR calls.",
        content_verified: true,
        output_status: "content_verified",
      },
      output_verification: {
        io_passed: true,
        content_verified: true,
        status: "content_verified",
        note: "STR content verified.",
      },
      content_detail: {
        outputs: [
          {
            stats: {
              rows: 12,
              distinct_str_loci: 12,
              called_genotypes: 12,
              total_reads: 240,
            },
          },
        ],
      },
    });

    const verifiedHtml = renderToStaticMarkup(
      createElement(VerifiedReportBody, {
        report: verifiedReport,
        slug: "strsearch",
        logs: [],
      }),
    );

    expect(verifiedHtml).toContain(tEs("verified.content.verifiedBadge"));
    expect(verifiedHtml).not.toContain(tEs("verified.content.unverifiedBadge"));
    expect(verifiedHtml).not.toContain(tEs("verified.content.unverifiedTitle"));
  });

  it("reflects failure_phase and scope_limit to separate pre_execution stops from runtime failures", () => {
    const preExecReport = makeBaseReport({
      level: "available",
      gates: {
        none: false,
        available: true,
        installs: false,
        runs: false,
        io: false,
        content: false,
      },
      verdict: {
        code: "undetermined",
        title: "Could not be determined",
        basis: "scope",
        reason: "Published container image only; source build out of scope.",
        failure_phase: "pre_execution",
        content_verified: false,
        output_status: "no_output",
      },
      scope_limit:
        "This repository distributes a pre-built container rather than source build instructions.",
    });

    const preExecHtml = renderToStaticMarkup(
      createElement(VerifiedReportBody, {
        report: preExecReport,
        slug: "strsearch",
        logs: [],
      }),
    );
    expect(preExecHtml).toContain(tEs("verified.trial.failurePhase.pre_execution"));
    expect(preExecHtml).toContain(
      "This repository distributes a pre-built container rather than source build instructions.",
    );

    const runtimeReport = makeBaseReport({
      level: "installs",
      gates: {
        none: false,
        available: true,
        installs: true,
        runs: false,
        io: false,
        content: false,
      },
      verdict: {
        code: "fails",
        title: "Execution fails",
        basis: "execution",
        reason: "Exited with status 1 during sample execution.",
        failure_phase: "runtime",
        content_verified: false,
        output_status: "no_output",
      },
      run: { cmd: "strsearch --input sample.bam", step_outcome: "failure" },
    });

    const runtimeHtml = renderToStaticMarkup(
      createElement(VerifiedReportBody, {
        report: runtimeReport,
        slug: "strsearch",
        logs: [],
      }),
    );
    expect(runtimeHtml).toContain(tEs("verified.trial.failurePhase.runtime"));
  });
});

describe("Phase 2b — C. Curated-only route resolution without root <slug>.json (404 fix)", () => {
  const sha = "51842ca999999999999999999999999999999999";
  const curatedReportPath = "strsearch/51842ca-curated/strsearch.json";
  const curatedHtmlPath = "strsearch/51842ca-curated/strsearch.html";
  const curatedPdfPath = "strsearch/51842ca-curated/strsearch.pdf";

  const curatedReport = makeBaseReport({
    instrument: "curated",
    source: { repo: "https://github.com/AnJingwd/STRsearch", ref: sha },
  });

  const curatedOnlyIndex: VerifiedIndex = {
    schema: "strhub-verified/index/3",
    generated: "2026-11-25T12:00:00Z",
    count: 1,
    tools: [
      {
        slug: "strsearch",
        name: "STRsearch",
        version: "1.0.0",
        level: "runs",
        label: "Runs",
        verdict: "runs",
        verdict_basis: "execution",
        content_verified: false,
        instrument: "curated",
        source_repo: null,
        source_ref: sha,
        ci_run: null,
        distinct_str_loci: null,
        distinct_snp_markers: null,
        total_reads: null,
        generated: "2026-11-25T12:00:00Z",
        report: curatedReportPath,
        page: curatedHtmlPath,
        versions: [
          {
            sha,
            version: "1.0.0",
            level: "runs",
            verdict: "runs",
            verdict_basis: "execution",
            content_verified: false,
            instrument: "curated",
            generated: "2026-11-25T12:00:00Z",
            report: curatedReportPath,
            page: curatedHtmlPath,
            pdf: curatedPdfPath,
          },
        ],
      },
    ],
  };

  const mockDeps: VerifiedFetcherDeps = {
    getIndex: async () => curatedOnlyIndex,
    // Simulate missing root `strsearch.json` on gh-pages (used to trigger HTTP 404)
    getReport: async () => null,
    getReportAt: async (path) => (path === curatedReportPath ? curatedReport : null),
  };

  it("resolves /verified/strsearch via entry.report when root <slug>.json does not exist", async () => {
    const loaded = await resolveVerifiedToolPage("strsearch", undefined, undefined, mockDeps);
    expect(loaded).not.toBeNull();
    expect(loaded?.report.record_type).not.toBe("editorial_review");
    if (loaded && loaded.report.record_type !== "editorial_review") {
      expect(loaded.report.instrument).toBe("curated");
    }
    expect(loaded?.jsonUrl).toContain(curatedReportPath);
    expect(loaded?.staticPageUrl).toContain(curatedHtmlPath);
    expect(loaded?.pdfUrl).toContain(curatedPdfPath);
  });

  it("resolves /verified/strsearch?at=51842ca&recipe=curated even when source_repo is null", async () => {
    const loaded = await resolveVerifiedToolPage("strsearch", "51842ca", "curated", mockDeps);
    expect(loaded).not.toBeNull();
    expect(loaded?.history?.current.instrument).toBe("curated");
    expect(loaded?.jsonUrl).toContain(curatedReportPath);
  });

  it("resolves /verified/strsearch?recipe=curated without requiring ?at=", async () => {
    const loaded = await resolveVerifiedToolPage("strsearch", undefined, "curated", mockDeps);
    expect(loaded).not.toBeNull();
    expect(loaded?.history?.current.instrument).toBe("curated");
    expect(loaded?.pdfUrl).toContain(curatedPdfPath);
  });
});

describe("Phase 2c — Live trial polish: blockedBeforeRun, medical STR panel label, and ES localization", () => {
  it("renders Gate 3 (Runs) as Blocked rather than Fail when Installs passed and run was skipped due to scope (straglr)", () => {
    const straglrReport = makeBaseReport({
      level: "installs",
      gates: {
        none: false,
        available: true,
        installs: true,
        runs: false,
        io: false,
        content: false,
      },
      procedure_validation: {
        schema: "strhub-procedure-evidence/1",
        valid: true,
        reason: "Matched",
      },
      procedure_review: {
        install_ready: true,
        may_say_runs: false,
      },
      verdict: {
        code: "undetermined",
        title: "Could not be determined",
        basis: "scope",
        reason:
          "This evaluator cannot establish that the cited command reads the declared reference input; no config or input list was rewritten to make it do so. A read-file argument is outside the closed input substitution table. Automatic verification stopped at this scope boundary without executing or faulting the software.",
        failure_phase: "pre_execution",
        content_verified: false,
        output_status: "no_output",
      },
      run: {
        cmd: "straglr.py sample.mm2.bam /data/ref/hg38.fa batch0001",
        step_outcome: "skipped",
      },
      certificate: {
        schema: "strhub-verified/certificate/1",
        label: "Could not be determined",
        reached: "Installs",
        summary: {
          purpose: "Evaluate",
          result: "Could not be determined",
          reached: "Installs, 2/5 gates passed",
          scope: "Execution",
          not_evaluated: [],
        },
        conclusion: [
          { title: "Procedure not established", body: "Not established." },
          { title: "Reproducibility not established", body: "Insufficient." },
        ],
        out_of_scope: [],
        limitations: [],
        scope: { statement: "s", not: "n", disclaimer: "d" },
      },
    });

    const html = renderToStaticMarkup(
      createElement(VerifiedReportBody, {
        report: straglrReport,
        slug: "straglr-ont",
        logs: [],
      }),
    );

    expect(html).toContain(tEs("verified.gate.state.blocked"));
    expect(html).not.toContain(tEs("verified.gate.state.fail"));
    expect(html).toContain("tabla cerrada de sustitución de entradas");
    expect(html).toContain(tEs("verified.certificate.conclusion.procNotEstablishedTitle"));
  });

  it("labels medical STR datasets as disease-associated STR loci rather than forensic STR loci (mahi-mahi)", () => {
    const mahiReport = makeBaseReport({
      level: "content",
      gates: {
        none: false,
        available: true,
        installs: true,
        runs: true,
        io: true,
        content: true,
      },
      datasets: [
        {
          leg: "external",
          label: "Reference dataset",
          available: true,
          passed: true,
          type: "ont-bam-hg38-med",
          dataset: "1000 Genomes ONT, hg38 medical STR slice (R10 SUP)",
        },
        {
          leg: "example",
          label: "Tool's own example",
          available: false,
        },
      ],
      caveats: {
        source: "detect_recipe",
        items: [
          "Environment: documented install transcribed unchanged into STRhub's carrier (constant baseline ubuntu:22.04@b000e69a50ff, noninteractive apt-get update, ca-certificates, curl, git, build-essential, python3, python3-pip, python3-venv).",
        ],
      },
    });

    const html = renderToStaticMarkup(
      createElement(VerifiedReportBody, {
        report: mahiReport,
        slug: "mahi-mahi-ont-med",
        logs: [],
      }),
    );

    expect(html).toContain(tEs("verified.data.lociCountMedical"));
    expect(html).not.toContain(`51 ${tEs("verified.data.lociCount")}`);
    expect(html).not.toContain("Tool&#x27;s own example");
    expect(html).toContain("baseline constante ubuntu:22.04@b000e69a50ff");
  });
});

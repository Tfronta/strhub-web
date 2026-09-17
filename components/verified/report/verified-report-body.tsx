"use client";

/**
 * One report, two pages.
 *
 * The catalogue entry and the trial used to be two unrelated views of the same
 * JSON: the catalogue had the summary, the source, the verification matrix and
 * the sample's provenance; the trial had the verdict, the recipe and inline
 * logs, and none of the rest — so a reader who ran a trial could not find the
 * commit it pinned or the data it ran on. This composes every section once.
 * The two pages differ only in what they slot in (a trial's verdict up top and
 * its recipe under the source) and in where the logs and files live.
 */
import type { ReactNode } from "react";
import { useLanguage } from "@/contexts/language-context";
import { VERIFIED_LEVELS, VERIFIED_GATES, type VerifiedReport } from "@/types/verified";
import { hasReportedErrors, errorAwareLevel } from "@/lib/verified/diagnostics";
import { summarizeDatasets } from "@/lib/verified/dataset-provenance";
import { ReportHeader } from "./header";
import { SummaryCard } from "./summary-card";
import { SourceCard, RunCommandCard } from "./source-card";
import { GatesLadder, LogLinks, type ExtraGateRow, type ReportLog } from "./gates";
import { WhatWasVerified, VerificationMatrix, VerificationData } from "./verification";
import { OutputContent } from "./output";
import {
  BuildFailedCard,
  AutoDiagnostics,
  ManualOffer,
  ReadmeCheck,
  BulletCard,
  AuthorKnownIssues,
  EvidenceList,
} from "./findings";
import { ScopeBlock, DisputeCard } from "./closing";

export type { ReportLog, ExtraGateRow };

function toolDisplayName(report: VerifiedReport): string {
  if (report.source?.repo) {
    const last = report.source.repo.replace(/\/+$/, "").split("/").pop();
    if (last) return last;
  }
  return report.tool.name;
}

export function VerifiedReportBody({
  report,
  slug,
  staticPageUrl,
  pdfUrl,
  jsonUrl,
  command,
  logs,
  buildLogHref,
  extraGateRows,
  backLink = true,
  afterHeader,
  afterSource,
}: {
  report: VerifiedReport;
  slug: string;
  /** The self-contained HTML report, if there is one to link. */
  staticPageUrl?: string;
  pdfUrl?: string;
  jsonUrl?: string;
  /**
   * The command that ran, when the caller knows it. A published report carries
   * it in `run.cmd` (newer engines); a trial can read it off its recipe even
   * when the report predates that field.
   */
  command?: string;
  logs: ReportLog[];
  buildLogHref?: string;
  extraGateRows?: ExtraGateRow[];
  backLink?: boolean;
  /** A trial's verdict and next steps, right under the title. */
  afterHeader?: ReactNode;
  /** A trial's environment, next to where the source is named. */
  afterSource?: ReactNode;
}) {
  const { t } = useLanguage();
  const baseLevel = VERIFIED_LEVELS[report.level] ?? VERIFIED_LEVELS.none;
  // A run can clear its gates and still have reported errors (a tool that fails
  // some loci, writes a partial file and exits 0). The badge is the first thing a
  // reviewer sees, so a green level with errors is misleading: qualify it, exactly
  // as the static report and shields badge do.
  const level = errorAwareLevel(baseLevel, hasReportedErrors(report.diagnostics), t("verified.errorsBadgeSuffix"));
  const data = summarizeDatasets(report, slug);
  const gateKeys = VERIFIED_GATES.map((g) => g.key);
  const gatesPassed = gateKeys.filter((k) => report.gates?.[k]).length;

  return (
    <div className="flex flex-col min-h-[60vh]">
      <div className="container mx-auto px-4 py-8 flex-1 max-w-3xl">
        <ReportHeader
          level={level}
          panel={data.panel}
          title={toolDisplayName(report)}
          version={report.tool.version}
          slug={slug}
          backLink={backLink}
        />

        {afterHeader}

        <SummaryCard
          level={level}
          gatesPassed={gatesPassed}
          gatesTotal={gateKeys.length}
          datasetNames={data.provenance.map((p) => p.name)}
          generated={report.generated}
          scope={report.scope}
        />

        <SourceCard report={report} staticPageUrl={staticPageUrl} pdfUrl={pdfUrl} jsonUrl={jsonUrl} />

        <RunCommandCard cmd={command ?? report.run?.cmd} />

        {afterSource}

        <BuildFailedCard report={report} buildLogHref={buildLogHref} />

        <WhatWasVerified />

        <GatesLadder gates={report.gates} extraRows={extraGateRows} />

        <LogLinks logs={logs} />

        {report.datasets && report.datasets.length > 0 && <VerificationMatrix legs={report.datasets} />}

        <VerificationData provenance={data.provenance} hasStrhubFixture={data.hasStrhubFixture} />

        {/* The IO gate and the content gate describe the same file; the panel
            list is the reference sample's, so the section can name what the
            output does not. */}
        <OutputContent
          stats={report.content_detail?.outputs?.[0]?.stats}
          io={report.io_detail?.outputs?.[0]}
          panelLoci={data.provenance.length === 1 ? data.provenance[0].loci : undefined}
        />

        <AutoDiagnostics diagnostics={report.diagnostics} hasStrhubFixture={data.hasStrhubFixture} />

        <ManualOffer report={report} slug={slug} />

        <ReadmeCheck check={report.readme_check} />

        {/* Held next to the ladder on purpose. A green ladder reads as a
            property of the software and quietly folds in the work it took to
            get there. */}
        <BulletCard headingKey="verified.needed.heading" noteKey="verified.needed.note" items={report.needed_beyond_repo} />

        <AuthorKnownIssues items={report.author_known_issues} />

        <EvidenceList evidence={report.evidence} />

        {/* Nothing here was run: it was read off the repository when the
            configuration was worked out, so the origin is named and the block
            says plainly that it is unverified. */}
        <BulletCard headingKey="verified.caveats.heading" noteKey="verified.caveats.note" items={report.caveats?.items} />

        <ScopeBlock scope={report.scope} />

        {staticPageUrl && <DisputeCard report={report} slug={slug} staticPageUrl={staticPageUrl} />}

        <p className="mt-8 text-xs text-muted-foreground">{t("verified.disclaimer")}</p>
      </div>
    </div>
  );
}

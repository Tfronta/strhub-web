"use client";

/**
 * One report, two pages — and two chapters, in this order.
 *
 * First, the tool as it is in its repository: the label, the verdict, where
 * the run stopped (the ladder), why (the failed build, the errors the tool
 * reported, the bug its author documents), how (the command, the logs).
 * Second, apart, what STRhub had to do to run it — the run of a recipe
 * STRhub wrote, when there is one, which never changes the label. Then the
 * context: the summary, the source, the history, the data, the scope.
 *
 * The catalogue entry and the trial slot in what only they have: a trial its
 * verdict block with the ways out (in chapter one) and its recipe (under the
 * source); a published page its history and the note. A page that IS a run
 * of STRhub's recipe opens with chapter two and shows the run in full.
 */
import type { ReactNode } from "react";
import { useLanguage } from "@/contexts/language-context";
import { VERIFIED_GATES, type VerifiedInstrument, type VerifiedReport } from "@/types/verified";
import { hasReportedErrors } from "@/lib/verified/diagnostics";
import { badgeFor } from "@/lib/verified/badge";
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
import { VersionHistory, OlderVersionNotice } from "./history";
import { AsItIsOpening } from "./verdict";
import { NotDocumentedNotice, StrhubDidSection } from "./instrument";
import { documentedOf, newestOfKind, type HistoryRow } from "@/lib/verified/history";

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
  history,
  instrument,
  note,
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
  /** A trial's verdict and next steps: what opens chapter one on a trial. */
  afterHeader?: ReactNode;
  /** A trial's environment, next to where the source is named. */
  afterSource?: ReactNode;
  /**
   * A published tool's history: every commit verified, and which one this
   * page is. A trial has none — it is published nowhere.
   */
  history?: { rows: HistoryRow[]; current: HistoryRow };
  /**
   * Which instrument this published run is. A trial passes none: its
   * recipe may be anybody's, and the page then says nothing about it.
   */
  instrument?: VerifiedInstrument;
  /**
   * On a documented page, the run of STRhub's own recipe for the same tool:
   * chapter two, under the documented result.
   */
  note?: { row: HistoryRow; report: VerifiedReport };
}) {
  const { t } = useLanguage();
  // The label is the first thing a reviewer sees, and one rule writes it
  // everywhere (lib/verified/badge.ts): the result as it is in the
  // repository, in words, exactly as the engine's badge and certificate do.
  const level = badgeFor(
    { level: report.level, verdict: report.verdict?.code, errors_reported: hasReportedErrors(report.diagnostics), instrument },
    t,
  );
  const data = summarizeDatasets(report, slug);
  const gateKeys = VERIFIED_GATES.map((g) => g.key);
  const gatesPassed = gateKeys.filter((k) => report.gates?.[k]).length;
  const isStrhubRun = instrument === "curated";

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

        {/* A run of STRhub's own recipe is not the documented result, and
            the page says so before it says anything else. */}
        {isStrhubRun && (
          <NotDocumentedNotice documented={history ? documentedOf(history.rows, slug) : undefined} />
        )}

        {/* An older commit, read out of its place in the history, is the one
            thing this page must not let a reader take for the current one. */}
        {history && !history.current.isNewest && (() => {
          const newest = newestOfKind(history.rows, history.current);
          return newest && newest !== history.current
            ? <OlderVersionNotice current={history.current} newest={newest} />
            : null;
        })()}

        {/* Chapter one — or, on the page of STRhub's own run, chapter two
            first and the run in full after it. */}
        {isStrhubRun ? (
          <>
            <StrhubDidSection run={report} />
            <h2 className="mt-10 text-xl font-semibold">{t("verified.asIs.fullRun")}</h2>
          </>
        ) : (
          <AsItIsOpening report={report}>{afterHeader}</AsItIsOpening>
        )}

        {/* Where it stopped. */}
        <GatesLadder gates={report.gates} extraRows={extraGateRows} />

        {/* Why. */}
        <BuildFailedCard report={report} buildLogHref={buildLogHref} />

        <AutoDiagnostics diagnostics={report.diagnostics} hasStrhubFixture={data.hasStrhubFixture} />

        <AuthorKnownIssues items={report.author_known_issues} />

        {/* How. */}
        <RunCommandCard cmd={command ?? report.run?.cmd} />

        <LogLinks logs={logs} />

        {/* Chapter two, under the documented result and never in its place. */}
        {note && !isStrhubRun && <StrhubDidSection run={note.report} row={note.row} />}

        {/* The context. */}
        <h2 className="mt-10 text-xl font-semibold">{t("verified.asIs.details")}</h2>

        <SummaryCard
          level={level}
          reached={report.level}
          gatesPassed={gatesPassed}
          gatesTotal={gateKeys.length}
          datasetNames={data.provenance.map((p) => p.name)}
          generated={report.generated}
          scope={report.scope}
        />

        <SourceCard report={report} staticPageUrl={staticPageUrl} pdfUrl={pdfUrl} jsonUrl={jsonUrl} />

        {afterSource}

        {history && (
          <VersionHistory
            rows={history.rows}
            current={{ slug: history.current.slug, sha: history.current.sha, instrument: history.current.instrument }}
            repo={report.source.repo}
          />
        )}

        <WhatWasVerified />

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

        <ManualOffer report={report} slug={slug} />

        <ReadmeCheck check={report.readme_check} />

        {/* Held near the ladder's numbers on purpose. A green ladder reads as
            a property of the software and quietly folds in the work it took
            to get there. */}
        <BulletCard headingKey="verified.needed.heading" noteKey="verified.needed.note" items={report.needed_beyond_repo} />

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

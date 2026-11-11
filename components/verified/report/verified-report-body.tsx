"use client";

/**
 * One report, two pages, laid out as the certificate is.
 *
 * The PDF is easy to read because its structure is fixed and numbered: a
 * cover with the commit in full, an executive summary in a table, the gates,
 * the causes, the command, then the context, and the closing lists and the
 * conclusion in their own boxes. The page follows that order with the same
 * words (the `certificate` block the engine writes), in two chapters: first
 * the tool as it is in its repository, then what STRhub had to do to run it,
 * which never changes the label.
 *
 * The catalogue entry and the trial slot in what only they have: a trial
 * its verdict block with the ways out (in chapter one) and its recipe (under
 * the metadata); a published page its history and the note. A page that IS
 * a run of STRhub's recipe opens with chapter two and shows the run in full.
 */
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { type VerifiedInstrument, type VerifiedReport } from "@/types/verified";
import { hasReportedErrors } from "@/lib/verified/diagnostics";
import { badgeFor } from "@/lib/verified/badge";
import { commandPresentation } from "@/lib/verified/command";
import { blockedBeforeInstall } from "@/lib/verified/gate-state";
import {
  certificateOf,
  localizeCaveatItem,
  localizeNeededItem,
} from "@/lib/verified/certificate";
import { summarizeDatasets } from "@/lib/verified/dataset-provenance";
import { Cover } from "./cover";
import { Section, BoxedList, ConclusionBox, sectionCounter } from "./certificate";
import { SourceCard, RunCommandCard } from "./source-card";
import { GatesLadder, LogLinks, type ExtraGateRow, type ReportLog } from "./gates";
import { WhatWasVerified, VerificationMatrix, VerificationData } from "./verification";
import { OutputContent } from "./output";
import {
  BuildFailedCard,
  AutoDiagnostics,
  actionableDiagnostics,
  FailureExcerptCard,
  ManualOffer,
  ReadmeCheck,
  BulletCard,
  AuthorKnownIssues,
  EvidenceList,
} from "./findings";
import { extractFailureExcerpt } from "@/lib/verified/failure-excerpt";
import { DisputeCard } from "./closing";
import { VersionHistory, OlderVersionNotice, RetiredNotice, rowHref } from "./history";
import { AsItIsOpening } from "./verdict";
import { NotDocumentedNotice, StrhubDidSection } from "./instrument";
import { documentedOf, newestOfKind, type HistoryRow } from "@/lib/verified/history";

export type { ReportLog, ExtraGateRow };

const SITE = "https://strhub.app";

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
    {
      level: report.level,
      verdict: report.verdict?.code,
      errors_reported: hasReportedErrors(report.diagnostics),
      fallback_used: !!report.environment?.fallback_used,
      instrument,
    },
    t,
  );
  const certificate = certificateOf(report, level.label, t);
  const installBlocked = blockedBeforeInstall(report);
  const data = summarizeDatasets(report, slug);
  const isStrhubRun = instrument === "curated";
  const permalink = history ? `${SITE}${rowHref(history.current)}` : undefined;
  const passedRun =
    report.verdict?.code === "runs" ||
    Boolean(report.gates?.runs && report.gates?.io);
  const failureExcerpt = !report.gates.runs || !report.gates.installs
    ? extractFailureExcerpt(logs, 14, report.gates)
    : null;
  const actionableIssues = actionableDiagnostics(report.diagnostics, passedRun);
  const hasCause = !!report.install_detail?.diagnostics?.length
    || actionableIssues.length > 0
    || !!report.author_known_issues?.length
    || !!failureExcerpt;
  const next = sectionCounter();

  const datasetsLabel = data.provenance.length
    ? data.provenance
        .map((p) => {
          const k = `verified.data.provenance.${p.type}.name`;
          return t(k) !== k ? t(k) : p.name;
        })
        .join("; ")
    : undefined;

  const localizedNeeded = report.needed_beyond_repo?.map((item) =>
    localizeNeededItem(item, t),
  );
  const localizedCaveats = report.caveats?.items?.map((item) =>
    localizeCaveatItem(item, t),
  );

  return (
    <div className="flex flex-col min-h-[60vh]">
      <div className="container mx-auto px-4 py-8 flex-1 max-w-3xl">
        {backLink && (
          <Link href="/verified" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> {t("verified.backToList")}
          </Link>
        )}

        <Cover
          report={report}
          certificate={certificate}
          level={level}
          panel={data.panel}
          title={toolDisplayName(report)}
          slug={slug}
          datasetsLabel={datasetsLabel}
          permalink={permalink}
          staticPageUrl={staticPageUrl}
          pdfUrl={pdfUrl}
          jsonUrl={jsonUrl}
        />

        {history?.current.retired && <RetiredNotice row={history.current} />}

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

        {/* Chapter one: the tool as it is. On the page of STRhub's own run,
            chapter two comes first and the run follows in full. */}
        {isStrhubRun ? (
          <>
            <Section n={next()} title={t("verified.strhubDid.heading")}>
              <StrhubDidSection run={report} />
            </Section>
            <Section n={next()} title={t("verified.asIs.fullRun")}>
              <GatesLadder gates={report.gates} extraRows={extraGateRows} />
              <LogLinks logs={logs} />
            </Section>
          </>
        ) : (
          <Section n={next()} title={t("verified.asIs.heading")}>
            <AsItIsOpening report={report}>{afterHeader}</AsItIsOpening>
            <GatesLadder
              gates={report.gates}
              extraRows={installBlocked ? undefined : extraGateRows}
              blockedAt={installBlocked ? "installs" : undefined}
            />
            <LogLinks logs={logs} />
          </Section>
        )}

        {/* Why it stopped, or what errors it reported on the way. */}
        {hasCause && !installBlocked && (
          <Section n={next()} title={t(passedRun ? "verified.certificate.section.reported" : "verified.certificate.section.why")}>
            <BuildFailedCard report={report} buildLogHref={buildLogHref} />
            <AutoDiagnostics
              diagnostics={report.diagnostics}
              hasStrhubFixture={data.hasStrhubFixture}
              passedRun={passedRun}
            />
            {failureExcerpt && <FailureExcerptCard excerpt={failureExcerpt} />}
            <AuthorKnownIssues items={report.author_known_issues} />
          </Section>
        )}

        {!installBlocked && (report.run?.effective_cmd ?? report.run?.cmd ?? command) && (
          <Section n={next()} title={t(commandPresentation(report.run?.step_outcome).heading)}>
            <RunCommandCard cmd={report.run?.effective_cmd ?? report.run?.cmd ?? command} outcome={report.run?.step_outcome} />
          </Section>
        )}

        {/* Chapter two, under the documented result and never in its place. */}
        {note && !isStrhubRun && (
          <Section n={next()} title={t("verified.strhubDid.heading")}>
            <StrhubDidSection run={note.report} row={note.row} />
          </Section>
        )}

        {(report.content_detail?.outputs?.[0]?.stats || report.io_detail?.outputs?.[0]) && (
          <Section n={next()} title={t("verified.content.heading")}>
            <OutputContent
              stats={report.content_detail?.outputs?.[0]?.stats}
              io={report.io_detail?.outputs?.[0]}
              panelLoci={data.provenance.length === 1 ? data.provenance[0].loci : undefined}
            />
          </Section>
        )}

        {!installBlocked && (
          <Section n={next()} title={t("verified.data.heading")}>
            <VerificationData provenance={data.provenance} hasStrhubFixture={data.hasStrhubFixture} />
          </Section>
        )}

        {report.datasets && report.datasets.length > 0 && report.datasets.some((leg) => leg.fixture_source !== "strhub") && (
          <Section n={next()} title={t("verified.matrix.heading")}>
            <VerificationMatrix legs={report.datasets} />
          </Section>
        )}

        <Section n={next()} title={t("verified.certificate.section.metadata")}>
          <SourceCard report={report} installBlocked={installBlocked} />
          {!installBlocked && afterSource}
        </Section>

        {history && (
          <Section n={next()} title={t("verified.history.heading")}>
            <VersionHistory
              rows={history.rows}
              current={{ slug: history.current.slug, sha: history.current.sha, instrument: history.current.instrument }}
              repo={report.source.repo}
            />
          </Section>
        )}

        <ManualOffer report={report} slug={slug} />

        {report.readme_check && (
          <Section n={next()} title={t("verified.readme.heading")}>
            <ReadmeCheck check={report.readme_check} />
          </Section>
        )}

        {!installBlocked && !!localizedNeeded?.length && (
          <Section n={next()} title={t("verified.needed.heading")}>
            <BulletCard headingKey="verified.needed.heading" noteKey="verified.needed.note" items={localizedNeeded} />
          </Section>
        )}

        {!!report.evidence?.length && (
          <Section n={next()} title={t("verified.trial.evidenceTitle")}>
            <EvidenceList evidence={report.evidence} />
          </Section>
        )}

        {!!localizedCaveats?.length && (
          <Section n={next()} title={t("verified.caveats.heading")}>
            <BulletCard headingKey="verified.caveats.heading" noteKey="verified.caveats.note" items={localizedCaveats} />
          </Section>
        )}

        <Section n={next()} title={t("verified.certificate.section.scope")}>
          {!installBlocked && <WhatWasVerified />}
          <BoxedList lead={t("verified.certificate.text.scopeExec")} items={certificate.limitations} />
          <p className="mt-3 text-xs text-muted-foreground">{certificate.scope.disclaimer}</p>
        </Section>

        {certificate.conclusion.length > 0 && (
          <Section n={next()} title={t("verified.certificate.section.conclusion")}>
            <ConclusionBox items={certificate.conclusion} />
          </Section>
        )}

        {staticPageUrl && <DisputeCard report={report} slug={slug} staticPageUrl={staticPageUrl} />}
      </div>
    </div>
  );
}

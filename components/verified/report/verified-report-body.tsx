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
import { blockedBeforeInstall } from "@/lib/verified/gate-state";
import {
  certificateOf,
  localizeCaveatItem,
  localizeNeededItem,
} from "@/lib/verified/certificate";
import { summarizeDatasets } from "@/lib/verified/dataset-provenance";
import { Cover } from "./cover";
import { Section, BoxedList, ConclusionBox, sectionCounter } from "./certificate";
import { SourceCard } from "./source-card";
import { GatesLadder, type ExtraGateRow } from "./gates";
import { RecordedTerminal, type ReportLog } from "./terminal";
import { WhatWasVerified, VerificationMatrix, VerificationData } from "./verification";
import { OutputContent } from "./output";
import {
  BuildFailedCard,
  AutoDiagnostics,
  actionableDiagnostics,
  ManualOffer,
  ReadmeCheck,
  BulletCard,
  AuthorKnownIssues,
  EvidenceList,
} from "./findings";
import { DisputeCard } from "./closing";
import { VersionHistory, OlderVersionNotice, RetiredNotice, rowHref } from "./history";
import { AsItIsOpening } from "./verdict";
import {
  CompanionManualBanner,
  ManualExecutionContext,
  ManualReproSteps,
  ManualSuggestions,
  NotDocumentedNotice,
} from "./instrument";
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
  ciRunUrl,
  trialUrl,
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
  /** Live or report CI workflow run URL. */
  ciRunUrl?: string;
  /** Shareable trial page URL when not published to the catalogue. */
  trialUrl?: string;
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
      instrument,
    },
    t,
  );
  const certificate = certificateOf(report, level.label, t);
  const installBlocked = blockedBeforeInstall(report);
  const data = summarizeDatasets(report, slug);
  const isStrhubRun =
    instrument === "curated" ||
    report.instrument === "curated" ||
    report.environment?.source === "prepared" ||
    Boolean(report.preparation);
  const permalink = history ? `${SITE}${rowHref(history.current)}` : undefined;
  const passedRun =
    report.verdict?.code === "runs" ||
    Boolean(report.gates?.runs && report.gates?.io);
  const actionableIssues = actionableDiagnostics(report.diagnostics, passedRun);
  const hasDiagnostics = !installBlocked && (
    !!report.install_detail?.diagnostics?.length
    || actionableIssues.length > 0
    || !!report.author_known_issues?.length
  );
  const diagnosticsTitle = passedRun ? "verified.certificate.section.reported" : "verified.certificate.section.why";
  const preferredLog = report.gates.installs === false ? "build" :
    report.datasets?.some((dataset) => dataset.leg === "own" && dataset.available) ? "own" : "external";
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
      <div className="container mx-auto px-4 py-8 flex-1 max-w-4xl">
        {backLink && (
          <Link href="/verified" className="inline-flex items-center gap-1.5 text-base text-muted-foreground hover:text-foreground">
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
          ciRunUrl={ciRunUrl}
          trialUrl={trialUrl}
          staticPageUrl={staticPageUrl}
          pdfUrl={pdfUrl}
          jsonUrl={jsonUrl}
          isManualRun={isStrhubRun}
        />

        {history?.current.retired && <RetiredNotice row={history.current} />}

        {/* On an automatic report that also has a standalone manual verification,
            keep the two reports strictly separated and link cleanly to the manual one. */}
        {note && !isStrhubRun && <CompanionManualBanner row={note.row} />}

        {/* On a standalone manual report, link cleanly to the automated run. */}
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

        {/* Standalone Manual Verification report: unified visual structure matching
            Automatic reports (1. Upstream execution + gates + terminal ->
            2. Output content -> 3. Verification data -> 4. Step-by-step setup ->
            5. Author suggestions -> 6. Scope & limitations -> 7. Conclusion). */}
        {isStrhubRun ? (
          <>
            <Section n={next()} title={t("verified.strhubDid.sectionExecutionTitle")}>
              <ManualExecutionContext run={report} />
              <GatesLadder gates={report.gates} extraRows={extraGateRows} hideHowToRead />
              <RecordedTerminal logs={logs} preferredLeg={preferredLog} preflight={false} />
            </Section>

            {(report.content_detail?.outputs?.[0]?.stats || report.io_detail?.outputs?.[0]) && (
              <Section n={next()} title={t("verified.content.heading")}>
                <OutputContent
                  stats={report.content_detail?.outputs?.[0]?.stats}
                  io={report.io_detail?.outputs?.[0]}
                  panelLoci={data.provenance.length === 1 ? data.provenance[0].loci : undefined}
                />
              </Section>
            )}

            {(data.provenance.length > 0 || data.hasStrhubFixture) && (
              <Section n={next()} title={t("verified.data.heading")}>
                <VerificationData
                  provenance={data.provenance}
                  hasStrhubFixture={data.hasStrhubFixture}
                  installsPassed={Boolean(report.gates?.installs)}
                />
              </Section>
            )}

            {(report.preparation?.steps?.length ||
              report.preparation?.run_cmd ||
              report.preparation?.pr_url ||
              report.preparation?.fork_url ||
              report.preparation?.guide_url ||
              report.recipe?.workarounds?.length) && (
              <Section
                n={next()}
                title={
                  passedRun && !report.preparation?.pr_url && !report.preparation?.fork_url
                    ? t("verified.strhubDid.sectionStepsPassTitle")
                    : t("verified.strhubDid.sectionStepsTitle")
                }
              >
                <ManualReproSteps run={report} />
              </Section>
            )}

            {(report.recommendations?.length || report.preparation?.why?.length) && (
              <Section n={next()} title={t("verified.strhubDid.sectionSuggestionsTitle")}>
                <ManualSuggestions run={report} />
              </Section>
            )}

            <Section n={next()} title={t("verified.certificate.section.scope")}>
              <WhatWasVerified gates={report.gates} verdictCode={report.verdict?.code} />
              <BoxedList lead={t("verified.certificate.text.scopeManual")} items={certificate.limitations} />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
                <p className="min-w-0 flex-1 leading-relaxed">{certificate.scope.disclaimer}</p>
                <Link
                  href="/verified/how-to-read#manual"
                  className="text-xs font-medium text-primary hover:underline shrink-0"
                >
                  {t("verified.strhubDid.howToReadManualLink")}
                </Link>
              </div>
            </Section>

            {certificate.conclusion.length > 0 && (
              <Section n={next()} title={t("verified.certificate.section.conclusion")}>
                <ConclusionBox items={certificate.conclusion} />
              </Section>
            )}

            {staticPageUrl && <DisputeCard report={report} slug={slug} staticPageUrl={staticPageUrl} />}
          </>
        ) : (
          <>
            <Section n={next()} title={t("verified.asIs.heading")}>
              <AsItIsOpening report={report}>{afterHeader}</AsItIsOpening>
              <GatesLadder
                gates={report.gates}
                extraRows={installBlocked ? undefined : extraGateRows}
                blockedAt={installBlocked ? "installs" : undefined}
              />
              <RecordedTerminal logs={logs} preferredLeg={preferredLog} preflight={installBlocked} />
            </Section>

            {/* Why it stopped, or what errors it reported on the way. */}
            {hasDiagnostics && (
              <Section n={next()} title={t(diagnosticsTitle)}>
                <BuildFailedCard report={report} buildLogHref={buildLogHref} />
                <AutoDiagnostics
                  diagnostics={report.diagnostics}
                  hasStrhubFixture={data.hasStrhubFixture}
                  passedRun={passedRun}
                />
                <AuthorKnownIssues items={report.author_known_issues} />
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
                <VerificationData
                  provenance={data.provenance}
                  hasStrhubFixture={data.hasStrhubFixture}
                  installsPassed={Boolean(report.gates?.installs)}
                />
              </Section>
            )}

            {report.datasets && report.datasets.length > 0 && report.datasets.some((leg) => leg.fixture_source !== "strhub") && (
              <Section n={next()} title={t("verified.matrix.heading")}>
                <VerificationMatrix
                  legs={report.datasets}
                  installsPassed={Boolean(report.gates?.installs)}
                  verdictCode={report.verdict?.code}
                />
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
              {!installBlocked && <WhatWasVerified gates={report.gates} verdictCode={report.verdict?.code} />}
              <BoxedList lead={t("verified.certificate.text.scopeExec")} items={certificate.limitations} />
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{certificate.scope.disclaimer}</p>
            </Section>

            {certificate.conclusion.length > 0 && (
              <Section n={next()} title={t("verified.certificate.section.conclusion")}>
                <ConclusionBox items={certificate.conclusion} />
              </Section>
            )}

            {staticPageUrl && <DisputeCard report={report} slug={slug} staticPageUrl={staticPageUrl} />}
          </>
        )}
      </div>
    </div>
  );
}

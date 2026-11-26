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
import { ArrowLeft, Terminal } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import {
  type VerifiedInstrument,
  type VerifiedLevel,
  type VerifiedReport,
} from "@/types/verified";
import { hasReportedErrors } from "@/lib/verified/diagnostics";
import { badgeFor } from "@/lib/verified/badge";
import { blockedBeforeInstall, blockedGateOf } from "@/lib/verified/gate-state";
import {
  certificateOf,
  effectiveNeededBeyondRepo,
  localizeCaveatItem,
  localizeRecommendationItem,
} from "@/lib/verified/certificate";
import { summarizeDatasets } from "@/lib/verified/dataset-provenance";
import { terminalOutputSummary } from "@/lib/verified/output-evidence";
import { Cover } from "./cover";
import { Section, BoxedList, ConclusionBox, sectionCounter } from "./certificate";
import { GatesLadder, type ExtraGateRow } from "./gates";
import { RecordedTerminal, type ReportLog } from "./terminal";
import { WhatWasVerified, VerificationMatrix, VerificationData } from "./verification";
import { OutputContent } from "./output";
import {
  BuildFailedCard,
  AutoDiagnostics,
  actionableDiagnostics,
  ManualOffer,
  BulletCard,
  AuthorKnownIssues,
} from "./findings";
import { DisputeCard } from "./closing";
import { VersionHistory, OlderVersionNotice, RetiredNotice, rowHref } from "./history";
import { AsItIsOpening } from "./verdict";
import { InlineCodeText, normalizeRecommendationText } from "./inline-code";
import {
  CompanionManualBanner,
  ManualExecutionContext,
  ManualReproSteps,
  ManualSuggestions,
  NotDocumentedNotice,
} from "./instrument";
import { AssistedVerificationSection } from "./assisted-section";
import { TechnicalAnnex } from "./technical-annex";
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
  afterAssisted,
  afterSource,
  strictDockerfile,
  repoDockerfile,
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
  /** A trial's verdict opening inside chapter one. */
  afterHeader?: ReactNode;
  /** Follow-up options rendered after both automatic tracks complete. */
  afterAssisted?: ReactNode;
  /** Legacy optional slot after metadata (omitted when installBlocked). */
  afterSource?: ReactNode;
  /** Evaluator Dockerfile for Run 1, shown in the Technical Annex. */
  strictDockerfile?: string;
  repoDockerfile?: boolean;
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
  const { t, language } = useLanguage();
  // The label is the first thing a reviewer sees, and one rule writes it
  // everywhere (lib/verified/badge.ts): the result as it is in the
  // repository, in words, exactly as the engine's badge and certificate do.
  const level = badgeFor(
    {
      level: report.level,
      verdict: report.verdict?.code,
      errors_reported: hasReportedErrors(report.diagnostics),
      instrument,
      assisted_runs: Boolean(report.assisted_run?.passed),
    },
    t,
  );
  const strictLogs = logs.filter((l) => !l.leg.startsWith("assisted-"));
  const assistedLogs = logs.filter((l) => l.leg.startsWith("assisted-"));
  const certificate = certificateOf(report, level.label, t, language);
  const installBlocked = blockedBeforeInstall(report);
  const blockedGate = blockedGateOf(report);
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
  const preferredLog = report.gates.installs === false ? "build" :
    report.datasets?.some((dataset) => dataset.leg === "own" && dataset.available) ? "own" : "external";
  const contentUnverifiedRun =
    passedRun &&
    (report.output_verification?.content_verified === false ||
      report.verdict?.content_verified === false ||
      report.gates?.content === false);
  const hasOutputSection = Boolean(
    report.content_detail?.outputs?.[0]?.stats ||
      report.io_detail?.outputs?.[0] ||
      report.output_preview ||
      contentUnverifiedRun,
  );
  const normalizedRecommendations = (report.recommendations ?? [])
    .map(normalizeRecommendationText)
    .filter(Boolean)
    .map((item) => localizeRecommendationItem(item, t));
  const terminalOutput = terminalOutputSummary(
    report.io_detail?.outputs?.[0],
    report.content_detail?.outputs?.[0]?.stats,
  );
  const assistedTerminalOutput = terminalOutputSummary(
    report.assisted_run?.io_detail?.outputs?.[0],
    report.assisted_run?.content_detail?.outputs?.[0]?.stats,
  );
  const outputSectionHref = hasOutputSection ? "#verified-output-content" : undefined;
  const next = sectionCounter();

  const datasetsLabel = data.provenance.length
    ? data.provenance
        .map((p) => {
          const k = `verified.data.provenance.${p.type}.name`;
          return t(k) !== k ? t(k) : p.name;
        })
        .join("; ")
    : undefined;

  const localizedNeeded = effectiveNeededBeyondRepo(report, t);
  const localizedCaveats = report.caveats?.items?.map((item) =>
    localizeCaveatItem(item, t),
  );

  function openAnnex() {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("strhub:open-annex"));
    }
  }

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
              <RecordedTerminal
                logs={logs}
                preferredLeg={preferredLog}
                preflight={false}
                outputSummary={terminalOutput}
                outputSectionHref={outputSectionHref}
              />
            </Section>

            {hasOutputSection && (
              <div id="verified-output-content" className="scroll-mt-20">
                <Section n={next()} title={t("verified.content.heading")}>
                  <OutputContent
                    stats={report.content_detail?.outputs?.[0]?.stats}
                    io={report.io_detail?.outputs?.[0]}
                    panelLoci={data.provenance.length === 1 ? data.provenance[0].loci : undefined}
                    outputVerification={report.output_verification}
                    verdict={report.verdict}
                    gates={report.gates}
                    outputPreview={report.output_preview}
                    sliceScopeNote={report.slice_scope_note}
                  />
                </Section>
              </div>
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

            {(normalizedRecommendations.length > 0 || report.preparation?.why?.length) && (
              <Section n={next()} title={t("verified.strhubDid.sectionSuggestionsTitle")}>
                <ManualSuggestions run={report} />
              </Section>
            )}

            <Section n={next()} title={t("verified.certificate.section.scope")}>
              <WhatWasVerified gates={report.gates} verdictCode={report.verdict?.code} />
              <BoxedList lead={t("verified.certificate.text.scopeManual")} items={certificate.limitations} />
              <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                <p className="leading-relaxed">{certificate.scope.disclaimer}</p>
                <p>
                  <Link
                    href="/verified/how-to-read#manual"
                    className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                  >
                    {t("verified.strhubDid.howToReadManualLink")}
                  </Link>
                </p>
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
            {/* Section 1: Automated Run Strictly as Documented in the Repository */}
            <div id="verified-literal-run" className="scroll-mt-20">
              <Section
                n={next()}
                title={t("verified.assisted.asIsAfterAssistedHeading")}
              >
                <AsItIsOpening report={report}>{afterHeader}</AsItIsOpening>

                {!installBlocked && !afterHeader && !!report.install_detail?.diagnostics?.length && (
                  <BuildFailedCard report={report} buildLogHref={buildLogHref} />
                )}
                {!installBlocked && actionableIssues.length > 0 && (
                  <AutoDiagnostics
                    diagnostics={report.diagnostics}
                    hasStrhubFixture={data.hasStrhubFixture}
                    passedRun={passedRun}
                  />
                )}
                {!!report.author_known_issues?.length && (
                  <AuthorKnownIssues items={report.author_known_issues} />
                )}

                <GatesLadder
                  gates={report.gates}
                  extraRows={installBlocked ? undefined : extraGateRows}
                  blockedAt={blockedGate}
                  hideHowToRead
                />

                <p className="mt-2.5 text-xs sm:text-sm text-muted-foreground">
                  <a
                    href="#verified-annex-run1"
                    onClick={openAnnex}
                    className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
                  >
                    <Terminal className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    <span>{t("verified.annex.jumpRun1")}</span>
                  </a>
                </p>

                {!report.assisted_run?.attempted && hasOutputSection && (
                  <div id="verified-output-content" className="mt-6 scroll-mt-20">
                    <h3 className="mb-2 text-base font-semibold">
                      {t("verified.content.heading")}
                    </h3>
                    <OutputContent
                      stats={report.content_detail?.outputs?.[0]?.stats}
                      io={report.io_detail?.outputs?.[0]}
                      panelLoci={data.provenance.length === 1 ? data.provenance[0].loci : undefined}
                      outputVerification={report.output_verification}
                      verdict={report.verdict}
                      gates={report.gates}
                      outputPreview={report.output_preview}
                      sliceScopeNote={report.slice_scope_note}
                    />
                  </div>
                )}

                {!report.assisted_run?.attempted && normalizedRecommendations.length > 0 && (
                  <div className="mt-5 rounded-lg border bg-muted/35 p-4 space-y-2">
                    <p className="text-sm font-semibold text-foreground">
                      {t("verified.recommendations.heading")}
                    </p>
                    <ul className="space-y-1.5 text-sm text-muted-foreground">
                      {normalizedRecommendations.map((rec, idx) => (
                        <li key={`${idx}-${rec.slice(0, 48)}`} className="flex gap-2 leading-relaxed">
                          <span aria-hidden="true">&bull;</span>
                          <span><InlineCodeText text={rec} /></span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Section>
            </div>

            {/* Section 2: Automated Run with Suggested Documentation Adjustments */}
            {report.assisted_run?.attempted && (
              <div id="verified-assisted-run" className="scroll-mt-20">
                <Section n={next()} title={t("verified.assisted.heading")}>
                  <AssistedVerificationSection
                    assisted={report.assisted_run}
                    repo={report.source.repo}
                    sha={report.source.ref_resolved ?? report.source.ref}
                    panelLoci={data.provenance.length === 1 ? data.provenance[0].loci : undefined}
                    sliceScopeNote={report.slice_scope_note}
                    recommendations={normalizedRecommendations}
                  />
                </Section>
              </div>
            )}

            {afterAssisted}
            {!report.assisted_run?.passed && <ManualOffer report={report} slug={slug} />}

            {history && (
              <Section n={next()} title={t("verified.history.heading")}>
                <VersionHistory
                  rows={history.rows}
                  current={{ slug: history.current.slug, sha: history.current.sha, instrument: history.current.instrument }}
                  repo={report.source.repo}
                />
              </Section>
            )}

            {/* Section 3: Verification Data and Inputs Supplied Beyond the Repository */}
            {((!installBlocked || Boolean(report.assisted_run?.passed)) &&
              (data.provenance.length > 0 || data.hasStrhubFixture || !!localizedNeeded?.length)) && (
              <Section n={next()} title={t("verified.data.consolidatedHeading")}>
                {(data.provenance.length > 0 || data.hasStrhubFixture) && (
                  <VerificationData
                    provenance={data.provenance}
                    hasStrhubFixture={data.hasStrhubFixture}
                    installsPassed={Boolean(
                      report.gates?.installs || report.assisted_run?.gates?.installs,
                    )}
                  />
                )}

                {report.datasets &&
                  report.datasets.length > 0 &&
                  report.datasets.some((leg) => leg.leg !== "external" && leg.available) && (
                  <div className="mt-5">
                    <h3 className="text-base font-semibold">{t("verified.matrix.heading")}</h3>
                    <VerificationMatrix
                      legs={report.datasets}
                      installsPassed={Boolean(
                        report.gates?.installs || report.assisted_run?.gates?.installs,
                      )}
                      verdictCode={report.assisted_run?.passed ? "runs" : report.verdict?.code}
                    />
                  </div>
                )}

                {!!localizedNeeded?.length && (
                  <div className="mt-5">
                    <h3 className="text-base font-semibold">{t("verified.needed.heading")}</h3>
                    <BulletCard headingKey="verified.needed.heading" noteKey="verified.needed.note" items={localizedNeeded} />
                  </div>
                )}
              </Section>
            )}

            {/* Section 4: How to Interpret This Result and Scope */}
            <Section n={next()} title={t("verified.certificate.section.interpretAndScope")}>
              {(!installBlocked || Boolean(report.assisted_run?.passed)) && (
                <WhatWasVerified
                  gates={report.gates}
                  verdictCode={report.verdict?.code}
                  assistedGates={
                    report.assisted_run?.attempted
                      ? (report.assisted_run.gates as Record<string, boolean>)
                      : undefined
                  }
                />
              )}
              <BoxedList lead={t("verified.certificate.text.scopeExec")} items={certificate.limitations} />
              {certificate.conclusion.length > 0 && (
                <div className="mt-5">
                  <ConclusionBox items={certificate.conclusion} />
                </div>
              )}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
                <p className="leading-relaxed">{certificate.scope.disclaimer}</p>
                <Link
                  href="/verified/how-to-read"
                  className="font-medium text-primary hover:underline"
                >
                  {t("verified.gate.howToReadOpenFull")}
                </Link>
              </div>
            </Section>

            {!installBlocked && afterSource}

            {/* Collapsible Technical Annex (open by default when neither run passed) */}
            <TechnicalAnnex
              report={report}
              strictLogs={strictLogs}
              assistedLogs={assistedLogs}
              preferredStrictLeg={preferredLog}
              installBlocked={installBlocked}
              strictOutputSummary={terminalOutput}
              assistedOutputSummary={assistedTerminalOutput}
              outputSectionHref={!report.assisted_run?.attempted ? outputSectionHref : undefined}
              strictDockerfile={strictDockerfile}
              repoDockerfile={repoDockerfile}
              localizedCaveats={localizedCaveats}
              defaultOpen={!passedRun && !report.assisted_run?.passed}
            />

            {staticPageUrl && <DisputeCard report={report} slug={slug} staticPageUrl={staticPageUrl} />}
          </>
        )}
      </div>
    </div>
  );
}

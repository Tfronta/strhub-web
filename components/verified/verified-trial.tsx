"use client";

/**
 * A test run, watched live and then read.
 *
 * Polls /api/verify/trial until the run completes, then renders the same
 * report a published attestation gets — summary, pinned commit, the data it
 * ran on, the ladder, the evidence — with what only a trial has slotted in:
 * the verdict a reader who does not program needs, what stopped it and what
 * to do about it, and the recorded environment.
 */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";
import { PageTitle } from "@/components/page-title";
import type { TrialRole, TrialStatus } from "@/lib/verified/trial";
import { VERDICT_TONE } from "@/lib/verified/badge";
import { extraGateRowsFor } from "@/lib/verified/extra-gates";
import {
  localizeBlocker,
  localizeReadmeGap,
  localizeVerdictReason,
} from "@/lib/verified/certificate";
import { step1For, type Step1Tone } from "@/lib/verified/step1";
import { classifyManual } from "@/lib/verified/status-summary";
import { FailurePhaseBadge, ReadmeTemplateAction, Step1BodyText } from "@/components/verified/report/verdict";
import { InlineCodeText } from "@/components/verified/report/inline-code";
import { ownerIssueUrl } from "@/lib/verified/trial-next-steps";
import { LOG_LEGS } from "@/lib/verified/log-files";
import { ManualReviewCard } from "./manual-review-card";
import { actionableDiagnostics, getDiagnosticText } from "./report/findings";
import { VerifiedReportBody, type ReportLog, type ExtraGateRow } from "./report/verified-report-body";

const POLL_MS = 8000;
const STALL_AFTER_MS = 6 * 60 * 1000;
const GIVE_UP_AFTER_MS = 45 * 60 * 1000;

/** Step 1 leads the page, so its border carries the result. */
const STEP1_BORDER: Record<Step1Tone, string> = {
  green: "border-teal-600/60",
  red: "border-red-600/60",
  grey: "border-slate-400/60",
};


export function VerifiedTrial({ id, role }: { id: string; role: TrialRole }) {
  const { t } = useLanguage();
  const [status, setStatus] = useState<TrialStatus | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const startedAt = useRef(Date.now());
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let stopped = false;
    async function poll() {
      try {
        const res = await fetch(`/api/verify/trial?id=${encodeURIComponent(id)}`);
        const data = await res.json();
        if (data.ok) {
          setStatus(data as TrialStatus);
          setFetchError(null);
          if (data.state === "completed" || data.state === "expired") return;
        } else if (res.status === 503) {
          setFetchError(t("verified.start.error.not_configured"));
          return;
        }
      } catch {
        // transient; keep polling
      }
      setNow(Date.now());
      if (!stopped && Date.now() - startedAt.current < GIVE_UP_AFTER_MS) {
        timer = setTimeout(poll, POLL_MS);
      }
    }
    poll();
    return () => {
      stopped = true;
      if (timer) clearTimeout(timer);
    };
  }, [id, t]);

  const report = status?.report ?? null;
  const verdict = report?.verdict ?? null;
  const elapsedMin = Math.floor((now - startedAt.current) / 60000);
  const initialLoading = status === null;
  const running = Boolean(status && status.state !== "completed" && status.state !== "expired");
  const stalled = running && status?.state === "pending" && now - startedAt.current > STALL_AFTER_MS;
  const repoDockerfile = status?.recipe?.manifest_yml.includes("source: repository") ?? false;

  // The artifact carries the log text itself, so the body opens it inline.
  const logs: ReportLog[] = LOG_LEGS.flatMap((leg) => {
    const terminal = status?.files?.[`terminal-${leg}`];
    const href = terminal ?? status?.files?.[`log-${leg}`];
    return href ? [{ leg, label: t(`verified.trial.log.${leg}`), href, hasInvocation: Boolean(terminal) }] : [];
  });
  const gates = (report?.gates ?? {}) as Record<string, boolean>;
  const extraGateRows: ExtraGateRow[] = extraGateRowsFor(gates, t);

  // Step 1, the documented run, is the headline; the forensic pipeline is a
  // later section and never changes it (engine docs/PLAN-Paso-1.md). Absent on
  // a report written before the engine carried it, and then the verdict leads
  // as it always did.
  const step1 = step1For(report?.step1, t);
  const step1Diagnostics = [
    ...(report?.install_detail?.diagnostics ?? []),
    ...actionableDiagnostics(report?.diagnostics, false),
  ];
  const localizedReason = localizeVerdictReason(verdict?.reason, t) ?? verdict?.reason;
  const issueBlockers = (verdict?.blockers ?? []).map((b) => ({
    ...b,
    localizedWhat: localizeBlocker(b, t),
    issueUrl: report
      ? ownerIssueUrl(report, b, typeof window !== "undefined" ? window.location.href.split("?")[0] : "")
      : null,
  }));

  const assistedPassed = Boolean(report?.assisted_run?.passed);

  const step1Block = step1 && (
    <section
      className={`mt-6 rounded-lg border-2 p-5 sm:p-6 ${
        assistedPassed ? "border-amber-500/50" : STEP1_BORDER[step1.tone]
      }`}
      aria-labelledby="trial-step1"
    >
      <div className="flex flex-wrap items-center gap-2.5">
        {verdict && (
          <Badge className={`${VERDICT_TONE[verdict.code]} border-transparent text-xs sm:text-sm`}>
            {t(`verified.trial.verdict.${verdict.code}`)}
          </Badge>
        )}
        <p className="text-xs sm:text-sm font-medium uppercase tracking-wide text-muted-foreground">
          {t("verified.trial.step1.heading")}
        </p>
        <FailurePhaseBadge phase={verdict?.failure_phase} />
      </div>
      <h2 id="trial-step1" className="mt-2 text-xl font-semibold">
        {step1.headline}
      </h2>
      <p className="mt-2 text-base leading-relaxed text-muted-foreground">
        <Step1BodyText body={step1.body} />
      </p>
      {report?.scope_limit && (
        <p className="mt-2.5 rounded-md border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{t("verified.trial.scopeLimitHeading")}:</span>{" "}
          <InlineCodeText text={report.scope_limit} />
        </p>
      )}

      {/* Full-width problem diagnosis BEFORE the action cards */}
      {step1.code !== "runs" && report && (
        <div className="mt-4 rounded-lg border border-amber-500/40 bg-amber-50/40 p-4 sm:p-5 dark:border-amber-800/60 dark:bg-amber-950/20">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-900 dark:text-amber-300">
            {t("verified.trial.manualReview.diagnosisHeading")}
          </p>

          {step1.code === "does_not_run" && step1Diagnostics.length > 0 ? (
            <div className="mt-3 divide-y divide-border/60">
              {step1Diagnostics.map((issue) => {
                const txt = getDiagnosticText(t, issue);
                return (
                  <div key={issue.id + issue.title} className="space-y-2 py-3 first:pt-0 last:pb-0">
                    <div className="flex flex-wrap items-baseline gap-2 text-sm sm:text-base">
                      <span className="font-semibold text-muted-foreground">
                        {t("verified.trial.manualReview.topicWhatFailed")}
                      </span>
                      <span className="font-semibold text-foreground">{txt.cleanTitle}</span>
                    </div>
                    {txt.item && (
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="font-semibold text-muted-foreground">
                          {t("verified.trial.manualReview.topicAffectedItem")}
                        </span>
                        <code className="break-all rounded border bg-background px-2 py-0.5 font-mono text-xs sm:text-sm text-foreground">
                          {txt.item}
                        </code>
                      </div>
                    )}
                    {txt.suggestion && (
                      <div className="text-sm sm:text-base leading-relaxed break-words [overflow-wrap:anywhere]">
                        <span className="font-semibold text-muted-foreground">
                          {t("verified.trial.manualReview.topicWhyItHappens")}{" "}
                        </span>
                        <span className="text-foreground/90">{txt.suggestion}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-2.5 space-y-3 text-sm sm:text-base">
              {localizedReason && (
                <p className="leading-relaxed text-foreground/95 break-words [overflow-wrap:anywhere]">
                  {localizedReason}
                </p>
              )}
              {step1.missing.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">{step1.missingTitle}</p>
                  <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm sm:text-base">
                    {step1.missing.map((block) => (
                      <li key={block}>{block}</li>
                    ))}
                  </ul>
                </div>
              )}
              {verdict?.readme_gaps && verdict.readme_gaps.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">{t("verified.trial.gapsTitle")}</p>
                  <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm sm:text-base">
                    {verdict.readme_gaps.map((g) => (
                      <li key={g.item}>{localizeReadmeGap(g, t)}</li>
                    ))}
                  </ul>
                </div>
              )}
              {issueBlockers.some((b) => b.localizedWhat !== localizedReason) && (
                <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
                  {issueBlockers
                    .filter((b) => b.localizedWhat !== localizedReason)
                    .map((b) => (
                      <li key={b.code} className="break-words [overflow-wrap:anywhere]">
                        {b.localizedWhat}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          )}

          {issueBlockers.some((b) => b.issueUrl) && (
            <div className="mt-3 flex flex-wrap gap-2 border-t border-border/50 pt-3">
              {issueBlockers
                .filter((b) => b.issueUrl)
                .slice(0, 1)
                .map((b) => (
                  <Button key={b.code} asChild size="sm" variant="outline" title={t("verified.trial.askOwnerHint")}>
                    <a href={b.issueUrl!} target="_blank" rel="noopener noreferrer">
                      {t("verified.trial.askOwner")} <ExternalLink className="ml-1 h-3.5 w-3.5" />
                    </a>
                  </Button>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Action options rendered after both automatic tracks via `afterAssisted` */}
    </section>
  );

  const actionOptionsBlock =
    step1 && step1.code !== "runs" && report && !assistedPassed ? (
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="flex flex-col justify-between rounded-lg border bg-background/70 p-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t("verified.trial.manualReview.option1Tag")}
            </p>
            <h3 className="mt-2 text-base font-semibold">
              {step1.code === "cannot_tell"
                ? t("verified.trial.manualReview.option1Title")
                : step1.code === "does_not_run"
                  ? t("verified.trial.manualReview.option1FailsTitle")
                  : t("verified.trial.manualReview.option1OursTitle")}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {step1.code === "cannot_tell"
                ? t("verified.trial.manualReview.option1DocsBody")
                : step1.code === "does_not_run"
                  ? t("verified.trial.manualReview.option1FailsBody")
                  : t("verified.trial.manualReview.option1OursBody")}
            </p>
          </div>
          <div className="mt-4 space-y-2">
            <Button asChild variant="outline" size="sm">
              <Link href={step1.guideHref}>{step1.guideLabel}</Link>
            </Button>
            {step1.code === "cannot_tell" && <ReadmeTemplateAction report={report} />}
          </div>
        </div>

        {status?.existing?.manual ? (() => {
          const manual = status.existing.manual;
          const manualSummary = classifyManual({
            level: manual.level,
            verdict: manual.verdict,
            errors_reported: manual.errors_reported,
            instrument: "curated",
          });
          const manualPassed =
            manualSummary?.kind === "pass" || manualSummary?.kind === "pass_errors";
          return (
            <div
              className={`flex flex-col justify-between rounded-lg border p-4 ${
                manualPassed
                  ? "border-teal-600/40 bg-teal-50/70 dark:border-teal-500/40 dark:bg-teal-950/30"
                  : "border-amber-500/45 bg-amber-50/70 dark:border-amber-600/45 dark:bg-amber-950/30"
              }`}
            >
              <div>
                <p
                  className={`text-xs font-semibold uppercase tracking-wide ${
                    manualPassed
                      ? "text-teal-800 dark:text-teal-300"
                      : "text-amber-900 dark:text-amber-300"
                  }`}
                >
                  {t("verified.trial.existingManual.tag")}
                </p>
                <h3 className="mt-2 text-base font-semibold text-foreground">
                  {manualPassed
                    ? t("verified.trial.existingManual.passedTitle")
                    : t("verified.trial.existingManual.reviewedTitle")}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {manualPassed
                    ? t("verified.trial.existingManual.passedBody")
                    : t("verified.trial.existingManual.reviewedBody")}
                </p>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button
                  asChild
                  size="sm"
                  className={
                    manualPassed
                      ? "bg-teal-600 text-white hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500"
                      : "bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-500"
                  }
                >
                  <Link href={manual.href}>
                    <BookOpen className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                    {manualPassed
                      ? t("verified.trial.existingManual.cta")
                      : t("verified.trial.existingManual.ctaFailed")}
                    <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden />
                  </Link>
                </Button>
                {status.existing.href !== manual.href && (
                  <Link
                    href={status.existing.href}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    {t("verified.trial.existingManual.viewPublished")}
                  </Link>
                )}
              </div>
            </div>
          );
        })() : (
          <ManualReviewCard
            trialId={id}
            toolName={report.tool.name}
            repo={report.source.repo}
            refSha={report.source.ref_resolved ?? report.source.ref ?? "HEAD"}
            role={role}
            reason={verdict?.reason ?? step1.headline}
            ciRun={status?.runUrl ?? report.ci_run ?? undefined}
          />
        )}
      </div>
    ) : null;

  // An `undetermined` whose cause is ours must not be read as a finding about
  // the documentation: STRhub not holding a sample of that kind, or its own
  // reader rewriting the command, is not a gap in anybody's README.
  const verdictMeaningKey =
    verdict?.code === "undetermined" && step1?.code === "ours"
      ? "undeterminedOurs"
      : verdict?.code;

  const verdictBlock = report && verdict && (
    <>
      {step1Block}
      {(!step1 || (step1.code === "runs" && verdict.readme_gaps && verdict.readme_gaps.length > 0)) && (
        <section className="mt-4 rounded-lg border bg-card p-5 sm:p-6" aria-labelledby="trial-verdict">
          <div className="flex flex-wrap items-center gap-3">
            <Badge className={`${VERDICT_TONE[verdict.code]} border-transparent text-sm`}>{t(`verified.trial.verdict.${verdict.code}`)}</Badge>
            <h2 id="trial-verdict" className="text-lg font-semibold">
              {t(`verified.trial.verdictMeaning.${verdictMeaningKey}`)}
            </h2>
          </div>
          <p className="mt-2 text-base leading-relaxed text-muted-foreground">
            {localizedReason}
          </p>
          {verdict.readme_gaps && verdict.readme_gaps.length > 0 && (
            <div className="mt-4">
              <h3 className="text-base font-semibold">{t("verified.trial.gapsTitle")}</h3>
              <p className="mb-2 text-sm text-muted-foreground">{t("verified.trial.gapsHint")}</p>
              <ul className="list-disc space-y-1 pl-5 text-base">
                {verdict.readme_gaps.map((g) => <li key={g.item}>{localizeReadmeGap(g, t)}</li>)}
              </ul>
            </div>
          )}
        </section>
      )}

      {!step1 && verdict.blockers && verdict.blockers.length > 0 && (
        <Card className="mt-6 border-amber-500/40 dark:border-amber-800">
          <CardHeader>
            <CardTitle className="text-lg">{t("verified.trial.stoppedTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-5">
              {issueBlockers.map((b) => (
                <li key={b.code} className="text-base">
                  <p className="font-medium">{b.localizedWhat}</p>
                  {b.issueUrl && (
                    <div className="mt-2">
                      <Button asChild size="sm" variant="outline" title={t("verified.trial.askOwnerHint")}>
                        <a href={b.issueUrl} target="_blank" rel="noopener noreferrer">
                          {t("verified.trial.askOwner")} <ExternalLink className="ml-1 h-3.5 w-3.5" />
                        </a>
                      </Button>
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}

      <p className="mt-4 text-sm sm:text-base text-muted-foreground">{t("verified.trial.share")}</p>
    </>
  );

  return (
    <div className="container mx-auto max-w-4xl px-4 pt-8">
      <Link
        href="/verified"
        className="inline-flex items-center gap-1.5 text-base text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" /> {t("verified.backToList")}
      </Link>
      {!report && <PageTitle title={t("verified.trial.title")} />}

      {fetchError && (
        <p role="alert" className="mt-6 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">{fetchError}</p>
      )}

      {initialLoading && !fetchError && (
        <Card className="mt-6">
          <CardContent className="flex items-center gap-3 py-6 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-teal-600 shrink-0" aria-hidden />
            <span>{t("verified.trial.loadingStatus")}</span>
          </CardContent>
        </Card>
      )}

      {running && !fetchError && (
        <Card className="mt-6 border-teal-200/80 bg-teal-50/40 shadow-sm dark:border-teal-900/60 dark:bg-teal-950/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3.5">
              <Loader2 className="h-5 w-5 animate-spin text-teal-600 shrink-0 mt-0.5 dark:text-teal-400" aria-hidden />
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-base font-semibold text-teal-950 dark:text-teal-100">
                    {t("verified.trial.waitingBannerTitle")}
                  </h2>
                  <span className="rounded bg-teal-100/80 px-2 py-0.5 font-mono text-xs font-medium text-teal-900 dark:bg-teal-900/60 dark:text-teal-200">
                    {t("verified.trial.elapsed", { minutes: String(elapsedMin) })}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-teal-900/85 dark:text-teal-300/85">
                  {t("verified.trial.waitingBannerDescription")}
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-teal-200/60 pt-3 text-xs dark:border-teal-900/50">
                  <span className="text-muted-foreground">
                    <span className="font-medium text-foreground">{t("verified.trial.currentStatusLabel")}:</span>{" "}
                    {t(`verified.trial.state.${stalled ? "stalled" : status?.state ?? "pending"}`)}
                  </span>
                  {status?.runUrl && (
                    <a
                      href={status.runUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-medium text-teal-700 hover:underline dark:text-teal-400"
                    >
                      {t("verified.trial.runLink")} <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
                {elapsedMin >= 2 && (status?.state === "pending" || !status?.state || status?.state === "queued") && (
                  <p className="mt-2 rounded border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-900 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-300">
                    {t("verified.trial.queueDelayNotice")}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {status?.state === "expired" && (
        <p className="mt-6 text-sm">{t("verified.trial.state.expired")}</p>
      )}

      {status?.state === "completed" && !report && (
        <Card className="mt-6">
          <CardContent className="pt-6 text-sm">
            <p>{t("verified.trial.noReport")}</p>
            {status.runUrl && (
              <a href={status.runUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 underline underline-offset-2">
                {t("verified.trial.runLink")} <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </CardContent>
        </Card>
      )}

      {report && verdict && (
        <>
          <VerifiedReportBody
            report={report}
            slug={status?.slug ?? id}
            staticPageUrl={status?.files?.html}
            pdfUrl={status?.files?.pdf}
            ciRunUrl={status?.runUrl ?? report.ci_run ?? undefined}
            trialUrl={`/verified/trial/${id}`}
            logs={logs}
            buildLogHref={logs.find((l) => l.leg === "build")?.href}
            extraGateRows={extraGateRows}
            backLink={false}
            afterHeader={verdictBlock}
            afterAssisted={actionOptionsBlock}
            strictDockerfile={status?.recipe?.dockerfile}
            repoDockerfile={repoDockerfile}
          />
          <p className="mb-10 flex flex-wrap gap-4 px-4 text-base">
            {status?.runUrl && (
              <a href={status.runUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline underline-offset-2">
                {t("verified.trial.runLink")} <ExternalLink className="h-4 w-4" />
              </a>
            )}
            <Link href="/verified/submit" className="underline underline-offset-2">
              {t("verified.trial.again")}
            </Link>
          </p>
        </>
      )}
    </div>
  );
}

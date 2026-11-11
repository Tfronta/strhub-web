"use client";

import Link from "next/link";
import { ArrowLeft, Check, Minus, ExternalLink, AlertTriangle, Info, XCircle, LifeBuoy } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useHeaded } from "./certificate";
import { cn } from "@/lib/utils";
import type { VerifiedReport, VerifiedDiagnostic, VerifiedReadmeCheck } from "@/types/verified";
import { summarizeErrors, externalLegNoteKeys, installFaultKey } from "@/lib/verified/diagnostics";
import { isManualEligible, reasonI18nKey } from "@/lib/verified/manual";

function getDiagnosticText(
  t: (key: string, params?: Record<string, string>) => string,
  issue: { id: string; title: string; suggestion?: string; examples?: string[] },
): { title: string; suggestion?: string } {
  const params: Record<string, string> = {};
  if (issue.examples?.[0]) params["0"] = issue.examples[0];
  if (issue.examples?.[1]) params["1"] = issue.examples[1];

  const mStrLen = issue.title.match(/\((\d+)\s+vs\s+max\s+(\d+)\)/i);
  if (mStrLen) {
    params["0"] = mStrLen[1];
    params["1"] = mStrLen[2];
  }
  const mTimeout = issue.title.match(/\((\d+)\s+minutes\)/i);
  if (mTimeout) {
    params["0"] = mTimeout[1];
  }
  const mPyExc = issue.title.match(/^The tool raised\s+([^:]+):\s*(.+)$/i);
  if (mPyExc) {
    params["0"] = mPyExc[1];
    params["1"] = mPyExc[2];
  }
  if (!params["0"]) {
    const mColon = issue.title.match(/:\s+(--[\w-]+|\/[^\s]+|\S+)$/);
    if (mColon) {
      params["0"] = mColon[1].replace(/^--/, "");
    }
  }

  const titleKey = `verified.diagnostics.ids.${issue.id}.title`;
  const suggKey = `verified.diagnostics.ids.${issue.id}.suggestion`;
  const i18nTitle = t(titleKey, params);
  const i18nSuggestion = t(suggKey, params);
  const hasI18nTitle = i18nTitle !== titleKey;

  let finalTitle = hasI18nTitle ? i18nTitle : issue.title;
  if (hasI18nTitle && params["0"] && !finalTitle.includes(params["0"]) && issue.id !== "str_too_long" && issue.id !== "run_timeout") {
    const suffix = issue.id === "bad_option" ? `--${params["0"]}` : params["0"];
    finalTitle = `${finalTitle}: ${suffix}`;
  }

  return {
    title: finalTitle,
    suggestion:
      hasI18nTitle && i18nSuggestion !== suggKey
        ? i18nSuggestion
        : issue.suggestion,
  };
}

/**
 * The build that failed, in plain words. Directly under the source block,
 * because nothing below it ran (or, on plan B, because what ran is not a
 * build of the pinned commit).
 */
export function BuildFailedCard({
  report,
  buildLogHref,
}: {
  report: VerifiedReport;
  buildLogHref?: string;
}) {
  const { t } = useLanguage();
  const d = report.install_detail;
  if (!d?.diagnostics?.length) return null;
  const fallback = !!d.fallback_used;
  const reason = report.environment?.fallback?.reason ?? t("verified.trial.recipeFallbackReason");
  const params = {
    name: report.tool.name,
    sha: (report.source.ref_resolved ?? report.source.ref ?? "").slice(0, 7),
    reason: reason.charAt(0).toUpperCase() + reason.slice(1),
  };
  const meaning: [string, string][] = [
    ["verified.install.meaning.runLabel", fallback ? "verified.install.meaning.runFallback" : "verified.install.meaning.run"],
    ["verified.install.meaning.reviewLabel", fallback ? "verified.install.meaning.reviewFallback" : "verified.install.meaning.review"],
    ["verified.install.meaning.maintainLabel", installFaultKey(d.faults)],
  ];
  return (
    <div className="mt-6 rounded-lg border border-amber-500/40 bg-amber-50/40 dark:border-amber-800/60 dark:bg-amber-950/20 p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-400">
        {t(fallback ? "verified.install.headingFallback" : "verified.install.heading")}
      </h2>
      <p className="mt-2 text-sm">{t(fallback ? "verified.install.noteFallback" : "verified.install.note", params)}</p>
      <div className="mt-3 rounded-md border border-border bg-background/70 p-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("verified.install.meaningHeading")}</p>
        <ul className="mt-2 space-y-1.5 text-sm">
          {meaning.map(([labelKey, textKey]) => (
            <li key={labelKey}>
              <span className="font-medium">{t(labelKey)}</span>{" "}
              <span className="text-muted-foreground">{t(textKey, params)}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("verified.install.whatFailed")}</p>
      <ul className="mt-2 space-y-2 border-t border-border pt-3">
        {d.diagnostics.map((issue) => {
          const txt = getDiagnosticText(t, issue);
          return (
            <li key={issue.id + issue.title} className="text-sm">
              <span className="font-medium">{txt.title}</span>
              {txt.suggestion && (
                <span className="mt-0.5 block text-xs text-muted-foreground">{txt.suggestion}</span>
              )}
            </li>
          );
        })}
      </ul>
      {buildLogHref && (
        <a
          href={buildLogHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          {t("verified.install.viewBuildLog")}
          <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </div>
  );
}

/**
 * Actionable issues from the execution log: errors on any run, plus warnings
 * when the run did not pass. Routine info lines and slice-filter warnings on
 * passing runs are suppressed so a clean run does not display failure cards.
 */
export function actionableDiagnostics(
  diagnostics: Record<string, VerifiedDiagnostic[]> | undefined,
  passedRun = false,
): VerifiedDiagnostic[] {
  if (!diagnostics || Object.keys(diagnostics).length === 0) return [];
  const HIDDEN_IDS = new Set(["genotyping_summary", "low_bq_reads", "unpaired_reads"]);
  const seen = new Set<string>();
  return Object.values(diagnostics)
    .flat()
    .filter((issue) => {
      if (HIDDEN_IDS.has(issue.id)) return false;
      if (issue.severity === "info") return false;
      if (passedRun && issue.severity !== "error") return false;
      if (seen.has(issue.id)) return false;
      seen.add(issue.id);
      return true;
    });
}

/** Errors the tool itself reported while it ran, with scale and affected items. */
export function AutoDiagnostics({
  diagnostics,
  hasStrhubFixture,
  passedRun = false,
}: {
  diagnostics: Record<string, VerifiedDiagnostic[]> | undefined;
  hasStrhubFixture: boolean;
  passedRun?: boolean;
}) {
  const { t } = useLanguage();
  const deduped = actionableDiagnostics(diagnostics, passedRun);
  if (deduped.length === 0) return null;
  const errorSummary = summarizeErrors(diagnostics ?? {});
  const noteKeys = externalLegNoteKeys(diagnostics ?? {});

  return (
    <>
      {!useHeaded() && (<h2 className="mt-10 text-xl font-semibold">{t("verified.diagnostics.heading")}</h2>)}
      <p className="mt-1 text-sm text-muted-foreground">{t("verified.diagnostics.note")}</p>
      {hasStrhubFixture && (
        <div className="mt-3 rounded-lg border border-border bg-muted/40 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            {t("verified.diagnostics.strhubNoteLabel")}
          </p>
          <p className="text-sm text-muted-foreground">{t("verified.diagnostics.sampleNote")}</p>
        </div>
      )}
      <p className="mt-4 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {t("verified.diagnostics.logIssuesLabel")}
      </p>
      <div className="space-y-2">
        {deduped.map((issue) => {
          const txt = getDiagnosticText(t, issue);
          const summary = errorSummary.find((e) => e.id === issue.id);
          const items = summary?.items ?? [];
          const count = summary?.count ?? issue.count;
          return (
            <div
              key={issue.id}
              className={cn(
                "rounded-lg border border-l-4 px-4 py-3 text-sm",
                issue.severity === "error"
                  ? "border-red-500/40 border-l-red-600 bg-red-50/40 dark:border-red-900/50 dark:border-l-red-500 dark:bg-red-950/20"
                  : "border-amber-500/40 border-l-amber-500 bg-amber-50/40 dark:border-amber-900/50 dark:border-l-amber-500 dark:bg-amber-950/20",
              )}
            >
              <div className="flex items-start gap-2">
                {issue.severity === "error" ? (
                  <XCircle className="h-4 w-4 mt-0.5 shrink-0 text-red-600 dark:text-red-400" />
                ) : (
                  <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
                )}
                <div className="min-w-0">
                  <p className="font-medium">
                    {txt.title}
                    {count && count > 1 && (
                      <span className="ml-2 text-xs font-normal text-muted-foreground">
                        {t("verified.diagnostics.timesLabel").replace("{n}", String(count))}
                      </span>
                    )}
                  </p>
                  {items.length > 0 && (
                    <p className="mt-1 font-mono text-xs text-muted-foreground break-words">
                      {t("verified.diagnostics.affectedLabel")} {items.join(", ")}
                    </p>
                  )}
                  {txt.suggestion && <p className="mt-1 text-muted-foreground">{txt.suggestion}</p>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {noteKeys.length > 0 && (
        <div className="mt-3 space-y-2 text-sm text-muted-foreground">
          {noteKeys.map((key) => (
            <p key={key}>{t(`verified.diagnostics.${key}`)}</p>
          ))}
        </div>
      )}
    </>
  );
}

/**
 * Manual verification (level 2). Rendered only when the ENGINE marked the run
 * eligible. There is no path to this offer from the UI: the paid tier cannot
 * be reached by asking, only by the automated path structurally failing to
 * express the tool.
 */
export function ManualOffer({ report, slug }: { report: VerifiedReport; slug: string }) {
  const { t } = useLanguage();
  if (!isManualEligible(report)) return null;
  const manual = report.manual_verification!;
  const key = reasonI18nKey(manual.reason_code);
  const translated = key ? t(key) : null;
  // Fall back to the engine's own wording when a reason id has no string yet,
  // so a new engine rule degrades to plain English, not a raw key.
  const reason = translated && translated !== key ? translated : manual.reason ?? "";
  return (
    <>
      {!useHeaded() && (<h2 className="mt-10 text-xl font-semibold">{t("verified.manual.heading")}</h2>)}
      <div className="mt-3 rounded-lg border border-border bg-muted/40 p-4">
        <div className="flex gap-3">
          <LifeBuoy className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
          <div className="space-y-3 text-sm">
            <p>{reason}</p>
            <p className="text-muted-foreground">{t("verified.manual.notAFault")}</p>
            <p className="text-muted-foreground">{t("verified.manual.whatItIs")}</p>
            <Link
              href={`/verified/manual?slug=${encodeURIComponent(slug)}`}
              className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
            >
              {t("verified.manual.cta")}
              <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
            </Link>
            <p className="pt-1 text-xs text-muted-foreground">
              {t("verified.manual.reasonCodeLabel")}{" "}
              <code className="rounded bg-muted px-1 py-0.5">{manual.reason_code}</code> ({manual.basis})
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

/** The advisory README presence checklist. Never gates the badge. */
export function ReadmeCheck({ check }: { check: VerifiedReadmeCheck | null | undefined }) {
  const { t } = useLanguage();
  if (!check) return null;
  return (
    <>
      {!useHeaded() && (<h2 className="mt-10 text-xl font-semibold">{t("verified.readme.heading")}</h2>)}
      <p className="mt-1 text-sm text-muted-foreground">
        {t("verified.readme.note")} ({check.score}/{check.max})
      </p>
      <ul className="mt-3 space-y-1 text-sm">
        {(
          [
            ["install", "verified.readme.install"],
            ["command", "verified.readme.command"],
            ["input", "verified.readme.input"],
            ["output", "verified.readme.output"],
            ["dependencies", "verified.readme.deps"],
          ] as const
        ).map(([key, labelKey]) => {
          const present = check.checks?.[key]?.present;
          return (
            <li key={key} className="flex items-center gap-2">
              <span
                className={cn(
                  "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                  present ? "bg-teal-600 text-white" : "bg-muted text-muted-foreground",
                )}
              >
                {present ? <Check className="h-2.5 w-2.5" /> : <Minus className="h-2.5 w-2.5" />}
              </span>
              {t(labelKey)}
            </li>
          );
        })}
      </ul>
    </>
  );
}

/** A heading, an explanatory note and a dash list — the shape of several sections. */
export function BulletCard({
  headingKey,
  noteKey,
  items,
}: {
  headingKey: string;
  noteKey?: string;
  items: string[] | null | undefined;
}) {
  const { t } = useLanguage();
  if (!items?.length) return null;
  return (
    <>
      {!useHeaded() && (<h2 className="mt-10 text-xl font-semibold">{t(headingKey)}</h2>)}
      <div className="mt-3 rounded-lg border bg-muted/40 p-4">
        {noteKey && <p className="text-sm text-muted-foreground">{t(noteKey)}</p>}
        <ul className={cn("space-y-2", noteKey && "mt-3")}>
          {items.map((item) => (
            <li key={item} className="flex gap-2 text-sm">
              <span aria-hidden="true" className="text-muted-foreground">&ndash;</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

/**
 * The author's own note about their own software, before STRhub's own notes:
 * a run that stops where the README says it stops is not news. Quoted, with
 * the line so a reader can open the README at it.
 */
export function AuthorKnownIssues({ items }: { items: VerifiedReport["author_known_issues"] }) {
  const { t } = useLanguage();
  if (!items?.length) return null;
  return (
    <>
      {!useHeaded() && (<h2 className="mt-10 text-xl font-semibold">{t("verified.trial.knownIssuesTitle")}</h2>)}
      <p className="mt-2 text-sm text-muted-foreground">{t("verified.trial.knownIssuesHint")}</p>
      <div className="mt-3 space-y-4 rounded-lg border p-4">
        {items.map((k) => (
          <div key={`${k.heading}-${k.line}`}>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("verified.trial.authorAcknowledgedLabel")}
            </span>
            <p className="text-sm font-medium">
              {k.heading}{" "}
              <span className="font-normal text-muted-foreground">
                ({k.url ? (
                  <a href={k.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                    {t("verified.trial.knownIssuesLine", { line: String(k.line) })}
                  </a>
                ) : t("verified.trial.knownIssuesLine", { line: String(k.line) })})
              </span>
            </p>
            <blockquote className="mt-1 border-l-2 pl-3 text-sm text-muted-foreground">
              {k.text}{k.truncated ? "…" : ""}
            </blockquote>
          </div>
        ))}
      </div>
    </>
  );
}

/** Claims whose README text is a command line rather than a sentence. */
const COMMAND_CLAIMS = new Set(["run_command", "published_image", "bioconda_package", "fallback_environment"]);

/**
 * Every claim the configuration rests on, openable at the pinned ref.
 *
 * The text quoted from the README is shown whole. It was clipped to one line
 * with an ellipsis, which cut the author's platform advice mid-word — the one
 * line a reader most needs entire, since the run may have gone against it.
 * A command is shown as code; a sentence is shown as a quotation, because that
 * is what it is.
 */
export function EvidenceList({ evidence }: { evidence: VerifiedReport["evidence"] }) {
  const { t } = useLanguage();
  if (!evidence?.length) return null;
  const claimLabel = (claim: string) => {
    const key = `verified.trial.evidenceClaim.${claim}`;
    const label = t(key);
    // An engine newer than these strings degrades to its own claim id, which
    // is at least readable, rather than to a raw i18n key.
    return label === key ? claim.replace(/_/g, " ") : label;
  };
  return (
    <>
      {!useHeaded() && (<h2 className="mt-10 text-xl font-semibold">{t("verified.trial.evidenceTitle")}</h2>)}
      <p className="mt-2 text-sm text-muted-foreground">{t("verified.trial.evidenceHint")}</p>
      <ul className="mt-3 divide-y rounded-lg border text-sm">
        {evidence.map((e, i) => {
          const quote = e.kind !== "tree" && e.text && e.claim !== "known_issue" ? e.text : null;
          return (
            <li key={`${e.claim}-${e.path}-${i}`} className="grid gap-x-3 gap-y-1 px-4 py-2 sm:grid-cols-[10rem_1fr]">
              <span className="text-muted-foreground">{claimLabel(e.claim)}</span>
              <div className="min-w-0">
                <a href={e.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-mono text-xs underline underline-offset-2 break-all">
                  {e.path}{e.line ? `#L${e.line}` : ""} <ExternalLink className="h-3 w-3 shrink-0" />
                </a>
                {quote && (COMMAND_CLAIMS.has(e.claim)
                  ? <code className="mt-1 block break-words rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">{quote}</code>
                  : <blockquote className="mt-1 border-l-2 pl-3 text-sm italic text-muted-foreground">{quote}</blockquote>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

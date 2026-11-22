"use client";

/**
 * The cover, as the certificate has it: the label and the panel, the tool
 * and its version, then the table a reviewer looks for first — when it was
 * verified, the commit in full with a link to it, the result, the rung
 * reached, the permanent link, the files — and the scope of the report in
 * its own box. What a person holding the PDF and the page sees in the same
 * place on both.
 */
import { useState } from "react";
import Link from "next/link";
import { Check, Copy, ExternalLink, FileDown, FileJson, Flag, Play, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";
import type { VerifiedCertificate, VerifiedReport } from "@/types/verified";
import { TONE, type BadgeDisplay } from "@/lib/verified/badge";
import { classifyManual, type StatusRowInput } from "@/lib/verified/status-summary";
import { formatDate } from "@/lib/verified/format-date";
import { cn } from "@/lib/utils";
import type { PanelKind } from "@/lib/verified/dataset-provenance";
import { KvTable, type KvRow } from "./certificate";

export function Cover({
  report,
  certificate,
  level,
  panel,
  title,
  slug,
  datasetsLabel,
  permalink,
  ciRunUrl,
  trialUrl,
  staticPageUrl,
  pdfUrl,
  jsonUrl,
  isManualRun,
  manualNoteRow,
  manualNoteHref,
}: {
  report: VerifiedReport;
  certificate: VerifiedCertificate;
  level: BadgeDisplay;
  panel: PanelKind | null;
  title: string;
  slug: string;
  datasetsLabel?: string;
  /** The page's own permanent address; none for a trial, which is published nowhere. */
  permalink?: string;
  ciRunUrl?: string;
  trialUrl?: string;
  staticPageUrl?: string;
  pdfUrl?: string;
  jsonUrl?: string;
  isManualRun?: boolean;
  /** Companion manual verification row when viewing an automatic report page. */
  manualNoteRow?: StatusRowInput;
  /** Direct link to the standalone manual report page. */
  manualNoteHref?: string;
}) {
  const { t, language } = useLanguage();
  const [copiedTrial, setCopiedTrial] = useState(false);
  const sha = report.source.ref_resolved ?? report.source.ref ?? "";
  const repo = report.source.repo.replace(/\/+$/, "");
  const commitUrl = /^https:\/\/github\.com\//.test(repo) && /^[0-9a-f]{7,40}$/i.test(sha) ? `${repo}/commit/${sha}` : null;
  const effectiveCiRun = ciRunUrl ?? report.ci_run ?? undefined;
  const isManual =
    Boolean(isManualRun) ||
    report.instrument === "curated" ||
    report.environment?.source === "prepared" ||
    Boolean(report.preparation);
  const selfManual = isManual
    ? classifyManual({
        level: report.level,
        verdict: report.verdict?.code,
        instrument: "curated",
      })
    : null;
  const companionManual = !isManual ? classifyManual(manualNoteRow) : null;

  async function copyTrialLink() {
    if (!trialUrl) return;
    try {
      const full = trialUrl.startsWith("http") || typeof window === "undefined"
        ? trialUrl
        : `${window.location.origin}${trialUrl}`;
      await navigator.clipboard.writeText(full);
      setCopiedTrial(true);
      setTimeout(() => setCopiedTrial(false), 2000);
    } catch {
      // clipboard unavailable
    }
  }

  const rows: KvRow[] = [
    { label: t("verified.certificate.cover.date"), value: formatDate(report.generated, language) },
    {
      label: t("verified.certificate.cover.commit"),
      value: (
        <span className="inline-flex flex-wrap items-center gap-2">
          <code className="break-all rounded bg-muted px-1.5 py-0.5 text-sm">{sha}</code>
          {commitUrl && (
            <a href={commitUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              {t("verified.certificate.cover.viewCommit")} <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          {report.source.committed && (
            <span className="text-sm text-muted-foreground">{t("verified.commitMadeOn", { date: formatDate(report.source.committed, language) })}</span>
          )}
        </span>
      ),
    },
    ...(effectiveCiRun
      ? [{
          label: t("verified.certificate.cover.ciRun"),
          value: (
            <a href={effectiveCiRun} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline">
              <Play className="h-3.5 w-3.5" />
              {t("verified.certificate.cover.ciRunCta")}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ),
        }]
      : []),
    {
      label: t("verified.mode.tableLabel"),
      value: isManual ? t("verified.mode.manualDetail") : t("verified.mode.autoDetail"),
    },
    { label: t("verified.certificate.cover.reached"), value: certificate.summary.reached },
    ...(certificate.summary.why
      ? [{ label: t("verified.certificate.summary.why"), value: certificate.summary.why }]
      : []),
    ...(datasetsLabel
      ? [{ label: t("verified.certificate.summary.datasets"), value: datasetsLabel }]
      : []),
    {
      label: t("verified.certificate.cover.permalink"),
      value: permalink
        ? <a href={permalink} className="break-all text-primary hover:underline">{permalink}</a>
        : (
          <span className="inline-flex flex-wrap items-center gap-3">
            <span className="text-muted-foreground">{t("verified.certificate.cover.notPublished")}</span>
            {trialUrl && (
              <button
                type="button"
                onClick={copyTrialLink}
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                {copiedTrial ? <Check className="h-3.5 w-3.5 text-teal-600" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedTrial ? t("verified.certificate.cover.trialLinkCopied") : t("verified.certificate.cover.copyTrialLink")}
              </button>
            )}
          </span>
        ),
    },
  ];
  if (pdfUrl || staticPageUrl || jsonUrl) {
    rows.push({
      label: t("verified.files.heading"),
      value: (
        <span className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          {pdfUrl && <a href={pdfUrl} download className="inline-flex items-center gap-1 font-medium text-primary hover:underline"><FileDown className="h-4 w-4" /> {t("verified.files.pdf")}</a>}
          {staticPageUrl && <a href={staticPageUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-primary hover:underline">{t("verified.files.html")} <ExternalLink className="h-3.5 w-3.5" /></a>}
          {jsonUrl && <a href={jsonUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-primary hover:underline"><FileJson className="h-4 w-4" /> {t("verified.files.json")}</a>}
          <a href="#dispute" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground hover:underline">
            <Flag className="h-3.5 w-3.5" /> {t("verified.dispute.cta")}
          </a>
        </span>
      ),
    });
  }

  return (
    <div className="mt-6 rounded-lg border bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {isManual && selfManual ? (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-sm font-bold tabular-nums",
                selfManual.kind === "fail"
                  ? "border-amber-600/45 bg-amber-50 text-amber-900 dark:border-amber-500/45 dark:bg-amber-950/50 dark:text-amber-200"
                  : "border-indigo-600/45 bg-indigo-50 text-indigo-900 dark:border-indigo-500/45 dark:bg-indigo-950/50 dark:text-indigo-200"
              )}
            >
              {selfManual.kind === "fail" ? (
                <X className="h-3.5 w-3.5 shrink-0 stroke-[2.5]" aria-hidden />
              ) : (
                <Check className="h-3.5 w-3.5 shrink-0 stroke-[2.5]" aria-hidden />
              )}
              <span>{t("verified.statusTag.manualLabel")}</span>
              <span className="opacity-55">·</span>
              <span>
                {selfManual.kind === "fail"
                  ? t("verified.statusTag.manual.fail", { passed: String(selfManual.gatesPassed), total: "5" })
                  : selfManual.kind === "pass_errors"
                    ? t("verified.statusTag.manual.passErrors", { passed: String(selfManual.gatesPassed), total: "5" })
                    : t("verified.statusTag.manual.pass", { passed: String(selfManual.gatesPassed), total: "5" })}
              </span>
            </span>
          ) : (
            <Badge className={cn("w-fit px-2.5 py-0.5 text-sm font-bold", TONE[level.tone])}>{level.label}</Badge>
          )}
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs sm:text-sm font-medium",
              isManual
                ? selfManual?.kind === "fail"
                  ? "border-amber-600/40 bg-amber-50/75 text-amber-900 dark:border-amber-500/40 dark:bg-amber-950/40 dark:text-amber-200"
                  : "border-indigo-600/40 bg-indigo-50/85 text-indigo-900 dark:border-indigo-500/45 dark:bg-indigo-950/50 dark:text-indigo-200"
                : "border-teal-600/40 bg-teal-50/70 text-teal-900 dark:border-teal-600/50 dark:bg-teal-950/40 dark:text-teal-200"
            )}
          >
            {isManual ? t("verified.mode.manualBadge") : t("verified.mode.autoBadge")}
          </span>
          {companionManual && manualNoteHref && (
            <Link
              href={manualNoteHref}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs sm:text-sm font-medium transition-colors hover:opacity-90",
                companionManual.kind === "fail"
                  ? "border-amber-600/40 bg-amber-50/85 text-amber-900 dark:border-amber-500/40 dark:bg-amber-950/40 dark:text-amber-200"
                  : "border-indigo-600/40 bg-indigo-50/85 text-indigo-900 dark:border-indigo-500/45 dark:bg-indigo-950/50 dark:text-indigo-200"
              )}
            >
              {companionManual.kind === "fail" ? (
                <X className="h-3 w-3 shrink-0 stroke-[2.5]" aria-hidden />
              ) : (
                <Check className="h-3 w-3 shrink-0 stroke-[2.5]" aria-hidden />
              )}
              <span>{t("verified.statusTag.manualLabel")}</span>
              <span className="opacity-55">·</span>
              <span>
                {companionManual.kind === "fail"
                  ? t("verified.statusTag.manual.fail", { passed: String(companionManual.gatesPassed), total: "5" })
                  : companionManual.kind === "pass_errors"
                    ? t("verified.statusTag.manual.passErrors", { passed: String(companionManual.gatesPassed), total: "5" })
                    : t("verified.statusTag.manual.pass", { passed: String(companionManual.gatesPassed), total: "5" })}
              </span>
            </Link>
          )}
          {panel && (
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs sm:text-sm text-muted-foreground">
              {t(`verified.panel.${panel}`)}
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {effectiveCiRun && (
            <a
              href={effectiveCiRun}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted"
            >
              <Play className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
              {t("verified.trial.runLink")}
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
            </a>
          )}
          {pdfUrl && (
            <a
              href={pdfUrl}
              download
              className="inline-flex items-center gap-1.5 rounded-md border border-teal-600/50 bg-teal-50/70 px-3 py-1.5 text-sm font-semibold text-teal-800 shadow-sm transition-colors hover:bg-teal-100/80 dark:bg-teal-950/40 dark:text-teal-300 dark:hover:bg-teal-950/70"
            >
              <FileDown className="h-4 w-4" />
              {t("verified.files.pdf")}
            </a>
          )}
        </div>
      </div>
      <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
        {title}
        {report.tool.version && (
          <span className="ml-3 align-middle text-xl sm:text-2xl font-semibold text-muted-foreground">{report.tool.version}</span>
        )}
      </h1>
      <p className="font-mono text-sm sm:text-base text-muted-foreground">{slug}</p>
      <KvTable rows={rows} labelWidth="11.5rem" />
    </div>
  );
}

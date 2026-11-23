"use client";

/**
 * Streamlined Manual Verification report components.
 *
 * Manual verification evaluates the upstream tool's unmodified code after
 * preparing the environment/dependencies/inputs that the automated profile
 * could not execute. Sections are concise and zero-redundancy:
 *   1. Execution on unmodified upstream code (+ gates & recorded terminal)
 *   2. Step-by-step reproducible setup / patch (copyable commands + optional fork)
 *   3. Concrete suggestions for the author
 *   4. Brief conclusion & scope
 */
import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, BookOpen, Check, Copy, ExternalLink, GitFork, GitPullRequest } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import type { VerifiedReport, VerifiedWorkaround } from "@/types/verified";
import { localizeVerdictReason } from "@/lib/verified/certificate";
import { type HistoryRow } from "@/lib/verified/history";
import { classifyManual } from "@/lib/verified/status-summary";
import { GUIDE_URL } from "@/lib/verified/step1";
import { cn } from "@/lib/utils";
import { rowHref } from "./history";

function isSafeHttpUrl(url: string | null | undefined): url is string {
  return Boolean(url && /^https?:\/\//i.test(url.trim()));
}

function CopyableCommandBlock({
  label,
  code,
}: {
  label: string;
  code: string;
}) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <p className="font-medium">{label}</p>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1 rounded border bg-background px-2 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {copied ? (
            <Check className="h-3 w-3 text-teal-600 dark:text-teal-400" aria-hidden />
          ) : (
            <Copy className="h-3 w-3" aria-hidden />
          )}
          <span>
            {copied
              ? t("verified.strhubDid.copiedCommand")
              : t("verified.strhubDid.copyCommand")}
          </span>
        </button>
      </div>
      <pre className="mt-1.5 overflow-x-auto rounded-md border bg-muted p-3 font-mono text-xs leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/**
 * Compact bar on an Automatic report page linking to the separate Manual report
 * without leaking manual status badges into the automatic report header.
 */
export function CompanionManualBanner({ row }: { row: HistoryRow }) {
  const { t } = useLanguage();
  return (
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-muted/30 px-4 py-3 text-sm">
      <p className="text-muted-foreground min-w-0 flex-1">
        <span className="font-semibold text-foreground">
          {t("verified.strhubDid.companionTitle")}
        </span>{" "}
        {t("verified.strhubDid.companionNeutralBody")}
      </p>
      <Link
        href={rowHref(row)}
        className="inline-flex items-center gap-1.5 rounded-md border bg-background px-3 py-1.5 text-xs sm:text-sm font-medium text-foreground transition-colors hover:bg-muted shrink-0"
      >
        <span>{t("verified.strhubDid.companionCta")}</span>
        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
      </Link>
    </div>
  );
}

/**
 * Compact bar on a Manual report page linking cleanly to the separate Automatic
 * report (plain button, no spoiler pill nested inside).
 */
export function NotDocumentedNotice({ documented }: { documented: HistoryRow | undefined }) {
  const { t } = useLanguage();
  return (
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-muted/30 px-4 py-3 text-sm">
      <p className="text-muted-foreground min-w-0 flex-1">
        <span className="font-semibold text-foreground">
          {t("verified.strhubDid.notice.title")}
        </span>{" "}
        {documented
          ? t("verified.strhubDid.notice.shortBody")
          : t("verified.strhubDid.notice.noDocumented")}
      </p>
      {documented && (
        <Link
          href={rowHref(documented)}
          className="inline-flex items-center gap-1.5 rounded-md border bg-background px-3 py-1.5 text-xs sm:text-sm font-medium text-foreground transition-colors hover:bg-muted shrink-0"
        >
          <span>{t("verified.strhubDid.notice.viewAutoReport")}</span>
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      )}
    </div>
  );
}

/** Fallback list only when a legacy manual report has workarounds but no structured steps. */
export function WorkaroundList({ items }: { items: VerifiedWorkaround[] | undefined }) {
  const { t } = useLanguage();
  if (!items?.length) {
    return <p className="text-sm italic text-muted-foreground">{t("verified.strhubDid.none")}</p>;
  }
  return (
    <ol className="divide-y rounded-md border bg-background/60 text-sm">
      {items.map((w, i) => (
        <li key={`${i}-${w.what}`} className="px-4 py-3">
          <p className="font-medium">{w.what}</p>
          <p className="mt-1 text-muted-foreground">
            <span className="font-medium text-foreground/80">{t("verified.strhubDid.insteadOf")}</span>{" "}
            {w.instead_of}
          </p>
          {w.why && (
            <p className="mt-1 text-muted-foreground">
              <span className="font-medium text-foreground/80">{t("verified.strhubDid.why")}</span>{" "}
              {w.why}
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}

/**
 * Section 1 context card on a Manual report: what environment was prepared
 * and the direct outcome on unmodified upstream code (followed immediately by
 * GatesLadder + RecordedTerminal evidence).
 */
export function ManualExecutionContext({ run }: { run: VerifiedReport }) {
  const { t } = useLanguage();
  const prep = run.preparation;
  const localizedReason = localizeVerdictReason(run.verdict?.reason, t);
  const manualSummary = classifyManual({
    level: run.level,
    verdict: run.verdict?.code,
    instrument: "curated",
  });
  const manualFailed = manualSummary?.kind === "fail";

  return (
    <div className="mt-3 space-y-3 rounded-lg border bg-card p-5 text-sm">
      {prep?.without_preparation && (
        <p className="text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">
            {t("verified.strhubDid.whyManualInline")}
          </span>{" "}
          {prep.without_preparation}
        </p>
      )}
      {prep?.base && (
        <p className="text-muted-foreground">
          <span className="font-semibold text-foreground">
            {t("verified.strhubDid.prepBaseLabel")}
          </span>{" "}
          {prep.base}
        </p>
      )}
      <div
        className={cn(
          "rounded-md border p-3.5",
          manualFailed
            ? "border-amber-500/45 bg-amber-50/60 dark:border-amber-600/45 dark:bg-amber-950/30"
            : "border-indigo-500/40 bg-indigo-50/50 dark:border-indigo-500/40 dark:bg-indigo-950/25",
        )}
      >
        <div className="flex items-start gap-2">
          {manualFailed ? (
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-400" aria-hidden />
          ) : (
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-700 dark:text-indigo-400" aria-hidden />
          )}
          <div className="space-y-1">
            <p className="font-semibold text-foreground">
              {manualFailed
                ? t("verified.strhubDid.upstreamFailedTitle")
                : t("verified.strhubDid.upstreamPassedTitle")}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {localizedReason ||
                (manualFailed
                  ? t("verified.strhubDid.upstreamFailedFallback")
                  : t("verified.strhubDid.upstreamPassedFallback"))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Section 2 on a Manual report: actionable step-by-step commands, adapted files,
 * and optional STRhub reproducibility fork/guide (zero repetition).
 */
export function ManualReproSteps({ run }: { run: VerifiedReport }) {
  const { t } = useLanguage();
  const prep = run.preparation;
  const items = run.recipe?.workarounds;
  const manualSummary = classifyManual({
    level: run.level,
    verdict: run.verdict?.code,
    instrument: "curated",
  });
  const manualFailed = manualSummary?.kind === "fail";

  const verifiedRunCmd = (
    prep?.run_cmd ??
    run.run?.effective_cmd ??
    run.run?.cmd ??
    ""
  ).trim();
  const prUrl = isSafeHttpUrl(prep?.pr_url) ? prep.pr_url.trim() : null;
  const forkUrl = isSafeHttpUrl(prep?.fork_url) ? prep.fork_url.trim() : null;
  const guideUrl = isSafeHttpUrl(prep?.guide_url) ? prep.guide_url.trim() : null;
  const fixNote = (prep?.proposed_fix_note ?? prep?.fork_note ?? "").trim();
  const hasStructuredSteps = Boolean(
    (prep?.steps && prep.steps.length > 0) || verifiedRunCmd || prUrl || forkUrl || guideUrl,
  );

  if (!hasStructuredSteps && !items?.length) return null;

  return (
    <div
      className={cn(
        "mt-3 space-y-4 rounded-lg border p-5 text-sm",
        manualFailed
          ? "border-indigo-500/35 bg-indigo-50/35 dark:border-indigo-500/35 dark:bg-indigo-950/20"
          : "bg-card",
      )}
    >
      {manualFailed && (
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-900 dark:text-indigo-200">
            {t("verified.strhubDid.reproPatchTitle")}
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {t("verified.strhubDid.reproPatchDisclaimer")}
          </p>
        </div>
      )}

      {prep?.steps && prep.steps.length > 0 && (
        <CopyableCommandBlock
          label={t("verified.strhubDid.prepStepsLabel")}
          code={prep.steps.join("\n")}
        />
      )}

      {verifiedRunCmd && (
        <CopyableCommandBlock
          label={t("verified.strhubDid.verifiedRunCmdLabel")}
          code={verifiedRunCmd}
        />
      )}

      {prep?.files && prep.files.length > 0 && (
        <div>
          <p className="font-medium">{t("verified.strhubDid.prepFilesLabel")}</p>
          <ul className="mt-1.5 list-disc space-y-1 pl-5 text-muted-foreground">
            {prep.files.map((f) => (
              <li key={f.path}>
                <code className="rounded bg-muted px-1 py-0.5 text-xs text-foreground">{f.path}</code>
                {f.replaces ? ` (${f.replaces})` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}

      {(prUrl || forkUrl || guideUrl) && (
        <div className="space-y-2 border-t pt-3">
          {fixNote && (
            <p className="text-sm text-foreground/90 leading-relaxed">{fixNote}</p>
          )}
          <div className="flex flex-wrap items-center gap-3">
            {prUrl && (
              <a
                href={prUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-indigo-600/45 bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                <GitPullRequest className="h-3.5 w-3.5" aria-hidden />
                {t("verified.strhubDid.openPrCta")}
                <ExternalLink className="h-3 w-3 opacity-80" aria-hidden />
              </a>
            )}
            {forkUrl && (
              <a
                href={forkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-indigo-600/40 bg-background px-3 py-1.5 text-xs font-semibold text-indigo-900 hover:bg-indigo-50 dark:border-indigo-500/40 dark:text-indigo-200 dark:hover:bg-indigo-950/60"
              >
                <GitFork className="h-3.5 w-3.5" aria-hidden />
                {t("verified.strhubDid.openForkCta")}
                <ExternalLink className="h-3 w-3 opacity-70" aria-hidden />
              </a>
            )}
            {guideUrl && (
              <a
                href={guideUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-indigo-600/40 bg-background px-3 py-1.5 text-xs font-semibold text-indigo-900 hover:bg-indigo-50 dark:border-indigo-500/40 dark:text-indigo-200 dark:hover:bg-indigo-950/60"
              >
                <BookOpen className="h-3.5 w-3.5" aria-hidden />
                {t("verified.strhubDid.openGuideCta")}
                <ExternalLink className="h-3 w-3 opacity-70" aria-hidden />
              </a>
            )}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {t("verified.strhubDid.forkAttribution")}
          </p>
        </div>
      )}

      {!hasStructuredSteps && items && items.length > 0 && (
        <WorkaroundList items={items} />
      )}
    </div>
  );
}

/**
 * Section 3 on a Manual report: concise, actionable recommendations for the author.
 */
export function ManualSuggestions({ run }: { run: VerifiedReport }) {
  const { t } = useLanguage();
  const suggestions: string[] = [
    ...(run.recommendations ?? []),
    ...(!run.recommendations?.length && run.preparation?.why?.length
      ? run.preparation.why
      : []),
  ];
  if (suggestions.length === 0) return null;

  return (
    <div className="mt-3 rounded-lg border border-teal-600/30 bg-teal-50/35 p-5 text-sm dark:border-teal-900/50 dark:bg-teal-950/20">
      <ul className="list-disc space-y-1.5 pl-5 leading-relaxed">
        {suggestions.map((s, idx) => (
          <li key={`${idx}-${s}`}>{s}</li>
        ))}
      </ul>
      <div className="mt-3">
        <Link
          href={GUIDE_URL}
          className="inline-flex items-center gap-1 text-xs font-semibold text-teal-800 hover:underline dark:text-teal-300"
        >
          {t("verified.strhubDid.viewRequirementsCta")} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

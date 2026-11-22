"use client";

/**
 * Manual verification report components.
 *
 * Manual verification evaluates the upstream tool's unmodified code after
 * preparing the environment/dependencies/inputs that the automated profile
 * could not execute:
 *   - Manual Verified: upstream code runs unmodified in the prepared environment.
 *   - Manual Fails: upstream code itself fails even after preparing the environment.
 *     When a community patch or reproducibility fork exists to work around the
 *     upstream code bug, it is shown in a clearly separated section that never
 *     marks the upstream commit as passing.
 */
import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, BookOpen, Check, Copy, ExternalLink, GitFork, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";
import type { VerifiedReport, VerifiedWorkaround } from "@/types/verified";
import { badgeFor, reachedLabel, TONE } from "@/lib/verified/badge";
import { localizeVerdictReason } from "@/lib/verified/certificate";
import { shortSha, versionLabel, type HistoryRow } from "@/lib/verified/history";
import { classifyManual } from "@/lib/verified/status-summary";
import { GUIDE_URL } from "@/lib/verified/step1";
import { cn } from "@/lib/utils";
import { useHeaded } from "./certificate";
import { rowHref } from "./history";

/** "v2.0 (dafdee7)", or just the commit when no version was recorded. */
function nameOf(row: HistoryRow): string {
  const label = versionLabel(row);
  return label === shortSha(row.sha) ? label : `${label} (${shortSha(row.sha)})`;
}

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
 * Compact banner shown on an Automatic report page when a separate Manual
 * verification report exists for the same tool/commit. Keeps both reports
 * cleanly separated while making the manual report one click away.
 */
export function CompanionManualBanner({ row }: { row: HistoryRow }) {
  const { t } = useLanguage();
  const manual = classifyManual(row);
  const failed = manual?.kind === "fail";
  const passed = String(manual?.gatesPassed ?? 0);

  return (
    <div
      className={cn(
        "mt-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4 text-sm",
        failed
          ? "border-amber-500/45 bg-amber-50/55 dark:border-amber-600/45 dark:bg-amber-950/25"
          : "border-indigo-500/45 bg-indigo-50/55 dark:border-indigo-500/40 dark:bg-indigo-950/25",
      )}
    >
      <div className="space-y-1 min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-semibold tabular-nums",
              failed
                ? "border-amber-600/40 bg-amber-50 text-amber-900 dark:border-amber-500/40 dark:bg-amber-950/60 dark:text-amber-200"
                : "border-indigo-600/40 bg-indigo-50 text-indigo-900 dark:border-indigo-500/40 dark:bg-indigo-950/60 dark:text-indigo-200",
            )}
          >
            {failed ? (
              <X className="h-3 w-3 shrink-0 stroke-[2.5]" aria-hidden />
            ) : (
              <Check className="h-3 w-3 shrink-0 stroke-[2.5]" aria-hidden />
            )}
            <span>{t("verified.statusTag.manualLabel")}</span>
            <span className="opacity-55">·</span>
            <span>
              {failed
                ? t("verified.statusTag.manual.fail", { passed, total: "5" })
                : manual?.kind === "pass_errors"
                  ? t("verified.statusTag.manual.passErrors", { passed, total: "5" })
                  : t("verified.statusTag.manual.pass", { passed, total: "5" })}
            </span>
          </span>
          <span className="font-semibold text-foreground">
            {t("verified.strhubDid.companionTitle")}
          </span>
        </div>
        <p className="text-muted-foreground">
          {failed
            ? t("verified.strhubDid.companionFailBody")
            : t("verified.strhubDid.companionPassBody")}
        </p>
      </div>
      <Link
        href={rowHref(row)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md border bg-background px-3 py-1.5 text-xs sm:text-sm font-semibold transition-colors shrink-0",
          failed
            ? "border-amber-600/45 text-amber-900 hover:bg-amber-100/70 dark:text-amber-200 dark:hover:bg-amber-950/60"
            : "border-indigo-600/45 text-indigo-900 hover:bg-indigo-100/70 dark:text-indigo-200 dark:hover:bg-indigo-950/60",
        )}
      >
        <span>{t("verified.strhubDid.companionCta")}</span>
        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
      </Link>
    </div>
  );
}

/**
 * Said first on the standalone Manual report page: this is an independent
 * manual evaluation, distinct from the automated run, with a direct button
 * back to the automated report.
 */
export function NotDocumentedNotice({ documented }: { documented: HistoryRow | undefined }) {
  const { t } = useLanguage();
  return (
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-muted/35 p-4 text-sm">
      <div className="min-w-0 flex-1 space-y-1">
        <p className="font-semibold text-foreground">{t("verified.strhubDid.notice.title")}</p>
        <p className="text-muted-foreground">{t("verified.strhubDid.notice.body")}</p>
        {!documented && (
          <p className="text-muted-foreground">{t("verified.strhubDid.notice.noDocumented")}</p>
        )}
      </div>
      {documented && (
        <Link
          href={rowHref(documented)}
          className="inline-flex items-center gap-1.5 rounded-md border bg-background px-3 py-1.5 text-xs sm:text-sm font-semibold text-foreground transition-colors hover:bg-muted shrink-0"
        >
          <span>{t("verified.strhubDid.notice.viewAutoReport")}</span>
          <Badge className={cn("ml-0.5 text-[10px]", TONE[badgeFor(documented, t).tone])}>
            {badgeFor(documented, t).label}
          </Badge>
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      )}
    </div>
  );
}

/** Each departure from the README, as data: what, instead of which documented step, why. */
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
 * Manual verification detail section, rendered on the standalone Manual report page.
 */
export function StrhubDidSection({ run, row }: { run: VerifiedReport; row?: HistoryRow }) {
  const { t } = useLanguage();
  const items = run.recipe?.workarounds;
  const prep = run.preparation;
  const reached = reachedLabel(run.level, t);
  const localizedReason = localizeVerdictReason(run.verdict?.reason, t);
  const manualSummary = classifyManual({
    level: run.level,
    verdict: run.verdict?.code,
    instrument: "curated",
  });
  const manualFailed = manualSummary?.kind === "fail";

  const whyItems: string[] = [
    ...(prep?.without_preparation ? [prep.without_preparation] : []),
    ...(prep?.why ?? []),
    ...(!prep?.why?.length && items?.length
      ? items.map((w) => (w.why ? `${w.instead_of}: ${w.why}` : w.instead_of)).filter(Boolean)
      : []),
  ];

  const suggestions: string[] = [
    ...(run.recommendations ?? []),
    ...(!run.recommendations?.length && items?.length
      ? items.map((w) => w.what).filter(Boolean)
      : []),
    ...(!run.recommendations?.length && !items?.length && prep?.why?.length
      ? prep.why
      : []),
  ];

  const verifiedRunCmd = (
    prep?.run_cmd ??
    run.run?.effective_cmd ??
    run.run?.cmd ??
    ""
  ).trim();
  const forkUrl = isSafeHttpUrl(prep?.fork_url) ? prep.fork_url.trim() : null;
  const guideUrl = isSafeHttpUrl(prep?.guide_url) ? prep.guide_url.trim() : null;
  const hasReproSteps = Boolean((prep?.steps && prep.steps.length > 0) || verifiedRunCmd || forkUrl || guideUrl);

  return (
    <>
      {!useHeaded() && <h2 className="mt-10 text-xl font-semibold">{t("verified.strhubDid.heading")}</h2>}
      <div className="mt-3 space-y-5 rounded-lg border bg-card p-5">
        <div>
          <p className="text-sm">
            {row ? t("verified.strhubDid.leadAt", { what: nameOf(row) }) : t("verified.strhubDid.lead")}
          </p>
          <p className="mt-1.5 text-sm text-muted-foreground">{t("verified.strhubDid.noLabelChange")}</p>
        </div>

        {/* Block 1: Why it went to manual review */}
        <div className="rounded-md border bg-muted/30 p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("verified.strhubDid.blockWhyTitle")}
          </h3>
          {whyItems.length > 0 ? (
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
              {whyItems.map((reason, idx) => (
                <li key={`${idx}-${reason}`}>{reason}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              {t("verified.strhubDid.blockWhyFallback")}
            </p>
          )}
        </div>

        {/* Block 2: Upstream manual result + actionable reproducible steps / patch */}
        <div className="rounded-md border bg-background/70 p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {manualFailed
              ? t("verified.strhubDid.blockWhatFailedTitle")
              : t("verified.strhubDid.blockWhatTitle")}
          </h3>

          {manualFailed && (
            <div className="mt-3 rounded-md border border-amber-500/45 bg-amber-50/60 p-3.5 text-sm dark:border-amber-600/45 dark:bg-amber-950/30">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-400" aria-hidden />
                <div className="space-y-1">
                  <p className="font-semibold text-amber-950 dark:text-amber-100">
                    {t("verified.strhubDid.upstreamFailedTitle")}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {localizedReason || t("verified.strhubDid.upstreamFailedFallback")}
                  </p>
                </div>
              </div>
            </div>
          )}

          {!manualFailed && (
            <p className="mt-1.5 text-sm text-muted-foreground">{t("verified.strhubDid.each")}</p>
          )}

          <div className="mt-4 space-y-4 text-sm">
            {prep?.base && (
              <p>
                <span className="font-medium">{t("verified.strhubDid.prepBaseLabel")}</span>{" "}
                <span className="text-muted-foreground">{prep.base}</span>
              </p>
            )}

            {hasReproSteps && (
              <div
                className={cn(
                  "space-y-4 rounded-md border p-4",
                  manualFailed
                    ? "border-indigo-500/35 bg-indigo-50/45 dark:border-indigo-500/35 dark:bg-indigo-950/25"
                    : "border-border bg-muted/20",
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
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-muted-foreground">
                      {prep.files.map((f) => (
                        <li key={f.path}>
                          <code className="rounded bg-muted px-1 py-0.5 text-xs">{f.path}</code>
                          {f.replaces ? ` (${f.replaces})` : ""}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {(forkUrl || guideUrl) && (
                  <div className="space-y-2 border-t pt-3">
                    {prep?.fork_note && (
                      <p className="text-sm text-foreground/90 leading-relaxed">{prep.fork_note}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-3">
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
              </div>
            )}

            {items && items.length > 0 ? (
              <WorkaroundList items={items} />
            ) : !prep && !verifiedRunCmd ? (
              <WorkaroundList items={items} />
            ) : null}
          </div>

          <div className="mt-4 border-t pt-3 text-sm">
            {t("verified.strhubDid.reached")}{" "}
            <Badge className={cn("align-middle text-[10px]", TONE[manualFailed ? "amber" : "green"])}>
              {reached}
            </Badge>
            {!manualFailed && localizedReason && (
              <span className="ml-2 text-muted-foreground">{localizedReason}</span>
            )}
          </div>
        </div>

        {/* Block 3: Suggestions to reach automated verification */}
        <div className="rounded-md border border-teal-600/30 bg-teal-50/40 p-4 dark:border-teal-900/50 dark:bg-teal-950/20">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-teal-900 dark:text-teal-200">
            {t("verified.strhubDid.blockSuggestionsTitle")}
          </h3>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {t("verified.strhubDid.recommendations")}
          </p>
          {suggestions.length > 0 && (
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
              {suggestions.map((s, idx) => (
                <li key={`${idx}-${s}`}>{s}</li>
              ))}
            </ul>
          )}
          <div className="mt-3">
            <Link
              href={GUIDE_URL}
              className="inline-flex items-center gap-1 text-xs font-semibold text-teal-800 hover:underline dark:text-teal-300"
            >
              {t("verified.strhubDid.viewRequirementsCta")} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {row && (
          <Link href={rowHref(row)} className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            {t("verified.strhubDid.readRun")} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </>
  );
}

"use client";

/**
 * Chapter two: what STRhub had to do to run this tool.
 *
 * The label says what happens to the tool as it is in its repository, and
 * nothing STRhub does by itself changes that: if it did, every first-time
 * user would have to repeat STRhub's work to find out. So a run of a recipe
 * STRhub wrote is told apart, after chapter one, as what STRhub had to do:
 * each departure from the README as data (what, instead of which documented
 * step, why), copyable commands so a third party can reproduce the setup,
 * an optional link to a STRhub reproducibility fork or guide with explicit
 * upstream attribution, and recommendations for the author.
 */
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Check, Copy, ExternalLink, GitFork } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";
import type { VerifiedReport, VerifiedWorkaround } from "@/types/verified";
import { badgeFor, reachedLabel, TONE } from "@/lib/verified/badge";
import { localizeVerdictReason } from "@/lib/verified/certificate";
import { shortSha, versionLabel, type HistoryRow } from "@/lib/verified/history";
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
 * Said first on the page of a run of STRhub's recipe: this is not the
 * documented result, and here is where that one is, or that there is none
 * yet, which is why this run is what the catalogue shows for the tool.
 */
export function NotDocumentedNotice({ documented }: { documented: HistoryRow | undefined }) {
  const { t } = useLanguage();
  return (
    <div className="mt-6 rounded-lg border border-indigo-400/50 bg-indigo-50/60 p-4 text-sm dark:border-indigo-700/60 dark:bg-indigo-950/25">
      <p className="font-semibold">{t("verified.strhubDid.notice.title")}</p>
      <p className="mt-1 text-muted-foreground">{t("verified.strhubDid.notice.body")}</p>
      {documented ? (
        <Link href={rowHref(documented)} className="mt-2 inline-flex items-center gap-1 font-medium text-primary hover:underline">
          {t("verified.strhubDid.notice.seeDocumented", { label: nameOf(documented) })}
          <Badge className={cn("ml-1 text-[10px]", TONE[badgeFor(documented, t).tone])}>{badgeFor(documented, t).label}</Badge>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      ) : (
        <p className="mt-2 text-muted-foreground">{t("verified.strhubDid.notice.noDocumented")}</p>
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
 * The chapter. `run` is the report of STRhub's run; `row` names it in the
 * history when it is another run than the page's (the note under a
 * documented result), and the chapter then links to it in full.
 */
export function StrhubDidSection({ run, row }: { run: VerifiedReport; row?: HistoryRow }) {
  const { t } = useLanguage();
  const items = run.recipe?.workarounds;
  const prep = run.preparation;
  const reached = reachedLabel(run.level, t);
  const localizedReason = localizeVerdictReason(run.verdict?.reason, t);

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

        {/* Block 2: Actionable reproducible steps & commands */}
        <div className="rounded-md border bg-background/70 p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("verified.strhubDid.blockWhatTitle")}
          </h3>
          <p className="mt-1.5 text-sm text-muted-foreground">{t("verified.strhubDid.each")}</p>
          <div className="mt-3 space-y-4 text-sm">
            {prep?.base && (
              <p>
                <span className="font-medium">{t("verified.strhubDid.prepBaseLabel")}</span>{" "}
                <span className="text-muted-foreground">{prep.base}</span>
              </p>
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
              <div className="rounded-md border border-indigo-500/35 bg-indigo-50/60 p-3.5 dark:border-indigo-500/35 dark:bg-indigo-950/30">
                <p className="font-semibold text-indigo-950 dark:text-indigo-100">
                  {t("verified.strhubDid.reproResourceTitle")}
                </p>
                {prep?.fork_note && (
                  <p className="mt-1 text-sm text-muted-foreground">{prep.fork_note}</p>
                )}
                <div className="mt-2.5 flex flex-wrap items-center gap-3">
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
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  {t("verified.strhubDid.forkAttribution")}
                </p>
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
            <Badge className={cn("align-middle text-[10px]", TONE[run.level === "io" || run.level === "content" ? "green" : "amber"])}>
              {reached}
            </Badge>
            {localizedReason && <span className="ml-2 text-muted-foreground">{localizedReason}</span>}
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

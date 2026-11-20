"use client";

/**
 * Chapter two: what STRhub had to do to run this tool.
 *
 * The label says what happens to the tool as it is in its repository, and
 * nothing STRhub does by itself changes that: if it did, every first-time
 * user would have to repeat STRhub's work to find out. So a run of a recipe
 * STRhub wrote is told apart, after chapter one, as what STRhub had to do —
 * each departure from the README as data (what, instead of which documented
 * step, why), which is the list of recommendations to the author — and how
 * far that got. On the page of such a run it comes first, and the run
 * follows in full, under a notice that this is not the documented result.
 */
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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

/**
 * Said first on the page of a run of STRhub's recipe: this is not the
 * documented result, and here is where that one is — or that there is none
 * yet, which is why this run is what the catalogue shows for the tool.
 */
export function NotDocumentedNotice({ documented }: { documented: HistoryRow | undefined }) {
  const { t } = useLanguage();
  return (
    <div className="mt-6 rounded-lg border border-amber-300 bg-amber-50/60 p-4 text-sm dark:border-amber-800 dark:bg-amber-950/20">
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

        {/* Block 2: What STRhub had to do to run it */}
        <div className="rounded-md border bg-background/70 p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("verified.strhubDid.blockWhatTitle")}
          </h3>
          <p className="mt-1.5 text-sm text-muted-foreground">{t("verified.strhubDid.each")}</p>
          {prep ? (
            <div className="mt-3 space-y-3 text-sm">
              {prep.base && (
                <p>
                  <span className="font-medium">{t("verified.strhubDid.prepBaseLabel")}</span>{" "}
                  <span className="text-muted-foreground">{prep.base}</span>
                </p>
              )}
              {prep.steps && prep.steps.length > 0 && (
                <div>
                  <p className="font-medium">{t("verified.strhubDid.prepStepsLabel")}</p>
                  <pre className="mt-1.5 overflow-x-auto rounded-md border bg-muted p-3 font-mono text-xs">
                    <code>{prep.steps.join("\n")}</code>
                  </pre>
                </div>
              )}
              {prep.files && prep.files.length > 0 && (
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
              {items && items.length > 0 && <WorkaroundList items={items} />}
            </div>
          ) : (
            <div className="mt-3">
              <WorkaroundList items={items} />
            </div>
          )}
          <div className="mt-3 border-t pt-3 text-sm">
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

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
import { shortSha, versionLabel, type HistoryRow } from "@/lib/verified/history";
import { cn } from "@/lib/utils";
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
  const reached = reachedLabel(run.level);
  return (
    <>
      <h2 className="mt-10 text-xl font-semibold">{t("verified.strhubDid.heading")}</h2>
      <div className="mt-3 rounded-lg border border-amber-300/70 bg-amber-50/40 p-4 dark:border-amber-800/70 dark:bg-amber-950/10">
        <p className="text-sm">
          {row ? t("verified.strhubDid.leadAt", { what: nameOf(row) }) : t("verified.strhubDid.lead")}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">{t("verified.strhubDid.each")}</p>
        <div className="mt-3">
          <WorkaroundList items={items} />
        </div>
        <p className="mt-3 text-sm">
          {t("verified.strhubDid.reached")}{" "}
          <Badge className={cn("align-middle text-[10px]", TONE[run.level === "io" || run.level === "content" ? "green" : "amber"])}>{reached}</Badge>
          {run.verdict?.reason && <span className="ml-2 text-muted-foreground">{run.verdict.reason}</span>}
        </p>
        {!!items?.length && (
          <p className="mt-3 text-sm text-muted-foreground">{t("verified.strhubDid.recommendations")}</p>
        )}
        <p className="mt-3 text-sm text-muted-foreground">{t("verified.strhubDid.noLabelChange")}</p>
        {row && (
          <Link href={rowHref(row)} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            {t("verified.strhubDid.readRun")} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </>
  );
}

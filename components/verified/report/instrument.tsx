"use client";

/**
 * The instrument, on the page.
 *
 * The badge says "installs and runs from its public source at the pinned
 * commit". A recipe STRhub wrote by hand cannot hold that up, whatever it
 * achieved: it shows how far the tool can be MADE to run, which is STRhub's
 * work. So a page of such a run says so before anything else, lists what the
 * recipe does that the README does not (each item a recommendation to the
 * author), and points at the documented result; and the documented page
 * carries that run as a note under its own result, never in its place.
 */
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";
import type { VerifiedInstrument, VerifiedReport, VerifiedWorkaround } from "@/types/verified";
import { badgeFor, TONE } from "@/lib/verified/badge";
import { shortSha, versionLabel, type HistoryRow } from "@/lib/verified/history";
import { cn } from "@/lib/utils";
import { rowHref } from "./history";

/** A small tag naming the instrument of one run, on a row or a card. */
export function InstrumentTag({
  instrument,
  className,
}: {
  instrument: VerifiedInstrument | null | undefined;
  className?: string;
}) {
  const { t } = useLanguage();
  if (!instrument) return null;
  return (
    <span
      className={cn(
        "rounded-full border px-1.5 text-[10px]",
        instrument === "curated"
          ? "border-amber-400 text-amber-700 dark:border-amber-700 dark:text-amber-500"
          : "text-muted-foreground",
        className,
      )}
    >
      {t(`verified.instrument.tag.${instrument}`)}
    </span>
  );
}

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
export function InstrumentNotice({ documented }: { documented: HistoryRow | undefined }) {
  const { t } = useLanguage();
  return (
    <div className="mt-6 rounded-lg border border-amber-300 bg-amber-50/60 p-4 text-sm dark:border-amber-800 dark:bg-amber-950/20">
      <p className="font-semibold">{t("verified.instrument.notice.title")}</p>
      <p className="mt-1 text-muted-foreground">{t("verified.instrument.notice.body")}</p>
      {documented ? (
        <Link href={rowHref(documented)} className="mt-2 inline-flex items-center gap-1 font-medium text-primary hover:underline">
          {t("verified.instrument.notice.seeDocumented", { label: nameOf(documented) })}
          <Badge className={cn("ml-1 text-[10px]", TONE[badgeFor(documented, t).tone])}>{badgeFor(documented, t).label}</Badge>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      ) : (
        <p className="mt-2 text-muted-foreground">{t("verified.instrument.notice.noDocumented")}</p>
      )}
    </div>
  );
}

/**
 * Each departure from the README, as data: what the recipe does, instead of
 * which documented step, and why. The same list is the recommendations to
 * the author — what the README would have to say, or the repository ship,
 * for a first-time user to get where the recipe got.
 */
export function WorkaroundList({ items }: { items: VerifiedWorkaround[] | undefined }) {
  const { t } = useLanguage();
  if (!items?.length) {
    return <p className="text-sm italic text-muted-foreground">{t("verified.instrument.workarounds.none")}</p>;
  }
  return (
    <ol className="divide-y rounded-md border text-sm">
      {items.map((w, i) => (
        <li key={`${i}-${w.what}`} className="px-4 py-3">
          <p className="font-medium">{w.what}</p>
          <p className="mt-1 text-muted-foreground">
            <span className="font-medium text-foreground/80">{t("verified.instrument.workarounds.insteadOf")}</span>{" "}
            {w.instead_of}
          </p>
          {w.why && (
            <p className="mt-1 text-muted-foreground">
              <span className="font-medium text-foreground/80">{t("verified.instrument.workarounds.why")}</span>{" "}
              {w.why}
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}

/** Section 2 of a curated report: what STRhub's recipe does, and the recommendations it amounts to. */
export function WorkaroundsSection({ report }: { report: VerifiedReport }) {
  const { t } = useLanguage();
  return (
    <>
      <h2 className="mt-10 text-xl font-semibold">{t("verified.instrument.workarounds.heading")}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{t("verified.instrument.workarounds.lead")}</p>
      <div className="mt-3">
        <WorkaroundList items={report.recipe?.workarounds} />
      </div>
      {!!report.recipe?.workarounds?.length && (
        <p className="mt-3 text-sm text-muted-foreground">{t("verified.instrument.workarounds.recommendations")}</p>
      )}
    </>
  );
}

/**
 * On the documented page: the note. How far STRhub's own recipe got, at
 * which commit, what it had to do, and where to read that run whole. Under
 * the documented result, labelled as STRhub's work.
 */
export function CuratedNoteSection({ note }: { note: { row: HistoryRow; report: VerifiedReport } }) {
  const { t } = useLanguage();
  const level = badgeFor(note.row, t);
  return (
    <>
      <h2 className="mt-10 text-xl font-semibold">{t("verified.instrument.note.heading")}</h2>
      <div className="mt-3 rounded-lg border border-amber-300/70 bg-amber-50/40 p-4 dark:border-amber-800/70 dark:bg-amber-950/10">
        <p className="text-sm">
          {t("verified.instrument.note.body", { what: nameOf(note.row) })}{" "}
          <Badge className={cn("align-middle text-[10px]", TONE[level.tone])}>{level.label}</Badge>
        </p>
        <p className="mt-2 text-sm text-muted-foreground">{t("verified.instrument.workarounds.lead")}</p>
        <div className="mt-3">
          <WorkaroundList items={note.report.recipe?.workarounds} />
        </div>
        {!!note.report.recipe?.workarounds?.length && (
          <p className="mt-3 text-sm text-muted-foreground">{t("verified.instrument.workarounds.recommendations")}</p>
        )}
        <Link href={rowHref(note.row)} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
          {t("verified.instrument.note.cta")} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </>
  );
}

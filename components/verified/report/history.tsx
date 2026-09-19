"use client";

/**
 * A tool's history on its page: every commit it was verified at, newest commit
 * first, the one being read marked.
 *
 * Two clocks on every row, labelled: the commit's own date, which orders the
 * list, and the verification date. A reviewer holding a manuscript finds the
 * version it cites; a maintainer sees whether the commit before the fix
 * stopped where the user said and whether the one after still does. Before
 * this the same runs were a card's "6 verification runs", sorted by level.
 */
import Link from "next/link";
import { ArrowRight, GitCommitHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";
import type { VerifiedInstrument } from "@/types/verified";
import { badgeFor, reachedLabel, TONE } from "@/lib/verified/badge";
import { foldStrhubRuns, shortSha, versionLabel, type HistoryRow } from "@/lib/verified/history";
import { cn } from "@/lib/utils";

function panelKey(types: string[]): "ystr" | "ont" | "autosomal" | null {
  if (types.length === 0) return null;
  if (types.some((t) => t.endsWith("-y"))) return "ystr";
  if (types.some((t) => t.includes("ont"))) return "ont";
  return "autosomal";
}

/**
 * Where a row is read: its slug's page, with `?at=` unless it is the slug's
 * alias — and, for a run of STRhub's recipe, `&recipe=curated`, since the
 * same commit may also carry the documented run, which `?at=` alone names.
 */
export function rowHref(row: HistoryRow): string {
  if (row.isAlias) return `/verified/${row.slug}`;
  const recipe = row.instrument === "curated" ? "&recipe=curated" : "";
  return `/verified/${row.slug}?at=${shortSha(row.sha)}${recipe}`;
}

/** The form, with this repository already pasted and the commit field next. */
export function anotherVersionHref(repo: string): string {
  return `/verified/review?repo=${encodeURIComponent(repo)}`;
}

export function VersionHistory({
  rows,
  current,
  repo,
}: {
  rows: HistoryRow[];
  /** The run this page shows: (slug, sha, instrument). */
  current: { slug: string; sha: string | null; instrument?: VerifiedInstrument | null };
  repo: string;
}) {
  const { t } = useLanguage();
  if (rows.length === 0) return null;
  return (
    <div className="mt-6 rounded-lg border bg-card p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {t("verified.history.heading")}
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">{t("verified.history.note")}</p>
      {rows.length > 1 && (
        <ol className="mt-3 divide-y rounded-md border">
          {foldStrhubRuns(rows).map(({ row, strhub }) => {
            const isCurrent = row.slug === current.slug && row.sha === current.sha
              && (row.instrument ?? null) === (current.instrument ?? null);
            const level = badgeFor(row, t);
            const panel = panelKey(row.dataset_types);
            const inner = (
              <>
                <GitCommitHorizontal className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-medium">{versionLabel(row)}</span>
                    <code className="rounded bg-muted px-1 text-xs">{shortSha(row.sha)}</code>
                    {row.committed && (
                      <span className="text-xs text-muted-foreground">{row.committed.slice(0, 10)}</span>
                    )}
                    {panel && (
                      <span className="rounded-full border px-1.5 text-[10px] text-muted-foreground">{t(`verified.panel.${panel}`)}</span>
                    )}
                    {row.isNewest && row.instrument !== "curated" && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">{t("verified.history.newest")}</span>
                    )}
                    {isCurrent && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{t("verified.history.thisPage")}</span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {row.generated
                      ? t("verified.history.verifiedOn", { date: row.generated.slice(0, 10) })
                      : ""}
                  </p>
                </div>
                <Badge className={cn("shrink-0 text-[10px]", TONE[level.tone])}>{level.label}</Badge>
              </>
            );
            const cls = cn(
              "flex items-center gap-3 px-3 py-2 text-sm",
              isCurrent ? "bg-muted/60" : "hover:bg-muted/40",
            );
            // The run of STRhub's recipe at this commit: an annotation of the
            // row, never a row beside it, linked to that run in full.
            const strhubIsCurrent = !!strhub && strhub.slug === current.slug && strhub.sha === current.sha
              && current.instrument === "curated";
            return (
              <li key={`${row.slug}-${row.sha}-${row.instrument ?? ""}`}>
                {isCurrent ? (
                  <div className={cls} aria-current="page">{inner}</div>
                ) : (
                  <Link href={rowHref(row)} className={cls}>{inner}</Link>
                )}
                {strhub && (
                  <Link
                    href={rowHref(strhub)}
                    className={cn("flex items-center gap-2 px-3 pb-2 pl-10 text-xs text-muted-foreground hover:text-primary", strhubIsCurrent && "bg-muted/60")}
                    aria-current={strhubIsCurrent ? "page" : undefined}
                  >
                    <span>{t("verified.strhubDid.rowNote", { label: reachedLabel(strhub.level) })}</span>
                    {strhubIsCurrent && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider">{t("verified.history.thisPage")}</span>
                    )}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      )}
      <p className="mt-3 text-sm">
        <Link href={anotherVersionHref(repo)} className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
          {t("verified.history.another")} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <span className="ml-2 text-xs text-muted-foreground">{t("verified.history.anotherHint")}</span>
      </p>
    </div>
  );
}

/** "v0.7 (b2033bf)", or just the commit when no version was recorded. */
function nameOf(row: HistoryRow): string {
  const label = versionLabel(row);
  return label === shortSha(row.sha) ? label : `${label} (${shortSha(row.sha)})`;
}

/**
 * Said before anything else when the page is an older commit: a result read
 * out of its place in the history is the one thing this page must not let a
 * reader take for the current one.
 */
export function OlderVersionNotice({ current, newest }: { current: HistoryRow; newest: HistoryRow }) {
  const { t } = useLanguage();
  const sha = shortSha(current.sha);
  const label = versionLabel(current);
  // "commit b2033bf, made 2019-09-04", or without the date when it is not
  // known (a report from before it was recorded); with the version in front
  // when the report recorded one.
  const commit = current.committed
    ? t("verified.history.older.commitMade", { sha, committed: current.committed.slice(0, 10) })
    : t("verified.history.older.commit", { sha });
  const what = label === sha ? commit : `${label} — ${commit}`;
  return (
    <div className="mt-6 rounded-lg border border-amber-300 bg-amber-50/60 p-4 text-sm dark:border-amber-800 dark:bg-amber-950/20">
      <p className="font-semibold">{t("verified.history.older.title")}</p>
      <p className="mt-1 text-muted-foreground">
        {t("verified.history.older.body", { what, newest: nameOf(newest) })}
      </p>
      <Link href={rowHref(newest)} className="mt-2 inline-flex items-center gap-1 font-medium text-primary hover:underline">
        {t("verified.history.older.cta")} <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

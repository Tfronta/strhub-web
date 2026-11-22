"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, ExternalLink, Search, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import { PageTitle } from "@/components/page-title";
import type { VerifiedIndex, VerifiedIndexEntry } from "@/types/verified";
import { cn } from "@/lib/utils";
import { badgeFor, reachedLabel, TONE } from "@/lib/verified/badge";
import {
  curatedNoteOf,
  foldStrhubRuns,
  headOf,
  historyOf,
  rowHref,
  shortSha,
  versionLabel,
  type HistoryRow,
} from "@/lib/verified/history";
import { mayStandBehindBadge } from "@/lib/verified/instrument";
import { formatDate } from "@/lib/verified/format-date";
import { panelKind } from "@/lib/verified/dataset-provenance";
import { GUIDE_URL } from "@/lib/verified/step1";
import {
  matchesCatalogFilter,
  rankToolGroup,
  type CatalogFilter,
} from "@/lib/verified/status-summary";
import { VerificationStatusTags } from "./status-tags";

function getPanelLabel(
  translate: (k: string) => string,
  types: string[] | null | undefined,
): string | null {
  const panel = panelKind(types);
  return panel ? translate(`verified.panel.${panel}`) : null;
}

interface ToolGroup {
  name: string;
  repo: string;
  head: HistoryRow;
  autoRow: HistoryRow | undefined;
  manualRow: HistoryRow | undefined;
  rows: HistoryRow[];
}

function groupTools(entries: VerifiedIndexEntry[]): ToolGroup[] {
  const byRepo = new Map<string, VerifiedIndexEntry[]>();
  for (const entry of entries) {
    if (!entry.source_repo) continue;
    const key = entry.source_repo.replace(/\/+$/, "");
    const arr = byRepo.get(key);
    if (arr) arr.push(entry);
    else byRepo.set(key, [entry]);
  }

  const groups: ToolGroup[] = [];
  for (const [repo, tools] of byRepo) {
    const rows = historyOf(tools);
    const head = headOf(rows);
    if (!head) continue;
    const live = rows.filter((r) => !r.retired);
    const autoRow = live.find((r) => mayStandBehindBadge(r.instrument));
    const manualRow = curatedNoteOf(rows);
    groups.push({
      name: repo.split("/").pop() || tools[0].name,
      repo,
      head,
      autoRow,
      manualRow,
      rows,
    });
  }

  groups.sort(
    (a, b) =>
      rankToolGroup(b.autoRow, b.manualRow) -
        rankToolGroup(a.autoRow, a.manualRow) ||
      a.name.localeCompare(b.name),
  );
  return groups;
}

export function VerifiedList({ index }: { index: VerifiedIndex }) {
  const { t, language } = useLanguage();
  const reviews = useMemo(
    () => index.tools.filter((entry) => entry.record_type === "editorial_review"),
    [index.tools],
  );
  const groups = useMemo(
    () =>
      groupTools(
        index.tools.filter((entry) => entry.record_type !== "editorial_review"),
      ),
    [index.tools],
  );
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<CatalogFilter>("all");

  const filterCounts = useMemo(() => {
    const counts: Record<CatalogFilter, number> = {
      all: groups.length,
      verified: 0,
      auto: 0,
      manual: 0,
      fail: 0,
      undetermined: 0,
    };
    for (const g of groups) {
      if (matchesCatalogFilter("verified", g.autoRow, g.manualRow)) counts.verified++;
      if (matchesCatalogFilter("auto", g.autoRow, g.manualRow)) counts.auto++;
      if (matchesCatalogFilter("manual", g.autoRow, g.manualRow)) counts.manual++;
      if (matchesCatalogFilter("fail", g.autoRow, g.manualRow)) counts.fail++;
      if (matchesCatalogFilter("undetermined", g.autoRow, g.manualRow)) counts.undetermined++;
    }
    return counts;
  }, [groups]);

  const filterChips: CatalogFilter[] = useMemo(() => {
    const base: CatalogFilter[] = ["all", "verified", "auto", "manual"];
    if (filterCounts.fail > 0) base.push("fail");
    base.push("undetermined");
    return base;
  }, [filterCounts.fail]);

  const filteredGroups = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return groups.filter((g) => {
      if (!matchesCatalogFilter(filter, g.autoRow, g.manualRow)) return false;
      if (!needle) return true;
      if (g.name.toLowerCase().includes(needle)) return true;
      if (g.repo.toLowerCase().includes(needle)) return true;
      return g.rows.some(
        (r) =>
          (r.version ?? "").toLowerCase().includes(needle) ||
          (r.sha ?? "").toLowerCase().includes(needle),
      );
    });
  }, [groups, filter, query]);

  const showReviews =
    reviews.length > 0 &&
    filter === "all" &&
    (!query.trim() ||
      reviews.some((r) =>
        r.name.toLowerCase().includes(query.trim().toLowerCase()),
      ));

  const visibleReviews = useMemo(() => {
    if (!showReviews) return [];
    const needle = query.trim().toLowerCase();
    if (!needle) return reviews;
    return reviews.filter((r) => r.name.toLowerCase().includes(needle));
  }, [reviews, showReviews, query]);

  function toggle(repo: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(repo)) next.delete(repo);
      else next.add(repo);
      return next;
    });
  }

  return (
    <div className="flex flex-col min-h-[60vh]">
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex flex-col gap-4">
          <PageTitle
            title={t("verified.title")}
            description={
              <>
                {t("verified.descriptionBeforeLink")}
                <Link
                  href={GUIDE_URL}
                  className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  {t("verified.descriptionLinkLabel")}
                </Link>
                {t("verified.descriptionMiddle")}
                <strong className="font-semibold text-foreground">
                  {t("verified.descriptionBold")}
                </strong>
                {t("verified.descriptionAfterBold")}
              </>
            }
          />
          <p className="text-sm font-medium text-foreground/90">
            {t("verified.requirementsHint")}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/verified/submit"
              className="shrink-0 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              {t("verified.submit.cta")}
            </Link>
            <Link
              href={GUIDE_URL}
              className="shrink-0 inline-flex items-center gap-1.5 rounded-md border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              {t("verified.requirementsCta")}
            </Link>
          </div>
        </div>

        {groups.length === 0 && reviews.length === 0 ? (
          <p className="mt-8 text-muted-foreground">{t("verified.empty")}</p>
        ) : (
          <>
            {groups.length > 0 && (
              <div className="mt-8 flex flex-col gap-3">
                <div className="relative max-w-md">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                  />
                  <Input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t("verified.catalog.searchPlaceholder")}
                    aria-label={t("verified.catalog.searchPlaceholder")}
                    className="pl-9 pr-8"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      aria-label={t("verified.catalog.clearFilters")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <div
                  className="flex flex-wrap items-center gap-2"
                  role="tablist"
                  aria-label={t("verified.catalog.filterAria")}
                >
                  {filterChips.map((chip) => {
                    const active = filter === chip;
                    return (
                      <button
                        key={chip}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setFilter(chip)}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                          active
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
                      >
                        <span>{t(`verified.catalog.filter.${chip}`)}</span>
                        <span
                          className={cn(
                            "rounded-full px-1.5 py-0 text-[10px] tabular-nums",
                            active
                              ? "bg-primary-foreground/20 text-primary-foreground"
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          {filterCounts[chip]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {filteredGroups.length === 0 && visibleReviews.length === 0 ? (
              <div className="mt-8 rounded-lg border border-dashed p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  {t("verified.catalog.noMatches")}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => {
                    setQuery("");
                    setFilter("all");
                  }}
                >
                  {t("verified.catalog.clearFilters")}
                </Button>
              </div>
            ) : (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {visibleReviews.map((entry) => (
                  <Card key={entry.slug}>
                    <CardHeader>
                      <Badge className={cn("w-fit", TONE.grey)}>
                        {t("verified.evidenceReview.title")}
                      </Badge>
                      <CardTitle>{entry.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {t("verified.evidenceReview.kind")}
                      </p>
                      <Link
                        className="text-primary underline"
                        href={`/verified/${entry.slug}`}
                      >
                        {t("verified.evidenceReview.open")}
                      </Link>
                    </CardContent>
                  </Card>
                ))}
                {filteredGroups.map((group) => {
                  const isOpen = expanded.has(group.repo);

                  return (
                    <Card
                      key={group.repo}
                      className="flex flex-col justify-between h-full"
                    >
                      <CardHeader
                        className="flex-1 flex flex-col justify-between cursor-pointer select-none space-y-3"
                        onClick={() => toggle(group.repo)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-2 min-w-0 flex-1">
                            <div className="min-h-[3.25rem]">
                              <VerificationStatusTags
                                autoRow={group.autoRow}
                                manualRow={group.manualRow}
                                size="sm"
                              />
                            </div>
                            <CardTitle className="text-lg truncate">
                              {group.name}
                            </CardTitle>
                          </div>
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 shrink-0 text-muted-foreground transition-transform mt-1",
                              isOpen && "rotate-180",
                            )}
                          />
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                          <a
                            href={group.repo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 hover:text-primary truncate"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="truncate">
                              {group.repo.replace("https://github.com/", "")}
                            </span>
                            <ExternalLink className="h-3 w-3 shrink-0" />
                          </a>
                          <span className="text-muted-foreground/60 shrink-0">
                            {group.rows.length === 1
                              ? t("verified.group.commitSingular")
                              : t("verified.group.commits", {
                                  n: String(group.rows.length),
                                })}
                          </span>
                        </div>
                      </CardHeader>

                      {isOpen && (
                        <CardContent className="pt-0">
                          <div className="space-y-1.5 border-t pt-3 max-h-[280px] overflow-y-auto">
                            {foldStrhubRuns(group.rows).map(({ row, strhub }) => {
                              const rowLevel = badgeFor(row, t);
                              const panelLabel = getPanelLabel(
                                t,
                                row.dataset_types,
                              );
                              const rowIsManual = row.instrument === "curated";
                              return (
                                <div
                                  key={`${row.slug}-${row.sha}-${row.instrument ?? ""}`}
                                  className="rounded-md border transition-colors hover:border-primary"
                                >
                                  <Link
                                    href={rowHref(row)}
                                    className="block px-3 py-2 hover:bg-muted/50"
                                  >
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <Badge
                                        variant="outline"
                                        className={cn(
                                          "text-[10px] px-1.5 py-0 shrink-0",
                                          TONE[rowLevel.tone],
                                        )}
                                      >
                                        {rowLevel.label}
                                      </Badge>
                                      <span
                                        className={cn(
                                          "text-[10px] rounded border px-1.5 py-0 font-medium shrink-0",
                                          rowIsManual
                                            ? "border-indigo-600/40 bg-indigo-50/80 text-indigo-900 dark:border-indigo-500/40 dark:bg-indigo-950/50 dark:text-indigo-200"
                                            : "border-teal-600/40 bg-teal-50/70 text-teal-900 dark:border-teal-600/50 dark:bg-teal-950/40 dark:text-teal-200",
                                        )}
                                      >
                                        {rowIsManual
                                          ? t("verified.mode.manualShort")
                                          : t("verified.mode.autoShort")}
                                      </span>
                                      <span className="text-xs font-medium">
                                        {versionLabel(row)}
                                      </span>
                                      <code className="rounded bg-muted px-1 text-[10px] text-muted-foreground">
                                        {shortSha(row.sha)}
                                      </code>
                                      {panelLabel && (
                                        <span className="text-[10px] border rounded px-1.5 py-0 text-muted-foreground shrink-0">
                                          {panelLabel}
                                        </span>
                                      )}
                                    </div>
                                    {row.generated && (
                                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                                        {t("verified.history.verifiedOn", {
                                          date: formatDate(
                                            row.generated,
                                            language,
                                          ),
                                        })}
                                      </p>
                                    )}
                                  </Link>
                                  {strhub && (
                                    <Link
                                      href={rowHref(strhub)}
                                      className="flex items-center gap-1.5 border-t px-3 py-1.5 text-[10px] text-muted-foreground hover:bg-muted/50 hover:text-primary"
                                    >
                                      <span className="rounded border border-indigo-600/40 bg-indigo-50/80 px-1.5 py-0 font-medium text-indigo-900 dark:border-indigo-500/40 dark:bg-indigo-950/50 dark:text-indigo-200 shrink-0">
                                        {t("verified.mode.manualShort")}
                                      </span>
                                      <span>
                                        {t("verified.strhubDid.rowNote", {
                                          label: reachedLabel(strhub.level, t),
                                        })}
                                      </span>
                                    </Link>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}

        <p className="mt-10 text-xs text-muted-foreground">
          {t("verified.disclaimer")}
        </p>
      </div>
    </div>
  );
}

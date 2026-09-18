"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";
import { PageTitle } from "@/components/page-title";
import {
  VERIFIED_LEVELS,
  type VerifiedIndex,
  type VerifiedIndexEntry,
  type VerifiedLevel,
} from "@/types/verified";
import { cn } from "@/lib/utils";
import { errorAwareLevel } from "@/lib/verified/diagnostics";
import { historyOf, shortSha, versionLabel, type HistoryRow } from "@/lib/verified/history";
import { rowHref } from "./report/history";

const TONE: Record<string, string> = {
  green: "bg-teal-600 text-white border-transparent",
  amber: "bg-amber-500 text-white border-transparent",
  red: "bg-red-600 text-white border-transparent",
};

function getPanelLabel(
  translate: (k: string) => string,
  types: string[] | null | undefined
): string | null {
  if (!types || types.length === 0) return null;
  if (types.some((t) => t.endsWith("-y"))) return translate("verified.panel.ystr");
  return translate("verified.panel.autosomal");
}

const LEVEL_RANK: Record<VerifiedLevel, number> = {
  none: 0,
  available: 1,
  installs: 2,
  runs: 3,
  io: 4,
  content: 5,
};

/**
 * One card per repository, and on it the tool's history: every commit
 * verified, newest commit first. The badge is the newest commit's — what the
 * tool is at today, not the best result any commit ever got.
 */
interface ToolGroup {
  name: string;
  repo: string;
  head: HistoryRow;
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
    if (rows.length === 0) continue;
    groups.push({
      name: repo.split("/").pop() || tools[0].name,
      repo,
      head: rows[0],
      rows,
    });
  }

  groups.sort(
    (a, b) => LEVEL_RANK[b.head.level] - LEVEL_RANK[a.head.level] || a.name.localeCompare(b.name)
  );
  return groups;
}

export function VerifiedList({ index }: { index: VerifiedIndex }) {
  const { t } = useLanguage();
  const groups = groupTools(index.tools);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

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
        <div className="flex flex-wrap items-start justify-between gap-4">
          <PageTitle
            title={t("verified.title")}
            description={t("verified.description")}
          />
          <Link
            href="/verified/submit"
            className="shrink-0 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            {t("verified.submit.cta")}
          </Link>
        </div>

        {groups.length === 0 ? (
          <p className="mt-8 text-muted-foreground">{t("verified.empty")}</p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => {
              const level = errorAwareLevel(
                VERIFIED_LEVELS[group.head.level] ?? VERIFIED_LEVELS.none,
                group.head.errors_reported,
                t("verified.errorsBadgeSuffix"),
              );
              const isOpen = expanded.has(group.repo);

              return (
                <Card key={group.repo} className="h-fit">
                  <CardHeader
                    className="cursor-pointer select-none"
                    onClick={() => toggle(group.repo)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1.5">
                        <Badge className={cn("w-fit", TONE[level.tone])}>
                          {level.label}
                        </Badge>
                        <CardTitle className="text-lg">
                          {group.name}
                        </CardTitle>
                      </div>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 shrink-0 text-muted-foreground transition-transform mt-1",
                          isOpen && "rotate-180"
                        )}
                      />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <a
                        href={group.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:text-primary"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {group.repo.replace("https://github.com/", "")}
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>
                      <span className="text-muted-foreground/60">
                        {group.rows.length === 1
                          ? t("verified.group.commitSingular")
                          : t("verified.group.commits", { n: String(group.rows.length) })}
                      </span>
                    </div>
                  </CardHeader>

                  {isOpen && (
                    <CardContent className="pt-0">
                      <div className="space-y-1.5 border-t pt-3 max-h-[280px] overflow-y-auto">
                        {/* The history, newest commit first: the version, the
                            commit and its date; the verification date under it. */}
                        {group.rows.map((row) => {
                          const rowLevel = errorAwareLevel(
                            VERIFIED_LEVELS[row.level] ?? VERIFIED_LEVELS.none,
                            row.errors_reported,
                            t("verified.errorsBadgeSuffix"),
                          );
                          const panelLabel = getPanelLabel(t, row.dataset_types);
                          return (
                            <Link
                              key={`${row.slug}-${row.sha}`}
                              href={rowHref(row)}
                              className="block rounded-md border px-3 py-2 transition-colors hover:border-primary hover:bg-muted/50"
                            >
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-[10px] px-1.5 py-0 shrink-0",
                                    TONE[rowLevel.tone]
                                  )}
                                >
                                  {rowLevel.label}
                                </Badge>
                                <span className="text-xs font-medium">{versionLabel(row)}</span>
                                <code className="rounded bg-muted px-1 text-[10px] text-muted-foreground">{shortSha(row.sha)}</code>
                                {row.committed && (
                                  <span className="text-[10px] text-muted-foreground">{row.committed.slice(0, 10)}</span>
                                )}
                                {panelLabel && (
                                  <span className="text-[10px] border rounded px-1.5 py-0 text-muted-foreground shrink-0">
                                    {panelLabel}
                                  </span>
                                )}
                              </div>
                              {row.generated && (
                                <p className="mt-0.5 text-[10px] text-muted-foreground">
                                  {t("verified.history.verifiedOn", { date: row.generated.slice(0, 10) })}
                                </p>
                              )}
                            </Link>
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

        <p className="mt-10 text-xs text-muted-foreground">
          {t("verified.disclaimer")}
        </p>
      </div>
    </div>
  );
}

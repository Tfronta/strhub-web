"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";
import { PageTitle } from "@/components/page-title";
import { SiteFooter } from "@/components/site-footer";
import {
  VERIFIED_LEVELS,
  type VerifiedIndex,
  type VerifiedIndexEntry,
  type VerifiedLevel,
} from "@/types/verified";
import { cn } from "@/lib/utils";

const TONE: Record<string, string> = {
  green: "bg-emerald-600 text-white border-transparent",
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

interface ToolGroup {
  name: string;
  repo: string;
  bestLevel: VerifiedLevel;
  runs: VerifiedIndexEntry[];
}

function groupTools(entries: VerifiedIndexEntry[]): ToolGroup[] {
  const real = entries.filter(
    (e) => e.level !== "none" && e.source_repo != null
  );

  const byRepo = new Map<string, VerifiedIndexEntry[]>();
  for (const entry of real) {
    const key = entry.source_repo!;
    const arr = byRepo.get(key);
    if (arr) arr.push(entry);
    else byRepo.set(key, [entry]);
  }

  const groups: ToolGroup[] = [];
  for (const [repo, runs] of byRepo) {
    runs.sort(
      (a, b) =>
        LEVEL_RANK[b.level] - LEVEL_RANK[a.level] ||
        (b.generated ?? "").localeCompare(a.generated ?? "")
    );
    const best = runs[0];
    const repoName = repo.replace(/\/+$/, "").split("/").pop() || best.name;
    groups.push({ name: repoName, repo, bestLevel: best.level, runs });
  }

  groups.sort(
    (a, b) => LEVEL_RANK[b.bestLevel] - LEVEL_RANK[a.bestLevel]
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
              const level =
                VERIFIED_LEVELS[group.bestLevel] ?? VERIFIED_LEVELS.none;
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
                        {group.runs.length === 1
                          ? t("verified.group.runSingular")
                          : `${group.runs.length} ${t("verified.group.runs")}`}
                      </span>
                    </div>
                  </CardHeader>

                  {isOpen && (
                    <CardContent className="pt-0">
                      <div className="space-y-1.5 border-t pt-3 max-h-[280px] overflow-y-auto">
                        {group.runs.map((run) => {
                          const runLevel =
                            VERIFIED_LEVELS[run.level] ??
                            VERIFIED_LEVELS.none;
                          const markers =
                            run.distinct_str_loci != null
                              ? `${run.distinct_str_loci} ${t("verified.col.strLoci")}` +
                                (run.distinct_snp_markers
                                  ? ` + ${run.distinct_snp_markers} ${t("verified.col.snps")}`
                                  : "") +
                                (run.total_reads != null
                                  ? ` · ${run.total_reads} ${t("verified.col.reads")}`
                                  : "")
                              : null;
                          const panelLabel = getPanelLabel(t, run.dataset_types);
                          return (
                            <Link
                              key={run.slug}
                              href={`/verified/${run.slug}`}
                              className="block rounded-md border px-3 py-2 transition-colors hover:border-primary hover:bg-muted/50"
                            >
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-[10px] px-1.5 py-0 shrink-0",
                                    TONE[runLevel.tone]
                                  )}
                                >
                                  {runLevel.label}
                                </Badge>
                                <span className="font-mono text-xs text-muted-foreground truncate">
                                  {run.slug}
                                </span>
                                {panelLabel && (
                                  <span className="text-[10px] border rounded px-1.5 py-0 text-muted-foreground shrink-0">
                                    {panelLabel}
                                  </span>
                                )}
                              </div>
                              {markers && (
                                <p className="mt-1 text-xs text-muted-foreground">
                                  {markers}
                                </p>
                              )}
                              {run.generated && (
                                <p className="mt-0.5 text-[10px] text-muted-foreground">
                                  {run.generated.slice(0, 10)}
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
      <SiteFooter />
    </div>
  );
}

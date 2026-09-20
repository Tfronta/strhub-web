"use client";

/**
 * The output, shown rather than counted.
 *
 * The section used to be four numbers and a list of names, which is what the
 * engine's summary gives. The PDF says more about the same file — which file,
 * in what format, how deep the deepest locus was, and an appendix of every
 * locus with its read depth as a bar — and a reader who only sees the page
 * (which is most of them) had none of it. This is the PDF's Output Content
 * Evidence and its appendix, on the page, plus the one thing neither had:
 * how much of the regions file the output covers, and which loci it does not
 * name, because that is what a reader asks next.
 */
import { useState } from "react";
import { Check, X } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useHeaded } from "./certificate";
import { cn } from "@/lib/utils";
import type { VerifiedContentStats, VerifiedIoOutput } from "@/types/verified";
import { depthRows, ioChecks, panelCoverage } from "@/lib/verified/output-evidence";

/** Bars shown before "Show all": one screen, and the deepest are the point. */
const DEPTH_ROWS_FOLDED = 24;

function Stat({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold tabular-nums mt-1">{value}</p>
      {detail && <p className="text-xs text-muted-foreground font-mono">{detail}</p>}
    </div>
  );
}

export function OutputContent({
  stats,
  io,
  panelLoci,
}: {
  stats: VerifiedContentStats | undefined;
  /** The Expected IO gate's record of the same file, when the gate ran. */
  io?: VerifiedIoOutput;
  /** The loci of STRhub's reference panel, to name what was not called. */
  panelLoci?: string[];
}) {
  const { t, language } = useLanguage();
  const [showAll, setShowAll] = useState(false);
  if (!stats) return null;

  const n = (v: number | undefined) => new Intl.NumberFormat(language).format(v ?? 0);
  const checks = ioChecks(io);
  const coverage = panelCoverage(stats, panelLoci);
  const rows = depthRows(stats);
  const visible = showAll ? rows : rows.slice(0, DEPTH_ROWS_FOLDED);
  const deepest = stats.top_loci_by_depth?.[0];
  const outputFile = io?.resolved ?? io?.path;
  const format = io?.format?.toUpperCase();

  return (
    <>
      {!useHeaded() && (<h2 className="mt-10 text-xl font-semibold">{t("verified.content.heading")}</h2>)}
      <div className="mt-3 rounded-lg border bg-card p-5">
        {/* Which file, and what the IO gate established about it. The gate row
            above says "pass"; this is what passing consisted of. */}
        {(outputFile || checks.length > 0) && (
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm border-b pb-4 mb-4">
            {outputFile && (
              <>
                <dt className="text-muted-foreground">{t("verified.content.outputFile")}</dt>
                <dd>
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs break-all">{outputFile}</code>
                  {format && <span className="ml-2 text-xs text-muted-foreground">{t("verified.content.format")}: {format}</span>}
                </dd>
              </>
            )}
            {checks.length > 0 && (
              <>
                <dt className="text-muted-foreground">{t("verified.content.ioChecksLabel")}</dt>
                <dd className="flex flex-wrap gap-1.5">
                  {checks.map((c) => (
                    <span
                      key={c.key}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs",
                        c.passed
                          ? "border-teal-600/40 text-teal-700 dark:text-teal-400"
                          : "border-red-500/40 text-red-700 dark:text-red-400",
                      )}
                    >
                      {c.passed ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      {c.key === "parses"
                        ? t("verified.content.ioCheck.parses", { format: c.format ?? "" })
                        : t(`verified.content.ioCheck.${c.key}`) === `verified.content.ioCheck.${c.key}`
                          ? c.key.replace(/_/g, " ")
                          : t(`verified.content.ioCheck.${c.key}`)}
                    </span>
                  ))}
                </dd>
              </>
            )}
          </dl>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Stat label={t("verified.content.records")} value={n(stats.rows)} />
          <Stat label={t("verified.content.strLoci")} value={n(stats.distinct_str_loci ?? stats.distinct_loci)} />
          {(stats.distinct_snp_markers ?? 0) > 0 && (
            <Stat label={t("verified.content.snps")} value={n(stats.distinct_snp_markers)} />
          )}
          <Stat label={t("verified.content.totalReads")} value={n(stats.total_reads)} />
          {deepest && (
            <Stat label={t("verified.content.maxDepth")} value={n(stats.max_sequence_depth ?? deepest[1])} detail={deepest[0]} />
          )}
        </div>

        {/* Coverage of the regions file: the number a reader wants right after
            "21 loci", because the panel had 24, and the names, because the
            diagnostics below explain them. */}
        {coverage && (
          <div className="mt-5 pt-4 border-t">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{t("verified.content.panelCoverage")}</p>
              <p className="text-sm font-semibold tabular-nums">
                {t("verified.content.panelCoverageValue", { hit: String(coverage.hit), given: String(coverage.given) })}
              </p>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted" role="img"
                 aria-label={t("verified.content.panelCoverageValue", { hit: String(coverage.hit), given: String(coverage.given) })}>
              <div className="h-full rounded-full bg-teal-600" style={{ width: `${Math.round((coverage.hit / coverage.given) * 100)}%` }} />
            </div>
            {coverage.notCalled.length > 0 && (
              <p className="mt-2 text-sm">
                <span className="text-muted-foreground">{t("verified.content.notCalled")}</span>{" "}
                <span className="font-mono text-xs">{coverage.notCalled.join(", ")}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{t("verified.content.notCalledHint")}</span>
              </p>
            )}
          </div>
        )}

        {stats.str_loci && stats.str_loci.length > 0 && (
          <div className="mt-5 pt-4 border-t">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{t("verified.content.strLociList")}</p>
            <p className="text-xs font-mono text-muted-foreground leading-relaxed">{stats.str_loci.join(", ")}</p>
          </div>
        )}
      </div>

      {/* The PDF's appendix: every locus with its depth as a bar, deepest
          first. The bar is the evidence that the output is real data and not
          a header — a reader sees the shape of it in one glance. */}
      {rows.length > 0 && (
        <div className="mt-4 rounded-lg border bg-card p-5">
          <h3 className="text-sm font-semibold">{t("verified.content.depthHeading")}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{t("verified.content.depthNote")}</p>
          <ol className="mt-4 space-y-1.5">
            {visible.map((r) => (
              <li key={r.locus} className="grid grid-cols-[6.5rem_1fr_3.5rem] items-center gap-3 text-xs">
                <span className="truncate font-mono" title={r.locus}>{r.locus}</span>
                <span className="h-2.5 w-full overflow-hidden rounded-sm bg-muted" aria-hidden>
                  <span
                    className={cn("block h-full rounded-sm", r.depth > 0 ? "bg-teal-600" : "bg-red-500")}
                    style={{ width: `${Math.max(r.depth > 0 ? 1 : 0, Math.round(r.share * 100))}%` }}
                  />
                </span>
                <span className={cn("text-right tabular-nums", r.depth === 0 ? "text-red-600 dark:text-red-400" : "text-muted-foreground")}>
                  {n(r.depth)}
                </span>
              </li>
            ))}
          </ol>
          {rows.length > DEPTH_ROWS_FOLDED && (
            <button
              type="button"
              className="mt-3 text-xs underline underline-offset-2"
              onClick={() => setShowAll((v) => !v)}
            >
              {showAll ? t("verified.content.showFewer") : t("verified.content.showAll", { n: String(rows.length) })}
            </button>
          )}
        </div>
      )}
    </>
  );
}

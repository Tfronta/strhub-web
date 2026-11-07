"use client";

import { Check, X } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useHeaded } from "./certificate";
import { cn } from "@/lib/utils";
import type { VerifiedContentStats, VerifiedIoOutput } from "@/types/verified";
import { ioChecks, panelCoverage } from "@/lib/verified/output-evidence";

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
  if (!stats) {
    return (
      <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground bg-muted/20">
        <p className="italic">{t("verified.content.noOutputGenerated")}</p>
      </div>
    );
  }

  const n = (v: number | undefined) => new Intl.NumberFormat(language).format(v ?? 0);
  const checks = ioChecks(io);
  const coverage = panelCoverage(stats, panelLoci);
  const outputFile = io?.resolved ?? io?.path;
  const format = io?.format?.toUpperCase();

  return (
    <>
      {!useHeaded() && (<h2 className="mt-10 text-xl font-semibold">{t("verified.content.heading")}</h2>)}
      <div className="mt-3 rounded-lg border bg-card p-5">
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

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Stat label={t("verified.content.records")} value={n(stats.rows)} />
          <Stat label={t("verified.content.strLoci")} value={n(stats.distinct_str_loci ?? stats.distinct_loci)} />
          {(stats.distinct_snp_markers ?? 0) > 0 && (
            <Stat label={t("verified.content.snps")} value={n(stats.distinct_snp_markers)} />
          )}
        </div>

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
    </>
  );
}

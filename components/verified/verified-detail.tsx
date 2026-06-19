"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, Check, Minus, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";
import { SiteFooter } from "@/components/site-footer";
import {
  VERIFIED_LEVELS,
  VERIFIED_GATES,
  type VerifiedReport,
} from "@/types/verified";
import { cn } from "@/lib/utils";

const DATASET_PROVENANCE: Record<
  string,
  { name: string; source: string; doi?: string; license: string }
> = {
  "illumina-str-fastq": {
    name: "NIST mds2-2157 — Illumina STR (ForenSeq slice, donor NTD01)",
    source: "https://data.nist.gov/od/id/mds2-2157",
    doi: "10.18434/M32157",
    license:
      "Research / training / education only (per NIST); not for donor identification or database searching.",
  },
  "ont-bam-hg38": {
    name: "1000 Genomes ONT — hg38 CODIS slice (R10 SUP)",
    source:
      "https://s3.amazonaws.com/1000g-ont/index.html?prefix=PROCESSED_DATA/ALIGNED_TO_HG38/MINIMAP2_ALIGNED_BAMS/",
    license: "Open access (1000 Genomes / HPRC). Research use.",
  },
};

const LEGACY_SLUG_DATASETS: Record<string, string[]> = {
  "strait-razor-ForenSeqv1.27": ["illumina-str-fastq"],
};

const VerifiedDownloadButton = dynamic(
  () =>
    import("./verified-download-button").then((m) => m.VerifiedDownloadButton),
  { ssr: false, loading: () => <span className="text-sm text-muted-foreground">Loading...</span> }
);

const TONE: Record<string, string> = {
  green: "bg-emerald-600 text-white border-transparent",
  amber: "bg-amber-500 text-white border-transparent",
  red: "bg-red-600 text-white border-transparent",
};

export function VerifiedDetail({
  report,
  slug,
  staticPageUrl,
}: {
  report: VerifiedReport;
  slug: string;
  staticPageUrl: string;
}) {
  const { t } = useLanguage();
  const level = VERIFIED_LEVELS[report.level] ?? VERIFIED_LEVELS.none;
  const stats = report.content_detail?.outputs?.[0]?.stats;
  const ref = report.source.ref_resolved ?? report.source.ref ?? "";

  const datasetTypes = new Set<string>();
  if (report.datasets) {
    for (const leg of report.datasets) {
      if (leg.type) datasetTypes.add(leg.type);
    }
  } else if (LEGACY_SLUG_DATASETS[slug]) {
    for (const t2 of LEGACY_SLUG_DATASETS[slug]) datasetTypes.add(t2);
  }
  const provenanceEntries = Array.from(datasetTypes)
    .map((dt) => ({ type: dt, ...DATASET_PROVENANCE[dt] }))
    .filter((e) => e.name);

  return (
    <div className="flex flex-col min-h-[60vh]">
      <div className="container mx-auto px-4 py-8 flex-1 max-w-3xl">
        {/* Back link */}
        <Link
          href="/verified"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> {t("verified.backToList")}
        </Link>

        {/* Header: badge + title + download */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <Badge className={cn("w-fit", TONE[level.tone])}>{level.label}</Badge>
            <h1 className="text-3xl font-bold tracking-tight">
              {report.tool.name}
            </h1>
            <p className="font-mono text-sm text-muted-foreground">{slug}</p>
          </div>
          <div className="shrink-0">
            <VerifiedDownloadButton report={report} slug={slug} />
          </div>
        </div>

        {/* Tool metadata card */}
        <div className="mt-8 rounded-lg border bg-card p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            {t("verified.source")}
          </h2>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
            {report.tool.maintainer && (
              <>
                <dt className="text-muted-foreground">Maintainer</dt>
                <dd>{report.tool.maintainer}</dd>
              </>
            )}
            <dt className="text-muted-foreground">Repository</dt>
            <dd>
              <a
                href={report.source.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline break-all"
              >
                {report.source.repo}
              </a>
            </dd>
            <dt className="text-muted-foreground">{t("verified.commit")}</dt>
            <dd>
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{ref}</code>
            </dd>
            {report.environment?.os && (
              <>
                <dt className="text-muted-foreground">{t("verified.environment")}</dt>
                <dd>{report.environment.os.join(", ")}</dd>
              </>
            )}
            <dt className="text-muted-foreground">{t("verified.verifiedOn")}</dt>
            <dd>{report.generated?.slice(0, 19).replace("T", " ")} UTC</dd>
            {report.ci_run && (
              <>
                <dt className="text-muted-foreground">{t("verified.ciRun")}</dt>
                <dd>
                  <a
                    href={report.ci_run}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    View run <ExternalLink className="h-3 w-3" />
                  </a>
                </dd>
              </>
            )}
          </dl>
        </div>

        {/* Gates */}
        <h2 className="mt-10 text-xl font-semibold">{t("verified.gates")}</h2>
        <div className="mt-3 divide-y rounded-lg border">
          {VERIFIED_GATES.map((g) => {
            const pass = report.gates?.[g.key];
            return (
              <div
                key={g.key}
                className="flex items-center gap-3 px-4 py-2.5 text-sm"
              >
                <span
                  className={cn(
                    "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                    pass
                      ? "bg-emerald-600 text-white"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {pass ? <Check className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                </span>
                <span className="font-medium whitespace-nowrap">
                  {VERIFIED_LEVELS[g.key]?.label ?? g.key}
                </span>
                <span className="text-muted-foreground">{t(g.meaningKey)}</span>
              </div>
            );
          })}
        </div>

        {/* Output content evidence */}
        {stats && (
          <>
            <h2 className="mt-10 text-xl font-semibold">
              {t("verified.content.heading")}
            </h2>
            <div className="mt-3 rounded-lg border bg-card p-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    {t("verified.content.records")}
                  </p>
                  <p className="text-2xl font-bold tabular-nums mt-1">
                    {stats.rows ?? 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    {t("verified.content.strLoci")}
                  </p>
                  <p className="text-2xl font-bold tabular-nums mt-1">
                    {stats.distinct_str_loci ?? stats.distinct_loci ?? 0}
                  </p>
                </div>
                {(stats.distinct_snp_markers ?? 0) > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                      {t("verified.content.snps")}
                    </p>
                    <p className="text-2xl font-bold tabular-nums mt-1">
                      {stats.distinct_snp_markers}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    {t("verified.content.totalReads")}
                  </p>
                  <p className="text-2xl font-bold tabular-nums mt-1">
                    {stats.total_reads ?? 0}
                  </p>
                </div>
              </div>

              {stats.str_loci && stats.str_loci.length > 0 && (
                <div className="mt-5 pt-4 border-t">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                    {t("verified.content.strLociList")}
                  </p>
                  <p className="text-xs font-mono text-muted-foreground leading-relaxed">
                    {stats.str_loci.join(", ")}
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Verification data (provenance) */}
        {provenanceEntries.length > 0 && (
          <>
            <h2 className="mt-10 text-xl font-semibold">
              {t("verified.data.heading")}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("verified.data.note")}
            </p>
            <div className="mt-3 space-y-3">
              {provenanceEntries.map((ds) => (
                <div
                  key={ds.type}
                  className="rounded-lg border-l-4 border-border bg-muted/50 p-4"
                >
                  <p className="text-sm font-medium">{ds.name}</p>
                  <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
                    <dt className="text-muted-foreground">Source</dt>
                    <dd>
                      <a
                        href={ds.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline break-all"
                      >
                        {ds.source}
                      </a>
                    </dd>
                    {ds.doi && (
                      <>
                        <dt className="text-muted-foreground">DOI</dt>
                        <dd>
                          <a
                            href={`https://doi.org/${ds.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {ds.doi}
                          </a>
                        </dd>
                      </>
                    )}
                    <dt className="text-muted-foreground">License</dt>
                    <dd className="text-muted-foreground">{ds.license}</dd>
                  </dl>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Verification matrix (Fase 3) */}
        {report.datasets && report.datasets.length > 0 && (
          <>
            <h2 className="mt-10 text-xl font-semibold">
              {t("verified.matrix.heading")}
            </h2>
            <div className="mt-3 divide-y rounded-lg border">
              {report.datasets.map((leg) => {
                const state = !leg.available
                  ? "na"
                  : leg.passed
                  ? "pass"
                  : "fail";
                return (
                  <div
                    key={leg.leg}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm"
                  >
                    <span
                      className={cn(
                        "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                        state === "pass"
                          ? "bg-emerald-600 text-white"
                          : state === "fail"
                          ? "bg-amber-500 text-white"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {state === "pass" ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Minus className="h-3 w-3" />
                      )}
                    </span>
                    <span className="font-medium">
                      {leg.leg === "own"
                        ? t("verified.matrix.own")
                        : leg.leg === "external"
                        ? t("verified.matrix.external")
                        : leg.label}
                    </span>
                    <span className="text-muted-foreground">
                      {state === "na"
                        ? t("verified.matrix.na")
                        : state === "pass"
                        ? t("verified.matrix.pass")
                        : t("verified.matrix.fail")}
                    </span>
                    {leg.dataset && (
                      <span className="ml-auto truncate text-xs text-muted-foreground">
                        {leg.dataset}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* README check (advisory) */}
        {report.readme_check && (
          <>
            <h2 className="mt-10 text-xl font-semibold">
              {t("verified.readme.heading")}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("verified.readme.note")} ({report.readme_check.score}/
              {report.readme_check.max})
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              {(
                [
                  ["install", "verified.readme.install"],
                  ["command", "verified.readme.command"],
                  ["input", "verified.readme.input"],
                  ["output", "verified.readme.output"],
                  ["dependencies", "verified.readme.deps"],
                ] as const
              ).map(([key, labelKey]) => {
                const present = report.readme_check?.checks?.[key]?.present;
                return (
                  <li key={key} className="flex items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                        present
                          ? "bg-emerald-600 text-white"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {present ? (
                        <Check className="h-2.5 w-2.5" />
                      ) : (
                        <Minus className="h-2.5 w-2.5" />
                      )}
                    </span>
                    {t(labelKey)}
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {/* Scope */}
        <h2 className="mt-10 text-xl font-semibold">{t("verified.scope")}</h2>
        <div className="mt-3 rounded-lg border-l-4 border-emerald-600 bg-muted/50 p-4 text-sm">
          <p>{report.scope}</p>
          <p className="mt-3 text-muted-foreground">{t("verified.scopeNote")}</p>
        </div>

        {/* Footer disclaimer */}
        <p className="mt-8 text-xs text-muted-foreground">
          {t("verified.disclaimer")}{" "}
          <a
            href={staticPageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {t("verified.staticPage")}
          </a>
        </p>
      </div>
      <SiteFooter />
    </div>
  );
}

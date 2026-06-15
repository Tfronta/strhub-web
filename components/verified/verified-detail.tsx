"use client";

import Link from "next/link";
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

  return (
    <div className="flex flex-col min-h-[60vh]">
      <div className="container mx-auto px-4 py-8 flex-1 max-w-3xl">
        <Link
          href="/verified"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> {t("verified.backToList")}
        </Link>

        <div className="mt-4 space-y-2">
          <Badge className={cn("w-fit", TONE[level.tone])}>{level.label}</Badge>
          <h1 className="text-3xl font-bold tracking-tight">
            {report.tool.name}
          </h1>
          <p className="font-mono text-sm text-muted-foreground">{slug}</p>
        </div>

        <ul className="mt-6 space-y-1 text-sm">
          <li>
            <span className="text-muted-foreground">{t("verified.source")}: </span>
            <a
              href={report.source.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline break-all"
            >
              {report.source.repo}
            </a>
          </li>
          <li>
            <span className="text-muted-foreground">{t("verified.commit")}: </span>
            <code className="text-xs">{ref}</code>
          </li>
          {report.environment?.os && (
            <li>
              <span className="text-muted-foreground">
                {t("verified.environment")}:{" "}
              </span>
              {report.environment.os.join(", ")}
            </li>
          )}
          <li>
            <span className="text-muted-foreground">
              {t("verified.verifiedOn")}:{" "}
            </span>
            {report.generated?.slice(0, 19).replace("T", " ")} UTC
          </li>
          {report.ci_run && (
            <li>
              <a
                href={report.ci_run}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                {t("verified.ciRun")} <ExternalLink className="h-3 w-3" />
              </a>
            </li>
          )}
        </ul>

        <h2 className="mt-8 text-xl font-semibold">{t("verified.gates")}</h2>
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
                    "inline-flex h-5 w-5 items-center justify-center rounded-full",
                    pass
                      ? "bg-emerald-600 text-white"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {pass ? <Check className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                </span>
                <span className="font-medium">
                  {VERIFIED_LEVELS[g.key]?.label ?? g.key}
                </span>
                <span className="text-muted-foreground">{t(g.meaningKey)}</span>
              </div>
            );
          })}
        </div>

        {stats && (
          <>
            <h2 className="mt-8 text-xl font-semibold">
              {t("verified.content.heading")}
            </h2>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                {t("verified.content.records")}:{" "}
                <b>{stats.rows ?? 0}</b>
              </li>
              <li>
                {t("verified.content.strLoci")}:{" "}
                <b>{stats.distinct_str_loci ?? stats.distinct_loci ?? 0}</b>
                {stats.distinct_snp_markers
                  ? ` · ${t("verified.content.snps")}: ${stats.distinct_snp_markers}`
                  : ""}
              </li>
              <li>
                {t("verified.content.totalReads")}: <b>{stats.total_reads ?? 0}</b>
              </li>
              {stats.str_loci && stats.str_loci.length > 0 && (
                <li className="text-muted-foreground">
                  {t("verified.content.strLociList")}:{" "}
                  {stats.str_loci.slice(0, 18).join(", ")}
                  {stats.str_loci.length > 18 ? " …" : ""}
                </li>
              )}
            </ul>
          </>
        )}

        {report.datasets && report.datasets.length > 0 && (
          <>
            <h2 className="mt-8 text-xl font-semibold">
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
                        "inline-flex h-5 w-5 items-center justify-center rounded-full",
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

        {report.readme_check && (
          <>
            <h2 className="mt-8 text-xl font-semibold">
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
                        "inline-flex h-4 w-4 items-center justify-center rounded-full",
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

        <h2 className="mt-8 text-xl font-semibold">{t("verified.scope")}</h2>
        <div className="mt-3 rounded-lg border-l-4 border-emerald-600 bg-muted/50 p-4 text-sm">
          <p>{report.scope}</p>
          <p className="mt-3 text-muted-foreground">{t("verified.scopeNote")}</p>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
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

"use client";

import { ExternalLink, FileDown } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";
import type { VerifiedReport } from "@/types/verified";

/**
 * Where the result came from, with the two anchors a reader needs in the
 * order they need them: the version (what a person cites) and the pinned
 * commit (what a machine can fetch). The commit is fixed — the attestation
 * describes exactly that commit and nothing later — and the card says so,
 * instead of "this is the head of master today", which read as if the result
 * followed the branch.
 *
 * Who asked for the run is not here. A verification is a fact about a public
 * repository at a commit, the same whoever triggered it; the one line that
 * matters — that it is not the author's endorsement — is the footnote.
 */
export function SourceCard({
  report,
  staticPageUrl,
  pdfUrl,
}: {
  report: VerifiedReport;
  staticPageUrl?: string;
  pdfUrl?: string;
}) {
  const { t } = useLanguage();
  const ref = report.source.ref_resolved ?? report.source.ref ?? "";

  // Mirrors harness/upstream.py::note, minus the "head of master" case: that
  // one is context a reader misread as the result tracking the branch. Empty
  // when the check could not be made, and then nothing is shown — a guess about
  // how current somebody's software is would be worse than the silence.
  const up = report.upstream;
  const upstreamNote = !up
    ? ""
    : up.repo_exists === false
      ? t("verified.upstream.repoGone")
      : up.ref_exists === false
        ? t("verified.upstream.refGone")
        : (up.behind_by ?? 0) > 0
          ? t("verified.upstream.behind", {
              n: String(up.behind_by),
              branch: up.default_branch ?? "",
            })
          : "";
  const refIsFinding = up?.ref_exists === false || up?.repo_exists === false;

  return (
    <div className="mt-8 rounded-lg border bg-card p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        {t("verified.source")}
      </h2>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
        {report.tool.version && (
          <>
            <dt className="text-muted-foreground">{t("verified.version")}</dt>
            <dd className="font-semibold">{report.tool.version}</dd>
          </>
        )}
        {report.tool.variant && (
          <>
            {/* Two cards for one tool otherwise differ by a few characters
                of URL, which is not a distinction to make a reader squint at. */}
            <dt className="text-muted-foreground">{t("verified.variant")}</dt>
            <dd>{report.tool.variant}</dd>
          </>
        )}
        {report.tool.maintainer && (
          <>
            <dt className="text-muted-foreground">{t("verified.maintainer")}</dt>
            <dd>{report.tool.maintainer}</dd>
          </>
        )}
        <dt className="text-muted-foreground">{t("verified.repository")}</dt>
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
        <dt className="text-muted-foreground">{t("verified.commitPinned")}</dt>
        <dd>
          <code className="text-xs bg-muted px-1.5 py-0.5 rounded break-all">{ref}</code>
          <span className="mt-1 block text-xs text-muted-foreground">{t("verified.commitPinnedHint")}</span>
          {/* Where that commit sits now. Context for a reviewer comparing the
              attestation against the version a manuscript cites — and, when
              the ref has vanished, a finding: being fetchable is the first
              thing the badge claims. */}
          {upstreamNote && (
            <span
              className={cn(
                "mt-1 block text-xs",
                refIsFinding ? "text-amber-700 dark:text-amber-500" : "text-muted-foreground",
              )}
            >
              {upstreamNote}
            </span>
          )}
        </dd>
        {report.environment?.os && (
          <>
            <dt className="text-muted-foreground">{t("verified.environment")}</dt>
            <dd>
              {report.environment.os.join(", ")}
              {/* Plan B ran: say so where the environment is named, or the
                  line reads as "the pinned commit, built and run". */}
              {report.environment.fallback_used && (
                <span className="mt-1 block text-xs text-amber-700 dark:text-amber-500">
                  {t("verified.environmentFallback", {
                    reason: report.environment.fallback?.reason ?? t("verified.trial.recipeFallbackReason"),
                  })}
                </span>
              )}
            </dd>
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
                {t("verified.viewRun")} <ExternalLink className="h-3 w-3" />
              </a>
            </dd>
          </>
        )}
        {(staticPageUrl || pdfUrl) && (
          <>
            <dt className="text-muted-foreground">{t("verified.staticPage")}</dt>
            <dd className="flex flex-wrap gap-x-4 gap-y-1">
              {staticPageUrl && (
                <a
                  href={staticPageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
                >
                  {t("verified.fullReport")} <ExternalLink className="h-3 w-3" />
                </a>
              )}
              {pdfUrl && (
                <a
                  href={pdfUrl}
                  className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
                >
                  <FileDown className="h-3.5 w-3.5" /> {t("verified.pdf")}
                </a>
              )}
            </dd>
          </>
        )}
      </dl>
      <p className="mt-3 border-t pt-3 text-xs text-muted-foreground">{t("verified.footnote")}</p>
    </div>
  );
}

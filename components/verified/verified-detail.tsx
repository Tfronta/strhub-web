"use client";

/**
 * A published attestation. Everything it shows is the shared report body;
 * this only says where the logs and files live on gh-pages.
 */
import { useLanguage } from "@/contexts/language-context";
import type { VerifiedReport } from "@/types/verified";
import { verifiedPdfUrl } from "@/lib/verified";
import { VerifiedReportBody, type ReportLog } from "./report/verified-report-body";

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
  const logBaseUrl = staticPageUrl.replace(/\/[^/]+$/, "");
  const hasStrhubFixture = report.datasets?.some((d) => d.fixture_source === "strhub") ?? false;

  // Every log is a file next to the report. A leg that ran on STRhub's sample
  // in place of the tool's own is not shown as the tool's own; and the build
  // log is not a verification leg, so it is named as the build.
  const logs: ReportLog[] = Object.entries(report.logs ?? {})
    .filter(([leg]) => {
      if (!hasStrhubFixture) return true;
      return report.datasets?.find((d) => d.leg === leg)?.fixture_source !== "strhub";
    })
    .map(([leg, fname]) => ({
      leg,
      label:
        leg === "build"
          ? t("verified.log.build")
          : leg === "own"
            ? t("verified.matrix.own")
            : t("verified.matrix.external"),
      href: `${logBaseUrl}/${fname}`,
    }));

  return (
    <VerifiedReportBody
      report={report}
      slug={slug}
      staticPageUrl={staticPageUrl}
      pdfUrl={verifiedPdfUrl(slug)}
      logs={logs}
      buildLogHref={report.logs?.build ? `${logBaseUrl}/${report.logs.build}` : undefined}
    />
  );
}

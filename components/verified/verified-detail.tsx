"use client";

/**
 * A published attestation. Everything it shows is the shared report body;
 * this only says where the logs and files live on gh-pages — at the root for
 * the newest commit, under `<slug>/<sha>/` for an older one — and hands the
 * body the tool's history.
 */
import { useLanguage } from "@/contexts/language-context";
import type { VerifiedReport } from "@/types/verified";
import type { HistoryRow } from "@/lib/verified/history";
import { instrumentOfReport } from "@/lib/verified/instrument";
import { VerifiedReportBody, type ReportLog } from "./report/verified-report-body";
import { PublishedVerdict } from "./report/verdict";

export function VerifiedDetail({
  report,
  slug,
  staticPageUrl,
  pdfUrl,
  jsonUrl,
  history,
  note,
}: {
  report: VerifiedReport;
  slug: string;
  staticPageUrl: string;
  pdfUrl: string;
  jsonUrl: string;
  history?: { rows: HistoryRow[]; current: HistoryRow };
  /** The run of STRhub's own recipe for this tool, when this page is not it. */
  note?: { row: HistoryRow; report: VerifiedReport };
}) {
  const { t } = useLanguage();
  // Which instrument: what the report says, else what the index listed this
  // run as, else derived the way the engine derives it for older reports.
  const instrument = report.instrument ?? history?.current.instrument ?? instrumentOfReport(report);
  // Every log is a file next to the report, wherever the report lives.
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
      pdfUrl={pdfUrl}
      jsonUrl={jsonUrl}
      logs={logs}
      buildLogHref={report.logs?.build ? `${logBaseUrl}/${report.logs.build}` : undefined}
      history={history}
      instrument={instrument}
      note={note}
      afterHeader={<PublishedVerdict report={report} />}
    />
  );
}

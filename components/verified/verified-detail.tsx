"use client";

/**
 * A published attestation. Everything it shows is the shared report body;
 * this only says where the logs and files live on gh-pages — at the root for
 * the newest commit, under `<slug>/<sha>/` for an older one — and hands the
 * body the tool's history.
 */
import { extraGateRowsFor } from "@/lib/verified/extra-gates";
import { LOG_LEGS } from "@/lib/verified/log-files";
import { useLanguage } from "@/contexts/language-context";
import type { VerifiedPublication, VerifiedReport } from "@/types/verified";
import type { HistoryRow } from "@/lib/verified/history";
import { instrumentOfReport } from "@/lib/verified/instrument";
import { VerifiedReportBody, type ReportLog } from "./report/verified-report-body";
import { EditorialReview } from "./report/editorial-review";

export function VerifiedDetail({
  report,
  slug,
  staticPageUrl,
  pdfUrl,
  jsonUrl,
  history,
  note,
}: {
  report: VerifiedPublication;
  slug: string;
  staticPageUrl: string;
  pdfUrl: string;
  jsonUrl: string;
  history?: { rows: HistoryRow[]; current: HistoryRow };
  /** The run of STRhub's own recipe for this tool, when this page is not it. */
  note?: { row: HistoryRow; report: VerifiedReport };
}) {
  const { t } = useLanguage();
  if (report.record_type === "editorial_review") {
    return <EditorialReview report={report} pdfUrl={pdfUrl} jsonUrl={jsonUrl} />;
  }
  // Which instrument: what the report says, else what the index listed this
  // run as, else derived the way the engine derives it for older reports.
  const instrument = report.instrument ?? history?.current.instrument ?? instrumentOfReport(report);
  // Every log is a file next to the report, wherever the report lives.
  const logBaseUrl = staticPageUrl.replace(/\/[^/]+$/, "");
  const logs: ReportLog[] = LOG_LEGS.flatMap((leg) => {
    const terminal = report.terminals?.[leg];
    const filename = terminal ?? report.logs?.[leg];
    if (!filename || !/^[A-Za-z0-9_][A-Za-z0-9._-]*\.txt$/.test(filename)) return [];
    const fixture = report.datasets?.find((dataset) => dataset.leg === leg)?.fixture_source;
    return [{
      leg,
      label: t(`verified.trial.log.${fixture === "strhub" && leg === "own" ? "external" : leg}`),
      href: `${logBaseUrl}/${filename}`,
      hasInvocation: Boolean(terminal),
    }];
  });

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
      extraGateRows={extraGateRowsFor(report.gates as Record<string, boolean> | undefined, t)}
    />
  );
}

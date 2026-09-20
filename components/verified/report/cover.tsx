"use client";

/**
 * The cover, as the certificate has it: the label and the panel, the tool
 * and its version, then the table a reviewer looks for first — when it was
 * verified, the commit in full with a link to it, the result, the rung
 * reached, the permanent link, the files — and the scope of the report in
 * its own box. What a person holding the PDF and the page sees in the same
 * place on both.
 */
import { ExternalLink, FileDown, FileJson } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";
import type { VerifiedCertificate, VerifiedReport } from "@/types/verified";
import { TONE, type BadgeDisplay } from "@/lib/verified/badge";
import { formatDate } from "@/lib/verified/format-date";
import { cn } from "@/lib/utils";
import type { PanelKind } from "@/lib/verified/dataset-provenance";
import { KvTable, BoxedText, type KvRow } from "./certificate";

export function Cover({
  report,
  certificate,
  level,
  panel,
  title,
  slug,
  permalink,
  staticPageUrl,
  pdfUrl,
  jsonUrl,
}: {
  report: VerifiedReport;
  certificate: VerifiedCertificate;
  level: BadgeDisplay;
  panel: PanelKind | null;
  title: string;
  slug: string;
  /** The page's own permanent address; none for a trial, which is published nowhere. */
  permalink?: string;
  staticPageUrl?: string;
  pdfUrl?: string;
  jsonUrl?: string;
}) {
  const { t, language } = useLanguage();
  const sha = report.source.ref_resolved ?? report.source.ref ?? "";
  const repo = report.source.repo.replace(/\/+$/, "");
  const commitUrl = /^https:\/\/github\.com\//.test(repo) && /^[0-9a-f]{7,40}$/i.test(sha) ? `${repo}/commit/${sha}` : null;

  const rows: KvRow[] = [
    { label: t("verified.certificate.cover.date"), value: formatDate(report.generated, language) },
    {
      label: t("verified.certificate.cover.commit"),
      value: (
        <span className="inline-flex flex-wrap items-center gap-2">
          <code className="break-all rounded bg-muted px-1.5 py-0.5 text-xs">{sha}</code>
          {commitUrl && (
            <a href={commitUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
              GitHub <ExternalLink className="h-3 w-3" />
            </a>
          )}
          {report.source.committed && (
            <span className="text-xs text-muted-foreground">{t("verified.commitMadeOn", { date: formatDate(report.source.committed, language) })}</span>
          )}
        </span>
      ),
    },
    { label: t("verified.certificate.cover.result"), value: <Badge className={cn(TONE[level.tone])}>{level.label}</Badge> },
    { label: t("verified.certificate.cover.reached"), value: certificate.reached },
    {
      label: t("verified.certificate.cover.permalink"),
      value: permalink
        ? <a href={permalink} className="break-all text-primary hover:underline">{permalink}</a>
        : <span className="text-muted-foreground">{t("verified.certificate.cover.notPublished")}</span>,
    },
  ];
  if (pdfUrl || staticPageUrl || jsonUrl) {
    rows.push({
      label: t("verified.files.heading"),
      value: (
        <span className="flex flex-wrap gap-x-4 gap-y-1">
          {pdfUrl && <a href={pdfUrl} className="inline-flex items-center gap-1 font-medium text-primary hover:underline"><FileDown className="h-3.5 w-3.5" /> {t("verified.files.pdf")}</a>}
          {staticPageUrl && <a href={staticPageUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-primary hover:underline">{t("verified.files.html")} <ExternalLink className="h-3 w-3" /></a>}
          {jsonUrl && <a href={jsonUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-primary hover:underline"><FileJson className="h-3.5 w-3.5" /> {t("verified.files.json")}</a>}
        </span>
      ),
    });
  }

  return (
    <div className="mt-6 rounded-lg border bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge className={cn("w-fit", TONE[level.tone])}>{level.label}</Badge>
        {panel && (
          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground">
            {t(`verified.panel.${panel}`)}
          </span>
        )}
      </div>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">
        {title}
        {report.tool.version && (
          <span className="ml-3 align-middle text-xl font-semibold text-muted-foreground">{report.tool.version}</span>
        )}
      </h1>
      <p className="font-mono text-sm text-muted-foreground">{slug}</p>
      <KvTable rows={rows} labelWidth="10rem" />
      <p className="mt-6 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t("verified.certificate.cover.scope")}</p>
      <BoxedText tone="teal">
        <p>{certificate.scope.statement}</p>
        <p className="text-muted-foreground">{certificate.scope.not}</p>
      </BoxedText>
      <p className="mt-3 text-xs text-muted-foreground">{t("verified.footnote")}</p>
    </div>
  );
}

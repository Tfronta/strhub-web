"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";
import type { VerifiedEditorialNotice } from "@/types/verified";

/** This is a review of evidence, not an attestation with failed gates. */
export function EditorialReview({ report, pdfUrl, jsonUrl }: {
  report: VerifiedEditorialNotice; pdfUrl: string; jsonUrl: string;
}) {
  const { t } = useLanguage();
  const review = report.evidence_review;
  return (
    <main className="container mx-auto max-w-3xl space-y-6 px-4 py-10">
      <Link className="text-primary underline" href="/verified">{t("verified.backToList")}</Link>
      <p className="text-sm font-medium text-muted-foreground">{t("verified.evidenceReview.kind")}</p>
      <h1 className="text-3xl font-semibold">{report.tool.name}: {t("verified.evidenceReview.title")}</h1>
      <p>{t("verified.evidenceReview.explanation")}</p>
      {review && <>
        <p className="rounded-lg border bg-muted/40 p-5">{review.reason}</p>
        <p className="text-sm text-muted-foreground">{t("verified.evidenceReview.reviewedOn", { date: review.reviewed_at })}</p>
        <h2 className="text-xl font-semibold">{t("verified.evidenceReview.recovered")}</h2>
        <p>{review.recovered_evidence_note}</p>
        <ul className="space-y-2">
          <li><a className="text-primary underline" href={review.archive_url}>{t("verified.evidenceReview.archive")}</a></li>
          <li><a className="text-primary underline" href={review.review_url}>{t("verified.evidenceReview.record")}</a></li>
        </ul>
      </>}
      <div className="flex flex-wrap gap-5">
        <a className="text-primary underline" href={pdfUrl}>{t("verified.evidenceReview.pdf")}</a>
        <a className="text-primary underline" href={jsonUrl}>{t("verified.evidenceReview.json")}</a>
      </div>
    </main>
  );
}

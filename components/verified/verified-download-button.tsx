"use client";

import { useState, useRef } from "react";
import { pdf } from "@react-pdf/renderer";
import { VerifiedPDF } from "./verified-pdf";
import type { VerifiedReport } from "@/types/verified";

async function fetchLogoAsDataUri(): Promise<string | undefined> {
  try {
    const res = await fetch("/strhub-logo-pdf.png");
    const blob = await res.blob();
    return await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  } catch {
    return undefined;
  }
}

interface Props {
  report: VerifiedReport;
  slug: string;
}

export function VerifiedDownloadButton({ report, slug }: Props) {
  const [generating, setGenerating] = useState(false);
  const logoCache = useRef<string | undefined>(undefined);

  async function handleDownload() {
    setGenerating(true);
    try {
      if (!logoCache.current) {
        logoCache.current = await fetchLogoAsDataUri();
      }
      const blob = await pdf(
        <VerifiedPDF report={report} slug={slug} logoSrc={logoCache.current} />
      ).toBlob();
      const date = report.generated?.slice(0, 10) ?? "undated";
      const filename = `STRhub-Verified_${slug}_${date}.pdf`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={generating}
      className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted disabled:opacity-50"
    >
      {generating ? "Generating PDF..." : "Download attestation report (PDF)"}
    </button>
  );
}

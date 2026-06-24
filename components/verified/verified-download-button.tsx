"use client";

import { useState } from "react";
import type { VerifiedReport } from "@/types/verified";

const VERIFIED_BASE =
  process.env.NEXT_PUBLIC_VERIFIED_BASE ??
  "https://raw.githubusercontent.com/Tfronta/strhub-verified/gh-pages";

interface Props {
  report: VerifiedReport;
  slug: string;
}

export function VerifiedDownloadButton({ report, slug }: Props) {
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    setDownloading(true);
    try {
      const res = await fetch(`${VERIFIED_BASE}/${slug}.pdf`);
      if (!res.ok) throw new Error(`PDF not found (${res.status})`);
      const blob = await res.blob();
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
      console.error("PDF download failed:", err);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={downloading}
      className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted disabled:opacity-50"
    >
      {downloading ? "Downloading..." : "Download attestation report (PDF)"}
    </button>
  );
}

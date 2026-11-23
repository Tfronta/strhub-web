"use client";

import { Fragment } from "react";
import type { VerifiedManualI18n, VerifiedReport } from "@/types/verified";

const INLINE_CODE_SPLIT = /(`[^`\n]+`)/g;

/**
 * Render prose containing inline Markdown backticks (`code`) as styled monospace
 * spans instead of literal raw backticks.
 */
export function InlineCodeText({ text }: { text: string }) {
  if (!text.includes("`")) return <>{text}</>;
  const parts = text.split(INLINE_CODE_SPLIT);
  return (
    <>
      {parts.map((part, idx) => {
        if (part.length >= 2 && part.startsWith("`") && part.endsWith("`")) {
          return (
            <code
              key={idx}
              className="rounded bg-muted px-1 py-0.5 font-mono text-[0.86em] text-foreground"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return <Fragment key={idx}>{part}</Fragment>;
      })}
    </>
  );
}

/** Pick the active UI language's editorial manual prose when published in the JSON. */
export function manualLocale(
  report: Pick<VerifiedReport, "i18n">,
  language: "es" | "en" | "pt",
): VerifiedManualI18n | undefined {
  return report.i18n?.[language];
}

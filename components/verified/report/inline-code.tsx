"use client";

import { Fragment } from "react";
import type {
  VerifiedManualI18n,
  VerifiedPreparedFile,
  VerifiedRecommendation,
  VerifiedReport,
  VerifiedWithoutPreparation,
} from "@/types/verified";

const INLINE_CODE_SPLIT = /(`[^`\n]+`)/g;

/**
 * Coerce any JSON payload value (string, recommendation/blocker object, number,
 * boolean, null/undefined) into a safe renderable string so React never receives
 * a raw object or unformatted boolean child.
 */
export function toSafeInlineString(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (value == null || typeof value === "boolean") return "";
  if (typeof value === "object") {
    const rec = value as Record<string, unknown>;
    if (typeof rec.text === "string") return rec.text;
    if (typeof rec.reason === "string") return rec.reason;
    if (typeof rec.what === "string") return rec.what;
    if (typeof rec.blocker === "string") return rec.blocker;
  }
  return "";
}

/** Normalize a recommendation item (`string` or `{ code, text }`) to plain text. */
export function normalizeRecommendationText(
  item: VerifiedRecommendation | unknown,
): string {
  return toSafeInlineString(item).trim();
}

/** Normalize `preparation.without_preparation` (`string` or `{ blocker, basis, reason }`). */
export function normalizeWithoutPreparation(
  value: VerifiedWithoutPreparation | null | undefined | unknown,
): string {
  if (typeof value === "string") return value.trim();
  if (value && typeof value === "object") {
    const rec = value as Record<string, unknown>;
    if (typeof rec.reason === "string" && rec.reason.trim()) return rec.reason.trim();
    if (typeof rec.blocker === "string" && rec.blocker.trim()) return rec.blocker.trim();
  }
  return "";
}

/** Format `preparation.files[].replaces` (`boolean | string`) safely for display. */
export function formatFileReplaces(
  replaces: VerifiedPreparedFile["replaces"] | unknown,
  replacedFallbackLabel: string,
): string | null {
  if (typeof replaces === "string") {
    const trimmed = replaces.trim();
    return trimmed || null;
  }
  if (replaces === true) return replacedFallbackLabel;
  return null;
}

/**
 * Render prose containing inline Markdown backticks (`code`) as styled monospace
 * spans instead of literal raw backticks. Defensively formats non-string values.
 */
export function InlineCodeText({ text }: { text: unknown }) {
  const safe = toSafeInlineString(text);
  if (!safe) return null;
  if (!safe.includes("`")) return <>{safe}</>;
  const parts = safe.split(INLINE_CODE_SPLIT);
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

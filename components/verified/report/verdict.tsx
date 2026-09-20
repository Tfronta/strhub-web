"use client";

/**
 * Chapter one: the tool as it is in its repository. Its heading, then the
 * one sentence for a reader who does not program — the verdict's meaning and
 * reason, and what the README does not say — before the ladder that shows
 * where the run stopped. A trial slots its own block here (the same verdict,
 * with the two ways out that only a trial has).
 */
import type { ReactNode } from "react";
import { useLanguage } from "@/contexts/language-context";
import type { VerifiedReport } from "@/types/verified";
import { useHeaded } from "./certificate";

export function AsItIsOpening({ report, children }: { report: VerifiedReport; children?: ReactNode }) {
  const { t } = useLanguage();
  const v = report.verdict;
  const fallbackUsed = !!report.environment?.fallback_used;
  const meaning = v ? (v.code === "runs" && fallbackUsed ? "runsFallback" : v.code) : null;
  return (
    <>
      {!useHeaded() && <h2 className="mt-8 text-xl font-semibold">{t("verified.asIs.heading")}</h2>}
      {children ?? (v && (
        <section className="mt-3 rounded-lg border p-5" aria-labelledby="verified-verdict">
          <p id="verified-verdict" className="text-lg font-semibold">{t(`verified.trial.verdictMeaning.${meaning}`)}</p>
          <p className="mt-2 text-sm text-muted-foreground">{v.reason}</p>
          {v.readme_gaps && v.readme_gaps.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold">{t("verified.trial.gapsTitle")}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{t("verified.trial.gapsHint")}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                {v.readme_gaps.map((g) => <li key={g.item}>{g.text}</li>)}
              </ul>
            </div>
          )}
        </section>
      ))}
    </>
  );
}

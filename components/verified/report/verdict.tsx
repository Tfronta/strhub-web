"use client";

/**
 * Chapter one: the tool as it is in its repository. Its heading, then the
 * one sentence for a reader who does not program — Step 1 (the documented run)
 * and the verdict's meaning and reason, and what the README does not say —
 * before the ladder that shows where the run stopped. A trial slots its own
 * block here (the same Step 1 and verdict, with the two ways out that only a
 * trial has).
 */
import type { ReactNode } from "react";
import { ExternalLink, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import { step1For, type Step1Tone } from "@/lib/verified/step1";
import type { VerifiedReport } from "@/types/verified";
import { useHeaded } from "./certificate";

const STEP1_BORDER: Record<Step1Tone, string> = {
  green: "border-teal-600/60",
  red: "border-red-600/60",
  grey: "border-slate-400/60",
};

export function AsItIsOpening({ report, children }: { report: VerifiedReport; children?: ReactNode }) {
  const { t } = useLanguage();
  const v = report.verdict;
  const fallbackUsed = !!report.environment?.fallback_used;
  const step1 = step1For(report.step1, t);
  const meaning = v
    ? v.code === "runs" && fallbackUsed
      ? "runsFallback"
      : v.code === "undetermined" && step1?.code === "ours"
        ? "undeterminedOurs"
        : v.code
    : null;
  return (
    <>
      {!useHeaded() && <h2 className="mt-8 text-xl font-semibold">{t("verified.asIs.heading")}</h2>}
      {children ?? (
        <>
          {step1 && (
            <section
              className={`mt-3 rounded-lg border-2 p-5 ${STEP1_BORDER[step1.tone]}`}
              aria-labelledby="verified-step1"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {t("verified.trial.step1.heading")}
              </p>
              <p id="verified-step1" className="mt-1 text-lg font-semibold">
                {step1.headline}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{step1.body}</p>
              {step1.missing.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold">{step1.missingTitle}</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                    {step1.missing.map((block) => (
                      <li key={block}>{block}</li>
                    ))}
                  </ul>
                </div>
              )}
              {step1.code !== "runs" && (
                <Button asChild variant="outline" size="sm" className="mt-4">
                  <a href={step1.guideHref} target="_blank" rel="noreferrer">
                    {step1.guideLabel}
                    <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                  </a>
                </Button>
              )}
            </section>
          )}
          {v && (
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
              {v.code !== "runs" && (
                <div className="mt-5 rounded-lg border border-teal-200/80 bg-teal-50/50 p-4 dark:border-teal-900/60 dark:bg-teal-950/20">
                  <h3 className="flex items-center gap-1.5 text-sm font-semibold text-teal-950 dark:text-teal-200">
                    <LifeBuoy className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                    {t("verified.trial.reproTipsTitle")}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t("verified.trial.reproTipsSubtitle")}
                  </p>
                  <ul className="mt-2.5 list-disc space-y-1.5 pl-4 text-xs text-muted-foreground">
                    <li>{t("verified.trial.reproTips.outputDir")}</li>
                    <li>{t("verified.trial.reproTips.deps")}</li>
                    <li>{t("verified.trial.reproTips.exampleData")}</li>
                    <li>{t("verified.trial.reproTips.nonInteractive")}</li>
                  </ul>
                  <div className="mt-3">
                    <a
                      href="https://github.com/Tfronta/strhub-verified/blob/main/docs/GUIA-PASO-1.md"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-teal-700 hover:underline dark:text-teal-400"
                    >
                      {t("verified.trial.reproTips.guideLink")}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              )}
            </section>
          )}
        </>
      )}
    </>
  );
}

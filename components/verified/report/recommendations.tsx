"use client";

import { Lightbulb } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { localizeRecommendation } from "@/lib/verified/certificate";
import type { VerifiedReport } from "@/types/verified";

/**
 * What the README or the repository could add. Shown on every report that
 * carries it, whatever the verdict: a run that passed still tells its author
 * that the repository ships no example data. It never changes the result,
 * and what stopped a run is said by the verdict, not here.
 */
export function Recommendations({ report }: { report: VerifiedReport }) {
  const { t } = useLanguage();
  const recs = report.recommendations ?? [];
  if (recs.length === 0) return null;
  return (
    <section
      className="mt-4 rounded-lg border border-teal-200/60 bg-teal-50/40 p-5 dark:border-teal-900/50 dark:bg-teal-950/20"
      aria-labelledby="verified-recommendations"
    >
      <h3 id="verified-recommendations" className="flex items-center gap-1.5 text-sm font-semibold">
        <Lightbulb className="h-4 w-4 text-teal-600 dark:text-teal-400" />
        {t("verified.trial.recommendationsTitle")}
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">{t("verified.trial.recommendationsHint")}</p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
        {recs.map((r) => (
          <li key={r.code}>{localizeRecommendation(r, t)}</li>
        ))}
      </ul>
    </section>
  );
}

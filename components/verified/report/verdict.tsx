"use client";

/**
 * The verdict, on a published page: the one sentence for a reader who does
 * not program, before the ladder. The engine's HTML copy has led with it
 * since the verdict existed; the page never showed it, so a tool that
 * "could not be determined" would have read as "Installs" — the rung it
 * happened to reach — when the finding is about the README, not the tool.
 * The trial page has its own block, with the two ways out that only a trial
 * has; this is the same block without them.
 */
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";
import type { VerifiedReport } from "@/types/verified";
import { VERDICT_TONE } from "@/lib/verified/badge";

export function PublishedVerdict({ report }: { report: VerifiedReport }) {
  const { t } = useLanguage();
  const v = report.verdict;
  if (!v) return null;
  const fallbackUsed = !!report.environment?.fallback_used;
  const meaning = v.code === "runs" && fallbackUsed ? "runsFallback" : v.code;
  return (
    <section className="mt-6 rounded-lg border p-5" aria-labelledby="verified-verdict">
      <div className="flex flex-wrap items-center gap-3">
        <Badge className={`${VERDICT_TONE[v.code] ?? ""} border-transparent text-sm`}>
          {t(`verified.trial.verdict.${v.code}`)}
        </Badge>
        <h2 id="verified-verdict" className="text-lg font-semibold">
          {t(`verified.trial.verdictMeaning.${meaning}`)}
        </h2>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{v.reason}</p>
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
  );
}

"use client";

import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";
import { TONE, type LevelDisplay } from "./header";

/**
 * The four numbers a reviewer scans first, and the data by name: "1 reference
 * dataset(s)" told a reader nothing they could act on, when the sample's own
 * name is one line away.
 */
export function SummaryCard({
  level,
  gatesPassed,
  gatesTotal,
  datasetNames,
  generated,
  scope,
}: {
  level: LevelDisplay;
  gatesPassed: number;
  gatesTotal: number;
  datasetNames: string[];
  generated?: string;
  scope?: string;
}) {
  const { t } = useLanguage();
  return (
    <div className="mt-6 rounded-lg border bg-card p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        {t("verified.summary.heading")}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{t("verified.summary.level")}</p>
          <Badge className={cn("mt-1.5", TONE[level.tone])}>{level.label}</Badge>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{t("verified.gates")}</p>
          <p className="text-sm text-muted-foreground tabular-nums mt-1.5">
            {t("verified.summary.gatesPassed")
              .replace("{passed}", String(gatesPassed))
              .replace("{total}", String(gatesTotal))}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{t("verified.summary.datasets")}</p>
          <p className="text-sm text-muted-foreground mt-1.5">
            {datasetNames.length > 0 ? datasetNames.join("; ") : t("verified.summary.noDatasets")}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{t("verified.verifiedOn")}</p>
          <p className="text-sm text-muted-foreground mt-1.5">{generated?.slice(0, 10)}</p>
        </div>
      </div>
      {scope && (
        <p className="mt-4 text-sm text-muted-foreground border-t pt-3">{scope}</p>
      )}
    </div>
  );
}

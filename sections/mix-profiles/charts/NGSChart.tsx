// app/sections/mix-profiles/charts/NGSChart.tsx
"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Cell,
} from "recharts";
import type { NGSChartBar, NGSRow } from "../utils/simulate";
import { getChartColors } from "../data";
import { useLanguage } from "@/contexts/language-context";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import {
  formatMicrovariant,
  getPrimaryMotifForLocus,
  getContinuousSequenceWithRepeat,
  shouldShowIsoBadge,
} from "@/lib/strFormatting";
import { useMemo } from "react";

type Props = {
  bars: NGSChartBar[];
  rows: NGSRow[];
  locusId?: string;
  analyticalThreshold?: number;
  interpretationThreshold?: number;
};

// Resuelve una CSS var a color real (rgb/hex). Intenta varias vars por si una no existe.
function resolveThemeColor(fallback: string): string {
  if (typeof window === "undefined") return fallback;

  const varsToTry = [
    "--chart-2",
    "--chart-1",
    "--color-chart-2",
    "--color-chart-1",
  ];
  for (const v of varsToTry) {
    const probe = document.createElement("span");
    probe.style.position = "absolute";
    probe.style.visibility = "hidden";
    probe.style.color = `var(${v})`;
    document.body.appendChild(probe);
    const resolved = getComputedStyle(probe).color; // ej: rgb(5, 150, 105)
    probe.remove();
    if (
      resolved &&
      resolved !== "rgba(0, 0, 0, 0)" &&
      resolved !== "rgb(0, 0, 0)"
    ) {
      return resolved;
    }
  }
  return fallback;
}

export default function NGSChart({
  bars,
  rows,
  locusId,
  analyticalThreshold = 50,
  interpretationThreshold = 80,
}: Props) {
  const { t } = useLanguage();
  const motif = useMemo(
    () => (locusId ? getPrimaryMotifForLocus(locusId) : null),
    [locusId]
  );

  if (!bars?.length) return <div className="h-[320px]" />;

  const chartBars = bars.map((bar) => ({
    ...bar,
    alleleLabel: String(bar.allele),
  }));
  const chartKey = chartBars
    .map((bar) => `${bar.allele}-${bar.coverage}`)
    .join("|");
  const fallback = getChartColors()[0]; // por si falla la var CSS
  const themeColor = resolveThemeColor(fallback);

  return (
    <div className="space-y-4">
      {/* Tabla */}
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-3 py-2 text-center">
                {t("mixProfiles.ngs.tableAllele")}
              </th>
              <th className="px-3 py-2 text-center">
                <div className="flex items-center justify-center gap-1">
                  {t("mixProfiles.ngs.tableCoverage")}
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-full h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={t(
                          "mixProfiles.ngs.tableCoverageTooltipAria"
                        )}
                      >
                        <Info className="h-3.5 w-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="w-max">
                      <p className="text-xs whitespace-nowrap">
                        {t("mixProfiles.ngs.tableCoverageTooltip")}
                      </p>
                    </TooltipContent>
                  </UITooltip>
                </div>
              </th>
              <th className="px-3 py-2 text-left">
                {t("mixProfiles.ngs.tableRepeatSequence")}
              </th>
              <th className="px-3 py-2 text-left">
                <div className="flex items-center gap-1">
                  {t("mixProfiles.ngs.fullSequenceColumnLabel")}
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-full h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={t(
                          "mixProfiles.ngs.fullSequenceTooltipAria"
                        )}
                      >
                        <Info className="h-3.5 w-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="w-max max-w-md">
                      <p className="text-xs">
                        {t("mixProfiles.ngs.fullSequenceNote")}
                      </p>
                    </TooltipContent>
                  </UITooltip>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              const sortedRows = rows
                .slice()
                .sort((a, b) => {
                  const aStr = String(a.allele);
                  const bStr = String(b.allele);
                  if (aStr === bStr) {
                    return (a.fullSequence ?? "").localeCompare(
                      b.fullSequence ?? ""
                    );
                  }
                  const aNum = Number(aStr.replace(/[^\d.]/g, ""));
                  const bNum = Number(bStr.replace(/[^\d.]/g, ""));
                  if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) {
                    return aNum - bNum;
                  }
                  return aStr.localeCompare(bStr);
                });
              return sortedRows.map((r, i) => (
                <tr
                  key={r.sequenceId ?? `${r.allele}-${i}`}
                  className="odd:bg-background even:bg-muted/10"
                >
                  <td className="px-3 py-2 text-center">
                    <span className="inline-flex items-center gap-1">
                      {r.allele}
                      {shouldShowIsoBadge(r, sortedRows) ? (
                        <TooltipProvider>
                          <UITooltip>
                            <TooltipTrigger asChild>
                              <span className="text-[11px] text-muted-foreground cursor-help">
                                iso
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs text-sm leading-snug">
                              {t("mixProfiles.ngs.isoTooltip")}
                            </TooltipContent>
                          </UITooltip>
                        </TooltipProvider>
                      ) : null}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center">{r.coverage}</td>
                  <td className="px-3 py-2 text-left font-mono text-xs break-words">
                    {motif
                      ? formatMicrovariant(String(r.allele), motif)
                      : (r.repeatSequence ?? "—")}
                  </td>
                  <td className="px-3 py-2 text-left font-mono text-xs break-words">
                    {(() => {
                      const raw = String(r.fullSequence ?? "").trim();
                      if (!raw) return <span>—</span>;
                      const {
                        continuous,
                        repeatStart,
                        repeatEnd,
                      } = getContinuousSequenceWithRepeat(raw);
                      if (!continuous) return <span>—</span>;
                      const hasHighlight =
                        repeatStart != null &&
                        repeatEnd != null &&
                        repeatStart < repeatEnd;
                      return (
                        <span className="inline">
                          {hasHighlight ? (
                            <>
                              {continuous.slice(0, repeatStart!).length > 0 ? (
                                <TooltipProvider>
                                  <UITooltip>
                                    <TooltipTrigger asChild>
                                      <span className="text-muted-foreground cursor-default">
                                        {continuous.slice(0, repeatStart!)}
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-muted text-muted-foreground border-muted-foreground/20">
                                      <p className="text-xs">
                                        {t(
                                          "mixProfiles.ngs.flank5Tooltip"
                                        )}
                                      </p>
                                    </TooltipContent>
                                  </UITooltip>
                                </TooltipProvider>
                              ) : (
                                continuous.slice(0, repeatStart!)
                              )}
                              <TooltipProvider>
                                <UITooltip>
                                  <TooltipTrigger asChild>
                                    <span className="font-semibold text-foreground bg-primary/15 dark:bg-primary/20 rounded">
                                      {continuous.slice(
                                        repeatStart!,
                                        repeatEnd!
                                      )}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">
                                      {t(
                                        "mixProfiles.ngs.repeatRegionTooltip"
                                      )}
                                    </p>
                                  </TooltipContent>
                                </UITooltip>
                              </TooltipProvider>
                              {continuous.slice(repeatEnd!).length > 0 ? (
                                <TooltipProvider>
                                  <UITooltip>
                                    <TooltipTrigger asChild>
                                      <span className="text-muted-foreground cursor-default">
                                        {continuous.slice(repeatEnd!)}
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-muted text-muted-foreground border-muted-foreground/20">
                                      <p className="text-xs">
                                        {t(
                                          "mixProfiles.ngs.flank3Tooltip"
                                        )}
                                      </p>
                                    </TooltipContent>
                                  </UITooltip>
                                </TooltipProvider>
                              ) : (
                                continuous.slice(repeatEnd!)
                              )}
                            </>
                          ) : (
                            continuous
                          )}
                        </span>
                      );
                    })()}
                  </td>
                </tr>
              ));
            })()}
          </tbody>
        </table>
      </div>

      {/* Barras */}
      <div className="w-full h-[320px]">
        <ResponsiveContainer width="100%" height="100%" key={chartKey}>
          <BarChart
            data={chartBars}
            margin={{ top: 10, right: 16, bottom: 16, left: 8 }}
            barCategoryGap="25%"
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis
              dataKey="alleleLabel"
              type="category"
              allowDuplicatedCategory={false}
              label={{
                value: t("mixProfiles.ngs.axisLabelAllele"),
                position: "insideBottom",
                offset: -8,
              }}
            />
            <YAxis
              domain={["auto", "auto"]}
              label={{
                value: t("mixProfiles.ngs.axisLabelCoverage"),
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle" },
              }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const coverageLabel = t("mixProfiles.ngs.tableCoverage");
                const value = payload[0]?.value;
                return (
                  <div className="rounded-lg border bg-background px-3 py-2 text-sm shadow-md">
                    <p className="font-medium">{label}</p>
                    <p className="text-muted-foreground">
                      {coverageLabel} : {value}
                    </p>
                  </div>
                );
              }}
            />

            {/* Forzamos el color de tema, nunca negro */}
            <Bar
              dataKey="coverage"
              isAnimationActive={false}
              fill={themeColor}
              stroke={themeColor}
              radius={[6, 6, 0, 0]}
            >
              {chartBars.map((_, idx) => (
                <Cell key={idx} fill={themeColor} stroke={themeColor} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

"use client";
import { useEffect, useState, useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ReferenceLine,
  Scatter,
  Legend,
} from "recharts";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useLanguage } from "@/contexts/language-context";

type Pt = { allele: number; rfu: number };
type Marker = {
  allele: number;
  rfu: number;
  kind: "dropout" | "stutter" | "true";
};

export default function CEChart(props: {
  dataTrue: Pt[];
  dataStutter: Pt[];
  markers?: Marker[];
  analyticalThreshold?: number;
  interpretationThreshold?: number;
  showMarkers?: boolean;
  baselineRFU?: number;
  baselineNoiseTrace?: Pt[]; // Sparse trace for line rendering
  noisePeaks?: Pt[]; // Discrete micro-peaks for scatter rendering
  allTruePeaks?: Array<{ allele: number | string; rfu: number }>; // All true peaks for tick calculation
  stutterPeaks?: Array<{
    allele: number | string;
    rfu: number;
    source?: string;
  }>; // All stutter peaks for tick calculation (source contains parent info)
  useFixedScale?: boolean; // If true, use fixed scale (0-800 RFU), otherwise auto-scale
  truePeakAreas?: Map<number, number>; // Numerically integrated area per true peak
  stutterPeakAreas?: Map<number, number>; // Numerically integrated area per stutter peak
}) {
  const {
    dataTrue,
    dataStutter,
    markers = [],
    analyticalThreshold,
    interpretationThreshold,
    showMarkers = true,
    baselineRFU,
    baselineNoiseTrace = [],
    noisePeaks = [],
    allTruePeaks = [],
    stutterPeaks = [],
    useFixedScale = false,
    truePeakAreas,
    stutterPeakAreas,
  } = props;

  // Evita medir antes de montar (soluciona width/height -1 en algunos layouts)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Translations
  const { t } = useLanguage();

  // datasets para scatters por tipo
  const mTrue = markers.filter((m) => m.kind === "true");
  const mStutter = markers.filter((m) => m.kind === "stutter");
  const mDrop = markers.filter((m) => m.kind === "dropout");

  // Solo dibujar la curva de STUTTER cerca de los picos marcados
  const stutterVisible = useMemo(() => {
    if (!dataStutter || dataStutter.length === 0) return [];

    // Posiciones exactas de los stutters (markers)
    const stutterAlleles = mStutter
      .map((m) =>
        typeof m.allele === "number" ? m.allele : parseFloat(String(m.allele)),
      )
      .filter((v) => !Number.isNaN(v));

    // Si algo falló → usar la serie completa
    if (stutterAlleles.length === 0) return dataStutter;

    const windowSize = 0.35; // rango alrededor del stutter

    return dataStutter.map((pt) => {
      const pos =
        typeof pt.allele === "number"
          ? pt.allele
          : parseFloat(String(pt.allele));

      const isNear =
        !Number.isNaN(pos) &&
        stutterAlleles.some((a) => Math.abs(a - pos) <= windowSize);

      // Si está lejos → ocultar completamente (retornar objeto con rfu: null)
      return {
        ...pt,
        rfu: isNear ? pt.rfu : null,
      };
    });
  }, [dataStutter, mStutter]);

  // Build ticks from real peaks - use peak.allele directly (as strings or numbers)
  // Include: (a) all true peaks (blue series), (b) stutter peaks >= AT (orange series)
  // Never round or modify allele values - use them exactly as they appear in peaks
  const alleleValues = useMemo(() => {
    const alleleSet = new Set<number | string>();

    // Helper to normalize allele to number (for sorting) while preserving original value
    const normalizeAllele = (a: number | string): number | null => {
      if (typeof a === "number") {
        if (Number.isNaN(a)) return null;
        return a;
      }
      const num = parseFloat(String(a));
      return !Number.isNaN(num) ? num : null;
    };

    // Collect alleles from true peaks (all true peaks are visible in blue series)
    // Use peak.allele directly - don't round or modify
    for (const peak of allTruePeaks) {
      if (peak.rfu > 0) {
        // Use allele value directly (string or number) - preserve microvariants
        const allele = peak.allele;
        if (allele != null && allele !== "") {
          // Normalize to number for set comparison (handles "13" vs 13)
          const normalized = normalizeAllele(allele);
          if (normalized != null) {
            // Store as number for consistent sorting, but preserve decimal precision
            alleleSet.add(normalized);
          }
        }
      }
    }

    // Collect alleles from stutter peaks (only those >= AT are visible as markers)
    // Use peak.allele directly - don't round or modify
    for (const peak of stutterPeaks) {
      if (peak.rfu >= (analyticalThreshold ?? 0)) {
        const allele = peak.allele;
        if (allele != null && allele !== "") {
          const normalized = normalizeAllele(allele);
          if (normalized != null) {
            alleleSet.add(normalized);
          }
        }
      }
    }

    // Fallback: if no peaks provided, extract from data traces
    if (alleleSet.size === 0) {
      const allData = [...dataTrue, ...dataStutter];
      for (const pt of allData) {
        if (!Number.isNaN(pt.allele) && pt.rfu > 0) {
          alleleSet.add(pt.allele);
        }
      }
    }

    if (alleleSet.size === 0) return [];

    // Convert to array and sort numerically
    // This preserves microvariants (e.g., 17.3, 19.1) exactly as they appear
    const alleles = Array.from(alleleSet)
      .map((a) => (typeof a === "number" ? a : parseFloat(String(a))))
      .filter((n) => !Number.isNaN(n))
      .sort((a, b) => a - b);

    if (alleles.length === 0) return [];

    // Get min and max allele values
    const minA = Math.floor(alleles[0]);
    const maxA = Math.ceil(alleles[alleles.length - 1]);

    // Fill integers between min and max (ensures last/first numbers render, e.g., includes 13)
    const filledTicks = new Set<number>();

    // Add all visible allele positions (preserves microvariants like 17.3, 19.1)
    for (const a of alleles) {
      filledTicks.add(a);
    }

    // Fill integers between min and max
    for (let i = minA; i <= maxA; i++) {
      filledTicks.add(i);
    }

    // Return sorted array (includes visible positions + filled integers)
    return Array.from(filledTicks).sort((a, b) => a - b);
  }, [allTruePeaks, stutterPeaks, analyticalThreshold, dataTrue, dataStutter]);

  // Determine if we need decimals based on allele values from peaks
  const hasDecimals = useMemo(() => {
    // Check allTruePeaks and stutterPeaks for microvariants
    const checkPeak = (peak: { allele: number | string }) => {
      if (typeof peak.allele === "number") {
        return peak.allele % 1 !== 0;
      }
      const num = parseFloat(String(peak.allele));
      return !Number.isNaN(num) && num % 1 !== 0;
    };

    const hasDecimalInTrue = (allTruePeaks || []).some(checkPeak);
    const hasDecimalInStutter = (stutterPeaks || []).some(checkPeak);
    const hasDecimalInMarkers = markers.some((m) => {
      const num =
        typeof m.allele === "number" ? m.allele : parseFloat(String(m.allele));
      return !Number.isNaN(num) && num % 1 !== 0;
    });

    return hasDecimalInTrue || hasDecimalInStutter || hasDecimalInMarkers;
  }, [allTruePeaks, stutterPeaks, markers]);

  // Calculate domain from allele values - ensure last peak is fully visible
  const domain = useMemo(() => {
    if (alleleValues.length > 0) {
      const minA = Math.min(...alleleValues);
      const maxA = Math.max(...alleleValues);
      // Add small padding to ensure last peak is fully visible (off-by-one fix)
      // Use floor/ceil to handle microvariants correctly
      return [Math.floor(minA) - 0.5, Math.ceil(maxA) + 0.5];
    }
    // Fallback: use data traces to determine domain
    const allData = [...dataTrue, ...dataStutter];
    if (allData.length > 0) {
      const alleles = allData
        .map((d) => d.allele)
        .filter((a) => !Number.isNaN(a));
      if (alleles.length > 0) {
        const minA = Math.min(...alleles);
        const maxA = Math.max(...alleles);
        // Ensure last peak is visible
        return [Math.floor(minA) - 0.5, Math.ceil(maxA) + 0.5];
      }
    }
    return ["auto", "auto"];
  }, [alleleValues, dataTrue, dataStutter]);

  if (!mounted) return <div style={{ height: 420 }} />;

  return (
    <div className="relative w-full h-[420px]">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label={t("mixProfiles.ceChart.infoLabel")}
            className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full border text-[10px] text-muted-foreground bg-background/80 backdrop-blur-sm hover:bg-accent transition z-10"
          >
            <Info className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="left" align="end" className="max-w-xs text-xs">
          {t("mixProfiles.ceChart.infoText")}
        </TooltipContent>
      </Tooltip>

      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <LineChart margin={{ top: 12, right: 20, bottom: 0, left: 20 }}>
          {/* Ejes - sin gridlines horizontales */}
          <XAxis
            type="number"
            dataKey="allele"
            domain={domain}
            ticks={alleleValues.length > 0 ? alleleValues : undefined}
            allowDecimals={hasDecimals}
            label={{
              value: t("mixProfiles.ceChart.axisAllele"),
              position: "insideBottom",
              offset: -10,
            }}
            // Force display of all ticks, including microvariants and last peak
            interval={0}
            // Format ticks to preserve microvariants (show decimals when needed)
            tickFormatter={(value) => {
              // Check if this value is a microvariant (has decimal part)
              if (value % 1 === 0) {
                return String(value); // Integer: show as "13"
              }
              // Decimal: show with 1 decimal place (e.g., "17.3", "19.1")
              return value.toFixed(1);
            }}
          />
          <YAxis
            type="number"
            domain={useFixedScale ? [0, 800] : [0, "auto"]}
            label={{
              value: t("mixProfiles.ceChart.axisRFU"),
              angle: -90,
              position: "insideLeft",
            }}
          />

          {/* Baseline noise - render FIRST so it appears behind signal curves (discrete micro-peaks) */}
          {/* Baseline noise must be discrete micro-peaks, not a straight line or second floor */}
          {noisePeaks && noisePeaks.length > 0 && (
            <Line
              name={t("mixProfiles.ceChart.legendBaselineNoise")}
              type="monotone"
              data={baselineNoiseTrace}
              dataKey="rfu"
              dot={false}
              stroke="#666" // Gray (as specified)
              strokeOpacity={1} // Very faint (subtle background)
              strokeWidth={0.7}
              connectNulls={false}
              isAnimationActive={false}
            />
          )}

          {/* Signal curves - render AFTER baseline so they appear on top (pure values, start from 0) */}
          <Line
            name={t("mixProfiles.ceChart.legendTrueAlleles")}
            type="monotone"
            data={dataTrue}
            dataKey="rfu"
            dot={false}
            stroke="#2563EB" // Blue
            strokeWidth={2}
            isAnimationActive={false}
          />

          <Line
            name={t("mixProfiles.ceChart.legendStutter")}
            type="monotone"
            data={stutterVisible}
            dataKey="rfu"
            dot={false}
            stroke="#DC2626"
            strokeOpacity={0.9}
            strokeWidth={2.2}
            connectNulls={false}
            isAnimationActive={false}
          />

          {/* Markers - render AFTER curves so they appear on top (clearly visible) */}
          {showMarkers && mTrue.length > 0 && (
            <Scatter
              name={t("mixProfiles.ceChart.legendCalled")}
              data={mTrue.map((m) => ({ ...m, rfu: m.rfu + 10 }))}
              dataKey="rfu"
              shape="star"
              r={4}
              fill="#15803d" // Green-700
              isAnimationActive={false}
            />
          )}
          {showMarkers && mDrop.length > 0 && (
            <Scatter
              name={t("mixProfiles.ceChart.legendDropoutRisk")}
              data={mDrop.map((m) => ({ ...m, rfu: m.rfu + 10 }))}
              dataKey="rfu"
              fill="#F59E0B"
              shape="circle"
              r={4}
              isAnimationActive={false}
            />
          )}
          {/* Líneas de umbral - solo AT y ST con labels (sin otras líneas) */}
          {analyticalThreshold != null && (
            <ReferenceLine
              y={analyticalThreshold}
              stroke="#9CA3AF"
              strokeDasharray="6 6"
              strokeWidth={1}
              label={{
                value: t("mixProfiles.ceChart.thresholdAT"),
                position: "right",
                offset: 5,
                fill: "#6B7280",
                fontSize: 12,
              }}
            />
          )}
          {interpretationThreshold != null && (
            <ReferenceLine
              y={interpretationThreshold}
              stroke="#6B7280"
              strokeDasharray="4 4"
              strokeWidth={1}
              label={{
                value: t("mixProfiles.ceChart.thresholdST"),
                position: "right",
                offset: 5,
                fill: "#6B7280",
                fontSize: 12,
              }}
            />
          )}

          <RechartsTooltip
            content={({ active, label }: any) => {
              if (!active) return null;

              const cursorX =
                typeof label === "number" ? label : parseFloat(String(label));
              if (Number.isNaN(cursorX)) return null;

              /* ---------- helpers ---------- */
              const PEAK_WINDOW = 0.4; // ±allele units (≈10σ)

              type PeakHit = {
                allele: number;
                rfu: number;
                dist: number;
                source?: string;
              };

              const findNearest = (
                peaks: Array<{
                  allele: number | string;
                  rfu: number;
                  source?: string;
                }>,
                maxDist: number,
              ): PeakHit | null => {
                let best: PeakHit | null = null;
                for (const p of peaks) {
                  const pos =
                    typeof p.allele === "number"
                      ? p.allele
                      : parseFloat(String(p.allele));
                  if (Number.isNaN(pos)) continue;
                  const dist = Math.abs(pos - cursorX);
                  if (dist <= maxDist && (!best || dist < best.dist)) {
                    best = {
                      allele: pos,
                      rfu: p.rfu,
                      dist,
                      source: (p as any).source,
                    };
                  }
                }
                return best;
              };

              const lookupArea = (
                allelePos: number,
                areasMap?: Map<number, number>,
              ): string | null => {
                if (!areasMap || Number.isNaN(allelePos)) return null;
                let area = areasMap.get(allelePos);
                if (area == null) {
                  for (const [k, v] of areasMap) {
                    if (Math.abs(k - allelePos) < 0.1) {
                      area = v;
                      break;
                    }
                  }
                }
                return area != null ? String(Math.round(area)) : null;
              };

              const fmtAllele = (v: number) =>
                v % 1 === 0 ? String(v) : v.toFixed(1);

              /* ---------- find nearest peaks ---------- */
              const hitTrue = findNearest(allTruePeaks, PEAK_WINDOW);
              const hitStutter = findNearest(stutterPeaks, PEAK_WINDOW);

              // Nothing near cursor → hide tooltip
              if (!hitTrue && !hitStutter) return null;

              // Decide which peak the cursor is closest to overall
              const primaryIsTrue =
                hitTrue && (!hitStutter || hitTrue.dist <= hitStutter.dist);

              /* ---------- build lines ---------- */
              const lines: React.ReactNode[] = [];

              if (primaryIsTrue && hitTrue) {
                const alleleStr = fmtAllele(hitTrue.allele);
                const rfuMax = Math.round(hitTrue.rfu);

                // Check for colocated stutter at the same allele
                const colocatedStutter = stutterPeaks.find((sp) => {
                  const spA =
                    typeof sp.allele === "number"
                      ? sp.allele
                      : parseFloat(String(sp.allele));
                  return Math.abs(spA - hitTrue.allele) < 0.1;
                });

                // Header
                lines.push(
                  <p key="hdr" className="font-semibold">
                    {t("mixProfiles.ceChart.tooltipAllele", {
                      allele: alleleStr,
                    })}
                  </p>,
                );

                // RFU line
                if (colocatedStutter) {
                  const stRfu = Math.round(colocatedStutter.rfu);
                  const pureRfu = rfuMax - stRfu;
                  lines.push(
                    <p key="rfu" style={{ color: "#2563EB" }}>
                      {t("mixProfiles.ceChart.tooltipTrueWithStutter", {
                        label: alleleStr,
                        trueRfu: String(pureRfu),
                        stutterRfu: String(stRfu),
                      })}
                      {": "}
                      {rfuMax} RFU
                    </p>,
                  );
                  // Separate stutter line in red
                  lines.push(
                    <p key="stutter" style={{ color: "#DC2626" }}>
                      {t("mixProfiles.ceChart.tooltipStutter", {
                        allele: alleleStr,
                        parent: String(hitTrue.allele + 1),
                        rfu: String(stRfu),
                      })}
                    </p>,
                  );
                } else {
                  lines.push(
                    <p key="rfu" style={{ color: "#2563EB" }}>
                      {t("mixProfiles.ceChart.tooltipTrue", {
                        label: alleleStr,
                        rfu: String(rfuMax),
                      })}
                    </p>,
                  );
                }

                // Area
                const areaStr = lookupArea(hitTrue.allele, truePeakAreas);
                if (areaStr) {
                  lines.push(
                    <p key="area" className="text-muted-foreground">
                      {t("mixProfiles.ceChart.tooltipArea", {
                        area: areaStr,
                      })}
                    </p>,
                  );
                }

                // Status (called / dropout)
                if (rfuMax >= (interpretationThreshold ?? 0)) {
                  lines.push(
                    <p key="status" style={{ color: "#15803d" }}>
                      {t("mixProfiles.ceChart.tooltipCalled")}
                    </p>,
                  );
                } else if (rfuMax >= (analyticalThreshold ?? 0)) {
                  lines.push(
                    <p key="status" style={{ color: "#F59E0B" }}>
                      {t("mixProfiles.ceChart.tooltipDropout")}
                    </p>,
                  );
                }
              } else if (hitStutter) {
                const alleleStr = fmtAllele(hitStutter.allele);
                const rfuMax = Math.round(hitStutter.rfu);

                lines.push(
                  <p key="hdr" className="font-semibold">
                    {t("mixProfiles.ceChart.tooltipAllele", {
                      allele: alleleStr,
                    })}
                  </p>,
                );

                lines.push(
                  <p key="rfu" style={{ color: "#DC2626" }}>
                    {t("mixProfiles.ceChart.tooltipStutter", {
                      allele: alleleStr,
                      parent: String(hitStutter.allele + 1),
                      rfu: String(rfuMax),
                    })}
                  </p>,
                );

                const areaStr = lookupArea(hitStutter.allele, stutterPeakAreas);
                if (areaStr) {
                  lines.push(
                    <p key="area" className="text-muted-foreground">
                      {t("mixProfiles.ceChart.tooltipArea", {
                        area: areaStr,
                      })}
                    </p>,
                  );
                }
              }

              if (!lines.length) return null;

              return (
                <div className="rounded-lg border bg-background px-3 py-2 text-xs shadow-md space-y-0.5">
                  {lines}
                </div>
              );
            }}
          />
          <Legend
            verticalAlign="bottom"
            wrapperStyle={{ paddingTop: "20px", paddingBottom: "5px" }}
            content={({ payload }) => {
              if (!payload || !payload.length) return null;
              return (
                <ul
                  className="recharts-default-legend"
                  style={{ padding: 0, margin: 0, textAlign: "center" }}
                >
                  {payload.map((entry, index) => {
                    const isCalled =
                      entry.value === t("mixProfiles.ceChart.legendCalled") ||
                      entry.value === "Called";

                    return (
                      <li
                        key={`legend-item-${index}`}
                        className={`recharts-legend-item legend-item-${index}`}
                        style={{ display: "inline-block", marginRight: "10px" }}
                      >
                        {isCalled ? (
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill={entry.color || "#22C55E"}
                            style={{
                              display: "inline-block",
                              verticalAlign: "middle",
                              marginRight: "4px",
                            }}
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ) : (
                          <span
                            className="recharts-legend-icon"
                            style={{
                              display: "inline-block",
                              width: "14px",
                              height: "14px",
                              backgroundColor: entry.color,
                              borderRadius: "50%",
                              marginRight: "4px",
                              verticalAlign: "middle",
                            }}
                          />
                        )}
                        <span className="recharts-legend-item-text">
                          {entry.value}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              );
            }}
            // Legend shows only visible series (controlled by conditional rendering)
            // Order matches render order:
            // 1. Baseline noise (if visible)
            // 2. True alleles / Signal (RFU) - always visible
            // 3. Stutter (RFU) - always visible
            // 4. Called (if markers visible and >= ST)
            // 5. Drop-out risk (if markers visible and AT <= RFU < ST)
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

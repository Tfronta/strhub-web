"use client";
import { useEffect, useState, useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  Scatter,
  Legend,
} from "recharts";
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

  if (!mounted) return <div style={{ height: 320 }} />;

  console.log("@@showMarkers", showMarkers);
  console.log("@@mTrue", mTrue);
  console.log("@@dataTrue", dataTrue);
  return (
    <ResponsiveContainer width="100%" height={320} minWidth={0}>
      <LineChart margin={{ top: 12, right: 20, bottom: 50, left: 20 }}>
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
          domain={[0, "auto"]}
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
            isAnimationActive={false}
            connectNulls={false}
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
          data={dataStutter}
          dataKey="rfu"
          dot={false}
          stroke="#F59E0B" // Orange
          strokeOpacity={0.6}
          strokeWidth={1.5}
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
            data={mDrop}
            fill="#EF4444"
            shape="star"
            r={6}
          />
        )}
        {showMarkers && mStutter.length > 0 && (
          <Scatter
            name={t("mixProfiles.ceChart.legendStutterPeak")}
            data={mStutter}
            fill="#F59E0B"
            shape="triangle"
            r={6}
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

        <Tooltip
          formatter={(value: any, name: string, itemProps: any) => {
            // Round RFU value for all series
            const rfu = Math.round(value as number);
            const rfuStr = String(rfu);

            // Check if this is a stutter peak with parent info
            if (itemProps?.payload?.source) {
              const parentMatch =
                itemProps.payload.source.match(/parent:([\d.]+)/);
              if (
                parentMatch &&
                (name === t("mixProfiles.ceChart.legendStutter") ||
                  name.includes("Stutter"))
              ) {
                // This is a stutter peak - show allele and parent
                const alleleLabel =
                  itemProps?.payload?.allele ??
                  itemProps?.payload?.label ??
                  "?";
                return [
                  `${rfuStr} RFU`,
                  t("mixProfiles.ceChart.tooltipStutter", {
                    allele: String(alleleLabel),
                    parent: parentMatch[1],
                    rfu: rfuStr,
                  }),
                ];
              }
            }

            // Check if this is a true peak
            if (
              name === t("mixProfiles.ceChart.legendTrueAlleles") ||
              name.includes("Signal")
            ) {
              const alleleLabel =
                itemProps?.payload?.allele ?? itemProps?.payload?.label ?? "?";
              return [
                `${rfuStr} RFU`,
                t("mixProfiles.ceChart.tooltipTrue", {
                  label: String(alleleLabel),
                  rfu: rfuStr,
                }),
              ];
            }

            // Check if this is a marker (called or dropout)
            const isCalled =
              name === t("mixProfiles.ceChart.legendCalled") ||
              name === "Called";
            const isDropout =
              name === t("mixProfiles.ceChart.legendDropoutRisk") ||
              name === "Drop-out risk";

            if (isCalled) {
              return [`${rfuStr} RFU`, t("mixProfiles.ceChart.tooltipCalled")];
            }
            if (isDropout) {
              return [`${rfuStr} RFU`, t("mixProfiles.ceChart.tooltipDropout")];
            }

            // Default: show RFU value
            return [`${rfuStr} RFU`, name];
          }}
          labelFormatter={(label: any, payload: readonly any[]) => {
            if (!payload || payload.length === 0) {
              return t("mixProfiles.ceChart.tooltipAllele", { allele: label });
            }

            // Check if this is a scatter point (has actual allele data in payload)
            // Scatter points have payload.payload.allele matching the label
            const isScatterPoint = payload.some(
              (item: any) =>
                item.payload &&
                typeof item.payload.allele !== "undefined" &&
                Math.abs(item.payload.allele - label) < 0.01
            );

            if (isScatterPoint) {
              // For scatter points, find the scatter series (not the line series)
              // Note: name may be localized, so we check against all possible marker names
              const scatterItem = payload.find(
                (item: any) =>
                  item.name === t("mixProfiles.ceChart.legendCalled") ||
                  item.name === t("mixProfiles.ceChart.legendStutterPeak") ||
                  item.name === t("mixProfiles.ceChart.legendDropoutRisk") ||
                  item.name === "Called" ||
                  item.name === "Stutter peak" ||
                  item.name === "Drop-out risk"
              );

              if (scatterItem) {
                // Check if it's a stutter with parent info
                if (scatterItem.payload?.source) {
                  const parentMatch =
                    scatterItem.payload.source.match(/parent:([\d.]+)/);
                  if (parentMatch) {
                    const rfu = Math.round(scatterItem.payload.rfu ?? 0);
                    const alleleLabel = scatterItem.payload.allele ?? label;
                    return t("mixProfiles.ceChart.tooltipStutter", {
                      allele: String(alleleLabel),
                      parent: parentMatch[1],
                      rfu: String(rfu),
                    });
                  }
                }

                return t("mixProfiles.ceChart.tooltipAlleleMarker", {
                  allele: String(label),
                  marker: scatterItem.name,
                });
              }
            }

            // For line series, check if it's a stutter with parent
            const lineItem = payload.find(
              (item: any) =>
                item.name === t("mixProfiles.ceChart.legendStutter") ||
                item.name === "Stutter (RFU)" ||
                item.name?.includes("Stutter")
            );
            if (lineItem?.payload?.source) {
              const parentMatch =
                lineItem.payload.source.match(/parent:([\d.]+)/);
              if (parentMatch) {
                const rfu = Math.round(
                  lineItem.payload.rfu ?? lineItem.value ?? 0
                );
                const alleleLabel = lineItem.payload.allele ?? label;
                return t("mixProfiles.ceChart.tooltipStutter", {
                  allele: String(alleleLabel),
                  parent: parentMatch[1],
                  rfu: String(rfu),
                });
              }
            }

            // For line series, just show "Allele X"
            return t("mixProfiles.ceChart.tooltipAllele", { allele: label });
          }}
        />
        <Legend
          verticalAlign="bottom"
          wrapperStyle={{ paddingTop: "20px" }}
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
                            borderRadius: entry.value?.includes("Stutter peak")
                              ? "0"
                              : "50%",
                            marginRight: "4px",
                            verticalAlign: "middle",
                            clipPath: entry.value?.includes("Stutter peak")
                              ? "polygon(50% 0%, 0% 100%, 100% 100%)"
                              : undefined,
                            transform: entry.value?.includes("Stutter peak")
                              ? "rotate(0deg)"
                              : undefined,
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
          // 6. Stutter peak (if markers visible and stutter >= AT)
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

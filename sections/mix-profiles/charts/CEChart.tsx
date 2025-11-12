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
  baselineNoiseTrace?: Pt[]; // Smooth wavy baseline trace
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
  } = props;

  // Evita medir antes de montar (soluciona width/height -1 en algunos layouts)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // datasets para scatters por tipo
  const mTrue = markers.filter((m) => m.kind === "true");
  const mStutter = markers.filter((m) => m.kind === "stutter");
  const mDrop = markers.filter((m) => m.kind === "dropout");

  // Extract all unique allele values from markers for X-axis ticks
  const alleleValues = useMemo(() => {
    // First, try to get alleles from markers (these are the actual called alleles)
    if (markers.length > 0) {
      const markerAlleles = markers
        .map((m) => m.allele)
        .filter((a) => !Number.isNaN(a));
      if (markerAlleles.length > 0) {
        // Normalize near-integer values first, then get unique values and sort
        const normalized = markerAlleles.map((a) => {
          // Normalize values that are essentially integers (within 0.01)
          const rounded = Math.round(a);
          return Math.abs(a - rounded) < 0.01 ? rounded : a;
        });
        const unique = Array.from(new Set(normalized)).sort((a, b) => a - b);
        return unique;
      }
    }

    // Fallback: extract integer allele values from data range
    const allData = [...dataTrue, ...dataStutter];
    if (allData.length === 0) return [];

    const alleles = allData
      .map((d) => d.allele)
      .filter((a) => !Number.isNaN(a));

    if (alleles.length === 0) return [];

    // Generate integer ticks for the range
    const minA = Math.floor(Math.min(...alleles));
    const maxA = Math.ceil(Math.max(...alleles));
    const ticks: number[] = [];
    for (let i = minA; i <= maxA; i++) {
      ticks.push(i);
    }
    return ticks;
  }, [markers, dataTrue, dataStutter]);

  // Determine if we need decimals based on marker allele values
  const hasDecimals = useMemo(() => {
    return markers.some((m) => m.allele % 1 !== 0);
  }, [markers]);

  // Calculate domain from data if needed
  const domain = useMemo(() => {
    if (alleleValues.length > 0) {
      const minA = Math.min(...alleleValues);
      const maxA = Math.max(...alleleValues);
      return [minA - 0.5, maxA + 0.5];
    }
    return ["auto", "auto"];
  }, [alleleValues]);

  if (!mounted) return <div style={{ height: 320 }} />;

  return (
    <ResponsiveContainer width="100%" height={320} minWidth={0}>
      <LineChart margin={{ top: 12, right: 20, bottom: 50, left: 20 }}>
        {/* Ejes */}
        <XAxis
          type="number"
          dataKey="allele"
          domain={domain}
          ticks={alleleValues.length > 0 ? alleleValues : undefined}
          allowDecimals={hasDecimals}
          label={{ value: "Allele", position: "insideBottom", offset: -10 }}
        />
        <YAxis
          type="number"
          domain={[0, "auto"]}
          label={{ value: "RFU", angle: -90, position: "insideLeft" }}
        />

        {/* Líneas de umbral - solo AT y ST (no baseline ReferenceLines) */}
        {analyticalThreshold != null && (
          <ReferenceLine
            y={analyticalThreshold}
            stroke="#9CA3AF"
            strokeDasharray="6 6"
            label={{ value: "AT", position: "right", offset: 5 }}
          />
        )}
        {interpretationThreshold != null && (
          <ReferenceLine
            y={interpretationThreshold}
            stroke="#6B7280"
            strokeDasharray="4 4"
            label={{ value: "ST", position: "right", offset: 5 }}
          />
        )}

        {/* Baseline - render FIRST so it appears behind signal curves (visual only, NOT added to signal values) */}
        {/* Baseline mean - dashed gray line */}
        {baselineRFU != null &&
          baselineRFU > 0 &&
          (() => {
            // Calculate X range from data for baseline mean line
            const allAlleles = [
              ...dataTrue.map((d) => d.allele),
              ...dataStutter.map((d) => d.allele),
              ...markers.map((m) => m.allele),
            ].filter((a) => !Number.isNaN(a));

            let minX = 5;
            let maxX = 25;
            if (allAlleles.length > 0) {
              minX = Math.min(...allAlleles) - 1;
              maxX = Math.max(...allAlleles) + 1;
            } else if (
              typeof domain[0] === "number" &&
              typeof domain[1] === "number"
            ) {
              minX = domain[0];
              maxX = domain[1];
            }

            const baselineMeanData = [
              { allele: minX, rfu: baselineRFU },
              { allele: maxX, rfu: baselineRFU },
            ];
            return (
              <Line
                name="Baseline (mean)"
                type="linear"
                data={baselineMeanData}
                dataKey="rfu"
                dot={false}
                stroke="#9CA3AF"
                strokeDasharray="3 3"
                strokeOpacity={0.6}
                strokeWidth={1}
                isAnimationActive={false}
                connectNulls={true}
              />
            );
          })()}

        {/* Baseline noise - faint wavy gray line (only render if baseline exists) */}
        {baselineRFU != null &&
          baselineRFU > 0 &&
          baselineNoiseTrace.length > 0 && (
            <Line
              name="Baseline noise (RFU)"
              type="monotone"
              data={baselineNoiseTrace}
              dataKey="rfu"
              dot={false}
              stroke="#9CA3AF"
              strokeOpacity={0.3}
              strokeWidth={1}
              isAnimationActive={false}
            />
          )}

        {/* Signal curves - render AFTER baseline so they appear on top (pure values, start from 0) */}
        {/* Legend order (controlled by render order):
            1. Baseline (mean) - Dashed gray line (rendered above)
            2. Baseline noise (RFU) - Faint wavy gray line (rendered above)
            3. True alleles / Signal (RFU) - Blue line
            4. Stutter (RFU) - Orange line
            5. Called - Green circles
            6. Drop-out risk - Red stars
            7. Stutter peak - Orange triangles
        */}
        <Line
          name="True alleles / Signal (RFU)"
          type="monotone"
          data={dataTrue}
          dataKey="rfu"
          dot={false}
          stroke="#2563EB" // Blue
          strokeWidth={2}
          isAnimationActive={false}
        />

        <Line
          name="Stutter (RFU)"
          type="monotone"
          data={dataStutter}
          dataKey="rfu"
          dot={false}
          stroke="#F59E0B" // Orange
          strokeOpacity={0.6}
          strokeWidth={1.5}
          isAnimationActive={false}
        />

        {/* Markers - render LAST so they appear on top of curves (clearly visible) */}
        {showMarkers && mTrue.length > 0 && (
          <Scatter
            name="Called"
            data={mTrue}
            fill="#10B981"
            shape="circle"
            r={6}
          />
        )}
        {showMarkers && mDrop.length > 0 && (
          <Scatter
            name="Drop-out risk"
            data={mDrop}
            fill="#EF4444"
            shape="star"
            r={6}
          />
        )}
        {showMarkers && mStutter.length > 0 && (
          <Scatter
            name="Stutter peak"
            data={mStutter}
            fill="#F59E0B"
            shape="triangle"
            r={6}
          />
        )}

        <Tooltip
          formatter={(value: any, name: string, props: any) => {
            // Round RFU value for all series
            return [Math.round(value as number) + " RFU", name];
          }}
          labelFormatter={(label: any, payload: readonly any[]) => {
            if (!payload || payload.length === 0) {
              return `Allele ${label}`;
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
              const scatterItem = payload.find(
                (item: any) =>
                  item.name === "True alleles" ||
                  item.name === "Stutter peak" ||
                  item.name === "Drop-out risk"
              );

              if (scatterItem) {
                return `Allele ${label} — ${scatterItem.name}`;
              }
            }

            // For line series, just show "Allele X"
            return `Allele ${label}`;
          }}
        />
        <Legend
          verticalAlign="bottom"
          wrapperStyle={{ paddingTop: "20px" }}
          // El orden en la leyenda se controla por el orden de renderizado
          // Orden: Signal (RFU), True alleles, Stutter (RFU), Drop-out risk
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

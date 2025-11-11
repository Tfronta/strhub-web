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
}) {
  const {
    dataTrue,
    dataStutter,
    markers = [],
    analyticalThreshold,
    interpretationThreshold,
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

        {/* Líneas de umbral */}
        {analyticalThreshold != null && (
          <ReferenceLine
            y={analyticalThreshold}
            stroke="#9CA3AF"
            strokeDasharray="6 6"
          />
        )}
        {interpretationThreshold != null && (
          <ReferenceLine
            y={interpretationThreshold}
            stroke="#6B7280"
            strokeDasharray="4 4"
          />
        )}

        {/* Curvas */}
        <Line
          name="True alleles"
          type="monotone"
          data={dataTrue}
          dataKey="rfu"
          dot={false}
          stroke="#2563EB" // azul
          strokeWidth={2}
          isAnimationActive={false}
        />
        <Line
          name="Stutter"
          type="monotone"
          data={dataStutter}
          dataKey="rfu"
          dot={false}
          stroke="#F59E0B" // naranja
          strokeOpacity={0.8}
          strokeWidth={2}
          isAnimationActive={false}
        />

        {/* Marcadores */}
        {mTrue.length > 0 && (
          <Scatter name="Called" data={mTrue} fill="#10B981" shape="circle" />
        )}
        {mStutter.length > 0 && (
          <Scatter
            name="Stutter peak"
            data={mStutter}
            fill="#F59E0B"
            shape="triangle"
          />
        )}
        {mDrop.length > 0 && (
          <Scatter
            name="Drop-out risk"
            data={mDrop}
            fill="#EF4444"
            shape="star"
          />
        )}

        <Tooltip
          formatter={(v: any, n) => [Math.round(v as number) + " RFU", n]}
          labelFormatter={(x: any) => `Allele ${x}`}
        />
        <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: "20px" }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

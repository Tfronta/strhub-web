// app/sections/mix-profiles/charts/NGSChart.tsx
'use client';

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
} from 'recharts';
import type { NGSChartBar, NGSRow } from '../utils/simulate';
import { getChartColors } from '../data';

type Props = {
  bars: NGSChartBar[];
  rows: NGSRow[];
  analyticalThreshold?: number;
  interpretationThreshold?: number;
};

// Resuelve una CSS var a color real (rgb/hex). Intenta varias vars por si una no existe.
function resolveThemeColor(fallback: string): string {
  if (typeof window === 'undefined') return fallback;

  const varsToTry = ['--chart-2', '--chart-1', '--color-chart-2', '--color-chart-1'];
  for (const v of varsToTry) {
    const probe = document.createElement('span');
    probe.style.position = 'absolute';
    probe.style.visibility = 'hidden';
    probe.style.color = `var(${v})`;
    document.body.appendChild(probe);
    const resolved = getComputedStyle(probe).color; // ej: rgb(5, 150, 105)
    probe.remove();
    if (resolved && resolved !== 'rgba(0, 0, 0, 0)' && resolved !== 'rgb(0, 0, 0)') {
      return resolved;
    }
  }
  return fallback;
}

export default function NGSChart({
  bars,
  rows,
  analyticalThreshold = 50,
  interpretationThreshold = 80,
}: Props) {
  if (!bars?.length) return <div className="h-[320px]" />;

  const alleleValues = [...bars.map((b) => b.allele)].sort((a, b) => a - b);
  const minX = Math.min(...alleleValues);
  const maxX = Math.max(...alleleValues);
  const maxY = Math.max(...bars.map((b) => b.coverage));
  const yPadding = Math.max(10, Math.round(maxY * 0.25));

  const fallback = getChartColors()[0]; // por si falla la var CSS
  const themeColor = resolveThemeColor(fallback);

  return (
    <div className="space-y-4">
      {/* Tabla */}
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-3 py-2 text-center">Allele</th>
              <th className="px-3 py-2 text-center">Coverage (reads)</th>
              <th className="px-3 py-2 text-center">Stutter %</th>
              <th className="px-3 py-2 text-left">Repeat Sequence</th>
              <th className="px-3 py-2 text-left">Full Sequence</th>
            </tr>
          </thead>
          <tbody>
            {rows
              .slice()
              .sort((a, b) => {
                const aStr = String(a.allele);
                const bStr = String(b.allele);
                if (aStr === bStr) {
                  return (a.fullSequence ?? '').localeCompare(b.fullSequence ?? '');
                }
                // Try numeric comparison first
                const aNum = Number(aStr.replace(/[^\d.]/g, ''));
                const bNum = Number(bStr.replace(/[^\d.]/g, ''));
                if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) {
                  return aNum - bNum;
                }
                // Fallback to string comparison
                return aStr.localeCompare(bStr);
              })
              .map((r, i) => (
                <tr key={`${r.allele}-${i}`} className="odd:bg-background even:bg-muted/10">
                  <td className="px-3 py-2 text-center">
                    {r.allele}
                    {r.isIsoallele ? <sup className="ml-1 text-xs">iso</sup> : null}
                  </td>
                  <td className="px-3 py-2 text-center">{r.coverage}</td>
                  <td className="px-3 py-2 text-center">{r.stutterPct ?? '—'}</td>
                  <td className="px-3 py-2 text-left whitespace-pre-wrap break-words">
                    {r.repeatSequence ?? '—'}
                  </td>
                  <td className="px-3 py-2 text-left whitespace-pre-wrap break-words">
                    {r.fullSequence ?? '—'}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Barras */}
      <div className="w-full h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={bars}
            margin={{ top: 10, right: 16, bottom: 16, left: 8 }}
            barCategoryGap="25%"
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis
              dataKey="allele"
              type="number"
              domain={[minX - 0.4, maxX + 0.4]} // padding para que no se corten
              ticks={alleleValues}
              allowDecimals={false}
              label={{ value: 'Allele', position: 'insideBottom', offset: -8 }}
            />
            <YAxis
              domain={[0, maxY + yPadding]}
              label={{
                value: 'Coverage',           // ← como pediste
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle' },
              }}
            />
            <Tooltip />
            <ReferenceLine y={analyticalThreshold} strokeDasharray="6 6" strokeOpacity={0.6} />
            <ReferenceLine y={interpretationThreshold} strokeDasharray="6 6" strokeOpacity={0.6} />

            {/* Forzamos el color de tema, nunca negro */}
            <Bar
              dataKey="coverage"
              isAnimationActive={false}
              fill={themeColor}
              stroke={themeColor}
              radius={[6, 6, 0, 0]}
            >
              {bars.map((_, idx) => (
                <Cell key={idx} fill={themeColor} stroke={themeColor} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

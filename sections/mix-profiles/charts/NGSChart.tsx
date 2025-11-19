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
import { useLanguage } from '@/contexts/language-context';
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

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
  const { t } = useLanguage();

  if (!bars?.length) return <div className="h-[320px]" />;

  const chartBars = bars.map((bar) => ({
    ...bar,
    alleleLabel: String(bar.allele),
  }));
  const chartKey = chartBars.map((bar) => `${bar.allele}-${bar.coverage}`).join('|');
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
              <th className="px-3 py-2 text-left">Repeat Sequence</th>
              <th className="px-3 py-2 text-left">
                <div className="flex items-center gap-1">
                  {t("mixProfiles.ngs.fullSequenceColumnLabel")}
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-full h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={t("mixProfiles.ngs.fullSequenceTooltipAria")}
                      >
                        <Info className="h-3.5 w-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-md">
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
                <tr key={r.sequenceId ?? `${r.allele}-${i}`} className="odd:bg-background even:bg-muted/10">
                  <td className="px-3 py-2 text-center">
                    {r.allele}
                    {r.isIsoallele ? (
                      <TooltipProvider>
                        <UITooltip>
                          <TooltipTrigger asChild>
                            <span className="ml-1 text-[11px] text-gray-500 cursor-help align-super">
                              iso
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs text-sm leading-snug">
                            {t("mixProfiles.ngs.isoTooltip")}
                          </TooltipContent>
                        </UITooltip>
                      </TooltipProvider>
                    ) : null}
                  </td>
                  <td className="px-3 py-2 text-center">{r.coverage}</td>
                  <td className="px-3 py-2 text-left whitespace-pre-wrap break-words">
                    {r.repeatSequence ?? '—'}
                  </td>
                  <td className="px-3 py-2 text-left whitespace-pre-wrap break-words font-mono">
                    {r.fullSequence ?? '—'}
                  </td>
                </tr>
              ))}
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
              label={{ value: 'Allele', position: 'insideBottom', offset: -8 }}
            />
            <YAxis
              domain={['auto', 'auto']}
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

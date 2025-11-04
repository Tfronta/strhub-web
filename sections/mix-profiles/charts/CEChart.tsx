// app/sections/mix-profiles/charts/CEChart.tsx
'use client';

import {
  Line, LineChart, ResponsiveContainer, XAxis, YAxis,
  Tooltip, ReferenceLine, CartesianGrid
} from 'recharts';
import type { CEPoint } from '../utils/simulate';

type Props = {
  data: CEPoint[];
  analyticalThreshold?: number;
  interpretationThreshold?: number;
};

// Format large numbers for display (e.g., 999997 -> 999K, 1000000 -> 1M)
function formatLargeNumber(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return value.toFixed(0);
}

export default function CEChart({
  data,
  analyticalThreshold = 75,
  interpretationThreshold = 120
}: Props) {
  if (!data?.length) return <div className="h-[320px]" />;

  const maxY = Math.max(...data.map(d => d.rfu), 10);
  const marginY = maxY * 0.25;

  // picos locales -> ticks
  const peaks: number[] = [];
  for (let i = 1; i < data.length - 1; i++) {
    if (data[i].rfu > data[i - 1].rfu && data[i].rfu > data[i + 1].rfu) {
      peaks.push(parseFloat(data[i].allele.toFixed(1)));
    }
  }
  const ticks = Array.from(new Set(peaks)).sort((a, b) => a - b);

  const minX = Math.min(...data.map(d => d.allele));
  const maxX = Math.max(...data.map(d => d.allele));

  return (
    <div className="w-full h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 16, bottom: 16, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis
            dataKey="allele"
            type="number"
            domain={[minX - 0.15, maxX + 0.15]}
            ticks={ticks}
            allowDecimals
            tickFormatter={(v) => Number.isInteger(v) ? `${v}` : (v as number).toFixed(1)}
            label={{ value: 'Allele', position: 'insideBottom', offset: -8 }}
            padding={{ left: 10, right: 10 }}
          />
          <YAxis
            domain={[0, maxY + marginY]}
            tickCount={6}
            tickFormatter={formatLargeNumber}
            width={50}
            label={{ value: 'RFU', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            formatter={(val: number) => `${Math.round(val)}`}
            labelFormatter={(lbl) => `Allele ${Number.isInteger(+lbl) ? `${+lbl}` : (+lbl).toFixed(1)}`}
          />
          <ReferenceLine y={analyticalThreshold} strokeDasharray="6 6" strokeOpacity={0.6} />
          <ReferenceLine y={interpretationThreshold} strokeDasharray="6 6" strokeOpacity={0.6} />
          <Line
            type="monotone"
            dataKey="rfu"
            dot={false}
            stroke="var(--chart-1)"
            strokeWidth={2.2}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

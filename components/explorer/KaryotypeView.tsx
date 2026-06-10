"use client";

import { useMemo } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CHROMOSOMES,
  MAX_CHROMOSOME_LENGTH,
  type ChromosomeSpec,
} from "./chromosome-shapes";

export type MarkerSummary = {
  id: string;
  name: string;
  chromosome: string;
  category: string;
};

type Props = {
  markers: MarkerSummary[];
  selectedChromosome: string | null;
  onSelect: (chrId: string) => void;
  t: (key: string) => string;
};

const CHR_WIDTH = 22;
const CHR_MAX_HEIGHT = 120;
const GAP_X = 6;
const CENTROMERE_PINCH = 0.45;
const RADIUS = 6;

function chromosomePath(
  cx: number,
  topY: number,
  width: number,
  height: number,
  centromereRatio: number,
): string {
  const hw = width / 2;
  const r = Math.min(RADIUS, hw, height * 0.1);
  const cY = topY + height * centromereRatio;
  const pinchHW = hw * CENTROMERE_PINCH;

  // Top cap → centromere pinch → bottom cap
  return [
    `M ${cx - hw + r} ${topY}`,
    `Q ${cx - hw} ${topY} ${cx - hw} ${topY + r}`,
    `L ${cx - hw} ${cY - 4}`,
    `Q ${cx - pinchHW} ${cY} ${cx - hw} ${cY + 4}`,
    `L ${cx - hw} ${topY + height - r}`,
    `Q ${cx - hw} ${topY + height} ${cx - hw + r} ${topY + height}`,
    `L ${cx + hw - r} ${topY + height}`,
    `Q ${cx + hw} ${topY + height} ${cx + hw} ${topY + height - r}`,
    `L ${cx + hw} ${cY + 4}`,
    `Q ${cx + pinchHW} ${cY} ${cx + hw} ${cY - 4}`,
    `L ${cx + hw} ${topY + r}`,
    `Q ${cx + hw} ${topY} ${cx + hw - r} ${topY}`,
    "Z",
  ].join(" ");
}

function ChromosomeSVG({
  spec,
  cx,
  count,
  isSelected,
  onSelect,
  countLabel,
}: {
  spec: ChromosomeSpec;
  cx: number;
  count: number;
  isSelected: boolean;
  onSelect: () => void;
  countLabel: string;
}) {
  const height = (spec.lengthMb / MAX_CHROMOSOME_LENGTH) * CHR_MAX_HEIGHT;
  const topY = CHR_MAX_HEIGHT - height + 18;
  const d = chromosomePath(cx, topY, CHR_WIDTH, height, spec.centromereRatio);
  const hasMarkers = count > 0;

  return (
    <TooltipTrigger asChild>
      <g
        className="cursor-pointer outline-none"
        tabIndex={0}
        role="button"
        aria-label={countLabel}
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect();
          }
        }}
      >
        <path
          d={d}
          className={`
            transition-all duration-200
            ${
              isSelected
                ? "fill-primary stroke-primary"
                : hasMarkers
                  ? "fill-muted stroke-border hover:fill-primary/20 hover:stroke-primary"
                  : "fill-muted/50 stroke-border/50"
            }
          `}
          strokeWidth={1.5}
        />
        {/* Chromosome label */}
        <text
          x={cx}
          y={CHR_MAX_HEIGHT + 32}
          textAnchor="middle"
          className={`text-[10px] font-medium select-none ${
            isSelected ? "fill-primary" : "fill-muted-foreground"
          }`}
        >
          {spec.label}
        </text>
      </g>
    </TooltipTrigger>
  );
}

export function KaryotypeView({
  markers,
  selectedChromosome,
  onSelect,
  t,
}: Props) {
  const countByChromosome = useMemo(() => {
    const map: Record<string, number> = {};
    for (const m of markers) {
      map[m.chromosome] = (map[m.chromosome] || 0) + 1;
    }
    return map;
  }, [markers]);

  const cellWidth = CHR_WIDTH + GAP_X;
  const totalWidth = CHROMOSOMES.length * cellWidth + GAP_X;
  const totalHeight = CHR_MAX_HEIGHT + 44;

  return (
    <TooltipProvider delayDuration={100}>
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${totalWidth} ${totalHeight}`}
          className="w-full max-w-3xl mx-auto"
          role="img"
          aria-label={t("explorer.karyotypeAria")}
        >
          {CHROMOSOMES.map((spec, i) => {
            const cx = GAP_X + i * cellWidth + CHR_WIDTH / 2;
            const count = countByChromosome[spec.id] || 0;
            const countLabel = `${t("explorer.chromosome")} ${spec.label} — ${count} ${count === 1 ? t("explorer.forensicStrLocus") : t("explorer.forensicStrLoci")}`;

            return (
              <Tooltip key={spec.id}>
                <ChromosomeSVG
                  spec={spec}
                  cx={cx}
                  count={count}
                  isSelected={selectedChromosome === spec.id}
                  onSelect={() => onSelect(spec.id)}
                  countLabel={countLabel}
                />
                <TooltipContent side="top" className="text-xs">
                  <p>{countLabel}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </svg>
      </div>
    </TooltipProvider>
  );
}

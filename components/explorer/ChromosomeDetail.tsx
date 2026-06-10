"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CHROMOSOMES } from "./chromosome-shapes";
import { markerData } from "@/lib/markerData";

export type LocusEntry = {
  id: string;
  name: string;
  chromosome: string;
  category: string;
  type: string;
};

type Props = {
  chromosomeId: string;
  markers: LocusEntry[];
  onBack: () => void;
  t: (key: string) => string;
};

const CATEGORY_BADGE_VARIANT: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  "CODIS Core": "default",
  "Other Autosomal": "secondary",
  "X-STR": "outline",
  "Y-STR": "outline",
};

const BAR_HEIGHT = 16;
const BAR_WIDTH_PX = 600;
const PIN_RADIUS = 5;
const PIN_LABEL_OFFSET = 22;
/** Markers within this many px are grouped into one pin with combined tooltip/labels */
const PIN_GROUP_THRESHOLD_PX = 6;

function getCoordinates(markerId: string) {
  const entry = markerData[markerId as keyof typeof markerData];
  if (!entry) return null;
  const start = entry.coordinates?.start;
  if (start == null) return null;
  return {
    start,
    end: entry.coordinates?.end ?? start,
    cytoband: entry.cytogeneticLocation ?? undefined,
  };
}

function ChromosomeDiagram({
  chromosomeId,
  markers,
  t,
}: {
  chromosomeId: string;
  markers: LocusEntry[];
  t: (key: string) => string;
}) {
  const spec = CHROMOSOMES.find((c) => c.id === chromosomeId);
  if (!spec) return null;

  const lengthBp = spec.lengthMb * 1_000_000;
  const centromereX = BAR_WIDTH_PX * spec.centromereRatio;

  const positioned = useMemo(() => {
    return markers
      .map((m) => {
        const coords = getCoordinates(m.id);
        if (!coords) return null;
        const x = (coords.start / lengthBp) * BAR_WIDTH_PX;
        return { ...m, x, cytoband: coords.cytoband };
      })
      .filter(Boolean) as (LocusEntry & { x: number; cytoband?: string })[];
  }, [markers, lengthBp]);

  // Group markers at same or very close position to avoid overlapping labels/tooltips
  type PositionedEntry = (typeof positioned)[number];
  const groups = useMemo(() => {
    const sorted = [...positioned].sort((a, b) => a.x - b.x);
    const result: { x: number; loci: PositionedEntry[]; above: boolean }[] = [];
    let above = true;
    for (let i = 0; i < sorted.length; i++) {
      const loc = sorted[i];
      const prev = result[result.length - 1];
      if (
        prev &&
        prev.loci.length > 0 &&
        loc.x - prev.x < PIN_GROUP_THRESHOLD_PX
      ) {
        prev.loci.push(loc);
      } else {
        result.push({ x: loc.x, loci: [loc], above });
        above = !above;
      }
    }
    return result;
  }, [positioned]);

  const svgHeight = 90;
  const barY = svgHeight / 2 - BAR_HEIGHT / 2;
  const centromereCx = 10 + centromereX;
  const centromereCy = barY + BAR_HEIGHT / 2;

  return (
    <div className="w-full overflow-x-auto mb-4">
      <svg
        viewBox={`0 0 ${BAR_WIDTH_PX + 20} ${svgHeight}`}
        className="w-full max-w-3xl"
        role="img"
        aria-label={`Chromosome ${chromosomeId} diagram`}
      >
        <TooltipProvider delayDuration={80}>
          {/* p arm */}
          <Tooltip>
            <TooltipTrigger asChild>
              <g
                className="cursor-help"
                role="img"
                aria-label={t("explorer.pArmTooltip")}
              >
                <rect
                  x={10}
                  y={barY}
                  width={centromereX - 4}
                  height={BAR_HEIGHT}
                  rx={BAR_HEIGHT / 2}
                  className="fill-muted stroke-border"
                  strokeWidth={1}
                />
              </g>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-white">
              <p className="text-xs font-medium">{t("explorer.pArmTooltip")}</p>
              <p className="text-xs text-white/90 mt-0.5">
                {t("explorer.pArmTooltipDesc")}
              </p>
            </TooltipContent>
          </Tooltip>

          {/* Centromere — invisible larger circle for easier hover */}
          <Tooltip>
            <TooltipTrigger asChild>
              <g
                className="cursor-help"
                role="img"
                aria-label={t("explorer.centromereTooltip")}
              >
                <circle
                  cx={centromereCx}
                  cy={centromereCy}
                  r={12}
                  fill="transparent"
                />
                <circle
                  cx={centromereCx}
                  cy={centromereCy}
                  r={4}
                  className="fill-muted-foreground/40"
                />
              </g>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-white">
              <p className="text-xs font-medium">
                {t("explorer.centromereTooltip")}
              </p>
              <p className="text-xs text-white/90 mt-0.5">
                {t("explorer.centromereTooltipDesc")}
              </p>
            </TooltipContent>
          </Tooltip>

          {/* q arm */}
          <Tooltip>
            <TooltipTrigger asChild>
              <g
                className="cursor-help"
                role="img"
                aria-label={t("explorer.qArmTooltip")}
              >
                <rect
                  x={10 + centromereX + 4}
                  y={barY}
                  width={BAR_WIDTH_PX - centromereX - 4}
                  height={BAR_HEIGHT}
                  rx={BAR_HEIGHT / 2}
                  className="fill-muted stroke-border"
                  strokeWidth={1}
                />
              </g>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-white">
              <p className="text-xs font-medium">{t("explorer.qArmTooltip")}</p>
              <p className="text-xs text-white/90 mt-0.5">
                {t("explorer.qArmTooltipDesc")}
              </p>
            </TooltipContent>
          </Tooltip>

          {/* Locus pins — one pin per group (markers at same position share pin + combined tooltip) */}
          {groups.map((group) => {
            const px = 10 + group.x;
            const pinY = group.above
              ? barY - PIN_LABEL_OFFSET + PIN_RADIUS
              : barY + BAR_HEIGHT + PIN_LABEL_OFFSET - PIN_RADIUS;
            const lineY1 = group.above ? barY : barY + BAR_HEIGHT;
            const lineY2 = group.above ? pinY + PIN_RADIUS : pinY - PIN_RADIUS;
            const labelY = group.above
              ? pinY - PIN_RADIUS - 3
              : pinY + PIN_RADIUS + 9;
            const isSingle = group.loci.length === 1;
            const first = group.loci[0];

            const pinContent = (
              <g className={isSingle ? "cursor-pointer" : "cursor-default"}>
                <line
                  x1={px}
                  y1={lineY1}
                  x2={px}
                  y2={lineY2}
                  className="stroke-primary/60"
                  strokeWidth={1}
                />
                <circle
                  cx={px}
                  cy={pinY}
                  r={PIN_RADIUS}
                  className="fill-primary hover:fill-primary/80 transition-colors"
                />
                {/* Labels: single marker name, or count for grouped/overlapping pins */}
                {isSingle ? (
                  <text
                    x={px}
                    y={labelY}
                    textAnchor="middle"
                    className="text-[7px] fill-muted-foreground select-none"
                  >
                    {first.name}
                  </text>
                ) : (
                  <text
                    x={px}
                    y={labelY}
                    textAnchor="middle"
                    className="text-[7px] fill-muted-foreground select-none"
                  >
                    {group.loci.length}
                  </text>
                )}
              </g>
            );

            return (
              <Tooltip key={group.loci.map((l) => l.id).join(",")}>
                <TooltipTrigger asChild>
                  {isSingle ? (
                    <Link href={`/marker/${first.id}?from=basics`}>
                      {pinContent}
                    </Link>
                  ) : (
                    <g>{pinContent}</g>
                  )}
                </TooltipTrigger>
                <TooltipContent
                  side={group.above ? "top" : "bottom"}
                  className="text-white max-w-xs"
                >
                  {group.loci.map((loc) => (
                    <Link
                      key={loc.id}
                      href={`/marker/${loc.id}?from=basics`}
                      className="block text-xs font-medium text-white hover:text-white hover:underline py-0.5"
                    >
                      {loc.name}
                      {loc.cytoband ? ` (${loc.cytoband})` : ""}
                    </Link>
                  ))}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </svg>
    </div>
  );
}

export function ChromosomeDetail({ chromosomeId, markers, onBack, t }: Props) {
  const sortedMarkers = useMemo(() => {
    return [...markers].sort((a, b) => {
      const ca = getCoordinates(a.id);
      const cb = getCoordinates(b.id);
      if (ca && cb) return ca.start - cb.start;
      if (ca) return -1;
      if (cb) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [markers]);

  return (
    <div className="space-y-4 animate-in fade-in-0 slide-in-from-top-2 duration-300">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("explorer.backToKaryotype")}
        </button>
        <h3 className="text-lg font-semibold">
          {t("explorer.chromosome")} {chromosomeId}
        </h3>
        <Badge variant="secondary" className="text-xs">
          {markers.length}{" "}
          {markers.length === 1 ? "locus" : <span className="italic">loci</span>}
        </Badge>
      </div>

      <ChromosomeDiagram
        chromosomeId={chromosomeId}
        markers={sortedMarkers}
        t={t}
      />

      {/* Locus table */}
      <div className="grid gap-2">
        {sortedMarkers.map((m) => {
          const coords = getCoordinates(m.id);
          return (
            <Link
              key={m.id}
              href={`/marker/${m.id}?from=basics`}
              className="flex items-center justify-between gap-4 rounded-lg border bg-card px-4 py-2.5 hover:bg-accent/50 transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-medium text-sm group-hover:text-primary transition-colors truncate">
                  {m.name}
                </span>
                <Badge
                  variant={CATEGORY_BADGE_VARIANT[m.category] ?? "outline"}
                  className="text-[10px] shrink-0"
                >
                  {m.category}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground shrink-0">
                {m.type && <span>{m.type}</span>}
                {coords?.cytoband && <span>{coords.cytoband}</span>}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

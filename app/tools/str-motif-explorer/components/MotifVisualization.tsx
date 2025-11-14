"use client";

import { type MarkerMotif } from "../utils/motifData";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type MotifVisualizationProps = {
  marker: MarkerMotif;
  viewMode: "schematic" | "text";
  pageContent: {
    labels: {
      canonicalPattern: string;
    };
    legend: {
      repeat: string;
      interruption: string;
      other: string;
    };
    explanation: {
      generic: string;
    };
  };
};

export function MotifVisualization({
  marker,
  viewMode,
  pageContent,
}: MotifVisualizationProps) {
  const getTokenColor = (type: string) => {
    switch (type) {
      case "repeat":
        return "bg-teal-500/20 text-teal-700 dark:text-teal-300 border-teal-500/30";
      case "interruption":
        return "bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30";
      case "other":
        return "bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/30";
    }
  };

  const getTokenTooltip = (token: MarkerMotif["tokens"][0]) => {
    if (token.note) return token.note;
    switch (token.type) {
      case "repeat":
        return pageContent.legend.repeat;
      case "interruption":
        return pageContent.legend.interruption;
      default:
        return pageContent.legend.other;
    }
  };

  if (viewMode === "text") {
    return (
      <div className="space-y-4">
        <div>
          <p className="text-sm font-semibold text-foreground mb-2">
            {pageContent.labels.canonicalPattern}
          </p>
          <p className="text-base font-mono text-muted-foreground bg-muted/50 p-3 rounded-lg">
            {marker.motifPattern}
          </p>
        </div>
        {marker.notes && (
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {marker.notes}
            </p>
          </div>
        )}
        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {pageContent.explanation.generic}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Motif Summary Header */}
      <div>
        <p className="text-lg font-semibold text-foreground mb-2">
          {marker.name}
        </p>
        <p className="text-sm text-muted-foreground mb-3">
          {pageContent.labels.canonicalPattern}{" "}
          <span className="font-mono">{marker.motifPattern}</span>
        </p>
      </div>

      {/* Schematic Visualization */}
      <div>
        <TooltipProvider>
          <div className="flex flex-wrap gap-2">
            {marker.tokens.map((token, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <span
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border cursor-help transition-colors ${getTokenColor(
                      token.type
                    )}`}
                  >
                    {token.label}
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">{getTokenTooltip(token)}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </div>

      {/* Legend */}
      <div className="pt-4 border-t">
        <p className="text-sm font-semibold text-foreground mb-3">Legend:</p>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-teal-500/30 border border-teal-500/50"></span>
            <span className="text-muted-foreground">
              {pageContent.legend.repeat}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500/30 border border-amber-500/50"></span>
            <span className="text-muted-foreground">
              {pageContent.legend.interruption}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gray-500/30 border border-gray-500/50"></span>
            <span className="text-muted-foreground">
              {pageContent.legend.other}
            </span>
          </div>
        </div>
      </div>

      {/* Explanatory Text */}
      <div className="pt-4 border-t space-y-3">
        {marker.notes && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {marker.notes}
          </p>
        )}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {pageContent.explanation.generic}
        </p>
      </div>
    </div>
  );
}


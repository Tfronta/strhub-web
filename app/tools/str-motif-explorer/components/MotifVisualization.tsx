"use client";

import {
  type MarkerMotif,
  buildSequenceBlocks,
  buildMotifSummary,
} from "../utils/motifData";
import {
  highlightExampleSequence,
  type ExampleBlock,
} from "../utils/exampleHighlight";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type MotifVisualizationProps = {
  marker: MarkerMotif;
  viewMode: "schematic" | "text" | "sequence";
  pageContent: {
    labels: {
      canonicalPattern: string;
    };
    legend: {
      repeat: string;
      interruption: string;
      other: string;
      flank?: string;
    };
    explanation: {
      generic: string;
    };
    summary?: {
      caption: string;
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

  if (viewMode === "sequence") {
    if (!marker.segments || marker.segments.length === 0) {
      return (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Sequence highlight mode is not available for this marker.
          </p>
        </div>
      );
    }

    const blocks = buildSequenceBlocks(marker.segments);
    const summary = buildMotifSummary(marker.segments);

    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <p className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            {marker.name}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
            {pageContent.labels.canonicalPattern}{" "}
            <span className="font-mono">{marker.canonicalPattern || marker.motifPattern}</span>
          </p>
        </div>

        {/* Colored Full Sequence */}
        <div className="mt-4 rounded-lg border bg-slate-50 dark:bg-slate-900/50 p-3 font-mono text-xs leading-relaxed">
          {blocks.map((b, i) => (
            <span
              key={i}
              className={`px-0.5 ${
                b.type === "repeat"
                  ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-300"
                  : b.type === "interruption"
                  ? "bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-300 underline"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400"
              }`}
              title={
                b.type === "interruption"
                  ? "Interruption / internal variant (indels, SNVs, etc.)"
                  : undefined
              }
            >
              {b.text}
            </span>
          ))}
        </div>

        {/* Compact Summary */}
        <div className="mt-3 rounded-lg border bg-white dark:bg-slate-800 px-3 py-2 font-mono text-xs text-slate-700 dark:text-slate-300">
          {summary}
        </div>
        {pageContent.summary?.caption && (
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {pageContent.summary.caption}
          </p>
        )}

        {/* Example Allele Sequence */}
        {marker.exampleAllele && marker.canonicalMotif && (
          <ExampleAlleleSequence
            marker={marker}
            pageContent={pageContent}
          />
        )}

        {/* Legend */}
        <div className="pt-4 border-t">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
            Legend:
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500/30 border border-emerald-500/50"></span>
              <span className="text-slate-600 dark:text-slate-400">
                {pageContent.legend.repeat}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500/30 border border-amber-500/50"></span>
              <span className="text-slate-600 dark:text-slate-400">
                {pageContent.legend.interruption}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-500/30 border border-slate-500/50"></span>
              <span className="text-slate-600 dark:text-slate-400">
                {pageContent.legend.flank || "Flanking region"}
              </span>
            </div>
          </div>
        </div>

        {/* Explanatory Text */}
        <div className="pt-4 border-t space-y-3">
          {marker.notes && (
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {marker.notes}
            </p>
          )}
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {pageContent.explanation.generic}
          </p>
        </div>
      </div>
    );
  }

  if (viewMode === "schematic") {
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

  // Default: text/description view
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

function ExampleAlleleSequence({
  marker,
  pageContent,
}: {
  marker: MarkerMotif;
  pageContent: MotifVisualizationProps["pageContent"];
}) {
  if (!marker.exampleAllele || !marker.canonicalMotif) {
    return null;
  }

  const blocks = highlightExampleSequence(
    marker.exampleAllele.sequence,
    marker.canonicalMotif
  );

  const classesForBlockType = (type: ExampleBlock["type"]) => {
    switch (type) {
      case "repeat":
        return "bg-emerald-50 border border-emerald-200 text-emerald-800 px-0.5 rounded-sm";
      case "interruption":
        return "bg-amber-50 border border-amber-200 text-amber-800 px-0.5 rounded-sm underline";
      case "flank":
        return "bg-slate-100 border border-slate-200 text-slate-600 px-0.5 rounded-sm";
      default:
        return "bg-slate-100 border border-slate-200 text-slate-600 px-0.5 rounded-sm";
    }
  };

  return (
    <div className="mt-6 space-y-2">
      <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
        Example allele sequence (from STRbase): {marker.exampleAllele.alleleLabel}
      </div>
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-4 py-3">
        <div className="font-mono text-xs md:text-sm leading-relaxed text-slate-900 dark:text-slate-100 whitespace-nowrap">
          {blocks.map((block, i) => (
            <span key={i} className={classesForBlockType(block.type)}>
              {block.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}


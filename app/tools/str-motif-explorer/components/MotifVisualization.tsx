"use client";

import {
  type MarkerMotif,
  type SequenceBlock,
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
  viewMode: "sequence" | "schematic" | "text";
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

    // Helper to split repeat blocks into individual capsules
    const renderSequenceBlock = (block: SequenceBlock, blockIndex: number) => {
      if (block.type === "repeat") {
        // Block index directly maps to segment index since buildSequenceBlocks creates blocks for all segments
        const segment = marker.segments![blockIndex];
        const motifLabel = segment?.label.toUpperCase() || marker.canonicalMotif?.toUpperCase() || "";
        const motifLength = motifLabel.length || 4; // Default to 4 if not found
        
        // Split the repeat text into individual motif units
        const repeatText = block.text.toUpperCase();
        const capsules: string[] = [];
        
        for (let i = 0; i < repeatText.length; i += motifLength) {
          const unit = repeatText.slice(i, i + motifLength);
          if (unit.length === motifLength) {
            capsules.push(unit);
          }
        }
        
        return (
          <>
            {capsules.map((capsule, capIdx) => (
              <span
                key={`${blockIndex}-${capIdx}`}
                className="inline-flex items-center bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded-xl text-xs md:text-sm font-mono font-medium"
              >
                {capsule}
              </span>
            ))}
          </>
        );
      } else if (block.type === "interruption") {
        return (
          <span
            className="inline-flex items-center bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded-xl text-xs md:text-sm font-mono font-medium underline"
            title="Interruption / internal variant (indels, SNVs, etc.)"
          >
            {block.text.toUpperCase()}
          </span>
        );
      } else {
        // Flank - render as continuous text without capsules
        return (
          <span className="text-slate-600 dark:text-slate-400 font-mono">
            {block.text}
          </span>
        );
      }
    };

    return (
      <div className="space-y-4">
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

        {/* Conceptual sequence, summary, and example sequence */}
        <div className="mt-4 space-y-3">
          {/* Colored Full Sequence */}
          <div className="rounded-lg border bg-slate-50 dark:bg-slate-900/50 p-4 font-mono text-xs md:text-sm leading-relaxed break-all">
            <div className="inline-flex flex-wrap gap-x-1 items-center">
              {blocks.map((b, i) => (
                <span key={i} className="inline-flex items-center">
                  {renderSequenceBlock(b, i)}
                </span>
              ))}
            </div>
          </div>

          {/* Compact Summary */}
          <div className="rounded-lg border bg-white dark:bg-slate-800 px-3 py-2 font-mono text-xs text-slate-700 dark:text-slate-300">
            {summary}
          </div>
          {pageContent.summary?.caption && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
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
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t">
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
      </div>
    );
  }

  if (viewMode === "schematic") {
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
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
            Legend:
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-teal-500/30 border border-teal-500/50"></span>
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
              <span className="w-3 h-3 rounded-full bg-gray-500/30 border border-gray-500/50"></span>
              <span className="text-slate-600 dark:text-slate-400">
                {pageContent.legend.other}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === "text") {
    return (
      <div className="space-y-4">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
            {pageContent.labels.canonicalPattern}
          </p>
          <p className="text-base font-mono text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg">
            {marker.canonicalPattern || marker.motifPattern}
          </p>
        </div>
        {marker.notes && (
          <div className="pt-4 border-t">
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {marker.notes}
            </p>
          </div>
        )}
      </div>
    );
  }

  // Default: sequence mode (should not reach here, but keeping as fallback)
  return null;
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

  const motifLength = marker.canonicalMotif.toUpperCase().length || 4;

  const renderExampleBlock = (block: ExampleBlock, blockIndex: number) => {
    if (block.type === "repeat") {
      // Split repeat block into individual motif capsules
      const repeatText = block.text.toUpperCase();
      const capsules: string[] = [];
      
      for (let i = 0; i < repeatText.length; i += motifLength) {
        const unit = repeatText.slice(i, i + motifLength);
        if (unit.length === motifLength) {
          capsules.push(unit);
        }
      }
      
      return (
        <>
          {capsules.map((capsule, capIdx) => (
            <span
              key={`${blockIndex}-${capIdx}`}
              className="inline-flex items-center bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded-xl text-xs md:text-sm font-mono font-medium"
            >
              {capsule}
            </span>
          ))}
        </>
      );
    } else if (block.type === "interruption") {
      return (
        <span
          className="inline-flex items-center bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded-xl text-xs md:text-sm font-mono font-medium underline"
          title="Interruption / internal variant (indels, SNVs, etc.)"
        >
          {block.text.toUpperCase()}
        </span>
      );
    } else {
      // Flank - render as continuous text without capsules
      return (
        <span className="text-slate-600 dark:text-slate-400 font-mono">
          {block.text.toUpperCase()}
        </span>
      );
    }
  };

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
        Example allele sequence (from STRbase): {marker.exampleAllele.alleleLabel}
      </div>
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-4 py-4">
        <div className="inline-flex flex-wrap gap-x-1 items-center font-mono text-xs md:text-sm leading-relaxed text-slate-900 dark:text-slate-100 break-all">
          {blocks.map((block, i) => (
            <span key={i} className="inline-flex items-center">
              {renderExampleBlock(block, i)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}


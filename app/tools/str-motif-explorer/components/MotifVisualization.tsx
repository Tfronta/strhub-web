"use client";

import {
  type MarkerMotif,
  type SequenceBlock,
  buildSequenceBlocks,
} from "../utils/motifData";
import {
  highlightExampleSequence,
  splitMotif,
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
    sequenceExample?: {
      tooltip: {
        repeat: string;
        flank: string;
        interruption: string;
      };
      note: string;
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
        return "bg-[#fdba74]/20 text-[#27272a] dark:text-[#27272a] border-[#fdba74]/30";
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

    // Helper to split repeat blocks into individual capsules
    const renderSequenceBlock = (block: SequenceBlock, blockIndex: number) => {
      if (block.type === "repeat") {
        // Block index directly maps to segment index since buildSequenceBlocks creates blocks for all segments
        const segment = marker.segments![blockIndex];
        const motifLabel =
          segment?.label.toUpperCase() ||
          marker.canonicalMotif?.toUpperCase() ||
          "";
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
                className="inline-flex items-center bg-[#6ee7b7]/20 border border-[#6ee7b7]/50 text-teal-700 dark:bg-[#6ee7b7]/30 dark:border-[#6ee7b7]/70 dark:text-[#6ee7b7] px-1.5 py-0.5 rounded-xl text-xs md:text-sm font-mono font-medium"
              >
                {capsule}
              </span>
            ))}
          </>
        );
      } else if (block.type === "interruption") {
        return (
          <span
            className="inline-flex items-center bg-[#fdba74]/20 border border-[#fdba74]/50 text-[#27272a] dark:bg-[#fdba74]/30 dark:border-[#fdba74]/70 dark:text-[#27272a] px-1.5 py-0.5 rounded-xl text-xs md:text-sm font-mono font-medium"
            title="Interruption / internal variant (indels, SNVs, etc.)"
          >
            {block.text.toUpperCase()}
          </span>
        );
      } else {
        // Flank - render with styled background
        return (
          <span className="inline-flex items-center bg-slate-50 border border-slate-200 text-slate-700 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded-xl text-xs md:text-sm font-mono font-medium">
            {block.text}
          </span>
        );
      }
    };

    return (
      <div className="space-y-4">
        {/* Header */}
        <div>
          <p className="text-base text-slate-600 dark:text-slate-400 mb-1">
            {pageContent.labels.canonicalPattern}{" "}
            <span className="font-mono">
              {marker.canonicalPattern || marker.motifPattern}
            </span>
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

          {/* Example Allele Sequence */}
          {marker.exampleAllele && marker.canonicalMotif && (
            <ExampleAlleleSequence marker={marker} pageContent={pageContent} />
          )}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
            Legend:
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#6ee7b7]/30 border border-[#6ee7b7]/50"></span>
              <span className="text-slate-600 dark:text-slate-400">
                {pageContent.legend.repeat}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#fdba74]/30 border border-[#fdba74]/50"></span>
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
          <p className="text-base text-slate-600 dark:text-slate-400 mb-1">
            {pageContent.labels.canonicalPattern}{" "}
            <span className="font-mono">
              {marker.canonicalPattern || marker.motifPattern}
            </span>
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
              <span className="w-3 h-3 rounded-full bg-[#fdba74]/30 border border-[#fdba74]/50"></span>
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

  // Use splitMotif to create one block per motif unit
  const blocks = splitMotif(
    marker.exampleAllele.sequence,
    marker.canonicalMotif
  );

  const getTooltip = (tooltipKey?: string): string | undefined => {
    if (!tooltipKey || !pageContent.sequenceExample?.tooltip) return undefined;
    switch (tooltipKey) {
      case "repeat":
        return pageContent.sequenceExample.tooltip.repeat;
      case "flank":
        return pageContent.sequenceExample.tooltip.flank;
      case "interruption":
        return pageContent.sequenceExample.tooltip.interruption;
      default:
        return undefined;
    }
  };

  const renderBlock = (block: ExampleBlock, blockIndex: number) => {
    const tooltip = getTooltip(block.tooltipKey);
    const text = block.text.toUpperCase();

    if (block.type === "repeat") {
      return (
        <span
          key={blockIndex}
          className="inline-flex items-center bg-[#6ee7b7]/20 border border-[#6ee7b7]/50 text-teal-700 dark:bg-[#6ee7b7]/30 dark:border-[#6ee7b7]/70 dark:text-[#6ee7b7] px-1.5 py-0.5 rounded-xl text-xs md:text-sm font-mono font-medium"
          title={tooltip}
        >
          {text}
        </span>
      );
    } else if (block.type === "interruption") {
      return (
        <span
          key={blockIndex}
          className="inline-flex items-center bg-[#fdba74]/20 border border-[#fdba74]/50 text-[#27272a] dark:bg-[#fdba74]/30 dark:border-[#fdba74]/70 dark:text-[#27272a] px-1.5 py-0.5 rounded-xl text-xs md:text-sm font-mono font-medium"
          title={tooltip}
        >
          {text}
        </span>
      );
    } else {
      // Flank - render with styled background
      return (
        <span
          key={blockIndex}
          className="inline-flex items-center bg-slate-50 border border-slate-200 text-slate-700 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded-xl text-xs md:text-sm font-mono font-medium"
          title={tooltip}
        >
          {text}
        </span>
      );
    }
  };

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
        Representative internal sequence structure of allele{" "}
        {marker.exampleAllele.alleleLabel}
      </div>
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-4 py-4">
        <div className="inline-flex flex-wrap gap-x-1 items-center font-mono text-xs md:text-sm leading-relaxed text-slate-900 dark:text-slate-100 break-all">
          {blocks.map((block, i) => renderBlock(block, i))}
        </div>
      </div>
      {pageContent.sequenceExample?.note && (
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {pageContent.sequenceExample.note}
        </div>
      )}
    </div>
  );
}

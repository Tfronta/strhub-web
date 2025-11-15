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
import type { MotifBlock, MotifBlockKind } from "../types";
import { csf1poAllele10 } from "../data/csf1po";
import type { MarkerRefs } from "@/lib/markerRefs-from-data";
import type { MotifAlleleDef, MotifSegment } from "@/lib/strMotifData";

type DisplaySegmentKind = "core" | "flank";

type DisplaySegment = {
  kind: DisplaySegmentKind;
  label: string;
};

function buildCanonicalDisplaySegments(
  motifAllele?: MotifAlleleDef
): DisplaySegment[] {
  if (!motifAllele?.canonicalMotif) {
    return []; // fall back to existing logic below
  }

  const { canonicalMotif, repeatCore } = motifAllele;

  // crude repeat count from "ATCT×13" if present
  let repeats = 1;
  const m = repeatCore?.match(/×(\d+)/);
  if (m) repeats = parseInt(m[1], 10) || 1;

  const segments: DisplaySegment[] = [];
  segments.push({ kind: "flank", label: "flank" });
  for (let i = 0; i < repeats; i++) {
    segments.push({ kind: "core", label: canonicalMotif });
  }
  segments.push({ kind: "flank", label: "flank" });
  return segments;
}

function buildSequenceTokensFromMotifAllele(
  motifAllele?: MotifAlleleDef
): Array<{ kind: "flank" | "core"; label: string }> | null {
  if (!motifAllele?.fullSequence || !motifAllele.flank5 || !motifAllele.flank3) {
    return null;
  }

  const { fullSequence, flank5, flank3, canonicalMotif } = motifAllele;
  const seq = fullSequence.toUpperCase();
  const f5 = flank5.toUpperCase();
  const f3 = flank3.toUpperCase();
  const motif = canonicalMotif.toUpperCase();

  if (!seq.startsWith(f5) || !seq.endsWith(f3)) {
    // fallback to existing logic if something doesn't line up
    return null;
  }

  const core = seq.slice(f5.length, seq.length - f3.length);

  type Token = { kind: "flank" | "core"; label: string };
  const tokens: Token[] = [];

  tokens.push({ kind: "flank", label: f5 });

  for (let i = 0; i < core.length; i += motif.length) {
    const chunk = core.slice(i, i + motif.length);
    if (!chunk) break;
    tokens.push({ kind: "core", label: chunk });
  }

  tokens.push({ kind: "flank", label: f3 });
  return tokens;
}

type MotifVisualizationProps = {
  marker: MarkerMotif;
  viewMode: "sequence" | "schematic" | "text";
  markerInfo?: MarkerRefs;
  motifAllele?: MotifAlleleDef;
  selectedKitId?: string;
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
  markerInfo,
  motifAllele,
  selectedKitId,
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

  const getMotifTooltip = (block: MotifBlock): string => {
    if (block.note) return block.note;

    switch (block.kind) {
      case "coreRepeat":
        return "Core repeat unit that counts toward the allele designation.";
      case "interruption":
        return "Internal variant / interruption within the repeat region (does not add to the allele count).";
      case "otherRepeat":
        return "Repeat-like sequence outside the core block (not counted in the allele designation).";
      case "flank":
      default:
        return "Flanking region around the STR locus.";
    }
  };

  const getBlockClassName = (kind: MotifBlockKind): string => {
    switch (kind) {
      case "coreRepeat":
        return "inline-flex items-center bg-[#6ee7b7]/20 border border-[#6ee7b7]/50 text-teal-700 dark:bg-[#6ee7b7]/30 dark:border-[#6ee7b7]/70 dark:text-[#6ee7b7] px-1.5 py-0.5 rounded-xl text-xs md:text-sm font-mono font-medium";
      case "interruption":
        return "inline-flex items-center bg-[#fdba74]/20 border border-[#fdba74]/50 text-[#27272a] dark:bg-[#fdba74]/30 dark:border-[#fdba74]/70 dark:text-[#27272a] px-1.5 py-0.5 rounded-xl text-xs md:text-sm font-mono font-medium";
      case "flank":
        return "inline-flex items-center bg-slate-50 border border-slate-200 text-slate-700 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded-xl text-xs md:text-sm font-mono font-medium";
      case "otherRepeat":
        return "inline-flex items-center bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/30 px-1.5 py-0.5 rounded-xl text-xs md:text-sm font-mono font-medium";
      default:
        return "inline-flex items-center bg-slate-50 border border-slate-200 text-slate-700 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded-xl text-xs md:text-sm font-mono font-medium";
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

    // Use CSF1PO data if available, otherwise fall back to old structure
    const alleleData = marker.id === "CSF1PO" ? csf1poAllele10 : null;

    // Build repeat chips from markerInfo if available
    const repeatChips = markerInfo
      ? Array.from(
          { length: markerInfo.refAlleleRepeats },
          () => markerInfo.motif
        )
      : [];

    return (
      <div className="space-y-4">
        {/* Header */}
        <div>
          <p className="text-base text-slate-600 dark:text-slate-400 mb-1">
            {pageContent.labels.canonicalPattern}{" "}
            <span className="font-mono">
              {(() => {
                const canonicalMotif =
                  motifAllele?.canonicalMotif ??
                  markerInfo?.motif ??
                  marker.canonicalMotif ??
                  "";
                return canonicalMotif
                  ? `[${canonicalMotif}]ₙ`
                  : marker.canonicalPattern || marker.motifPattern;
              })()}
            </span>
          </p>
        </div>

        {/* Canonical Pattern Blocks */}
        {(() => {
          const canonicalSegments = buildCanonicalDisplaySegments(motifAllele);
          if (canonicalSegments.length > 0) {
            return (
              <div className="mt-4">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Structure
                </p>
                <div className="break-words font-mono text-sm flex flex-wrap gap-1 items-center">
                  {canonicalSegments.map((seg, idx) => (
                    <span
                      key={idx}
                      className={
                        seg.kind === "core"
                          ? "inline-flex items-center bg-[#6ee7b7]/20 border border-[#6ee7b7]/50 text-teal-700 dark:bg-[#6ee7b7]/30 dark:border-[#6ee7b7]/70 dark:text-[#6ee7b7] px-1.5 py-0.5 rounded-xl text-xs md:text-sm font-mono font-medium"
                          : "inline-flex items-center bg-slate-50 border border-slate-200 text-slate-700 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded-xl text-xs md:text-sm font-mono font-medium"
                      }
                    >
                      {seg.label}
                    </span>
                  ))}
                </div>
              </div>
            );
          }
          if (markerInfo && repeatChips.length > 0) {
            return (
              <div className="mt-4">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Structure
                </p>
                <div className="break-words font-mono text-sm">
                  flank {repeatChips.join("")} flank
                </div>
              </div>
            );
          }
          if (alleleData) {
            return (
              <div className="mt-4">
                <div className="break-words font-mono text-sm">
                  {alleleData.canonicalPatternBlocks
                    .map((block) => block.label)
                    .join("")}
                </div>
              </div>
            );
          }
          return null;
        })()}

        {/* Conceptual sequence, summary, and example sequence */}
        <div className="mt-4 space-y-3">
          {/* Colored Full Sequence */}
          {!alleleData && (
            <div className="rounded-lg border bg-slate-50 dark:bg-slate-900/50 p-4 font-mono text-xs md:text-sm leading-relaxed break-all">
              <div className="inline-flex flex-wrap gap-x-1 items-center">
                {blocks.map((b, i) => (
                  <span key={i} className="inline-flex items-center">
                    {renderSequenceBlock(b, i)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Representative Allele Sequence */}
          {motifAllele ? (
            <RepresentativeAlleleSequence
              motifAllele={motifAllele}
              pageContent={pageContent}
            />
          ) : alleleData ? (
            <RepresentativeAlleleSequence
              alleleData={alleleData}
              pageContent={pageContent}
            />
          ) : (
            marker.exampleAllele &&
            marker.canonicalMotif && (
              <ExampleAlleleSequence
                marker={marker}
                pageContent={pageContent}
              />
            )
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
    // Build repeat chips from markerInfo if available
    const repeatChips = markerInfo
      ? Array.from(
          { length: markerInfo.refAlleleRepeats },
          () => markerInfo.motif
        )
      : [];

    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <p className="text-base text-slate-600 dark:text-slate-400 mb-1">
            {pageContent.labels.canonicalPattern}{" "}
            <span className="font-mono">
              {motifAllele?.canonicalMotif
                ? `[${motifAllele.canonicalMotif}]n`
                : markerInfo
                ? `[${markerInfo.motif}]n`
                : marker.canonicalPattern || marker.motifPattern}
            </span>
          </p>
        </div>

        {/* Canonical Pattern Blocks from markerInfo */}
        {markerInfo && repeatChips.length > 0 ? (
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Structure
            </p>
            <div className="break-words font-mono text-sm">
              flank {repeatChips.join("")} flank
            </div>
          </div>
        ) : (
          /* Schematic Visualization */
          <div>
            <div className="break-words font-mono text-sm">
              {marker.tokens.map((token) => token.label).join("")}
            </div>
          </div>
        )}

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

// Helper types and functions for new motif allele data
// Note: segments are already individual in the new structure, so we use them directly

function RepresentativeAlleleSequence({
  motifAllele,
  alleleData,
  pageContent,
}: {
  motifAllele?: MotifAlleleDef;
  alleleData?: {
    marker: string;
    allele: string;
    internalSequenceBlocks: MotifBlock[];
  };
  pageContent: MotifVisualizationProps["pageContent"];
}) {
  const getMotifTooltip = (block: MotifBlock): string => {
    if (block.note) return block.note;

    switch (block.kind) {
      case "coreRepeat":
        return "Core repeat unit that counts toward the allele designation.";
      case "interruption":
        return "Internal variant / interruption within the repeat region (does not add to the allele count).";
      case "otherRepeat":
        return "Repeat-like sequence outside the core block (not counted in the allele designation).";
      case "flank":
      default:
        return "Flanking region around the STR locus.";
    }
  };

  const getBlockClassName = (kind: MotifBlockKind): string => {
    switch (kind) {
      case "coreRepeat":
        return "inline-flex items-center bg-[#6ee7b7]/20 border border-[#6ee7b7]/50 text-teal-700 dark:bg-[#6ee7b7]/30 dark:border-[#6ee7b7]/70 dark:text-[#6ee7b7] px-1.5 py-0.5 rounded-xl text-xs md:text-sm font-mono font-medium";
      case "interruption":
        return "inline-flex items-center bg-[#fdba74]/20 border border-[#fdba74]/50 text-[#27272a] dark:bg-[#fdba74]/30 dark:border-[#fdba74]/70 dark:text-[#27272a] px-1.5 py-0.5 rounded-xl text-xs md:text-sm font-mono font-medium";
      case "flank":
        return "inline-flex items-center bg-slate-50 border border-slate-200 text-slate-700 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded-xl text-xs md:text-sm font-mono font-medium";
      case "otherRepeat":
        return "inline-flex items-center bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/30 px-1.5 py-0.5 rounded-xl text-xs md:text-sm font-mono font-medium";
      default:
        return "inline-flex items-center bg-slate-50 border border-slate-200 text-slate-700 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded-xl text-xs md:text-sm font-mono font-medium";
    }
  };

  const getTokenClassName = (kind: MotifSegment["kind"]): string => {
    let baseClasses = "rounded-full border px-3 py-1 text-xs font-mono";
    let colorClasses = "";

    switch (kind) {
      case "core":
        // same color family as "Repeat unit"
        colorClasses = "bg-emerald-50 border-emerald-200 text-emerald-800";
        break;
      case "interruption":
        // same color family as "Interruption / internal variant"
        colorClasses = "bg-amber-50 border-amber-200 text-amber-800";
        break;
      case "flank5":
      case "flank3":
        // same color family as "Flanking region"
        colorClasses = "bg-slate-50 border-slate-200 text-slate-700";
        break;
      case "nc":
        // non-counting repeat = blue variant
        colorClasses = "bg-sky-50 border-sky-200 text-sky-800";
        break;
      default:
        colorClasses = "bg-slate-50 border-slate-200 text-slate-700";
    }

    return `${baseClasses} ${colorClasses}`;
  };

  // Use new motifAllele data if available
  if (motifAllele) {
    const alleleLabel = motifAllele.allele != null ? motifAllele.allele : "?";
    const sequenceToShow = motifAllele?.fullSequence?.trim() || "";
    const sequenceTokens = buildSequenceTokensFromMotifAllele(motifAllele);

    return (
      <div className="space-y-3">
        <div>
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Representative internal sequence structure of allele {alleleLabel}
            {motifAllele.kitId && ` (${motifAllele.kitId} kit)`}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This internal structure corresponds to the allele representation generated by the {motifAllele.kitId || "selected"} chemistry and alignment settings. Different kits or pipelines may annotate the same allele with slight differences in block boundaries or interruption calls.
          </p>
        </div>
        {sequenceToShow && (
          <div className="rounded-md bg-slate-50 px-3 py-2 text-sm font-mono text-slate-800">
            {sequenceToShow}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
            How to interpret the internal structure of this allele?
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 mb-3 list-disc list-inside">
            <li>Repeat units (green) show each detected occurrence of the motif in the sequence orientation.</li>
            <li>Internal variants or interruptions mark non-canonical blocks within the repeat region.</li>
            <li>Flanking regions are shown because some markers contain motif-like fragments or partial repeats within their flanks, which can be relevant for visualization and interpretation.</li>
          </ul>
          {sequenceTokens ? (
            <div className="flex flex-wrap gap-2">
              {sequenceTokens.map((token, idx) => (
                <span
                  key={idx}
                  className={
                    token.kind === "core"
                      ? "inline-flex items-center bg-[#6ee7b7]/20 border border-[#6ee7b7]/50 text-teal-700 dark:bg-[#6ee7b7]/30 dark:border-[#6ee7b7]/70 dark:text-[#6ee7b7] px-1.5 py-0.5 rounded-xl text-xs md:text-sm font-mono font-medium"
                      : "inline-flex items-center bg-slate-50 border border-slate-200 text-slate-700 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded-xl text-xs md:text-sm font-mono font-medium"
                  }
                >
                  {token.label}
                </span>
              ))}
            </div>
          ) : motifAllele.segments ? (
            <div className="flex flex-wrap gap-2">
              {motifAllele.segments.map((seg, idx) => (
                <span key={idx} className={getTokenClassName(seg.kind)}>
                  {seg.seq}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Note: Only the core continuous repeat block contributes to the allele designation. Additional motif-like copies outside this block are not counted in the allele size.
        </div>
      </div>
    );
  }

  // Fallback to old alleleData structure
  if (!alleleData) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
        Representative internal sequence structure of allele {alleleData.allele}
      </div>
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-4 py-4">
        <TooltipProvider>
          <div className="inline-flex flex-wrap gap-x-1 items-center font-mono text-xs md:text-sm leading-relaxed text-slate-900 dark:text-slate-100 break-all">
            {alleleData.internalSequenceBlocks.map((block, i) => (
              <Tooltip key={i}>
                <TooltipTrigger asChild>
                  <span className={getBlockClassName(block.kind)}>
                    {block.label.toUpperCase()}
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">{getMotifTooltip(block)}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </div>
      {pageContent.sequenceExample?.note && (
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {pageContent.sequenceExample.note}
        </div>
      )}
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

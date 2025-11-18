"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import strKitsData from "@/data/str_kits.json";
import { markerData } from "@/lib/markerData";
import type { MarkerRefs } from "@/lib/markerRefs-from-data";
import type { MotifBlock } from "../types";
import { StrKitData, StrKitType } from "../utils/motifData";

const FLANKING_MOTIF_CLASS =
  "inline-flex items-center border border-neutral-400 text-slate-700 dark:text-slate-200 px-1 py-0.5 rounded-lg bg-transparent text-xs md:text-sm font-mono font-medium";

type MotifVisualizationProps = {
  markerId: keyof typeof strKitsData;
  marker: StrKitData;
  markerInfo?: MarkerRefs;
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
      flankingMotifLike?: string;
    };
    explanation: {
      generic: string;
    };
    sequenceInterpretationTitle?: string;
    scientificNote?: string;
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
    tooltipsShort?: {
      repeat: string;
      internal: string;
      flanking: string;
      flankingMotifLike: string;
    };
    tooltipsLong?: {
      repeat: string;
      internal: string;
      flanking: string;
      flankingMotifLike: string;
    };
  };
};

export function MotifVisualization({
  markerId,
  marker,
  markerInfo,
  selectedKitId,
  pageContent,
}: MotifVisualizationProps) {
  // Try to get data from str_kits.json first, fallback to provided motifAllele
  // const strKitsAllele = selectedKitId
  //   ? getMotifAlleleFromStrKits(markerId, selectedKitId as StrKitType)
  //   : null;

  // Use str_kits.json data if available, otherwise use provided motifAllele
  // const effectiveMotifAllele = marker;
  // Use effectiveMotifAllele instead of motifAllele throughout
  const motifAlleleToUse = marker;

  if (!marker.segments || marker.segments.length === 0) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Sequence highlight mode is not available for this marker.
        </p>
      </div>
    );
  }
  // Build repeat chips from markerInfo if available
  const repeatChips = markerInfo
    ? Array.from(
        { length: markerInfo.refAlleleRepeats },
        () => markerInfo.motif
      )
    : [];

  const legendTooltips: Partial<
    NonNullable<MotifVisualizationProps["pageContent"]["tooltipsLong"]>
  > = pageContent.tooltipsLong || {};
  const legendItems = [
    {
      key: "repeat",
      label: pageContent.legend.repeat,
      tooltip: legendTooltips.repeat || pageContent.legend.repeat,
      icon: (
        <span className="w-3 h-3 rounded-full bg-[#6ee7b7]/30 border border-[#6ee7b7]/50" />
      ),
    },
    {
      key: "internal",
      label: pageContent.legend.interruption,
      tooltip: legendTooltips.internal || pageContent.legend.interruption,
      icon: (
        <span className="w-3 h-3 rounded-full bg-[#fdba74]/30 border border-[#fdba74]/50" />
      ),
    },
    {
      key: "flank",
      label: pageContent.legend.flank || "Flanking region",
      tooltip:
        legendTooltips.flanking ||
        pageContent.legend.flank ||
        "Flanking region",
      icon: (
        <span className="w-3 h-3 rounded-full bg-zinc-300 border border-slate-500/50" />
      ),
    },
    {
      key: "flankingMotifLike",
      label: pageContent.legend.flankingMotifLike,
      tooltip:
        legendTooltips.flankingMotifLike ||
        pageContent.legend.flankingMotifLike ||
        "Motif-like sequence in flanking region",
      icon: (
        <span
          className={`${FLANKING_MOTIF_CLASS} text-[10px] leading-none`}
          aria-hidden="true"
        >
          motif
        </span>
      ),
    },
  ].filter((item) => Boolean(item.label));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <p className="text-base text-slate-600 dark:text-slate-400 mb-1">
          {pageContent.labels.canonicalPattern}{" "}
          <span className="font-mono">
            {(() => {
              return marker.segments[0].sequence;
            })()}
          </span>
        </p>
      </div>

      {/* Canonical Pattern Blocks */}
      {(() => {
        // const canonicalSegments = buildCanonicalDisplaySegments(
        //   motifAlleleToUse || undefined
        // );
        if (marker.segments.length > 0) {
          return (
            <div className="mt-4">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Structure
              </p>
              <div className="break-words font-mono text-sm flex flex-wrap gap-1 items-center">
                <span className="inline-flex items-center bg-zinc-300 border border-slate-200 text-slate-700 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded-xl text-xs md:text-sm font-mono font-medium break-all">
                  flank
                </span>
                {marker.segments.map((seg, idx) => (
                  <span
                    key={idx}
                    className={
                      seg.type === "core"
                        ? "inline-flex items-center bg-[#6ee7b7]/20 border border-[#6ee7b7]/50 text-teal-700 dark:bg-[#6ee7b7]/30 dark:border-[#6ee7b7]/70 dark:text-[#6ee7b7] px-1.5 py-0.5 rounded-xl text-xs md:text-sm font-mono font-medium"
                        : "inline-flex items-center bg-zinc-300 border border-slate-200 text-slate-700 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded-xl text-xs md:text-sm font-mono font-medium break-all"
                    }
                  >
                    {seg.sequence}
                  </span>
                ))}
                <span className="inline-flex items-center bg-zinc-300 border border-slate-200 text-slate-700 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded-xl text-xs md:text-sm font-mono font-medium break-all">
                  flank
                </span>
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
              <div className="break-words font-mono text-sm flex flex-wrap gap-1 items-center">
                <span className="inline-flex items-center bg-zinc-300 border border-slate-200 text-slate-700 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded-xl text-xs md:text-sm font-mono font-medium break-all">
                  flank
                </span>
                {repeatChips.map((motif, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center bg-[#6ee7b7]/20 border border-[#6ee7b7]/50 text-teal-700 dark:bg-[#6ee7b7]/30 dark:border-[#6ee7b7]/70 dark:text-[#6ee7b7] px-1.5 py-0.5 rounded-xl text-xs md:text-sm font-mono font-medium"
                  >
                    {motif}
                  </span>
                ))}
                <span className="inline-flex items-center bg-zinc-300 border border-slate-200 text-slate-700 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded-xl text-xs md:text-sm font-mono font-medium break-all">
                  flank
                </span>
              </div>
            </div>
          );
        }
        return null;
      })()}

      {/* Conceptual sequence, summary, and example sequence */}
      <div className="mt-4 space-y-3">
        {/* Colored Full Sequence */}
        {!motifAlleleToUse && (
          <div className="rounded-lg border bg-slate-50 dark:bg-slate-900/50 p-4 font-mono text-xs md:text-sm leading-relaxed break-all">
            <div className="inline-flex flex-wrap gap-x-1 items-center">
              {/* {blocks.map((b, i) => (
                <span key={i} className="inline-flex items-center">
                  {renderSequenceBlock(b, i)}
                </span>
              ))} */}
            </div>
          </div>
        )}

        {/* Representative Allele Sequence */}
        {motifAlleleToUse && (
          <RepresentativeAlleleSequence
            markerId={markerId}
            kitId={selectedKitId as StrKitType}
            motifAllele={motifAlleleToUse}
            pageContent={pageContent}
            canonicalMotif={markerInfo?.motif}
          />
        )}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
          Legend:
        </p>
        <div className="flex flex-wrap gap-4 text-sm">
          {legendItems.map((item) => (
            <Tooltip key={item.key}>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 cursor-help">
                  {item.icon}
                  <span className="text-slate-600 dark:text-slate-400">
                    {item.label}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent sideOffset={8}>{item.tooltip}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper types and functions for new motif allele data
// Note: segments are already individual in the new structure, so we use them directly

function RepresentativeAlleleSequence({
  markerId,
  kitId,
  motifAllele,
  pageContent,
  canonicalMotif,
}: {
  markerId: keyof typeof strKitsData;
  kitId: StrKitType;
  motifAllele?: StrKitData;
  pageContent: MotifVisualizationProps["pageContent"];
  canonicalMotif?: string;
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

  // Require motifAllele data
  if (!motifAllele) {
    return null;
  }

  const alleleLabel =
    markerData[markerId.toLowerCase() as keyof typeof markerData]?.nistReference
      ?.referenceAllele || "?";
  const sequenceToShow = motifAllele.sequence.trim() || "";
  const sequenceTokens = motifAllele.segments;
  const inferredCanonicalMotif =
    canonicalMotif?.toUpperCase().trim() ||
    sequenceTokens
      ?.find((token) => token.type === "core")
      ?.sequence?.toUpperCase() ||
    "";
  const getTokenClassName = (kind: string) => {
    switch (kind) {
      case "core":
        return "inline-flex items-center bg-[#6ee7b7]/20 border border-[#6ee7b7]/50 text-teal-700 dark:bg-[#6ee7b7]/30 dark:border-[#6ee7b7]/70 dark:text-[#6ee7b7] px-1.5 py-0.5 rounded-xl text-xs md:text-sm font-mono font-medium";
      case "interruption":
      case "insertion":
        return "inline-flex items-center bg-[#fdba74]/20 border border-[#fdba74]/50 text-[#27272a] dark:bg-[#fdba74]/30 dark:border-[#fdba74]/70 dark:text-[#27272a] px-1.5 py-0.5 rounded-xl text-xs md:text-sm font-mono font-medium";
      case "nc":
        return "inline-flex items-center bg-sky-50 border border-sky-200 text-sky-800 dark:bg-sky-900/30 dark:border-sky-700 dark:text-sky-300 px-1.5 py-0.5 rounded-xl text-xs md:text-sm font-mono font-medium";
      case "flankingMotifLike":
        return `${FLANKING_MOTIF_CLASS} mx-0.5`;
      default:
        return "inline-flex items-center bg-zinc-300 border border-slate-200 text-slate-700 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded-xl text-xs md:text-sm font-mono font-medium break-all";
    }
  };

  const getShortTooltip = (kind: TokenKind) => {
    const shortTooltips = pageContent.tooltipsShort;
    switch (kind) {
      case "core":
        return (
          shortTooltips?.repeat || pageContent.legend.repeat || "Repeat unit"
        );
      case "interruption":
      case "insertion":
        return (
          shortTooltips?.internal ||
          pageContent.legend.interruption ||
          "Internal variant"
        );
      case "nc":
        return (
          shortTooltips?.flankingMotifLike ||
          shortTooltips?.internal ||
          pageContent.legend.interruption ||
          "Motif-like copy"
        );
      case "flankingMotifLike":
        return (
          shortTooltips?.flankingMotifLike ||
          shortTooltips?.flanking ||
          pageContent.legend.flankingMotifLike ||
          "Motif-like copy in flanking region"
        );
      case "flanking":
        return (
          shortTooltips?.flanking ||
          pageContent.legend.flank ||
          "Flanking region"
        );
      case "other":
        return (
          pageContent.legend.other ||
          shortTooltips?.flanking ||
          "Sequence segment"
        );
      default:
        return shortTooltips?.flanking || "";
    }
  };

  const renderTokenWithTooltip = (
    sequence: string,
    kind: TokenKind,
    key: string,
    customClassName?: string
  ) => {
    if (!sequence) return null;
    return (
      <Tooltip key={key}>
        <TooltipTrigger asChild>
          <span className={customClassName ?? getTokenClassName(kind)}>
            {sequence}
          </span>
        </TooltipTrigger>
        <TooltipContent sideOffset={8}>{getShortTooltip(kind)}</TooltipContent>
      </Tooltip>
    );
  };

  const renderFlankPill = (sequence: string, flankKey: string) => {
    if (!sequence) return null;
    const tokens = tokenizeFlankingSequence(sequence, inferredCanonicalMotif);
    if (!tokens.length) return null;

    return (
      <Tooltip key={flankKey}>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center bg-zinc-300 border border-slate-200 text-slate-700 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded-xl text-xs md:text-sm font-mono font-medium break-all">
            {tokens.map((token, idx) =>
              token.type === "flankingMotifLike" ? (
                renderTokenWithTooltip(
                  token.sequence,
                  "flankingMotifLike",
                  `${flankKey}-${idx}`,
                  `${FLANKING_MOTIF_CLASS} mx-0.5`
                )
              ) : (
                <span key={`${flankKey}-${idx}`} className="whitespace-pre">
                  {token.sequence}
                </span>
              )
            )}
          </span>
        </TooltipTrigger>
        <TooltipContent sideOffset={8}>
          {getShortTooltip("flanking")}
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <div className="space-y-3">
      <div>
        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
          Representative internal sequence structure of allele {alleleLabel} (
          {kitId})
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Full allele sequence for this kit. Flanking regions are shown in grey,
          canonical repeat units in green, internal variants in orange, and
          motif-like copies that do not count toward the allele size in blue.
        </p>
      </div>
      {sequenceToShow && (
        <div className="mt-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 px-3 py-2">
          <pre className="font-mono text-sm leading-snug whitespace-pre-wrap break-words max-h-40 overflow-y-auto text-slate-800 dark:text-slate-200">
            {sequenceToShow}
          </pre>
        </div>
      )}
      {sequenceTokens && (
        <div className="mt-3 space-y-2">
          {pageContent.sequenceInterpretationTitle && (
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {pageContent.sequenceInterpretationTitle}
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {renderFlankPill(motifAllele.leftFlank, "left-flank")}
            {sequenceTokens.map((token, idx) =>
              renderTokenWithTooltip(
                token.sequence,
                (token.type as TokenKind) || "core",
                `core-${idx}`
              )
            )}
            {renderFlankPill(motifAllele.rightFlank, "right-flank")}
          </div>
        </div>
      )}
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
        Note: Only the core continuous repeat block contributes to the allele
        designation. Additional motif-like copies outside this block are not
        counted in the allele size.
      </p>
    </div>
  );
}

type FlankingToken = {
  sequence: string;
  type: "flanking" | "flankingMotifLike";
};

type TokenKind =
  | "core"
  | "interruption"
  | "insertion"
  | "nc"
  | "other"
  | "flanking"
  | "flankingMotifLike";

function tokenizeFlankingSequence(
  sequence: string,
  canonicalMotif: string
): FlankingToken[] {
  if (!sequence) return [];
  const motif = canonicalMotif?.toUpperCase();
  if (!motif) {
    return [{ sequence, type: "flanking" }];
  }

  const upperSequence = sequence.toUpperCase();
  const tokens: FlankingToken[] = [];
  let cursor = 0;

  while (cursor < sequence.length) {
    const matchIndex = upperSequence.indexOf(motif, cursor);
    if (matchIndex === -1) {
      const tail = sequence.slice(cursor);
      if (tail) {
        tokens.push({ sequence: tail, type: "flanking" });
      }
      break;
    }

    if (matchIndex > cursor) {
      tokens.push({
        sequence: sequence.slice(cursor, matchIndex),
        type: "flanking",
      });
    }

    tokens.push({
      sequence: sequence.slice(matchIndex, matchIndex + motif.length),
      type: "flankingMotifLike",
    });

    cursor = matchIndex + motif.length;
  }

  return tokens.filter((token) => token.sequence.length > 0);
}

"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoTip } from "@/components/InfoTip";
import type { FssgMarker } from "../data/fssgData";
import {
  buildHighlight,
  parseBracketing,
  tokenizeFlank,
  type CanonBlock,
} from "../utils/bracketing";

// Role-based color scheme, matching the production tool:
// green = canonical repeat, amber = interruption / internal variant,
// grey = flanking region, outlined = motif-like copy inside a flank.
const REPEAT_CHIP =
  "inline-flex items-center rounded-md border border-emerald-300 bg-emerald-100 px-1.5 py-0.5 font-medium text-emerald-800 dark:border-emerald-500/50 dark:bg-emerald-500/20 dark:text-emerald-200";
// Secondary / variant repeat block: same green as a repeat (it IS a repeat), but
// rendered lowercase, mirroring STRidER's historical notation (uppercase primary
// vs lowercase minor).
const MINOR_REPEAT_CHIP = `${REPEAT_CHIP} lowercase`;
const INTERRUPTION_CHIP =
  "inline-flex items-center rounded-md border border-amber-300 bg-amber-100 px-1.5 py-0.5 font-medium text-amber-800 dark:border-amber-500/50 dark:bg-amber-500/20 dark:text-amber-200";
const FLANK_CHIP =
  "inline-flex flex-wrap items-center rounded-md border border-slate-300 bg-slate-100 px-1.5 py-0.5 font-medium text-slate-500 dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-400 break-all";
const FLANK_MOTIF_CHIP =
  "inline-flex items-center rounded-md border border-slate-400 bg-transparent px-1 text-slate-600 dark:border-slate-400 dark:text-slate-200";
// The canonical name (STRNaming, FSSG col. "STRNaming Formatted") does not mark
// repeat vs interruption, so the name pills stay a single neutral color. The
// green/amber/grey semantic lives only in the sequence, which comes from
// STRidER's grid.
const NAME_CHIP =
  "inline-flex items-baseline gap-0.5 rounded-md border border-slate-300 bg-slate-100 px-1.5 py-0.5 text-sm font-medium text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200";

export type MotifStructureStrings = {
  ceLabel: string;
  minimumRangeLabel: string;
  strandLabel: string;
  canonicalTitle: string;
  canonicalAltForms: string;
  historicalTitle: string;
  historicalNone: string;
  sequenceTitle: string;
  sequenceNote: string;
  legendRepeat: string;
  legendMinorRepeat: string;
  legendInterruption: string;
  legendFlank: string;
  flankMotifLabel: string;
  repeatTooltip: string;
  minorRepeatTooltip: string;
  interruptionTooltip: string;
  flankTooltip: string;
  phaseNote: string;
  notAlignedNote: string;
};

function BracketingPills({ form }: { form: string }) {
  const parsed = parseBracketing(form);
  return (
    <div className="flex flex-wrap items-center gap-1.5 font-mono">
      {parsed.blocks.map((b: CanonBlock, idx) => (
        <span key={idx} className={NAME_CHIP}>
          {b.motif}
          <sub className="text-[0.65rem] font-semibold opacity-80">
            [{b.countRaw}]
          </sub>
        </span>
      ))}
      {parsed.variantSuffix ? (
        <span className="inline-flex items-center rounded-md border border-slate-300 bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {parsed.variantSuffix}
        </span>
      ) : null}
    </div>
  );
}

function FlankPill({
  text,
  motifs,
  tooltip,
  flankMotifLabel,
}: {
  text: string;
  motifs: string[];
  tooltip: string;
  flankMotifLabel: string;
}) {
  const tokens = tokenizeFlank(text, motifs);
  return (
    <span className={FLANK_CHIP}>
      {tokens.map((tk, i) => (
        <Tooltip key={i}>
          <TooltipTrigger asChild>
            <span
              className={
                tk.motifLike
                  ? `${FLANK_MOTIF_CHIP} cursor-help`
                  : "cursor-help"
              }
            >
              {tk.text}
            </span>
          </TooltipTrigger>
          <TooltipContent sideOffset={6}>
            {tk.motifLike ? flankMotifLabel : tooltip}
          </TooltipContent>
        </Tooltip>
      ))}
    </span>
  );
}

export function MotifStructure({
  marker,
  strings,
}: {
  marker: FssgMarker;
  strings: MotifStructureStrings;
}) {
  const forms = marker.canonicalBracketing;
  const seq = marker.minimumRangeSequence ?? "";
  const highlight = buildHighlight(seq, forms);
  const primaryForm = forms[highlight.formIndex] ?? forms[0] ?? "";
  const altForms = forms.filter((_, i) => i !== highlight.formIndex);
  const min = marker.minimumRange;

  // Prefer STRidER's authoritative segmentation (the FSSG grid boxes) for the
  // reference sequence; fall back to the aligner only when it is missing.
  const segs = marker.segments;
  const useSegments = Boolean(segs && segs.length);
  // Motifs used to outline repeat-like copies inside the flanks. Restrict to
  // >= 3 bp so stray 1-2 bp repeat units (e.g. SE33's single C/T, or AC) don't
  // outline nearly every base of the flank.
  const flankMotifs = (
    useSegments
      ? Array.from(
          new Set(
            segs!
              .filter((s) => s.role === "repeat" || s.role === "minorRepeat")
              .map((s) => s.seq)
          )
        )
      : highlight.repeatMotifs
  ).filter((m) => m.length >= 3);

  return (
    <TooltipProvider>
      <div className="space-y-5">
        {/* Locus facts */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600 dark:text-slate-300">
          <span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {strings.ceLabel}:
            </span>{" "}
            {marker.ce ?? "?"}
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {strings.minimumRangeLabel}
            </span>
            <InfoTip term="minimumRange" />
            {min ? (
              <span className="font-mono text-xs">
                {min.chrom}:{min.start.toLocaleString()}-
                {min.end.toLocaleString()} ({min.length} bp)
              </span>
            ) : null}
          </span>
          {marker.strand ? (
            <span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {strings.strandLabel}:
              </span>{" "}
              <span className="font-mono">{marker.strand}</span>
            </span>
          ) : null}
        </div>

        {/* Canonical bracketing (2024) */}
        <div>
          <div className="mb-2 flex items-center gap-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
            {strings.canonicalTitle}
            <InfoTip term="canonicalMotif" />
          </div>
          <BracketingPills form={primaryForm} />
          {altForms.length > 0 ? (
            <div className="mt-2">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {strings.canonicalAltForms}:
              </p>
              <ul className="mt-1 space-y-0.5">
                {altForms.map((f, i) => (
                  <li
                    key={i}
                    className="font-mono text-xs text-slate-500 dark:text-slate-400 break-all"
                  >
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        {/* Historical bracketing (2016) */}
        <div>
          <div className="mb-1 flex items-center gap-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
            {strings.historicalTitle}
            <InfoTip term="historicalMotif" />
          </div>
          {marker.historicalBracketing ? (
            <span className="inline-block rounded-md border border-slate-300 bg-slate-50 px-2 py-1 font-mono text-sm text-slate-600 dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
              {marker.historicalBracketing}
            </span>
          ) : (
            <span className="text-sm text-slate-400">
              {strings.historicalNone}
            </span>
          )}
        </div>

        {/* Reference sequence, minimum range, with roles highlighted */}
        <div>
          <div className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
            {strings.sequenceTitle}
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/50">
            {useSegments ? (
              <div className="flex flex-wrap items-center gap-1 font-mono text-sm">
                {segs!.map((s, idx) => {
                  if (s.role === "flank") {
                    return (
                      <FlankPill
                        key={idx}
                        text={s.seq}
                        motifs={flankMotifs}
                        tooltip={strings.flankTooltip}
                        flankMotifLabel={strings.flankMotifLabel}
                      />
                    );
                  }
                  const chipClass =
                    s.role === "repeat"
                      ? REPEAT_CHIP
                      : s.role === "minorRepeat"
                        ? MINOR_REPEAT_CHIP
                        : INTERRUPTION_CHIP;
                  const chipTip =
                    s.role === "repeat"
                      ? strings.repeatTooltip
                      : s.role === "minorRepeat"
                        ? strings.minorRepeatTooltip
                        : strings.interruptionTooltip;
                  return (
                    <Tooltip key={idx}>
                      <TooltipTrigger asChild>
                        <span className={`cursor-help ${chipClass}`}>
                          {s.seq}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent sideOffset={6}>
                        {s.seq} · {chipTip}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            ) : highlight.aligned ? (
              <div className="flex flex-wrap items-center gap-1 font-mono text-sm">
                {highlight.spans.map((s, idx) => {
                  if (s.kind === "flank") {
                    return (
                      <FlankPill
                        key={idx}
                        text={s.text}
                        motifs={highlight.repeatMotifs}
                        tooltip={strings.flankTooltip}
                        flankMotifLabel={strings.flankMotifLabel}
                      />
                    );
                  }
                  const isRepeat = s.kind === "repeat";
                  return (
                    <Tooltip key={idx}>
                      <TooltipTrigger asChild>
                        <span
                          className={`cursor-help ${
                            isRepeat ? REPEAT_CHIP : INTERRUPTION_CHIP
                          }`}
                        >
                          {s.text}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent sideOffset={6}>
                        {s.motif} ·{" "}
                        {isRepeat
                          ? strings.repeatTooltip
                          : strings.interruptionTooltip}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            ) : (
              <p className="font-mono text-sm leading-relaxed break-all text-slate-500 dark:text-slate-400">
                {seq}
              </p>
            )}
          </div>
          {!useSegments && !highlight.aligned ? (
            <p className="mt-2 text-xs text-amber-700 dark:text-amber-400">
              {strings.notAlignedNote}
            </p>
          ) : null}

          {/* Legend */}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-sm border border-emerald-300 bg-emerald-200 dark:border-emerald-500/50 dark:bg-emerald-500/40" />
              {strings.legendRepeat}
              <InfoTip term="coreRepeat" />
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-flex h-3 items-center rounded-sm border border-emerald-300 bg-emerald-200 px-0.5 text-[0.5rem] font-mono lowercase leading-none text-emerald-800 dark:border-emerald-500/50 dark:bg-emerald-500/40 dark:text-emerald-200">
                aa
              </span>
              {strings.legendMinorRepeat}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-sm border border-amber-300 bg-amber-200 dark:border-amber-500/50 dark:bg-amber-500/40" />
              {strings.legendInterruption}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-sm border border-slate-300 bg-slate-200 dark:border-slate-600 dark:bg-slate-700" />
              {strings.legendFlank}
              <InfoTip term="flankingRegion" />
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                className="inline-flex h-4 items-center rounded-md border border-slate-400 px-1 text-[0.6rem] leading-none text-slate-500 dark:text-slate-300"
                aria-hidden="true"
              >
                motif
              </span>
              {strings.flankMotifLabel}
            </span>
          </div>
          <p className="mt-3 text-[13px] leading-relaxed text-slate-600 dark:text-slate-300">
            {strings.phaseNote}
          </p>
        </div>
      </div>
    </TooltipProvider>
  );
}

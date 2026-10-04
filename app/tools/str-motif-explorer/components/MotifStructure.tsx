"use client";

import { Fragment, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoTip } from "@/components/InfoTip";
import { NomenclatureNote } from "@/components/NomenclatureNote";
import type { FssgMarker } from "../data/fssgData";
import {
  buildHighlight,
  parseBracketing,
  strnamingLayout,
  templateIndexOf,
  tokenizeFlank,
  type CanonBlock,
} from "../utils/bracketing";
import {
  agreesWithFssgGrid,
  fssgStrnamingRegions,
} from "../data/strnamingRegions";

// Role-based color scheme, matching the production tool:
// green = canonical repeat, amber = interruption / internal variant,
// grey = flanking region, outlined = motif-like copy inside a flank.
const REPEAT_CHIP =
  "inline-flex items-center rounded-md border border-emerald-300 bg-emerald-100 px-1.5 py-0.5 font-medium text-emerald-800 dark:border-emerald-500/50 dark:bg-emerald-500/20 dark:text-emerald-200";
// Secondary / variant repeat block: same green as a repeat (it IS a repeat), but
// rendered lowercase, mirroring STRidER's historical notation (uppercase primary
// vs lowercase minor).
const MINOR_REPEAT_CHIP = `${REPEAT_CHIP} lowercase`;
// STRNaming view: a block whose count is fixed in STRidER's template (e.g.
// GAAG[2]) in a lighter green than a variable "[n]" block. Both are part of the
// named repeat region; STRNaming has no "interruption" category.
const FIXED_BLOCK_CHIP =
  "inline-flex items-center rounded-md border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 font-medium text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300";
// STRNaming view: the sequence flows as one strip; a thin rule marks where a
// block of the name ends and its count sits under the block's first unit.
const UNIT_CELL = "inline-flex flex-col items-start";
const UNIT_LABEL =
  "mt-0.5 pl-0.5 font-sans text-[0.7rem] leading-none text-slate-500 dark:text-slate-400";
const BLOCK_SEPARATOR =
  "mb-3.5 w-px self-stretch bg-slate-300 dark:bg-slate-600";
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
  canonicalTitle: string;
  canonicalAltForms: string;
  canonicalTemplateNote: string;
  referenceNameLabel: string;
  referenceNameSource: string;
  referenceFitsForm: string;
  referenceFitsOnlyForm: string;
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
  updateNote: string;
  viewStrnaming: string;
  viewHistorical: string;
  legendVariableBlock: string;
  legendFixedBlock: string;
  legendStrnamingFlank: string;
  variableBlockTooltip: string;
  fixedBlockTooltip: string;
  flank5Tooltip: string;
  flank3Tooltip: string;
  strnamingNote: string;
  gridAgrees: string;
  gridDiffers: string;
  noFlank5: string;
  noFlank3: string;
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
                tk.motifLike ? `${FLANK_MOTIF_CHIP} cursor-help` : "cursor-help"
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
  nomenclatureNote,
  referenceName,
}: {
  marker: FssgMarker;
  strings: MotifStructureStrings;
  /** STRNaming 1.2.1 name of the GRCh38 reference allele, e.g. "CE22_GAAG[1]...". */
  referenceName?: string | null;
  /** Cited designation note for the loci harmonized by Bodner et al. 2024 (D6S474, DYS612). */
  nomenclatureNote?: string;
}) {
  const forms = marker.canonicalBracketing;
  const seq = marker.minimumRangeSequence ?? "";
  const highlight = buildHighlight(seq, forms);
  // STRidER's own order: the first line of the FSSG cell, then the others.
  const primaryForm = forms[0] ?? "";
  const altForms = forms.slice(1);
  const referenceForm = referenceName
    ? templateIndexOf(referenceName, forms)
    : -1;
  const min = marker.minimumRange;
  const layout = referenceName
    ? strnamingLayout(seq, referenceName, forms)
    : null;
  const [view, setView] = useState<"strnaming" | "historical">("strnaming");
  const showStrnaming = Boolean(layout) && view === "strnaming";
  const gridRegions = fssgStrnamingRegions(marker.locus);
  // Repeat motifs of the name (>= 3 bp, as in the historical view) whose exact
  // sequence also occurs in a flank: outlined there, since flank bases are not
  // counted in the name.
  const strnamingFlankMotifs = layout
    ? Array.from(new Set(layout.blocks.map((b) => b.motif))).filter(
        (m) => m.length >= 3,
      )
    : [];
  const gridAgrees = layout
    ? agreesWithFssgGrid(marker.locus, layout.start, layout.end)
    : false;

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
              .map((s) => s.seq),
          ),
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
          {nomenclatureNote ? (
            <NomenclatureNote
              className="basis-full text-xs leading-relaxed text-slate-500 dark:text-slate-400"
              text={nomenclatureNote}
            />
          ) : null}
        </div>

        {/* Canonical bracketing (2024) */}
        <div>
          <div className="mb-2 flex items-center gap-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
            {strings.canonicalTitle}
            <InfoTip term="canonicalMotif" />
          </div>
          <p className="mb-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            {strings.canonicalTemplateNote}
          </p>
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

        {/* Full STRNaming name of the GRCh38 reference allele */}
        {referenceName ? (
          <div>
            <div className="mb-1 flex items-center gap-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
              {strings.referenceNameLabel}
            </div>
            <span className="inline-block max-w-full break-all rounded-md border border-slate-300 bg-slate-50 px-2 py-1 font-mono text-sm text-slate-700 dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-200">
              {referenceName}
            </span>
            <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              {strings.referenceNameSource}
              {referenceForm >= 0
                ? ` ${
                    forms.length === 1
                      ? strings.referenceFitsOnlyForm
                      : strings.referenceFitsForm
                          .replace("{n}", String(referenceForm + 1))
                          .replace("{total}", String(forms.length))
                  }`
                : null}
            </p>
          </div>
        ) : null}

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
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {strings.sequenceTitle}
            </div>
            {layout ? (
              <div
                role="group"
                className="inline-flex rounded-md border border-slate-300 p-0.5 text-xs dark:border-slate-600"
              >
                {(["strnaming", "historical"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    aria-pressed={view === v}
                    onClick={() => setView(v)}
                    className={`rounded px-2 py-1 font-medium transition-colors ${
                      view === v
                        ? "bg-primary text-primary-foreground"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`}
                  >
                    {v === "strnaming"
                      ? strings.viewStrnaming
                      : strings.viewHistorical}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/50">
            {showStrnaming && layout ? (
              <div className="flex flex-wrap items-start gap-x-1 gap-y-1.5 font-mono text-sm">
                {layout.flank5 ? (
                  <>
                    <span className={UNIT_CELL}>
                      <FlankPill
                        text={layout.flank5}
                        motifs={strnamingFlankMotifs}
                        tooltip={strings.flank5Tooltip.replace(
                          "{n}",
                          String(layout.flank5.length),
                        )}
                        flankMotifLabel={strings.flankMotifLabel}
                      />
                      <span className={UNIT_LABEL}>
                        -{layout.flank5.length}…-1
                      </span>
                    </span>
                    <span aria-hidden="true" className={BLOCK_SEPARATOR} />
                  </>
                ) : null}
                {layout.blocks.map((b, bi) => (
                  <Fragment key={bi}>
                    {bi > 0 ? (
                      <span aria-hidden="true" className={BLOCK_SEPARATOR} />
                    ) : null}
                    {b.units.map((u, ui) => (
                      <span key={ui} className={UNIT_CELL}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span
                              className={`cursor-help ${
                                b.variable ? REPEAT_CHIP : FIXED_BLOCK_CHIP
                              }`}
                            >
                              {u.seq}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent sideOffset={6}>
                            {b.motif}[{b.count}] ·{" "}
                            {b.variable
                              ? strings.variableBlockTooltip
                              : strings.fixedBlockTooltip}
                          </TooltipContent>
                        </Tooltip>
                        <span className={UNIT_LABEL}>
                          {ui === 0 ? `[${b.count}]` : "\u00a0"}
                        </span>
                      </span>
                    ))}
                  </Fragment>
                ))}
                {layout.flank3 ? (
                  <>
                    <span aria-hidden="true" className={BLOCK_SEPARATOR} />
                    <span className={UNIT_CELL}>
                      <FlankPill
                        text={layout.flank3}
                        motifs={strnamingFlankMotifs}
                        tooltip={strings.flank3Tooltip.replace(
                          "{n}",
                          String(layout.flank3.length),
                        )}
                        flankMotifLabel={strings.flankMotifLabel}
                      />
                      <span className={UNIT_LABEL}>
                        +1…+{layout.flank3.length}
                      </span>
                    </span>
                  </>
                ) : null}
              </div>
            ) : useSegments ? (
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
          {!showStrnaming && !useSegments && !highlight.aligned ? (
            <p className="mt-2 text-xs text-amber-700 dark:text-amber-400">
              {strings.notAlignedNote}
            </p>
          ) : null}

          {showStrnaming ? (
            <>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-block h-3 w-3 rounded-sm border border-emerald-300 bg-emerald-200 dark:border-emerald-500/50 dark:bg-emerald-500/40" />
                  {strings.legendVariableBlock}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-block h-3 w-3 rounded-sm border border-emerald-400 bg-emerald-50 dark:border-emerald-500/60 dark:bg-emerald-500/10" />
                  {strings.legendFixedBlock}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-block h-3 w-3 rounded-sm border border-slate-300 bg-slate-200 dark:border-slate-600 dark:bg-slate-700" />
                  {strings.legendStrnamingFlank}
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
                {strings.strnamingNote}{" "}
                {!layout!.flank5
                  ? `${strings.noFlank5.replace("{marker}", marker.locus)} `
                  : null}
                {!layout!.flank3
                  ? `${strings.noFlank3.replace("{marker}", marker.locus)} `
                  : null}
                {gridAgrees
                  ? strings.gridAgrees
                  : gridRegions.length
                    ? strings.gridDiffers
                        .replace(
                          "{grid}",
                          `${gridRegions[0].start + 1}-${gridRegions[0].end}`,
                        )
                        .replace(
                          "{name}",
                          `${layout!.start + 1}-${layout!.end}`,
                        )
                    : null}
              </p>
            </>
          ) : (
            <>
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
            </>
          )}
          <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            {strings.updateNote}
          </p>
        </div>
      </div>
    </TooltipProvider>
  );
}

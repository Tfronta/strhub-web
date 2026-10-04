"use client";

import { useState } from "react";
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
// A block of the name lit up (hovered, focused or tapped) in the sequence.
const ACTIVE_CHIP =
  "inline-flex items-center rounded-md border border-primary bg-primary px-1.5 py-0.5 font-medium text-primary-foreground";
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
  hoverHint: string;
  detailsSummary: string;
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
  // Block of the name under the pointer (or tapped), lit up in both the name
  // and the sequence.
  const [active, setActive] = useState<number | null>(null);
  const linkProps = (bi: number) => ({
    tabIndex: 0,
    onMouseEnter: () => setActive(bi),
    onMouseLeave: () => setActive(null),
    onFocus: () => setActive(bi),
    onBlur: () => setActive(null),
    onClick: () => setActive((cur) => (cur === bi ? null : bi)),
  });
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

        {/* Name + sequence panel: the STRNaming name of the reference allele
            sits right above its sequence, and hovering a block in either
            lights up the same block in both. */}
        <div className="rounded-xl border border-slate-200 bg-white/60 p-4 dark:border-slate-700 dark:bg-slate-900/40">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
              {showStrnaming ? (
                strings.referenceNameLabel
              ) : (
                <>
                  {strings.historicalTitle}
                  <InfoTip term="historicalMotif" />
                </>
              )}
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
                    onClick={() => {
                      setView(v);
                      setActive(null);
                    }}
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

          {/* The name (or the historical bracketing) */}
          {showStrnaming && layout ? (
            <div className="mb-3 flex flex-wrap items-baseline gap-x-0.5 gap-y-1 font-mono text-base">
              <span className="text-slate-500 dark:text-slate-400">
                {referenceName!.slice(0, referenceName!.indexOf("_") + 1)}
              </span>
              {layout.blocks.map((b, bi) => (
                <span
                  key={bi}
                  {...linkProps(bi)}
                  className={`cursor-pointer rounded px-1 transition-colors ${
                    active === bi
                      ? "bg-primary/15 text-slate-900 dark:text-white"
                      : "text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {b.motif}
                  <span
                    className={
                      b.variable
                        ? "text-sm font-semibold text-primary"
                        : "text-sm text-slate-500 dark:text-slate-400"
                    }
                  >
                    [{b.count}]
                  </span>
                </span>
              ))}
            </div>
          ) : marker.historicalBracketing ? (
            <div className="mb-3 font-mono text-base text-slate-700 dark:text-slate-200">
              {marker.historicalBracketing}
            </div>
          ) : (
            <div className="mb-3 text-sm text-slate-400">
              {strings.historicalNone}
            </div>
          )}

          {/* The reference sequence over the minimum range */}
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {strings.sequenceTitle}
          </div>
          <div className="mt-1 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/50">
            {showStrnaming && layout ? (
              <div className="flex flex-wrap items-center gap-1 font-mono text-sm">
                {layout.flank5 ? (
                  <span className="mr-2 inline-flex">
                    <FlankPill
                      text={layout.flank5}
                      motifs={strnamingFlankMotifs}
                      tooltip={strings.flank5Tooltip.replace(
                        "{n}",
                        String(layout.flank5.length),
                      )}
                      flankMotifLabel={strings.flankMotifLabel}
                    />
                  </span>
                ) : null}
                {layout.blocks.map((b, bi) =>
                  b.units.map((u, ui) => (
                    <span
                      key={`${bi}-${ui}`}
                      {...linkProps(bi)}
                      className={`cursor-pointer transition-colors ${
                        active === bi
                          ? ACTIVE_CHIP
                          : b.variable
                            ? REPEAT_CHIP
                            : FIXED_BLOCK_CHIP
                      } ${ui === b.units.length - 1 ? "mr-2" : ""}`}
                    >
                      {u.seq}
                    </span>
                  )),
                )}
                {layout.flank3 ? (
                  <FlankPill
                    text={layout.flank3}
                    motifs={strnamingFlankMotifs}
                    tooltip={strings.flank3Tooltip.replace(
                      "{n}",
                      String(layout.flank3.length),
                    )}
                    flankMotifLabel={strings.flankMotifLabel}
                  />
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
            ) : (
              <p className="font-mono text-sm leading-relaxed break-all text-slate-500 dark:text-slate-400">
                {seq}
              </p>
            )}
          </div>

          {/* What the highlighted block means, or how to use the panel */}
          {showStrnaming && layout ? (
            <p
              aria-live="polite"
              className="mt-2 min-h-[1.25rem] text-[13px] text-slate-600 dark:text-slate-300"
            >
              {active !== null && layout.blocks[active] ? (
                <>
                  <span className="font-mono font-medium">
                    {layout.blocks[active].motif}[{layout.blocks[active].count}]
                  </span>
                  {": "}
                  {layout.blocks[active].variable
                    ? strings.variableBlockTooltip
                    : strings.fixedBlockTooltip}
                </>
              ) : (
                <span className="text-slate-500 dark:text-slate-400">
                  {strings.hoverHint}
                </span>
              )}
            </p>
          ) : (
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
            </div>
          )}
        </div>

        {/* STRidER's template for the common alleles */}
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

        {/* Sources and notes, in one place */}
        <details className="group rounded-lg border border-slate-200 px-3 py-2 text-[13px] leading-relaxed text-slate-600 dark:border-slate-700 dark:text-slate-300">
          <summary className="cursor-pointer select-none text-xs font-medium text-slate-500 dark:text-slate-400">
            {strings.detailsSummary}
          </summary>
          <div className="mt-2 space-y-2">
            <p>{strings.canonicalTemplateNote}</p>
            {referenceName ? (
              <p>
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
            ) : null}
            {layout ? (
              <p>
                {strings.strnamingNote}{" "}
                {!layout.flank5
                  ? `${strings.noFlank5.replace("{marker}", marker.locus)} `
                  : null}
                {!layout.flank3
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
                        .replace("{name}", `${layout.start + 1}-${layout.end}`)
                    : null}
              </p>
            ) : null}
            <p>{strings.phaseNote}</p>
            <p>{strings.updateNote}</p>
          </div>
        </details>
      </div>
    </TooltipProvider>
  );
}

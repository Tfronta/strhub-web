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
  iupacBases,
  iupacCovers,
  parseBracketing,
  parseFlankVariant,
  strnamingLayout,
  templateIndexOf,
  tokenizeFlank,
  type CanonBlock,
} from "../utils/bracketing";
import {
  agreesWithFssgGrid,
  flankIupacOf,
  fssgStrnamingRegions,
} from "../data/strnamingRegions";

// Sequence chips. A block that is "[n]" in STRidER's template is a stronger
// green than a block with a fixed count; both are part of the named repeat
// region (STRNaming has no "interruption" category). Grey = flank, outlined =
// a flank stretch that spells a repeat motif of the name.
const REPEAT_CHIP =
  "inline-flex items-center rounded-md border border-emerald-300 bg-emerald-100 px-1.5 py-0.5 font-medium text-emerald-800 dark:border-emerald-500/50 dark:bg-emerald-500/20 dark:text-emerald-200";
const FIXED_BLOCK_CHIP =
  "inline-flex items-center rounded-md border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 font-medium text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300";
// A block of the name lit up (hovered, focused or tapped) in the sequence.
const ACTIVE_CHIP =
  "inline-flex items-center rounded-md border border-primary bg-primary px-1.5 py-0.5 font-medium text-primary-foreground";
const FLANK_CHIP =
  "inline-flex flex-wrap items-center rounded-md border border-slate-300 bg-slate-100 px-1.5 py-0.5 font-medium text-slate-500 dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-400 break-all";
const FLANK_MOTIF_CHIP =
  "inline-flex items-center rounded-md border border-slate-400 bg-transparent px-1 text-slate-600 dark:border-slate-400 dark:text-slate-200";
// STRidER's template pills stay neutral: the template does not mark repeat vs
// interruption.
const NAME_CHIP =
  "inline-flex items-baseline gap-0.5 rounded-md border border-slate-300 bg-slate-100 px-1.5 py-0.5 text-sm font-medium text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200";

export type MotifStructureStrings = {
  ceLabel: string;
  minimumRangeLabel: string;
  canonicalTitle: string;
  canonicalAltForms: string;
  canonicalTemplateNote: string;
  canonicalSubtitle: string;
  referenceBadge: string;
  variantSubst: string;
  variantDel: string;
  variantBefore: string;
  variantAfter: string;
  variantIupac: string;
  referenceNameLabel: string;
  referenceNameSource: string;
  referenceFitsForm: string;
  referenceFitsOnlyForm: string;
  historicalTitle: string;
  historicalNone: string;
  historicalNote: string;
  sequenceTitle: string;
  flankMotifLabel: string;
  updateNote: string;
  variableBlockTooltip: string;
  fixedBlockTooltip: string;
  flank5Tooltip: string;
  flank3Tooltip: string;
  strnamingNote: string;
  gridAgrees: string;
  gridDiffers: string;
  noFlank5: string;
  noFlank3: string;
  hoverHint: string;
  detailsSummary: string;
};

const BADGE =
  "inline-flex items-center rounded-full bg-primary/15 px-2 py-0.5 font-sans text-[0.7rem] font-medium text-primary";
const VARIANT_CHIP =
  "inline-flex cursor-help items-center rounded-md border border-dashed border-slate-400 bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600 dark:border-slate-500 dark:bg-slate-800 dark:text-slate-300";

// The "_"-separated flanking variants of a template, each with a tooltip that
// spells it out against GRCh38.
function VariantChips({
  suffix,
  variantTip,
  className,
}: {
  suffix: string | null;
  variantTip: (v: string) => string;
  className: string;
}) {
  if (!suffix) return null;
  return (
    <>
      {suffix.split("_").map((v, i) => (
        <Tooltip key={i}>
          <TooltipTrigger asChild>
            <span className={className}>{v}</span>
          </TooltipTrigger>
          <TooltipContent sideOffset={6} className="max-w-xs">
            {variantTip(v)}
          </TooltipContent>
        </Tooltip>
      ))}
    </>
  );
}

function BracketingPills({
  form,
  variantTip,
  badge,
}: {
  form: string;
  variantTip: (v: string) => string;
  badge?: string;
}) {
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
      <VariantChips
        suffix={parsed.variantSuffix}
        variantTip={variantTip}
        className={VARIANT_CHIP}
      />
      {badge ? <span className={BADGE}>{badge}</span> : null}
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
  const gridAgrees = layout
    ? agreesWithFssgGrid(marker.locus, layout.start, layout.end)
    : false;
  // Repeat motifs of the name (>= 3 bp) whose exact sequence also occurs in a
  // flank: outlined there, since flank bases are not counted in the name.
  const flankMotifs = layout
    ? Array.from(new Set(layout.blocks.map((b) => b.motif))).filter(
        (m) => m.length >= 3,
      )
    : [];
  const activeBlock = active !== null ? layout?.blocks[active] : undefined;
  const variantTip = (text: string): string => {
    const v = parseFlankVariant(text);
    if (!v) return text;
    const side = v.position.startsWith("-")
      ? strings.variantBefore
      : strings.variantAfter;
    const base = (v.alt === "-" ? strings.variantDel : strings.variantSubst)
      .replace("{pos}", v.position)
      .replace("{side}", side)
      .replace("{ref}", v.ref)
      .replace("{alt}", v.alt);
    const code = flankIupacOf(marker.locus, v.position);
    return code && iupacCovers(code, v.ref, v.alt)
      ? `${base} ${strings.variantIupac
          .replace("{code}", code)
          .replace("{bases}", iupacBases(code))}`
      : base;
  };

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
          <div className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
            {strings.referenceNameLabel}
          </div>
          {layout ? (
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
          ) : null}

          {/* The reference sequence over the minimum range */}
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {strings.sequenceTitle}
          </div>
          <div className="mt-1 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/50">
            {layout ? (
              <div className="flex flex-wrap items-center gap-1 font-mono text-sm">
                {layout.flank5 ? (
                  <span className="mr-2 inline-flex">
                    <FlankPill
                      text={layout.flank5}
                      motifs={flankMotifs}
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
                    motifs={flankMotifs}
                    tooltip={strings.flank3Tooltip.replace(
                      "{n}",
                      String(layout.flank3.length),
                    )}
                    flankMotifLabel={strings.flankMotifLabel}
                  />
                ) : null}
              </div>
            ) : (
              <p className="font-mono text-sm leading-relaxed break-all text-slate-500 dark:text-slate-400">
                {seq}
              </p>
            )}
          </div>

          {/* What the highlighted block means, or how to use the panel */}
          {layout ? (
            <p
              aria-live="polite"
              className="mt-2 min-h-[1.25rem] text-[13px] text-slate-600 dark:text-slate-300"
            >
              {activeBlock ? (
                <>
                  <span className="font-mono font-medium">
                    {activeBlock.motif}[{activeBlock.count}]
                  </span>
                  {": "}
                  {activeBlock.variable
                    ? strings.variableBlockTooltip
                    : strings.fixedBlockTooltip}
                </>
              ) : (
                <span className="text-slate-500 dark:text-slate-400">
                  {strings.hoverHint}
                </span>
              )}
            </p>
          ) : null}
        </div>

        {/* STRidER's template for the common alleles */}
        <div>
          <div className="mb-2 flex items-center gap-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
            {strings.canonicalTitle}
            <InfoTip term="canonicalMotif" />
          </div>
          <p className="mb-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            {strings.canonicalSubtitle}
          </p>
          <BracketingPills
            form={primaryForm}
            variantTip={variantTip}
            badge={referenceForm === 0 ? strings.referenceBadge : undefined}
          />
          {altForms.length > 0 ? (
            <div className="mt-2">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {strings.canonicalAltForms}:
              </p>
              <ul className="mt-1 space-y-0.5">
                {altForms.map((f, i) => {
                  const cut = f.indexOf("_");
                  return (
                    <li
                      key={i}
                      className="flex flex-wrap items-center gap-1.5 font-mono text-xs text-slate-500 dark:text-slate-400"
                    >
                      <span className="break-all">
                        {cut === -1 ? f : f.slice(0, cut)}
                      </span>
                      <VariantChips
                        suffix={cut === -1 ? null : f.slice(cut + 1)}
                        variantTip={variantTip}
                        className={`${VARIANT_CHIP} py-0 text-[0.7rem]`}
                      />
                      {referenceForm === i + 1 ? (
                        <span className={BADGE}>{strings.referenceBadge}</span>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>

        {/* Historical bracketing: text only, for comparison with older reports */}
        <div>
          <div className="mb-1 flex items-center gap-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
            {strings.historicalTitle}
            <InfoTip term="historicalMotif" />
          </div>
          {marker.historicalBracketing ? (
            <>
              <span className="inline-block max-w-full break-all rounded-md border border-slate-300 bg-slate-50 px-2 py-1 font-mono text-sm text-slate-600 dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
                {marker.historicalBracketing}
              </span>
              <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                {strings.historicalNote}
              </p>
            </>
          ) : (
            <span className="text-sm text-slate-400">
              {strings.historicalNone}
            </span>
          )}
        </div>

        {/* Sources and notes, in one place */}
        <details className="rounded-lg border border-slate-200 px-3 py-2 text-[13px] leading-relaxed text-slate-600 dark:border-slate-700 dark:text-slate-300">
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
            <p>{strings.updateNote}</p>
          </div>
        </details>
      </div>
    </TooltipProvider>
  );
}

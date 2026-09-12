// app/sections/mix-profiles/charts/NGSChart.tsx
"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Cell,
} from "recharts";
import type { NGSChartBar, NGSRow } from "../utils/simulate";
import { getChartColors } from "../data";
import { useLanguage } from "@/contexts/language-context";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, Copy, Info } from "lucide-react";
import {
  formatMicrovariant,
  getPrimaryMotifForLocus,
  getContinuousSequenceWithRepeat,
  shouldShowIsoBadgeOnMinorRow,
  ISOALLELE_MIN_COVERAGE,
} from "@/lib/strFormatting";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";

type Props = {
  bars: NGSChartBar[];
  rows: NGSRow[];
  locusId?: string;
  analyticalThreshold?: number;
  interpretationThreshold?: number;
};

// ISFG reported ranges (GRCh38, forward '+' strand) used to generate the
// STRNaming names. The displayed Full Sequence is exactly this window, so
// pasting it into STRNaming (fdstools.nl) with this range reproduces the name.
const ISFG_RANGES: Record<string, string> = {
  CSF1PO: "chr5:150076318-150076380",
  D10S1248: "chr10:129294239-129294299",
  D12S391: "chr12:12297011-12297099",
  D13S317: "chr13:82148021-82148104",
  D16S539: "chr16:86352698-86352749",
  D18S51: "chr18:63281663-63281756",
  D19S433: "chr19:29926212-29926303",
  D1S1656: "chr1:230769601-230769687",
  D21S11: "chr21:19181969-19182105",
  D22S1045: "chr22:37140283-37140341",
  D2S1338: "chr2:218014855-218014954",
  D2S441: "chr2:68011943-68011999",
  D3S1358: "chr3:45540733-45540807",
  D5S818: "chr5:123775548-123775603",
  D7S820: "chr7:84160200-84160281",
  D8S1179: "chr8:124894859-124894922",
  FGA: "chr4:154587729-154587827",
  PentaD: "chr21:43636185-43636282",
  PentaE: "chr15:96831008-96831044",
  TH01: "chr11:2171082-2171120",
  TPOX: "chr2:1489647-1489692",
  vWA: "chr12:5983954-5984049",
};

// Resuelve una CSS var a color real (rgb/hex). Intenta varias vars por si una no existe.
function resolveThemeColor(fallback: string): string {
  if (typeof window === "undefined") return fallback;

  const varsToTry = [
    "--chart-2",
    "--chart-1",
    "--color-chart-2",
    "--color-chart-1",
  ];
  for (const v of varsToTry) {
    const probe = document.createElement("span");
    probe.style.position = "absolute";
    probe.style.visibility = "hidden";
    probe.style.color = `var(${v})`;
    document.body.appendChild(probe);
    const resolved = getComputedStyle(probe).color; // ej: rgb(5, 150, 105)
    probe.remove();
    if (
      resolved &&
      resolved !== "rgba(0, 0, 0, 0)" &&
      resolved !== "rgb(0, 0, 0)"
    ) {
      return resolved;
    }
  }
  return fallback;
}

// ISFG block coloring: STRNaming emits repeat blocks in 3 cycling color classes.
// Chosen for clear contrast in light/dark (sky was too low-contrast).
const ISFG_BLOCK_CLASS: Record<string, string> = {
  "0": "bg-emerald-500/25 text-emerald-950 dark:text-emerald-100 rounded",
  "1": "bg-violet-500/25 text-violet-950 dark:text-violet-100 rounded",
  "2": "bg-amber-500/25 text-amber-950 dark:text-amber-100 rounded",
};

// Derive the ISFG STRNaming block label "MOTIF[N]" from a clean repeat-block
// string. NOTE: the current format is MOTIF[N] (e.g. GGAT[3]), NOT the
// deprecated 2016 [MOTIF]N. See the ISFG 2024 recommendations (FSI Genetics 68,
// fsigen.2023.102946).
function isfgBlockLabel(seq: string): string {
  for (let u = 1; u <= seq.length; u++) {
    if (seq.length % u === 0) {
      const unit = seq.slice(0, u);
      if (unit.repeat(seq.length / u) === seq) return `${unit}[${seq.length / u}]`;
    }
  }
  return seq;
}

// Render a STRNaming allele name: "CE<n>_MOTIF[a]MOTIF[b]..._<variant>...".
// The visible text is the exact STRNaming string (no spaces inserted), kept on
// one line so the column sizes to the whole name. The CE prefix and any
// trailing "_<variant>" edits are muted; the repeat structure stays prominent.
function renderRepeatBlocks(s: string) {
  const str = s.trim();
  if (!str) return str;

  // STRNaming format: CE<n>_<structure>[_<variant>...]
  const m = str.match(/^(CE[\d.]+)_(.*)$/);
  if (!m) {
    return <span className="whitespace-nowrap">{str}</span>;
  }
  const [, ce, rest] = m;
  const segments = rest.split("_");
  const structure = segments[0] ?? "";
  const variants = segments.slice(1).filter(Boolean);

  return (
    <span className="whitespace-nowrap leading-relaxed">
      <span className="text-muted-foreground">{ce}_</span>
      {structure}
      {variants.length > 0 ? (
        <span className="text-muted-foreground">
          {variants.map((v) => `_${v}`).join("")}
        </span>
      ) : null}
    </span>
  );
}

// Discreet button to copy a sequence/name string to the clipboard.
function CopyButton({
  text,
  t,
  label,
}: {
  text: string;
  t: (key: string) => string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);
  const idleLabel = label ?? t("mixProfiles.ngs.copySequence");
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof navigator === "undefined" || !navigator.clipboard) return;
        navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1200);
        });
      }}
      className="shrink-0 mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:text-foreground transition-colors"
      aria-label={idleLabel}
      title={copied ? t("mixProfiles.ngs.copiedSequence") : idleLabel}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-600" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

// Compact horizontal-scroll viewport for a full sequence, with a copy button.
// Keeps the wide amplicon out of the layout: the cell stays narrow and the
// sequence scrolls sideways, while the copy button yields the complete string.
function ScrollSeq({
  copyText,
  t,
  children,
}: {
  copyText: string;
  t: (key: string) => string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-1.5">
      <CopyButton text={copyText} t={t} />
      <div className="min-w-0 flex-1 overflow-x-auto pb-2 [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/30">
        <span className="whitespace-nowrap">{children}</span>
      </div>
    </div>
  );
}

// Renders the ISFG block-colorized full sequence. Flanks are shown IN FULL
// (ISFG sequence string), but the cell is a horizontal scroll viewport that is
// auto-centered on the colored repeat region, so wide-FRR loci show little flank
// by default while the complete flank stays reachable by scrolling.
function IsfgSequence({
  isfg,
  t,
}: {
  isfg: Array<{ t: string; c: string }>;
  t: (key: string) => string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const repeatRef = useRef<HTMLSpanElement>(null);
  const seqKey = isfg.map((s) => s.t).join("|");

  useEffect(() => {
    const c = containerRef.current;
    const r = repeatRef.current;
    if (!c || !r) return;
    // Align the colored repeat to the left of the viewport, leaving a small
    // 5' flank "peek". Predictable across rows; full flanks reachable by scroll.
    const PEEK = 36; // px (~5 bases) of 5' flank kept visible
    const repeatLeftInView =
      r.getBoundingClientRect().left - c.getBoundingClientRect().left;
    c.scrollLeft = Math.max(0, c.scrollLeft + repeatLeftInView - PEEK);
  }, [seqKey]);

  const firstBlock = isfg.findIndex((s) => s.c !== "f");
  if (firstBlock < 0) {
    return <span className="text-muted-foreground">{isfg.map((s) => s.t).join("")}</span>;
  }
  const lastBlock =
    isfg.length - 1 - [...isfg].reverse().findIndex((s) => s.c !== "f");

  const flank = (s: { t: string; c: string }, key: string, side: "5" | "3") => (
    <TooltipProvider key={key}>
      <UITooltip>
        <TooltipTrigger asChild>
          <span className="text-muted-foreground cursor-default">{s.t}</span>
        </TooltipTrigger>
        <TooltipContent className="bg-muted text-muted-foreground border-muted-foreground/20">
          <p className="text-xs">
            {side === "5"
              ? t("mixProfiles.ngs.flank5Tooltip")
              : t("mixProfiles.ngs.flank3Tooltip")}
          </p>
        </TooltipContent>
      </UITooltip>
    </TooltipProvider>
  );

  const block = (s: { t: string; c: string }, key: string) => (
    <TooltipProvider key={key}>
      <UITooltip>
        <TooltipTrigger asChild>
          <span
            className={`font-semibold cursor-default ${ISFG_BLOCK_CLASS[s.c] ?? ""}`}
          >
            {s.t}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs font-mono">{isfgBlockLabel(s.t)}</p>
        </TooltipContent>
      </UITooltip>
    </TooltipProvider>
  );

  const fullSeq = isfg.map((s) => s.t).join("");
  return (
    <div className="flex items-start gap-1.5">
      <CopyButton text={fullSeq} t={t} />
      <div
        ref={containerRef}
        className="min-w-0 flex-1 overflow-x-auto pb-2 [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/30"
      >
        <span className="whitespace-nowrap">
          {isfg.slice(0, firstBlock).map((s, i) => flank(s, `f5-${i}`, "5"))}
          <span ref={repeatRef} className="inline-block whitespace-nowrap">
            {isfg.slice(firstBlock, lastBlock + 1).map((s, i) =>
              s.c === "f" ? (
                <span key={`m-${i}`} className="text-muted-foreground">
                  {s.t}
                </span>
              ) : (
                block(s, `b-${i}`)
              )
            )}
          </span>
          {isfg.slice(lastBlock + 1).map((s, i) => flank(s, `f3-${i}`, "3"))}
        </span>
      </div>
    </div>
  );
}

export default function NGSChart({
  bars,
  rows,
  locusId,
  analyticalThreshold = 50,
  interpretationThreshold = 80,
}: Props) {
  const { t } = useLanguage();
  const motif = useMemo(
    () => (locusId ? getPrimaryMotifForLocus(locusId) : null),
    [locusId],
  );

  if (!bars?.length) return <div className="h-[320px]" />;

  const chartBars = bars.map((bar) => ({
    ...bar,
    alleleLabel: String(bar.allele),
  }));
  const chartKey = chartBars
    .map((bar) => `${bar.allele}-${bar.coverage}`)
    .join("|");
  const fallback = getChartColors()[0]; // por si falla la var CSS
  const themeColor = resolveThemeColor(fallback);

  return (
    <div className="space-y-4">
      {/* Tabla */}
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full min-w-[38rem] text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-2.5 py-2 text-center w-20">
                {t("mixProfiles.ngs.tableAllele")}
              </th>
              <th className="px-2.5 py-2 text-center w-16">
                <div className="inline-flex items-center justify-center gap-1">
                  {t("mixProfiles.ngs.tableCoverage")}
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-full h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={t(
                          "mixProfiles.ngs.tableCoverageTooltipAria",
                        )}
                      >
                        <Info className="h-3.5 w-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-xs">
                        {t("mixProfiles.ngs.tableCoverageTooltip")}
                      </p>
                    </TooltipContent>
                  </UITooltip>
                </div>
              </th>
              <th className="px-2.5 py-2 text-left">
                <div className="flex items-center gap-1">
                  {t("mixProfiles.ngs.tableRepeatSequence")}
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-full h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={t("mixProfiles.ngs.ceExplainAria")}
                      >
                        <Info className="h-3.5 w-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="w-max max-w-sm">
                      {/* Hook: why the repeat count and the CE allele differ. */}
                      <p className="text-xs font-semibold">
                        {t("mixProfiles.ngs.ceExplainTitle")}
                      </p>
                      <p className="text-xs mt-1">
                        {t("mixProfiles.ngs.ceExplainBody")}
                      </p>
                      <p className="text-xs mt-2">
                        <a
                          href="https://www.fsigenetics.com/article/S1872-4973(23)00121-7/fulltext"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          {t("mixProfiles.ngs.ceExplainPaperLink")}
                        </a>
                        {" · "}
                        <a
                          href="https://fdstools.nl/strnaming/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          {t("mixProfiles.ngs.ceExplainToolLink")}
                        </a>
                      </p>
                      {/* TODO: once the Foundations article exists, add a link to
                          https://strhub.app/basics here (mixProfiles.ngs.ceExplainBasicsLink). */}
                    </TooltipContent>
                  </UITooltip>
                </div>
              </th>
              <th className="px-2.5 py-2 text-left w-full">
                <div className="flex items-center gap-1">
                  {t("mixProfiles.ngs.fullSequenceColumnLabel")}
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-full h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={t(
                          "mixProfiles.ngs.fullSequenceTooltipAria",
                        )}
                      >
                        <Info className="h-3.5 w-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="w-max max-w-md">
                      <p className="text-xs">
                        {t("mixProfiles.ngs.fullSequenceNote")}
                      </p>
                      {locusId && ISFG_RANGES[locusId] ? (
                        <p className="text-xs mt-2">
                          {t("mixProfiles.ngs.strnamingVerifyNote")}{" "}
                          <span className="font-mono">
                            {ISFG_RANGES[locusId]}
                          </span>{" "}
                          (GRCh38, + strand).{" "}
                          <a
                            href="https://fdstools.nl/strnaming/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                          >
                            fdstools.nl/strnaming
                          </a>
                        </p>
                      ) : null}
                    </TooltipContent>
                  </UITooltip>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              const sortedRows = rows.slice().sort((a, b) => {
                const aStr = String(a.allele);
                const bStr = String(b.allele);
                if (aStr === bStr) {
                  return (a.fullSequence ?? "").localeCompare(
                    b.fullSequence ?? "",
                  );
                }
                const aNum = Number(aStr.replace(/[^\d.]/g, ""));
                const bNum = Number(bStr.replace(/[^\d.]/g, ""));
                if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) {
                  return aNum - bNum;
                }
                return aStr.localeCompare(bStr);
              });
              return sortedRows.map((r, i) => {
                const lowCoverage =
                  r.coverage != null &&
                  r.coverage < ISOALLELE_MIN_COVERAGE;
                return (
                <tr
                  key={r.sequenceId ?? `${r.allele}-${i}`}
                  className="odd:bg-background even:bg-muted/10"
                >
                  <td className="px-2.5 py-2 text-center">
                    <span className="inline-flex items-center gap-1 flex-nowrap whitespace-nowrap">
                      {r.allele}
                      {shouldShowIsoBadgeOnMinorRow(r, sortedRows) ? (
                        <TooltipProvider>
                          <UITooltip>
                            <TooltipTrigger asChild>
                              <span
                                className="text-[11px] text-muted-foreground cursor-help"
                                title={t("mixProfiles.ngs.isoTooltip")}
                              >
                                iso
                              </span>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              sideOffset={6}
                              className="max-w-[min(320px,calc(100vw-2rem))] sm:max-w-[320px]"
                            >
                              <p className="text-inherit">
                                {t("mixProfiles.ngs.isoTooltip")}
                              </p>
                            </TooltipContent>
                          </UITooltip>
                        </TooltipProvider>
                      ) : null}
                    </span>
                  </td>
                  <td className="px-2.5 py-2 text-center">
                    <span className="inline-flex items-center justify-center gap-1">
                      {r.coverage}
                      {lowCoverage ? (
                        <TooltipProvider>
                          <UITooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                className="inline-flex items-center justify-center rounded-full h-4 w-4 text-muted-foreground hover:text-foreground transition-colors cursor-help"
                                aria-label={t("mixProfiles.ngs.lowPdpTooltipAria")}
                              >
                                <Info className="h-3.5 w-3.5" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              sideOffset={6}
                              className="max-w-[min(320px,calc(100vw-2rem))] sm:max-w-[320px]"
                            >
                              <p className="text-inherit whitespace-pre-line">
                                {t("mixProfiles.ngs.lowPdpTooltip")}
                              </p>
                            </TooltipContent>
                          </UITooltip>
                        </TooltipProvider>
                      ) : null}
                    </span>
                  </td>
                  <td className="px-2.5 py-2 text-left font-mono text-xs break-words align-top">
                    {/* Only present a real STRNaming name (CE<n>_...) as such.
                        A bare bracketed pattern must never appear under the
                        "Copy STRNaming name" action. */}
                    {r.repeatSequence && /^CE[\d.]+_/.test(r.repeatSequence) ? (
                      <div className="flex items-start gap-1.5">
                        <CopyButton
                          text={r.repeatSequence}
                          t={t}
                          label={t("mixProfiles.ngs.copyRepeat")}
                        />
                        <div className="min-w-0">
                          {renderRepeatBlocks(r.repeatSequence)}
                        </div>
                      </div>
                    ) : motif ? (
                      formatMicrovariant(String(r.allele), motif)
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-2.5 py-2 text-left font-mono text-xs align-top">
                    {(() => {
                      const raw = String(r.fullSequence ?? "").trim();
                      const segs = r.fullSequenceSegments;
                      const isfg = r.isfgSegments;
                      // ISFG block-colorized sequence (STRNaming): each repeat block
                      // tinted by color class, flanks muted, tooltip shows [MOTIF]N.
                      if (isfg && isfg.length > 0) {
                        return <IsfgSequence isfg={isfg} t={t} />;
                      }
                      if (!raw && !segs?.repeat) return <span>—</span>;
                      // Prefer 3-segment painting from loader (left_flank_in_full + repeat_seq + right_flank_in_full)
                      if (
                        segs &&
                        (segs.flank5 != null ||
                          segs.repeat ||
                          segs.flank3 != null)
                      ) {
                        return (
                          <ScrollSeq
                            copyText={
                              raw ||
                              `${segs.flank5 ?? ""}${segs.repeat ?? ""}${segs.flank3 ?? ""}`
                            }
                            t={t}
                          >
                            {segs.flank5 != null && segs.flank5.length > 0 ? (
                              <TooltipProvider>
                                <UITooltip>
                                  <TooltipTrigger asChild>
                                    <span className="text-muted-foreground cursor-default">
                                      {segs.flank5}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-muted text-muted-foreground border-muted-foreground/20">
                                    <p className="text-xs">
                                      {t("mixProfiles.ngs.flank5Tooltip")}
                                    </p>
                                  </TooltipContent>
                                </UITooltip>
                              </TooltipProvider>
                            ) : null}
                            {segs.repeat ? (
                              <TooltipProvider>
                                <UITooltip>
                                  <TooltipTrigger asChild>
                                    <span className="font-semibold text-foreground bg-primary/15 dark:bg-primary/20 rounded">
                                      {segs.repeat}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">
                                      {t("mixProfiles.ngs.repeatRegionTooltip")}
                                    </p>
                                  </TooltipContent>
                                </UITooltip>
                              </TooltipProvider>
                            ) : null}
                            {segs.flank3 != null && segs.flank3.length > 0 ? (
                              <TooltipProvider>
                                <UITooltip>
                                  <TooltipTrigger asChild>
                                    <span className="text-muted-foreground cursor-default">
                                      {segs.flank3}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-muted text-muted-foreground border-muted-foreground/20">
                                    <p className="text-xs">
                                      {t("mixProfiles.ngs.flank3Tooltip")}
                                    </p>
                                  </TooltipContent>
                                </UITooltip>
                              </TooltipProvider>
                            ) : null}
                          </ScrollSeq>
                        );
                      }
                      const { continuous, repeatStart, repeatEnd } =
                        getContinuousSequenceWithRepeat(raw);
                      if (!continuous) return <span>—</span>;
                      const hasHighlight =
                        repeatStart != null &&
                        repeatEnd != null &&
                        repeatStart < repeatEnd;
                      return (
                        <ScrollSeq copyText={continuous} t={t}>
                          {hasHighlight ? (
                            <>
                              {continuous.slice(0, repeatStart!).length > 0 ? (
                                <TooltipProvider>
                                  <UITooltip>
                                    <TooltipTrigger asChild>
                                      <span className="text-muted-foreground cursor-default">
                                        {continuous.slice(0, repeatStart!)}
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-muted text-muted-foreground border-muted-foreground/20">
                                      <p className="text-xs">
                                        {t("mixProfiles.ngs.flank5Tooltip")}
                                      </p>
                                    </TooltipContent>
                                  </UITooltip>
                                </TooltipProvider>
                              ) : (
                                continuous.slice(0, repeatStart!)
                              )}
                              <TooltipProvider>
                                <UITooltip>
                                  <TooltipTrigger asChild>
                                    <span className="font-semibold text-foreground bg-primary/15 dark:bg-primary/20 rounded">
                                      {continuous.slice(
                                        repeatStart!,
                                        repeatEnd!,
                                      )}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">
                                      {t("mixProfiles.ngs.repeatRegionTooltip")}
                                    </p>
                                  </TooltipContent>
                                </UITooltip>
                              </TooltipProvider>
                              {continuous.slice(repeatEnd!).length > 0 ? (
                                <TooltipProvider>
                                  <UITooltip>
                                    <TooltipTrigger asChild>
                                      <span className="text-muted-foreground cursor-default">
                                        {continuous.slice(repeatEnd!)}
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-muted text-muted-foreground border-muted-foreground/20">
                                      <p className="text-xs">
                                        {t("mixProfiles.ngs.flank3Tooltip")}
                                      </p>
                                    </TooltipContent>
                                  </UITooltip>
                                </TooltipProvider>
                              ) : (
                                continuous.slice(repeatEnd!)
                              )}
                            </>
                          ) : (
                            continuous
                          )}
                        </ScrollSeq>
                      );
                    })()}
                  </td>
                </tr>
              );
              });
            })()}
          </tbody>
        </table>
      </div>

      {/* Barras */}
      <div className="w-full h-[320px]">
        <ResponsiveContainer width="100%" height="100%" key={chartKey}>
          <BarChart
            data={chartBars}
            margin={{ top: 10, right: 16, bottom: 16, left: 8 }}
            barCategoryGap="25%"
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis
              dataKey="alleleLabel"
              type="category"
              allowDuplicatedCategory={false}
              label={{
                value: t("mixProfiles.ngs.axisLabelAllele"),
                position: "insideBottom",
                offset: -8,
              }}
            />
            <YAxis
              domain={[0, "auto"]}
              label={{
                value: t("mixProfiles.ngs.axisLabelCoverage"),
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle" },
              }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const coverageLabel = t("mixProfiles.ngs.tableCoverage");
                const value = payload[0]?.value;
                return (
                  <div className="rounded-lg border bg-background px-2.5 py-2 text-sm shadow-md">
                    <p className="font-medium">{label}</p>
                    <p className="text-muted-foreground">
                      {coverageLabel} : {value}
                    </p>
                  </div>
                );
              }}
            />

            {/* Forzamos el color de tema, nunca negro */}
            <Bar
              dataKey="coverage"
              isAnimationActive={false}
              fill={themeColor}
              stroke={themeColor}
              radius={[6, 6, 0, 0]}
            >
              {chartBars.map((_, idx) => (
                <Cell key={idx} fill={themeColor} stroke={themeColor} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

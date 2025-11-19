// app/sections/mix-profiles/MixProfilesDemo.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DEFAULT_AT,
  DEFAULT_IT,
  demoCatalog,
  cePeaksToNGSRowsWithSeq,
  sampleOptions,
  LOCI_ORDER,
  type LocusId,
  type SampleId,
  type ContributorInput,
  type Peak,
  getTrueGenotype,
} from "./data";

import { simulateCE } from "./utils/mix-model";

import CEChart from "./charts/CEChart";
import NGSChart from "./charts/NGSChart";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Activity, Check, ChevronsUpDown, Info, Layers, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";

/* ------------------------ helpers ------------------------ */
function parseNum(x: string | number): number {
  if (typeof x === "number") return x;
  const m = String(x).match(/\d+(\.\d+)?/);
  return m ? Number(m[0]) : NaN;
}

// electroferograma (suma de gaussianas)
function makeCETrace(peaks: Peak[]) {
  if (!peaks.length) return [];
  // usar SOLO true / dropout para la curva
  const truePeaks = peaks.filter((p) => p.kind !== "stutter");

  if (!truePeaks.length) return [];

  const nums = truePeaks
    .map((p) => parseNum(String(p.allele)))
    .filter((n) => !Number.isNaN(n));
  const minA = Math.min(...nums) - 1;
  const maxA = Math.max(...nums) + 1;

  const step = 0.02;
  const sigma = 0.06;

  const out: { allele: number; rfu: number }[] = [];
  for (let x = minA; x <= maxA; x = +(x + step).toFixed(5)) {
    let y = 0;
    for (const p of truePeaks) {
      const mu = parseNum(String(p.allele));
      if (Number.isNaN(mu)) continue;
      const A = p.rfu;
      const g = Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
      y += A * g;
    }
    out.push({ allele: x, rfu: y });
  }
  return out;
}

function makeCETraceByKind(peaks: Peak[], kind: Peak["kind"]) {
  const subset = peaks.filter((p) => p.kind === kind);
  if (!subset.length) return [];
  const nums = subset
    .map((p) => parseNum(String(p.allele)))
    .filter((n) => !Number.isNaN(n));
  const minA = Math.min(...nums) - 1;
  const maxA = Math.max(...nums) + 1;
  const step = 0.02;
  const sigma = 0.06;

  const out: { allele: number; rfu: number }[] = [];
  for (let x = minA; x <= maxA; x = +(x + step).toFixed(5)) {
    let y = 0;
    for (const p of subset) {
      const mu = parseNum(String(p.allele));
      const A = p.rfu;
      const g = Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
      y += A * g;
    }
    out.push({ allele: x, rfu: y });
  }
  return out;
}

/* ------------------------ tipos locales ------------------------ */
type ContributorState = {
  label: "A" | "B" | "C";
  sampleId: SampleId | null;
  proportion: number;
};

export type MixturePresetKey = "stutterMinor" | "lowMinor" | "overlap";

type MixturePresetConfig = {
  locus: string;
  contributorA: string | null;
  contributorB: string | null;
  contributorC: string | null;
  mixture: { A: number; B: number; C: number };
  AT: number;
  ST: number;
  degradationK: number;
  noiseBase: number;
  stutterLevel: number;
};

const MIXTURE_PRESETS: Record<MixturePresetKey, MixturePresetConfig> = {
  stutterMinor: {
    locus: "D5S818",
    contributorA: "HG00145",
    contributorB: "HG00097",
    contributorC: null,
    mixture: { A: 80, B: 20, C: 0 },
    AT: 80,
    ST: 170,
    degradationK: 0.015,
    noiseBase: 25,
    stutterLevel: 2.0,
  },
  lowMinor: {
    locus: "CSF1PO",
    contributorA: "HG02944",
    contributorB: "HG00372",
    contributorC: null,
    mixture: { A: 80, B: 20, C: 0 },
    AT: 80,
    ST: 170,
    degradationK: 0.015,
    noiseBase: 25,
    stutterLevel: 2.0,
  },
  overlap: {
    locus: "D10S1248",
    contributorA: "HG00145",
    contributorB: "HG02944",
    contributorC: null,
    mixture: { A: 50, B: 50, C: 0 },
    AT: 80,
    ST: 160,
    degradationK: 0.01,
    noiseBase: 25,
    stutterLevel: 1.2,
  },
};

type MixProfilesDemoProps = {
  onPresetSelect?: (preset: MixturePresetKey) => void;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function normalizeContributors(
  list: ContributorState[],
  lockedLabel?: ContributorState["label"]
): ContributorState[] {
  const updated = list.map((c) => ({
    ...c,
    proportion: Number.isFinite(c.proportion) ? clamp(c.proportion, 0, 100) : 0,
  }));

  const active = updated.filter((c) => c.sampleId);
  if (active.length === 0)
    return updated.map((c, idx) => ({
      ...c,
      proportion: idx === 0 ? 100 : 0,
    }));

  if (active.length === 1)
    return updated.map((c) => ({
      ...c,
      proportion: c.label === active[0].label ? 100 : 0,
    }));

  const anchor = active.find((c) => c.label === lockedLabel) ?? active[0];
  const desired = 100;
  const anchorValue = clamp(
    updated.find((c) => c.label === anchor.label)?.proportion ??
      desired / active.length,
    0,
    desired
  );

  const otherLabels = active
    .filter((c) => c.label !== anchor.label)
    .map((c) => c.label);

  const remainingCapacity = Math.max(desired - anchorValue, 0);
  const otherSum = otherLabels.reduce((sum, label) => {
    const entry = updated.find((c) => c.label === label);
    return sum + (entry ? Math.max(entry.proportion, 0) : 0);
  }, 0);

  const next = updated.map((c) => {
    if (!c.sampleId) return { ...c, proportion: 0 };
    if (c.label === anchor.label)
      return { ...c, proportion: Number(anchorValue.toFixed(1)) };

    if (remainingCapacity <= 0) return { ...c, proportion: 0 };

    if (otherSum <= 0) {
      const share = remainingCapacity / otherLabels.length;
      return { ...c, proportion: Number(share.toFixed(1)) };
    }

    const entry = updated.find((item) => item.label === c.label);
    const ratio = entry ? Math.max(entry.proportion, 0) / otherSum : 0;
    const value = remainingCapacity * ratio;
    return { ...c, proportion: Number(value.toFixed(1)) };
  });

  const sumActive = next
    .filter((c) => c.sampleId)
    .reduce((total, c) => total + c.proportion, 0);
  const diff = desired - sumActive;
  if (Math.abs(diff) > 0.09) {
    return next.map((c) =>
      c.label === anchor.label
        ? {
            ...c,
            proportion: Number(
              clamp(c.proportion + diff, 0, desired).toFixed(1)
            ),
          }
        : c
    );
  }

  return next;
}

/* ------------------------ componente ------------------------ */
export default function MixProfilesDemo({ onPresetSelect }: MixProfilesDemoProps = {}) {
  const { t } = useLanguage();

  // Controles de simulación - defaults para mostrar picos coherentes
  const [AT, setAT] = useState<number>(80); // 80 RFU
  const [IT, setIT] = useState<number>(170); // 170 RFU
  const [kDeg, setKDeg] = useState<number>(0.015); // Degradation k
  const [noise, setNoise] = useState<number>(25); // Noise/Base = 25 RFU
  const [stutterScale, setStutterScale] = useState<number>(1.2); // Stutter level × = 1.2
  const [useFixedScale, setUseFixedScale] = useState<boolean>(false); // Auto-scale Y axis by default

  const markerKeys = useMemo(
    () =>
      (LOCI_ORDER.length ? LOCI_ORDER : Object.keys(demoCatalog)) as LocusId[],
    []
  );

  const [selectedMarker, setSelectedMarker] = useState<LocusId>("CSF1PO");
  const [locusOpen, setLocusOpen] = useState(false);
  const [showTrueGenotypes, setShowTrueGenotypes] = useState<boolean>(true);
  const [contributors, setContributors] = useState<ContributorState[]>([
    { label: "A", sampleId: "HG02944" as SampleId, proportion: 70 },
    { label: "B", sampleId: "HG00097" as SampleId, proportion: 30 },
    { label: "C", sampleId: null, proportion: 0 },
  ]);
  const [comboOpen, setComboOpen] = useState<Record<string, boolean>>({
    A: false,
    B: false,
    C: false,
  });

  useEffect(() => setContributors((prev) => normalizeContributors(prev)), []);

  const applyPreset = (presetKey: MixturePresetKey) => {
    const preset = MIXTURE_PRESETS[presetKey];
    if (!preset) return;

    setSelectedMarker(preset.locus as LocusId);

    const toSampleId = (value: string | null): SampleId | null =>
      value ? (value as SampleId) : null;

    setContributors((prev) =>
      normalizeContributors(
        prev.map((contributor) => {
          if (contributor.label === "A") {
            const sampleId = toSampleId(preset.contributorA);
            return {
              ...contributor,
              sampleId,
              proportion: sampleId ? preset.mixture.A : 0,
            };
          }
          if (contributor.label === "B") {
            const sampleId = toSampleId(preset.contributorB);
            return {
              ...contributor,
              sampleId,
              proportion: sampleId ? preset.mixture.B : 0,
            };
          }
          if (contributor.label === "C") {
            const sampleId = toSampleId(preset.contributorC);
            return {
              ...contributor,
              sampleId,
              proportion: sampleId ? preset.mixture.C : 0,
            };
          }
          return contributor;
        })
      )
    );

    setAT(preset.AT);
    setIT(preset.ST);
    setKDeg(preset.degradationK);
    setNoise(preset.noiseBase);
    setStutterScale(preset.stutterLevel);
    setUseFixedScale(true);
  };

  const handleSampleChange = (
    label: "A" | "B" | "C",
    value: SampleId | null
  ) => {
    setContributors((prev) =>
      normalizeContributors(
        prev.map((c) =>
          c.label === label
            ? { ...c, sampleId: value, proportion: value ? c.proportion : 0 }
            : c
        ),
        label
      )
    );
  };

  const handleProportionChange = (label: "A" | "B" | "C", value: number) => {
    const sanitized = Number.isFinite(value) ? value : 0;
    setContributors((prev) =>
      normalizeContributors(
        prev.map((c) =>
          c.label === label ? { ...c, proportion: clamp(sanitized, 0, 100) } : c
        ),
        label
      )
    );
  };

  const activeContributors: ContributorInput[] = useMemo(() => {
    const active = contributors.filter((c) => c.sampleId && c.proportion > 0);
    const total = active.reduce((s, c) => s + c.proportion, 0);
    if (!active.length) return [];
    const safeTotal = total || 100;
    return active.map((c) => ({
      sampleId: c.sampleId as SampleId,
      label: c.label,
      proportion: c.proportion / safeTotal,
    }));
  }, [contributors]);

  // CE
  const ce = useMemo(() => {
    if (!activeContributors.length)
      return {
        locusId: selectedMarker,
        peaks: [],
        allTruePeaks: [],
        notes: [],
        baselineRFU: 0,
        baselineNoiseTrace: [],
        stutterPeaks: [],
        noisePeaks: [],
      };
    return simulateCE({
      locusId: selectedMarker,
      contributors: activeContributors,
      dnaInputNg: 0.1, // 0.10 ng (100 pg) - increased for clearer peaks
      params: {
        AT,
        ST: IT,
        kappaRFU: 8000,
        hetCV: 0.15,
        sigmaLN: 0.25,
        locusEff: 0.95,
        degrK: kDeg,
        ampliconSize: 150,
        baselineMu: noise,
        baselineSd: Math.max(2, Math.round(noise * 0.45)),
        stutter: { minus1: 0.06, minus2: 0.01, plus1: 0.005, sd: 0.02 },
        stutterScale,
      },
    });
  }, [activeContributors, selectedMarker, AT, IT, kDeg, noise, stutterScale]);

  // curvas y marcadores
  // Signal trace: ALL true peaks (not gated by AT) - baseline is visual only, NOT added to signal
  const ceTrueSeries = makeCETraceByKind(ce.allTruePeaks || [], "true");

  // Stutter trace: ALL stutter peaks (not gated by AT) - baseline is visual only, NOT added to signal
  const ceStutterSeries = makeCETraceByKind(ce.stutterPeaks || [], "stutter");

  // Markers: correctamente categorizados según los umbrales
  // RFU < AT: sin marcador
  // AT ≤ RFU < ST: rojo (Drop-out risk)
  // RFU ≥ ST: verde (Called)
  // Stutter ≥ AT: triángulo naranja
  const ceMarkers = (() => {
    const m: Array<{
      allele: number;
      rfu: number;
      kind: "dropout" | "stutter" | "true";
    }> = [];

    for (const p of ce.allTruePeaks || []) {
      const allele = parseNum(String(p.allele));
      if (Number.isNaN(allele)) continue;

      if (p.kind === "true") {
        if (p.rfu >= IT) {
          m.push({ allele, rfu: p.rfu, kind: "true" });
        } else if (p.rfu >= AT) {
          m.push({ allele, rfu: p.rfu, kind: "dropout" });
        }
      }
    }

    for (const p of ce.peaks || []) {
      const allele = parseNum(String(p.allele));
      if (Number.isNaN(allele)) continue;

      if (p.kind === "stutter" && p.rfu >= AT) {
        m.push({ allele, rfu: p.rfu, kind: "stutter" });
      }
    }

    return m.sort((a, b) => a.allele - b.allele);
  })();

  // NGS derivado de CE
  const ngsRows = useMemo(
    () => cePeaksToNGSRowsWithSeq(selectedMarker, ce.peaks, activeContributors),
    // 👉 si ce cambia (porque cambia k, AT, ruido...), recalculamos filas
    [selectedMarker, ce, activeContributors]
  );

  const ngsBars = useMemo(() => {
    const grouped = new Map<number, { allele: number; coverage: number }>();
    for (const r of ngsRows) {
      const alleleNum = parseNum(r.allele);
      if (!Number.isNaN(alleleNum)) {
        grouped.set(alleleNum, {
          allele: alleleNum,
          coverage: (grouped.get(alleleNum)?.coverage ?? 0) + r.coverage,
        });
      }
    }
    return Array.from(grouped.values()).sort((a, b) => a.allele - b.allele);
  }, [ngsRows]);

  const mixSummary = useMemo(
    () =>
      contributors
        .map((c) =>
          !c.sampleId
            ? `${c.label}: —`
            : `${c.label}: ${c.proportion.toFixed(1)}%`
        )
        .join(" • "),
    [contributors]
  );

  // True genotypes lookup (memoized for reactivity)
  const trueGenotypes = useMemo(() => {
    return contributors.map((contributor) => {
      const genotype = getTrueGenotype(contributor.sampleId, selectedMarker);
      return {
        label: contributor.label,
        sampleId: contributor.sampleId,
        genotype,
      };
    });
  }, [contributors, selectedMarker]);

  /* ------------------------ render ------------------------ */
  const handlePresetSelect = (preset: MixturePresetKey) => {
    applyPreset(preset);
    onPresetSelect?.(preset);
  };

  const stutterMinorTooltip = t("mixtures.tooltips.stutterMinor");
  const lowMinorTooltip = t("mixtures.tooltips.lowMinor");
  const overlapTooltip = t("mixtures.tooltips.overlap");

  return (
    <div className="space-y-4">
      {/* PANEL SUPERIOR: Locus + Contribuidores + Controles */}
      <div className="rounded-xl border p-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          {/* Locus */}
          <div className="lg:col-span-1">
            <label className="text-sm font-medium">
              {t("mixProfiles.controls.locus")}
            </label>
            <div className="mt-2">
              <Popover open={locusOpen} onOpenChange={setLocusOpen}>
                <PopoverTrigger className="w-full justify-between border rounded-md p-2 flex flex-row items-center">
                  {selectedMarker}
                  <ChevronsUpDown className="ml-2 size-4 opacity-50" />
                </PopoverTrigger>
                <PopoverContent className="w-[220px] p-0">
                  <Command>
                    <CommandInput placeholder="Search locus..." />
                    <CommandList>
                      <CommandEmpty>No locus found.</CommandEmpty>
                      <CommandGroup>
                        {markerKeys.map((marker) => (
                          <CommandItem
                            key={marker}
                            value={marker}
                            onSelect={(value) => {
                              setSelectedMarker(value as LocusId);
                              setLocusOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 size-4",
                                marker === selectedMarker
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {marker}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            {/* Show true genotypes toggle */}
            <div className="mt-4 flex items-center gap-2">
              <Switch
                id="show-true-genotypes"
                checked={showTrueGenotypes}
                onCheckedChange={setShowTrueGenotypes}
              />
              <label
                htmlFor="show-true-genotypes"
                className="text-sm font-medium cursor-pointer"
              >
                {t("mixProfiles.trueGenotypes.toggleLabel")}
              </label>
            </div>
            {/* True Genotypes Panel */}
            {showTrueGenotypes && (
              <div className="mt-4">
                <Card className="rounded-lg border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold">
                      {t("mixProfiles.trueGenotypes.title", {
                        locus: selectedMarker,
                      })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {trueGenotypes.map((item) => {
                        const { label, sampleId, genotype } = item;
                        return (
                          <div
                            key={label}
                            className="flex items-center justify-between border-b pb-2 last:border-b-0 last:pb-0"
                          >
                            <div className="flex flex-col gap-1">
                              <span className="text-xs font-medium">
                                {t("mixProfiles.controls.contributor", {
                                  label,
                                })}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {sampleId ??
                                  t("mixProfiles.trueGenotypes.notSelected")}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {!sampleId ? (
                                <span className="text-xs text-muted-foreground">
                                  {t("mixProfiles.trueGenotypes.none")}
                                </span>
                              ) : genotype ? (
                                <span className="text-xs font-mono">
                                  {genotype.allele1}, {genotype.allele2}
                                </span>
                              ) : (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="text-xs text-muted-foreground cursor-help underline decoration-dotted">
                                      {t("mixProfiles.trueGenotypes.na")}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      {t("mixProfiles.trueGenotypes.naHelp")}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Contribuidores + controles */}
          <div className="lg:col-span-3 space-y-4">
            {/* Contribuidores */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {contributors.map((contributor) => (
                <div key={contributor.label} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {t("mixProfiles.controls.contributor", {
                        label: contributor.label,
                      })}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {contributor.sampleId ??
                        t("mixProfiles.trueGenotypes.noSample")}
                    </span>
                  </div>

                  <div className="mt-2">
                    <Popover
                      open={!!comboOpen[contributor.label]}
                      onOpenChange={(open) =>
                        setComboOpen((prev) => ({
                          ...prev,
                          [contributor.label]: open,
                        }))
                      }
                    >
                      <PopoverTrigger className="w-full justify-between border rounded-md p-2 flex flex-row items-center">
                        {contributor.sampleId ??
                          t("mixProfiles.trueGenotypes.noSample")}
                        <ChevronsUpDown className="ml-2 size-4 opacity-50" />
                      </PopoverTrigger>
                      <PopoverContent className="w-[220px] p-0">
                        <Command>
                          <CommandInput
                            placeholder={t(
                              "mixProfiles.controls.searchSample",
                              { label: contributor.label }
                            )}
                          />
                          <CommandList>
                            <CommandEmpty>
                              {t("mixProfiles.controls.noSampleFound")}
                            </CommandEmpty>
                            <CommandGroup>
                              <CommandItem
                                value="none"
                                onSelect={() => {
                                  handleSampleChange(contributor.label, null);
                                  setComboOpen((prev) => ({
                                    ...prev,
                                    [contributor.label]: false,
                                  }));
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 size-4",
                                    contributor.sampleId === null
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {t("mixProfiles.trueGenotypes.noSample")}
                              </CommandItem>
                              {sampleOptions.map((option) => (
                                <CommandItem
                                  key={option}
                                  value={option}
                                  onSelect={(value) => {
                                    handleSampleChange(
                                      contributor.label,
                                      value as SampleId
                                    );
                                    setComboOpen((prev) => ({
                                      ...prev,
                                      [contributor.label]: false,
                                    }));
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 size-4",
                                      contributor.sampleId === option
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {option}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="mt-4 space-y-2">
                    <Slider
                      value={[contributor.proportion]}
                      min={0}
                      max={100}
                      step={0.5}
                      onValueChange={(values) =>
                        handleProportionChange(
                          contributor.label,
                          values[0] ?? 0
                        )
                      }
                      disabled={!contributor.sampleId}
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step={0.5}
                        className="flex-1 rounded-md border px-2 py-1 text-sm focus:outline-hidden focus:ring-2 focus:ring-ring"
                        value={contributor.proportion}
                        onChange={(event) =>
                          handleProportionChange(
                            contributor.label,
                            Number(event.target.value)
                          )
                        }
                        disabled={!contributor.sampleId}
                      />
                      <span className="text-xs text-muted-foreground">%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Controles de simulación forense */}
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-5">
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-1">
                  <div className="text-sm font-medium">
                    {t("mixProfiles.parameters.at")}
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs whitespace-pre-line">
                      <p>{t("mixProfiles.parameters.atTooltip")}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <input
                  type="number"
                  min={0}
                  step={5}
                  className="mt-2 w-full rounded-md border px-2 py-1 text-sm"
                  value={AT}
                  onChange={(e) => setAT(Number(e.target.value))}
                />
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-1">
                  <div className="text-sm font-medium">
                    {t("mixProfiles.parameters.st")}
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs whitespace-pre-line">
                      <p>{t("mixProfiles.parameters.stTooltip")}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <input
                  type="number"
                  min={0}
                  step={10}
                  className="mt-2 w-full rounded-md border px-2 py-1 text-sm"
                  value={IT}
                  onChange={(e) => setIT(Number(e.target.value))}
                />
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-1">
                  <div className="text-sm font-medium">
                    {t("mixProfiles.parameters.degradationK")}
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs whitespace-pre-line">
                      <p>{t("mixProfiles.parameters.degradationKTooltip")}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <input
                  type="number"
                  min={0}
                  max={0.03}
                  step={0.001}
                  className="mt-2 w-full rounded-md border px-2 py-1 text-sm"
                  value={kDeg}
                  onChange={(e) => setKDeg(Number(e.target.value))}
                />
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-1">
                  <div className="text-sm font-medium">
                    {t("mixProfiles.parameters.noiseBase")}
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs whitespace-pre-line">
                      <p>{t("mixProfiles.parameters.noiseBaseTooltip")}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <input
                  type="number"
                  min={0}
                  step={1}
                  className="mt-2 w-full rounded-md border px-2 py-1 text-sm"
                  value={noise}
                  onChange={(e) => setNoise(Number(e.target.value))}
                />
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-1">
                  <div className="text-sm font-medium">
                    {t("mixProfiles.parameters.stutterLevel")}
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs whitespace-pre-line">
                      <p>{t("mixProfiles.parameters.stutterLevelTooltip")}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <input
                  type="number"
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  className="mt-2 w-full rounded-md border px-2 py-1 text-sm"
                  value={stutterScale}
                  onChange={(e) => setStutterScale(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Y-axis scale toggle + presets */}
            <div className="mt-4 grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex h-full items-center gap-2 rounded-lg border p-3">
                <Switch
                  id="y-axis-scale"
                  checked={useFixedScale}
                  onCheckedChange={setUseFixedScale}
                />
                <label
                  htmlFor="y-axis-scale"
                  className="text-sm font-medium cursor-pointer flex items-center gap-1"
                >
                  {useFixedScale
                    ? t("mixProfiles.parameters.fixedScale")
                    : t("mixProfiles.parameters.autoScale")}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs whitespace-pre-line">
                      <p>{t("mixProfiles.parameters.autoScaleTooltip")}</p>
                    </TooltipContent>
                  </Tooltip>
                </label>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handlePresetSelect("stutterMinor")}
                    className="w-full min-h-[56px] justify-start"
                  >
                    <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
                    {t("mixtures.presets.stutterMinor")}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" align="center">
                  {stutterMinorTooltip}
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handlePresetSelect("lowMinor")}
                    className="w-full min-h-[56px] justify-start"
                  >
                    <Activity className="mr-2 h-4 w-4" aria-hidden="true" />
                    {t("mixtures.presets.dropout")}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" align="center">
                  {lowMinorTooltip}
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handlePresetSelect("overlap")}
                    className="w-full min-h-[56px] justify-start"
                  >
                    <Layers className="mr-2 h-4 w-4" aria-hidden="true" />
                    {t("mixtures.presets.overlap")}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" align="center">
                  {overlapTooltip}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      {/* CE */}
      <div className="rounded-xl border p-4">
        <h3 className="text-base font-semibold">
          {t("mixProfiles.charts.ceTitle")}
        </h3>
        <CEChart
          dataTrue={ceTrueSeries}
          dataStutter={ceStutterSeries}
          markers={ceMarkers}
          analyticalThreshold={AT}
          interpretationThreshold={IT}
          showMarkers={showTrueGenotypes}
          baselineRFU={ce.baselineRFU || 0}
          baselineNoiseTrace={ce.baselineNoiseTrace || []}
          noisePeaks={ce.noisePeaks || []}
          allTruePeaks={ce.allTruePeaks || []}
          stutterPeaks={ce.stutterPeaks || []}
          useFixedScale={useFixedScale}
        />
      </div>

      {/* NGS */}
      <div className="rounded-xl border p-4">
        <h3 className="text-base font-semibold">
          {t("mixProfiles.charts.ngsTitle")}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed pb-2 max-w-none">
          {t("mixProfiles.ngs.disclaimer")}
        </p>
        <NGSChart
          bars={ngsBars}
          rows={ngsRows}
          analyticalThreshold={AT}
          interpretationThreshold={IT}
        />
      </div>
    </div>
  );
}

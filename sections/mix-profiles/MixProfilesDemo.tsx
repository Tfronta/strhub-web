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
  simulateMixtureForLocus,
  DEFAULT_MIX_PARAMS,
  type LocusId,
  type SampleId,
  type ContributorInput,
  type Peak,
} from "./data";

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
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

function parseNum(x: string | number): number {
  if (typeof x === "number") return x;
  const m = String(x).match(/\d+(\.\d+)?/);
  return m ? Number(m[0]) : NaN;
}

// ✅ Convierte picos discretos en una traza tipo “electroferograma” (suma de gaussianas)
function makeCETrace(peaks: Peak[]) {
  if (!peaks.length) return [];
  const nums = peaks
    .map((p) => parseNum(String(p.allele)))
    .filter((n) => !Number.isNaN(n));
  const minA = Math.min(...nums) - 1;
  const maxA = Math.max(...nums) + 1;

  const step = 0.02; // resolución del eje x
  const sigma = 0.06; // ancho de pico (~0.06 alelos)

  const out: { allele: number; rfu: number }[] = [];
  for (let x = minA; x <= maxA; x = +(x + step).toFixed(5)) {
    let y = 0;
    for (const p of peaks) {
      const mu = parseNum(String(p.allele));
      if (Number.isNaN(mu)) continue;
      const A = p.rfu; // altura del pico
      const g = Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
      y += A * g;
    }
    out.push({ allele: x, rfu: y });
  }
  return out;
}

type ContributorState = {
  label: "A" | "B" | "C";
  sampleId: SampleId | null;
  proportion: number;
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

  if (active.length === 0) {
    return updated.map((c, idx) => ({
      ...c,
      proportion: idx === 0 ? 100 : 0,
    }));
  }

  if (active.length === 1) {
    return updated.map((c) => ({
      ...c,
      proportion: c.label === active[0].label ? 100 : 0,
    }));
  }

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
    if (c.label === anchor.label) {
      return { ...c, proportion: Number(anchorValue.toFixed(1)) };
    }

    if (remainingCapacity <= 0) {
      return { ...c, proportion: 0 };
    }

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
    return next.map((c) => {
      if (c.label === anchor.label) {
        return {
          ...c,
          proportion: Number(clamp(c.proportion + diff, 0, desired).toFixed(1)),
        };
      }
      return c;
    });
  }

  return next;
}

export default function MixProfilesDemo() {
  const markerKeys = useMemo(() => {
    if (LOCI_ORDER.length) return LOCI_ORDER as LocusId[];
    return Object.keys(demoCatalog) as LocusId[];
  }, []);

  const [selectedMarker, setSelectedMarker] = useState<LocusId>(
    () => markerKeys[0] ?? ("CSF1PO" as LocusId)
  );
  const [locusOpen, setLocusOpen] = useState(false);
  const [contributors, setContributors] = useState<ContributorState[]>([
    {
      label: "A",
      sampleId: (sampleOptions[0] as SampleId) ?? null,
      proportion: sampleOptions.length > 1 ? 60 : 100,
    },
    {
      label: "B",
      sampleId: (sampleOptions[1] as SampleId) ?? null,
      proportion: sampleOptions.length > 1 ? 40 : 0,
    },
    {
      label: "C",
      sampleId: null,
      proportion: 0,
    },
  ]);
  const [comboOpen, setComboOpen] = useState<Record<string, boolean>>({
    A: false,
    B: false,
    C: false,
  });

  useEffect(() => {
    if (!markerKeys.length) return;
    if (!markerKeys.includes(selectedMarker)) {
      setSelectedMarker(markerKeys[0]);
    }
  }, [markerKeys, selectedMarker]);

  useEffect(() => {
    setContributors((prev) => normalizeContributors(prev));
  }, []);

  const handleSampleChange = (
    label: ContributorState["label"],
    value: SampleId | null
  ) => {
    setContributors((prev) => {
      const next = prev.map((c) =>
        c.label === label
          ? {
              ...c,
              sampleId: value,
              proportion: value ? c.proportion : 0,
            }
          : c
      );
      return normalizeContributors(next, label);
    });
  };

  const handleProportionChange = (
    label: ContributorState["label"],
    value: number
  ) => {
    const sanitized = Number.isFinite(value) ? value : 0;
    setContributors((prev) => {
      const next = prev.map((c) =>
        c.label === label ? { ...c, proportion: clamp(sanitized, 0, 100) } : c
      );
      return normalizeContributors(next, label);
    });
  };

  const activeContributors: ContributorInput[] = useMemo(() => {
    const active = contributors.filter((c) => c.sampleId && c.proportion > 0);
    const total = active.reduce((sum, c) => sum + c.proportion, 0);
    if (!active.length) return [];
    const safeTotal = total > 0 ? total : active.length * (100 / active.length);
    return active.map((c) => ({
      sampleId: c.sampleId as SampleId,
      label: c.label,
      proportion: c.proportion / safeTotal || 0,
    }));
  }, [contributors]);

  const ce = useMemo(() => {
    if (!activeContributors.length) {
      return { locusId: selectedMarker, peaks: [], notes: [] };
    }
    return simulateMixtureForLocus({
      locusId: selectedMarker,
      contributors: activeContributors,
      params: {
        targetPerLocus: DEFAULT_MIX_PARAMS.targetPerLocus,
        hetImbalanceCV: DEFAULT_MIX_PARAMS.hetImbalanceCV,
        showStutter: true,
        seed: "strhub-mix",
      },
    });
  }, [activeContributors, selectedMarker]);

  const ceSeries = useMemo(() => makeCETrace(ce.peaks), [ce.peaks]);

  const ngsRows = useMemo(
    () => cePeaksToNGSRowsWithSeq(selectedMarker, ce.peaks),
    [selectedMarker, ce.peaks]
  );

  const ngsBars = useMemo(() => {
    const grouped = new Map<number, { allele: number; coverage: number }>();

    for (const r of ngsRows) {
      const alleleNum = parseNum(r.allele);
      if (!Number.isNaN(alleleNum) && alleleNum > 0) {
        const existing = grouped.get(alleleNum);
        if (existing) {
          existing.coverage += r.coverage;
        } else {
          grouped.set(alleleNum, { allele: alleleNum, coverage: r.coverage });
        }
      }
    }

    return Array.from(grouped.values()).sort((a, b) => a.allele - b.allele);
  }, [ngsRows]);

  const mixSummary = useMemo(() => {
    if (!contributors.length) return "";
    return contributors
      .map((c) => {
        const base = `${c.label}:`;
        if (!c.sampleId) return `${base} —`;
        return `${base} ${c.proportion.toFixed(1)}%`;
      })
      .join(" • ");
  }, [contributors]);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border p-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <label className="text-sm font-medium">Locus</label>
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
          </div>

          <div className="lg:col-span-3 space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {contributors.map((contributor) => (
                <div key={contributor.label} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Contributor {contributor.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {contributor.sampleId ?? "None"}
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
                        {contributor.sampleId ?? "None"}
                        <ChevronsUpDown className="ml-2 size-4 opacity-50" />
                      </PopoverTrigger>
                      <PopoverContent className="w-[220px] p-0">
                        <Command>
                          <CommandInput
                            placeholder={`Search ${contributor.label} sample...`}
                          />
                          <CommandList>
                            <CommandEmpty>No sample found.</CommandEmpty>
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
                                None
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
            <div className="text-xs text-muted-foreground">{mixSummary}</div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border p-4">
        <h3 className="text-base font-semibold">CE Analysis (RFU)</h3>
        <p className="text-sm text-muted-foreground">
          Capillary Electrophoresis Analysis
        </p>
        <CEChart
          data={ceSeries}
          analyticalThreshold={DEFAULT_AT}
          interpretationThreshold={DEFAULT_IT}
        />
      </div>

      <div className="rounded-xl border p-4">
        <h3 className="text-base font-semibold">NGS Analysis (Reads)</h3>
        <p className="text-sm text-muted-foreground">
          Next-Generation Sequencing Analysis
        </p>
        <NGSChart
          bars={ngsBars}
          rows={ngsRows}
          analyticalThreshold={DEFAULT_AT}
          interpretationThreshold={DEFAULT_IT}
        />
      </div>
    </div>
  );
}

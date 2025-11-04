// app/sections/mix-profiles/MixProfilesDemo.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DEFAULT_AT,
  DEFAULT_IT,
  demoCatalog,
  SAMPLES_GENOTYPES,
  simulateCEFromSamples,
  cePeaksToNGSRowsWithSeq,
  type LocusId,
  type DemoSampleId,
  type Peak,
} from "./data";

import CEChart from "./charts/CEChart";
import NGSChart from "./charts/NGSChart";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Helpers de UI
const SAMPLE_OPTIONS = Object.keys(SAMPLES_GENOTYPES) as DemoSampleId[];

function parseNum(x: string | number): number {
  if (typeof x === "number") return x;
  const m = String(x).match(/\d+(\.\d+)?/);
  return m ? Number(m[0]) : NaN;
}

// (opcional) adaptación simple a puntos discretos
function toCESeries(peaks: Peak[]) {
  return peaks.map((p) => ({
    allele: parseNum(String(p.allele)),
    label: String(p.allele),
    rfu: p.rfu,
    kind: p.kind,
  }));
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

export default function MixProfilesDemo() {
  // --------- opciones disponibles desde el catálogo real (CODIS Core) ----------
  const markerKeys = useMemo(() => Object.keys(demoCatalog) as LocusId[], []);

  // --------- estados base (con guardas por si el catálogo está vacío) ----------
  const [selectedMarker, setSelectedMarker] = useState<LocusId>(
    () => markerKeys[0] ?? ("CSF1PO" as LocusId)
  );
  const [sampleA, setSampleA] = useState<DemoSampleId>(
    () => SAMPLE_OPTIONS[0] ?? ("Sample_A" as DemoSampleId)
  );
  const [sampleB, setSampleB] = useState<DemoSampleId>(
    () => SAMPLE_OPTIONS[1] ?? ("Sample_B" as DemoSampleId)
  );
  const [ratioA, setRatioA] = useState<number>(0.5); // 50/50 inicial

  // Si cambia la lista de marcadores (carga de catálogo), normalizamos selección
  useEffect(() => {
    if (!markerKeys.length) return;
    if (!markerKeys.includes(selectedMarker)) setSelectedMarker(markerKeys[0]);
  }, [markerKeys, selectedMarker]);

  // --------- simulación CE + NGS derivado ---------
  const ce = useMemo(() => {
    return simulateCEFromSamples({
      locusId: selectedMarker,
      sampleAId: sampleA,
      sampleBId: sampleB,
      ratioA,
      totalRFU: 400,
      showStutter: true,
    });
  }, [selectedMarker, sampleA, sampleB, ratioA]);

  // ✅ usar la traza “con picos”
  const ceSeries = useMemo(() => makeCETrace(ce.peaks), [ce.peaks]);

  const ngsRows = useMemo(
    () => cePeaksToNGSRowsWithSeq(selectedMarker, ce.peaks),
    [selectedMarker, ce.peaks]
  );

  // Barras para NGSChart (numéricas) + etiqueta original para el tooltip
  const ngsBars = useMemo(() => {
    // Group by numeric allele value to aggregate coverage for isoalleles
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

  return (
    <div className="space-y-6">
      {/* Controles */}
      <div className="rounded-xl border p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Locus */}
          <div>
            <label className="text-sm font-medium">Locus</label>
            <Select
              value={selectedMarker}
              onValueChange={(v) => setSelectedMarker(v as LocusId)}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select marker" />
              </SelectTrigger>
              <SelectContent>
                {markerKeys.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sample A */}
          <div>
            <label className="text-sm font-medium">Sample A</label>
            <Select
              value={sampleA}
              onValueChange={(v) => setSampleA(v as DemoSampleId)}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Sample A" />
              </SelectTrigger>
              <SelectContent>
                {SAMPLE_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sample B */}
          <div>
            <label className="text-sm font-medium">Sample B</label>
            <Select
              value={sampleB}
              onValueChange={(v) => setSampleB(v as DemoSampleId)}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Sample B" />
              </SelectTrigger>
              <SelectContent>
                {SAMPLE_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Slider de proporción */}
        <div className="mt-4">
          <label className="text-sm font-medium">Ratio A</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={ratioA}
            onChange={(e) => setRatioA(Number(e.target.value))}
            className="w-full"
            aria-label="Ratio A"
          />
        </div>
        <div className="mt-1 text-sm text-muted-foreground">
          A {Math.round(ratioA * 100)}% / B {Math.round((1 - ratioA) * 100)}%
        </div>
      </div>

      {/* CE */}
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

      {/* NGS */}
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

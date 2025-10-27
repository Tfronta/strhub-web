// app/sections/mix-profiles/MixProfilesDemo.tsx
'use client';

import { useMemo, useState, useEffect } from 'react';
import CEChart from './charts/CEChart';
import NGSChart from './charts/NGSChart';
import { simulateMixture, type Simulation, type CatalogMarker } from './utils/simulate';
import { DEFAULT_AT, DEFAULT_IT, demoCatalog } from './data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CATALOG } from '@/app/catalog/data';

type Props = {
  markerId?: string; // opcional; si viene vacío, usamos el primero disponible
  sampleA?: string;
  sampleB?: string;
};

const SAMPLE_OPTIONS = ['Sample_A', 'Sample_B', 'Sample_C', 'Sample_D'];

export default function MixProfilesDemo({
  markerId,
  sampleA = 'Sample_A',
  sampleB = 'Sample_B',
}: Props) {
  // Modo: catálogo real (CATALOG) o demo (demoCatalog)
  const [useDemo, setUseDemo] = useState(false);
  // Forzar nueva simulación (nueva selección aleatoria de alelos)
  const [nonce, setNonce] = useState(0);

  // Lista de marcadores disponible según modo
  const markerKeys = useMemo<string[]>(
    () => Object.keys(useDemo ? (demoCatalog as any) : (CATALOG as any)),
    [useDemo]
  );

  // Marcador seleccionado (si markerId está y existe, úsalo; si no, el primero)
  const [selectedMarker, setSelectedMarker] = useState<string>(() => {
    const keys = Object.keys(CATALOG as any);
    const candidate = markerId && keys.includes(markerId) ? markerId : keys[0];
    return candidate;
  });

  // Si cambiamos de modo y el marcador actual no existe ahí, ajustar al primero
  useEffect(() => {
    if (!markerKeys.length) return;
    if (!markerKeys.includes(selectedMarker)) {
      setSelectedMarker(markerKeys[0]);
    }
  }, [useDemo, markerKeys, selectedMarker]);

  const [selA, setSelA] = useState<string>(sampleA);
  const [selB, setSelB] = useState<string>(sampleB);
  const [ratioA, setRatioA] = useState(0.25); // 25/75 inicial
  const ratioB = 1 - ratioA;

  // Construir el catálogo en el formato que espera simulateMixture
  const normalizedCatalog: Record<string, CatalogMarker> = useMemo(() => {
    if (useDemo) {
      // demoCatalog ya viene como { id, name, type, alleles }
      return Object.fromEntries(
        Object.entries(demoCatalog).map(([k, v]: any) => [
          k,
          { id: v.id ?? k, name: v.name ?? k, type: v.type, alleles: v.alleles },
        ])
      );
    }
    // CATALOG (real) viene como { name, type, alleleObjects }
    return Object.fromEntries(
      Object.entries(CATALOG as any).map(([k, v]: any) => [
        k,
        {
          id: k,
          name: v.name ?? k,
          type: v.type,
          alleles: Array.isArray(v.alleleObjects) ? v.alleleObjects : (v.alleles ?? []),
        },
      ])
    );
  }, [useDemo]);

  // Correr la simulación (se actualiza con ratio, samples, marcador, modo y nonce)
  const simulation: Simulation = useMemo(() => {
    return simulateMixture({
      markerId: selectedMarker,
      ratioA,
      sampleA: selA,
      sampleB: selB,
      catalog: normalizedCatalog,
      baseCoverage: 450,
      baseRFU: 360,
    });
  }, [selectedMarker, ratioA, selA, selB, normalizedCatalog, nonce]);

  return (
    <div className="space-y-6">
      {/* Controles */}
      <div className="rounded-xl border p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="text-sm font-medium">Locus</label>
            <Select value={selectedMarker} onValueChange={setSelectedMarker}>
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

          <div>
            <label className="text-sm font-medium">Sample A</label>
            <Select value={selA} onValueChange={setSelA}>
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

          <div>
            <label className="text-sm font-medium">Sample B</label>
            <Select value={selB} onValueChange={setSelB}>
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
          <div className="mt-1 text-sm text-muted-foreground">
            A {Math.round(ratioA * 100)}% / B {Math.round(ratioB * 100)}%
          </div>

          {/* Botones: Re-simulate & Back to demo (sin dependencia de <Button/>) */}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setNonce((n) => n + 1)}
              className="px-3 py-1 rounded-md bg-[var(--chart-2)] text-white disabled:opacity-60"
              title="Pick a different subset of alleles"
            >
              Re-simulate
            </button>
            <button
              onClick={() => setUseDemo(true)}
              className="px-3 py-1 rounded-md border border-border bg-background hover:bg-muted"
              title="Use demo catalog"
            >
              Back to demo
            </button>
            {useDemo && (
              <span className="text-xs text-muted-foreground">Using demo data</span>
            )}
          </div>
        </div>
      </div>

      {/* CE */}
      <div className="rounded-xl border p-4">
        <h3 className="text-base font-semibold">CE Analysis (RFU)</h3>
        <p className="text-sm text-muted-foreground">Capillary Electrophoresis Analysis</p>
        <CEChart
          data={simulation.ceSeries}
          analyticalThreshold={DEFAULT_AT}
          interpretationThreshold={DEFAULT_IT}
        />
      </div>

      {/* NGS */}
      <div className="rounded-xl border p-4">
        <h3 className="text-base font-semibold">NGS Analysis (Reads)</h3>
        <p className="text-sm text-muted-foreground">Next-Generation Sequencing Analysis</p>
        <NGSChart
          bars={simulation.ngsBars}
          rows={simulation.ngsTable}
          analyticalThreshold={DEFAULT_AT}
          interpretationThreshold={DEFAULT_IT}
        />
      </div>
    </div>
  );
}

// app/sections/mix-profiles/data.ts
// ====================================================================
//  CODIS desde CATALOG real + mezcla CE determinista + NGS con secuencias
//  Exports compatibles con tu UI actual.
// ====================================================================

import { CATALOG } from "@/app/catalog/data";
import { markerData } from "@/lib/markerData";

// ----------------------------------------------------
// Umbrales (RFU)
// ----------------------------------------------------
export const DEFAULT_AT = 50; // Analytical Threshold
export const DEFAULT_IT = 80; // Interpretation/Stochastic Threshold

// ----------------------------------------------------
// (Opcional) Colores para charts desde CSS vars
// ----------------------------------------------------
export function getChartColors(): string[] {
  const fallbacks = ['#4F46E5', '#06B6D4', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6'];
  if (typeof window === 'undefined') return fallbacks;
  const styles = getComputedStyle(document.documentElement);
  const vals: string[] = [];
  for (let i = 1; i <= 6; i++) {
    let v = styles.getPropertyValue(`--chart-${i}`).trim();
    if (!v) v = styles.getPropertyValue(`--color-chart-${i}`).trim();
    if (v) vals.push(v);
  }
  return vals.length ? vals : fallbacks;
}

// ----------------------------------------------------
// Carga CATALOG y construye demoCatalog solo con CODIS Core
// (mismo nombre que usabas antes, pero ahora es el catálogo real filtrado)
// ----------------------------------------------------
function isCodisCore(entry: any) {
  const tag = (entry?.type || entry?.category || "").toString().toLowerCase();
  return tag.includes("codis") && tag.includes("core");
}

type DemoAllele = {
  size: number | string;
  repeatSequence?: string;
  fullSequence?: string;
  stutterPct?: number;
  isIsoallele?: boolean;
};

export const demoCatalog: Record<string, {
  id: string;
  name: string;
  type: string;
  alleles: DemoAllele[];
}> = Object.fromEntries(
  Object.entries(CATALOG as any)
    .filter(([_, v]) => isCodisCore(v))
    .map(([k, v]: any) => {
      const list = Array.isArray(v.alleleObjects) ? v.alleleObjects : (v.alleles || []);
      const alleles: DemoAllele[] = (list || []).map((a: any) => ({
        size: a.size,
        repeatSequence: a.repeatSequence,
        fullSequence: a.fullSequence,
        stutterPct: a.stutterPct,
        isIsoallele: !!a.isIsoallele,
      }));
      return [k, { id: k, name: v.name ?? k, type: v.type ?? v.category ?? "CODIS Core", alleles }];
    })
);

// ----------------------------------------------------
// Genotipos reales para mezcla (hasta 3 contribuyentes)
// ----------------------------------------------------
type AlleleValue = number;

type SampleProfile = {
  sampleId: string;
  loci: Record<string, { alleles: AlleleValue[] }>;
};

export const SAMPLE_DATABASE: Record<string, SampleProfile> = {
  HG02944: {
    sampleId: "HG02944",
    loci: {
      CSF1PO: { alleles: [7, 8] },
      D10S1248: { alleles: [13, 14] },
      D12S391: { alleles: [17, 20] },
      D13S317: { alleles: [11, 13] },
      D16S539: { alleles: [11, 12] },
      D18S51: { alleles: [15, 16] },
      D19S433: { alleles: [13, 14.2] },
      D1S1656: { alleles: [11, 15] },
      D22S1045: { alleles: [10, 17] },
      D2S1338: { alleles: [20, 22] },
      D2S441: { alleles: [14, 14] },
      D3S1358: { alleles: [16, 17] },
      D5S818: { alleles: [11, 12] },
      D7S820: { alleles: [10, 11] },
      D8S1179: { alleles: [14, 15] },
      FGA: { alleles: [21, 24] },
      PentaD: { alleles: [8, 10] },
      PentaE: { alleles: [7, 10] },
      TH01: { alleles: [6, 8] },
      TPOX: { alleles: [8, 9] },
      vWA: { alleles: [15, 17] },
    },
  },
  HG00097: {
    sampleId: "HG00097",
    loci: {
      CSF1PO: { alleles: [12, 12] },
      D10S1248: { alleles: [15, 15] },
      D12S391: { alleles: [22, 23] },
      D13S317: { alleles: [11, 14] },
      D16S539: { alleles: [11, 11] },
      D18S51: { alleles: [14, 14] },
      D19S433: { alleles: [13, 13] },
      D1S1656: { alleles: [15, 17.3] },
      D22S1045: { alleles: [16, 16] },
      D2S1338: { alleles: [22, 24] },
      D2S441: { alleles: [10, 14] },
      D3S1358: { alleles: [15, 16] },
      D5S818: { alleles: [11, 11] },
      D7S820: { alleles: [13, 10] },
      D8S1179: { alleles: [13, 10] },
      FGA: { alleles: [22, 23] },
      PentaD: { alleles: [9, 12] },
      PentaE: { alleles: [7, 7] },
      TH01: { alleles: [7, 6] },
      TPOX: { alleles: [8, 11] },
      vWA: { alleles: [17, 17] },
    },
  },
  HG00145: {
    sampleId: "HG00145",
    loci: {
      CSF1PO: { alleles: [12, 12] },
      D10S1248: { alleles: [14, 16] },
      D12S391: { alleles: [18, 18] },
      D13S317: { alleles: [10, 13] },
      D16S539: { alleles: [13, 13] },
      D18S51: { alleles: [18, 17] },
      D19S433: { alleles: [14, 13] },
      D1S1656: { alleles: [16, 16.3] },
      D22S1045: { alleles: [15, 16] },
      D2S1338: { alleles: [20, 25] },
      D2S441: { alleles: [10, 10] },
      D3S1358: { alleles: [16, 17] },
      D5S818: { alleles: [12, 12] },
      D7S820: { alleles: [8, 10] },
      D8S1179: { alleles: [12, 14] },
      FGA: { alleles: [22, 21] },
      PentaD: { alleles: [9, 11] },
      PentaE: { alleles: [7, 12] },
      TH01: { alleles: [8, 9] },
      TPOX: { alleles: [8, 11] },
      vWA: { alleles: [17, 18] },
    },
  },
  HG00372: {
    sampleId: "HG00372",
    loci: {
      CSF1PO: { alleles: [13, 10] },
      D10S1248: { alleles: [13, 13] },
      D12S391: { alleles: [18, 19] },
      D13S317: { alleles: [11, 9] },
      D16S539: { alleles: [9, 12] },
      D18S51: { alleles: [16, 19] },
      D19S433: { alleles: [14, 13] },
      D1S1656: { alleles: [14, 17.3] },
      D22S1045: { alleles: [17, 15] },
      D2S1338: { alleles: [18, 24] },
      D2S441: { alleles: [11.3, 14] },
      D3S1358: { alleles: [15, 16] },
      D5S818: { alleles: [12, 11] },
      D7S820: { alleles: [11, 11] },
      D8S1179: { alleles: [11, 14] },
      FGA: { alleles: [20, 21] },
      PentaD: { alleles: [9, 10] },
      PentaE: { alleles: [12, 12] },
      TH01: { alleles: [7, 6] },
      TPOX: { alleles: [8, 9] },
      vWA: { alleles: [18, 18] },
    },
  },
  HG01063: {
    sampleId: "HG01063",
    loci: {
      CSF1PO: { alleles: [12, 12] },
      D10S1248: { alleles: [13, 16] },
      D12S391: { alleles: [18, 23] },
      D13S317: { alleles: [13, 14] },
      D16S539: { alleles: [12, 12] },
      D18S51: { alleles: [12, 22] },
      D19S433: { alleles: [14, 12] },
      D1S1656: { alleles: [13, 17.3] },
      D22S1045: { alleles: [17, 16] },
      D2S1338: { alleles: [23, 17] },
      D2S441: { alleles: [10, 14] },
      D3S1358: { alleles: [16, 18] },
      D5S818: { alleles: [12, 7] },
      D7S820: { alleles: [8, 11] },
      D8S1179: { alleles: [10, 14] },
      FGA: { alleles: [19, 20] },
      PentaD: { alleles: [13, 5] },
      PentaE: { alleles: [7, 13] },
      TH01: { alleles: [9.3, 9.3] },
      TPOX: { alleles: [8, 8] },
      vWA: { alleles: [14, 16] },
    },
  },
};

export type SampleId = keyof typeof SAMPLE_DATABASE;
export type LocusId = string;

export const sampleOptions = Object.keys(SAMPLE_DATABASE) as SampleId[];

export const LOCI_ORDER: LocusId[] = Array.from(
  new Set(
    Object.values(SAMPLE_DATABASE)
      .flatMap((sample) => Object.keys(sample.loci))
  )
).sort();

// ----------------------------------------------------
// Motor CE determinista con 1-3 contribuyentes
// ----------------------------------------------------
export type AlleleLike = number | string;

export type Peak = {
  allele: AlleleLike;
  rfu: number;
  kind: "true" | "stutter";
  source: string;
};

export type LocusSimResult = {
  locusId: string;
  peaks: Peak[];
  notes: string[];
};

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));

function hash01(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h >>>= 0;
  return (h % 10000) / 10000;
}

function formatAlleleLabel(value: number): string {
  const decimals = value % 1 === 0 ? 0 : 1;
  const factor = decimals ? 10 : 1;
  return (Math.round(value * factor) / factor).toString();
}

type StutterPreset = {
  minus1: number;
  plus1?: number;
  minus2?: number;
};

const STUTTER_PRESETS: Record<LocusId, StutterPreset> = {
  CSF1PO: { minus1: 0.05 },
  D10S1248: { minus1: 0.04 },
  D12S391: { minus1: 0.07, plus1: 0.015 },
  D13S317: { minus1: 0.05 },
  D16S539: { minus1: 0.04 },
  D18S51: { minus1: 0.09, plus1: 0.02 },
  D19S433: { minus1: 0.03 },
  D1S1656: { minus1: 0.08, plus1: 0.01 },
  D22S1045: { minus1: 0.04 },
  D2S1338: { minus1: 0.07 },
  D2S441: { minus1: 0.04 },
  D3S1358: { minus1: 0.06 },
  D5S818: { minus1: 0.05 },
  D7S820: { minus1: 0.05 },
  D8S1179: { minus1: 0.06 },
  FGA: { minus1: 0.1, plus1: 0.025, minus2: 0.015 },
  PentaD: { minus1: 0.08, minus2: 0.02 },
  PentaE: { minus1: 0.07 },
  TH01: { minus1: 0.03 },
  TPOX: { minus1: 0.02 },
  vWA: { minus1: 0.06 },
};

const DEFAULT_STUTTER: StutterPreset = { minus1: 0.06 };

export type ContributorInput = {
  sampleId: SampleId;
  proportion: number; // 0..1
  label: "A" | "B" | "C";
};

export type MixtureParams = {
  targetPerLocus: number;
  hetImbalanceCV: number;
  showStutter: boolean;
  seed: string;
};

export const DEFAULT_MIX_PARAMS: MixtureParams = {
  targetPerLocus: 400,
  hetImbalanceCV: 0.08,
  showStutter: true,
  seed: "strhub-mix",
};

function getSampleAlleles(locusId: LocusId, sampleId: SampleId): number[] {
  const profile = SAMPLE_DATABASE[sampleId];
  const alleles = profile?.loci?.[locusId]?.alleles ?? [];
  return alleles.filter((a) => a != null);
}

function splitAlleles(
  alleles: number[],
  totalRFU: number,
  seed: string,
  cv: number
): number[] {
  if (!alleles.length) return [];
  if (alleles.length === 1) return [totalRFU];

  const bias = (hash01(seed) - 0.5) * 2 * cv;
  const p1 = clamp(0.5 + bias, 0.2, 0.8);
  const weights = [p1, 1 - p1];

  if (alleles.length > 2) {
    const rest = Math.max(1, alleles.length - 2);
    const residual = Math.max(0, 1 - weights[0] - weights[1]);
    const per = residual / rest;
    for (let i = 2; i < alleles.length; i++) {
      weights[i] = per;
    }
  }

  const sum = weights.reduce((acc, w) => acc + w, 0);
  return weights.map((w) => (w / sum) * totalRFU);
}

function addToMap(
  map: Map<string, { rfu: number; sources: Set<string> }>,
  allele: string,
  inc: number,
  label: string
) {
  if (inc <= 0) return;
  const prev = map.get(allele);
  if (!prev) {
    map.set(allele, { rfu: inc, sources: new Set([label]) });
  } else {
    prev.rfu += inc;
    prev.sources.add(label);
  }
}

function buildSourceLabel(vals: Set<string>): string {
  return Array.from(vals).sort().join("+");
}

function createStutter(
  peak: Peak,
  preset: StutterPreset,
  map: Map<string, { rfu: number; sources: Set<string> }>
) {
  const alleleNum = Number(peak.allele);
  if (Number.isNaN(alleleNum)) return;

  const addStutter = (delta: number, rate?: number) => {
    if (!rate || rate <= 0) return;
    const shifted = alleleNum + delta;
    const label = formatAlleleLabel(shifted);
    addToMap(map, label, peak.rfu * rate, peak.source);
  };

  addStutter(-1, preset.minus1 ?? DEFAULT_STUTTER.minus1);
  addStutter(1, preset.plus1);
  addStutter(-2, preset.minus2);
}

type MixtureArgs = {
  locusId: LocusId;
  contributors: ContributorInput[];
  params?: Partial<MixtureParams>;
};

export function simulateMixtureForLocus({
  locusId,
  contributors,
  params = {},
}: MixtureArgs): LocusSimResult {
  const { targetPerLocus, hetImbalanceCV, showStutter, seed } = {
    ...DEFAULT_MIX_PARAMS,
    ...params,
  };

  const trueMap = new Map<string, { rfu: number; sources: Set<string> }>();

  contributors
    .filter((c) => c.proportion > 0)
    .forEach((contrib) => {
      const alleles = getSampleAlleles(locusId, contrib.sampleId);
      if (!alleles.length) return;
      const contributorRFU = targetPerLocus * contrib.proportion;
      const split = splitAlleles(
        alleles,
        contributorRFU,
        `${seed}|${contrib.label}|${locusId}`,
        hetImbalanceCV
      );
      split.forEach((rfu, idx) => {
        const alleleValue = alleles[idx] ?? alleles[alleles.length - 1];
        const label = formatAlleleLabel(alleleValue);
        addToMap(trueMap, label, rfu, contrib.label);
      });
    });

  const truePeaks: Peak[] = Array.from(trueMap.entries()).map(([allele, val]) => ({
    allele,
    rfu: val.rfu,
    kind: "true" as const,
    source: buildSourceLabel(val.sources),
  }));

  const preset = STUTTER_PRESETS[locusId] ?? DEFAULT_STUTTER;
  const stutterMap = new Map<string, { rfu: number; sources: Set<string> }>();

  if (showStutter) {
    truePeaks.forEach((peak) => createStutter(peak, preset, stutterMap));
  }

  const stutterPeaks: Peak[] = Array.from(stutterMap.entries())
    .map(([allele, val]) => ({
      allele,
      rfu: val.rfu,
      kind: "stutter" as const,
      source: buildSourceLabel(val.sources),
    }))
    .filter((p) => p.rfu >= DEFAULT_AT);

  const allPeaks = [...truePeaks, ...stutterPeaks].sort(
    (a, b) => Number(a.allele) - Number(b.allele)
  );

  const notes: string[] = [];
  allPeaks
    .filter((p) => p.kind === "true")
    .forEach((p) => {
      if (p.rfu < DEFAULT_IT) {
        notes.push(
          `Posible dropout: ${p.allele} (${Math.round(
            p.rfu
          )} RFU) < IT (${DEFAULT_IT}).`
        );
      }
    });

  return {
    locusId,
    peaks: allPeaks,
    notes,
  };
}

// ----------------------------------------------------
// NGS: tabla derivada de picos CE + secuencias reales del CATALOG
// ----------------------------------------------------

function normalizeMarkerKey(id: string) {
  return id.toLowerCase().replace(/\s+/g, "_").replace(/-/g, "_");
}

type MarkerSequenceEntry = {
  allele?: string;
  pattern?: string;
  sequence?: string;
};

export function cePeaksToNGSRowsWithSeq(
  locusId: LocusId,
  peaks: Peak[]
) {
  const k = 1.2; // RFU -> reads (escala didáctica)

  // % stutter observado por alelo target (target = alelo -1)
  const stPctByTarget: Record<string, number> = {};
  for (const p of peaks) {
    if (p.kind !== 'stutter') continue;
    const target = String(p.allele);              // p.ej. "12" (stutter de 13→12)
    const parent = String(Number(target) + 1);    // alelo padre
    const parentRFU =
      peaks.find(q => q.kind === 'true' && String(q.allele) === parent)?.rfu || 0;
    if (parentRFU > 0) {
      stPctByTarget[target] = Math.round((p.rfu / parentRFU) * 100);
    }
  }

  // Solo alelos verdaderos para la tabla
  const truePeaks = peaks.filter(p => p.kind === 'true');

  // Catálogo del locus (para secuencias e isoalelos)
  const locus = demoCatalog[locusId];
  const entries = locus?.alleles ?? [];
  const markerKey = normalizeMarkerKey(locusId);
  const markerEntry = (markerData as Record<string, any>)[markerKey];
  const markerSequences: MarkerSequenceEntry[] = Array.isArray(markerEntry?.sequences)
    ? markerEntry.sequences
    : [];

  // Filas de la tabla
  const rows: Array<{
    allele: string;
    coverage: number;
    stutterPct: number | '—';
    repeatSequence: string | '—';
    fullSequence: string | '—';
  }> = [];

  for (const p of truePeaks) {
    const alleleLabel = String(p.allele);
    const baseReads = Math.max(1, Math.round(p.rfu * k)); // ≥ 1 para que haya barra

    // Todas las entradas del catálogo que coinciden con ese tamaño
    const entriesForSize = entries.filter(e => String(e.size) === alleleLabel);
    const sequencesForAllele = markerSequences.filter(
      (seq) => String(seq?.allele ?? "") === alleleLabel
    );

    if (sequencesForAllele.length > 0) {
      const perSeq = Math.max(1, Math.floor(baseReads / sequencesForAllele.length));
      sequencesForAllele.forEach((seq, index) => {
        const hasMultiple = sequencesForAllele.length > 1;
        rows.push({
          allele: hasMultiple ? `${alleleLabel} iso${index + 1}` : alleleLabel,
          coverage: perSeq,
          stutterPct: stPctByTarget[alleleLabel] ?? '—',
          repeatSequence: seq?.pattern ?? '—',
          fullSequence: seq?.sequence ?? '—',
        });
      });
      continue;
    }

    if (entriesForSize.length === 0) {
      rows.push({
        allele: alleleLabel,
        coverage: baseReads,
        stutterPct: stPctByTarget[alleleLabel] ?? '—',
        repeatSequence: '—',
        fullSequence: '—',
      });
      continue;
    }

    // ¿Hay múltiples isoalelos para este tamaño?
    const isoCount = entriesForSize.filter(e => e.isIsoallele).length;
    const hasMultipleIso = isoCount > 1;

    const split = Math.max(1, entriesForSize.length);
    const perIso = Math.max(1, Math.floor(baseReads / split));

    entriesForSize.forEach((entry, i) => {
      // Solo agregamos "isoN" si realmente hay múltiples isoalelos
      const label =
        entry.isIsoallele && hasMultipleIso ? `${alleleLabel} iso${i + 1}` : alleleLabel;

      rows.push({
        allele: label,
        coverage: perIso,
        stutterPct: stPctByTarget[alleleLabel] ?? '—',
        repeatSequence: entry.repeatSequence ?? '—',
        fullSequence: entry.fullSequence ?? '—',
      });
    });
  }

  // Orden por tamaño (mantiene iso juntos)
  rows.sort((a, b) => {
    const na = Number(String(a.allele).replace(/[^\d.]/g, ''));
    const nb = Number(String(b.allele).replace(/[^\d.]/g, ''));
    return (Number.isNaN(na) || Number.isNaN(nb)) ? String(a.allele).localeCompare(String(b.allele)) : na - nb;
  });

  return rows;
}
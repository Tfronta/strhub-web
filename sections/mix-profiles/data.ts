// app/sections/mix-profiles/data.ts
// ====================================================================
//  CODIS desde CATALOG real + mezcla CE determinista + NGS con secuencias
//  Exports compatibles con tu UI actual.
// ====================================================================

import { CATALOG } from "@/app/catalog/data";

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
// Genotipos por muestra (controlados, reproducibles, no aleatorios)
// Ajustá libremente estos perfiles si querés otros ejemplos.
// ----------------------------------------------------
export const SAMPLES_GENOTYPES: Record<string, Record<string, string[]>> = {
  Sample_A: {
    CSF1PO: ['12', '13'], FGA: ['21', '23'], D3S1358: ['15', '17'], TH01: ['6', '9.3'],
    D21S11: ['28', '30'], D18S51: ['14', '16'], D5S818: ['11', '12'], D13S317: ['11', '12'],
    D7S820: ['10', '11'], D16S539: ['11', '13'], D2S1338: ['17', '19'],
  },
  Sample_B: {
    CSF1PO: ['11', '12'], FGA: ['20', '21'], D3S1358: ['16', '16'], TH01: ['7', '9.3'],
    D21S11: ['29', '30'], D18S51: ['12', '13'], D5S818: ['12', '12'], D13S317: ['8', '12'],
    D7S820: ['11', '12'], D16S539: ['9', '12'], D2S1338: ['18', '23'],
  },
  Sample_C: {
    CSF1PO: ['10', '12'], FGA: ['19', '22'], D3S1358: ['14', '18'], TH01: ['6', '8'],
    D21S11: ['30', '31'], D18S51: ['13', '17'], D5S818: ['10', '12'], D13S317: ['12', '13'],
    D7S820: ['8', '10'], D16S539: ['10', '11'], D2S1338: ['16', '20'],
  },
  Sample_D: {
    CSF1PO: ['12', '12'], FGA: ['22', '24'], D3S1358: ['15', '16'], TH01: ['9.3', '9.3'],
    D21S11: ['27', '28'], D18S51: ['11', '12'], D5S818: ['12', '13'], D13S317: ['9', '11'],
    D7S820: ['12', '12'], D16S539: ['12', '12'], D2S1338: ['19', '19'],
  },
};

export type DemoSampleId = keyof typeof SAMPLES_GENOTYPES;
export type LocusId = string;

export function getSampleAlleles(locusId: LocusId, sampleId: DemoSampleId): string[] {
  const s = SAMPLES_GENOTYPES[sampleId];
  const alleles = s?.[locusId];
  return Array.isArray(alleles) ? alleles.map(String) : [];
}

// ----------------------------------------------------
// Motor CE determinista (sin inventar alelos)
// - Alturas RFU ajustadas por ratio A/B
// - Balance heterocigota leve y estable por locus
// - Stutter -1 según catálogo si existe (fallback 6%)
// ----------------------------------------------------
export type AlleleLike = number | string;

export type Peak = {
  allele: AlleleLike;             // tamaño del alelo (p.ej. "12")
  rfu: number;
  kind: 'true' | 'stutter';
  source: 'A' | 'B' | 'A+B';
};

export type LocusSimResult = {
  locusId: string;
  peaks: Peak[];
  notes: string[];
};

const clamp = (x:number,a:number,b:number)=>Math.max(a,Math.min(b,x));
function hash01(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
  h >>>= 0;
  return (h % 10000) / 10000; // 0..1
}

// stutter% desde catálogo cuando existe; sino fallback 6%
function stutterPctFor(locusId: LocusId, allele: AlleleLike, fallback = 0.06) {
  const locus = demoCatalog[locusId];
  const a = locus?.alleles?.find((al: any) => String(al.size) === String(allele));
  return a?.stutterPct != null ? Number(a.stutterPct) / 100 : fallback;
}

type SimArgsByAlleles = {
  locusId: LocusId;
  allelesA: string[];
  allelesB: string[];
  ratioA: number;           // 0..1
  totalRFU?: number;
  seed?: string;
  showStutter?: boolean;
};

export function simulateCEForLocus({
  locusId,
  allelesA,
  allelesB,
  ratioA,
  totalRFU = 400,
  seed = 'strhub-real',
  showStutter = true,
}: SimArgsByAlleles): LocusSimResult {
  const ratioB = clamp(1 - ratioA, 0, 1);

  const nA = Math.max(1, allelesA.length);
  const nB = Math.max(1, allelesB.length);

  // leve desbalance heterocigota determinista por locus+seed
  const hbA = clamp(0.88 + (hash01(`${seed}|A|${locusId}`) - 0.5) * 0.18, 0.7, 1.1);
  const hbB = clamp(0.88 + (hash01(`${seed}|B|${locusId}`) - 0.5) * 0.18, 0.7, 1.1);

  const baseA = (ratioA * totalRFU) / nA;
  const baseB = (ratioB * totalRFU) / nB;

  const rfuMap = new Map<string, { rfu: number; src: 'A'|'B'|'A+B' }>();
  const add = (al: string, inc: number, who: 'A'|'B') => {
    const prev = rfuMap.get(al);
    if (!prev) rfuMap.set(al, { rfu: inc, src: who });
    else rfuMap.set(al, { rfu: prev.rfu + inc, src: prev.src === who ? who : 'A+B' });
  };

  allelesA.forEach((al, i) => add(String(al), baseA * (i === 0 && allelesA.length === 2 ? 1 : hbA), 'A'));
  allelesB.forEach((al, i) => add(String(al), baseB * (i === 0 && allelesB.length === 2 ? 1 : hbB), 'B'));

  const AT = DEFAULT_AT;
  const ST = DEFAULT_IT;

  const peaksTrue: Peak[] = [...rfuMap.entries()]
  .map(([al, val]) => ({ allele: al, rfu: val.rfu, kind: 'true' as const, source: val.src }));

// Para stutter sí mantenemos el filtro por AT (ruido razonable)
const peaksStutter: Peak[] = showStutter
  ? peaksTrue
      .map((p) => {
        const st = clamp(stutterPctFor(locusId, p.allele, 0.06), 0, 0.2);
        return {
          allele: String(Number(p.allele) - 1),
          rfu: p.rfu * st,
          kind: 'stutter' as const,
          source: p.source,
        };
      })
      .filter((s) => !Number.isNaN(Number(s.allele)) && s.rfu >= AT)
  : [];

  const notes: string[] = [];
  peaksTrue.forEach(p => { if (p.rfu < ST) notes.push(`Posible dropout: ${p.allele} (${Math.round(p.rfu)} RFU) < ST (${ST}).`); });

  const all = [...peaksTrue, ...peaksStutter].sort((a,b) => Number(a.allele) - Number(b.allele));
  return { locusId: String(locusId), peaks: all, notes };
}

type SimArgsBySamples = {
  locusId: LocusId;
  sampleAId: DemoSampleId;
  sampleBId: DemoSampleId;
  ratioA: number;
  totalRFU?: number;
  seed?: string;
  showStutter?: boolean;
};

export function simulateCEFromSamples(args: SimArgsBySamples): LocusSimResult {
  const allelesA = getSampleAlleles(args.locusId, args.sampleAId);
  const allelesB = getSampleAlleles(args.locusId, args.sampleBId);
  return simulateCEForLocus({
    locusId: args.locusId,
    allelesA, allelesB,
    ratioA: args.ratioA,
    totalRFU: args.totalRFU,
    seed: args.seed,
    showStutter: args.showStutter,
  });
}

// ----------------------------------------------------
// NGS: tabla derivada de picos CE + secuencias reales del CATALOG
// - Usa demoCatalog para mapear repeatSequence / fullSequence / isoalelos
// - Coverage se deriva de RFU (escala simple); luego podés conectar reales.
// ----------------------------------------------------
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
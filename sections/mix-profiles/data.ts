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
// Utility: Get true genotype from SAMPLE_DATABASE
// ----------------------------------------------------
/**
 * Retrieves the true genotype for a given sample and locus from SAMPLE_DATABASE.
 * Returns null if no data is available (never synthesizes or infers alleles).
 * 
 * @param sampleId - The sample ID (e.g., "HG02944")
 * @param locus - The locus name (e.g., "CSF1PO")
 * @returns Object with allele1 and allele2, or null if not found
 */
export function getTrueGenotype(
  sampleId: SampleId | null,
  locus: LocusId
): { allele1: string | number; allele2: string | number } | null {
  if (!sampleId) {
    return null;
  }

  const profile = SAMPLE_DATABASE[sampleId];
  if (!profile) {
    return null;
  }

  const locusData = profile.loci?.[locus];
  if (!locusData || !locusData.alleles || locusData.alleles.length === 0) {
    return null;
  }

  const alleles = locusData.alleles;
  
  // Return both alleles (for homozygotes, both will be the same)
  if (alleles.length >= 2) {
    return {
      allele1: alleles[0],
      allele2: alleles[1],
    };
  }
  
  // Single allele case (rare, but handle it)
  if (alleles.length === 1) {
    return {
      allele1: alleles[0],
      allele2: alleles[0],
    };
  }

  return null;
}

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
  degradationKPer100bp?: number; // Degradation constant k (per 100 bp). If undefined or <= 0, no degradation applied.
};

export const DEFAULT_MIX_PARAMS: MixtureParams = {
  targetPerLocus: 400,
  hetImbalanceCV: 0.08,
  showStutter: true,
  seed: "strhub-mix",
  degradationKPer100bp: undefined, // No degradation by default
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

// Per-locus metadata for amplicon length approximation
// (alleleRef, Lref in bp, motifLen in bp)
// Keys are uppercase to match SAMPLE_DATABASE
const LOCUS_LENGTH_META: Record<string, { alleleRef: number; Lref: number; motifLen: number }> = {
  FGA: { alleleRef: 20, Lref: 280, motifLen: 4 },
  CSF1PO: { alleleRef: 10, Lref: 200, motifLen: 4 },
  D10S1248: { alleleRef: 13, Lref: 220, motifLen: 4 },
  D12S391: { alleleRef: 18, Lref: 250, motifLen: 4 },
  D13S317: { alleleRef: 11, Lref: 210, motifLen: 4 },
  D16S539: { alleleRef: 10, Lref: 200, motifLen: 4 },
  D18S51: { alleleRef: 18, Lref: 270, motifLen: 4 },
  D19S433: { alleleRef: 13, Lref: 220, motifLen: 4 },
  D1S1656: { alleleRef: 15, Lref: 240, motifLen: 4 },
  D22S1045: { alleleRef: 16, Lref: 250, motifLen: 4 },
  D2S1338: { alleleRef: 20, Lref: 280, motifLen: 4 },
  D2S441: { alleleRef: 12, Lref: 210, motifLen: 4 },
  D3S1358: { alleleRef: 15, Lref: 230, motifLen: 4 },
  D5S818: { alleleRef: 11, Lref: 210, motifLen: 4 },
  D7S820: { alleleRef: 10, Lref: 200, motifLen: 4 },
  D8S1179: { alleleRef: 12, Lref: 210, motifLen: 4 },
  PentaD: { alleleRef: 9, Lref: 190, motifLen: 5 },
  PentaE: { alleleRef: 10, Lref: 200, motifLen: 5 },
  TH01: { alleleRef: 7, Lref: 180, motifLen: 4 },
  TPOX: { alleleRef: 8, Lref: 190, motifLen: 4 },
  vWA: { alleleRef: 16, Lref: 250, motifLen: 4 },
};
const DEFAULT_LOCUS_META = { alleleRef: 10, Lref: 200, motifLen: 4 };

/**
 * Computes the approximate amplicon length L (bp) for an allele at a given locus.
 * Uses per-locus metadata to approximate: L ≈ Lref + motifLen * (allele - alleleRef)
 * 
 * @param locusId - The locus ID (e.g., "CSF1PO")
 * @param allele - The allele value (numeric)
 * @returns The approximate amplicon length in base pairs
 */
function getAmpliconLength(locusId: LocusId, allele: number): number {
  // Normalize locusId to uppercase for lookup (SAMPLE_DATABASE uses uppercase)
  const normalizedLocusId = locusId.toUpperCase();
  
  // Get locus-specific metadata or use default
  const meta = LOCUS_LENGTH_META[normalizedLocusId] ?? DEFAULT_LOCUS_META;
  
  // Approximation: L ≈ Lref + motifLen * (allele - alleleRef)
  // This accounts for:
  // - Base amplicon length (flanking regions, primers, etc.) = Lref at alleleRef
  // - Variable repeat region length = motifLen * (allele - alleleRef)
  return meta.Lref + meta.motifLen * (allele - meta.alleleRef);
}

/**
 * Computes the degradation attenuation factor for an allele.
 * Degradation model: exponential attenuation per 100 bp.
 * atten = exp(-k * (L / 100)), where k is the degradation constant (per 100 bp)
 * 
 * @param locusId - The locus ID (e.g., "CSF1PO")
 * @param allele - The allele value (numeric)
 * @param k - The degradation constant k (per 100 bp). If undefined or <= 0, returns 1.0 (no degradation)
 * @returns The attenuation factor (0 < atten <= 1). Returns 1.0 if k is undefined or <= 0.
 */
function getDegradationAttenuation(locusId: LocusId, allele: number, k?: number): number {
  // If k is undefined or <= 0, no degradation (atten = 1)
  if (!k || k <= 0) {
    return 1.0;
  }
  
  // If allele is not numeric, skip attenuation (atten = 1)
  // This should not happen in normal operation, but handle defensively
  if (typeof allele !== 'number' || Number.isNaN(allele) || !Number.isFinite(allele)) {
    // TODO: Handle non-numeric alleles if needed (e.g., microvariants)
    return 1.0;
  }
  
  // Compute amplicon length L (bp) for this allele
  const L = getAmpliconLength(locusId, allele);
  
  // Compute attenuation factor: atten = exp(-k * (L / 100))
  // This ensures: ↑k ⇒ ↓RFU, and ↑L ⇒ ↓RFU
  const atten = Math.exp(-k * (L / 100.0));
  
  // Clamp attenuation to [0, 1] (should always be in this range for k > 0 and L > 0)
  return Math.max(0, Math.min(1, atten));
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
  const { targetPerLocus, hetImbalanceCV, showStutter, seed, degradationKPer100bp } = {
    ...DEFAULT_MIX_PARAMS,
    ...params,
  };

  const trueMap = new Map<string, { rfu: number; sources: Set<string> }>();

  contributors
    .filter((c) => c.proportion > 0)
    .forEach((contrib) => {
      const alleles = getSampleAlleles(locusId, contrib.sampleId);
      if (!alleles.length) return;
      
      // Compute contributor RFU (baseline before degradation)
      const contributorRFU = targetPerLocus * contrib.proportion;
      
      // Split RFU across alleles (before degradation)
      const split = splitAlleles(
        alleles,
        contributorRFU,
        `${seed}|${contrib.label}|${locusId}`,
        hetImbalanceCV
      );
      
      // Apply degradation per-allele (Approach A: per-allele attenuation after split)
      // Degradation model: exponential attenuation per 100 bp
      // rfu_degraded = rfu_raw * exp(-k * (L / 100))
      // where L = amplicon length (bp) for this allele
      // k = degradation constant (per 100 bp)
      // Physical intent: more degradation → less signal, longer alleles lose more signal than shorter ones
      split.forEach((rfuRaw, idx) => {
        const alleleValue = alleles[idx] ?? alleles[alleles.length - 1];
        
        // Compute degradation attenuation factor
        const atten = getDegradationAttenuation(locusId, alleleValue, degradationKPer100bp);
        
        // Apply attenuation to RFU
        // Important: degraded RFU is used as-is, without any re-normalization
        // Attenuation must reflect true signal loss
        const rfuDegraded = rfuRaw * atten;
        
        // Store degraded RFU in map
        const label = formatAlleleLabel(alleleValue);
        addToMap(trueMap, label, rfuDegraded, contrib.label);
        
        // Debug logging: verify degradation is applied correctly
        // Log first few peaks for verification (can be removed in production)
        // Format: console.debug('DEG TEST', allele, k, rfuRaw, rfuDegraded, rfuFinal);
        // Increasing k must lower both rfuDegraded and rfuFinal
        if (idx === 0 && degradationKPer100bp && degradationKPer100bp > 0) {
          // Log first allele of first contributor for verification
          console.debug('DEG TEST', alleleValue, degradationKPer100bp, rfuRaw.toFixed(1), rfuDegraded.toFixed(1), rfuDegraded.toFixed(1));
        }
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

// -----------------------------------------------------------------------------
// Convert CE peaks to simulated NGS rows, using real allele sequences from markerData
// Shows isoalleles only when a locus truly has >1 identical alleles (e.g., two "20")
// -----------------------------------------------------------------------------
export function cePeaksToNGSRowsWithSeq(
  locusId: string,
  peaks: Peak[],
  markerDataOverride?: Record<string, any>,
  stPctByTargetOverride?: Record<string, number | string>,
  kOverride?: number
) {
  const rows: any[] = []
  const markerMap = markerDataOverride ?? (markerData as Record<string, any>)
  const k = typeof kOverride === "number" && Number.isFinite(kOverride) ? kOverride : 1.2

  const computedStutterPct: Record<string, number> = {}
  for (const p of peaks) {
    if (p.kind !== "stutter") continue
    const target = String(p.allele)
    const parent = String(Number(target) + 1)
    const parentRFU =
      peaks.find((q) => q.kind === "true" && String(q.allele) === parent)?.rfu ?? 0
    if (parentRFU > 0) {
      computedStutterPct[target] = Math.round((p.rfu / parentRFU) * 100)
    }
  }

  const stPctByTarget = stPctByTargetOverride ?? computedStutterPct

  // Helper → count true allele occurrences (ignore stutter)
  const trueCount: Record<string, number> = {}
  for (const p of peaks) {
    if (p.kind === "stutter") continue
    const alleleLabel = String(p.allele)
    trueCount[alleleLabel] = (trueCount[alleleLabel] ?? 0) + 1
  }

  // Extract marker info
  const markerKey = normalizeMarkerKey(locusId)
  const markerEntry = markerMap?.[markerKey]
  const markerSequences: MarkerSequenceEntry[] = Array.isArray(markerEntry?.sequences)
    ? markerEntry.sequences
    : []

  // Helper → get representative sequence(s) for a given allele label
  const getSequencesForAllele = (alleleLabel: string) => {
    const all = markerSequences.filter(
      (s: any) => String(s?.allele ?? '') === alleleLabel
    )
    if (!all.length) return []

    const duplicates = trueCount[alleleLabel] ?? 0
    if (duplicates <= 1) {
      // one real copy → pick canonical (non-isoallele) or first
      const main = all.find((s: any) => !s.isIsoallele) ?? all[0]
      return [main]
    } else {
      // two or more real copies → expand to real isoalleles (if available)
      const canonical = all.find((s: any) => !s.isIsoallele)
      const iso = all.filter((s: any) => s.isIsoallele)
      const totalNeeded = Math.min(duplicates, all.length)
      const chosen = []
      if (canonical) chosen.push(canonical)
      for (const i of iso) {
        if (chosen.length >= totalNeeded) break
        chosen.push(i)
      }
      // if there were no isoalleles available, just duplicate canonical
      while (chosen.length < totalNeeded) chosen.push(canonical ?? all[0])
      return chosen
    }
  }

  // Build rows for each CE peak (without stutter duplication)
  for (const p of peaks) {
    if (p.kind === "stutter") continue
    const alleleLabel = String(p.allele)
    const baseReads = Math.max(1, Math.round(p.rfu * k))
    const seqs = getSequencesForAllele(alleleLabel)

    if (!seqs.length) {
      // no known sequence → placeholder row
      rows.push({
        allele: alleleLabel,
        coverage: baseReads,
        stutterPct: stPctByTarget[alleleLabel] ?? '—',
        repeatSequence: '—',
        fullSequence: '—',
      })
      continue
    }

    // When only one copy → single representative
    if (seqs.length === 1) {
      const s = seqs[0]
      rows.push({
        allele: alleleLabel,
        coverage: baseReads,
        stutterPct: stPctByTarget[alleleLabel] ?? '—',
        repeatSequence: s?.pattern ?? '—',
        fullSequence: s?.sequence ?? '—',
      })
      continue
    }

    // When multiple identical alleles (isoalleles) → split coverage evenly
    const covPerIso = Math.max(1, Math.round(baseReads / seqs.length))
    seqs.forEach((s, i) => {
      rows.push({
        allele: `${alleleLabel} iso${i + 1}`,
        coverage: covPerIso,
        stutterPct: stPctByTarget[alleleLabel] ?? '—',
        repeatSequence: s?.pattern ?? '—',
        fullSequence: s?.sequence ?? '—',
      })
    })
  }

  // Preserve sorting for clean display
  rows.sort((a, b) => {
    const numA = parseFloat(a.allele)
    const numB = parseFloat(b.allele)
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB
    return String(a.allele).localeCompare(String(b.allele))
  })

  return rows
}

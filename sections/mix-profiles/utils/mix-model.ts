// sections/mix-profiles/utils/mix-model.ts
// Motor estocástico CE (RFU) + NGS (lecturas) para mezclas
// Versión determinista con semilla para SSR/CSR (evita hydration error)

import { SAMPLE_DATABASE, demoCatalog } from "../data";
import type { SampleId, LocusId, ContributorInput, Peak } from "../data";
import { markerData } from "@/lib/markerData";

/* ===================== Tipos y parámetros ===================== */

export type CEParams = {
  kappaRFU: number;
  hetCV: number;
  sigmaLN: number;
  baselineMu: number;
  baselineSd: number;
  AT: number;  // Analytical Threshold
  ST: number;  // Stochastic/Interpretation Threshold
  locusEff: number;
  degrK: number;        // por 100 bp
  ampliconSize: number; // bp
  stutter: { minus1: number; minus2?: number; plus1?: number; sd?: number };
  stutterScale?: number; // multiplier for stutter coefficients (default 1.0)
  seed?: string;        // semilla opcional
};

export type NGSParams = {
  rhoReads: number;
  disp: number;
  minReads: number;
  minVarFrac: number;
  locusEff: number;
  degrK: number;
  ampliconSize: number;
  stutter: { minus1: number; minus2?: number; plus1?: number; sd?: number };
  errPerBase: number;
  seed?: string;
};

export const DEFAULT_CE: CEParams = {
  kappaRFU: 8000,
  hetCV: 0.15,
  sigmaLN: 0.25,
  baselineMu: 30,
  baselineSd: 10,
  AT: 50,
  ST: 200,
  locusEff: 0.95,
  degrK: 0.0,
  ampliconSize: 150,
  stutter: { minus1: 0.06, minus2: 0.01, plus1: 0.005, sd: 0.02 },
};

export const DEFAULT_NGS: NGSParams = {
  rhoReads: 40000,
  disp: 0.2,
  minReads: 30,
  minVarFrac: 0.01,
  locusEff: 0.90,
  degrK: 0.0,
  ampliconSize: 170,
  stutter: { minus1: 0.005, minus2: 0.001, plus1: 0.0005, sd: 0.002 },
  errPerBase: 0.0015,
};

/* ============== PRNG con semilla determinista ================= */

function hash32(str: string) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  h ^= h >>> 16;
  return h >>> 0;
}
function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/* ============== Utils numéricos con rand() ==================== */

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
const fmt = (v: number) => (v % 1 === 0 ? String(v) : v.toFixed(1));

function gaussian(rand: () => number) {
  let u = 0, v = 0;
  while (u === 0) u = rand();
  while (v === 0) v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}
function lognormal(mean: number, sigma: number, rand: () => number) {
  return Math.exp(Math.log(Math.max(mean, 1e-6)) + sigma * gaussian(rand));
}
function gammaSample(k: number, theta: number, rand: () => number): number {
  if (k < 1) {
    const u = rand();
    return gammaSample(1 + k, theta, rand) * Math.pow(u, 1 / k);
  }
  const d = k - 1 / 3, c = 1 / Math.sqrt(9 * d);
  for (;;) {
    const x = gaussian(rand);
    const v = Math.pow(1 + c * x, 3);
    if (v <= 0) continue;
    const u = rand();
    if (u < 1 - 0.0331 * Math.pow(x, 4)) return d * v * theta;
    if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v * theta;
  }
}
function poisson(lambda: number, rand: () => number) {
  const L = Math.exp(-lambda);
  let k = 0, p = 1;
  do {
    k++;
    p *= rand();
  } while (p > L);
  return k - 1;
}
function negbin(mu: number, disp: number, rand: () => number) {
  if (mu <= 0) return 0;
  const r = 1 / Math.max(disp, 1e-6);
  const p = r / (r + mu);
  const g = gammaSample(r, (1 - p) / p, rand);
  return poisson(g, rand);
}

/* ============== Helpers ============== */

function getSampleAlleles(locusId: LocusId, sampleId: SampleId): number[] {
  return SAMPLE_DATABASE[sampleId]?.loci?.[locusId]?.alleles ?? [];
}
const LONG_LOCI = new Set([
  "PentaE",
  "PentaD",
  "FGA",
  "D21S11",
  "D18S51",
  "D2S1338",
]);
// Get catalog alleles for a locus (for validation)
function getCatalogAlleles(locusId: LocusId): Set<number> {
  const catalogEntry = demoCatalog[locusId];
  if (!catalogEntry || !catalogEntry.alleles) return new Set();
  const alleles = catalogEntry.alleles.map((a) => {
    const size = typeof a.size === "number" ? a.size : parseFloat(String(a.size));
    return isNaN(size) ? null : size;
  }).filter((a): a is number => a !== null);
  return new Set(alleles);
}

// Validate and format allele label (only use catalog labels or valid stutter shifts)
function formatAlleleLabel(value: number, catalogAlleles: Set<number>, parent?: number): string {
  // If it's in catalog, use it
  if (catalogAlleles.has(value)) {
    return value % 1 === 0 ? String(value) : value.toFixed(1);
  }
  // If it's a stutter from a valid parent, allow it
  if (parent !== undefined) {
    const shifted = Math.round((value - parent) * 10) / 10;
    if (Math.abs(shifted) <= 2 && Math.abs(shifted) >= 0.9) {
      // Valid stutter shift (-2, -1, +1)
      return value % 1 === 0 ? String(value) : value.toFixed(1);
    }
  }
  // Round to nearest catalog allele or nearest integer
  let nearest = Math.round(value);
  if (!catalogAlleles.has(nearest)) {
    // Find nearest catalog allele
    const catalogArray = Array.from(catalogAlleles).sort((a, b) => a - b);
    let minDist = Infinity;
    for (const catAllele of catalogArray) {
      const dist = Math.abs(catAllele - value);
      if (dist < minDist) {
        minDist = dist;
        nearest = catAllele;
      }
    }
  }
  return nearest % 1 === 0 ? String(nearest) : nearest.toFixed(1);
}
function splitByHb(nAlleles: number, cv: number, rand: () => number) {
  if (nAlleles <= 1) return [1];
  const bias = clamp(1 + gaussian(rand) * cv, 0.5, 1.5);
  const a = bias, b = 2 - bias;
  const arr = [a, b];
  if (nAlleles > 2) {
    const rest = nAlleles - 2;
    const per = 0.1 / rest;
    for (let i = 0; i < rest; i++) arr.push(per);
  }
  const sum = arr.reduce((s, x) => s + x, 0);
  return arr.map((x) => x / sum);
}

/* ============== Presets de stutter ============== */

const STUTTER_CE: Record<
  string,
  { minus1: number; minus2?: number; plus1?: number; sd?: number }
> = {
  CSF1PO: { minus1: 0.06 },
  D3S1358: { minus1: 0.06 },
  D18S51: { minus1: 0.09, plus1: 0.02 },
  FGA: { minus1: 0.1, plus1: 0.025, minus2: 0.015 },
  PentaE: { minus1: 0.11, minus2: 0.03 }, // 👈 nueva línea
};
const DEFAULT_STUTTER_CE = { minus1: 0.06 };

/* ========= Tipo local para CE (permite "dropout") ========== */
export type CEPeak = {
  allele: number | string;
  rfu: number;
  kind: "true" | "stutter" | "dropout";
  source: string;
};

/* ===================== CE SIM ===================== */

// Extended Peak type to include parent allele for stutters
type CEPeakExtended = Peak & { parentAllele?: number | string };

export function simulateCE(args: {
  locusId: LocusId;
  contributors: ContributorInput[];
  dnaInputNg: number;
  params?: Partial<CEParams>;
}): { 
  locusId: string; 
  peaks: Peak[]; // Filtered peaks for markers (gated by AT)
  allTruePeaks: Peak[]; // ALL true peaks for signal visualization (not gated by AT)
  notes: string[]; 
  baselineRFU: number; // Mean baseline level
  baselineNoiseTrace: { allele: number; rfu: number }[]; // Discrete micro-peaks
  stutterPeaks: Peak[]; // All stutter peaks for line (not gated by AT)
  noisePeaks: Array<{ allele: number; rfu: number }>; // Discrete baseline noise micro-peaks
} {
  const { locusId, contributors, dnaInputNg, params = {} } = args;
  const p: CEParams = { ...DEFAULT_CE, ...params };
  const st = STUTTER_CE[locusId] ?? DEFAULT_STUTTER_CE;

  // Get catalog alleles for validation
  const catalogAlleles = getCatalogAlleles(locusId);

  // Per-locus metadata for amplicon length approximation
  // (alleleRef, Lref in bp, motifLen in bp)
  // Keys are uppercase to match SAMPLE_DATABASE
  const LOCUS_LENGTH_META: Record<string, { alleleRef: number; Lref: number; motifLen: number }> = {
    FGA: { alleleRef: 20, Lref: 340, motifLen: 4 },
    CSF1PO: { alleleRef: 10, Lref: 310, motifLen: 4 },
    D10S1248: { alleleRef: 13, Lref: 220, motifLen: 4 },
    D12S391: { alleleRef: 18, Lref: 250, motifLen: 4 },
    D13S317: { alleleRef: 11, Lref: 210, motifLen: 4 },
    D16S539: { alleleRef: 10, Lref: 200, motifLen: 4 },
    D18S51: { alleleRef: 18, Lref: 290, motifLen: 4 },
    D19S433: { alleleRef: 13, Lref: 220, motifLen: 4 },
    D1S1656: { alleleRef: 15, Lref: 240, motifLen: 4 },
    D21S11:   { alleleRef: 30, Lref: 330, motifLen: 4 },
    D22S1045: { alleleRef: 16, Lref: 250, motifLen: 4 },
    D2S1338: { alleleRef: 20, Lref: 320, motifLen: 4 },
    D2S441: { alleleRef: 12, Lref: 330, motifLen: 4 },
    D3S1358: { alleleRef: 15, Lref: 230, motifLen: 4 },
    D5S818: { alleleRef: 11, Lref: 210, motifLen: 4 },
    D7S820: { alleleRef: 10, Lref: 200, motifLen: 4 },
    D8S1179: { alleleRef: 12, Lref: 210, motifLen: 4 },
    PentaD: { alleleRef: 9, Lref: 390, motifLen: 5 },
    PentaE: { alleleRef: 10, Lref: 430, motifLen: 5 },
    TH01: { alleleRef: 7, Lref: 180, motifLen: 4 },
    TPOX: { alleleRef: 8, Lref: 190, motifLen: 4 },
    vWA: { alleleRef: 16, Lref: 330, motifLen: 4 },
  };
  const defaultMeta = { alleleRef: 10, Lref: 200, motifLen: 4 };

  // Helper to get amplicon length L (bp) for an allele
  // Uses per-locus metadata to approximate: L ≈ Lref + motifLen * (allele - alleleRef)
  const getAmpliconLength = (locusId: string, allele: number): number => {
    // Normalize locusId to uppercase for lookup (SAMPLE_DATABASE uses uppercase)
    const normalizedLocusId = locusId.toUpperCase();
    
    // Try to get real sequence length from markerData if available
    // Note: markerData uses lowercase keys, so check both cases
    const marker = (markerData as Record<string, any>)[locusId] ?? (markerData as Record<string, any>)[normalizedLocusId.toLowerCase()];
    if (marker && marker.sequences && Array.isArray(marker.sequences)) {
      const alleleStr = String(allele);
      const alleleNum = parseFloat(alleleStr);
      
      // Find matching sequence
      const matchingSeq = marker.sequences.find((seq: any) => {
        if (!seq.allele || !seq.sequence) return false;
        const seqAlleleNum = parseFloat(String(seq.allele));
        // Exact match or integer part match
        return Math.abs(seqAlleleNum - alleleNum) < 0.01 || 
               (allele % 1 !== 0 && Math.floor(seqAlleleNum) === Math.floor(alleleNum));
      });
      
      if (matchingSeq && matchingSeq.sequence && typeof matchingSeq.sequence === 'string') {
        // Note: markerData sequences are repeat regions only, not full amplicons
        // So we still use approximation, but could use this for validation
        // For now, use approximation which accounts for full amplicon structure
      }
    }

    // Approximation: L ≈ Lref + motifLen * (allele - alleleRef)
    // This accounts for:
    // - Base amplicon length (flanking regions, primers, etc.) = Lref at alleleRef
    // - Variable repeat region length = motifLen * (allele - alleleRef)
    const meta = LOCUS_LENGTH_META[normalizedLocusId] ?? defaultMeta;
    return meta.Lref + meta.motifLen * (allele - meta.alleleRef);
  };

  // semilla determinista (evita hydration mismatch)
  // Include all parameters in seed for determinism
  const seedStr =
    p.seed ??
    `${locusId}|${contributors
      .map((c) => `${c.label}:${c.sampleId}:${c.proportion}`)
      .join(",")}|${p.AT}|${p.ST}|${p.degrK}|${p.baselineMu}|${p.baselineSd}|${p.stutterScale ?? 1.0}`;
  const rand = mulberry32(hash32(seedStr));

  // acumuladores por alelo (first pass: collect true peaks without degradation)
  const map = new Map<
    number,
    { trueRFU: number; stRFU: number; sources: Set<string>; parentAllele?: number }
  >();

  // FIRST PASS: Collect base RFU for all true peaks (without degradation)
  const baseTruePeaks = new Map<number, { rfu: number; sources: Set<string> }>();
  
  for (const c of contributors.filter((x) => x.proportion > 0)) {
    const alleles = getSampleAlleles(locusId, c.sampleId);
    if (!alleles.length) continue;

    // Base DNA efficiency (without per-peak degradation)
    const dnaEff = dnaInputNg * c.proportion * p.locusEff;
    const weights = splitByHb(alleles.length, p.hetCV, rand);
    const scaleRFU = p.kappaRFU * dnaEff;

    alleles.forEach((aNum, idx) => {
      const mean = Math.max(1, scaleRFU * weights[idx]);
      const baseRFU = lognormal(mean, p.sigmaLN, rand);
      
      const existing = baseTruePeaks.get(aNum) ?? { rfu: 0, sources: new Set<string>() };
      existing.rfu += baseRFU;
      existing.sources.add(c.label);
      baseTruePeaks.set(aNum, existing);
    });
  }

  // SECOND PASS: Apply degradation to true peaks, then calculate stutter from degraded parent
  // Important: do NOT normalize RFUs after degradation.
  // Attenuation must reflect true signal loss.
  // Degradation: exponential attenuation per 100 bp.
  // rfu *= exp(-k * (L/100)), where k is the UI param "per 100 bp".
  
  // Flag to prevent any re-normalization after degradation
  const applyNormalizationAfterDegradation = false; // NEVER normalize after degradation
  
  let loggedOnce = false; // Flag for one-time debug logging
  for (const [aNum, baseData] of baseTruePeaks.entries()) {
    // Exponential decay by length: rfu *= exp(-k * (L / 100))
    // where L = amplicon length (bp) for this allele
    // k = degradation constant (per 100 bp)
    // For fixed L, larger k ⇒ smaller rfu_degraded (monotonicity in k)
    // For fixed k, larger L ⇒ smaller rfu_degraded (length effect)
    let degradedRFU = baseData.rfu;
    if (p.degrK > 0) {
      // Longitud del amplicón (bp)
      const L = getAmpliconLength(locusId, aNum);

      // Loci largos vs normales
      const normalizedLocusId = locusId.toUpperCase();
      const isLong = LONG_LOCI.has(normalizedLocusId);

      const kUI = p.degrK;
      // Loci “normales” → x4, loci largos → x6 (más crueles)
      const internalScale = isLong ? 6 : 4;
      const kInternal = kUI * internalScale;

      // Degradación exponencial por longitud
      const atten = Math.exp(-kInternal * (L / 100));
      const clampedAtten = Math.max(0, Math.min(1, atten));
      degradedRFU = baseData.rfu * clampedAtten;

      // Logging opcional
      if (!loggedOnce && baseTruePeaks.size > 0) {
        const firstFewAlleles = Array.from(baseTruePeaks.keys()).slice(
          0,
          Math.min(3, baseTruePeaks.size)
        );
        if (firstFewAlleles.includes(aNum)) {
          const rfuRaw = baseData.rfu;
          const rfuDegraded = degradedRFU;
          console.debug(
            "DEG TEST",
            aNum,
            kInternal.toFixed(4),
            rfuRaw.toFixed(1),
            rfuDegraded.toFixed(1)
          );
          if (aNum === firstFewAlleles[firstFewAlleles.length - 1]) {
            loggedOnce = true;
          }
        }
      }
    }

    // Store degraded true peak RFU directly (NO re-normalization)
    // Important: degradedRFU is used as-is, without any scaling or normalization
    const e = map.get(aNum) ?? { trueRFU: 0, stRFU: 0, sources: new Set<string>() };
    e.trueRFU += degradedRFU;
    for (const source of baseData.sources) {
      e.sources.add(source);
    }
    map.set(aNum, e);
    
    // Guard: Never re-normalize after degradation
    if (applyNormalizationAfterDegradation) {
      // This block should NEVER execute - degradation must reflect true signal loss
      // If you see this warning, it means someone tried to re-normalize after degradation
      console.warn('[DEG] WARNING: Re-normalization after degradation is disabled. Degraded RFU must be used as-is.');
    }

    // Calculate stutter from degraded parent RFU
    // stutterRFU = trueRFU_degraded * locusRate * stutterLevelX
    const sdev = p.stutter.sd ?? 0.02;
    const stutterScale = p.stutterScale ?? 1.0;
    
    // Helper to calculate discrete stutter position preserving microvariants
    const getStutterPosition = (parent: number, delta: number): number => {
      const result = parent + delta;
      // If parent has decimals, preserve them in stutter position
      if (parent % 1 !== 0) {
        // Parent is microvariant (e.g., 21.3) - preserve single decimal
        return Math.round(result * 10) / 10;
      }
      // Parent is integer - stutter is also integer
      return Math.round(result);
    };
    
    // Calculate stutter rate and enforce max 20% rule (unless multiplier > 1.5)
    const baseRate1 = (st.minus1 ?? 0.06) * stutterScale;
    // Permitimos hasta 22% en general y 30% con stutterScale alto (modo didáctico)
    const maxRate = stutterScale > 1.5 ? 0.30 : 0.22;
    const s1 = Math.max(0, Math.min(baseRate1 + gaussian(rand) * sdev, maxRate));
    const stutterRFU1 = degradedRFU * s1; // Use degraded parent RFU
    // Use discrete position preserving microvariants (e.g., 21.3 - 1 = 20.3, 8 - 1 = 7)
    const m1 = getStutterPosition(aNum, -1);
    // Allow stutter if: (1) stutter allele is in catalog, OR (2) it's a valid stutter shift (-1) from a real parent
    const isValidStutter1 = catalogAlleles.has(m1) || Math.abs(m1 - aNum) === 1;
    if (isValidStutter1 && stutterRFU1 > 0) {
      const e1 = map.get(m1) ?? { trueRFU: 0, stRFU: 0, sources: new Set<string>(), parentAllele: aNum };
      e1.stRFU += stutterRFU1;
      if (!e1.parentAllele) e1.parentAllele = aNum;
      map.set(m1, e1);
    }

    if (st.minus2) {
      const baseRate2 = st.minus2 * stutterScale;
      const s2 = Math.max(0, Math.min(baseRate2 + gaussian(rand) * sdev, maxRate));
      const stutterRFU2 = degradedRFU * s2; // Use degraded parent RFU
      // Use discrete position preserving microvariants (e.g., 21.3 - 2 = 19.3)
      const m2 = getStutterPosition(aNum, -2);
      // Allow stutter if: (1) stutter allele is in catalog, OR (2) it's a valid stutter shift (-2) from a real parent
      const isValidStutter2 = catalogAlleles.has(m2) || Math.abs(m2 - aNum) === 2;
      if (isValidStutter2 && stutterRFU2 > 0) {
        const e2 = map.get(m2) ?? { trueRFU: 0, stRFU: 0, sources: new Set<string>(), parentAllele: aNum };
        e2.stRFU += stutterRFU2;
        if (!e2.parentAllele) e2.parentAllele = aNum;
        map.set(m2, e2);
      }
    }

    if (st.plus1) {
      const baseRateP = st.plus1 * stutterScale;
      const sp = Math.max(0, Math.min(baseRateP + gaussian(rand) * sdev, maxRate));
      const stutterRFUP = degradedRFU * sp; // Use degraded parent RFU
      // Use discrete position preserving microvariants (e.g., 21.3 + 1 = 22.3)
      const p1 = getStutterPosition(aNum, 1);
      // Allow stutter if: (1) stutter allele is in catalog, OR (2) it's a valid stutter shift (+1) from a real parent
      const isValidStutterP = catalogAlleles.has(p1) || Math.abs(p1 - aNum) === 1;
      if (isValidStutterP && stutterRFUP > 0) {
        const ep = map.get(p1) ?? { trueRFU: 0, stRFU: 0, sources: new Set<string>(), parentAllele: aNum };
        ep.stRFU += stutterRFUP;
        if (!ep.parentAllele) ep.parentAllele = aNum;
        map.set(p1, ep);
      }
    }
  }

  // baseline/ruido - generar micro-picos discretos (no línea suave)
  const baselineRFU = Math.max(0, p.baselineMu + gaussian(rand) * p.baselineSd);
  
  // Calcular rango X para baseline (basado en alelos presentes)
  const allelesPresent = [...map.keys()];
  let minA = 5;
  let maxA = 25;
  if (allelesPresent.length > 0) {
    minA = Math.min(...allelesPresent);
    maxA = Math.max(...allelesPresent);
  }
  const xMin = minA - 2;
  const xMax = maxA + 2;
  const totalRange = Math.max(1, xMax - xMin);
  
  // Generate discrete baseline noise micro-peaks (15-30 samples uniformly spaced)
  // These should look like tiny Gaussian peaks, not a straight line
  const numNoisePeaks = Math.max(15, Math.min(30, Math.ceil(totalRange * 2)));
  const noisePeaks: Array<{ allele: number; rfu: number }> = [];
  const baselineNoiseTrace: { allele: number; rfu: number }[] = [];
  
  // Noise height range: [AT × 0.15, AT × 0.8], scaled by Noise/Base slider
  // The noise slider (baselineMu) acts as a ceiling for noise amplitude
  const noiseMin = Math.max(1, p.AT * 0.15); // Minimum noise height (15% of AT, min 1 RFU)

  // Nuevo comportamiento:
  // - El slider baselineMu se interpreta como "nivel típico" de ruido.
  // - Permitimos que el ruido llegue hasta 3×AT como máximo para escenarios extremos.
  const noiseCeiling = Math.max(
    noiseMin,
    Math.min(p.baselineMu, p.AT * 3)
  );
  // Generate sparse micro-peaks across the range with variation
  for (let i = 0; i < numNoisePeaks; i++) {
    // Add small random jitter to allele positions to avoid perfect spacing
    const normalizedPos = (i + gaussian(rand) * 0.1) / Math.max(1, numNoisePeaks - 1);
    const baseAllele = xMin + Math.max(0, Math.min(1, normalizedPos)) * totalRange;
    const allele = Math.round(baseAllele * 10) / 10; // Round to 0.1 for clean labels
    
    // Sample height from low-mean distribution bounded to [noiseMin, noiseCeiling]
    // Use lognormal with low mean to create realistic micro-peaks
    const meanNoise = noiseMin + (noiseCeiling - noiseMin) * 0.35; // Low mean (35% of range from min)
    let noiseRFU = Math.max(noiseMin * 0.5, Math.min(noiseCeiling, 
      lognormal(meanNoise, 0.4, rand)
    ));
    
    // Add small random variation to create micro-peak appearance
    noiseRFU = noiseRFU * (0.7 + gaussian(rand) * 0.3);
    noiseRFU = Math.max(noiseMin * 0.3, Math.min(noiseCeiling, noiseRFU));
    
    const maxNoiseRFUForPeaks = noiseCeiling;
    if (noiseRFU < maxNoiseRFUForPeaks && noiseRFU > 0) {
      const peak = { allele, rfu: noiseRFU };
      noisePeaks.push(peak);
      // Also add to trace for line rendering (sparse points create wavy appearance)
      baselineNoiseTrace.push(peak);
    }
  }
  
  // Sort noise peaks by allele position
  noisePeaks.sort((a, b) => a.allele - b.allele);
  baselineNoiseTrace.sort((a, b) => a.allele - b.allele);
  
  // Fill gaps in trace with interpolated values to create continuous wavy baseline (not straight)
  // This creates a subtle undulating baseline without looking like a second floor
  const maxNoiseRFU = noiseCeiling; // Cap at noiseCeiling (controlado por slider)
  if (baselineNoiseTrace.length > 1) {
    const filledTrace: { allele: number; rfu: number }[] = [];
    const step = 0.05; // Fine step for smooth interpolation
    let currentIdx = 0;
    const startX = baselineNoiseTrace[0].allele;
    const endX = baselineNoiseTrace[baselineNoiseTrace.length - 1].allele;
    
    for (let x = startX; x <= endX; x += step) {
      const xRounded = Math.round(x * 10) / 10;
      
      // Find surrounding points for interpolation
      while (currentIdx < baselineNoiseTrace.length - 1 && baselineNoiseTrace[currentIdx + 1].allele < x) {
        currentIdx++;
      }
      
      if (currentIdx < baselineNoiseTrace.length - 1) {
        const p1 = baselineNoiseTrace[currentIdx];
        const p2 = baselineNoiseTrace[currentIdx + 1];
        const dist = Math.max(0.01, p2.allele - p1.allele);
        const t = (x - p1.allele) / dist;
        // Linear interpolation with small random variation (creates wavy effect, not straight)
        const interpolated = p1.rfu + (p2.rfu - p1.rfu) * t;
        // Add small random variation to avoid straight line appearance
        const variation = 0.85 + gaussian(rand) * 0.15; // ±15% variation
        const varied = interpolated * variation;
        filledTrace.push({ 
          allele: xRounded, 
          rfu: Math.max(0, Math.min(maxNoiseRFU, varied)) 
        });
      } else {
        // Use last point
        filledTrace.push({ 
          allele: xRounded, 
          rfu: Math.min(maxNoiseRFU, baselineNoiseTrace[baselineNoiseTrace.length - 1].rfu) 
        });
      }
    }
    // Replace trace with filled version (creates wavy baseline effect)
    baselineNoiseTrace.length = 0;
    baselineNoiseTrace.push(...filledTrace);
  }

  const peaks: Peak[] = []; // Filtered peaks for markers (gated by AT)
  const allTruePeaks: Peak[] = []; // ALL true peaks for signal visualization (not gated by AT)
  const stutterPeaks: Peak[] = []; // All stutter peaks for line visualization
  const notes: string[] = [];

  // construir picos reportables (SIN sumar baseline)
  // Important: Use degraded RFU values directly - NO re-normalization after degradation
  // The chart's yMax will auto-expand based on data, so no need to scale to a fixed maximum
  // Never recalc or clamp RFUs to 100% after degradation - attenuation must reflect true signal loss
  for (const [alleleNum, v] of map.entries()) {
    // Use degraded RFU directly (no re-normalization)
    const trueRFU = v.trueRFU;
    const stRFU = v.stRFU;

    // alelo verdadero - ALL true peaks for signal visualization (not gated by AT)
    if (trueRFU > 0) {
      allTruePeaks.push({
        allele: alleleNum,
        rfu: trueRFU,
        kind: "true",
        source: Array.from(v.sources).sort().join("+") || "—",
      } as Peak);
    }

    // alelo verdadero - markers gated by thresholds (for markers only)
    if (trueRFU >= p.AT) {
      if (trueRFU < p.ST) {
        notes.push(
          `⚠️ Drop-out risk: ${fmt(alleleNum)} (${Math.round(trueRFU)} RFU) < ST (${p.ST}).`
        );
      }
      peaks.push({
        allele: alleleNum,
        rfu: trueRFU,
        kind: "true",
        source: Array.from(v.sources).sort().join("+") || "—",
      } as Peak);
    }

    // stutter - collect all for line, but markers only if >= AT
    // IMPORTANT: Use discrete allele positions (no jitter) - stutters must sit at exact targets
    // NOTE: Stutter RFU is already calculated from degraded parent RFU, so no need to apply degradation again
    if (stRFU > 0) {
      // Format allele label to preserve microvariants (e.g., 20.3, not 20.299...)
      // If alleleNum is an integer, use it directly; if it has decimals, preserve single decimal
      let stutterAllele: number | string = alleleNum;
      
      // Check if this is a microvariant (has decimal part)
      if (alleleNum % 1 !== 0) {
        // Preserve single decimal place for microvariants (e.g., 20.3, 17.2)
        stutterAllele = Math.round(alleleNum * 10) / 10;
      } else {
        // Integer allele - use as-is (e.g., 7, 10, 13)
        stutterAllele = alleleNum;
      }
      
      // Always add to stutterPeaks for line visualization (not gated by AT)
      // Use discrete position - NO JITTER (already discrete from map calculation)
      // Store parent allele in source for tooltip (format: "source|parent:parentAllele")
      const parentAllele = v.parentAllele ?? alleleNum;
      const baseSource = Array.from(v.sources).sort().join("+") || "—";
      stutterPeaks.push({
        allele: stutterAllele, // Discrete position: parent-1, parent+1, or parent-2
        rfu: stRFU, // Stutter RFU is already calculated from degraded parent
        kind: "stutter",
        source: `${baseSource}|parent:${parentAllele}`, // Encode parent for tooltip
      } as Peak);
      
      // Add to peaks only if >= AT (for markers) - use same discrete position
      if (stRFU >= p.AT) {
        peaks.push({
          allele: stutterAllele, // Same discrete position for markers
          rfu: stRFU, // Stutter RFU is already calculated from degraded parent
          kind: "stutter",
          source: `${baseSource}|parent:${parentAllele}`, // Encode parent for tooltip
        } as Peak);
      }
    }
  }
  
  // Filter out RFU=0 points before rendering (prevents "0 RFU : 0 RFU" tooltips)
  const filteredPeaks = peaks.filter((p) => p.rfu > 0);
  const filteredAllTruePeaks = allTruePeaks.filter((p) => p.rfu > 0);
  const filteredStutterPeaks = stutterPeaks.filter((p) => p.rfu > 0);
  
  // ordenar picos y devolver
  filteredPeaks.sort((a, b) => Number(a.allele) - Number(b.allele));
  filteredAllTruePeaks.sort((a, b) => Number(a.allele) - Number(b.allele));
  filteredStutterPeaks.sort((a, b) => Number(a.allele) - Number(b.allele));
  
  // Parent allele information is already encoded in the source field for stutter peaks
  // Format: "source|parent:parentAllele" (e.g., "A+B|parent:21.3")
  
  return { 
    locusId, 
    peaks: filteredPeaks, 
    allTruePeaks: filteredAllTruePeaks, 
    notes, 
    baselineRFU: p.baselineMu, 
    baselineNoiseTrace, // Sparse trace for line rendering
    stutterPeaks: filteredStutterPeaks, // Parent info already encoded in source field
    noisePeaks, // Discrete micro-peaks for scatter rendering
  };
}

/* ===================== NGS SIM ===================== */

export function simulateNGS(args: {
  locusId: LocusId;
  contributors: ContributorInput[];
  dnaInputNg: number;
  params?: Partial<NGSParams>;
}) {
  const { locusId, contributors, dnaInputNg, params = {} } = args;
  const p: NGSParams = { ...DEFAULT_NGS, ...params };
  const rand = mulberry32(hash32(p.seed ?? locusId));

  const counts = new Map<number, { reads: number; isSt?: boolean }>();

  for (const c of contributors.filter((x) => x.proportion > 0)) {
    const alleles = getSampleAlleles(locusId, c.sampleId);
    if (!alleles.length) continue;

    const dnaEff =
      dnaInputNg *
      c.proportion *
      p.locusEff *
      Math.pow(10, -p.degrK * (p.ampliconSize - 200) / 100);

    const weights = splitByHb(alleles.length, 0.15, rand);
    const scale = p.rhoReads * dnaEff;

    alleles.forEach((aNum, idx) => {
      const mu = Math.max(1, scale * weights[idx]);
      const trueReads = Math.max(0, negbin(mu, p.disp, rand));
      counts.set(aNum, { reads: (counts.get(aNum)?.reads ?? 0) + trueReads });

      // stutter NGS (muy bajo)
      const s1 = Math.max(
        0,
        p.stutter.minus1 + gaussian(rand) * (p.stutter.sd ?? 0.002)
      );
      const st = Math.round(trueReads * s1);
      if (st > 0) {
        const k = aNum - 1;
        const prev = counts.get(k) ?? { reads: 0, isSt: true };
        prev.reads += st;
        prev.isSt = true;
        counts.set(k, prev);
      }
    });
  }

  const total = [...counts.values()].reduce((s, x) => s + x.reads, 0) || 1;

  const rows = [...counts.entries()]
    .map(([alleleNum, v]) => {
      const frac = v.reads / total;
      const called = v.reads >= p.minReads && frac >= p.minVarFrac;
      return {
        allele: fmt(alleleNum),
        coverage: v.reads,
        stutterPct: v.isSt ? "~0.5%" : "—",
        repeatSequence: "—",
        fullSequence: "—",
        _frac: frac,
        _called: called,
      };
    })
    .filter((r) => r._called);

  rows.sort((a, b) => parseFloat(a.allele) - parseFloat(b.allele));
  return rows;
}
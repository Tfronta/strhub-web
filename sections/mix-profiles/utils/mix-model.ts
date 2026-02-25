// sections/mix-profiles/utils/mix-model.ts
// Refactor: separar "generación de señal" (core) de "interpretación" (AT/ST)
// Objetivo: AT/ST NO deben cambiar tamaños de picos ni la aleatoriedad del modelo.
// - Seed ya NO incluye AT/ST
// - Baseline/noise ya NO depende de AT
// - Gating y notas se aplican en una función aparte: applyCEThresholds()

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

  // AT/ST quedan como params de interpretación (no afectan el core)
  AT: number; // Analytical Threshold
  ST: number; // Stochastic/Interpretation Threshold

  locusEff: number;
  degrK: number; // por 100 bp
  ampliconSize: number; // bp
  stutter: { minus1: number; minus2?: number; plus1?: number; sd?: number };
  stutterScale?: number; // multiplier for stutter coefficients (default 1.0)

  seed?: string; // semilla opcional
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
  sigmaLN: 0.12,
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
  let u = 0,
    v = 0;
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
  const d = k - 1 / 3,
    c = 1 / Math.sqrt(9 * d);
  for (;;) {
    const x = gaussian(rand);
    const v = Math.pow(1 + c * x, 3);
    if (v <= 0) continue;
    const u = rand();
    if (u < 1 - 0.0331 * Math.pow(x, 4)) return d * v * theta;
    if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v)))
      return d * v * theta;
  }
}
function poisson(lambda: number, rand: () => number) {
  const L = Math.exp(-lambda);
  let k = 0,
    p = 1;
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

function getCatalogAlleles(locusId: LocusId): Set<number> {
  const catalogEntry = demoCatalog[locusId];
  if (!catalogEntry || !catalogEntry.alleles) return new Set();
  const alleles = catalogEntry.alleles
    .map((a) => {
      const size =
        typeof a.size === "number" ? a.size : parseFloat(String(a.size));
      return isNaN(size) ? null : size;
    })
    .filter((a): a is number => a !== null);
  return new Set(alleles);
}

function splitByHb(nAlleles: number, cv: number, rand: () => number) {
  if (nAlleles <= 1) return [1];
  const bias = clamp(1 + gaussian(rand) * cv, 0.5, 1.5);
  const a = bias,
    b = 2 - bias;
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
  CSF1PO: { minus1: 0.111, plus1: 0.037 },          // de Luciellen
  D3S1358: { minus1: 0.135, plus1: 0.017 },         // de Luciellen
  D18S51: { minus1: 0.146, plus1: 0.028 },          // de Luciellen
  D21S11: { minus1: 0.127, plus1: 0.028 },          // de Luciellen
  FGA: { minus1: 0.124, plus1: 0.028 },             // de Luciellen
  PentaE: { minus1: 0.072, plus1: 0.019 },          // de Luciellen
  D16S539: { minus1: 0.120, plus1: 0.030 },         // de Luciellen
  D2S1338: { minus1: 0.136, plus1: 0.022 },         // de Luciellen
  D1S1656: { minus1: 0.143, plus1: 0.023 },         // de Luciellen
  D2S441: { minus1: 0.090, plus1: 0.018 },          // de Luciellen
  D10S1248: { minus1: 0.130, plus1: 0.013 },        // de Luciellen
  D13S317: { minus1: 0.103, plus1: 0.022 },         // de Luciellen
  PentaD: { minus1: 0.045, plus1: 0.037 },          // de Luciellen
  TH01: { minus1: 0.048, plus1: 0.015 },            // de Luciellen
  vWA: { minus1: 0.144, plus1: 0.027 },             // de Luciellen
  D12S391: { minus1: 0.174, plus1: 0.027 },         // de Luciellen
  D19S433: { minus1: 0.121, plus1: 0.026 },         // de Luciellen
  SE33: { minus1: 0.161, plus1: 0.033 },            // de Luciellen
  D22S1045: { minus1: 0.168, plus1: 0.090 },        // de Luciellen
  // Los que no aparecen en Luciellen, mantengo tus originales o default
  D5S818: { minus1: 0.111, plus1: 0.023 },          // de Luciellen (D5S818)
  D7S820: { minus1: 0.097, plus1: 0.018 },          // de Luciellen
  D8S1179: { minus1: 0.118, plus1: 0.034 },         // de Luciellen
  TPOX: { minus1: 0.054, plus1: 0.011 },            // de Luciellen
};

const DEFAULT_STUTTER_CE = { minus1: 0.10, plus1: 0.02 };  // media razonable de Luciellen
/* ===================== Outputs ===================== */

// CORE output: señal pura (sin umbrales)
export type CESimCore = {
  locusId: string;
  allTruePeaks: Peak[]; // señal verdadera (sin gating)
  stutterPeaks: Peak[]; // stutter (sin gating)
  baselineRFU: number;
  baselineNoiseTrace: { allele: number; rfu: number }[];
  noisePeaks: Array<{ allele: number; rfu: number }>;
  // Para tooltips / notas luego, mantenemos sources ya embebidas en Peak.source
};

// Interpretación (con umbrales)
export type CESimInterpreted = CESimCore & {
  peaks: Peak[]; // markers/reportables (gated por AT)
  notes: string[];
};

/* ===================== Seed helper (SIN AT/ST) ===================== */

function buildCoreSeed(args: {
  locusId: LocusId;
  contributors: ContributorInput[];
  dnaInputNg: number;
  p: CEParams;
}) {
  const { locusId, contributors, dnaInputNg, p } = args;
  // OJO: no incluir AT/ST aquí.
  return (
    p.seed ??
    [
      locusId,
      contributors
        .map((c) => `${c.label}:${c.sampleId}:${c.proportion}`)
        .join(","),
      `dna:${dnaInputNg}`,
      `kappa:${p.kappaRFU}`,
      `hetCV:${p.hetCV}`,
      `sigmaLN:${p.sigmaLN}`,
      `locusEff:${p.locusEff}`,
      `degrK:${p.degrK}`,
      `baselineMu:${p.baselineMu}`,
      `baselineSd:${p.baselineSd}`,
      `stScale:${p.stutterScale ?? 1.0}`,
      `st:${(STUTTER_CE[locusId] ?? DEFAULT_STUTTER_CE).minus1 ?? 0.06}`,
    ].join("|")
  );
}

/* ===================== CE CORE ===================== */

export function simulateCECore(args: {
  locusId: LocusId;
  contributors: ContributorInput[];
  dnaInputNg: number;
  params?: Partial<CEParams>;
}): CESimCore {
  const { locusId, contributors, dnaInputNg, params = {} } = args;
  const p: CEParams = { ...DEFAULT_CE, ...params };
  const st = STUTTER_CE[locusId] ?? DEFAULT_STUTTER_CE;
  console.log(`Locus ${locusId}: using ${STUTTER_CE[locusId] ? 'specific rates' : 'DEFAULT_STUTTER_CE'} (minus1: ${st.minus1})`);
  const catalogAlleles = getCatalogAlleles(locusId);

  const LOCUS_LENGTH_META: Record<
    string,
    { alleleRef: number; Lref: number; motifLen: number }
  > = {
    FGA: { alleleRef: 20, Lref: 340, motifLen: 4 },
    CSF1PO: { alleleRef: 10, Lref: 310, motifLen: 4 },
    D10S1248: { alleleRef: 13, Lref: 220, motifLen: 4 },
    D12S391: { alleleRef: 18, Lref: 250, motifLen: 4 },
    D13S317: { alleleRef: 11, Lref: 210, motifLen: 4 },
    D16S539: { alleleRef: 10, Lref: 200, motifLen: 4 },
    D18S51: { alleleRef: 18, Lref: 290, motifLen: 4 },
    D19S433: { alleleRef: 13, Lref: 220, motifLen: 4 },
    D1S1656: { alleleRef: 15, Lref: 240, motifLen: 4 },
    D21S11: { alleleRef: 30, Lref: 330, motifLen: 4 },
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

  const getAmpliconLength = (locusIdStr: string, allele: number): number => {
    const normalizedLocusId = locusIdStr.toUpperCase();

    // (markerData check kept as comment; not used for length now)
    const marker =
      (markerData as Record<string, any>)[locusIdStr] ??
      (markerData as Record<string, any>)[normalizedLocusId.toLowerCase()];
    if (marker && marker.sequences && Array.isArray(marker.sequences)) {
      // placeholder: currently not used for full amplicon length
    }

    const meta = LOCUS_LENGTH_META[normalizedLocusId] ?? defaultMeta;
    return meta.Lref + meta.motifLen * (allele - meta.alleleRef);
  };

  // ✅ Seed determinista SIN AT/ST
  const seedStr = buildCoreSeed({ locusId, contributors, dnaInputNg, p });
  const rand = mulberry32(hash32(seedStr));

  // Map final (true/stutter ya degradados). stutterBreakdown = all parent contributions at this allele.
  type MapEntry = {
    trueRFU: number;
    stRFU: number;
    sources: Set<string>;
    stutterBreakdown: Array<{ parent: number; delta: number; rfu: number }>;
  };
  const map = new Map<number, MapEntry>();

  // FIRST PASS: base RFU (sin degradación)
  const baseTruePeaks = new Map<number, { rfu: number; sources: Set<string> }>();

  for (const c of contributors.filter((x) => x.proportion > 0)) {
    const alleles = getSampleAlleles(locusId, c.sampleId);
    if (!alleles.length) continue;

    const dnaEff = dnaInputNg * c.proportion * p.locusEff;
    const scaleRFU = p.kappaRFU * dnaEff;

    // Equal weight per allele copy (no inter-allelic imbalance)
    const nCopies = alleles.length;
    const perCopyMean = Math.max(1, scaleRFU / nCopies);

    // Single lognormal draw for this contributor+locus
    // → all allele copies share the same base RFU, so distinct
    //   heterozygous alleles from the same contributor are equal
    const baseRFU = lognormal(perCopyMean, p.sigmaLN, rand);

    alleles.forEach((aNum) => {
      const existing =
        baseTruePeaks.get(aNum) ?? { rfu: 0, sources: new Set<string>() };
      existing.rfu += baseRFU;
      existing.sources.add(c.label);
      baseTruePeaks.set(aNum, existing);
    });
  }

  // SECOND PASS: degradación + stutter derivado del parent degradado
  for (const [aNum, baseData] of baseTruePeaks.entries()) {
    let degradedRFU = baseData.rfu;

    if (p.degrK > 0) {
      const L = getAmpliconLength(locusId, aNum);
      const normalizedLocusId = locusId.toUpperCase();
      const isLong = LONG_LOCI.has(normalizedLocusId);

      const kUI = p.degrK;
      const internalScale = isLong ? 6 : 4;
      const kInternal = kUI * internalScale;

      const atten = Math.exp(-kInternal * (L / 100));
      const clampedAtten = Math.max(0, Math.min(1, atten));
      degradedRFU = baseData.rfu * clampedAtten;
    }

    // store true peak (degradado)
    const e: MapEntry =
      map.get(aNum) ?? {
        trueRFU: 0,
        stRFU: 0,
        sources: new Set<string>(),
        stutterBreakdown: [],
      };
    e.trueRFU += degradedRFU;
    for (const source of baseData.sources) e.sources.add(source);
    map.set(aNum, e);

    // stutter desde parent degradado
    const stutterSigmaLN = 0.12; // lower variance for stutter only
    const sdev = p.stutter.sd ?? 0.01; // lower gaussian variance
    const stutterScale = p.stutterScale ?? 1.0;

    const getStutterPosition = (parent: number, delta: number): number => {
      const result = parent + delta;
      if (parent % 1 !== 0) return Math.round(result * 10) / 10;
      return Math.round(result);
    };

    const baseRate1 = (st.minus1 ?? 0.06) * stutterScale;
    const maxRate = stutterScale > 1.5 ? 0.30 : 0.22;
    const s1 = Math.max(0, Math.min(baseRate1 + gaussian(rand) * sdev, maxRate));
    const meanStutterRFU1 = degradedRFU * s1;
    let stutterRFU1 =
      meanStutterRFU1 > 0
        ? Math.max(0, lognormal(meanStutterRFU1, stutterSigmaLN, rand))
        : 0;
    stutterRFU1 = clamp(stutterRFU1, 0.08 * degradedRFU, 0.20 * degradedRFU);
    const m1 = getStutterPosition(aNum, -1);
    const isValidStutter1 = catalogAlleles.has(m1) || Math.abs(m1 - aNum) === 1;
    console.log(`Parent ${aNum} stutter -1: baseRate ${baseRate1}, s1 ${s1}, mean ${meanStutterRFU1}, final RFU ${stutterRFU1} (${(stutterRFU1 / degradedRFU * 100).toFixed(1)}%)`);
    if (isValidStutter1 && stutterRFU1 > 0) {
      const e1: MapEntry =
        map.get(m1) ?? {
          trueRFU: 0,
          stRFU: 0,
          sources: new Set<string>(),
          stutterBreakdown: [],
        };
      e1.stRFU += stutterRFU1;
      e1.stutterBreakdown.push({ parent: aNum, delta: -1, rfu: stutterRFU1 });
      map.set(m1, e1);
    }

    if (st.minus2) {
      const baseRate2 = st.minus2 * stutterScale;
      const s2 = Math.max(0, Math.min(baseRate2 + gaussian(rand) * sdev, maxRate));
      const meanStutterRFU2 = degradedRFU * s2;
      let stutterRFU2 =
        meanStutterRFU2 > 0
          ? Math.max(0, lognormal(meanStutterRFU2, stutterSigmaLN, rand))
          : 0;
      stutterRFU2 = clamp(stutterRFU2, 0.01 * degradedRFU, 0.05 * degradedRFU);
      const m2 = getStutterPosition(aNum, -2);
      const isValidStutter2 = catalogAlleles.has(m2) || Math.abs(m2 - aNum) === 2;
      if (typeof process !== "undefined" && process.env?.NODE_ENV === "development") {
        console.log(`Parent ${aNum} stutter -2: baseRate ${baseRate2}, s2 ${s2}, mean ${meanStutterRFU2}, final RFU ${stutterRFU2} (${(stutterRFU2 / degradedRFU * 100).toFixed(1)}%)`);
      }
      if (isValidStutter2 && stutterRFU2 > 0) {
        const e2: MapEntry =
          map.get(m2) ?? {
            trueRFU: 0,
            stRFU: 0,
            sources: new Set<string>(),
            stutterBreakdown: [],
          };
        e2.stRFU += stutterRFU2;
        e2.stutterBreakdown.push({ parent: aNum, delta: -2, rfu: stutterRFU2 });
        map.set(m2, e2);
      }
    }

    if (st.plus1) {
      const baseRateP = st.plus1 * stutterScale;
      const sp = Math.max(0.01, Math.min(baseRateP + gaussian(rand) * sdev, maxRate));
      const meanStutterRFUP = degradedRFU * sp;
      let stutterRFUP =
        meanStutterRFUP > 0
          ? Math.max(0, lognormal(meanStutterRFUP, stutterSigmaLN, rand))
          : 0;
      stutterRFUP = clamp(stutterRFUP, 0.01 * degradedRFU, 0.05 * degradedRFU);
      const p1 = getStutterPosition(aNum, 1);
      const isValidStutterP = catalogAlleles.has(p1) || Math.abs(p1 - aNum) === 1;
      if (typeof process !== "undefined" && process.env?.NODE_ENV === "development") {
        console.log(`Parent ${aNum} stutter +1: baseRate ${baseRateP}, sp ${sp}, mean ${meanStutterRFUP}, final RFU ${stutterRFUP} (${(stutterRFUP / degradedRFU * 100).toFixed(1)}%)`);
      }
      if (isValidStutterP && stutterRFUP > 0) {
        const ep: MapEntry =
          map.get(p1) ?? {
            trueRFU: 0,
            stRFU: 0,
            sources: new Set<string>(),
            stutterBreakdown: [],
          };
        ep.stRFU += stutterRFUP;
        ep.stutterBreakdown.push({ parent: aNum, delta: 1, rfu: stutterRFUP });
        map.set(p1, ep);
      }
    }
  }

  // Baseline/noise: ✅ NO depende de AT
  const baselineRFU = Math.max(0, p.baselineMu + gaussian(rand) * p.baselineSd);

  const allelesPresent = [...map.keys()];
  let minA = 5,
    maxA = 25;
  if (allelesPresent.length > 0) {
    minA = Math.min(...allelesPresent);
    maxA = Math.max(...allelesPresent);
  }
  const xMin = minA - 2;
  const xMax = maxA + 2;
  const totalRange = Math.max(1, xMax - xMin);

  const numNoisePeaks = Math.max(15, Math.min(30, Math.ceil(totalRange * 2)));
  const noisePeaks: Array<{ allele: number; rfu: number }> = [];
  const baselineNoiseTrace: { allele: number; rfu: number }[] = [];

  // noiseMin/ceiling en función de baseline, no de AT
  const noiseMin = Math.max(1, p.baselineMu * 0.10); // 10% del baseline típico
  const noiseCeiling = Math.max(noiseMin, p.baselineMu + 2 * p.baselineSd); // techo realista

  for (let i = 0; i < numNoisePeaks; i++) {
    const normalizedPos =
      (i + gaussian(rand) * 0.1) / Math.max(1, numNoisePeaks - 1);
    const baseAllele =
      xMin + Math.max(0, Math.min(1, normalizedPos)) * totalRange;
    const allele = Math.round(baseAllele * 10) / 10;

    const meanNoise = noiseMin + (noiseCeiling - noiseMin) * 0.35;
    let noiseRFU = Math.max(
      noiseMin * 0.5,
      Math.min(noiseCeiling, lognormal(meanNoise, 0.4, rand))
    );
    noiseRFU = noiseRFU * (0.7 + gaussian(rand) * 0.3);
    noiseRFU = Math.max(noiseMin * 0.3, Math.min(noiseCeiling, noiseRFU));

    if (noiseRFU > 0) {
      const peak = { allele, rfu: noiseRFU };
      noisePeaks.push(peak);
      baselineNoiseTrace.push(peak);
    }
  }

  noisePeaks.sort((a, b) => a.allele - b.allele);
  baselineNoiseTrace.sort((a, b) => a.allele - b.allele);

  // Fill para baseline ondulado
  const maxNoiseRFU = noiseCeiling;
  if (baselineNoiseTrace.length > 1) {
    const filledTrace: { allele: number; rfu: number }[] = [];
    const step = 0.05;
    let currentIdx = 0;
    const startX = baselineNoiseTrace[0].allele;
    const endX = baselineNoiseTrace[baselineNoiseTrace.length - 1].allele;

    for (let x = startX; x <= endX; x += step) {
      const xRounded = Math.round(x * 10) / 10;

      while (
        currentIdx < baselineNoiseTrace.length - 1 &&
        baselineNoiseTrace[currentIdx + 1].allele < x
      ) {
        currentIdx++;
      }

      if (currentIdx < baselineNoiseTrace.length - 1) {
        const p1 = baselineNoiseTrace[currentIdx];
        const p2 = baselineNoiseTrace[currentIdx + 1];
        const dist = Math.max(0.01, p2.allele - p1.allele);
        const t = (x - p1.allele) / dist;
        const interpolated = p1.rfu + (p2.rfu - p1.rfu) * t;
        const variation = 0.85 + gaussian(rand) * 0.15;
        const varied = interpolated * variation;
        filledTrace.push({
          allele: xRounded,
          rfu: Math.max(0, Math.min(maxNoiseRFU, varied)),
        });
      } else {
        filledTrace.push({
          allele: xRounded,
          rfu: Math.min(maxNoiseRFU, baselineNoiseTrace[baselineNoiseTrace.length - 1].rfu),
        });
      }
    }
    baselineNoiseTrace.length = 0;
    baselineNoiseTrace.push(...filledTrace);
  }

  // Construcción de arrays Peak (sin umbrales)
  const allTruePeaks: Peak[] = [];
  const stutterPeaks: Peak[] = [];

  for (const [alleleNum, v] of map.entries()) {
    const trueRFU = v.trueRFU;
    const stRFU = v.stRFU;

    if (trueRFU > 0) {
      // If a stutter lands on the same position as a true allele,
      // combine their RFUs into a single peak (as in real CE)
      const combinedRFU = stRFU > 0 ? trueRFU + stRFU : trueRFU;
      allTruePeaks.push({
        allele: alleleNum,
        rfu: combinedRFU,
        kind: "true",
        source: Array.from(v.sources).sort().join("+") || "—",
      } as Peak);
    }

    // Always emit stutter peaks (even when co-located with a true allele)
    // so the red stutter line is visible for didactic purposes
    if (stRFU > 0) {
      let stutterAllele: number | string = alleleNum;
      if (alleleNum % 1 !== 0) stutterAllele = Math.round(alleleNum * 10) / 10;

      const baseSource = Array.from(v.sources).sort().join("+") || "—";
      const breakdown = v.stutterBreakdown ?? [];
      const parentList =
        breakdown.length > 0
          ? breakdown.map((c) => `${c.parent}(${c.delta >= 0 ? "+" : ""}${c.delta})`).join(",")
          : String(alleleNum + 1);
      const peak: Peak = {
        allele: stutterAllele,
        rfu: stRFU,
        kind: "stutter",
        source: `${baseSource}|parent:${parentList}`,
      };
      if (breakdown.length > 0) peak.stutterBreakdown = breakdown;
      stutterPeaks.push(peak);
    }
  }

  const filteredAllTruePeaks = allTruePeaks.filter((p) => p.rfu > 0);
  const filteredStutterPeaks = stutterPeaks.filter((p) => p.rfu > 0);

  filteredAllTruePeaks.sort((a, b) => Number(a.allele) - Number(b.allele));
  filteredStutterPeaks.sort((a, b) => Number(a.allele) - Number(b.allele));

  return {
    locusId,
    allTruePeaks: filteredAllTruePeaks,
    stutterPeaks: filteredStutterPeaks,
    baselineRFU: p.baselineMu,
    baselineNoiseTrace,
    noisePeaks,
  };
}

/* ===================== Interpretación (AT/ST) ===================== */

export function applyCEThresholds(args: {
  core: CESimCore;
  AT: number;
  ST: number;
}): { peaks: Peak[]; notes: string[] } {
  const { core, AT, ST } = args;

  const notes: string[] = [];
  const peaks: Peak[] = [];

  // true peaks gated
  for (const p of core.allTruePeaks) {
    if (p.rfu >= AT) {
      if (p.rfu < ST) {
        notes.push(
          `⚠️ Drop-out risk: ${fmt(Number(p.allele))} (${Math.round(p.rfu)} RFU) < ST (${ST}).`
        );
      }
      peaks.push(p);
    }
  }

  // stutter peaks gated (solo para markers)
  for (const p of core.stutterPeaks) {
    if (p.rfu >= AT) peaks.push(p);
  }

  peaks.sort((a, b) => Number(a.allele) - Number(b.allele));
  return { peaks, notes };
}

/* ===================== API antigua (compat) ===================== */
/**
 * simulateCE mantiene la firma original para no romper imports.
 * Internamente: core (sin umbrales) + applyCEThresholds (con umbrales).
 */
export function simulateCE(args: {
  locusId: LocusId;
  contributors: ContributorInput[];
  dnaInputNg: number;
  params?: Partial<CEParams>;
}): {
  locusId: string;
  peaks: Peak[];
  allTruePeaks: Peak[];
  notes: string[];
  baselineRFU: number;
  baselineNoiseTrace: { allele: number; rfu: number }[];
  stutterPeaks: Peak[];
  noisePeaks: Array<{ allele: number; rfu: number }>;
} {
  const { locusId, contributors, dnaInputNg, params = {} } = args;
  const p: CEParams = { ...DEFAULT_CE, ...params };

  const core = simulateCECore({ locusId, contributors, dnaInputNg, params });
  const interpreted = applyCEThresholds({ core, AT: p.AT, ST: p.ST });

  return {
    ...core,
    peaks: interpreted.peaks,
    notes: interpreted.notes,
  };
}

/* ===================== NGS SIM (sin cambios) ===================== */

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
      Math.pow(10, (-p.degrK * (p.ampliconSize - 200)) / 100);

    const weights = splitByHb(alleles.length, 0.15, rand);
    const scale = p.rhoReads * dnaEff;

    alleles.forEach((aNum, idx) => {
      const mu = Math.max(1, scale * weights[idx]);
      const trueReads = Math.max(0, negbin(mu, p.disp, rand));
      counts.set(aNum, { reads: (counts.get(aNum)?.reads ?? 0) + trueReads });

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
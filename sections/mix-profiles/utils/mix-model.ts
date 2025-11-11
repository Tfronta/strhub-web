// sections/mix-profiles/utils/mix-model.ts
// Motor estocástico CE (RFU) + NGS (lecturas) para mezclas
// Versión determinista con semilla para SSR/CSR (evita hydration error)

import type { SampleId, LocusId, ContributorInput } from "../data";
import { SAMPLE_DATABASE } from "../data";
import type { SampleId, LocusId, ContributorInput, Peak } from "../data";

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
  CSF1PO: { minus1: 0.06 },
  D3S1358: { minus1: 0.06 },
  D18S51: { minus1: 0.09, plus1: 0.02 },
  FGA: { minus1: 0.1, plus1: 0.025, minus2: 0.015 },
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

/* ===================== CE SIM ===================== */
export function simulateCE(args: {
    locusId: LocusId;
    contributors: ContributorInput[];
    dnaInputNg: number;
    params?: Partial<CEParams>;
  }): { locusId: string; peaks: Peak[]; notes: string[] } {
    const { locusId, contributors, dnaInputNg, params = {} } = args;
    const p: CEParams = { ...DEFAULT_CE, ...params };
    const st = STUTTER_CE[locusId] ?? DEFAULT_STUTTER_CE;
  
    // semilla determinista (evita hydration mismatch)
    const seedStr =
      p.seed ??
      `${locusId}|${contributors
        .map((c) => `${c.label}:${c.sampleId}:${c.proportion}`)
        .join(",")}|${p.AT}|${p.ST}|${p.degrK}|${p.baselineMu}|${p.baselineSd}`;
    const rand = mulberry32(hash32(seedStr));
  
    // acumuladores por alelo
    const map = new Map<
      number,
      { trueRFU: number; stRFU: number; sources: Set<string> }
    >();
  
    for (const c of contributors.filter((x) => x.proportion > 0)) {
      const alleles = getSampleAlleles(locusId, c.sampleId);
      if (!alleles.length) continue;
  
      const dnaEff =
        dnaInputNg *
        c.proportion *
        p.locusEff *
        Math.pow(10, -p.degrK * (p.ampliconSize - 200) / 100);
  
      const weights = splitByHb(alleles.length, p.hetCV, rand);
      const scaleRFU = p.kappaRFU * dnaEff;
  
      alleles.forEach((aNum, idx) => {
        const mean = Math.max(1, scaleRFU * weights[idx]);
        const trueRFU = lognormal(mean, p.sigmaLN, rand);
  
        const e =
          map.get(aNum) ??
          { trueRFU: 0, stRFU: 0, sources: new Set<string>() };
        e.trueRFU += trueRFU;
        e.sources.add(c.label);
        map.set(aNum, e);
  
        // stutter -1 / -2 / +1 (con leve variación)
        const sdev = p.stutter.sd ?? 0.02;
        const s1 = Math.max(0, (st.minus1 ?? 0.06) + gaussian(rand) * sdev);
        const m1 = aNum - 1;
        const e1 =
          map.get(m1) ??
          { trueRFU: 0, stRFU: 0, sources: new Set<string>() };
        e1.stRFU += trueRFU * s1;
        map.set(m1, e1);
  
        if (st.minus2) {
          const s2 = Math.max(0, st.minus2 + gaussian(rand) * sdev);
          const m2 = aNum - 2;
          const e2 =
            map.get(m2) ??
            { trueRFU: 0, stRFU: 0, sources: new Set<string>() };
          e2.stRFU += trueRFU * s2;
          map.set(m2, e2);
        }
  
        if (st.plus1) {
          const sp = Math.max(0, st.plus1 + gaussian(rand) * sdev);
          const p1 = aNum + 1;
          const ep =
            map.get(p1) ??
            { trueRFU: 0, stRFU: 0, sources: new Set<string>() };
          ep.stRFU += trueRFU * sp;
          map.set(p1, ep);
        }
      });
    }
  
    // ruido/base
    const baseline = Math.max(0, p.baselineMu + gaussian(rand) * p.baselineSd);
  
    const peaks: Peak[] = [];
    const notes: string[] = [];
  
    // construir picos reportables
    for (const [alleleNum, v] of map.entries()) {
      const trueTotal = v.trueRFU + baseline;
      const stutTotal = v.stRFU + baseline * 0.1; // stutter con un toque de base
  
      // alelo verdadero (se marca solo si supera AT)
      if (trueTotal >= p.AT) {
        if (trueTotal < p.ST) {
          notes.push(
            `⚠️ Drop-out risk: ${fmt(alleleNum)} (${Math.round(
              trueTotal
            )} RFU) < ST (${p.ST}).`
          );
        }
        peaks.push({
          allele: alleleNum,
          rfu: trueTotal,
          kind: "true",
          source: Array.from(v.sources).sort().join("+") || "—",
        });
      }
  
      // stutter (también sujeto a AT)
      if (v.stRFU > 0 && stutTotal >= p.AT) {
        peaks.push({
          allele: alleleNum,
          rfu: stutTotal,
          kind: "stutter",
          source: Array.from(v.sources).sort().join("+") || "—",
        });
      }
    }
  
    // ordenar y devolver
    peaks.sort((a, b) => Number(a.allele) - Number(b.allele));
    return { locusId, peaks, notes };
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
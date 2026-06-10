// app/sections/mix-profiles/utils/simulate.ts
// Simulación de mezclas CE/NGS usando el catálogo y soportando isoalelos.
// - Lee alelos del catálogo del marcador seleccionado
// - Agrupa isoalelos por "size" para las barras (NGS) y mantiene filas separadas en la tabla
// - Aplica Ratio A/B a coberturas e intensidades
// - Genera picos CE suaves (gaussianas) centradas en el alelo

export type CatalogAllele = {
  size: number;                // ej. 12
  repeatSequence?: string;     // ej. "TTTC[12]" o "GATA[8]GATA"
  fullSequence?: string;       // secuencia completa (flancos + repetidos si dispones)
  isIsoallele?: boolean;       // true si es isoalelo
  stutterPct?: number;         // si tienes este dato por alelo
};

export type CatalogMarker = {
  id: string;                  // ej. "FGA"
  name: string;
  type?: string;               // "CODIS Core", "Autosomal", etc.
  alleles: CatalogAllele[];    // TODOS los alelos (incluye isoalelos si los definiste duplicando size)
};

export type SimParams = {
  markerId: string;
  ratioA: number;              // 0..1
  sampleA?: string;            // reservado para futuro
  sampleB?: string;
  catalog: Record<string, CatalogMarker>;
  baseCoverage?: number;       // cobertura media por alelo “puro”
  baseRFU?: number;            // intensidad media CE por alelo “puro”
};

/** Segments for flank/repeat highlighting in Full Sequence column */
export type FullSequenceSegments = {
  flank5?: string;
  repeat: string;
  flank3?: string;
};

export type NGSRow = {
  allele: string | number;     // tamaño (p.ej. 12) o label con isoalelos (p.ej. "12 iso1")
  coverage: number;            // lecturas (suma A+B)
  stutterPct?: number | '—';
  repeatSequence?: string | '—';
  fullSequence?: string | '—'; // columna de secuencia completa
  /** When set, UI highlights flank vs repeat region in full sequence */
  fullSequenceSegments?: FullSequenceSegments;
  isIsoallele?: boolean;
  sequenceId?: string;         // Unique identifier for React keys (e.g., "12-0", "12-1")
};

export type NGSChartBar = { allele: number; coverage: number };
export type CEPoint = { allele: number; rfu: number };

export type Simulation = {
  ceSeries: CEPoint[];
  ngsTable: NGSRow[];          // tabla (contiene isoalelos como filas separadas)
  ngsBars: NGSChartBar[];      // barras (una por tamaño, isoalelos colapsan)
};

/** Muestreo pseudoaleatorio parcial (Fisher–Yates) */
function pickSome<T>(arr: T[], k: number): T[] {
  if (arr.length <= k) return [...arr];
  const a = [...arr];
  for (let i = 0; i < k; i++) {
    const j = i + Math.floor(Math.random() * (a.length - i));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, k);
}

/** Gaussiana simple para simular picos CE */
function gauss(x: number, mu: number, sigma: number) {
  const t = (x - mu) / sigma;
  return Math.exp(-0.5 * t * t);
}

/** Expande motivos tipo "TTTC[12]" o "GATA[8]" dentro de una cadena */
function expandRepeat(expr?: string): string | undefined {
  if (!expr) return;
  try {
    // Reemplaza cada MOTIF[NUM] por motif.repeat(NUM)
    return expr.replace(/([ACGT]+)\[(\d+)\]/g, (_m, motif: string, nStr: string) =>
      motif.repeat(parseInt(nStr, 10))
    );
  } catch {
    return expr;
  }
}

/** Devuelve true si una cadena parece un placeholder truncado ("…", "...") */
function looksTruncated(s?: string) {
  if (!s) return false;
  return s.includes('…') || s.includes('...');
}

/**
 * Simula mezcla para un marcador usando los alelos definidos en el catálogo.
 * - Si el marcador tiene muchos alelos, toma 2–4 representativos.
 * - Si existen isoalelos (mismo size con distintas secuencias), intenta incluir dos del mismo tamaño.
 * - Aplica ratioA/ratioB a coberturas e intensidades.
 */
export function simulateMixture(params: SimParams): Simulation {
  const {
    markerId,
    catalog,
    ratioA,
    baseCoverage = 450,
    baseRFU = 380,
  } = params;

  const ratioB = 1 - ratioA;
  const marker = catalog[markerId];

  if (!marker || !marker.alleles?.length) {
    // fallback mínimo si no hay datos
    const fallbackBars = [
      { allele: 11, coverage: Math.round(baseCoverage * ratioA) },
      { allele: 12, coverage: Math.round(baseCoverage * 0.7) },
      { allele: 13, coverage: Math.round(baseCoverage * ratioB) },
    ];
    const fallbackTable: NGSRow[] = fallbackBars.map(b => ({
      allele: b.allele,
      coverage: b.coverage,
      repeatSequence: '-',
      fullSequence: '-',
      isIsoallele: false,
    }));
    return {
      ceSeries: [
        { allele: 11, rfu: baseRFU * ratioA },
        { allele: 12, rfu: baseRFU * 0.7 * (ratioA + ratioB) },
        { allele: 13, rfu: baseRFU * ratioB },
      ],
      ngsTable: fallbackTable,
      ngsBars: fallbackBars,
    };
  }

  // ---------- 1) Selección: priorizar isoalelos si existen ----------
  // Mapa size -> lista de variantes (posibles isoalelos)
  const bySize = new Map<number, CatalogAllele[]>();
  for (const a of marker.alleles) {
    const arr = bySize.get(a.size) ?? [];
    arr.push(a);
    bySize.set(a.size, arr);
  }

  const dupSizes = Array.from(bySize.entries()).filter(([, arr]) => arr.length > 1);

  // Queremos entre 2 y 4 alelos
  const target = Math.min(4, Math.max(2, marker.alleles.length));
  let selection: CatalogAllele[] = [];

  if (dupSizes.length) {
    // Toma un tamaño con isoalelos y elige 2 variantes distintas
    const [_, arr] = dupSizes[Math.floor(Math.random() * dupSizes.length)];
    const first = arr[Math.floor(Math.random() * arr.length)];
    let second = arr[Math.floor(Math.random() * arr.length)];
    if (second === first && arr.length > 1) {
      second = arr[(arr.indexOf(first) + 1) % arr.length];
    }
    selection.push(first, second);

    // Completa con otros tamaños distintos
    const pool = marker.alleles.filter(
      x => !(x.size === first.size && (x === first || x === second))
    );
    while (selection.length < target && pool.length) {
      const idx = Math.floor(Math.random() * pool.length);
      selection.push(pool.splice(idx, 1)[0]);
    }
  } else {
    // No hay isoalelos definidos -> alelos aleatorios
    selection = pickSome(marker.alleles, target);
  }

  // ---------- 2) Asignación simple a A/B y coberturas ----------
  const sorted = [...selection].sort((a, b) => a.size - b.size);
  const split = Math.ceil(sorted.length / 2);
  const groupA = sorted.slice(0, split);
  const groupB = sorted.slice(split);

  const jitter = (v: number) => v * (0.9 + Math.random() * 0.2);

  // ---------- 3) Tabla NGS (filas separadas, expande secuencias si hace falta) ----------
  const table: NGSRow[] = sorted.map(a => {
    const coverA = groupA.includes(a) ? jitter(baseCoverage * ratioA) : 0;
    const coverB = groupB.includes(a) ? jitter(baseCoverage * ratioB) : 0;

    // expandimos si hace falta
    const expanded = expandRepeat(a.repeatSequence);
    const full =
      (!looksTruncated(a.fullSequence) && a.fullSequence) ||
      expanded ||
      a.fullSequence ||
      a.repeatSequence ||
      '';

    return {
      allele: a.size,
      coverage: Math.max(1, Math.round(coverA + coverB)),
      stutterPct: a.stutterPct,
      repeatSequence: a.repeatSequence ?? `(${a.size})`,
      fullSequence: full || '-',
      isIsoallele: a.isIsoallele === true || (bySize.get(a.size)?.length ?? 0) > 1,
    };
  });

  // ---------- 4) Barras NGS (colapsar por tamaño sumando coberturas) ----------
  // ---------- 4) Barras NGS (colapsar por tamaño sumando coberturas, considerando isoalelos) ----------
const grouped = new Map<number, number>();
for (const r of table) {
  // extraer número de alelo (p. ej. "13 iso1" → 13)
  const key =
    typeof r.allele === "number"
      ? r.allele
      : Number.parseFloat(String(r.allele).match(/[0-9]+(\.[0-9]+)?/)?.[0] ?? "NaN");
  if (Number.isNaN(key)) continue;

  grouped.set(key, (grouped.get(key) ?? 0) + r.coverage);
}

const ngsBars: NGSChartBar[] = Array.from(grouped.entries())
  .sort((a, b) => a[0] - b[0])
  .map(([allele, coverage]) => ({ allele, coverage }));

// ---------- 5) Serie CE (curva suave) ----------
// ---------- 5) Serie CE (curva suave con stutter) ----------

const AMPLITUDES = new Map<number, number>();
const STUTTER = { minus1: 0.06, minus2: 0.01, plus1: 0.005 };

// calcula RFU y agrega stutters
for (const a of sorted) {
  const base = groupA.includes(a) ? baseRFU * ratioA : baseRFU * ratioB;
  AMPLITUDES.set(a.size, (AMPLITUDES.get(a.size) ?? 0) + base);

  const s1 = a.size - 1;
  AMPLITUDES.set(s1, (AMPLITUDES.get(s1) ?? 0) + base * STUTTER.minus1);
  const s2 = a.size - 2;
  AMPLITUDES.set(s2, (AMPLITUDES.get(s2) ?? 0) + base * STUTTER.minus2);
  const p1 = a.size + 1;
  AMPLITUDES.set(p1, (AMPLITUDES.get(p1) ?? 0) + base * STUTTER.plus1);
}

// genera la curva final
const allKeys = Array.from(AMPLITUDES.keys()).filter(k => Number.isFinite(k));
const minAllele = Math.min(...allKeys) - 0.4;
const maxAllele = Math.max(...allKeys) + 0.4;
const step = 0.01;
const sigma = 0.04; // narrower peaks so microvariants (e.g. 14 vs 14.2) stay distinct

const ceSeries: CEPoint[] = [];
for (let x = minAllele; x <= maxAllele; x += step) {
  let rfu = 0;
  for (const [mu, A] of AMPLITUDES.entries()) {
    rfu += (A ?? 0) * gauss(x, mu, sigma);
  }
  ceSeries.push({ allele: Number(x.toFixed(2)), rfu });
}

return { ceSeries, ngsTable: table, ngsBars };
}

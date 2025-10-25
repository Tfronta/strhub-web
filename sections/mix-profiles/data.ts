// app/sections/mix-profiles/data.ts
// Colores + catálogo DEMO (temporal) hasta conectar tu catálogo real.

export const DEFAULT_AT = 50;
export const DEFAULT_IT = 80;

/** Lee colores desde CSS vars; nunca devuelve negro. */
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

// ---------------- DEMO CATALOG (temporal) ----------------
// Estructura mínima que consume el simulador.
// Cuando me pases tu catálogo real, cambiaremos a importarlo desde ahí.
export const demoCatalog = {
  FGA: {
    id: 'FGA',
    name: 'FGA',
    type: 'CODIS Core',
    alleles: [
      { size: 11, repeatSequence: 'TTTC[11]', fullSequence: '...TTTCx11...', stutterPct: 8 },
      { size: 12, repeatSequence: 'TTTC[12]', fullSequence: '...TTTCx12...' },
      // ISOALELO (mismo size, distinta secuencia)
      { size: 12, repeatSequence: 'TTTC[10]TTTTTTTC', fullSequence: '...TTTCx10TTTTTTTC...', isIsoallele: true },
      { size: 13, repeatSequence: 'TTTC[13]', fullSequence: '...TTTCx13...', stutterPct: 7 },
    ],
  },
  D1S1656: {
    id: 'D1S1656',
    name: 'D1S1656',
    type: 'CODIS Core',
    alleles: [
      { size: 12, repeatSequence: 'TAGA[12]', fullSequence: '...TAGAx12...' },
      { size: 13, repeatSequence: 'TAGA[13]', fullSequence: '...TAGAx13...', stutterPct: 6 },
      { size: 14, repeatSequence: 'TAGA[14]', fullSequence: '...TAGAx14...' },
    ],
  },
} as const;

export type DemoCatalog = typeof demoCatalog;
export type DemoMarkerId = keyof DemoCatalog;

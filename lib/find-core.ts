// lib/find-core.ts
// Detector robusto del core STR dentro de un slice FASTA.

export interface CoreRegion {
  start: number;
  end: number;
  core: string;
}

/** "[ATCT]n" -> "ATCT" ; "ATCT" -> "ATCT" */
export function parseMotif(field: string): string {
  const m = field.match(/\[([ACGT]+)\]n/i);
  return (m ? m[1] : field).toUpperCase();
}

/** Reverse-complemento */
function revcomp(s: string): string {
  const map: Record<string, string> = { A: "T", C: "G", G: "C", T: "A", N: "N" };
  return s.split("").reverse().map(c => map[c] ?? "N").join("");
}

/** Rotaciones (ATCT → ATCT, TCTA, CTAT, TATC) */
function rotations(motif: string): string[] {
  const L = motif.length, out: string[] = [];
  for (let i = 0; i < L; i++) out.push(motif.slice(i) + motif.slice(0, i));
  return Array.from(new Set(out)); // evita duplicados si palíndromo
}

/**
 * Busca el bloque repetitivo más largo del motivo (o su rev-comp), incluyendo todas las rotaciones.
 * - `motifField` puede ser "[ATCT]n" o "ATCT".
 * - `minRepeats` = 2 por defecto (más tolerante). Usá 3 si querés ser más estricto.
 */
export function findCoreRegion(
  seq: string,
  motifField: string,
  minRepeats = 2
): CoreRegion | null {
  const canonical = parseMotif(motifField);        // ej. "[ATCT]n" -> "ATCT"
  const rc = revcomp(canonical);                   // "AGAT"
  const alts = Array.from(new Set([
    ...rotations(canonical),
    ...rotations(rc),
  ])).join("|");

  const re = new RegExp(`(?:${alts}){${minRepeats},}`, "gi");

  let best: CoreRegion | null = null;
  let m: RegExpExecArray | null;
  while ((m = re.exec(seq)) !== null) {
    const start = m.index;
    const end = start + m[0].length;
    if (!best || (end - start) > (best.end - best.start)) {
      best = { start, end, core: m[0] };
    }
    if (re.lastIndex === m.index) re.lastIndex++; // evita loops en regex global
  }
  return best;
}
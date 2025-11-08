// lib/markerRefs-from-data.ts
import { markerData } from "@/lib/markerData" // ajusta el path si difiere

export type MarkerRefs = {
  motif: string;              // motivo canónico (ej. "ATCT")
  refAlleleRepeats: number;   // repeats detectados en la secuencia base elegida
  leftRefPlus: string;        // flanco upstream en hebra +
  rightRefPlus: string;       // flanco downstream en hebra +
};

// --- Utiles ---

// Toma el primer motivo [ACGT]n encontrado en el campo motif.
// Soporta campos compuestos, devolviendo el 1º bloque (p.ej. "[AGAT]n [AGAC]n ..." -> "AGAT")
function motifFromField(motifField: string | null | undefined): string {
  if (!motifField) return "ATCT";
  const m = motifField.match(/\[([ACGT]+)\]n/i);
  return (m ? m[1] : "ATCT").toUpperCase();
}

// Rotaciones del motivo para detectar runs del tetranucleótido en cualquier fase
function rotations(motif: string): string[] {
  const L = motif.length;
  const out: string[] = [];
  for (let i = 0; i < L; i++) out.push(motif.slice(i) + motif.slice(0, i));
  return out;
}

// Busca el run más largo de repeticiones exactas del motivo (o rotaciones)
function findRepeatRun(seq: string, motif: string) {
  const rots = rotations(motif);
  // Al menos 2 repeticiones para robustez; solo coincidencias exactas (sin interrupciones)
  const re = new RegExp(`(?:${rots.join("|")}){2,}`, "gi");

  let best: { start: number; end: number } | null = null;
  let m: RegExpExecArray | null;
  while ((m = re.exec(seq)) !== null) {
    const start = m.index;
    const end = start + m[0].length;
    if (!best || end - start > best.end - best.start) best = { start, end };
    if (re.lastIndex === m.index) re.lastIndex++; // evitar bucles
  }
  return best;
}

// --- Construcción del índice desde markerData ---

export function buildMarkerRefsFromMarkerData() {
  const out: Record<string, MarkerRefs> = {};

  for (const id of Object.keys(markerData)) {
    const entry: any = (markerData as any)[id];

    // 1) Motivo canónico (primer bloque [XXXX]n del campo motif)
    const canonicalMotif = motifFromField(entry.motif);

    // 2) Elegir la "mejor" secuencia base: preferimos nistVerified y mayor longitud
    const seqRecord = (entry.sequences ?? [])
      .slice()
      .sort((a: any, b: any) => {
        const av = a?.nistVerified ? 1 : 0;
        const bv = b?.nistVerified ? 1 : 0;
        if (bv !== av) return bv - av; // verificado primero
        return (b.sequence?.length ?? 0) - (a.sequence?.length ?? 0); // más larga después
      })[0];

    if (!seqRecord?.sequence) continue;

    // 3) Normalizar a hebra + (tu CSF1PO y D10S1248 están en "+", según markerData)
    const seqPlus = String(seqRecord.sequence).replace(/\s+/g, "").toUpperCase();

    // 4) Detectar el bloque repetitivo principal del motivo canónico
    const run = findRepeatRun(seqPlus, canonicalMotif);
    if (!run) continue; // si no se detecta, omitir (o loggear)

    const leftRefPlus  = seqPlus.slice(0, run.start);
    const rightRefPlus = seqPlus.slice(run.end);
    const repeatLen    = run.end - run.start;
    const refAlleleRepeats = Math.max(1, Math.round(repeatLen / canonicalMotif.length));

    // 5) Guardar con clave en MAYÚSCULAS (para machar fácil con tus ids/names)
    const keyUpper = (entry.name ?? id).toString().toUpperCase();
    out[keyUpper] = { motif: canonicalMotif, refAlleleRepeats, leftRefPlus, rightRefPlus };
  }

  return out;
}

// Índice listo para usar
export const markerRefs: Record<string, MarkerRefs> = buildMarkerRefsFromMarkerData();
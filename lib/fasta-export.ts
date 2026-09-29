// lib/fasta-export.ts
import { buildFastaPlusStrand } from "@/lib/fasta"; // el que ya hicimos
import { markerData, type MarkerEntry } from "@/lib/markerData";

export type ExportType = "standard" | "reference" | "tabular" | "multi";

/**
 * Largest repeat count the FASTA Generator accepts: a technical input limit of
 * the tool (keeps each output small), not a biological or forensic bound. The
 * page states it in the input hint and in the validation message.
 */
export const MAX_REPEAT_COUNT = 100;

export type RepeatCountsResult =
  | { ok: true; counts: number[] }
  | { ok: false; reason: "empty" | "decimal" | "invalid" };

/**
 * Repeat counts for the FASTA Generator: whole numbers from 1 to
 * MAX_REPEAT_COUNT, as a list and/or ranges ("10", "10,11,12", "10-13",
 * "9,10-12,14"). Microvariants such as 9.3 are rejected, never truncated:
 * they are not supported by the simplified constructs, and String.repeat
 * would silently turn 9.3 into 9 copies.
 */
export function parseRepeatCounts(input: string): RepeatCountsResult {
  const parts = input.split(",").map((s) => s.trim()).filter(Boolean);
  if (parts.length === 0) return { ok: false, reason: "empty" };

  const counts = new Set<number>();
  const inRange = (n: number) => n >= 1 && n <= MAX_REPEAT_COUNT;
  for (const part of parts) {
    if (/\d\s*\.|\.\s*\d/.test(part)) return { ok: false, reason: "decimal" };

    const range = part.match(/^(\d+)\s*-\s*(\d+)$/);
    if (range) {
      const a = Number(range[1]);
      const b = Number(range[2]);
      if (!inRange(a) || !inRange(b)) return { ok: false, reason: "invalid" };
      for (let k = Math.min(a, b); k <= Math.max(a, b); k++) counts.add(k);
      continue;
    }

    if (/^\d+$/.test(part) && inRange(Number(part))) {
      counts.add(Number(part));
      continue;
    }

    return { ok: false, reason: "invalid" };
  }
  return { ok: true, counts: [...counts].sort((x, y) => x - y) };
}

function getMarker(id: string): MarkerEntry {
  const m = Object.entries(markerData).find(([markerId]) => markerId === id);
  if (!m) throw new Error(`Marker not found: ${id}`);
  return m[1];
}

export function generateContent(
  markerId: string,
  alleles: number[],
  flankBp: number,
  type: ExportType
): string {
  const m = getMarker(markerId);

  if (type === "tabular") {
    const rows = ["marker,allele,repeats,sequence"];
    for (const r of alleles) {
      const { raw } = buildFastaPlusStrand(m, { flankBp, alleleRepeats: r });
      rows.push([m.name, String(r), String(r), raw].join(","));
    }
    return rows.join("\n");
  }

  const blocks: string[] = [];
  for (const r of alleles) {
    const { sequence } = buildFastaPlusStrand(m, { flankBp, alleleRepeats: r });

    if (type === "standard") {
      // 1 alelo por bloque; si luego quieres 1 archivo por alelo, haces split por "\n\n"
      blocks.push(`>${m.name}_${m.chromosome}_allele_${r}\n${sequence}`);
    } else if (type === "reference") {
      // Reference-style: header con motivo + rango [n]_m
      const start = r - 1; // estilo indexado
      blocks.push(`>${m.name}_${m.motif}[${start}]_${r}\n${sequence}`);
    } else {
      // multi
      blocks.push(`>${m.name}_allele_${r}\n${sequence}`);
    }
  }
  return blocks.join("\n\n");
}
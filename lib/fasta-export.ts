// lib/fasta-export.ts
import { buildFastaPlusStrand } from "@/lib/fasta"; // el que ya hicimos
import { markerData, type MarkerEntry } from "@/lib/markerData";

export type ExportType = "standard" | "reference" | "tabular" | "multi";

export function parseAlleles(input: string): number[] {
  // Acepta: "10", "10,11,12", "10-13", "9,10-12,14"
  const parts = input.split(",").map(s => s.trim()).filter(Boolean);
  const out: number[] = [];
  for (const p of parts) {
    if (p.includes("-")) {
      const [a, b] = p.split("-").map(x => Number(x.trim()));
      if (Number.isFinite(a) && Number.isFinite(b)) {
        const start = Math.min(a, b), end = Math.max(a, b);
        for (let k = start; k <= end; k++) out.push(k);
      }
    } else {
      const n = Number(p);
      if (Number.isFinite(n)) out.push(n);
    }
  }
  return Array.from(new Set(out)).sort((x, y) => x - y);
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
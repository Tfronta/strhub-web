// lib/fasta-export-from-slice.ts
import { fetchSliceFA } from "@/lib/load-slice";
import { findCoreRegion, parseMotif } from "@/lib/find-core";
import type { ExportType } from "@/lib/fasta-export";

// Función auxiliar para insertar saltos de línea cada N bases
function wrapSequence(seq: string, width = 80): string {
  return seq.replace(new RegExp(`(.{1,${width}})`, "g"), "$1\n").trim();
}

export async function generateContentFromSlice(
  marker: string,
  motif: string,
  alleles: number[],
  flankBp: number = 50,
  outputFormat: ExportType = "reference"
): Promise<{
  fasta: string;
  info: { marker: string; motif: string; source: string; flankBp: number };
}> {
  // Normalizar nombre para que coincida con <NAME>__slice.fa
  const markerName = marker.replace(/\s*\(.*\)\s*$/, "").toUpperCase();

  // Cargar slice
  const { seq, url } = await fetchSliceFA(markerName);

  // Detectar core (rotaciones + revcomp)
  const region = findCoreRegion(seq, motif, 2);
  if (!region) {
    throw new Error(
      `No se encontró el core '${parseMotif(motif)}' en el slice de ${markerName}`
    );
  }

  // Flancos reales
  const start = Math.max(0, region.start - flankBp);
  const end = Math.min(seq.length, region.end + flankBp);
  const left = seq.slice(start, region.start);
  const right = seq.slice(region.end, end);

  // Motivo canónico (p.ej. "[ATCT]n" -> "ATCT")
  const canonical = parseMotif(motif);

  // -------- Formateo según outputFormat --------
  if (outputFormat === "tabular") {
    const header = "marker,allele,sequence\n";
    const rows = alleles.map((a) => {
      const seqOut = (left + canonical.repeat(a) + right).toUpperCase();
      return `${markerName},${a},${seqOut}`;
    });
    return {
      fasta: header + rows.join("\n"),
      info: { marker: markerName, motif: canonical, source: url, flankBp },
    };
  }

  if (outputFormat === "multi") {
    const lines = alleles.map((a) => {
      const seqOut = wrapSequence((left + canonical.repeat(a) + right).toUpperCase());
      return `>${markerName}_allele_${a}\n${seqOut}`;
    });
    return {
      fasta: lines.join("\n"),
      info: { marker: markerName, motif: canonical, source: url, flankBp },
    };
  }

  if (outputFormat === "reference") {
    // Flancos en minúsculas, core en MAYÚSCULAS
    const lines = alleles.map((a) => {
      const core = canonical.repeat(a).toUpperCase();
      const seqRef = left.toLowerCase() + core + right.toLowerCase();
      return `>${markerName}_allele_${a}\n${wrapSequence(seqRef)}`;
    });
    return {
      fasta: lines.join("\n\n"),
      info: { marker: markerName, motif: canonical, source: url, flankBp },
    };
  }

  // STANDARD (por defecto): todo en mayúsculas
  const lines = alleles.map((a) => {
    const seqStd = (left + canonical.repeat(a) + right).toUpperCase();
    return `>${markerName}_allele_${a}\n${wrapSequence(seqStd)}`;
  });
  return {
    fasta: lines.join("\n\n"),
    info: { marker: markerName, motif: canonical, source: url, flankBp },
  };
}
// lib/fasta-export-from-slice.ts
import { fetchSliceFA, type SliceRegion } from "@/lib/load-slice";
import { findCoreRegion, parseMotif } from "@/lib/find-core";
import type { ExportType } from "@/lib/fasta-export";
import {
  DEFAULT_REFERENCE_GENOME,
  getReferenceGenome,
  type ReferenceGenomeId,
} from "@/lib/reference-genomes";

export interface SliceExportInfo {
  marker: string;
  motif: string;
  source: string;
  flankBp: number;
  /** Assembly the flanks were cut from. */
  build: ReferenceGenomeId;
  /** Region of the slice file (whole slice, not just the exported window). */
  region: SliceRegion | null;
  /** Region actually exported (core plus the requested flanks), 1-based inclusive. */
  window: SliceRegion | null;
}

// Función auxiliar para insertar saltos de línea cada N bases
function wrapSequence(seq: string, width = 80): string {
  return seq.replace(new RegExp(`(.{1,${width}})`, "g"), "$1\n").trim();
}

export async function generateContentFromSlice(
  marker: string,
  motif: string,
  alleles: number[],
  flankBp: number = 50,
  outputFormat: ExportType = "reference",
  build: ReferenceGenomeId = DEFAULT_REFERENCE_GENOME
): Promise<{
  fasta: string;
  info: SliceExportInfo;
}> {
  const genome = getReferenceGenome(build);
  if (!genome.available) {
    throw new Error(`Reference genome ${genome.label} is not available yet`);
  }

  // Nombre tal como está en el catálogo (el archivo respeta el caso: "vWA__slice.fa").
  const markerName = marker.replace(/\s*\(.*\)\s*$/, "").trim();

  // Cargar slice
  const { seq, url, region } = await fetchSliceFA(markerName, genome.slicesDir);

  // Detectar core (rotaciones + revcomp)
  const core = findCoreRegion(seq, motif, 2);
  if (!core) {
    throw new Error(
      `No se encontró el core '${parseMotif(motif)}' en el slice de ${markerName}`
    );
  }

  // Flancos reales
  const start = Math.max(0, core.start - flankBp);
  const end = Math.min(seq.length, core.end + flankBp);
  const left = seq.slice(start, core.start);
  const right = seq.slice(core.end, end);

  // Motivo canónico (p.ej. "[ATCT]n" -> "ATCT")
  const canonical = parseMotif(motif);

  // Coordenadas genómicas de la ventana exportada (1-based, inclusivas).
  const window: SliceRegion | null = region
    ? {
        chrom: region.chrom,
        start: region.start + start,
        end: region.start + end - 1,
        strand: region.strand,
      }
    : null;
  const locus = window
    ? `${window.chrom}:${window.start}-${window.end}(${window.strand})`
    : "";
  // Cabecera FASTA: marcador, alelo, ensamblado, región y flanco.
  const fastaHeader = (allele: number) =>
    `>${markerName}_allele_${allele} ${genome.id}${locus ? ` ${locus}` : ""} flank=${flankBp}bp`;
  const info: SliceExportInfo = {
    marker: markerName,
    motif: canonical,
    source: url,
    flankBp,
    build: genome.id,
    region,
    window,
  };

  // -------- Formateo según outputFormat --------
  if (outputFormat === "tabular") {
    const header = "marker,allele,build,region,flank_bp,sequence\n";
    const rows = alleles.map((a) => {
      const seqOut = (left + canonical.repeat(a) + right).toUpperCase();
      return `${markerName},${a},${genome.id},${locus},${flankBp},${seqOut}`;
    });
    return { fasta: header + rows.join("\n"), info };
  }

  if (outputFormat === "multi") {
    const lines = alleles.map((a) => {
      const seqOut = wrapSequence((left + canonical.repeat(a) + right).toUpperCase());
      return `${fastaHeader(a)}\n${seqOut}`;
    });
    return { fasta: lines.join("\n"), info };
  }

  if (outputFormat === "reference") {
    // Flancos en minúsculas, core en MAYÚSCULAS
    const lines = alleles.map((a) => {
      const coreSeq = canonical.repeat(a).toUpperCase();
      const seqRef = left.toLowerCase() + coreSeq + right.toLowerCase();
      return `${fastaHeader(a)}\n${wrapSequence(seqRef)}`;
    });
    return { fasta: lines.join("\n\n"), info };
  }

  // STANDARD (por defecto): todo en mayúsculas
  const lines = alleles.map((a) => {
    const seqStd = (left + canonical.repeat(a) + right).toUpperCase();
    return `${fastaHeader(a)}\n${wrapSequence(seqStd)}`;
  });
  return { fasta: lines.join("\n\n"), info };
}
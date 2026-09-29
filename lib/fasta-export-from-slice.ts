// lib/fasta-export-from-slice.ts
//
// Simplified motif-based constructs: GRCh38 5' flank + N copies of the locus
// motif + GRCh38 3' flank, where N is the repeat count the user typed. The
// longest pure run of the motif in the reference slice is what gets replaced,
// so compound repeat structures, interruptions and microvariants are not
// modelled and N is not necessarily the forensic CE allele designation.
// Headers and CSV columns say "repeats"/"construct", never "allele".
import { fetchSliceFA, type SliceRegion } from "@/lib/load-slice";
import { FastaGeneratorError } from "@/lib/fasta-errors";
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
  /**
   * Reference window the flanks come from (the reference repeat run plus the
   * requested flanks), 1-based inclusive. The construct replaces that repeat
   * run, so its length differs from this window.
   */
  window: SliceRegion | null;
}

/**
 * FASTA-Generator-only construction motifs, used in place of the catalog motif.
 * The catalog motif, FSSG data, STRNaming names and ISFG nomenclature are
 * untouched, and the repeat count still counts copies of this motif (no mapping
 * to CE allele designations).
 *
 * Each override is the rotation that starts the block the detector selects in
 * GRCh38, so the reference copy count rebuilds that block and its flanks
 * exactly. Writing the catalog rotation instead shifts the block by one or more
 * bases (same length, different sequence at the junctions).
 *
 * - D1S1656: CTAT x 16, chr1:230769617-230769680. The catalog motif
 *   "[CCTA]n [TCTA]n" starts with CCTA, which never forms a run in GRCh38, so no
 *   construct could be built at all. CTAT is a motif of the FSSG v6.1 canonical
 *   bracketing (AC[n]CTAT[n]).
 * - CSF1PO: CTAT x 13, chr5:150076322-150076373 (catalog [ATCT]n).
 * - D5S818: TCTA x 11, chr5:123775553-123775596 (catalog [ATCT]n).
 * - D7S820: TCTA x 13, chr7:84160224-84160275 (catalog [TATC]n).
 * - TH01: TGAA x 7, chr11:2171086-2171113 (catalog [AATG]n).
 * - TPOX: TGAA x 8, chr2:1489651-1489682 (catalog [AATG]n).
 */
export const CONSTRUCTION_MOTIF_OVERRIDES: Readonly<Record<string, string>> = {
  D1S1656: "CTAT",
  CSF1PO: "CTAT",
  D5S818: "TCTA",
  D7S820: "TCTA",
  TH01: "TGAA",
  TPOX: "TGAA",
};

// Función auxiliar para insertar saltos de línea cada N bases
function wrapSequence(seq: string, width = 80): string {
  return seq.replace(new RegExp(`(.{1,${width}})`, "g"), "$1\n").trim();
}

export async function generateContentFromSlice(
  marker: string,
  motif: string,
  repeatCounts: number[],
  flankBp: number = 50,
  outputFormat: ExportType = "reference",
  build: ReferenceGenomeId = DEFAULT_REFERENCE_GENOME
): Promise<{
  fasta: string;
  info: SliceExportInfo;
}> {
  // parseRepeatCounts already rejects these; String.repeat would silently
  // truncate 9.3 to 9 copies.
  if (!repeatCounts.every((n) => Number.isInteger(n) && n > 0)) {
    throw new RangeError("Repeat counts must be positive whole numbers");
  }

  const genome = getReferenceGenome(build);
  if (!genome.available) {
    throw new FastaGeneratorError("genomeUnavailable", { genome: genome.label });
  }

  // Nombre tal como está en el catálogo (el archivo respeta el caso: "vWA__slice.fa").
  const markerName = marker.replace(/\s*\(.*\)\s*$/, "").trim();

  const constructionMotif = CONSTRUCTION_MOTIF_OVERRIDES[markerName] ?? motif;

  // Cargar slice
  const { seq, url, region } = await fetchSliceFA(markerName, genome.slicesDir);

  // Detectar core (rotaciones + revcomp)
  const core = findCoreRegion(seq, constructionMotif, 2);
  if (!core) {
    throw new FastaGeneratorError("coreNotFound", {
      motif: parseMotif(constructionMotif),
      marker: markerName,
    });
  }

  // Flancos reales
  const start = Math.max(0, core.start - flankBp);
  const end = Math.min(seq.length, core.end + flankBp);
  const left = seq.slice(start, core.start);
  const right = seq.slice(core.end, end);

  // Motivo canónico (p.ej. "[ATCT]n" -> "ATCT")
  const canonical = parseMotif(constructionMotif);

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
  // Cabecera FASTA: marcador, número de repeticiones, motivo, ensamblado, ventana
  // de referencia de donde salen los flancos y largo del flanco.
  const fastaHeader = (repeats: number) =>
    `>${markerName}_repeats_${repeats} motif=${canonical} ${genome.id}${locus ? ` ref_window=${locus}` : ""} flank=${flankBp}bp simplified_construct`;
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
    const header = "marker,repeat_count,motif,build,ref_window,flank_bp,sequence\n";
    const rows = repeatCounts.map((a) => {
      const seqOut = (left + canonical.repeat(a) + right).toUpperCase();
      return `${markerName},${a},${canonical},${genome.id},${locus},${flankBp},${seqOut}`;
    });
    return { fasta: header + rows.join("\n"), info };
  }

  if (outputFormat === "multi") {
    const lines = repeatCounts.map((a) => {
      const seqOut = wrapSequence((left + canonical.repeat(a) + right).toUpperCase());
      return `${fastaHeader(a)}\n${seqOut}`;
    });
    return { fasta: lines.join("\n"), info };
  }

  if (outputFormat === "reference") {
    // Flancos en minúsculas, core en MAYÚSCULAS
    const lines = repeatCounts.map((a) => {
      const coreSeq = canonical.repeat(a).toUpperCase();
      const seqRef = left.toLowerCase() + coreSeq + right.toLowerCase();
      return `${fastaHeader(a)}\n${wrapSequence(seqRef)}`;
    });
    return { fasta: lines.join("\n\n"), info };
  }

  // STANDARD (por defecto): todo en mayúsculas
  const lines = repeatCounts.map((a) => {
    const seqStd = (left + canonical.repeat(a) + right).toUpperCase();
    return `${fastaHeader(a)}\n${wrapSequence(seqStd)}`;
  });
  return { fasta: lines.join("\n\n"), info };
}
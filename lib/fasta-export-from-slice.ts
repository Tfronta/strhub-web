// lib/fasta-export-from-slice.ts
//
// Simplified allele constructs for a CE allele number N: the GRCh38 reference
// slice of the locus with one block changed, the variable repeat block of its
// ISFG minimum range (lib/isfg-ranges.ts). That block is the longest exact,
// in-phase run of one of the [n] motifs of the STRNaming structure
// (findVariableBlock). GRCh38 has k_ref copies of it and is CE allele ce_ref
// over the range, so allele N gets k_ref + (N - ce_ref) copies: N = ce_ref
// rebuilds the reference exactly, and each step of N adds or removes one copy
// of the motif. Everything else (other blocks, interruptions, flanks) stays as
// in GRCh38 and microvariants are not modelled, so a construct has the length
// of allele N, not necessarily the sequence of an observed allele N. Headers
// and CSV rows say "simplified_construct" for that reason.
import { fetchSliceFA, type SliceRegion } from "@/lib/load-slice";
import { FastaGeneratorError } from "@/lib/fasta-errors";
import { findVariableBlock, parseStrnamingFormat } from "@/lib/find-core";
import { getIsfgRange } from "@/lib/isfg-ranges";
import type { ExportType } from "@/lib/fasta-export";
import {
  DEFAULT_REFERENCE_GENOME,
  getReferenceGenome,
  type ReferenceGenomeId,
} from "@/lib/reference-genomes";

export interface SliceExportInfo {
  marker: string;
  /** Motif of the varied block, as written in the STRNaming structure. */
  motif: string;
  /** Copies of that motif in GRCh38. */
  refCopies: number;
  /** CE allele designation of GRCh38 over the ISFG minimum range. */
  ceRef: number;
  /** Smallest CE allele that can be built: one copy of the motif. */
  minAllele: number;
  source: string;
  /** Flank length requested per side. */
  flankBp: number;
  /** Flank lengths written; shorter than flankBp where the slice ends first. */
  flank5Bp: number;
  flank3Bp: number;
  /** Assembly the sequence was cut from. */
  build: ReferenceGenomeId;
  /** Region of the slice file (whole slice, not just the exported window). */
  region: SliceRegion;
  /** ISFG minimum range of the locus. */
  isfgRange: SliceRegion;
  /** The varied block in the reference, 1-based inclusive. */
  block: SliceRegion;
  /**
   * Reference window the output comes from (the varied block plus the flanks
   * written), 1-based inclusive. Allele N replaces the block, so its length
   * differs from this window by (N - ce_ref) motif lengths.
   */
  window: SliceRegion;
}

// Función auxiliar para insertar saltos de línea cada N bases
function wrapSequence(seq: string, width = 80): string {
  return seq.replace(new RegExp(`(.{1,${width}})`, "g"), "$1\n").trim();
}

const formatRegion = (r: SliceRegion) => `${r.chrom}:${r.start}-${r.end}(${r.strand})`;

export async function generateContentFromSlice(
  marker: string,
  ceAlleles: number[],
  flankBp: number = 50,
  outputFormat: ExportType = "reference",
  build: ReferenceGenomeId = DEFAULT_REFERENCE_GENOME
): Promise<{
  fasta: string;
  info: SliceExportInfo;
}> {
  // parseRepeatCounts already rejects these; microvariants such as 9.3 are not
  // modelled, and String.repeat would silently truncate them.
  if (!ceAlleles.every((n) => Number.isInteger(n) && n > 0)) {
    throw new RangeError("CE allele numbers must be positive whole numbers");
  }
  if (!Number.isInteger(flankBp) || flankBp < 0) {
    throw new RangeError("The flank length must be a whole number of bases, 0 or more");
  }

  const genome = getReferenceGenome(build);
  // The ISFG ranges are GRCh38 coordinates; another assembly needs its own.
  if (!genome.available || genome.id !== "GRCh38") {
    throw new FastaGeneratorError("genomeUnavailable", { genome: genome.label });
  }

  // Nombre tal como está en el catálogo (el archivo respeta el caso: "vWA__slice.fa").
  const markerName = marker.replace(/\s*\(.*\)\s*$/, "").trim();
  const range = getIsfgRange(markerName);
  if (!range) {
    throw new FastaGeneratorError("rangeUnavailable", { marker: markerName });
  }

  // Cargar slice
  const { seq, url, region } = await fetchSliceFA(markerName, genome.slicesDir);

  // Offsets come from the header coordinates, so the slice must be the plus
  // strand of the same chromosome, exactly as long as its header says, and
  // contain the whole ISFG range.
  const offset = region ? range.start - region.start : -1;
  if (
    !region ||
    region.strand !== "+" ||
    region.chrom !== range.chrom ||
    seq.length !== region.end - region.start + 1 ||
    offset < 0 ||
    range.end > region.end
  ) {
    throw new FastaGeneratorError("sliceInvalid", { marker: markerName });
  }

  // Bloque variable: dentro del ISFG minimum range, hebra positiva, en fase.
  const found = findVariableBlock(
    seq.slice(offset, offset + range.end - range.start + 1),
    range.strnaming
  );
  if (!found) {
    const motifs = parseStrnamingFormat(range.strnaming)
      .filter((u) => u.count === "n")
      .map((u) => u.motif);
    throw new FastaGeneratorError("coreNotFound", {
      motif: Array.from(new Set(motifs)).join(", "),
      marker: markerName,
    });
  }

  const copiesFor = (allele: number) => found.copies + (allele - range.ceRef);
  const minAllele = range.ceRef - found.copies + 1;
  const tooSmall = ceAlleles.filter((n) => copiesFor(n) < 1);
  if (tooSmall.length) {
    throw new FastaGeneratorError("alleleTooSmall", {
      marker: markerName,
      alleles: tooSmall.join(", "),
      min: String(minAllele),
      motif: found.motif,
    });
  }

  // Flancos reales: lo que hay en el slice a cada lado del bloque, hasta flankBp.
  const blockStart = offset + found.start; // 0-based in the slice
  const blockEnd = offset + found.end; // end-exclusive
  const left = seq.slice(Math.max(0, blockStart - flankBp), blockStart);
  const right = seq.slice(blockEnd, blockEnd + flankBp);

  // Coordenadas genómicas (1-based, inclusivas).
  const at = (from: number, to: number): SliceRegion => ({
    chrom: region.chrom,
    start: region.start + from,
    end: region.start + to - 1,
    strand: region.strand,
  });
  const block = at(blockStart, blockEnd);
  const window = at(blockStart - left.length, blockEnd + right.length);
  const locus = formatRegion(window);
  // The flank lengths written, never just the requested one: one value when
  // both sides have it, one per side when the slice cuts a side short.
  const flankField =
    left.length === right.length
      ? `flank=${left.length}bp`
      : `flank5=${left.length}bp flank3=${right.length}bp`;
  // Cabecera FASTA: marcador y alelo CE, motivo variado y sus copias, ensamblado,
  // ventana de referencia y largo de los flancos.
  const fastaHeader = (allele: number) =>
    `>${markerName}_CE${allele} motif=${found.motif} copies=${copiesFor(allele)} ${genome.id} ref_window=${locus} ${flankField} simplified_construct`;
  const blockFor = (allele: number) => found.motif.repeat(copiesFor(allele));
  const info: SliceExportInfo = {
    marker: markerName,
    motif: found.motif,
    refCopies: found.copies,
    ceRef: range.ceRef,
    minAllele,
    source: url,
    flankBp,
    flank5Bp: left.length,
    flank3Bp: right.length,
    build: genome.id,
    region,
    isfgRange: { chrom: range.chrom, start: range.start, end: range.end, strand: "+" },
    block,
    window,
  };

  // -------- Formateo según outputFormat --------
  if (outputFormat === "tabular") {
    const header =
      "marker,ce_allele,motif,copies,build,ref_window,flank5_bp,flank3_bp,sequence\n";
    const rows = ceAlleles.map((a) => {
      const seqOut = (left + blockFor(a) + right).toUpperCase();
      return `${markerName},${a},${found.motif},${copiesFor(a)},${genome.id},${locus},${left.length},${right.length},${seqOut}`;
    });
    return { fasta: header + rows.join("\n"), info };
  }

  if (outputFormat === "multi") {
    const lines = ceAlleles.map((a) => {
      const seqOut = wrapSequence((left + blockFor(a) + right).toUpperCase());
      return `${fastaHeader(a)}\n${seqOut}`;
    });
    return { fasta: lines.join("\n"), info };
  }

  if (outputFormat === "reference") {
    // Flancos en minúsculas, bloque variado en MAYÚSCULAS
    const lines = ceAlleles.map((a) => {
      const seqRef = left.toLowerCase() + blockFor(a).toUpperCase() + right.toLowerCase();
      return `${fastaHeader(a)}\n${wrapSequence(seqRef)}`;
    });
    return { fasta: lines.join("\n\n"), info };
  }

  // STANDARD (por defecto): todo en mayúsculas
  const lines = ceAlleles.map((a) => {
    const seqStd = (left + blockFor(a) + right).toUpperCase();
    return `${fastaHeader(a)}\n${wrapSequence(seqStd)}`;
  });
  return { fasta: lines.join("\n\n"), info };
}

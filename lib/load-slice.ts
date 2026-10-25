// lib/load-slice.ts
// Lee un FASTA "slice" servido por este mismo sitio (public/slices/) y lo parsea.
//
// The slices are copies of slices/ in github.com/Tfronta/strhub-demo-data
// (main, commit 1c431bc). They used to come from jsDelivr
// (NEXT_PUBLIC_SLICES_BASE), which refuses that repository for being over its
// 50 MB package limit, so slices failed to load with intermittent 403s.
// Same-origin files need no configuration, and the variable is no longer read.

import { FastaGeneratorError } from "@/lib/fasta-errors";

/** Public path of the slices: public/slices/ in the repo. */
export const SLICES_PATH = "/slices/";

export interface SliceRegion {
  chrom: string;
  /** 1-based, inclusive, as written in the slice header. */
  start: number;
  end: number;
  strand: "+" | "-";
}

/** Parse "CSF1PO_|chr5:150076125-150076575(+)" into its region. */
export function parseSliceHeader(header: string): SliceRegion | null {
  const m = header.match(/(chr[0-9XYM]+):(\d+)-(\d+)\(([+-])\)/i);
  if (!m) return null;
  return {
    chrom: m[1],
    start: Number(m[2]),
    end: Number(m[3]),
    strand: m[4] as "+" | "-",
  };
}

/** URL of a slice: /slices/<slicesDir><markerName>__slice.fa */
export function sliceUrlFor(markerName: string, slicesDir = "") {
  return `${SLICES_PATH}${slicesDir}${markerName}__slice.fa`;
}

/**
 * Descarga un archivo FASTA de slice y devuelve { header, seq, url, region }.
 * - `markerName` debe coincidir con el nombre del archivo: <markerName>__slice.fa
 *   Ej: "D21S11" -> /slices/D21S11__slice.fa   (se respeta el caso: "vWA" -> vWA__slice.fa)
 * - `slicesDir` es el subdirectorio del ensamblado ("" para GRCh38, "GRCh37/", ...).
 */
export async function fetchSliceFA(markerName: string, slicesDir = "") {
  const file = `${markerName}__slice.fa`;
  const url = sliceUrlFor(markerName, slicesDir);

  const res = await fetch(url, {
    cache: "force-cache", // deja que el navegador/edge lo cachee
  });

  if (!res.ok) {
    throw new FastaGeneratorError("sliceUnavailable", {
      marker: markerName,
      status: String(res.status),
    });
  }

  const text = await res.text();
  const lines = text.trim().split(/\r?\n/);
  if (!lines.length || !lines[0].startsWith(">")) {
    throw new FastaGeneratorError("sliceInvalid", { marker: markerName });
  }

  const header = lines[0].slice(1).trim();     // sin '>'
  const seq = lines.slice(1).join("").toUpperCase(); // concatenado y en mayúsculas

  if (!seq || /[^ACGTN]/i.test(seq)) {
    // No es bloqueante, pero advertimos si hay caracteres fuera de ACGTN
    console.warn(`[fetchSliceFA] Non-ACGTN characters found in ${file}`);
  }

  return { header, seq, url, region: parseSliceHeader(header) };
}

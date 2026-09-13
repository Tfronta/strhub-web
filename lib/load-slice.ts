// lib/load-slice.ts
// Lee un FASTA "slice" desde tu repo público (jsDelivr/GitHub) y lo parsea.
// Requiere en .env.local:
//   NEXT_PUBLIC_SLICES_BASE="https://cdn.jsdelivr.net/gh/Tfronta/strhub-demo-data@main/slices/"

const BASE = process.env.NEXT_PUBLIC_SLICES_BASE;

// Util: valida que BASE esté configurada
function requireBase() {
  if (!BASE) {
    throw new Error(
      "Falta NEXT_PUBLIC_SLICES_BASE en .env.local (ej: https://cdn.jsdelivr.net/gh/Tfronta/strhub-demo-data@main/slices/)"
    );
  }
  return BASE.replace(/\/+$/, "") + "/"; // asegura una sola barra final
}

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

/**
 * Descarga un archivo FASTA de slice y devuelve { header, seq, url, region }.
 * - `markerName` debe coincidir con el nombre del archivo: <markerName>__slice.fa
 *   Ej: "D21S11" -> .../D21S11__slice.fa   (se respeta el caso: "vWA" -> vWA__slice.fa)
 * - `slicesDir` es el subdirectorio del ensamblado ("" para GRCh38, "GRCh37/", ...).
 */
export async function fetchSliceFA(markerName: string, slicesDir = "") {
  const base = requireBase() + slicesDir;
  const file = `${markerName}__slice.fa`;
  const url = `${base}${file}`;

  // Importante para Next.js en cliente/servidor: usar fetch nativo
  const res = await fetch(url, {
    cache: "force-cache", // deja que el navegador/edge lo cachee
  });

  if (!res.ok) {
    throw new Error(`No pude obtener el slice: ${url} (HTTP ${res.status})`);
  }

  const text = await res.text();
  const lines = text.trim().split(/\r?\n/);
  if (!lines.length || !lines[0].startsWith(">")) {
    throw new Error(`El FASTA ${file} no tiene encabezado '>' válido.`);
  }

  const header = lines[0].slice(1).trim();     // sin '>'
  const seq = lines.slice(1).join("").toUpperCase(); // concatenado y en mayúsculas

  if (!seq || /[^ACGTN]/i.test(seq)) {
    // No es bloqueante, pero advertimos si hay caracteres fuera de ACGTN
    console.warn(`[fetchSliceFA] Advertencia: caracteres no-ACGTN detectados en ${file}`);
  }

  return { header, seq, url, region: parseSliceHeader(header) };
}

/**
 * (Opcional) helper: arma la URL absoluta al slice por si la querés mostrar o linkear.
 */
export function sliceUrlFor(markerName: string, slicesDir = "") {
  const base = requireBase() + slicesDir;
  return `${base}${markerName}__slice.fa`;
}
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

/**
 * Descarga un archivo FASTA de slice y devuelve { header, seq, url }.
 * - `markerName` debe coincidir con el nombre del archivo: <markerName>__slice.fa
 *   Ej: "D21S11" -> .../D21S11__slice.fa
 */
export async function fetchSliceFA(markerName: string) {
  const base = requireBase();
  const file = `${markerName.toUpperCase()}__slice.fa`;
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

  return { header, seq, url };
}

/**
 * (Opcional) helper: arma la URL absoluta al slice por si la querés mostrar o linkear.
 */
export function sliceUrlFor(markerName: string) {
  const base = requireBase();
  return `${base}${markerName}__slice.fa`;
}
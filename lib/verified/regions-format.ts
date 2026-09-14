/**
 * Which of the engine's regions-library layouts a file is in, from its columns.
 * A mirror of harness/regions_library.py detect_format, kept small on purpose:
 * it decides only whether to offer STRhub's ready-made file in the same layout.
 */
import type { RegionsLibraryFormat } from "./submission";

const INT = /^\d+$/;
const NUM = /^\d+(?:\.\d+)?$/;
const MOTIF = /^[ACGTN]{1,12}$/i;

export function detectRegionsFormat(text: string): RegionsLibraryFormat | null {
  const rows: string[][] = [];
  for (const raw of text.split(/\r?\n/)) {
    const s = raw.trim();
    if (!s || s.startsWith("#") || s.startsWith("track") || s.startsWith("browser")) continue;
    rows.push(s.includes("\t") ? s.split("\t") : s.split(/\s+/));
    if (rows.length >= 50) break;
  }
  if (rows.length === 0) return null;
  const widths = new Set(rows.map((r) => r.length));
  const col = (i: number, ok: (v: string) => boolean) => rows.every((r) => r.length > i && ok(r[i]));
  if (widths.size === 1 && widths.has(11)) return "strsearch";
  if (!(col(1, (v) => INT.test(v)) && col(2, (v) => INT.test(v)))) return null;
  const within = (...ws: number[]) => [...widths].every((w) => ws.includes(w));
  if (within(5) && col(3, (v) => INT.test(v)) && col(4, (v) => MOTIF.test(v))) return "gangstr";
  if (within(6, 7) && col(3, (v) => INT.test(v)) && col(4, (v) => NUM.test(v)) && col(5, (v) => !NUM.test(v))) return "hipstr";
  if (within(3, 4)) return "bed4";
  return null;
}

/** Roughly how many data rows a file has, for the "590 loci" message. */
export function countRegions(text: string): number {
  return text.split(/\r?\n/).filter((l) => l.trim() && !l.trim().startsWith("#")).length;
}

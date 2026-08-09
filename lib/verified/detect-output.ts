/**
 * Work out what a tool's output file IS, from a sample of it.
 *
 * The submit form asks the author to declare their output's format and, for the
 * content gate, its column layout: which column holds the DNA, which holds the
 * read counts, which carries the marker name. Those are facts about a file they
 * already have on disk, so asking them to hand-count column positions is asking
 * them to do by eye what this can do exactly.
 *
 * Everything here mirrors `harness/check_content.py`, which is what will
 * actually run:
 *   - rows are split on TAB, always, whatever format was declared;
 *   - lines starting with '#' are skipped (so VCF headers never count);
 *   - column positions are 0-based;
 *   - the locus name is everything before the first `locus_sep` (default ':').
 *
 * That last point is why CSV/JSON/plain-text get no column proposals: the gate
 * would split them on tabs and see one column. Detecting the format is still
 * worth doing there — it is the declaration the IO gate checks.
 *
 * Pure and synchronous: the file is read in the browser and never leaves it.
 */

export type DetectedFormat = "vcf" | "json" | "csv" | "tsv" | "text";

/** Structural facts, in the form's own field names. Absent = could not tell. */
export interface DetectedColumns {
  columns?: number;
  dnaColumn?: number;
  countColumns?: number[];
  locusColumn?: number;
}

/**
 * Something we deliberately did NOT infer. Rendered as a caveat next to the
 * result: a detector that quietly proposes less than the author expects is
 * worse than one that says which part it left alone.
 */
export type DetectionNote =
  | "contentNeedsTabs"
  | "vcfColumnsVary"
  | "tooFewRows"
  | "noLocusColumn"
  | "readsNotInferred"
  | "truncated";

export interface OutputDetection {
  format: DetectedFormat;
  /** Rows considered (data rows, '#' lines excluded). */
  rows: number;
  columns: DetectedColumns;
  /** Distinct marker names found in the locus column, sorted. */
  loci: string[];
  notes: DetectionNote[];
}

const DNA_RE = /^[ACGTN]+$/i;
const INT_RE = /^\d+$/;

/**
 * Rows parsed before we stop.
 *
 * High on purpose. Column layout is settled by the first few hundred rows, but
 * the locus list is not: real STR output is grouped by marker, so a low cap
 * reads the first few loci and calls that the panel. At 5,000 rows a 25k-row
 * STRait Razor file reported 16 of its 227 markers, which would have proposed a
 * weaker `expect_loci` than the author's own data supports. Callers hand us a
 * byte-capped slice, so this only bounds pathological line counts.
 */
const MAX_ROWS = 200_000;
/** Rows the column classifiers look at. */
const SAMPLE_ROWS = 400;
/** Below this, a column of DNA-looking strings is more likely a coincidence. */
const MIN_ROWS_FOR_DNA = 10;
/** A DNA column of very short strings is probably an allele code, not a read. */
const MIN_DNA_LENGTH = 20;

/** The VCF ID column, which is where a genotyper puts the marker name. */
const VCF_LOCUS_COLUMN = 2;

/**
 * Names that mark a column as carrying forensic markers. Deliberately a shape
 * test, not a list: a panel we have never heard of should still be recognised,
 * while a column of sequences or sample ids should not.
 */
function looksLikeLocusName(value: string): boolean {
  const v = value.trim();
  if (v === "" || v === ".") return false;
  if (v.length > 24) return false;
  if (/^rs\d+$/i.test(v)) return true; // identity SNP
  if (/^(D\d+[SZ]\d+|DY[SF]\d+\S*|DXS\d+)$/i.test(v)) return true; // D-nomenclature
  if (/^(amel(ogenin)?|amel_?y|sry|yindel)$/i.test(v)) return true; // sex markers
  // Named autosomal loci (TH01, TPOX, vWA, FGA, CSF1PO, SE33, PentaD/E, ...).
  if (/^[A-Za-z][A-Za-z0-9]{2,11}$/.test(v) && !DNA_RE.test(v) && !INT_RE.test(v)) {
    return true;
  }
  return false;
}

function dataRows(text: string): { rows: string[]; truncated: boolean } {
  const rows: string[] = [];
  let truncated = false;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/\r$/, "");
    if (line.trim() === "" || line.startsWith("#")) continue;
    if (rows.length >= MAX_ROWS) {
      truncated = true;
      break;
    }
    rows.push(line);
  }
  return { rows, truncated };
}

/** The field count shared by most rows, and how dominant it is. */
function modalFieldCount(rows: string[], sep: string): { count: number; share: number } {
  const tally = new Map<number, number>();
  for (const r of rows) {
    const n = r.split(sep).length;
    tally.set(n, (tally.get(n) ?? 0) + 1);
  }
  let count = 0;
  let best = 0;
  for (const [n, hits] of tally) {
    if (hits > best) {
      best = hits;
      count = n;
    }
  }
  return { count, share: rows.length ? best / rows.length : 0 };
}

function isJson(text: string): boolean {
  const t = text.trim();
  if (!t.startsWith("{") && !t.startsWith("[")) return false;
  try {
    JSON.parse(t);
    return true;
  } catch {
    return false;
  }
}

function isVcf(text: string): boolean {
  // A real VCF declares itself; HipSTR-style output stripped of its ## header
  // still carries the mandatory column line, which is just as decisive.
  return (
    /^##fileformat=VCF/im.test(text) ||
    /^#CHROM\tPOS\tID\tREF\tALT/m.test(text)
  );
}

/** Distinct marker names in a column, applying the gate's own ':' split. */
function lociIn(rows: string[], column: number): string[] {
  const seen = new Set<string>();
  for (const r of rows) {
    const f = r.split("\t");
    if (column >= f.length) continue;
    const name = f[column].split(":")[0].trim();
    if (name !== "" && name !== ".") seen.add(name);
  }
  return [...seen].sort();
}

/** Classify each column of a tab-separated sample. */
function detectColumns(
  rows: string[],
  columns: number,
  notes: DetectionNote[],
): DetectedColumns {
  const sample = rows.slice(0, SAMPLE_ROWS).map((r) => r.split("\t"));
  const usable = sample.filter((f) => f.length === columns);
  if (usable.length === 0) return {};

  const out: DetectedColumns = { columns };
  const countColumns: number[] = [];
  let bestLocus = { column: -1, ratio: 0 };

  for (let c = 0; c < columns; c++) {
    const values = usable.map((f) => f[c] ?? "");

    // Read counts: every value a non-negative integer. The gate sums these, so
    // a single non-integer would fail the whole run — require all of them.
    if (values.every((v) => INT_RE.test(v.trim()))) {
      countColumns.push(c);
      continue;
    }

    // Sequence: every value ACGTN and long enough to be a read rather than an
    // allele code. One stray row fails `dna_is_acgtn`, so this is all-or-nothing.
    if (
      out.dnaColumn === undefined &&
      usable.length >= MIN_ROWS_FOR_DNA &&
      values.every((v) => DNA_RE.test(v.trim())) &&
      values.reduce((sum, v) => sum + v.trim().length, 0) / values.length >= MIN_DNA_LENGTH
    ) {
      out.dnaColumn = c;
      continue;
    }

    // Locus: the column whose values look most like marker names. Ratio rather
    // than a count so a column of 20 loci beats one of 400 sequence ids.
    const distinct = new Set(values.map((v) => v.split(":")[0].trim()));
    const named = [...distinct].filter(looksLikeLocusName).length;
    const ratio = distinct.size ? named / distinct.size : 0;
    // A locus column repeats: one row per allele or per sequence. A column with
    // a distinct value per row is an id, however name-shaped it looks.
    const repeats = distinct.size < usable.length;
    if (ratio > bestLocus.ratio && ratio >= 0.5 && repeats) {
      bestLocus = { column: c, ratio };
    }
  }

  if (countColumns.length) out.countColumns = countColumns;
  if (bestLocus.column >= 0) out.locusColumn = bestLocus.column;
  else notes.push("noLocusColumn");
  if (usable.length < MIN_ROWS_FOR_DNA) notes.push("tooFewRows");

  return out;
}

export function detectOutput(text: string): OutputDetection {
  const clean = text.replace(/^﻿/, "");
  const { rows, truncated } = dataRows(clean);
  const notes: DetectionNote[] = [];
  if (truncated) notes.push("truncated");

  if (isJson(clean)) {
    notes.push("contentNeedsTabs");
    return { format: "json", rows: rows.length, columns: {}, loci: [], notes };
  }

  if (isVcf(clean)) {
    // Column count is not proposed on purpose: it counts one field per SAMPLE,
    // so a file from a cohort run would pin a number the single-sample
    // verification run can never match. Read depth is not proposed either — the
    // gate already derives it from the FORMAT column's DP sub-field.
    notes.push("vcfColumnsVary", "readsNotInferred");
    const loci = lociIn(rows, VCF_LOCUS_COLUMN);
    if (loci.length === 0) notes.push("noLocusColumn");
    return {
      format: "vcf",
      rows: rows.length,
      columns: loci.length ? { locusColumn: VCF_LOCUS_COLUMN } : {},
      loci,
      notes,
    };
  }

  const head = rows.slice(0, SAMPLE_ROWS);
  const tabs = modalFieldCount(head, "\t");
  if (tabs.count > 1 && tabs.share >= 0.9) {
    const columns = detectColumns(rows, tabs.count, notes);
    const loci = columns.locusColumn !== undefined ? lociIn(rows, columns.locusColumn) : [];
    notes.push("readsNotInferred");
    return { format: "tsv", rows: rows.length, columns, loci, notes };
  }

  const commas = modalFieldCount(head, ",");
  if (commas.count > 1 && commas.share >= 0.9) {
    notes.push("contentNeedsTabs");
    return { format: "csv", rows: rows.length, columns: {}, loci: [], notes };
  }

  notes.push("contentNeedsTabs");
  return { format: "text", rows: rows.length, columns: {}, loci: [], notes };
}

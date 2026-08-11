/**
 * Validate an author's regions BED against a dataset's supported-loci panel.
 *
 * STRhub Verified runs tools against SLICES, not whole genomes. A BED targeting
 * coordinates the slice doesn't cover would make a healthy tool look broken, so
 * it is a REJECTED SUBMISSION, never a failed verification. Catching it here —
 * in the form, before dispatch — is what keeps that promise cheap: the author
 * fixes it in seconds instead of burning a CI run to be told no.
 *
 * This is the web mirror of the engine's `harness/validate_bed.py`. Both read
 * only BED columns 1-3, so any tool's layout works (HipSTR 7-col, GangSTR 5-col,
 * plain BED3). Keep the two in lockstep; if they ever disagree, the harness wins
 * (it is the one that gates the actual run).
 */

/** Public so the browser can reach it; mirrors the server-side ENGINE_* vars. */
export const ENGINE_RAW_BASE =
  process.env.NEXT_PUBLIC_VERIFIED_ENGINE_RAW ??
  "https://raw.githubusercontent.com/Tfronta/strhub-verified/main";

export interface BedInterval {
  chrom: string;
  start: number;
  end: number;
  name: string;
  /** 1-based source line, for pointing the author at the offending row. */
  line: number;
}

export interface RegionsValidation {
  ok: boolean;
  /** Panel loci the BED covers, by name. */
  coveredLoci: string[];
  /** BED rows that overlap no supported window — the actionable errors. */
  outOfPanel: BedInterval[];
  minLoci: number;
  panelSize: number;
  /** Human-readable reasons; empty when ok. */
  reasons: string[];
}

/** 'Y' and 'chrY' must compare equal — a missing prefix is a recoverable slip,
 *  not a reason to reject an otherwise correct BED. */
export function normChrom(c: string): string {
  const s = c.trim();
  return /^chr/i.test(s) ? s : `chr${s}`;
}

/** Rows inspected when working out which columns hold the coordinates. */
const SNIFF_ROWS = 50;
/** Share of inspected rows a column triple must satisfy to be believed. */
const SNIFF_AGREEMENT = 0.8;

function splitRow(raw: string): string[] {
  return raw.includes("\t") ? raw.split("\t") : raw.trim().split(/\s+/);
}

function isDataLine(raw: string): boolean {
  const s = raw.trim();
  return (
    s !== "" && !s.startsWith("#") && !s.startsWith("track") && !s.startsWith("browser")
  );
}

function isInteger(value: string | undefined): boolean {
  return value !== undefined && /^\d+$/.test(value.trim());
}

/** A chromosome, in any of the spellings real files use: chr1, 1, chrX, X, MT. */
function looksLikeChrom(value: string | undefined): boolean {
  return value !== undefined && /^(chr)?([0-9]{1,2}|[XYxy]|MT?|mt?)$/.test(value.trim());
}

/**
 * Which column holds the chromosome, given that the two after it hold the
 * coordinates.
 *
 * Columns 0,1,2 is the BED convention and nearly always right, so it is tried
 * first and only displaced if it does not hold. Everything else is a genuine
 * tool-specific layout — the alternative to sniffing is telling the author their
 * file is malformed when it is merely arranged differently.
 */
function sniffChromColumn(rows: string[][]): number | null {
  const sample = rows.slice(0, SNIFF_ROWS);
  if (sample.length === 0) return null;
  const width = Math.max(...sample.map((f) => f.length));

  const candidates = [0, ...Array.from({ length: width }, (_, i) => i).filter((i) => i !== 0)];
  for (const c of candidates) {
    if (c + 2 >= width + 1) continue;
    // Ordering is deliberately not part of the test. A file whose end precedes
    // its start is a coordinate mistake the author needs told about by name, not
    // a reason to decide these were never the coordinate columns.
    const agreeing = sample.filter(
      (f) => looksLikeChrom(f[c]) && isInteger(f[c + 1]) && isInteger(f[c + 2]),
    ).length;
    if (agreeing / sample.length >= SNIFF_AGREEMENT) return c;
  }
  return null;
}

/**
 * Read a BED's chromosome and coordinate columns.
 *
 * Only three values are ever needed, so every tool's layout works: extra
 * columns are ignored, a header row is skipped, and the coordinate columns are
 * located rather than assumed. Throws on input where they cannot be found, so
 * the caller can show the author the line that defeated it.
 *
 * Mirrored by `harness/validate_bed.py` in the engine, which runs the same
 * checks as a pre-flight. The two must agree: a BED accepted here and rejected
 * there aborts the run with no report, which is a far worse failure than being
 * told about it in the form.
 */
export function parseBed3(text: string): BedInterval[] {
  const lines = text.split(/\r?\n/);
  const dataLines: { raw: string; line: number }[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (isDataLine(lines[i])) dataLines.push({ raw: lines[i], line: i + 1 });
  }
  if (dataLines.length === 0) return [];

  let split = dataLines.map((d) => splitRow(d.raw));
  let first = dataLines[0];

  // A header names the columns, so it cannot carry coordinates. Dropping it is
  // safe precisely because a real data row would have failed this test.
  const headerish =
    split.length > 1 && !isInteger(split[0][1]) && !isInteger(split[0][2]);
  if (headerish) {
    dataLines.shift();
    split = split.slice(1);
    first = dataLines[0];
  }

  const chromColumn = sniffChromColumn(split);
  if (chromColumn === null) {
    const shown = first.raw.trim().slice(0, 120);
    throw new Error(
      `line ${first.line}: could not find chromosome, start and end columns in "${shown}"`,
    );
  }

  const rows: BedInterval[] = [];
  for (let i = 0; i < split.length; i++) {
    const f = split[i];
    const lineNumber = dataLines[i].line;
    if (f.length < chromColumn + 3) {
      throw new Error(
        `line ${lineNumber}: expected at least ${chromColumn + 3} columns, got ${f.length}`,
      );
    }
    const start = Number(f[chromColumn + 1]);
    const end = Number(f[chromColumn + 2]);
    if (!Number.isInteger(start) || !Number.isInteger(end)) {
      throw new Error(`line ${lineNumber}: non-integer coordinates`);
    }
    if (end <= start) {
      throw new Error(`line ${lineNumber}: end must be greater than start`);
    }
    // The name column is only ever cosmetic here: coverage is credited to the
    // panel window a row overlaps, never to what the author called it.
    const nameColumn = chromColumn + 3;
    const named =
      f.length > nameColumn && f[nameColumn] !== "" && f[nameColumn] !== ".";
    rows.push({
      chrom: normChrom(f[chromColumn]),
      start,
      end,
      name: named ? f[nameColumn] : `${normChrom(f[chromColumn])}:${start}-${end}`,
      line: lineNumber,
    });
  }
  return rows;
}

function overlaps(a: BedInterval, b: BedInterval): boolean {
  return a.chrom === b.chrom && a.start < b.end && a.end > b.start;
}

/**
 * Overlap, not containment: a partial overlap still puts reads under the tool,
 * and the run's own output gate catches a BED that overlaps but is useless.
 * Rejecting here is reserved for what we can prove won't work.
 */
export function validateRegions(
  bed: BedInterval[],
  panel: BedInterval[],
  minLoci: number,
): RegionsValidation {
  const covered = new Set<string>();
  const outOfPanel: BedInterval[] = [];

  for (const row of bed) {
    const hits = panel.filter((w) => overlaps(row, w));
    if (hits.length === 0) {
      outOfPanel.push(row);
    } else {
      for (const w of hits) covered.add(w.name);
    }
  }

  const reasons: string[] = [];
  if (outOfPanel.length > 0) {
    const preview = outOfPanel
      .slice(0, 3)
      .map((r) => `${r.chrom}:${r.start}-${r.end} (line ${r.line})`)
      .join(", ");
    const more = outOfPanel.length > 3 ? ` and ${outOfPanel.length - 3} more` : "";
    reasons.push(
      `${outOfPanel.length} region${outOfPanel.length > 1 ? "s" : ""} outside the panel: ${preview}${more}`,
    );
  }
  if (covered.size < minLoci) {
    reasons.push(`covers ${covered.size} supported loci, at least ${minLoci} required`);
  }

  return {
    ok: reasons.length === 0,
    coveredLoci: [...covered].sort(),
    outOfPanel,
    minLoci,
    panelSize: panel.length,
    reasons,
  };
}

/**
 * True when the upload looks like OUR panel handed back unconverted.
 *
 * We cannot know what a given tool's BED should look like — that surface is
 * unbounded, and for a brand-new tool we'd have nothing to compare against. But
 * we DO know our own panel, so we can catch the one specific, common mistake:
 * downloading the panel and uploading it as-is, without converting its columns to
 * the tool's format. The tell is column 4 (parsed into `name`): our panel puts the
 * locus name there, so an unconverted upload's names match the panel's; a real
 * tool BED puts something else there (HipSTR a period, GangSTR a period, ...).
 *
 * Advisory only: a genuine BED4 tool could legitimately carry locus names in
 * column 4 and trip this. The caller should warn, never block.
 */
export function looksLikeUnconvertedPanel(
  bed: BedInterval[],
  panel: BedInterval[],
): boolean {
  if (bed.length === 0) return false;
  const panelNames = new Set(panel.map((p) => p.name));
  const matches = bed.filter((r) => panelNames.has(r.name)).length;
  return matches / bed.length >= 0.5;
}

/** URL of a dataset's supported-loci panel — also what the download button serves. */
export function panelUrl(inputType: string): string {
  return `${ENGINE_RAW_BASE}/datasets/${inputType}/loci.bed`;
}

/** Fetch a dataset's panel. Returns null when the type has no panel (e.g. ONT). */
export async function fetchPanel(inputType: string): Promise<BedInterval[] | null> {
  const res = await fetch(panelUrl(inputType));
  if (!res.ok) return null;
  const text = await res.text();
  try {
    const rows = parseBed3(text);
    return rows.length ? rows : null;
  } catch {
    return null;
  }
}

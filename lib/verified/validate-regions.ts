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

/**
 * Read columns 1-3 of a BED. Extra columns are ignored, which is what makes this
 * work for every tool's format. Throws on malformed input so the caller can show
 * the author the exact line.
 */
export function parseBed3(text: string): BedInterval[] {
  const rows: BedInterval[] = [];
  const lines = text.split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const s = raw.trim();
    if (!s || s.startsWith("#") || s.startsWith("track") || s.startsWith("browser")) {
      continue;
    }
    const f = raw.includes("\t") ? raw.split("\t") : raw.split(/\s+/);
    if (f.length < 3) {
      throw new Error(`line ${i + 1}: expected at least 3 columns, got ${f.length}`);
    }
    const start = Number(f[1]);
    const end = Number(f[2]);
    if (!Number.isInteger(start) || !Number.isInteger(end)) {
      throw new Error(`line ${i + 1}: non-integer coordinates`);
    }
    if (end <= start) {
      throw new Error(`line ${i + 1}: end must be greater than start`);
    }
    const named = f.length > 3 && f[3] !== "" && f[3] !== ".";
    rows.push({
      chrom: normChrom(f[0]),
      start,
      end,
      name: named ? f[3] : `${normChrom(f[0])}:${start}-${end}`,
      line: i + 1,
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

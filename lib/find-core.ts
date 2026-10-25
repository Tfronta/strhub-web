// lib/find-core.ts
// Variable repeat block of an STR inside its ISFG minimum range, read from the
// STRNaming structure of the locus (lib/isfg-ranges.ts).

export interface RepeatUnit {
  motif: string;
  /** Fixed copy number, or "n" for a block whose length varies between alleles. */
  count: number | "n";
}

/**
 * "TATC[n]AATC[2]ATCT[3]" -> [{TATC, n}, {AATC, 2}, {ATCT, 3}]. A STRNaming
 * variant suffix after "_" (D7S820 "..._-1T>-") is dropped. Anything else
 * that is not a run of MOTIF[count] units throws, so a typo in the range table
 * cannot pass silently.
 */
export function parseStrnamingFormat(format: string): RepeatUnit[] {
  const structure = format.split("_")[0];
  const units: RepeatUnit[] = [];
  // Sticky: each unit must start where the previous one ended.
  const re = /([ACGT]+)\[(n|\d+)\]/y;
  let read = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(structure)) !== null) {
    units.push({ motif: m[1], count: m[2] === "n" ? "n" : Number(m[2]) });
    read = re.lastIndex;
  }
  if (!units.length || read !== structure.length) {
    throw new Error(`Not a STRNaming repeat structure: ${format}`);
  }
  return units;
}

export interface VariableBlock {
  /** 0-based, end-exclusive offsets into the searched sequence. */
  start: number;
  end: number;
  motif: string;
  copies: number;
}

/**
 * Longest (in bases) exact, in-phase run of one of the [n] motifs of `format`
 * in `seq`, the GRCh38 forward-strand sequence of the ISFG minimum range. The
 * motifs are taken as written: no rotations and no reverse complement, since
 * the STRNaming structure already fixes the strand and the phase. Ties go to
 * the leftmost run. Null when no [n] motif occurs in `seq`.
 */
export function findVariableBlock(seq: string, format: string): VariableBlock | null {
  const s = seq.toUpperCase();
  const motifs = Array.from(
    new Set(parseStrnamingFormat(format).filter((u) => u.count === "n").map((u) => u.motif)),
  );

  let best: VariableBlock | null = null;
  for (const motif of motifs) {
    const p = motif.length;
    for (let i = 0; i + p <= s.length; i++) {
      // Only maximal runs: skip a start that continues a run to its left.
      if (!s.startsWith(motif, i) || (i >= p && s.startsWith(motif, i - p))) continue;
      let copies = 1;
      while (s.startsWith(motif, i + copies * p)) copies++;
      const len = copies * p;
      const bestLen: number = best ? best.end - best.start : 0;
      if (!best || len > bestLen || (len === bestLen && i < best.start)) {
        best = { start: i, end: i + len, motif, copies };
      }
    }
  }
  return best;
}

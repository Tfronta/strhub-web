// Parsing + sequence alignment for STRNaming / ISFG canonical bracketing.
//
// A canonical bracketing string looks like "GGAT[n]AGAT[1]GGAT[1]AGAT[n]AGAC[n]AGAT[2]".
// Some strings carry a trailing STRNaming variant suffix outside the repeat blocks,
// e.g. "TCTA[n]_-1C>A" (a base change relative to the reference, upstream of the range).
// We parse the MOTIF[count] blocks, keep the variant suffix aside, and align the block
// chain against the sliced minimum-range reference sequence so the UI can highlight
// each repeat unit and leave the residual flanks muted. All of this is derived from the
// FSSG data (col "STRNaming Formatted ISFG Minimum Range"); nothing is invented here.

export type CanonBlock = {
  motif: string;
  count: number | null; // null == variable "[n]"
  countRaw: string; // "n" | "3" | ...
};

export type ParsedBracketing = {
  blocks: CanonBlock[];
  variantSuffix: string | null;
  raw: string;
  valid: boolean;
};

export function parseBracketing(raw: string): ParsedBracketing {
  if (!raw) return { blocks: [], variantSuffix: null, raw, valid: false };
  let s = raw.trim();
  let variantSuffix: string | null = null;
  const us = s.indexOf("_");
  if (us !== -1) {
    variantSuffix = s.slice(us + 1);
    s = s.slice(0, us);
  }
  const blocks: CanonBlock[] = [];
  const re = /([ACGT]+)\[(\d+|n)\]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s)) !== null) {
    blocks.push({
      motif: m[1],
      count: m[2] === "n" ? null : parseInt(m[2], 10),
      countRaw: m[2],
    });
  }
  return { blocks, variantSuffix, raw, valid: blocks.length > 0 };
}

type Alignment = {
  start: number;
  end: number;
  consumed: number;
  units: { motif: string; start: number; end: number }[];
};

function alignForm(seq: string, blocks: CanonBlock[]): Alignment | null {
  if (!blocks.length) return null;
  const first = blocks[0];
  const starts: number[] = [];
  for (let i = 0; i + first.motif.length <= seq.length; i++) {
    if (seq.startsWith(first.motif, i)) starts.push(i);
  }
  let best: Alignment | null = null;
  for (const start of starts) {
    let pos = start;
    let ok = true;
    const units: Alignment["units"] = [];
    for (const b of blocks) {
      const L = b.motif.length;
      if (b.count === null) {
        // variable: greedy, at least one copy
        let c = 0;
        while (seq.startsWith(b.motif, pos)) {
          units.push({ motif: b.motif, start: pos, end: pos + L });
          pos += L;
          c++;
        }
        if (c === 0) {
          ok = false;
          break;
        }
      } else {
        for (let j = 0; j < b.count; j++) {
          if (seq.startsWith(b.motif, pos)) {
            units.push({ motif: b.motif, start: pos, end: pos + L });
            pos += L;
          } else {
            ok = false;
            break;
          }
        }
        if (!ok) break;
      }
    }
    if (ok) {
      const consumed = pos - start;
      if (!best || consumed > best.consumed) {
        best = { start, end: pos, consumed, units };
      }
    }
  }
  return best;
}

// Roles drive the (production) color scheme: repeat = green, interruption =
// amber, flank = grey (with motif-like copies inside the flank outlined).
export type SpanKind = "flank" | "repeat" | "interruption";

export type HighlightSpan = {
  text: string;
  kind: SpanKind;
  motif?: string;
};

export type MotifHighlight = {
  // index of the canonical form used for the highlight (matches canonicalBracketing[formIndex])
  formIndex: number;
  spans: HighlightSpan[];
  // motifs that behave as genuine repeats ([n] blocks) in the chosen form; used
  // to outline motif-like copies sitting inside the flanks.
  repeatMotifs: string[];
  // lengths of those genuine repeat motifs; a fixed block whose length matches
  // one of these still reads as a core repeat (e.g. AATC[2] in a tetranucleotide
  // locus), while off-length blocks (A[1], CAATCTGT[1]) read as interruptions.
  repeatLens: number[];
  aligned: boolean;
};

// A unit is a core repeat if its motif is a genuine [n] repeat or shares a
// length with one; otherwise it is an interruption / internal variant. With no
// [n] blocks at all, everything is treated as a repeat rather than all amber.
export function isCoreMotif(
  motif: string,
  repeatMotifs: string[],
  repeatLens: number[]
): boolean {
  if (repeatMotifs.length === 0) return true;
  return repeatMotifs.includes(motif) || repeatLens.includes(motif.length);
}

// The motifs that appear as variable "[n]" blocks in a bracketing form. These
// are the genuine repeat stretches; anything else aligned in the repeat region
// (mononucleotides, odd-length or single-copy blocks) reads as an interruption.
export function repeatMotifsOf(form: string): string[] {
  const { blocks } = parseBracketing(form);
  const out: string[] = [];
  for (const b of blocks) {
    if (b.count === null && !out.includes(b.motif)) out.push(b.motif);
  }
  return out;
}

export type FlankToken = { text: string; motifLike: boolean };

// Split a flank into plain stretches and motif-like copies (occurrences of any
// repeat motif), so the UI can outline the latter, as production did.
export function tokenizeFlank(text: string, motifs: string[]): FlankToken[] {
  if (!text) return [];
  const units = motifs.filter(Boolean).sort((a, b) => b.length - a.length);
  if (!units.length) return [{ text, motifLike: false }];
  const tokens: FlankToken[] = [];
  let i = 0;
  const push = (t: string, m: boolean) => {
    const last = tokens[tokens.length - 1];
    if (last && last.motifLike === m) last.text += t;
    else tokens.push({ text: t, motifLike: m });
  };
  while (i < text.length) {
    const hit = units.find((u) => text.startsWith(u, i));
    if (hit) {
      push(hit, true);
      i += hit.length;
    } else {
      push(text[i], false);
      i += 1;
    }
  }
  return tokens;
}

/**
 * Build a role-tagged highlight of the reference (minimum-range) sequence.
 * Chooses, among the alternative canonical forms, the one that aligns to this
 * particular reference sequence with the greatest coverage, then splits the
 * sequence into a leading flank, one span per aligned unit (repeat vs
 * interruption), and a trailing flank. Falls back to a single flank span (plain
 * sequence) when no form aligns, so the component never has to guess.
 */
export function buildHighlight(
  seq: string,
  forms: string[]
): MotifHighlight {
  const empty: MotifHighlight = {
    formIndex: 0,
    spans: seq ? [{ text: seq, kind: "flank" }] : [],
    repeatMotifs: [],
    repeatLens: [],
    aligned: false,
  };
  if (!seq || !forms.length) return empty;

  let best: Alignment | null = null;
  let bestForm = -1;
  forms.forEach((f, idx) => {
    const parsed = parseBracketing(f);
    const a = alignForm(seq, parsed.blocks);
    if (a && (!best || a.consumed > best.consumed)) {
      best = a;
      bestForm = idx;
    }
  });

  if (!best) return empty;
  // TS control-flow: `best` is non-null past this point.
  const alignment = best as Alignment;

  const repeatMotifs = repeatMotifsOf(forms[bestForm]);
  const repeatLens = Array.from(new Set(repeatMotifs.map((m) => m.length)));

  const spans: HighlightSpan[] = [];
  if (alignment.start > 0) {
    spans.push({ text: seq.slice(0, alignment.start), kind: "flank" });
  }
  for (const u of alignment.units) {
    spans.push({
      text: seq.slice(u.start, u.end),
      kind: isCoreMotif(u.motif, repeatMotifs, repeatLens)
        ? "repeat"
        : "interruption",
      motif: u.motif,
    });
  }
  if (alignment.end < seq.length) {
    spans.push({ text: seq.slice(alignment.end), kind: "flank" });
  }

  return { formIndex: bestForm, spans, repeatMotifs, repeatLens, aligned: true };
}

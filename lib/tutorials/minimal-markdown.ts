/**
 * The minimal markdown of the tutorial JSON, the same subset the tutorials
 * project renders on its own page (`md_a_html` in `construir.py`):
 *
 * - blocks are separated by blank lines;
 * - a block whose lines all start with 4 spaces is a command block;
 * - a block whose first line starts with "- " is a list (indented lines
 *   continue the item above);
 * - anything else is a paragraph, its lines joined with spaces;
 * - inline: `code`, **bold** and *italics*.
 *
 * Full markdown would misread this text: step 7 wraps "(Data > Text to
 * Columns)" so that a line starts with ">", which markdown turns into a quote.
 */

export type Inline =
  | { type: "text"; text: string }
  | { type: "code"; text: string }
  | { type: "strong"; children: Inline[] }
  | { type: "em"; children: Inline[] };

export type Block =
  | { type: "paragraph"; children: Inline[] }
  | { type: "list"; items: Inline[][] }
  | { type: "code"; text: string };

// Left to right, so a code span wins over asterisks inside it.
const INLINE = /`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*/g;

export function parseInline(text: string): Inline[] {
  const out: Inline[] = [];
  let last = 0;
  for (const m of text.matchAll(INLINE)) {
    const at = m.index ?? 0;
    if (at > last) out.push({ type: "text", text: text.slice(last, at) });
    if (m[1] != null) out.push({ type: "code", text: m[1] });
    else if (m[2] != null) out.push({ type: "strong", children: parseInline(m[2]) });
    else out.push({ type: "em", children: parseInline(m[3]) });
    last = at + m[0].length;
  }
  if (last < text.length) out.push({ type: "text", text: text.slice(last) });
  return out;
}

export function parseBlocks(text: string | null | undefined): Block[] {
  const groups: string[][] = [];
  let current: string[] = [];
  for (const line of (text ?? "").replace(/^\n+|\n+$/g, "").split("\n")) {
    if (line.trim() === "") {
      if (current.length) groups.push(current);
      current = [];
    } else {
      current.push(line);
    }
  }
  if (current.length) groups.push(current);

  return groups.map((lines): Block => {
    if (lines.every((l) => l.startsWith("    "))) {
      return { type: "code", text: lines.map((l) => l.slice(4)).join("\n") };
    }
    if (lines[0].trimStart().startsWith("- ")) {
      const items: string[] = [];
      for (const l of lines) {
        const t = l.trimStart();
        if (t.startsWith("- ")) items.push(t.slice(2));
        else items[items.length - 1] += " " + l.trim();
      }
      return { type: "list", items: items.map(parseInline) };
    }
    return {
      type: "paragraph",
      children: parseInline(lines.map((l) => l.trim()).join(" ")),
    };
  });
}

/** One-line text (table cells, error fixes): wrapped lines joined with spaces. */
export function parseLine(text: string | null | undefined): Inline[] {
  return parseInline((text ?? "").split(/\s+/).filter(Boolean).join(" "));
}

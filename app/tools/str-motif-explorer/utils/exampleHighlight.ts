// app/tools/str-motif-explorer/utils/exampleHighlight.ts

export type ExampleBlockType = "flank" | "repeat" | "interruption";

export type ExampleBlock = {
  type: ExampleBlockType;
  text: string;
  tooltipKey?: "repeat" | "flank" | "interruption";
};

/**
 * Highlights a real sequence by identifying repeat blocks and interruptions.
 * For simple motifs with a single canonical repeat unit.
 */
export function highlightExampleSequence(
  sequence: string,
  canonicalMotif: string
): ExampleBlock[] {
  const seq = sequence.toUpperCase();
  const motif = canonicalMotif.toUpperCase();

  if (!motif || motif.length === 0) {
    return [{ type: "flank", text: seq, tooltipKey: "flank" }];
  }

  const blocks: ExampleBlock[] = [];
  let currentIndex = 0;

  // For CSF1PO, handle both AGAT and its reverse complement ATCT
  // Create regex that matches either the motif or its reverse complement
  const reverseComplement = (dna: string): string => {
    const complement: Record<string, string> = {
      A: "T",
      T: "A",
      G: "C",
      C: "G",
    };
    // Standard: complement first, then reverse
    return dna
      .split("")
      .map((base) => complement[base] || base)
      .reverse()
      .join("");
  };

  const revCompMotif = reverseComplement(motif);
  const motifRegex = new RegExp(
    `(?:${motif}|${revCompMotif})+`,
    "g"
  );
  const matches: Array<{ start: number; end: number }> = [];

  let match;
  while ((match = motifRegex.exec(seq)) !== null) {
    matches.push({
      start: match.index,
      end: match.index + match[0].length,
    });
  }

  // If no matches found, return entire sequence as flank
  if (matches.length === 0) {
    return [{ type: "flank", text: seq, tooltipKey: "flank" }];
  }

  // Build blocks: flank → repeat → interruption → repeat → ... → flank
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];

    // Add flank before first match
    if (i === 0 && match.start > currentIndex) {
      blocks.push({
        type: "flank",
        text: seq.slice(currentIndex, match.start),
        tooltipKey: "flank",
      });
    }

    // Add the repeat block
    blocks.push({
      type: "repeat",
      text: seq.slice(match.start, match.end),
      tooltipKey: "repeat",
    });

    // Add interruption between matches (if any)
    if (i < matches.length - 1) {
      const nextMatch = matches[i + 1];
      if (match.end < nextMatch.start) {
        blocks.push({
          type: "interruption",
          text: seq.slice(match.end, nextMatch.start),
          tooltipKey: "interruption",
        });
      }
    }

    currentIndex = match.end;
  }

  // Add flank after last match
  if (currentIndex < seq.length) {
    blocks.push({
      type: "flank",
      text: seq.slice(currentIndex),
    });
  }

  return blocks;
}

/**
 * Splits a sequence into individual blocks, creating one block per motif unit.
 * Each repeat occurrence becomes a separate block.
 */
export function splitMotif(
  sequence: string,
  motif: string
): ExampleBlock[] {
  const seq = sequence.toUpperCase();
  const motifUpper = motif.toUpperCase();

  if (!motifUpper || motifUpper.length === 0) {
    return [{ type: "flank", text: seq, tooltipKey: "flank" }];
  }

  const blocks: ExampleBlock[] = [];
  let currentIndex = 0;

  // Create reverse complement for matching
  const reverseComplement = (dna: string): string => {
    const complement: Record<string, string> = {
      A: "T",
      T: "A",
      G: "C",
      C: "G",
    };
    return dna
      .split("")
      .map((base) => complement[base] || base)
      .reverse()
      .join("");
  };

  const revCompMotif = reverseComplement(motifUpper);
  const motifLength = motifUpper.length;

  // Find all motif matches (including reverse complement)
  const matches: Array<{ start: number; end: number }> = [];
  let searchIndex = 0;

  while (searchIndex < seq.length) {
    const remainingSeq = seq.slice(searchIndex);
    const directMatch = remainingSeq.indexOf(motifUpper);
    const revCompMatch = remainingSeq.indexOf(revCompMotif);

    let nextMatch: { start: number; end: number } | null = null;

    if (directMatch !== -1 && (revCompMatch === -1 || directMatch <= revCompMatch)) {
      nextMatch = {
        start: searchIndex + directMatch,
        end: searchIndex + directMatch + motifLength,
      };
    } else if (revCompMatch !== -1) {
      nextMatch = {
        start: searchIndex + revCompMatch,
        end: searchIndex + revCompMatch + motifLength,
      };
    }

    if (!nextMatch) {
      break;
    }

    matches.push(nextMatch);
    searchIndex = nextMatch.end;
  }

  // Build blocks: flank → repeat (individual) → interruption → repeat (individual) → ... → flank
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];

    // Add flank before first match
    if (i === 0 && match.start > currentIndex) {
      blocks.push({
        type: "flank",
        text: seq.slice(currentIndex, match.start),
        tooltipKey: "flank",
      });
    }

    // Add the repeat block (one motif unit)
    blocks.push({
      type: "repeat",
      text: seq.slice(match.start, match.end),
      tooltipKey: "repeat",
    });

    // Check if there's a gap before the next match (interruption)
    if (i < matches.length - 1) {
      const nextMatch = matches[i + 1];
      if (match.end < nextMatch.start) {
        blocks.push({
          type: "interruption",
          text: seq.slice(match.end, nextMatch.start),
          tooltipKey: "interruption",
        });
      }
    }

    currentIndex = match.end;
  }

  // Add flank after last match
  if (currentIndex < seq.length) {
    blocks.push({
      type: "flank",
      text: seq.slice(currentIndex),
      tooltipKey: "flank",
    });
  }

  return blocks;
}


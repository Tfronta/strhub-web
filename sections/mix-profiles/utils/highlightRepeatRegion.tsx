// app/sections/mix-profiles/utils/highlightRepeatRegion.tsx
// Helper function to highlight repeat regions in STR sequences

import React from "react";

export function highlightRepeatRegion(
  sequence: string | null | undefined,
  motif: string | null | undefined,
  highlight: boolean
): React.ReactNode {
  const defaultReturn = <span className="font-mono">{sequence ?? "—"}</span>;
  
  if (!highlight) return defaultReturn;
  if (!sequence || typeof sequence !== "string") return <span className="font-mono">—</span>;
  if (sequence === "—") return <span className="font-mono">—</span>;

  // No highlighting when motif is missing
  if (!motif || motif.length === 0) {
    return <span className="font-mono">{sequence}</span>;
  }

  // Find contiguous blocks of the motif (simple motifs only)
  const motifLen = motif.length;
  let bestStart = -1;
  let bestEnd = -1;

  let i = 0;
  while (i <= sequence.length - motifLen) {
    if (sequence.slice(i, i + motifLen) === motif) {
      const start = i;
      let end = i + motifLen;
      i += motifLen;
      while (
        i <= sequence.length - motifLen &&
        sequence.slice(i, i + motifLen) === motif
      ) {
        end += motifLen;
        i += motifLen;
      }
      if (end - start > bestEnd - bestStart) {
        bestStart = start;
        bestEnd = end;
      }
    } else {
      i++;
    }
  }

  if (bestStart === -1) {
    return <span className="font-mono">{sequence}</span>;
  }

  const before = sequence.slice(0, bestStart);
  const block = sequence.slice(bestStart, bestEnd);
  const after = sequence.slice(bestEnd);

  return (
    <span className="font-mono">
      {before}
      <span className="repeat-region-highlight">{block}</span>
      {after}
    </span>
  );
}


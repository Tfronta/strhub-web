// Writes the STRbase Variant Allele sequences of every marker, in markerData
// order, as JSON: { [markerId]: [{ allele, sequence }] }. Input for
// scripts/strnaming-window-strbase.py.
//   npx tsx scripts/dump-strbase-sequences.ts > strbase.json
import { markerData } from "@/lib/markerData";

const out: Record<string, Array<{ allele: string; sequence: string }>> = {};
for (const [id, marker] of Object.entries(markerData)) {
  const sequences =
    (marker as unknown as { sequences?: ReadonlyArray<{ allele: string | number; sequence: string }> })
      .sequences ?? [];
  if (sequences.length) {
    out[id] = sequences.map((s) => ({ allele: String(s.allele), sequence: s.sequence }));
  }
}
process.stdout.write(JSON.stringify(out));

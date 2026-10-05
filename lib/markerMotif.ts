// Which repeat structure a marker page or the Catalog shows for a marker.
//
// For the loci in STRidER's FSSG this is the FSSG STRNaming template (the first
// form of its "STRNaming Formatted ISFG Minimum Range for Common Alleles"
// column), so marker pages read the same as the STR Motif Explorer. For the
// other markers it is the STRbase motif, labelled as historical notation: it is
// written as [MOTIF]n and often in a different repeat phase (CSF1PO [ATCT]n
// versus TCTA[n]), so it must not pass for ISFG nomenclature.
//
// data/fssg_template_by_marker.json is a small extract of the FSSG data so the
// client-side Catalog does not ship the whole FSSG file; lib/markerMotif.test.ts
// keeps it identical to what fssgFor() reads.

import templates from "@/data/fssg_template_by_marker.json";

export type MarkerMotif =
  | { kind: "fssgTemplate"; value: string; fssgLocus: string }
  | { kind: "strbaseMotif"; value: string };

const BY_MARKER = templates.byMarker as Record<
  string,
  { locus: string; template: string }
>;

export function markerMotif(
  id: string,
  strbaseMotif: string | null | undefined,
): MarkerMotif | null {
  const fssg = BY_MARKER[id.toLowerCase()];
  if (fssg)
    return {
      kind: "fssgTemplate",
      value: fssg.template,
      fssgLocus: fssg.locus,
    };
  return strbaseMotif ? { kind: "strbaseMotif", value: strbaseMotif } : null;
}

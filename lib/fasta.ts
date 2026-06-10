// lib/fasta.ts
import { markerRefs } from "@/lib/markerRefs-from-data"
import { MarkerEntry } from "./markerData"

function wrapFasta(seq: string, width = 60) {
  let out = ""
  for (let i = 0; i < seq.length; i += width) out += seq.slice(i, i + width) + "\n"
  return out.trimEnd()
}
function repeatMotif(motif: string, repeats: number) {
  return repeats > 0 ? motif.repeat(repeats) : ""
}

export function buildFastaPlusStrand(
  marker: MarkerEntry,
  opts: { flankBp: number; alleleRepeats?: number; headerExtras?: string; lineWidth?: number; maxFlankBp?: number }
) {
  const lineWidth = opts.lineWidth ?? 60
  const maxFlankBp = Math.max(0, opts.maxFlankBp ?? 500)
  const flankRequested = Math.max(0, Math.floor(opts.flankBp || 0))

  // Intentar machar por name o id en MAYÚSCULAS
  const ref =
    markerRefs[marker.name.toUpperCase()] ||
    markerRefs[marker.name.toUpperCase()]

  if (!ref) {
    throw new Error(`No hay flancos para ${marker.name}. ¿Está en markerData?`)
  }

  const flankReal = Math.min(flankRequested, maxFlankBp, ref.leftRefPlus.length, ref.rightRefPlus.length)

  const left  = flankReal ? ref.leftRefPlus.slice(ref.leftRefPlus.length - flankReal) : ""
  const right = flankReal ? ref.rightRefPlus.slice(0, flankReal) : ""

  const repeats = Math.max(0, Math.floor(opts.alleleRepeats ?? ref.refAlleleRepeats))
  const core = repeatMotif(ref.motif, repeats)

  const seq = left + core + right

  const header =
    `>${marker.name}_Chr${marker.chromosome}_flanking_${flankReal}bp_allele_${repeats}` +
    (opts.headerExtras ? `_${opts.headerExtras}` : "")

  return { header, sequence: wrapFasta(seq, lineWidth), raw: seq, used: { flankRequested, flankReal, repeats } }
}
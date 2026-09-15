# Foundations article: structure for Contentful

This file is an authoring skeleton for the Foundations (Back to Basics) article
about STR sequence nomenclature. Map the sections below to the Contentful
article fields and replace every `[FIGURE n]` block with an uploaded image.

Contentful field mapping:
- **title** -> the H1 below
- **slug** -> `str-sequence-nomenclature`
- **summary** -> the "Summary" line
- **postReadMinutes** -> 8 (estimate, adjust)
- **authors** -> link as usual
- **bodyMd** -> everything under "BODY (bodyMd)"

Language: base draft in English. Duplicate as separate Contentful entries for
`es` and `pt` when translating (the platform routes articles per locale).

Figures: each `[FIGURE n]` lists what the image should show, a suggested
caption, and alt text. Upload the asset to Contentful and insert it where the
placeholder is. Keep figures few and purposeful.

---

## TITLE
From CE to sequence: reading STR alleles under the ISFG 2024 nomenclature

## SUMMARY
How a capillary electrophoresis (CE) allele number relates to a sequence based
STR allele, what the ISFG minimum range is, and how to read a STRNaming name.

## BODY (bodyMd)

### 1. Two ways to name the same allele
Capillary electrophoresis (CE) names an allele by its length: a single number
such as 8 or 9.3. Massively parallel sequencing (MPS) reads the actual bases, so
two alleles of the same length can differ in sequence. STRhub keeps both: the CE
number you already know, and the sequence based name that MPS adds.

[FIGURE 1]
- Shows: one CE allele number (e.g. TH01 9.3) with two different sequences under
  it (isoalleles), to make "same length, different sequence" visual.
- Caption: "Same CE allele, two sequences: MPS distinguishes what CE cannot."
- Alt: "One CE allele number splitting into two different DNA sequences."

### 2. The CE allele number
The CE allele is a length based designation, calibrated against allelic ladders.
It is kit independent and remains the common currency of forensic STR typing.
Non integer values (for example 9.3) are microvariants: whole repeats plus a few
extra bases.

### 3. The sequence based allele (STRNaming, ISFG 2024)
A sequence allele is written by the STRNaming algorithm as:

`CE<n>_` + the repeat structure in `MOTIF[n]` blocks + any sequence variants.

Example: `CE8_TGAA[8]` or `CE9.3_TGAA[6]TGA[1]TGAA[3]`. The `CE<n>_` prefix keeps
the CE number attached, so the sequence name always carries its CE equivalent.

[FIGURE 2]
- Shows: one STRNaming name dissected: the `CE17_` prefix, the `MOTIF[n]` blocks
  coloured, and a trailing `_+1T>C` variant, each labelled.
- Caption: "Anatomy of a STRNaming name."
- Alt: "A STRNaming allele name split into CE prefix, repeat blocks, and variant."

### 4. Anatomy of the repeat region
- Canonical repeat motif: the reference repeat unit used to describe the locus.
- Core repeat region: the run of repeats that defines the allele; only these
  count toward the allele size.
- Flanking region: sequence just outside the core; not counted, but it can carry
  variants.
- Format: the 2023/2024 recommendations write the count after the motif,
  `TGAA[8]`; the older 2016 style wrote `[TGAA]8`. STRhub uses `MOTIF[n]`.

[FIGURE 3]
- Shows: a short sequence with the core repeat highlighted and the 5' and 3'
  flanks muted, motif unit labelled.
- Caption: "Core repeat vs flanking region."
- Alt: "DNA sequence with the core repeat highlighted between two muted flanks."

### 5. The reporting range: minimum range vs kit range
This is the key 2024 concept. Different MPS kits sequence different windows of a
locus, so the same allele can produce different raw strings. To make results
comparable, the ISFG defines a minimum range: the common window that should
always be reported. STRhub always names alleles on the ISFG minimum range, so
the names are comparable across kits and labs. Extra flanking bases captured by
wider kits are named by position relative to the minimum range (for example
`_+3G>A`), not as new blocks.

[FIGURE 4]  (you already have this from the FSSG, TPOX example)
- Shows: the FSSG TPOX diagram: reference sequence, ISFG minimum range, and the
  four kit ranges (ForenSeq, IDSeek, Precision ID, PowerSeq) as bars of
  different width.
- Caption: "One locus, one minimum range, many kit ranges. STRhub reports on the
  minimum range so names stay comparable."
- Alt: "TPOX locus showing the ISFG minimum range and four different kit ranges."

### 6. Why the repeat count does not always equal the allele number
At some loci the sum of the printed blocks is not the CE number, because of a
fixed per locus offset inherited from how the original allelic ladders were
calibrated (a length adjustment). vWA is the classic case: the blocks sum to 19
repeat units, but the allele is 14, because vWA carries a fixed offset of 5
repeats. STRNaming applies this automatically, so its CE number matches what a
CE kit reports.

[FIGURE 5]  (optional)
- Shows: vWA blocks summing to 19, an arrow "minus 5 (length adjustment)", equals
  CE 14.
- Caption: "Why 19 blocks read as CE 14 at vWA."
- Alt: "vWA repeat blocks summing to 19 minus a fixed offset of 5 equals CE 14."

### 7. Population frequencies: CE and MPS are not interchangeable
MPS allele frequencies depend on the sequence range and allele definition used.
They are richer than CE frequencies (isoalleles split what CE lumped together),
but they are not directly comparable to CE frequencies. Read any frequency table
with its allele definition and range in mind.

### 8. How STRhub represents alleles (and where it differs)
- Mix Profiles (NGS): genuine STRNaming names on the ISFG minimum range, plus a
  Full Sequence that is exactly the minimum range window, so it can be verified.
- Catalog (Variant Alleles): sequences as reported by STRbase, in the STRbase
  window. These are valid sequences but are not ISFG minimum range STRNaming
  names, so STRhub does not label them as such.

### 9. Verify it yourself
To reproduce a STRNaming name, paste the minimum range sequence into STRNaming
and set the reported range to the ISFG minimum range for that locus. Resources:
- STRNaming tool: https://fdstools.nl/strnaming/
- STRidER nomenclature guidance: https://strider.online/nomenclature
- FSSG (Forensic Sequence STRucture Guide): via STRidER
- ISFG DNA Commission recommendation (FSI:Genetics 68, 2024, 102946):
  https://www.sciencedirect.com/science/article/pii/S1872497323001217

### 10. Glossary
(Use the same short definitions as the in app tooltips; render each as an
anchored term so tooltips can deep link, e.g. `#minimum-range`.)

- **CE allele** — Length based allele designation from capillary electrophoresis
  (fragment size). The traditional, kit independent number (for example 8, 9.3).
- **Sequence based / MPS allele** — Allele defined by its actual sequence, not
  only length. Two alleles of the same CE size can differ in sequence.
- **STRNaming name** — Standardized sequence allele name: `CE<n>_` plus the
  repeat structure in `MOTIF[n]` blocks plus any variants.
- **Canonical repeat motif** — The reference repeat unit used to describe a locus
  in the current recommendations, in the recommended orientation.
- **Historical motif** — The motif or orientation used in earlier nomenclature;
  may differ from the canonical motif. Kept for continuity.
- **MOTIF[n] vs [MOTIF]n** — The 2023/2024 format puts the count after the motif
  (`TGAA[8]`); the 2016 format wrote `[TGAA]8`. STRhub uses `MOTIF[n]`.
- **Core repeat region** — The run of repeat units that defines the allele. Only
  these count toward the designation.
- **Flanking region** — Sequence just outside the core repeat. Not counted in the
  allele size; may carry variants named by position.
- **ISFG minimum range** — The minimum genomic window defined by the ISFG 2024
  recommendations for reporting a locus; the common region across kits and labs,
  which keeps names comparable. STRhub reports on this range.
- **Kit range** — The window a specific MPS kit actually sequences; it varies by
  kit and usually differs from the minimum range.
- **Length adjustment** — A fixed per locus offset (historical ladder
  calibration) that makes the CE number differ from the raw block count (for
  example vWA, minus 5 repeats).
- **Isoallele** — Two alleles with the same CE number but different sequence
  within the reported range.
- **Microvariant** — An allele whose length is not a whole number of repeats
  (for example 9.3 = 9 full repeats plus 3 bases).
- **Sequence / flanking variant** — A point change or indel relative to the
  reference within the reported range, named by position (for example `_+1T>C`).
- **FSSG** — Forensic Sequence STRucture Guide (STRidER): the practical reference
  listing each locus minimum range, kit ranges, and STRNaming bracketing.

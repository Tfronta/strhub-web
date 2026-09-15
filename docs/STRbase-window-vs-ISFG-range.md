# STRbase bracketing vs ISFG range (STRNaming): why the two differ

Short reference explaining why the bracketed repeat notation shown in STRbase
can differ from the STRNaming (ISFG 2024) allele name, and why neither is an
error. All examples below were taken from the real data used in STRhub
(STRbase `pattern` fields and STRNaming output over the ISFG reported range).

## The short version

STRbase and STRNaming use the **same** bracketed convention (`MOTIF[n]`, ISFG
2024) and, for most markers, describe the **same repeat structure**. Two things
are handled differently:

1. **CE prefix.** STRNaming prefixes the length based (capillary
   electrophoresis) allele number: `CE<n>_...`. STRbase shows the bracketing
   without that prefix.
2. **Reported range.** STRNaming names the sequence over the **ISFG 2024
   minimal reported range**. STRbase uses its own (broader, NIST style)
   window. At loci where the two windows differ, STRbase keeps repeat blocks
   that the ISFG range trims, so the bracketing looks different even though the
   underlying sequence is the same.

STRNaming also appends any point or flank differences relative to the reference
of the reported range (for example `_+1T>C`, `_-1T>-`). STRbase can carry
microvariants too, in its own window.

Both systems are internally consistent. In STRhub we verified that all 1215
"clean" STRbase patterns (those without a variant suffix) expand exactly to
their own stored sequence, so STRbase is self consistent. The differences below
are conventions, not defects.

## Case 1: same structure, only the CE prefix differs (most markers)

For markers whose STRbase window already matches the ISFG range, the only
visible difference is the `CE<n>_` prefix.

| Marker | Allele | STRbase `pattern` | STRNaming (ISFG) |
|--------|--------|-------------------|------------------|
| vWA | 11 | `GGAT[3]AGAT[1]GGAT[1]AGAT[6]AGAC[3]AGAT[2]` | `CE11_GGAT[3]AGAT[1]GGAT[1]AGAT[6]AGAC[3]AGAT[2]` |
| D12S391 | 13 | `TAGA[8]CAGA[5]` | `CE13_TAGA[8]CAGA[5]` |
| D13S317 | 8 | `TATC[8]AATC[2]ATCT[3]` | `CE8_TATC[8]AATC[2]ATCT[3]` |
| D8S1179 | 10 | `TATC[10]` | `CE10_TATC[10]` |

## Case 2: the reported range differs (CSF1PO)

CSF1PO is the clearest example of a window difference. STRbase keeps a
downstream `ATCT[3]` block; the ISFG minimal range stops before it. Same
underlying sequence, same allele number, different amount of sequence inside the
bracketing.

| Marker | Allele | STRbase `pattern` | STRNaming (ISFG) |
|--------|--------|-------------------|------------------|
| CSF1PO | 6 | `TCTA[6]ATCT[3]` | `CE6_TCTA[6]` |
| CSF1PO | 13 | `TCTA[13]ATCT[3]TCTA[2]` | `CE13_TCTA[13]` |

The `ATCT[3]` (and `TCTA[2]`) are real sequence downstream of the CSF1PO core
repeat. STRbase includes them in its notation; the ISFG range does not. Neither
counts them toward the allele number, which stays 6 (or 13).

## Case 3: the block count does not add up to the allele (vWA)

At some loci the sum of the printed repeat blocks is not the allele number. This
is inherited from how the original allelic ladders were calibrated and is
encoded in STRNaming as a fixed per locus length adjustment. It appears in
STRbase too (both call the allele the same number).

vWA example: the blocks sum to 16 repeat units, but the allele is 11. The fixed
vWA offset is 5 repeats (20 bp).

| Marker | Allele | Blocks (sum of counts) | Allele number | Offset |
|--------|--------|------------------------|---------------|--------|
| vWA | 11 | `GGAT[3]AGAT[1]GGAT[1]AGAT[6]AGAC[3]AGAT[2]` = 16 | CE11 | 16 - 5 = 11 |
| vWA | 14 | ...`AGAT[8]`... = 19 | CE14 | 19 - 5 = 14 |
| vWA | 17 | ...`AGAT[11]`... = 22 | CE17 | 22 - 5 = 17 |

## Case 4: STRNaming adds reference based edits (D7S820)

Because STRNaming names against the reference of the reported range, it appends
point or flank differences that a plain bracketing does not show. It also
resolves homopolymer boundaries explicitly.

| Marker | Allele | STRbase `pattern` | STRNaming (ISFG) |
|--------|--------|-------------------|------------------|
| D7S820 | 7 | `A[8]CTAT[1]CAATCTGT[1]CTAT[7]` | `CE7_A[9]CTAT[1]CAATCTGT[1]CTAT[7]_-1T>-` |

Here the poly A run and a single base flank difference are represented
explicitly by STRNaming (`A[9]` with `_-1T>-`), while STRbase writes `A[8]`.

## What STRhub does

- Mix Profiles NGS table: shows genuine STRNaming names (`CE<n>_...`) generated
  by the STRNaming tool over the ISFG reported range, and the Full Sequence is
  the exact sequence over that range so it can be reproduced at
  https://fdstools.nl/strnaming/.
- Catalog Variant Alleles: shows the STRbase sequence and allele designation
  only. It no longer labels the STRbase bracketing as "STRNaming", because that
  bracketing follows the STRbase window, not the ISFG range.

## Takeaway

The difference between STRbase bracketing and a STRNaming name is a matter of
convention (CE prefix, reported range, reference based edits), not a data error
in STRbase. STRbase remains a valid, self consistent source; it simply is not
the same thing as a STRNaming ISFG name, so the two should not be labeled
interchangeably.

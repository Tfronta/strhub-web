# FASTA Generator: output format

The FASTA Generator writes simplified allele constructs for a CE allele number
N: the GRCh38 reference around the locus with one repeat block, the variable
block of its ISFG minimum range, lengthened or shortened by whole motifs. The
sections below describe the current format (2026-10) and the earlier change
(2026-09). Anything that parses the output needs the changes of both.

## 2026-10: CE allele numbers over the ISFG minimum range

### How a construct is built

1. **ISFG minimum range.** `lib/isfg-ranges.ts` holds the range of 22 loci (the
   20 CODIS core loci plus Penta D and Penta E): GRCh38 coordinates (1-based,
   inclusive), `ce_ref` (the CE allele of the reference over the range) and the
   STRNaming structure. It is a copy of `data/isfg_ranges_grch38.tsv` in
   [strhub-demo-data](https://github.com/Tfronta/strhub-demo-data) (main,
   commit 1c431bc), taken from the STRidER FSSG v6-1, the material associated
   with Recommendation 3 of Gettings et al. (2024), *FSI: Genetics* 68:102946,
   https://doi.org/10.1016/j.fsigen.2023.102946.
2. **Variable block.** Inside the range (offset = range start − slice header
   start), the longest exact, in-phase, forward-strand run of one of the `[n]`
   motifs of the STRNaming structure. Motifs are used as written: no rotations
   and no reverse complement. A suffix after `_` (D7S820 `_-1T>-`) is a flank
   variant and is ignored. `k_ref` is the number of copies of that run in
   GRCh38.
3. **Copies.** CE allele N gets `copies = k_ref + (N − ce_ref)` copies of the
   motif. N = `ce_ref` rebuilds GRCh38 exactly; N ± 1 changes the length by one
   motif and nothing else. N is rejected when `copies` would be below 1.
   Microvariants (for example 9.3) are not supported.
4. **Flanks.** The slice sequence on each side of the varied block, up to the
   requested length. The rest of the ISFG range (fixed blocks, interruptions,
   other `[n]` blocks) is part of the flanks and stays as in GRCh38.

The result has the length of CE allele N but is not necessarily the sequence of
an observed allele N, so headers keep the `simplified_construct` flag.

### FASTA header

Before:

```
>TH01_repeats_9 motif=TGAA GRCh38 ref_window=chr11:2170986-2171213(+) flank=100bp simplified_construct
```

After:

```
>TH01_CE9 motif=TGAA copies=9 GRCh38 ref_window=chr11:2170986-2171213(+) flank=100bp simplified_construct
>FGA_CE22 motif=AAAG copies=14 GRCh38 ref_window=chr4:154587648-154587903(+) flank=100bp simplified_construct
```

- `repeats_9` is now `CE9`: the number typed is the CE allele designation.
- `motif=` is the motif of the varied block, as written in the STRNaming
  structure (FGA: `AAAG`, not the catalog motif).
- New `copies=`: copies of that motif in this construct. It equals N only at
  loci where GRCh38 has `ce_ref` copies of the block (TH01, TPOX, D18S51, ...);
  FGA CE22 has 14.
- `ref_window=` is the GRCh38 window the output comes from: the varied block
  plus the flanks written.
- `flank=` gives the flank length written. When the slice ends before the
  requested length on one side, the header gives each side instead, never the
  requested value:

  ```
  >TH01_CE9 motif=TGAA copies=9 GRCh38 ref_window=chr11:2170889-2171313(+) flank5=197bp flank3=200bp simplified_construct
  ```

### CSV (Tabular output)

Before:

```
marker,repeat_count,motif,build,ref_window,flank_bp,sequence
TPOX,8,TGAA,GRCh38,chr2:1489551-1489782(+),100,TAGATCGTAAGCCC…
```

After:

```
marker,ce_allele,motif,copies,build,ref_window,flank5_bp,flank3_bp,sequence
TPOX,8,TGAA,8,GRCh38,chr2:1489551-1489782(+),100,100,TAGATCGTAAGCCC…
```

- `repeat_count` is now `ce_allele`, and a `copies` column follows `motif`.
- `flank_bp` is now `flank5_bp` and `flank3_bp`: the lengths written on each
  side.

### Reference-style FASTA

Flanks in lower case and the varied block in upper case, as before. The fixed
parts of the ISFG range are in lower case with the flanks.

### Varied block per locus

| Locus | ISFG minimum range | STRNaming structure | Varied block | Copies in GRCh38 | ce_ref | Smallest N |
|---|---|---|---|---|---|---|
| CSF1PO | chr5:150076318-150076380 | `TCTA[n]` | TCTA, chr5:150076325-150076376 | 13 | 13 | 1 |
| D10S1248 | chr10:129294239-129294299 | `GGAA[n]` | GGAA, chr10:129294244-129294295 | 13 | 13 | 1 |
| D12S391 | chr12:12297011-12297099 | `TAGA[n]CAGA[n]` | TAGA, chr12:12297019-12297066 | 12 | 19 | 8 |
| D13S317 | chr13:82148021-82148104 | `TATC[n]AATC[2]ATCT[3]` | TATC, chr13:82148025-82148068 | 11 | 11 | 1 |
| D16S539 | chr16:86352698-86352749 | `GATA[n]` | GATA, chr16:86352702-86352745 | 11 | 11 | 1 |
| D18S51 | chr18:63281663-63281756 | `GAAA[n]A[1]AG[4]GAAA[2]` | GAAA, chr18:63281668-63281739 | 18 | 18 | 1 |
| D19S433 | chr19:29926212-29926303 | `TCCT[n]` | TCCT, chr19:29926234-29926285 | 13 | 14 | 2 |
| D1S1656 | chr1:230769601-230769687 | `AC[n]CTAT[n]` | CTAT, chr1:230769617-230769680 | 16 | 17 | 2 |
| D21S11 | chr21:19181969-19182105 | `TCTA[n]TCTG[n]TCTA[n]TATC[n]A[1]TCTA[2]TCCA[1]TATC[n]` | TATC, chr21:19182054-19182101 | 12 | 29 | 18 |
| D22S1045 | chr22:37140283-37140341 | `ATT[n]ACT[1]ATT[2]` | ATT, chr22:37140287-37140328 | 14 | 17 | 4 |
| D2S1338 | chr2:218014855-218014954 | `GGAA[n]GGCA[n]` | GGAA, chr2:218014871-218014922 | 13 | 23 | 11 |
| D2S441 | chr2:68011943-68011999 | `TCTA[n]` | TCTA, chr2:68011947-68011994 | 12 | 12 | 1 |
| D3S1358 | chr3:45540733-45540807 | `TATC[2]TGTC[n]TATC[n]` | TATC, chr3:45540749-45540800 | 13 | 16 | 4 |
| D5S818 | chr5:123775548-123775603 | `TCTA[n]` | TCTA, chr5:123775553-123775596 | 11 | 11 | 1 |
| D7S820 | chr7:84160200-84160281 | `A[n]CTAT[1]CAATCTGT[1]CTAT[n]_-1T>-` | CTAT, chr7:84160225-84160276 | 13 | 13 | 1 |
| D8S1179 | chr8:124894859-124894922 | `TATC[n]` | TATC, chr8:124894875-124894914 | 10 | 13 | 4 |
| FGA | chr4:154587729-154587827 | `GAAG[1]AAAG[1]GAAG[2]GAG[1]AAAG[n]AGAAA[1]AAAG[3]` | AAAG, chr4:154587748-154587803 | 14 | 22 | 9 |
| PentaD | chr21:43636185-43636282 | `A[8]GAAAG[1]AAAAG[n]A[6]` | AAAAG, chr21:43636209-43636268 | 12 | 13 | 2 |
| PentaE | chr15:96831008-96831044 | `TTTTC[n]` | TTTTC, chr15:96831012-96831036 | 5 | 5 | 1 |
| TH01 | chr11:2171082-2171120 | `TGAA[n]` | TGAA, chr11:2171086-2171113 | 7 | 7 | 1 |
| TPOX | chr2:1489647-1489692 | `TGAA[n]` | TGAA, chr2:1489651-1489682 | 8 | 8 | 1 |
| vWA | chr12:5983954-5984049 | `GGAT[n]AGAT[1]GGAT[1]AGAT[n]AGAC[n]AGAT[2]` | AGAT, chr12:5983978-5984017 | 10 | 17 | 8 |

Each varied block is the block of the same motif and copy number in the
STRNaming name of the GRCh38 reference (`data/strnaming_reference_names.json`,
e.g. FGA `CE22_GAAG[1]AAAG[1]GAAG[2]GAG[1]AAAG[14]AGAAA[1]AAAG[3]`).
`lib/fasta-export-from-slice.test.ts` checks this table, the rebuild of each
reference slice for N = `ce_ref`, and the one-motif change for N = `ce_ref` ± 1.

### Why it changed

The 2026-09 tool searched the whole slice for the longest run of any rotation
of the catalog motif or its reverse complement and replaced it with N copies.
For FGA that run was `CTTC AGGA CTTC`, 133 bp upstream of the STR, and the real
AAAG repeat stayed untouched in the flank. For 10 loci the detected copy number
differed from the reference CE allele (D21S11 12 vs 29, D2S1338 13 vs 23), so N
was not a CE allele, and six of those blocks mixed units, so the reference copy
number did not even rebuild GRCh38. The six-locus `CONSTRUCTION_MOTIF_OVERRIDES`
table that corrected the phase of some loci is gone: the STRNaming structure
fixes strand and phase for all of them. D22S1045, Penta D and Penta E are now
offered.

### Slices

The slices are served by the site itself from `public/slices/` (copies of
`slices/` in strhub-demo-data, main, commit 1c431bc) and fetched from
`/slices/<marker>__slice.fa`. jsDelivr, which served them before, refuses that
repository for being over its 50 MB limit, so loads failed with intermittent
403s. `NEXT_PUBLIC_SLICES_BASE` is no longer read.

## 2026-09: repeat counts instead of alleles

At the time N was a count of motif copies, not a CE allele designation, so
headers and CSV columns stopped saying "allele".

FASTA header, before and after:

```
>TH01_allele_9 GRCh38 chr11:2170986-2171213(+) flank=100bp
>TH01_repeats_9 motif=TGAA GRCh38 ref_window=chr11:2170986-2171213(+) flank=100bp simplified_construct
```

- `allele_9` became `repeats_9` (replaced by `CE9` in 2026-10).
- New `motif=`, the `ref_window=` label and the `simplified_construct` flag.

CSV, before and after:

```
marker,allele,build,region,flank_bp,sequence
marker,repeat_count,motif,build,ref_window,flank_bp,sequence
```

## Input

- CE allele numbers are whole numbers from 1 to 100. The maximum is a
  technical input limit of the tool.
- Decimal values such as 9.3 are rejected. They used to be truncated silently
  (9.3 gave 9 copies).
- Copy and Download are available only after a successful generation. The file
  extension follows the format that was generated.

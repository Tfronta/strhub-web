# FASTA Generator: output format change (2026-09)

The FASTA Generator writes simplified motif-based constructs: the GRCh38 5'
flank, N copies of a construction motif and the GRCh38 3' flank. N is a count of
motif copies, not a CE allele designation, so headers and CSV columns no longer
say "allele". Anything that parses the old output needs the changes below.

## FASTA header

Before:

```
>TH01_allele_9 GRCh38 chr11:2170986-2171213(+) flank=100bp
```

After:

```
>TH01_repeats_9 motif=TGAA GRCh38 ref_window=chr11:2170986-2171213(+) flank=100bp simplified_construct
```

- `allele_9` is now `repeats_9`: nine copies of the construction motif.
- New `motif=`: the construction motif that was repeated.
- The region gets a `ref_window=` label. It is the GRCh38 window the flanks were
  cut from (the reference repeat block plus the flanks). The coordinates are the
  same as before; the construct replaces the block, so its length can differ.
- New `simplified_construct` flag at the end.

## CSV (Tabular output)

Before:

```
marker,allele,build,region,flank_bp,sequence
TPOX,8,GRCh38,chr2:1489551-1489782(+),100,TAGATCGTAAGCCC…
```

After:

```
marker,repeat_count,motif,build,ref_window,flank_bp,sequence
TPOX,8,TGAA,GRCh38,chr2:1489551-1489782(+),100,TAGATCGTAAGCCC…
```

- `allele` is now `repeat_count`, and `region` is now `ref_window`.
- New `motif` column, after `repeat_count`.

## Construction motif

For most loci the construction motif is the first motif of the catalog motif,
as before. Six loci use a FASTA-only rotation that starts the reference block
the tool selects, so the reference copy count rebuilds GRCh38 exactly:

| Locus | Catalog motif | Construction motif | Reference block (GRCh38) |
|---|---|---|---|
| CSF1PO | [ATCT]n | CTAT | chr5:150076322-150076373, 13 copies |
| D1S1656 | [CCTA]n [TCTA]n | CTAT | chr1:230769617-230769680, 16 copies |
| D5S818 | [ATCT]n | TCTA | chr5:123775553-123775596, 11 copies |
| D7S820 | [TATC]n | TCTA | chr7:84160224-84160275, 13 copies |
| TH01 | [AATG]n | TGAA | chr11:2171086-2171113, 7 copies |
| TPOX | [AATG]n | TGAA | chr2:1489651-1489682, 8 copies |

Before this change D1S1656 produced no output, and the other five wrote the
block one or more bases out of phase. Catalog motifs, FSSG data, STRNaming
names and ISFG nomenclature are unchanged. The overrides live in
`CONSTRUCTION_MOTIF_OVERRIDES` (`lib/fasta-export-from-slice.ts`) and are
covered by `lib/fasta-export-from-slice.test.ts`.

## Input

- Repeat counts are whole numbers from 1 to 100. The maximum is a technical
  input limit of the tool.
- Decimal values such as 9.3 are rejected. They used to be truncated silently
  (9.3 gave 9 copies).
- Copy and Download are available only after a successful generation. The file
  extension follows the format that was generated.

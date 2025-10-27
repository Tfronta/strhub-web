// app/catalog/data.ts
// Comprehensive catalog of STR markers with allele data including isoalleles

type Allele = {
  size: number
  repeatSequence?: string
  fullSequence?: string
  isIsoallele?: boolean
  stutterPct?: number
}

type Marker = {
  name?: string
  type?: string
  alleleObjects?: Allele[]
  alleles?: Allele[]
}

export const CATALOG: Record<string, Marker> = {
  CSF1PO: {
    name: "CSF1PO",
    type: "CODIS Core",
    alleleObjects: [
      {
        size: 10,
        repeatSequence: "AGAT[10]",
        fullSequence: "AGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGAT",
        stutterPct: 8,
      },
      {
        size: 11,
        repeatSequence: "AGAT[11]",
        fullSequence: "AGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGAT",
        stutterPct: 7,
      },
      {
        size: 12,
        repeatSequence: "AGAT[12]",
        fullSequence: "AGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGAT",
      },
      {
        size: 12,
        repeatSequence: "AGAT[12]",
        fullSequence: "AGATAGATAGATAGATAGACAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGAT",
        isIsoallele: true,
      },
      {
        size: 13,
        repeatSequence: "AGAT[13]",
        fullSequence: "AGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGAT",
        stutterPct: 6,
      },
    ],
  },
  FGA: {
    name: "FGA",
    type: "CODIS Core",
    alleleObjects: [
      {
        size: 18,
        repeatSequence: "TTTC[18]",
        fullSequence: "TTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTC",
        stutterPct: 9,
      },
      {
        size: 19,
        repeatSequence: "TTTC[19]",
        fullSequence: "TTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTC",
        stutterPct: 8,
      },
      {
        size: 20,
        repeatSequence: "TTTC[20]",
        fullSequence: "TTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTC",
      },
      {
        size: 20,
        repeatSequence: "TTTC[18]TTTTTTTC",
        fullSequence: "TTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTTTTTC",
        isIsoallele: true,
      },
      {
        size: 21,
        repeatSequence: "TTTC[21]",
        fullSequence: "TTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTC",
        stutterPct: 7,
      },
    ],
  },
  D3S1358: {
    name: "D3S1358",
    type: "CODIS Core",
    alleleObjects: [
      {
        size: 14,
        repeatSequence: "TCTG[14]TCTA[3]",
        fullSequence: "TCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTATCTATCTA",
        stutterPct: 7,
      },
      {
        size: 15,
        repeatSequence: "TCTG[15]TCTA[3]",
        fullSequence: "TCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTATCTATCTA",
      },
      {
        size: 16,
        repeatSequence: "TCTG[16]TCTA[3]",
        fullSequence: "TCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTATCTATCTA",
        stutterPct: 6,
      },
      {
        size: 17,
        repeatSequence: "TCTG[17]TCTA[3]",
        fullSequence: "TCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTATCTATCTA",
      },
    ],
  },
  TH01: {
    name: "TH01",
    type: "CODIS Core",
    alleleObjects: [
      {
        size: 6,
        repeatSequence: "AATG[6]",
        fullSequence: "AATGAATGAATGAATGAATGAATG",
        stutterPct: 5,
      },
      {
        size: 7,
        repeatSequence: "AATG[7]",
        fullSequence: "AATGAATGAATGAATGAATGAATGAATG",
      },
      {
        size: 8,
        repeatSequence: "AATG[8]",
        fullSequence: "AATGAATGAATGAATGAATGAATGAATGAATG",
        stutterPct: 6,
      },
      {
        size: 9,
        repeatSequence: "AATG[9]",
        fullSequence: "AATGAATGAATGAATGAATGAATGAATGAATGAATG",
      },
      {
        size: 9.3,
        repeatSequence: "AATG[9]ATG",
        fullSequence: "AATGAATGAATGAATGAATGAATGAATGAATGAATGATG",
        isIsoallele: true,
      },
    ],
  },
  D21S11: {
    name: "D21S11",
    type: "CODIS Core",
    alleleObjects: [
      {
        size: 28,
        repeatSequence: "TCTA[11]TCTG[6]TCTA[3]TCA[3]TCTA[5]",
        fullSequence:
          "TCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTGTCTGTCTGTCTGTCTGTCTGTCTATCTATCTATCATCATCATCTATCTATCTATCTATCTA",
        stutterPct: 8,
      },
      {
        size: 29,
        repeatSequence: "TCTA[12]TCTG[6]TCTA[3]TCA[3]TCTA[5]",
        fullSequence:
          "TCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTGTCTGTCTGTCTGTCTGTCTGTCTATCTATCTATCATCATCATCTATCTATCTATCTATCTA",
      },
      {
        size: 30,
        repeatSequence: "TCTA[13]TCTG[6]TCTA[3]TCA[3]TCTA[5]",
        fullSequence:
          "TCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTGTCTGTCTGTCTGTCTGTCTGTCTATCTATCTATCATCATCATCTATCTATCTATCTATCTA",
        stutterPct: 7,
      },
      {
        size: 31,
        repeatSequence: "TCTA[14]TCTG[6]TCTA[3]TCA[3]TCTA[5]",
        fullSequence:
          "TCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTGTCTGTCTGTCTGTCTGTCTGTCTATCTATCTATCATCATCATCTATCTATCTATCTATCTA",
      },
    ],
  },
  D18S51: {
    name: "D18S51",
    type: "CODIS Core",
    alleleObjects: [
      {
        size: 12,
        repeatSequence: "AGAA[12]",
        fullSequence: "AGAAAGAAAGAAAGAAAGAAAGAAAGAAAGAAAGAAAGAAAGAAAGAAAGAA",
        stutterPct: 7,
      },
      {
        size: 13,
        repeatSequence: "AGAA[13]",
        fullSequence: "AGAAAGAAAGAAAGAAAGAAAGAAAGAAAGAAAGAAAGAAAGAAAGAAAGAAAGAA",
      },
      {
        size: 14,
        repeatSequence: "AGAA[14]",
        fullSequence: "AGAAAGAAAGAAAGAAAGAAAGAAAGAAAGAAAGAAAGAAAGAAAGAAAGAAAGAAAGAA",
        stutterPct: 6,
      },
      {
        size: 15,
        repeatSequence: "AGAA[15]",
        fullSequence: "AGAAAGAAAGAAAGAAAGAAAGAAAGAAAGAAAGAAAGAAAGAAAGAAAGAAAGAAAGAAAGAA",
      },
    ],
  },
  D5S818: {
    name: "D5S818",
    type: "CODIS Core",
    alleleObjects: [
      {
        size: 9,
        repeatSequence: "AGAT[9]",
        fullSequence: "AGATAGATAGATAGATAGATAGATAGATAGATAGAT",
        stutterPct: 6,
      },
      {
        size: 10,
        repeatSequence: "AGAT[10]",
        fullSequence: "AGATAGATAGATAGATAGATAGATAGATAGATAGATAGAT",
      },
      {
        size: 11,
        repeatSequence: "AGAT[11]",
        fullSequence: "AGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGAT",
        stutterPct: 7,
      },
      {
        size: 12,
        repeatSequence: "AGAT[12]",
        fullSequence: "AGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGAT",
      },
      {
        size: 13,
        repeatSequence: "AGAT[13]",
        fullSequence: "AGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGAT",
        stutterPct: 8,
      },
    ],
  },
  D13S317: {
    name: "D13S317",
    type: "CODIS Core",
    alleleObjects: [
      {
        size: 8,
        repeatSequence: "TATC[8]",
        fullSequence: "TATCTATCTATCTATCTATCTATCTATCTATC",
        stutterPct: 5,
      },
      {
        size: 9,
        repeatSequence: "TATC[9]",
        fullSequence: "TATCTATCTATCTATCTATCTATCTATCTATCTATC",
      },
      {
        size: 10,
        repeatSequence: "TATC[10]",
        fullSequence: "TATCTATCTATCTATCTATCTATCTATCTATCTATCTATC",
        stutterPct: 6,
      },
      {
        size: 11,
        repeatSequence: "TATC[11]",
        fullSequence: "TATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATC",
      },
      {
        size: 12,
        repeatSequence: "TATC[12]",
        fullSequence: "TATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATC",
        stutterPct: 7,
      },
    ],
  },
  D7S820: {
    name: "D7S820",
    type: "CODIS Core",
    alleleObjects: [
      {
        size: 8,
        repeatSequence: "GATA[8]",
        fullSequence: "GATAGATAGATAGATAGATAGATAGATAGATAGATA",
        stutterPct: 6,
      },
      {
        size: 9,
        repeatSequence: "GATA[9]",
        fullSequence: "GATAGATAGATAGATAGATAGATAGATAGATAGATAGATA",
      },
      {
        size: 10,
        repeatSequence: "GATA[10]",
        fullSequence: "GATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATA",
        stutterPct: 7,
      },
      {
        size: 11,
        repeatSequence: "GATA[11]",
        fullSequence: "GATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATA",
      },
      {
        size: 12,
        repeatSequence: "GATA[12]",
        fullSequence: "GATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATA",
        stutterPct: 8,
      },
    ],
  },
  D16S539: {
    name: "D16S539",
    type: "CODIS Core",
    alleleObjects: [
      {
        size: 9,
        repeatSequence: "GATA[9]",
        fullSequence: "GATAGATAGATAGATAGATAGATAGATAGATAGATAGATA",
        stutterPct: 6,
      },
      {
        size: 10,
        repeatSequence: "GATA[10]",
        fullSequence: "GATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATA",
      },
      {
        size: 11,
        repeatSequence: "GATA[11]",
        fullSequence: "GATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATA",
        stutterPct: 7,
      },
      {
        size: 12,
        repeatSequence: "GATA[12]",
        fullSequence: "GATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATA",
      },
      {
        size: 13,
        repeatSequence: "GATA[13]",
        fullSequence: "GATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATA",
        stutterPct: 8,
      },
    ],
  },
  D2S1338: {
    name: "D2S1338",
    type: "CODIS Core",
    alleleObjects: [
      {
        size: 17,
        repeatSequence: "TGCC[8]TTCC[9]",
        fullSequence: "TGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTTCCTTCCTTCCTTCCTTCCTTCCTTCCTTCC",
        stutterPct: 8,
      },
      {
        size: 18,
        repeatSequence: "TGCC[8]TTCC[10]",
        fullSequence: "TGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTTCCTTCCTTCCTTCCTTCCTTCCTTCCTTCCTTCC",
      },
      {
        size: 19,
        repeatSequence: "TGCC[9]TTCC[10]",
        fullSequence: "TGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTTCCTTCCTTCCTTCCTTCCTTCCTTCCTTCCTTCC",
        stutterPct: 7,
      },
      {
        size: 20,
        repeatSequence: "TGCC[10]TTCC[10]",
        fullSequence: "TGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTTCCTTCCTTCCTTCCTTCCTTCCTTCCTTCCTTCC",
      },
    ],
  },
  D19S433: {
    name: "D19S433",
    type: "CODIS Core",
    alleleObjects: [
      {
        size: 12,
        repeatSequence: "AAGG[12]",
        fullSequence: "AAGGAAGGAAGGAAGGAAGGAAGGAAGGAAGGAAGGAAGGAAGGAAGG",
        stutterPct: 7,
      },
      {
        size: 13,
        repeatSequence: "AAGG[13]",
        fullSequence: "AAGGAAGGAAGGAAGGAAGGAAGGAAGGAAGGAAGGAAGGAAGGAAGGAAGG",
      },
      {
        size: 14,
        repeatSequence: "AAGG[14]",
        fullSequence: "AAGGAAGGAAGGAAGGAAGGAAGGAAGGAAGGAAGGAAGGAAGGAAGGAAGGAAGG",
        stutterPct: 6,
      },
      {
        size: 15,
        repeatSequence: "AAGG[15]",
        fullSequence: "AAGGAAGGAAGGAAGGAAGGAAGGAAGGAAGGAAGGAAGGAAGGAAGGAAGGAAGGAAGG",
      },
    ],
  },
  vWA: {
    name: "vWA",
    type: "CODIS Core",
    alleleObjects: [
      {
        size: 14,
        repeatSequence: "TCTG[11]TCTA[3]",
        fullSequence: "TCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTATCTATCTA",
        stutterPct: 7,
      },
      {
        size: 15,
        repeatSequence: "TCTG[12]TCTA[3]",
        fullSequence: "TCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTATCTATCTA",
      },
      {
        size: 16,
        repeatSequence: "TCTG[13]TCTA[3]",
        fullSequence: "TCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTATCTATCTA",
        stutterPct: 6,
      },
      {
        size: 17,
        repeatSequence: "TCTG[14]TCTA[3]",
        fullSequence: "TCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTATCTATCTA",
      },
    ],
  },
  TPOX: {
    name: "TPOX",
    type: "CODIS Core",
    alleleObjects: [
      {
        size: 8,
        repeatSequence: "AATG[8]",
        fullSequence: "AATGAATGAATGAATGAATGAATGAATGAATG",
        stutterPct: 5,
      },
      {
        size: 9,
        repeatSequence: "AATG[9]",
        fullSequence: "AATGAATGAATGAATGAATGAATGAATGAATGAATG",
      },
      {
        size: 10,
        repeatSequence: "AATG[10]",
        fullSequence: "AATGAATGAATGAATGAATGAATGAATGAATGAATGAATG",
        stutterPct: 6,
      },
      {
        size: 11,
        repeatSequence: "AATG[11]",
        fullSequence: "AATGAATGAATGAATGAATGAATGAATGAATGAATGAATGAATG",
      },
      {
        size: 12,
        repeatSequence: "AATG[12]",
        fullSequence: "AATGAATGAATGAATGAATGAATGAATGAATGAATGAATGAATGAATG",
        stutterPct: 7,
      },
    ],
  },
  D8S1179: {
    name: "D8S1179",
    type: "CODIS Core",
    alleleObjects: [
      {
        size: 10,
        repeatSequence: "TCTA[10]TCTG[3]",
        fullSequence: "TCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTGTCTGTCTG",
        stutterPct: 7,
      },
      {
        size: 11,
        repeatSequence: "TCTA[11]TCTG[3]",
        fullSequence: "TCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTGTCTGTCTG",
      },
      {
        size: 12,
        repeatSequence: "TCTA[12]TCTG[3]",
        fullSequence: "TCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTGTCTGTCTG",
        stutterPct: 6,
      },
      {
        size: 13,
        repeatSequence: "TCTA[13]TCTG[3]",
        fullSequence: "TCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTGTCTGTCTG",
      },
    ],
  },
}

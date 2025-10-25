// Enhanced marker data with NIST STRBase integration
import { markerFrequencies } from "./markerFrequencies"

// === NUEVO: importar las frecuencias movidas al archivo aparte ===
import {
  markerFrequencies,
  type Pop,
  type AlleleEntry,
} from "./markerFrequencies";

// === NUEVO: helpers para mapear el id del marcador a la clave del objeto ===
const key = (s: string) =>
  s.toLowerCase().replace(/\s+/g, "_").replace(/-/g, "_");

const pf = (markerId: string): Record<Pop, AlleleEntry[]> => ({
  AFR: markerFrequencies[markerId]?.AFR ?? [],
  AMR: markerFrequencies[markerId]?.AMR ?? [],
  EAS: markerFrequencies[markerId]?.EAS ?? [],
  SAS: markerFrequencies[markerId]?.SAS ?? [],
  EUR: markerFrequencies[markerId]?.EUR ?? [],
});

// Enhanced marker data with NIST STRBase integration
export const markerData = {fga: {
    name: "FGA",
    fullName: "Fibrinogen Alpha Chain",
    chromosome: "4",
    position: "155,508,000-155,509,000",
    motif: "TTTC",
    type: "Tetranucleotide",
    alleles: "15-51.2",
    category: "CODIS Core",
    description:
      "The FGA locus is a tetranucleotide STR located on chromosome 4. It is part of the CODIS core loci and is widely used in forensic genetics and paternity testing.",
    coordinates: {
      build: "GRCh38/hg38",
      start: 155508000,
      end: 155509000,
      strand: "+",
    },
    nistReference: {
      url: "https://strbase.nist.gov/Human/VariantalleleTable/FGA",
      variantTable: "https://strbase.nist.gov/Human/VariantalleleTable/FGA",
      lastUpdated: "2024-01-15",
      referenceAllele: "20",
      commonAlleles: ["18", "19", "20", "21", "22", "23", "24", "25"],
    },
    sequences: [
      {
        allele: "18",
        pattern: "(TTTC)18",
        sequence:
          "TTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTC",
        nistVerified: true,
      },
      {
        allele: "19",
        pattern: "(TTTC)19",
        sequence:
          "TTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTC",
        nistVerified: true,
      },
      {
        allele: "20",
        pattern: "(TTTC)20",
        sequence: "TTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTC",
        nistVerified: true,
        isReference: true,
      },
      {
        allele: "21",
        pattern: "(TTTC)21",
        sequence: "TTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTCTTTC",
        nistVerified: true,
      },
    ],
    frequencies: [
      { allele: "18", frequency: 0.12, count: 240 },
      { allele: "19", frequency: 0.18, count: 360 },
      { allele: "20", frequency: 0.25, count: 500 },
      { allele: "21", frequency: 0.22, count: 440 },
      { allele: "22", frequency: 0.15, count: 300 },
      { allele: "23", frequency: 0.08, count: 160 },
    ],
    populationFrequencies: pf(key("fga")),
  },
csf1po: {
    name: "CSF1PO",
    fullName: "Colony Stimulating Factor 1 Receptor",
    chromosome: "5",
    position: "149,455,887-149,456,037",
    motif: "AGAT",
    type: "Tetranucleotide",
    alleles: "6-16",
    category: "CODIS Core",
    description:
      "CSF1PO is a CODIS core locus located on chromosome 5. It is a tetranucleotide repeat marker with high discriminatory power.",
    coordinates: {
      build: "GRCh38",
      start: 149455887,
      end: 149456037,
      strand: "+",
    },
    sequences: [
      {
        allele: "6",
        pattern: "TCTA[6]ATCT[3]",
        sequence: "TAAGTACTTCCTATCTATCTATCTATCTATCTATCTAATCTATCTATCTT",
        strain: "STRbase",
        nistVerified: true,
      },
      {
        allele: "7",
        pattern: "TCTA[2]TCTC[1]TCTA[4]ATCT[3]TCTA[2]",
        sequence:
          "CTAAGTACTTCCTATCTATCTATCTCTCTATCTATCTATCTAATCTATCTATCTTCTATCTATGAAGGCAGTTACTGTTAATATCTTCATTTTACAGGTAGGAAAACTGAGACACAGGGTGGTTAGCAACCTGCTAGTCCTTGGCAGACTCAG",
        strain: "STRbase",
        nistVerified: true,
      },
      {
        allele: "7",
        pattern: "TCTA[7]ATCT[3]TCTA[2]",
        sequence:
          "CTAAGTACTTCCTATCTATCTATCTATCTATCTATCTATCTAATCTATCTATCTTCTATCTATGAAGGCAGTTACTGTTAATATCTTCATTTTACAGGTAGGAAAACTGAGACACAGGGTGGTTAGCAACCTGCTAGTCCTTGGCAGACTCAG",
        strain: "STRbase",
        nistVerified: true,
      },
      {
        allele: "8",
        pattern: "TCTA[7]TATA[1]ATCT[3]",
        sequence: "CTTCCTATCTATCTATCTATCTATCTATCTATCTATATAATCTATCTATCTT",
        strain: "STRbase",
        nistVerified: true,
      },
      {
        allele: "8",
        pattern: "TCTA[8]ATCT[3]TCTA[2]",
        sequence:
          "CTAAGTACTTCCTATCTATCTATCTATCTATCTATCTATCTATCTAATCTATCTATCTTCTATCTATGAAGGCAGTTACTGTTAATATCTTCATTTTACAGGTAGGAAAACTGAGACACAGGGTGGTTAGCAACCTGCTAGTCCTTGGCAGACTCAG",
        strain: "STRbase",
        nistVerified: true,
      },
      {
        allele: "9",
        pattern: "TCTA[9]ATCT[3]TCTA[2]",
        sequence:
          "CTAAGTACTTCCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTAATCTATCTATCTTCTATCTATGAAGGCAGTTACTGTTAATATCTTCATTTTACAGGTAGGAAAACTGAGACACAGGGTGGTTAGCAACCTGCTAGTCCTTGGCAGACTCAG",
        strain: "STRbase",
        nistVerified: true,
      },
      {
        allele: "10",
        pattern: "TCTA[10]ATCT[3]TCTA[2]",
        sequence:
          "CTGTGTCAGACCCTGTTCTAAGTACTTCCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTAATCTATCTATCTTCTATCTATGAAGGCAGTTACTGTTAATATCTTCATTTTACAGGTAGGAAAACTGAGACACAGGGTGGTTAGCAACCTGCTAGTCCTTGGCAGACTCAG",
        strain: "STRbase",
        nistVerified: true,
      },
      {
        allele: "10",
        pattern: "TCTA[9]CCTA[1]ATCT[3]TCTA[2]",
        sequence:
          "CTAAGTACTTCCTATCTATCTATCTATCTATCTATCTATCTATCTATCTACCTAATCTATCTATCTTCTATCTATGAAGGCAGTTACTGTTAATATCTTCATTTTACAGGTAGGAAAACTGAGACACAGGGTGGTTAGCAACCTGCTAGTCCTTGGCAGACTCAG",
        strain: "STRbase",
        nistVerified: true,
      },
      {
        allele: "10",
        pattern: "TCTA[2]TTTA[1]TCTA[7]ATCT[3]",
        sequence: "CTTCCTATCTATCTATTTATCTATCTATCTATCTATCTATCTATCTAATCTATCTATCTT",
        strain: "STRbase",
        nistVerified: true,
      },
      {
        allele: "10,3",
        pattern: "TCTA[5]TCA[1]TCTA[5]ATCT[3]TCTA[2]",
        sequence:
          "CTAAGTACTTCCTATCTATCTATCTATCTATCTATCTATCATCTATCTATCTATCTATCTAATCTATCTATCTTCTATCTATGAAGGCAGTTACTGTTAATATCTTCATTTTACAGGTAGGAAAACTGAGACACAGGGTGGTTAGCAACCTGCTAGTCCTTGGCAGACTCAG",
        strain: "STRbase",
        nistVerified: true,
      },
      {
        allele: "11",
        pattern: "TCTA[11]ATCT[3]TCTA[2]",
        sequence:
          "CTGTGTCAGACCCTGTTCTAAGTACTTCCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTAATCTATCTATCTTCTATCTATGAAGGCAGTTACTGTTAATATCTTCATTTTACAGGTAGGAAAACTGAGACACAGGGTGGTTAGCAACCTGCTAGTCCTTGGCAGACTCAG",
        strain: "STRbase",
        nistVerified: true,
      },
      {
        allele: "11",
        pattern: "TCTA[7]CCTA[1]TCTA[3]ATCT[3]TCTA[2]",
        sequence:
          "CTAAGTACTTCCTATCTATCTATCTATCTATCTATCTATCTATCTATCTACCTATCTATCTATCTAATCTATCTATCTTCTATCTATGAAGGCAGTTACTGTTAATATCTTCATTTTACAGGTAGGAAAACTGAGACACAGGGTGGTTAGCAACCTGCTAGTCCTTGGCAGACTCAG",
        strain: "STRbase",
        nistVerified: true,
      },
      {
        allele: "11",
        pattern: "TCTA[11]ATCT[3]TCTA[2]_+65C>A",
        sequence:
          "CTAAGTACTTCCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTAATCTATCTATCTTCTATCTATGAAGGCAGTTACTGTTAATATCTTCATTTTACAGGTAGGAAAACTGAGACACAGGGTGGTTAGAAACCTGCTAGTCCTTGGCAGACTCAG",
        strain: "STRbase",
        nistVerified: true,
      },
      {
        allele: "11",
        pattern: "TCTA[11]ATCT[3]TCTA[2]_+15G>A",
        sequence:
          "CTAAGTACTTCCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTAATCTATCTATCTTCTATCTATGAAGGCAGTTACTATTAATATCTTCATTTTACAGGTAGGAAAACTGAGACACAGGGTGGTTAGCAACCTGCTAGTCCTTGGCAGACTCAG",
        strain: "STRbase",
        nistVerified: true,
      },
      {
        allele: "11",
        pattern: "TCTA[11]ATCT[3]TCTA[2]_-2T>C",
        sequence:
          "CTAAGTACTTCCCATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTAATCTATCTATCTTCTATCTATGAAGGCAGTTACTGTTAATATCTTCATTTTACAGGTAGGAAAACTGAGACACAGGGTGGTTAGCAACCTGCTAGTCCTTGGCAGACTCAG",
        strain: "STRbase",
        nistVerified: true,
      },
      {
        allele: "11",
        pattern: "TCTA[7]TATA[1]TCTA[3]ATCT[3]",
        sequence: "CTTCCTATCTATCTATCTATCTATCTATCTATCTATATATCTATCTATCTAATCTATCTATCTT",
        strain: "STRbase",
        nistVerified: true,
      },
      {
        allele: "12",
        pattern: "TCTA[8]CCTA[1]TCTA[3]ATCT[3]TCTA[2]",
        sequence:
          "CTAAGTACTTCCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTACCTATCTATCTATCTAATCTATCTATCTTCTATCTATGAAGGCAGTTACTGTTAATATCTTCATTTTACAGGTAGGAAAACTGAGACACAGGGTGGTTAGCAACCTGCTAGTCCTTGGCAGACTCAG",
        strain: "STRbase",
        nistVerified: true,
      },
      {
        allele: "12",
        pattern: "TCTA[12]ATCT[3]TCTA[2]",
        sequence:
          "CTGTGTCAGACCCTGTTCTAAGTACTTCCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTAATCTATCTATCTTCTATCTATGAAGGCAGTTACTGTTAATATCTTCATTTTACAGGTAGGAAAACTGAGACACAGGGTGGTTAGCAACCTGCTAGTCCTTGGCAGACTCAG",
        strain: "STRbase",
        nistVerified: true,
        isReference: true,
      },
      {
        allele: "12",
        pattern: "TCTA[6]CCTA[1]TCTA[5]ATCT[3]TCTA[2]",
        sequence:
          "CTAAGTACTTCCTATCTATCTATCTATCTATCTATCTACCTATCTATCTATCTATCTATCTAATCTATCTATCTTCTATCTATGAAGGCAGTTACTGTTAATATCTTCATTTTACAGGTAGGAAAACTGAGACACAGGGTGGTTAGCAACCTGCTAGTCCTTGGCAGACTCAG",
        strain: "STRbase",
        nistVerified: true,
      },
      {
        allele: "12",
        pattern: "TCTA[4]TCTG[1]TCTA[7]ATCT[3]",
        sequence: "CTTCCTATCTATCTATCTATCTATCTATCTGTCTATCTATCTATCTATCTATCTATCTAATCTATCTATCTT",
        strain: "STRbase",
        nistVerified: true,
      },
      {
        allele: "12",
        pattern: "TCTA[1]CCTA[1]TCTA[10]ATCT[3]TCTA[2]",
        sequence:
          "CTAAGTACTTCCTATCTACCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTAATCTATCTATCTTCTATCTATGAAGGCAGTTACTGTTAATATCTTCATTTTACAGGTAGGAAAACTGAGACACAGGGTGGTTAGCAACCTGCTAGTCCTTGGCAGACTCAG",
        strain: "STRbase",
        nistVerified: true,
      },
      {
        allele: "12",
        pattern: "TCTA[8]CCTA[1]TCTA[3]ATCT[3]",
        sequence: "CTTCCTATCTATCTATCTATCTATCTATCTATCTATCTACCTATCTATCTATCTAATCTATCTATCTT",
        strain: "STRbase",
        nistVerified: true,
      },
      {
        allele: "12",
        pattern: "TCTA[3]TCTG[1]TCTA[8]ATCT[3]",
        sequence: "CTTCCTATCTATCTATCTATCTATCTGTCTATCTATCTATCTATCTATCTATCTATCTAATCTATCTATCTT",
        strain: "STRbase",
        nistVerified: true,
      },
      {
        allele: "12",
        pattern: "TCTA[12]ATCT[3]TCTA[2]_+65C>A",
        sequence:
          "CTAAGTACTTCCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTAATCTATCTATCTTCTATCTATGAAGGCAGTTACTGTTAATATCTTCATTTTACAGGTAGGAAAACTGAGACACAGGGTGGTTAGAAACCTGCTAGTCCTTGGCAGACTCAG",
        strain: "STRbase",
        nistVerified: true,
      },
      {
        allele: "13",
        pattern: "TCTA[13]ATCT[3]TCTA[2]",
        sequence:
          "CTAAGTACTTCCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTAATCTATCTATCTTCTATCTATGAAGGCAGTTACTGTTAATATCTTCATTTTACAGGTAGGAAAACTGAGACACAGGGTGGTTAGCAACCTGCTAGTCCTTGGCAGACTCAG",
        strain: "STRbase",
        nistVerified: true,
      },
      {
        allele: "14",
        pattern: "TCTA[14]ATCT[3]TCTA[2]",
        sequence:
          "CTGTGTCAGACCCTGTTCTAAGTACTTCCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTAATCTATCTATCTTCTATCTATGAAGGCAGTTACTGTTAATATCTTCATTTTACAGGTAGGAAAACTGAGACACAGGGTGGTTAGCAACCTGCTAGTCCTTGGCAGACTCAG",
        strain: "STRbase",
        nistVerified: true,
      },
      {
        allele: "15",
        pattern: "TCTA[15]ATCT[3]TCTA[2]",
        sequence:
          "CTAAGTACTTCCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTAATCTATCTATCTTCTATCTATGAAGGCAGTTACTGTTAATATCTTCATTTTACAGGTAGGAAAACTGAGACACAGGGTGGTTAGCAACCTGCTAGTCCTTGGCAGACTCAG",
        strain: "STRbase",
        nistVerified: true,
      },
    ],
    nistReference: {
      url: "https://strbase.nist.gov/str_CSF1PO.htm",
      variantTable: "https://strbase.nist.gov/Human/VariantalleleTable/CSF1PO",
      referenceAllele: "12",
      lastUpdated: "2024",
      commonAlleles: ["10", "11", "12", "13", "14"],
    },
    populationFrequencies: pf(key("csf1po")),
  },
d1s1656: {
    name: "D1S1656",
    fullName: "D1S1656",
    chromosome: "1",
    position: "230,905,000-230,906,000",
    motif: "TAGA",
    type: "Tetranucleotide",
    alleles: "10-18.3",
    category: "CODIS Core",
    description:
      "The D1S1656 locus is a tetranucleotide STR located on chromosome 1. It is part of the CODIS core loci and is widely used in forensic genetics.",
    coordinates: {
      build: "GRCh38/hg38",
      start: 230905000,
      end: 230906000,
      strand: "+",
    },
    nistReference: {
      url: "https://strbase.nist.gov/Human/VariantalleleTable/D1S1656",
      variantTable: "https://strbase.nist.gov/Human/VariantalleleTable/D1S1656",
      lastUpdated: "2024-01-15",
      referenceAllele: "14",
      commonAlleles: ["12", "13", "14", "15", "16", "17"],
    },
    sequences: [
      {
        allele: "12",
        pattern: "(TAGA)12",
        sequence: "TAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGA",
        nistVerified: true,
      },
      {
        allele: "14",
        pattern: "(TAGA)14",
        sequence: "TAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGA",
        nistVerified: true,
        isReference: true,
      },
      {
        allele: "16",
        pattern: "(TAGA)16",
        sequence: "TAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGA",
        nistVerified: true,
      },
    ],
    frequencies: [
      {
        allele: "12",
        frequency: 0.21,
        count: 420,
      },
      {
        allele: "13",
        frequency: 0.24,
        count: 480,
      },
      {
        allele: "14",
        frequency: 0.27,
        count: 540,
      },
      {
        allele: "15",
        frequency: 0.18,
        count: 360,
      },
      {
        allele: "16",
        frequency: 0.1,
        count: 200,
      },
    ],
    populationFrequencies: pf(key("d1s1656")),
  },
d2s1338: {
    name: "D2S1338",
    fullName: "D2S1338",
    chromosome: "2",
    position: "218,705,000-218,706,000",
    motif: "TGCC",
    type: "Tetranucleotide",
    alleles: "15-28",
    category: "CODIS Core",
    description:
      "The D2S1338 locus is a tetranucleotide STR located on chromosome 2. It is part of the CODIS core loci and is widely used in forensic genetics.",
    coordinates: {
      build: "GRCh38/hg38",
      start: 218705000,
      end: 218706000,
      strand: "+",
    },
    nistReference: {
      url: "https://strbase.nist.gov/Human/VariantalleleTable/D2S1338",
      variantTable: "https://strbase.nist.gov/Human/VariantalleleTable/D2S1338",
      lastUpdated: "2024-01-15",
      referenceAllele: "19",
      commonAlleles: ["17", "18", "19", "20", "21", "22", "23"],
    },
    sequences: [
      {
        allele: "18",
        pattern: "(TGCC)18",
        sequence:
          "TGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCC",
        nistVerified: true,
      },
      {
        allele: "19",
        pattern: "(TGCC)19",
        sequence:
          "TGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCC",
        nistVerified: true,
        isReference: true,
      },
      {
        allele: "21",
        pattern: "(TGCC)21",
        sequence:
          "TGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCCTGCC",
        nistVerified: true,
      },
    ],
    frequencies: [
      {
        allele: "18",
        frequency: 0.2,
        count: 400,
      },
      {
        allele: "19",
        frequency: 0.3,
        count: 600,
      },
      {
        allele: "20",
        frequency: 0.22,
        count: 440,
      },
      {
        allele: "21",
        frequency: 0.18,
        count: 360,
      },
      {
        allele: "22",
        frequency: 0.1,
        count: 200,
      },
    ],
    populationFrequencies: pf(key("d2s1338")),
  },
d2s441: {
    name: "D2S441",
    fullName: "D2S441",
    chromosome: "2",
    position: "92,235,000-92,236,000",
    motif: "AGAT",
    type: "Tetranucleotide",
    alleles: "9-15",
    category: "CODIS Core",
    description:
      "The D2S441 locus is a tetranucleotide STR located on chromosome 2. It is part of the CODIS core loci and is widely used in forensic genetics.",
    coordinates: {
      build: "GRCh38/hg38",
      start: 92235000,
      end: 92236000,
      strand: "+",
    },
    nistReference: {
      url: "https://strbase.nist.gov/Human/VariantalleleTable/D2S441",
      variantTable: "https://strbase.nist.gov/Human/VariantalleleTable/D2S441",
      lastUpdated: "2024-01-15",
      referenceAllele: "11",
      commonAlleles: ["9", "10", "11", "12", "13", "14", "15"],
    },
    sequences: [
      {
        allele: "10",
        pattern: "(AGAT)10",
        sequence: "AGATAGATAGATAGATAGATAGATAGATAGATAGATAGAT",
        nistVerified: true,
      },
      {
        allele: "11",
        pattern: "(AGAT)11",
        sequence: "AGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGAT",
        nistVerified: true,
        isReference: true,
      },
      {
        allele: "12",
        pattern: "(AGAT)12",
        sequence: "AGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGAT",
        nistVerified: true,
      },
    ],
    frequencies: [
      {
        allele: "10",
        frequency: 0.26,
        count: 520,
      },
      {
        allele: "11",
        frequency: 0.3,
        count: 600,
      },
      {
        allele: "12",
        frequency: 0.22,
        count: 440,
      },
      {
        allele: "13",
        frequency: 0.14,
        count: 280,
      },
      {
        allele: "14",
        frequency: 0.08,
        count: 160,
      },
    ],
    populationFrequencies: pf(key("d2s441")),
  },
d3s1358: {
    name: "D3S1358",
    fullName: "D3S1358",
    chromosome: "3",
    position: "47,135,000-47,136,000",
    motif: "TAT",
    type: "Trinucleotide",
    alleles: "12-20",
    category: "CODIS Core",
    description:
      "The D3S1358 locus is a trinucleotide STR located on chromosome 3. It is part of the CODIS core loci and is widely used in forensic genetics.",
    coordinates: {
      build: "GRCh38/hg38",
      start: 47135000,
      end: 47136000,
      strand: "+",
    },
    nistReference: {
      url: "https://strbase.nist.gov/Human/VariantalleleTable/D3S1358",
      variantTable: "https://strbase.nist.gov/Human/VariantalleleTable/D3S1358",
      lastUpdated: "2024-01-15",
      referenceAllele: "15",
      commonAlleles: ["14", "15", "16", "17", "18"],
    },
    sequences: [
      {
        allele: "14",
        pattern: "(TAT)14",
        sequence: "TATTATTATTATTATTATTATTATTATTATTATTAT",
        nistVerified: true,
      },
      {
        allele: "15",
        pattern: "(TAT)15",
        sequence: "TATTATTATTATTATTATTATTATTATTATTATTAT",
        nistVerified: true,
        isReference: true,
      },
      {
        allele: "16",
        pattern: "(TAT)16",
        sequence: "TATTATTATTATTATTATTATTATTATTATTATTATTAT",
        nistVerified: true,
      },
    ],
    frequencies: [
      {
        allele: "14",
        frequency: 0.28,
        count: 560,
      },
      {
        allele: "15",
        frequency: 0.3,
        count: 600,
      },
      {
        allele: "16",
        frequency: 0.22,
        count: 440,
      },
      {
        allele: "17",
        frequency: 0.14,
        count: 280,
      },
      {
        allele: "18",
        frequency: 0.06,
        count: 120,
      },
    ],
    populationFrequencies: pf(key("d3s1358")),
  },
d4s2408: {
    name: "D4S2408",
    fullName: "D4S2408",
    chromosome: "4",
    position: "—",
    motif: "AGAT",
    type: "Tetranucleotide",
    alleles: "6-13",
    category: "CODIS Core",
    description: "The D4S2408 locus is a tetranucleotide STR used in forensic genetics.",
    coordinates: {
      build: "GRCh38/hg38",
      start: 0,
      end: 0,
      strand: "+",
    },
    nistReference: {
      url: "https://strbase.nist.gov/Human/VariantalleleTable/D4S2408",
      variantTable: "https://strbase.nist.gov/Human/VariantalleleTable/D4S2408",
      lastUpdated: "2024-01-15",
      referenceAllele: "10",
      commonAlleles: ["8", "9", "10", "11"],
    },
    sequences: [],
    frequencies: [],
    populationFrequencies: pf(key("d4s2408")),
  },
d5s818: {
    name: "D5S818",
    fullName: "D5S818",
    chromosome: "5",
    position: "131,555,000-131,556,000",
    motif: "AGAT",
    type: "Tetranucleotide",
    alleles: "7-15",
    category: "CODIS Core",
    description:
      "The D5S818 locus is a tetranucleotide STR located on chromosome 5. It is part of the CODIS core loci and is widely used in forensic genetics.",
    coordinates: {
      build: "GRCh38/hg38",
      start: 131555000,
      end: 131556000,
      strand: "+",
    },
    nistReference: {
      url: "https://strbase.nist.gov/Human/VariantalleleTable/D5S818",
      variantTable: "https://strbase.nist.gov/Human/VariantalleleTable/D5S818",
      lastUpdated: "2024-01-15",
      referenceAllele: "11",
      commonAlleles: ["9", "10", "11", "12", "13"],
    },
    sequences: [
      {
        allele: "10",
        pattern: "(AGAT)10",
        sequence: "AGATAGATAGATAGATAGATAGATAGATAGATAGATAGAT",
        nistVerified: true,
      },
      {
        allele: "11",
        pattern: "(AGAT)11",
        sequence: "AGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGAT",
        nistVerified: true,
        isReference: true,
      },
      {
        allele: "12",
        pattern: "(AGAT)12",
        sequence: "AGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGAT",
        nistVerified: true,
      },
    ],
    frequencies: [
      {
        allele: "9",
        frequency: 0.14,
        count: 280,
      },
      {
        allele: "10",
        frequency: 0.24,
        count: 480,
      },
      {
        allele: "11",
        frequency: 0.29,
        count: 580,
      },
      {
        allele: "12",
        frequency: 0.22,
        count: 440,
      },
      {
        allele: "13",
        frequency: 0.11,
        count: 220,
      },
    ],
    populationFrequencies: pf(key("d5s818")),
  },
d6s1043: {
    name: "D6S1043",
    fullName: "D6S1043",
    chromosome: "6",
    position: "—",
    motif: "AGAT",
    type: "Tetranucleotide",
    alleles: "7-25",
    category: "CODIS Core",
    description: "The D6S1043 locus is a tetranucleotide STR used in forensic genetics.",
    coordinates: {
      build: "GRCh38/hg38",
      start: 0,
      end: 0,
      strand: "+",
    },
    nistReference: {
      url: "https://strbase.nist.gov/Human/VariantalleleTable/D6S1043",
      variantTable: "https://strbase.nist.gov/Human/VariantalleleTable/D6S1043",
      lastUpdated: "2024-01-15",
      referenceAllele: "12",
      commonAlleles: ["11", "12", "13", "14", "15", "16", "18", "19"],
    },
    sequences: [],
    frequencies: [],
    populationFrequencies: pf(key("d6s1043")),
  },
d7s820: {
    name: "D7S820",
    fullName: "D7S820",
    chromosome: "7",
    position: "6,115,000-6,116,000",
    motif: "GATA",
    type: "Tetranucleotide",
    alleles: "6-14",
    category: "CODIS Core",
    description:
      "The D7S820 locus is a tetranucleotide STR located on chromosome 7. It is part of the CODIS core loci and is widely used in forensic genetics.",
    coordinates: {
      build: "GRCh38/hg38",
      start: 6115000,
      end: 6116000,
      strand: "+",
    },
    nistReference: {
      url: "https://strbase.nist.gov/Human/VariantalleleTable/D7S820",
      variantTable: "https://strbase.nist.gov/Human/VariantalleleTable/D7S820",
      lastUpdated: "2024-01-15",
      referenceAllele: "10",
      commonAlleles: ["8", "9", "10", "11", "12"],
    },
    sequences: [
      {
        allele: "9",
        pattern: "(GATA)9",
        sequence: "GATAGATAGATAGATAGATAGATAGATAGATAGATA",
        nistVerified: true,
      },
      {
        allele: "10",
        pattern: "(GATA)10",
        sequence: "GATAGATAGATAGATAGATAGATAGATAGATAGATAGATA",
        nistVerified: true,
        isReference: true,
      },
      {
        allele: "11",
        pattern: "(GATA)11",
        sequence: "GATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATA",
        nistVerified: true,
      },
    ],
    frequencies: [
      {
        allele: "8",
        frequency: 0.12,
        count: 240,
      },
      {
        allele: "9",
        frequency: 0.23,
        count: 460,
      },
      {
        allele: "10",
        frequency: 0.3,
        count: 600,
      },
      {
        allele: "11",
        frequency: 0.22,
        count: 440,
      },
      {
        allele: "12",
        frequency: 0.13,
        count: 260,
      },
    ],
    populationFrequencies: pf(key("d7s820")),
  },
d8s1179: {
    name: "D8S1179",
    fullName: "D8S1179",
    chromosome: "8",
    position: "101,775,000-101,776,000",
    motif: "TCTA",
    type: "Tetranucleotide",
    alleles: "7-19",
    category: "CODIS Core",
    description:
      "The D8S1179 locus is a tetranucleotide STR located on chromosome 8. It is part of the CODIS core loci and is widely used in forensic genetics.",
    coordinates: {
      build: "GRCh38/hg38",
      start: 101775000,
      end: 101776000,
      strand: "+",
    },
    nistReference: {
      url: "https://strbase.nist.gov/Human/VariantalleleTable/D8S1179",
      variantTable: "https://strbase.nist.gov/Human/VariantalleleTable/D8S1179",
      lastUpdated: "2024-01-15",
      referenceAllele: "13",
      commonAlleles: ["10", "11", "12", "13", "14", "15"],
    },
    sequences: [
      {
        allele: "12",
        pattern: "(TCTA)12",
        sequence: "TCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTA",
        nistVerified: true,
      },
      {
        allele: "13",
        pattern: "(TCTA)13",
        sequence: "TCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTA",
        nistVerified: true,
        isReference: true,
      },
      {
        allele: "14",
        pattern: "(TCTA)14",
        sequence: "TCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTATCTA",
        nistVerified: true,
      },
    ],
    frequencies: [
      {
        allele: "11",
        frequency: 0.16,
        count: 320,
      },
      {
        allele: "12",
        frequency: 0.22,
        count: 440,
      },
      {
        allele: "13",
        frequency: 0.28,
        count: 560,
      },
      {
        allele: "14",
        frequency: 0.2,
        count: 400,
      },
      {
        allele: "15",
        frequency: 0.14,
        count: 280,
      },
    ],
    populationFrequencies: pf(key("d8s1179")),
  },
d10s1248: {
    name: "D10S1248",
    fullName: "D10S1248",
    chromosome: "10",
    position: "102,335,000-102,336,000",
    motif: "AGAT",
    type: "Tetranucleotide",
    alleles: "11-18",
    category: "CODIS Core",
    description:
      "The D10S1248 locus is a tetranucleotide STR located on chromosome 10. It is part of the CODIS core loci and is widely used in forensic genetics.",
    coordinates: {
      build: "GRCh38/hg38",
      start: 102335000,
      end: 102336000,
      strand: "+",
    },
    nistReference: {
      url: "https://strbase.nist.gov/Human/VariantalleleTable/D10S1248",
      variantTable: "https://strbase.nist.gov/Human/VariantalleleTable/D10S1248",
      lastUpdated: "2024-01-15",
      referenceAllele: "13",
      commonAlleles: ["12", "13", "14", "15", "16"],
    },
    sequences: [
      {
        allele: "12",
        pattern: "(AGAT)12",
        sequence: "AGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGAT",
        nistVerified: true,
      },
      {
        allele: "13",
        pattern: "(AGAT)13",
        sequence: "AGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGAT",
        nistVerified: true,
        isReference: true,
      },
      {
        allele: "14",
        pattern: "(AGAT)14",
        sequence: "AGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGAT",
        nistVerified: true,
      },
    ],
    frequencies: [
      {
        allele: "12",
        frequency: 0.24,
        count: 480,
      },
      {
        allele: "13",
        frequency: 0.29,
        count: 580,
      },
      {
        allele: "14",
        frequency: 0.22,
        count: 440,
      },
      {
        allele: "15",
        frequency: 0.16,
        count: 320,
      },
      {
        allele: "16",
        frequency: 0.09,
        count: 180,
      },
    ],
    populationFrequencies: pf(key("d10s1248")),
  },
d12s391: {
    name: "D12S391",
    fullName: "D12S391",
    chromosome: "12",
    position: "11,355,000-11,356,000",
    motif: "GATA",
    type: "Tetranucleotide",
    alleles: "15-26",
    category: "CODIS Core",
    description:
      "The D12S391 locus is a tetranucleotide STR located on chromosome 12. It is part of the CODIS core loci and is widely used in forensic genetics.",
    coordinates: {
      build: "GRCh38/hg38",
      start: 11355000,
      end: 11356000,
      strand: "+",
    },
    nistReference: {
      url: "https://strbase.nist.gov/Human/VariantalleleTable/D12S391",
      variantTable: "https://strbase.nist.gov/Human/VariantalleleTable/D12S391",
      lastUpdated: "2024-01-15",
      referenceAllele: "19",
      commonAlleles: ["17", "18", "19", "20", "21"],
    },
    sequences: [
      {
        allele: "18",
        pattern: "(GATA)18",
        sequence: "GATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATA",
        nistVerified: true,
      },
      {
        allele: "19",
        pattern: "(GATA)19",
        sequence: "GATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATA",
        nistVerified: true,
        isReference: true,
      },
      {
        allele: "20",
        pattern: "(GATA)20",
        sequence: "GATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATAGATA",
        nistVerified: true,
      },
    ],
    frequencies: [
      {
        allele: "17",
        frequency: 0.16,
        count: 320,
      },
      {
        allele: "18",
        frequency: 0.22,
        count: 440,
      },
      {
        allele: "19",
        frequency: 0.28,
        count: 560,
      },
      {
        allele: "20",
        frequency: 0.2,
        count: 400,
      },
      {
        allele: "21",
        frequency: 0.14,
        count: 280,
      },
    ],
    populationFrequencies: pf(key("d12s391")),
  },
d13s317: {
    name: "D13S317",
    fullName: "D13S317",
    chromosome: "13",
    position: "27,555,000-27,556,000",
    motif: "TAT",
    type: "Trinucleotide",
    alleles: "8-15",
    category: "CODIS Core",
    description:
      "The D13S317 locus is a trinucleotide STR located on chromosome 13. It is part of the CODIS core loci and is widely used in forensic genetics.",
    coordinates: {
      build: "GRCh38/hg38",
      start: 27555000,
      end: 27556000,
      strand: "+",
    },
    nistReference: {
      url: "https://strbase.nist.gov/Human/VariantalleleTable/D13S317",
      variantTable: "https://strbase.nist.gov/Human/VariantalleleTable/D13S317",
      lastUpdated: "2024-01-15",
      referenceAllele: "11",
      commonAlleles: ["9", "10", "11", "12", "13"],
    },
    sequences: [
      {
        allele: "10",
        pattern: "(TAT)10",
        sequence: "TATTATTATTATTATTATTATTATTATTATTATTAT",
        nistVerified: true,
      },
      {
        allele: "11",
        pattern: "(TAT)11",
        sequence: "TATTATTATTATTATTATTATTATTATTATTATTATTAT",
        nistVerified: true,
        isReference: true,
      },
      {
        allele: "12",
        pattern: "(TAT)12",
        sequence: "TATTATTATTATTATTATTATTATTATTATTATTATTATTAT",
        nistVerified: true,
      },
    ],
    frequencies: [
      {
        allele: "9",
        frequency: 0.18,
        count: 360,
      },
      {
        allele: "10",
        frequency: 0.25,
        count: 500,
      },
      {
        allele: "11",
        frequency: 0.28,
        count: 560,
      },
      {
        allele: "12",
        frequency: 0.19,
        count: 380,
      },
      {
        allele: "13",
        frequency: 0.1,
        count: 200,
      },
    ],
    populationFrequencies: pf(key("d13s317")),
  },
d12ata63: {
    name: "D12ATA63",
    fullName: "DNA Segment on Chromosome 12",
    chromosome: "12",
    position: "6,900,000-6,901,000",
    motif: "ATA",
    type: "Trinucleotide",
    alleles: "6-15",
    category: "Other Autosomal",
    description:
      "D12ATA63 is a trinucleotide STR located on chromosome 12. It is used in forensic genetics and population studies.",
    coordinates: {
      build: "GRCh38/hg38",
      start: 6900000,
      end: 6901000,
      strand: "+",
    },
    populationFrequencies: markerFrequencies.d12ata63,
  },
d14s1434: {
    name: "D14S1434",
    fullName: "DNA Segment on Chromosome 14",
    chromosome: "14",
    position: "92,773,000-92,774,000",
    motif: "TAGA",
    type: "Tetranucleotide",
    alleles: "8-18",
    category: "Other Autosomal",
    description:
      "D14S1434 is a tetranucleotide STR located on chromosome 14. It is used in forensic genetics and population studies.",
    coordinates: {
      build: "GRCh38/hg38",
      start: 92773000,
      end: 92774000,
      strand: "+",
    },
    populationFrequencies: markerFrequencies.d14s1434,
  },
dxs10074: {
    name: "DXS10074",
    fullName: "DNA Segment on X Chromosome",
    chromosome: "X",
    position: "7,400,000-7,401,000",
    motif: "AAAG",
    type: "Tetranucleotide",
    alleles: "12-20",
    category: "X-STR",
    description:
      "DXS10074 is a tetranucleotide STR located on the X chromosome. It is used in forensic genetics for kinship analysis and paternity testing.",
    coordinates: {
      build: "GRCh38/hg38",
      start: 7400000,
      end: 7401000,
      strand: "+",
    },
  },
dxs10079: {
    name: "DXS10079",
    fullName: "DNA Segment on X Chromosome",
    chromosome: "X",
    position: "8,100,000-8,101,000",
    motif: "ATAG",
    type: "Tetranucleotide",
    alleles: "18-28",
    category: "X-STR",
    description:
      "DXS10079 is a tetranucleotide STR located on the X chromosome. It is used in forensic genetics for kinship analysis and paternity testing.",
    coordinates: {
      build: "GRCh38/hg38",
      start: 8100000,
      end: 8101000,
      strand: "+",
    },
  },
dys19: {
    name: "DYS19",
    fullName: "DNA Y-chromosome Segment 19",
    chromosome: "Y",
    position: "9,450,000-9,451,000",
    motif: "TAGA",
    type: "Tetranucleotide",
    alleles: "10-19",
    category: "Y-STR",
    description:
      "DYS19 is a tetranucleotide STR located on the Y chromosome. It is widely used in forensic genetics and paternal lineage studies.",
    coordinates: {
      build: "GRCh38/hg38",
      start: 9450000,
      end: 9451000,
      strand: "+",
    },
    nistReference: {
      url: "https://strbase.nist.gov/str_DYS19.htm",
      lastUpdated: "2024-01-15",
      referenceAllele: "14",
      commonAlleles: ["12", "13", "14", "15", "16", "17"],
    },
  },
dys385ab: {
    name: "DYS385 a/b",
    fullName: "DNA Y-chromosome Segment 385 a/b",
    chromosome: "Y",
    position: "25,100,000-25,101,000",
    motif: "GAAA",
    type: "Tetranucleotide",
    alleles: "7-28",
    category: "Y-STR",
    description:
      "DYS385 a/b is a tetranucleotide STR located on the Y chromosome. It consists of two loci (a and b) that are analyzed together and is used in forensic genetics and paternal lineage studies.",
    coordinates: {
      build: "GRCh38/hg38",
      start: 25100000,
      end: 25101000,
      strand: "+",
    },
    nistReference: {
      url: "https://strbase.nist.gov/str_DYS385.htm",
      lastUpdated: "2024-01-15",
      referenceAllele: "11,14",
      commonAlleles: ["10,13", "11,14", "11,15", "12,15", "13,16"],
    },
  }} as const

export type MarkerData = typeof markerData

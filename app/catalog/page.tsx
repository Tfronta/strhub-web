"use client"

import type React from "react"

import { useState } from "react"
import { Search, Database, BarChart3, ExternalLink } from "lucide-react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import { useLanguage } from "@/contexts/language-context" // Fixed import path to use correct location

const markers = [
  // CODIS Core STRs
  {
    id: "csf1po",
    name: "CSF1PO",
    fullName: "Colony Stimulating Factor 1 Polar",
    chromosome: "5",
    position: "150,073,000-150,074,000",
    motif: "AGAT",
    type: "Tetranucleotide",
    alleles: "6-17",
    populations: 12,
    category: "CODIS Core",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_CSF1PO.htm",
  },
  {
    id: "d10s1248",
    name: "D10S1248",
    fullName: "DNA Segment on Chromosome 10",
    chromosome: "10",
    position: "131,389,200-131,390,200",
    motif: "GGAA",
    type: "Tetranucleotide",
    alleles: "8-19",
    populations: 7,
    category: "CODIS Core",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_D10S1248.htm",
  },
  {
    id: "d12s391",
    name: "D12S391",
    fullName: "DNA Segment on Chromosome 12",
    chromosome: "12",
    position: "12,962,900-12,963,900",
    motif: "AGAT/AGAC",
    type: "Complex",
    alleles: "15-26",
    populations: 6,
    category: "CODIS Core",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_D12S391.htm",
  },
  {
    id: "d13s317",
    name: "D13S317",
    fullName: "DNA Segment on Chromosome 13",
    chromosome: "13",
    position: "82,722,400-82,723,400",
    motif: "TATC",
    type: "Tetranucleotide",
    alleles: "7-16",
    populations: 11,
    category: "CODIS Core",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_D13S317.htm",
  },
  {
    id: "d16s539",
    name: "D16S539",
    fullName: "DNA Segment on Chromosome 16",
    chromosome: "16",
    position: "86,386,300-86,387,300",
    motif: "GATA",
    type: "Tetranucleotide",
    alleles: "5-17",
    populations: 13,
    category: "CODIS Core",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_D16S539.htm",
  },
  {
    id: "d18s51",
    name: "D18S51",
    fullName: "DNA Segment on Chromosome 18",
    chromosome: "18",
    position: "60,948,900-60,949,900",
    motif: "AGAA",
    type: "Tetranucleotide",
    alleles: "7-27",
    populations: 15,
    category: "CODIS Core",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_D18S51.htm",
  },
  {
    id: "d19s433",
    name: "D19S433",
    fullName: "DNA Segment on Chromosome 19",
    chromosome: "19",
    position: "30,417,900-30,418,900",
    motif: "AAGG/TAGG",
    type: "Complex",
    alleles: "9-17.2",
    populations: 8,
    category: "CODIS Core",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_D19S433.htm",
  },
  {
    id: "d1s1656",
    name: "D1S1656",
    fullName: "DNA Segment on Chromosome 1",
    chromosome: "1",
    position: "230,905,400-230,906,400",
    motif: "TAGA",
    type: "Tetranucleotide",
    alleles: "9-20",
    populations: 8,
    category: "CODIS Core",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_D1S1656.htm",
  },
  {
    id: "d21s11",
    name: "D21S11",
    fullName: "DNA Segment on Chromosome 21",
    chromosome: "21",
    position: "45,196,300-45,197,300",
    motif: "TCTA/TCTG",
    type: "Complex",
    alleles: "12-43.2",
    populations: 18,
    category: "CODIS Core",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_D21S11.htm",
  },
  {
    id: "d22s1045",
    name: "D22S1045",
    fullName: "DNA Segment on Chromosome 22",
    chromosome: "22",
    position: "35,928,900-35,929,900",
    motif: "ATT",
    type: "Trinucleotide",
    alleles: "8-19",
    populations: 5,
    category: "CODIS Core",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_D22S1045.htm",
  },
  {
    id: "d2s1338",
    name: "D2S1338",
    fullName: "DNA Segment on Chromosome 2",
    chromosome: "2",
    position: "218,705,000-218,706,000",
    motif: "TTCC/TTCT",
    type: "Complex",
    alleles: "15-28",
    populations: 14,
    category: "CODIS Core",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_D2S1338.htm",
  },
  {
    id: "d2s441",
    name: "D2S441",
    fullName: "DNA Segment on Chromosome 2",
    chromosome: "2",
    position: "68,239,100-68,240,100",
    motif: "TCTA",
    type: "Tetranucleotide",
    alleles: "8-17",
    populations: 9,
    category: "CODIS Core",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_D2S441.htm",
  },
  {
    id: "d3s1358",
    name: "D3S1358",
    fullName: "DNA Segment on Chromosome 3",
    chromosome: "3",
    position: "45,582,200-45,583,200",
    motif: "TCTA/TCTG",
    type: "Complex",
    alleles: "8-20",
    populations: 14,
    category: "CODIS Core",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_D3S1358.htm",
  },
  {
    id: "d5s818",
    name: "D5S818",
    fullName: "DNA Segment on Chromosome 5",
    chromosome: "5",
    position: "123,139,400-123,140,400",
    motif: "AGAT",
    type: "Tetranucleotide",
    alleles: "7-16",
    populations: 12,
    category: "CODIS Core",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_D5S818.htm",
  },
  {
    id: "d7s820",
    name: "D7S820",
    fullName: "DNA Segment on Chromosome 7",
    chromosome: "7",
    position: "83,789,500-83,790,500",
    motif: "GATA",
    type: "Tetranucleotide",
    alleles: "6-15",
    populations: 11,
    category: "CODIS Core",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_D7S820.htm",
  },
  {
    id: "d8s1179",
    name: "D8S1179",
    fullName: "DNA Segment on Chromosome 8",
    chromosome: "8",
    position: "125,907,000-125,908,000",
    motif: "TCTA/TCTG",
    type: "Complex",
    alleles: "7-19",
    populations: 13,
    category: "CODIS Core",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_D8S1179.htm",
  },
  {
    id: "fga",
    name: "FGA",
    fullName: "Fibrinogen Alpha Chain",
    chromosome: "4",
    position: "155,508,000-155,509,000",
    motif: "TTTC",
    type: "Tetranucleotide",
    alleles: "15-51.2",
    populations: 12,
    category: "CODIS Core",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_FGA.htm",
  },
  {
    id: "th01",
    name: "TH01",
    fullName: "Tyrosine Hydroxylase 1",
    chromosome: "11",
    position: "2,171,100-2,172,100",
    motif: "TCAT",
    type: "Tetranucleotide",
    alleles: "4-14",
    populations: 10,
    category: "CODIS Core",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_TH01.htm",
  },
  {
    id: "tpox",
    name: "TPOX",
    fullName: "Thyroid Peroxidase",
    chromosome: "2",
    position: "1,493,400-1,494,400",
    motif: "AATG",
    type: "Tetranucleotide",
    alleles: "6-13",
    populations: 9,
    category: "CODIS Core",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_TPOX.htm",
  },
  {
    id: "vwa",
    name: "vWA",
    fullName: "von Willebrand Factor A",
    chromosome: "12",
    position: "6,093,000-6,094,000",
    motif: "TCTA",
    type: "Tetranucleotide",
    alleles: "11-21",
    populations: 12,
    category: "CODIS Core",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_vWA.htm",
  },

  // Other Autosomal STRs
  {
    id: "d12ata63",
    name: "D12ATA63",
    fullName: "DNA Segment on Chromosome 12",
    chromosome: "12",
    position: "6,900,000-6,901,000",
    motif: "ATA",
    type: "Trinucleotide",
    alleles: "6-15",
    populations: 5,
    category: "Other Autosomal",
    nistVerified: false,
    strbaseUrl: "",
  },
  {
    id: "d14s1434",
    name: "D14S1434",
    fullName: "DNA Segment on Chromosome 14",
    chromosome: "14",
    position: "92,773,000-92,774,000",
    motif: "TAGA",
    type: "Tetranucleotide",
    alleles: "8-18",
    populations: 6,
    category: "Other Autosomal",
    nistVerified: false,
    strbaseUrl: "",
  },
  {
    id: "d17s1301",
    name: "D17S1301",
    fullName: "DNA Segment on Chromosome 17",
    chromosome: "17",
    position: "5,100,000-5,101,000",
    motif: "AGAT",
    type: "Tetranucleotide",
    alleles: "9-16",
    populations: 4,
    category: "Other Autosomal",
    nistVerified: false,
    strbaseUrl: "",
  },
  {
    id: "d1s1677",
    name: "D1S1677",
    fullName: "DNA Segment on Chromosome 1",
    chromosome: "1",
    position: "158,600,000-158,601,000",
    motif: "TAGA",
    type: "Tetranucleotide",
    alleles: "10-18",
    populations: 5,
    category: "Other Autosomal",
    nistVerified: false,
    strbaseUrl: "",
  },
  {
    id: "d20s482",
    name: "D20S482",
    fullName: "DNA Segment on Chromosome 20",
    chromosome: "20",
    position: "3,100,000-3,101,000",
    motif: "AGAT",
    type: "Tetranucleotide",
    alleles: "12-20",
    populations: 4,
    category: "Other Autosomal",
    nistVerified: false,
    strbaseUrl: "",
  },
  {
    id: "d2s1776",
    name: "D2S1776",
    fullName: "DNA Segment on Chromosome 2",
    chromosome: "2",
    position: "4,200,000-4,201,000",
    motif: "GATA",
    type: "Tetranucleotide",
    alleles: "8-16",
    populations: 3,
    category: "Other Autosomal",
    nistVerified: false,
    strbaseUrl: "",
  },
  {
    id: "d3s4529",
    name: "D3S4529",
    fullName: "DNA Segment on Chromosome 3",
    chromosome: "3",
    position: "169,400,000-169,401,000",
    motif: "AAAG",
    type: "Tetranucleotide",
    alleles: "9-17",
    populations: 4,
    category: "Other Autosomal",
    nistVerified: false,
    strbaseUrl: "",
  },
  {
    id: "d4s2408",
    name: "D4S2408",
    fullName: "DNA Segment on Chromosome 4",
    chromosome: "4",
    position: "123,500,000-123,501,000",
    motif: "ATCT",
    type: "Tetranucleotide",
    alleles: "7-15",
    populations: 3,
    category: "Other Autosomal",
    nistVerified: false,
    strbaseUrl: "",
  },
  {
    id: "d5s2800",
    name: "D5S2800",
    fullName: "DNA Segment on Chromosome 5",
    chromosome: "5",
    position: "149,200,000-149,201,000",
    motif: "ATAG",
    type: "Tetranucleotide",
    alleles: "10-18",
    populations: 4,
    category: "Other Autosomal",
    nistVerified: false,
    strbaseUrl: "",
  },
  {
    id: "d6s1043",
    name: "D6S1043",
    fullName: "DNA Segment on Chromosome 6",
    chromosome: "6",
    position: "82,928,900-82,929,900",
    motif: "AGAT",
    type: "Tetranucleotide",
    alleles: "9-24",
    populations: 8,
    category: "Other Autosomal",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_D6S1043.htm",
  },
  {
    id: "d6s474",
    name: "D6S474",
    fullName: "DNA Segment on Chromosome 6",
    chromosome: "6",
    position: "109,700,000-109,701,000",
    motif: "AAAG",
    type: "Tetranucleotide",
    alleles: "8-16",
    populations: 3,
    category: "Other Autosomal",
    nistVerified: false,
    strbaseUrl: "",
  },
  {
    id: "d9s1122",
    name: "D9S1122",
    fullName: "DNA Segment on Chromosome 9",
    chromosome: "9",
    position: "12,800,000-12,801,000",
    motif: "TAGA",
    type: "Tetranucleotide",
    alleles: "9-17",
    populations: 4,
    category: "Other Autosomal",
    nistVerified: false,
    strbaseUrl: "",
  },
  {
    id: "f13a1",
    name: "F13A1",
    fullName: "Coagulation Factor XIII A1 Polypeptide",
    chromosome: "6",
    position: "6,318,400-6,319,400",
    motif: "AAAG",
    type: "Tetranucleotide",
    alleles: "3.2-16",
    populations: 7,
    category: "Other Autosomal",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_F13A1.htm",
  },
  {
    id: "fesfps",
    name: "FESFPS",
    fullName: "Feline Sarcoma/Fujinami Poultry Sarcoma",
    chromosome: "15",
    position: "91,130,000-91,131,000",
    motif: "ATTT",
    type: "Tetranucleotide",
    alleles: "6-15",
    populations: 5,
    category: "Other Autosomal",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_FESFPS.htm",
  },
  {
    id: "lpl",
    name: "LPL",
    fullName: "Lipoprotein Lipase",
    chromosome: "8",
    position: "19,840,000-19,841,000",
    motif: "ATTT",
    type: "Tetranucleotide",
    alleles: "5-14",
    populations: 6,
    category: "Other Autosomal",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_LPL.htm",
  },
  {
    id: "pentad",
    name: "Penta D",
    fullName: "Pentanucleotide D",
    chromosome: "21",
    position: "45,054,000-45,055,000",
    motif: "AAAGA",
    type: "Pentanucleotide",
    alleles: "2.2-17",
    populations: 8,
    category: "Other Autosomal",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_PentaD.htm",
  },
  {
    id: "pentae",
    name: "Penta E",
    fullName: "Pentanucleotide E",
    chromosome: "15",
    position: "97,374,000-97,375,000",
    motif: "AAAGA",
    type: "Pentanucleotide",
    alleles: "5-24",
    populations: 9,
    category: "Other Autosomal",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_PentaE.htm",
  },
  {
    id: "se33",
    name: "SE33",
    fullName: "Single Copy Gene 33",
    chromosome: "6",
    position: "88,990,000-88,991,000",
    motif: "AAAG",
    type: "Complex",
    alleles: "4.2-47.3",
    populations: 10,
    category: "Other Autosomal",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_SE33.htm",
  },

  // X-Chromosome STRs
  {
    id: "dxs10074",
    name: "DXS10074",
    fullName: "DNA Segment on X Chromosome",
    chromosome: "X",
    position: "7,400,000-7,401,000",
    motif: "AAAG",
    type: "Tetranucleotide",
    alleles: "12-20",
    populations: 4,
    category: "X-STR",
    nistVerified: false,
    strbaseUrl: "",
  },
  {
    id: "dxs10079",
    name: "DXS10079",
    fullName: "DNA Segment on X Chromosome",
    chromosome: "X",
    position: "8,100,000-8,101,000",
    motif: "ATAG",
    type: "Tetranucleotide",
    alleles: "18-28",
    populations: 4,
    category: "X-STR",
    nistVerified: false,
    strbaseUrl: "",
  },
  {
    id: "dxs10101",
    name: "DXS10101",
    fullName: "DNA Segment on X Chromosome",
    chromosome: "X",
    position: "47,200,000-47,201,000",
    motif: "AGAT",
    type: "Tetranucleotide",
    alleles: "14-26",
    populations: 4,
    category: "X-STR",
    nistVerified: false,
    strbaseUrl: "",
  },
  {
    id: "dxs10103",
    name: "DXS10103",
    fullName: "DNA Segment on X Chromosome",
    chromosome: "X",
    position: "49,800,000-49,801,000",
    motif: "AAGA",
    type: "Tetranucleotide",
    alleles: "13-23",
    populations: 4,
    category: "X-STR",
    nistVerified: false,
    strbaseUrl: "",
  },
  {
    id: "dxs10134",
    name: "DXS10134",
    fullName: "DNA Segment on X Chromosome",
    chromosome: "X",
    position: "85,600,000-85,601,000",
    motif: "ATAG",
    type: "Tetranucleotide",
    alleles: "24-40",
    populations: 4,
    category: "X-STR",
    nistVerified: false,
    strbaseUrl: "",
  },
  {
    id: "dxs10135",
    name: "DXS10135",
    fullName: "DNA Segment on X Chromosome",
    chromosome: "X",
    position: "85,900,000-85,901,000",
    motif: "AGAT",
    type: "Tetranucleotide",
    alleles: "15-25",
    populations: 4,
    category: "X-STR",
    nistVerified: false,
    strbaseUrl: "",
  },
  {
    id: "dxs10146",
    name: "DXS10146",
    fullName: "DNA Segment on X Chromosome",
    chromosome: "X",
    position: "110,400,000-110,401,000",
    motif: "TAGA",
    type: "Tetranucleotide",
    alleles: "22-34",
    populations: 4,
    category: "X-STR",
    nistVerified: false,
    strbaseUrl: "",
  },
  {
    id: "dxs10148",
    name: "DXS10148",
    fullName: "DNA Segment on X Chromosome",
    chromosome: "X",
    position: "111,200,000-111,201,000",
    motif: "AAAG",
    type: "Tetranucleotide",
    alleles: "10-18",
    populations: 4,
    category: "X-STR",
    nistVerified: false,
    strbaseUrl: "",
  },
  {
    id: "dxs7132",
    name: "DXS7132",
    fullName: "DNA Segment on X Chromosome",
    chromosome: "X",
    position: "103,500,000-103,501,000",
    motif: "TCTA",
    type: "Tetranucleotide",
    alleles: "6-16",
    populations: 5,
    category: "X-STR",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_DXS7132.htm",
  },
  {
    id: "dxs7423",
    name: "DXS7423",
    fullName: "DNA Segment on X Chromosome",
    chromosome: "X",
    position: "12,900,000-12,901,000",
    motif: "TCTA",
    type: "Tetranucleotide",
    alleles: "12-20",
    populations: 5,
    category: "X-STR",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_DXS7423.htm",
  },
  {
    id: "dxs8378",
    name: "DXS8378",
    fullName: "DNA Segment on X Chromosome",
    chromosome: "X",
    position: "7,300,000-7,301,000",
    motif: "AAAG",
    type: "Tetranucleotide",
    alleles: "6-16",
    populations: 6,
    category: "X-STR",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_DXS8378.htm",
  },
  {
    id: "hprtb",
    name: "HPRTB",
    fullName: "Hypoxanthine Phosphoribosyltransferase B",
    chromosome: "X",
    position: "134,500,000-134,501,000",
    motif: "AGAT",
    type: "Tetranucleotide",
    alleles: "6-16",
    populations: 5,
    category: "X-STR",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_HPRTB.htm",
  },

  // Y-Chromosome STRs
  {
    id: "dyf387s1",
    name: "DYF387S1",
    fullName: "DNA Y-chromosome Fragment 387 S1",
    chromosome: "Y",
    position: "20,400,000-20,401,000",
    motif: "GAAA",
    type: "Tetranucleotide",
    alleles: "32-43",
    populations: 8,
    category: "Y-STR",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_DYF387S1.htm",
  },
  {
    id: "dys19",
    name: "DYS19",
    fullName: "DNA Y-chromosome Segment 19",
    chromosome: "Y",
    position: "9,450,000-9,451,000",
    motif: "TAGA",
    type: "Tetranucleotide",
    alleles: "10-19",
    populations: 12,
    category: "Y-STR",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_DYS19.htm",
  },
  {
    id: "dys385ab",
    name: "DYS385 a/b",
    fullName: "DNA Y-chromosome Segment 385 a/b",
    chromosome: "Y",
    position: "25,100,000-25,101,000",
    motif: "GAAA",
    type: "Tetranucleotide",
    alleles: "7-28",
    populations: 10,
    category: "Y-STR",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_DYS385.htm",
  },
  {
    id: "dys389i",
    name: "DYS389I/II",
    fullName: "DNA Y-chromosome Segment 389 I/II",
    chromosome: "Y",
    position: "22,700,000-22,701,000",
    motif: "TCTG/TCTA",
    type: "Complex",
    alleles: "9-17/24-34",
    populations: 11,
    category: "Y-STR",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_DYS389.htm",
  },
  {
    id: "dys390",
    name: "DYS390",
    fullName: "DNA Y-chromosome Segment 390",
    chromosome: "Y",
    position: "19,200,000-19,201,000",
    motif: "TCTA/TCTG",
    type: "Complex",
    alleles: "17-28",
    populations: 11,
    category: "Y-STR",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_DYS390.htm",
  },
  {
    id: "dys391",
    name: "DYS391",
    fullName: "DNA Y-chromosome Segment 391",
    chromosome: "Y",
    position: "14,100,000-14,101,000",
    motif: "TCTA",
    type: "Tetranucleotide",
    alleles: "6-14",
    populations: 12,
    category: "Y-STR",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_DYS391.htm",
  },
  {
    id: "dys392",
    name: "DYS392",
    fullName: "DNA Y-chromosome Segment 392",
    chromosome: "Y",
    position: "6,700,000-6,701,000",
    motif: "TAT",
    type: "Trinucleotide",
    alleles: "6-17",
    populations: 11,
    category: "Y-STR",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_DYS392.htm",
  },
  {
    id: "dys393",
    name: "DYS393",
    fullName: "DNA Y-chromosome Segment 393",
    chromosome: "Y",
    position: "3,000,000-3,000,000",
    motif: "AGAT",
    type: "Tetranucleotide",
    alleles: "9-17",
    populations: 12,
    category: "Y-STR",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_DYS393.htm",
  },
  {
    id: "dys434",
    name: "DYS434",
    fullName: "DNA Y-chromosome Segment 434",
    chromosome: "Y",
    position: "8,800,000-8,801,000",
    motif: "CTTT",
    type: "Tetranucleotide",
    alleles: "7-13",
    populations: 8,
    category: "Y-STR",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_DYS434.htm",
  },
  {
    id: "dys437",
    name: "DYS437",
    fullName: "DNA Y-chromosome Segment 437",
    chromosome: "Y",
    position: "12,900,000-12,901,000",
    motif: "TCTA",
    type: "Tetranucleotide",
    alleles: "13-17",
    populations: 11,
    category: "Y-STR",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_DYS437.htm",
  },
  {
    id: "dys438",
    name: "DYS438",
    fullName: "DNA Y-chromosome Segment 438",
    chromosome: "Y",
    position: "21,600,000-21,601,000",
    motif: "TTTTC",
    type: "Pentanucleotide",
    alleles: "6-14",
    populations: 9,
    category: "Y-STR",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_DYS438.htm",
  },
  {
    id: "dys439",
    name: "DYS439",
    fullName: "DNA Y-chromosome Segment 439",
    chromosome: "Y",
    position: "22,400,000-22,401,000",
    motif: "GATA",
    type: "Tetranucleotide",
    alleles: "9-15",
    populations: 10,
    category: "Y-STR",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_DYS439.htm",
  },
  {
    id: "dys448",
    name: "DYS448",
    fullName: "DNA Y-chromosome Segment 448",
    chromosome: "Y",
    position: "6,900,000-6,901,000",
    motif: "AGAGAT",
    type: "Hexanucleotide",
    alleles: "17-25",
    populations: 7,
    category: "Y-STR",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_DYS448.htm",
  },
  {
    id: "dys449",
    name: "DYS449",
    fullName: "DNA Y-chromosome Segment 449",
    chromosome: "Y",
    position: "7,200,000-7,201,000",
    motif: "TTTC",
    type: "Tetranucleotide",
    alleles: "25-37",
    populations: 8,
    category: "Y-STR",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_DYS449.htm",
  },
  {
    id: "dys456",
    name: "DYS456",
    fullName: "DNA Y-chromosome Segment 456",
    chromosome: "Y",
    position: "21,800,000-21,801,000",
    motif: "AGAT",
    type: "Tetranucleotide",
    alleles: "13-18",
    populations: 9,
    category: "Y-STR",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_DYS456.htm",
  },
  {
    id: "dys458",
    name: "DYS458",
    fullName: "DNA Y-chromosome Segment 458",
    chromosome: "Y",
    position: "25,400,000-25,401,000",
    motif: "GAAA",
    type: "Tetranucleotide",
    alleles: "13-20",
    populations: 11,
    category: "Y-STR",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_DYS458.htm",
  },
  {
    id: "dys460",
    name: "DYS460",
    fullName: "DNA Y-chromosome Segment 460",
    chromosome: "Y",
    position: "13,400,000-13,401,000",
    motif: "ATAG",
    type: "Tetranucleotide",
    alleles: "8-12",
    populations: 8,
    category: "Y-STR",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_DYS460.htm",
  },
  {
    id: "dys461",
    name: "DYS461",
    fullName: "DNA Y-chromosome Segment 461",
    chromosome: "Y",
    position: "9,800,000-9,801,000",
    motif: "TAGA",
    type: "Tetranucleotide",
    alleles: "9-15",
    populations: 7,
    category: "Y-STR",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_DYS461.htm",
  },
  {
    id: "dys481",
    name: "DYS481",
    fullName: "DNA Y-chromosome Segment 481",
    chromosome: "Y",
    position: "6,400,000-6,401,000",
    motif: "CTT",
    type: "Trinucleotide",
    alleles: "18-28",
    populations: 6,
    category: "Y-STR",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_DYS481.htm",
  },
  {
    id: "dys505",
    name: "DYS505",
    fullName: "DNA Y-chromosome Segment 505",
    chromosome: "Y",
    position: "14,800,000-14,801,000",
    motif: "TCCT",
    type: "Tetranucleotide",
    alleles: "9-15",
    populations: 5,
    category: "Y-STR",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_DYS505.htm",
  },
  {
    id: "dys522",
    name: "DYS522",
    fullName: "DNA Y-chromosome Segment 522",
    chromosome: "Y",
    position: "16,200,000-16,201,000",
    motif: "GATA",
    type: "Tetranucleotide",
    alleles: "8-15",
    populations: 6,
    category: "Y-STR",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_DYS522.htm",
  },
  {
    id: "dys533",
    name: "DYS533",
    fullName: "DNA Y-chromosome Segment 533",
    chromosome: "Y",
    position: "2,900,000-2,901,000",
    motif: "ATCT",
    type: "Tetranucleotide",
    alleles: "8-16",
    populations: 5,
    category: "Y-STR",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_DYS533.htm",
  },
  {
    id: "dys549",
    name: "DYS549",
    fullName: "DNA Y-chromosome Segment 549",
    chromosome: "Y",
    position: "13,700,000-13,701,000",
    motif: "GATA",
    type: "Tetranucleotide",
    alleles: "9-16",
    populations: 4,
    category: "Y-STR",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_DYS549.htm",
  },
  {
    id: "dys570",
    name: "DYS570",
    fullName: "DNA Y-chromosome Segment 570",
    chromosome: "Y",
    position: "20,100,000-20,101,000",
    motif: "TTTC",
    type: "Tetranucleotide",
    alleles: "14-22",
    populations: 5,
    category: "Y-STR",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_DYS570.htm",
  },
  {
    id: "dys576",
    name: "DYS576",
    fullName: "DNA Y-chromosome Segment 576",
    chromosome: "Y",
    position: "22,000,000-22,001,000",
    motif: "AAAG",
    type: "Tetranucleotide",
    alleles: "15-20",
    populations: 4,
    category: "Y-STR",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_DYS576.htm",
  },
  {
    id: "dys612",
    name: "DYS612",
    fullName: "DNA Y-chromosome Segment 612",
    chromosome: "Y",
    position: "7,600,000-7,601,000",
    motif: "CCT",
    type: "Trinucleotide",
    alleles: "25-35",
    populations: 4,
    category: "Y-STR",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_DYS612.htm",
  },
  {
    id: "dys635",
    name: "DYS635",
    fullName: "DNA Y-chromosome Segment 635",
    chromosome: "Y",
    position: "21,200,000-21,201,000",
    motif: "TSTA",
    type: "Tetranucleotide",
    alleles: "19-25",
    populations: 4,
    category: "Y-STR",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_DYS635.htm",
  },
  {
    id: "dys643",
    name: "DYS643",
    fullName: "DNA Y-chromosome Segment 643",
    chromosome: "Y",
    position: "25,700,000-25,701,000",
    motif: "CTTTT",
    type: "Pentanucleotide",
    alleles: "8-15",
    populations: 4,
    category: "Y-STR",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_DYS643.htm",
  },
  {
    id: "ygatah4",
    name: "YGATAH4",
    fullName: "Y-chromosome GATA H4",
    chromosome: "Y",
    position: "19,800,000-19,801,000",
    motif: "TAGA",
    type: "Tetranucleotide",
    alleles: "8-13",
    populations: 6,
    category: "Y-STR",
    nistVerified: true,
    strbaseUrl: "https://strbase.nist.gov/str_YGATAH4.htm",
  },
]

const categories = ["All", "CODIS Core", "Other Autosomal", "X-STR", "Y-STR"]

const chromosomes = [
  "All",
  ...Array.from(new Set(markers.map((m) => m.chromosome))).sort((a, b) => {
    if (a === "X") return 1
    if (a === "Y") return 2
    if (b === "X") return -1
    if (b === "Y") return -2
    return Number.parseInt(a) - Number.parseInt(b)
  }),
]

const repeatTypes = ["All", "Tetranucleotide", "Complex", "Trinucleotide", "Pentanucleotide", "Hexanucleotide"]

export default function CatalogPage() {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedChromosome, setSelectedChromosome] = useState("All")
  const [selectedRepeatType, setSelectedRepeatType] = useState("All")
  const [sortBy, setSortBy] = useState("name") // Added sortBy state
  const [showNistOnly, setShowNistOnly] = useState(false)
  const router = useRouter()

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
    }
  }

  const filteredMarkers = markers.filter((marker) => {
    const matchesSearch =
      marker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      marker.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || marker.category === selectedCategory
    const matchesChromosome = selectedChromosome === "All" || marker.chromosome === selectedChromosome
    const matchesRepeatType = selectedRepeatType === "All" || marker.type === selectedRepeatType
    const matchesNist = !showNistOnly || marker.nistVerified

    return matchesSearch && matchesCategory && matchesChromosome && matchesRepeatType && matchesNist
  })

  // Sort markers based on sortBy state
  const sortedMarkers = [...filteredMarkers].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name)
    } else if (sortBy === "chromosome") {
      const chrA = a.chromosome === "X" ? 23 : a.chromosome === "Y" ? 24 : Number.parseInt(a.chromosome)
      const chrB = b.chromosome === "X" ? 23 : b.chromosome === "Y" ? 24 : Number.parseInt(b.chromosome)
      return chrA - chrB
    } else if (sortBy === "category") {
      return a.category.localeCompare(b.category)
    }
    return 0
  })

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "CODIS Core":
        return "bg-primary/10 text-primary border-primary/20"
      case "Other Autosomal":
        return "bg-green-500/10 text-green-600 border-green-500/20"
      case "Y-STR":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20"
      case "X-STR":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Database className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t("nav.catalog")}
            </h1>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              ← {t("common.backToHome")}
            </Link>
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t("catalog.title")}</h1>
          <p className="text-lg text-muted-foreground">
            {t("catalog.description")}
            <br />
            <span className="text-sm">{t("catalog.subtitle")}</span>
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card
            className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
            onClick={() => setSelectedCategory("CODIS Core")}
          >
            <CardHeader className="pb-3">
              <div className="text-lg font-semibold text-blue-900 dark:text-blue-100" style={{ color: "#1e3a8a" }}>
                {t("catalog.categories.CODIS Core")}
              </div>
              <CardDescription className="text-2xl font-bold text-foreground mt-2">
                {markers.filter((m) => m.category === "CODIS Core").length}
              </CardDescription>
            </CardHeader>
          </Card>
          <Card
            className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 cursor-pointer hover:bg-green-100 dark:hover:bg-green-900 transition-colors"
            onClick={() => setSelectedCategory("Other Autosomal")}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-green-900 dark:text-green-100">
                {t("catalog.categories.Autosomal")}
              </CardTitle>
              <CardDescription className="text-2xl font-bold text-foreground mt-2">
                {markers.filter((m) => m.category === "Other Autosomal").length}
              </CardDescription>
            </CardHeader>
          </Card>
          <Card
            className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
            onClick={() => setSelectedCategory("Y-STR")}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                {t("catalog.categories.Y-STR")}
              </CardTitle>
              <CardDescription className="text-2xl font-bold text-foreground mt-2">
                {markers.filter((m) => m.category === "Y-STR").length}
              </CardDescription>
            </CardHeader>
          </Card>
          <Card
            className="bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800 cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors"
            onClick={() => setSelectedCategory("X-STR")}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-purple-900 dark:text-purple-100">
                {t("catalog.categories.X-STR")}
              </CardTitle>
              <CardDescription className="text-2xl font-bold text-foreground mt-2">
                {markers.filter((m) => m.category === "X-STR").length}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder={t("catalog.searchPlaceholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </form>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder={t("catalog.filterByCategory")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">{t("catalog.allCategories")}</SelectItem>
                  <SelectItem value="CODIS Core">{t("catalog.categories.CODIS Core")}</SelectItem>
                  <SelectItem value="Other Autosomal">{t("catalog.categories.Autosomal")}</SelectItem>
                  <SelectItem value="Y-STR">{t("catalog.categories.Y-STR")}</SelectItem>
                  <SelectItem value="X-STR">{t("catalog.categories.X-STR")}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedChromosome} onValueChange={setSelectedChromosome}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Chr" />
                </SelectTrigger>
                <SelectContent>
                  {chromosomes.map((chr) => (
                    <SelectItem key={chr} value={chr}>
                      Chr {chr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedRepeatType} onValueChange={setSelectedRepeatType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={t("catalog.repeatType")} />
                </SelectTrigger>
                <SelectContent>
                  {repeatTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-32">
                  <SelectValue placeholder={t("catalog.sortBy")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">{t("catalog.sortOptions.name")}</SelectItem>
                  <SelectItem value="chromosome">{t("catalog.sortOptions.chromosome")}</SelectItem>
                  <SelectItem value="category">{t("catalog.sortOptions.category")}</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <Checkbox id="nist-only" checked={showNistOnly} onCheckedChange={setShowNistOnly} />
                <label
                  htmlFor="nist-only"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t("catalog.nistVerifiedOnly")}
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <div className="text-sm text-muted-foreground">
            {t("catalog.showing")} {filteredMarkers.length} {t("catalog.of")} {markers.length}{" "}
            {t("catalog.markersFound")}
            {showNistOnly && ` (${t("catalog.nistVerifiedOnly")})`}
          </div>
        </div>

        {/* Markers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedMarkers.map((marker) => (
            <Link key={marker.id} href={`/marker/${marker.id}`}>
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-card to-card/50 hover:from-primary/5 hover:to-accent/5">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {marker.name}
                      </CardTitle>
                      <CardDescription className="font-medium">{marker.fullName}</CardDescription>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge variant="secondary" className={getCategoryColor(marker.category)}>
                        {marker.category === "CODIS Core"
                          ? t("catalog.categories.CODIS Core")
                          : marker.category === "Other Autosomal"
                            ? t("catalog.categories.Autosomal")
                            : marker.category === "Y-STR"
                              ? t("catalog.categories.Y-STR")
                              : marker.category === "X-STR"
                                ? t("catalog.categories.X-STR")
                                : marker.category}
                      </Badge>
                      {marker.nistVerified && (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                          NIST
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("catalog.chromosome")}:</span>
                      <span className="font-medium">{marker.chromosome}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("catalog.motif")}:</span>
                      <span className="font-mono font-medium">{marker.motif}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("marker.type")}:</span>
                      <span className="font-medium">{marker.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("catalog.alleles")}:</span>
                      <span className="font-medium">{marker.alleles}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <BarChart3 className="h-3 w-3" />
                        {marker.populations} {t("catalog.populations")}
                      </div>
                      {marker.strbaseUrl && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 text-xs"
                          onClick={(e) => {
                            e.preventDefault()
                            window.open(marker.strbaseUrl, "_blank")
                          }}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          STRBase
                        </Button>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <div className="w-2 h-2 bg-secondary rounded-full"></div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        {/* No Results */}
        {filteredMarkers.length === 0 && (
          <div className="text-center py-12">
            <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t("common.notFound")}</h3>
            <p className="text-muted-foreground">Try adjusting your search terms or filters</p>
          </div>
        )}

        {/* Data Integration Footer */}
        <div className="mt-12 p-6 bg-muted/30 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">{t("catalog.dataIntegration")}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {t("catalog.dataIntegrationDescription")}
            <br />
            <span className="text-sm mt-2 inline-block">
              Sources:{" "}
              <Link
                href="https://strbase.nist.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                NIST STRBase
              </Link>
              {" · "}
              <Link
                href="https://popstr.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                pop.STR
              </Link>
            </span>
          </p>
          <Button variant="outline" asChild>
            <Link href="https://strbase.nist.gov/" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              {t("catalog.visitNistStrbase")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

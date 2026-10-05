export default {
marker: {
  backToCatalog: "Back to Catalog",
  backToGenomeExplorer: "Back to Genome Explorer",
  tabs: {
    overview: "Overview",
    isoalleles: "Isoalleles",
    frequencies: "Frequencies",
    statistics: "Statistics",
    tools: "Tools",
    igv: "IGV Viewer",
    fasta: "FASTA Generator",
  },
  sections: {
    overview: {
      description: "Basic information, genomic coordinates, and reference data",
      tags: ["overview", "basic info", "coordinates", "reference"],
    },
    frequencies: {
      description: "Allele frequency distribution and population panels",
      tags: ["frequencies", "allele frequencies", "population data", "statistics"],
    },
    variants: {
      description: "Variant alleles, isoalleles, and sequence patterns",
      tags: ["variants", "isoalleles", "sequences", "allele patterns"],
    },
    tools: {
      description: "Compatible tools and pipelines for analysis",
      tags: ["tools", "pipelines", "analysis", "compatibility"],
    },
  },
  basicInfo: "Basic Information",
  genomicCoords: "Genomic Coordinates",
  repeatRegion: "Repeat region",
  forwardStrandNote: "Motif and sequences are shown on the forward (+) strand of GRCh38.",
  nistReference: "NIST STRBase Reference",
  nistDescription: "Official reference information from NIST STRBase database",
  chromosome: "Chromosome",
  cytogeneticLocation: "Cytogenetic Location",
  motif: "Motif",
  alternativeMotifs: "Alternative Motifs",
  type: "Type",
  category: "Category",
  build: "Build",
  start: "Start",
  end: "End",
  referenceAllele: "Reference Allele",
  nomenclatureNotes: {
    d6s474:
      "Kits that count repeats with the Hill motif, [AGAT]n [GATA]n, designate this GRCh38 sequence as allele 17. STRhub uses the harmonized designation, 16, recommended by {citation}.",
    dys612:
      "The ForenSeq Universal Analysis Software reports DYS612 alleles six repeats shorter. STRhub numbers alleles over the entire repeat region, as recommended by {citation}.",
  },
  lastUpdated: "Last Updated",
  commonAlleles: "Common Alleles",
  viewInBrowser: "View in UCSC Genome Browser",
  isoallelePatterns: "Isoallele Patterns",
  isoalleleDescription: "Detailed sequence patterns and variations for different alleles",
  referenceSequences: "Reference sequences verified against NIST STRBase",
  reference: "Reference",
  nistVerified: "NIST Verified",
  alleleFreqDistribution: "Allele Frequency Distribution",
  freqSourceNoteNGS:
    "The NGS frequencies on this page come from the **1000 Genomes Project** (Frontanilla et al., 2022) and from **Ribeirão Preto, Brazil** (Valle-Silva et al., 2022). Both studies genotyped sequencing data with HipSTR and report alleles by **fragment length**, not by sequence.",
  freqSourceNoteCE:
    "The CE frequencies of the AFR to OCE groups come from the **STRs Local dataset of pop.STR / SP-SMART (CESGA)**: length-based alleles from capillary electrophoresis.",
  freqDescription: "Population frequency data for different alleles",
  dataSource: "Data source: STRBase – NIST",
  ocePopulationInfo:
    "The Oceania population dataset from pop.STR includes the following population groups: Bougainville (NAN Melanesian) and New Guinea (Papuan).",
  additionalSourceInfo:
    "Allele frequencies in STRhub are derived from the STRs Local dataset of the SP-SMART portal (CESGA), comprising 3.809 genotyped individuals from diverse populations.",
  datasetButton: "Dataset",
  originalPublicationButton: "Original publication",
  populationGroup: "Population Group",
  populationLabels: {
    AFR: "Africa",
    NAM: "Native American",
    EAS: "East Asia",
    CSA: "Central and South Asia",
    EUR: "Europe",
    MES: "Middle East",
    OCE: "Oceania",
    LAT: "Latin America",
    SAS: "South Asian",
  },
  frequencies: {
    groupPopStr: "pop.STR / SP-SMART",
    groupLatam: "Latin America",
    group1000G: "1000 Genomes (Frontanilla et al., 2022)",
    groupRao: "Ribeirão Preto (Valle-Silva et al., 2022)",
    superpopulation1000G: "{name} superpopulation ({code}), 1000 Genomes Project",
    superpopulations1000G: {
      AFR: "African",
      AMR: "Admixed American",
      EAS: "East Asian",
      EUR: "European",
      SAS: "South Asian",
    },
    compare1000GButton: "Compare all {n}",
    compareSource1000G:
      "1000 Genomes Project superpopulations: {pops} (Frontanilla et al., 2022). Each dot is a published frequency; no line is drawn across an allele a population does not have.",
    compareSourcePopStr:
      "pop.STR / SP-SMART population groups: {pops}. Each dot is a published frequency; no line is drawn across an allele a population does not have.",
    region: {
      latam: "LAT",
    },
    xstr: {
      populationLabel: "Population",
      noTables:
        "No published X-STR allele frequency table has been added to STRhub for this locus yet.",
    },
    datasetNotes: {
      provenance:
        "These frequencies are derived from the STRs Local dataset of the SP-SMART portal (CESGA), comprising 3,809 genotyped individuals from diverse populations.",
      populationLabel: "Population groups included",
      populationAfr:
        "Central African Republic (Biaka Pygmies), Democratic Republic of the Congo (Mbuti Pygmies), Kenya (Bantu N.E.), Namibia (San), Nigeria (Yoruba), Senegal (Mandenka), Somalia, and South Africa (Bantu).",
      populationNam:
        "Brazil (Karitiana), Brazil (Surui), Colombia (Colombian), Dominican Republic, Mexico (Maya), and Mexico (Pima).",
      populationEas:
        "Cambodia (Cambodian), China (Dai), China (Daur), China (Han), China (Hezhen), China (Lahu), China (Miaozu), China (Mongola), China (Naxi), China (Oroqen), China (She), China (Tu), China (Tujia), China (Xibo), China (Yizu), Japan (Japanese), and Siberia (Yakut).",
      populationCsa:
        "Populations aggregated as Central–South Asia in the STRs Local dataset (pop.STR / SP-SMART, CESGA).",
      populationSas:
        "China (Uygur), Pakistan (Balochi), Pakistan (Brahui), Pakistan (Burusho), Pakistan (Hazara), Pakistan (Kalash), Pakistan (Makrani), Pakistan (Pathan), and Pakistan (Sindhi).",
      populationEur:
        "France (Basque), France (French), Italy (Bergamo – North Italian), Italy (Sardinian), Italy (Tuscan), N.W. Spain, Orkney Islands (Orcadian), Russia (Russian), Russia Caucasus (Adygei), Sweden, and U.S. Europeans.",
      populationMes:
        "Algeria (Mzab – Mozabite), Israel (Carmel – Druze), Israel (Central – Palestinian), and Israel (Negev – Bedouin).",
      populationOce:
        "Bougainville (NAN Melanesian) and New Guinea (Papuan).",
      populationLatam: "",
      title: "⚠️ Dataset notes (important)",
      shortLine1:
        "The allele frequencies shown here come directly from the STRs Local dataset of SP-SMART / pop.STR.",
      shortLine2:
        "STRhub does not modify, infer, reconstruct, or reinterpret any component of the STRs Local dataset. All methodological limitations originate exclusively from the structure, metadata availability, and design choices of the SP-SMART / pop.STR platform.",
      accordionTrigger: "Read full methodological note",
      full1:
        "All allele frequencies displayed in this section derive directly from the STRs Local dataset of the SP-SMART / pop.STR platform (CESGA). The methodological characteristics and constraints described here are inherent to the original dataset and platform, and do not originate from STRhub’s processing or implementation.",
      full2:
        "In pop.STR, selecting a “kit” acts only as a locus filter, and does not reflect the genotyping technology used in the contributing studies. The STRs Local dataset compiles population data generated mainly through capillary electrophoresis (CE), not NGS, and SP-SMART does not provide technology-specific metadata at locus level. Therefore, STRhub reproduces the dataset exactly as provided, without reconstruction, harmonization beyond nomenclature, or imputation.",
      full3:
        "Although STRs Local offers harmonized allele frequencies across multiple populations, it does not constitute a unified global reference panel. pop.STR delivers populations individually, which is suitable for forensic comparison but not for pooled analyses such as PCA, STRUCTURE, or ADMIXTURE. These limitations reflect the design and scope of the SP-SMART / pop.STR platform rather than any STRhub constraint.",
      referenceLabel: "Reference",
      referenceText:
        "Amigo J, Phillips C, Lareu MV, Carracedo A. The SNPforID and SP-SMART databases: Resources for forensic population genetics. Forensic Sci Int Genet. 2008;2(3):212–217. Dataset: http://spsmart.cesga.es/",
    },
    ngsDatasetDescription_raoValleSilva2022:
      "These allele frequencies originate from a next-generation sequencing study carried out in a Brazilian population sample from Ribeirão Preto, São Paulo, Brazil (Valle-Silva et al., 2022). STRhub shows the allele frequencies of the genotypes called with HipSTR in that study (Supplementary Table 9). In STRhub, the RAO label refers specifically to this Ribeirão Preto NGS dataset. Reference: Valle-Silva G, Frontanilla TS, Ayala J, Donadi EA, Simões AL, Castelli EC, Mendes-Junior CT. Forensic Sci Int Genet. 2022;58:102676. doi:10.1016/j.fsigen.2022.102676.",
    ngs1000G: {
      intro:
        "These allele frequencies are derived from a next-generation sequencing (NGS) study published in 2022, based on 2,504 individuals belonging to 26 populations analyzed by the 1000 Genomes Project Consortium.",
      populationGroupsLabel: "Population groups included",
      datasetNotesTitle: "⚠️ Dataset notes (important)",
      datasetNotesParagraph1:
        "In this study, STR alleles were genotyped from high-coverage whole-genome sequencing data using the HipSTR software. All data are publicly available as part of the published dataset.",
      datasetNotesParagraph2:
        "STRhub does not modify, infer, reconstruct, or reinterpret any component of the original STR dataset. All methodological limitations arise exclusively from the original study design, metadata availability, and the framework from which these data were derived.",
      originalDatasetButton: "Original dataset",
      originalPublicationButton: "Original publication",
    },
    openOriginalPaperButton: "Open original paper",
    compareButton: "Compare",
    compareTooltip:
      "Compares AFR, NAM, EAS, CSA, EUR, MES and OCE populations from the SP-SMART/CESGA dataset",
    ngs1000gTooltip:
      "Compares AFR, AMR, EAS, SAS and EUR from the 1000 Genomes Project Phase 3",
    legendClickHint: "Click a population in the legend to show/hide",
    raoPopulationButtonTooltip:
      "NGS STR panel from a Brazilian sample (Ribeirão Preto; Valle-Silva et al., 2022).",
    latam: {
      selectorHint: "Select a LAT population for this marker.",
      noDataForLocus: "No LAT datasets available for this marker.",
      sampleSize: "n = {n}",
      markerCount: "{count} STR markers",
    },
  },
  statistics: {
    title: "Population Statistics",
    description: "Summary statistics for each CE population (Illumina ForenSeq, pop.STR / SP-SMART).",
    population: "Population",
    noData: "No population statistics available for this marker.",
    sourceIntro: "Source: SP-SMART / pop.STR (CESGA)",
    legendN: "N = sample size",
    legendHobs: "Hobs = observed heterozygosity",
    legendHexp: "Hexp = expected heterozygosity",
    legendFis: "Fis = inbreeding coefficient",
    legendFst: "Fst = fixation index",
    g1kTitle: "Forensic Parameters, 1000 Genomes (NGS)",
    g1kDescription:
      "Five population groups of the 1000 Genomes Project (high-coverage NYGC data), genotypes called with HipSTR, as published in {citation}, Supplementary Table 3.",
    raoTitle: "Forensic Parameters, RAO (NGS)",
    raoDescription:
      "Brazilian population sample from Ribeirão Preto, genotypes called with HipSTR, as published in {citation}, Supplementary Table 9.",
    parametersLegend:
      "N = individuals genotyped; Na = number of alleles; Ho = observed heterozygosity; He = expected heterozygosity; MP = match probability; PD = power of discrimination; PIC = polymorphism information content; PE = power of exclusion.",
  },
  toolsCompatibility: "Tools & Pipelines Compatibility",
  toolsDescription: "STR analysis tools and pipelines that support this marker",
  supported: "Supported",
  configurableRequiresTargets: "Configurable (requires targets)",
  viewAllToolsPipelines: "View all tools & pipelines",
  viewFullToolProfile: "View full tool profile",
  notSupported: "Not Supported",
  originalPublication: "Original Publication",
  githubRepository: "GitHub Repository",
  technology: "Technology",
  descriptionPattern: "{marker} is an STR locus on chromosome {chromosome}.",
  inputFormat: "Input Format",
  outputFormat: "Output Format",
  nativePanels: "Original bed file",
  panel: "Panel",
  configurable: "Configurable",
  wrapper: "Wrapper",
  onlineVersion: "Online Version",
  lastChecked: "Last Checked",
  noCompatibleTools: "No compatible tools found for this marker",
  configuration: "Configuration",
  targetFileFormat: "Target File Format",
  customizableTargets: "Customizable Targets",
  customizableTargetsLabel: "Customizable targets",
  flankingBpRecommended: "Flanking BP Recommended",
  compatibility: "Compatibility",
  status: "Status",
  maintained: "Maintained",
  archived: "Archived",
  maintenance: "Maintenance",
  "maintenance.active": "Active",
  "maintenance.community-maintained": "Community Maintained",
  "maintenance.limited": "Limited",
  "maintenance.unmaintained": "Unmaintained",
  maintainer: "Maintainer",
  license: "License",
  lastRelease: "Last Release",
  ontModels: "ONT Models",
  dockerImage: "Docker Image",
  interfaces: "Interfaces",
  interfaceAvailable: "Interface available:",
  limitations: "Limitations",
  maintainerInitiatives: "Maintainer Initiatives",
  repository: "Repository",
  documentation: "Documentation",
  notes: "Notes",
  addNewTool: "Add New Tool",
  contactUs: "contact us",
  toolsDisclaimer: "All software tools listed in this section are open-access and third-party resources. STRhub maintains no commercial relationship with the developers of these tools and receives no financial compensation for their inclusion. The catalog is provided solely for educational and research purposes.",
  toolsDisclaimerShort: "Third-party open-access tools. No commercial relationship.",
  toolsNote:
    "Tool compatibility is based on marker characteristics and community validation. GitHub repositories and publication references are provided for each supported tool. Always verify compatibility with your specific analysis requirements and check for the latest versions.",
  igvViewer: "IGV Genome Viewer",
  igvDescription: "Interactive genomic visualization using IGV.js",
  igvIntegration: "IGV Viewer Integration",
  igvText: "Interactive genome browser will be loaded here showing the {marker} locus",
  launchIGV: "Launch IGV Viewer",
  fastaGenerator: "FASTA Sequence Generator",
  fastaDescription: "Generate FASTA sequences for the {marker} marker",
  flankingRegion: "Flanking Region (bp)",
  generateFasta: "Generate FASTA Sequence",
  generatedSequence: "Generated Sequence",
  downloadFasta: "Download FASTA",
  variantAlleles: "Variant Alleles",
  variantAllelesDescription: "All variant alleles reported in STRbase for this marker",
  noVariantsForMarker: "No variant alleles have been reported in STRbase for this marker yet.",
  addNewVariant: "Add a new variant",
  alleleDesignation: "Allele Designation",
  strnamingName: "STRNaming 1.2.1 name (ISFG minimum range)",
  strnamingNotAvailable: "n/a",
  strnamingNotCovered: "This STRbase sequence does not span the ISFG minimum range",
  sequence: "Sequence",
  noFrequenciesMessage:
    "No data available. Population frequencies for this locus are being curated.",
  contributeDataCta: "Contribute data",
  download: "Download",
  downloadCSV: "Download CSV",
  source: "Source",
  viewInStrbase: "View in STRBase",
  descriptionTemplate: "{marker} is an STR locus on chromosome {chromosome}.",
  tools: {
    hipstr: {
      interfaces: {
        hipstrUi: {
          description:
            "Web interface developed and maintained by STRhub for running, visualizing, and exploring HipSTR results interactively.",
        },
      },
      limitations: {
        requiresAligned:
          "Requires aligned BAM/CRAM files and performs internal realignment (FASTQ not supported).",
        illuminaOnly:
          "Designed for Illumina short-read data; not compatible with ONT or PacBio.",
      },
      notes:
        "Actively maintained by Tamara Frontanilla as part of the STRhub project. HipSTR-UI enables interactive execution, allele visualization, and population data integration for forensic and research workflows.",
    },
    longtr: {
      config: {
        targetFileFormat:
          "BED: chrom, 1-based start, end, motif(s), optional locus name",
      },
      limitations: {
        bamRequirements:
          "Requires indel-sensitive long-read BAM/CRAM (sorted, indexed) and a reference FASTA matching the alignment build.",
        activeDevelopment:
          "Under active development; CLI parameters and output formats may change between releases.",
      },
      notes:
        "LongTR is inspired by the HipSTR framework and adapted for PacBio HiFi and Oxford Nanopore long reads, genotyping STRs and VNTRs to bgzipped VCF. Available via conda (bioconda) or GitHub.",
    },
    gangstr: {
      limitations: {
        illuminaOnly:
          "Optimized for Illumina short-read data; not compatible with ONT or PacBio.",
        requiresBamBed:
          "Requires BAM/CRAM alignment and BED file with defined loci.",
      },
      notes:
        "GangSTR is integrated into the STRhub catalog for benchmarking and cross-platform comparison. It supports locus-based analysis of STR repeat expansions and is widely used for population-scale Illumina datasets.",
    },
    strspy: {
      config: {
        targetFileFormat:
          "BED or JSON: STR locus definitions and flanking sequences",
      },
      limitations: {
        longReadPanels:
          "Designed for long-read forensic STR panels (ONT or PacBio); requires a reference file of loci.",
        notWgs: "Not designed for whole-genome (WGS) applications.",
      },
      notes:
        "STRspy is integrated into the STRhub ecosystem for forensic and population STR analysis using long-read data (ONT or PacBio). Its modular design allows visualization, benchmarking, and cross-compatibility with HipSTR-UI datasets.",
    },
    fdstools: {
      config: {
        targetFileFormat: "Built-in or custom forensic STR kit definition",
      },
      limitations: {
        fastqOnly:
          "Accepts FASTQ from any MPS platform; BAM not currently supported.",
        homopolymerScrutiny:
          "Best suited to Illumina short reads; apply extra scrutiny to homopolymer-prone platforms.",
      },
      notes:
        "FDSTools is a Python toolkit for forensic MPS data analysis, including stutter characterization, noise filtering, and automatic allele detection with STRNaming nomenclature.",
    },
    straitrazor: {
      config: {
        targetFileFormat: "FASTA or CSV panel defining STR loci and motifs",
      },
      limitations: {
        fastqOnly:
          "Accepts FASTQ from any MPS platform; BAM not currently supported.",
        requiresPanel: "Requires panel configuration.",
        homopolymerScrutiny:
          "Best suited to Illumina short reads; apply extra scrutiny to homopolymer-prone platforms.",
        noAlignment:
          "Does not perform read alignment; motif matching is direct.",
      },
      notes:
        "STRait Razor is included in the STRhub ecosystem for targeted forensic STR analysis. Its lightweight motif-matching algorithm makes it suitable for teaching and training in STR interpretation.",
    },
    toastr: {
      limitations: {
        forensicNgs:
          "Designed for forensic NGS STR analysis; requires STRaitRazor reference panel.",
        webInterfaceInactive:
          "Web interface inactive on some legacy servers.",
      },
      notes:
        "ToaSTR is a browser-based forensic STR genotyping tool for MPS data, with sequence-aware stutter modeling, automatic allele calling, and PDF reporting. The Dockerized distribution (labconowl/toastr) runs on macOS, Windows, and Linux. Integrated into STRhub for forensic STR analysis and reference validation.",
    },
  },
  summary: {
    kind: {
      codis: "one of the 20 CODIS core loci",
      ess: "part of the European Standard Set",
      autosomal: "an autosomal STR outside the CODIS core set",
      x: "an X-chromosome STR (X-STR)",
      y: "a Y-chromosome STR (Y-STR)",
    },
    introTyped:
      "{name} is a {type} short tandem repeat (STR) locus on chromosome {chromosome}{cytoband}, {kind}.",
    introUntyped:
      "{name} is a short tandem repeat (STR) locus on chromosome {chromosome}{cytoband}, {kind}.",
    variants: "STRbase reports {variants} across {designations}.",
    variantCount_one: "{count} sequence variant",
    variantCount_other: "{count} sequence variants",
    designationCount_one: "{count} allele designation",
    designationCount_other: "{count} allele designations",
    structureTitle: "Sequence structure (FSSG)",
    structureSource:
      "ISFG minimum range, bracketing and kit coverage from the Forensic Sequence Structure Guide, {version} ({strider}; distributed as {file}).",
    canonicalLabel: "STRNaming Formatted ISFG Minimum Range for Common Alleles (FSSG)",
    referenceNameLabel: "Reference allele (GRCh38) named with STRNaming 1.2.1",
    historicalLabel: "Historical bracketing (2016-2023)",
    minimumRangeLabel: "ISFG minimum range (GRCh38)",
    basePairs: "{n} bp",
    kitsLabel: "MPS kits covering this locus",
    kitRange: "Sequenced range: {chrom}:{start}-{end} · {length} bp",
    kitColumn: "FSSG column: {column}",
    kitRestricted: "The FSSG restricts this locus to the kit shown.",
    kitMinimumRange: "ISFG minimum range: {chrom}:{start}-{end} · {length} bp",
    kitCoversMinimum: "Covers the whole ISFG minimum range.",
    kitPartialMinimum: "Does not cover the whole ISFG minimum range.",
    kitPartialLegend:
      "Kit range does not cover the whole ISFG minimum range of this locus ({range}), according to the kit ranges in the FSSG. Bases of the minimum range outside a kit's range are not sequenced by that kit; bases filled in from the reference should be identified as such.",
    fssgNotesLabel: "Notes from the FSSG",
    ceEquivalentLabel: "CE equivalent of the GRCh38 reference (FSSG)",
    crossReferenceLabel: "Sequence given by reference in the FSSG",
    crossReferenceNote:
      "The FSSG gives this row's sequence by pointing to another row instead of writing it out. STRhub shows no STRNaming name here until that sequence is resolved and reviewed.",
    kitReversed: "Written in the FSSG from {from} to {to} (reverse strand).",
    multiCopyIntro:
      "This locus has two copies in GRCh38, and the FSSG describes each one in its own row: {copies}. The ranges, CE equivalents and names below belong to the copy named above each block. A typing result usually lists the two alleles of the locus together; their order does not say which physical copy each one comes from.",
    frequenciesTitle: "Allele frequencies at a glance",
    frequenciesIntro:
      "Most common allele per population group, with its frequency and the sample size, in the capillary electrophoresis data of",
    modalAlleleShort: "Allele {allele}",
    sampleSize: "n = {n}",
    frequenciesTableCaption:
      "Allele frequencies by population group (pop.STR, CE). Alleles absent from every group are omitted.",
    openFrequencies: "Open the interactive frequency charts",
    openVariants: "See the variant sequences",
    relatedTitle: "Related markers",
    relatedSameChromosome: "Other STR markers on chromosome {chromosome}",
    relatedKind: {
      codis: "Other CODIS core loci",
      ess: "Other European Standard Set loci",
      autosomal: "Other autosomal STRs",
      x: "Other X-STRs",
      y: "Other Y-STRs",
    },
    relatedCatalog: "Browse the full STR marker catalog",
  },
  repeatTypes: {
    tetranucleotide: "Tetranucleotide",
    trinucleotide: "Trinucleotide",
    pentanucleotide: "Pentanucleotide",
    hexanucleotide: "Hexanucleotide",
    dinucleotide: "Dinucleotide",
    mononucleotide: "Mononucleotide",
    complex: "Complex",
  },
  categoryLabels: {
    codisCore: "CODIS Core STRs",
    otherAutosomal: "Other Autosomal STRs",
    xStr: "X-STRs",
    yStr: "Y-STRs",
  },
},
overview: {
  motifExplorer: {
    title: "Explore internal sequence structure",
    desc: "See how the STRNaming name of the reference allele maps onto its sequence: repeat blocks, flanking regions and flanking variants.",
    button: "Open STR Motif Explorer",
  },
  igvViewer: {
    title: "See the reads at this locus",
    desc: "Open the built-in IGV viewer on the hg38 window of this marker with a 1000 Genomes sample.",
    button: "Open IGV Viewer",
  },
},
} as const

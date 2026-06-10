export default {
tools: {
  title: "Tools & Pipelines",
  subtitle: "Analysis & Processing Tools",
  description:
    "Comprehensive suite of bioinformatics tools and pipelines for STR analysis, from raw data processing to population genetics.",
  hero: {
    title: "Powerful Tools for STR Analysis",
    description: "Comprehensive collection of tools, pipelines, and tutorials for Short Tandem Repeat analysis. From genotyping to visualization, find everything you need for your research.",
    ctaCollaborate: "Contribute a tool or tutorial",
    disclaimer: "All software tools listed in this section are open-access. STRhub maintains no commercial relationship with the developers of these tools and receives no financial compensation for their inclusion.",
  },
  header: {
    backToStrhub: "← Back to STRhub",
  },
  common: {
    keyFeatures: "Key Features:",
    github: "GitHub",
    website: "Website",
    originalPublication: "Original publication",
    uiPublication: "User interface publication",
    inputLabel: "Input",
    outputLabel: "Output",
    viewDetails: "View details",
    hideDetails: "Hide details",
    detailsNotCurated: "Details not yet curated.",
  },
  badges: {
    technology: {
      illumina: "Illumina",
      ont: "ONT",
      pacbio: "PacBio",
      multi_platform: "Multi-platform",
      targeted: "Targeted",
    },
    readType: {
      short_read: "Short-read",
      long_read: "Long-read",
      any: "Any",
    },
    analysis: {
      genotyping: "Genotyping",
      annotation: "Annotation",
      qc_database: "QC / Database",
    },
    usage: {
      runs_locally: "Runs locally",
      online_tool: "Online tool",
      graphical_interface: "Graphical interface",
    },
  },
  filters: {
    title: "Filters",
    filtersButton: "Filters",
    clear: "Clear",
    technology: "Technology",
    analysis: "Analysis",
    usage: "Usage",
    all: "All",
    resetFilters: "Reset filters",
    chipUsage: {
      runs_locally: "Local",
      online_tool: "Online",
      graphical_interface: "Graphical",
    },
    technologyOptions: {
      illumina: "Illumina",
      ont: "ONT",
      pacbio: "PacBio",
      multi_platform: "Multi-platform",
    },
    analysisOptions: {
      genotyping: "Genotyping",
      annotation: "Annotation",
      qc_database: "QC / Database",
    },
    usageOptions: {
      runs_locally: "Runs locally",
      online_tool: "Online tool",
      graphical_interface: "Graphical interface",
    },
  },
  nanomnt: {
    title: "NanoMnT",
    summary: "ONT-based STR genotyping from aligned long-read data with locus-level reporting.",
    features: {
      1: "STR genotyping from Nanopore long-read alignments",
      2: "Locus-level allele and coverage reporting",
      3: "Optimized for noisy long-read sequencing data",
    },
  },
  strkit: {
    title: "STRkit",
    summary: "Long-read STR genotyping toolkit with model-based allele inference.",
    features: {
      1: "Model-based STR allele length estimation",
      2: "Confidence intervals via statistical bootstrapping",
      3: "Optional phasing with nearby SNVs",
    },
  },
  nastra: {
    title: "NASTRA",
    summary: "Reference-free STR analysis for forensic markers using structural modeling.",
    features: {
      1: "Structure-aware STR allele calling",
      2: "Reference-free STR detection approach",
      3: "Designed for forensic STR markers",
    },
  },
  nanostr: {
    title: "NanoSTR",
    summary: "Targeted STR typing from Nanopore long-read data.",
    features: {
      1: "Targeted STR genotyping from Nanopore reads",
      2: "Read-length ranking for allele inference",
      3: "Fast processing for targeted STR panels",
    },
  },
  codeLabels: {
    trimmomatic: "Trimmomatic",
    fastp: "fastp",
    bwaAlignment: "BWA-MEM2 alignment",
    convertSortIndex: "Convert / sort / index",
    removeDuplicates: "Remove duplicates",
    depthCoverage: "Depth coverage",
    regionInspection: "Region inspection",
    quickVisualization: "Quick visualization",
    doradoBasecalling: "Basecalling (POD5 → BAM)",
    bam2fastq: "Convert to FASTQ",
    pod5Convert: "POD5 convert",
    minimap2Ont: "Alignment to hg38",
    nanoplot: "QC with NanoPlot",
  },
  hipstr: {
    title: "HipSTR",
    description: "STR genotyping from aligned Illumina short-read data (BAM/CRAM) with VCF output.",
    category: "Genotyping",
    language: "C++",
    features: {
      1: "Haplotype-based STR genotyping with stutter modeling",
      2: "Local realignment of reads around STR loci",
      3: "Joint multi-sample genotyping for population analysis",
    },
  },
  longtr: {
    title: "LongTR",
    description:
      "Tandem repeat genotyping from long reads (PacBio HiFi and Oxford Nanopore), inspired by the HipSTR framework and adapted for long-read sequencing data. Outputs bgzipped VCF files.",
    category: "Genotyping",
    language: "C++",
    features: {
      1: "Genotypes tandem repeats (STRs and VNTRs) from long-read BAM/CRAM using a TR regions BED file",
      2: "Workflow options for PacBio HiFi and Oxford Nanopore data",
      3: "Supports phased BAM inputs",
      4: "VCF output with INFO/FORMAT fields for downstream filtering",
    },
  },
  gangstr: {
    title: "GangSTR",
    description: "Genome-wide STR genotyping from aligned short-read data with VCF output.",
    category: "Profiling",
    language: "C++",
    features: {
      1: "Genome-wide STR genotyping from short-read sequencing",
      2: "Detection of repeat expansions and contractions",
      3: "Statistical modeling of STR length distributions",
    },
  },
  tutorials: {
    title: "Interactive Tutorials",
    comingSoon: "Coming soon",
  },
  categories: {
    analysis: "Analysis Tools",
    processing: "Data Processing",
    visualization: "Visualization",
    statistics: "Statistics",
  },
  learnMore: "Learn More",
  documentation: "Documentation",
  github: "View on GitHub",
  igvHelp: {
    sectionTitle: "Guide to interpreting the IGV view",
    howToRead: "How to read this IGV view",
    readAligned: "Each horizontal line is a sequencing read aligned to the reference genome",
    stackedReads: "Stacked reads indicate coverage depth",
    coloredBases: "Colored bases indicate mismatches relative to the reference",
    zoomIn: "Use the + button to zoom in until individual bases are visible",
    commonPatterns: "Common visual patterns",
    insertion: "\"I\" inside a read = insertion relative to the reference (not a new allele)",
    deletion: "A thin gap / black line within a read = deletion relative to the reference",
    clickRead: "Click a read or variant to see alignment details (CIGAR, mapping quality, position)",
    ceVsIgvTitle: "From CE peaks to NGS reads",
    ceTitle: "Capillary Electrophoresis (CE)",
    cePeaks: "Peaks summarize signal per allele",
    ceNoReads: "Individual reads are not visible",
    igvTitle: "IGV (NGS read-level view)",
    igvSingleRead: "Each line is a single sequencing read",
    igvInferred: "Alleles are inferred from many reads",
    igvIndels: "Insertions and deletions are shown explicitly",
    keySentence: "CE summarizes signal per allele. IGV visualizes NGS data as individual reads. These views are complementary, not interchangeable.",
  },
  igvViewer: {
    pageTitle: "IGV Viewer",
    pageSubtitle: "One-click integration with IGV for genomic visualization and analysis.",
    strMarker: "STR Marker",
    selectMarker: "Select a marker",
    sample: "Sample",
    selectSample: "Select a sample",
    launchIgv: "Launch IGV Viewer",
    openUcsc: "Open in UCSC Browser",
    viewerTitle: "Interactive Genome Viewer",
    dataIntegration: "Data Integration",
    dataIntegrationPre: "This viewer integrates the open-source",
    dataIntegrationMid: "library for interactive genomic visualization and sample alignment data from the",
    dataIntegrationPost: "Demo BAM/BAI files are open data resources, used here for educational and research purposes.",
    genomesLabel: "1000 Genomes Project",
    openDataTag: "IGV · 1000 Genomes Project (open data)",
    igvStatusLabel: "IGV status:",
    igvStatusReady: "Ready",
    igvStatusIdle: "Idle (click Launch IGV Viewer)",
    igvErrorAlert: "IGV could not load. Check browser console for details.",
  },
  commands: {
    title: "Essential Bioinformatics Commands",
    card1: {
      title: "Essential Read Processing Commands",
      subtitle: "For cleaning, filtering, and preparing FASTQ reads before genotyping.",
      features: {
        1: "Trim adapters and low-quality bases",
        2: "Filter out too-short or poor-quality reads",
        3: "Prepare clean FASTQ files for alignment",
      },
      info: {
        trimmomatic: "Cleans paired-end reads by removing adapters and low-quality bases.\nImproves alignment accuracy.\nOutputs cleaned reads (paired + single reads if one mate is removed).",
        fastp: "Fast all-in-one read cleaner with automatic adapter detection.\nProduces filtered reads and a QC report.\nWidely used in modern pipelines.",
      },
      commands: {
        trimmomatic: "trimmomatic PE sample_R1.fastq sample_R2.fastq \\\n  output_R1_paired.fastq output_R1_unpaired.fastq \\\n  output_R2_paired.fastq output_R2_unpaired.fastq \\\n  ILLUMINACLIP:adapters.fa:2:30:10 SLIDINGWINDOW:4:20 MINLEN:50",
        fastp: "fastp -i sample_R1.fastq -I sample_R2.fastq \\\n      -o clean_R1.fastq -O clean_R2.fastq \\\n      --detect_adapter_for_pe --html report.html",
      },
    },
    card2: {
      title: "Alignment & BAM Processing Essentials",
      subtitle: "For aligning reads and generating ready-to-analyze BAM files.",
      features: {
        1: "High-quality alignment",
        2: "Sorting and indexing",
        3: "BAM cleanup operations",
      },
      info: {
        bwa: "Aligns Illumina short reads to a reference genome.\nProduces a SAM file with genomic positions.\nStandard tool for short-read data.",
        samtools: "Converts SAM to BAM, sorts reads by position, then indexes the file.\nRequired for IGV, depth calculation, and most downstream analyses.\nAllows fast access to specific regions.",
        rmdup: "Marks or removes PCR duplicates (mainly useful for WGS/WES).\nIn STR amplicon data, duplicates may represent real reads.\nUse with caution.",
      },
      commands: {
        bwa: "bwa-mem2 mem reference.fasta sample_R1.fastq sample_R2.fastq > sample.sam",
        samtools: "samtools view -bS sample.sam | samtools sort -o sample.sorted.bam\nsamtools index sample.sorted.bam",
        rmdup: "samtools rmdup sample.sorted.bam sample.rmdup.bam",
      },
    },
    card3: {
      title: "Inspecting STR Regions & Coverage",
      subtitle: "For exploring coverage, flanking regions, and STR quality signals.",
      features: {
        1: "Visualize STR flanking regions",
        2: "Inspect soft-clips and misalignments",
        3: "Evaluate STR coverage depth",
      },
      info: {
        depth: "Reports how many reads cover each base in a region.\nUseful for STR coverage assessment and QC.\nModify chr:start-end for your locus.",
        view: "Shows all reads aligned to a selected region.\nUseful for checking mismatches and alignment issues near STRs.\nHelpful for troubleshooting.",
        tview: "Text-based viewer for BAM files with a reference sequence.\nAllows quick inspection without IGV.\nUseful for rapid checks.",
      },
      commands: {
        depth: "samtools depth -r chr12:100000-100300 sample.bam > depth.txt",
        view: "samtools view sample.bam chr12:100000-100300",
        tview: "samtools tview sample.bam reference.fasta",
      },
    },
    nanopore: {
      title: "Nanopore (ONT) Essentials",
      subtitle: "Minimal pipeline from raw ONT signals to aligned reads.",
      features: {
        1: "Basecall POD5 → reads (unaligned BAM)",
        2: "Align, sort & index BAM (minimap2 + samtools)",
        3: "QC metrics with NanoPlot",
      },
      info: {
        dorado: "Converts raw ONT signal (POD5) into DNA sequences.\nOutput is an unaligned BAM file.",
        minimap2: "Aligns reads to the human reference genome (hg38),\nthen sorts and indexes the BAM file.",
        nanoplot: "Generates quality metrics and plots from BAM files\n(read length, quality, yield).",
      },
      commands: {
        dorado: "dorado basecaller dna_r10.4.1_e8.2_400bps_sup pod5/ > reads.bam",
        minimap2: "samtools fastq reads.bam | minimap2 -ax map-ont hg38.fa - | samtools sort -o aln.bam - && samtools index aln.bam",
        nanoplot: "NanoPlot --bam aln.bam --outdir nanoplot_out/",
      },
    },
    installation: {
      title: "Installation Requirements",
      intro: "The tools shown above do not come pre-installed. To run these commands, you need to install the corresponding bioinformatics utilities according to your operating system.",
      linuxTitle: "Linux (Ubuntu/Debian)",
      macTitle: "macOS (Homebrew)",
      windowsTitle: "Windows (WSL2 recommended)",
      windowsNote: "Bioinformatics tools are not supported natively on Windows. Use WSL2 (Ubuntu) or a Linux container for full compatibility.",
      guideSoon: "A full step-by-step installation guide for each OS will be added soon.",
      nanoporeTitle: "Nanopore utilities (POD5 tools, NanoPlot, pycoQC)",
      nanoporeCmd: "pip install pod5 nanoplot pycoqc",
      nanoporeNote: "Dorado installation depends on your platform and GPU availability; obtain precompiled binaries from Oxford Nanopore releases.",
      nanoporePythonNote: "Long-read tools may require Python ≥ 3.8 and sufficient disk space for basecalling models.",
    },
  },
  straitrazor: {
    title: "STRait Razor",
    description: "Motif-based STR allele calling from FASTQ for targeted forensic panels, with CLI and online version.",
    tags: {
      category: "Genotyping",
      language: "R",
    },
    features: {
      1: "Motif-based STR allele detection from FASTQ reads",
      2: "Configurable for forensic STR marker panels",
      3: "Best suited for Illumina short reads; apply extra scrutiny on homopolymer-prone platforms",
    },
    buttons: {
      github: "GitHub",
      paper: "Original publication",
      online: "Online Version",
    },
  },
  toastr: {
    title: "toaSTR",
    description:
      "Browser-based forensic STR genotyping tool for MPS data, with sequence-aware stutter modeling, automatic allele calling, and ISFG-compliant PDF reporting.",
    tags: {
      category: "Genotyping",
      language: "Docker",
    },
    features: {
      1: "Forensic STR genotyping in the browser from MPS data",
      2: "Sequence-aware stutter modeling and automatic allele calling",
      3: "Per-allele coverage reporting and interactive visualization",
    },
    buttons: {
      github: "GitHub",
      paper: "Original publication",
    },
  },
  strnaming: {
    title: "STRNaming",
    description: "Unbiased method to automatically generate short, informative, and human-readable descriptions of STR alleles.",
    tags: {
      annotation: "Annotation",
      forensic: "Forensic",
      webtool: "Web",
    },
    features: {
      1: "Automated generation of standardized STR allele names",
      2: "Sequence-based allele description across loci",
      3: "Human-readable nomenclature for forensic sequencing",
    },
    buttons: {
      website: "Website",
    },
  },
  fdstools: {
    title: "FDSTools",
    description: "Python package for analysis of forensic NGS data: characterisation and filtering of PCR stutter and sequencing noise, and automatic allele detection. Integrates STRNaming for nomenclature.",
    tags: {
      category: "Analysis",
      language: "Python",
    },
    features: {
      1: "Stutter and PCR/sequencing noise characterisation and correction",
      2: "Automatic allele detection from FASTQ in targeted MPS data",
      3: "Best suited for Illumina short reads; apply extra scrutiny on homopolymer-prone platforms",
    },
    buttons: {
      website: "Website",
    },
  },
  strider: {
    title: "STRidER",
    description: "Curated online STR allele-frequency population database providing high-quality genotype probability estimates and autosomal STR quality control.",
    tags: {
      population: "Population data",
      qc: "Quality control",
      webtool: "Web",
    },
    features: {
      1: "Curated autosomal STR allele frequency database",
      2: "Centralized quality control for population datasets",
      3: "Reliable genotype probability estimation for forensic analysis",
    },
    buttons: {
      website: "Website",
    },
  },
  strspy: {
    title: "STRspy",
    description: "ONT-based STR genotyping toolkit with tabular output.",
    tags: {
      category: "Analysis",
      language: "Python",
    },
    features: {
      1: "STR allele calling from Nanopore long-read sequencing",
      2: "Sequence-level allele resolution using reference databases",
      3: "Designed for forensic STR profiling",
    },
    buttons: {
      github: "GitHub",
      paper: "Original publication",
    },
  },
},
fastaGeneratorPage: {
  languageLabel: "Current language",
  title: "FASTA Generator",
  subtitle: "Generate custom FASTA sequences for research and analysis.",
  config: {
    title: "Sequence configuration parameters",
    markerLabel: "STR Marker",
    markerPlaceholder: "Select a marker",
    allelesLabel: "Alleles (list or range)",
    allelesPlaceholder: "e.g. 10-12 or 9,10,11",
    flankingLabel: "Flanking Region (bp per side)",
    outputLabel: "Output Type",
    generateButton: "Generate Sequence",
  },
  output: {
    title: "Generated Sequence",
    description: "Your generated FASTA sequence will appear here",
    emptyState:
      'Select a marker and click "Generate Sequence" to begin',
    copyButton: "Copy",
    downloadButton: "Download FASTA",
  },
  messages: {
    enterAlleles: "Please enter alleles (e.g. 10-12 or 9,10,11)",
    markerNotFound: "Marker not found in list.",
    errorPrefix: "ERROR",
  },
  about: {
    title: "About FASTA Generation",
    intro:
      "This module produces high-quality FASTA sequences for Short Tandem Repeat (STR) markers, using curated reference regions derived from GRCh38.",
    detail:
      "Each generated sequence represents the expected genomic structure of the STR locus, with customizable upstream and downstream flanking regions.",
    overview: {
      title: "Overview",
      paragraphs: [
        "STRhub's FASTA Generator allows researchers to explore allelic variability by simulating STR repeat patterns with precise genomic context.",
        "Users can define allele ranges, adjust flanking lengths, and export the resulting sequences in several standardized formats.",
      ],
    },
    features: {
      title: "Features",
      items: [
        "Full support for CODIS core and extended STR markers",
        "Reference-based slices aligned to GRCh38",
        "Customizable flanking regions (0–200 bp per side)",
        "Multiple export formats: Standard FASTA, Reference-style FASTA, Multi-FASTA, and Tabular CSV",
        "Direct download and copy options",
      ],
    },
    useCases: {
      title: "Use cases",
      items: [
        "Forensic and population genetics research",
        "Allelic reconstruction and in silico analysis",
        "Primer design and assay validation",
        "Educational and training purposes in forensic genomics",
      ],
    },
  },
},
motifExplorerPage: {
  title: "STR Motif Explorer",
  subtitle: "Visualize canonical STR repeat motifs and interruptions for selected markers.",
  header: {
    backLink: "← Back to STRhub",
  },
  fields: {
    marker: {
      label: "STR Marker",
    },
    viewMode: {
      sequence: "Sequence highlight",
      schematic: "Motif schematic",
      text: "Motif description",
    },
  },
  cards: {
    configuration: {
      title: "Configuration",
      kitLabel: "Kit / reference sequence",
      markerPlaceholder: "Select a marker",
      kitPlaceholder: "Select a kit",
      emptyState: "Please select a marker from the configuration panel.",
    },
    visualization: {
      title: "Exploring the structure of {marker}",
    },
  },
  states: {
    noSequence: "Sequence highlight mode is not available for this marker.",
  },
  help: {
    general:
      "Displays the full STR allele sequence with flanking regions, repeat units, and internal variants highlighted.",
  },
  scientificNote:
    "Scientific note: Only the uninterrupted canonical repeat block contributes to the allele designation. Motif-like copies in the flanks or interruptions are visual cues and do not change the allele size.",
  sourceLabel: "Source",
  sourceButtonLabel: "Open original publication",
  labels: {
    canonicalPattern: "Canonical repeat pattern:",
  },
  legend: {
    repeat: "Repeat unit",
    interruption: "Interruption / internal variant",
    other: "Other / schematic element",
    flank: "Flanking region",
    flankingMotifLike: "Motif unit in flanking region, excluded from allele calling.",
  },
  summary: {
    caption:
      "Summary of repeat structure: repeat units are shown as MOTIF[n]; 'flank' marks non-repetitive regions.",
  },
  explanation: {
    generic: "",
  },
  sequenceInterpretationTitle: "How to interpret the sequence above?",
  sequenceExample: {
    tooltip: {
      repeat: "Repeat motif (occurrence of the canonical motif; see note below)",
      flank: "Flanking region — not counted",
      interruption: "Interruption / internal variant inside the repeat region",
    },
    note: "Note: Not every occurrence of the repeat motif is counted for the allele size. Only the core repeat block defined by the motif structure contributes to the allele designation.",
  },
  sequenceSection: {
    representativeTitle:
      "Representative internal sequence structure of allele {allele} ({kit})",
    note:
      "Note: Only the core continuous repeat block contributes to the allele designation. Additional motif-like copies outside this block are not counted in the allele size.",
    structureLabel: "Structure",
    flankLabel: "flank",
    legendTitle: "Legend:",
  },
  tooltipsShort: {
    repeat: "Canonical repeat that counts toward the allele size.",
    internal: "Internal variant inside the repeat block; does not add repeats.",
    flanking: "Flanking region",
    flankingMotifLike:
      "Motif unit in flanking region, excluded from allele calling.",
  },
  tooltipsLong: {
    repeat:
      "These canonical repeats make up the allele size. Each uninterrupted repeat contributes fully to the allele designation.",
    internal:
      "Interruptions or insertions occur within the repeat block. They are informative for sequence-based alleles but do not increase the repeat count.",
    flanking:
      "Flanking regions are upstream or downstream DNA that frame the STR locus. They stabilize the assay but are not counted toward the allele.",
    flankingMotifLike:
      "Motif unit in flanking region, excluded from allele calling.",
  },
},
} as const

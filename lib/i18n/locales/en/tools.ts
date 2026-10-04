export default {
tools: {
  title: "Tools & Pipelines",
  subtitle: "Analysis & Processing Tools",
  description:
    "Comprehensive suite of bioinformatics tools and pipelines for STR analysis, from raw data processing to population genetics.",
  builtIn: {
    title: "STRhub interactive tools",
    description: "Built into STRhub: run them in the browser, no installation.",
  },
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
    show: "Show guide",
    hide: "Hide guide",
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
    launchIgv: "Load reads in IGV",
    launchIgvAria: "Load reads in IGV: {sample} at {marker}, in the viewer on this page",
    openUcsc: "Open in UCSC Genome Browser",
    openUcscAria: "Open in UCSC Genome Browser: GRCh38 region of {marker} (opens in a new tab)",
    viewerTitle: "Interactive Genome Viewer",
    dataIntegration: "Data Integration",
    dataIntegrationPre: "This viewer integrates the open-source",
    dataIntegrationMid: "library for interactive genomic visualization and sample alignment data from the",
    dataIntegrationPost: "Demo BAM/BAI files are open data resources, used here for educational and research purposes.",
    genomesLabel: "1000 Genomes Project",
    igvStatusLabel: "IGV status:",
    igvStatusReady: "Ready",
    igvStatusIdle: "Not started",
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
      "Browser-based forensic STR genotyping tool for MPS data, with sequence-aware stutter modeling, automatic allele calling, and PDF reporting.",
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
    description: "Long-read STR genotyping toolkit (ONT and PacBio) with tabular output.",
    tags: {
      category: "Analysis",
      language: "Python",
    },
    features: {
      1: "STR allele calling from long-read sequencing (ONT and PacBio)",
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
  subtitle:
    "Simplified motif-based STR sequence constructs with GRCh38 reference flanks. **For educational purposes.**",
  config: {
    title: "Sequence configuration parameters",
    markerLabel: "STR Marker",
    markerPlaceholder: "Select a marker",
    allelesLabel: "Repeat counts (list or range)",
    allelesPlaceholder: "e.g. 10-12 or 9,10,11",
    allelesHint:
      "Whole numbers from 1 to {max} (a technical input limit of this tool): each value is the number of copies of the construction motif, which the output header reports. Microvariants (for example 9.3) are not currently supported. For complex loci the repeat count is not necessarily equivalent to a forensic CE allele designation.",
    flankingLabel: "Flanking Region (bp per side)",
    outputLabel: "Output Type",
    referenceLabel: "Reference genome",
    referenceHint: "Flanking sequence is cut from the plus strand of this assembly.",
    comingSoon: "coming soon",
    generateButton: "Generate Sequence",
  },
  output: {
    title: "Generated Sequence",
    description: "Your generated FASTA sequence will appear here",
    emptyState:
      'Select a marker and click "Generate Sequence" to begin',
    copyButton: "Copy",
    downloadButton: "Download FASTA",
    downloadCsvButton: "Download CSV",
    referenceLine: "Flanks from {build}, plus strand, reference window {region}, verified against UCSC {ucsc}. The repeat block is a simplified construct, not the reference sequence.",
  },
  messages: {
    enterAlleles: "Enter one or more whole repeat counts (e.g. 10-12 or 9,10,11).",
    microvariantsUnsupported:
      "Microvariants and decimal values (for example 9.3) are not currently supported. Enter whole repeat counts.",
    invalidRepeatCounts:
      "Enter whole repeat counts from 1 to {max}, as a list or a range (e.g. 10-12 or 9,10,11). The maximum is a technical input limit of this tool.",
    markerNotFound: "Marker not found in list.",
    coreNotFound:
      "No run of the motif {motif} was found in the {marker} reference slice, so no construct can be generated for this locus.",
    sliceUnavailable: "The {marker} reference slice could not be loaded (HTTP {status}). Please try again later.",
    sliceInvalid: "The {marker} reference slice is not a valid FASTA file.",
    genomeUnavailable: "The {genome} reference is not available yet.",
    configMissing: "The reference slices are not configured on this server.",
    unexpected: "The sequence could not be generated.",
    errorPrefix: "ERROR",
  },
  about: {
    title: "About FASTA Generation",
    intro:
      "Generates simplified motif-based STR sequence constructs using reference flanks and a user-defined repeat count. Compound repeat structures, interruptions and microvariants are not modeled. Outputs should not be interpreted as validated forensic allele sequences.",
    detail:
      "Each construct joins the GRCh38 5' flank, the requested number of copies of the construction motif (reported in each header) and the GRCh38 3' flank. For complex loci the repeat count is not necessarily equivalent to a forensic CE allele designation, and microvariants are not currently supported.",
    overview: {
      title: "Overview",
      paragraphs: [
        "Choose a locus, enter whole repeat counts as a list or a range, set the flank length and export the constructs in one of several standard formats.",
        "The current set contains 19 of the 20 CODIS core loci (D22S1045 is not included).",
      ],
    },
    features: {
      title: "Features",
      items: [
        "19 of the 20 CODIS core loci (D22S1045 is not included)",
        "Flanks cut from GRCh38 reference slices (plus strand)",
        "Customizable flanking regions (0–200 bp per side)",
        "Export formats: Standard FASTA, Reference-style FASTA, Multi-FASTA and Tabular CSV",
        "Direct download and copy options",
      ],
    },
    useCases: {
      title: "Use cases",
      items: [
        "Educational and training purposes in forensic genomics",
        "Simple in silico inputs, for example to see how software handles a change in repeat count",
      ],
    },
  },
},
motifExplorerPage: {
  title: "STR Motif Explorer",
  subtitle:
    "This section helps you understand the internal structure of each STR marker along the GRCh38 reference sequence, over the ISFG minimum range. It shows that not every locus is a continuous run of its canonical motif, and highlights the complexity of compound and interrupted loci.",
  visualizationTitle: "Structure of {marker}",
  configuration: {
    title: "Configuration",
    markerLabel: "STR marker",
    rangeLabel: "Highlight range",
    allRanges: "All ranges",
    emptyState: "Please select a marker from the configuration panel.",
  },
  help: {
    general:
      "Pick a marker to see its reference sequence over the ISFG minimum range and its canonical repeat motif.",
  },
  scientificNote:
    "Naming note: names generated with STRNaming follow the 2024 ISFG recommendations (Gettings et al. 2024) and describe the ISFG minimum range. For some loci the historical 2016-2023 bracketing in the FSSG reads the repeats from a different starting base, so the two can look different for the same allele.",
  sourceLabel: "Source",
  sourceValue: "{version} ({publisher}; distributed as {file})",
  sourceButtonLabel: "Open STRidER",
  marker: {
    ce: "CE equivalent",
    minimumRange: "ISFG minimum range",
  },
  canonical: {
    title: "STRNaming Formatted ISFG Minimum Range for Common Alleles (2024 onward)",
    altForms: "Other valid forms",
    templateNote:
      "STRidER's template for the common alleles of this locus, as written in the FSSG. [n] marks a block whose repeat count varies between alleles. It is not an allele name: a full STRNaming name starts with the CE allele (for example CE13_) and gives the count of every block, as in the reference allele below.",
    referenceNameLabel:
      "Reference allele (GRCh38) named with STRNaming 1.2.1",
    referenceNameSource:
      "STRNaming 1.2.1 name of the GRCh38 reference sequence over the ISFG minimum range; its CE equals the FSSG CE equivalent.",
    referenceFitsForm:
      "Its structure follows form {n} of the {total} listed above.",
    referenceFitsOnlyForm:
      "Its structure follows the template above.",
    variant: "Sequence variant",
  },
  historical: {
    title: "GRCh38 Historical bracketing (2016-2023)",
    none: "Not available",
  },
  sequence: {
    title: "Reference sequence (ISFG minimum range, GRCh38 forward strand)",
    note: "Colors show the structure of the reference sequence as STRidER segments it in the FSSG: green blocks are canonical repeat units, amber blocks are interruptions or internal variants, grey bases are flanking sequence inside the reported window. The coloring describes structure; it is not a formula for the CE number, which follows each locus's length convention.",
    legendRepeat: "Repeat unit",
    legendMinorRepeat: "Secondary repeat (lowercase)",
    legendInterruption: "Interruption / internal variant",
    legendFlank: "Flanking region",
    flankMotifLabel: "Motif unit in the flanking region, outside the repeat bracketing.",
    repeatTooltip: "Canonical repeat unit of the reference structure.",
    minorRepeatTooltip: "Secondary / variant repeat block: it repeats, but it is not the primary motif that names the allele.",
    interruptionTooltip: "Interruption / internal variant; not counted as a repeat unit.",
    flankTooltip: "Flanking sequence inside the reported window; variants here are named by position.",
    viewStrnaming:
      "STRNaming (2024 onward)",
    viewHistorical:
      "Historical bracketing (2016-2023)",
    legendVariableBlock:
      "Variable block ([n] in STRidER's template)",
    legendFixedBlock:
      "Block with a fixed count in STRidER's template",
    legendStrnamingFlank:
      "Flank inside the ISFG minimum range",
    variableBlockTooltip:
      "Its count varies between common alleles ([n] in STRidER's template).",
    fixedBlockTooltip:
      "Its count is fixed in STRidER's template for common alleles.",
    flank5Tooltip:
      "Flank before the repeat region: positions -{n} to -1. Variants here are named by these positions (e.g. _-1T>-).",
    flank3Tooltip:
      "Flank after the repeat region: positions +1 to +{n}. Variants here are named by these positions (e.g. _+1T>C).",
    strnamingNote:
      "Blocks and counts are those of the STRNaming 1.2.1 name of the reference allele shown above; the rest of the ISFG minimum range is flank.",
    gridAgrees:
      "This repeat region is exactly the one STRidER marks in the FSSG row \"STRNaming Bracketing of ISFG Minimum Range\".",
    gridDiffers:
      "STRidER's FSSG row \"STRNaming Bracketing of ISFG Minimum Range\" marks positions {grid} of the minimum range as the repeat region, while the STRNaming name covers positions {name}.",
    phaseNote:
      "The sequence structure (repeat, interruption, flank) follows STRidER's Forensic Sequence Structure Guide (FSSG v6.1); the ISFG / STRNaming name above is a complementary view, not a re-implementation of the naming rules. This section will be updated as STRidER and the official ISFG nomenclature guidance are revised.",
    notAligned:
      "This locus has a complex structure that does not tile cleanly; the sequence is shown without per-unit coloring. The canonical bracketing above remains authoritative.",
  },
  kits: {
    title: "Kit ranges vs the minimum range",
    minimumRangeLabel: "ISFG minimum range",
    note: "Many MPS kits sequence a wider window than the ISFG minimum range, but not all of them cover it completely, so compare each kit range with the minimum range. Raw kit output can look longer or shorter, while names over the minimum range stay comparable.",
    clipped: "Extends beyond the stored reference window.",
    empty: "No kit range information for this marker.",
    bp: "bp",
  },
},
} as const

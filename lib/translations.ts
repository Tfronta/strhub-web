export const translations = {
  en: {
    // Navigation
    nav: {
      home: "Home",
      catalog: "Catalog",
      basics: "Back to Basics",
      blog: "Community",
      tools: "Tools",
      projects: "Projects",
      about: "About",
      search: "Search",
      strbase: "STRBase Integration",
      mixProfiles: "Mix Profiles",
    },
    // Search
    search: {
      title: "Search Results",
      placeholder: "Search markers, tools, articles...",
      noResults: "No results found",
      noResultsDescription: "No content found for",
      trySearching: "Try searching for:",
      resultsFor: "Results for",
      found: "Found",
      result: "result",
      results: "results",
      startSearch: "Start your search",
      enterSearchTerm: "Enter a search term to find content across STRhub",
      types: {
        markers: "Markers",
        markerSections: "Marker Sections",
        tools: "Tools",
        blog: "Articles",
        page: "Pages",
      },
      suggestions: {
        markers: "Marker names (FGA, D18S51, TH01)",
        tools: "Tool names (HipSTR, STRspy, GangSTR)",
        topics: "Topics (frequencies, genotyping, analysis)",
      },
    },
    // Homepage
    home: {
      title: "STRhub",
      subtitle: "Central Hub for STRs",
      description: "From CE to NGS: an integrated STR platform for forensic genetics and population studies",
      searchPlaceholder: "Search markers, tools, articles...",
      searchButton: "Search Database",
      exploreButton: "Explore Catalog",
      exploreSectionTitle: "Explore STRhub",
      featuresSectionTitle: "Platform Features",
      explore: {
        basics: {
          title: "Back to Basics",
          description: "Learn fundamental concepts: CRAM/BAM/SAM, flanking regions, and key bioinformatics terms",
        },
        catalog: {
          title: "Catalog",
          description:
            "Browse STR markers with complete genomic context, population data, allele frequencies, variant structures and advanced analysis features.",
        },
        mixProfiles: {
          title: "Mix Profiles",
          description: "Simulate, visualize, and compare STR mixture profiles for CE and NGS data",
        },
        tools: {
          title: "Tools & Pipelines",
          description:
            "Tools and analysis workflows for STR marker genotyping and evaluation.",
        },
        fastaGenerator: {
          title: "FASTA Generator",
          description: "Generate custom FASTA sequences for your research and analysis needs",
        },
        igvViewer: {
          title: "IGV Viewer",
          description: "One-click integration with IGV for genomic visualization and analysis",
        },
        projects: {
          title: "Projects",
          description:
            "Explore major international genomic projects advancing STR research and human genetic diversity",
        },
        motifExplorer: {
          title: "STR Motif Explorer",
          description: "Interactively explore STR repeat motifs across markers and allele structures.",
        },
        communityHub: {
          title: "Community Hub",
          description: "User experiences, tutorials, updates, and collaborative research discussions",
        },
        about: {
          title: "About",
          description: "Learn about our mission, team, and how to contribute to the STRhub community",
        },
      },
      features: {
        integratedDatabase: {
          title: "Integrated STR Database",
          description:
            "Access CODIS and non-CODIS markers with allele frequencies, flanking sequences, and population data across AFR, NAM, EAS, SAS, and EUR groups",
        },
        visualizationSuite: {
          title: "Visualization Suite",
          description:
            "Interactive charts, electropherograms, and IGV integration for comprehensive genomic visualization and analysis",
        },
        mixtureSimulation: {
          title: "Mixture Simulation Engine",
          description:
            "Generate and compare STR mixture profiles for both CE and NGS data with customizable contributor ratios",
        },
        fastaMetadata: {
          title: "FASTA & Metadata Generator",
          description:
            "Create custom FASTA sequences with configurable flanking regions and export comprehensive marker metadata",
        },
        educationalResources: {
          title: "Educational Resources",
          description:
            "Comprehensive tutorials covering bioinformatics fundamentals, file formats, and STR analysis best practices",
        },
        communityCollaboration: {
          title: "Community & Collaboration",
          description:
            "Stay updated with latest research, share experiences, and collaborate with the global forensic genetics community",
        },
      },
      featuredTitle: "Featured Markers",
      viewAll: "View All Markers",
      getStarted: "Get Started",
      learnMore: "Learn More",
      footer: {
        mission: "Advancing genetic research through collaborative science.",
        community: "Built for the global research community",
      },
    },
    // Catalog
    catalog: {
      title: "STR Marker Catalog",
      description:
        "Comprehensive database of STR markers, including those that make up CODIS, other autosomal markers, X-STRs and Y-STRs.",
      subtitle:
        "The collection includes STR data from STRbase, STRidER, and pop.STR, as well as peer-reviewed open dataset population studies.",
      searchPlaceholder: "Search markers by name or description...",
      filterByCategory: "Filter by Category",
      allCategories: "All Categories",
      categories: {
        "CODIS Core": "CODIS Core",
        "Non-Core": "Non-Core",
        Autosomal: "Autosomal",
        "Y-STR": "Y-STRs",
        "X-STR": "X-STRs",
      },
      sortBy: "Sort by",
      sortOptions: {
        name: "Name",
        chromosome: "Chromosome",
        category: "Category",
      },
      markersFound: "markers found",
      showing: "Showing",
      of: "of",
      viewDetails: "View Details",
      chromosome: "Chr",
      motif: "Motif",
      complex: "Complex",
      alleles: "Alleles",
      repeatType: "Repeat Type",
      nistVerifiedOnly: "NIST Verified Only",
      populations: "populations",
      dataIntegration: "Data Integration",
      dataIntegrationDescription:
        "This catalog compiles STR data from NIST STRBase, pop.STR, and open-access peer-reviewed population studies, providing a unified, high-resolution reference for allele structures, sequence variants, and population frequency profiles.",
      visitStrbase: "Visit NIST STRBase",
      visitPopStr: "Visit pop.STR",
      card: {
        description: "DNA Segment on Chromosome {chromosome}",
        alleleRangeLabel: "Allele Range",
      },
    },
    // Marker Details
    marker: {
      backToCatalog: "Back to Catalog",
      tabs: {
        overview: "Overview",
        isoalleles: "Isoalleles",
        frequencies: "Frequencies",
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
      nistReference: "NIST STRBase Reference",
      nistDescription: "Official reference information from NIST STRBase database",
      chromosome: "Chromosome",
      position: "Position",
      cytogeneticLocation: "Cytogenetic Location",
      motif: "Motif",
      type: "Type",
      alleleRange: "Allele Range",
      category: "Category",
      build: "Build",
      strand: "Strand",
      start: "Start",
      end: "End",
      referenceAllele: "Reference Allele",
      lastUpdated: "Last Updated",
      commonAlleles: "Common Alleles",
      viewInBrowser: "View in UCSC Genome Browser",
      isoallelePatterns: "Isoallele Patterns",
      isoalleleDescription: "Detailed sequence patterns and variations for different alleles",
      referenceSequences: "Reference sequences verified against NIST STRBase",
      reference: "Reference",
      nistVerified: "NIST Verified",
      alleleFreqDistribution: "Allele Frequency Distribution",
      freqDescription: "Population frequency data for different alleles",
      dataSource: "Data source: STRBase – NIST",
      ocePopulationInfo:
        "The Oceania population dataset from pop.STR includes the following population groups: Bougainville (NAN Melanesian) and New Guinea (Papuan).",
      additionalSourceInfo:
        "Allele frequencies in STRhub are derived from the STRs Local dataset of the SP-SMART portal (CESGA), comprising 3.809 genotyped individuals from diverse populations.",
      datasetButton: "Dataset",
      originalPublicationButton: "Original publication",
      populationGroup: "Population Group",
      populations: {
        AFR: "African",
        NAM: "American",
        EAS: "East Asian",
        SAS: "South Asian",
        EUR: "European",
        OCE: "Oceanian",
      },
      frequencies: {
        region: {
          latam: "LATAM",
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
        latam: {
          selectorHint: "Select a LATAM population for this marker.",
          noDataForLocus: "No LATAM datasets available for this marker.",
          sampleSize: "n = {n}",
          markerCount: "{count} STR markers",
        },
      },
      citation:
        "Citation: Population frequency data sourced from STRBase – NIST database. All alleles reported in STRbase for each marker are included across all population groups (AFR, NAM, EAS, SAS, EUR).",
      citationReference: "Reference: NIST STRBase. Available at: https://strbase.nist.gov/",
      toolsCompatibility: "Tools & Pipelines Compatibility",
      toolsDescription: "STR analysis tools and pipelines that support this marker",
      supported: "Supported",
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
      limitations: "Limitations",
      maintainerInitiatives: "Maintainer Initiatives",
      repository: "Repository",
      documentation: "Documentation",
      notes: "Notes",
      addNewTool: "Add New Tool",
      contactUs: "contact us",
      toolsDisclaimer: "All software tools listed in this section are open-access and third-party resources. STRhub maintains no commercial relationship with the developers of these tools and receives no financial compensation for their inclusion. The catalog is provided solely for educational and research purposes, to help the community explore and compare available STR analysis pipelines. If you wish to suggest a new tool or report an update, you can",
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
      strNaming: "STRnaming",
      repeatStructure: "Repeat Structure",
      sequence: "Sequence",
      noFrequenciesMessage:
        "No data available. Population frequencies for this locus are being curated.",
      contributeDataCta: "Contribute data",
      download: "Download",
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
            ontOptimized:
              "Optimized for ONT forensic STR panels; requires reference file of loci.",
            notWgs: "Not designed for whole-genome (WGS) applications.",
          },
          notes:
            "STRspy is integrated into the STRhub ecosystem for forensic and population STR analysis using Oxford Nanopore data. Its modular design allows visualization, benchmarking, and cross-compatibility with HipSTR-UI datasets.",
        },
        straitrazor: {
          config: {
            targetFileFormat: "CSV or predefined STRaitRazor panel",
          },
          limitations: {
            illuminaData: "Designed for Illumina data; requires panel configuration.",
            noAlignment:
              "Does not perform read alignment; motif matching is direct.",
          },
          notes:
            "STRait Razor is included in the STRhub ecosystem for integration with Illumina-based forensic pipelines. Its lightweight motif-matching algorithm makes it suitable for teaching and training purposes in STR interpretation.",
        },
        toastr: {
          limitations: {
            forensicNgs:
              "Designed for forensic NGS STR analysis; requires STRaitRazor reference panel.",
            webInterfaceInactive:
              "Web interface inactive on some legacy servers.",
          },
          notes:
            "ToaSTR (also known as STRaitRazor-NGS) extends STRaitRazor functionality for Illumina data analysis. Integrated into STRhub for historical comparison and reference validation in forensic genomics workflows.",
        },
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
        desc: "Understand how canonical motifs, internal variants and flanking regions define the allele.",
        button: "Open STR Motif Explorer",
      },
    },
    // FASTA Generator Page
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
          "This module produces high quality FASTA sequences for Short Tandem Repeat (STR) markers, using curated reference regions derived from GRCh38.",
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
            "Customizable flanking regions (0–1000 bp per side)",
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
    // STRBase Integration
    strbase: {
      title: "NIST STRBase Integration",
      subtitle: "Comprehensive integration with the NIST STRBase database for authoritative STR marker data",
      connected: "Connected",
      lastUpdated: "Last updated",
      markersIntegrated: "markers integrated",
      totalAlleles: "total alleles",
      tabs: {
        overview: "Overview",
        features: "Features",
        updates: "Updates",
        api: "API Access",
      },
      integrationStatus: "Integration Status",
      connectionDescription: "Current connection and data synchronization status",
      connectionStatus: "Connection Status",
      active: "Active",
      dataFreshness: "Data Freshness",
      updatedDaily: "Updated daily",
      coverage: "Coverage",
      fullCoverage: "100% of available markers",
      populationGroups: "Population Groups",
      aboutStrbase: "About STRBase",
      strbaseDescription: "NIST Short Tandem Repeat DNA Internet Database",
      strbaseInfo:
        "STRBase is a comprehensive database maintained by the National Institute of Standards and Technology (NIST) that provides population data, sequence information, and other details for short tandem repeat (STR) loci used in human identity testing.",
      maintainedBy: "Maintained by",
      nist: "NIST",
      primaryUse: "Primary use",
      humanIdentification: "Human identification",
      dataTypes: "Data types",
      populationFrequenciesSequences: "Population frequencies, sequences",
      visitStrbase: "Visit STRBase",
      dataQuality: "Data Quality & Verification",
      dataQualityDescription: "How we ensure data accuracy and reliability",
      automatedVerification: "Automated Verification",
      verificationDescription: "All marker data is automatically cross-referenced with official STRBase records",
      regularUpdates: "Regular Updates",
      updatesDescription: "Daily synchronization ensures the latest STRBase data is always available",
      dataIntegrity: "Data Integrity",
      integrityDescription: "Comprehensive validation checks maintain data quality and consistency",
      features: {
        populationFrequency: {
          title: "Population Frequency Data",
          description: "Complete allele frequency distributions for AFR, NAM, EAS, SAS, and EUR populations",
        },
        markerVerification: {
          title: "Marker Verification",
          description: "All markers verified against official NIST STRBase records",
        },
        referenceSequences: {
          title: "Reference Sequences",
          description: "NIST-verified isoallele patterns and reference sequences",
        },
        directLinks: {
          title: "Direct STRBase Links",
          description: "One-click access to official STRBase marker pages",
        },
        automatedUpdates: {
          title: "Automated Updates",
          description: "Regular synchronization with STRBase database updates",
        },
      },
      recentUpdates: "Recent Updates",
      recentUpdatesDescription: "Latest changes and additions to the STRBase integration",
      searchUpdates: "Search updates...",
      updateTypes: {
        dataUpdate: "Data Update",
        newMarkers: "New Markers",
        integrationEnhancement: "Integration Enhancement",
        xStrExpansion: "X-STR Expansion",
      },
      apiAccess: "STRBase API Access",
      apiDescription: "Programmatic access to STRBase-integrated data for research and development",
      availableEndpoints: "Available Endpoints",
      listAllMarkers: "List all markers",
      getMarkerDetails: "Get marker details",
      getPopulationFrequencies: "Get population frequencies",
      listPopulationGroups: "List population groups",
      exampleResponse: "Example Response",
      apiDocumentation: "API Documentation",
      downloadSdk: "Download SDK",
    },
    // Back to Basics
    basics: {
      title: "Back to Basics",
      subtitle: "Understanding the Fundamentals",
      description:
        "Master the essential concepts in bioinformatics and forensic genetics. From file formats to flanking regions, build a solid foundation for STR analysis.",
      readArticle: "Read Article",
      backToArticles: "← Back to All Articles",
      readTime: "min read",
      topicsCovered: "Topics covered:",
    },
    // Blog
    blog: {
      title: "Community Hub",
      subtitle: "Latest Research & Discussions",
      description:
        "Stay updated with the latest developments in STR analysis, forensic genetics research, and community discussions.",
      categories: {
        research: "Research",
        tutorials: "Tutorials",
        news: "News",
        community: "Community",
      },
      readMore: "Read More",
      publishedOn: "Published on",
    },
    // Tools
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
      },
      hipstr: {
        title: "HipSTR",
        description: "Tool for genotyping short tandem repeats from Illumina sequencing data",
        category: "Genotyping",
        language: "C++",
        features: {
          1: "High accuracy",
          2: "Handles complex STRs",
          3: "Population-scale analysis",
        },
      },
      gangstr: {
        title: "GangSTR",
        description: "Tool for genome-wide profiling of tandem repeats from short reads",
        category: "Profiling",
        language: "C++",
        features: {
          1: "Genome-wide analysis",
          2: "Short read support",
          3: "High throughput",
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
          commands: {
            depth: "samtools depth -r chr12:100000-100300 sample.bam > depth.txt",
            view: "samtools view sample.bam chr12:100000-100300",
            tview: "samtools tview sample.bam reference.fasta",
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
        },
      },
      straitrazor: {
        title: "STRait Razor",
        description: "Lightweight motif-matching tool for Illumina-based forensic STR analysis. Suitable for teaching and training purposes in STR interpretation.",
        tags: {
          category: "Genotyping",
          language: "R",
        },
        features: {
          1: "Direct motif matching from FASTQ",
          2: "Lightweight algorithm for forensic panels",
          3: "Online web interface available",
          4: "Integrated into STRhub for Illumina-based pipelines",
        },
        buttons: {
          github: "GitHub",
          paper: "Original publication",
          online: "Online Version",
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
          1: "Standardized allele naming",
          2: "Automated allele description",
          3: "Developed by the Netherlands Forensic Institute",
        },
        buttons: {
          website: "Website",
        },
      },
      strider: {
        title: "STRIDER",
        description: "Curated online STR allele-frequency population database providing high-quality genotype probability estimates and autosomal STR quality control.",
        tags: {
          population: "Population data",
          qc: "Quality control",
          webtool: "Web",
        },
        features: {
          1: "High-quality curated allele frequencies",
          2: "Genotype probability estimates",
          3: "Quality control for autosomal STR data",
          4: "Developed at the Institute of Legal Medicine, Medical University of Innsbruck",
        },
        buttons: {
          website: "Website",
        },
      },
      strspy: {
        title: "STRspy",
        description: "Python toolkit for STR analysis, allele profiling, and visualization.",
        tags: {
          category: "Analysis",
          language: "Python",
        },
        features: {
          1: "STR profiles genotyping",
          2: "Statistical analysis of allele patterns",
          3: "Easy integration with bioinformatics pipelines",
          4: "Open-source toolkit",
        },
        buttons: {
          github: "GitHub",
          paper: "Original publication",
        },
      },
    },
    // About
    about: {
      title: "About STRhub",
      subtitle: "Advancing STR Research & Education",
      mission: "Our Mission",
      missionText:
        "STRhub is dedicated to advancing forensic and population genetics through open access, collaboration, and education. We provide reliable tools, curated datasets, and learning resources to make STR analysis accessible to researchers, students, and laboratories worldwide. Our goal is to encourage a global community where knowledge, technology and collaboration come together to strengthen science everywhere.",
      team: "Our Team",
      teamText:
        "We are a multidisciplinary team of researchers, bioinformaticians, and forensic scientists committed to making STR analysis more accessible and standardized.",
      teamText2:
        "The project is led by Dr. Tamara Frontanilla, researcher in forensic genetics and bioinformatics, with extensive experience in population genetics, sequencing technologies, and education.",
      whyThisMatters: "Why This Matters",
      whyThisMattersText:
        "Because genetics is more than data. Behind each data there are people, history, and diversity. Each STR tells a small part of who we are. By opening access to information and connecting researchers from different places, we make science more inclusive, fair and real. Together, we can go further and make knowledge something that truly belongs to everyone.",
      contact: "Contact Us",
      contactText: "Have questions or suggestions? We'd love to hear from you.",
      contactDescription:
        "Send us a message and we'll get back to you soon. For technical issues or feature requests, connect with us on GitHub. We encourage contributions from the global community.",
      formName: "Name",
      formNamePlaceholder: "Your name",
      formEmail: "Email",
      formEmailPlaceholder: "your.email@example.com",
      formSubject: "Subject",
      formSubjectPlaceholder: "What would you like to discuss?",
      formMessage: "Message",
      formMessagePlaceholder:
        "Tell us about your research, questions, or collaboration ideas...",
      formSend: "Send Message",
      email: "Email",
      github: "GitHub",
      twitter: "Twitter",
      collaboration: "Collaboration",
      collaborationText:
        "STRhub is an open-source project. We welcome contributions from researchers, developers, and institutions worldwide.",
      contribute: "Contribute",
      documentation: "Documentation",
      support: "Support",
    },
    // Community Hub
    communityHub: {
      hero: {
        title: "Connect, Learn, Collaborate",
        subtitle:
          "We're building the first global community dedicated to STR analysis with next-generation sequencing. Soon you'll find tutorials, guides, real case examples, and collaborations created by researchers, labs, and students from around the world.",
        cta: "Join as an early contributor",
      },
      howToJoin: {
        title: "How you can be part of this",
        intro:
          "For STR analysis with NGS to be truly useful and accessible, we need a diverse global community: labs, students, educators, developers, and practitioners working together. We're not asking for your data – we care about your experience, your questions, and your ideas.",
        cards: {
          experience: {
            title: "Share your experience",
            body: "Tell us how you use STRs in your work: case studies, validation results, teaching materials, or lessons learned from challenging samples.",
          },
          tutorials: {
            title: "Contribute tutorials and guides",
            body: "Help others learn by explaining a pipeline, a marker, a concept, or a tool you wish you had understood earlier.",
          },
          collaborations: {
            title: "Join early collaborations",
            body: "Take part in testing new STRhub features, giving feedback on ideas, or helping shape open standards for STR analysis with NGS.",
          },
        },
        cta: "I want to contribute",
      },
      earlyContributors: {
        title: "Early contributors and partner labs",
        body: "STRhub is being shaped with input from researchers, students, and laboratories that believe in open science and accessible technology. This section will highlight the teams and individuals who are helping to build and validate the platform.",
        comingSoon: "Coming soon",
      },
      recentPosts: {
        title: "Recent educational posts",
        subtitle:
          'Back to basics articles to help you and your team build a solid foundation in STR and NGS analysis.',
        loading: "Loading posts...",
        readMore: "Read More",
        viewAll: "View all Back to Basics posts",
        noPosts: "No posts available yet.",
      },
      comingSoon: {
        title: "What's coming next",
        intro: "We're working on new resources and tools that will gradually appear in this hub.",
        cards: {
          structureBrowser: {
            title: "STR structure browser",
            body: "Interactive views to explore repeat structures, flanking regions, and internal variants for different markers.",
          },
          caseStudies: {
            title: "Case studies from labs",
            body: "Didactic examples of mixtures, stutter, degradation, and validation results shared by the community.",
          },
          pipelines: {
            title: "Pipelines and open tools",
            body: "Guides to build and connect STR pipelines using STRhub with common analysis tools and scripting languages.",
          },
        },
      },
      contact: {
        title: "Join the conversation",
        intro:
          "Have ideas, questions, or collaboration proposals? Tell us how STRhub could support your work or what you would like to see in this community.",
        messagePlaceholder:
          "Tell us about your research, collaboration ideas, or features you'd like to see in STRhub...",
      },
    },
    // Common
    common: {
      loading: "Loading...",
      error: "Error",
      notFound: "Not Found",
      backToHome: "Back to Home",
      frequency: "Frequency",
      allele: "Allele",
      count: "Count",
      darkMode: "Dark Mode",
      lightMode: "Light Mode",
      language: "Language",
      english: "English",
      portuguese: "Portuguese",
      spanish: "Spanish",
    },
    projects: {
      title: "International Projects",
      heroDescription:
        "Explore major international genomic projects that are advancing our understanding of human genetic diversity and STR analysis.",
      visitProject: "Visit Project",
      static: {
        genomes1000: {
          description:
            "Pioneering project mapping global genetic variation. Current data includes high-coverage (30x) genomes.",
        },
        hgdp: {
          description:
            "Samples from over 50 diverse populations. Key resource for population structure studies.",
        },
        strSequencingProject: {
          description:
            "Consortium hosted by NIST dedicated to comprehensive characterization of benchmark human genomes.",
        },
        gnomad: {
          description:
            "Global database with millions of genomic variants; useful for comparing STRs with SNPs and indels.",
        },
        sgdp: { description: ">300 whole genomes from underrepresented populations." },
        allOfUs: {
          description:
            "Curated global database of Y-STR haplotypes for forensic comparison, ancestry inference and population studies.",
        },
        humanPangenome: {
          description:
            "New genomic reference with multiple haplotypes, addressing limitations of GRCh38.",
        },
        strider: { description: "Validated, standardized database of forensic STR alleles." },
        strbase: { description: "Classic resource on STR loci maintained by the NIST (National Institute of Standards and Technology)." },
      },
    },
    // Mix Profiles
    mixProfiles: {
      title: "DNA Mixture Simulator",
      subtitle: "beta",
      description: "Using demo data — you can load your own samples when available.",
      simulatorDescription:
        "This simulator shows how two or three DNA profiles behave when mixed, in both capillary electrophoresis (CE) and NGS. It helps users understand how peak heights shift, how stutter artifacts appear, and how minor alleles can become hidden or confused with noise, illustrating the real complexity of interpreting mixed profiles in forensic genetics.",
      controls: {
        locus: "Locus",
        sampleA: "Sample A",
        sampleB: "Sample B",
        ratioA: "Ratio A",
        contributor: "Contributor {label}",
        searchSample: "Search {label} sample...",
        noSampleFound: "No sample found.",
      },
      actions: {
        reSimulate: "Re-simulate",
        resetToDemo: "Reset to demo",
        exportJson: "Export JSON",
      },
      results: {
        title: "Mixture Results for",
        allele: "Allele",
      },
      charts: {
        ceTitle: "Capillary Electrophoresis Analysis (RFU)",
        ngsTitle: "Next-Generation Sequencing Analysis",
      },
      ngs: {
        disclaimer:
          "Genotypes come from 1000 Genomes samples. The NGS sequences shown are representative haplotypes for each allele, not necessarily the exact sequence of this individual.",
        tableAllele: "Allele",
        tableCoverage: "Coverage (reads)",
        tableRepeatSequence: "Repeat Sequence",
        axisLabelAllele: "Allele",
        axisLabelCoverage: "Coverage",
        fullSequenceColumnLabel: "Full Sequence",
        fullSequenceTooltipAria: "Explanation about full amplicon sequence",
        fullSequenceNote:
          "In NGS, the full amplicon sequence is shown, including flanking regions and internal variants. These regions may contain insertions, deletions, or interruptions, so one allele can have a longer total sequence than another even when it has fewer repeat units. This is normal in sequence-based STR typing.",
        isoTooltip:
          "Isoallele: sequence variation without a change in length. Detectable only with NGS and increases the power of discrimination between individuals.",
      },
      trueGenotypes: {
        toggleLabel: "Show true genotypes",
        title: "True genotypes at {locus}",
        notSelected: "Not selected",
        none: "—",
        na: "No genotype available",
        naHelp: "No true alleles found for this locus in the demo dataset.",
        noSample: "None",
      },
      ceChart: {
        axisAllele: "Allele",
        axisRFU: "RFU",
        legendBaselineNoise: "Baseline noise (RFU)",
        legendTrueAlleles: "True alleles / Signal (RFU)",
        legendStutter: "Stutter (RFU)",
        legendCalled: "Called",
        legendDropoutRisk: "Drop-out risk",
        legendStutterPeak: "Stutter peak",
        thresholdAT: "AT",
        thresholdST: "ST",
        tooltipAllele: "Allele {allele}",
        tooltipAlleleMarker: "Allele {allele} — {marker}",
        tooltipTrue: "Allele {label} — {rfu} RFU",
        tooltipStutter: "Stutter at {allele} — {rfu} RFU (from {parent})",
        tooltipCalled: "Called",
        tooltipDropout: "Drop-out risk",
        infoLabel: "Show stutter modeling note",
        infoText:
          "Educational simulator: stutter is modeled as a locus-specific fraction of the true peak height (typically ~6–11%, higher for some long loci). These are educational approximations, not validated parameters for any specific kit.",
      },
      parameters: {
        at: "AT (RFU)",
        st: "ST (RFU)",
        degradationK: "Degradation k (per 100 bp)",
        noiseBase: "Noise / Base (RFU)",
        stutterLevel: "Stutter level (×)",
        autoScale: "Auto-scale Y axis",
        fixedScale: "Fixed forensic scale (0–800 RFU)",
        atTooltip: "Analytical Threshold: Minimum RFU to distinguish a peak from noise.\n\nTypical range: 50–100 RFU.",
        stTooltip: "Stochastic Threshold: RFU level where heterozygote imbalance becomes unlikely.\n\nTypical range: 150–200 RFU.",
        autoScaleTooltip: "Automatically adjusts the Y axis to fit all peaks.\n\nUseful to visualize low RFU minor peaks or degraded profiles.",
        degradationKTooltip: "Coefficient simulating signal loss in long fragments.\n\nTypical values:\n• 0.010 = good quality\n• 0.015 – 0.020 = difficult sample\n• > 0.020 = severely degraded\n\nHigher k more decay in longer alleles.",
        noiseBaseTooltip: "Simulated baseline fluorescence noise.\n\nHigher values create more small background peaks and baseline fluctuation.",
        stutterLevelTooltip: "Global multiplier for stutter intensity.\n\n• 1.0 = average real locus behavior\n• < 1.0 = clean profile\n• > 1.0 = extra stutter for training/visualization.",
      },
      quickGuide: {
        title: "Quick Guide for DNA Mixture Configuration",
        button: "Quick Guide",
        thresholds: {
          title: "1. Thresholds in practice",
          at: "AT: Lower values reveal minor peaks; higher values suppress noise.",
          st: "ST: Peaks below ST may indicate heterozygote imbalance or drop-out.",
          ranges: "Typical ranges: AT = 50–100 RFU; ST = 150–200 RFU.",
        },
        mixture: {
          title: "2. Mixture ratios",
          balanced: "50/50: balanced",
          moderate: "70/30: moderate imbalance",
          strong: "80/20 or 90/10: strong imbalance, useful for teaching mixture behavior",
        },
        markers: {
          title: "3. Loci with clearer stutter behavior",
          description: "Longer alleles often show more noticeable stutter behavior.",
          fga: "FGA",
          d18s51: "D18S51",
          d21s11: "D21S11",
          d2s1338: "D2S1338",
        },
        simulation: {
          title: "4. How to simulate \"major stutter similar to minor contributor\"",
          ratio: "Mixture ratio ≥ 80/20",
          degradation: "Degradation k: 0.015–0.030",
          stutter: "Stutter level (×): 1.5–2.0 (for didactic purposes)",
          loci: "Prefer loci where the contributors differ by one repeat unit (e.g., 10 vs 9).",
        },
        notes: {
          title: "5. Practical notes",
          longerAlleles: "Longer alleles lose signal earlier when degraded.",
          minorContributors: "Minor contributors drop in RFU earlier under degradation.",
          stutter: "Stutter is more visible when the major contributor dominates.",
          notAllLoci: "Not all loci display these effects equally.",
        },
      },
    },
    mixtures: {
      presets: {
        stutterMinor: "Stutter ≈ minor",
        dropout: "Low minor allele",
        overlap: "Allele overlap",
      },
      tooltips: {
        stutterMinor:
          "Shows a case where a stutter peak has similar height to a minor allele, making the small peak ambiguous.",
        lowMinor:
          "Shows a minor contributor allele very close to the detection threshold.",
        overlap:
          "Shows two contributors sharing one allele, creating a combined high peak in the middle.",
      },
    },
  },
  pt: {
    // Navigation
    nav: {
      home: "Início",
      catalog: "Catálogo",
      basics: "Fundamentos",
      blog: "Comunidade",
      tools: "Ferramentas",
      projects: "Projetos",
      about: "Sobre",
      search: "Buscar",
      strbase: "Integração STRBase",
      mixProfiles: "Perfis de Misturas",
    },
    // Search
    search: {
      title: "Resultados da Busca",
      placeholder: "Buscar marcadores, ferramentas, artigos...",
      noResults: "Nenhum resultado encontrado",
      noResultsDescription: "Nenhum conteúdo encontrado para",
      trySearching: "Tente buscar por:",
      resultsFor: "Resultados para",
      found: "Encontrado",
      result: "resultado",
      results: "resultados",
      startSearch: "Inicie sua busca",
      enterSearchTerm: "Digite um termo de busca para encontrar conteúdo no STRhub",
      types: {
        markers: "Marcadores",
        markerSections: "Seções de Marcadores",
        tools: "Ferramentas",
        blog: "Artigos",
        page: "Páginas",
      },
      suggestions: {
        markers: "Nomes de marcadores (FGA, D18S51, TH01)",
        tools: "Nomes de ferramentas (HipSTR, STRspy, GangSTR)",
        topics: "Tópicos (frequências, genotipagem, análise)",
      },
    },
    // Homepage
    home: {
      title: "STRhub",
      subtitle: "Centro de STRs",
      description: "De CE para NGS: uma plataforma integral de STR para genética forense e estudos populacionais",
      searchPlaceholder: "Buscar marcadores, ferramentas, artigos...",
      searchButton: "Buscar no Banco de Dados",
      exploreButton: "Explorar Catálogo",
      exploreSectionTitle: "Explorar STRhub",
      featuresSectionTitle: "Recursos da Plataforma",
      explore: {
        basics: {
          title: "Fundamentos",
          description:
            "Aprenda conceitos fundamentais: CRAM/BAM/SAM, regiões flanqueantes e termos-chave de bioinformática",
        },
        catalog: {
          title: "Catálogo",
          description:
            "Explore marcadores STR com contexto genômico completo, dados populacionais, frequências alélicas, estruturas variantes e recursos avançados de análise.",
        },
        mixProfiles: {
          title: "Perfis de Misturas",
          description: "Simule, visualize e compare perfis de misturas STR para dados CE e NGS",
        },
        tools: {
          title: "Ferramentas e Pipelines",
          description:
            "Ferramentas e fluxos de análise para genotipagem e avaliação de marcadores STR.",
        },
        fastaGenerator: {
          title: "Gerador FASTA",
          description: "Gere sequências FASTA personalizadas para suas necessidades de pesquisa e análise",
        },
        igvViewer: {
          title: "Visualizador IGV",
          description: "Integração com um clique com IGV para visualização e análise genômica",
        },
        projects: {
          title: "Projetos",
          description:
            "Explore grandes projetos genômicos internacionais que avançam a pesquisa STR e diversidade genética humana",
        },
        motifExplorer: {
          title: "Explorador de Motivos STR",
          description: "Explore interativamente motivos repetitivos STR em marcadores e estruturas alélicas.",
        },
        communityHub: {
          title: "Centro Comunitário",
          description: "Experiências de usuários, tutoriais, atualizações e discussões de pesquisa colaborativa",
        },
        about: {
          title: "Sobre",
          description: "Conheça nossa missão, equipe e como contribuir para a comunidade STRhub",
        },
      },
      features: {
        integratedDatabase: {
          title: "Banco de Dados Integrado de STR",
          description:
            "Acesse marcadores CODIS e não-CODIS com frequências alélicas, sequências flanqueantes e dados populacionais em grupos AFR, NAM, EAS, SAS e EUR",
        },
        visualizationSuite: {
          title: "Suite de Visualização",
          description:
            "Gráficos interativos, eletroferogramas e integração IGV para visualização e análise genômica abrangente",
        },
        mixtureSimulation: {
          title: "Motor de Simulação de Misturas",
          description:
            "Gere e compare perfis de misturas STR para dados CE e NGS com proporções de contribuintes personalizáveis",
        },
        fastaMetadata: {
          title: "Gerador FASTA e Metadatos",
          description:
            "Crie sequências FASTA personalizadas com regiões flanqueantes configuráveis e exporte metadatos abrangentes de marcadores",
        },
        educationalResources: {
          title: "Recursos Educacionais",
          description:
            "Tutoriais abrangentes cobrindo fundamentos de bioinformática, formatos de arquivo e melhores práticas de análise STR",
        },
        communityCollaboration: {
          title: "Comunidade e Colaboração",
          description:
            "Mantenha-se atualizado com as últimas pesquisas, compartilhe experiências e colabore com a comunidade global de genética forense",
        },
      },
      featuredTitle: "Marcadores em Destaque",
      viewAll: "Ver Todos os Marcadores",
      getStarted: "Começar",
      learnMore: "Saiba Mais",
      footer: {
        mission:
          "Impulsionando a pesquisa genética por meio de ciência colaborativa.",
        community: "Criado para a comunidade global de pesquisa",
      },
    },
    // Catalog
    catalog: {
      title: "Catálogo de Marcadores STR",
      description:
        "Banco de dados completo de marcadores STR, incluindo aqueles que compõem o CODIS, outros marcadores autossômicos, STRs do cromossomo X e STRs do cromossomo Y.",
      subtitle:
        "Este catálogo reúne dados STR de STRbase, STRidER, pop.STR e estudos populacionais de dados abertos corrigidos por pares.",
      searchPlaceholder: "Buscar marcadores por nome ou descrição...",
      filterByCategory: "Filtrar por Categoria",
      allCategories: "Todas as Categorias",
      categories: {
        "CODIS Core": "CODIS Core",
        "Non-Core": "Não-Core",
        Autosomal: "Autossômicos",
        "Y-STR": "Y-STRs",
        "X-STR": "X-STRs",
      },
      sortBy: "Ordenar por",
      sortOptions: {
        name: "Nome",
        chromosome: "Cromossomo",
        category: "Categoria",
      },
      markersFound: "marcadores encontrados",
      showing: "Mostrando",
      of: "de",
      viewDetails: "Ver Detalhes",
      chromosome: "Crom",
      motif: "Motivo",
      complex: "Complexo",
      alleles: "Alelos",
      repeatType: "Tipo de Repetição",
      nistVerifiedOnly: "Apenas Verificados NIST",
      populations: "populações",
      dataIntegration: "Integração de Dados",
      dataIntegrationDescription:
        "Este catálogo reúne dados de STR provenientes do NIST STRBase, pop.STR e estudos populacionais de acesso aberto revisados por pares, oferecendo uma referência unificada e de alta resolução sobre estruturas alélicas, variantes de sequência e perfis de frequências populacionais.",
      visitStrbase: "Visitar NIST STRBase",
      visitPopStr: "Visitar pop.STR",
      card: {
        description: "Segmento de DNA no cromossomo {chromosome}",
        alleleRangeLabel: "Faixa de Alelos",
      },
    },
    // Marker Details
    marker: {
      backToCatalog: "Voltar ao Catálogo",
      tabs: {
        overview: "Visão Geral",
        isoalleles: "Isoalelos",
        frequencies: "Frequências",
        tools: "Ferramentas",
        igv: "Visualizador IGV",
        fasta: "Gerador FASTA",
      },
      sections: {
        overview: {
          description: "Informações básicas, coordenadas genômicas e dados de referência",
          tags: ["visão geral", "informações básicas", "coordenadas", "referência"],
        },
        frequencies: {
          description: "Distribuição de frequências alélicas e painéis populacionais",
          tags: ["frequências", "frequências alélicas", "dados populacionais", "estatísticas"],
        },
        variants: {
          description: "Alelos variantes, isoalelos e padrões de sequência",
          tags: ["variantes", "isoalelos", "sequências", "padrões alélicos"],
        },
        tools: {
          description: "Ferramentas e pipelines compatíveis para análise",
          tags: ["ferramentas", "pipelines", "análise", "compatibilidade"],
        },
      },
      basicInfo: "Informações Básicas",
      genomicCoords: "Coordenadas Genômicas",
      nistReference: "Referência NIST STRBase",
      nistDescription: "Informações de referência oficial do banco de dados NIST STRBase",
      chromosome: "Cromossomo",
      position: "Posição",
      cytogeneticLocation: "Localização citogenética",
      motif: "Motivo",
      type: "Tipo",
      alleleRange: "Faixa de Alelos",
      category: "Categoria",
      build: "Build",
      strand: "Fita",
      start: "Início",
      end: "Fim",
      referenceAllele: "Alelo de Referência",
      lastUpdated: "Última Atualização",
      commonAlleles: "Alelos Comuns",
      viewInBrowser: "Ver no Navegador Genômico UCSC",
      isoallelePatterns: "Padrões de Isoalelos",
      isoalleleDescription: "Padrões de sequência detalhados e variações para diferentes alelos",
      referenceSequences: "Sequências de referência verificadas contra NIST STRBase",
      reference: "Referência",
      nistVerified: "Verificado NIST",
      alleleFreqDistribution: "Distribuição de Frequência de Alelos",
      freqDescription: "Dados de frequência populacional para diferentes alelos",
      dataSource: "Fonte de dados: STRBase – NIST",
      ocePopulationInfo:
        "O conjunto de dados populacional da Oceania do pop.STR inclui os seguintes grupos populacionais: Bougainville (Melanésio NAN) e Nova Guiné (Papua).",
      additionalSourceInfo:
        "As frequências alélicas no STRhub são derivadas do conjunto de dados STRs Local do portal SP-SMART (CESGA), que inclui 3.809 indivíduos genotipados de diferentes populações.",
      datasetButton: "Conjunto de dados",
      originalPublicationButton: "Publicação original",
      populationGroup: "Grupo Populacional",
      populations: {
        AFR: "Africano",
        NAM: "Americano",
        EAS: "Asiático Oriental",
        SAS: "Asiático do Sul",
        EUR: "Europeu",
        OCE: "Oceânico",
      },
      frequencies: {
        region: {
          latam: "LATAM",
        },
        datasetNotes: {
          provenance:
            "Essas frequências são derivadas do conjunto de dados STRs Local do portal SP-SMART (CESGA), que inclui 3.809 indivíduos genotipados de populações diversas.",
          populationLabel: "Grupos populacionais incluídos",
          populationAfr:
            "Central African Republic (Biaka Pygmies), Democratic Republic of the Congo (Mbuti Pygmies), Kenya (Bantu N.E.), Namibia (San), Nigeria (Yoruba), Senegal (Mandenka), Somalia, and South Africa (Bantu).",
          populationNam:
            "Brazil (Karitiana), Brazil (Surui), Colombia (Colombian), Dominican Republic, Mexico (Maya), and Mexico (Pima).",
          populationEas:
            "Cambodia (Cambodian), China (Dai), China (Daur), China (Han), China (Hezhen), China (Lahu), China (Miaozu), China (Mongola), China (Naxi), China (Oroqen), China (She), China (Tu), China (Tujia), China (Xibo), China (Yizu), Japan (Japanese), and Siberia (Yakut).",
          populationSas:
            "China (Uygur), Pakistan (Balochi), Pakistan (Brahui), Pakistan (Burusho), Pakistan (Hazara), Pakistan (Kalash), Pakistan (Makrani), Pakistan (Pathan), and Pakistan (Sindhi).",
          populationEur:
            "France (Basque), France (French), Italy (Bergamo – North Italian), Italy (Sardinian), Italy (Tuscan), N.W. Spain, Orkney Islands (Orcadian), Russia (Russian), Russia Caucasus (Adygei), Sweden, and U.S. Europeans.",
          populationMes:
            "Algeria (Mzab – Mozabite), Israel (Carmel – Druze), Israel (Central – Palestinian), and Israel (Negev – Bedouin).",
          populationOce:
            "Bougainville (NAN Melanesian) and New Guinea (Papuan).",
          populationLatam: "",
          title: "⚠️ Notas sobre o conjunto de dados (importante)",
          shortLine1:
            "As frequências alélicas mostradas aqui vêm diretamente do conjunto de dados STRs Local do SP-SMART / pop.STR.",
          shortLine2:
            "O STRhub não modifica, infere, reconstrói nem reinterpreta qualquer componente do conjunto de dados STRs Local. Todas as limitações metodológicas originam-se exclusivamente da estrutura, da disponibilidade de metadados e das decisões de design da plataforma SP-SMART / pop.STR.",
          accordionTrigger: "Ler nota metodológica completa",
          full1:
            "Todas as frequências alélicas apresentadas nesta seção derivam diretamente do conjunto de dados STRs Local da plataforma SP-SMART / pop.STR (CESGA). As características e limitações metodológicas descritas aqui são inerentes ao conjunto de dados e à plataforma originais e não se originam do processamento ou da implementação do STRhub.",
          full2:
            "No pop.STR, a seleção de um “kit” atua apenas como um filtro de locos e não reflete a tecnologia de genotipagem utilizada nos estudos que contribuíram com os dados. O conjunto de dados STRs Local compila dados populacionais gerados principalmente por eletroforese capilar (CE), e não por NGS, e o SP-SMART não fornece metadados específicos de tecnologia em nível de loco. Portanto, o STRhub reproduz o conjunto de dados exatamente como ele é disponibilizado, sem reconstrução, sem harmonização além da nomenclatura e sem imputação.",
          full3:
            "Embora o STRs Local ofereça frequências alélicas harmonizadas para múltiplas populações, ele não constitui um painel de referência global unificado. O pop.STR disponibiliza as populações individualmente, o que é adequado para comparações forenses, mas não para análises agrupadas como PCA, STRUCTURE ou ADMIXTURE. Essas limitações refletem o design e o escopo da plataforma SP-SMART / pop.STR, e não uma restrição do STRhub.",
          referenceLabel: "Referência",
          referenceText:
            "Amigo J, Phillips C, Lareu MV, Carracedo A. The SNPforID and SP-SMART databases: Resources for forensic population genetics. Forensic Sci Int Genet. 2008;2(3):212–217. Dataset: http://spsmart.cesga.es/",
        },
        latam: {
          selectorHint: "Selecione uma população LATAM para este marcador.",
          noDataForLocus: "Não há dados LATAM disponíveis para este marcador.",
          sampleSize: "n = {n}",
          markerCount: "{count} marcadores STR",
        },
      },
      citation:
        "Citação: Dados de frequência populacional obtidos do banco de dados STRBase – NIST. Todos os alelos relatados no STRbase para cada marcador estão incluídos em todos os grupos populacionais (AFR, NAM, EAS, SAS, EUR).",
      citationReference: "Referência: NIST STRBase. Disponível em: https://strbase.nist.gov/",
      toolsCompatibility: "Compatibilidade de Ferramentas e Pipelines",
      toolsDescription: "Ferramentas de análise STR e pipelines que suportam este marcador",
      supported: "Suportado",
      notSupported: "Não Suportado",
      originalPublication: "Publicação Original",
      githubRepository: "Repositório GitHub",
      technology: "Tecnologia",
      descriptionPattern: "{marker} é um lócus STR no cromossomo {chromosome}.",
      inputFormat: "Formato de Entrada",
      outputFormat: "Formato de Saída",
      nativePanels: "Arquivo bed original",
      panel: "Painel",
      configurable: "Configurável",
      wrapper: "Wrapper",
      onlineVersion: "Versão Online",
      lastChecked: "Última Verificação",
      noCompatibleTools: "Nenhuma ferramenta compatível encontrada para este marcador",
      configuration: "Configuração",
      targetFileFormat: "Formato de Arquivo de Destino",
      customizableTargets: "Destinos Personalizáveis",
      customizableTargetsLabel: "Destinos personalizáveis",
      flankingBpRecommended: "BP Flanqueante Recomendado",
      compatibility: "Compatibilidade",
      status: "Status",
      maintained: "Mantido",
      archived: "Arquivado",
      maintenance: "Manutenção",
      "maintenance.active": "Ativo",
      "maintenance.community-maintained": "Mantido pela Comunidade",
      "maintenance.limited": "Limitado",
      "maintenance.unmaintained": "Não Mantido",
      maintainer: "Mantenedor",
      license: "Licença",
      lastRelease: "Última Versão",
      ontModels: "Modelos ONT",
      dockerImage: "Imagem Docker",
      interfaces: "Interfaces",
      limitations: "Limitações",
      maintainerInitiatives: "Iniciativas do Mantenedor",
      repository: "Repositório",
      documentation: "Documentação",
      notes: "Notas",
      addNewTool: "Adicionar Nova Ferramenta",
      contactUs: "entrar em contato conosco",
      toolsDisclaimer: "Todas as ferramentas de software listadas nesta seção são recursos de acesso aberto e de terceiros. O STRhub não mantém relacionamento comercial com os desenvolvedores dessas ferramentas e não recebe compensação financeira por sua inclusão. O catálogo é fornecido exclusivamente para fins educacionais e de pesquisa, para ajudar a comunidade a explorar e comparar os pipelines de análise STR disponíveis. Se você deseja sugerir uma nova ferramenta ou relatar uma atualização, pode",
      toolsNote:
        "A compatibilidade da ferramenta se basa nas características do marcador e validação da comunidade. Se proporcionam repositorios GitHub e referências de publicação para cada ferramenta suportada. Sempre verifique a compatibilidade com seus requisitos específicos de análise e consulte as versões mais recentes.",
      igvViewer: "Visualizador Genômico IGV",
      igvDescription: "Visualização genômica interativa usando IGV.js",
      igvIntegration: "Integração do Visualizador IGV",
      igvText: "O navegador genômico interactivo se cargará aquí mostrando o locus {marker}",
      launchIGV: "Iniciar Visualizador IGV",
      fastaGenerator: "Gerador de Sequência FASTA",
      fastaDescription: "Gere sequências FASTA para o marcador {marker}",
      flankingRegion: "Região Flanqueante (pb)",
      generateFasta: "Gerar Sequência FASTA",
      generatedSequence: "Sequência Gerada",
      downloadFasta: "Baixar FASTA",
      variantAlleles: "Alelos Variantes",
      variantAllelesDescription: "Todos os alelos variantes relatados no STRbase para este marcador",
      noVariantsForMarker: "Ainda não há variantes alélicas reportadas na STRbase para este marcador.",
      addNewVariant: "Adicionar uma nova variante",
      alleleDesignation: "Designação do Alelo",
      strNaming: "STRnaming",
      repeatStructure: "Estrutura de Repetição",
      sequence: "Sequência",
      noFrequenciesMessage:
        "Nenhum dado disponível. As frequências populacionais para este locus estão sendo curadas.",
      contributeDataCta: "Contribuir com dados",
      download: "Baixar",
      source: "Fonte",
      viewInStrbase: "Ver no STRBase",
      descriptionTemplate: "{marker} é um locus STR no cromossomo {chromosome}.",
      tools: {
        hipstr: {
          interfaces: {
            hipstrUi: {
              description:
                "Interface web desenvolvida e mantida pelo STRhub para executar, visualizar e explorar resultados do HipSTR de forma interativa.",
            },
          },
          limitations: {
            requiresAligned:
              "Requer arquivos BAM/CRAM alinhados e realiza realinhamento interno (FASTQ não suportado).",
            illuminaOnly:
              "Projetado para dados de leitura curta Illumina; não compatível com ONT ou PacBio.",
          },
          notes:
            "Mantido ativamente por Tamara Frontanilla como parte do projeto STRhub. O HipSTR-UI permite execução interativa, visualização de alelos e integração de dados populacionais para fluxos de trabalho forenses e de pesquisa.",
        },
        gangstr: {
          limitations: {
            illuminaOnly:
              "Otimizado para dados de leitura curta Illumina; não compatível com ONT ou PacBio.",
            requiresBamBed:
              "Requer alinhamento BAM/CRAM e arquivo BED com lóci definidos.",
          },
          notes:
            "GangSTR está integrado ao catálogo STRhub para benchmarking e comparação entre plataformas. Suporta análise baseada em lócus de expansões de repetições STR e é amplamente usado para conjuntos de dados Illumina em escala populacional.",
        },
        strspy: {
          config: {
            targetFileFormat:
              "BED ou JSON: definições de lócus STR e sequências flanqueadoras",
          },
          limitations: {
            ontOptimized:
              "Otimizado para painéis STR forenses ONT; requer arquivo de referência de lóci.",
            notWgs: "Não projetado para aplicações de genoma completo (WGS).",
          },
          notes:
            "STRspy está integrado ao ecossistema STRhub para análise STR forense e populacional usando dados Oxford Nanopore. Seu design modular permite visualização, benchmarking e compatibilidade cruzada com conjuntos de dados HipSTR-UI.",
        },
        straitrazor: {
          config: {
            targetFileFormat: "CSV ou painel STRaitRazor predefinido",
          },
          limitations: {
            illuminaData: "Projetado para dados Illumina; requer configuração de painel.",
            noAlignment:
              "Não realiza alinhamento de leituras; correspondência de motivo é direta.",
          },
          notes:
            "STRait Razor está incluído no ecossistema STRhub para integração com pipelines forenses baseados em Illumina. Seu algoritmo leve de correspondência de motivos o torna adequado para fins de ensino e treinamento na interpretação de STR.",
        },
        toastr: {
          limitations: {
            forensicNgs:
              "Projetado para análise STR forense NGS; requer painel de referência STRaitRazor.",
            webInterfaceInactive:
              "Interface web inativa em alguns servidores legados.",
          },
          notes:
            "ToaSTR (também conhecido como STRaitRazor-NGS) estende a funcionalidade STRaitRazor para análise de dados Illumina. Integrado ao STRhub para comparação histórica e validação de referência em fluxos de trabalho de genômica forense.",
        },
      },
      repeatTypes: {
        tetranucleotide: "Tetranucleotídeo",
        trinucleotide: "Trinucleotídeo",
        pentanucleotide: "Pentanucleotídeo",
        hexanucleotide: "Hexanucleotídeo",
        dinucleotide: "Dinucleotídeo",
        mononucleotide: "Mononucleotídeo",
        complex: "Complexo",
      },
      categoryLabels: {
        codisCore: "STRs do núcleo CODIS",
        otherAutosomal: "STRs autossômicos (outros)",
        xStr: "STRs do cromossomo X",
        yStr: "STRs do cromossomo Y",
      },
    },
    overview: {
      motifExplorer: {
        title: "Explorar estrutura interna da sequência",
        desc: "Entenda como os motivos canônicos, variantes internas e regiões flanqueadoras definem o alelo.",
        button: "Abrir STR Motif Explorer",
      },
    },
    fastaGeneratorPage: {
      languageLabel: "Idioma atual",
      title: "Gerador FASTA",
      subtitle:
        "Gere sequências FASTA personalizadas para pesquisa e análise.",
      config: {
        title: "Parâmetros de configuração da sequência",
        markerLabel: "Marcador STR",
        markerPlaceholder: "Selecione um marcador",
        allelesLabel: "Alelos (lista ou intervalo)",
        allelesPlaceholder: "ex.: 10-12 ou 9,10,11",
        flankingLabel: "Região flanqueadora (pb por lado)",
        outputLabel: "Tipo de saída",
        generateButton: "Gerar sequência",
      },
      output: {
        title: "Sequência gerada",
        description: "A sequência FASTA gerada aparecerá aqui",
        emptyState:
          'Selecione um marcador e clique em "Gerar sequência" para começar',
        copyButton: "Copiar",
        downloadButton: "Baixar FASTA",
      },
      messages: {
        enterAlleles: "Informe os alelos (ex.: 10-12 ou 9,10,11)",
        markerNotFound: "Marcador não encontrado na lista.",
        errorPrefix: "ERRO",
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
            "Customizable flanking regions (0–1000 bp per side)",
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
      title: "Explorador de Motivos STR",
      subtitle: "Visualize motivos repetitivos STR canônicos e interrupções para marcadores selecionados.",
      header: {
        backLink: "← Voltar ao STRhub",
      },
      fields: {
        marker: {
          label: "Marcador STR",
        },
        viewMode: {
          sequence: "Destaque de sequência",
          schematic: "Esquema de motivo",
          text: "Descrição do motivo",
        },
      },
      cards: {
        configuration: {
          title: "Configuração",
          kitLabel: "Kit / sequência de referência",
          markerPlaceholder: "Selecione um marcador",
          kitPlaceholder: "Selecione um kit",
          emptyState: "Selecione um marcador no painel de configuração.",
        },
        visualization: {
          title: "Explorando a estrutura de {marker}",
        },
      },
      states: {
        noSequence: "O modo de destaque de sequência não está disponível para este marcador.",
      },
      help: {
        general:
          "Exibe a sequência completa do alelo STR com flancos, unidades repetitivas e variantes internas destacadas.",
      },
      scientificNote:
        "Nota científica: Apenas o bloco contínuo de repetições canônicas contribui para a designação do alelo. Cópias semelhantes ao motivo nos flancos ou interrupções são indicativos visuais e não alteram o tamanho do alelo.",
      sourceLabel: "Fonte",
      sourceButtonLabel: "Abrir publicação original",
      labels: {
        canonicalPattern: "Padrão repetitivo canônico:",
      },
      legend: {
        repeat: "Unidade repetitiva",
        interruption: "Interrupção / variante interna",
        other: "Outro / elemento esquemático",
        flank: "Região flanqueadora",
        flankingMotifLike:
          "Unidade do motivo na região flanqueadora, excluída da nomenclatura do alelo.",
      },
      summary: {
        caption:
          "Resumo da estrutura repetitiva: unidades repetitivas são mostradas como MOTIF[n]; 'flank' marca regiões não repetitivas.",
      },
      explanation: {
        generic: "",
      },
      sequenceInterpretationTitle: "Como interpretar a sequência acima?",
      sequenceExample: {
        tooltip: {
          repeat: "Motivo repetitivo (ocorrência do motivo canônico; ver nota abaixo)",
          flank: "Região flanqueadora — não conta para o alelo",
          interruption: "Interrupção / variante interna dentro da região repetitiva",
        },
        note: "Observação: nem toda ocorrência do motivo repetitivo é contabilizada para o tamanho do alelo. Apenas o bloco repetitivo central definido pela estrutura do motivo contribui para a designação do alelo.",
      },
      sequenceSection: {
        representativeTitle:
          "Estrutura interna representativa do alelo {allele} ({kit})",
        note:
          "Observação: Apenas o bloco contínuo de repetições canônicas contribui para a designação do alelo. Cópias semelhantes ao motivo fora desse bloco não são contabilizadas no tamanho do alelo.",
        structureLabel: "Estrutura",
        flankLabel: "flanco",
        legendTitle: "Legenda:",
      },
      tooltipsShort: {
        repeat: "Repetição canônica que conta para o tamanho do alelo.",
        internal: "Variação interna no bloco repetitivo; não adiciona repetições.",
        flanking: "Região flanqueadora",
        flankingMotifLike:
          "Unidade do motivo na região flanqueadora, excluída da nomenclatura do alelo.",
      },
      tooltipsLong: {
        repeat:
          "Estas repetições canônicas compõem o tamanho do alelo. Cada repetição contínua contribui integralmente para a designação do alelo.",
        internal:
          "Interrupções ou inserções dentro do bloco repetitivo são úteis para nomenclatura por sequência, mas não aumentam a contagem de repetições.",
        flanking:
          "As regiões flanqueadoras delimitam o lócus STR. Elas ajudam no desenho do ensaio, porém não são contabilizadas no tamanho do alelo.",
        flankingMotifLike:
          "Unidade do motivo na região flanqueadora, excluída da nomenclatura do alelo.",
      },
    },
    // Community Hub
    communityHub: {
      hero: {
        title: "Conectar, aprender, colaborar",
        subtitle:
          "Estamos construindo a primeira comunidade global dedicada à análise de STRs com sequenciamento de nova geração. Em breve você vai encontrar tutoriais, guias, casos reais e colaborações criadas por pesquisadores, laboratórios e estudantes do mundo todo.",
        cta: "Participar como colaborador(a) inicial",
      },
      howToJoin: {
        title: "Como você pode fazer parte disso",
        intro:
          "Para que a análise de STRs com NGS seja realmente útil e acessível, precisamos de uma comunidade global diversa: laboratórios, estudantes, docentes, desenvolvedores e profissionais trabalhando juntos. Não estamos pedindo seus dados: o que importa é a sua experiência, suas perguntas e suas ideias.",
        cards: {
          experience: {
            title: "Compartilhe sua experiência",
            body: "Conte como você usa STRs no seu trabalho: estudos de caso, resultados de validação, materiais de ensino ou aprendizados com amostras desafiadoras.",
          },
          tutorials: {
            title: "Contribua com tutoriais e guias",
            body: "Ajude outras pessoas explicando um pipeline, um marcador, um conceito ou uma ferramenta que você gostaria de ter entendido antes.",
          },
          collaborations: {
            title: "Participe de colaborações iniciais",
            body: "Participe dos testes de novas funcionalidades do STRhub, dê feedback sobre ideias ou ajude a construir padrões abertos para a análise de STRs com NGS.",
          },
        },
        cta: "Quero contribuir",
      },
      earlyContributors: {
        title: "Colaboradores iniciais e laboratórios parceiros",
        body: "O STRhub está sendo construído com contribuições de pesquisadores, estudantes e laboratórios que acreditam em ciência aberta e tecnologia acessível. Nesta seção vamos destacar as equipes e pessoas que ajudam a construir e validar a plataforma.",
        comingSoon: "Em breve",
      },
      recentPosts: {
        title: "Publicações educacionais recentes",
        subtitle:
          'Artigos "Back to basics" para ajudar você e sua equipe a construir uma base sólida em análise de STRs e NGS.',
        loading: "Carregando publicações...",
        readMore: "Ler Mais",
        viewAll: "Ver todos os artigos do Back to Basics",
        noPosts: "Nenhum artigo disponível ainda.",
      },
      comingSoon: {
        title: "O que vem por aí",
        intro: "Estamos desenvolvendo novos recursos e ferramentas que vão aparecer neste hub aos poucos.",
        cards: {
          structureBrowser: {
            title: "Navegador de estruturas STR",
            body: "Vistas interativas para explorar estruturas repetitivas, regiões flanqueadoras e variantes internas de diferentes marcadores.",
          },
          caseStudies: {
            title: "Estudos de caso de laboratórios",
            body: "Exemplos didáticos de misturas, stutter, degradação e resultados de validação compartilhados pela comunidade.",
          },
          pipelines: {
            title: "Pipelines e ferramentas abertas",
            body: "Guias para construir e conectar pipelines de STR usando o STRhub com ferramentas de análise e linguagens de script comuns.",
          },
        },
      },
      contact: {
        title: "Entre na conversa",
        intro:
          "Tem ideias, perguntas ou propostas de colaboração? Conte como o STRhub pode apoiar o seu trabalho ou o que você gostaria de ver nesta comunidade.",
        messagePlaceholder:
          "Conte sobre sua pesquisa, ideias de colaboração ou funcionalidades que você gostaria de ver no STRhub...",
      },
    },
    // Tools
    tools: {
      title: "Ferramentas e Pipelines",
      subtitle: "Ferramentas de Análise e Processamento",
      description:
        "Suite abrangente de ferramentas de bioinformática e pipelines para análise de STRs, desde processamento de dados brutos até genética populacional.",
      hero: {
        title: "Ferramentas Poderosas para Análise STR",
        description: "Coleção abrangente de ferramentas, pipelines e tutoriais para análise de Repetições em Tandem Curtas. Desde genotipagem até visualização, encontre tudo que você precisa para sua pesquisa.",
        ctaCollaborate: "Enviar ferramenta ou tutorial",
        disclaimer: "Todas as ferramentas de software listadas nesta seção são de acesso aberto. O STRhub não mantém relacionamento comercial com os desenvolvedores dessas ferramentas e não recebe compensação financeira por sua inclusão.",
      },
      header: {
        backToStrhub: "← Voltar ao STRhub",
      },
      common: {
        keyFeatures: "Características Principais:",
        github: "GitHub",
        website: "Site",
        originalPublication: "Publicação original",
      },
      codeLabels: {
        trimmomatic: "Trimmomatic",
        fastp: "fastp",
        bwaAlignment: "Alinhamento BWA-MEM2",
        convertSortIndex: "Converter / ordenar / indexar",
        removeDuplicates: "Remover duplicatas",
        depthCoverage: "Cobertura de profundidade",
        regionInspection: "Inspeção de região",
        quickVisualization: "Visualização rápida",
      },
      hipstr: {
        title: "HipSTR",
        description: "Ferramenta para genotipagem de repetições em tandem curtas a partir de dados de sequenciamento Illumina",
        category: "Genotipagem",
        language: "C++",
        features: {
          1: "Alta precisão",
          2: "Lida com STRs complexos",
          3: "Análise em escala populacional",
        },
      },
      gangstr: {
        title: "GangSTR",
        description: "Ferramenta para perfilamento genômico de repetições em tandem a partir de leituras curtas",
        category: "Perfilamento",
        language: "C++",
        features: {
          1: "Análise genômica completa",
          2: "Suporte para leituras curtas",
          3: "Alto rendimento",
        },
      },
      tutorials: {
        title: "Tutoriais Interativos",
        comingSoon: "Em breve",
      },
      categories: {
        analysis: "Ferramentas de Análise",
        processing: "Processamento de Dados",
        visualization: "Visualização",
        statistics: "Estatísticas",
      },
      learnMore: "Saber Mais",
      documentation: "Documentação",
      github: "Ver no GitHub",
      commands: {
        title: "Comandos Essenciais de Bioinformática",
        card1: {
          title: "Comandos Essenciais para Processar Leituras",
          subtitle: "Para limpar, filtrar e preparar leituras FASTQ antes do genotipagem.",
          features: {
            1: "Remover adaptadores e bases de baixa qualidade",
            2: "Filtrar leituras muito curtas ou de baixa qualidade",
            3: "Preparar FASTQs limpos para o alinhamento",
          },
          commands: {
            trimmomatic: "trimmomatic PE sample_R1.fastq sample_R2.fastq \\\n  output_R1_paired.fastq output_R1_unpaired.fastq \\\n  output_R2_paired.fastq output_R2_unpaired.fastq \\\n  ILLUMINACLIP:adapters.fa:2:30:10 SLIDINGWINDOW:4:20 MINLEN:50",
            fastp: "fastp -i sample_R1.fastq -I sample_R2.fastq \\\n      -o clean_R1.fastq -O clean_R2.fastq \\\n      --detect_adapter_for_pe --html report.html",
          },
        },
        card2: {
          title: "Processamento de Alinhamento e BAM",
          subtitle: "Para alinhar leituras e gerar BAM prontos para análise.",
          features: {
            1: "Alinhamento de alta qualidade",
            2: "Ordenação e indexação",
            3: "Operações de limpeza BAM",
          },
          commands: {
            bwa: "bwa-mem2 mem reference.fasta sample_R1.fastq sample_R2.fastq > sample.sam",
            samtools: "samtools view -bS sample.sam | samtools sort -o sample.sorted.bam\nsamtools index sample.sorted.bam",
            rmdup: "samtools rmdup sample.sorted.bam sample.rmdup.bam",
          },
        },
        card3: {
          title: "Inspeção de Regiões STR e Cobertura",
          subtitle: "Para explorar cobertura, regiões flanqueadoras e sinais de qualidade em STR.",
          features: {
            1: "Visualizar regiões flanqueadoras",
            2: "Inspecionar soft-clips e desalinhamentos",
            3: "Avaliar profundidade de cobertura STR",
          },
          commands: {
            depth: "samtools depth -r chr12:100000-100300 sample.bam > depth.txt",
            view: "samtools view sample.bam chr12:100000-100300",
            tview: "samtools tview sample.bam reference.fasta",
          },
        },
        installation: {
          title: "Requisitos de Instalação",
          intro: "As ferramentas mostradas acima não vêm instaladas por padrão. Para executar estes comandos, você precisa instalar as ferramentas de bioinformática de acordo com seu sistema operacional.",
          linuxTitle: "Linux (Ubuntu/Debian)",
          macTitle: "macOS (Homebrew)",
          windowsTitle: "Windows (WSL2 recomendado)",
          windowsNote: "Ferramentas de bioinformática não funcionam de forma nativa no Windows. Use WSL2 (Ubuntu) ou um contêiner Linux para garantir total compatibilidade.",
          guideSoon: "Em breve adicionaremos um guia completo de instalação para cada sistema operacional.",
        },
      },
      straitrazor: {
        title: "STRait Razor",
        description: "Ferramenta leve de correspondência de motivos para análise forense de STR baseada em Illumina. Adequada para fins de ensino e treinamento em interpretação de STR.",
        tags: {
          category: "Genotipagem",
          language: "R",
        },
        features: {
          1: "Correspondência direta de motivos a partir de FASTQ",
          2: "Algoritmo leve para painéis forenses",
          3: "Interface web online disponível",
          4: "Integrado ao STRhub para pipelines baseados em Illumina",
        },
        buttons: {
          github: "GitHub",
          paper: "Publicação original",
          online: "Versão Online",
        },
      },
      strnaming: {
        title: "STRNaming",
        description: "Método imparcial para gerar automaticamente descrições curtas, informativas e legíveis de alelos STR.",
        tags: {
          annotation: "Anotação",
          forensic: "Forense",
          webtool: "Web",
        },
        features: {
          1: "Nomenclatura padronizada de alelos",
          2: "Descrição automatizada de alelos",
          3: "Desenvolvido pelo Instituto Forense da Holanda",
        },
        buttons: {
          website: "Website",
        },
      },
      strider: {
        title: "STRIDER",
        description: "Banco de dados populacional online de frequências alélicas STR, cuidadosamente curado, que oferece estimativas de probabilidade de genótipos e controle de qualidade de STR autossômicos.",
        tags: {
          population: "Dados populacionais",
          qc: "Controle de qualidade",
          webtool: "Web",
        },
        features: {
          1: "Frequências alélicas de alta qualidade e curadas",
          2: "Estimativas de probabilidade de genótipos",
          3: "Controle de qualidade para STR autossômicos",
          4: "Desenvolvido no Instituto de Medicina Legal, Universidade Médica de Innsbruck",
        },
        buttons: {
          website: "Website",
        },
      },
      strspy: {
        title: "STRspy",
        description: "Toolkit em Python para análise de STR, perfilagem de alelos e visualização.",
        tags: {
          category: "Análise",
          language: "Python",
        },
        features: {
          1: "Genotipagem de perfis STR",
          2: "Análise estatística de padrões de alelos",
          3: "Integração simples com pipelines de bioinformática",
          4: "Toolkit open source",
        },
        buttons: {
          github: "GitHub",
          paper: "Publicação original",
        },
      },
    },
    // STRBase Integration
    strbase: {
      title: "Integração NIST STRBase",
      subtitle: "Integração abrangente com a base de dados NIST STRBase para dados autoritativos de marcadores STR",
      connected: "Conectado",
      lastUpdated: "Última atualização",
      markersIntegrated: "marcadores integrados",
      totalAlleles: "total de alelos",
      tabs: {
        overview: "Visão Geral",
        features: "Recursos",
        updates: "Atualizações",
        api: "Acesso API",
      },
      integrationStatus: "Estado de la Integración",
      connectionDescription: "Estado actual de conexión y sincronización de datos",
      connectionStatus: "Estado de Conexión",
      active: "Activo",
      dataFreshness: "Actualización de Datos",
      updatedDaily: "Actualizado diariamente",
      coverage: "Cobertura",
      fullCoverage: "100% de marcadores disponíveis",
      populationGroups: "Grupos Populacionais",
      aboutStrbase: "Sobre STRBase",
      strbaseDescription: "Banco de Datos de ADN de Repeticiones Cortas en Tándem del NIST",
      strbaseInfo:
        "STRBase es una base de datos integral mantenida por el Instituto Nacional de Estándares y Tecnología (NIST) que proporciona datos poblacionales, información de secuencia y otros detalles para loci de repeticiones cortas en tándem (STR) utilizados en pruebas de identificación humana.",
      maintainedBy: "Mantenido por",
      nist: "NIST",
      primaryUse: "Uso principal",
      humanIdentification: "Identificación humana",
      dataTypes: "Tipos de datos",
      populationFrequenciesSequences: "Frecuencias poblacionales, secuencias",
      visitStrbase: "Visitar STRBase",
      dataQuality: "Calidad y Verificación de Datos",
      dataQualityDescription: "Cómo aseguramos la precisión y confiabilidad de los datos",
      automatedVerification: "Verificación Automatizada",
      verificationDescription:
        "Todos los datos de marcadores se cruzan automáticamente con registros oficiales de STRBase",
      regularUpdates: "Actualizaciones Regulares",
      updatesDescription:
        "La sincronización diária asegura que los datos más recientes de STRBase estén siempre disponibles",
      dataIntegrity: "Integridad de Datos",
      integrityDescription: "Verificaciones integrales de validación mantienen la calidad y consistencia de los datos",
      features: {
        populationFrequency: {
          title: "Datos de Frecuencia Poblacional",
          description: "Distribuciones completas de frecuencia alélica para poblaciones AFR, NAM, EAS, SAS y EUR",
        },
        markerVerification: {
          title: "Verificación de Marcadores",
          description: "Todos los marcadores verificados contra registros oficiales de NIST STRBase",
        },
        referenceSequences: {
          title: "Secuencias de Referencia",
          description: "Patrones de isoalelos y secuencias de referencia verificados por NIST",
        },
        directLinks: {
          title: "Enlaces Directos STRBase",
          description: "Acceso con un clic a páginas oficiales de marcadores de STRBase",
        },
        automatedUpdates: {
          title: "Actualizaciones Automatizadas",
          description: "Sincronización regular con actualizaciones de la base de datos STRBase",
        },
      },
      recentUpdates: "Actualizaciones Recientes",
      recentUpdatesDescription: "Últimos cambios y adiciones a la integración STRBase",
      searchUpdates: "Buscar actualizaciones...",
      updateTypes: {
        dataUpdate: "Actualización de Datos",
        newMarkers: "Nuevos Marcadores",
        integrationEnhancement: "Mejora de Integración",
        xStrExpansion: "Expansión X-STR",
      },
      apiAccess: "Acceso API STRBase",
      apiDescription: "Acceso programático a datos integrados de STRBase para investigación y desarrollo",
      availableEndpoints: "Endpoints Disponibles",
      listAllMarkers: "Listar todos los marcadores",
      getMarkerDetails: "Obtener detalles del marcador",
      getPopulationFrequencies: "Obtener frecuencias poblacionales",
      listPopulationGroups: "Listar grupos poblacionales",
      exampleResponse: "Respuesta de Ejemplo",
      apiDocumentation: "Documentación de API",
      downloadSdk: "Descargar SDK",
    },
    // Back to Basics
    basics: {
      title: "Fundamentos",
      subtitle: "Entendiendo los Fundamentos",
      description:
        "Domine los conceptos esenciales en bioinformática y genética forense. Desde formatos de archivo hasta regiones flanqueantes, construya una base sólida para el análisis STR.",
      readArticle: "Leer Artículo",
      backToArticles: "← Volver a Todos los Artículos",
      readTime: "min de lectura",
      topicsCovered: "Temas cubiertos:",
    },
    // Blog
    blog: {
      title: "Centro Comunitario",
      subtitle: "Últimas Investigaciones y Discusiones",
      description:
        "Manténgase actualizado con los últimos desarrollos en análisis STR, investigación en genética forense y discusiones de la comunidad.",
      categories: {
        research: "Investigación",
        tutorials: "Tutoriales",
        news: "Noticias",
        community: "Comunidad",
      },
      readMore: "Leer Más",
      publishedOn: "Publicado el",
    },
    // About
    about: {
      title: "Acerca de STRhub",
      subtitle: "Avanzando Investigación y Educación en STR",
      mission: "Nuestra Misión",
      missionText:
        "STRhub se dedica al avance de la genética forense y poblacional a través del acceso abierto, la colaboración y la educación. Proporcionamos herramientas confiables, conjuntos de datos curados y recursos de aprendizaje para hacer que el análisis STR sea accesible para investigadores, estudiantes y laboratorios de todo el mundo. Nuestro objetivo es fomentar una comunidad global donde el conocimiento, la tecnología y la colaboración se unan para fortalecer la ciencia en todas partes.",
      team: "Nuestro Equipo",
      teamText:
        "Somos un equipo multidisciplinario de investigadores, bioinformáticos y científicos forenses comprometidos con hacer el análisis STR más accesible y estandarizado.",
      teamText2:
        "El proyecto está dirigido por la Dra. Tamara Frontanilla, investigadora en genética forense y bioinformática, con amplia experiencia en genética poblacional, tecnologías de secuenciación y educación.",
      whyThisMatters: "Por qué es importante",
      whyThisMattersText:
        "Porque la genética es más que datos. Por detrás de cada dato hay personas, historia y diversidad. Cada STR cuenta una parte de quiénes somos. Al abrir el acceso a la información y conectar investigadores de distintos lugares, hacemos la ciencia más inclusiva, justa y real. Juntos podemos ir más lejos y hacer que el conocimiento sea de todos.",
      contact: "Contáctanos",
      contactText: "¿Tienes preguntas o sugerencias? Nos encantaría escucharte.",
      contactDescription:
        "Envíanos un mensaje y te responderemos pronto. Para problemas técnicos o solicitudes de funciones, contáctanos en GitHub. Fomentamos las contribuciones de la comunidad global.",
      formName: "Nombre",
      formNamePlaceholder: "Tu nombre",
      formEmail: "Correo electrónico",
      formEmailPlaceholder: "tu.correo@ejemplo.com",
      formSubject: "Asunto",
      formSubjectPlaceholder: "¿De qué te gustaría hablar?",
      formMessage: "Mensaje",
      formMessagePlaceholder:
        "Cuéntanos sobre tu investigación, preguntas o ideas de colaboración...",
      formSend: "Enviar mensaje",
      email: "Email",
      github: "GitHub",
      twitter: "Twitter",
      collaboration: "Colaboración",
      collaborationText:
        "STRhub es un proyecto de código abierto. Damos la bienvenida a contribuciones de investigadores, desarrolladores e instituciones de todo el mundo.",
      contribute: "Contribuir",
      documentation: "Documentación",
      support: "Soporte",
    },
    // Common
    common: {
      loading: "Cargando...",
      error: "Error",
      notFound: "No Encontrado",
      backToHome: "Volver al Inicio",
      frequency: "Frecuencia",
      allele: "Alelo",
      count: "Conteo",
      darkMode: "Modo Oscuro",
      lightMode: "Modo Claro",
      language: "Idioma",
      english: "Inglés",
      portuguese: "Portugués",
      spanish: "Español",
    },
    projects: {
      title: "Projetos Internacionais",
      heroDescription:
        "Explore grandes projetos genômicos internacionais que avançam nossa compreensão da diversidade genética humana e da análise de STR.",
      visitProject: "Visitar Projeto",
      static: {
        genomes1000: {
          description:
            "Projeto pioneiro mapeando a variação genética global. Dados atuais incluem genomas de alta cobertura (30x).",
        },
        hgdp: {
          description:
            "Amostras de mais de 50 populações diversas. Recurso-chave para estudos de estrutura populacional.",
        },
        strSequencingProject: {
          description:
            "Consórcio sediado pelo NIST dedicado à caracterização abrangente de genomas humanos de referência.",
        },
        gnomad: {
          description:
            "Base global com milhões de variantes genômicas; útil para comparar STRs com SNPs e indels.",
        },
        sgdp: { description: ">300 genomas completos de populações sub-representadas." },
        allOfUs: {
          description:
            "Banco global curado de haplótipos Y-STR para comparação forense, inferência de linhagem paterna e estudos populacionais.",
        },
        humanPangenome: {
          description:
            "Nova referência genômica com múltiplos haplótipos, abordando limitações do GRCh38.",
        },
        strider: { description: "Base validada e padronizada de alelos STR forenses." },
        strbase: { description: "Recurso clássico sobre loci STR mantido pelo NIST (National Institute of Standards and Technology)." },
      },
    },
    // Mix Profiles
    mixProfiles: {
      title: "Simulador de Misturas de DNA",
      subtitle: "beta",
      description: "Usando dados de demonstração — você pode carregar suas próprias amostras quando disponível.",
      simulatorDescription:
        "Este simulador permite visualizar como dois ou três perfis de DNA se comportam quando são misturados, tanto na eletroforese capilar (CE) quanto no NGS. Ele ajuda a compreender como as alturas dos picos mudam, como surgem os stutters e como alelos minoritários podem ficar ocultos ou confundidos com ruído, mostrando a complexidade real da interpretação de perfis mistos na genética forense.",
      controls: {
        locus: "Locus",
        sampleA: "Amostra A",
        sampleB: "Amostra B",
        ratioA: "Proporção A",
        contributor: "Contribuinte {label}",
        searchSample: "Buscar amostra {label}...",
        noSampleFound: "Nenhuma amostra encontrada.",
      },
      actions: {
        reSimulate: "Re-simular",
        resetToDemo: "Restaurar padrão",
        exportJson: "Exportar JSON",
      },
      results: {
        title: "Resultados da Mistura para",
        allele: "Alelo",
      },
      charts: {
        ceTitle: "Análise de Eletroforese Capilar (RFU)",
        ngsTitle: "Análise de Sequenciamento de Nova Geração",
      },
      ngs: {
        disclaimer:
          "Os genótipos vêm de amostras do Projeto 1000 Genomes. As sequências NGS mostradas são haplótipos representativos para cada alelo, não necessariamente a sequência exata deste indivíduo.",
        tableAllele: "Alelo",
        tableCoverage: "Cobertura (leituras)",
        tableRepeatSequence: "Sequência de Repetição",
        axisLabelAllele: "Alelo",
        axisLabelCoverage: "Cobertura",
        fullSequenceColumnLabel: "Sequência completa",
        fullSequenceTooltipAria: "Explicação sobre a sequência completa do amplicon",
        fullSequenceNote:
          "No NGS é mostrada a sequência completa do amplicon, incluindo as regiões flanqueadoras e variantes internas. Essas regiões podem conter inserções, deleções ou interrupções, de modo que um alelo pode ter uma sequência total mais longa do que outro mesmo tendo menos unidades repetitivas. Isso é normal na tipagem de STR baseada em sequenciamento.",
        isoTooltip:
          "Isoalelo: variação na sequência sem mudança no comprimento. Detectável apenas com NGS e aumenta o poder de discriminação entre indivíduos.",
      },
      trueGenotypes: {
        toggleLabel: "Mostrar genótipos verdadeiros",
        title: "Genótipos verdadeiros em {locus}",
        notSelected: "Não selecionado",
        none: "—",
        na: "Genótipo não disponível",
        naHelp: "Nenhum alelo verdadeiro encontrado para este locus no conjunto de dados de demonstração.",
        noSample: "Nenhum",
      },
      ceChart: {
        axisAllele: "Alelo",
        axisRFU: "RFU",
        legendBaselineNoise: "Ruído de linha de base (RFU)",
        legendTrueAlleles: "Alelos verdadeiros / Sinal (RFU)",
        legendStutter: "Stutter (RFU)",
        legendCalled: "Chamado",
        legendDropoutRisk: "Risco de perda",
        legendStutterPeak: "Pico de stutter",
        thresholdAT: "AT",
        thresholdST: "ST",
        tooltipAllele: "Alelo {allele}",
        tooltipAlleleMarker: "Alelo {allele} — {marker}",
        tooltipTrue: "Alelo {label} — {rfu} RFU",
        tooltipStutter: "Stutter em {allele} — {rfu} RFU (de {parent})",
        tooltipCalled: "Chamado",
        tooltipDropout: "Risco de perda",
        infoLabel: "Mostrar nota sobre o modelo de stutter",
        infoText:
          "Simulador educacional: o stutter é modelado como uma fração específica de cada locus em relação à altura do pico verdadeiro (tipicamente ~6–11%, maior em alguns loci longos). Esses valores são aproximações educacionais, não parâmetros validados de nenhum kit específico.",
      },
      parameters: {
        at: "AT (RFU)",
        st: "ST (RFU)",
        degradationK: "Degradação k (por 100 pb)",
        noiseBase: "Ruído / Base (RFU)",
        stutterLevel: "Nível de stutter (×)",
        autoScale: "Auto-escala do eixo Y",
        fixedScale: "Escala forense fixa (0–800 RFU)",
        atTooltip: "Limiar Analítico: RFU mínimo para distinguir um pico do ruído.\n\nFaixa típica: 50–100 RFU.",
        stTooltip: "Limiar Estocástico: Nível de RFU onde o desequilíbrio de heterozigoto se torna improvável.\n\nFaixa típica: 150–200 RFU.",
        autoScaleTooltip: "Ajusta automaticamente o eixo Y para ajustar todos os picos.\n\nÚtil para visualizar picos menores de baixo RFU ou perfis degradados.",
        degradationKTooltip: "Coeficiente que simula a perda de sinal em fragmentos longos.\n\nValores típicos:\n• 0,010 = boa qualidade\n• 0,015 – 0,020 = amostra difícil\n• > 0,020 = severamente degradada\n\nk maior → mais decaimento em alelos mais longos.",
        noiseBaseTooltip: "Ruído de fluorescência de linha de base simulado.\n\nValores maiores criam mais picos de fundo pequenos e flutuação de linha de base.",
        stutterLevelTooltip: "Multiplicador global para intensidade de stutter.\n\n• 1,0 = comportamento médio real do locus\n• < 1,0 = perfil limpo\n• > 1,0 = stutter extra para treinamento/visualização.",
      },
      quickGuide: {
        title: "Guia Rápido para Configuração de Misturas de DNA",
        button: "Guia Rápido",
        thresholds: {
          title: "1. Limiares na prática",
          at: "AT: Valores menores revelam picos menores; valores maiores suprimem o ruído.",
          st: "ST: Picos abaixo de ST podem indicar desequilíbrio de heterozigoto ou perda.",
          ranges: "Faixas típicas: AT = 50–100 RFU; ST = 150–200 RFU.",
        },
        mixture: {
          title: "2. Proporções de mistura",
          balanced: "50/50: equilibrada",
          moderate: "70/30: desequilíbrio moderado",
          strong: "80/20 ou 90/10: desequilíbrio forte, útil para ensinar comportamento de mistura",
        },
        markers: {
          title: "3. Loci com comportamento de stutter mais claro",
          description: "Alelos mais longos frequentemente mostram comportamento de stutter mais notável.",
          fga: "FGA",
          d18s51: "D18S51",
          d21s11: "D21S11",
          d2s1338: "D2S1338",
        },
        simulation: {
          title: "4. Como simular \"stutter do contribuidor principal similar ao contribuidor menor\"",
          ratio: "Proporção de mistura ≥ 80/20",
          degradation: "Degradação k: 0,015–0,030",
          stutter: "Nível de stutter (×): 1,5–2,0 (para fins didáticos)",
          loci: "Preferentemente, loci em que os contribuidores diferem por apenas uma unidade de repetição (por exemplo, 10 vs 9).",
        },
        notes: {
          title: "5. Notas práticas",
          longerAlleles: "Alelos mais longos perdem sinal mais cedo quando degradados.",
          minorContributors: "Contribuidores menores caem em RFU mais cedo sob degradação.",
          stutter: "Stutter é mais visível quando o contribuidor principal domina.",
          notAllLoci: "Nem todos os loci exibem esses efeitos igualmente.",
        },
      },
    },
    mixtures: {
      presets: {
        stutterMinor: "Stutter ≈ minoritário",
        dropout: "Alelo minoritário baixo",
        overlap: "Alelos sobrepostos",
      },
      tooltips: {
        stutterMinor:
          "Mostra um caso em que o pico de stutter tem altura semelhante a um alelo minoritário, tornando ambíguo o pico pequeno.",
        lowMinor:
          "Mostra um alelo do contribuidor minoritário muito próximo ao limite de detecção.",
        overlap:
          "Mostra dois contribuintes que compartilham um alelo, gerando um pico combinado mais alto no centro.",
      },
    },
    // Back to Basics
    basics: {
      title: "Fundamentos",
      subtitle: "Entendendo os Fundamentos",
      description:
        "Domine os conceitos essenciais em bioinformática e genética forense. Desde formatos de arquivo até regiões flanqueantes, construa uma base sólida para a análise STR.",
      readArticle: "Ler Artigo",
      backToArticles: "← Voltar a Todos os Artigos",
      readTime: "min de leitura",
      topicsCovered: "Tópicos:",
    },
    // About
    about: {
      title: "Sobre o STRhub",
      subtitle: "Avançando Pesquisa e Educação em STR",
      mission: "Nossa Missão",
      missionText:
        "O STRhub é dedicado ao avanço da genética forense e populacional através de acesso aberto, colaboração e educação. Fornecemos ferramentas confiáveis, conjuntos de dados curados e recursos de aprendizado para tornar a análise STR acessível para pesquisadores, estudantes e laboratórios em todo o mundo. Nosso objetivo é incentivar uma comunidade global onde conhecimento, tecnologia e colaboração se unem para fortalecer a ciência em todos os lugares.",
      team: "Nossa Equipe",
      teamText:
        "Somos uma equipe multidisciplinar de pesquisadores, bioinformáticos e cientistas forenses comprometidos em tornar a análise STR mais acessível e padronizada.",
      teamText2:
        "O projeto é liderado pela Dra. Tamara Frontanilla, pesquisadora em genética forense e bioinformática, com ampla experiência em genética populacional, tecnologias de sequenciamento e educação.",
      whyThisMatters: "Por que isso importa",
      whyThisMattersText:
        "Porque a genética é mais que dados. Por trás de cada dado há pessoas, história e diversidade. Cada STR conta uma pequena parte de quem somos. Ao abrir o acesso à informação e conectar pesquisadores de diferentes lugares, tornamos a ciência mais inclusiva, justa e real. Juntos, podemos ir mais longe e fazer do conhecimento algo que verdadeiramente pertence a todos.",
      contact: "Entre em contato",
      contactText: "Tem perguntas ou sugestões? Adoraríamos ouvir você.",
      contactDescription:
        "Envie-nos uma mensagem e responderemos em breve. Para problemas técnicos ou solicitações de recursos, entre em contato conosco no GitHub. Incentivamos contribuições da comunidade global.",
      formName: "Nome",
      formNamePlaceholder: "Seu nome",
      formEmail: "E-mail",
      formEmailPlaceholder: "seu.email@exemplo.com",
      formSubject: "Assunto",
      formSubjectPlaceholder: "Sobre o que você gostaria de falar?",
      formMessage: "Mensagem",
      formMessagePlaceholder:
        "Conte sobre sua pesquisa, ideias de colaboração ou funcionalidades que você gostaria de ver no STRhub...",
      formSend: "Enviar mensagem",
      email: "Email",
      github: "GitHub",
      twitter: "Twitter",
      collaboration: "Colaboração",
      collaborationText:
        "O STRhub é um projeto de código aberto. Damos as boas-vindas a contribuições de pesquisadores, desenvolvedores e instituições de todo o mundo.",
      contribute: "Contribuir",
      documentation: "Documentação",
      support: "Suporte",
    },
  },
  es: {
    // Navigation
    nav: {
      home: "Inicio",
      catalog: "Catálogo",
      basics: "Fundamentos",
      blog: "Comunidad",
      tools: "Herramientas",
      projects: "Proyectos",
      about: "Acerca de",
      search: "Buscar",
      strbase: "Integración STRBase",
      mixProfiles: "Perfiles de Mezclas",
    },
    // Search
    search: {
      title: "Resultados de Búsqueda",
      placeholder: "Buscar marcadores, herramientas, artículos...",
      noResults: "No se encontraron resultados",
      noResultsDescription: "No se encontró contenido para",
      trySearching: "Intenta buscar:",
      resultsFor: "Resultados para",
      found: "Encontrado",
      result: "resultado",
      results: "resultados",
      startSearch: "Inicia tu búsqueda",
      enterSearchTerm: "Ingresa un término de búsqueda para encontrar contenido en STRhub",
      types: {
        markers: "Marcadores",
        markerSections: "Secciones de Marcadores",
        tools: "Herramientas",
        blog: "Artículos",
        page: "Páginas",
      },
      suggestions: {
        markers: "Nombres de marcadores (FGA, D18S51, TH01)",
        tools: "Nombres de herramientas (HipSTR, STRspy, GangSTR)",
        topics: "Temas (frecuencias, genotipado, análisis)",
      },
    },
    // Homepage
    home: {
      title: "STRhub",
      subtitle: "Centro de STRs",
      description: "De CE a NGS: una plataforma integral de STR para genética forense y estudios poblacionales",
      searchPlaceholder: "Buscar marcadores, herramientas, artículos...",
      searchButton: "Buscar en Base de Datos",
      exploreButton: "Explorar Catálogo",
      exploreSectionTitle: "Explorar STRhub",
      featuresSectionTitle: "Características de la Plataforma",
      explore: {
        basics: {
          title: "Fundamentos",
          description:
            "Aprenda conceptos fundamentales: CRAM/BAM/SAM, regiones flanqueantes y términos clave de bioinformática",
        },
        catalog: {
          title: "Catálogo",
          description:
            "Explora marcadores STR con contexto genómico completo, datos poblacionales, frecuencias alélicas, estructuras variantes y herramientas avanzadas de análisis.",
        },
        mixProfiles: {
          title: "Perfiles de Mezclas",
          description: "Simule, visualice y compare perfiles de mezclas STR para datos CE y NGS",
        },
        tools: {
          title: "Herramientas y Pipelines",
          description:
            "Herramientas y flujos de análisis para el genotipado y evaluación de marcadores STRs.",
        },
        fastaGenerator: {
          title: "Generador FASTA",
          description: "Genere secuencias FASTA personalizadas para sus necesidades de investigación y análisis",
        },
        igvViewer: {
          title: "Visor IGV",
          description: "Integración con un clic con IGV para visualización y análisis genómico",
        },
        projects: {
          title: "Proyectos",
          description:
            "Explore grandes proyectos genómicos internacionales que avanzan la investigación STR y diversidad genética humana",
        },
        motifExplorer: {
          title: "Explorador de Motivos STR",
          description: "Explore interactivamente motivos repetitivos STR en marcadores y estructuras alélicas.",
        },
        communityHub: {
          title: "Centro Comunitario",
          description:
            "Experiencias de usuarios, tutoriales, actualizaciones y discusiones de investigación colaborativa",
        },
        about: {
          title: "Acerca de",
          description: "Conozca nuestra misión, equipo y cómo contribuir a la comunidad STRhub",
        },
      },
      features: {
        integratedDatabase: {
          title: "Base de Datos Integrada de STR",
          description:
            "Acceda a marcadores CODIS y no-CODIS con frecuencias alélicas, secuencias flanqueantes y datos poblacionales en grupos AFR, NAM, EAS, SAS y EUR",
        },
        visualizationSuite: {
          title: "Suite de Visualización",
          description:
            "Gráficos interactivos, electroferogramas e integración IGV para visualización y análisis genómico integral",
        },
        mixtureSimulation: {
          title: "Motor de Simulación de Mezclas",
          description:
            "Genere y compare perfiles de mezclas STR para datos CE y NGS con proporciones de contribuyentes personalizables",
        },
        fastaMetadata: {
          title: "Generador FASTA y Metadatos",
          description:
            "Cree secuencias FASTA personalizadas con regiones flanqueantes configurables y exporte metadatos completos de marcadores",
        },
        educationalResources: {
          title: "Recursos Educativos",
          description:
            "Tutoriales completos que cubren fundamentos de bioinformática, formatos de archivo y mejores prácticas de análisis STR",
        },
        communityCollaboration: {
          title: "Comunidad y Colaboración",
          description:
            "Manténgase actualizado con las últimas investigaciones, comparta experiencias y colabore con la comunidad global de genética forense",
        },
      },
      featuredTitle: "Marcadores Destacados",
      viewAll: "Ver Todos los Marcadores",
      getStarted: "Comenzar",
      learnMore: "Saber Más",
      footer: {
        mission:
          "Impulsando la investigación genética mediante ciencia colaborativa.",
        community: "Creado para la comunidad global de investigación",
      },
    },
    // Catalog
    catalog: {
      title: "Catálogo de Marcadores STR",
      description:
        "Base de datos integral de marcadores STRs, incluyendo los que componen el CODIS, otros autosómicos, X-STRs e Y-STRs.",
      subtitle:
        "Este catálogo reúne datos de STR provenientes de STRbase, STRidER, pop.STR y estudios poblacionales de datos abiertos corregidos por pares.",
      searchPlaceholder: "Buscar marcadores por nombre o descripción...",
      filterByCategory: "Filtrar por Categoría",
      allCategories: "Todas las Categorías",
      categories: {
        "CODIS Core": "CODIS Core",
        "Non-Core": "No-Core",
        Autosomal: "Autosómicos",
        "Y-STR": "Y-STRs",
        "X-STR": "X-STRs",
      },
      sortBy: "Ordenar por",
      sortOptions: {
        name: "Nombre",
        chromosome: "Cromosoma",
        category: "Categoría",
      },
      markersFound: "marcadores encontrados",
      showing: "Mostrando",
      of: "de",
      viewDetails: "Ver Detalles",
      chromosome: "Crom",
      motif: "Motivo",
      complex: "Complejo",
      alleles: "Alelos",
      repeatType: "Tipo de Repetición",
      nistVerifiedOnly: "Solo Verificados NIST",
      populations: "poblaciones",
      dataIntegration: "Integración de Datos",
      dataIntegrationDescription:
        "Este catálogo reúne datos STR provenientes de NIST STRBase, pop.STR y estudios poblacionales de acceso abierto revisados por pares, ofreciendo una referencia unificada y de alta resolución sobre estructuras alélicas, variantes de secuencia y perfiles de frecuencias poblacionales.",
      visitStrbase: "Visitar NIST STRBase",
      visitPopStr: "Visitar pop.STR",
      card: {
        description: "Segmento de ADN en el cromosoma {chromosome}",
        alleleRangeLabel: "Rango de Alelos",
      },
    },
    // Marker Details
    marker: {
      backToCatalog: "Volver al Catálogo",
      tabs: {
        overview: "Resumen",
        isoalleles: "Isoalelos",
        frequencies: "Frecuencias",
        tools: "Herramientas",
        igv: "Visor IGV",
        fasta: "Generador FASTA",
      },
      sections: {
        overview: {
          description: "Información básica, coordenadas genómicas y datos de referencia",
          tags: ["resumen", "información básica", "coordenadas", "referencia"],
        },
        frequencies: {
          description: "Distribución de frecuencias alélicas y paneles poblacionales",
          tags: ["frecuencias", "frecuencias alélicas", "datos poblacionales", "estadísticas"],
        },
        variants: {
          description: "Alelos variantes, isoalelos y patrones de secuencia",
          tags: ["variantes", "isoalelos", "secuencias", "patrones alélicos"],
        },
        tools: {
          description: "Herramientas y pipelines compatibles para análisis",
          tags: ["herramientas", "pipelines", "análisis", "compatibilidad"],
        },
      },
      basicInfo: "Información Básica",
      genomicCoords: "Coordenadas Genômicas",
      nistReference: "Referencia NIST STRBase",
      nistDescription: "Información de referencia oficial de la base de datos NIST STRBase",
      chromosome: "Cromosoma",
      position: "Posición",
      cytogeneticLocation: "Ubicación citogenética",
      motif: "Motivo",
      type: "Tipo",
      alleleRange: "Rango de Alelos",
      category: "Categoría",
      build: "Build",
      strand: "Cadena",
      start: "Inicio",
      end: "Fin",
      referenceAllele: "Alelo de Referencia",
      lastUpdated: "Última Actualización",
      commonAlleles: "Alelos Comunes",
      viewInBrowser: "Ver en Navegador Genômico UCSC",
      isoallelePatterns: "Patrones de Isoalelos",
      isoalleleDescription: "Patrones de secuencia detallados y variaciones para diferentes alelos",
      referenceSequences: "Secuencias de referencia verificadas contra NIST STRBase",
      reference: "Referencia",
      nistVerified: "Verificado NIST",
      alleleFreqDistribution: "Distribución de Frecuencia de Alelos",
      freqDescription: "Datos de frecuencia poblacional para diferentes alelos",
      dataSource: "Fuente de datos: STRBase – NIST",
      ocePopulationInfo:
        "El conjunto de datos poblacional de Oceanía de pop.STR incluye los siguientes grupos poblacionales: Bougainville (Melanesio NAN) y Nueva Guinea (Papúa).",
      additionalSourceInfo:
        "Las frecuencias alélicas en STRhub se derivan del conjunto de datos STRs Local del portal SP-SMART (CESGA), que comprende 3.809 individuos genotipados de diversas poblaciones.",
      datasetButton: "Conjunto de datos",
      originalPublicationButton: "Publicación original",
      populationGroup: "Grupo Poblacional",
      populations: {
        AFR: "Africano",
        NAM: "Americano",
        EAS: "Asiático Oriental",
        SAS: "Asiático del Sur",
        EUR: "Europeu",
        OCE: "Oceánico",
      },
      frequencies: {
        region: {
          latam: "LATAM",
        },
        datasetNotes: {
          provenance:
            "Estas frecuencias se derivan del conjunto de datos STRs Local del portal SP-SMART (CESGA), que comprende 3.809 individuos genotipados de poblaciones diversas.",
          populationLabel: "Grupos poblacionales incluidos",
          populationAfr:
            "Central African Republic (Biaka Pygmies), Democratic Republic of the Congo (Mbuti Pygmies), Kenya (Bantu N.E.), Namibia (San), Nigeria (Yoruba), Senegal (Mandenka), Somalia, and South Africa (Bantu).",
          populationNam:
            "Brazil (Karitiana), Brazil (Surui), Colombia (Colombian), Dominican Republic, Mexico (Maya), and Mexico (Pima).",
          populationEas:
            "Cambodia (Cambodian), China (Dai), China (Daur), China (Han), China (Hezhen), China (Lahu), China (Miaozu), China (Mongola), China (Naxi), China (Oroqen), China (She), China (Tu), China (Tujia), China (Xibo), China (Yizu), Japan (Japanese), and Siberia (Yakut).",
          populationSas:
            "China (Uygur), Pakistan (Balochi), Pakistan (Brahui), Pakistan (Burusho), Pakistan (Hazara), Pakistan (Kalash), Pakistan (Makrani), Pakistan (Pathan), and Pakistan (Sindhi).",
          populationEur:
            "France (Basque), France (French), Italy (Bergamo – North Italian), Italy (Sardinian), Italy (Tuscan), N.W. Spain, Orkney Islands (Orcadian), Russia (Russian), Russia Caucasus (Adygei), Sweden, and U.S. Europeans.",
          populationMes:
            "Algeria (Mzab – Mozabite), Israel (Carmel – Druze), Israel (Central – Palestinian), and Israel (Negev – Bedouin).",
          populationOce:
            "Bougainville (NAN Melanesian) and New Guinea (Papuan).",
          populationLatam: "",
          title: "⚠️ Notas sobre el conjunto de datos (importante)",
          shortLine1:
            "Las frecuencias alélicas mostradas aquí provienen directamente del conjunto de datos STRs Local de SP-SMART / pop.STR.",
          shortLine2:
            "STRhub no modifica, infiere, reconstruye ni reinterpreta ningún componente del conjunto de datos STRs Local. Todas las limitaciones metodológicas se originan exclusivamente en la estructura, la disponibilidad de metadatos y las decisiones de diseño de la plataforma SP-SMART / pop.STR.",
          accordionTrigger: "Leer nota metodológica completa",
          full1:
            "Todas las frecuencias alélicas mostradas en esta sección se derivan directamente del conjunto de datos STRs Local de la plataforma SP-SMART / pop.STR (CESGA). Las características y limitaciones metodológicas descritas aquí son inherentes al conjunto de datos y a la plataforma originales, y no se originan en el procesamiento ni en la implementación de STRhub.",
          full2:
            "En pop.STR, la selección de un “kit” actúa únicamente como un filtro de loci y no refleja la tecnología de genotipado utilizada en los estudios que aportan los datos. El conjunto de datos STRs Local compila datos poblacionales generados principalmente mediante electroforesis capilar (CE), y no por NGS, y SP-SMART no proporciona metadatos específicos de la tecnología a nivel de locus. Por lo tanto, STRhub reproduce el conjunto de datos exactamente como se proporciona, sin reconstrucción, sin armonización más allá de la nomenclatura y sin imputación.",
          full3:
            "Aunque STRs Local ofrece frecuencias alélicas armonizadas para múltiples poblaciones, no constituye un panel de referencia global unificado. pop.STR proporciona las poblaciones de forma individual, lo que es adecuado para la comparación forense, pero no para análisis conjuntos como PCA, STRUCTURE o ADMIXTURE. Estas limitaciones reflejan el diseño y el alcance de la plataforma SP-SMART / pop.STR y no una restricción de STRhub.",
          referenceLabel: "Referencia",
          referenceText:
            "Amigo J, Phillips C, Lareu MV, Carracedo A. The SNPforID and SP-SMART databases: Resources for forensic population genetics. Forensic Sci Int Genet. 2008;2(3):212–217. Dataset: http://spsmart.cesga.es/",
        },
        latam: {
          selectorHint: "Selecciona una población LATAM para este marcador.",
          noDataForLocus: "No hay datos LATAM disponibles para este marcador.",
          sampleSize: "n = {n}",
          markerCount: "{count} marcadores STR",
        },
      },
      citation:
        "Cita: Dados de frecuencia poblacional obtenidos de la base de datos STRBase – NIST. Todos los alelos reportados en STRbase para cada marcador están incluidos en todos los grupos poblacionales (AFR, NAM, EAS, SAS, EUR).",
      citationReference: "Referencia: NIST STRBase. Disponible en: https://strbase.nist.gov/",
      toolsCompatibility: "Compatibilidad de Herramientas y Pipelines",
      toolsDescription: "Herramientas de análisis STR y pipelines que soportan este marcador",
      supported: "Soportado",
      notSupported: "No Soportado",
      originalPublication: "Publicación Original",
      githubRepository: "Repositorio GitHub",
      technology: "Tecnología",
      descriptionPattern: "{marker} es un locus STR en el cromosoma {chromosome}.",
      inputFormat: "Formato de Entrada",
      outputFormat: "Formato de Salida",
      nativePanels: "Archivo bed original",
      panel: "Panel",
      configurable: "Configurable",
      wrapper: "Wrapper",
      onlineVersion: "Versión Online",
      lastChecked: "Última Verificación",
      noCompatibleTools: "No se encontraron herramientas compatibles para este marcador",
      configuration: "Configuración",
      targetFileFormat: "Formato de Archivo de Destino",
      customizableTargets: "Destinos Personalizables",
      customizableTargetsLabel: "Destinos personalizables",
      flankingBpRecommended: "BP Flanqueante Recomendado",
      compatibility: "Compatibilidad",
      status: "Estado",
      maintained: "Mantenido",
      archived: "Archivado",
      maintenance: "Mantenimiento",
      "maintenance.active": "Activo",
      "maintenance.community-maintained": "Mantenido por la Comunidad",
      "maintenance.limited": "Limitado",
      "maintenance.unmaintained": "No Mantenido",
      maintainer: "Mantenedor",
      license: "Licencia",
      lastRelease: "Última Versión",
      ontModels: "Modelos ONT",
      dockerImage: "Imagen Docker",
      interfaces: "Interfaces",
      limitations: "Limitaciones",
      maintainerInitiatives: "Iniciativas del Mantenedor",
      repository: "Repositorio",
      documentation: "Documentación",
      notes: "Notas",
      addNewTool: "Agregar Nueva Herramienta",
      contactUs: "contactarnos",
      toolsDisclaimer: "Todas las herramientas de software listadas en esta sección son recursos de acceso abierto y de terceros. STRhub no mantiene relación comercial con los desarrolladores de estas herramientas y no recibe compensación financiera por su inclusión. El catálogo se proporciona únicamente con fines educativos y de investigación, para ayudar a la comunidad a explorar y comparar los pipelines de análisis STR disponibles. Si desea sugerir una nueva herramienta o informar una actualización, puede",
      toolsNote:
        "La compatibilidad de herramientas se basa en las características del marcador y la validación de la comunidad. Se proporcionan repositorios GitHub y referencias de publicación para cada herramienta soportada. Siempre verifique la compatibilidad con sus requisitos específicos de análisis y consulte las versiones más recientes.",
      igvViewer: "Visor Genómico IGV",
      igvDescription: "Visualización genómica interactiva usando IGV.js",
      igvIntegration: "Integración del Visor IGV",
      igvText: "El navegador genómico interactivo se cargará aquí mostrando el locus {marker}",
      launchIGV: "Iniciar Visor IGV",
      fastaGenerator: "Generador de Secuencia FASTA",
      fastaDescription: "Genere secuencias FASTA para el marcador {marker}",
      flankingRegion: "Región Flanqueante (pb)",
      generateFasta: "Generar Secuencia FASTA",
      generatedSequence: "Secuencia Generada",
      downloadFasta: "Descargar FASTA",
      variantAlleles: "Alelos variantes",
      variantAllelesDescription: "Todos los alelos variantes reportados en STRbase para este marcador",
      noVariantsForMarker: "Aún no se han reportado variantes alélicas en STRbase para este marcador.",
      addNewVariant: "Agregar una nueva variante",
      alleleDesignation: "Designación del alelo",
      strNaming: "STRnaming",
      repeatStructure: "Estructura de repetición",
      sequence: "Secuencia",
      noFrequenciesMessage:
        "No hay datos disponibles. Las frecuencias poblacionales para este locus están siendo curadas.",
      contributeDataCta: "Contribuir datos",
      download: "Descargar",
      source: "Fuente",
      viewInStrbase: "Ver en STRBase",
      descriptionTemplate: "{marker} es un locus STR en el cromosoma {chromosome}.",
      tools: {
        hipstr: {
          interfaces: {
            hipstrUi: {
              description:
                "Interfaz web desarrollada y mantenida por STRhub para ejecutar, visualizar y explorar resultados de HipSTR de forma interactiva.",
            },
          },
          limitations: {
            requiresAligned:
              "Requiere archivos BAM/CRAM alineados y realiza realineamiento interno (FASTQ no soportado).",
            illuminaOnly:
              "Diseñado para datos de lectura corta Illumina; no compatible con ONT o PacBio.",
          },
          notes:
            "Mantenido activamente por Tamara Frontanilla como parte del proyecto STRhub. HipSTR-UI permite ejecución interactiva, visualización de alelos e integración de datos poblacionales para flujos de trabajo forenses y de investigación.",
        },
        gangstr: {
          limitations: {
            illuminaOnly:
              "Optimizado para datos de lectura corta Illumina; no compatible con ONT o PacBio.",
            requiresBamBed:
              "Requiere alineamiento BAM/CRAM y archivo BED con loci definidos.",
          },
          notes:
            "GangSTR está integrado en el catálogo STRhub para benchmarking y comparación entre plataformas. Soporta análisis basado en loci de expansiones de repeticiones STR y es ampliamente utilizado para conjuntos de datos Illumina a escala poblacional.",
        },
        strspy: {
          config: {
            targetFileFormat:
              "BED o JSON: definiciones de locus STR y secuencias flanqueadoras",
          },
          limitations: {
            ontOptimized:
              "Optimizado para paneles STR forenses ONT; requiere archivo de referencia de loci.",
            notWgs: "No diseñado para aplicaciones de genoma completo (WGS).",
          },
          notes:
            "STRspy está integrado en el ecosistema STRhub para análisis STR forense y poblacional utilizando datos Oxford Nanopore. Su diseño modular permite visualización, benchmarking y compatibilidad cruzada con conjuntos de datos HipSTR-UI.",
        },
        straitrazor: {
          config: {
            targetFileFormat: "CSV o panel STRaitRazor predefinido",
          },
          limitations: {
            illuminaData: "Diseñado para datos Illumina; requiere configuración de panel.",
            noAlignment:
              "No realiza alineamiento de lecturas; la coincidencia de motivo es directa.",
          },
          notes:
            "STRait Razor está incluido en el ecosistema STRhub para integración con pipelines forenses basados en Illumina. Su algoritmo ligero de coincidencia de motivos lo hace adecuado para fines de enseñanza y capacitación en interpretación de STR.",
        },
        toastr: {
          limitations: {
            forensicNgs:
              "Diseñado para análisis STR forense NGS; requiere panel de referencia STRaitRazor.",
            webInterfaceInactive:
              "Interfaz web inactiva en algunos servidores heredados.",
          },
          notes:
            "ToaSTR (también conocido como STRaitRazor-NGS) extiende la funcionalidad STRaitRazor para análisis de datos Illumina. Integrado en STRhub para comparación histórica y validación de referencia en flujos de trabajo de genómica forense.",
        },
      },
      repeatTypes: {
        tetranucleotide: "Tetranucleótido",
        trinucleotide: "Trinucleótido",
        pentanucleotide: "Pentanucleótido",
        hexanucleotide: "Hexanucleótido",
        dinucleotide: "Dinucleótido",
        mononucleotide: "Mononucleótido",
        complex: "Complejo",
      },
      categoryLabels: {
        codisCore: "STRs del núcleo CODIS",
        otherAutosomal: "STRs autosómicos (otros)",
        xStr: "STRs del cromosoma X",
        yStr: "STRs del cromosoma Y",
      },
    },
    overview: {
      motifExplorer: {
        title: "Explorar estructura interna de la secuencia",
        desc: "Comprende cómo los motivos canónicos, variantes internas y regiones flanqueadoras definen el alelo.",
        button: "Abrir STR Motif Explorer",
      },
    },
    // FASTA Generator Page
    fastaGeneratorPage: {
      languageLabel: "Idioma actual",
      title: "Generador FASTA",
      subtitle: "Genera secuencias FASTA personalizadas para investigación y análisis.",
      config: {
        title: "Parámetros de configuración de secuencia",
        markerLabel: "Marcador STR",
        markerPlaceholder: "Selecciona un marcador",
        allelesLabel: "Alelos (lista o rango)",
        allelesPlaceholder: "p. ej. 10-12 o 9,10,11",
        flankingLabel: "Región flanqueante (pb por lado)",
        outputLabel: "Tipo de salida",
        generateButton: "Generar secuencia",
      },
      output: {
        title: "Secuencia generada",
        description: "Tu secuencia FASTA generada aparecerá aquí",
        emptyState:
          'Selecciona un marcador y haz clic en "Generar secuencia" para comenzar',
        copyButton: "Copiar",
        downloadButton: "Descargar FASTA",
      },
      messages: {
        enterAlleles: "Ingresa alelos (p. ej. 10-12 o 9,10,11)",
        markerNotFound: "Marcador no encontrado en la lista.",
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
            "Customizable flanking regions (0–1000 bp per side)",
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
      title: "Explorador de Motivos STR",
      subtitle: "Visualice motivos repetitivos STR canónicos e interrupciones para marcadores seleccionados.",
      header: {
        backLink: "← Volver a STRhub",
      },
      fields: {
        marker: {
          label: "Marcador STR",
        },
        viewMode: {
          sequence: "Resaltado de secuencia",
          schematic: "Esquema de motivo",
          text: "Descripción del motivo",
        },
      },
      cards: {
        configuration: {
          title: "Configuración",
          kitLabel: "Kit / secuencia de referencia",
          markerPlaceholder: "Seleccione un marcador",
          kitPlaceholder: "Seleccione un kit",
          emptyState: "Seleccione un marcador en el panel de configuración.",
        },
        visualization: {
          title: "Explorando la estructura de {marker}",
        },
      },
      states: {
        noSequence: "El modo de resaltado de secuencia no está disponible para este marcador.",
      },
      help: {
        general:
          "Muestra la secuencia completa del alelo STR con flancos, unidades repetitivas y variantes internas destacadas.",
      },
      scientificNote:
        "Nota científica: Solo el bloque continuo de repeticiones canónicas contribuye a la designación del alelo. Las copias similares al motivo en los flancos o las interrupciones son indicios visuales y no modifican el tamaño del alelo.",
      sourceLabel: "Fuente",
      sourceButtonLabel: "Abrir publicación original",
      labels: {
        canonicalPattern: "Patrón repetitivo canónico:",
      },
      legend: {
        repeat: "Unidad repetitiva",
        interruption: "Interrupción / variante interna",
        other: "Otro / elemento esquemático",
        flank: "Región flanqueadora",
        flankingMotifLike:
          "Motif en la región flanqueadora, excluido de la nomenclatura del alelo.",
      },
      summary: {
        caption:
          "Resumen de la estructura repetitiva: las unidades repetitivas se muestran como MOTIF[n]; 'flank' marca regiones no repetitivas.",
      },
      explanation: {
        generic: "",
      },
      sequenceInterpretationTitle: "¿Cómo interpretar la secuencia de arriba?",
      sequenceExample: {
        tooltip: {
          repeat: "Motivo repetitivo (ocurrencia del motivo canónico; ver nota abajo)",
          flank: "Región flanqueadora — no cuenta para el alelo",
          interruption: "Interrupción / variante interna dentro de la región repetitiva",
        },
        note: "Nota: no todas las apariciones del motivo repetitivo se cuentan para el tamaño del alelo. Solo el bloque repetitivo central definido por la estructura del motivo contribuye a la designación del alelo.",
      },
      sequenceSection: {
        representativeTitle:
          "Estructura interna representativa del alelo {allele} ({kit})",
        note:
          "Nota: Solo el bloque repetitivo continuo del motivo contribuye a la designación del alelo. Las copias similares al motivo fuera de este bloque no se cuentan en el tamaño del alelo.",
        structureLabel: "Estructura",
        flankLabel: "flanco",
        legendTitle: "Leyenda:",
      },
      tooltipsShort: {
        repeat: "Repetición canónica que sí cuenta para el tamaño del alelo.",
        internal: "Variación interna dentro del bloque repetitivo; no suma repeticiones.",
        flanking: "Región flanqueadora",
        flankingMotifLike:
          "Motif en la región flanqueadora, excluido de la nomenclatura del alelo.",
      },
      tooltipsLong: {
        repeat:
          "Estas repeticiones canónicas forman el tamaño del alelo. Cada repetición continua contribuye plenamente a la designación del alelo.",
        internal:
          "Interrupciones o inserciones dentro del bloque repetitivo aportan información para alelos por secuencia, pero no incrementan la cuenta de repeticiones.",
        flanking:
          "Las regiones flanqueadoras rodean el locus STR y estabilizan el ensayo, pero no se contabilizan dentro del tamaño del alelo.",
        flankingMotifLike:
          "Motif en la región flanqueadora, excluido de la nomenclatura del alelo.",
      },
    },
    // STRBase Integration
    strbase: {
      title: "Integración NIST STRBase",
      subtitle: "Integración integral con la base de datos NIST STRBase para datos autoritativos de marcadores STR",
      connected: "Conectado",
      lastUpdated: "Última actualización",
      markersIntegrated: "marcadores integrados",
      totalAlleles: "total de alelos",
      tabs: {
        overview: "Resumen",
        features: "Características",
        updates: "Actualizaciones",
        api: "Acceso API",
      },
      integrationStatus: "Estado de la Integración",
      connectionDescription: "Estado actual de conexión y sincronización de datos",
      connectionStatus: "Estado de Conexión",
      active: "Activo",
      dataFreshness: "Actualización de Datos",
      updatedDaily: "Actualizado diariamente",
      coverage: "Cobertura",
      fullCoverage: "100% de marcadores disponibles",
      populationGroups: "Grupos Poblacionales",
      aboutStrbase: "Acerca de STRBase",
      strbaseDescription: "Base de Datos de ADN de Repeticiones Cortas en Tándem del NIST",
      strbaseInfo:
        "STRBase es una base de datos integral mantenida por el Instituto Nacional de Estándares y Tecnología (NIST) que proporciona datos poblacionales, información de secuencia y otros detalles para loci de repeticiones cortas en tándem (STR) utilizados en pruebas de identificación humana.",
      maintainedBy: "Mantenido por",
      nist: "NIST",
      primaryUse: "Uso principal",
      humanIdentification: "Identificación humana",
      dataTypes: "Tipos de datos",
      populationFrequenciesSequences: "Frecuencias poblacionales, secuencias",
      visitStrbase: "Visitar STRBase",
      dataQuality: "Calidad y Verificación de Datos",
      dataQualityDescription: "Cómo aseguramos la precisión y confiabilidad de los datos",
      automatedVerification: "Verificación Automatizada",
      verificationDescription:
        "Todos los datos de marcadores se cruzan automáticamente con registros oficiales de STRBase",
      regularUpdates: "Actualizaciones Regulares",
      updatesDescription:
        "La sincronización diária asegura que los datos más recientes de STRBase estén siempre disponibles",
      dataIntegrity: "Integridad de Datos",
      integrityDescription: "Verificaciones integrales de validación mantienen la calidad y consistencia de los datos",
      features: {
        populationFrequency: {
          title: "Datos de Frecuencia Poblacional",
          description: "Distribuciones completas de frecuencia alélica para poblaciones AFR, NAM, EAS, SAS y EUR",
        },
        markerVerification: {
          title: "Verificación de Marcadores",
          description: "Todos los marcadores verificados contra registros oficiales de NIST STRBase",
        },
        referenceSequences: {
          title: "Secuencias de Referencia",
          description: "Patrones de isoalelos y secuencias de referencia verificados por NIST",
        },
        directLinks: {
          title: "Enlaces Directos STRBase",
          description: "Acceso con un clic a páginas oficiales de marcadores de STRBase",
        },
        automatedUpdates: {
          title: "Actualizaciones Automatizadas",
          description: "Sincronización regular con actualizaciones de la base de datos STRBase",
        },
      },
      recentUpdates: "Actualizaciones Recientes",
      recentUpdatesDescription: "Últimos cambios y adiciones a la integración STRBase",
      searchUpdates: "Buscar actualizaciones...",
      updateTypes: {
        dataUpdate: "Actualización de Datos",
        newMarkers: "Nuevos Marcadores",
        integrationEnhancement: "Mejora de Integración",
        xStrExpansion: "Expansión X-STR",
      },
      apiAccess: "Acceso API STRBase",
      apiDescription: "Acceso programático a datos integrados de STRBase para investigación y desarrollo",
      availableEndpoints: "Endpoints Disponibles",
      listAllMarkers: "Listar todos los marcadores",
      getMarkerDetails: "Obtener detalles del marcador",
      getPopulationFrequencies: "Obtener frecuencias poblacionales",
      listPopulationGroups: "Listar grupos poblacionales",
      exampleResponse: "Respuesta de Ejemplo",
      apiDocumentation: "Documentación de API",
      downloadSdk: "Descargar SDK",
    },
    // Back to Basics
    basics: {
      title: "Fundamentos",
      subtitle: "Entendiendo los Fundamentos",
      description:
        "Domine los conceptos esenciales en bioinformática y genética forense. Desde formatos de archivo hasta regiones flanqueantes, construya una base sólida para el análisis STR.",
      readArticle: "Leer Artículo",
      backToArticles: "← Volver a Todos los Artículos",
      readTime: "min de lectura",
      topicsCovered: "Temas cubiertos:",
    },
    // Blog
    blog: {
      title: "Centro Comunitario",
      subtitle: "Últimas Investigaciones y Discusiones",
      description:
        "Manténgase actualizado con los últimos desarrollos en análisis STR, investigación en genética forense y discusiones de la comunidad.",
      categories: {
        research: "Investigación",
        tutorials: "Tutoriales",
        news: "Noticias",
        community: "Comunidad",
      },
      readMore: "Leer Más",
      publishedOn: "Publicado el",
    },
    // Tools
    tools: {
      title: "Herramientas y Pipelines",
      subtitle: "Herramientas de Análisis y Procesamiento",
      description:
        "Suite integral de herramientas de bioinformática y pipelines para análisis STR, desde procesamiento de datos en bruto hasta genética poblacional.",
      hero: {
        title: "Herramientas Poderosas para Análisis STR",
        description: "Colección integral de herramientas, pipelines y tutoriales para análisis de Repeticiones en Tándem Cortas. Desde genotipado hasta visualización, encuentra todo lo que necesitas para tu investigación.",
        ctaCollaborate: "Contribuir con una herramienta o tutorial",
        disclaimer: "Todas las herramientas de software listadas en esta sección son de acceso abierto. STRhub no mantiene relación comercial con los desarrolladores de estas herramientas y no recibe compensación financiera por su inclusión.",
      },
      header: {
        backToStrhub: "← Volver a STRhub",
      },
      common: {
        keyFeatures: "Características Clave:",
        github: "GitHub",
        website: "Sitio web",
        originalPublication: "Publicación original",
      },
      codeLabels: {
        trimmomatic: "Trimmomatic",
        fastp: "fastp",
        bwaAlignment: "Alineamiento BWA-MEM2",
        convertSortIndex: "Convertir / ordenar / indexar",
        removeDuplicates: "Eliminar duplicados",
        depthCoverage: "Cobertura de profundidad",
        regionInspection: "Inspección de región",
        quickVisualization: "Visualización rápida",
      },
      hipstr: {
        title: "HipSTR",
        description: "Herramienta para genotipado de repeticiones en tándem cortas a partir de datos de secuenciación Illumina",
        category: "Genotipado",
        language: "C++",
        features: {
          1: "Alta precisión",
          2: "Maneja STRs complejos",
          3: "Análisis a escala poblacional",
        },
      },
      gangstr: {
        title: "GangSTR",
        description: "Herramienta para perfilado genómico de repeticiones en tándem a partir de lecturas cortas",
        category: "Perfilado",
        language: "C++",
        features: {
          1: "Análisis genómico completo",
          2: "Soporte para lecturas cortas",
          3: "Alto rendimiento",
        },
      },
      tutorials: {
        title: "Tutoriales Interactivos",
        comingSoon: "Próximamente",
      },
      categories: {
        analysis: "Herramientas de Análisis",
        processing: "Procesamiento de Datos",
        visualization: "Visualización",
        statistics: "Estadísticas",
      },
      learnMore: "Saber Más",
      documentation: "Documentación",
      github: "Ver en GitHub",
      commands: {
        title: "Comandos Esenciales de Bioinformática",
        card1: {
          title: "Comandos Esenciales para Procesar Lecturas",
          subtitle: "Para limpiar, filtrar y preparar lecturas FASTQ antes del genotipado.",
          features: {
            1: "Recortar adaptadores y bases de baja calidad",
            2: "Filtrar lecturas demasiado cortas o con mala calidad",
            3: "Preparar FASTQ limpios para el alineamiento",
          },
          commands: {
            trimmomatic: "trimmomatic PE sample_R1.fastq sample_R2.fastq \\\n  output_R1_paired.fastq output_R1_unpaired.fastq \\\n  output_R2_paired.fastq output_R2_unpaired.fastq \\\n  ILLUMINACLIP:adapters.fa:2:30:10 SLIDINGWINDOW:4:20 MINLEN:50",
            fastp: "fastp -i sample_R1.fastq -I sample_R2.fastq \\\n      -o clean_R1.fastq -O clean_R2.fastq \\\n      --detect_adapter_for_pe --html report.html",
          },
        },
        card2: {
          title: "Alineamiento y Procesamiento de BAM",
          subtitle: "Para alinear lecturas y generar BAM listos para análisis.",
          features: {
            1: "Alineamiento de alta calidad",
            2: "Ordenamiento e indexación",
            3: "Operaciones de limpieza BAM",
          },
          commands: {
            bwa: "bwa-mem2 mem reference.fasta sample_R1.fastq sample_R2.fastq > sample.sam",
            samtools: "samtools view -bS sample.sam | samtools sort -o sample.sorted.bam\nsamtools index sample.sorted.bam",
            rmdup: "samtools rmdup sample.sorted.bam sample.rmdup.bam",
          },
        },
        card3: {
          title: "Inspección de Regiones STR y Cobertura",
          subtitle: "Para explorar la cobertura, regiones flanqueadoras y señales de calidad en STR.",
          features: {
            1: "Visualizar regiones flanqueadoras",
            2: "Inspeccionar soft-clips y desalineamientos",
            3: "Evaluar profundidad de cobertura STR",
          },
          commands: {
            depth: "samtools depth -r chr12:100000-100300 sample.bam > depth.txt",
            view: "samtools view sample.bam chr12:100000-100300",
            tview: "samtools tview sample.bam reference.fasta",
          },
        },
        installation: {
          title: "Requisitos de Instalación",
          intro: "Las herramientas mostradas arriba no vienen instaladas por defecto. Para ejecutar estos comandos, es necesario instalar previamente los programas según tu sistema operativo.",
          linuxTitle: "Linux (Ubuntu/Debian)",
          macTitle: "macOS (Homebrew)",
          windowsTitle: "Windows (WSL2 recomendado)",
          windowsNote: "Las herramientas de bioinformática no funcionan de forma nativa en Windows. Usa WSL2 (Ubuntu) o un contenedor Linux para asegurar la compatibilidad completa.",
          guideSoon: "Muy pronto añadiremos una guía detallada de instalación para cada sistema operativo.",
        },
      },
      straitrazor: {
        title: "STRait Razor",
        description: "Herramienta ligera de coincidencia de motivos para análisis forense de STR basado en Illumina. Adecuada para fines de enseñanza y capacitación en interpretación de STR.",
        tags: {
          category: "Genotipado",
          language: "R",
        },
        features: {
          1: "Coincidencia directa de motivos desde FASTQ",
          2: "Algoritmo ligero para paneles forenses",
          3: "Interfaz web en línea disponible",
          4: "Integrado en STRhub para pipelines basados en Illumina",
        },
        buttons: {
          github: "GitHub",
          paper: "Publicación original",
          online: "Versión Online",
        },
      },
      strnaming: {
        title: "STRNaming",
        description: "Método imparcial para generar automáticamente descripciones cortas, informativas y legibles de alelos STR.",
        tags: {
          annotation: "Anotación",
          forensic: "Forense",
          webtool: "Web",
        },
        features: {
          1: "Nomenclatura estandarizada de alelos",
          2: "Descripción automatizada de alelos",
          3: "Desarrollado por el Instituto Forense de los Países Bajos",
        },
        buttons: {
          website: "Sitio web",
        },
      },
      strider: {
        title: "STRIDER",
        description: "Base de datos poblacional de frecuencias alélicas STR cuidadosamente curada, que ofrece estimaciones de probabilidad de genotipos y control de calidad para STR autosómicos.",
        tags: {
          population: "Datos poblacionales",
          qc: "Control de calidad",
          webtool: "Web",
        },
        features: {
          1: "Frecuencias alélicas cuidadosamente curadas",
          2: "Estimaciones de probabilidad de genotipos",
          3: "Control de calidad para datos STR autosómicos",
          4: "Desarrollado en el Instituto de Medicina Legal, Universidad Médica de Innsbruck",
        },
        buttons: {
          website: "Sitio web",
        },
      },
      strspy: {
        title: "STRspy",
        description: "Conjunto de herramientas en Python para análisis de STR, perfilado de alelos y visualización.",
        tags: {
          category: "Análisis",
          language: "Python",
        },
        features: {
          1: "Genotipado de perfiles STR",
          2: "Análisis estadístico de patrones de alelos",
          3: "Integración sencilla con pipelines de bioinformática",
          4: "Toolkit de código abierto",
        },
        buttons: {
          github: "GitHub",
          paper: "Publicación original",
        },
      },
    },
    // About
    about: {
      title: "Acerca de STRhub",
      subtitle: "Avanzando Investigación y Educación en STR",
      mission: "Nuestra Misión",
      missionText:
        "STRhub se dedica al avance de la genética forense y poblacional a través del acceso abierto, la colaboración y la educación. Proporcionamos herramientas confiables, conjuntos de datos curados y recursos de aprendizaje para hacer que el análisis STR sea accesible para investigadores, estudiantes y laboratorios de todo el mundo. Nuestro objetivo es fomentar una comunidad global donde el conocimiento, la tecnología y la colaboración se unan para fortalecer la ciencia en todas partes.",
      team: "Nuestro Equipo",
      teamText:
        "Somos un equipo multidisciplinario de investigadores, bioinformáticos y científicos forenses comprometidos con hacer el análisis STR más accesible y estandarizado.",
      teamText2:
        "El proyecto está dirigido por la Dra. Tamara Frontanilla, investigadora en genética forense y bioinformática, con amplia experiencia en genética poblacional, tecnologías de secuenciación y educación.",
      whyThisMatters: "Por qué es importante",
      whyThisMattersText:
        "Porque la genética es más que datos. Por detrás de cada dato hay personas, historia y diversidad. Cada STR cuenta una parte de quiénes somos. Al abrir el acceso a la información y conectar investigadores de distintos lugares, hacemos la ciencia más inclusiva, justa y real. Juntos podemos ir más lejos y hacer que el conocimiento sea de todos.",
      contact: "Contáctanos",
      contactText: "¿Tienes preguntas o sugerencias? Nos encantaría escucharte.",
      contactDescription:
        "Envíanos un mensaje y te responderemos pronto. Para problemas técnicos o solicitudes de funciones, contáctanos en GitHub. Fomentamos las contribuciones de la comunidad global.",
      formName: "Nombre",
      formNamePlaceholder: "Tu nombre",
      formEmail: "Correo electrónico",
      formEmailPlaceholder: "tu.correo@ejemplo.com",
      formSubject: "Asunto",
      formSubjectPlaceholder: "¿De qué te gustaría hablar?",
      formMessage: "Mensaje",
      formMessagePlaceholder:
        "Cuéntanos sobre tu investigación, preguntas o ideas de colaboración...",
      formSend: "Enviar mensaje",
      email: "Email",
      github: "GitHub",
      twitter: "Twitter",
      collaboration: "Colaboración",
      collaborationText:
        "STRhub es un proyecto de código abierto. Damos la bienvenida a contribuciones de investigadores, desarrolladores e instituciones de todo el mundo.",
      contribute: "Contribuir",
      documentation: "Documentación",
      support: "Soporte",
    },
    // Community Hub
    communityHub: {
      hero: {
        title: "Conectar, aprender, colaborar",
        subtitle:
          "Estamos construyendo la primera comunidad global dedicada al análisis de STRs con secuenciación de nueva generación. Muy pronto vas a encontrar tutoriales, guías, casos reales y colaboraciones creadas por investigadores, laboratorios y estudiantes de todo el mundo.",
        cta: "Unirte como colaborador/a inicial",
      },
      howToJoin: {
        title: "Cómo podés ser parte de esto",
        intro:
          "Para que el análisis de STRs con NGS sea realmente útil y accesible, necesitamos una comunidad global diversa: laboratorios, estudiantes, docentes, desarrolladores y profesionales trabajando juntos. No estamos pidiendo tus datos: nos importa tu experiencia, tus preguntas y tus ideas.",
        cards: {
          experience: {
            title: "Compartí tu experiencia",
            body: "Contanos cómo usás los STRs en tu trabajo: estudios de caso, resultados de validación, materiales de enseñanza o aprendizajes de muestras desafiantes.",
          },
          tutorials: {
            title: "Contribuí con tutoriales y guías",
            body: "Ayudá a otros explicando un pipeline, un marcador, un concepto o una herramienta que te hubiera gustado entender antes.",
          },
          collaborations: {
            title: "Sumate a colaboraciones tempranas",
            body: "Formá parte de las pruebas de nuevas funciones de STRhub, aportá feedback sobre ideas o ayudá a construir estándares abiertos para el análisis de STRs con NGS.",
          },
        },
        cta: "Quiero contribuir",
      },
      earlyContributors: {
        title: "Colaboradores iniciales y laboratorios aliados",
        body: "STRhub se está construyendo con el aporte de investigadores, estudiantes y laboratorios que creen en la ciencia abierta y en la tecnología accesible. En esta sección vamos a destacar a los equipos y personas que ayudan a construir y validar la plataforma.",
        comingSoon: "Próximamente",
      },
      recentPosts: {
        title: "Publicaciones educativas recientes",
        subtitle:
          'Artículos "Back to basics" para ayudarte a vos y a tu equipo a construir una base sólida en análisis de STRs y NGS.',
        loading: "Cargando publicaciones...",
        readMore: "Leer Más",
        viewAll: "Ver todos los artículos de Back to Basics",
        noPosts: "Todavía no hay artículos disponibles.",
      },
      comingSoon: {
        title: "Lo que viene pronto",
        intro: "Estamos trabajando en nuevos recursos y herramientas que se irán sumando a este hub.",
        cards: {
          structureBrowser: {
            title: "Explorador de estructuras STR",
            body: "Vistas interactivas para explorar estructuras repetitivas, regiones flanqueadoras y variantes internas de distintos marcadores.",
          },
          caseStudies: {
            title: "Estudios de caso desde laboratorios",
            body: "Ejemplos didácticos de mezclas, stutter, degradación y resultados de validación compartidos por la comunidad.",
          },
          pipelines: {
            title: "Pipelines y herramientas abiertas",
            body: "Guías para construir y conectar pipelines de STR usando STRhub con herramientas de análisis y lenguajes de scripting comunes.",
          },
        },
      },
      contact: {
        title: "Sumate a la conversación",
        intro:
          "¿Tenés ideas, preguntas o propuestas de colaboración? Contanos cómo STRhub podría apoyar tu trabajo o qué te gustaría ver en esta comunidad.",
        messagePlaceholder:
          "Cuéntame sobre tu investigación, ideas de colaboración o funcionalidades que te gustaría ver en STRhub…",
      },
    },
    // Common
    common: {
      loading: "Cargando...",
      error: "Error",
      notFound: "No Encontrado",
      backToHome: "Volver al Inicio",
      frequency: "Frecuencia",
      allele: "Alelo",
      count: "Conteo",
      darkMode: "Modo Oscuro",
      lightMode: "Modo Claro",
      language: "Idioma",
      english: "Inglés",
      portuguese: "Portugués",
      spanish: "Español",
    },
    projects: {
      title: "Proyectos Internacionales",
      heroDescription:
        "Explore proyectos genómicos internacionales que avanzan nuestra comprensión de la diversidad genética humana y el análisis STR.",
      visitProject: "Visitar Proyecto",
      static: {
        genomes1000: {
          description:
            "Proyecto pionero que mapeó la variación genética global. Datos actuales incluyen genomas de alta cobertura (30x).",
        },
        hgdp: {
          description:
            "Muestras de más de 50 poblaciones diversas. Clave para estudios de estructura poblacional.",
        },
        strSequencingProject: {
          description:
            "Consorcio organizado por el NIST dedicado a la caracterización integral de genomas humanos de referencia.",
        },
        gnomad: {
          description:
            "Base global con millones de variantes genómicas; útil para comparar STRs con SNPs e indels.",
        },
        sgdp: { description: ">300 genomas completos de poblaciones poco representadas." },
        allOfUs: {
          description:
            "Base mundial curada de haplotipos Y-STR para comparación forense, inferencia de linaje paterno y estudios poblacionales.",
        },
        humanPangenome: {
          description:
            "Nueva referencia genómica con múltiples haplotipos, que aborda las limitaciones de GRCh38.",
        },
        strider: { description: "Base validada y estandarizada de alelos STR forenses." },
        strbase: { description: "Recurso clásico sobre loci STR, mantenido por el NIST (National Institute of Standards and Technology)" },
      },
    },
    // Mix Profiles
    mixProfiles: {
      title: "Simulador de Mezclas de ADN",
      subtitle: "beta",
      description: "Usando datos de demostración — puede cargar sus propias muestras cuando estén disponibles.",
      simulatorDescription:
        "Este simulador permite visualizar cómo se comportan dos o tres perfiles de ADN cuando se mezclan, tanto en electroforesis capilar (CE) como en NGS. Ayuda a comprender cómo cambian las alturas de pico, cómo aparecen los stutters y cómo los alelos minoritarios pueden quedar ocultos o confundirse con ruido, mostrando la complejidad real de interpretar perfiles mixtos en genética forense.",
      controls: {
        locus: "Locus",
        sampleA: "Muestra A",
        sampleB: "Muestra B",
        ratioA: "Proporción A",
        contributor: "Contribuyente {label}",
        searchSample: "Buscar muestra {label}...",
        noSampleFound: "No se encontró muestra.",
      },
      actions: {
        reSimulate: "Re-simular",
        resetToDemo: "Restablecer predeterminado",
        exportJson: "Exportar JSON",
      },
      results: {
        title: "Resultados de la Mezcla para",
        allele: "Alelo",
      },
      charts: {
        ceTitle: "Análisis de Electroforesis Capilar (RFU)",
        ngsTitle: "Análisis de Secuenciación de Nueva Generación",
      },
      ngs: {
        disclaimer:
          "Los genotipos provienen de muestras del Proyecto 1000 Genomas. Las secuencias NGS mostradas son haplotipos representativos para cada alelo, no necesariamente la secuencia exacta de este individuo.",
        tableAllele: "Alelo",
        tableCoverage: "Cobertura (lecturas)",
        tableRepeatSequence: "Secuencia de Repetición",
        axisLabelAllele: "Alelo",
        axisLabelCoverage: "Cobertura",
        fullSequenceColumnLabel: "Secuencia completa",
        fullSequenceTooltipAria: "Explicación sobre la secuencia completa del amplicón",
        fullSequenceNote:
          "En NGS se muestra la secuencia completa del amplicón, incluyendo las regiones flanqueadoras y variantes internas. Estas regiones pueden contener inserciones, deleciones o interrupciones, por lo que un alelo puede tener una secuencia total más larga que otro aun teniendo menos unidades repetitivas. Esto es normal en la tipificación de STR basada en secuenciación.",
        isoTooltip:
          "Isoalelo: variación en la secuencia sin cambio en la longitud. Es detectable solo con NGS y aumenta el poder de discriminación entre individuos.",
      },
      trueGenotypes: {
        toggleLabel: "Mostrar genotipos verdaderos",
        title: "Genotipos verdaderos en {locus}",
        notSelected: "No seleccionado",
        none: "—",
        na: "Genotipo no disponible",
        naHelp: "No se encontraron alelos verdaderos para este locus en el conjunto de datos de demostración.",
        noSample: "Ninguno",
      },
      ceChart: {
        axisAllele: "Alelo",
        axisRFU: "RFU",
        legendBaselineNoise: "Ruido de línea de base (RFU)",
        legendTrueAlleles: "Alelos verdaderos / Señal (RFU)",
        legendStutter: "Stutter (RFU)",
        legendCalled: "Llamado",
        legendDropoutRisk: "Riesgo de pérdida",
        legendStutterPeak: "Pico de stutter",
        thresholdAT: "AT",
        thresholdST: "ST",
        tooltipAllele: "Alelo {allele}",
        tooltipAlleleMarker: "Alelo {allele} — {marker}",
        tooltipTrue: "Alelo {label} — {rfu} RFU",
        tooltipStutter: "Stutter en {allele} — {rfu} RFU (de {parent})",
        tooltipCalled: "Llamado",
        tooltipDropout: "Riesgo de pérdida",
        infoLabel: "Mostrar nota sobre el modelado de stutter",
        infoText:
          "Simulador educativo: el stutter se modela como una fracción específica de cada locus de la altura del pico verdadero (típicamente ~6–11%, mayor en algunos loci largos). Estos valores son aproximaciones educativas, no parámetros validados de un kit específico.",
      },
      parameters: {
        at: "AT (RFU)",
        st: "ST (RFU)",
        degradationK: "Degradación k (por 100 pb)",
        noiseBase: "Ruido / Base (RFU)",
        stutterLevel: "Nivel de stutter (×)",
        autoScale: "Auto-escala del eje Y",
        fixedScale: "Escala forense fija (0–800 RFU)",
        atTooltip: "Umbral Analítico: RFU mínimo para distinguir un pico del ruido.\n\nRango típico: 50–100 RFU.",
        stTooltip: "Umbral Estocástico: Nivel de RFU donde el desequilibrio de heterocigoto se vuelve improbable.\n\nRango típico: 150–200 RFU.",
        autoScaleTooltip: "Ajusta automáticamente el eje Y para ajustar todos los picos.\n\nÚtil para visualizar picos menores de bajo RFU o perfiles degradados.",
        degradationKTooltip: "Coeficiente que simula la pérdida de señal en fragmentos largos.\n\nValores típicos:\n• 0,010 = buena calidad\n• 0,015 – 0,020 = muestra difícil\n• > 0,020 = severamente degradada\n\nk mayor → más decaimiento en alelos más largos.",
        noiseBaseTooltip: "Ruido de fluorescencia de línea de base simulado.\n\nValores mayores crean más picos de fondo pequeños y fluctuación de línea de base.",
        stutterLevelTooltip: "Multiplicador global para intensidad de stutter.\n\n• 1,0 = comportamiento promedio real del locus\n• < 1,0 = perfil limpio\n• > 1,0 = stutter extra para entrenamiento/visualización.",
      },
      quickGuide: {
        title: "Guía Rápida para Configuración de Mezclas de ADN",
        button: "Guía Rápida",
        thresholds: {
          title: "1. Umbrales en la práctica",
          at: "AT: Valores menores revelan picos menores; valores mayores suprimen el ruido.",
          st: "ST: Picos por debajo de ST pueden indicar desequilibrio de heterocigoto o pérdida.",
          ranges: "Rangos típicos: AT = 50–100 RFU; ST = 150–200 RFU.",
        },
        mixture: {
          title: "2. Proporciones de mezcla",
          balanced: "50/50: equilibrada",
          moderate: "70/30: desequilibrio moderado",
          strong: "80/20 o 90/10: desequilibrio fuerte, útil para enseñar comportamiento de mezcla",
        },
        markers: {
          title: "3. Loci con comportamiento de stutter más claro",
          description: "Los alelos más largos a menudo muestran comportamiento de stutter más notable.",
          fga: "FGA",
          d18s51: "D18S51",
          d21s11: "D21S11",
          d2s1338: "D2S1338",
        },
        simulation: {
          title: "4. Cómo simular \"stutter del contribuyente principal similar al contribuyente menor\"",
          ratio: "Proporción de mezcla ≥ 80/20",
          degradation: "Degradación k: 0,015–0,030",
          stutter: "Nivel de stutter (×): 1,5–2,0 (para fines didácticos)",
          loci: "Preferentemente, loci en los que los contribuyentes difieren por una sola unidad de repetición (por ejemplo, 10 vs 9).",
        },
        notes: {
          title: "5. Notas prácticas",
          longerAlleles: "Los alelos más largos pierden señal antes cuando se degradan.",
          minorContributors: "Los contribuyentes menores caen en RFU antes bajo degradación.",
          stutter: "El stutter es más visible cuando el contribuyente principal domina.",
          notAllLoci: "No todos los loci exhiben estos efectos por igual.",
        },
      },
    },
    mixtures: {
      presets: {
        stutterMinor: "Stutter ≈ minoritario",
        dropout: "Alelo minoritario bajo",
        overlap: "Alelos solapados",
      },
      tooltips: {
        stutterMinor:
          "Muestra un caso donde el pico de stutter tiene una altura similar a un alelo minoritario, volviendo ambiguo el pico pequeño.",
        lowMinor:
          "Muestra un alelo del contribuyente minoritario muy cercano al umbral de detección.",
        overlap:
          "Muestra dos contribuyentes que comparten un alelo, generando un pico combinado más alto en el centro.",
      },
    },
  },
} as const

export type Language = keyof typeof translations
export type TranslationKey = keyof typeof translations.en

// Helper function to get nested translation
export function getNestedTranslation(obj: any, path: string): string {
  return path.split(".").reduce((current, key) => current?.[key], obj) || path
}

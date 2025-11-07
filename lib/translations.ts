export const translations = {
  en: {
    // Navigation
    nav: {
      home: "Home",
      catalog: "Catalog",
      basics: "Back to Basics",
      blog: "Blog",
      tools: "Tools",
      projects: "Projects",
      about: "About",
      search: "Search",
      strbase: "STRBase Integration",
      mixProfiles: "Mix Profiles",
    },
    // Homepage
    home: {
      title: "STRhub",
      subtitle: "Central Hub for STRs",
      description: "From CE to NGS: an integrated STR platform for forensic genetics and population studies",
      searchPlaceholder: "Search markers, alleles, or populations...",
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
          description: "Browse CODIS core, non-core, X-STRs, Y-STRs with detailed classifications",
        },
        mixProfiles: {
          title: "Mix Profiles",
          description: "Simulate, visualize, and compare STR mixture profiles for CE and NGS data",
        },
        tools: {
          title: "Tools & Pipelines",
          description: "HipSTR, STRspy, GangSTR tutorials, Nextflow workflows, and Colab examples",
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
            "Access CODIS and non-CODIS markers with allele frequencies, flanking sequences, and population data across AFR, AMR, EAS, SAS, and EUR groups",
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
    },
    // Catalog
    catalog: {
      title: "STR Marker Catalog",
      description:
        "Comprehensive database of Short Tandem Repeat markers including CODIS core, non-core, autosomal, X-STRs, and Y-STRs",
      subtitle: "All markers verified against NIST STRBase database",
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
      alleles: "Alleles",
      repeatType: "Repeat Type",
      nistVerifiedOnly: "NIST Verified Only",
      populations: "populations",
      dataIntegration: "Data Integration",
      dataIntegrationDescription:
        "This catalog integrates curated data from both the NIST STRBase (allele sequences, variant structures, and reference information) and pop.STR (allele frequency data across global populations). Together, these sources provide a unified and interactive view of forensic STR markers allowing users to explore allele ranges, sequence variants, and population frequency distributions in a single interface.",
      visitNistStrbase: "Visit NIST STRBase",
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
      basicInfo: "Basic Information",
      genomicCoords: "Genomic Coordinates",
      nistReference: "NIST STRBase Reference",
      nistDescription: "Official reference information from NIST STRBase database",
      chromosome: "Chromosome",
      position: "Position",
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
      populationGroup: "Population Group",
      populations: {
        AFR: "African",
        AMR: "American",
        EAS: "East Asian",
        SAS: "South Asian",
        EUR: "European",
      },
      citation:
        "Citation: Population frequency data sourced from STRBase – NIST database. All alleles reported in STRbase for each marker are included across all population groups (AFR, AMR, EAS, SAS, EUR).",
      citationReference: "Reference: NIST STRBase. Available at: https://strbase.nist.gov/",
      toolsCompatibility: "Tools & Pipelines Compatibility",
      toolsDescription: "STR analysis tools and pipelines that support this marker",
      supported: "Supported",
      notSupported: "Not Supported",
      originalPublication: "Original Publication",
      githubRepository: "GitHub Repository",
      technology: "Technology",
      inputFormat: "Input Format",
      outputFormat: "Output Format",
      nativePanels: "Native Panels",
      panel: "Panel",
      configurable: "Configurable",
      wrapper: "Wrapper",
      onlineVersion: "Online Version",
      lastChecked: "Last Checked",
      noCompatibleTools: "No compatible tools found for this marker",
      configuration: "Configuration",
      targetFileFormat: "Target File Format",
      customizableTargets: "Customizable Targets",
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
      outputFormat: "Output Format",
      generateFasta: "Generate FASTA Sequence",
      generatedSequence: "Generated Sequence",
      downloadFasta: "Download FASTA",
      variantAlleles: "Variant Alleles",
      variantAllelesDescription: "All variant alleles reported in STRbase for this marker",
      alleleDesignation: "Allele Designation",
      strNaming: "STRnaming",
      repeatStructure: "Repeat Structure",
      sequence: "Sequence",
      notes: "Notes",
      download: "Download",
      source: "Source",
      viewInStrbase: "View in STRBase",
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
          description: "Complete allele frequency distributions for AFR, AMR, EAS, SAS, and EUR populations",
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
      categories: {
        analysis: "Analysis Tools",
        processing: "Data Processing",
        visualization: "Visualization",
        statistics: "Statistics",
      },
      learnMore: "Learn More",
      documentation: "Documentation",
      github: "View on GitHub",
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
            "Collection of STR sequences used as a reference for forensic validation and comparison.",
        },
        gnomad: {
          description:
            "Global database with millions of genomic variants; useful for comparing STRs with SNPs and indels.",
        },
        sgdp: { description: ">300 whole genomes from underrepresented populations." },
        allOfUs: {
          description:
            "Large-scale multi-omic and clinical dataset from one million participants in the U.S.",
        },
        humanPangenome: {
          description:
            "New genomic reference with multiple haplotypes, addressing limitations of GRCh38.",
        },
        strider: { description: "Validated, standardized database of forensic STR alleles." },
        strbase: { description: "Classic resource on STR loci maintained by NIST." },
      },
    },
    // Mix Profiles
    mixProfiles: {
      title: "Mix Profiles",
      subtitle: "beta",
      description: "Using demo data — you can load your own samples when available.",
      controls: {
        locus: "Locus",
        sampleA: "Sample A",
        sampleB: "Sample B",
        ratioA: "Ratio A",
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
        ceTitle: "CE Analysis (RFU)",
        ngsTitle: "NGS Analysis (Reads)",
      },
    },
  },
  pt: {
    // Navigation
    nav: {
      home: "Início",
      catalog: "Catálogo",
      basics: "Fundamentos",
      blog: "Blog",
      tools: "Ferramentas",
      projects: "Projetos",
      about: "Sobre",
      search: "Buscar",
      strbase: "Integração STRBase",
      mixProfiles: "Perfis de Misturas",
    },
    // Homepage
    home: {
      title: "STRhub",
      subtitle: "Centro de STRs",
      description: "De CE para NGS: uma plataforma integral de STR para genética forense e estudos populacionais",
      searchPlaceholder: "Buscar marcadores, alelos ou populações...",
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
          description: "Navegue por CODIS core, não-core, X-STRs, Y-STRs com classificações detalhadas",
        },
        mixProfiles: {
          title: "Perfis de Misturas",
          description: "Simule, visualize e compare perfis de misturas STR para dados CE e NGS",
        },
        tools: {
          title: "Ferramentas e Pipelines",
          description: "Tutoriais HipSTR, STRspy, GangSTR, fluxos de trabalho Nextflow e exemplos Colab",
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
            "Acesse marcadores CODIS e não-CODIS com frequências alélicas, sequências flanqueantes e dados populacionais em grupos AFR, AMR, EAS, SAS e EUR",
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
    },
    // Catalog
    catalog: {
      title: "Catálogo de Marcadores STR",
      description:
        "Banco de dados abrangente de marcadores de Repetições Curtas em Tándem incluindo CODIS core, não-core, autossômicos, X-STRs e Y-STRs",
      subtitle: "Todos os marcadores verificados contra o banco de dados NIST STRBase",
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
      alleles: "Alelos",
      repeatType: "Tipo de Repetição",
      nistVerifiedOnly: "Apenas Verificados NIST",
      populations: "populações",
      dataIntegration: "Integração de Dados",
      dataIntegrationDescription:
        "Este catálogo integra dados curados tanto do NIST STRBase (sequências de alelos, estruturas variantes e informações de referência) quanto do pop.STR (dados de frequência alélica em populações globais). Juntas, essas fontes fornecem uma visão unificada e interativa de marcadores STR forenses, permitindo aos usuários explorar faixas de alelos, variantes de sequência e distribuições de frequência populacional em uma única interface.",
      visitNistStrbase: "Visitar NIST STRBase",
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
      basicInfo: "Informações Básicas",
      genomicCoords: "Coordenadas Genômicas",
      nistReference: "Referência NIST STRBase",
      nistDescription: "Informações de referência oficial do banco de dados NIST STRBase",
      chromosome: "Cromossomo",
      position: "Posição",
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
      populationGroup: "Grupo Populacional",
      populations: {
        AFR: "Africano",
        AMR: "Americano",
        EAS: "Asiático Oriental",
        SAS: "Asiático do Sul",
        EUR: "Europeu",
      },
      citation:
        "Citação: Dados de frequência populacional obtidos do banco de dados STRBase – NIST. Todos os alelos relatados no STRbase para cada marcador estão incluídos em todos os grupos populacionais (AFR, AMR, EAS, SAS, EUR).",
      citationReference: "Referência: NIST STRBase. Disponível em: https://strbase.nist.gov/",
      toolsCompatibility: "Compatibilidade de Ferramentas e Pipelines",
      toolsDescription: "Ferramentas de análise STR e pipelines que suportam este marcador",
      supported: "Suportado",
      notSupported: "Não Suportado",
      originalPublication: "Publicação Original",
      githubRepository: "Repositório GitHub",
      technology: "Tecnologia",
      inputFormat: "Formato de Entrada",
      outputFormat: "Formato de Saída",
      nativePanels: "Painéis Nativos",
      panel: "Painel",
      configurable: "Configurável",
      wrapper: "Wrapper",
      onlineVersion: "Versão Online",
      lastChecked: "Última Verificação",
      noCompatibleTools: "Nenhuma ferramenta compatível encontrada para este marcador",
      configuration: "Configuração",
      targetFileFormat: "Formato de Arquivo de Destino",
      customizableTargets: "Destinos Personalizáveis",
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
      outputFormat: "Formato de Saída",
      generateFasta: "Gerar Sequência FASTA",
      generatedSequence: "Sequência Gerada",
      downloadFasta: "Baixar FASTA",
      variantAlleles: "Alelos Variantes",
      variantAllelesDescription: "Todos os alelos variantes relatados no STRbase para este marcador",
      alleleDesignation: "Designação do Alelo",
      strNaming: "STRnaming",
      repeatStructure: "Estrutura de Repetição",
      sequence: "Sequência",
      notes: "Notas",
      download: "Baixar",
      source: "Fonte",
      viewInStrbase: "Ver no STRBase",
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
          description: "Distribuciones completas de frecuencia alélica para poblaciones AFR, AMR, EAS, SAS y EUR",
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
      categories: {
        analysis: "Herramientas de Análisis",
        processing: "Procesamiento de Datos",
        visualization: "Visualización",
        statistics: "Estadísticas",
      },
      learnMore: "Saber Más",
      documentation: "Documentación",
      github: "Ver en GitHub",
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
            "Coleção de sequências STR usada como referência para validação e comparação forense.",
        },
        gnomad: {
          description:
            "Base global com milhões de variantes genômicas; útil para comparar STRs com SNPs e indels.",
        },
        sgdp: { description: ">300 genomas completos de populações sub-representadas." },
        allOfUs: {
          description:
            "Conjunto de dados multi-ômicos e clínicos em grande escala de um milhão de participantes nos EUA.",
        },
        humanPangenome: {
          description:
            "Nova referência genômica com múltiplos haplótipos, abordando limitações do GRCh38.",
        },
        strider: { description: "Base validada e padronizada de alelos STR forenses." },
        strbase: { description: "Recurso clássico sobre loci STR mantido pelo NIST." },
      },
    },
    // Mix Profiles
    mixProfiles: {
      title: "Perfis de Misturas",
      subtitle: "beta",
      description: "Usando dados de demonstração — você pode carregar suas próprias amostras quando disponível.",
      controls: {
        locus: "Locus",
        sampleA: "Amostra A",
        sampleB: "Amostra B",
        ratioA: "Proporção A",
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
        ceTitle: "Análise CE (RFU)",
        ngsTitle: "Análise NGS (Leituras)",
      },
    },
  },
  es: {
    // Navigation
    nav: {
      home: "Inicio",
      catalog: "Catálogo",
      basics: "Fundamentos",
      blog: "Blog",
      tools: "Herramientas",
      projects: "Proyectos",
      about: "Acerca de",
      search: "Buscar",
      strbase: "Integración STRBase",
      mixProfiles: "Perfiles de Mezclas",
    },
    // Homepage
    home: {
      title: "STRhub",
      subtitle: "Centro de STRs",
      description: "De CE a NGS: una plataforma integral de STR para genética forense y estudios poblacionales",
      searchPlaceholder: "Buscar marcadores, alelos o poblaciones...",
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
          description: "Navegue por CODIS core, no-core, X-STRs, Y-STRs con clasificaciones detalladas",
        },
        mixProfiles: {
          title: "Perfiles de Mezclas",
          description: "Simule, visualice y compare perfiles de mezclas STR para datos CE y NGS",
        },
        tools: {
          title: "Herramientas y Pipelines",
          description: "Tutoriales HipSTR, STRspy, GangSTR, flujos de trabajo Nextflow y ejemplos Colab",
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
            "Acceda a marcadores CODIS y no-CODIS con frecuencias alélicas, secuencias flanqueantes y datos poblacionales en grupos AFR, AMR, EAS, SAS y EUR",
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
    },
    // Catalog
    catalog: {
      title: "Catálogo de Marcadores STR",
      description:
        "Base de datos integral de marcadores de Repeticiones Cortas en Tándem incluyendo CODIS core, no-core, autosómicos, X-STRs y Y-STRs",
      subtitle: "Todos los marcadores verificados contra la base de datos NIST STRBase",
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
      alleles: "Alelos",
      repeatType: "Tipo de Repetición",
      nistVerifiedOnly: "Solo Verificados NIST",
      populations: "poblaciones",
      dataIntegration: "Integración de Datos",
      dataIntegrationDescription:
        "Este catálogo integra datos curados tanto del NIST STRBase (secuencias de alelos, estructuras variantes e información de referencia) como de pop.STR (datos de frecuencia alélica en poblaciones globales). Juntas, estas fuentes proporcionan una vista unificada e interactiva de marcadores STR forenses, permitiendo a los usuarios explorar rangos de alelos, variantes de secuencia y distribuciones de frecuencia poblacional en una sola interfaz.",
      visitNistStrbase: "Visitar NIST STRBase",
    },
    // Marker Details
    marker: {
      backToCatalog: "Volver al Catálogo",
      tabs: {
        overview: "Resumen",
        isoalleles: "Isoalelos",
        frequencies: "Frequências",
        tools: "Herramientas",
        igv: "Visor IGV",
        fasta: "Generador FASTA",
      },
      basicInfo: "Información Básica",
      genomicCoords: "Coordenadas Genômicas",
      nistReference: "Referencia NIST STRBase",
      nistDescription: "Información de referencia oficial de la base de datos NIST STRBase",
      chromosome: "Cromosoma",
      position: "Posición",
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
      populationGroup: "Grupo Poblacional",
      populations: {
        AFR: "Africano",
        AMR: "Americano",
        EAS: "Asiático Oriental",
        SAS: "Asiático del Sur",
        EUR: "Europeu",
      },
      citation:
        "Cita: Datos de frecuencia poblacional obtenidos de la base de datos STRBase – NIST. Todos los alelos reportados en STRbase para cada marcador están incluidos en todos los grupos poblacionales (AFR, AMR, EAS, SAS, EUR).",
      citationReference: "Referencia: NIST STRBase. Disponible en: https://strbase.nist.gov/",
      toolsCompatibility: "Compatibilidad de Herramientas y Pipelines",
      toolsDescription: "Herramientas de análisis STR y pipelines que soportan este marcador",
      supported: "Soportado",
      notSupported: "No Soportado",
      originalPublication: "Publicación Original",
      githubRepository: "Repositorio GitHub",
      technology: "Tecnología",
      inputFormat: "Formato de Entrada",
      outputFormat: "Formato de Salida",
      nativePanels: "Paneles Nativos",
      panel: "Panel",
      configurable: "Configurable",
      wrapper: "Wrapper",
      onlineVersion: "Versión Online",
      lastChecked: "Última Verificación",
      noCompatibleTools: "No se encontraron herramientas compatibles para este marcador",
      configuration: "Configuración",
      targetFileFormat: "Formato de Archivo de Destino",
      customizableTargets: "Destinos Personalizables",
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
      outputFormat: "Formato de Salida",
      generateFasta: "Generar Secuencia FASTA",
      generatedSequence: "Secuencia Generada",
      downloadFasta: "Descargar FASTA",
      variantAlleles: "Variant Alleles",
      variantAllelesDescription: "Todos los alelos variantes reportados en STRbase para este marcador",
      alleleDesignation: "Allele Designation",
      strNaming: "STRnaming",
      repeatStructure: "Repeat Structure",
      sequence: "Sequence",
      notes: "Notes",
      download: "Download",
      source: "Source",
      viewInStrbase: "View in STRBase",
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
          description: "Distribuciones completas de frecuencia alélica para poblaciones AFR, AMR, EAS, SAS y EUR",
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
      categories: {
        analysis: "Herramientas de Análisis",
        processing: "Procesamiento de Datos",
        visualization: "Visualización",
        statistics: "Estadísticas",
      },
      learnMore: "Saber Más",
      documentation: "Documentación",
      github: "Ver en GitHub",
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
            "Colección de secuencias de STRs utilizada como referencia para validación y comparación forense.",
        },
        gnomad: {
          description:
            "Base global con millones de variantes genómicas; útil para comparar STRs con SNPs e indels.",
        },
        sgdp: { description: ">300 genomas completos de poblaciones poco representadas." },
        allOfUs: {
          description:
            "Proyecto masivo de datos multi-ómicos y clínicos de un millón de personas en EE.UU.",
        },
        humanPangenome: {
          description:
            "Nueva referencia genómica con múltiples haplotipos, que aborda las limitaciones de GRCh38.",
        },
        strider: { description: "Base validada y estandarizada de alelos STR forenses." },
        strbase: { description: "Recurso clásico sobre loci STR, mantenido por NIST." },
      },
    },
    // Mix Profiles
    mixProfiles: {
      title: "Perfiles de Mezclas",
      subtitle: "beta",
      description: "Usando datos de demostración — puede cargar sus propias muestras cuando estén disponibles.",
      controls: {
        locus: "Locus",
        sampleA: "Muestra A",
        sampleB: "Muestra B",
        ratioA: "Proporción A",
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
        ceTitle: "Análisis CE (RFU)",
        ngsTitle: "Análisis NGS (Lecturas)",
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

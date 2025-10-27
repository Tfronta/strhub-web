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
        "This catalog integrates curated data from multiple open and public sources, including the NIST STRBase (allele sequences, variant structures, and reference information) and pop.STR (allele frequency data across global populations).",
      dataIntegrationDescription2:
        "Together, these sources provide a unified and interactive view of forensic STR markers, allowing users to explore allele ranges, sequence variants, and population frequency distributions in a single interface.",
      dataIntegrationSources: "Sources:",
      dataIntegrationDisclaimer:
        "NIST data are provided as a public domain resource and may be freely used with appropriate attribution. STRhub is an independent educational project and is not affiliated with or endorsed by NIST.",
      visitNistStrbase: "Visit NIST STRBase",
      visitPopStr: "Visit pop.STR",
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
      xstrPopulations: {
        BRA: "BRA",
        IBER: "IBER",
        NOR: "NOR",
        BOS_HER: "BOS & HER",
      },
      source: "Source",
      ystrFrequenciesTitle: "Allele Frequencies — Y Chromosome STRs",
      ystrFrequenciesDescription:
        "Due to data use restrictions, STRhub does not display allele or haplotype frequency data from the Y-Chromosome Haplotype Reference Database (YHRD) directly.",
      ystrYhrdInfo:
        "YHRD is the official international repository for Y-STR haplotypes, maintained by the Institute of Legal Medicine (LMU Munich) under the ISFG.",
      ystrExploreData:
        "You can explore full allele and haplotype frequency data for each population directly at the official YHRD portal.",
      ystrVisitYhrd: "Visit YHRD — National Databases",
      ystrDisclaimer:
        "STRhub provides this external link for transparency and educational purposes. For complete and up-to-date Y-STR statistics, please refer to the official YHRD website.",
      visitYhrdDatabase: "Visit YHRD Database",
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
      updatesDescription: "Latest changes and additions to the STRBase integration",
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
        "STRhub is dedicated to advancing Short Tandem Repeat research and education by providing comprehensive resources, tools, and databases for the forensic genetics and population studies communities.",
      team: "Our Team",
      teamText:
        "We are a multidisciplinary team of researchers, bioinformaticians, and forensic scientists committed to making STR analysis more accessible and standardized.",
      contact: "Contact Us",
      contactText: "Have questions or suggestions? We'd love to hear from you.",
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
        "Este catálogo integra dados curados de múltiplas fontes abertas e públicas, incluindo o NIST STRBase (sequências alélicas, estruturas variantes e informações de referência) e o pop.STR (dados de frequência alélica em populações globais).",
      dataIntegrationDescription2:
        "Juntas, essas fontes oferecem uma visão unificada e interativa dos marcadores STR forenses, permitindo explorar intervalos alélicos, variantes de sequência e distribuições de frequência populacional em uma única interface.",
      dataIntegrationSources: "Fontes:",
      dataIntegrationDisclaimer:
        "Os dados do NIST são disponibilizados como um recurso de domínio público e podem ser reutilizados livremente com a devida atribuição. O STRhub é um projeto educacional independente e não é afiliado nem endossado pelo NIST.",
      visitNistStrbase: "Visitar NIST STRBase",
      visitPopStr: "Visitar pop.STR",
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
      xstrPopulations: {
        BRA: "BRA",
        IBER: "IBER",
        NOR: "NOR",
        BOS_HER: "BOS & HER",
      },
      source: "Fonte",
      ystrFrequenciesTitle: "Frequências alélicas — Cromossomo Y (Y-STRs)",
      ystrFrequenciesDescription:
        "Devido a restrições de uso de dados, o STRhub não exibe diretamente as frequências alélicas ou haplótipos do Y-Chromosome Haplotype Reference Database (YHRD).",
      ystrYhrdInfo:
        "O YHRD é o repositório internacional oficial de haplótipos do cromossomo Y, mantido pelo Instituto de Medicina Legal (LMU Munique) sob a ISFG.",
      ystrExploreData:
        "Você pode consultar os dados completos de frequências alélicas e haplótipos por população no portal oficial do YHRD.",
      ystrVisitYhrd: "Visitar YHRD — Bases de dados nacionais",
      ystrDisclaimer:
        "O STRhub fornece este link externo para fins educativos e de transparência. Para estatísticas completas e atualizadas de Y-STR, consulte o site oficial do YHRD.",
      visitYhrdDatabase: "Visitar base de dados YHRD",
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
      updatesDescription: "Últimos cambios y adiciones a la integración STRBase",
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
      title: "Centro Comunitário",
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
        "STRhub se dedica al avance de la investigación y educación en Repeticiones Cortas en Tándem proporcionando recursos integrales, herramientas y bases de datos para las comunidades de genética forense y estudios poblacionales.",
      team: "Nuestro Equipo",
      teamText:
        "Somos un equipo multidisciplinario de investigadores, bioinformáticos y científicos forenses comprometidos con hacer el análisis STR más accesible y estandarizado.",
      contact: "Contáctanos",
      contactText: "¿Tienes preguntas o sugerencias? Nos encantaría escucharte.",
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
        "Base de datos integral de marcadores de Repeticiones Curtas en Tándem incluyendo CODIS core, no-core, autosómicos, X-STRs y Y-STRs",
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
      chromosome: "Chr",
      motif: "Motif",
      alleles: "Alleles",
      repeatType: "Repeat Type",
      nistVerifiedOnly: "Solo Verificados NIST",
      populations: "poblaciones",
      dataIntegration: "Integración de Datos",
      dataIntegrationDescription:
        "Este catálogo integra datos curados de múltiples fuentes abiertas y públicas, incluyendo NIST STRBase (secuencias alélicas, estructuras de variantes e información de referencia) y pop.STR (datos de frecuencias alélicas en poblaciones globales).",
      dataIntegrationDescription2:
        "En conjunto, estas fuentes ofrecen una vista unificada e interactiva de los marcadores STR forenses, permitiendo explorar rangos de alelos, variantes de secuencia y distribuciones de frecuencias poblacionales en una única interfaz.",
      dataIntegrationSources: "Fuentes:",
      dataIntegrationDisclaimer:
        "Los datos de NIST se proporcionan como un recurso de dominio público y pueden ser reutilizados libremente con la atribución correspondiente. STRhub es un proyecto educativo independiente y no está afiliado ni respaldado por NIST.",
      visitNistStrbase: "Visitar NIST STRBase",
      visitPopStr: "Visitar pop.STR",
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
      xstrPopulations: {
        BRA: "BRA",
        IBER: "IBER",
        NOR: "NOR",
        BOS_HER: "BOS & HER",
      },
      source: "Fuente",
      ystrFrequenciesTitle: "Frecuencias alélicas — Cromosoma Y (Y-STRs)",
      ystrFrequenciesDescription:
        "Debido a restricciones de uso de datos, STRhub no muestra directamente las frecuencias alélicas ni los haplotipos del Y-Chromosome Haplotype Reference Database (YHRD).",
      ystrYhrdInfo:
        "El YHRD es el repositorio internacional oficial de haplotipos del cromosoma Y, mantenido por el Instituto de Medicina Legal (LMU Múnich) bajo la ISFG.",
      ystrExploreData:
        "Podés consultar los datos completos de frecuencias alélicas y haplotipos por población en el portal oficial de YHRD.",
      ystrVisitYhrd: "Visitar YHRD — Bases de datos nacionales",
      ystrDisclaimer:
        "STRhub ofrece este enlace externo con fines informativos y educativos. Para estadísticas completas y actualizadas de Y-STR, consultá el sitio oficial de YHRD.",
      visitYhrdDatabase: "Visitar base de datos YHRD",
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
      updatesDescription: "Últimos cambios y adiciones a la integración STRBase",
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
        "STRhub se dedica al avance de la investigación y educación en Repeticiones Cortas en Tándem proporcionando recursos integrales, herramientas y bases de datos para las comunidades de genética forense y estudios poblacionales.",
      team: "Nuestro Equipo",
      teamText:
        "Somos un equipo multidisciplinario de investigadores, bioinformáticos y científicos forenses comprometidos con hacer el análisis STR más accesible y estandarizado.",
      contact: "Contáctanos",
      contactText: "¿Tienes preguntas o sugerencias? Nos encantaría escucharte.",
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
      subtitle: "Iniciativas Genómicas Globales",
      description:
        "Explore proyectos genómicos internacionales de gran escala que avanzan la investigación STR y la comprensión de la diversidad genética humana",
      searchPlaceholder: "Buscar proyectos...",
      filterByRegion: "Filtrar por Región",
      allRegions: "Todas las Regiones",
      regions: {
        global: "Global",
        americas: "Américas",
        europe: "Europa",
        asia: "Asia",
        africa: "África",
        oceania: "Oceanía",
      },
      sortBy: "Ordenar por",
      sortOptions: {
        name: "Nombre",
        year: "Año",
        region: "Región",
      },
      projectsFound: "proyectos encontrados",
      showing: "Mostrando",
      of: "de",
      viewDetails: "Ver Detalles",
      status: "Estado",
      statusTypes: {
        active: "Activo",
        completed: "Completado",
        ongoing: "En Curso",
      },
      participants: "Participantes",
      countries: "países",
      samples: "muestras",
      publications: "publicaciones",
      website: "Sitio Web",
      documentation: "Documentación",
      dataAccess: "Acceso a Datos",
      backToProjects: "Volver a Proyectos",
      projectOverview: "Resumen del Proyecto",
      objectives: "Objetivos",
      keyFindings: "Hallazgos Clave",
      datasets: "Conjuntos de Datos",
      collaborators: "Colaboradores",
      timeline: "Línea de Tiempo",
      relatedPublications: "Publicaciones Relacionadas",
      dataAvailability: "Disponibilidad de Datos",
      accessInstructions: "Instrucciones de Acceso",
      citation: "Cómo Citar",
      contact: "Contacto",
      lastUpdated: "Última Actualización",
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

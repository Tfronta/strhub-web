export default {
nav: {
  home: "Inicio",
  catalog: "Catálogo",
  basics: "Fundamentos",
  blog: "Comunidad",
  tools: "Herramientas",
  projects: "Recursos",
  about: "Acerca",
  search: "Buscar",
  strbase: "Integración STRBase",
  mixProfiles: "Mezclas",
  globalFrequencies: "Frecuencias Globales",
  datasets: "Datos",
  verified: "Verificadas",
},
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
home: {
  title: "STRhub",
  subtitle: "Hub Central de",
  tagline: "Plataforma de acceso abierto para el análisis y visualización forense de STRs",
  description: "De CE a NGS: herramientas integradas para genética forense y estudios poblacionales",
  searchPlaceholder: "Marcadores, herramientas, artículos…",
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
        "Acceda a marcadores CODIS y no-CODIS con frecuencias alélicas, secuencias flanqueantes y datos poblacionales en grupos AFR, NAM, EAS, CSA y EUR",
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
} as const

export default {
marker: {
  backToCatalog: "Volver al Catálogo",
  backToGenomeExplorer: "Volver al Explorador del Genoma",
  tabs: {
    overview: "Resumen",
    isoalleles: "Isoalelos",
    frequencies: "Frecuencias",
    statistics: "Estadísticas",
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
  populationLabels: {
    AFR: "África",
    NAM: "Nativo Americano",
    EAS: "Asia Oriental",
    CSA: "Asia Central y del Sur",
    EUR: "Europa",
    MES: "Medio Oriente",
    OCE: "Oceanía",
    LAT: "Latinoamérica",
    SAS: "Asia del Sur",
  },
  frequencies: {
    region: {
      latam: "LAT",
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
      populationCsa:
        "Poblaciones agregadas como Asia Central y del Sur en el conjunto de datos STRs Local (pop.STR / SP-SMART, CESGA).",
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
    ngsDatasetDescription_raoValleSilva2022:
      "Estas frecuencias alélicas provienen de un estudio de secuenciación de nueva generación realizado en una muestra poblacional de Ribeirão Preto, São Paulo, Brasil (Valle-Silva et al., 2022). El conjunto de datos corresponde a los genotipos consenso obtenidos entre HipSTR, STRait Razor y toaSTR. En STRhub, la etiqueta RAO se refiere específicamente a este conjunto de datos NGS de Ribeirão Preto. Referencia: Valle-Silva G, Frontanilla TS, Ayala J, Donadi EA, Simões AL, Castelli EC, Mendes-Junior CT. Forensic Sci Int Genet. 2022;58:102676. doi:10.1016/j.fsigen.2022.102676.",
    ngs1000G: {
      intro:
        "Estas frecuencias alélicas se derivan de un estudio de secuenciación de nueva generación (NGS) publicado en 2022, basado en 2.504 individuos pertenecientes a 26 poblaciones analizadas por el Consorcio del Proyecto 1000 Genomas.",
      populationGroupsLabel: "Poblaciones incluidas",
      datasetNotesTitle: "⚠️ Notas del conjunto de datos (importante)",
      datasetNotesParagraph1:
        "En este estudio, los alelos STR se genotiparon a partir de datos de secuenciación de genoma completo de alta cobertura utilizando el software HipSTR. Todos los datos están disponibles públicamente como parte del conjunto de datos publicado.",
      datasetNotesParagraph2:
        "STRhub no modifica, infiere, reconstruye ni reinterpreta ningún componente del conjunto de datos original de STR. Todas las limitaciones metodológicas surgen exclusivamente del diseño original del estudio, de la disponibilidad de metadatos y del framework del cual se derivaron estos datos.",
      originalDatasetButton: "Dataset original",
      originalPublicationButton: "Publicación original",
    },
    openOriginalPaperButton: "Abrir artículo original",
    compareButton: "Comparar",
    compareTooltip:
      "Compara las poblaciones AFR, NAM, EAS, CSA, EUR, MES y OCE del dataset SP-SMART/CESGA",
    ngs1000gTooltip:
      "Compara AFR, NAM, EAS, SAS y EUR del Proyecto 1000 Genomas Fase 3",
    legendClickHint: "Haz clic en una población de la leyenda para mostrar/ocultar",
    raoPopulationButtonTooltip:
      "Panel STR NGS de una muestra brasileña (Ribeirão Preto; Valle-Silva et al., 2022).",
    latam: {
      selectorHint: "Selecciona una población LAT para este marcador.",
      noDataForLocus: "No hay datos LAT disponibles para este marcador.",
      sampleSize: "n = {n}",
      markerCount: "{count} marcadores STR",
    },
  },
  citation:
    "Cita: Dados de frecuencia poblacional obtenidos de la base de datos STRBase – NIST. Todos los alelos reportados en STRbase para cada marcador están incluidos en todos los grupos poblacionales (AFR, NAM, EAS, CSA, EUR).",
  citationReference: "Referencia: NIST STRBase. Disponible en: https://strbase.nist.gov/",
  statistics: {
    title: "Estadísticas Poblacionales",
    description: "Estadísticas resumidas para cada población CE (Illumina ForenSeq, pop.STR / SP-SMART).",
    population: "Población",
    noData: "No hay estadísticas poblacionales disponibles para este marcador.",
    sourceIntro: "Fuente: SP-SMART / pop.STR (CESGA)",
    legendN: "N = tamaño muestral",
    legendHobs: "Hobs = heterocigosidad observada",
    legendHexp: "Hexp = heterocigosidad esperada",
    legendFis: "Fis = coeficiente de endogamia",
    legendFst: "Fst = índice de fijación",
  },
  toolsCompatibility: "Compatibilidad de Herramientas y Pipelines",
  toolsDescription: "Herramientas de análisis STR y pipelines que soportan este marcador",
  supported: "Soportado",
  configurableRequiresTargets: "Configurable (requiere objetivos)",
  viewAllToolsPipelines: "Ver todas las herramientas y pipelines",
  viewFullToolProfile: "Ver perfil completo de la herramienta",
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
  interfaceAvailable: "Interface disponible:",
  limitations: "Limitaciones",
  maintainerInitiatives: "Iniciativas del Mantenedor",
  repository: "Repositorio",
  documentation: "Documentación",
  notes: "Notas",
  addNewTool: "Agregar Nueva Herramienta",
  contactUs: "contactarnos",
  toolsDisclaimer: "Todas las herramientas de software listadas en esta sección son recursos de acceso abierto y de terceros. STRhub no mantiene relación comercial con los desarrolladores de estas herramientas y no recibe compensación financiera por su inclusión. El catálogo se proporciona únicamente con fines educativos y de investigación.",
  toolsDisclaimerShort: "Herramientas de terceros en acceso abierto. Sin relación comercial.",
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
  downloadCSV: "Descargar CSV",
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
    longtr: {
      config: {
        targetFileFormat:
          "BED: cromosoma, inicio (base 1), fin, motivo(s), nombre opcional del locus",
      },
      limitations: {
        bamRequirements:
          "Requiere BAM/CRAM de lecturas largas con alineamiento sensible a indels (ordenado, indexado) y FASTA de referencia coherente con el alineamiento.",
        activeDevelopment:
          "En desarrollo activo; los parámetros de la CLI y los formatos de salida pueden cambiar entre versiones.",
      },
      notes:
        "LongTR se inspira en el marco HipSTR y está adaptado a lecturas largas PacBio HiFi y Oxford Nanopore, genotipando STR y VNTR en VCF comprimido con bgzip. Disponible vía conda (bioconda) o GitHub.",
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
    fdstools: {
      config: {
        targetFileFormat: "Definición de kit STR forense integrado o personalizado",
      },
      limitations: {
        fastqOnly:
          "Acepta FASTQ de cualquier plataforma MPS; BAM no soportado actualmente.",
        homopolymerScrutiny:
          "Mejor adaptado a lecturas cortas Illumina; aplicar escrutinio extra en plataformas propensas a errores de homopolímeros.",
      },
      notes:
        "FDSTools es un toolkit Python para análisis de datos MPS forenses, incluyendo caracterización de stutter, filtrado de ruido y detección automática de alelos con nomenclatura STRNaming.",
    },
    straitrazor: {
      config: {
        targetFileFormat: "Panel FASTA o CSV que define loci STR y motivos",
      },
      limitations: {
        fastqOnly:
          "Acepta FASTQ de cualquier plataforma MPS; BAM no soportado actualmente.",
        requiresPanel: "Requiere configuración de panel.",
        homopolymerScrutiny:
          "Mejor adaptado a lecturas cortas Illumina; aplicar escrutinio extra en plataformas propensas a errores de homopolímeros.",
        noAlignment:
          "No realiza alineamiento de lecturas; la coincidencia de motivo es directa.",
      },
      notes:
        "STRait Razor está incluido en el ecosistema STRhub para análisis STR forense dirigido. Su algoritmo ligero de coincidencia de motivos lo hace adecuado para enseñanza y capacitación en interpretación de STR.",
    },
    toastr: {
      limitations: {
        forensicNgs:
          "Diseñado para análisis STR forense NGS; requiere panel de referencia STRaitRazor.",
        webInterfaceInactive:
          "Interfaz web inactiva en algunos servidores heredados.",
      },
      notes:
        "ToaSTR es una herramienta forense de genotipado STR basada en navegador para datos MPS, con modelado de stutter consciente de la secuencia, llamada automática de alelos e informes PDF conformes con ISFG. La distribución en Docker (labconowl/toastr) se ejecuta en macOS, Windows y Linux. Integrada en STRhub para análisis STR forense y validación de referencias.",
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
} as const

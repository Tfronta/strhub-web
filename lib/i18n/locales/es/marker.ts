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
  genomicCoords: "Coordenadas Genómicas",
  repeatRegion: "Región repetitiva",
  forwardStrandNote: "El motivo y las secuencias se muestran en la hebra directa (+) de GRCh38.",
  nistReference: "Referencia NIST STRBase",
  nistDescription: "Información de referencia oficial de la base de datos NIST STRBase",
  chromosome: "Cromosoma",
  cytogeneticLocation: "Ubicación citogenética",
  motif: "Motivo",
  alternativeMotifs: "Motivos alternativos",
  type: "Tipo",
  category: "Categoría",
  build: "Build",
  start: "Inicio",
  end: "Fin",
  referenceAllele: "Alelo de Referencia",
  nomenclatureNotes: {
    d6s474:
      "Los kits que cuentan las repeticiones con el motivo de Hill, [AGAT]n [GATA]n, designan esta secuencia de GRCh38 como alelo 17. STRhub usa la designación armonizada, 16, recomendada por {citation}.",
    dys612:
      "El Universal Analysis Software de ForenSeq informa los alelos de DYS612 con seis repeticiones menos. STRhub numera los alelos sobre toda la región repetitiva, como recomiendan {citation}.",
  },
  lastUpdated: "Última Actualización",
  commonAlleles: "Alelos Comunes",
  viewInBrowser: "Ver en Navegador Genômico UCSC",
  isoallelePatterns: "Patrones de Isoalelos",
  isoalleleDescription: "Patrones de secuencia detallados y variaciones para diferentes alelos",
  referenceSequences: "Secuencias de referencia verificadas contra NIST STRBase",
  reference: "Referencia",
  nistVerified: "Verificado NIST",
  alleleFreqDistribution: "Distribución de Frecuencia de Alelos",
  freqSourceNoteNGS:
    "Las frecuencias NGS de esta página provienen del **Proyecto 1000 Genomas** (Frontanilla et al., 2022) y de **Ribeirão Preto, Brasil** (Valle-Silva et al., 2022). Ambos estudios genotiparon datos de secuenciación con HipSTR y reportan los alelos por **longitud de fragmento**, no por secuencia.",
  freqSourceNoteCE:
    "Las frecuencias CE de los grupos AFR a OCE provienen del **conjunto STRs Local de pop.STR / SP-SMART (CESGA)**: alelos por longitud, de electroforesis capilar.",
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
    groupPopStr: "pop.STR / SP-SMART",
    groupLatam: "Latinoamérica",
    group1000G: "1000 Genomas (Frontanilla et al., 2022)",
    groupRao: "Ribeirão Preto (Valle-Silva et al., 2022)",
    superpopulation1000G: "Superpoblación {name} ({code}), Proyecto 1000 Genomas",
    superpopulations1000G: {
      AFR: "africana",
      AMR: "americana mezclada",
      EAS: "asiática oriental",
      EUR: "europea",
      SAS: "surasiática",
    },
    compare1000GButton: "Comparar las {n}",
    compareSource1000G:
      "Superpoblaciones del Proyecto 1000 Genomas: {pops} (Frontanilla et al., 2022). Cada punto es una frecuencia publicada; no se traza línea a través de un alelo que una población no tiene.",
    compareSourcePopStr:
      "Grupos de población de pop.STR / SP-SMART: {pops}. Cada punto es una frecuencia publicada; no se traza línea a través de un alelo que una población no tiene.",
    region: {
      latam: "LAT",
    },
    xstr: {
      populationLabel: "Población",
      noTables:
        "Todavía no se ha incorporado a STRhub una tabla publicada de frecuencias alélicas de X-STR para este locus.",
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
      "Estas frecuencias alélicas provienen de un estudio de secuenciación de nueva generación realizado en una muestra poblacional de Ribeirão Preto, São Paulo, Brasil (Valle-Silva et al., 2022). STRhub muestra las frecuencias alélicas de los genotipos obtenidos con HipSTR en ese estudio (Tabla Suplementaria 9). En STRhub, la etiqueta RAO se refiere específicamente a este conjunto de datos NGS de Ribeirão Preto. Referencia: Valle-Silva G, Frontanilla TS, Ayala J, Donadi EA, Simões AL, Castelli EC, Mendes-Junior CT. Forensic Sci Int Genet. 2022;58:102676. doi:10.1016/j.fsigen.2022.102676.",
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
      "Compara AFR, AMR, EAS, SAS y EUR del Proyecto 1000 Genomas Fase 3",
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
    g1kTitle: "Parámetros Forenses, 1000 Genomes (NGS)",
    g1kDescription:
      "Cinco grupos poblacionales del Proyecto 1000 Genomas (datos de alta cobertura del NYGC), genotipos obtenidos con HipSTR, tal como se publicaron en {citation}, Tabla Suplementaria 3.",
    raoTitle: "Parámetros Forenses, RAO (NGS)",
    raoDescription:
      "Muestra poblacional brasileña de Ribeirão Preto, genotipos obtenidos con HipSTR, tal como se publicaron en {citation}, Tabla Suplementaria 9.",
    parametersLegend:
      "N = individuos genotipados; Na = número de alelos; Ho = heterocigosidad observada; He = heterocigosidad esperada; MP = probabilidad de coincidencia; PD = poder de discriminación; PIC = contenido de información polimórfica; PE = poder de exclusión.",
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
  strnamingName: "STRNaming (ISFG 2024)",
  strnamingNotAvailable: "n/a",
  strnamingNotCovered: "Esta secuencia de STRbase no cubre el ISFG minimum range",
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
        longReadPanels:
          "Diseñado para paneles STR forenses de lectura larga (ONT o PacBio); requiere un archivo de referencia de loci.",
        notWgs: "No diseñado para aplicaciones de genoma completo (WGS).",
      },
      notes:
        "STRspy está integrado en el ecosistema STRhub para análisis STR forense y poblacional con datos de lectura larga (ONT o PacBio). Su diseño modular permite visualización, benchmarking y compatibilidad cruzada con conjuntos de datos HipSTR-UI.",
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
        "ToaSTR es una herramienta forense de genotipado STR basada en navegador para datos MPS, con modelado de stutter consciente de la secuencia, llamada automática de alelos e informes en PDF. La distribución en Docker (labconowl/toastr) se ejecuta en macOS, Windows y Linux. Integrada en STRhub para análisis STR forense y validación de referencias.",
    },
  },
  summary: {
    kind: {
      codis: "uno de los 20 loci del núcleo CODIS",
      ess: "parte del European Standard Set",
      autosomal: "un STR autosómico fuera del núcleo CODIS",
      x: "un STR del cromosoma X (X-STR)",
      y: "un STR del cromosoma Y (Y-STR)",
    },
    introTyped:
      "{name} es un locus de repeticiones cortas en tándem (STR) de tipo {type} en el cromosoma {chromosome}{cytoband}, {kind}.",
    introUntyped:
      "{name} es un locus de repeticiones cortas en tándem (STR) en el cromosoma {chromosome}{cytoband}, {kind}.",
    variants: "STRbase recoge {variants} en {designations}.",
    variantCount_one: "{count} variante de secuencia",
    variantCount_other: "{count} variantes de secuencia",
    designationCount_one: "{count} designación alélica",
    designationCount_other: "{count} designaciones alélicas",
    structureTitle: "Estructura de la secuencia (FSSG)",
    structureSource:
      "Rango mínimo ISFG, bracketing y cobertura por kit según la Forensic Sequence Structure Guide, {version} ({strider}; distribuido como {file}).",
    canonicalLabel: "Bracketing ISFG / STRNaming (desde 2024)",
    referenceNameLabel: "Alelo de referencia (GRCh38) nombrado con STRNaming 1.2.1",
    historicalLabel: "Bracketing histórico (2016-2023)",
    minimumRangeLabel: "Rango mínimo ISFG (GRCh38)",
    basePairs: "{n} pb",
    kitsLabel: "Kits MPS que cubren este locus",
    kitRange: "Rango secuenciado: {chrom}:{start}-{end} · {length} bp",
    kitColumn: "Columna de la FSSG: {column}",
    kitRestricted: "La FSSG restringe este locus al kit indicado.",
    kitMinimumRange: "ISFG minimum range: {chrom}:{start}-{end} · {length} pb",
    kitCoversMinimum: "Cubre todo el ISFG minimum range.",
    kitPartialMinimum: "No cubre todo el ISFG minimum range.",
    kitPartialLegend:
      "El rango del kit no cubre todo el ISFG minimum range de este locus ({range}), según los rangos de kits de la FSSG. Las bases del minimum range que quedan fuera del rango de un kit no las secuencia ese kit; las bases completadas desde la referencia deben identificarse como tales.",
    fssgNotesLabel: "Notas de la FSSG (en inglés, tal como las publica STRidER)",
    ceEquivalentLabel: "Equivalente CE de la referencia GRCh38 (FSSG)",
    crossReferenceLabel: "Secuencia dada por referencia en la FSSG",
    crossReferenceNote:
      "La FSSG da la secuencia de esta fila remitiendo a otra fila, sin escribirla. STRhub no muestra un nombre STRNaming acá hasta que esa secuencia se resuelva y se revise.",
    kitReversed: "Escrito en la FSSG de {from} a {to} (hebra inversa).",
    multiCopyIntro:
      "Este locus tiene dos copias en GRCh38 y la FSSG describe cada una en su propia fila: {copies}. Los rangos, equivalentes CE y nombres de abajo corresponden a la copia indicada arriba de cada bloque. Un resultado de tipificación suele listar los dos alelos del locus juntos; su orden no indica de qué copia física proviene cada uno.",
    frequenciesTitle: "Frecuencias alélicas de un vistazo",
    frequenciesIntro:
      "Alelo más frecuente por grupo poblacional, con su frecuencia y el tamaño muestral, en los datos de electroforesis capilar de",
    modalAlleleShort: "Alelo {allele}",
    sampleSize: "n = {n}",
    frequenciesTableCaption:
      "Frecuencias alélicas por grupo poblacional (pop.STR, CE). Se omiten los alelos ausentes en todos los grupos.",
    openFrequencies: "Abrir los gráficos interactivos de frecuencias",
    openVariants: "Ver las secuencias de las variantes",
    relatedTitle: "Marcadores relacionados",
    relatedSameChromosome: "Otros marcadores STR en el cromosoma {chromosome}",
    relatedKind: {
      codis: "Otros loci del núcleo CODIS",
      ess: "Otros loci del European Standard Set",
      autosomal: "Otros STR autosómicos",
      x: "Otros X-STR",
      y: "Otros Y-STR",
    },
    relatedCatalog: "Explorar el catálogo completo de marcadores STR",
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
  igvViewer: {
    title: "Ver las lecturas en este locus",
    desc: "Abre el visor IGV integrado en la ventana hg38 de este marcador con una muestra de 1000 Genomas.",
    button: "Abrir visor IGV",
  },
},
} as const

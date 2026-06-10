export default {
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
    uiPublication: "Publicación de la interfaz de usuario",
    inputLabel: "Entrada",
    outputLabel: "Salida",
    viewDetails: "Ver detalles",
    hideDetails: "Ocultar detalles",
    detailsNotCurated: "Detalles aún no curados.",
  },
  badges: {
    technology: {
      illumina: "Illumina",
      ont: "ONT",
      pacbio: "PacBio",
      multi_platform: "Multiplataforma",
      targeted: "Dirigido",
    },
    readType: {
      short_read: "Lectura corta",
      long_read: "Lectura larga",
      any: "Cualquiera",
    },
    analysis: {
      genotyping: "Genotipado",
      annotation: "Anotación",
      qc_database: "QC / Base de datos",
    },
    usage: {
      runs_locally: "Ejecución local",
      online_tool: "Herramienta en línea",
      graphical_interface: "Interfaz gráfica",
    },
  },
  filters: {
    title: "Filtros",
    filtersButton: "Filtros",
    clear: "Limpiar",
    technology: "Tecnología",
    analysis: "Análisis",
    usage: "Uso",
    all: "Todos",
    resetFilters: "Restablecer filtros",
    chipUsage: {
      runs_locally: "Local",
      online_tool: "En línea",
      graphical_interface: "Gráfica",
    },
    technologyOptions: {
      illumina: "Illumina",
      ont: "ONT",
      pacbio: "PacBio",
      multi_platform: "Multiplataforma",
    },
    analysisOptions: {
      genotyping: "Genotipado",
      annotation: "Anotación",
      qc_database: "QC / Base de datos",
    },
    usageOptions: {
      runs_locally: "Ejecución local",
      online_tool: "Herramienta en línea",
      graphical_interface: "Interfaz gráfica",
    },
  },
  nanomnt: {
    title: "NanoMnT",
    summary: "Genotipado de STRs basado en ONT a partir de lecturas largas alineadas con reporte por locus.",
    features: {
      1: "Genotipado STR a partir de alineamientos de lectura larga Nanopore",
      2: "Reporte de alelos y cobertura por locus",
      3: "Optimizado para datos de secuenciación de lectura larga ruidosos",
    },
  },
  strkit: {
    title: "STRkit",
    summary: "Herramienta de genotipado de STRs de lectura larga con inferencia alélica basada en modelos.",
    features: {
      1: "Estimación de longitud alélica STR basada en modelos",
      2: "Intervalos de confianza mediante bootstrapping estadístico",
      3: "Faseamiento opcional con SNVs cercanos",
    },
  },
  nastra: {
    title: "NASTRA",
    summary: "Análisis de STRs sin referencia para marcadores forenses mediante modelado estructural.",
    features: {
      1: "Llamada de alelos STR consciente de la estructura",
      2: "Enfoque de detección STR sin referencia",
      3: "Diseñado para marcadores STR forenses",
    },
  },
  nanostr: {
    title: "NanoSTR",
    summary: "Tipificación dirigida de STRs a partir de datos de lectura larga Nanopore.",
    features: {
      1: "Genotipado STR dirigido a partir de lecturas Nanopore",
      2: "Clasificación por longitud de lectura para inferencia alélica",
      3: "Procesamiento rápido para paneles STR dirigidos",
    },
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
    doradoBasecalling: "Basecalling (POD5 → BAM)",
    bam2fastq: "Convertir a FASTQ",
    pod5Convert: "Conversión POD5",
    minimap2Ont: "Alineamiento a hg38",
    nanoplot: "QC con NanoPlot",
  },
  hipstr: {
    title: "HipSTR",
    description: "Genotipado de STRs a partir de datos Illumina alineados (BAM/CRAM) con salida VCF.",
    category: "Genotipado",
    language: "C++",
    features: {
      1: "Genotipado STR basado en haplotipos con modelado de stutter",
      2: "Realineamiento local de lecturas en torno a loci STR",
      3: "Genotipado multi-muestra conjunto para análisis poblacional",
    },
  },
  longtr: {
    title: "LongTR",
    description:
      "Genotipado de repeticiones en tándem a partir de lecturas largas (PacBio HiFi y Oxford Nanopore), inspirado en el marco HipSTR y adaptado a datos de secuenciación de lectura larga. Produce archivos VCF comprimidos con bgzip.",
    category: "Genotipado",
    language: "C++",
    features: {
      1: "Genotipa repeticiones en tándem (STR y VNTR) desde BAM/CRAM de lecturas largas con BED de regiones TR",
      2: "Opciones de flujo para datos PacBio HiFi y Oxford Nanopore",
      3: "Admite entradas BAM fasadas (haplotipadas)",
      4: "Salida VCF con campos INFO/FORMAT para filtrado downstream",
    },
  },
  gangstr: {
    title: "GangSTR",
    description: "Genotipado genome-wide de STRs a partir de datos alineados de lectura corta con salida VCF.",
    category: "Perfilado",
    language: "C++",
    features: {
      1: "Genotipado STR en todo el genoma a partir de secuenciación de lectura corta",
      2: "Detección de expansiones y contracciones de repeticiones",
      3: "Modelado estadístico de distribuciones de longitud STR",
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
  igvHelp: {
    sectionTitle: "Guía para interpretar la vista de IGV",
    howToRead: "Cómo leer esta vista de IGV",
    readAligned: "Cada línea horizontal es una lectura de secuenciación alineada al genoma de referencia",
    stackedReads: "Las lecturas apiladas indican profundidad de cobertura",
    coloredBases: "Las bases coloreadas indican diferencias respecto a la referencia",
    zoomIn: "Use el botón + para acercar hasta que las bases individuales sean visibles",
    commonPatterns: "Patrones visuales comunes",
    insertion: "\"I\" dentro de una lectura = inserción respecto a la referencia (no es un nuevo alelo)",
    deletion: "Una brecha fina / línea negra dentro de una lectura = deleción respecto a la referencia",
    clickRead: "Haga clic en una lectura o variante para ver detalles del alineamiento (CIGAR, calidad de mapeo, posición)",
    ceVsIgvTitle: "De los picos de CE a las lecturas NGS",
    ceTitle: "Electroforesis Capilar (CE)",
    cePeaks: "Los picos resumen la señal por alelo",
    ceNoReads: "Las lecturas individuales no son visibles",
    igvTitle: "IGV (vista de lecturas NGS)",
    igvSingleRead: "Cada línea es una única lectura de secuenciación",
    igvInferred: "Los alelos se infieren a partir de muchas lecturas",
    igvIndels: "Las inserciones y deleciones se muestran explícitamente",
    keySentence: "CE resume la señal por alelo. IGV visualiza datos NGS como lecturas individuales. Estas vistas son complementarias.",
  },
  igvViewer: {
    pageTitle: "Visor IGV",
    pageSubtitle: "Integración con IGV para visualización y análisis genómico en un clic.",
    strMarker: "Marcador STR",
    selectMarker: "Seleccione un marcador",
    sample: "Muestra",
    selectSample: "Seleccione una muestra",
    launchIgv: "Iniciar Visor IGV",
    openUcsc: "Abrir en Navegador UCSC",
    viewerTitle: "Visor Interactivo del Genoma",
    dataIntegration: "Integración de Datos",
    dataIntegrationPre: "Este visor integra la biblioteca de código abierto",
    dataIntegrationMid: "para visualización genómica interactiva y datos de alineamiento de muestras del",
    dataIntegrationPost: "Los archivos BAM/BAI de demostración son recursos de datos abiertos, utilizados aquí con fines educativos y de investigación.",
    genomesLabel: "Proyecto 1000 Genomas",
    openDataTag: "IGV · Proyecto 1000 Genomas (datos abiertos)",
    igvStatusLabel: "Estado de IGV:",
    igvStatusReady: "Listo",
    igvStatusIdle: "Inactivo (haga clic en Iniciar Visor IGV)",
    igvErrorAlert: "IGV no se pudo cargar. Consulte la consola del navegador para más detalles.",
  },
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
      info: {
        trimmomatic: "Limpia lecturas paired-end eliminando adaptadores y bases de baja calidad.\nMejora la precisión de la alineación.\nGenera lecturas limpias (pares + lecturas individuales si una se descarta).",
        fastp: "Herramienta rápida que limpia lecturas y detecta adaptadores automáticamente.\nGenera lecturas filtradas y un informe de calidad.\nMuy usada en pipelines modernos.",
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
      info: {
        bwa: "Alinea lecturas cortas de Illumina contra un genoma de referencia.\nGenera un archivo SAM con posiciones genómicas.\nHerramienta estándar para datos short-read.",
        samtools: "Convierte SAM a BAM, ordena las lecturas por posición y crea un índice.\nNecesario para IGV, cálculo de cobertura y análisis posteriores.\nPermite acceso rápido a regiones específicas.",
        rmdup: "Marca o elimina duplicados de PCR (principalmente útil en WGS/WES).\nEn STR por amplicón pueden ser lecturas reales.\nUsar con precaución.",
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
      info: {
        depth: "Indica cuántas lecturas cubren cada base en una región.\nÚtil para evaluar cobertura y control de calidad en STR.\nModificar chr:start-end según el locus.",
        view: "Muestra todas las lecturas alineadas en una región seleccionada.\nÚtil para detectar errores o problemas de alineación cerca de STR.\nAyuda en la resolución de problemas.",
        tview: "Visor en terminal para archivos BAM con referencia.\nPermite inspección rápida sin IGV.\nÚtil para revisiones rápidas.",
      },
      commands: {
        depth: "samtools depth -r chr12:100000-100300 sample.bam > depth.txt",
        view: "samtools view sample.bam chr12:100000-100300",
        tview: "samtools tview sample.bam reference.fasta",
      },
    },
    nanopore: {
      title: "Nanopore (ONT) Essentials",
      subtitle: "Pipeline mínimo desde señales crudas de ONT hasta lecturas alineadas.",
      features: {
        1: "Basecall POD5 → reads (BAM no alineado)",
        2: "Alinear, ordenar e indexar BAM (minimap2 + samtools)",
        3: "Métricas de QC con NanoPlot",
      },
      info: {
        dorado: "Convierte la señal cruda de ONT (POD5) en secuencias de ADN.\nEl resultado es un BAM no alineado.",
        minimap2: "Alinea las lecturas al genoma humano de referencia (hg38),\nluego ordena e indexa el BAM.",
        nanoplot: "Genera métricas y gráficos de calidad a partir del BAM\n(longitud de lectura, calidad, rendimiento).",
      },
      commands: {
        dorado: "dorado basecaller dna_r10.4.1_e8.2_400bps_sup pod5/ > reads.bam",
        minimap2: "samtools fastq reads.bam | minimap2 -ax map-ont hg38.fa - | samtools sort -o aln.bam - && samtools index aln.bam",
        nanoplot: "NanoPlot --bam aln.bam --outdir nanoplot_out/",
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
      nanoporeTitle: "Utilidades Nanopore (herramientas POD5, NanoPlot, pycoQC)",
      nanoporeCmd: "pip install pod5 nanoplot pycoqc",
      nanoporeNote: "La instalación de Dorado depende de tu plataforma y de la disponibilidad de GPU; obtenga binarios precompilados desde las releases de Oxford Nanopore.",
      nanoporePythonNote: "Las herramientas de lectura larga pueden requerir Python ≥ 3.8 y espacio en disco suficiente para los modelos de basecalling.",
    },
  },
  straitrazor: {
    title: "STRait Razor",
    description: "Llamada de alelos STR basada en motivos a partir de FASTQ para paneles forenses dirigidos, con versión CLI y online.",
    tags: {
      category: "Genotipado",
      language: "R",
    },
    features: {
      1: "Detección de alelos STR basada en motivos a partir de lecturas FASTQ",
      2: "Configurable para paneles de marcadores STR forenses",
      3: "Mejor adaptado a lecturas cortas Illumina; aplicar escrutinio extra en plataformas propensas a errores de homopolímeros",
    },
    buttons: {
      github: "GitHub",
      paper: "Publicación original",
      online: "Versión Online",
    },
  },
  toastr: {
    title: "toaSTR",
    description:
      "Herramienta forense de genotipado STR basada en navegador para datos MPS, con modelado de stutter consciente de la secuencia, llamada automática de alelos e informes PDF conformes con ISFG.",
    tags: {
      category: "Genotipado",
      language: "Docker",
    },
    features: {
      1: "Genotipado STR forense en el navegador a partir de datos MPS",
      2: "Modelado de stutter consciente de la secuencia y llamada automática de alelos",
      3: "Informe de cobertura por alelo y visualización interactiva",
    },
    buttons: {
      github: "GitHub",
      paper: "Publicación original",
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
      1: "Generación automatizada de nombres estandarizados de alelos STR",
      2: "Descripción alélica basada en secuencia entre loci",
      3: "Nomenclatura legible para secuenciación forense",
    },
    buttons: {
      website: "Sitio web",
    },
  },
  fdstools: {
    title: "FDSTools",
    description: "Paquete Python para análisis de datos NGS forenses: caracterización y filtrado de stutter de PCR y ruido de secuenciación, y detección automática de alelos. Integra STRNaming para nomenclatura.",
    tags: {
      category: "Análisis",
      language: "Python",
    },
    features: {
      1: "Caracterización y corrección de stutter y ruido de PCR/secuenciación",
      2: "Detección automática de alelos a partir de FASTQ en datos MPS dirigidos",
      3: "Mejor adaptado a lecturas cortas Illumina; aplicar escrutinio extra en plataformas propensas a errores de homopolímeros",
    },
    buttons: {
      website: "Sitio web",
    },
  },
  strider: {
    title: "STRidER",
    description: "Base de datos poblacional de frecuencias alélicas STR cuidadosamente curada, que ofrece estimaciones de probabilidad de genotipos y control de calidad para STR autosómicos.",
    tags: {
      population: "Datos poblacionales",
      qc: "Control de calidad",
      webtool: "Web",
    },
    features: {
      1: "Base de datos curada de frecuencias alélicas STR autosómicas",
      2: "Control de calidad centralizado para conjuntos de datos poblacionales",
      3: "Estimación fiable de probabilidad de genotipos para análisis forense",
    },
    buttons: {
      website: "Sitio web",
    },
  },
  strspy: {
    title: "STRspy",
    description: "Herramienta de genotipado de STRs basada en ONT con salida tabular.",
    tags: {
      category: "Análisis",
      language: "Python",
    },
    features: {
      1: "Llamada de alelos STR a partir de secuenciación de lectura larga Nanopore",
      2: "Resolución alélica a nivel de secuencia usando bases de referencia",
      3: "Diseñado para perfilado STR forense",
    },
    buttons: {
      github: "GitHub",
      paper: "Publicación original",
    },
  },
},
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
    title: "Acerca de la generación FASTA",
    intro:
      "Este módulo produce secuencias FASTA de alta calidad para marcadores de Repetición Corta en Tándem (STR), utilizando regiones de referencia curadas derivadas del GRCh38.",
    detail:
      "Cada secuencia generada representa la estructura genómica esperada del locus STR, con regiones flanqueantes personalizables.",
    overview: {
      title: "Descripción general",
      paragraphs: [
        "El Generador FASTA de STRhub permite a los investigadores explorar la variabilidad alélica simulando patrones de repetición STR con contexto genómico preciso.",
        "Los usuarios pueden definir rangos de alelos, ajustar longitudes flanqueantes y exportar las secuencias resultantes en varios formatos estandarizados.",
      ],
    },
    features: {
      title: "Características",
      items: [
        "Soporte completo para marcadores STR del núcleo CODIS y extendidos",
        "Cortes basados en referencia alineados a GRCh38",
        "Regiones flanqueantes personalizables (0–200 pb por lado)",
        "Múltiples formatos de exportación: FASTA estándar, FASTA estilo referencia, Multi-FASTA y CSV tabular",
        "Opciones de descarga y copia directas",
      ],
    },
    useCases: {
      title: "Casos de uso",
      items: [
        "Investigación en genética forense y poblacional",
        "Reconstrucción alélica y análisis in silico",
        "Diseño de cebadores y validación de ensayos",
        "Propósitos educativos y de formación en genómica forense",
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
} as const

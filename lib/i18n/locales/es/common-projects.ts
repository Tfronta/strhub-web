export default {
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
} as const

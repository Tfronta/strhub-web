export default {
  verified: {
    title: "STRhub Verified",
    description:
      "Atestaciones independientes y automáticas de que una herramienta forense de STR se instala, corre de principio a fin y produce un output plausible — verificado sobre su código público en un commit fijado. No afirma exactitud de genotipos ni aptitud para casework.",
    empty: "Todavía no hay atestaciones publicadas.",
    verifiedOn: "Verificado el",
    backToList: "Todas las herramientas verificadas",
    source: "Código",
    commit: "Commit",
    environment: "Entorno",
    ciRun: "Run de CI",
    gates: "Compuertas",
    scope: "Alcance",
    scopeNote:
      "Esto no afirma que los genotipos sean correctos, ni que la herramienta sea apta para casework o cumpla algún estándar regulatorio. La concordancia contra verdad conocida queda fuera de alcance.",
    staticPage: "reporte estático",
    disclaimer:
      "Cada resultado es una foto fechada, verificada sobre el repositorio público de la herramienta en un commit fijado. STRhub no guarda código fuente de ninguna herramienta.",
    col: {
      strLoci: "loci STR",
      snps: "SNPs",
      reads: "reads",
    },
    gate: {
      available: "el código público fijado existe",
      installs: "el entorno compila desde el código",
      runs: "se ejecuta de principio a fin sin romperse",
      io: "produce un archivo no vacío en el formato declarado",
      content: "su output parece datos de genotipos plausibles",
    },
    content: {
      heading: "Contenido del output (evidencia de plausibilidad)",
      records: "Registros de secuencia",
      strLoci: "Loci STR detectados",
      snps: "SNPs de identidad (rsNNNN)",
      totalReads: "Reads totales",
      strLociList: "Loci STR",
    },
  },
};

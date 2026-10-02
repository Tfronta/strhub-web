export default {
mixProfiles: {
  title: "Simulador de Mezclas de ADN",
  subtitle: "beta",
  description: "Usando datos de demostración — puede cargar sus propias muestras cuando estén disponibles.",
  simulatorDescription:
    "Este simulador muestra cómo dos o tres perfiles de ADN se comportan cuando se mezclan, tanto en electroforesis capilar (CE) como en NGS. Ayuda a comprender cómo cambian las alturas de los picos, cómo aparecen los artefactos de stutter y cómo los alelos minoritarios pueden quedar ocultos o confundidos con ruido, ilustrando la complejidad real de la interpretación de mezclas en genética forense. **Los perfiles se derivan de muestras de acceso abierto del Proyecto 1000 Genomes. Solo con fines educativos, no validado para la interpretación de casos forenses.**",
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
      "Haplotipos individuales inferidos a partir de datos NGS de lecturas cortas Illumina mediante software especializado de genotipado de STRs (HipSTR, hg38), **mostrados únicamente con fines educativos.** Las secuencias de la región repetida siguen las recomendaciones vigentes de nomenclatura de secuencia de STRs de la ISFG (2024), vía STRNaming.",
    isfgLinkText: "Leer el paper original",
    copySequence: "Copiar secuencia",
    copyRepeat: "Copiar nombre STRNaming",
    ceExplainAria: "Por qué la suma de repeticiones difiere del número de alelo",
    ceExplainTitle: "¿Por qué sumar las repeticiones no siempre da el número de alelo?",
    ceExplainBody:
      "El número de alelo (CE) es la designación clásica por longitud. En algunos loci difiere del conteo de bloques por cómo se calibraron las escaleras alélicas originales. En vWA, por ejemplo, los 19 bloques de repetición sobre el ISFG minimum range corresponden a CE 14. La diferencia es propia de cada locus, así que sumar bloques no es una regla general. STRNaming reporta el número CE junto con la estructura completa de la secuencia.",
    ceExplainPaperLink: "Leé la explicación completa en el paper original",
    ceExplainToolLink: "Probalo en STRNaming",
    copiedSequence: "Copiado",
    tableAllele: "Alelo",
    tableCoverage: "PDP",
    tableCoverageTooltipAria: "Qué significa PDP",
    tableCoverageTooltip:
      "PDP es un campo FORMAT de HipSTR: el soporte fraccional de lecturas asignado a cada genotipo haploide. Los dos valores de PDP de un llamado suman DP, así que PDP no es una profundidad de secuenciación independiente por alelo.",
    tableSimulatedSupport: "Soporte de lecturas simulado",
    tableMixedSupport: "PDP o soporte de lecturas simulado",
    simulatedTag: "sim.",
    simulatedTagTitle: "Soporte de lecturas simulado, no PDP de HipSTR",
    tableRepeatSequence: "Nombre del alelo (STRNaming 1.2.1)",
    axisLabelAllele: "Alelo",
    axisLabelCoverage: "PDP sumado por alelo",
    axisLabelSimulated: "Soporte de lecturas simulado",
    axisLabelMixed: "PDP + soporte de lecturas simulado, sumados por alelo",
    fullSequenceColumnLabel: "Secuencia (ISFG minimum range, GRCh38)",
    fullSequenceTooltipAria: "Sobre la secuencia en el ISFG minimum range",
    fullSequenceNote:
      "Secuencia sobre el ISFG minimum range (FSSG v6.1, hebra directa de GRCh38) que usa STRNaming: la región repetitiva más las bases flanqueantes dentro de ese rango. Es exactamente el input que produce el nombre del alelo.",
    strnamingVerifyNote:
      "Para reproducir el nombre, pegá esta secuencia en STRNaming con el rango ISFG:",
    isoTooltip:
      "Isoalelos en este ejemplo: misma designación alélica, distinta secuencia dentro del ISFG minimum range.",
    pdpNote:
      "**PDP (HipSTR):** soporte fraccional de lecturas asignado a cada genotipo haploide. Los dos valores de PDP de un llamado suman DP, así que PDP no es una profundidad de secuenciación independiente por alelo. Los valores provienen de la corrida de HipSTR de cada muestra sola y no cambian con las proporciones de la mezcla.",
    simulatedNote:
      "**Soporte de lecturas simulado:** el ejemplo trialélico sintético no tiene datos de secuenciación, así que sus valores se simulan a partir de las alturas de pico del electroferograma. No son PDP de HipSTR.",
    flank5Tooltip: "Flanqueadora 5'",
    repeatRegionTooltip: "Región repetitiva",
    flank3Tooltip: "Flanqueadora 3'",
    igvGuideTitle: "Inspeccionar lecturas en IGV",
    igvGuideBody:
      "STRhub proporciona un visor IGV integrado para explorar las lecturas de secuenciación detrás de estos haplotipos.",
    igvGuideStep1: "Abra el visor IGV",
    igvGuideStep2: "Seleccione una muestra",
    igvGuideStep3: "Seleccione el marcador STR",
    igvGuideNote:
      "Nota: IGV muestra una muestra a la vez. En perfiles de mezcla, inspeccione cada muestra por separado.",
    igvGuideCta: "Abrir IGV Viewer →",
  },
  trueGenotypes: {
    toggleLabel: "Mostrar genotipos verdaderos",
    title: "Genotipos verdaderos en {locus}",
    notSelected: "No seleccionado",
    none: "—",
    na: "Genotipo no disponible",
    naHelp: "No se encontraron alelos verdaderos para este locus en el conjunto de datos de demostración.",
    noCall: "Sin llamada",
    noCallReason:
      "Pocas lecturas atraviesan el rango mínimo ISFG para descartar la pérdida de un segundo alelo.",
    noCallNotice:
      "{sample} no tiene llamada en {locus}: pocas lecturas atraviesan el rango mínimo ISFG para distinguir un homocigoto de la pérdida de un segundo alelo, así que no aporta alelos en este locus.",
    noCallNgs:
      "{sample} no tiene llamada en {locus}, así que ninguno de sus alelos aparece abajo; las filas son de las otras muestras seleccionadas.",
    noSample: "Ninguno",
  },
  ceChart: {
    advancedModeLabel: "Avanzado",
    advancedModeTooltip:
      "Simula vista real de CE. Los stutters no se diferencian por color. Útil para práctica avanzada.",
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
    tooltipTrueWithStutter: "Alelo {label} — {trueRfu} RFU + {stutterRfu} St. RFU",
    tooltipStutter: "Stutter en {allele} — {rfu} RFU (de {parent})",
    tooltipStutterTotal: "Stutter en {allele} — {rfu} RFU total",
    tooltipStutterFromParent: "De {parent} ({deltaLabel}): {rfu} RFU",
    tooltipStutterMayIncludeMultiple: "(El stutter puede incluir varios contribuyentes)",
    tooltipCalled: "Llamado",
    tooltipDropout: "Riesgo de pérdida",
    tooltipArea: "Área del pico: {area} (CE-equivalente)",
    infoLabel: "Mostrar nota sobre el modelado de stutter",
    infoText:
      "Simulador educativo\n\nEl stutter se modela como una fracción específica de cada locus de la altura del pico verdadero (típicamente ~6–11%, mayor en algunos loci largos). El stutter en una posición puede venir de más de un alelo (p. ej. −1 del alelo siguiente, +1 del anterior); el tooltip muestra el desglose por alelo padre y delta.\n\nLos valores de área del pico se reportan como señal equivalente a CE, obtenidos escalando la altura del pico con una relación típica área/altura de CE (≈4,25).\n\nEstos valores son aproximaciones educativas, no parámetros validados de un kit específico.",
  },
  parameters: {
    at: "AT (RFU)",
    st: "ST (RFU)",
    degradationK: "Degradación k (por 100 pb)",
    noiseBase: "Ruido / Base (RFU)",
    stutterLevel: "Nivel de stutter (×)",
    autoScale: "Auto-escala Y",
    fixedScale: "Escala forense fija (0–800 RFU)",
    atTooltip: "Umbral Analítico (AT): Umbral mínimo de RFU a partir del cual un pico se considera señal confiable (no ruido). Definido por validación interna del laboratorio (varía según color de fluoróforo, instrumento y kit). Valores típicos: 50–175 RFU. Picos por debajo de AT se ignoran o se interpretan con precaución.",
    stTooltip: "Umbral Estocástico (ST): Umbral de RFU por encima del cual es improbable un dropout significativo o desbalance heterocigoto pronunciado en muestras de bajo ADN. Definido por validación interna. Entre AT y ST, interpretar con precaución debido a efectos estocásticos. Valores típicos: 150–600 RFU.",
    autoScaleTooltip: "Ajusta automáticamente el eje Y para ajustar todos los picos.\n\nÚtil para visualizar picos menores de bajo RFU o perfiles degradados.",
    degradationKTooltip: "Coeficiente de degradación k (por 100 pb): Simula la pérdida preferencial de señal en fragmentos largos por daño en el ADN. Valores típicos: 0.010 (buena calidad), 0.015–0.020 (muestras difíciles), >0.020 (muy degradadas). A mayor k, los alelos más largos pierden más altura de pico.",
    noiseBaseTooltip: "Ruido de baseline (RFU): Simula el ruido de fluorescencia de fondo en electroforesis capilar. Valores altos generan más picos pequeños y fluctuación de la línea base, similar a muestras reales con inhibidores o contaminación.",
    stutterLevelTooltip: "Tasa de stutter (×): Factor didáctico que multiplica o reduce la intensidad del stutter modelado para este marcador. 1.0 = tasa realista (según validación del kit). >1.0 = exagerado para enseñanza (ej: mostrar cómo el stutter puede confundirse con un alelo minoritario).",
  },
  quickGuide: {
    title: "Guía Rápida para Configuración de Mezclas de ADN",
    button: "Guía Rápida",
    thresholds: {
      title: "Umbrales en la práctica",
      at: "AT (Umbral Analítico): Valores más bajos permiten la detección de picos minoritarios; valores más altos suprimen el ruido de fondo.",
      st: "ST (Umbral Estocástico): Picos por debajo del ST pueden indicar desbalance de heterocigotos o pérdida de alelos (dropout).",
      important: "Importante: Estos umbrales deben determinarse por validación interna del laboratorio y varían según instrumento, protocolo y condiciones analíticas.",
    },
    mixture: {
      title: "Proporciones de mezcla",
      balanced: "50/50: Mezcla equilibrada",
      moderate: "70/30: Desbalance moderado",
      strong: "80/20 o 90/10: Desbalance fuerte (ideal para demostrar el comportamiento de mezclas en escenarios didácticos)",
    },
    markers: {
      title: "Loci con comportamiento de stutter más claro",
      description: "Los alelos más largos generalmente muestran stutter más notorio.",
      fga: "FGA",
      d18s51: "D18S51",
      d21s11: "D21S11",
      d2s1338: "D2S1338",
    },
    simulation: {
      title: "Cómo simular stutter del contribuidor mayoritario similar al alelo verdadero del contribuidor minoritario",
      ratio: "Proporción de mezcla ≥ 80/20 (desbalance fuerte)",
      degradation: "Degradación k: 0,015–0,030",
      stutter: "Multiplicador de tasa de stutter: 1,5–2,0 (para fines ilustrativos/didácticos)",
      loci: "Preferir loci donde los contribuyentes difieren por una unidad de repetición (ej.: 10 vs 9)",
      scenario: "Este escenario ilustra un desafío común de interpretación: el stutter del contribuidor mayoritario puede asemejarse a un alelo verdadero del contribuidor minoritario.",
    },
    notes: {
      title: "Notas prácticas",
      longerAlleles: "Los alelos más largos pierden intensidad de señal más temprano bajo degradación.",
      minorContributors: "Los contribuyentes minoritarios caen en RFU más rápidamente en muestras degradadas.",
      stutter: "El stutter es más fácil de detectar cuando hay un gran desbalance entre el contribuidor mayoritario y el minoritario.",
      notAllLoci: "No todos los loci exhiben estos efectos por igual.",
      validation: "Para simulaciones realistas, ajuste los parámetros basándose en los umbrales y tasas de stutter validados de su laboratorio.",
    },
  },
},
mixtures: {
  presets: {
    stutterMinor: "Stutter ≈ Minor",
    stutterAmbiguity: "Mezcla enmascarada",
    dropout: "Alelo minoritario bajo",
    overlap: "Alelos solapados",
    triallelic: "Patrón trialélico",
  },
  tooltips: {
    stutterMinor:
      "Muestra un escenario en el que el stutter del contribuidor mayoritario es similar al alelo verdadero del contribuidor minoritario, pudiendo generar confusión en la interpretación del perfil de mezcla.",
    stutterAmbiguity:
      "Muestra un caso donde una mezcla puede parecer de fuente única en este locus debido al enmascaramiento por stutter de los alelos minoritarios.",
    lowMinor:
      "Muestra un alelo del contribuyente minoritario muy cercano al umbral de detección.",
    overlap:
      "Muestra dos contribuyentes que comparten un alelo, generando un pico combinado más alto en el centro.",
    triallelic:
      "Perfil sintético de fuente única con un locus trialélico. Puede parecerse a una mezcla de dos personas.",
  },
},
} as const

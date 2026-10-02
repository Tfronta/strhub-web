export default {
mixProfiles: {
  title: "Simulador de Misturas de DNA",
  subtitle: "beta",
  description: "Usando dados de demonstração — você pode carregar suas próprias amostras quando disponível.",
  simulatorDescription:
    "Este simulador mostra como dois ou três perfis de DNA se comportam quando misturados, tanto na eletroforese capilar (CE) quanto em NGS. Ele ajuda a compreender como as alturas dos picos mudam, como surgem artefatos de stutter e como alelos minoritários podem ficar ocultos ou confundidos com ruído, ilustrando a real complexidade da interpretação de misturas em genética forense. **Os perfis são derivados de amostras de acesso aberto do Projeto 1000 Genomes. Apenas para fins educacionais, não validado para a interpretação de casos forenses.**",
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
      "Haplótipos individuais inferidos a partir de dados NGS de leituras curtas Illumina usando software especializado de genotipagem de STRs (HipSTR, hg38), **exibidos apenas para fins educacionais.** As sequências da região repetida seguem as recomendações vigentes de nomenclatura de sequência de STRs da ISFG (2024), via STRNaming.",
    isfgLinkText: "Ler o artigo original",
    copySequence: "Copiar sequência",
    copyRepeat: "Copiar nome STRNaming",
    ceExplainAria: "Por que a soma das repetições difere do número do alelo",
    ceExplainTitle: "Por que somar as repetições nem sempre dá o alelo?",
    ceExplainBody:
      "O número do alelo (CE) é a designação clássica por comprimento. Em alguns loci difere da contagem de blocos por causa da calibração das escadas alélicas originais. No vWA, por exemplo, os 19 blocos de repetição sobre o ISFG minimum range correspondem a CE 14. A diferença é própria de cada locus, então somar blocos não é uma regra geral. O STRNaming reporta o número CE junto com a estrutura completa da sequência.",
    ceExplainPaperLink: "Leia a explicação completa no paper original",
    ceExplainToolLink: "Experimente no STRNaming",
    copiedSequence: "Copiado",
    tableAllele: "Alelo",
    tableCoverage: "PDP",
    tableCoverageTooltipAria: "O que significa PDP",
    tableCoverageTooltip:
      "PDP é um campo FORMAT do HipSTR: o suporte fracionário de leituras atribuído a cada genótipo haploide. Os dois valores de PDP de uma chamada somam DP, portanto PDP não é uma profundidade de sequenciamento independente por alelo.",
    tableSimulatedSupport: "Suporte de leituras simulado",
    tableMixedSupport: "PDP ou suporte de leituras simulado",
    simulatedTag: "sim.",
    simulatedTagTitle: "Suporte de leituras simulado, não PDP do HipSTR",
    tableRepeatSequence: "Nome do alelo (STRNaming 1.2.1)",
    axisLabelAllele: "Alelo",
    axisLabelCoverage: "PDP somado por alelo",
    axisLabelSimulated: "Suporte de leituras simulado",
    axisLabelMixed: "PDP + suporte de leituras simulado, somados por alelo",
    fullSequenceColumnLabel: "Sequência (ISFG minimum range, GRCh38)",
    fullSequenceTooltipAria: "Sobre a sequência no ISFG minimum range",
    fullSequenceNote:
      "Sequência no ISFG minimum range (FSSG v6.1, fita direta do GRCh38) usado pelo STRNaming: a região repetitiva mais as bases flanqueadoras dentro desse intervalo. É exatamente a entrada que produz o nome do alelo.",
    strnamingVerifyNote:
      "Para reproduzir o nome, cole esta sequência no STRNaming com o intervalo ISFG:",
    isoTooltip:
      "Isoalelos neste exemplo: mesma designação alélica, sequência diferente dentro do ISFG minimum range.",
    pdpNote:
      "**PDP (HipSTR):** suporte fracionário de leituras atribuído a cada genótipo haploide. Os dois valores de PDP de uma chamada somam DP, portanto PDP não é uma profundidade de sequenciamento independente por alelo. Os valores vêm da análise do HipSTR de cada amostra isolada e não mudam com as proporções da mistura.",
    simulatedNote:
      "**Suporte de leituras simulado:** o exemplo trialélico sintético não tem dados de sequenciamento, então seus valores são simulados a partir das alturas dos picos do eletroferograma. Não são PDP do HipSTR.",
    flank5Tooltip: "Flanqueadora 5'",
    repeatRegionTooltip: "Região repetitiva",
    flank3Tooltip: "Flanqueadora 3'",
    igvGuideTitle: "Inspecionar leituras no IGV",
    igvGuideBody:
      "O STRhub oferece um visualizador IGV integrado para explorar as leituras de sequenciamento por trás destes haplótipos.",
    igvGuideStep1: "Abra o visualizador IGV",
    igvGuideStep2: "Selecione uma amostra",
    igvGuideStep3: "Selecione o marcador STR",
    igvGuideNote:
      "Nota: o IGV exibe uma amostra por vez. Em perfis de mistura, inspecione cada amostra separadamente.",
    igvGuideCta: "Abrir IGV Viewer →",
  },
  trueGenotypes: {
    toggleLabel: "Mostrar genótipos verdadeiros",
    title: "Genótipos verdadeiros em {locus}",
    notSelected: "Não selecionado",
    none: "—",
    na: "Genótipo não disponível",
    naHelp: "Nenhum alelo verdadeiro encontrado para este locus no conjunto de dados de demonstração.",
    noCall: "Sem chamada",
    noCallReason:
      "Poucas leituras atravessam o intervalo mínimo ISFG para descartar a perda de um segundo alelo.",
    noCallNotice:
      "{sample} não tem chamada em {locus}: poucas leituras atravessam o intervalo mínimo ISFG para distinguir um homozigoto da perda de um segundo alelo, então não contribui com alelos neste locus.",
    noCallNgs:
      "{sample} não tem chamada em {locus}, então nenhum de seus alelos aparece abaixo; as linhas são das outras amostras selecionadas.",
    noSample: "Nenhum",
  },
  ceChart: {
    advancedModeLabel: "Avançado",
    advancedModeTooltip:
      "Simula vista real de CE. Os stutters não se diferenciam por cor. Útil para prática avançada.",
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
    tooltipTrueWithStutter: "Alelo {label} — {trueRfu} RFU + {stutterRfu} St. RFU",
    tooltipStutter: "Stutter em {allele} — {rfu} RFU (de {parent})",
    tooltipStutterTotal: "Stutter em {allele} — {rfu} RFU total",
    tooltipStutterFromParent: "De {parent} ({deltaLabel}): {rfu} RFU",
    tooltipStutterMayIncludeMultiple: "(O stutter pode incluir vários contribuidores)",
    tooltipCalled: "Chamado",
    tooltipDropout: "Risco de perda",
    tooltipArea: "Área do pico: {area} (CE-equivalente)",
    infoLabel: "Mostrar nota sobre o modelo de stutter",
    infoText:
      "Simulador educacional\n\nO stutter é modelado como uma fração específica de cada locus em relação à altura do pico verdadeiro (tipicamente ~6–11%, maior em alguns loci longos). O stutter numa posição pode vir de mais de um alelo (ex.: −1 do alelo seguinte, +1 do anterior); o tooltip mostra o desglose por alelo pai e delta.\n\nOs valores de área do pico são reportados como sinal equivalente a CE, obtidos pela escala da altura do pico usando uma relação típica de área/altura de CE (≈4,25).\n\nEsses valores são aproximações educacionais, não parâmetros validados de nenhum kit específico.",
  },
  parameters: {
    at: "AT (RFU)",
    st: "ST (RFU)",
    degradationK: "Degradação k (por 100 pb)",
    noiseBase: "Ruído / Base (RFU)",
    stutterLevel: "Taxa de stutter (×)",
    autoScale: "Auto-escala Y",
    fixedScale: "Escala forense fixa (0–800 RFU)",
    atTooltip: "Limiar Analítico (AT): Limiar mínimo de RFU a partir do qual um pico é considerado sinal confiável (não ruído). Definido por validação interna do laboratório (varia conforme cor do fluoróforo, instrumento e kit). Valores típicos: 50–175 RFU. Picos abaixo do AT são ignorados ou interpretados com precaução.",
    stTooltip: "Limiar Estocástico (ST): Limiar de RFU acima do qual é improvável dropout significativo ou desbalanço acentuado em heterozigotos em amostras de baixa quantidade de DNA. Definido por validação interna. Entre AT e ST, interpretar com cautela devido a efeitos estocásticos. Valores típicos: 150–600 RFU.",
    autoScaleTooltip: "Ajusta automaticamente o eixo Y para ajustar todos os picos.\n\nÚtil para visualizar picos menores de baixo RFU ou perfis degradados.",
    degradationKTooltip: "Coeficiente de degradação k (por 100 pb): Simula a perda preferencial de sinal em fragmentos longos por dano no DNA. Valores típicos: 0.010 (boa qualidade), 0.015–0.020 (amostras difíceis), >0.020 (muito degradadas). Quanto maior o k, maior a perda de altura em alelos longos.",
    noiseBaseTooltip: "Ruído de baseline (RFU): Simula o ruído de fluorescência de fundo na eletroforese capilar. Valores altos geram mais picos pequenos e flutuação da linha de base, semelhante a amostras reais com inibidores ou contaminação.",
    stutterLevelTooltip: "Taxa de stutter (×): Fator didático que multiplica ou reduz a intensidade do stutter modelado para este marcador. 1.0 = taxa realista (conforme validação do kit). >1.0 = exagerado para ensino (ex: mostrar como o stutter pode ser confundido com alelo minoritário).",
  },
  quickGuide: {
    title: "Guia Rápida para Configuração de Misturas de DNA",
    button: "Guia Rápido",
    thresholds: {
      title: "Limiares na prática",
      at: "AT (Limiar Analítico): Valores mais baixos permitem a detecção de picos minoritários; valores mais altos suprimem o ruído de fundo.",
      st: "ST (Limiar Estocástico): Picos abaixo do ST podem indicar desbalanço de heterozigotos ou perda de alelos (dropout).",
      important: "Importante: Esses limiares devem ser determinados por validação interna do laboratório e variam conforme instrumento, protocolo e condições analíticas.",
    },
    mixture: {
      title: "Proporções de mistura",
      balanced: "50/50: Mistura equilibrada",
      moderate: "70/30: Desbalanço moderado",
      strong: "80/20 ou 90/10: Desbalanço forte (ideal para demonstrar o comportamento de misturas em cenários didáticos)",
    },
    markers: {
      title: "Loci com comportamento de stutter mais claro",
      description: "Alelos mais longos geralmente apresentam stutter mais notável.",
      fga: "FGA",
      d18s51: "D18S51",
      d21s11: "D21S11",
      d2s1338: "D2S1338",
    },
    simulation: {
      title: "Como simular stutter do contribuidor majoritário similar ao alelo verdadeiro do contribuidor minoritário",
      ratio: "Proporção de mistura ≥ 80/20 (desbalanço forte)",
      degradation: "Degradação k: 0,015–0,030",
      stutter: "Multiplicador de taxa de stutter: 1,5–2,0 (para fins ilustrativos/didáticos)",
      loci: "Preferir loci onde os contribuintes diferem por uma unidade de repetição (ex.: 10 vs 9)",
      scenario: "Este cenário ilustra um desafio comum de interpretação: o stutter do contribuidor majoritário pode se assemelhar a um alelo verdadeiro do contribuidor minoritário.",
    },
    notes: {
      title: "Notas práticas",
      longerAlleles: "Alelos mais longos perdem intensidade de sinal mais cedo sob degradação.",
      minorContributors: "Contribuintes minoritários caem em RFU mais rapidamente em amostras degradadas.",
      stutter: "O stutter é mais fácil de detectar quando há grande desbalanço entre contribuidor majoritário e minoritário.",
      notAllLoci: "Nem todos os loci exibem esses efeitos igualmente.",
      validation: "Para simulações realistas, ajuste os parâmetros com base nos limiares e taxas de stutter validados do seu laboratório.",
    },
  },
},
mixtures: {
  presets: {
    stutterMinor: "Stutter ≈ Minor",
    stutterAmbiguity: "Mistura mascarada",
    dropout: "Alelo minoritário baixo",
    overlap: "Alelos sobrepostos",
    triallelic: "Padrão trialélico",
  },
  tooltips: {
    stutterMinor:
      "Demonstra um cenário em que o stutter do contribuidor majoritário é similar ao alelo verdadeiro do contribuidor minoritário, podendo gerar confusão na interpretação do perfil de mistura.",
    stutterAmbiguity:
      "Mostra um caso em que uma mistura pode parecer de fonte única neste locus devido ao mascaramento por stutter dos alelos minoritários.",
    lowMinor:
      "Mostra um alelo do contribuidor minoritário muito próximo ao limite de detecção.",
    overlap:
      "Mostra dois contribuintes que compartilham um alelo, gerando um pico combinado mais alto no centro.",
    triallelic:
      "Perfil sintético de fonte única com um locus trialélico. Pode se assemelhar a uma mistura de duas pessoas.",
  },
},
} as const

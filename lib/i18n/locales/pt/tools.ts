export default {
tools: {
  title: "Ferramentas e Pipelines",
  subtitle: "Ferramentas de Análise e Processamento",
  description:
    "Suite abrangente de ferramentas de bioinformática e pipelines para análise de STRs, desde processamento de dados brutos até genética populacional.",
  hero: {
    title: "Ferramentas Poderosas para Análise STR",
    description: "Coleção abrangente de ferramentas, pipelines e tutoriais para análise de Repetições em Tandem Curtas. Desde genotipagem até visualização, encontre tudo que você precisa para sua pesquisa.",
    ctaCollaborate: "Enviar ferramenta ou tutorial",
    disclaimer: "Todas as ferramentas de software listadas nesta seção são de acesso aberto. O STRhub não mantém relacionamento comercial com os desenvolvedores dessas ferramentas e não recebe compensação financeira por sua inclusão.",
  },
  header: {
    backToStrhub: "← Voltar ao STRhub",
  },
  common: {
    keyFeatures: "Características Principais:",
    github: "GitHub",
    website: "Site",
    originalPublication: "Publicação original",
    uiPublication: "Publicação da interface de usuário",
    inputLabel: "Entrada",
    outputLabel: "Saída",
    viewDetails: "Ver detalhes",
    hideDetails: "Ocultar detalhes",
    detailsNotCurated: "Detalhes ainda não curados.",
  },
  badges: {
    technology: {
      illumina: "Illumina",
      ont: "ONT",
      pacbio: "PacBio",
      multi_platform: "Multi-plataforma",
      targeted: "Direcionado",
    },
    readType: {
      short_read: "Leitura curta",
      long_read: "Leitura longa",
      any: "Qualquer",
    },
    analysis: {
      genotyping: "Genotipagem",
      annotation: "Anotação",
      qc_database: "QC / Banco de dados",
    },
    usage: {
      runs_locally: "Execução local",
      online_tool: "Ferramenta online",
      graphical_interface: "Interface gráfica",
    },
  },
  filters: {
    title: "Filtros",
    filtersButton: "Filtros",
    clear: "Limpar",
    technology: "Tecnologia",
    analysis: "Análise",
    usage: "Uso",
    all: "Todos",
    resetFilters: "Limpar filtros",
    chipUsage: {
      runs_locally: "Local",
      online_tool: "Online",
      graphical_interface: "Gráfica",
    },
    technologyOptions: {
      illumina: "Illumina",
      ont: "ONT",
      pacbio: "PacBio",
      multi_platform: "Multi-plataforma",
    },
    analysisOptions: {
      genotyping: "Genotipagem",
      annotation: "Anotação",
      qc_database: "QC / Banco de dados",
    },
    usageOptions: {
      runs_locally: "Execução local",
      online_tool: "Ferramenta online",
      graphical_interface: "Interface gráfica",
    },
  },
  nanomnt: {
    title: "NanoMnT",
    summary: "Genotipagem de STRs baseada em ONT a partir de leituras longas alinhadas com relatório por locus.",
    features: {
      1: "Genotipagem STR a partir de alinhamentos de leitura longa Nanopore",
      2: "Relatório de alelos e cobertura por locus",
      3: "Otimizado para dados de sequenciamento de leitura longa ruidosos",
    },
  },
  strkit: {
    title: "STRkit",
    summary: "Ferramenta de genotipagem de STRs de leitura longa com inferência alélica baseada em modelos.",
    features: {
      1: "Estimativa de comprimento alélico STR baseada em modelos",
      2: "Intervalos de confiança via bootstrapping estatístico",
      3: "Faseamento opcional com SNVs próximos",
    },
  },
  nastra: {
    title: "NASTRA",
    summary: "Análise de STRs sem referência para marcadores forenses por modelagem estrutural.",
    features: {
      1: "Chamada de alelos STR consciente da estrutura",
      2: "Abordagem de detecção STR sem referência",
      3: "Projetado para marcadores STR forenses",
    },
  },
  nanostr: {
    title: "NanoSTR",
    summary: "Tipagem direcionada de STRs a partir de dados de leitura longa Nanopore.",
    features: {
      1: "Genotipagem STR direcionada a partir de leituras Nanopore",
      2: "Ranqueamento por tamanho de leitura para inferência alélica",
      3: "Processamento rápido para painéis STR direcionados",
    },
  },
  codeLabels: {
    trimmomatic: "Trimmomatic",
    fastp: "fastp",
    bwaAlignment: "Alinhamento BWA-MEM2",
    convertSortIndex: "Converter / ordenar / indexar",
    removeDuplicates: "Remover duplicatas",
    depthCoverage: "Cobertura de profundidade",
    regionInspection: "Inspeção de região",
    quickVisualization: "Visualização rápida",
    doradoBasecalling: "Basecalling (POD5 → BAM)",
    bam2fastq: "Converter para FASTQ",
    pod5Convert: "Conversão POD5",
    minimap2Ont: "Alinhamento para hg38",
    nanoplot: "QC com NanoPlot",
  },
  hipstr: {
    title: "HipSTR",
    description: "Genotipagem de STRs a partir de dados Illumina alinhados (BAM/CRAM) com saída VCF.",
    category: "Genotipagem",
    language: "C++",
    features: {
      1: "Genotipagem STR baseada em haplótipos com modelagem de stutter",
      2: "Realinhamento local de leituras em torno dos loci STR",
      3: "Genotipagem multi-amostra conjunta para análise populacional",
    },
  },
  longtr: {
    title: "LongTR",
    description:
      "Genotipagem de repetições em tandem a partir de leituras longas (PacBio HiFi e Oxford Nanopore), inspirada no arcabouço HipSTR e adaptada a dados de sequenciamento de leitura longa. Produz arquivos VCF compactados com bgzip.",
    category: "Genotipagem",
    language: "C++",
    features: {
      1: "Genotipa repetições em tandem (STRs e VNTRs) a partir de BAM/CRAM de leituras longas com BED de regiões TR",
      2: "Opções de fluxo para dados PacBio HiFi e Oxford Nanopore",
      3: "Suporta entradas BAM fasadas (haplotipadas)",
      4: "Saída VCF com campos INFO/FORMAT para filtragem downstream",
    },
  },
  gangstr: {
    title: "GangSTR",
    description: "Genotipagem genome-wide de STRs a partir de dados alinhados de leitura curta com saída VCF.",
    category: "Perfilamento",
    language: "C++",
    features: {
      1: "Genotipagem STR em todo o genoma a partir de sequenciamento de leitura curta",
      2: "Detecção de expansões e contrações de repetições",
      3: "Modelagem estatística das distribuições de comprimento STR",
    },
  },
  tutorials: {
    title: "Tutoriais Interativos",
    comingSoon: "Em breve",
  },
  categories: {
    analysis: "Ferramentas de Análise",
    processing: "Processamento de Dados",
    visualization: "Visualização",
    statistics: "Estatísticas",
  },
  learnMore: "Saber Mais",
  documentation: "Documentação",
  github: "Ver no GitHub",
  igvHelp: {
    sectionTitle: "Guia para interpretação da visualização no IGV",
    howToRead: "Como ler esta visualização IGV",
    readAligned: "Cada linha horizontal é uma leitura de sequenciamento alinhada ao genoma de referência",
    stackedReads: "Leituras empilhadas indicam profundidade de cobertura",
    coloredBases: "Bases coloridas indicam diferenças em relação à referência",
    zoomIn: "Use o botão + para ampliar até que as bases individuais sejam visíveis",
    commonPatterns: "Padrões visuais comuns",
    insertion: "\"I\" dentro de uma leitura = inserção em relação à referência (não é um novo alelo)",
    deletion: "Uma lacuna fina / linha preta dentro de uma leitura = deleção em relação à referência",
    clickRead: "Clique em uma leitura ou variante para ver detalhes do alinhamento (CIGAR, qualidade de mapeamento, posição)",
    ceVsIgvTitle: "Dos picos de CE às leituras NGS",
    ceTitle: "Eletroforese Capilar (CE)",
    cePeaks: "Picos resumem o sinal por alelo",
    ceNoReads: "Leituras individuais não são visíveis",
    igvTitle: "IGV (visualização de leituras NGS)",
    igvSingleRead: "Cada linha é uma única leitura de sequenciamento",
    igvInferred: "Alelos são inferidos a partir de muitas leituras",
    igvIndels: "Inserções e deleções são mostradas explicitamente",
    keySentence: "CE resume o sinal por alelo. IGV visualiza dados NGS como leituras individuais. Essas visualizações são complementares, não intercambiáveis.",
  },
  igvViewer: {
    pageTitle: "Visualizador IGV",
    pageSubtitle: "Integração com o IGV para visualização e análise genômica em um clique.",
    strMarker: "Marcador STR",
    selectMarker: "Selecione um marcador",
    sample: "Amostra",
    selectSample: "Selecione uma amostra",
    launchIgv: "Iniciar Visualizador IGV",
    openUcsc: "Abrir no Navegador UCSC",
    viewerTitle: "Visualizador Interativo do Genoma",
    dataIntegration: "Integração de Dados",
    dataIntegrationPre: "Este visualizador integra a biblioteca de código aberto",
    dataIntegrationMid: "para visualização genômica interativa e dados de alinhamento de amostras do",
    dataIntegrationPost: "Os arquivos BAM/BAI de demonstração são recursos de dados abertos, utilizados aqui para fins educacionais e de pesquisa.",
    genomesLabel: "Projeto 1000 Genomas",
    openDataTag: "IGV · Projeto 1000 Genomas (dados abertos)",
    igvStatusLabel: "Status do IGV:",
    igvStatusReady: "Pronto",
    igvStatusIdle: "Inativo (clique em Iniciar Visualizador IGV)",
    igvErrorAlert: "O IGV não pôde ser carregado. Verifique o console do navegador para detalhes.",
  },
  commands: {
    title: "Comandos Essenciais de Bioinformática",
    card1: {
      title: "Comandos Essenciais para Processar Leituras",
      subtitle: "Para limpar, filtrar e preparar leituras FASTQ antes do genotipagem.",
      features: {
        1: "Remover adaptadores e bases de baixa qualidade",
        2: "Filtrar leituras muito curtas ou de baixa qualidade",
        3: "Preparar FASTQs limpos para o alinhamento",
      },
      info: {
        trimmomatic: "Limpa leituras paired-end removendo adaptadores e bases de baixa qualidade.\nMelhora a precisão do alinhamento.\nGera leituras limpas (pares + leituras individuais se uma for descartada).",
        fastp: "Ferramenta rápida que limpa leituras e detecta adaptadores automaticamente.\nGera leituras filtradas e relatório de qualidade.\nMuito usada em pipelines modernos.",
      },
      commands: {
        trimmomatic: "trimmomatic PE sample_R1.fastq sample_R2.fastq \\\n  output_R1_paired.fastq output_R1_unpaired.fastq \\\n  output_R2_paired.fastq output_R2_unpaired.fastq \\\n  ILLUMINACLIP:adapters.fa:2:30:10 SLIDINGWINDOW:4:20 MINLEN:50",
        fastp: "fastp -i sample_R1.fastq -I sample_R2.fastq \\\n      -o clean_R1.fastq -O clean_R2.fastq \\\n      --detect_adapter_for_pe --html report.html",
      },
    },
    card2: {
      title: "Processamento de Alinhamento e BAM",
      subtitle: "Para alinhar leituras e gerar BAM prontos para análise.",
      features: {
        1: "Alinhamento de alta qualidade",
        2: "Ordenação e indexação",
        3: "Operações de limpeza BAM",
      },
      info: {
        bwa: "Alinha leituras curtas de Illumina ao genoma de referência.\nGera um arquivo SAM com posições genômicas.\nFerramenta padrão para dados short-read.",
        samtools: "Converte SAM para BAM, ordena as leituras por posição e cria um índice.\nNecessário para IGV, cálculo de cobertura e análises posteriores.\nPermite acesso rápido a regiões específicas.",
        rmdup: "Marca ou remove duplicatas de PCR (principalmente útil em WGS/WES).\nEm STR por amplicon podem representar leituras reais.\nUtilizar com cautela.",
      },
      commands: {
        bwa: "bwa-mem2 mem reference.fasta sample_R1.fastq sample_R2.fastq > sample.sam",
        samtools: "samtools view -bS sample.sam | samtools sort -o sample.sorted.bam\nsamtools index sample.sorted.bam",
        rmdup: "samtools rmdup sample.sorted.bam sample.rmdup.bam",
      },
    },
    card3: {
      title: "Inspeção de Regiões STR e Cobertura",
      subtitle: "Para explorar cobertura, regiões flanqueadoras e sinais de qualidade em STR.",
      features: {
        1: "Visualizar regiões flanqueadoras",
        2: "Inspecionar soft-clips e desalinhamentos",
        3: "Avaliar profundidade de cobertura STR",
      },
      info: {
        depth: "Indica quantas leituras cobrem cada base em uma região.\nÚtil para avaliar cobertura e controle de qualidade em STR.\nModificar chr:start-end conforme o locus.",
        view: "Mostra todas as leituras alinhadas em uma região selecionada.\nÚtil para detectar erros ou problemas de alinhamento próximos a STR.\nAjuda na resolução de problemas.",
        tview: "Visualizador em terminal para arquivos BAM com referência.\nPermite inspeção rápida sem IGV.\nÚtil para verificações rápidas.",
      },
      commands: {
        depth: "samtools depth -r chr12:100000-100300 sample.bam > depth.txt",
        view: "samtools view sample.bam chr12:100000-100300",
        tview: "samtools tview sample.bam reference.fasta",
      },
    },
    nanopore: {
      title: "Nanopore (ONT) Essentials",
      subtitle: "Pipeline mínimo desde sinais brutos de ONT até leituras alinhadas.",
      features: {
        1: "Basecall POD5 → reads (BAM não alinhado)",
        2: "Alinhar, ordenar e indexar BAM (minimap2 + samtools)",
        3: "Métricas de QC com NanoPlot",
      },
      info: {
        dorado: "Converte o sinal bruto do ONT (POD5) em sequências de DNA.\nO resultado é um BAM não alinhado.",
        minimap2: "Alinha as leituras ao genoma humano de referência (hg38),\ndepois ordena e indexa o BAM.",
        nanoplot: "Gera métricas e gráficos de qualidade a partir do BAM\n(comprimento de leitura, qualidade, rendimento).",
      },
      commands: {
        dorado: "dorado basecaller dna_r10.4.1_e8.2_400bps_sup pod5/ > reads.bam",
        minimap2: "samtools fastq reads.bam | minimap2 -ax map-ont hg38.fa - | samtools sort -o aln.bam - && samtools index aln.bam",
        nanoplot: "NanoPlot --bam aln.bam --outdir nanoplot_out/",
      },
    },
    installation: {
      title: "Requisitos de Instalação",
      intro: "As ferramentas mostradas acima não vêm instaladas por padrão. Para executar estes comandos, você precisa instalar as ferramentas de bioinformática de acordo com seu sistema operacional.",
      linuxTitle: "Linux (Ubuntu/Debian)",
      macTitle: "macOS (Homebrew)",
      windowsTitle: "Windows (WSL2 recomendado)",
      windowsNote: "Ferramentas de bioinformática não funcionam de forma nativa no Windows. Use WSL2 (Ubuntu) ou um contêiner Linux para garantir total compatibilidade.",
      guideSoon: "Em breve adicionaremos um guia completo de instalação para cada sistema operacional.",
      nanoporeTitle: "Utilitários Nanopore (ferramentas POD5, NanoPlot, pycoQC)",
      nanoporeCmd: "pip install pod5 nanoplot pycoqc",
      nanoporeNote: "A instalação do Dorado depende da sua plataforma e da disponibilidade de GPU; obtenha binários pré-compilados nas releases da Oxford Nanopore.",
      nanoporePythonNote: "Ferramentas de leitura longa podem exigir Python ≥ 3.8 e espaço em disco suficiente para modelos de basecalling.",
    },
  },
  straitrazor: {
    title: "STRait Razor",
    description: "Chamada de alelos STR baseada em motivos a partir de FASTQ para painéis forenses direcionados, com versão CLI e online.",
    tags: {
      category: "Genotipagem",
      language: "R",
    },
    features: {
      1: "Detecção de alelos STR baseada em motivos a partir de leituras FASTQ",
      2: "Configurável para painéis de marcadores STR forenses",
      3: "Melhor adaptado a leituras curtas Illumina; aplicar escrutínio extra em plataformas propensas a erros de homopolímeros",
    },
    buttons: {
      github: "GitHub",
      paper: "Publicação original",
      online: "Versão Online",
    },
  },
  toastr: {
    title: "toaSTR",
    description:
      "Ferramenta forense de genotipagem STR baseada em navegador para dados MPS, com modelagem de stutter sensível à sequência, chamada automática de alelos e relatórios PDF conformes com ISFG.",
    tags: {
      category: "Genotipagem",
      language: "Docker",
    },
    features: {
      1: "Genotipagem STR forense no navegador a partir de dados MPS",
      2: "Modelagem de stutter sensível à sequência e chamada automática de alelos",
      3: "Relatório de cobertura por alelo e visualização interativa",
    },
    buttons: {
      github: "GitHub",
      paper: "Publicação original",
    },
  },
  strnaming: {
    title: "STRNaming",
    description: "Método imparcial para gerar automaticamente descrições curtas, informativas e legíveis de alelos STR.",
    tags: {
      annotation: "Anotação",
      forensic: "Forense",
      webtool: "Web",
    },
    features: {
      1: "Geração automatizada de nomes padronizados de alelos STR",
      2: "Descrição alélica baseada em sequência entre loci",
      3: "Nomenclatura legível para sequenciamento forense",
    },
    buttons: {
      website: "Website",
    },
  },
  fdstools: {
    title: "FDSTools",
    description: "Pacote Python para análise de dados NGS forenses: caracterização e filtragem de stutter de PCR e ruído de sequenciamento, e detecção automática de alelos. Integra STRNaming para nomenclatura.",
    tags: {
      category: "Análise",
      language: "Python",
    },
    features: {
      1: "Caracterização e correção de stutter e ruído de PCR/sequenciamento",
      2: "Detecção automática de alelos a partir de FASTQ em dados MPS direcionados",
      3: "Melhor adaptado a leituras curtas Illumina; aplicar escrutínio extra em plataformas propensas a erros de homopolímeros",
    },
    buttons: {
      website: "Website",
    },
  },
  strider: {
    title: "STRidER",
    description: "Banco de dados populacional online de frequências alélicas STR, cuidadosamente curado, que oferece estimativas de probabilidade de genótipos e controle de qualidade de STR autossômicos.",
    tags: {
      population: "Dados populacionais",
      qc: "Controle de qualidade",
      webtool: "Web",
    },
    features: {
      1: "Banco de dados curado de frequências alélicas STR autossômicas",
      2: "Controle de qualidade centralizado para conjuntos de dados populacionais",
      3: "Estimativa confiável de probabilidade de genótipos para análise forense",
    },
    buttons: {
      website: "Website",
    },
  },
  strspy: {
    title: "STRspy",
    description: "Ferramenta de genotipagem de STRs baseada em ONT com saída tabular.",
    tags: {
      category: "Análise",
      language: "Python",
    },
    features: {
      1: "Chamada de alelos STR a partir de sequenciamento de leitura longa Nanopore",
      2: "Resolução alélica em nível de sequência usando bancos de referência",
      3: "Projetado para perfilamento STR forense",
    },
    buttons: {
      github: "GitHub",
      paper: "Publicação original",
    },
  },
},
fastaGeneratorPage: {
  languageLabel: "Idioma atual",
  title: "Gerador FASTA",
  subtitle:
    "Gere sequências FASTA personalizadas para pesquisa e análise.",
  config: {
    title: "Parâmetros de configuração da sequência",
    markerLabel: "Marcador STR",
    markerPlaceholder: "Selecione um marcador",
    allelesLabel: "Alelos (lista ou intervalo)",
    allelesPlaceholder: "ex.: 10-12 ou 9,10,11",
    flankingLabel: "Região flanqueadora (pb por lado)",
    outputLabel: "Tipo de saída",
    generateButton: "Gerar sequência",
  },
  output: {
    title: "Sequência gerada",
    description: "A sequência FASTA gerada aparecerá aqui",
    emptyState:
      'Selecione um marcador e clique em "Gerar sequência" para começar',
    copyButton: "Copiar",
    downloadButton: "Baixar FASTA",
  },
  messages: {
    enterAlleles: "Informe os alelos (ex.: 10-12 ou 9,10,11)",
    markerNotFound: "Marcador não encontrado na lista.",
    errorPrefix: "ERRO",
  },
  about: {
    title: "Sobre a Geração de FASTA",
    intro:
      "Este módulo produz sequências FASTA de alta qualidade para marcadores de Repetição Curta em Tandem (STR), utilizando regiões de referência curadas derivadas do GRCh38.",
    detail:
      "Cada sequência gerada representa a estrutura genômica esperada do locus STR, com regiões flanqueadoras personalizáveis a montante e a jusante.",
    overview: {
      title: "Visão geral",
      paragraphs: [
        "O Gerador FASTA do STRhub permite que pesquisadores explorem a variabilidade alélica simulando padrões de repetição STR com contexto genômico preciso.",
        "Os usuários podem definir faixas de alelos, ajustar comprimentos flanqueadores e exportar as sequências resultantes em vários formatos padronizados.",
      ],
    },
    features: {
      title: "Recursos",
      items: [
        "Suporte completo para marcadores STR do núcleo CODIS e estendidos",
        "Fatias baseadas em referência alinhadas ao GRCh38",
        "Regiões flanqueadoras personalizáveis (0–200 pb por lado)",
        "Múltiplos formatos de exportação: FASTA Padrão, FASTA estilo Referência, Multi-FASTA e CSV Tabular",
        "Opções de download e cópia diretas",
      ],
    },
    useCases: {
      title: "Casos de uso",
      items: [
        "Pesquisa em genética forense e populacional",
        "Reconstrução alélica e análise in silico",
        "Desenho de primers e validação de ensaios",
        "Fins educacionais e de treinamento em genômica forense",
      ],
    },
  },
},
motifExplorerPage: {
  title: "Explorador de Motivos STR",
  subtitle: "Visualize motivos repetitivos STR canônicos e interrupções para marcadores selecionados.",
  header: {
    backLink: "← Voltar ao STRhub",
  },
  fields: {
    marker: {
      label: "Marcador STR",
    },
    viewMode: {
      sequence: "Destaque de sequência",
      schematic: "Esquema de motivo",
      text: "Descrição do motivo",
    },
  },
  cards: {
    configuration: {
      title: "Configuração",
      kitLabel: "Kit / sequência de referência",
      markerPlaceholder: "Selecione um marcador",
      kitPlaceholder: "Selecione um kit",
      emptyState: "Selecione um marcador no painel de configuração.",
    },
    visualization: {
      title: "Explorando a estrutura de {marker}",
    },
  },
  states: {
    noSequence: "O modo de destaque de sequência não está disponível para este marcador.",
  },
  help: {
    general:
      "Exibe a sequência completa do alelo STR com flancos, unidades repetitivas e variantes internas destacadas.",
  },
  scientificNote:
    "Nota científica: Apenas o bloco contínuo de repetições canônicas contribui para a designação do alelo. Cópias semelhantes ao motivo nos flancos ou interrupções são indicativos visuais e não alteram o tamanho do alelo.",
  sourceLabel: "Fonte",
  sourceButtonLabel: "Abrir publicação original",
  labels: {
    canonicalPattern: "Padrão repetitivo canônico:",
  },
  legend: {
    repeat: "Unidade repetitiva",
    interruption: "Interrupção / variante interna",
    other: "Outro / elemento esquemático",
    flank: "Região flanqueadora",
    flankingMotifLike:
      "Unidade do motivo na região flanqueadora, excluída da nomenclatura do alelo.",
  },
  summary: {
    caption:
      "Resumo da estrutura repetitiva: unidades repetitivas são mostradas como MOTIF[n]; 'flank' marca regiões não repetitivas.",
  },
  explanation: {
    generic: "",
  },
  sequenceInterpretationTitle: "Como interpretar a sequência acima?",
  sequenceExample: {
    tooltip: {
      repeat: "Motivo repetitivo (ocorrência do motivo canônico; ver nota abaixo)",
      flank: "Região flanqueadora — não conta para o alelo",
      interruption: "Interrupção / variante interna dentro da região repetitiva",
    },
    note: "Observação: nem toda ocorrência do motivo repetitivo é contabilizada para o tamanho do alelo. Apenas o bloco repetitivo central definido pela estrutura do motivo contribui para a designação do alelo.",
  },
  sequenceSection: {
    representativeTitle:
      "Estrutura interna representativa do alelo {allele} ({kit})",
    note:
      "Observação: Apenas o bloco contínuo de repetições canônicas contribui para a designação do alelo. Cópias semelhantes ao motivo fora desse bloco não são contabilizadas no tamanho do alelo.",
    structureLabel: "Estrutura",
    flankLabel: "flanco",
    legendTitle: "Legenda:",
  },
  tooltipsShort: {
    repeat: "Repetição canônica que conta para o tamanho do alelo.",
    internal: "Variação interna no bloco repetitivo; não adiciona repetições.",
    flanking: "Região flanqueadora",
    flankingMotifLike:
      "Unidade do motivo na região flanqueadora, excluída da nomenclatura do alelo.",
  },
  tooltipsLong: {
    repeat:
      "Estas repetições canônicas compõem o tamanho do alelo. Cada repetição contínua contribui integralmente para a designação do alelo.",
    internal:
      "Interrupções ou inserções dentro do bloco repetitivo são úteis para nomenclatura por sequência, mas não aumentam a contagem de repetições.",
    flanking:
      "As regiões flanqueadoras delimitam o lócus STR. Elas ajudam no desenho do ensaio, porém não são contabilizadas no tamanho do alelo.",
    flankingMotifLike:
      "Unidade do motivo na região flanqueadora, excluída da nomenclatura do alelo.",
  },
},
} as const

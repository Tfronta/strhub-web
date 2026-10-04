export default {
tools: {
  title: "Ferramentas e Pipelines",
  subtitle: "Ferramentas de Análise e Processamento",
  description:
    "Suite abrangente de ferramentas de bioinformática e pipelines para análise de STRs, desde processamento de dados brutos até genética populacional.",
  builtIn: {
    title: "Ferramentas interativas do STRhub",
    description: "Integradas ao STRhub: rodam no navegador, sem instalação.",
  },
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
    show: "Ver guia",
    hide: "Ocultar guia",
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
    launchIgv: "Carregar leituras no IGV",
    launchIgvAria: "Carregar leituras no IGV: {sample} em {marker}, no visualizador desta página",
    openUcsc: "Abrir no UCSC Genome Browser",
    openUcscAria: "Abrir no UCSC Genome Browser: região GRCh38 de {marker} (abre em uma nova aba)",
    viewerTitle: "Visualizador Interativo do Genoma",
    dataIntegration: "Integração de Dados",
    dataIntegrationPre: "Este visualizador integra a biblioteca de código aberto",
    dataIntegrationMid: "para visualização genômica interativa e dados de alinhamento de amostras do",
    dataIntegrationPost: "Os arquivos BAM/BAI de demonstração são recursos de dados abertos, utilizados aqui para fins educacionais e de pesquisa.",
    genomesLabel: "Projeto 1000 Genomas",
    igvStatusLabel: "Status do IGV:",
    igvStatusReady: "Pronto",
    igvStatusIdle: "Não iniciado",
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
      "Ferramenta forense de genotipagem STR baseada em navegador para dados MPS, com modelagem de stutter sensível à sequência, chamada automática de alelos e relatórios em PDF.",
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
    description: "Ferramenta de genotipagem de STRs de leitura longa (ONT e PacBio) com saída tabular.",
    tags: {
      category: "Análise",
      language: "Python",
    },
    features: {
      1: "Chamada de alelos STR a partir de sequenciamento de leitura longa (ONT e PacBio)",
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
    "Construtos simplificados de sequências STR baseados em motivos, com flancos de referência GRCh38. **Para fins educacionais.**",
  config: {
    title: "Parâmetros de configuração da sequência",
    markerLabel: "Marcador STR",
    markerPlaceholder: "Selecione um marcador",
    allelesLabel: "Número de repetições (lista ou intervalo)",
    allelesPlaceholder: "ex.: 10-12 ou 9,10,11",
    allelesHint:
      "Números inteiros de 1 a {max} (um limite técnico de entrada desta ferramenta): cada valor é a quantidade de cópias do motivo de construção, indicado no cabeçalho da saída. Microvariantes (por exemplo 9.3) ainda não são suportadas. Em loci complexos, o número de repetições não equivale necessariamente a uma designação alélica forense de CE.",
    flankingLabel: "Região flanqueadora (pb por lado)",
    outputLabel: "Tipo de saída",
    referenceLabel: "Genoma de referência",
    referenceHint: "A sequência flanqueadora é cortada da fita positiva deste assembly.",
    comingSoon: "em breve",
    generateButton: "Gerar sequência",
  },
  output: {
    title: "Sequência gerada",
    description: "A sequência FASTA gerada aparecerá aqui",
    emptyState:
      'Selecione um marcador e clique em "Gerar sequência" para começar',
    copyButton: "Copiar",
    downloadButton: "Baixar FASTA",
    downloadCsvButton: "Baixar CSV",
    referenceLine: "Flancos de {build}, fita positiva, janela de referência {region}, verificada contra o UCSC {ucsc}. O bloco de repetições é um construto simplificado, não a sequência de referência.",
  },
  messages: {
    enterAlleles: "Informe um ou mais números de repetições inteiros (ex.: 10-12 ou 9,10,11).",
    microvariantsUnsupported:
      "Microvariantes e valores decimais (por exemplo 9.3) ainda não são suportados. Informe números de repetições inteiros.",
    invalidRepeatCounts:
      "Informe números de repetições inteiros entre 1 e {max}, como lista ou intervalo (ex.: 10-12 ou 9,10,11). O máximo é um limite técnico de entrada desta ferramenta.",
    markerNotFound: "Marcador não encontrado na lista.",
    coreNotFound:
      "Não foi encontrada uma série do motivo {motif} no fragmento de referência de {marker}, portanto não é possível gerar um construto para este locus.",
    sliceUnavailable: "Não foi possível carregar o fragmento de referência de {marker} (HTTP {status}). Tente novamente mais tarde.",
    sliceInvalid: "O fragmento de referência de {marker} não é um arquivo FASTA válido.",
    genomeUnavailable: "A referência {genome} ainda não está disponível.",
    configMissing: "Os fragmentos de referência não estão configurados neste servidor.",
    unexpected: "Não foi possível gerar a sequência.",
    errorPrefix: "ERRO",
  },
  about: {
    title: "Sobre a Geração de FASTA",
    intro:
      "Gera construtos simplificados de sequências STR baseados em motivos, com flancos de referência e um número de repetições definido pelo usuário. Estruturas repetitivas compostas, interrupções e microvariantes não são modeladas. Os resultados não devem ser interpretados como sequências alélicas forenses validadas.",
    detail:
      "Cada construto une o flanco 5' do GRCh38, a quantidade pedida de cópias do motivo de construção (indicado em cada cabeçalho) e o flanco 3' do GRCh38. Em loci complexos, o número de repetições não equivale necessariamente a uma designação alélica forense de CE, e microvariantes ainda não são suportadas.",
    overview: {
      title: "Visão geral",
      paragraphs: [
        "Escolha um locus, informe números de repetições inteiros como lista ou intervalo, ajuste o comprimento dos flancos e exporte os construtos em um de vários formatos padrão.",
        "O conjunto atual contém 19 dos 20 loci do núcleo CODIS (D22S1045 não está incluído).",
      ],
    },
    features: {
      title: "Recursos",
      items: [
        "19 dos 20 loci do núcleo CODIS (D22S1045 não está incluído)",
        "Flancos cortados de fragmentos de referência GRCh38 (fita positiva)",
        "Regiões flanqueadoras personalizáveis (0–200 pb por lado)",
        "Formatos de exportação: FASTA Padrão, FASTA estilo Referência, Multi-FASTA e CSV Tabular",
        "Opções de download e cópia diretas",
      ],
    },
    useCases: {
      title: "Casos de uso",
      items: [
        "Fins educacionais e de treinamento em genômica forense",
        "Entradas simples in silico, por exemplo para ver como um software lida com uma mudança no número de repetições",
      ],
    },
  },
},
motifExplorerPage: {
  title: "Explorador de Motivos STR",
  subtitle:
    "Esta seção ajuda a entender a estrutura interna de cada marcador STR ao longo da sequência do genoma de referência GRCh38, sobre o ISFG minimum range. Mostra que nem todo locus é uma sequência contínua do seu motivo canônico, e destaca a complexidade dos loci compostos e interrompidos.",
  visualizationTitle: "Estrutura de {marker}",
  configuration: {
    title: "Configuração",
    markerLabel: "Marcador STR",
    rangeLabel: "Destacar intervalo",
    allRanges: "Todos os intervalos",
    emptyState: "Selecione um marcador no painel de configuração.",
  },
  help: {
    general:
      "Escolha um marcador para ver sua sequência de referência sobre o ISFG minimum range e seu motivo canônico de repetição.",
  },
  scientificNote:
    "Nota sobre nomenclatura: os nomes gerados com o STRNaming seguem as recomendações ISFG 2024 (Gettings et al. 2024) e descrevem o ISFG minimum range. Em alguns loci o bracketing histórico 2016-2023 do FSSG lê as repetições a partir de outra base inicial, por isso ambos podem parecer diferentes para o mesmo alelo.",
  sourceLabel: "Fonte",
  sourceValue: "{version} ({publisher}; distribuído como {file})",
  sourceButtonLabel: "Abrir STRidER",
  marker: {
    ce: "Equivalente CE",
    minimumRange: "ISFG minimum range",
  },
  canonical: {
    title: "STRNaming Formatted ISFG Minimum Range for Common Alleles (2024 onward)",
    altForms: "Outras formas válidas",
    templateNote:
      "Modelo do STRidER para os alelos comuns deste locus, tal como aparece no FSSG. [n] indica um bloco cujo número de repetições varia entre alelos. Não é um nome de alelo: um nome STRNaming completo começa com o alelo CE (por exemplo CE13_) e indica o número de cada bloco, como no alelo de referência abaixo.",
    referenceNameLabel:
      "Alelo de referência (GRCh38) nomeado com o STRNaming 1.2.1",
    referenceNameSource:
      "Nome STRNaming 1.2.1 da sequência de referência GRCh38 sobre o ISFG minimum range; seu CE coincide com o CE equivalente do FSSG.",
    referenceFitsForm:
      "Sua estrutura segue a forma {n} das {total} listadas acima.",
    referenceFitsOnlyForm:
      "Sua estrutura segue o modelo acima.",
    variant: "Variante de sequência",
  },
  historical: {
    title: "GRCh38 Historical bracketing (2016-2023)",
    none: "Não disponível",
  },
  sequence: {
    title: "Sequência de referência (ISFG minimum range, fita direta do GRCh38)",
    note: "As cores mostram a estrutura da sequência de referência tal como o STRidER a segmenta no FSSG: os blocos verdes são unidades canônicas de repetição, os âmbar são interrupções ou variantes internas e as bases cinzas são sequência flanqueadora dentro da janela reportada. A coloração descreve a estrutura; não é uma fórmula para o número CE, que segue a convenção de comprimento de cada locus.",
    legendRepeat: "Unidade de repetição",
    legendMinorRepeat: "Repetição secundária (minúscula)",
    legendInterruption: "Interrupção / variante interna",
    legendFlank: "Região flanqueadora",
    flankMotifLabel: "Mesma sequência que um motivo repetido, mas na região flanqueadora: não é contada no nome do alelo.",
    repeatTooltip: "Unidade de repetição canônica da estrutura de referência.",
    minorRepeatTooltip: "Bloco de repetição secundário / variante: repete, mas não é o motivo principal que nomeia o alelo.",
    interruptionTooltip: "Interrupção / variante interna; não é contada como unidade de repetição.",
    flankTooltip: "Sequência flanqueadora dentro da janela reportada; suas variantes são nomeadas por posição.",
    viewStrnaming:
      "STRNaming (2024 em diante)",
    viewHistorical:
      "Bracketing histórico (2016-2023)",
    legendVariableBlock:
      "Bloco [n]: o número de repetições varia entre alelos",
    legendFixedBlock:
      "Bloco com número fixo no modelo",
    legendStrnamingFlank:
      "Região flanqueadora dentro do ISFG minimum range (ex. -1, +1)",
    variableBlockTooltip:
      "Seu número varia entre alelos comuns ([n] no modelo do STRidER).",
    fixedBlockTooltip:
      "Seu número é fixo no modelo do STRidER para alelos comuns.",
    flank5Tooltip:
      "Flanco antes da região repetitiva: posições -{n} a -1. As variantes aqui são nomeadas por estas posições (ex. _-1T>-).",
    flank3Tooltip:
      "Flanco depois da região repetitiva: posições +1 a +{n}. As variantes aqui são nomeadas por estas posições (ex. _+1T>C).",
    strnamingNote:
      "Os blocos e seus números são os do nome STRNaming 1.2.1 do alelo de referência indicado acima; o resto do ISFG minimum range é flanco.",
    gridAgrees:
      "Esta região repetitiva é exatamente a que o STRidER marca na linha do FSSG \"STRNaming Bracketing of ISFG Minimum Range\".",
    gridDiffers:
      "A linha do FSSG \"STRNaming Bracketing of ISFG Minimum Range\" do STRidER marca as posições {grid} do minimum range como região repetitiva, enquanto o nome STRNaming cobre as posições {name}.",
    noFlank5:
      "Em {marker} o ISFG minimum range começa na primeira base da região repetitiva; não há flanco 5' dentro do intervalo.",
    noFlank3:
      "Em {marker} o ISFG minimum range termina na última base da região repetitiva; não há flanco 3' dentro do intervalo.",
    updateNote:
      "Esta seção é mantida em dia com as novas versões do FSSG e do STRNaming.",
    phaseNote:
      "A estrutura da sequência (repeat, interrupção, flanco) segue o Forensic Sequence Structure Guide do STRidER (FSSG v6.1); o nome ISFG / STRNaming acima é uma vista complementar, não uma reimplementação das regras de nomenclatura.",
    notAligned:
      "Este locus tem uma estrutura complexa que não encaixa de forma limpa; a sequência é mostrada sem coloração por unidade. O bracketing canônico acima continua sendo a referência.",
  },
  kits: {
    title: "Intervalos de kits vs o minimum range",
    minimumRangeLabel: "ISFG minimum range",
    note: "Muitos kits MPS sequenciam uma janela mais ampla que o ISFG minimum range, mas nem todos o cobrem por completo, então compare cada intervalo de kit com o minimum range. A saída bruta pode parecer maior ou menor, enquanto os nomes sobre o minimum range permanecem comparáveis.",
    clipped: "Estende-se além da janela de referência armazenada.",
    empty: "Não há informação de intervalos de kits para este marcador.",
    bp: "pb",
  },
},
} as const

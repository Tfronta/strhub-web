export default {
marker: {
  backToCatalog: "Voltar ao Catálogo",
  backToGenomeExplorer: "Voltar ao Explorador do Genoma",
  tabs: {
    overview: "Visão Geral",
    isoalleles: "Isoalelos",
    frequencies: "Frequências",
    statistics: "Estatísticas",
    tools: "Ferramentas",
    igv: "Visualizador IGV",
    fasta: "Gerador FASTA",
  },
  sections: {
    overview: {
      description: "Informações básicas, coordenadas genômicas e dados de referência",
      tags: ["visão geral", "informações básicas", "coordenadas", "referência"],
    },
    frequencies: {
      description: "Distribuição de frequências alélicas e painéis populacionais",
      tags: ["frequências", "frequências alélicas", "dados populacionais", "estatísticas"],
    },
    variants: {
      description: "Alelos variantes, isoalelos e padrões de sequência",
      tags: ["variantes", "isoalelos", "sequências", "padrões alélicos"],
    },
    tools: {
      description: "Ferramentas e pipelines compatíveis para análise",
      tags: ["ferramentas", "pipelines", "análise", "compatibilidade"],
    },
  },
  basicInfo: "Informações Básicas",
  genomicCoords: "Coordenadas Genômicas",
  nistReference: "Referência NIST STRBase",
  nistDescription: "Informações de referência oficial do banco de dados NIST STRBase",
  chromosome: "Cromossomo",
  position: "Posição",
  cytogeneticLocation: "Localização citogenética",
  motif: "Motivo",
  type: "Tipo",
  alleleRange: "Faixa de Alelos",
  category: "Categoria",
  build: "Build",
  strand: "Fita",
  start: "Início",
  end: "Fim",
  referenceAllele: "Alelo de Referência",
  lastUpdated: "Última Atualização",
  commonAlleles: "Alelos Comuns",
  viewInBrowser: "Ver no Navegador Genômico UCSC",
  isoallelePatterns: "Padrões de Isoalelos",
  isoalleleDescription: "Padrões de sequência detalhados e variações para diferentes alelos",
  referenceSequences: "Sequências de referência verificadas contra NIST STRBase",
  reference: "Referência",
  nistVerified: "Verificado NIST",
  alleleFreqDistribution: "Distribuição de Frequência de Alelos",
  freqDescription: "Dados de frequência populacional para diferentes alelos",
  dataSource: "Fonte de dados: STRBase – NIST",
  ocePopulationInfo:
    "O conjunto de dados populacional da Oceania do pop.STR inclui os seguintes grupos populacionais: Bougainville (Melanésio NAN) e Nova Guiné (Papua).",
  additionalSourceInfo:
    "As frequências alélicas no STRhub são derivadas do conjunto de dados STRs Local do portal SP-SMART (CESGA), que inclui 3.809 indivíduos genotipados de diferentes populações.",
  datasetButton: "Conjunto de dados",
  originalPublicationButton: "Publicação original",
  populationGroup: "Grupo Populacional",
  populationLabels: {
    AFR: "África",
    NAM: "Nativo Americano",
    EAS: "Ásia Oriental",
    CSA: "Ásia Central e do Sul",
    EUR: "Europa",
    MES: "Oriente Médio",
    OCE: "Oceania",
    LAT: "América Latina",
    SAS: "Sul da Ásia",
  },
  frequencies: {
    region: {
      latam: "LAT",
    },
    datasetNotes: {
      provenance:
        "Essas frequências são derivadas do conjunto de dados STRs Local do portal SP-SMART (CESGA), que inclui 3.809 indivíduos genotipados de populações diversas.",
      populationLabel: "Grupos populacionais incluídos",
      populationAfr:
        "Central African Republic (Biaka Pygmies), Democratic Republic of the Congo (Mbuti Pygmies), Kenya (Bantu N.E.), Namibia (San), Nigeria (Yoruba), Senegal (Mandenka), Somalia, and South Africa (Bantu).",
      populationNam:
        "Brazil (Karitiana), Brazil (Surui), Colombia (Colombian), Dominican Republic, Mexico (Maya), and Mexico (Pima).",
      populationEas:
        "Cambodia (Cambodian), China (Dai), China (Daur), China (Han), China (Hezhen), China (Lahu), China (Miaozu), China (Mongola), China (Naxi), China (Oroqen), China (She), China (Tu), China (Tujia), China (Xibo), China (Yizu), Japan (Japanese), and Siberia (Yakut).",
      populationCsa:
        "Populações agregadas como Ásia Central e do Sul no conjunto de dados STRs Local (pop.STR / SP-SMART, CESGA).",
      populationSas:
        "China (Uygur), Pakistan (Balochi), Pakistan (Brahui), Pakistan (Burusho), Pakistan (Hazara), Pakistan (Kalash), Pakistan (Makrani), Pakistan (Pathan), and Pakistan (Sindhi).",
      populationEur:
        "France (Basque), France (French), Italy (Bergamo – North Italian), Italy (Sardinian), Italy (Tuscan), N.W. Spain, Orkney Islands (Orcadian), Russia (Russian), Russia Caucasus (Adygei), Sweden, and U.S. Europeans.",
      populationMes:
        "Algeria (Mzab – Mozabite), Israel (Carmel – Druze), Israel (Central – Palestinian), and Israel (Negev – Bedouin).",
      populationOce:
        "Bougainville (NAN Melanesian) and New Guinea (Papuan).",
      populationLatam: "",
      title: "⚠️ Notas sobre o conjunto de dados (importante)",
      shortLine1:
        "As frequências alélicas mostradas aqui vêm diretamente do conjunto de dados STRs Local do SP-SMART / pop.STR.",
      shortLine2:
        "O STRhub não modifica, infere, reconstrói nem reinterpreta qualquer componente do conjunto de dados STRs Local. Todas as limitações metodológicas originam-se exclusivamente da estrutura, da disponibilidade de metadados e das decisões de design da plataforma SP-SMART / pop.STR.",
      accordionTrigger: "Ler nota metodológica completa",
      full1:
        "Todas as frequências alélicas apresentadas nesta seção derivam diretamente do conjunto de dados STRs Local da plataforma SP-SMART / pop.STR (CESGA). As características e limitações metodológicas descritas aqui são inerentes ao conjunto de dados e à plataforma originais e não se originam do processamento ou da implementação do STRhub.",
      full2:
        "No pop.STR, a seleção de um “kit” atua apenas como um filtro de locos e não reflete a tecnologia de genotipagem utilizada nos estudos que contribuíram com os dados. O conjunto de dados STRs Local compila dados populacionais gerados principalmente por eletroforese capilar (CE), e não por NGS, e o SP-SMART não fornece metadados específicos de tecnologia em nível de loco. Portanto, o STRhub reproduz o conjunto de dados exatamente como ele é disponibilizado, sem reconstrução, sem harmonização além da nomenclatura e sem imputação.",
      full3:
        "Embora o STRs Local ofereça frequências alélicas harmonizadas para múltiplas populações, ele não constitui um painel de referência global unificado. O pop.STR disponibiliza as populações individualmente, o que é adequado para comparações forenses, mas não para análises agrupadas como PCA, STRUCTURE ou ADMIXTURE. Essas limitações refletem o design e o escopo da plataforma SP-SMART / pop.STR, e não uma restrição do STRhub.",
      referenceLabel: "Referência",
      referenceText:
        "Amigo J, Phillips C, Lareu MV, Carracedo A. The SNPforID and SP-SMART databases: Resources for forensic population genetics. Forensic Sci Int Genet. 2008;2(3):212–217. Dataset: http://spsmart.cesga.es/",
    },
    ngsDatasetDescription_raoValleSilva2022:
      "Estas frequências alélicas vêm de um estudo de sequenciamento de nova geração realizado em uma amostra populacional de Ribeirão Preto, São Paulo, Brasil (Valle-Silva et al., 2022). O conjunto de dados corresponde aos genótipos consenso obtidos entre HipSTR, STRait Razor e toaSTR. No STRhub, o rótulo RAO refere-se especificamente a este conjunto de dados NGS de Ribeirão Preto. Referência: Valle-Silva G, Frontanilla TS, Ayala J, Donadi EA, Simões AL, Castelli EC, Mendes-Junior CT. Forensic Sci Int Genet. 2022;58:102676. doi:10.1016/j.fsigen.2022.102676.",
    ngs1000G: {
      intro:
        "Essas frequências alélicas são derivadas de um estudo de sequenciamento de nova geração (NGS) publicado em 2022, baseado em 2.504 indivíduos pertencentes a 26 populações analisadas pelo Consórcio do Projeto 1000 Genomas.",
      populationGroupsLabel: "Populações incluídas",
      datasetNotesTitle: "⚠️ Notas do conjunto de dados (importante)",
      datasetNotesParagraph1:
        "Neste estudo, os alelos de STR foram genotipados a partir de dados de sequenciamento do genoma completo com alta cobertura usando o software HipSTR. Todos os dados estão publicamente disponíveis como parte do conjunto de dados publicado.",
      datasetNotesParagraph2:
        "O STRhub não modifica, infere, reconstrói ou reinterpreta qualquer componente do conjunto de dados original de STR. Todas as limitações metodológicas decorrem exclusivamente do desenho do estudo original, da disponibilidade de metadados e do framework do qual esses dados foram derivados.",
      originalDatasetButton: "Dataset original",
      originalPublicationButton: "Publicação original",
    },
    openOriginalPaperButton: "Abrir artigo original",
    compareButton: "Comparar",
    compareTooltip:
      "Compara as populações AFR, NAM, EAS, CSA, EUR, MES e OCE do dataset SP-SMART/CESGA",
    ngs1000gTooltip:
      "Compara AFR, NAM, EAS, SAS e EUR do Projeto 1000 Genomas Fase 3",
    legendClickHint: "Clique em uma população na legenda para mostrar/ocultar",
    raoPopulationButtonTooltip:
      "Painel STR por NGS de uma amostra brasileira (Ribeirão Preto; Valle-Silva et al., 2022).",
    latam: {
      selectorHint: "Selecione uma população LAT para este marcador.",
      noDataForLocus: "Não há dados LAT disponíveis para este marcador.",
      sampleSize: "n = {n}",
      markerCount: "{count} marcadores STR",
    },
  },
  citation:
    "Citação: Dados de frequência populacional obtidos do banco de dados STRBase – NIST. Todos os alelos relatados no STRbase para cada marcador estão incluídos em todos os grupos populacionais (AFR, NAM, EAS, CSA, EUR).",
  citationReference: "Referência: NIST STRBase. Disponível em: https://strbase.nist.gov/",
  statistics: {
    title: "Estatísticas Populacionais",
    description: "Estatísticas resumidas para cada população CE (Illumina ForenSeq, pop.STR / SP-SMART).",
    population: "População",
    noData: "Nenhuma estatística populacional disponível para este marcador.",
    sourceIntro: "Fonte: SP-SMART / pop.STR (CESGA)",
    legendN: "N = tamanho amostral",
    legendHobs: "Hobs = heterozigosidade observada",
    legendHexp: "Hexp = heterozigosidade esperada",
    legendFis: "Fis = coeficiente de endogamia",
    legendFst: "Fst = índice de fixação",
  },
  toolsCompatibility: "Compatibilidade de Ferramentas e Pipelines",
  toolsDescription: "Ferramentas de análise STR e pipelines que suportam este marcador",
  supported: "Suportado",
  configurableRequiresTargets: "Configurável (requer alvos)",
  viewAllToolsPipelines: "Ver todas as ferramentas e pipelines",
  viewFullToolProfile: "Ver perfil completo da ferramenta",
  notSupported: "Não Suportado",
  originalPublication: "Publicação Original",
  githubRepository: "Repositório GitHub",
  technology: "Tecnologia",
  descriptionPattern: "{marker} é um lócus STR no cromossomo {chromosome}.",
  inputFormat: "Formato de Entrada",
  outputFormat: "Formato de Saída",
  nativePanels: "Arquivo bed original",
  panel: "Painel",
  configurable: "Configurável",
  wrapper: "Wrapper",
  onlineVersion: "Versão Online",
  lastChecked: "Última Verificação",
  noCompatibleTools: "Nenhuma ferramenta compatível encontrada para este marcador",
  configuration: "Configuração",
  targetFileFormat: "Formato de Arquivo de Destino",
  customizableTargets: "Destinos Personalizáveis",
  customizableTargetsLabel: "Destinos personalizáveis",
  flankingBpRecommended: "BP Flanqueante Recomendado",
  compatibility: "Compatibilidade",
  status: "Status",
  maintained: "Mantido",
  archived: "Arquivado",
  maintenance: "Manutenção",
  "maintenance.active": "Ativo",
  "maintenance.community-maintained": "Mantido pela Comunidade",
  "maintenance.limited": "Limitado",
  "maintenance.unmaintained": "Não Mantido",
  maintainer: "Mantenedor",
  license: "Licença",
  lastRelease: "Última Versão",
  ontModels: "Modelos ONT",
  dockerImage: "Imagem Docker",
  interfaces: "Interfaces",
  interfaceAvailable: "Interface disponível:",
  limitations: "Limitações",
  maintainerInitiatives: "Iniciativas do Mantenedor",
  repository: "Repositório",
  documentation: "Documentação",
  notes: "Notas",
  addNewTool: "Adicionar Nova Ferramenta",
  contactUs: "entrar em contato conosco",
  toolsDisclaimer: "Todas as ferramentas de software listadas nesta seção são recursos de acesso aberto e de terceiros. O STRhub não mantém relacionamento comercial com os desenvolvedores dessas ferramentas e não recebe compensação financeira por sua inclusão. O catálogo é fornecido exclusivamente para fins educacionais e de pesquisa.",
  toolsDisclaimerShort: "Ferramentas de terceiros em acesso aberto. Sem relação comercial.",
  toolsNote:
    "A compatibilidade da ferramenta se basa nas características do marcador e validação da comunidade. Se proporcionam repositorios GitHub e referências de publicação para cada ferramenta suportada. Sempre verifique a compatibilidade com seus requisitos específicos de análise e consulte as versões mais recentes.",
  igvViewer: "Visualizador Genômico IGV",
  igvDescription: "Visualização genômica interativa usando IGV.js",
  igvIntegration: "Integração do Visualizador IGV",
  igvText: "O navegador genômico interactivo se cargará aquí mostrando o locus {marker}",
  launchIGV: "Iniciar Visualizador IGV",
  fastaGenerator: "Gerador de Sequência FASTA",
  fastaDescription: "Gere sequências FASTA para o marcador {marker}",
  flankingRegion: "Região Flanqueante (pb)",
  generateFasta: "Gerar Sequência FASTA",
  generatedSequence: "Sequência Gerada",
  downloadFasta: "Baixar FASTA",
  variantAlleles: "Alelos Variantes",
  variantAllelesDescription: "Todos os alelos variantes relatados no STRbase para este marcador",
  noVariantsForMarker: "Ainda não há variantes alélicas reportadas na STRbase para este marcador.",
  addNewVariant: "Adicionar uma nova variante",
  alleleDesignation: "Designação do Alelo",
  strNaming: "STRnaming",
  repeatStructure: "Estrutura de Repetição",
  sequence: "Sequência",
  noFrequenciesMessage:
    "Nenhum dado disponível. As frequências populacionais para este locus estão sendo curadas.",
  contributeDataCta: "Contribuir com dados",
  download: "Baixar",
  downloadCSV: "Baixar CSV",
  source: "Fonte",
  viewInStrbase: "Ver no STRBase",
  descriptionTemplate: "{marker} é um locus STR no cromossomo {chromosome}.",
  tools: {
    hipstr: {
      interfaces: {
        hipstrUi: {
          description:
            "Interface web desenvolvida e mantida pelo STRhub para executar, visualizar e explorar resultados do HipSTR de forma interativa.",
        },
      },
      limitations: {
        requiresAligned:
          "Requer arquivos BAM/CRAM alinhados e realiza realinhamento interno (FASTQ não suportado).",
        illuminaOnly:
          "Projetado para dados de leitura curta Illumina; não compatível com ONT ou PacBio.",
      },
      notes:
        "Mantido ativamente por Tamara Frontanilla como parte do projeto STRhub. O HipSTR-UI permite execução interativa, visualização de alelos e integração de dados populacionais para fluxos de trabalho forenses e de pesquisa.",
    },
    longtr: {
      config: {
        targetFileFormat:
          "BED: cromossomo, início (base 1), fim, motivo(s), nome opcional do locus",
      },
      limitations: {
        bamRequirements:
          "Requer BAM/CRAM de leituras longas com alinhamento sensível a indels (ordenado, indexado) e FASTA de referência compatível com o alinhamento.",
        activeDevelopment:
          "Em desenvolvimento ativo; parâmetros da CLI e formatos de saída podem mudar entre versões.",
      },
      notes:
        "LongTR inspira-se no arcabouço HipSTR e adapta-se a leituras longas PacBio HiFi e Oxford Nanopore, genotipando STRs e VNTRs em VCF compactado com bgzip. Disponível via conda (bioconda) ou GitHub.",
    },
    gangstr: {
      limitations: {
        illuminaOnly:
          "Otimizado para dados de leitura curta Illumina; não compatível com ONT ou PacBio.",
        requiresBamBed:
          "Requer alinhamento BAM/CRAM e arquivo BED com lóci definidos.",
      },
      notes:
        "GangSTR está integrado ao catálogo STRhub para benchmarking e comparação entre plataformas. Suporta análise baseada em lócus de expansões de repetições STR e é amplamente usado para conjuntos de dados Illumina em escala populacional.",
    },
    strspy: {
      config: {
        targetFileFormat:
          "BED ou JSON: definições de lócus STR e sequências flanqueadoras",
      },
      limitations: {
        ontOptimized:
          "Otimizado para painéis STR forenses ONT; requer arquivo de referência de lóci.",
        notWgs: "Não projetado para aplicações de genoma completo (WGS).",
      },
      notes:
        "STRspy está integrado ao ecossistema STRhub para análise STR forense e populacional usando dados Oxford Nanopore. Seu design modular permite visualização, benchmarking e compatibilidade cruzada com conjuntos de dados HipSTR-UI.",
    },
    straitrazor: {
      config: {
        targetFileFormat: "CSV ou painel STRaitRazor predefinido",
      },
      limitations: {
        illuminaData: "Projetado para dados Illumina; requer configuração de painel.",
        noAlignment:
          "Não realiza alinhamento de leituras; correspondência de motivo é direta.",
      },
      notes:
        "STRait Razor está incluído no ecossistema STRhub para integração com pipelines forenses baseados em Illumina. Seu algoritmo leve de correspondência de motivos o torna adequado para fins de ensino e treinamento na interpretação de STR.",
    },
    toastr: {
      limitations: {
        forensicNgs:
          "Projetado para análise STR forense NGS; requer painel de referência STRaitRazor.",
        webInterfaceInactive:
          "Interface web inativa em alguns servidores legados.",
      },
      notes:
        "ToaSTR é uma ferramenta forense de genotipagem STR baseada em navegador para dados MPS, com modelagem de stutter sensível à sequência, chamada automática de alelos e relatórios PDF conformes com ISFG. A distribuição em Docker (labconowl/toastr) funciona em macOS, Windows e Linux. Integrada ao STRhub para análise STR forense e validação de referências.",
    },
  },
  repeatTypes: {
    tetranucleotide: "Tetranucleotídeo",
    trinucleotide: "Trinucleotídeo",
    pentanucleotide: "Pentanucleotídeo",
    hexanucleotide: "Hexanucleotídeo",
    dinucleotide: "Dinucleotídeo",
    mononucleotide: "Mononucleotídeo",
    complex: "Complexo",
  },
  categoryLabels: {
    codisCore: "STRs do núcleo CODIS",
    otherAutosomal: "STRs autossômicos (outros)",
    xStr: "STRs do cromossomo X",
    yStr: "STRs do cromossomo Y",
  },
},
overview: {
  motifExplorer: {
    title: "Explorar estrutura interna da sequência",
    desc: "Entenda como os motivos canônicos, variantes internas e regiões flanqueadoras definem o alelo.",
    button: "Abrir STR Motif Explorer",
  },
},
} as const

export default {
  verified: {
    title: "STRhub Verified",
    description:
      "Atestações independentes e automáticas de que uma ferramenta forense de STR instala, roda de ponta a ponta e produz uma saída plausível, verificado sobre seu código público em um commit fixado. Não afirma exatidão de genótipos nem aptidão para casework.",
    summary: {
      heading: "Resumo",
      level: "Nível",
      datasets: "Datasets",
      gatesPassed: "{passed}/{total} portões passados",
      datasetsUsed: "{count} dataset(s) de referência",
      noDatasets: "Sem datasets",
      verifiedDate: "Verificado em {date}",
    },
    empty: "Nenhuma atestação publicada ainda.",
    verifiedOn: "Verificado em",
    backToList: "Todas as ferramentas verificadas",
    source: "Código",
    commit: "Commit",
    environment: "Ambiente",
    ciRun: "Execução de CI",
    gates: "Portões",
    scope: "Escopo",
    scopeNote:
      "Isto não afirma que os genótipos estão corretos, nem que a ferramenta é apta para casework ou cumpre algum padrão regulatório. A concordância contra verdade conhecida está fora do escopo.",
    staticPage: "relatório estático",
    disclaimer:
      "Cada resultado é um instantâneo datado, verificado sobre o repositório público da ferramenta em um commit fixado. O STRhub não armazena código-fonte de nenhuma ferramenta.",
    group: {
      runs: "execuções de verificação",
      runSingular: "1 execução de verificação",
    },
    panel: {
      autosomal: "STR autossômico",
      ont: "ONT CODIS",
      ystr: "Y-STR",
    },
    whatVerified: {
      verifiedHeading: "O que foi verificado",
      notHeading: "Não verificado",
      sourceAvailable: "Código fonte disponível",
      installation: "Instalação bem-sucedida",
      execution: "Execução completa",
      outputGenerated: "Saída gerada",
      accuracy: "Precisão do genotipagem",
      concordance: "Concordância com conjuntos de verdade",
      forensicValidity: "Validade forense",
      regulatory: "Conformidade regulatória",
    },
    col: {
      strLoci: "loci STR",
      snps: "SNPs",
      reads: "reads",
    },
    gate: {
      available: "o código público fixado existe",
      installs: "o ambiente compila a partir do código",
      runs: "executa de ponta a ponta sem quebrar",
      io: "produz um arquivo não vazio no formato declarado",
      content: "sua saída parece dados de genótipos plausíveis",
      contentFailNote:
        "Nota: A verificação \"Plausible Output\" não passou porque a saída não correspondeu completamente ao padrão esperado de genótipos. Isso pode ser devido a diferenças em parâmetros, versão da ferramenta ou configuração. Não indica necessariamente um erro grave.",
    },
    log: {
      view: "Ver log de execução",
    },
    errorsBadgeSuffix: "(erros reportados)",
    diagnostics: {
      heading: "Auto-diagnóstico",
      note: "Problemas detectados automaticamente do log de execução. As sugestões podem ajudar a resolver falhas.",
      strhubNoteLabel: "STRhub Verified nota",
      logIssuesLabel: "Issues do log de execução",
      timesLabel: "{n}×",
      affectedLabel: "Afetados:",
      sliceCaveat:
        "Alguns destes erros ocorreram na amostra de referência do STRhub, que é um recorte em torno dos loci do painel e não um genoma completo, então podem refletir a cobertura da amostra em vez da ferramenta.",
      demoDataRecommendation:
        "Por isso recomendamos fortemente que a ferramenta inclua seus próprios dados de demo ou teste no repositório oficial, para que possa ser avaliada contra dados completos e não contra um recorte de cobertura limitada.",
      sampleNote:
        "Estas mensagens refletem o comportamento observado durante a verificação com um pequeno slice de BAM de teste fornecido pelo STRhub. Com dados de sequenciamento de cobertura completa, a ferramenta deve genotipar significativamente mais loci. Os avisos não indicam um problema com a ferramenta em si.",
      ids: {
        too_few_reads: { title: "Loci omitidos (poucas leituras)", suggestion: "Alguns loci não tiveram leituras suficientes após a filtragem de qualidade. Tente reduzir --min-reads ou relaxar os filtros de qualidade. O BAM de entrada pode precisar de mais cobertura nas regiões STR." },
        low_bq_reads: { title: "Leituras filtradas por qualidade de base", suggestion: "Muitas leituras estão sendo removidas pelo filtro de qualidade de base. Para HipSTR, use --read-qual-trim '!' para diminuir o limiar." },
        unpaired_reads: { title: "Leituras filtradas (sem par)", suggestion: "Leituras sem pares estão sendo filtradas. Isso é comum com slices de BAM onde os pares ficam fora da região." },
        no_read_groups: { title: "BAM/CRAM sem read groups (@RG)", suggestion: "Adicione read groups com: samtools addreplacerg -r '@RG\\tID:sample\\tSM:sample' input.bam -o output.bam" },
        bad_bam: { title: "Arquivo BAM inválido ou truncado", suggestion: "O arquivo BAM pode estar corrompido ou incompleto. Faça o download novamente ou reindexe." },
        file_not_found: { title: "Arquivo não encontrado", suggestion: "Verifique se o caminho do input corresponde ao manifesto e se o fixture foi carregado corretamente." },
        cannot_open: { title: "Não foi possível abrir o arquivo", suggestion: "Verifique se o caminho existe e se o formato do arquivo está correto." },
        segfault: { title: "A ferramenta travou (segmentation fault)", suggestion: "Pode indicar dados de entrada incompatíveis, um bug na ferramenta ou memória insuficiente." },
        oom: { title: "Sem memória", suggestion: "Tente reduzir o tamanho dos dados de entrada ou aumentar o timeout." },
        cmd_not_found: { title: "Comando não encontrado", suggestion: "Verifique se o Dockerfile o instala e se o PATH inclui sua localização." },
        zero_genotyped: { title: "Nenhum locus foi genotipado", suggestion: "Todos os loci foram filtrados. Verifique filtros de qualidade de leitura, limiares mínimos e cobertura dos dados de entrada." },
        genotyping_summary: { title: "Resumo de genotipagem", suggestion: "" },
        bad_option: { title: "Opção de linha de comando não reconhecida", suggestion: "Verifique --help ou o README da ferramenta para o nome correto da opção." },
      },
    },
    content: {
      heading: "Conteúdo da saída (evidência de plausibilidade)",
      records: "Registros de sequência",
      strLoci: "Loci STR detectados",
      snps: "SNPs de identidade (rsNNNN)",
      totalReads: "Reads totais",
      strLociList: "Loci STR",
    },
    data: {
      heading: "Dados de verificação",
      note: "Conjuntos de dados de referência públicos usados como entrada para esta execução de verificação. Provenientes de repositórios de acesso aberto; veja as licenças upstream para os termos de uso.",
      lociTested: "Loci testados",
      lociCount: "loci STR forenses",
      lociScope: "Esta verificação cobre apenas os loci STR listados acima. A ferramenta pode suportar loci adicionais não incluídos neste dataset de referência.",
      refGenome: "Genoma ref.",
      noOwnData: "Esta ferramenta não inclui dados próprios de demo ou teste em seu repositório. O STRhub executou a verificação com um slice pré-construído de dados de referência públicos (listados abaixo). Recomendamos incluir um pequeno arquivo de teste no repositório para uma verificação mais completa e autocontida.",
    },
    matrix: {
      heading: "Matriz de verificação",
      own: "Dados de teste da ferramenta",
      external: "Dataset de referência",
      readme: "README",
      na: "N/A",
      pass: "OK",
      fail: "Falha",
      dataset: "Dataset",
      strhubFixture: "Fixture STRhub",
      strhubFixtureNote:
        "Esta ferramenta não inclui dados próprios de demo ou teste. A verificação usou um dataset fornecido pelo STRhub. Recomendamos incluir um pequeno arquivo de teste no repositório para uma verificação mais completa e autocontida.",
    },
    readme: {
      heading: "Checagem de README (informativo)",
      note: "Checklist de presença sobre o README da ferramenta, informativo, nunca passa/falha.",
      install: "Instalação / preparo do ambiente",
      command: "Comando para rodar",
      input: "Input esperado",
      output: "Output produzido",
      deps: "Dependências / versões",
    },
    submit: {
      cta: "Verificar uma ferramenta",
      title: "Verificar uma ferramenta",
      subtitle:
        "Certificação self-service de que sua ferramenta instala e roda de ponta a ponta sobre seu código público em um commit fixado.",
      disclaimerSnapshot:
        "O resultado é um instantâneo datado. Você pode tornar o repo privado depois. A atestação registra as condições no momento da execução.",
      disclaimerNoSource:
        "O STRhub nunca armazena seu código-fonte. O Dockerfile clona seu repo público no commit fixado apenas em build time.",
      required: "obrigatório",
      optional: "opcional",
      sectionTool: "Ferramenta",
      sectionSource: "Código público",
      sectionSourceHint: "O repositório público do GitHub onde está o código-fonte da sua ferramenta.",
      sectionEnv: "Ambiente",
      sectionRun: "Execução",
      sectionInputs: "Dados de entrada",
      sectionInputsHint:
        "Indique o tipo de assay e o caminho do arquivo de teste no seu repositório público. O STRhub roda sua ferramenta com esses dados. Se tivermos um dataset de referência open source compatível, adicionaremos uma segunda execução para uma camada extra de validação.",
      referenceDatasetsTitle: "Datasets de referência STRhub (open access, apenas loci STR)",
      referenceDatasetsIntro:
        "Para tipos de assay compatíveis, o STRhub também testa sua ferramenta com um dataset STR de referência open source. Hoje existem dois:",
      referenceDatasetsIntro3:
        "Para tipos de assay compatíveis, o STRhub também testa sua ferramenta com um dataset STR de referência open source. Hoje existem três:",
      referenceDatasetsIntro4:
        "Para tipos de assay compatíveis, o STRhub também testa sua ferramenta com um dataset STR de referência open source. Hoje existem quatro:",
      referenceDatasetIllumina:
        "NIST Forensic DNA Open Dataset (ForenSeq e PowerSeq 46GY, uso pesquisa/educação)",
      referenceDatasetOnt:
        "slice CODIS 1000 Genomes ONT (open access na AWS)",
      referenceDatasetIlluminaBamDesc:
        "slice GIAB NA12878 300x hg38 (open access, 24 loci autossômicos forenses)",
      referenceDatasetIlluminaBamYDesc:
        "slice GIAB HG002 300x hg38 (open access, 14 loci Y-STR)",
      referenceDatasetsScope:
        "Não há datasets de referência para painéis SNP, ONT FASTQ bruto ou capilar FSA/HID. Para esses tipos, a verificação usa apenas seu arquivo (não é falha). O STRhub não é custodiante de dados. Aplicam-se as licenças upstream.",
      inputTypeGroupWithReference: "Datasets STRhub de referência",
      inputTypeGroupOwnOnly: "Apenas seu arquivo de teste",
      inputTypeGroupAdvanced: "Avançado",
      inputTypeSuffixWithReference: ", inclui teste STRhub",
      inputTypeSuffixOwnOnly: ", apenas seu fixture",
      sectionOutputs: "Output esperado",
      sectionOutputsHint:
        "Indique qual arquivo seu comando de execução escreve e que tipo de dados ele contém. Não precisa conhecer o motor do STRhub, só a documentação da sua ferramenta.",
      name: "Nome da ferramenta",
      version: "Versão",
      maintainer: "Mantenedor",
      contact: "Contato (issue tracker ou email)",
      repo: "URL do repo público do GitHub",
      ref: "Commit SHA ou tag de release (imutável)",
      refHint: "Um hash de commit específico ou tag. Garante que sempre se teste exatamente o mesmo código.",
      refTooltip:
        "No GitHub, abra seu repositório público. Para uma release: vá em Releases e copie o nome da tag (ex. v3.0). Para um commit: em Code, abra o histórico, escolha um commit e copie o SHA completo (40 caracteres) ou o hash curto no topo. Cole aqui. O STRhub clonará sempre essa versão exata.",
      refTooltipAria: "Como encontrar um commit SHA ou tag de release no GitHub",
      dockerMode: "Como o ambiente deve ser construído?",
      dockerModeTooltip:
        "O STRhub roda sua ferramenta dentro do Docker. Gere para mim: você escolhe a linguagem e o comando de instalação; o STRhub escreve o Dockerfile, clona seu repo no ref fixado e executa o build. Eu forneço um Dockerfile: você cola um Dockerfile completo e o STRhub constrói como está. Use isso se já tiver um ou precisar de controle total.",
      dockerModeTooltipAria: "O que significa cada opção de preparo do ambiente",
      dockerProvided: "Eu forneço um Dockerfile",
      dockerGenerated: "Gere para mim",
      dockerProvidedHint: "Cole um Dockerfile completo (camino A, controle máximo).",
      dockerGeneratedHint:
        "O STRhub monta o Dockerfile a partir de um template (camino B, pip/conda/make).",
      dockerfile: "Conteúdo do Dockerfile",
      language: "Linguagem / stack",
      buildCmd: "Comando de build / install",
      buildCmdTooltip:
        "Comando executado ao construir a imagem Docker, após clonar seu repo. Normalmente sua instalação: pip install, make, conda env create, etc. Se falhar, a verificação para no portão Installs.",
      buildCmdTooltipAria: "Para que serve o comando de build ou install",
      checkCmd: "Comando de sanity check no build",
      checkCmdTooltip:
        "Opcional. Um comando curto executado uma vez durante o build para confirmar que a instalação funcionou, ex. mytool --help ou mytool --version. Deixe em branco se não tiver certeza.",
      checkCmdTooltipAria: "Para que serve o sanity check no build",
      cmd: "Comando de execução (lê /data/in, escreve /data/out)",
      cmdTooltip:
        "Comando que o STRhub executa dentro do contêiner na verificação. Os inputs ficam somente leitura em /data/in/; escreva outputs em /data/out/. Use caminhos do contêiner, não do seu computador nem da árvore do GitHub.",
      cmdTooltipAria: "O que é o comando de execução e como funcionam os caminhos",
      cmdReplaceMytool: "Substitua \"mytool\" pelo binário ou comando real da sua ferramenta (ex. hipstr, strait_razor, toastr). O restante dos caminhos está correto.",
      cmdFetchingReadme: "Lendo o README do seu repo…",
      cmdSuggestFromReadme: "Sugerido do seu README — clique para usar:",
      cmdHint: "Sua ferramenta lê os dados de /data/in/ e escreve a saída em /data/out/.",
      cmdHintWithRef: "Sua ferramenta lê os dados de /data/in/, o genoma de referência de {mountPath}, e escreve a saída em /data/out/.",
      refGenomeTitle: "Genoma de referência: {assembly}",
      refGenomeDescription: "O STRhub fornece automaticamente o genoma de referência indexado e pronto em {mountPath}. Use este caminho para --fasta ou o parâmetro equivalente no seu comando de execução.",
      refGenomeNote: "O genoma de referência ({assembly}) é baixado, indexado e montado automaticamente pelo STRhub.",
      canonicalPathsTitle: "Use estes caminhos padrão no seu comando de execução",
      canonicalPathsDescription: "O STRhub renomeia todos os arquivos de entrada para nomes padrão para que o mesmo comando funcione tanto com seus dados quanto com nosso dataset de referência. Use exatamente estes caminhos:",
      timeout: "Timeout (minutos)",
      inputType: "Que tipo de dados sua ferramenta recebe?",
      inputTypeSelect: "Selecione o tipo de input",
      inputTypeDescIlluminaStrFastq:
        "FASTQ Illumina MiSeq/MiniSeq STR: Verogen ForenSeq ou Promega PowerSeq 46GY (os únicos dois kits no nosso dataset NIST de referência por enquanto)",
      inputTypeDescOntBamHg38: "BAM Oxford Nanopore alinhado ao hg38 (regiões CODIS)",
      inputTypeDescIlluminaBamHg38: "BAM Illumina WGS alinhado ao hg38 (loci STR autossômicos forenses)",
      inputTypeDescIlluminaBamHg38Y: "BAM Illumina WGS alinhado ao hg38 (loci STR do cromossomo Y)",
      inputTypeDescOntFastq: "FASTQ bruto Oxford Nanopore",
      inputTypeDescIlluminaSnpFastq: "FASTQ Illumina para painéis SNP de identidade/ancestralidade",
      inputTypeDescCapillaryFsa: "Arquivos de eletroforese capilar ABI .fsa ou .hid",
      inputTypeOther: "Outro (eu digito)",
      inputTypeCustom: "Slug personalizado do tipo de input",
      inputTypeCustomHint:
        "Um identificador curto, ex. 'pacbio-hifi-bam'. Não há dataset STRhub para tipos custom.",
      externalNoteIllumina:
        "O STRhub rodará 2 testes: com seu arquivo e com dados Illumina STR do NIST mds2-2157. Nosso dataset NIST cobre apenas ForenSeq e PowerSeq 46GY. Use reads compatíveis com seu kit no seu próprio fixture.",
      externalNoteOnt:
        "O STRhub rodará 2 testes: com o BAM de teste do repositório da ferramenta (se fornecido) e com um slice CODIS 1000 Genomes ONT hg38 (~30 MB).",
      externalNoteIlluminaBam:
        "O STRhub rodará 2 testes: com o BAM de teste do repositório da ferramenta (se fornecido) e com um slice GIAB NA12878 300x hg38. O dataset de referência cobre 24 loci STR autossômicos forenses (amostra feminina, sem marcadores Y).",
      externalNoteIlluminaBamY:
        "O STRhub rodará 2 testes: com o BAM de teste do repositório da ferramenta (se fornecido) e com um slice GIAB HG002 300x hg38. O dataset de referência cobre 14 loci Y-STR forenses (amostra masculina).",
      externalNoteOwnOnly:
        "O STRhub rodará 1 teste apenas com seu arquivo. Não há dataset STRhub para este tipo de input (não é falha).",
      fixtureLabel: "Seu arquivo de teste (obrigatório)",
      fixtureLabelRecommended: "Seu arquivo de teste (recomendado)",
      fixtureExplainer:
        "Obrigatório. Indique um arquivo pequeno e acessível publicamente no ref que você indicou.",
      fixtureExplainerOptional:
        "Recomendado. Para uma verificação mais completa, indique um arquivo de teste no seu repo — o STRhub rodará tanto com seus dados quanto com nosso dataset de referência. Se seu repo não inclui dados de teste, deixe em branco e o STRhub rodará apenas com nosso dataset de referência.",
      fixtureRequiredError: "Um arquivo de teste é necessário para este tipo de input (não há dataset de referência STRhub disponível).",
      fixtureSameRepo: "Está no repo da minha ferramenta",
      fixtureOtherRepo: "Está em outro repo",
      fixtureSameRepoNote: "Usando repo {repo} no ref {ref}.",
      fixturePathInRepo: "Caminho do arquivo de teste no repo",
      fixturePathInRepoTooltip:
        "Caminho do seu arquivo de teste pequeno dentro do repo e ref indicados, relativo à raiz do repo. Exemplo: test/data/sample.fastq. O arquivo deve existir nesse ref no GitHub para o STRhub poder buscá-lo.",
      fixturePathInRepoTooltipAria: "Como indicar o caminho do arquivo de teste no repositório",
      fixturePathHint: "Caminho relativo da raiz do repo, ex. test/data/sample.fastq",
      fixtureRepo: "URL do repo com dados de teste",
      fixtureRef: "Commit / tag",

      // Regions BED — obrigatório para ferramentas que trabalham por coordenadas.
      regionsLabel: "Seu arquivo BED de regiões",
      regionsExplainer:
        "Obrigatório para ferramentas que leem arquivos BAM. Cada ferramenta espera seu próprio formato de BED (HipSTR, GangSTR e outras usam colunas diferentes), então o BED é você quem define. O STRhub fornece as coordenadas: baixe o painel abaixo, converta para o formato da sua ferramenta e envie.",
      regionsUploadLabel: "Envie seu BED",
      regionsUploadPlaceholder: "Escolha um arquivo .bed…",
      regionsUploadHint:
        "O arquivo que você montou a partir do painel acima, no formato da sua ferramenta. Texto puro .bed — não compactado. Validado contra o painel aqui antes de enviar.",
      regionsGzip:
        "Esse arquivo está compactado (gzip). Descompacte primeiro (gunzip) e envie o .bed em texto puro.",
      supportedLociTitle: "Loci suportados pela nossa amostra ({count})",
      supportedLociExplainer:
        "Nossa amostra de teste é um recorte em torno destes loci forenses, não um genoma completo. Seu BED deve mirar dentro destas regiões: fora delas não há leituras e sua ferramenta não conseguiria chamar nada.",
      supportedLociDownload: "Baixar coordenadas (BED, GRCh38)",
      panelLoading: "Carregando os loci suportados…",
      panelError:
        "Não conseguimos carregar o painel de loci suportados. Você pode enviar mesmo assim: o STRhub valida seu BED antes de rodar.",
      regionsMalformed: "O BED tem formato inválido:",
      regionsMalformedGeneric: "Não conseguimos interpretar esse arquivo como um BED.",
      regionsUnconverted:
        "Isto parece o nosso painel de coordenadas, enviado como está. As coordenadas estão certas, mas as colunas ainda são as nossas — a maioria das ferramentas (HipSTR, GangSTR) espera seu próprio formato e o rejeitaria. Converta para o formato da sua ferramenta antes de rodar.",
      regionsRepoTip:
        "Dica: faça commit deste BED no repo da sua ferramenta (ex. regions/strhub-verified.bed) para que quem a usar tenha as regiões exatas desta atestação. O STRhub verifica o arquivo que você envia aqui, não a cópia do repo.",
      regionsOk: "Seu BED cobre {covered} de {total} loci suportados. Pronto para verificar.",
      regionsRejectedTitle: "Este BED aponta para fora da nossa amostra",
      regionsRejectedExplainer:
        "Estas regiões não estão cobertas pelo nosso recorte, então sua ferramenta não encontraria leituras ali. Não é um problema da sua ferramenta — ajuste o BED ao painel acima.",
      regionsLinePrefix: "linha {line}:",
      regionsAndMore: "…e mais {n}.",
      regionsTooFewLoci:
        "Seu BED cobre {covered} loci suportados; precisamos de pelo menos {min} para verificar.",
      regionsRequiredError: "Informe seu arquivo BED de regiões para este tipo de input.",
      outputPath: "Nome do arquivo de saída (padrão)",
      outputPathHint:
        "O nome (ou padrão) do arquivo que sua ferramenta escreve em /data/out/, ex. *.allsequences.txt ou result.vcf.",
      outputPathTooltip:
        "Use o mesmo nome ou curinga que seu comando cria dentro do contêiner. O STRhub procura esse arquivo após o run. Não precisa coincidir com a extensão do campo seguinte.",
      outputPathTooltipAria: "Como indicar o arquivo de saída que sua ferramenta produz",
      outputFormat: "Tipo de conteúdo da saída",
      outputFormatHint:
        "Como o arquivo está estruturado por dentro, não necessariamente a extensão. Colunas separadas por tab → TSV (mesmo que termine em .txt).",
      outputFormatTooltip:
        "Escolha a estrutura que combina com a saída da sua ferramenta. TSV: colunas separadas por tab (STRait Razor .allsequences.txt é TSV). CSV: separado por vírgula. VCF: variantes. JSON: dados JSON. Text: linhas simples sem parser de tabela.",
      outputFormatTooltipAria: "Como escolher o tipo de conteúdo da saída",
      outputFormatOptions: {
        tsv: "TSV (colunas separadas por tab)",
        csv: "CSV (colunas separadas por vírgula)",
        vcf: "VCF (variant call format)",
        json: "JSON",
        text: "Texto simples (linhas, sem tabela)",
      },
      minRecords: "Registros mínimos",
      contentToggle: "Checar plausibilidade do conteúdo (recomendado)",
      contentToggleTooltip:
        "Recomendado. Verifica que a saída pareça genótipos plausíveis —loci reconhecíveis suficientes e os loci que você espera— não apenas um arquivo não vazio. Passar concede o badge mais forte \"Plausible output\". Desmarque para verificar apenas o formato.",
      contentToggleTooltipAria: "O que faz a checagem de plausibilidade de conteúdo",
      contentDefaultsHint:
        "Pré-preenchido com valores sensatos para o formato de saída e o assay escolhidos. Edite qualquer campo para ajustar à sua ferramenta, ou limpe um para pular aquela checagem.",
      contentDefaultsReset: "Restaurar recomendados",
      submit: "Enviar para verificação",
      submitting: "Enviando…",
      statePendingApproval:
        "Este repositório é novo e aguarda aprovação de um admin antes da primeira execução. Você pode reenviar após a aprovação.",
      stateDispatched: "Enviado. Acompanhando a execução de verificação…",
      stateQueued: "Na fila…",
      stateInProgress: "Rodando os portões…",
      statePolling: "Consultando status…",
      stateCompletedSuccess: "A verificação terminou com sucesso.",
      stateCompletedFailure: "A execução terminou mas não passou em todos os portões.",
      viewRun: "Ver execução de CI",
      viewReport: "Ver atestação",
      errorGeneric: "Algo deu errado. Tente novamente.",
      errorValidation: "Corrija os campos destacados.",
      pdfDownload: "Baixar relatório PDF",
      pdfGenerating: "Gerando PDF…",
      pdfDone: "PDF baixado",
      pdfError: "PDF falhou — tentar novamente",
      pdfErrorHint: "O relatório pode não estar publicado ainda. Tente novamente em alguns segundos.",
      resubmit: "Editar e reenviar",
      resubmitHint: "Voltar ao formulário com os mesmos parâmetros preenchidos.",
      paramsToggle: "Parâmetros do envio",
      paramsToolName: "Ferramenta",
      paramsVersion: "Versão",
      paramsRepo: "Repositório",
      paramsRef: "Ref",
      paramsCmd: "Comando de execução",
      paramsInputType: "Tipo de input",
      paramsFixture: "Arquivo de teste",
      paramsOutput: "Output",
      paramsBuild: "Build",
      paramsDockerMode: "Modo Docker",
      paramsTimeout: "Timeout",
    },
  },
};

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
    variant: "Kit / variante",
    submittedBy: "Enviado por",
    submittedByValue: {
      maintainer: "O mantenedor da ferramenta",
      third_party: "Um terceiro (não o mantenedor da ferramenta)",
    },
    thirdPartyShortfall:
      "Esta execução foi configurada por um terceiro, não por quem mantém a ferramenta. Um resultado que para antes do degrau mais alto pode refletir essa configuração, e não o software em si.",
    submittedByThirdPartyNote:
      "Esta ferramenta foi enviada para verificação por alguém que não é seu mantenedor. O mantenedor não participou da execução nem forneceu nada do que ela usou: o comando, o ambiente e as regiões alvo foram escolhidos por quem a enviou. Se houver um mantenedor citado acima, é quem responde pelo software — não quem pediu este relatório, e não implica endosso dele.",
    commit: "Commit",
    environment: "Ambiente",
    environmentFallback: "Plano B: {reason}, depois que o build do commit fixado falhou.",
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
      stoppedHere: "a execução parou aqui",
      notReached: "não foi tentado — a execução já havia parado",
      available: "o código público fixado existe",
      installs: "o ambiente compila a partir do código",
      runs: "executa de ponta a ponta sem quebrar",
      io: "produz um arquivo não vazio no formato declarado",
      content: "sua saída parece dados de genótipos plausíveis",
      contentFailNote:
        "Nota: A verificação \"Plausible Output\" não passou porque a saída não correspondeu completamente ao padrão esperado de genótipos. Isso pode ser devido a diferenças em parâmetros, versão da ferramenta ou configuração. Não indica necessariamente um erro grave.",
      stoppedEarlyNote:
        "Parar nesta etapa não é uma constatação de que o software esteja defeituoso. Registra até onde esta tentativa em particular chegou. Um software pode parar antes porque uma dependência que ele declara não está mais disponível, porque espera a entrada organizada de forma diferente da amostra de referência, ou porque o ambiente automático não consegue fornecer algo de que ele precisa.",
      howToReadLink: "Como ler este resultado",
    },
    howToRead: {
      title: "Como ler um resultado",
      lede:
        "Um resultado é um registro datado do que aconteceu quando o STRhub instalou uma ferramenta forense de STR e a executou, em uma versão fixa do código, sobre dados de referência que o desenvolvedor não escolheu. É produzido automaticamente e qualquer pessoa pode repeti-lo.",
      stoppedHeading: "Quando um resultado para antes",
      stoppedBody:
        "Um resultado abaixo da etapa mais alta não é uma constatação de que o software esteja defeituoso. Registra até onde esta tentativa em particular chegou. Um software pode parar antes porque uma dependência que ele declara não está mais disponível, porque espera a entrada organizada de forma diferente da amostra de referência, ou porque o ambiente automático não consegue fornecer algo de que ele precisa, como componentes com licença comercial.",
      stoppedBody2:
        "Cada resultado indica onde parou e mostra as mensagens que estavam na tela naquele momento. Esse detalhe é o que importa. A etapa alcançada é apenas a manchete.",
      canHeading: "Perguntas que um resultado responde",
      can1: "O código está público na versão que o manuscrito cita, hoje?",
      can2: "Alguém fora dos autores consegue instalá-lo com as instruções dadas?",
      can3: "Executa até o fim sobre dados que os autores não selecionaram?",
      can4: "Devolve uma saída que parece chamadas de marcadores reais?",
      can5: "Do que precisou que um ambiente padrão não pôde fornecer?",
      can6: "Quem a enviou para verificação: seu mantenedor ou outra pessoa?",
      cannotHeading: "Perguntas que não responde",
      cannot1: "Os genótipos estão corretos?",
      cannot2: "Concorda com um perfil de referência ou com outro método?",
      cannot3: "É adequado para casework, ou acreditado para isso?",
      cannot4: "É melhor ou pior que outra ferramenta?",
      cannot5: "Tem o desempenho relatado no manuscrito?",
      cannot6: "Seu mantenedor endossa este resultado?",
      developerHeading: "Para um desenvolvedor",
      developerBody:
        "Um resultado descreve um ambiente, e um software que funciona na máquina onde foi escrito pode parar aqui mesmo assim. Essa lacuna costuma ser a parte útil: é o que um usuário novo encontra no primeiro dia. Cada resultado traz o log completo e os comandos exatos, então pode ser reproduzido localmente.",
    },
    needed: {
      heading: "O que esta execução precisou além do repositório",
      note: "O resultado acima descreve uma execução configurada assim. Quem quiser repeti-la precisa das mesmas coisas.",
    },
    caveats: {
      heading: "Notas da leitura do repositório",
      note: "Registradas automaticamente a partir dos arquivos públicos da ferramenta ao configurar esta execução. Não verificadas por execução, e não fazem parte dos portões acima. Úteis para saber o que conferir à mão.",
    },
    log: {
      build: "Build",
      view: "Ver log de execução",
    },
    errorsBadgeSuffix: "(erros reportados)",
    upstream: {
      head: "Hoje é a cabeça de {branch}.",
      behind: "Desde então entraram {n} commit(s) em {branch}. É contexto, não uma falha: uma release fixada costuma ficar para trás de propósito.",
      refGone: "Este commit não é mais alcançável no repositório. O resultado ainda descreve o que rodou, mas não dá para buscar o código para repetir.",
      repoGone: "O repositório público não é mais alcançável nesta URL, então nada aqui pode ser reconferido contra seu código.",
    },
    install: {
      heading: "Por que o ambiente não foi construído",
      note: "O contêiner não pôde ser construído a partir dos passos de instalação declarados, então nada abaixo do portão Installs chegou a rodar.",
      headingFallback: "Por que o commit fixado não compilou",
      noteFallback:
        "O contêiner não pôde ser construído com os passos de instalação declarados no commit fixado; em vez disso foi construído {reason}, e todos os portões abaixo rodaram nele. O que rodou é a versão que esse ambiente traz, não necessariamente o commit fixado.",
      faultStrhub:
        "Ao menos uma causa é do STRhub, não da ferramenta: a receita do contêiner de um ambiente gerado é nossa. Nada aqui é uma constatação sobre o software, e não há nada a corrigir do lado de quem o mantém.",
      faultHarness:
        "Ao menos uma causa é um teto do ambiente automático gratuito, não uma falha da ferramenta.",
      faultAuthor:
        "Todas as causas identificadas estão no que a submission declarou — suas versões fixadas, nomes de pacotes ou passos de build. São corrigíveis, e re-verificar depois é grátis.",
      faultAuthorThirdParty:
        "Todas as causas identificadas estão no que a submission declarou — suas versões fixadas, nomes de pacotes ou passos de build — e essa submission veio de um terceiro, não de quem mantém a ferramenta. São falhas em como a ferramenta foi configurada aqui, não no software. Re-verificar depois de corrigi-las é grátis.",
      faultUnknown:
        "A causa não pôde ser classificada automaticamente. Abaixo está o log completo do build.",
      viewBuildLog: "Ver log do build",
    },
    diagnostics: {
      heading: "Auto-diagnóstico",
      note: "Problemas detectados automaticamente do log de execução. As sugestões podem ajudar a resolver falhas.",
      strhubNoteLabel: "STRhub Verified nota",
      logIssuesLabel: "Issues do log de execução",
      timesLabel: "{n}×",
      affectedLabel: "Afetados:",
      sliceCaveat:
        "Alguns destes erros ocorreram na amostra de referência do STRhub, que é um recorte em torno dos loci do painel e não um genoma completo, então podem refletir a cobertura da amostra em vez da ferramenta.",
      structuralNote:
        "Erros estruturais, como um arquivo que não abre, um flag de linha de comando não reconhecido ou uma compilação incompleta, não dependem da amostra: um recorte de cobertura limitada gera menos reads, mas não pode causá-los. Não são atribuíveis à amostra de referência do STRhub.",
      demoDataRecommendation:
        "Um arquivo de teste pequeno no repositório da ferramenta permite que um usuário novo a execute no primeiro dia e a veja funcionando antes de confiar nela com seus próprios dados, e permite ainda verificá-la contra a amostra do autor e não apenas contra o recorte do STRhub. Publicar a saída que esse arquivo deveria produzir ajuda tanto quanto: mostra como os resultados devem ser, que é o que se precisa para distinguir uma execução correta de uma que apenas terminou.",
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
      noOwnData: "Esta ferramenta não inclui dados próprios de demo ou teste em seu repositório. O STRhub executou a verificação com um slice pré-construído de dados de referência públicos (listados abaixo). Um arquivo de teste pequeno no repositório permite que um usuário novo execute a ferramenta no primeiro dia e a veja funcionando antes de confiar nela com seus próprios dados, e permite ainda verificá-la contra a amostra do próprio autor e não apenas contra esta. Publicar a saída que esse arquivo deveria produzir ajuda tanto quanto: mostra como os resultados devem ser.",
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
    manual: {
      heading: "Verificação manual disponível",
      pageTitle: "Verificação manual",
      pageSubtitle:
        "A verificação automática não pôde ser executada para esta ferramenta. O STRhub pode executá-la manualmente e emitir um certificado separado.",
      backToReport: "Voltar à atestação",
      whyHeading: "Por que a execução automática não se aplica",
      notAFault:
        "É um limite do ambiente automático, não uma falha encontrada na sua ferramenta. A verificação automática gratuita continua disponível e inalterada para as ferramentas que ela consegue executar.",
      whatItIs:
        "A verificação manual é um serviço separado e pago: o STRhub executa a ferramenta manualmente e emite um certificado explicitamente rotulado como verificação manual, nunca apresentado como uma atestação automática.",
      cta: "Solicitar verificação manual",
      reasonCodeLabel: "Código de elegibilidade:",
      toolLabel: "Ferramenta",
      whatYouGetHeading: "O que a verificação manual inclui",
      whatYouGet1:
        "O STRhub executa sua ferramenta manualmente em um ambiente que atende aos seus requisitos, e registra o que foi feito.",
      whatYouGet2:
        "Um certificado explicitamente rotulado como verificação manual, indicando o ambiente, os dados usados e a data.",
      whatYouGet3:
        "Os mesmos limites de escopo da atestação automática: apenas execução reprodutível, sem afirmar exatidão de genótipos nem adequação para casework.",
      emailCta: "Enviar solicitação por e-mail",
      emailHint:
        "Abre seu cliente de e-mail com a ferramenta e o código de elegibilidade já preenchidos.",
      mailSubject: "Solicitação de verificação manual",
      mailIntro:
        "Olá, gostaria de solicitar a verificação manual para a ferramenta abaixo.",
      notEligibleHeading: "Aqui a verificação automática gratuita ainda se aplica",
      notEligibleBody:
        "Esta ferramenta não esbarrou em um limite do ambiente automático, portanto a verificação manual não se aplica. Se uma execução falhou, o relatório indica o que deu errado e como corrigir. Correções em um envio podem ser reexecutadas gratuitamente quantas vezes for necessário.",
      freeHelp:
        "Travado no formulário ou sem saber o que um campo pede? Isso é documentação nossa a melhorar, não um motivo para pagar: escreva para nós e ajudamos sem custo.",
      freeHelpCta: "Pedir ajuda (grátis)",
      helpMailSubject: "Ajuda com o formulário do STRhub Verified",
      reasons: {
        requires_gui:
          "A ferramenta precisa de uma tela gráfica ou de um passo interativo. O runner automático é headless e roda sem supervisão, então não pode executar nem evidenciar esse passo.",
        requires_gpu:
          "A ferramenta precisa de GPU. Os runners públicos de CI são apenas CPU, então o ambiente automático não pode fornecê-la.",
        requires_runtime_network:
          "A ferramenta baixa dados pela rede enquanto executa. Uma atestação é um snapshot fixado, então o que for baixado em tempo de execução não pode ser registrado nem reproduzido.",
        requires_licensed_reference:
          "A ferramenta precisa de dados de referência licenciados ou restritos que não podem ser publicados em uma execução pública de verificação.",
        requires_unsupported_os:
          "A ferramenta precisa de um sistema operacional que o runner automático não fornece.",
        opaque_output_format:
          "A ferramenta escreve uma saída binária ou proprietária sem exportação em texto ou tabular, então as comportas automáticas de IO e conteúdo não conseguem inspecioná-la.",
        oom: "A execução esgotou a memória do runner de CI. O ambiente automático tem um orçamento de memória fixo que não pode ser aumentado pelo formulário.",
        disk_full:
          "A execução encheu o disco do runner de CI. O ambiente automático tem um orçamento de disco fixo que não pode ser aumentado pelo formulário.",
        runtime_network:
          "A ferramenta buscou a rede durante a execução. Uma atestação é um snapshot fixado, então o que for baixado em tempo de execução não pode ser registrado nem reproduzido.",
        requires_license:
          "A ferramenta precisa de uma licença ou de dados licenciados que não podem ser publicados em uma execução pública de verificação.",
      },
    },
    submit: {
      preflightTitle: "Sua ferramenta precisa de algo que não podemos fornecer?",
      preflightHint:
        "Marque uma caixa apenas se for verdade para sua ferramenta. São coisas que o runner automático genuinamente não consegue fazer: ele é headless, apenas CPU, e tem memória e disco fixos. Se nenhuma se aplica, deixe todas desmarcadas. Se você apenas está em dúvida sobre algum campo deste formulário, não mexa aqui e escreva para nós: dúvidas do formulário são respondidas gratuitamente.",
      preflight: {
        requires_gui:
          "Precisa de uma tela gráfica ou de um passo interativo (não pode rodar sem supervisão).",
        requires_gpu: "Precisa de GPU (CUDA).",
        requires_runtime_network:
          "Baixa dados pela rede enquanto executa (baixar durante o build está ok).",
        requires_licensed_reference:
          "Precisa de dados de referência licenciados ou restritos que não podem ser tornados públicos.",
        requires_unsupported_os:
          "Precisa de Windows, macOS ou outro sistema operacional que não seja Linux.",
        opaque_output_format:
          "Sua saída é binária ou proprietária, sem exportação em texto ou tabular.",
      },
      preflightBlockedTitle: "A execução automática não pode verificar esta ferramenta",
      preflightBlockedBody:
        "Pelo que você marcou, o ambiente automático não consegue executar sua ferramenta, então enviar apenas gastaria uma execução na falha que você já descreveu. A verificação manual existe exatamente para este caso.",
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
      variant: "Kit ou variante de configuração",
      variantTooltip:
        "Use quando a mesma ferramenta, no mesmo commit, é verificada mais de uma vez com configurações diferentes: STRait Razor com ForenSeq e com PowerSeq, por exemplo. Cada variante recebe sua própria atestação e seu próprio link permanente. Deixe em branco se houver só uma.",
      slugPreview: "Será publicado em",
      submitterRole: "Sua relação com esta ferramenta",
      submitterRoleTooltip:
        "Tudo o que vem abaixo — o comando, o ambiente, as regiões — é publicado como parte da atestação, e é isto que diz de quem foram essas escolhas. Uma conta do GitHub diz quem é dono de um repositório; nunca diz quem preencheu este formulário.",
      submitterRoleOption: {
        maintainer: "Eu mantenho esta ferramenta",
        third_party: "Não sou o mantenedor dela",
      },
      submitterRoleDesc: {
        maintainer:
          "Você a escreveu, ou responde por ela. A atestação registra que quem a enviou foi seu mantenedor.",
        third_party:
          "Você está verificando uma ferramenta de outra pessoa. A atestação diz isso, e registra que o mantenedor dela não participou nem forneceu a configuração.",
      },
      maintainer: "Mantenedor",
      maintainerThirdParty: "Mantenedor da ferramenta (não você)",
      maintainerThirdPartyNote:
        "Publicado como a pessoa que responde pelo software, junto com a nota de que ela não participou desta verificação.",
      contact: "Contato (issue tracker ou email)",
      repo: "URL do repo público do GitHub",
      ref: "Commit SHA ou tag de release (imutável)",
      refHint: "Um hash de commit específico ou tag. Garante que sempre se teste exatamente o mesmo código.",
      fetchLastSha: "Buscar o último commit SHA",
      useLatestTag: "Usar a última tag de release ({tag})",
      versionDerived: "Registrado na atestação como versão {version}.",
      repoLookupLoading: "Lendo o repositório…",
      repoLookupError:
        "Não conseguimos ler esse repositório. Confira a URL: precisa ser um repo público do GitHub. Você ainda pode preencher o formulário à mão.",
      lockedUntilSource:
        "Preencha primeiro o código público acima. O resto do formulário é montado a partir do seu repositório e do commit que você fixar.",
      prefillConflictTitle: "Manter o que você digitou ou usar os dados do repositório?",
      prefillConflictBody:
        "Estes campos já tinham valor, então nada foi alterado. Foi isto que encontramos:",
      prefillAccept: "Usar estes valores",
      prefillKeep: "Manter os meus",
      preflightSummaryNone: "Nada marcado: a verificação automática se aplica a esta ferramenta.",
      preflightSummarySelected: "{n} marcado(s).",
      reuseTitle: "Reutilizar uma verificação anterior",
      reuseHint:
        "Este repositório já foi verificado antes. Traga aquelas respostas e mude só o que mudou.",
      reuseGroup: {
        env: "Ambiente",
        inputs: "Dados de entrada",
        run: "Execução",
        outputs: "Saída esperada",
      },
      reuseApply: "Reutilizar",
      reuseShowMore: "Ver mais {n} verificação(ões)",
      reuseApplied:
        "Respostas recuperadas dessa verificação. Confira antes de enviar: o commit que você fixou acima fica intacto.",
      reuseUnavailable:
        "Não conseguimos carregar as configurações dessa verificação. Ela pode ser anterior ao armazenamento de envios — preencha o formulário à mão.",
      reuseRegionsFile: "regions.bed (reutilizado de uma verificação anterior)",
      autoConfigTitle: "Configuração automática",
      autoConfigHint:
        "Opcional. Lemos o teu repositório no commit que fixaste e propomos as respostas abaixo. Nada é preenchido até teres revisto.",
      autoConfigSummaryIdle: "Sem usar — preenche o formulário à mão, ou deixa-nos propor as respostas.",
      autoConfigSummaryApplied: "Aplicada. Verifica cada campo antes de submeter.",
      autoConfigOwnDockerfile: "Sou eu que forneço o Dockerfile",
      autoConfigDockerfileHint:
        "Cola o Dockerfile completo. O STRhub compila-o sem alterações, por isso nada sobre o teu ambiente é adivinhado.",
      autoConfigSampleLabel: "Ficheiro de resultados de uma execução anterior",
      autoConfigLocalOnly:
        "Lido no teu navegador para deduzir o formato de saída e a disposição das colunas. O ficheiro nunca é enviado.",
      autoConfigSampleApplied: "Lido {file} — a secção de saída esperada fica preenchida.",
      autoConfigGenerate: "Configurar automaticamente",
      autoConfigUseSaved: "Usar uma configuração guardada ({n})",
      autoConfigWorking: "A ler o repositório e a deduzir como a tua ferramenta compila e corre. Pode demorar alguns minutos.",
      autoConfigAppliedNote:
        "Respostas preenchidas a partir da configuração automática. Verifica-as antes de submeter — o commit que fixaste acima não é tocado.",
      autoConfigReview: "Rever",
      autoConfigReviewHint:
        "Tudo isto foi lido do teu repositório. Marca os grupos que quiseres, verifica os valores e preenche o formulário.",
      autoConfigExactRef: "Este mesmo commit",
      autoConfigFromRef: "Gerada a partir de {ref}",
      autoConfigMayBeStale: "pode estar desatualizada",
      autoConfigOldVersion: "gerada por uma versão anterior",
      autoConfigWhatIsSent:
        "Para o nosso servidor só são enviados o URL do repositório e o commit. O teu ficheiro de resultados e o teu Dockerfile são lidos no navegador e ficam por lá.",
      autoConfigStaleTitle: "Os ficheiros de compilação mudaram desde que isto foi gerado",
      autoConfigStaleBody:
        "Um Dockerfile, manifesto ou Makefile é diferente no commit que fixaste. As respostas de ambiente podem já não estar certas — verifica-as, ou configura de novo.",
      autoConfigNotFound: "Não consta do repositório",
      autoConfigApplies: "Aplica-se a esta ferramenta",
      autoConfigCaveats: "Vale a pena verificar à mão",
      autoConfigApply: "Preencher o formulário",
      autoConfigCancel: "Cancelar",
      autoConfigHigh: "Com citação",
      autoConfigLow: "Incerto",
      autoConfigGroup: {
        tool: "Ferramenta",
        env: "Ambiente",
        run: "Execução",
        inputs: "Dados de entrada",
        outputs: "Saída esperada",
        compat: "Limitações",
      },
      autoConfigRepoNotFound: "Não conseguimos ler esse repositório. Confirma que é público e que o URL está certo.",
      autoConfigRefNotFound: "Esse commit ou tag não existe no repositório.",
      autoConfigEmptyRepo: "Esse repositório parece vazio no commit que fixaste.",
      autoConfigDeclined: "Não conseguimos configurar este repositório automaticamente. Preenche o formulário à mão.",
      autoConfigDisabled: "A configuração automática não está disponível de momento.",
      autoConfigFailed: "A configuração automática falhou. Tenta de novo, ou preenche o formulário à mão.",
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
      needsBuild: "Minha ferramenta precisa ser compilada a partir do código-fonte",
      needsBuildHint:
        "Marque se sua ferramenta precisa ser compilada ou instalada antes de rodar: pip install, make, cargo build. Deixe desmarcado para um script ou um binário já commitado que roda direto do clone.",
      buildCmd: "Comando de build / install",
      buildCmdTooltip:
        "Comando executado ao construir a imagem Docker, após clonar seu repo. Normalmente sua instalação: pip install, make, conda env create, etc. Se falhar, a verificação para no portão Installs.",
      buildCmdTooltipAria: "Para que serve o comando de build ou install",
      buildCmdNone: "sem etapa de build",
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
      sliceNoticeTitle: "Nossa amostra de referência é um slice, não um genoma completo",
      sliceNoticeBody:
        "O STRhub não hospeda genomas completos. Os dados de referência deste tipo de entrada são um extrato pequeno ao redor de marcadores STR forenses. Uma ferramenta apontada fora desses marcadores não encontra leituras ali, então a execução não diz nada sobre a ferramenta.",
      sliceNoticeDownload: "Baixar as coordenadas suportadas (BED, GRCh38)",
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
      externalRunsBoth:
        "O STRhub vai rodar duas verificações: uma sobre seu arquivo de teste e outra sobre nosso dataset de referência.",
      externalRunsOurs:
        "O STRhub vai rodar uma única verificação, sobre nosso dataset de referência: você disse que o repositório não tem arquivo de teste.",
      externalDetailIllumina:
        "A referência é NIST mds2-2157, dados STR Illumina que cobrem apenas ForenSeq e PowerSeq 46GY; use reads do mesmo kit no seu próprio fixture.",
      externalDetailOnt:
        "A referência é um slice CODIS hg38 do 1000 Genomes ONT (~30 MB).",
      externalDetailIlluminaBam:
        "A referência é um slice GIAB NA12878 300x hg38 cobrindo 24 loci STR forenses autossômicos (amostra feminina, sem marcadores Y).",
      externalDetailIlluminaBamY:
        "A referência é um slice GIAB HG002 300x hg38 cobrindo 14 loci Y-STR forenses (amostra masculina).",
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
      fixtureNone: "Não tenho arquivo de teste",
      fixtureNoneNote:
        "O STRhub verificará sua ferramenta apenas com o nosso dataset de referência. É um resultado válido, só que mais restrito: mostra que sua ferramenta roda com os nossos dados, não com os seus.",
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
      regionsLibraryLabel: "Arquivo de regiões",
      regionsLibraryHint: "O STRhub tem os loci forenses da amostra de referência prontos em cada um destes formatos, gerados a partir do hg38. Escolha o que sua ferramenta lê; envie o seu só se nenhum servir.",
      regionsLibraryOption: {
        hipstr: "7 colunas: chrom, start, end, período, cópias de referência, nome, motivo",
        gangstr: "5 colunas: chrom, start, end, período, motivo",
        strsearch: "11 colunas: coordenadas, período, alelo, nomes, estrutura, fita, sequências flanqueadoras 5' e 3'",
        bed4: "4 colunas: chrom, start, end, nome (BED simples)",
        upload: "Nenhum destes: enviar meu próprio arquivo de regiões",
      },
      regionsLibraryUsedBy: {
        hipstr: "O formato que o HipSTR lê com --regions.",
        gangstr: "O formato que o GangSTR lê com --regions.",
        strsearch: "O formato que o STRsearch lê com --ref_bed.",
        bed4: "BED simples; a maioria das ferramentas que aceitam BED lê este.",
      },
      regionsPreview: "Ver as primeiras linhas",
      regionsPreviewHide: "Ocultar prévia",
      regionsPreviewError: "Não foi possível carregar a prévia.",
      regionsDetected: "Isto parece {format}, com {count} regiões. O STRhub tem um arquivo pronto nesse formato só com os loci que a amostra de referência cobre.",
      regionsUseLibrary: "Usar o arquivo do STRhub",
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
      detectTitle: "Detecte isto a partir de um arquivo de saída de exemplo",
      detectHint:
        "Se sua ferramenta já produziu um resultado, escolha esse arquivo e deduzimos o formato e a disposição das colunas para você. Ele é lido no seu navegador e nunca é enviado.",
      detectChoose: "Escolha um arquivo de saída de exemplo…",
      detectReading: "Lendo o arquivo…",
      detectError: "Não conseguimos ler esse arquivo. Escolha um arquivo de resultados em texto puro.",
      detectGzip:
        "Esse arquivo está compactado com gzip. Descompacte primeiro (gunzip) e escolha o arquivo em texto puro.",
      detectResult: "Detectamos {format}: {rows} linhas de dados.",
      detectLoci: "Encontramos {n} marcadores distintos: {sample}…",
      detectNote: {
        contentNeedsTabs:
          "As verificações de conteúdo leem colunas separadas por tabulação, então não conseguem inspecionar este formato. O formato em si continua sendo verificado.",
        vcfColumnsVary:
          "Deixamos as colunas por linha em branco: um VCF tem uma coluna por amostra, e a execução de verificação não terá a mesma quantidade do seu arquivo.",
        tooFewRows: "Poucas linhas para identificar a coluna de sequência com confiança.",
        noLocusColumn:
          "Nenhuma coluna parecia conter nomes de marcadores, então essas verificações ficaram em branco.",
        readsNotInferred:
          "Deixamos o mínimo de reads totais em branco de propósito: seu arquivo é uma execução completa, enquanto o STRhub verifica contra um recorte pequeno com muito menos reads.",
        truncated: "Apenas a primeira parte do arquivo foi lida.",
      },
      contentZeroBased:
        "As posições das colunas são contadas a partir de 0: a primeira coluna é 0. As linhas são separadas por tabulação e linhas que começam com # são ignoradas.",
      contentField: {
        columns: "Colunas por linha",
        columnsTip:
          "Cada linha de dados precisa ter exatamente esta quantidade de colunas separadas por tabulação. Uma linha com outra quantidade conta como malformada e reprova a verificação. Deixe em branco para pular.",
        dnaColumn: "Coluna de sequência",
        dnaColumnTip:
          "Posição da coluna com a sequência de DNA. O valor de cada linha deve ser apenas A, C, G, T ou N: basta uma linha fora disso para reprovar. As posições começam em 0.",
        countColumns: "Colunas de contagem de reads",
        countColumnsTip:
          "Posições das colunas inteiras com a contagem de reads, separadas por vírgula. Elas são somadas para dar a profundidade de cada linha, que é o que a verificação de reads totais conta. As posições começam em 0.",
        locusColumn: "Coluna do nome do marcador",
        locusColumnTip:
          "Posição da coluna com o nome do locus ou marcador. Tudo depois dos dois-pontos é descartado, então \"TH01:9\" conta como TH01. As posições começam em 0.",
        minDistinctLoci: "Marcadores distintos mínimos",
        minDistinctLociTip:
          "A execução precisa reportar pelo menos esta quantidade de marcadores diferentes. Mantenha igual ou abaixo do que o recorte de referência do STRhub cobre: é um piso, não uma meta.",
        minTotalReads: "Reads totais mínimos",
        minTotalReadsTip:
          "A soma das colunas de contagem em todas as linhas precisa alcançar pelo menos isto. Deixe em branco a não ser que saiba quanto o recorte de referência do STRhub rende: ele tem muito menos reads que uma execução completa.",
        expectLoci: "Marcadores que devem aparecer",
        expectLociTip:
          "Nomes de marcadores separados por vírgula. Todos eles precisam estar presentes ou a verificação falha, então liste apenas os que você tem certeza de que sua ferramenta reporta sobre os nossos dados de referência.",
      },
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
      rejectStoppedTitle: "Paramos antes de executar sua ferramenta",
      rejectOursTitle: "Este é nosso, não da sua ferramenta",
      rejectNotJudged:
        "Nenhum portão foi avaliado, então isto não diz nada sobre sua ferramenta: ela não chegou a rodar.",
      rejectCoverage:
        "Seu BED cobre {covered} de {total} loci suportados (são necessários pelo menos {min}).",
      rejectOutOfPanel: "{n} intervalo(s) caem fora do painel:",
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
    start: {
      eyebrow: "STRhub Verified",
      title: {
        owner: "Verificar minha ferramenta",
        reviewer: "Testar uma ferramenta para revisar um artigo",
        user: "É o meu ambiente, ou a ferramenta?",
      },
      lead: {
        owner: "Cole seu repositório. O STRhub lê, deduz como instalar e executar, e testa isso em um ambiente limpo. Nada é publicado até você dizer.",
        reviewer: "Cole o repositório que o manuscrito cita. Em poucos minutos você tem uma resposta simples: instala e roda como documentado? Sem código, sem conta, sem publicar nada.",
        user: "Cole o repositório da ferramenta. O STRhub mostra o que um ambiente limpo faz com ela, para distinguir uma falha da ferramenta de um problema na sua máquina.",
      },
      repoLabel: "Repositório público do GitHub",
      repoPlaceholder: "https://github.com/owner/tool",
      refLabel: "Versão, tag ou commit (opcional)",
      refPlaceholder: "v2.1.0, ou um SHA de commit",
      refHint: "Deixe vazio para usar o último release. Um artigo costuma citar um.",
      roleLabel: "Eu sou",
      role: {
        owner: "quem mantém a ferramenta",
        reviewer: "revisor de um artigo sobre ela",
        user: "alguém tentando executá-la",
      },
      cta: "Iniciar o teste",
      starting: "Iniciando…",
      advanced: "Avançado: escrever a receita manualmente",
      advancedHint: "Para mantenedores que querem controlar o Dockerfile, o comando e a saída esperada.",
      howItWorks: "O que acontece",
      steps: {
        read: "O STRhub lê o repositório no commit fixado: Dockerfile, arquivos de ambiente, README, dados de exemplo.",
        propose: "Propõe uma receita: como instalar, o que executar, sobre qual de seus datasets de referência abertos.",
        run: "Executa isso em um contêiner isolado, sem rede, e verifica o que saiu.",
        verdict: "Você recebe uma de quatro respostas: roda, falha, não foi possível determinar (com o que o README não diz), ou fora do escopo.",
      },
      noPublish: "Um teste não publica nada e é privado para quem tiver o link. Expira em 30 dias.",
      error: {
        not_a_github_repo: "Isso não é a URL de um repositório público do GitHub.",
        repo_not_found: "Esse repositório não existe ou não é público.",
        ref_not_found: "Essa versão, tag ou commit não está no repositório.",
        rate_limited: "Testes demais daqui por enquanto. Tente de novo mais tarde.",
        not_configured: "Os testes ainda não estão disponíveis neste servidor.",
        generic: "Não foi possível iniciar o teste. Tente de novo.",
      },
    },
    trial: {
      title: "Teste",
      of: "Teste de {repo} em {ref}",
      state: {
        pending: "Na fila. O GitHub Actions está pegando a execução.",
        queued: "Na fila. O GitHub Actions está pegando a execução.",
        in_progress: "Executando: instalando a ferramenta e rodando em um contêiner limpo. Costuma levar de 2 a 10 minutos.",
        completed: "Concluído.",
        expired: "O resultado deste teste expirou (resultados ficam 30 dias). Inicie um novo.",
        stalled: "Ainda sem execução depois de vários minutos. O GitHub pode estar ocupado; o link continua funcionando.",
      },
      elapsed: "Decorrido: {minutes} min",
      verdict: {
        runs: "Roda",
        fails: "Falha",
        undetermined: "Não foi possível determinar",
        out_of_scope: "Fora do escopo da verificação automática",
      },
      verdictMeaning: {
        runs: "Instalou a partir do código público e produziu a saída documentada em um ambiente limpo.",
        runsFallback: "Produziu sua saída documentada em um ambiente limpo — no ambiente publicado que o README indica, não em um build do commit fixado.",
        fails: "Não produziu. A evidência aponta para a ferramenta ou para sua forma documentada de executar.",
        undetermined: "O STRhub não conseguiu deduzir como executá-la a partir do repositório. É um achado sobre a documentação, não sobre o software.",
        out_of_scope: "Precisa de algo que o runner automático não pode fornecer. Uma verificação manual pode cobrir.",
      },
      gapsTitle: "O que o README não diz",
      knownIssuesTitle: "O que o autor documenta como problema conhecido",
      knownIssuesHint: "Citado do README do repositório no commit verificado. O STRhub não estabeleceu nada disso executando a ferramenta; é a nota do próprio autor sobre o próprio software.",
      knownIssuesLine: "README linha {line}",
      gapsHint: "Cada linha é algo que um desconhecido precisa antes de conseguir executar a ferramenta. Para um revisor são achados de revisão; para quem mantém, uma lista curta de pendências.",
      noReport: "A execução terminou sem produzir um relatório. Geralmente significa que parou antes da primeira etapa; o log da execução tem os detalhes.",
      runLink: "Abrir a execução no GitHub",
      recipeTitle: "O que foi executado",
      recipeHint: "Proposto pelo STRhub a partir do repositório. Cada suposição está listada nas ressalvas.",
      recipeCmd: "Comando",
      recipeDockerfile: "Ambiente (Dockerfile)",
      recipeRepoDockerfile: "O Dockerfile do próprio repositório foi construído como está.",
      recipeFallbackUsed: "O build do commit fixado falhou (veja o log de build). O que rodou é este ambiente de reserva: {reason}.",
      recipeFallbackAvailable: "Plano B, não foi preciso desta vez: se o build acima tivesse falhado, o STRhub teria usado {reason}.",
      recipeFallbackReason: "o ambiente de reserva que a receita declara",
      caveatsTitle: "Ressalvas: o que o STRhub supôs",
      logsTitle: "Logs",
      log: {
        build: "Build",
        external: "Execução com dados de referência do STRhub",
        own: "Execução com dados do repositório",
        example: "O exemplo do próprio README",
      },
      publish: "Publicar este resultado",
      publishHint: "Registra exatamente esta receita para um admin do STRhub aprovar. A aprovação executa a verificação real e lista a ferramenta no catálogo com um link permanente.",
      publishOnlyRuns: "Só um teste que terminou em \"Roda\" pode ser publicado com um clique. Corrija o que o relatório diz e teste de novo, ou use o formulário avançado.",
      published: "Registrado para aprovação como {slug}. Não precisa voltar; a aprovação inicia a execução.",
      publishError: {
        slug_taken: "Já existe uma ferramenta com esse nome e versão registrada para outro repositório.",
        verdict_not_runs: "Este teste não terminou em \"Roda\".",
        trial_not_finished: "O teste não terminou.",
        generic: "Não foi possível registrar o resultado. Tente de novo.",
      },
      share: "Compartilhe este link com o editor ou com outro revisor. Não precisa de conta.",
      again: "Testar outra ferramenta",
      asOwnerCta: "Você mantém esta ferramenta? Publique a partir desta página.",
      gates: "Etapas",
      example: "Reproduz o próprio exemplo",
      exampleMeaning: "o comando do próprio README produziu a saída documentada com os dados do próprio repositório",
      stoppedTitle: "O que impediu, e o que você pode fazer",
      stoppedHint: "Cada item é uma peça que faltou. Você pode fornecê-la e tentar de novo sem publicar nada, ou pedi-la a quem mantém a ferramenta no GitHub.",
      selfFix: "Eu adiciono e tento de novo",
      askOwner: "Pedir ao dono no GitHub",
      askOwnerHint: "Abre uma issue já redigida no repositório da ferramenta para você revisar e publicar. O STRhub não envia nada.",
      selfFixHint: "Abre a receita que o STRhub propôs, com tudo preenchido, na seção a completar. A próxima execução volta a ser um teste.",
      pdf: "Baixar o relatório PDF",
      html: "Abrir o relatório completo",
      scopeTitle: "Escopo deste relatório",
      scope1:
        "Verificação automática e independente de execução reprodutível. Confirma que a ferramenta instala, roda de ponta a ponta e produz saída estruturalmente válida em um ambiente padronizado.",
      scope2:
        "Não é uma validação analítica. A exatidão dos genótipos, a concordância, a aptidão forense e a conformidade regulatória estão fora do escopo.",
    },
    check: {
      title: "É o meu ambiente, ou a ferramenta?",
      lead: "Duas formas de saber. Se a ferramenta já está no catálogo, compare com o ambiente que a executou. Se não, teste em um contêiner limpo. Em qualquer caso, cole seu erro e o STRhub diz de que tipo é.",
      lookupLabel: "Procurar a ferramenta",
      found: "No catálogo",
      foundHint: "Estas execuções listam o ambiente exato, o comando e o log. Se o seu difere do que funcionou aqui, essa diferença é o primeiro lugar para olhar.",
      notFound: "Ainda não está no catálogo. Teste abaixo.",
      errorLabel: "Cole o erro que você vê",
      errorPlaceholder: "As últimas linhas do seu terminal…",
      errorCta: "O que é isso?",
      errorNone: "Nada que o STRhub reconheça. Compare seu comando e ambiente com uma execução que funcionou.",
      errorKind: {
        cmd_not_found: "O programa não está no seu PATH. Geralmente a instalação não terminou, ou o ambiente (conda, venv) não está ativado.",
        missing_module: "Falta um módulo Python: as dependências da ferramenta não estão instaladas no ambiente de onde você executa.",
        bad_option: "Um flag de linha de comando que a ferramenta não reconhece. Verifique a versão: flags mudam entre releases.",
        file_not_found: "A ferramenta não encontra um arquivo de entrada no caminho informado.",
        cannot_open: "A ferramenta não conseguiu abrir um arquivo. Verifique o caminho e se o arquivo é o que ela espera.",
        permission_denied: "Um problema de permissões na sua máquina, não da ferramenta.",
        oom: "O processo ficou sem memória na sua máquina.",
        requires_gpu: "A ferramenta precisa de GPU, que sua máquina pode não ter.",
        conda_unsatisfiable: "O conda não conseguiu resolver o ambiente: geralmente uma dependência que não resolve mais. É um achado sobre os pins da ferramenta.",
        pip_unresolvable: "O pip não encontrou uma dependência fixada. É um achado sobre os pins da ferramenta, não sobre seu ambiente.",
        missing_header: "Uma compilação C/C++ está sem uma biblioteca de desenvolvimento na sua máquina.",
      },
      seenHere: "O STRhub viu o mesmo tipo de erro quando executou esta ferramenta: provavelmente é a ferramenta, não você.",
      notSeenHere: "O STRhub não encontrou isso quando executou esta ferramenta: olhe primeiro o seu ambiente.",
      rehearse: "Testar em um contêiner limpo",
    },
  },
};

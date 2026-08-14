export default {
  verified: {
    title: "STRhub Verified",
    description:
      "Atestaciones independientes y automáticas de que una herramienta forense de STR se instala, corre de principio a fin y produce un output plausible, verificado sobre su código público en un commit fijado. No afirma exactitud de genotipos ni aptitud para casework.",
    summary: {
      heading: "Resumen",
      level: "Nivel",
      datasets: "Datasets",
      gatesPassed: "{passed}/{total} compuertas pasadas",
      datasetsUsed: "{count} dataset(s) de referencia",
      noDatasets: "Sin datasets",
      verifiedDate: "Verificado el {date}",
    },
    empty: "Todavía no hay atestaciones publicadas.",
    verifiedOn: "Verificado el",
    backToList: "Todas las herramientas verificadas",
    source: "Código",
    submittedBy: "Enviado por",
    submittedByValue: {
      maintainer: "El mantenedor de la herramienta",
      third_party: "Un tercero (no el mantenedor de la herramienta)",
    },
    thirdPartyShortfall:
      "Esta corrida la configuró un tercero, no quien mantiene la herramienta. Un resultado que no llega al escalón más alto puede reflejar esa configuración y no el software en sí.",
    submittedByThirdPartyNote:
      "Esta herramienta fue enviada a verificación por alguien que no es su mantenedor. El mantenedor no participó en la corrida ni aportó nada de lo que usó: el comando, el entorno y las regiones objetivo los eligió quien la envió. Si arriba figura un mantenedor, es quien responde por el software, no quien pidió este reporte, y no implica su respaldo.",
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
    group: {
      runs: "corridas de verificación",
      runSingular: "1 corrida de verificación",
    },
    panel: {
      autosomal: "STR autosómico",
      ont: "ONT CODIS",
      ystr: "Y-STR",
    },
    whatVerified: {
      verifiedHeading: "Qué se verificó",
      notHeading: "No se verificó",
      sourceAvailable: "Fuente disponible",
      installation: "Instalación exitosa",
      execution: "Ejecución completa",
      outputGenerated: "Salida generada",
      accuracy: "Precisión del genotipado",
      concordance: "Concordancia con verdad conocida",
      forensicValidity: "Validez forense",
      regulatory: "Cumplimiento normativo",
    },
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
      contentFailNote:
        "Nota: La verificación \"Plausible Output\" falló porque la salida no coincidió completamente con el patrón esperado de genotipos. Esto puede deberse a diferencias en parámetros, versión del tool, o configuración. No necesariamente indica un error grave.",
      stoppedEarlyNote:
        "Detenerse en este paso no es un hallazgo de que el software esté defectuoso. Registra hasta dónde llegó este intento en particular. Un software puede detenerse antes porque una dependencia que declara ya no está disponible, porque espera la entrada dispuesta de otra forma que la muestra de referencia, o porque el entorno automático no puede proveerle algo que necesita.",
      howToReadLink: "Cómo leer este resultado",
    },
    howToRead: {
      title: "Cómo leer un resultado",
      lede:
        "Un resultado es un registro fechado de qué pasó cuando STRhub instaló una herramienta forense de STR y la corrió, en una versión fija del código, sobre datos de referencia que el desarrollador no eligió. Se produce automáticamente y cualquiera puede repetirlo.",
      stoppedHeading: "Cuando un resultado se queda corto",
      stoppedBody:
        "Un resultado por debajo del paso más alto no es un hallazgo de que el software esté defectuoso. Registra hasta dónde llegó este intento en particular. Un software puede detenerse antes porque una dependencia que declara ya no está disponible, porque espera la entrada dispuesta de otra forma que la muestra de referencia, o porque el entorno automático no puede proveerle algo que necesita, como componentes con licencia comercial.",
      stoppedBody2:
        "Cada resultado indica dónde se detuvo y muestra los mensajes que había en pantalla en ese momento. Ese detalle es lo importante. El paso alcanzado es solo el titular.",
      canHeading: "Preguntas que un resultado sí responde",
      can1: "¿Está el código público en la versión que cita el manuscrito, hoy?",
      can2: "¿Puede alguien ajeno a los autores instalarlo con las instrucciones dadas?",
      can3: "¿Corre hasta el final sobre datos que los autores no eligieron?",
      can4: "¿Devuelve una salida que parece llamadas de marcadores reales?",
      can5: "¿Qué necesitó que un entorno estándar no pudo proveer?",
      can6: "¿Quién la envió a verificar: su mantenedor u otra persona?",
      cannotHeading: "Preguntas que no responde",
      cannot1: "¿Los genotipos son correctos?",
      cannot2: "¿Coincide con un perfil de referencia o con otro método?",
      cannot3: "¿Es apto para casework, o está acreditado para eso?",
      cannot4: "¿Es mejor o peor que otra herramienta?",
      cannot5: "¿Rinde como dice el manuscrito?",
      cannot6: "¿Su mantenedor respalda este resultado?",
      developerHeading: "Para un desarrollador",
      developerBody:
        "Un resultado describe un entorno, y un software que funciona en la máquina donde se escribió puede detenerse igual acá. Esa brecha suele ser la parte útil: es lo que se encuentra un usuario nuevo el primer día. Cada resultado enlaza el log completo y los comandos exactos, así que se puede reproducir en local.",
    },
    needed: {
      heading: "Lo que esta corrida necesitó además del repositorio",
      note: "El resultado de arriba describe una corrida configurada así. Quien quiera repetirla necesita lo mismo.",
    },
    caveats: {
      heading: "Notas de la lectura del repositorio",
      note: "Registradas automáticamente a partir de los archivos públicos de la herramienta al configurar esta corrida. No verificadas por ejecución, y no forman parte de los gates de arriba. Sirven para saber qué revisar a mano.",
    },
    log: {
      view: "Ver log de ejecución",
    },
    errorsBadgeSuffix: "(errores reportados)",
    install: {
      heading: "Por qué no se pudo construir el entorno",
      note: "El contenedor no se pudo construir con los pasos de instalación declarados, así que nada por debajo de la compuerta Installs llegó a correr.",
      faultStrhub:
        "Al menos una causa es de STRhub, no de la herramienta: la receta del contenedor de un entorno generado es nuestra. Nada de esto es un hallazgo sobre el software, y no hay nada que arreglar del lado de quien lo mantiene.",
      faultHarness:
        "Al menos una causa es un techo del entorno automático gratuito, no una falla de la herramienta.",
      faultAuthor:
        "Todas las causas identificadas están en lo que declaró la submission: sus versiones fijadas, nombres de paquetes o pasos de build. Son corregibles, y re-verificar después es gratis.",
      faultAuthorThirdParty:
        "Todas las causas identificadas están en lo que declaró la submission —sus versiones fijadas, nombres de paquetes o pasos de build— y esa submission la hizo un tercero, no quien mantiene la herramienta. Son fallas en cómo se configuró la herramienta acá, no en el software. Re-verificar después de corregirlas es gratis.",
      faultUnknown:
        "La causa no se pudo clasificar automáticamente. Abajo está el log completo del build.",
      viewBuildLog: "Ver log del build",
    },
    diagnostics: {
      heading: "Auto-diagnóstico",
      note: "Problemas detectados automáticamente del log de ejecución. Las sugerencias pueden ayudar a resolver fallas.",
      strhubNoteLabel: "STRhub Verified nota",
      logIssuesLabel: "Issues del log de ejecución",
      timesLabel: "{n}×",
      affectedLabel: "Afectados:",
      sliceCaveat:
        "Algunos de estos errores ocurrieron en la muestra de referencia de STRhub, que es un recorte alrededor de los loci del panel y no un genoma completo, así que pueden reflejar la cobertura de la muestra en vez de la herramienta.",
      structuralNote:
        "Los errores estructurales, como un archivo que no abre, un flag de línea de comandos no reconocido o una compilación incompleta, no dependen de la muestra: un recorte de cobertura limitada da menos reads, pero no puede causarlos. No son atribuibles a la muestra de referencia de STRhub.",
      demoDataRecommendation:
        "Un archivo de prueba pequeño en el repositorio de la herramienta le permite a un usuario nuevo correrla el primer día y verla funcionar antes de confiarle sus propios datos, y permite además verificarla contra la muestra del autor y no solo contra el recorte de STRhub. Publicar la salida que ese archivo debería producir ayuda igual de mucho: muestra cómo se supone que se ven los resultados, que es lo que hace falta para distinguir una corrida correcta de una que simplemente terminó.",
      sampleNote:
        "Estos mensajes reflejan el comportamiento observado durante la verificación con un pequeño slice de BAM de prueba provisto por STRhub. Con datos de secuenciación de cobertura completa, la herramienta debería genotipar significativamente más loci. Las advertencias no indican un problema con la herramienta en sí.",
      ids: {
        too_few_reads: { title: "Loci omitidos (muy pocas lecturas)", suggestion: "Algunos loci no tuvieron suficientes lecturas tras el filtrado de calidad. Probá reducir --min-reads o relajar los filtros de calidad. El BAM de entrada puede necesitar más cobertura en las regiones STR." },
        low_bq_reads: { title: "Lecturas filtradas por calidad de base", suggestion: "Muchas lecturas se están descartando por el filtro de calidad de base. Para HipSTR, usá --read-qual-trim '!' para bajar el umbral." },
        unpaired_reads: { title: "Lecturas filtradas (sin par)", suggestion: "Las lecturas sin par están siendo filtradas. Esto es común con slices de BAM donde los pares caen fuera de la región." },
        no_read_groups: { title: "BAM/CRAM sin read groups (@RG)", suggestion: "Agregá read groups con: samtools addreplacerg -r '@RG\\tID:sample\\tSM:sample' input.bam -o output.bam" },
        bad_bam: { title: "Archivo BAM inválido o truncado", suggestion: "El archivo BAM puede estar corrupto o incompleto. Volvé a descargarlo o reindexalo." },
        file_not_found: { title: "Archivo no encontrado", suggestion: "Verificá que la ruta del input coincida con el manifiesto y que el fixture se haya cargado correctamente." },
        cannot_open: { title: "No se pudo abrir el archivo", suggestion: "Verificá que la ruta exista y que el formato del archivo sea correcto." },
        segfault: { title: "La herramienta crasheó (segmentation fault)", suggestion: "Puede indicar datos de entrada incompatibles, un bug en la herramienta, o memoria insuficiente." },
        oom: { title: "Sin memoria", suggestion: "Probá reducir el tamaño de los datos de entrada o aumentar el timeout." },
        cmd_not_found: { title: "Comando no encontrado", suggestion: "Verificá que el Dockerfile lo instale y que el PATH incluya su ubicación." },
        zero_genotyped: { title: "No se genotipó ningún locus", suggestion: "Todos los loci fueron filtrados. Revisá filtros de calidad de lectura, umbrales mínimos, y cobertura de datos de entrada." },
        genotyping_summary: { title: "Resumen de genotipado", suggestion: "" },
        bad_option: { title: "Opción de línea de comando no reconocida", suggestion: "Revisá --help o el README de la herramienta para el nombre correcto de la opción." },
      },
    },
    content: {
      heading: "Contenido del output (evidencia de plausibilidad)",
      records: "Registros de secuencia",
      strLoci: "Loci STR detectados",
      snps: "SNPs de identidad (rsNNNN)",
      totalReads: "Reads totales",
      strLociList: "Loci STR",
    },
    data: {
      heading: "Datos de verificación",
      note: "Conjuntos de datos de referencia públicos utilizados como entrada para esta corrida de verificación. Provienen de repositorios de acceso abierto; ver las licencias upstream para los términos de uso.",
      lociTested: "Loci probados",
      lociCount: "loci STR forenses",
      lociScope: "Esta verificación cubre únicamente los loci STR listados arriba. La herramienta puede soportar loci adicionales no incluidos en este dataset de referencia.",
      refGenome: "Genoma ref.",
      noOwnData: "Esta herramienta no incluye datos propios de demo o prueba en su repositorio. STRhub corrió la verificación con un slice prearmado de datos de referencia públicos (listados abajo). Un archivo de prueba pequeño en el repositorio le permite a un usuario nuevo correr la herramienta el primer día y verla funcionar antes de confiarle sus propios datos, y permite además verificarla contra la muestra del propio autor y no solo contra esta. Publicar la salida que ese archivo debería producir ayuda igual de mucho: muestra cómo se supone que se ven los resultados.",
    },
    matrix: {
      heading: "Matriz de verificación",
      own: "Datos de prueba del tool",
      external: "Dataset de referencia",
      readme: "README",
      na: "N/A",
      pass: "OK",
      fail: "Falla",
      dataset: "Dataset",
      strhubFixture: "Fixture STRhub",
      strhubFixtureNote:
        "Esta herramienta no incluye datos propios de demo o prueba. La verificación usó un dataset provisto por STRhub. Se recomienda incluir un archivo de prueba pequeño en el repositorio para una verificación más completa y autocontenida.",
    },
    readme: {
      heading: "Chequeo de README (informativo)",
      note: "Checklist de presencia sobre el README de la herramienta, informativo, nunca pasa/falla.",
      install: "Instalación / armado del entorno",
      command: "Comando para correr",
      input: "Input esperado",
      output: "Output producido",
      deps: "Dependencias / versiones",
    },
    manual: {
      heading: "Verificación manual disponible",
      pageTitle: "Verificación manual",
      pageSubtitle:
        "La verificación automática no pudo ejecutarse para esta herramienta. STRhub puede correrla a mano y emitir un certificado aparte.",
      backToReport: "Volver a la atestación",
      whyHeading: "Por qué no aplica la corrida automática",
      notAFault:
        "Es un límite del entorno automático, no una falla encontrada en tu herramienta. La verificación automática gratuita sigue disponible y sin cambios para las herramientas que sí puede correr.",
      whatItIs:
        "La verificación manual es un servicio aparte y pago: STRhub corre la herramienta a mano y emite un certificado etiquetado explícitamente como verificación manual, nunca presentado como una atestación automática.",
      cta: "Solicitar verificación manual",
      reasonCodeLabel: "Código de elegibilidad:",
      toolLabel: "Herramienta",
      whatYouGetHeading: "Qué incluye la verificación manual",
      whatYouGet1:
        "STRhub corre tu herramienta a mano en un entorno que cumple sus requisitos, y deja registrado lo que se hizo.",
      whatYouGet2:
        "Un certificado etiquetado explícitamente como verificación manual, indicando el entorno, los datos usados y la fecha.",
      whatYouGet3:
        "Los mismos límites de alcance que la atestación automática: solo ejecución reproducible, sin afirmar exactitud de genotipos ni aptitud para casework.",
      emailCta: "Enviar la solicitud por correo",
      emailHint:
        "Abre tu cliente de correo con la herramienta y el código de elegibilidad ya cargados.",
      mailSubject: "Solicitud de verificación manual",
      mailIntro:
        "Hola, quisiera solicitar la verificación manual para la herramienta que figura abajo.",
      notEligibleHeading: "Acá todavía aplica la verificación automática gratuita",
      notEligibleBody:
        "Esta herramienta no chocó contra un límite del entorno automático, así que la verificación manual no corresponde. Si una corrida falló, el reporte indica qué salió mal y cómo corregirlo. Las correcciones a un envío se pueden volver a correr gratis todas las veces que haga falta.",
      freeHelp:
        "¿Trabado con el formulario o no sabés qué pide un campo? Eso es documentación nuestra por mejorar, no un motivo para pagar: escribinos y te ayudamos sin costo.",
      freeHelpCta: "Pedir ayuda (gratis)",
      helpMailSubject: "Ayuda con el formulario de STRhub Verified",
      reasons: {
        requires_gui:
          "La herramienta necesita una pantalla gráfica o un paso interactivo. El runner automático es headless y corre desatendido, así que no puede ejecutar ni evidenciar ese paso.",
        requires_gpu:
          "La herramienta necesita GPU. Los runners públicos de CI son solo CPU, así que el entorno automático no puede proveerla.",
        requires_runtime_network:
          "La herramienta descarga datos por red mientras corre. Una atestación es un snapshot fijado, así que lo que se baje en tiempo de ejecución no se puede registrar ni reproducir.",
        requires_licensed_reference:
          "La herramienta necesita datos de referencia licenciados o restringidos que no pueden publicarse en una corrida pública de verificación.",
        requires_unsupported_os:
          "La herramienta necesita un sistema operativo que el runner automático no provee.",
        opaque_output_format:
          "La herramienta escribe una salida binaria o propietaria sin exportación en texto o tabular, así que las compuertas automáticas de IO y contenido no pueden inspeccionarla.",
        oom: "La corrida agotó la memoria del runner de CI. El entorno automático tiene un presupuesto de memoria fijo que no se puede subir desde el formulario.",
        disk_full:
          "La corrida llenó el disco del runner de CI. El entorno automático tiene un presupuesto de disco fijo que no se puede subir desde el formulario.",
        runtime_network:
          "La herramienta buscó la red mientras corría. Una atestación es un snapshot fijado, así que lo que se baje en tiempo de ejecución no se puede registrar ni reproducir.",
        requires_license:
          "La herramienta necesita una licencia o datos licenciados que no pueden publicarse en una corrida pública de verificación.",
      },
    },
    submit: {
      preflightTitle: "¿Tu herramienta necesita algo que no podemos darle?",
      preflightHint:
        "Marcá una casilla solo si es cierto para tu herramienta. Son cosas que el runner automático genuinamente no puede hacer: es headless, solo CPU, y tiene memoria y disco fijos. Si no aplica ninguna, dejalas todas sin marcar. Si simplemente no estás seguro de algún campo de este formulario, no toques esto y escribinos: las dudas del formulario se responden gratis.",
      preflight: {
        requires_gui:
          "Necesita una pantalla gráfica o un paso interactivo (no puede correr desatendida).",
        requires_gpu: "Necesita GPU (CUDA).",
        requires_runtime_network:
          "Descarga datos por red mientras corre (descargar durante el build está bien).",
        requires_licensed_reference:
          "Necesita datos de referencia licenciados o restringidos que no pueden hacerse públicos.",
        requires_unsupported_os:
          "Necesita Windows, macOS u otro sistema operativo distinto de Linux.",
        opaque_output_format:
          "Su salida es binaria o propietaria, sin exportación en texto o tabular.",
      },
      preflightBlockedTitle: "La corrida automática no puede verificar esta herramienta",
      preflightBlockedBody:
        "Por lo que marcaste, el entorno automático no puede correr tu herramienta, así que enviar solo gastaría una corrida en la falla que ya describiste. La verificación manual existe exactamente para este caso.",
      cta: "Verificar una herramienta",
      title: "Verificar una herramienta",
      subtitle:
        "Certificación self-service de que tu herramienta se instala y corre de principio a fin sobre su código público en un commit fijado.",
      disclaimerSnapshot:
        "El resultado es una foto fechada. Podés volver el repo privado después. La atestación registra las condiciones del momento del run.",
      disclaimerNoSource:
        "STRhub nunca guarda tu código fuente. El Dockerfile clona tu repo público en el commit fijado solo en build time.",
      required: "obligatorio",
      optional: "opcional",
      sectionTool: "Herramienta",
      sectionSource: "Código público",
      sectionSourceHint: "El repositorio público de GitHub donde está el código fuente de tu herramienta.",
      sectionEnv: "Entorno",
      sectionRun: "Ejecución",
      sectionInputs: "Datos de entrada",
      sectionInputsHint:
        "Indicá el tipo de assay y la ruta del archivo de prueba en tu repositorio público. STRhub corre tu herramienta con esos datos. Si tenemos un dataset de referencia open source compatible, sumaremos una segunda corrida para una capa extra de validación.",
      referenceDatasetsTitle: "Datasets de referencia STRhub (open access, solo loci STR)",
      referenceDatasetsIntro:
        "Para tipos de assay compatibles, STRhub también prueba tu herramienta con un dataset STR de referencia open source. Hoy hay dos:",
      referenceDatasetsIntro3:
        "Para tipos de assay compatibles, STRhub también prueba tu herramienta con un dataset STR de referencia open source. Hoy hay tres:",
      referenceDatasetsIntro4:
        "Para tipos de assay compatibles, STRhub también prueba tu herramienta con un dataset STR de referencia open source. Hoy hay cuatro:",
      referenceDatasetIllumina:
        "NIST Forensic DNA Open Dataset (ForenSeq y PowerSeq 46GY, uso investigación/educación)",
      referenceDatasetOnt:
        "slice CODIS 1000 Genomes ONT (open access en AWS)",
      referenceDatasetIlluminaBamDesc:
        "slice GIAB NA12878 300x hg38 (open access, 24 loci autosomales forenses)",
      referenceDatasetIlluminaBamYDesc:
        "slice GIAB HG002 300x hg38 (open access, 14 loci Y-STR)",
      referenceDatasetsScope:
        "No hay datasets de referencia para paneles SNP, ONT FASTQ crudo ni capilar FSA/HID. Para esos tipos, la verificación usa solo tu archivo (no es un fallo). STRhub no es custodio de datos. Aplican las licencias upstream.",
      inputTypeGroupWithReference: "Datasets STRhub de referencia",
      inputTypeGroupOwnOnly: "Solo tu archivo de prueba",
      inputTypeGroupAdvanced: "Avanzado",
      inputTypeSuffixWithReference: ", incluye test STRhub",
      inputTypeSuffixOwnOnly: ", solo tu fixture",
      sectionOutputs: "Output esperado",
      sectionOutputsHint:
        "Indicá qué archivo escribe tu comando de ejecución y qué tipo de datos contiene. No hace falta conocer el motor de STRhub, solo la documentación de tu herramienta.",
      name: "Nombre de la herramienta",
      submitterRole: "Tu relación con esta herramienta",
      submitterRoleTooltip:
        "Todo lo que sigue —el comando, el entorno, las regiones— se publica como parte de la atestación, y esto es lo que dice de quién fueron esas decisiones. Una cuenta de GitHub dice quién es dueño de un repositorio; nunca dice quién completó este formulario.",
      submitterRoleOption: {
        maintainer: "Mantengo esta herramienta",
        third_party: "No soy su mantenedor",
      },
      submitterRoleDesc: {
        maintainer:
          "La escribiste vos o respondés por ella. La atestación registra que la envió su mantenedor.",
        third_party:
          "Estás verificando una herramienta ajena. La atestación lo dice, y registra que su mantenedor no participó ni aportó la configuración.",
      },
      maintainer: "Mantenedor",
      maintainerThirdParty: "Mantenedor de la herramienta (no vos)",
      maintainerThirdPartyNote:
        "Se publica como la persona que responde por el software, junto con la aclaración de que no participó en esta verificación.",
      contact: "Contacto (issue tracker o email)",
      repo: "URL del repo público de GitHub",
      ref: "Commit SHA o tag de release (inmutable)",
      refHint: "Un hash de commit específico o un tag. Asegura que siempre se teste exactamente el mismo código.",
      fetchLastSha: "Traer el último commit SHA",
      useLatestTag: "Usar el último tag de release ({tag})",
      versionDerived: "Se registrará en la atestación como versión {version}.",
      repoLookupLoading: "Leyendo el repositorio…",
      repoLookupError:
        "No pudimos leer ese repositorio. Revisá la URL: tiene que ser un repo público de GitHub. Igual podés completar el formulario a mano.",
      lockedUntilSource:
        "Completá primero el código público de arriba. El resto del formulario se arma a partir de tu repositorio y del commit que fijes.",
      prefillConflictTitle: "¿Dejamos lo que escribiste o usamos los datos del repositorio?",
      prefillConflictBody:
        "Estos campos ya tenían un valor, así que no cambiamos nada. Esto es lo que encontramos:",
      prefillAccept: "Usar estos valores",
      prefillKeep: "Dejar los míos",
      preflightSummaryNone: "Nada marcado: la verificación automática aplica a esta herramienta.",
      preflightSummarySelected: "{n} marcado(s).",
      reuseTitle: "Reutilizar una verificación anterior",
      reuseHint:
        "Este repositorio ya fue verificado antes. Traé esas respuestas y cambiá solo lo que se movió.",
      reuseGroup: {
        env: "Entorno",
        inputs: "Datos de entrada",
        run: "Ejecución",
        outputs: "Salida esperada",
      },
      reuseApply: "Reutilizar",
      reuseShowMore: "Ver {n} verificación(es) más",
      reuseApplied:
        "Respuestas recuperadas de esa verificación. Revisalas antes de enviar: el commit que fijaste arriba queda intacto.",
      reuseUnavailable:
        "No pudimos cargar la configuración de esa verificación. Puede ser anterior al guardado de envíos: completá el formulario a mano.",
      reuseRegionsFile: "regions.bed (reutilizado de una verificación anterior)",
      autoConfigTitle: "Configuración automática",
      autoConfigHint:
        "Opcional. Leemos tu repositorio en el commit que fijaste y proponemos las respuestas de abajo. No se rellena nada hasta que lo hayas revisado.",
      autoConfigSummaryIdle: "Sin usar — rellena el formulario a mano, o deja que propongamos las respuestas.",
      autoConfigSummaryApplied: "Aplicada. Revisa cada campo antes de enviar.",
      autoConfigOwnDockerfile: "Yo aporto el Dockerfile",
      autoConfigDockerfileHint:
        "Pega el Dockerfile completo. STRhub lo construye sin modificarlo, así que no se supone nada sobre tu entorno.",
      autoConfigSampleLabel: "Archivo de resultados de una ejecución anterior",
      autoConfigLocalOnly:
        "Se lee en tu navegador para deducir el formato de salida y la disposición de columnas. El archivo no se sube nunca.",
      autoConfigSampleApplied: "Leído {file} — la sección de salida esperada queda rellenada.",
      autoConfigGenerate: "Configurar automáticamente",
      autoConfigUseSaved: "Usar una configuración guardada ({n})",
      autoConfigWorking: "Leyendo el repositorio y deduciendo cómo se compila y se ejecuta tu herramienta. Puede tardar un par de minutos.",
      autoConfigAppliedNote:
        "Respuestas rellenadas desde la configuración automática. Revísalas antes de enviar — el commit que fijaste arriba no se toca.",
      autoConfigReview: "Revisar",
      autoConfigReviewHint:
        "Todo esto se ha leído de tu repositorio. Marca los grupos que quieras, comprueba los valores y rellena el formulario.",
      autoConfigExactRef: "Este mismo commit",
      autoConfigFromRef: "Generada desde {ref}",
      autoConfigMayBeStale: "puede estar desactualizada",
      autoConfigOldVersion: "generada por una versión anterior",
      autoConfigWhatIsSent:
        "A nuestro servidor solo se envían la URL del repositorio y el commit. Tu archivo de resultados y tu Dockerfile se leen en tu navegador y no salen de ahí.",
      autoConfigStaleTitle: "Los archivos de compilación han cambiado desde que se generó",
      autoConfigStaleBody:
        "Un Dockerfile, manifiesto o Makefile es distinto en el commit que fijaste. Las respuestas de entorno pueden haber dejado de ser correctas — revísalas, o vuelve a configurar.",
      autoConfigNotFound: "No aparece en el repositorio",
      autoConfigApplies: "Se aplica a esta herramienta",
      autoConfigCaveats: "Conviene comprobarlo a mano",
      autoConfigApply: "Rellenar el formulario",
      autoConfigCancel: "Cancelar",
      autoConfigHigh: "Con cita",
      autoConfigLow: "Incierto",
      autoConfigGroup: {
        tool: "Herramienta",
        env: "Entorno",
        run: "Ejecución",
        inputs: "Datos de entrada",
        outputs: "Salida esperada",
        compat: "Limitaciones",
      },
      autoConfigRepoNotFound: "No hemos podido leer ese repositorio. Comprueba que es público y que la URL es correcta.",
      autoConfigRefNotFound: "Ese commit o etiqueta no existe en el repositorio.",
      autoConfigEmptyRepo: "Ese repositorio parece vacío en el commit que fijaste.",
      autoConfigDeclined: "No hemos podido configurar este repositorio automáticamente. Rellena el formulario a mano.",
      autoConfigDisabled: "La configuración automática no está disponible ahora mismo.",
      autoConfigFailed: "La configuración automática ha fallado. Inténtalo de nuevo, o rellena el formulario a mano.",
      refTooltip:
        "En GitHub, abrí tu repositorio público. Para una release: andá a Releases y copiá el nombre del tag (ej. v3.0). Para un commit: en Code, abrí el historial, elegí un commit y copiá el SHA completo (40 caracteres) o el hash corto que aparece arriba. Pegalo acá. STRhub clonará siempre esa versión exacta.",
      refTooltipAria: "Cómo encontrar un commit SHA o tag de release en GitHub",
      dockerMode: "¿Cómo se debe construir el entorno?",
      dockerModeTooltip:
        "STRhub corre tu herramienta dentro de Docker. Generámelo: elegís lenguaje y comando de instalación; STRhub escribe el Dockerfile, clona tu repo en el ref fijado y ejecuta el build. Yo aporto un Dockerfile: pegás un Dockerfile completo y STRhub lo construye tal cual. Usalo si ya tenés uno o necesitás control total.",
      dockerModeTooltipAria: "Qué significa cada opción de armado del entorno",
      dockerProvided: "Yo aporto un Dockerfile",
      dockerGenerated: "Generámelo",
      dockerProvidedHint: "Pegá un Dockerfile completo (camino A, máximo control).",
      dockerGeneratedHint:
        "STRhub arma el Dockerfile desde una plantilla (camino B, pip/conda/make).",
      dockerfile: "Contenido del Dockerfile",
      language: "Lenguaje / stack",
      needsBuild: "Mi herramienta necesita compilarse desde el código fuente",
      needsBuildHint:
        "Marcalo si tu herramienta tiene que compilarse o instalarse antes de poder correr: pip install, make, cargo build. Dejalo sin marcar para un script o un binario ya commiteado que corre directo desde el clone.",
      buildCmd: "Comando de build / install",
      buildCmdTooltip:
        "Comando que STRhub ejecuta al construir la imagen Docker, después de clonar tu repo. Suele ser tu instalación: pip install, make, conda env create, etc. Si falla, la verificación se detiene en la compuerta Installs.",
      buildCmdTooltipAria: "Para qué sirve el comando de build o install",
      buildCmdNone: "sin paso de build",
      checkCmd: "Comando de sanity check en build",
      checkCmdTooltip:
        "Opcional. Un comando corto que se corre una vez durante el build para confirmar que la instalación funcionó, ej. mytool --help o mytool --version. Dejalo vacío si no estás seguro.",
      checkCmdTooltipAria: "Para qué sirve el sanity check en build",
      cmd: "Comando de ejecución (lee /data/in, escribe /data/out)",
      cmdTooltip:
        "Comando que STRhub ejecuta dentro del contenedor al verificar. Los inputs están en solo lectura bajo /data/in/; escribí outputs bajo /data/out/. Usá rutas del contenedor, no de tu computadora ni del árbol de GitHub.",
      cmdTooltipAria: "Qué es el comando de ejecución y cómo funcionan las rutas",
      cmdReplaceMytool: "Reemplazá \"mytool\" por el binario o comando real de tu herramienta (ej. hipstr, strait_razor, toastr). El resto de las rutas están correctas.",
      cmdFetchingReadme: "Leyendo el README de tu repo…",
      cmdSuggestFromReadme: "Sugerido desde tu README — hacé click para usar:",
      cmdHint: "Tu herramienta lee los datos de /data/in/ y escribe la salida en /data/out/.",
      cmdHintWithRef: "Tu herramienta lee los datos de /data/in/, el genoma de referencia de {mountPath}, y escribe la salida en /data/out/.",
      refGenomeTitle: "Genoma de referencia: {assembly}",
      refGenomeDescription: "STRhub provee automáticamente el genoma de referencia indexado y listo en {mountPath}. Usá esta ruta para --fasta o el parámetro equivalente en tu comando de ejecución.",
      refGenomeNote: "El genoma de referencia ({assembly}) se descarga, indexa y monta automáticamente por STRhub.",
      canonicalPathsTitle: "Usá estas rutas estándar en tu comando de ejecución",
      canonicalPathsDescription: "STRhub renombra todos los archivos de entrada a nombres estándar para que el mismo comando funcione tanto con tus datos como con nuestro dataset de referencia. Usá exactamente estas rutas:",
      sliceNoticeTitle: "Nuestra muestra de referencia es un slice, no un genoma completo",
      sliceNoticeBody:
        "STRhub no aloja genomas completos. Los datos de referencia de este tipo de entrada son un extracto pequeño alrededor de marcadores STR forenses. Una herramienta apuntada fuera de esos marcadores no encuentra lecturas ahí, así que la corrida no dice nada sobre la herramienta.",
      sliceNoticeDownload: "Descargar las coordenadas soportadas (BED, GRCh38)",
      timeout: "Timeout (minutos)",
      inputType: "¿Qué tipo de datos recibe tu herramienta?",
      inputTypeSelect: "Seleccioná el tipo de input",
      inputTypeDescIlluminaStrFastq:
        "FASTQ Illumina MiSeq/MiniSeq STR: Verogen ForenSeq o Promega PowerSeq 46GY (los únicos dos kits en nuestro dataset NIST de referencia por ahora)",
      inputTypeDescOntBamHg38: "BAM Oxford Nanopore alineado a hg38 (regiones CODIS)",
      inputTypeDescIlluminaBamHg38: "BAM Illumina WGS alineado a hg38 (loci STR autosomales forenses)",
      inputTypeDescIlluminaBamHg38Y: "BAM Illumina WGS alineado a hg38 (loci STR del cromosoma Y)",
      inputTypeDescOntFastq: "FASTQ crudo Oxford Nanopore",
      inputTypeDescIlluminaSnpFastq: "FASTQ Illumina para paneles SNP de identidad/ancestría",
      inputTypeDescCapillaryFsa: "Archivos de electroforesis capilar ABI .fsa o .hid",
      inputTypeOther: "Otro (lo escribo yo)",
      inputTypeCustom: "Slug personalizado del tipo de input",
      inputTypeCustomHint:
        "Un identificador corto, ej. 'pacbio-hifi-bam'. No hay dataset STRhub para tipos custom.",
      externalNoteIllumina:
        "STRhub correrá 2 pruebas: con tu archivo y con datos Illumina STR del NIST mds2-2157. Nuestro dataset NIST cubre solo ForenSeq y PowerSeq 46GY. Usá reads que coincidan con tu kit en tu propio fixture.",
      externalNoteOnt:
        "STRhub correrá 2 pruebas: con el BAM de prueba del repositorio de la herramienta (si fue incluido) y con un slice CODIS 1000 Genomes ONT hg38 (~30 MB).",
      externalNoteIlluminaBam:
        "STRhub correrá 2 pruebas: con el BAM de prueba del repositorio de la herramienta (si fue incluido) y con un slice GIAB NA12878 300x hg38. El dataset de referencia cubre 24 loci STR autosomales forenses (muestra femenina, sin marcadores Y).",
      externalNoteIlluminaBamY:
        "STRhub correrá 2 pruebas: con el BAM de prueba del repositorio de la herramienta (si fue incluido) y con un slice GIAB HG002 300x hg38. El dataset de referencia cubre 14 loci Y-STR forenses (muestra masculina).",
      externalNoteOwnOnly:
        "STRhub correrá 1 prueba solo con tu archivo. No hay dataset STRhub para este tipo de input (no es un fallo).",
      fixtureLabel: "Tu archivo de prueba (obligatorio)",
      fixtureLabelRecommended: "Tu archivo de prueba (recomendado)",
      fixtureExplainer:
        "Obligatorio. Indicá un archivo pequeño y accesible públicamente en el ref que indicaste.",
      fixtureExplainerOptional:
        "Recomendado. Para una verificación más completa, indicá un archivo de prueba en tu repo — STRhub correrá tanto con tus datos como con nuestro dataset de referencia. Si tu repo no incluye datos de prueba, dejalo vacío y STRhub correrá solo con nuestro dataset de referencia.",
      fixtureRequiredError: "Se requiere un archivo de prueba para este tipo de input (no hay dataset de referencia STRhub disponible).",
      fixtureSameRepo: "Está en el repo de mi herramienta",
      fixtureOtherRepo: "Está en otro repo",
      fixtureNone: "No tengo archivo de prueba",
      fixtureNoneNote:
        "STRhub verificará tu herramienta solo con nuestro dataset de referencia. Es un resultado válido, apenas más acotado: muestra que tu herramienta corre con nuestros datos, no con los tuyos.",
      fixtureSameRepoNote: "Usando repo {repo} en ref {ref}.",
      fixturePathInRepo: "Ruta al archivo de prueba en el repo",
      fixturePathInRepoTooltip:
        "Ruta a tu archivo de prueba pequeño dentro del repo y ref que indicaste, relativa a la raíz del repo. Ejemplo: test/data/sample.fastq. El archivo debe existir en ese ref en GitHub para que STRhub pueda obtenerlo.",
      fixturePathInRepoTooltipAria: "Cómo indicar la ruta del archivo de prueba en el repositorio",
      fixturePathHint: "Ruta relativa desde la raíz del repo, ej. test/data/sample.fastq",
      fixtureRepo: "URL del repo con datos de prueba",
      fixtureRef: "Commit / tag",

      // Regions BED — obligatorio para herramientas que trabajan por coordenadas.
      regionsLabel: "Tu archivo BED de regiones",
      regionsExplainer:
        "Obligatorio para herramientas que trabajan sobre BAM. Cada herramienta espera su propio formato de BED (HipSTR, GangSTR y otras usan columnas distintas), así que el BED lo definís vos. STRhub aporta las coordenadas: descargá el panel de abajo, convertilo al formato de tu herramienta y subilo.",
      regionsUploadLabel: "Subí tu BED",
      regionsUploadPlaceholder: "Elegí un archivo .bed…",
      regionsUploadHint:
        "El archivo que armaste a partir del panel de arriba, en el formato de tu herramienta. Texto plano .bed — no comprimido. Lo validamos contra el panel acá antes de enviar.",
      regionsGzip:
        "Ese archivo está comprimido (gzip). Descomprimilo primero (gunzip) y subí el .bed en texto plano.",
      supportedLociTitle: "Loci soportados por nuestra muestra ({count})",
      supportedLociExplainer:
        "Nuestra muestra de prueba es un recorte alrededor de estos loci forenses, no un genoma completo. Tu BED debe apuntar dentro de estas regiones: fuera de ellas no hay lecturas y tu herramienta no podría llamar nada.",
      supportedLociDownload: "Descargar coordenadas (BED, GRCh38)",
      panelLoading: "Cargando los loci soportados…",
      panelError:
        "No pudimos cargar el panel de loci soportados. Podés enviar igual: STRhub validará tu BED antes de correr.",
      regionsMalformed: "El BED tiene un formato inválido:",
      regionsMalformedGeneric: "No pudimos interpretar ese archivo como un BED.",
      regionsUnconverted:
        "Esto parece nuestro panel de coordenadas, subido tal cual. Las coordenadas están bien, pero las columnas siguen siendo las nuestras — la mayoría de las tools (HipSTR, GangSTR) esperan su propio formato y lo rechazarían. Convertilo al formato de tu tool antes de correr.",
      regionsRepoTip:
        "Tip: commiteá este BED en el repo de tu tool (ej. regions/strhub-verified.bed) para que quienes la usen tengan las regiones exactas de esta atestación. STRhub verifica el archivo que subís acá, no la copia del repo.",
      regionsOk: "Tu BED cubre {covered} de {total} loci soportados. Listo para verificar.",
      regionsRejectedTitle: "Este BED apunta fuera de nuestra muestra",
      regionsRejectedExplainer:
        "Estas regiones no están cubiertas por nuestro recorte, así que tu herramienta no encontraría lecturas ahí. No es un problema de tu herramienta: ajustá el BED al panel de arriba.",
      regionsLinePrefix: "línea {line}:",
      regionsAndMore: "…y {n} más.",
      regionsTooFewLoci:
        "Tu BED cubre {covered} loci soportados; necesitamos al menos {min} para verificar.",
      regionsRequiredError: "Indicá tu archivo BED de regiones para este tipo de input.",
      outputPath: "Nombre del archivo de salida (patrón)",
      outputPathHint:
        "El nombre (o patrón) del archivo que tu herramienta escribe en /data/out/, ej. *.allsequences.txt o result.vcf.",
      outputPathTooltip:
        "Usá el mismo nombre o comodín que crea tu comando dentro del contenedor. STRhub busca ese archivo después del run. No tiene que coincidir con la extensión del campo siguiente.",
      outputPathTooltipAria: "Cómo indicar el archivo de salida que produce tu herramienta",
      outputFormat: "Tipo de contenido del output",
      outputFormatHint:
        "Cómo está armado por dentro, no necesariamente la extensión. Columnas separadas por tab → TSV (aunque termine en .txt).",
      outputFormatTooltip:
        "Elegí la estructura que coincide con el output de tu herramienta. TSV: columnas separadas por tab (STRait Razor .allsequences.txt es TSV). CSV: separado por comas. VCF: variantes. JSON: datos JSON. Text: líneas simples sin parser de tabla.",
      outputFormatTooltipAria: "Cómo elegir el tipo de contenido del output",
      outputFormatOptions: {
        tsv: "TSV (columnas separadas por tab)",
        csv: "CSV (columnas separadas por coma)",
        vcf: "VCF (variant call format)",
        json: "JSON",
        text: "Texto plano (líneas, sin tabla)",
      },
      minRecords: "Registros mínimos",
      detectTitle: "Detectalo desde un archivo de salida de ejemplo",
      detectHint:
        "Si tu herramienta ya produjo un resultado, elegí ese archivo y deducimos el formato y la disposición de columnas por vos. Se lee en tu navegador y nunca se sube.",
      detectChoose: "Elegí un archivo de salida de ejemplo…",
      detectReading: "Leyendo el archivo…",
      detectError: "No pudimos leer ese archivo. Elegí un archivo de resultados en texto plano.",
      detectGzip:
        "Ese archivo está comprimido con gzip. Descomprimilo primero (gunzip) y elegí el archivo en texto plano.",
      detectResult: "Detectamos {format}: {rows} filas de datos.",
      detectLoci: "Encontramos {n} marcadores distintos: {sample}…",
      detectNote: {
        contentNeedsTabs:
          "Las verificaciones de contenido leen columnas separadas por tabulaciones, así que no pueden inspeccionar este formato. El formato en sí se sigue verificando.",
        vcfColumnsVary:
          "Dejamos en blanco las columnas por fila: un VCF tiene una columna por muestra, y la corrida de verificación no tendrá la misma cantidad que tu archivo.",
        tooFewRows: "Muy pocas filas para identificar la columna de secuencia con confianza.",
        noLocusColumn:
          "Ninguna columna parecía contener nombres de marcadores, así que dejamos en blanco esas verificaciones.",
        readsNotInferred:
          "Dejamos en blanco el mínimo de reads totales a propósito: tu archivo es una corrida completa, mientras que STRhub verifica contra un recorte pequeño con muchos menos reads.",
        truncated: "Solo se leyó la primera parte del archivo.",
      },
      contentZeroBased:
        "Las posiciones de columna se cuentan desde 0: la primera columna es 0. Las filas se separan por tabulaciones y las líneas que empiezan con # se ignoran.",
      contentField: {
        columns: "Columnas por fila",
        columnsTip:
          "Cada fila de datos debe tener exactamente esta cantidad de columnas separadas por tabulaciones. Una fila con otra cantidad cuenta como malformada y hace fallar la verificación. Dejalo en blanco para omitirla.",
        dnaColumn: "Columna de secuencia",
        dnaColumnTip:
          "Posición de la columna con la secuencia de ADN. El valor de cada fila debe ser solo A, C, G, T o N: basta una fila que no lo sea para que falle. Las posiciones empiezan en 0.",
        countColumns: "Columnas de conteo de reads",
        countColumnsTip:
          "Posiciones de las columnas enteras con el conteo de reads, separadas por comas. Se suman para dar la profundidad de cada fila, que es lo que cuenta la verificación de reads totales. Las posiciones empiezan en 0.",
        locusColumn: "Columna del nombre del marcador",
        locusColumnTip:
          "Posición de la columna con el nombre del locus o marcador. Se descarta todo lo que siga a los dos puntos, así que \"TH01:9\" cuenta como TH01. Las posiciones empiezan en 0.",
        minDistinctLoci: "Marcadores distintos mínimos",
        minDistinctLociTip:
          "La corrida debe reportar al menos esta cantidad de marcadores diferentes. Mantenelo en o por debajo de lo que cubre el recorte de referencia de STRhub: es un piso, no una meta.",
        minTotalReads: "Reads totales mínimos",
        minTotalReadsTip:
          "La suma de las columnas de conteo en todas las filas debe llegar al menos a esto. Dejalo en blanco salvo que sepas cuánto rinde el recorte de referencia de STRhub: tiene muchos menos reads que una corrida completa.",
        expectLoci: "Marcadores que deben aparecer",
        expectLociTip:
          "Nombres de marcadores separados por comas. Todos y cada uno deben estar presentes o la verificación falla, así que listá solo los que estés seguro de que tu herramienta reporta sobre nuestros datos de referencia.",
      },
      contentToggle: "Chequear plausibilidad del contenido (recomendado)",
      contentToggleTooltip:
        "Recomendado. Verifica que el output parezca genotipos plausibles —suficientes loci reconocibles y los loci que esperás— no solo un archivo no vacío. Pasarlo otorga el badge más fuerte \"Plausible output\". Desmarcalo para verificar solo el formato.",
      contentToggleTooltipAria: "Qué hace el chequeo de plausibilidad de contenido",
      contentDefaultsHint:
        "Pre-rellenado con valores sensatos según el formato de salida y el assay elegidos. Editá cualquier campo para ajustarlo a tu herramienta, o vacialo para omitir ese chequeo.",
      contentDefaultsReset: "Restaurar recomendados",
      submit: "Enviar para verificación",
      submitting: "Enviando…",
      statePendingApproval:
        "Este repositorio es nuevo y espera aprobación de un admin antes de su primer run. Podés reenviar una vez aprobado.",
      stateDispatched: "Enviado. Siguiendo el run de verificación…",
      stateQueued: "En cola…",
      stateInProgress: "Corriendo las compuertas…",
      statePolling: "Consultando estado…",
      stateCompletedSuccess: "La verificación terminó con éxito.",
      rejectStoppedTitle: "Paramos antes de correr tu herramienta",
      rejectOursTitle: "Esto es nuestro, no de tu herramienta",
      rejectNotJudged:
        "No se evaluó ninguna compuerta, así que esto no dice nada de tu herramienta: no llegó a correr.",
      rejectCoverage:
        "Tu BED cubre {covered} de {total} loci soportados (hacen falta al menos {min}).",
      rejectOutOfPanel: "{n} intervalo(s) caen fuera del panel:",
      stateCompletedFailure: "El run terminó pero no pasó todas las compuertas.",
      viewRun: "Ver run de CI",
      viewReport: "Ver atestación",
      errorGeneric: "Algo salió mal. Intentá de nuevo.",
      errorValidation: "Corregí los campos resaltados.",
      pdfDownload: "Descargar reporte PDF",
      pdfGenerating: "Generando PDF…",
      pdfDone: "PDF descargado",
      pdfError: "PDF falló — reintentar",
      pdfErrorHint: "El reporte puede no estar publicado aún. Intentá de nuevo en unos segundos.",
      resubmit: "Editar y reenviar",
      resubmitHint: "Volver al formulario con los mismos parámetros precargados.",
      paramsToggle: "Parámetros del envío",
      paramsToolName: "Herramienta",
      paramsRepo: "Repositorio",
      paramsRef: "Ref",
      paramsCmd: "Comando de ejecución",
      paramsInputType: "Tipo de input",
      paramsFixture: "Archivo de prueba",
      paramsOutput: "Output",
      paramsBuild: "Build",
      paramsDockerMode: "Modo Docker",
      paramsTimeout: "Timeout",
    },
  },
};

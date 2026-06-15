export default {
  verified: {
    title: "STRhub Verified",
    description:
      "Atestações independentes e automáticas de que uma ferramenta forense de STR instala, roda de ponta a ponta e produz uma saída plausível — verificado sobre seu código público em um commit fixado. Não afirma exatidão de genótipos nem aptidão para casework.",
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
    },
    content: {
      heading: "Conteúdo da saída (evidência de plausibilidade)",
      records: "Registros de sequência",
      strLoci: "Loci STR detectados",
      snps: "SNPs de identidade (rsNNNN)",
      totalReads: "Reads totais",
      strLociList: "Loci STR",
    },
  },
};

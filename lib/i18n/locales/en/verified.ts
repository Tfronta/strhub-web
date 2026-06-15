export default {
  verified: {
    title: "STRhub Verified",
    description:
      "Independent, automated attestations that a forensic STR tool installs and runs end-to-end and produces plausible output — checked on its public source at a pinned commit. Not a claim of genotype accuracy or casework fitness.",
    empty: "No attestations published yet.",
    verifiedOn: "Verified on",
    backToList: "All verified tools",
    source: "Source",
    commit: "Commit",
    environment: "Environment",
    ciRun: "CI run",
    gates: "Gates",
    scope: "Scope",
    scopeNote:
      "This is not a claim that the genotypes are correct, nor that the tool is fit for casework or meets any regulatory standard. Concordance against known truth is out of scope.",
    staticPage: "static report",
    disclaimer:
      "Each result is a dated snapshot, verified on the tool's public repository at a pinned commit. STRhub stores no tool source code.",
    col: {
      strLoci: "STR loci",
      snps: "SNPs",
      reads: "reads",
    },
    gate: {
      available: "the pinned public source exists",
      installs: "the environment builds from source",
      runs: "it executes end-to-end without crashing",
      io: "it produces a non-empty file in the declared format",
      content: "its output looks like plausible genotype-bearing data",
    },
    content: {
      heading: "Output content (plausibility evidence)",
      records: "Sequence records",
      strLoci: "STR loci detected",
      snps: "identity SNPs (rsNNNN)",
      totalReads: "Total reads across calls",
      strLociList: "STR loci",
    },
  },
};

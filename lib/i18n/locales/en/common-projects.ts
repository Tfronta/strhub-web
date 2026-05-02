export default {
common: {
  loading: "Loading...",
  error: "Error",
  notFound: "Not Found",
  backToHome: "Back to Home",
  frequency: "Frequency",
  allele: "Allele",
  count: "Count",
  darkMode: "Dark Mode",
  lightMode: "Light Mode",
  language: "Language",
  english: "English",
  portuguese: "Portuguese",
  spanish: "Spanish",
},
projects: {
  title: "International Projects",
  heroDescription:
    "Explore major international genomic projects that are advancing our understanding of human genetic diversity and STR analysis.",
  visitProject: "Visit Project",
  static: {
    genomes1000: {
      description:
        "Pioneering project mapping global genetic variation. Current data includes high-coverage (30x) genomes.",
    },
    hgdp: {
      description:
        "Samples from over 50 diverse populations. Key resource for population structure studies.",
    },
    strSequencingProject: {
      description:
        "Consortium hosted by NIST dedicated to comprehensive characterization of benchmark human genomes.",
    },
    gnomad: {
      description:
        "Global database with millions of genomic variants; useful for comparing STRs with SNPs and indels.",
    },
    sgdp: { description: ">300 whole genomes from underrepresented populations." },
    allOfUs: {
      description:
        "Curated global database of Y-STR haplotypes for forensic comparison, ancestry inference and population studies.",
    },
    humanPangenome: {
      description:
        "New genomic reference with multiple haplotypes, addressing limitations of GRCh38.",
    },
    strider: { description: "Validated, standardized database of forensic STR alleles." },
    strbase: { description: "Classic resource on STR loci maintained by the NIST (National Institute of Standards and Technology)." },
  },
},
} as const

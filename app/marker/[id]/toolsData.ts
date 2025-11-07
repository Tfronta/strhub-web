// STR analysis tools data
export interface ToolConfig {
  target_file_format: string;
  customizable_targets: boolean;
  flanking_bp_recommended?: number;
}

export interface Compatibility {
  status: "maintained" | "archived";
  maintenance: "active" | "community-maintained" | "limited" | "unmaintained";
  maintainer?: string;
  license: string;
  last_release?: string;
  ont_models?: string[];
  docker_image?: string;
}

export interface ToolInterface {
  name: string;
  url: string;
  description: string;
}

export interface ToolSupport {
  native_panels?: string[];
  configurable?: boolean;
  wrapper?: boolean;
}

export interface Tool {
  id: string;
  name: string;
  tech: string[];
  input: string[];
  output: string[];
  support: ToolSupport;
  config: ToolConfig;
  compatibility: Compatibility;
  interfaces?: ToolInterface[];
  limitations?: string[];
  maintainer_initiatives?: string[];
  repo_url: string | null;
  paper_doi: string | null;
  last_checked: string;
  online_version?: string;
  docs_url?: string;
  notes?: string;
}

export const toolsData: Tool[] = [
  {
    id: "hipstr",
    name: "HipSTR",
    tech: ["Illumina"],
    input: ["BAM", "CRAM"],
    output: ["VCF"],
    support: {
      native_panels: [
        "https://github.com/tfwillems/HipSTR/blob/master/test/input/chr1_regions.bed",
      ],
      configurable: true,
      wrapper: false,
    },
    config: {
      target_file_format: "BED: chr, start, end, name",
      customizable_targets: true,
    },
    compatibility: {
      status: "maintained",
      maintenance: "community-maintained",
      maintainer: "Tamara Frontanilla (STRhub Project)",
      license: "MIT",
      last_release: "v0.8.7",
    },
    interfaces: [
      {
        name: "HipSTR-UI",
        url: "https://github.com/HipSTR-UI/hipstr-ui",
        description:
          "Web interface developed and maintained by STRhub for running, visualizing, and exploring HipSTR results interactively.",
      },
    ],
    limitations: [
      "Requires aligned BAM/CRAM files and performs internal realignment (FASTQ not supported).",
      "Designed for Illumina short-read data; not compatible with ONT or PacBio.",
    ],
    maintainer_initiatives: ["STRhub", "HipSTR-UI"],
    repo_url: "https://github.com/tfwillems/HipSTR",
    paper_doi: "https://doi.org/10.1038/nmeth.4267",
    last_checked: "2025-11-06",
    notes:
      "Actively maintained by Tamara Frontanilla as part of the STRhub project. HipSTR-UI enables interactive execution, allele visualization, and population data integration for forensic and research workflows.",
  },
  {
    id: "gangstr",
    name: "GangSTR",
    tech: ["Illumina"],
    input: ["BAM", "CRAM"],
    output: ["VCF"],
    support: {
      native_panels: [
        "https://github.com/gymreklab/GangSTR/blob/master/test/HTT.bed",
      ],
      configurable: true,
      wrapper: false,
    },
    config: {
      target_file_format: "BED: chr, start, end, name",
      customizable_targets: true,
    },
    compatibility: {
      status: "maintained",
      maintenance: "active",
      license: "GPL-3.0",
      last_release: "v2.5",
    },
    limitations: [
      "Optimized for Illumina short-read data; not compatible with ONT or PacBio.",
      "Requires BAM/CRAM alignment and BED file with defined loci.",
    ],
    maintainer_initiatives: ["STRhub"],
    repo_url: "https://github.com/gymreklab/GangSTR",
    paper_doi: "https://doi.org/10.1093/nar/gkz501",
    last_checked: "2025-11-06",
    notes:
      "GangSTR is integrated into the STRhub catalog for benchmarking and cross-platform comparison. It supports locus-based analysis of STR repeat expansions and is widely used for population-scale Illumina datasets.",
  },
  {
    id: "strspy",
    name: "STRspy",
    tech: ["ONT"],
    input: ["FASTQ", "BAM"],
    output: ["TSV", "CSV"],
    support: {
      native_panels: [],
      configurable: true,
      wrapper: false,
    },
    config: {
      target_file_format:
        "BED or JSON: STR locus definitions and flanking sequences",
      customizable_targets: true,
    },
    compatibility: {
      status: "maintained",
      maintenance: "active",
      license: "MIT",
      last_release: "v1.0.0",
    },
    limitations: [
      "Optimized for ONT forensic STR panels; requires reference file of loci.",
      "Not designed for whole-genome (WGS) applications.",
    ],
    maintainer_initiatives: ["STRhub"],
    repo_url: "https://github.com/unique379r/strspy",
    paper_doi: "10.1016/j.fsigen.2021.102629",
    last_checked: "2025-11-06",
    notes:
      "STRspy is integrated into the STRhub ecosystem for forensic and population STR analysis using Oxford Nanopore data. Its modular design allows visualization, benchmarking, and cross-compatibility with HipSTR-UI datasets.",
  },
  {
    id: "strique",
    name: "STRique",
    tech: ["ONT"],
    input: ["FAST5", "BAM"],
    output: ["TSV", "PNG"],
    support: {
      native_panels: [],
      configurable: true,
      wrapper: false,
    },
    config: {
      target_file_format: "TSV: chr, begin, end, name, repeat, prefix, suffix",
      customizable_targets: true,
      flanking_bp_recommended: 150,
    },
    compatibility: {
      status: "archived",
      maintenance: "unmaintained",
      ont_models: ["R9.4.x"],
      docker_image: "giesselmann/strique",
      last_release: "v0.4.2",
      license: "MIT",
    },
    limitations: [
      "Archived project; may fail with modern FAST5 formats and dependencies.",
      "Requires raw FAST5 files and matching BAM/SAM alignment.",
      "Models not updated for R10.3 chemistry.",
    ],
    maintainer_initiatives: ["STRhub"],
    repo_url: "https://github.com/giesselmann/STRique",
    docs_url: "https://strique.readthedocs.io/",
    paper_doi: "10.1038/s41587-019-0293-x",
    last_checked: "2025-11-06",
    notes:
      "Integrated in STRhub for legacy validation and benchmark comparisons. STRique operates as a target-based caller using a TSV configuration file with motif and flanking regions. BED files can be converted by adding repeat/prefix/suffix columns.",
  },
  {
    id: "straitrazor",
    name: "STRait Razor",
    tech: ["CE", "Illumina"],
    input: ["FASTQ", "CE_RFU"],
    output: ["TXT", "CSV"],
    support: {
      native_panels: [],
      configurable: true,
      wrapper: false,
    },
    config: {
      target_file_format: "FASTA or CSV panel defining STR loci and motifs",
      customizable_targets: true,
    },
    compatibility: {
      status: "maintained",
      maintenance: "active",
      license: "GPL-3.0",
      last_release: "v3.0",
    },
    limitations: [
      "Compatible with CE and Illumina data; requires panel configuration.",
      "Does not perform read alignment; motif matching is direct.",
    ],
    maintainer_initiatives: ["STRhub"],
    repo_url: "https://github.com/Ahhgust/STRaitRazor",
    online_version: "https://expectationsmanaged.shinyapps.io/STRaitRazoR/",
    paper_doi: "https://doi.org/10.1016/j.fsigen.2021.102463",
    last_checked: "2025-11-06",
    notes:
      "STRait Razor is included in the STRhub ecosystem for integration with both capillary electrophoresis (CE) and Illumina-based forensic pipelines. Its lightweight motif-matching algorithm makes it suitable for teaching and training purposes in STR interpretation.",
  },
  {
    id: "toastr",
    name: "ToaSTR",
    tech: ["Illumina"],
    input: ["FASTQ"],
    output: ["CSV", "HTML"],
    support: {
      native_panels: [],
      configurable: true,
      wrapper: false,
    },
    config: {
      target_file_format: "CSV or predefined STRaitRazor panel",
      customizable_targets: true,
    },
    compatibility: {
      status: "archived",
      maintenance: "unmaintained",
      license: "GPL-3.0",
      last_release: "v1.0",
    },
    limitations: [
      "Designed for forensic NGS STR analysis; requires STRaitRazor reference panel.",
      "Web interface inactive on some legacy servers.",
    ],
    maintainer_initiatives: ["STRhub"],
    repo_url: null,
    paper_doi: "10.1016/j.fsigen.2018.07.006",
    last_checked: "2025-11-06",
    notes:
      "ToaSTR (also known as STRaitRazor-NGS) extends STRaitRazor functionality for Illumina data analysis. Integrated into STRhub for historical comparison and reference validation in forensic genomics workflows.",
  },
];


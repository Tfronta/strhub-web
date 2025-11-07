// STR analysis tools data
export interface NativePanel {
  url: string;
  genome?: string;
}

export interface ToolSupport {
  native_panels?: NativePanel[];
  configurable?: boolean;
  wrapper?: boolean;
}

export interface Tool {
  id: string;
  name: string;
  tech: string[];
  input: string[];
  support: ToolSupport;
  repo_url: string | null;
  paper_doi: string | null;
  last_checked: string;
  online_version?: string;
}

export const toolsData: Tool[] = [
  {
    id: "hipstr",
    name: "HipSTR",
    tech: ["Illumina"],
    input: ["BAM", "CRAM"],
    support: {
      native_panels: [
        {
          url: "https://github.com/tfwillems/HipSTR/blob/master/test/input/chr1_regions.bed",
        },
      ],
      wrapper: false,
    },
    repo_url: "https://github.com/tfwillems/HipSTR",
    paper_doi: "https://doi.org/10.1038/nmeth.4267",
    last_checked: "2025-11-06",
  },
  {
    id: "gangstr",
    name: "GangSTR",
    tech: ["Illumina"],
    input: ["BAM", "CRAM"],
    support: {
      native_panels: [
        {
          url: "https://github.com/gymreklab/GangSTR/blob/master/test/HTT.bed",
        },
      ],
      wrapper: false,
    },
    repo_url: "https://github.com/gymreklab/GangSTR",
    paper_doi: "https://doi.org/10.1093/nar/gkz501",
    last_checked: "2025-11-06",
  },
  {
    id: "strspy",
    name: "STRspy",
    tech: ["ONT"],
    input: ["FASTQ", "BAM"],
    support: {
      native_panels: [],
      configurable: true,
      wrapper: false,
    },
    repo_url: "https://github.com/unique379r/strspy",
    paper_doi: "10.1016/j.fsigen.2021.102629",
    last_checked: "2025-11-06",
  },
  {
    id: "strique",
    name: "STRique",
    tech: ["ONT"],
    input: ["FASTQ", "BAM"],
    support: {
      native_panels: [],
      configurable: true,
      wrapper: false,
    },
    repo_url: "https://github.com/giesselmann/STRique",
    paper_doi: "10.1038/s41587-019-0293-x",
    last_checked: "2025-11-06",
  },
  {
    id: "straitrazor",
    name: "STRait Razor",
    tech: ["CE", "Illumina"],
    input: ["FASTQ", "CE_RFU"],
    support: {
      native_panels: [],
      configurable: true,
      wrapper: false,
    },
    repo_url: "https://github.com/Ahhgust/STRaitRazor",
    paper_doi: "https://doi.org/10.1016/j.fsigen.2021.102463",
    last_checked: "2025-11-06",
    online_version: "https://expectationsmanaged.shinyapps.io/STRaitRazoR/",
  },
  {
    id: "toastr",
    name: "ToaSTR / STRaitRazor-NGS",
    tech: ["Illumina"],
    input: ["FASTQ"],
    support: {
      native_panels: [],
      configurable: true,
      wrapper: false,
    },
    repo_url: null,
    paper_doi: "10.1016/j.fsigen.2018.07.006",
    last_checked: "2025-11-06",
  },
];


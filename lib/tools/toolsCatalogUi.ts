// Master catalog: single source of truth for tool existence and UI display.
// Used by /tools page and by marker Tools tab (filtered).

import type { ToolCard, UsageKey } from "./types";

// STRait Razor URLs (no longer read from marker toolsData)
const STRAITRAZOR_REPO = "https://github.com/Ahhgust/STRaitRazor";
const STRAITRAZOR_PAPER = "https://doi.org/10.1016/j.fsigen.2021.102463";
const STRAITRAZOR_ONLINE = "https://expectationsmanaged.shinyapps.io/STRaitRazoR/";

export function buildToolCards(t: (key: string) => string): ToolCard[] {
  const hasOnlineStraitRazor = true;

  return [
    {
      id: "strider",
      name: t("tools.strider.title"),
      summary: t("tools.strider.description"),
      technology: ["multi_platform"],
      read_type: ["any"],
      analysis: ["qc_database"],
      usage: ["online_tool"],
      features: [
        t("tools.strider.features.1"),
        t("tools.strider.features.2"),
        t("tools.strider.features.3"),
        t("tools.strider.features.4"),
      ],
      input: "STR datasets",
      output: "QC reports / frequency data",
      website: "https://strider.online/",
      websiteLabel: t("tools.strider.buttons.website"),
    },
    {
      id: "strnaming",
      name: t("tools.strnaming.title"),
      summary: t("tools.strnaming.description"),
      technology: ["multi_platform"],
      read_type: ["any"],
      analysis: ["annotation"],
      usage: ["online_tool"],
      features: [
        t("tools.strnaming.features.1"),
        t("tools.strnaming.features.2"),
        t("tools.strnaming.features.3"),
      ],
      input: "STR sequence",
      output: "Allele nomenclature",
      website: "https://www.fdstools.nl/strnaming/index.html",
      websiteLabel: t("tools.strnaming.buttons.website"),
    },
    {
      id: "hipstr",
      name: t("tools.hipstr.title"),
      summary: t("tools.hipstr.description"),
      technology: ["illumina"],
      read_type: ["short_read"],
      analysis: ["genotyping"],
      usage: ["runs_locally", "graphical_interface"],
      features: [
        t("tools.hipstr.features.1"),
        t("tools.hipstr.features.2"),
        t("tools.hipstr.features.3"),
      ],
      input: "BAM/CRAM + reference",
      output: "VCF",
      github: "https://github.com/HipSTR-Tool/HipSTR",
      publication: "https://www.nature.com/articles/nmeth.4267",
      uiPublication:
        "https://www.fsigenetics.com/article/S1872-4973(26)00037-2/fulltext",
    },
    {
      id: "strspy",
      name: t("tools.strspy.title"),
      summary: t("tools.strspy.description"),
      technology: ["ont", "pacbio"],
      read_type: ["long_read"],
      analysis: ["genotyping"],
      usage: ["runs_locally"],
      features: [
        t("tools.strspy.features.1"),
        t("tools.strspy.features.2"),
        t("tools.strspy.features.3"),
        t("tools.strspy.features.4"),
      ],
      input: "FASTQ/BAM",
      output: "STR profile / tables",
      github: "https://github.com/unique379r/strspy/tree/main",
      publication: "https://pubmed.ncbi.nlm.nih.gov/34837788/",
    },
    {
      id: "gangstr",
      name: t("tools.gangstr.title"),
      summary: t("tools.gangstr.description"),
      technology: ["illumina"],
      read_type: ["short_read"],
      analysis: ["genotyping"],
      usage: ["runs_locally"],
      features: [
        t("tools.gangstr.features.1"),
        t("tools.gangstr.features.2"),
        t("tools.gangstr.features.3"),
      ],
      input: "BAM",
      output: "VCF",
      github: "https://github.com/gymreklab/GangSTR",
      publication: "https://pubmed.ncbi.nlm.nih.gov/31194863/",
    },
    {
      id: "straitrazor",
      name: t("tools.straitrazor.title"),
      summary: t("tools.straitrazor.description"),
      technology: ["illumina", "targeted"],
      read_type: ["short_read"],
      analysis: ["genotyping"],
      usage: hasOnlineStraitRazor
        ? (["runs_locally", "online_tool", "graphical_interface"] as UsageKey[])
        : ["runs_locally"],
      features: [
        t("tools.straitrazor.features.1"),
        t("tools.straitrazor.features.2"),
        t("tools.straitrazor.features.3"),
        t("tools.straitrazor.features.4"),
      ],
      input: "FASTQ",
      output: "Allele calls / tables",
      github: STRAITRAZOR_REPO,
      publication: STRAITRAZOR_PAPER,
      website: STRAITRAZOR_ONLINE,
      websiteLabel: hasOnlineStraitRazor
        ? t("tools.straitrazor.buttons.online")
        : undefined,
    },
    {
      id: "nanomnt",
      name: t("tools.nanomnt.title"),
      summary: t("tools.nanomnt.summary"),
      technology: ["ont"],
      read_type: ["long_read"],
      analysis: ["genotyping"],
      usage: ["runs_locally"],
      features: [
        t("tools.nanomnt.features.1"),
        t("tools.nanomnt.features.2"),
        t("tools.nanomnt.features.3"),
        t("tools.nanomnt.features.4"),
      ],
      input: "BAM",
      output: "Allele/locus tables",
      github: "https://github.com/18parkky/NanoMnT",
      publication: "https://doi.org/10.1093/gigascience/giaf013",
    },
    {
      id: "strkit",
      name: t("tools.strkit.title"),
      summary: t("tools.strkit.summary"),
      technology: ["ont", "pacbio"],
      read_type: ["long_read"],
      analysis: ["genotyping"],
      usage: ["runs_locally"],
      features: [
        t("tools.strkit.features.1"),
        t("tools.strkit.features.2"),
        t("tools.strkit.features.3"),
        t("tools.strkit.features.4"),
        t("tools.strkit.features.5"),
      ],
      input: "BAM/FASTQ",
      output: "Genotypes + confidence",
      github: "https://github.com/davidlougheed/strkit",
      publication: "https://doi.org/10.1101/2025.03.25.645269",
    },
    {
      id: "nastra",
      name: t("tools.nastra.title"),
      summary: t("tools.nastra.summary"),
      technology: ["ont"],
      read_type: ["long_read"],
      analysis: ["genotyping"],
      usage: ["runs_locally"],
      features: [
        t("tools.nastra.features.1"),
        t("tools.nastra.features.2"),
        t("tools.nastra.features.3"),
        t("tools.nastra.features.4"),
        t("tools.nastra.features.5"),
      ],
      input: "FASTQ/BAM",
      output: "Forensic STR calls",
      github: "https://github.com/renzilin/NASTRA",
      publication: "https://doi.org/10.1093/bib/bbae472",
    },
    {
      id: "nanostr",
      name: t("tools.nanostr.title"),
      summary: t("tools.nanostr.summary"),
      technology: ["ont"],
      read_type: ["long_read"],
      analysis: ["genotyping"],
      usage: ["runs_locally"],
      features: [
        t("tools.nanostr.features.1"),
        t("tools.nanostr.features.2"),
        t("tools.nanostr.features.3"),
        t("tools.nanostr.features.4"),
      ],
      input: "FASTQ",
      output: "Allele calls",
      github: "https://github.com/langjidong/NanoSTR",
      publication:
        "https://www.frontiersin.org/articles/10.3389/fmolb.2023.1093519/full",
    },
  ];
}

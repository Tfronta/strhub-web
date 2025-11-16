// Shared tools data for search index
// This should match the structure used in app/tools/page.tsx

import { toolsData } from "@/app/marker/[id]/toolsData";

export type ToolData = {
  name: string;
  description: string;
  category?: string;
  language?: string;
  tags?: string[];
  features?: string[];
  github?: string;
  paper?: string;
  website?: string;
  id?: string;
};

// This will be populated dynamically with translations
// For search index, we'll use a function that accepts translation function
export function getToolsData(t: (key: string) => string): ToolData[] {
  const straitRazorTool = toolsData.find((tool) => tool.id === "straitrazor");

  return [
    {
      id: "strider",
      name: t("tools.strider.title"),
      description: t("tools.strider.description"),
      tags: [
        t("tools.strider.tags.population"),
        t("tools.strider.tags.qc"),
        t("tools.strider.tags.webtool"),
      ],
      website: "https://strider.online/",
    },
    {
      id: "strnaming",
      name: t("tools.strnaming.title"),
      description: t("tools.strnaming.description"),
      tags: [
        t("tools.strnaming.tags.annotation"),
        t("tools.strnaming.tags.forensic"),
        t("tools.strnaming.tags.webtool"),
      ],
      website: "https://www.fdstools.nl/strnaming/index.html",
    },
    {
      id: "hipstr",
      name: t("tools.hipstr.title"),
      description: t("tools.hipstr.description"),
      category: t("tools.hipstr.category"),
      language: t("tools.hipstr.language"),
      github: "https://github.com/HipSTR-Tool/HipSTR",
      paper: "https://www.nature.com/articles/nmeth.4267",
    },
    {
      id: "strspy",
      name: t("tools.strspy.title"),
      description: t("tools.strspy.description"),
      category: t("tools.strspy.tags.category"),
      language: t("tools.strspy.tags.language"),
      github: "https://github.com/unique379r/strspy/tree/main",
      paper: "https://pubmed.ncbi.nlm.nih.gov/34837788/",
    },
    {
      id: "gangstr",
      name: t("tools.gangstr.title"),
      description: t("tools.gangstr.description"),
      category: t("tools.gangstr.category"),
      language: t("tools.gangstr.language"),
      github: "https://github.com/gymreklab/GangSTR",
      paper: "https://pubmed.ncbi.nlm.nih.gov/31194863/",
    },
    {
      id: "straitrazor",
      name: t("tools.straitrazor.title"),
      description: t("tools.straitrazor.description"),
      category: t("tools.straitrazor.tags.category"),
      language: t("tools.straitrazor.tags.language"),
      github: straitRazorTool?.repo_url || "",
      paper: straitRazorTool?.paper_doi || "",
      website: straitRazorTool?.online_version,
    },
  ];
}


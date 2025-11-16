// Unified search index for STRhub
// Combines markers, tools, blog posts, and static pages

import { markers } from "@/app/catalog/page";
import { backToBasicsArticles } from "@/lib/content/backToBasics";
import { getToolsData } from "@/lib/toolsData";

export type SearchIndexItem = {
  type: "marker" | "tool" | "blog" | "page";
  id: string;
  title: string;
  description: string;
  tags?: string[];
  href: string;
  // For markers: exact name match priority
  exactMatch?: boolean;
};

export function buildSearchIndex(t: (key: string) => string): SearchIndexItem[] {
  const index: SearchIndexItem[] = [];

  // 1. Add markers
  markers.forEach((marker) => {
    index.push({
      type: "marker",
      id: marker.id,
      title: marker.name,
      description: `${marker.fullName} - ${marker.type} STR on chromosome ${marker.chromosome}`,
      tags: [
        marker.name,
        marker.fullName,
        marker.motif,
        marker.chromosome,
        marker.category,
        marker.type,
      ],
      href: `/marker/${marker.id}`,
      exactMatch: false, // Will be set during search
    });
  });

  // 2. Add tools
  const tools = getToolsData(t);
  tools.forEach((tool) => {
    const tags: string[] = [];
    if (tool.tags) tags.push(...tool.tags);
    if (tool.category) tags.push(tool.category);
    if (tool.language) tags.push(tool.language);
    if (tool.features) tags.push(...tool.features);

    index.push({
      type: "tool",
      id: tool.id || tool.name.toLowerCase().replace(/\s+/g, "-"),
      title: tool.name,
      description: tool.description,
      tags,
      href: "/tools",
    });
  });

  // 3. Add Back to Basics articles (blog)
  backToBasicsArticles.forEach((post) => {
    const slug = post.fields.slug || post.sys.id;
    index.push({
      type: "blog",
      id: post.sys.id,
      title: post.fields.title,
      description: post.fields.summary,
      tags: post.fields.keywords || [],
      href: `/basics/${slug}`,
    });
  });

  // 4. Add static pages
  const staticPages: Array<{
    id: string;
    title: string;
    description: string;
    tags: string[];
    href: string;
  }> = [
    {
      id: "catalog",
      title: t("nav.catalog"),
      description: t("home.explore.catalog.description"),
      tags: ["catalog", "markers", "database", "codis", "str"],
      href: "/catalog",
    },
    {
      id: "basics",
      title: t("nav.basics"),
      description: t("home.explore.basics.description"),
      tags: ["basics", "tutorial", "education", "learning", "cram", "bam", "sam"],
      href: "/basics",
    },
    {
      id: "tools",
      title: t("nav.tools"),
      description: t("home.explore.tools.description"),
      tags: ["tools", "pipelines", "hipstr", "strspy", "gangstr", "analysis"],
      href: "/tools",
    },
    {
      id: "mix-profiles",
      title: t("nav.mixProfiles"),
      description: t("home.explore.mixProfiles.description"),
      tags: ["mixture", "profiles", "simulation", "ce", "ngs", "frequencies"],
      href: "/mix-profiles",
    },
    {
      id: "projects",
      title: t("nav.projects"),
      description: t("home.explore.projects.description"),
      tags: ["projects", "research", "genomics", "1000 genomes"],
      href: "/projects",
    },
    {
      id: "about",
      title: t("nav.about"),
      description: t("home.explore.about.description"),
      tags: ["about", "mission", "team", "contact"],
      href: "/about",
    },
    {
      id: "community",
      title: t("nav.blog"),
      description: t("home.explore.communityHub.description"),
      tags: ["community", "blog", "news", "updates"],
      href: "/community",
    },
    {
      id: "fasta-generator",
      title: t("home.explore.fastaGenerator.title"),
      description: t("home.explore.fastaGenerator.description"),
      tags: ["fasta", "generator", "sequences", "export"],
      href: "/tools/fasta-generator",
    },
    {
      id: "igv-viewer",
      title: t("home.explore.igvViewer.title"),
      description: t("home.explore.igvViewer.description"),
      tags: ["igv", "viewer", "visualization", "genomics"],
      href: "/tools/igv-viewer",
    },
    {
      id: "str-motif-explorer",
      title: t("home.explore.motifExplorer.title"),
      description: t("home.explore.motifExplorer.description"),
      tags: ["motif", "explorer", "str", "repeats"],
      href: "/tools/str-motif-explorer",
    },
  ];

  staticPages.forEach((page) => {
    index.push({
      type: "page",
      id: page.id,
      title: page.title,
      description: page.description,
      tags: page.tags,
      href: page.href,
    });
  });

  return index;
}


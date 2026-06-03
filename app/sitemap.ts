import type { MetadataRoute } from "next";
import { fetchAllBasicsSlugs } from "@/lib/back-to-basics-server";
import {
  BASICS_LOCALES,
  basicsArticlePath,
  SITE_URL,
} from "@/lib/seo";

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/catalog", changeFrequency: "weekly", priority: 0.9 },
  { path: "/basics", changeFrequency: "monthly", priority: 0.8 },
  { path: "/mix-profiles", changeFrequency: "weekly", priority: 0.9 },
  { path: "/tools", changeFrequency: "monthly", priority: 0.8 },
  { path: "/tools/fasta-generator", changeFrequency: "monthly", priority: 0.7 },
  { path: "/tools/igv-viewer", changeFrequency: "monthly", priority: 0.7 },
  {
    path: "/tools/str-motif-explorer",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  { path: "/datasets", changeFrequency: "monthly", priority: 0.8 },
  { path: "/community", changeFrequency: "weekly", priority: 0.7 },
  { path: "/projects", changeFrequency: "monthly", priority: 0.6 },
  { path: "/about", changeFrequency: "monthly", priority: 0.6 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const slugs = await fetchAllBasicsSlugs();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(
    ({ path, changeFrequency, priority }) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    })
  );

  const articleEntries: MetadataRoute.Sitemap = BASICS_LOCALES.flatMap(
    (locale) =>
      slugs.map((slug) => ({
        url: `${SITE_URL}${basicsArticlePath(locale, slug)}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }))
  );

  return [...staticEntries, ...articleEntries];
}

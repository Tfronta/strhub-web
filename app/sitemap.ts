import type { MetadataRoute } from "next";
import { fetchAllBasicsArticles } from "@/lib/back-to-basics-server";
import { getVerifiedIndex } from "@/lib/verified";
import { markerData } from "@/lib/markerData";
import {
  BASICS_LOCALES,
  basicsArticlePath,
  SITE_URL,
  VERIFIED_PUBLIC,
} from "@/lib/seo";

// Contentful and the Verified index change without a redeploy; refresh hourly.
export const revalidate = 3600;

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
  { path: "/projects", changeFrequency: "monthly", priority: 0.6 },
  { path: "/about", changeFrequency: "monthly", priority: 0.6 },
];

const VERIFIED_ROUTES: typeof STATIC_ROUTES = [
  { path: "/verified", changeFrequency: "weekly", priority: 0.7 },
  { path: "/verified/how-to-read", changeFrequency: "monthly", priority: 0.5 },
  { path: "/verified/submit", changeFrequency: "monthly", priority: 0.5 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [articles, verified] = await Promise.all([
    fetchAllBasicsArticles(),
    VERIFIED_PUBLIC
      ? getVerifiedIndex({ fresh: false }).catch(() => null)
      : Promise.resolve(null),
  ]);

  const routes = VERIFIED_PUBLIC
    ? [...STATIC_ROUTES, ...VERIFIED_ROUTES]
    : STATIC_ROUTES;

  const staticEntries: MetadataRoute.Sitemap = routes.map(
    ({ path, changeFrequency, priority }) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    })
  );

  const articleEntries: MetadataRoute.Sitemap = articles.flatMap((article) => {
    const languages: Record<string, string> = {
      "x-default": `${SITE_URL}${basicsArticlePath("en", article.slugs.en)}`,
    };
    for (const locale of BASICS_LOCALES) {
      languages[locale] = `${SITE_URL}${basicsArticlePath(locale, article.slugs[locale])}`;
    }
    return BASICS_LOCALES.map((locale) => ({
      url: `${SITE_URL}${basicsArticlePath(locale, article.slugs[locale])}`,
      lastModified: article.updatedAt ? new Date(article.updatedAt) : now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: { languages },
    }));
  });

  const markerEntries: MetadataRoute.Sitemap = Object.keys(markerData).map(
    (id) => ({
      url: `${SITE_URL}/marker/${id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })
  );

  const verifiedEntries: MetadataRoute.Sitemap = (verified?.tools ?? [])
    .filter((tool) => /^[A-Za-z0-9._-]+$/.test(tool.slug))
    .map((tool) => ({
      url: `${SITE_URL}/verified/${tool.slug}`,
      lastModified: tool.generated ? new Date(tool.generated) : now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));

  return [
    ...staticEntries,
    ...articleEntries,
    ...markerEntries,
    ...verifiedEntries,
  ];
}

import type { MetadataRoute } from "next";
import { fetchAllBasicsArticles } from "@/lib/back-to-basics-server";
import { getVerifiedIndex } from "@/lib/verified";
import { indexableMarkerIds, MARKER_DATA_UPDATED } from "@/lib/marker-summary";
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

function newest(dates: Array<string | null | undefined>): string | undefined {
  const valid = dates.filter((d): d is string => !!d).sort();
  return valid.length ? valid[valid.length - 1] : undefined;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, verified] = await Promise.all([
    fetchAllBasicsArticles(),
    VERIFIED_PUBLIC
      ? getVerifiedIndex({ fresh: false }).catch(() => null)
      : Promise.resolve(null),
  ]);

  const routes = VERIFIED_PUBLIC
    ? [...STATIC_ROUTES, ...VERIFIED_ROUTES]
    : STATIC_ROUTES;

  // Only dates we can vouch for: search engines ignore lastmod once it is
  // seen to change on every fetch, which is what a build timestamp does.
  const articlesUpdated = newest(articles.map((a) => a.updatedAt));
  const verifiedUpdated = newest((verified?.tools ?? []).map((t) => t.generated));
  const lastModifiedByPath: Record<string, string | undefined> = {
    "": newest([articlesUpdated, MARKER_DATA_UPDATED]),
    "/catalog": MARKER_DATA_UPDATED,
    "/basics": articlesUpdated,
    "/datasets": MARKER_DATA_UPDATED,
    "/tools/str-motif-explorer": MARKER_DATA_UPDATED,
    "/verified": verifiedUpdated,
  };

  const staticEntries: MetadataRoute.Sitemap = routes.map(
    ({ path, changeFrequency, priority }) => {
      const lastModified = lastModifiedByPath[path];
      return {
        // Google records the root as "https://strhub.app/"; match it so the
        // home page is attributed to this sitemap.
        url: path === "" ? `${SITE_URL}/` : `${SITE_URL}${path}`,
        ...(lastModified ? { lastModified } : {}),
        changeFrequency,
        priority,
      };
    }
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
      ...(article.updatedAt ? { lastModified: new Date(article.updatedAt) } : {}),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: { languages },
    }));
  });

  // Markers without locus data are noindex (see app/marker/[id]/layout.tsx);
  // listing them here would tell crawlers the opposite.
  const markerEntries: MetadataRoute.Sitemap = indexableMarkerIds().map(
    (id) => ({
      url: `${SITE_URL}/marker/${id}`,
      lastModified: MARKER_DATA_UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })
  );

  const verifiedEntries: MetadataRoute.Sitemap = (verified?.tools ?? [])
    .filter((tool) => /^[A-Za-z0-9._-]+$/.test(tool.slug))
    .map((tool) => ({
      url: `${SITE_URL}/verified/${tool.slug}`,
      ...(tool.generated ? { lastModified: new Date(tool.generated) } : {}),
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

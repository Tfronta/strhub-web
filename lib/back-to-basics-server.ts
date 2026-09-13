import "server-only";
import { unstable_cache } from "next/cache";
import {
  getContentfulClient,
  buildIncludesMaps,
  resolveAuthor,
} from "@/lib/contentful";
import type { BasicsArticle, BasicsListItem } from "@/lib/back-to-basics-types";
import { BASICS_LOCALES, type BasicsLocale } from "@/lib/seo";

export type { BasicsArticle, BasicsListItem } from "@/lib/back-to-basics-types";

const CONTENT_TYPE = "backToBasicsPost";
const DEFAULT_CF_LOCALE = "en-US";

/** Site locale ("en" | "es" | "pt") to Contentful locale code. */
function toContentfulLocale(locale: string): string {
  return locale === "en" ? DEFAULT_CF_LOCALE : locale;
}

export type BasicsSlugMap = Record<BasicsLocale, string>;

/**
 * Slug is a localized field in Contentful, so an article can have a different
 * slug per language. Given a map of raw localized slugs, fill missing locales
 * with the default-locale slug (mirrors Contentful's fallback to en-US).
 */
function normalizeSlugMap(
  raw: Record<string, string | undefined> | undefined
): BasicsSlugMap | null {
  const en = raw?.[DEFAULT_CF_LOCALE];
  if (!en) return null;
  const map = {} as BasicsSlugMap;
  for (const loc of BASICS_LOCALES) {
    map[loc] = raw?.[toContentfulLocale(loc)] || en;
  }
  return map;
}

async function fetchSlugMapById(id: string): Promise<BasicsSlugMap | null> {
  const client = getContentfulClient();
  const response = await client.withAllLocales.getEntries({
    content_type: CONTENT_TYPE,
    "sys.id": id,
    select: ["fields.slug"],
    limit: 1,
  });
  const item = response.items?.[0] as
    | { fields?: { slug?: Record<string, string> } }
    | undefined;
  return normalizeSlugMap(item?.fields?.slug);
}

/**
 * Find the entry id whose slug matches `slug` in `locale`. If nothing matches,
 * try the other locales so that a slug from another language still resolves
 * (the page then redirects to the localized slug).
 */
async function findEntryIdBySlug(
  slug: string,
  locale: string
): Promise<string | null> {
  const client = getContentfulClient();
  // The caller already queried `locale`; only the other locales are left.
  const candidates = BASICS_LOCALES.filter((l) => l !== locale);
  for (const loc of candidates) {
    const response = await client.getEntries({
      content_type: CONTENT_TYPE,
      "fields.slug": slug,
      select: ["sys.id"],
      limit: 1,
      locale: toContentfulLocale(loc),
    });
    const id = response.items?.[0]?.sys?.id;
    if (id) return id;
  }
  return null;
}

export async function fetchBasicsArticle(
  slug: string,
  locale: string
): Promise<BasicsArticle | null> {
  try {
    const client = getContentfulClient();
    const cfLocale = toContentfulLocale(locale);

    let response = await client.getEntries({
      content_type: CONTENT_TYPE,
      "fields.slug": slug,
      limit: 1,
      include: 2,
      locale: cfLocale,
    });

    if (!response.items?.length) {
      const id = await findEntryIdBySlug(slug, locale);
      if (!id) return null;
      response = await client.getEntries({
        content_type: CONTENT_TYPE,
        "sys.id": id,
        limit: 1,
        include: 2,
        locale: cfLocale,
      });
      if (!response.items?.length) return null;
    }

    const item = response.items[0] as any;
    const maps = buildIncludesMaps(response.includes);
    const authorsLinks = (item.fields?.authors as any[] | undefined) || [];
    const authors = authorsLinks
      .map((l) => resolveAuthor(l, maps))
      .filter((a): a is NonNullable<typeof a> => a != null);

    const slugs = await fetchSlugMapById(item.sys.id);

    return {
      sys: { id: item.sys.id, updatedAt: item.sys.updatedAt },
      fields: {
        title: item.fields?.title,
        summary: item.fields?.summary,
        postReadMinutes: item.fields?.postReadMinutes ?? 0,
        keywords: item.fields?.keywords ?? [],
        bodyMd: item.fields?.bodyMd,
        slug: item.fields?.slug,
        authors,
      },
      slugs: slugs ?? undefined,
    };
  } catch {
    return null;
  }
}

export type BasicsArticleIndexEntry = {
  id: string;
  updatedAt?: string;
  /** Localized slug per site locale (falls back to the English slug). */
  slugs: BasicsSlugMap;
};

/** Every published article with its per-locale slug, for sitemap/hreflang. */
export async function fetchAllBasicsArticles(): Promise<BasicsArticleIndexEntry[]> {
  try {
    const client = getContentfulClient();
    const out: BasicsArticleIndexEntry[] = [];
    const seen = new Set<string>();
    let skip = 0;
    const limit = 100;
    // Paginate to be safe once the number of articles grows.
    for (;;) {
      const response = await client.withAllLocales.getEntries({
        content_type: CONTENT_TYPE,
        select: ["fields.slug", "sys.updatedAt"],
        limit,
        skip,
      });
      for (const raw of response.items || []) {
        const item = raw as {
          sys: { id: string; updatedAt?: string };
          fields?: { slug?: Record<string, string> };
        };
        const slugs = normalizeSlugMap(item.fields?.slug);
        if (!slugs || seen.has(item.sys.id)) continue;
        seen.add(item.sys.id);
        out.push({ id: item.sys.id, updatedAt: item.sys.updatedAt, slugs });
      }
      skip += limit;
      if (skip >= (response.total ?? 0)) break;
    }
    return out;
  } catch {
    return [];
  }
}

/** @deprecated use fetchAllBasicsArticles; kept for callers that only need English slugs. */
export async function fetchAllBasicsSlugs(): Promise<string[]> {
  const articles = await fetchAllBasicsArticles();
  return articles.map((a) => a.slugs.en);
}

async function fetchBasicsListUncached(
  locale: string,
  tag: string
): Promise<BasicsListItem[]> {
  try {
    const client = getContentfulClient();
    const response = await client.getEntries({
      content_type: CONTENT_TYPE,
      order: ["-sys.createdAt"],
      locale: toContentfulLocale(locale),
      select: [
        "sys.id",
        "fields.title",
        "fields.summary",
        "fields.postReadMinutes",
        "fields.keywords",
        "fields.slug",
      ],
      "metadata.tags.sys.id[in]": [tag],
      limit: 100,
    } as any);
    return (response.items || []).map((it: any) => ({
      sys: { id: it.sys.id },
      fields: {
        title: it.fields?.title ?? "",
        summary: it.fields?.summary ?? "",
        postReadMinutes: it.fields?.postReadMinutes ?? 0,
        keywords: it.fields?.keywords ?? [],
        slug: it.fields?.slug,
      },
    }));
  } catch {
    return [];
  }
}

/**
 * Article cards for the /basics index, cached for 60 s per locale and tag so
 * the server-rendered index does not hit Contentful on every request.
 */
export const fetchBasicsList = unstable_cache(
  fetchBasicsListUncached,
  ["basics-list"],
  { revalidate: 60 }
);

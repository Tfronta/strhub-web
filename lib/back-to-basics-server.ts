import "server-only";
import {
  getContentfulClient,
  buildIncludesMaps,
  resolveAuthor,
} from "@/lib/contentful";
import type { BasicsArticle } from "@/lib/back-to-basics-types";

export type { BasicsArticle } from "@/lib/back-to-basics-types";

function contentfulLocale(locale: string): string | undefined {
  return locale === "en" ? undefined : locale;
}

export async function fetchBasicsArticle(
  slug: string,
  locale: string
): Promise<BasicsArticle | null> {
  try {
    const client = getContentfulClient();
    const response = await client.getEntries({
      content_type: "backToBasicsPost",
      "fields.slug": slug,
      limit: 1,
      include: 2,
      locale: contentfulLocale(locale),
    });

    if (!response.items?.length) return null;
    const item = response.items[0] as any;
    const maps = buildIncludesMaps(response.includes);
    const authorsLinks = (item.fields?.authors as any[] | undefined) || [];
    const authors = authorsLinks
      .map((l) => resolveAuthor(l, maps))
      .filter((a): a is NonNullable<typeof a> => a != null);

    return {
      sys: { id: item.sys.id },
      fields: {
        title: item.fields?.title,
        summary: item.fields?.summary,
        postReadMinutes: item.fields?.postReadMinutes ?? 0,
        keywords: item.fields?.keywords ?? [],
        bodyMd: item.fields?.bodyMd,
        slug: item.fields?.slug,
        authors,
      },
    };
  } catch {
    return null;
  }
}

export async function fetchAllBasicsSlugs(): Promise<string[]> {
  try {
    const client = getContentfulClient();
    const response = await client.getEntries({
      content_type: "backToBasicsPost",
      select: ["fields.slug"],
      limit: 100,
    });

    const slugs = new Set<string>();
    for (const item of response.items || []) {
      const slug = (item as { fields?: { slug?: string } }).fields?.slug;
      if (slug) slugs.add(slug);
    }
    return [...slugs];
  } catch {
    return [];
  }
}

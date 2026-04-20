import type { Metadata } from "next";
import { getContentfulClient, CONTENTFUL_ACCESS_TOKEN } from "@/lib/contentful";
import ArticlePageClient from "./ArticlePageClient";

const SUPPORTED_LOCALES = ["en", "es", "pt"] as const;

type PageProps = {
  params: { locale: string; slug: string };
};

async function getArticleSeo(slug: string, locale: string) {
  try {
    const client = getContentfulClient();
    const response = await client.getEntries({
      content_type: "backToBasicsPost",
      "fields.slug": slug,
      limit: 1,
      include: 0,
      locale: locale === "en" ? undefined : locale,
      select: "fields.title,fields.summary",
      access_token: CONTENTFUL_ACCESS_TOKEN,
    });
    const item: any = response.items?.[0];
    return {
      title: item?.fields?.title as string | undefined,
      summary: item?.fields?.summary as string | undefined,
    };
  } catch {
    return { title: undefined, summary: undefined };
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = params;
  const canonicalPath = `/basics/${locale}/${slug}`;

  if (!SUPPORTED_LOCALES.includes(locale as (typeof SUPPORTED_LOCALES)[number])) {
    return {
      robots: { index: false, follow: false },
      alternates: { canonical: "/basics" },
    };
  }

  const seo = await getArticleSeo(slug, locale);
  const title = seo.title
    ? `${seo.title} | STRhub`
    : "Back to Basics Article | STRhub";
  const description =
    seo.summary ||
    "Foundational educational content on forensic genetics and STR workflows.";

  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      type: "article",
      siteName: "STRhub",
    },
  };
}

export default function ArticlePage({ params }: PageProps) {
  return <ArticlePageClient params={params} />;
}

import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { fetchBasicsArticle } from "@/lib/back-to-basics-server";
import {
  basicsArticleAlternates,
  basicsArticlePath,
  isBasicsLocale,
  OG_IMAGE,
  SITE_URL,
  type BasicsLocale,
} from "@/lib/seo";
import ArticlePageClient from "./ArticlePageClient";
import { JsonLd } from "@/components/json-ld";

export const revalidate = 60;

type PageProps = {
  params: { locale: string; slug: string };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = params;

  if (!isBasicsLocale(locale)) {
    return {
      robots: { index: false, follow: false },
      alternates: { canonical: "/basics" },
    };
  }

  const post = await fetchBasicsArticle(slug, locale);
  const title = post?.fields?.title ?? "Article not found";
  const description =
    post?.fields?.summary ||
    "Foundational educational content on forensic genetics and STR workflows.";
  const canonicalSlug = post?.slugs?.[locale as BasicsLocale] ?? slug;
  const canonicalPath = basicsArticlePath(locale, canonicalSlug);

  return {
    title: { absolute: `${title} | STRhub` },
    description,
    alternates: basicsArticleAlternates(slug, locale as BasicsLocale, post?.slugs),
    openGraph: {
      title: `${title} | STRhub`,
      description,
      url: canonicalPath,
      type: "article",
      siteName: "STRhub",
      locale: locale === "en" ? "en_US" : locale === "es" ? "es_ES" : "pt_BR",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | STRhub`,
      description,
      images: [OG_IMAGE],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  if (!isBasicsLocale(params.locale)) {
    notFound();
  }

  const post = await fetchBasicsArticle(params.slug, params.locale);
  if (!post) {
    notFound();
  }

  // Slugs are localized in Contentful. If this article is reached through a
  // slug from another language, send it to the slug of the requested locale.
  const localizedSlug = post.slugs?.[params.locale as BasicsLocale];
  if (localizedSlug && localizedSlug !== params.slug) {
    permanentRedirect(basicsArticlePath(params.locale, localizedSlug));
  }

  const articleUrl = `${SITE_URL}${basicsArticlePath(params.locale, params.slug)}`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.fields.title,
    description: post.fields.summary,
    inLanguage: params.locale,
    url: articleUrl,
    mainEntityOfPage: articleUrl,
    ...(post.sys.updatedAt ? { dateModified: post.sys.updatedAt } : {}),
    ...(post.fields.keywords?.length ? { keywords: post.fields.keywords.join(", ") } : {}),
    ...(post.fields.authors?.length
      ? {
          author: post.fields.authors
            .filter((a) => a.name)
            .map((a) => ({ "@type": "Person", name: a.name })),
        }
      : {}),
    publisher: { "@type": "Organization", name: "STRhub", url: SITE_URL },
  };

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <ArticlePageClient params={params} initialPost={post} />
    </>
  );
}

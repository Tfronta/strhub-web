import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchBasicsArticle } from "@/lib/back-to-basics-server";
import {
  basicsArticleAlternates,
  basicsArticlePath,
  isBasicsLocale,
  type BasicsLocale,
} from "@/lib/seo";
import ArticlePageClient from "./ArticlePageClient";

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
  const title = post?.fields?.title
    ? `${post.fields.title} | STRhub`
    : "Back to Basics Article | STRhub";
  const description =
    post?.fields?.summary ||
    "Foundational educational content on forensic genetics and STR workflows.";
  const canonicalPath = basicsArticlePath(locale, slug);

  return {
    title,
    description,
    alternates: basicsArticleAlternates(slug, locale as BasicsLocale),
    openGraph: {
      title,
      description,
      url: canonicalPath,
      type: "article",
      siteName: "STRhub",
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

  return <ArticlePageClient params={params} initialPost={post} />;
}

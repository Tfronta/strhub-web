"use client";

import { ArrowLeft, User, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { notFound } from "next/navigation";
import MarkdownArticle from "@/components/MarkdownArticle";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/language-context";
import type { BasicsArticle, BasicsListItem } from "@/lib/back-to-basics-types";
import type { Language } from "@/lib/translations";
import { basicsArticlePath } from "@/lib/seo";

const SUPPORTED_LOCALES: Language[] = ["en", "es", "pt"];

export default function ArticlePageClient({
  params,
  initialPost,
  related = [],
}: {
  params: { locale: string; slug: string };
  initialPost: BasicsArticle;
  /** Other Foundations articles in this locale (server-fetched). */
  related?: BasicsListItem[];
}) {
  const { setLanguage, t } = useLanguage();
  const locale = params.locale as Language;
  const isValidLocale = SUPPORTED_LOCALES.includes(locale);
  const post = initialPost;

  useEffect(() => {
    setLanguage(locale);
  }, [locale, setLanguage]);

  if (!isValidLocale) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-0 pt-8">
        <Link
          href="/basics"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("basics.backToArticles")}
        </Link>
      </div>

      <article className="container mx-auto px-4 md:px-0 py-6 space-y-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold mb-4 text-balance">
            {post.fields.title}
          </h1>
          <p className="text-lg text-muted-foreground mb-6 text-pretty">
            {post.fields.summary}
          </p>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            {post.fields.authors && post.fields.authors.length > 0 && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {post.fields.authors.map((author, index, authors) => (
                  <span key={index}>
                    {author.name}
                    {index < authors.length - 1 ? ", " : ""}
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {post.fields.postReadMinutes} min read
            </div>
          </div>
        </header>

        <Card className="border-0 bg-gradient-to-br from-card to-card/50">
          <CardContent>
            <MarkdownArticle markdown={post.fields.bodyMd || ""} />
          </CardContent>
        </Card>

        {related.length > 0 && (
          <aside aria-labelledby="related-articles" className="pt-6">
            <h2 id="related-articles" className="text-xl font-semibold mb-4">
              {t("basics.relatedArticles")}
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {related.map((item) => (
                <li key={item.sys.id}>
                  <Link
                    href={basicsArticlePath(locale, item.fields.slug!)}
                    className="block h-full rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50"
                  >
                    <p className="font-medium text-foreground text-balance">
                      {item.fields.title}
                    </p>
                    {item.fields.summary && (
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-3">
                        {item.fields.summary}
                      </p>
                    )}
                    {item.fields.postReadMinutes > 0 && (
                      <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {item.fields.postReadMinutes} {t("basics.readTime")}
                      </p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}

        <div className="mt-12 flex justify-between">
          <Link href="/basics">
            <Badge
              variant="outline"
              className="hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {t("basics.backToArticles")}
            </Badge>
          </Link>
        </div>
      </article>
    </div>
  );
}

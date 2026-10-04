"use client";

import Link from "next/link";
import { ClientBackToBasicsGrid, ClientCoreConceptsGrid } from "./client-components";
import { PageTitle } from "@/components/page-title";
import { useLanguage } from "@/contexts/language-context";
import { KaryotypeExplorer } from "@/components/explorer/KaryotypeExplorer";
import { Separator } from "@/components/ui/separator";
import { basicsArticlePath } from "@/lib/seo";
import type { ReactNode } from "react";
import type { BasicsListItem } from "@/lib/back-to-basics-types";
import type { Language } from "@/lib/translations";

export type BasicsInitialData = {
  language: Language;
  coreConcepts: BasicsListItem[];
  bioinformatics: BasicsListItem[];
};

/** Every Foundations article in a language other than the one on screen. */
export type BasicsOtherLanguage = {
  language: Language;
  articles: BasicsListItem[];
};

/** Each language named in itself, the usual convention for a language list. */
const LOCALE_NAMES: Record<Language, string> = {
  en: "English",
  es: "Español",
  pt: "Português",
};

function withItalicLoci(text: string): ReactNode[] {
  return text.split(/(\b[Ll]oci\b)/g).map((part, idx) => {
    if (/^[Ll]oci$/.test(part)) {
      return <em key={`${part}-${idx}`}>{part}</em>;
    }
    return part;
  });
}

export default function BasicsPageClient({
  initialData,
  otherLanguages = [],
}: {
  initialData: BasicsInitialData;
  otherLanguages?: BasicsOtherLanguage[];
}) {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background">
      {/* Page identity */}
      <section className="py-8 px-4">
        <div className="container mx-auto text-left space-y-4">
          <PageTitle
            title={t("basics.title")}
            description={withItalicLoci(t("basics.description"))}
          />
        </div>
      </section>

      {/* Section A — Interactive exploration */}
      <section className="px-4 pb-4">
        <div className="container mx-auto space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-1">
              {withItalicLoci(t("basics.explorerSectionTitle"))}
            </h2>
            <p className="text-sm text-muted-foreground">
              {withItalicLoci(t("basics.explorerSectionDesc"))}
            </p>
          </div>
          <KaryotypeExplorer showHeader={false} />
        </div>
      </section>

      <div className="container mx-auto px-4">
        <Separator />
      </div>

      {/* Section B — Core Concepts */}
      <section className="pt-8 pb-16 px-4">
        <div className="container mx-auto space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-1">
              {t("basics.coreConceptsTitle")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("basics.coreConceptsDesc")}
            </p>
          </div>

          <ClientCoreConceptsGrid
            initialPosts={initialData.coreConcepts}
            initialLanguage={initialData.language}
          />
          <ClientBackToBasicsGrid
            initialPosts={initialData.bioinformatics}
            initialLanguage={initialData.language}
          />
        </div>
      </section>

      {/* Section C — The same articles in the other languages. Server-rendered
          so every translation is reachable from here, whatever language the
          grids above happen to be showing. */}
      {otherLanguages.some((entry) => entry.articles.length > 0) && (
        <section className="pb-16 px-4">
          <div className="container mx-auto space-y-6">
            <Separator />
            <h2 className="text-xl font-semibold">
              {t("basics.otherLanguagesTitle")}
            </h2>
            {otherLanguages
              .filter((entry) => entry.articles.length > 0)
              .map((entry) => (
                <div key={entry.language} className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {LOCALE_NAMES[entry.language]}
                  </h3>
                  <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                    {entry.articles
                      .filter((article) => article.fields.slug)
                      .map((article) => (
                        <li key={`${entry.language}-${article.sys.id}`}>
                          <Link
                            href={basicsArticlePath(
                              entry.language,
                              article.fields.slug!
                            )}
                            hrefLang={entry.language}
                            className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline transition-colors"
                          >
                            {article.fields.title}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
          </div>
        </section>
      )}
    </div>
  );
}

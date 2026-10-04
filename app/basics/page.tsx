import { cookies } from "next/headers";
import { fetchBasicsList } from "@/lib/back-to-basics-server";
import type { Language } from "@/lib/translations";
import BasicsPageClient from "./BasicsPageClient";

const LANGUAGES: Language[] = ["en", "es", "pt"];

/**
 * Server-rendered index: the article cards (and their links) are in the HTML
 * so crawlers can discover every article without executing JavaScript. The
 * client grids refetch only when the visitor switches language.
 */
export default async function BasicsPage() {
  const cookieLanguage = cookies().get("strhub-language")?.value;
  const language: Language = LANGUAGES.includes(cookieLanguage as Language)
    ? (cookieLanguage as Language)
    : "en";

  const [coreConcepts, bioinformatics] = await Promise.all([
    fetchBasicsList(language, "coreConcept"),
    fetchBasicsList(language, "bioinformatics"),
  ]);

  // The card grids only ever show one language, the one in the cookie, and a
  // crawler sends no cookie: on its own this page links to a third of the
  // articles and the translations stay orphaned. Listing the other languages
  // here puts every article URL in the HTML whoever is reading. The lists are
  // behind unstable_cache, so the extra locales cost one Contentful call a
  // minute each.
  const otherLanguages = await Promise.all(
    LANGUAGES.filter((other) => other !== language).map(async (other) => {
      const [core, bioinfo] = await Promise.all([
        fetchBasicsList(other, "coreConcept"),
        fetchBasicsList(other, "bioinformatics"),
      ]);
      return { language: other, articles: [...core, ...bioinfo] };
    })
  );

  return (
    <BasicsPageClient
      initialData={{ language, coreConcepts, bioinformatics }}
      otherLanguages={otherLanguages}
    />
  );
}

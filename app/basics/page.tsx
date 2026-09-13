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

  return (
    <BasicsPageClient
      initialData={{ language, coreConcepts, bioinformatics }}
    />
  );
}

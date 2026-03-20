"use client";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useLanguage } from "@/contexts/language-context";
import type { Language } from "@/lib/translations";
import { usePathname, useRouter } from "next/navigation";

const languages: Record<Language, string> = {
  en: "English",
  pt: "Português",
  es: "Español",
};

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  const cycleLanguage = () => {
    const order: Language[] = ["en", "es", "pt"];
    const currentIndex = order.indexOf(language);
    const next = order[(currentIndex + 1) % order.length];
    setLanguage(next);

    // If we're on an article (/basics/[locale]/[slug]), redirect so the article
    // is fetched/rendered in the newly selected locale.
    const articleMatch = pathname?.match(/^\/basics\/(en|es|pt)\/(.+)$/);
    if (articleMatch) {
      const slug = articleMatch[2];
      router.push(`/basics/${next}/${slug}`);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-2"
      onClick={cycleLanguage}
      aria-label="Toggle language"
    >
      <Icons.Globe className="h-4 w-4" />
      {languages[language]}
    </Button>
  );
}

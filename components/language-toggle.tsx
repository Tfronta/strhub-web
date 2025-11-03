"use client";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useLanguage } from "@/contexts/language-context";
import type { Language } from "@/lib/translations";

const languages: Record<Language, string> = {
  en: "English",
  pt: "Português",
  es: "Español",
};

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const cycleLanguage = () => {
    const order: Language[] = ["en", "es", "pt"];
    const currentIndex = order.indexOf(language);
    const next = order[(currentIndex + 1) % order.length];
    setLanguage(next);
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

"use client";

import Link from "next/link";
import { Info } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  NOMENCLATURE_GLOSSARY,
  GLOSSARY_ARTICLE_PUBLISHED,
  glossaryArticleHref,
  type GlossaryTermKey,
} from "@/lib/nomenclatureGlossary";

const LEARN_MORE: Record<string, string> = {
  en: "Learn more",
  es: "Leer más",
  pt: "Ler mais",
};

/**
 * Small info "i" that shows a glossary term's short definition on hover.
 * One definition per term lives in lib/nomenclatureGlossary.ts, so every
 * touchpoint stays consistent. The "learn more" link to the Foundations
 * glossary appears only once GLOSSARY_ARTICLE_PUBLISHED is true.
 */
export function InfoTip({
  term,
  className,
}: {
  term: GlossaryTermKey;
  className?: string;
}) {
  const { language } = useLanguage();
  const byLang = NOMENCLATURE_GLOSSARY[term];
  const entry = byLang[language] ?? byLang.en;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label={entry.term}
            className={`inline-flex h-4 w-4 items-center justify-center rounded-full align-middle text-muted-foreground transition-colors hover:text-foreground ${className ?? ""}`}
          >
            <Info className="h-3.5 w-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-xs font-semibold">{entry.term}</p>
          <p className="mt-1 text-xs">{entry.short}</p>
          {GLOSSARY_ARTICLE_PUBLISHED ? (
            <p className="mt-2 text-xs">
              <Link
                href={glossaryArticleHref(language, entry.anchor)}
                className="underline"
              >
                {LEARN_MORE[language] ?? LEARN_MORE.en}
              </Link>
            </p>
          ) : null}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

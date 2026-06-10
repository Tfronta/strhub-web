import type { Metadata } from "next";

export const SITE_URL = "https://strhub.app";
export const BASICS_LOCALES = ["en", "es", "pt"] as const;
export type BasicsLocale = (typeof BASICS_LOCALES)[number];

export function isBasicsLocale(locale: string): locale is BasicsLocale {
  return BASICS_LOCALES.includes(locale as BasicsLocale);
}

/** Per-route canonical metadata for server layouts. */
export function pageMetadata(
  path: string,
  overrides?: Partial<Metadata>
): Metadata {
  return {
    alternates: {
      canonical: path,
    },
    ...overrides,
  };
}

export function basicsArticlePath(locale: string, slug: string): string {
  return `/basics/${locale}/${slug}`;
}

export function basicsArticleAlternates(
  slug: string,
  locale: BasicsLocale
): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = {
    "x-default": basicsArticlePath("en", slug),
  };
  for (const loc of BASICS_LOCALES) {
    languages[loc] = basicsArticlePath(loc, slug);
  }
  return {
    canonical: basicsArticlePath(locale, slug),
    languages,
  };
}

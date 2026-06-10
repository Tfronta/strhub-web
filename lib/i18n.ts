export type Lang = "en" | "es" | "pt"

const cache: Record<string, any> = {}

export async function loadCatalogDict(lang: Lang) {
  if (cache[lang]) return cache[lang]

  try {
    const dict = await import(`@/locales/${lang}/catalog.json`).then((m) => m.default)
    cache[lang] = dict
    return dict
  } catch (error) {
    console.warn(`Failed to load catalog dictionary for ${lang}, falling back to English`)
    if (lang !== "en") {
      const fallbackDict = await import(`@/locales/en/catalog.json`).then((m) => m.default)
      cache[lang] = fallbackDict
      return fallbackDict
    }
    throw error
  }
}

export function getLanguageFromParams(searchParams?: URLSearchParams): Lang {
  const langParam = searchParams?.get("lang")
  if (langParam && ["en", "es", "pt"].includes(langParam)) {
    return langParam as Lang
  }
  return "en" // Default fallback
}

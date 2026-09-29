/**
 * i18n entry: domain bundles live in `lib/i18n/locales/{en,pt,es}/` (navigation, catalog, marker, tools, …).
 * Edit those files; this module only assembles `translations` and exports helpers.
 */
import en from "./i18n/locales/en"
import pt from "./i18n/locales/pt"
import es from "./i18n/locales/es"

export const translations = {
  en,
  pt,
  es,
} as const

export type Language = keyof typeof translations
export type TranslationKey = keyof typeof en

export function getNestedTranslation(obj: any, path: string): string {
  return path.split(".").reduce((current, key) => current?.[key], obj) || path
}

/**
 * Plural form of `key` for `count`, chosen with the language's CLDR plural rules:
 * `key_one`, `key_other`, ... when the locale defines them, otherwise `key` itself.
 * So "{count} sequence variants" gets a `_one` sibling instead of printing
 * "1 sequence variants".
 */
export function pluralKey(obj: any, key: string, count: number, language: Language): string {
  const category = new Intl.PluralRules(language).select(count)
  for (const candidate of [`${key}_${category}`, `${key}_other`]) {
    const value = candidate.split(".").reduce((current, part) => current?.[part], obj)
    if (typeof value === "string") return candidate
  }
  return key
}

/**
 * Looks up `key` in `language` and fills `{param}` placeholders. A numeric
 * `count` param selects the plural form (see `pluralKey`).
 */
export function translate(
  language: Language,
  key: string,
  params?: Record<string, string>,
): string {
  const dict = translations[language]
  const count = params?.count != null ? Number(params.count) : Number.NaN
  const resolvedKey = Number.isFinite(count) ? pluralKey(dict, key, count, language) : key
  const translation = getNestedTranslation(dict, resolvedKey)

  if (!params) return translation

  return Object.entries(params).reduce(
    (text, [param, value]) => text.replace(`{${param}}`, value),
    translation,
  )
}

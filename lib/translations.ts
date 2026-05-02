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

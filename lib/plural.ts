/**
 * English count phrase for text built on the server outside the i18n layer
 * (meta descriptions, JSON-LD): countNoun(1, "population", "populations") is
 * "1 population". Translated UI strings use `_one`/`_other` keys instead (see
 * `translate` in lib/translations.ts).
 */
export function countNoun(n: number, singular: string, plural: string): string {
  return `${n} ${n === 1 ? singular : plural}`;
}

/**
 * Dates in the reader's own convention, from the site's language: one
 * helper, so a card, a row, a summary and a source block never show the
 * same day three ways. The ISO string the engine writes is UTC; it is kept
 * as UTC here rather than shifted to the browser's zone, so a run verified
 * on the 19th is the 19th for everyone.
 */
const LOCALE: Record<string, string> = { en: "en-GB", es: "es", pt: "pt-BR" };

function parse(iso: string | null | undefined): Date | null {
  if (!iso) return null;
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** "19 Sept 2026", "19 sept 2026", "19 de set. de 2026". */
export function formatDate(iso: string | null | undefined, language: string): string {
  const d = parse(iso);
  if (!d) return "";
  return new Intl.DateTimeFormat(LOCALE[language] ?? "en-GB", {
    day: "numeric", month: "short", year: "numeric", timeZone: "UTC",
  }).format(d);
}

/** The date with the time of day, marked as UTC. */
export function formatDateTime(iso: string | null | undefined, language: string): string {
  const d = parse(iso);
  if (!d) return "";
  const s = new Intl.DateTimeFormat(LOCALE[language] ?? "en-GB", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "UTC",
  }).format(d);
  return `${s} UTC`;
}

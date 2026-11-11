// Analytics consent (Google Consent Mode v2).
//
// Visitors in the European Economic Area, the United Kingdom and Switzerland
// are asked before Google Analytics stores anything in their browser: until
// they accept, Consent Mode keeps `analytics_storage` denied and GA4 only
// sends signals without identifiers. Everywhere else Analytics starts
// granted, and anyone can still turn it off from "Cookie preferences" in the
// footer. Ads storage is always denied: STRhub shows no ads.

export const CONSENT_COOKIE = "strhub-consent";
/** A year, then we ask again (the Spanish AEPD allows up to 24 months). */
export const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export type ConsentChoice = "granted" | "denied";

/** EU 27 + Iceland, Liechtenstein, Norway (EEA), United Kingdom, Switzerland. */
export const CONSENT_COUNTRIES: ReadonlySet<string> = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU",
  "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES",
  "SE", "IS", "LI", "NO", "GB", "CH",
]);

export function parseConsentChoice(value: string | null | undefined): ConsentChoice | null {
  return value === "granted" || value === "denied" ? value : null;
}

/**
 * `country` is Vercel's `x-vercel-ip-country`. Without it (local development)
 * we ask, which is the safe side; `askEveryone` shows the banner to all
 * visitors so it can be reviewed on preview deployments from anywhere.
 */
export function consentRequired(
  country: string | null | undefined,
  { askEveryone = false }: { askEveryone?: boolean } = {},
): boolean {
  if (askEveryone || !country) return true;
  return CONSENT_COUNTRIES.has(country.toUpperCase());
}

/** A stored choice always wins; otherwise denied only where we must ask. */
export function initialAnalyticsStorage(
  required: boolean,
  choice: ConsentChoice | null,
): ConsentChoice {
  return choice ?? (required ? "denied" : "granted");
}

/**
 * Runs before the Google Analytics config, so the first page view already
 * respects the choice. Only fixed strings reach the page.
 */
export function consentDefaultScript(analyticsStorage: ConsentChoice): string {
  const state = analyticsStorage === "granted" ? "granted" : "denied";
  return [
    "window.dataLayer=window.dataLayer||[];",
    "function gtag(){dataLayer.push(arguments);}",
    "gtag('consent','default',{",
    "ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',",
    `analytics_storage:'${state}'`,
    "});",
  ].join("");
}

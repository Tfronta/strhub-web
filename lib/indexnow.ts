import { SITE_URL } from "@/lib/seo";

/**
 * IndexNow (https://www.indexnow.org): one ping tells Bing, DuckDuckGo, Yandex,
 * Seznam and Naver that a URL changed, instead of submitting URLs by hand in
 * Bing Webmaster Tools. The key is public by design: search engines verify it
 * by fetching `${SITE_URL}/${INDEXNOW_KEY}.txt`, served from public/.
 */
export const INDEXNOW_KEY = "8c2d37b6c11c1c76841aae3ae8e8af7b";
export const INDEXNOW_HOST = new URL(SITE_URL).host;
export const INDEXNOW_KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`;
export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
/** Per-request limit set by the protocol. */
export const INDEXNOW_MAX_URLS = 10_000;

export type SitemapEntry = { url: string; lastModified: Date | null };

/** Minimal parser for our own sitemap: one <loc> and, optionally, one <lastmod> per <url>. */
export function parseSitemap(xml: string): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  for (const [, block] of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = block.match(/<loc>\s*([^<\s]+)\s*<\/loc>/)?.[1];
    if (!loc) continue;
    const lastmod = block.match(/<lastmod>\s*([^<\s]+)\s*<\/lastmod>/)?.[1];
    const date = lastmod ? new Date(lastmod) : null;
    entries.push({
      url: loc,
      lastModified: date && !Number.isNaN(date.getTime()) ? date : null,
    });
  }
  return entries;
}

/** Sitemap URLs whose lastmod is on or after `since`; entries without a date are skipped. */
export function urlsModifiedSince(entries: SitemapEntry[], since: Date): string[] {
  return entries
    .filter((e) => e.lastModified !== null && e.lastModified >= since)
    .map((e) => e.url);
}

/**
 * Keeps absolute URLs on our host, once each, and rejects anything else: the
 * protocol only accepts URLs from the host that serves the key file.
 */
export function normalizeIndexNowUrls(urls: string[]): {
  accepted: string[];
  rejected: string[];
} {
  const accepted: string[] = [];
  const rejected: string[] = [];
  const seen = new Set<string>();
  for (const raw of urls) {
    const value = raw.trim();
    if (!value) continue;
    let parsed: URL;
    try {
      parsed = new URL(value);
    } catch {
      rejected.push(value);
      continue;
    }
    if (parsed.protocol !== "https:" || parsed.host !== INDEXNOW_HOST) {
      rejected.push(value);
      continue;
    }
    parsed.hash = "";
    const url = parsed.toString();
    if (seen.has(url)) continue;
    seen.add(url);
    accepted.push(url);
  }
  return { accepted, rejected };
}

export type IndexNowResult = {
  /** HTTP status from api.indexnow.org: 200 or 202 mean accepted. */
  status: number;
  ok: boolean;
  submitted: string[];
  rejected: string[];
};

/** Submits up to INDEXNOW_MAX_URLS URLs in one request. Resolves with the response status, never throws on 4xx. */
export async function submitToIndexNow(
  urls: string[],
  fetchImpl: typeof fetch = fetch,
): Promise<IndexNowResult> {
  const { accepted, rejected } = normalizeIndexNowUrls(urls);
  if (accepted.length === 0) {
    return { status: 0, ok: false, submitted: [], rejected };
  }
  if (accepted.length > INDEXNOW_MAX_URLS) {
    throw new Error(
      `IndexNow accepts at most ${INDEXNOW_MAX_URLS} URLs per request (got ${accepted.length})`,
    );
  }
  const response = await fetchImpl(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: INDEXNOW_HOST,
      key: INDEXNOW_KEY,
      keyLocation: INDEXNOW_KEY_LOCATION,
      urlList: accepted,
    }),
  });
  return {
    status: response.status,
    ok: response.status === 200 || response.status === 202,
    submitted: accepted,
    rejected,
  };
}

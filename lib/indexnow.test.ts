import { describe, expect, it, vi } from "vitest";
import {
  INDEXNOW_ENDPOINT,
  INDEXNOW_KEY,
  INDEXNOW_KEY_LOCATION,
  normalizeIndexNowUrls,
  parseSitemap,
  submitToIndexNow,
  urlsModifiedSince,
} from "./indexnow";

const SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>https://strhub.app/</loc><lastmod>2026-09-17</lastmod><priority>1</priority></url>
<url>
<loc>https://strhub.app/basics/en/what-is-a-str</loc>
<lastmod>2026-04-28T17:22:09.868Z</lastmod>
</url>
<url><loc>https://strhub.app/no-date</loc></url>
</urlset>`;

describe("parseSitemap / urlsModifiedSince", () => {
  it("reads loc and lastmod in both date formats the sitemap emits", () => {
    const entries = parseSitemap(SITEMAP);
    expect(entries.map((e) => e.url)).toEqual([
      "https://strhub.app/",
      "https://strhub.app/basics/en/what-is-a-str",
      "https://strhub.app/no-date",
    ]);
    expect(entries[0].lastModified?.toISOString()).toBe("2026-09-17T00:00:00.000Z");
    expect(entries[1].lastModified?.toISOString()).toBe("2026-04-28T17:22:09.868Z");
    expect(entries[2].lastModified).toBeNull();
  });

  it("keeps only URLs modified on or after the cut-off and skips undated ones", () => {
    const entries = parseSitemap(SITEMAP);
    expect(urlsModifiedSince(entries, new Date("2026-09-01"))).toEqual([
      "https://strhub.app/",
    ]);
    expect(urlsModifiedSince(entries, new Date("2026-01-01"))).toHaveLength(2);
    expect(urlsModifiedSince(entries, new Date("2026-09-18"))).toEqual([]);
  });
});

describe("normalizeIndexNowUrls", () => {
  it("accepts https URLs on strhub.app once each and rejects the rest", () => {
    const { accepted, rejected } = normalizeIndexNowUrls([
      " https://strhub.app/marker/dys505 ",
      "https://strhub.app/marker/dys505#tabs",
      "http://strhub.app/marker/dys522",
      "https://www.strhub.app/marker/dys522",
      "https://example.com/",
      "not a url",
      "",
    ]);
    expect(accepted).toEqual(["https://strhub.app/marker/dys505"]);
    expect(rejected).toEqual([
      "http://strhub.app/marker/dys522",
      "https://www.strhub.app/marker/dys522",
      "https://example.com/",
      "not a url",
    ]);
  });
});

describe("submitToIndexNow", () => {
  it("posts host, key, key location and the accepted URLs to api.indexnow.org", async () => {
    const fetchImpl = vi.fn(async () => new Response(null, { status: 202 }));
    const result = await submitToIndexNow(
      ["https://strhub.app/", "https://example.com/x"],
      fetchImpl as unknown as typeof fetch,
    );
    expect(result).toEqual({
      status: 202,
      ok: true,
      submitted: ["https://strhub.app/"],
      rejected: ["https://example.com/x"],
    });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(INDEXNOW_ENDPOINT);
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string)).toEqual({
      host: "strhub.app",
      key: INDEXNOW_KEY,
      keyLocation: INDEXNOW_KEY_LOCATION,
      urlList: ["https://strhub.app/"],
    });
  });

  it("does not call the endpoint when nothing is left to submit", async () => {
    const fetchImpl = vi.fn();
    const result = await submitToIndexNow(["https://example.com/"], fetchImpl);
    expect(result.status).toBe(0);
    expect(result.ok).toBe(false);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("reports a rejected key or payload without throwing", async () => {
    const fetchImpl = vi.fn(async () => new Response("bad key", { status: 403 }));
    const result = await submitToIndexNow(["https://strhub.app/"], fetchImpl);
    expect(result.status).toBe(403);
    expect(result.ok).toBe(false);
  });
});

describe("key file", () => {
  it("is served from public/ under the name the protocol expects", async () => {
    const fs = await import("node:fs/promises");
    const path = await import("node:path");
    const file = path.join(process.cwd(), "public", `${INDEXNOW_KEY}.txt`);
    expect((await fs.readFile(file, "utf8")).trim()).toBe(INDEXNOW_KEY);
    expect(INDEXNOW_KEY).toMatch(/^[a-zA-Z0-9-]{8,128}$/);
  });
});

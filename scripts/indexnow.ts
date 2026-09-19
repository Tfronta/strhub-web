import {
  INDEXNOW_KEY_LOCATION,
  normalizeIndexNowUrls,
  parseSitemap,
  submitToIndexNow,
  urlsModifiedSince,
} from "../lib/indexnow";
import { SITE_URL } from "../lib/seo";

/**
 * Pings IndexNow with the URLs that changed. Three ways to pick them:
 *
 *   npm run indexnow                          sitemap URLs with lastmod in the last 2 days
 *   npm run indexnow -- --since=7             same, with a 7-day window
 *   npm run indexnow -- --all                 every sitemap URL (first setup, or after a key change)
 *   npm run indexnow -- https://strhub.app/marker/dys505 ...   explicit URLs
 *
 * Add --dry-run to print the list without sending it. The production workflow
 * (.github/workflows/indexnow.yml) runs the default mode after each deploy, so
 * a page is announced as soon as its sitemap lastmod moves.
 */

const DEFAULT_WINDOW_DAYS = 2;
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;

type Options = {
  all: boolean;
  dryRun: boolean;
  sinceDays: number;
  urls: string[];
};

function parseArgs(argv: string[]): Options {
  const options: Options = {
    all: false,
    dryRun: false,
    sinceDays: DEFAULT_WINDOW_DAYS,
    urls: [],
  };
  for (const arg of argv) {
    if (arg === "--all") options.all = true;
    else if (arg === "--dry-run") options.dryRun = true;
    else if (arg.startsWith("--since=")) {
      const days = Number(arg.slice("--since=".length));
      if (!Number.isFinite(days) || days <= 0) {
        throw new Error(`--since expects a positive number of days, got "${arg}"`);
      }
      options.sinceDays = days;
    } else if (arg.startsWith("--")) {
      throw new Error(`Unknown option ${arg}`);
    } else options.urls.push(arg);
  }
  return options;
}

async function keyFileIsLive(): Promise<boolean> {
  try {
    const response = await fetch(INDEXNOW_KEY_LOCATION, { cache: "no-store" });
    return response.ok;
  } catch {
    return false;
  }
}

async function pickUrls(options: Options): Promise<string[]> {
  if (options.urls.length > 0) {
    const { accepted, rejected } = normalizeIndexNowUrls(options.urls);
    for (const url of rejected) console.warn(`  skipped (not an https URL on this host): ${url}`);
    return accepted;
  }
  const response = await fetch(SITEMAP_URL, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Could not fetch ${SITEMAP_URL}: HTTP ${response.status}`);
  }
  const entries = parseSitemap(await response.text());
  if (options.all) return entries.map((e) => e.url);
  const since = new Date(Date.now() - options.sinceDays * 24 * 60 * 60 * 1000);
  return urlsModifiedSince(entries, since);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const urls = await pickUrls(options);
  if (urls.length === 0) {
    console.log(
      options.urls.length === 0 && !options.all
        ? `No sitemap URL changed in the last ${options.sinceDays} day(s); nothing to send.`
        : "No URLs to send.",
    );
    return;
  }
  console.log(`${options.dryRun ? "Would send" : "Sending"} ${urls.length} URL(s) to IndexNow:`);
  for (const url of urls) console.log(`  ${url}`);
  if (options.dryRun) return;

  if (!(await keyFileIsLive())) {
    throw new Error(
      `Key file ${INDEXNOW_KEY_LOCATION} is not reachable yet; deploy public/ first.`,
    );
  }
  const result = await submitToIndexNow(urls);
  if (!result.ok) {
    throw new Error(`IndexNow answered HTTP ${result.status}`);
  }
  console.log(`IndexNow accepted ${result.submitted.length} URL(s) (HTTP ${result.status}).`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

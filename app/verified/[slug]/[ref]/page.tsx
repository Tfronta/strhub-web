import { notFound, redirect } from "next/navigation";

const SAFE_SLUG = /^[A-Za-z0-9._-]+$/;
const REF_PATTERN = /^([0-9a-f]{7,40})(-curated)?$/i;

/**
 * Friendly redirect from gh-pages folder-style URLs (`/verified/<slug>/<sha>` or
 * `/verified/<slug>/<sha>-curated`) to the canonical query-parameter route
 * (`/verified/<slug>?at=<sha7>&recipe=curated`).
 */
export default async function VerifiedRefRedirectPage({
  params,
}: {
  params: Promise<{ slug: string; ref: string }>;
}) {
  const { slug, ref } = await params;
  if (!SAFE_SLUG.test(slug)) notFound();
  const match = REF_PATTERN.exec(ref);
  if (!match) notFound();

  const shortSha = match[1].slice(0, 7).toLowerCase();
  const isCurated = Boolean(match[2]);
  const query = isCurated ? `?at=${shortSha}&recipe=curated` : `?at=${shortSha}`;
  redirect(`/verified/${slug}${query}`);
}

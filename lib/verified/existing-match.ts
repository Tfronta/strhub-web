/**
 * Look up whether a resolved (repoSlug, sha) already has a published report
 * in the STRhub Verified catalogue (`index.json`). Used by `/api/verify/resolve-ref`
 * to display a non-blocking notice on `/verified/submit`.
 */
import type { VerifiedIndex, VerifiedLevel } from "@/types/verified";
import { historyOf, repoEntries, rowHref } from "./history";
import { mayStandBehindBadge } from "./instrument";

export interface ExistingRunSnapshot {
  level: VerifiedLevel;
  verdict: string | null;
  errors_reported: boolean;
  href: string;
}

export interface ExistingCatalogMatch {
  slug: string;
  href: string;
  generated: string | null;
  version: string | null;
  auto: ExistingRunSnapshot | null;
  manual: ExistingRunSnapshot | null;
}

function shaMatches(rowSha: string | null | undefined, targetSha: string): boolean {
  if (!rowSha) return false;
  const a = rowSha.trim().toLowerCase();
  const b = targetSha.trim().toLowerCase();
  if (a.length < 7 || b.length < 7) return false;
  return a === b || a.startsWith(b) || b.startsWith(a);
}

export function findExistingCommitMatch(
  index: VerifiedIndex,
  repoSlug: string,
  sha: string,
): ExistingCatalogMatch | null {
  const entries = repoEntries(index, `https://github.com/${repoSlug}`);
  if (entries.length === 0) return null;

  const live = historyOf(entries).filter((r) => !r.retired && shaMatches(r.sha, sha));
  if (live.length === 0) return null;

  const autoRow = live.find((r) => mayStandBehindBadge(r.instrument));
  const manualRow = live.find((r) => r.instrument === "curated");
  const primary = autoRow ?? manualRow;
  if (!primary) return null;

  return {
    slug: primary.slug,
    href: rowHref(primary),
    generated: primary.generated ?? manualRow?.generated ?? null,
    version: primary.version ?? manualRow?.version ?? null,
    auto: autoRow
      ? {
          level: autoRow.level,
          verdict: autoRow.verdict,
          errors_reported: autoRow.errors_reported,
          href: rowHref(autoRow),
        }
      : null,
    manual: manualRow
      ? {
          level: manualRow.level,
          verdict: manualRow.verdict,
          errors_reported: manualRow.errors_reported,
          href: rowHref(manualRow),
        }
      : null,
  };
}

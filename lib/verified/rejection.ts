/**
 * The notice a stopped run leaves behind, and how the web gets hold of it.
 *
 * Two things can stop a run before any gate is judged: the regions BED targets
 * coordinates the reference slice does not cover (the submitter's to fix, free),
 * or the manifest names a BED that never made it into the engine repo (ours).
 * `harness/rejection.py` already writes both up carefully — with the fault named,
 * because an explanation that blames the wrong party is worse than none — commits
 * the file to the engine repo and uploads it as an artifact.
 *
 * Nobody read it. The submitter watching the form saw a failed run and a link to
 * a CI log, while the sentence explaining what happened and whose fault it was
 * sat in a directory only we look at. That is the gap this file closes.
 *
 * The notice is NOT an attestation: a stopped run has nothing to attest, so it
 * lives under state/ rather than in the published reports, and is fetched from
 * the engine repo's default branch rather than from gh-pages.
 */
import { getFileContent } from "./github";

/** Who a stopped run belongs to. Mirrors REASONS in harness/rejection.py. */
export type RejectionFault = "strhub" | "author";

/** What `harness/validate_bed.py` measured about the submitted BED. */
export interface RejectionValidation {
  pass?: boolean;
  covered_loci?: string[];
  covered_count?: number;
  out_of_panel?: string[];
  min_loci?: number;
  panel_size?: number;
  reason?: string;
}

export interface VerifiedRejection {
  schema?: string;
  slug?: string;
  fault?: RejectionFault;
  /** e.g. "regions_outside_panel" — the machine-readable cause. */
  reason?: string;
  title?: string;
  /** The specific item: a path, an interval, whatever names the problem. */
  detail?: string;
  next_step?: string;
  gates_run?: boolean;
  run_url?: string;
  created_at?: string;
  validation?: RejectionValidation;
}

export function rejectionPath(slug: string): string {
  return `state/rejections/${slug}.json`;
}

/** Slugs are flat file stems; anything else would read a path we did not mean. */
function isSafeSlug(slug: string): boolean {
  return /^[a-z0-9][a-z0-9._-]*$/i.test(slug) && slug.length <= 100;
}

/**
 * The notice for a run, or null.
 *
 * `runUrl` is required and checked against the notice's own: the file is keyed
 * by slug and survives, so a tool rejected in March and re-submitted in June
 * still has March's notice sitting there. Showing it against a later, unrelated
 * failure would explain the wrong thing with total confidence — the failure mode
 * that makes a stale cache worse than an empty one. No run URL, no match, no
 * notice.
 */
export async function getRejection(
  slug: string,
  runUrl: string | null | undefined,
): Promise<VerifiedRejection | null> {
  if (!slug || !isSafeSlug(slug) || !runUrl) return null;
  let raw: string | null;
  try {
    raw = await getFileContent(rejectionPath(slug));
  } catch (e) {
    // Every failure, not a chosen few. The caller wants the explanation or
    // nothing, and the run's own outcome — which it already has — is the answer
    // that matters; losing that to a bad minute at GitHub would be a poor trade.
    console.error("verify/rejection lookup failed:", e);
    return null;
  }
  if (!raw) return null;

  let notice: VerifiedRejection;
  try {
    notice = JSON.parse(raw) as VerifiedRejection;
  } catch {
    return null;
  }
  if (notice.run_url !== runUrl) return null;
  return notice;
}

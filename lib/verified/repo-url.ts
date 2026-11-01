/**
 * Reading a public GitHub repository URL. Pure, so the browser can use it too:
 * the start form checks a pasted URL before asking the server to resolve it.
 */

/** owner/name from a public GitHub URL, or null if it is not one. */
export function repoSlugOf(url: string): string | null {
  const m = url
    .trim()
    .replace(/\.git$/, "")
    .replace(/\/+$/, "")
    .match(/^https:\/\/github\.com\/([A-Za-z0-9._-]+)\/([A-Za-z0-9._-]+)(?:\/(?:tree|commit|releases\/tag|blob)\/[^?#]+)?$/);
  return m ? `${m[1]}/${m[2]}` : null;
}

/** A branch, tag or commit embedded in a pasted GitHub URL (/tree/<ref>, /commit/<sha>, /releases/tag/<tag>). */
export function repoRefOf(url: string): string | null {
  const m = url
    .trim()
    .replace(/\/+$/, "")
    .match(/^https:\/\/github\.com\/[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+\/(?:tree|commit|releases\/tag)\/([^/?#]+)$/);
  return m ? decodeURIComponent(m[1]) : null;
}

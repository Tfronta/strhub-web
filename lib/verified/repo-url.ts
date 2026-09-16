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
    .match(/^https:\/\/github\.com\/([A-Za-z0-9._-]+)\/([A-Za-z0-9._-]+)$/);
  return m ? `${m[1]}/${m[2]}` : null;
}

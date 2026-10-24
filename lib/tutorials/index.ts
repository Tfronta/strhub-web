import type { Language } from "@/lib/translations";
import { CONTACT_EMAIL } from "@/lib/verified/contact";
import hipstrJson from "@/data/tutorials/hipstr-first-steps.json";
import type { Tutorial } from "./types";

export type * from "./types";
export { HIPSTR_TUTORIAL_PATH } from "./paths";

/**
 * Copied from the strhub-tutorials project
 * (`salida/hipstr/web/hipstr-first-steps.json`). Replace the file to update
 * the page; do not edit it by hand.
 */
export const hipstrTutorial = hipstrJson as Tutorial;

/**
 * Privacy-enhanced YouTube embed, with captions on in the page language:
 * `cc_load_policy=1` turns them on, `cc_lang_pref` picks the track and `hl`
 * sets the player's own language.
 */
export function youtubeEmbedUrl(id: string, language: Language): string {
  const params = new URLSearchParams({
    cc_load_policy: "1",
    cc_lang_pref: language,
    hl: language,
    rel: "0",
  });
  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?${params}`;
}

/**
 * "Stuck here?" goes to the site's one contact address, as a mailto like the
 * /about form: nothing is sent from the page, and the message arrives naming
 * the tutorial, the step and the reader's system.
 */
export function stuckMailto(params: {
  subject: string;
  tutorialId: string;
  stepId: string;
  stepLabel: string;
  system: string;
  pageUrl: string;
  what: string;
}): string {
  const body =
    [
      `Tutorial: ${params.tutorialId}/${params.stepId}`,
      `Step: ${params.stepLabel}`,
      `System: ${params.system}`,
      params.pageUrl ? `Page: ${params.pageUrl}` : "",
    ]
      .filter(Boolean)
      .join("\n") +
    "\n\n" +
    params.what.trim() +
    "\n";
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(params.subject)}&body=${encodeURIComponent(body)}`;
}

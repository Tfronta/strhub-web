// Custom GA4 events. Analytics itself is loaded once in app/layout.tsx with
// <GoogleAnalytics> from @next/third-parties; this only queues events on the
// same dataLayer through its sendGAEvent.
//
// Every event carries `site_language`: the language chosen in the STRhub
// interface (en, es or pt), not the browser's. Register it in GA4 as an
// event-scoped custom dimension to see it in reports.

import { sendGAEvent } from "@next/third-parties/google";
import type { Language } from "@/lib/translations";

export type AnalyticsEventName =
  | "verified_submit"
  | "mixture_simulator_run"
  | "motif_explorer_marker_select"
  | "tutorial_copy_command"
  | "tutorial_video_play";

export type AnalyticsParams = Record<string, string | number | boolean | null | undefined>;

// GA4 drops parameter values longer than 100 characters.
const MAX_VALUE_LENGTH = 100;

/** Drops empty values, trims long strings and adds `site_language`. */
export function buildEventParams(
  language: Language,
  params: AnalyticsParams = {},
): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    out[key] = typeof value === "string" ? value.slice(0, MAX_VALUE_LENGTH) : value;
  }
  out.site_language = language;
  return out;
}

export function trackEvent(
  name: AnalyticsEventName,
  language: Language,
  params?: AnalyticsParams,
): void {
  if (typeof window === "undefined") return;
  try {
    sendGAEvent("event", name, buildEventParams(language, params));
  } catch {
    // Analytics must never break the page.
  }
}

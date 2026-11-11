"use client";

import { useCallback, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/language-context";
import { trackEvent, type AnalyticsEventName, type AnalyticsParams } from "@/lib/analytics";

/**
 * Sends a GA4 event tagged with the interface language. The returned function
 * is stable, so it can sit in effects without re-running them when the
 * reader switches language.
 */
export function useTrackEvent() {
  const { language } = useLanguage();
  const languageRef = useRef(language);
  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  return useCallback(
    (name: AnalyticsEventName, params?: AnalyticsParams) =>
      trackEvent(name, languageRef.current, params),
    [],
  );
}

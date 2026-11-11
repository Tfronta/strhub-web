"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import {
  CONSENT_COOKIE,
  CONSENT_MAX_AGE_SECONDS,
  type ConsentChoice,
} from "@/lib/consent";

interface ConsentContextType {
  /** The visitor must accept before Analytics stores cookies (EEA, UK, CH). */
  required: boolean;
  choice: ConsentChoice | null;
  bannerOpen: boolean;
  /** True when opened from "Cookie preferences" rather than on arrival. */
  reopened: boolean;
  choose: (choice: ConsentChoice) => void;
  openPreferences: () => void;
  closeBanner: () => void;
}

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

function persistChoice(choice: ConsentChoice) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${choice}; path=/; max-age=${CONSENT_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}

/** Removes `_ga` and `_ga_<id>` on every domain level GA may have used. */
function clearAnalyticsCookies() {
  const names = document.cookie
    .split("; ")
    .map((row) => row.split("=")[0])
    .filter((name) => name === "_ga" || name.startsWith("_ga_"));
  const parts = window.location.hostname.split(".");
  const domains = [""];
  for (let i = 0; i < parts.length - 1; i++) domains.push(`; domain=.${parts.slice(i).join(".")}`);
  for (const name of names) {
    for (const domain of domains) {
      document.cookie = `${name}=; path=/; max-age=0${domain}`;
    }
  }
}

export function ConsentProvider({
  required,
  initialChoice,
  children,
}: {
  required: boolean;
  initialChoice: ConsentChoice | null;
  children: ReactNode;
}) {
  const [choice, setChoice] = useState<ConsentChoice | null>(initialChoice);
  const [bannerOpen, setBannerOpen] = useState(required && !initialChoice);
  const [reopened, setReopened] = useState(false);

  const choose = useCallback((next: ConsentChoice) => {
    setChoice(next);
    setBannerOpen(false);
    setReopened(false);
    persistChoice(next);
    try {
      sendGAEvent("consent", "update", { analytics_storage: next });
    } catch {
      // Analytics must never break the page.
    }
    if (next === "denied") clearAnalyticsCookies();
  }, []);

  const openPreferences = useCallback(() => {
    setReopened(true);
    setBannerOpen(true);
  }, []);

  const closeBanner = useCallback(() => {
    setBannerOpen(false);
    setReopened(false);
  }, []);

  const value = useMemo(
    () => ({ required, choice, bannerOpen, reopened, choose, openPreferences, closeBanner }),
    [required, choice, bannerOpen, reopened, choose, openPreferences, closeBanner],
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent() {
  const context = useContext(ConsentContext);
  if (context === undefined) {
    throw new Error("useConsent must be used within a ConsentProvider");
  }
  return context;
}

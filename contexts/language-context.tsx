"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  translations,
  type Language,
  getNestedTranslation,
} from "@/lib/translations";

const LANGUAGE_STORAGE_KEY = "strhub-language";
const LANGUAGE_COOKIE_NAME = "strhub-language";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

const supportedLanguages: Language[] = ["en", "es", "pt"];

const readLanguageCookie = (): Language | null => {
  if (typeof document === "undefined") {
    return null;
  }

  const cookieEntry = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${LANGUAGE_COOKIE_NAME}=`));

  if (!cookieEntry) {
    return null;
  }

  const [, value] = cookieEntry.split("=");
  if (!value) {
    return null;
  }

  const decoded = decodeURIComponent(value) as Language;
  return supportedLanguages.includes(decoded) ? decoded : null;
};

const getStoredLanguage = (): Language | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
  if (stored && supportedLanguages.includes(stored)) {
    return stored;
  }

  return readLanguageCookie();
};

const persistLanguageCookie = (value: Language) => {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${LANGUAGE_COOKIE_NAME}=${encodeURIComponent(
    value,
  )}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

interface LanguageProviderProps {
  children: ReactNode;
  initialLanguage?: Language | null;
}

export function LanguageProvider({
  children,
  initialLanguage,
}: LanguageProviderProps) {
  // The first client render must match the server (which only knows the
  // cookie). Reading localStorage here caused hydration errors whenever the
  // cookie was missing but localStorage still held a language.
  const [language, setLanguageState] = useState<Language>(() =>
    initialLanguage && supportedLanguages.includes(initialLanguage)
      ? initialLanguage
      : "en",
  );

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    }
    persistLanguageCookie(lang);
  };

  useEffect(() => {
    // After hydration, honour a language saved in localStorage and refresh the
    // cookie so the next server render already uses it.
    const storedLanguage = getStoredLanguage();
    if (storedLanguage && storedLanguage !== language) {
      setLanguageState(storedLanguage);
      persistLanguageCookie(storedLanguage);
    }
    // We intentionally run this only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const t = (key: string, params?: Record<string, string>): string => {
    const translation = getNestedTranslation(translations[language], key);

    if (!params) return translation;

    const interpolated = Object.entries(params).reduce(
      (text, [param, value]) => text.replace(`{${param}}`, value),
      translation,
    );

    return interpolated;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

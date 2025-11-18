"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
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

  return decodeURIComponent(value) as Language;
};

const persistLanguageCookie = (value: Language) => {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${LANGUAGE_COOKIE_NAME}=${encodeURIComponent(
    value
  )}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    persistLanguageCookie(lang);
  };

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem(
      LANGUAGE_STORAGE_KEY
    ) as Language | null;
    const cookieLanguage = readLanguageCookie();
    const initialLanguage = savedLanguage ?? cookieLanguage;

    if (initialLanguage && translations[initialLanguage]) {
      setLanguageState(initialLanguage);
    }
  }, []);

  // Save language to localStorage when it changes
  // useEffect(() => {
  //   localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  //   persistLanguageCookie(language);
  // }, [language]);

  // Translation function with parameter substitution
  const t = (key: string, params?: Record<string, string>): string => {
    const translation = getNestedTranslation(translations[language], key);

    if (!params) return translation;

    // Replace parameters in the translation
    return Object.entries(params).reduce(
      (text, [param, value]) => text.replace(`{${param}}`, value),
      translation
    );
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

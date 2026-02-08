import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/contexts/language-context";
import type { Language } from "@/lib/translations";
import { Suspense } from "react";
import { GlobalHeader } from "@/components/global-header";
import { Toaster } from "@/components/ui/toaster";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "STRhub - Central Hub for Short Tandem Repeats",
  description:
    "Modern educational and scientific platform for STR research, forensic analysis, and genetic studies",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const cookieLanguage = cookieStore.get("strhub-language")?.value;
  const supportedLanguages: Language[] = ["en", "es", "pt"];
  const initialLanguage =
    cookieLanguage && supportedLanguages.includes(cookieLanguage as Language)
      ? (cookieLanguage as Language)
      : undefined;
  const htmlLanguage = initialLanguage ?? "en";

  return (
    <html lang={htmlLanguage} suppressHydrationWarning>
      <body className={`font-sans ${inter.variable}`}>
        <GoogleAnalytics gaId="G-07HDMGRYM4" />
        <Suspense fallback={null}>
          <ThemeProvider>
            <LanguageProvider initialLanguage={initialLanguage}>
              <div className="min-h-screen bg-background flex flex-col">
                <GlobalHeader />
                <main className="flex-1">{children}</main>
                <Toaster />
              </div>
            </LanguageProvider>
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}

import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies, headers } from "next/headers";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/contexts/language-context";
import type { Language } from "@/lib/translations";
import { GlobalHeader } from "@/components/global-header";
import { SiteFooter } from "@/components/site-footer";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GoogleAnalytics } from "@next/third-parties/google";
import { JsonLd } from "@/components/json-ld";
import { DATASET_CREATOR } from "@/lib/seo";
import "./globals.css";
import { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  // Pinch-zoom stays enabled (WCAG 1.4.4).
};

const SITE_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://strhub.app/#organization",
      name: "STRhub",
      // The full name and the topics tell search engines which "STRhub" this
      // is: not the telco (StarHub) nor the short-term-rental sites (STR Hub).
      alternateName: "STRhub, Central Hub for Short Tandem Repeats",
      description:
        "Open-access platform for forensic short tandem repeat (STR) genetics: marker catalog, allele frequencies, DNA mixture simulator, STR motif explorer, tools, datasets and educational articles.",
      url: "https://strhub.app",
      logo: "https://strhub.app/strhub-logo-pdf.png",
      founder: DATASET_CREATOR,
      knowsAbout: [
        "short tandem repeats",
        "forensic genetics",
        "STR allele frequencies",
        "massively parallel sequencing",
        "capillary electrophoresis",
        "population genetics",
      ],
      sameAs: ["https://github.com/Tfronta/strhub-web"],
    },
    {
      "@type": "WebApplication",
      "@id": "https://strhub.app/#app",
      name: "STRhub",
      url: "https://strhub.app",
      applicationCategory: "Bioinformatics",
      applicationSubCategory: "Forensic genetics",
      operatingSystem: "Web browser",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      softwareVersion: "1.0.0",
      license: "https://www.gnu.org/licenses/agpl-3.0.html",
      inLanguage: ["en", "es", "pt"],
      author: DATASET_CREATOR,
      publisher: { "@id": "https://strhub.app/#organization" },
      // Concept DOI of the archived source code (Zenodo); resolves to the latest release.
      identifier: {
        "@type": "PropertyValue",
        propertyID: "DOI",
        value: "10.5281/zenodo.22831681",
      },
      sameAs: [
        "https://github.com/Tfronta/strhub-web",
        "https://doi.org/10.5281/zenodo.22831681",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://strhub.app/#website",
      name: "STRhub",
      url: "https://strhub.app",
      description:
        "Open-access platform for forensic STR analysis: marker catalog, allele frequencies, DNA mixture simulator, STR motif explorer, tools, datasets and educational articles.",
      inLanguage: ["en", "es", "pt"],
      publisher: { "@id": "https://strhub.app/#organization" },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://strhub.app/search?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://strhub.app"),
  title: {
    default: "STRhub - Central Hub for Short Tandem Repeats",
    template: "%s | STRhub",
  },
  description:
    "Open-access platform for forensic STR analysis: marker catalog, allele frequencies, DNA mixture simulator, STR motif explorer, tools, datasets and educational articles.",
  applicationName: "STRhub",
  openGraph: {
    url: "https://strhub.app",
    siteName: "STRhub",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: [{ url: "/strhub-isologo.svg", type: "image/svg+xml", sizes: "any" }],
    shortcut: "/strhub-isologo.svg",
    apple: "/strhub-isologo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const cookieLanguage = cookieStore.get("strhub-language")?.value;
  // Set by middleware.ts on /basics/<locale>/<slug>: the URL wins over the cookie.
  const routeLanguage = headers().get("x-strhub-locale");
  const supportedLanguages: Language[] = ["en", "es", "pt"];
  const pick = (value: string | null | undefined) =>
    value && supportedLanguages.includes(value as Language)
      ? (value as Language)
      : undefined;
  const initialLanguage = pick(routeLanguage) ?? pick(cookieLanguage);
  const htmlLanguage = initialLanguage ?? "en";

  return (
    <html lang={htmlLanguage} suppressHydrationWarning>
      <body className={`font-sans ${inter.variable}`}>
        <GoogleAnalytics gaId="G-07HDMGRYM4" />
        <JsonLd data={SITE_JSON_LD} />
        <ThemeProvider>
          <LanguageProvider initialLanguage={initialLanguage}>
            <TooltipProvider delayDuration={0}>
              <div className="min-h-screen bg-background flex flex-col">
                <GlobalHeader />
                <main className="flex-1">{children}</main>
                <SiteFooter />
                <Toaster />
              </div>
            </TooltipProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

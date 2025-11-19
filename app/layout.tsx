import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { cookies } from "next/headers"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"
import type { Language } from "@/lib/translations"
import { Suspense } from "react"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "STRhub - Central Hub for Short Tandem Repeats",
  description: "Modern educational and scientific platform for STR research, forensic analysis, and genetic studies",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = cookies()
  const cookieLanguage = cookieStore.get("strhub-language")?.value
  const supportedLanguages: Language[] = ["en", "es", "pt"]
  const initialLanguage = cookieLanguage && supportedLanguages.includes(cookieLanguage as Language) ? (cookieLanguage as Language) : undefined

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${inter.variable}`}>
        <Suspense fallback={null}>
          <ThemeProvider>
            <LanguageProvider initialLanguage={initialLanguage}>{children}</LanguageProvider>
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  )
}

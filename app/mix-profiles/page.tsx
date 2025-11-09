// app/mix-profiles/page.tsx
"use client";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLanguage } from "@/contexts/language-context";
import MixProfilesDemo from "@/sections/mix-profiles/MixProfilesDemo";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Page() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("nav.home")}
          </Link>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold">
          Mix Profiles <span className="text-xs align-super">beta</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Using demo data — you can load your own samples when available.
        </p>
        <MixProfilesDemo />
      </main>
    </div>
  );
}

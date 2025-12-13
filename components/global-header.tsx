"use client";

import Link from "next/link";
import { Database } from "lucide-react";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLanguage } from "@/contexts/language-context";

const navItems = [
  { href: "/basics", labelKey: "nav.basics" },
  { href: "/catalog", labelKey: "nav.catalog" },
  { href: "/datasets", labelKey: "nav.datasets" },
  { href: "/community", labelKey: "nav.blog" },
  { href: "/tools", labelKey: "nav.tools" },
  { href: "/mix-profiles", labelKey: "nav.mixProfiles" },
  { href: "/projects", labelKey: "nav.projects" },
  { href: "/about", labelKey: "nav.about" },
];

export function GlobalHeader() {
  const { t } = useLanguage();

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-0 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 dark:to-primary bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <Database className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold dark:to-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t("home.title")}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-base font-medium hover:text-primary transition-colors"
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

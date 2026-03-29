"use client";

import Link from "next/link";
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
        <Link href="/" className="flex items-center justify-center gap-1">
          <img
            src="/strhub-isologo.svg"
            alt=""
            className="h-10 w-auto shrink-0 translate-y-px mb-1.5"
            aria-hidden={true}
          />
          <span className="text-2xl font-bold text-gradient">
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

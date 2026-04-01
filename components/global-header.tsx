"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    }
    if (mobileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileOpen]);

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-0 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2" ref={menuRef}>
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

          <button
            type="button"
            className="lg:hidden inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          {mobileOpen && (
            <nav className="absolute left-0 top-full w-full border-b bg-muted backdrop-blur-sm animate-in slide-in-from-top-2 fade-in duration-200 z-50">
              <div className="container mx-auto px-4 py-3 flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-md px-3 py-2.5 text-base font-medium hover:bg-muted hover:text-primary transition-colors"
                  >
                    {t(item.labelKey)}
                  </Link>
                ))}
              </div>
            </nav>
          )}
        </div>

        <nav className="hidden lg:flex items-center gap-6">
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

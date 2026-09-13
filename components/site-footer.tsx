"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";

const FOOTER_LINKS = [
  { href: "/catalog", labelKey: "nav.catalog" },
  { href: "/global-frequencies", labelKey: "nav.globalFrequencies" },
  { href: "/datasets", labelKey: "nav.datasets" },
  { href: "/strbase", labelKey: "nav.strbase" },
  { href: "/tools", labelKey: "nav.tools" },
  { href: "/mix-profiles", labelKey: "nav.mixProfiles" },
  { href: "/verified", labelKey: "nav.verified" },
  { href: "/basics", labelKey: "nav.basics" },
  { href: "/about", labelKey: "nav.about" },
];

export function SiteFooter() {
  const { t } = useLanguage();

  return (
    <footer className="border-t py-8 px-4 bg-card/50">
      <div className="container mx-auto flex flex-col items-center gap-4 text-center">
        <Link
          href="/"
          className="flex items-center justify-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <img
            src="/strhub-isologo.svg"
            alt=""
            className="h-9 w-auto shrink-0 translate-y-px"
            aria-hidden={true}
          />
          <span className="text-xl font-bold text-gradient">
            {t("home.title")}
          </span>
        </Link>
        <div>
          <p className="text-muted-foreground mb-2">
            {t("home.footer.mission")}
          </p>
          <p className="text-sm text-muted-foreground">
            {t("home.footer.community")}
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
          {FOOTER_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}

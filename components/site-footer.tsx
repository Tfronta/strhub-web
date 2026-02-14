"use client";

import { useLanguage } from "@/contexts/language-context";

export function SiteFooter() {
  const { t } = useLanguage();

  return (
    <footer className="border-t py-8 px-4 bg-card/50">
      <div className="container mx-auto text-center">
        <p className="text-muted-foreground mb-2">
          {t("home.footer.mission")}
        </p>
        <p className="text-sm text-muted-foreground">
          {t("home.footer.community")}
        </p>
      </div>
    </footer>
  );
}

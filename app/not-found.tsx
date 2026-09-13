"use client";

import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-24 flex flex-col items-center text-center gap-6">
      <p className="text-6xl font-bold text-primary">404</p>
      <h1 className="text-2xl font-semibold">{t("common.notFoundPage.title")}</h1>
      <p className="text-muted-foreground max-w-md">
        {t("common.notFoundPage.description")}
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Button asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            {t("common.backToHome")}
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/catalog">
            <Search className="h-4 w-4" />
            {t("common.notFoundPage.backToCatalog")}
          </Link>
        </Button>
      </div>
    </div>
  );
}

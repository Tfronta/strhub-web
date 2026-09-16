"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";
import type { PanelKind } from "@/lib/verified/dataset-provenance";

export const TONE: Record<string, string> = {
  green: "bg-teal-600 text-white border-transparent",
  amber: "bg-amber-500 text-white border-transparent",
  red: "bg-red-600 text-white border-transparent",
};

export interface LevelDisplay {
  label: string;
  tone: "green" | "amber" | "red";
}

/**
 * The first thing a reader sees: the badge, the tool, and — because a person
 * reads "v0.7" long before they read a SHA — the version it was verified at,
 * right under the name.
 */
export function ReportHeader({
  level,
  panel,
  title,
  version,
  slug,
  backLink = true,
}: {
  level: LevelDisplay;
  panel: PanelKind | null;
  title: string;
  version?: string;
  slug: string;
  backLink?: boolean;
}) {
  const { t } = useLanguage();
  return (
    <>
      {backLink && (
        <Link
          href="/verified"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> {t("verified.backToList")}
        </Link>
      )}
      <div className={cn("space-y-2", backLink && "mt-6")}>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={cn("w-fit", TONE[level.tone])}>{level.label}</Badge>
          {panel && (
            <span className="inline-flex items-center text-xs border rounded-full px-2.5 py-0.5 text-muted-foreground">
              {t(`verified.panel.${panel}`)}
            </span>
          )}
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          {title}
          {version && (
            <span className="ml-3 align-middle text-xl font-semibold text-muted-foreground">{version}</span>
          )}
        </h1>
        <p className="font-mono text-sm text-muted-foreground">{slug}</p>
      </div>
    </>
  );
}

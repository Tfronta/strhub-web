"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";
import { PageTitle } from "@/components/page-title";
import { SiteFooter } from "@/components/site-footer";
import { VERIFIED_LEVELS, type VerifiedIndex } from "@/types/verified";
import { cn } from "@/lib/utils";

const TONE: Record<string, string> = {
  green: "bg-emerald-600 text-white border-transparent",
  amber: "bg-amber-500 text-white border-transparent",
  red: "bg-red-600 text-white border-transparent",
};

export function VerifiedList({ index }: { index: VerifiedIndex }) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-[60vh]">
      <div className="container mx-auto px-4 py-8 flex-1">
        <PageTitle
          title={t("verified.title")}
          description={t("verified.description")}
        />

        {index.tools.length === 0 ? (
          <p className="mt-8 text-muted-foreground">{t("verified.empty")}</p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {index.tools.map((tool) => {
              const level = VERIFIED_LEVELS[tool.level] ?? VERIFIED_LEVELS.none;
              const markers =
                tool.distinct_str_loci != null
                  ? `${tool.distinct_str_loci} ${t("verified.col.strLoci")}` +
                    (tool.distinct_snp_markers
                      ? ` + ${tool.distinct_snp_markers} ${t("verified.col.snps")}`
                      : "")
                  : null;
              return (
                <Link key={tool.slug} href={`/verified/${tool.slug}`}>
                  <Card className="h-full transition-colors hover:border-primary">
                    <CardHeader className="space-y-2">
                      <Badge className={cn("w-fit", TONE[level.tone])}>
                        {level.label}
                      </Badge>
                      <CardTitle className="text-lg">{tool.name}</CardTitle>
                      <p className="font-mono text-xs text-muted-foreground break-all">
                        {tool.slug}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-1 text-sm text-muted-foreground">
                      {markers && (
                        <p>
                          {markers}
                          {tool.total_reads != null
                            ? ` · ${tool.total_reads} ${t("verified.col.reads")}`
                            : ""}
                        </p>
                      )}
                      {tool.generated && (
                        <p className="text-xs">
                          {t("verified.verifiedOn")}{" "}
                          {tool.generated.slice(0, 10)}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        <p className="mt-10 flex items-start gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{t("verified.disclaimer")}</span>
        </p>
      </div>
      <SiteFooter />
    </div>
  );
}

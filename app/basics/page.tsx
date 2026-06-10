"use client";

import { ClientBackToBasicsGrid, ClientCoreConceptsGrid } from "./client-components";
import { PageTitle } from "@/components/page-title";
import { useLanguage } from "@/contexts/language-context";
import { KaryotypeExplorer } from "@/components/explorer/KaryotypeExplorer";
import { Separator } from "@/components/ui/separator";
import type { ReactNode } from "react";

function withItalicLoci(text: string): ReactNode[] {
  return text.split(/(\b[Ll]oci\b)/g).map((part, idx) => {
    if (/^[Ll]oci$/.test(part)) {
      return <em key={`${part}-${idx}`}>{part}</em>;
    }
    return part;
  });
}

export default function BasicsPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background">
      {/* Page identity */}
      <section className="py-8 px-4">
        <div className="container mx-auto text-left space-y-4">
          <PageTitle
            title={t("basics.title")}
            description={withItalicLoci(t("basics.description"))}
          />
        </div>
      </section>

      {/* Section A — Interactive exploration */}
      <section className="px-4 pb-4">
        <div className="container mx-auto space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-1">
              {withItalicLoci(t("basics.explorerSectionTitle"))}
            </h2>
            <p className="text-sm text-muted-foreground">
              {withItalicLoci(t("basics.explorerSectionDesc"))}
            </p>
          </div>
          <KaryotypeExplorer showHeader={false} />
        </div>
      </section>

      <div className="container mx-auto px-4">
        <Separator />
      </div>

      {/* Section B — Core Concepts */}
      <section className="pt-8 pb-16 px-4">
        <div className="container mx-auto space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-1">
              {t("basics.coreConceptsTitle")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("basics.coreConceptsDesc")}
            </p>
          </div>

          <ClientCoreConceptsGrid />
          <ClientBackToBasicsGrid />
        </div>
      </section>
    </div>
  );
}

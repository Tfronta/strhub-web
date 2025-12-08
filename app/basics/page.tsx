"use client";

import { ClientBackToBasicsGrid } from "./client-components";
import { PageTitle } from "@/components/page-title";
import { useLanguage } from "@/contexts/language-context";

export default function BasicsPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-8 px-4">
        <div className="container mx-auto text-left space-y-4">
          <PageTitle
            title={t("basics.title")}
            description={t("basics.description")}
          />
        </div>
      </section>

      {/* Articles Grid */}
      <section className="pt-8 pb-16 px-4">
        <div className="container mx-auto">
          <ClientBackToBasicsGrid />
        </div>
      </section>
    </div>
  );
}

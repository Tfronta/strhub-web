"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import { markers } from "@/app/catalog/page";
import { KaryotypeView } from "./KaryotypeView";
import { ChromosomeDetail } from "./ChromosomeDetail";

export function KaryotypeExplorer({
  showHeader = true,
}: {
  showHeader?: boolean;
}) {
  const { t } = useLanguage();
  const [selectedChromosome, setSelectedChromosome] = useState<string | null>(
    null,
  );

  const chromosomeMarkers = useMemo(() => {
    if (!selectedChromosome) return [];
    return markers.filter((m) => m.chromosome === selectedChromosome);
  }, [selectedChromosome]);

  return (
    <div className="space-y-6">
      {showHeader && (
        <div>
          <h2 className="text-xl font-semibold mb-1">
            {t("explorer.title")}
          </h2>
          <p className="text-sm text-muted-foreground whitespace-pre-line">
            {t("explorer.description")}
          </p>
        </div>
      )}

      <KaryotypeView
        markers={markers}
        selectedChromosome={selectedChromosome}
        onSelect={(chrId) =>
          setSelectedChromosome((prev) => (prev === chrId ? null : chrId))
        }
        t={t}
      />

      {selectedChromosome && (
        <ChromosomeDetail
          chromosomeId={selectedChromosome}
          markers={chromosomeMarkers}
          onBack={() => setSelectedChromosome(null)}
          t={t}
        />
      )}
    </div>
  );
}

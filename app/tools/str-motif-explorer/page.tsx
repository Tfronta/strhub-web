"use client";

import { useState, useMemo } from "react";
import { Grid3x3, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/language-context";
import { translations } from "@/lib/translations";
import {
  FSSG_MARKERS,
  DISPLAY_MARKERS,
  FSSG_SOURCE,
  markerClass,
} from "./data/fssgData";
import { MotifStructure } from "./components/MotifStructure";
import { InfoTip } from "@/components/InfoTip";

// Read a nested string from the active locale, falling back to English.
function useStrings() {
  const { language } = useLanguage();
  const en = translations.en.motifExplorerPage as Record<string, unknown>;
  const loc = (translations[language] as { motifExplorerPage?: Record<string, unknown> })
    .motifExplorerPage;
  return (path: string): string => {
    const get = (obj: Record<string, unknown> | undefined) =>
      path.split(".").reduce<unknown>(
        (cur, key) =>
          cur && typeof cur === "object"
            ? (cur as Record<string, unknown>)[key]
            : undefined,
        obj
      );
    return (get(loc) as string) ?? (get(en) as string) ?? path;
  };
}

const GROUP_LABEL: Record<string, string> = {
  autosomal: "Autosomal",
  x: "X-STR",
  y: "Y-STR",
};

export default function MotifExplorerPage() {
  const t = useStrings();
  const [selectedMarkerId, setSelectedMarkerId] = useState<string>("CSF1PO");

  const marker = FSSG_MARKERS[selectedMarkerId];

  // Group markers for the selector.
  const grouped = useMemo(() => {
    const groups: Record<string, string[]> = { autosomal: [], x: [], y: [] };
    DISPLAY_MARKERS.forEach((m) => groups[markerClass(m)].push(m));
    return groups;
  }, []);

  const structureStrings = {
    ceLabel: t("marker.ce"),
    minimumRangeLabel: t("marker.minimumRange"),
    strandLabel: t("marker.strand"),
    canonicalTitle: t("canonical.title"),
    canonicalAltForms: t("canonical.altForms"),
    historicalTitle: t("historical.title"),
    historicalNone: t("historical.none"),
    sequenceTitle: t("sequence.title"),
    sequenceNote: t("sequence.note"),
    legendRepeat: t("sequence.legendRepeat"),
    legendMinorRepeat: t("sequence.legendMinorRepeat"),
    legendInterruption: t("sequence.legendInterruption"),
    legendFlank: t("sequence.legendFlank"),
    flankMotifLabel: t("sequence.flankMotifLabel"),
    repeatTooltip: t("sequence.repeatTooltip"),
    minorRepeatTooltip: t("sequence.minorRepeatTooltip"),
    interruptionTooltip: t("sequence.interruptionTooltip"),
    flankTooltip: t("sequence.flankTooltip"),
    phaseNote: t("sequence.phaseNote"),
    notAlignedNote: t("sequence.notAligned"),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/40">
      <section className="px-4 pt-12">
        <div className="container mx-auto flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Grid3x3 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-3xl font-bold text-gradient">{t("title")}</span>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-12 pt-6">
        <div className="mx-auto max-w-6xl">
          <p className="mb-8 text-lg text-muted-foreground">
            {t("subtitle")}
          </p>

          <div className="grid gap-6 lg:grid-cols-[30%_70%]">
            {/* Configuration */}
            <Card className="border-0 bg-card/70 shadow-lg backdrop-blur-sm">
              <CardHeader className="space-y-1.5 pb-4">
                <CardTitle className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
                  <Settings className="h-5 w-5" />
                  {t("configuration.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-0">
                <div className="space-y-2">
                  <Label className="text-base font-semibold text-foreground">
                    {t("configuration.markerLabel")}
                  </Label>
                  <Select
                    value={selectedMarkerId}
                    onValueChange={setSelectedMarkerId}
                  >
                    <SelectTrigger className="h-11 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(["autosomal", "x", "y"] as const).map((g) =>
                        grouped[g].length ? (
                          <div key={g}>
                            <div className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                              {GROUP_LABEL[g]}
                            </div>
                            {grouped[g].map((m) => (
                              <SelectItem key={m} value={m} className="text-base">
                                {m}
                              </SelectItem>
                            ))}
                          </div>
                        ) : null
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {t("help.general")}
                  </p>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    {t("scientificNote")}
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span className="italic">
                      {t("sourceLabel")}: {FSSG_SOURCE.name}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-3 text-xs"
                      asChild
                    >
                      <a href={FSSG_SOURCE.url} target="_blank" rel="noreferrer">
                        {t("sourceButtonLabel")}
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Visualization */}
            <Card className="border-0 bg-card/70 shadow-lg backdrop-blur-sm">
              <CardHeader className="space-y-1.5 pb-2">
                <CardTitle className="text-2xl font-semibold tracking-tight">
                  {t("visualizationTitle").replace("{marker}", selectedMarkerId)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 pt-2">
                {marker ? (
                  <>
                    <MotifStructure marker={marker} strings={structureStrings} />
                    <div className="flex items-start gap-1.5 border-t pt-4 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      <span>{t("kits.note")}</span>
                      <InfoTip term="kitRange" />
                    </div>
                  </>
                ) : (
                  <div className="py-12 text-center text-base text-muted-foreground">
                    <Grid3x3 className="mx-auto mb-4 h-12 w-12 opacity-50" />
                    <p>{t("configuration.emptyState")}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

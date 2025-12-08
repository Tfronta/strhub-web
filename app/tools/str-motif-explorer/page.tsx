"use client";

import { useState, useEffect } from "react";
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
import { StrKitData, StrKitType } from "./utils/motifData";
import { MotifVisualization } from "./components/MotifVisualization";
import { markerRefs } from "@/lib/markerRefs-from-data";
import strKitsData from "@/data/str_kits.json";

type GenericRecord = Record<string, unknown>;

const mergeDeep = (
  base: GenericRecord,
  override?: GenericRecord
): GenericRecord => {
  if (!override) {
    return { ...base };
  }

  const result: GenericRecord = { ...base };

  Object.keys(override).forEach((key) => {
    const overrideValue = override[key];
    if (overrideValue === undefined) {
      return;
    }

    const baseValue = base[key];
    const isBaseObject =
      baseValue && typeof baseValue === "object" && !Array.isArray(baseValue);
    const isOverrideObject =
      overrideValue &&
      typeof overrideValue === "object" &&
      !Array.isArray(overrideValue);

    if (isBaseObject && isOverrideObject) {
      result[key] = mergeDeep(
        baseValue as GenericRecord,
        overrideValue as GenericRecord
      );
    } else if (!isBaseObject && isOverrideObject) {
      result[key] = mergeDeep({}, overrideValue as GenericRecord);
    } else {
      result[key] = overrideValue;
    }
  });

  return result;
};

export default function MotifExplorerPage() {
  const [selectedMarkerId, setSelectedMarkerId] =
    useState<keyof typeof strKitsData>("CSF1PO");
  const [selectedKitId, setSelectedKitId] = useState<StrKitType | null>(null);
  const { language } = useLanguage();
  const languageContent = translations[language] as (typeof translations)["en"];
  const defaultPageContent = translations.en.motifExplorerPage;
  const localizedContent = languageContent?.motifExplorerPage;
  const pageContent = mergeDeep(
    defaultPageContent as GenericRecord,
    localizedContent as GenericRecord | undefined
  ) as typeof defaultPageContent;

  const selectedMarker = strKitsData[selectedMarkerId];

  // Get marker info from markerRefs
  const markerKey = selectedMarkerId.toUpperCase();
  const markerInfo = markerRefs[markerKey];

  // Use the selected marker ID
  const markerId = selectedMarkerId;

  const kitsForMarker = Object.keys(
    strKitsData[selectedMarkerId]
  ) as StrKitType[];

  // Ensure selectedKitId is always valid when the marker changes
  useEffect(() => {
    if (!kitsForMarker.length) {
      setSelectedKitId(null);
      return;
    }
    if (!selectedKitId || !kitsForMarker.includes(selectedKitId)) {
      setSelectedKitId(kitsForMarker[0]);
    }
  }, [markerId, kitsForMarker.join(","), selectedKitId]);

  const markerData = selectedMarker[
    selectedKitId as keyof typeof selectedMarker
  ] as StrKitData | undefined;

  const formatTemplate = (
    template?: string,
    params: Record<string, string> = {}
  ) => {
    if (!template) return "";
    return Object.entries(params).reduce(
      (acc, [key, value]) => acc.replace(`{${key}}`, value),
      template
    );
  };

  const configurationContent =
    pageContent.cards?.configuration ?? defaultPageContent.cards?.configuration;
  const visualizationContent =
    pageContent.cards?.visualization ?? defaultPageContent.cards?.visualization;
  const headerContent = pageContent.header ?? defaultPageContent.header;
  const visualizationTitle =
    formatTemplate(visualizationContent?.title, {
      marker: selectedMarkerId,
    }) || `Exploring the structure of ${selectedMarkerId}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/40">
      <section className="px-4 pt-12">
        <div className="container mx-auto flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Grid3x3 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {pageContent.title}
          </span>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <p className="text-base text-muted-foreground max-w-2xl mx-auto text-lg">
              {pageContent.subtitle}
            </p>
          </div>

          <div className="grid lg:grid-cols-[35%_65%] gap-6">
            {/* Configuration Panel */}
            <Card className="border-0 bg-card/70 backdrop-blur-sm shadow-lg">
              <CardHeader className="space-y-1.5 pb-4">
                <CardTitle className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
                  <Settings className="h-5 w-5" />
                  {configurationContent?.title ??
                    defaultPageContent.cards?.configuration?.title ??
                    "Configuration"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-0">
                <div className="space-y-2">
                  <Label
                    htmlFor="marker-select"
                    className="text-base font-semibold text-foreground"
                  >
                    {pageContent.fields?.marker?.label ??
                      defaultPageContent.fields?.marker?.label ??
                      "STR Marker"}
                  </Label>
                  <Select
                    value={selectedMarkerId}
                    onValueChange={(value) =>
                      setSelectedMarkerId(value as keyof typeof strKitsData)
                    }
                  >
                    <SelectTrigger className="h-11 text-base">
                      <SelectValue
                        placeholder={
                          configurationContent?.markerPlaceholder ??
                          defaultPageContent.cards?.configuration
                            ?.markerPlaceholder ??
                          "Select a marker"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(strKitsData).map((marker) => (
                        <SelectItem
                          key={marker}
                          value={marker}
                          className="text-base"
                        >
                          {marker}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {kitsForMarker.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-base font-semibold text-foreground">
                      {configurationContent?.kitLabel ??
                        defaultPageContent.cards?.configuration?.kitLabel ??
                        "Kit / reference sequence"}
                    </Label>
                    <Select
                      value={selectedKitId || ""}
                      onValueChange={(value) =>
                        setSelectedKitId(value as StrKitType)
                      }
                    >
                      <SelectTrigger className="h-11 text-base">
                        <SelectValue
                          placeholder={
                            configurationContent?.kitPlaceholder ??
                            defaultPageContent.cards?.configuration
                              ?.kitPlaceholder ??
                            "Select a kit"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {kitsForMarker.map((kit) => (
                          <SelectItem
                            key={kit}
                            value={kit}
                            className="text-base"
                          >
                            {kit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {pageContent.help.general}
                  </p>
                  {pageContent.scientificNote && (
                    <>
                      <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                        {pageContent.scientificNote}
                      </p>
                      <div className="mt-3 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                        <span className="italic">
                          {pageContent.sourceLabel}: STRidER
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 px-3 text-xs"
                          asChild
                        >
                          <a
                            href="https://www.isfg.org/files/db9864824b44997f1014a62a0321f0d25ef6cf98.bodner2016_strider.pdf"
                            target="_blank"
                            rel="noreferrer"
                          >
                            {pageContent.sourceButtonLabel}
                          </a>
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Visualization Panel */}
            <Card className="border-0 bg-card/70 backdrop-blur-sm shadow-lg">
              <CardHeader className="space-y-1.5 pb-2">
                <CardTitle className="text-2xl font-semibold tracking-tight">
                  {visualizationTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {selectedMarker && selectedKitId && markerData ? (
                  <MotifVisualization
                    markerId={selectedMarkerId}
                    marker={markerData}
                    pageContent={pageContent}
                    markerInfo={markerInfo}
                    // motifAllele={motifAllele}
                    selectedKitId={selectedKitId ?? undefined}
                  />
                ) : (
                  <div className="text-center py-12 text-base text-muted-foreground">
                    <Grid3x3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>
                      {configurationContent?.emptyState ??
                        defaultPageContent.cards?.configuration?.emptyState ??
                        "Please select a marker from the configuration panel."}
                    </p>
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

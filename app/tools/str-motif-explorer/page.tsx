"use client";

import { useState, useMemo, useEffect } from "react";
import { Grid3x3, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";
import { translations, type Language } from "@/lib/translations";
import { STR_MOTIFS, type MarkerMotif } from "./utils/motifData";
import { MotifVisualization } from "./components/MotifVisualization";
import { markerRefs } from "@/lib/markerRefs-from-data";
import {
  motifAlleles,
  getMotifAllele,
  type MotifAlleleDef,
} from "@/lib/strMotifData";

export default function MotifExplorerPage() {
  const [selectedMarkerId, setSelectedMarkerId] = useState<string>(
    STR_MOTIFS[0]?.id || ""
  );
  const [selectedKitId, setSelectedKitId] = useState<string | null>(null);
  const { language } = useLanguage();
  const languageContent = translations[language] as (typeof translations)["en"];
  const defaultPageContent = translations.en.motifExplorerPage;
  const pageContent = languageContent?.motifExplorerPage ?? defaultPageContent;

  const selectedMarker = STR_MOTIFS.find((m) => m.id === selectedMarkerId);

  // Get marker info from markerRefs
  const markerKey = selectedMarkerId.toUpperCase();
  const markerInfo = markerRefs[markerKey];

  // For now we only support CSF1PO
  const markerId = "CSF1PO";

  // Derive available kits for the marker
  const kitsForMarker = Array.from(
    new Set(
      motifAlleles
        .filter((m) => m.markerId === markerId)
        .map((m) => m.kitId.trim())
    )
  ).sort();

  // Ensure selectedKitId is always valid when the marker changes
  useEffect(() => {
    if (!kitsForMarker.length) {
      setSelectedKitId(null);
      return;
    }
    if (!selectedKitId || !kitsForMarker.includes(selectedKitId.trim())) {
      setSelectedKitId(kitsForMarker[0]);
    }
  }, [markerId, kitsForMarker.join(","), selectedKitId]);

  // Compute the current motifAllele
  const motifAllele: MotifAlleleDef | undefined = useMemo(
    () =>
      selectedKitId
        ? getMotifAllele(markerId, selectedKitId, "13")
        : undefined,
    [markerId, selectedKitId]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/40">
      {/* Header */}
      <header className="border-b bg-card/60 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Grid3x3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {pageContent.title}
            </h1>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              ← Back to STRhub
            </Link>
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold mb-3 tracking-tight">
              {pageContent.title}
            </h1>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              {pageContent.subtitle}
            </p>
          </div>

          <div className="grid lg:grid-cols-[35%_65%] gap-6">
            {/* Configuration Panel */}
            <Card className="border-0 bg-card/70 backdrop-blur-sm shadow-lg">
              <CardHeader className="space-y-1.5 pb-4">
                <CardTitle className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
                  <Settings className="h-5 w-5" />
                  Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-0">
                <div className="space-y-2">
                  <Label
                    htmlFor="marker-select"
                    className="text-base font-semibold text-foreground"
                  >
                    {pageContent.fields.marker.label}
                  </Label>
                  <Select
                    value={selectedMarkerId}
                    onValueChange={setSelectedMarkerId}
                  >
                    <SelectTrigger className="h-11 text-base">
                      <SelectValue placeholder="Select a marker" />
                    </SelectTrigger>
                    <SelectContent>
                      {STR_MOTIFS.map((marker) => (
                        <SelectItem
                          key={marker.id}
                          value={marker.id}
                          className="text-base"
                        >
                          {marker.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {kitsForMarker.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-base font-semibold text-foreground">
                      Kit / reference sequence
                    </Label>
                    <Select
                      value={selectedKitId || ""}
                      onValueChange={setSelectedKitId}
                    >
                      <SelectTrigger className="h-11 text-base">
                        <SelectValue placeholder="Select a kit" />
                      </SelectTrigger>
                      <SelectContent>
                        {kitsForMarker.map((kit) => (
                          <SelectItem key={kit} value={kit} className="text-base">
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
                </div>
              </CardContent>
            </Card>

            {/* Visualization Panel */}
            <Card className="border-0 bg-card/70 backdrop-blur-sm shadow-lg">
              <CardHeader className="space-y-1.5 pb-2">
                <CardTitle className="text-2xl font-semibold tracking-tight">
                  Exploring the structure of CSF1PO
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {selectedMarker ? (
                  <MotifVisualization
                    marker={selectedMarker}
                    pageContent={pageContent}
                    markerInfo={markerInfo}
                    motifAllele={motifAllele}
                    selectedKitId={selectedKitId ?? undefined}
                  />
                ) : (
                  <div className="text-center py-12 text-base text-muted-foreground">
                    <Grid3x3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Please select a marker from the configuration panel</p>
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

"use client";

import { useState } from "react";
import { Grid3x3, Settings } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

export default function MotifExplorerPage() {
  const [selectedMarkerId, setSelectedMarkerId] = useState<string>(
    STR_MOTIFS[0]?.id || ""
  );
  const [viewMode, setViewMode] = useState<"schematic" | "text">("schematic");
  const { language } = useLanguage();
  const languageContent = translations[language] as (typeof translations)["en"];
  const defaultPageContent = translations.en.motifExplorerPage;
  const pageContent =
    languageContent?.motifExplorerPage ?? defaultPageContent;

  const selectedMarker = STR_MOTIFS.find((m) => m.id === selectedMarkerId);

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

          <div className="grid lg:grid-cols-[40%_60%] gap-6">
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

                <div className="space-y-2">
                  <Label className="text-base font-semibold text-foreground">
                    Display Mode
                  </Label>
                  <Select
                    value={viewMode}
                    onValueChange={(v) =>
                      setViewMode(v as "schematic" | "text")
                    }
                  >
                    <SelectTrigger className="h-11 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="schematic" className="text-base">
                        {pageContent.fields.viewMode.schematic}
                      </SelectItem>
                      <SelectItem value="text" className="text-base">
                        {pageContent.fields.viewMode.text}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {pageContent.help.general}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Visualization Panel */}
            <Card className="border-0 bg-card/70 backdrop-blur-sm shadow-lg">
              <CardHeader className="space-y-1.5 pb-4">
                <CardTitle className="text-2xl font-semibold tracking-tight">
                  Motif Visualization
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  {selectedMarker
                    ? `Exploring ${selectedMarker.name}`
                    : "Select a marker to view its motif structure"}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                {selectedMarker ? (
                  <MotifVisualization
                    marker={selectedMarker}
                    viewMode={viewMode}
                    pageContent={pageContent}
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


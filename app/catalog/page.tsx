"use client";

import type React from "react";

import { useState } from "react";
import { Search, Database, ExternalLink } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/language-context"; // Fixed import path to use correct location
import { PageTitle } from "@/components/page-title";
import { markerData } from "@/lib/markerData";
import { markerFrequenciesCE } from "@/app/marker/[id]/markerFrequencies";
import { computeAlleleRangeFromFrequencies } from "@/lib/alleleRange";

// Helper function to normalize category names
function normalizeCategory(category: string): string {
  if (category === "CODIS Core") return "CODIS Core";
  if (
    category === "Other Autosomal STRs" ||
    category === "European Standard Set"
  )
    return "Other Autosomal";
  if (category === "X STRs" || category === "X-Chromosome STRs") return "X-STR";
  if (category === "Y STRs" || category === "Y-Chromosome STRs") return "Y-STR";
  return category;
}

// Transform markerData object into markers array
export const markers = Object.entries(markerData)
  .map(([id, marker]) => ({
    id,
    name: marker.name,
    fullName: marker.fullName,
    chromosome: marker.chromosome,
    motif: marker.motif ?? "",
    type: marker.type ?? "",
    alleles: marker.alleles ?? "",
    category: normalizeCategory(marker.category),
    nistVerified:
      marker.sequences?.some((seq) => seq.nistVerified === true) ?? false,
  }))
  .filter(
    (marker) =>
      !!marker.motif || ["F13A1", "FESFPS", "LPL"].includes(marker.name)
  );

const categories = ["All", "CODIS Core", "Other Autosomal", "X-STR", "Y-STR"];

const chromosomes = [
  "All",
  ...Array.from(new Set(markers.map((m) => m.chromosome))).sort((a, b) => {
    if (a === "X") return 1;
    if (a === "Y") return 2;
    if (b === "X") return -1;
    if (b === "Y") return -2;
    return Number.parseInt(a) - Number.parseInt(b);
  }),
];

const repeatTypes = [
  "All",
  "Tetranucleotide",
  "Complex",
  "Trinucleotide",
  "Pentanucleotide",
  "Hexanucleotide",
];

// Helper function to compute allele range for a marker (same logic as detail page)
function computeAlleleRangeForMarker(
  markerId: string,
  fallbackAlleles: string
): string {
  const markerIdLower = markerId.toLowerCase();
  const marker = markerData[markerIdLower as keyof typeof markerData];

  if (!marker?.populationFrequencies) {
    return fallbackAlleles;
  }

  // Collect all frequency points from all populations
  const allFrequencyPoints: Array<{
    allele: string;
    frequency: number;
    population?: string;
  }> = [];

  // Iterate through all populations in populationFrequencies
  Object.entries(marker.populationFrequencies).forEach(([pop, entries]) => {
    if (Array.isArray(entries)) {
      entries.forEach((entry) => {
        if (entry && entry.allele && entry.frequency != null) {
          allFrequencyPoints.push({
            allele: entry.allele,
            frequency: entry.frequency,
            population: pop,
          });
        }
      });
    }
  });

  // Also check markerFrequencies for additional populations (e.g., RAO for NGS)
  const markerFreqData = markerFrequenciesCE[markerIdLower];
  if (markerFreqData) {
    Object.entries(markerFreqData).forEach(([key, value]) => {
      if (
        key !== "kit" &&
        key !== "technology" &&
        Array.isArray(value) &&
        value.length > 0
      ) {
        value.forEach((entry: any) => {
          if (entry && entry.allele && entry.frequency != null) {
            allFrequencyPoints.push({
              allele: entry.allele,
              frequency: entry.frequency,
              population: key,
            });
          }
        });
      }
    });
  }

  const computed = computeAlleleRangeFromFrequencies(allFrequencyPoints);
  return computed || fallbackAlleles;
}

export default function CatalogPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedChromosome, setSelectedChromosome] = useState("All");
  const [selectedRepeatType, setSelectedRepeatType] = useState("All");
  const [sortBy, setSortBy] = useState("name"); // Added sortBy state
  const [showNistOnly, setShowNistOnly] = useState(false);
  const router = useRouter();

  // Helper function to translate marker type
  const getTranslatedType = (type: string): string => {
    // Convert type to lowercase key format (e.g., "Tetranucleotide" -> "tetranucleotide")
    const typeKey = type.toLowerCase();

    // Try to get translation from repeatTypes
    const translationKey = `marker.repeatTypes.${typeKey}`;
    const translation = t(translationKey);

    // If translation exists and is different from the key, use it
    if (translation && translation !== translationKey) {
      return translation;
    }

    // Fallback to original type if no translation found
    return type;
  };

  // Helper function to translate marker fullName if it matches the pattern
  const getTranslatedFullName = (
    fullName: string,
    chromosome: string
  ): string => {
    // Check if it matches "DNA Segment on Chromosome X" pattern (where X is a number or X/Y)
    const pattern = /^DNA Segment on Chromosome (\d+|[XY])$/i;
    const match = fullName.match(pattern);
    if (match) {
      return t("catalog.card.description", { chromosome });
    }
    // Check for "DNA Segment on X Chromosome" pattern
    const xPattern = /^DNA Segment on X Chromosome$/i;
    if (fullName.match(xPattern)) {
      return t("catalog.card.description", { chromosome: "X" });
    }
    // Check for "DNA Y-chromosome Segment X" pattern (where X is a number)
    const ySegmentPattern = /^DNA Y-chromosome Segment (\d+)/i;
    const ySegmentMatch = fullName.match(ySegmentPattern);
    if (ySegmentMatch) {
      return t("catalog.card.description", { chromosome: "Y" });
    }
    // Check for "DNA Y-chromosome Fragment X" pattern
    const yFragmentPattern = /^DNA Y-chromosome Fragment (\d+)/i;
    const yFragmentMatch = fullName.match(yFragmentPattern);
    if (yFragmentMatch) {
      return t("catalog.card.description", { chromosome: "Y" });
    }
    // Return original if no pattern matches
    return fullName;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const filteredMarkers = markers.filter((marker) => {
    const matchesSearch =
      marker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      marker.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || marker.category === selectedCategory;
    const matchesChromosome =
      selectedChromosome === "All" || marker.chromosome === selectedChromosome;
    const matchesRepeatType =
      selectedRepeatType === "All" || marker.type === selectedRepeatType;
    const matchesNist = !showNistOnly || marker.nistVerified;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesChromosome &&
      matchesRepeatType &&
      matchesNist
    );
  });

  // Sort markers based on sortBy state
  const sortedMarkers = [...filteredMarkers].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "chromosome") {
      const chrA =
        a.chromosome === "X"
          ? 23
          : a.chromosome === "Y"
          ? 24
          : Number.parseInt(a.chromosome);
      const chrB =
        b.chromosome === "X"
          ? 23
          : b.chromosome === "Y"
          ? 24
          : Number.parseInt(b.chromosome);
      return chrA - chrB;
    } else if (sortBy === "category") {
      return a.category.localeCompare(b.category);
    }
    return 0;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "CODIS Core":
        return "bg-primary/10 text-primary border-primary/20";
      case "Other Autosomal":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "Y-STR":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "X-STR":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-0 py-8">
        {/* Page Header */}
        <div className="text-left mb-12">
          <PageTitle
            title={t("catalog.title")}
            description={
              <>
                {t("catalog.description")}
                <br />
                <span className="text-sm">{t("catalog.subtitle")}</span>
              </>
            }
          />
        </div>

        {/* Category Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card
            className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
            onClick={() => setSelectedCategory("CODIS Core")}
          >
            <CardHeader className="pb-3">
              <div className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                {t("catalog.categories.CODIS Core")}
              </div>
              <CardDescription className="text-2xl font-bold text-foreground mt-2">
                {markers.filter((m) => m.category === "CODIS Core").length}
              </CardDescription>
            </CardHeader>
          </Card>
          <Card
            className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 cursor-pointer hover:bg-green-100 dark:hover:bg-green-900 transition-colors"
            onClick={() => setSelectedCategory("Other Autosomal")}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-green-900 dark:text-green-100">
                {t("catalog.categories.Autosomal")}
              </CardTitle>
              <CardDescription className="text-2xl font-bold text-foreground mt-2">
                {markers.filter((m) => m.category === "Other Autosomal").length}
              </CardDescription>
            </CardHeader>
          </Card>
          <Card
            className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
            onClick={() => setSelectedCategory("Y-STR")}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                {t("catalog.categories.Y-STR")}
              </CardTitle>
              <CardDescription className="text-2xl font-bold text-foreground mt-2">
                {markers.filter((m) => m.category === "Y-STR").length}
              </CardDescription>
            </CardHeader>
          </Card>
          <Card
            className="bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800 cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors"
            onClick={() => setSelectedCategory("X-STR")}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-purple-900 dark:text-purple-100">
                {t("catalog.categories.X-STR")}
              </CardTitle>
              <CardDescription className="text-2xl font-bold text-foreground mt-2">
                {markers.filter((m) => m.category === "X-STR").length}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder={t("catalog.searchPlaceholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </form>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder={t("catalog.filterByCategory")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">
                    {t("catalog.allCategories")}
                  </SelectItem>
                  <SelectItem value="CODIS Core">
                    {t("catalog.categories.CODIS Core")}
                  </SelectItem>
                  <SelectItem value="Other Autosomal">
                    {t("catalog.categories.Autosomal")}
                  </SelectItem>
                  <SelectItem value="Y-STR">
                    {t("catalog.categories.Y-STR")}
                  </SelectItem>
                  <SelectItem value="X-STR">
                    {t("catalog.categories.X-STR")}
                  </SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={selectedChromosome}
                onValueChange={setSelectedChromosome}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Chr" />
                </SelectTrigger>
                <SelectContent>
                  {chromosomes.map((chr) => (
                    <SelectItem key={chr} value={chr}>
                      Chr {chr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedRepeatType}
                onValueChange={setSelectedRepeatType}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={t("catalog.repeatType")} />
                </SelectTrigger>
                <SelectContent>
                  {repeatTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-32">
                  <SelectValue placeholder={t("catalog.sortBy")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">
                    {t("catalog.sortOptions.name")}
                  </SelectItem>
                  <SelectItem value="chromosome">
                    {t("catalog.sortOptions.chromosome")}
                  </SelectItem>
                  <SelectItem value="category">
                    {t("catalog.sortOptions.category")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <div className="text-sm text-muted-foreground">
            {t("catalog.showing")} {filteredMarkers.length} {t("catalog.of")}{" "}
            {markers.length} {t("catalog.markersFound")}
            {showNistOnly && ` (${t("catalog.nistVerifiedOnly")})`}
          </div>
        </div>

        {/* Markers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedMarkers.map((marker) => {
            const detailPath = `/marker/${marker.id}`;

            const handleCardClick = () => {
              router.push(detailPath);
            };

            const handleCardKeyDown = (
              event: React.KeyboardEvent<HTMLDivElement>
            ) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleCardClick();
              }
            };

            const handleTabClick = (
              event:
                | React.MouseEvent<HTMLElement>
                | React.KeyboardEvent<HTMLElement>,
              tab: string
            ) => {
              event.stopPropagation();
              if ("preventDefault" in event) {
                event.preventDefault();
              }
              router.push(`${detailPath}?tab=${tab}`);
            };

            const handleTabKeyDown = (
              event: React.KeyboardEvent<HTMLElement>,
              tab: string
            ) => {
              if (event.key === "Enter" || event.key === " ") {
                handleTabClick(event, tab);
              }
            };

            return (
              <div
                key={marker.id}
                role="link"
                tabIndex={0}
                onClick={handleCardClick}
                onKeyDown={handleCardKeyDown}
                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
              >
                <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50 hover:from-primary/5 hover:to-accent/5 cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <CardTitle className="text-2xl font-bold text-gradient">
                          {marker.name}
                        </CardTitle>
                        <CardDescription className="font-medium">
                          {getTranslatedFullName(
                            marker.fullName,
                            marker.chromosome
                          )}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Badge
                          variant="secondary"
                          className={getCategoryColor(marker.category)}
                        >
                          {marker.category === "CODIS Core"
                            ? t("catalog.categories.CODIS Core")
                            : marker.category === "Other Autosomal"
                            ? t("catalog.categories.Autosomal")
                            : marker.category === "Y-STR"
                            ? t("catalog.categories.Y-STR")
                            : marker.category === "X-STR"
                            ? t("catalog.categories.X-STR")
                            : marker.category}
                        </Badge>
                        {marker.nistVerified && (
                          <Badge
                            variant="outline"
                            className="text-xs bg-green-50 text-green-700 border-green-200"
                          >
                            NIST
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("catalog.chromosome")}:
                        </span>
                        <span className="font-medium">{marker.chromosome}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("catalog.motif")}:
                        </span>
                        <span className="font-medium">
                          {marker.motif.length > 20
                            ? t("catalog.complex")
                            : marker.motif}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("marker.type")}:
                        </span>
                        <span className="font-medium">
                          {getTranslatedType(marker.type)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("catalog.card.alleleRangeLabel")}:
                        </span>
                        <span className="font-medium">
                          {computeAlleleRangeForMarker(
                            marker.id,
                            marker.alleles
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t">
                      {[
                        {
                          tab: "frequencies",
                          label: t("marker.tabs.frequencies"),
                        },
                        { tab: "variants", label: t("marker.variantAlleles") },
                        { tab: "tools", label: t("marker.tabs.tools") },
                      ].map((item) => (
                        <Badge
                          key={item.tab}
                          role="button"
                          tabIndex={0}
                          variant="outline"
                          className="cursor-pointer border-primary/30 text-primary hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                          onClick={(event) => handleTabClick(event, item.tab)}
                          onKeyDown={(event) =>
                            handleTabKeyDown(event, item.tab)
                          }
                        >
                          {item.label}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                </Card>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredMarkers.length === 0 && (
          <div className="text-center py-12">
            <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {t("common.notFound")}
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters
            </p>
          </div>
        )}

        {/* Data Integration Footer */}
        <div className="mt-12 p-6 bg-muted/30 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">
            {t("catalog.dataIntegration")}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {t("catalog.dataIntegrationDescription")}
          </p>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link
                href="https://strbase.nist.gov/"
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                {t("catalog.visitStrbase")}
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link
                href="http://spsmart.cesga.es/search.php?dataSet=strs_local&mapPopulation"
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                {t("catalog.visitPopStr")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

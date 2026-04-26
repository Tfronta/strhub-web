"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  Database,
  BarChart3,
  FileText,
  ExternalLink,
  Info,
  Download,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { markerData } from "@/lib/markerData";
import { useLanguage } from "@/contexts/language-context";
import { markerFrequenciesCE, markerFrequenciesNGS } from "./markerFrequencies";
import { markerStatisticsCE } from "./markerStatisticsCE";
import {
  buildToolCards,
  getToolsForMarker,
  supportModelByToolId,
  getToolDetails,
  DEFAULT_MARKER_TOOL_VIEW,
} from "@/lib/tools";
import { ToolCardCompact } from "@/components/tools/ToolCardCompact";
import { LATAMCatalog, type LatamSubpop } from "@/lib/latamCatalog";
import { getDatasetConfig } from "./datasetConfig";
import { cn } from "@/lib/utils";
import strKitsData from "@/data/str_kits.json";
import { computeAlleleRangeFromFrequencies } from "@/lib/alleleRange";

const motifExplorerMarkerIds = new Set(
  Object.keys(strKitsData).map((marker) => marker.toLowerCase()),
);

const POP_SUBPOP_DESCRIPTION_KEYS: Record<string, string> = {
  AFR: "populationAfr",
  NAM: "populationNam",
  EAS: "populationEas",
  CSA: "populationCsa",
  SAS: "populationSas",
  EUR: "populationEur",
  MES: "populationMes",
  OCE: "populationOce",
  LATAM: "populationLatam",
};

// NGS 1000 Genomes dataset population groups
const NGS_1000G_POPULATION_GROUPS: Record<string, string> = {
  AFR: "Esan in Nigeria, Gambian in Western Divisions in the Gambia, Luhya in Webuye, Kenya, Mende in Sierra Leone, Yoruba in Ibadan, Nigeria.",
  EAS: "Chinese Dai in Xishuangbanna, China, Han Chinese in Beijing, China, Southern Han Chinese, Japanese in Tokyo, Japan, Kinh in Ho Chi Minh City, Vietnam.",
  EUR: "Utah Residents (CEPH) with Northern and Western European ancestry, Finnish in Finland, British in England and Scotland, Iberian population in Spain, Toscani in Italia.",
  NAM: "African Caribbeans in Barbados, Americans of African ancestry in Southwest USA, Colombians from Medellín, Colombia, Mexican ancestry from Los Angeles, USA, Peruvians from Lima, Peru, Puerto Ricans from Puerto Rico.",
  SAS: "Bengali from Bangladesh, Gujarati Indian from Houston, Texas, Indian Telugu from the UK, Punjabi from Lahore, Pakistan, Sri Lankan Tamil from the UK.",
};

// NGS 1000 Genomes dataset links
const NGS_1000G_DATASET_LINKS = {
  datasetUrl: "https://www.internationalgenome.org/category/phase-3/",
  publicationUrl:
    "https://www.mdpi.com/2073-4425/13/12/2205#app1-genes-13-02205",
};

const POPULATION_COLORS: Record<string, string> = {
  AFR: "#f59e0b",
  NAM: "#ef4444",
  EAS: "#3b82f6",
  CSA: "#8b5cf6",
  SAS: "#8b5cf6",
  EUR: "#10b981",
  MES: "#f97316",
  OCE: "#06b6d4",
};

const NGS_1000G_POPS = new Set(["AFR", "NAM", "EUR", "EAS", "SAS"]);

export default function MarkerPage({ params }: { params: { id: string } }) {
  const { t, language } = useLanguage();
  const [selectedPopulation, setSelectedPopulation] = useState<string>("AFR");
  const [xstrFrequencies, setXstrFrequencies] = useState<any>(null);
  const [selectedTechnology, setSelectedTechnology] = useState<string>("CE");
  const [selectedDataset, setSelectedDataset] = useState<string>("");
  const [selectedLatamSubpop, setSelectedLatamSubpop] =
    useState<LatamSubpop | null>(null);
  const [latamSubpopPopoverOpen, setLatamSubpopPopoverOpen] = useState(false);
  const [showAllPopulations, setShowAllPopulations] = useState(false);
  const [hiddenPopulations, setHiddenPopulations] = useState<Set<string>>(
    new Set(),
  );
  const searchParams = useSearchParams();
  const fromBasics = searchParams?.get("from") === "basics";

  const markerId = params.id.toLowerCase();
  const marker = markerData[markerId as keyof typeof markerData];
  const isMarkerInMotifExplorer = motifExplorerMarkerIds.has(markerId);

  // Helper function to translate marker descriptions
  const getTranslatedDescription = (description: string): string => {
    // Pattern: "{MARKER} is an STR locus on chromosome {NUMBER}."
    const pattern =
      /^(.+?)\s+is\s+an\s+STR\s+locus\s+on\s+chromosome\s+(\d+|[XY])\.$/i;
    const match = description.match(pattern);

    if (match) {
      const markerName = match[1];
      const chromosome = match[2];
      return t("marker.descriptionPattern", { marker: markerName, chromosome });
    }

    // If pattern doesn't match, return original description
    return description;
  };

  // Helper function to translate marker type
  const getTranslatedType = (type: string): string => {
    // Convert type to lowercase key format (e.g., "Tetranucleotide" -> "tetranucleotide")
    const typeKey = type?.toLowerCase() ?? "";

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

  const tabValues = ["overview", "frequencies", "statistics", "variants", "tools"] as const;
  type TabValue = (typeof tabValues)[number];
  const requestedTab = (searchParams?.get("tab") ?? "overview") as string;
  const initialTabParam: TabValue = tabValues.includes(requestedTab as TabValue)
    ? (requestedTab as TabValue)
    : "overview";
  const [activeTab, setActiveTab] = useState<TabValue>(initialTabParam);

  useEffect(() => {
    if (marker && (marker.type === "X-STR" || marker.chromosome === "X")) {
      fetch("/data/xstr_frequencies.json")
        .then((res) => res.json())
        .then((data) => {
          setXstrFrequencies(data[markerId]);
          setSelectedPopulation("BRA");
        })
        .catch((err) =>
          console.error("[v0] Failed to load X-STR frequencies:", err),
        );
    }
  }, [markerId, marker]);

  // Reset selected dataset when technology or population changes
  useEffect(() => {
    setSelectedDataset("");
    // Reset LATAM selection when switching away from LATAM CE
    if (selectedPopulation !== "LATAM" || selectedTechnology !== "CE") {
      setSelectedLatamSubpop(null);
      setLatamSubpopPopoverOpen(false);
    }
    if (selectedTechnology !== "CE") {
      setShowAllPopulations(false);
    }
    setHiddenPopulations(new Set());
  }, [selectedTechnology, selectedPopulation]);

  useEffect(() => {
    setActiveTab(initialTabParam);
  }, [initialTabParam]);

  if (!marker) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap items-center gap-3">
            {fromBasics && (
              <Link
                href="/basics"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("marker.backToGenomeExplorer")}
              </Link>
            )}
            <Link
              href="/catalog"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("marker.backToCatalog")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const markerFreqDataCE =
    markerFrequenciesCE[markerId as keyof typeof markerFrequenciesCE];
  const markerFreqDataNGS =
    markerFrequenciesNGS[markerId as keyof typeof markerFrequenciesNGS];

  // Check if NGS data exists
  const hasNGS = markerFreqDataNGS !== undefined;
  // Check if CE data exists
  const hasCE = markerFreqDataCE !== undefined;

  // Build available technologies list
  const availableTechnologies: string[] = [];
  if (hasCE) availableTechnologies.push("CE");
  if (hasNGS) availableTechnologies.push("NGS");

  const currentTechInfo =
    selectedTechnology === "CE" && markerFreqDataCE
      ? { technology: markerFreqDataCE.technology, kit: markerFreqDataCE.kit }
      : selectedTechnology === "NGS" && markerFreqDataNGS
        ? {
            technology: markerFreqDataNGS.technology,
            kit: markerFreqDataNGS.kit,
          }
        : null;

  // Compute available populations based on technology
  const getAvailablePopulations = (): string[] => {
    if (selectedTechnology === "NGS") {
      // For NGS, check markerFrequenciesNGS for all available populations
      if (hasNGS && markerFreqDataNGS) {
        const availablePops: string[] = [];
        // Check which populations exist in the NGS data (excluding kit and technology keys)
        Object.keys(markerFreqDataNGS).forEach((key) => {
          if (
            key !== "kit" &&
            key !== "technology" &&
            markerFreqDataNGS[key as keyof typeof markerFreqDataNGS]
          ) {
            const popData =
              markerFreqDataNGS[key as keyof typeof markerFreqDataNGS];
            if (Array.isArray(popData) && popData.length > 0) {
              availablePops.push(key);
            }
          }
        });
        return availablePops.length > 0 ? availablePops : [];
      }
      return [];
    } else {
      // For CE, return standard populations including LATAM
      return ["AFR", "NAM", "EAS", "CSA", "EUR", "MES", "OCE", "LATAM"];
    }
  };

  const availablePopulations = getAvailablePopulations();

  // Compute allele range from all population frequencies
  const computedAlleleRange = useMemo(() => {
    if (
      !marker?.populationFrequencies ||
      !Object.values(marker.populationFrequencies).flat().length
    ) {
      return "";
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

    // Also check markerFreqDataCE and markerFreqDataNGS for additional populations
    if (markerFreqDataCE) {
      Object.entries(markerFreqDataCE).forEach(([key, value]) => {
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
    if (markerFreqDataNGS) {
      Object.entries(markerFreqDataNGS).forEach(([key, value]) => {
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
    return computed || marker.alleles; // Fallback to hardcoded value if computation returns null
  }, [marker, markerFreqDataCE, markerFreqDataNGS]);

  const isLatamCE =
    selectedPopulation === "LATAM" && selectedTechnology === "CE";

  const latamCEOptions = useMemo(
    () => LATAMCatalog.filter((subpop) => subpop.technology === "CE"),
    [],
  );

  const groupedLatamOptions = useMemo(() => {
    return latamCEOptions.reduce<{ country: string; items: LatamSubpop[] }[]>(
      (groups, subpop) => {
        const existingGroup = groups.find(
          (group) => group.country === subpop.country,
        );
        if (existingGroup) {
          existingGroup.items.push(subpop);
        } else {
          groups.push({ country: subpop.country, items: [subpop] });
        }
        return groups;
      },
      [],
    );
  }, [latamCEOptions]);

  const latamButtonLabel = selectedLatamSubpop
    ? `LATAM: ${selectedLatamSubpop.country} — ${selectedLatamSubpop.region} (N = ${selectedLatamSubpop.N})`
    : "LATAM";

  const isXSTR = marker.type === "X-STR" || marker.chromosome === "X";
  const populationDescriptionKey =
    POP_SUBPOP_DESCRIPTION_KEYS[selectedPopulation] ?? "";
  const populationDescription = populationDescriptionKey
    ? t(`marker.frequencies.datasetNotes.${populationDescriptionKey}`)
    : "";
  const isPopStrDataset = selectedPopulation !== "LATAM";

  // Get current dataset configuration
  const currentDataset = getDatasetConfig(selectedPopulation);
  const datasetDescription = currentDataset?.metadata?.descriptionKey
    ? t(`marker.frequencies.${currentDataset.metadata.descriptionKey}`)
    : null;

  const hidePopStrDatasetNotesAccordion =
    selectedTechnology === "NGS" &&
    selectedPopulation !== "RAO" &&
    ["AFR", "EUR", "NAM", "EAS", "SAS"].includes(selectedPopulation);

  const showPopStrDatasetNotesAccordion =
    isPopStrDataset && !datasetDescription && !hidePopStrDatasetNotesAccordion;

  const popStrDatasetNotesShortTitleAndAccordion = useMemo(
    () => (
      <>
        {/* TODO: move these dataset notes strings into the i18n translation files (EN/ES/PT) */}
        <div className="mt-3 text-sm text-muted-foreground space-y-1">
          <p className="font-medium flex items-center gap-2">
            <span>{t("marker.frequencies.datasetNotes.title")}</span>
          </p>
          <p>{t("marker.frequencies.datasetNotes.shortLine1")}</p>
          <p>{t("marker.frequencies.datasetNotes.shortLine2")}</p>
        </div>
        <Accordion type="single" collapsible className="mt-2">
          <AccordionItem value="method-note">
            <AccordionTrigger className="text-sm font-medium">
              {t("marker.frequencies.datasetNotes.accordionTrigger")}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground space-y-2">
              <p>{t("marker.frequencies.datasetNotes.full1")}</p>
              <p>{t("marker.frequencies.datasetNotes.full2")}</p>
              <p>{t("marker.frequencies.datasetNotes.full3")}</p>
              <p className="text-xs">
                <span className="font-semibold">
                  {t("marker.frequencies.datasetNotes.referenceLabel")}
                </span>
                <br />
                {t("marker.frequencies.datasetNotes.referenceText")}
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </>
    ),
    [t],
  );

  // NGS genotyping tools only (derived from master catalog; no CE/frequency-based filtering)
  const toolCards = useMemo(() => buildToolCards(t), [t]);
  const toolsForMarker = useMemo(
    () =>
      getToolsForMarker(
        toolCards,
        supportModelByToolId,
        DEFAULT_MARKER_TOOL_VIEW,
        getToolDetails,
      ),
    [toolCards],
  );

  const latamSubpopForChart = isLatamCE ? selectedLatamSubpop : null;

  const cePopulationsForAll = useMemo(
    () => availablePopulations.filter((p) => p !== "LATAM"),
    [availablePopulations],
  );

  const ngs1000GPops = useMemo(
    () => availablePopulations.filter((p) => NGS_1000G_POPS.has(p)),
    [availablePopulations],
  );
  const ngsRaoPops = useMemo(
    () => availablePopulations.filter((p) => !NGS_1000G_POPS.has(p)),
    [availablePopulations],
  );

  const allPopulationsChartData = useMemo<
    Array<Record<string, string | number> & { allele: string }>
  >(() => {
    if (!showAllPopulations || selectedTechnology !== "CE" || isXSTR) return [];

    const alleleMap = new Map<string, Record<string, number>>();

    for (const pop of cePopulationsForAll) {
      const entries =
        marker?.populationFrequencies?.[
          pop as keyof typeof marker.populationFrequencies
        ] || [];
      for (const entry of entries) {
        if (!entry || entry.frequency == null || entry.frequency <= 0) continue;
        const row = alleleMap.get(entry.allele) ?? {};
        row[pop] = entry.frequency;
        alleleMap.set(entry.allele, row);
      }
    }

    return Array.from(alleleMap.entries())
      .map(([allele, pops]) => ({ allele, ...pops }))
      .sort((a, b) => {
        const na = Number.parseFloat(a.allele);
        const nb = Number.parseFloat(b.allele);
        if (!isNaN(na) && !isNaN(nb)) return na - nb;
        return a.allele.localeCompare(b.allele, undefined, { numeric: true });
      });
  }, [showAllPopulations, selectedTechnology, isXSTR, cePopulationsForAll, marker]);

  const allNgsChartData = useMemo<
    Array<Record<string, string | number> & { allele: string }>
  >(() => {
    if (!showAllPopulations || selectedTechnology !== "NGS" || !markerFreqDataNGS)
      return [];

    const alleleMap = new Map<string, Record<string, number>>();

    for (const pop of ngs1000GPops) {
      const entries = markerFreqDataNGS[
        pop as keyof typeof markerFreqDataNGS
      ] as Array<{ allele: string; frequency: number }> | undefined;
      if (!entries) continue;
      for (const entry of entries) {
        if (entry.frequency <= 0) continue;
        const row = alleleMap.get(entry.allele) ?? {};
        row[pop] = entry.frequency;
        alleleMap.set(entry.allele, row);
      }
    }

    return Array.from(alleleMap.entries())
      .map(([allele, pops]) => ({ allele, ...pops }))
      .sort((a, b) => {
        const na = Number.parseFloat(a.allele);
        const nb = Number.parseFloat(b.allele);
        if (!isNaN(na) && !isNaN(nb)) return na - nb;
        return a.allele.localeCompare(b.allele, undefined, { numeric: true });
      });
  }, [showAllPopulations, selectedTechnology, markerFreqDataNGS, ngs1000GPops]);

  const isNgsAllMode =
    showAllPopulations && selectedTechnology === "NGS";
  const isCeAllMode =
    showAllPopulations && selectedTechnology === "CE" && !isXSTR;
  const activeAllChartData = isNgsAllMode
    ? allNgsChartData
    : isCeAllMode
      ? allPopulationsChartData
      : [];
  const activeAllPops = isNgsAllMode
    ? ngs1000GPops
    : isCeAllMode
      ? cePopulationsForAll
      : [];

  const compareYMax = useMemo(() => {
    if (activeAllChartData.length === 0 || activeAllPops.length === 0) return 0;
    let max = 0;
    for (const row of activeAllChartData) {
      for (const pop of activeAllPops) {
        const v = row[pop];
        if (typeof v === "number" && v > max) max = v;
      }
    }
    return Math.ceil(max * 1000) / 1000;
  }, [activeAllChartData, activeAllPops]);

  let chartData: any[] = [];
  let citationUrl = "";
  let citationText = "";

  if (isXSTR && xstrFrequencies) {
    const popData = xstrFrequencies.populations?.[selectedPopulation];
    if (popData?.alleles) {
      chartData = Object.entries(popData.alleles)
        .map(([allele, frequency]) => ({
          allele,
          frequency: frequency as number,
          count: 0,
        }))
        .sort((a, b) => {
          const alleleA = Number.parseFloat(a.allele);
          const alleleB = Number.parseFloat(b.allele);
          if (!isNaN(alleleA) && !isNaN(alleleB)) {
            return alleleA - alleleB;
          }
          return a.allele.localeCompare(b.allele, undefined, { numeric: true });
        });
    }
    citationUrl = popData?.url || "";

    if (selectedPopulation === "BRA") {
      citationText =
        "Nascimento et al., Forensic Science International: Genetics 66 (2023) 102704";
    } else if (selectedPopulation === "IBER") {
      citationText =
        "Freire-Aradas et al., Forensic Science International: Genetics 17 (2015) 110–120";
    } else if (selectedPopulation === "NOR") {
      citationText =
        "Bergseth et al., Forensic Science International: Genetics 59 (2022) 102685";
    } else if (selectedPopulation === "BOS_HER") {
      citationText = "PubMed ID 40253804";
    }
  } else {
    // Use markerFrequenciesNGS for NGS technology (all populations)
    if (selectedTechnology === "NGS" && markerFreqDataNGS) {
      const populationData = markerFreqDataNGS[
        selectedPopulation as keyof typeof markerFreqDataNGS
      ] as any[];
      if (populationData && Array.isArray(populationData)) {
        chartData = populationData.map((item) => ({
          allele: item.allele,
          frequency: item.frequency,
          count: item.count,
        }));
      }
    } else if (selectedPopulation === "LATAM") {
      chartData = [];
    } else {
      // Use marker.populationFrequencies for CE technology
      if (selectedPopulation === "OCE") {
        const oceEntries =
          marker?.populationFrequencies?.[
            selectedPopulation as keyof typeof marker.populationFrequencies
          ] || [];
        chartData = oceEntries.map((item) => ({
          allele: item.allele,
          frequency: item.frequency,
          count: item.count,
        }));
      } else {
        const populationData =
          marker?.populationFrequencies?.[
            selectedPopulation as keyof typeof marker.populationFrequencies
          ] || [];
        chartData = populationData.map((item) => ({
          allele: item.allele,
          frequency: item.frequency,
          count: item.count,
        }));
      }
    }
  }

  // Filter out alleles with frequency <= 0.000 to improve chart readability
  chartData = chartData.filter((item) => item.frequency > 0.0);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          {fromBasics && (
            <Link
              href="/basics"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("marker.backToGenomeExplorer")}
            </Link>
          )}
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("marker.backToCatalog")}
          </Link>
        </div>
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl font-semibold text-foreground">
              {marker.name}
            </h1>
            <Badge
              variant="secondary"
              className="text-xs font-normal px-2 py-0.5 bg-muted text-muted-foreground border-0"
            >
              {marker.category}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {getTranslatedDescription(marker.description)}
          </p>
        </div>

        {activeTab !== "overview" && (
          <div className="sticky top-0 z-10 mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-md border border-border bg-background/95 px-4 py-2 text-xs backdrop-blur">
            <span>
              <span className="text-muted-foreground">Chr</span>{" "}
              <span className="text-foreground">{marker.chromosome}</span>
            </span>
            <span className="border-l border-border pl-4 font-mono text-foreground">
              [{marker.motif}]n
            </span>
            <span className="border-l border-border pl-4 text-muted-foreground">
              {getTranslatedType(marker.type)}
            </span>
            <span className="border-l border-border pl-4">
              <span className="text-muted-foreground">
                {t("marker.alleleRange")}:
              </span>{" "}
              <span className="text-foreground">{computedAlleleRange}</span>
            </span>
            {marker.nistReference?.referenceAllele && (
              <span className="border-l border-border pl-4">
                <span className="text-muted-foreground">
                  {t("marker.referenceAllele")}:
                </span>{" "}
                <span className="text-foreground">
                  {marker.nistReference.referenceAllele}
                </span>
              </span>
            )}
          </div>
        )}

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as TabValue)}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5 h-9 bg-muted/50 p-0 rounded-md border-0">
            <TabsTrigger
              value="overview"
              className="text-sm font-normal data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-sm"
            >
              {t("marker.tabs.overview")}
            </TabsTrigger>
            <TabsTrigger
              value="frequencies"
              className="text-sm font-normal data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-sm"
            >
              {t("marker.tabs.frequencies")}
            </TabsTrigger>
            <TabsTrigger
              value="statistics"
              className="text-sm font-normal data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-sm"
            >
              {t("marker.tabs.statistics")}
            </TabsTrigger>
            <TabsTrigger
              value="variants"
              className="text-sm font-normal data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-sm"
            >
              {t("marker.variantAlleles")}
            </TabsTrigger>
            <TabsTrigger
              value="tools"
              className="text-sm font-normal data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-sm"
            >
              {t("marker.tabs.tools")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-4">
              <Card className="border rounded-md shadow-none bg-card">
                <CardHeader className="pb-3 px-4">
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Info className="h-4 w-4 text-muted-foreground" />
                    {t("marker.basicInfo")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 space-y-4">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                    <div className="space-y-1">
                      <Label className="text-xs font-normal text-muted-foreground">
                        {t("marker.chromosome")}
                      </Label>
                      <p className="text-sm font-normal text-foreground">
                        {marker.chromosome}
                      </p>
                    </div>
                    {marker.cytogeneticLocation && (
                      <div className="space-y-1">
                        <Label className="text-xs font-normal text-muted-foreground">
                          {t("marker.cytogeneticLocation")}
                        </Label>
                        <p className="text-sm font-normal text-foreground">
                          {marker.cytogeneticLocation}
                        </p>
                      </div>
                    )}
                    <div className="space-y-1">
                      <Label className="text-xs font-normal text-muted-foreground">
                        {t("marker.motif")}
                      </Label>
                      <p className="text-sm font-normal font-mono text-foreground">
                        [{marker.motif}]n
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-normal text-muted-foreground">
                        {t("marker.type")}
                      </Label>
                      <p className="text-sm font-normal text-foreground">
                        {getTranslatedType(marker.type)}
                      </p>
                    </div>
                    {marker.alternativeMotifs &&
                      marker.alternativeMotifs.length > 0 && (
                        <div className="col-span-2 space-y-1">
                          <Label className="text-xs font-normal text-muted-foreground">
                            Alternative Motifs
                          </Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {marker.alternativeMotifs.map((motif, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="font-mono text-xs font-normal px-2 py-0.5 border-muted-foreground/20"
                              >
                                [{motif}]n
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    <div className="space-y-1">
                      <Label className="text-xs font-normal text-muted-foreground">
                        {t("marker.alleleRange")}
                      </Label>
                      <p className="text-sm font-normal text-foreground">
                        {computedAlleleRange}
                      </p>
                    </div>
                    {marker.nistReference?.referenceAllele && (
                      <div className="space-y-1">
                        <Label className="text-xs font-normal text-muted-foreground">
                          {t("marker.referenceAllele")}
                        </Label>
                        <p className="text-sm font-normal text-foreground">
                          {marker.nistReference.referenceAllele}
                        </p>
                      </div>
                    )}
                  </div>
                  {isMarkerInMotifExplorer && (
                    <div className="pt-4 border-t border-border space-y-3">
                      <div className="space-y-1.5">
                        <p className="text-xs font-semibold text-foreground">
                          {t("overview.motifExplorer.title")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {t("overview.motifExplorer.desc")}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="h-8 px-3 text-xs font-semibold"
                        asChild
                      >
                        <Link
                          href={`/tools/str-motif-explorer?marker=${marker.name}`}
                        >
                          {t("overview.motifExplorer.button")}
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border rounded-md shadow-none bg-card">
                <CardHeader className="pb-3 px-4">
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    {t("marker.genomicCoords")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 space-y-4">
                  {marker.coordinates ? (
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <h4 className="text-xs font-semibold text-foreground">
                          GRCh38/hg38
                        </h4>
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <Label className="text-xs font-normal text-muted-foreground">
                              {t("marker.position")}
                            </Label>
                            <p className="text-sm font-normal text-foreground break-all">
                              {marker.position}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs font-normal text-muted-foreground">
                              {t("marker.strand")}
                            </Label>
                            <p className="text-sm font-normal text-foreground">
                              {marker.coordinates.strand}
                            </p>
                          </div>
                        </div>
                      </div>

                      {marker.coordinates["grch37"]?.start && (
                        <div className="pt-3 border-t border-border space-y-3">
                          <h4 className="text-xs font-semibold text-foreground">
                            GRCh37/hg19
                          </h4>
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <Label className="text-xs font-normal text-muted-foreground">
                                {t("marker.position")}
                              </Label>
                              <p className="text-sm font-normal text-foreground break-all">
                                {marker.coordinates.grch37.start.toLocaleString()}
                                -
                                {marker.coordinates.grch37.end.toLocaleString()}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs font-normal text-muted-foreground">
                                {t("marker.strand")}
                              </Label>
                              <p className="text-sm font-normal text-foreground">
                                {marker.coordinates.strand}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {t("common.notFound")}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="frequencies" className="space-y-4">
            <Card className="border rounded-md shadow-none bg-card">
              <CardHeader className="pb-3 px-4">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  {t("marker.alleleFreqDistribution")}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2 flex-wrap border-b border-border pb-3">
                    {selectedTechnology !== "NGS" && (
                      <div className="flex items-center gap-2 flex-wrap">
                        {availablePopulations.map((pop) => {
                          const isLatam = pop === "LATAM";
                          const label = isLatam ? latamButtonLabel : pop;
                          const isActive =
                            !showAllPopulations &&
                            selectedPopulation === pop;

                          const button = (
                            <Button
                              variant={isActive ? "default" : "outline"}
                              size="sm"
                              onClick={() => {
                                setShowAllPopulations(false);
                                setSelectedPopulation(pop);
                                if (isLatam) {
                                  setLatamSubpopPopoverOpen(true);
                                }
                              }}
                              className="h-7 text-xs font-normal rounded-sm px-2"
                            >
                              {label}
                            </Button>
                          );

                          if (isLatam) {
                            return (
                              <Popover
                                key={pop}
                                open={latamSubpopPopoverOpen && isLatamCE}
                                onOpenChange={(open) => {
                                  setLatamSubpopPopoverOpen(open);
                                  if (open) {
                                    setShowAllPopulations(false);
                                    setSelectedPopulation("LATAM");
                                  }
                                }}
                              >
                                <PopoverTrigger asChild>
                                  {button}
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-80 max-h-80 overflow-y-auto"
                                  align="start"
                                >
                                  <div className="flex flex-col gap-3">
                                    {groupedLatamOptions.map(
                                      ({ country, items }) => (
                                        <div
                                          key={country}
                                          className="space-y-2"
                                        >
                                          <p className="text-xs font-semibold text-muted-foreground">
                                            {country}
                                          </p>
                                          <div className="flex flex-col gap-1.5">
                                            {items.map((subpop) => {
                                              const isSubActive =
                                                latamSubpopForChart?.id ===
                                                subpop.id;
                                              return (
                                                <button
                                                  key={subpop.id}
                                                  type="button"
                                                  onClick={() => {
                                                    setSelectedLatamSubpop(
                                                      subpop,
                                                    );
                                                    setLatamSubpopPopoverOpen(
                                                      false,
                                                    );
                                                  }}
                                                  className={cn(
                                                    "flex flex-col items-start rounded-xl border px-3 py-2 text-left text-sm transition",
                                                    isSubActive
                                                      ? "border-primary bg-primary/5"
                                                      : "hover:bg-muted",
                                                  )}
                                                >
                                                  <span className="font-medium">
                                                    {subpop.country} —{" "}
                                                    {subpop.region}
                                                  </span>
                                                  <span className="text-xs text-muted-foreground">
                                                    Kit: {subpop.kit} · N ={" "}
                                                    {subpop.N}
                                                  </span>
                                                </button>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      ),
                                    )}
                                  </div>
                                </PopoverContent>
                              </Popover>
                            );
                          }

                          return <span key={pop}>{button}</span>;
                        })}
                        {!isXSTR && (
                          <>
                            <div className="h-5 w-px bg-border" />
                            <UITooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant={showAllPopulations ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => {
                                    setShowAllPopulations(true);
                                    setHiddenPopulations(new Set());
                                  }}
                                  className="h-7 text-xs font-normal rounded-sm px-2"
                                >
                                  {t("marker.frequencies.compareButton")}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs text-xs">
                                {t("marker.frequencies.compareTooltip")}
                              </TooltipContent>
                            </UITooltip>
                          </>
                        )}
                      </div>
                    )}
                    {selectedTechnology === "NGS" && (
                      <>
                        {hasNGS ? (
                          <div className="flex items-center gap-2 flex-wrap">
                            {ngs1000GPops.map((pop) => (
                              <Button
                                key={pop}
                                variant={
                                  !showAllPopulations &&
                                  selectedPopulation === pop
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => {
                                  setShowAllPopulations(false);
                                  setSelectedPopulation(pop);
                                }}
                                className="h-7 text-xs font-normal rounded-sm px-2"
                              >
                                {pop}
                              </Button>
                            ))}
                            {ngs1000GPops.length >= 2 && (
                              <>
                                <div className="h-5 w-px bg-border" />
                                <UITooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant={
                                        showAllPopulations ? "default" : "outline"
                                      }
                                      size="sm"
                                      onClick={() => {
                                        setShowAllPopulations(true);
                                        setHiddenPopulations(new Set());
                                      }}
                                      className="h-7 text-xs font-normal rounded-sm px-2"
                                    >
                                      1000G
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs text-xs">
                                    {t("marker.frequencies.ngs1000gTooltip")}
                                  </TooltipContent>
                                </UITooltip>
                              </>
                            )}
                            {ngsRaoPops.length > 0 && (
                              <>
                                <div className="h-5 w-px bg-border" />
                                {ngsRaoPops.map((pop) => (
                                  <Button
                                    key={pop}
                                    variant={
                                      !showAllPopulations &&
                                      selectedPopulation === pop
                                        ? "default"
                                        : "outline"
                                    }
                                    size="sm"
                                    onClick={() => {
                                      setShowAllPopulations(false);
                                      setSelectedPopulation(pop);
                                    }}
                                    className="h-7 text-xs font-normal rounded-sm px-2"
                                  >
                                    {pop}
                                  </Button>
                                ))}
                              </>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Label className="text-xs text-muted-foreground whitespace-nowrap">
                              Dataset:
                            </Label>
                            <Select
                              value={selectedDataset}
                              onValueChange={setSelectedDataset}
                              disabled={
                                !marker?.ceStudiesByPop?.[
                                  selectedPopulation as keyof typeof marker.ceStudiesByPop
                                ] ||
                                (
                                  marker.ceStudiesByPop[
                                    selectedPopulation as keyof typeof marker.ceStudiesByPop
                                  ] as any[]
                                )?.length === 0
                              }
                            >
                              <SelectTrigger className="h-7 w-[200px] text-xs">
                                <SelectValue placeholder="No NGS datasets available" />
                              </SelectTrigger>
                              {marker?.ceStudiesByPop?.[
                                selectedPopulation as keyof typeof marker.ceStudiesByPop
                              ] &&
                                (
                                  marker.ceStudiesByPop[
                                    selectedPopulation as keyof typeof marker.ceStudiesByPop
                                  ] as any[]
                                )?.length > 0 && (
                                  <SelectContent>
                                    {(
                                      marker.ceStudiesByPop[
                                        selectedPopulation as keyof typeof marker.ceStudiesByPop
                                      ] as any[]
                                    ).map((study: any, index: number) => {
                                      const country =
                                        study.country ||
                                        study.location ||
                                        "Unknown";
                                      const n =
                                        study.n || study.sampleSize || 0;
                                      const value = `dataset_${index}`;
                                      return (
                                        <SelectItem key={value} value={value}>
                                          {country}, n={n}
                                        </SelectItem>
                                      );
                                    })}
                                  </SelectContent>
                                )}
                            </Select>
                          </div>
                        )}
                      </>
                    )}

                    {availableTechnologies.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-normal text-muted-foreground">
                          {t("marker.technology")}:
                        </span>
                        <div className="flex gap-2">
                          {availableTechnologies.map((tech) => (
                            <Button
                              key={tech}
                              variant={
                                selectedTechnology === tech
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() => {
                                setSelectedTechnology(tech);
                                // Auto-select appropriate population when switching technology
                                if (
                                  tech === "NGS" &&
                                  hasNGS &&
                                  markerFreqDataNGS
                                ) {
                                  // Prefer RAO if available, otherwise use first available population
                                  const ngsPops = Object.keys(
                                    markerFreqDataNGS,
                                  ).filter(
                                    (key) =>
                                      key !== "kit" &&
                                      key !== "technology" &&
                                      Array.isArray(
                                        markerFreqDataNGS[
                                          key as keyof typeof markerFreqDataNGS
                                        ],
                                      ) &&
                                      (
                                        markerFreqDataNGS[
                                          key as keyof typeof markerFreqDataNGS
                                        ] as any[]
                                      ).length > 0,
                                  );
                                  const defaultPop = ngsPops.includes("RAO")
                                    ? "RAO"
                                    : ngsPops[0] || "RAO";
                                  setSelectedPopulation(defaultPop);
                                } else if (tech === "CE") {
                                  setSelectedPopulation("AFR");
                                }
                              }}
                              className="h-7 text-xs font-normal rounded-sm px-2"
                            >
                              {tech}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {availableTechnologies.includes(selectedTechnology) &&
                (showAllPopulations
                  ? activeAllChartData.length > 0
                  : chartData.length > 0) ? (
                  <>
                    <div className={showAllPopulations ? "h-[420px]" : "h-80"}>
                      <ResponsiveContainer width="100%" height="100%">
                        {showAllPopulations ? (
                          <LineChart data={activeAllChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="allele"
                              tick={{ fontSize: 11 }}
                              interval={0}
                              angle={-45}
                              textAnchor="end"
                              height={50}
                            />
                            <YAxis
                              tick={{ fontSize: 12 }}
                              tickFormatter={(value) =>
                                Number(value).toFixed(3)
                              }
                              domain={[0, compareYMax || "auto"]}
                            />
                            <Tooltip
                              formatter={(value: any, name: string) => [
                                Number(value).toFixed(4),
                                name,
                              ]}
                              contentStyle={{ fontSize: 12 }}
                            />
                            <Legend
                              wrapperStyle={{ fontSize: 12, cursor: "pointer" }}
                              iconType="plainline"
                              onClick={(e: any) => {
                                const pop = e.dataKey as string;
                                setHiddenPopulations((prev) => {
                                  const next = new Set(prev);
                                  if (next.has(pop)) {
                                    next.delete(pop);
                                  } else {
                                    const visibleCount =
                                      activeAllPops.length - next.size;
                                    if (visibleCount > 1) next.add(pop);
                                  }
                                  return next;
                                });
                              }}
                              formatter={(value: string) => (
                                <span
                                  style={{
                                    color: hiddenPopulations.has(value)
                                      ? "#d1d5db"
                                      : undefined,
                                  }}
                                >
                                  {value}
                                </span>
                              )}
                            />
                            {activeAllPops.map((pop) => (
                              <Line
                                key={pop}
                                type="monotone"
                                dataKey={pop}
                                stroke={POPULATION_COLORS[pop] ?? "#6b7280"}
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 5 }}
                                name={pop}
                                connectNulls
                                hide={hiddenPopulations.has(pop)}
                              />
                            ))}
                          </LineChart>
                        ) : (
                          <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="allele" tick={{ fontSize: 12 }} />
                            <YAxis
                              tick={{ fontSize: 12 }}
                              tickFormatter={(value) =>
                                Number(value).toFixed(3)
                              }
                            />
                            <Tooltip
                              formatter={(value: any, name: string) => [
                                value,
                                name === "frequency"
                                  ? t("common.frequency")
                                  : t("common.count"),
                              ]}
                              contentStyle={{ fontSize: 12 }}
                            />
                            <Bar dataKey="frequency" fill="#6b7280" />
                          </BarChart>
                        )}
                      </ResponsiveContainer>
                    </div>
                    {showAllPopulations && (
                      <p className="mt-1 text-center text-xs text-muted-foreground">
                        {t("marker.frequencies.legendClickHint")}
                      </p>
                    )}

                    {!showAllPopulations && (
                    <>
                    {/* Show dataset-specific description if available, otherwise show generic description */}
                    {(() => {
                      // Check if this is NGS 1000G dataset (AFR/EUR/NAM/EAS/SAS, but not RAO)
                      const isNGS1000G =
                        selectedTechnology === "NGS" &&
                        selectedPopulation !== "RAO" &&
                        ["AFR", "EUR", "NAM", "EAS", "SAS"].includes(
                          selectedPopulation,
                        ) &&
                        NGS_1000G_POPULATION_GROUPS[selectedPopulation];

                      // Show RAO description if it exists (unchanged)
                      if (datasetDescription && selectedPopulation === "RAO") {
                        return (
                          <p className="mt-2 text-sm text-muted-foreground">
                            {datasetDescription}
                          </p>
                        );
                      }

                      // Show NGS 1000G description for AFR/EUR/NAM/EAS/SAS
                      if (isNGS1000G) {
                        return (
                          <div className="mt-2 space-y-3 text-sm text-muted-foreground">
                            <p>{t("marker.frequencies.ngs1000G.intro")}</p>
                            <p>
                              <span className="font-medium">
                                {t(
                                  "marker.frequencies.ngs1000G.populationGroupsLabel",
                                )}
                              </span>
                              <br />
                              {NGS_1000G_POPULATION_GROUPS[selectedPopulation]}
                            </p>
                            <div className="space-y-1">
                              <p className="font-medium flex items-center gap-2">
                                <span>
                                  {t(
                                    "marker.frequencies.ngs1000G.datasetNotesTitle",
                                  )}
                                </span>
                              </p>
                              <p>
                                {t(
                                  "marker.frequencies.ngs1000G.datasetNotesParagraph1",
                                )}
                              </p>
                              <p>
                                {t(
                                  "marker.frequencies.ngs1000G.datasetNotesParagraph2",
                                )}
                              </p>
                            </div>
                            <p className="text-xs">
                              <span className="font-semibold">
                                {t(
                                  "marker.frequencies.datasetNotes.referenceLabel",
                                )}
                                :
                              </span>
                              <br />
                              Frontanilla TS et al. Open-Access Worldwide
                              Population STR Database Constructed Using
                              High-Coverage Whole-Genome Sequencing Data from
                              the 1000 Genomes Project. Genes. 2022;13(12):2205.
                              <br />
                              https://doi.org/10.3390/genes13122205
                            </p>
                          </div>
                        );
                      }

                      // Show RAO description if it exists (for any other case)
                      if (datasetDescription) {
                        return (
                          <p className="mt-2 text-sm text-muted-foreground">
                            {datasetDescription}
                          </p>
                        );
                      }

                      // Default: show generic pop.STR description
                      return (
                        <>
                          {isPopStrDataset && (
                            <p className="mt-2 text-sm text-muted-foreground">
                              {t("marker.frequencies.datasetNotes.provenance")}
                            </p>
                          )}
                          <p className="mt-2 text-sm text-muted-foreground">
                            <span className="font-medium">
                              {t(
                                "marker.frequencies.datasetNotes.populationLabel",
                              )}
                            </span>
                            <br />
                            {populationDescription}
                          </p>
                        </>
                      );
                    })()}
                    {showPopStrDatasetNotesAccordion &&
                      popStrDatasetNotesShortTitleAndAccordion}

                    <div className="mt-4 flex flex-wrap gap-2">
                      {(() => {
                        // Check if this is NGS 1000G dataset (AFR/EUR/NAM/EAS/SAS, but not RAO)
                        const isNGS1000G =
                          selectedTechnology === "NGS" &&
                          selectedPopulation !== "RAO" &&
                          ["AFR", "EUR", "NAM", "EAS", "SAS"].includes(
                            selectedPopulation,
                          );

                        // NGS 1000G: Show both "Original dataset" and "Original publication" buttons
                        if (isNGS1000G) {
                          return (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="text-xs"
                              >
                                <a
                                  href={NGS_1000G_DATASET_LINKS.datasetUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {t(
                                    "marker.frequencies.ngs1000G.originalDatasetButton",
                                  )}
                                </a>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="text-xs"
                              >
                                <a
                                  href={NGS_1000G_DATASET_LINKS.publicationUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {t(
                                    "marker.frequencies.ngs1000G.originalPublicationButton",
                                  )}
                                </a>
                              </Button>
                            </>
                          );
                        }

                        // RAO and other datasets: Use existing logic (unchanged)
                        // Show dataset button only if no external URL is configured
                        if (!currentDataset?.metadata?.externalUrl) {
                          return (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="text-xs"
                              >
                                <a
                                  href="http://spsmart.cesga.es/search.php?dataSet=strs_local"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {t("marker.datasetButton")}
                                </a>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="text-xs"
                              >
                                <a
                                  href="https://pubmed.ncbi.nlm.nih.gov/18847484/"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {t("marker.originalPublicationButton")}
                                </a>
                              </Button>
                            </>
                          );
                        }

                        // Show external URL button if metadata provides one (e.g., RAO)
                        return (
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="text-xs"
                          >
                            <a
                              href={currentDataset.metadata.externalUrl}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {t("marker.frequencies.openOriginalPaperButton")}
                            </a>
                          </Button>
                        );
                      })()}
                    </div>
                    </>
                    )}

                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-foreground">
                          {t("marker.freqDescription")}
                        </h3>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs font-normal rounded-sm px-2"
                          onClick={() => {
                            if (showAllPopulations) {
                              const csvContent = [
                                [t("common.allele"), ...activeAllPops],
                                ...activeAllChartData.map((item) => [
                                  item.allele,
                                  ...activeAllPops.map((pop) =>
                                    (item[pop] != null
                                      ? Number(item[pop]).toFixed(4)
                                      : ""),
                                  ),
                                ]),
                              ]
                                .map((row) => row.join(","))
                                .join("\n");

                              const blob = new Blob([csvContent], {
                                type: "text/csv",
                              });
                              const url = window.URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = url;
                              a.download = `${marker.name}_ALL_${selectedTechnology}_frequencies.csv`;
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                              window.URL.revokeObjectURL(url);
                            } else {
                              const csvContent = [
                                [t("common.allele"), t("common.frequency")],
                                ...chartData.map((item) => [
                                  item.allele,
                                  item.frequency.toString(),
                                ]),
                              ]
                                .map((row) => row.join(","))
                                .join("\n");

                              const blob = new Blob([csvContent], {
                                type: "text/csv",
                              });
                              const url = window.URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = url;
                              a.download = `${marker.name}_${selectedPopulation}_frequencies.csv`;
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                              window.URL.revokeObjectURL(url);
                            }
                          }}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          {t("marker.downloadCSV")}
                        </Button>
                      </div>

                      <div className="border border-border rounded-md overflow-hidden">
                        <div className="max-h-64 overflow-y-auto">
                          {showAllPopulations ? (
                            <table className="w-full">
                              <thead className="sticky top-0 z-10 border-b border-border bg-background">
                                <tr>
                                  <th className="text-left p-2 text-xs font-semibold text-foreground">
                                    {t("common.allele")}
                                  </th>
                                  {activeAllPops.map((pop) => (
                                    <th
                                      key={pop}
                                      className="text-left p-2 text-xs font-semibold text-foreground"
                                    >
                                      <span className="flex items-center gap-1.5">
                                        <span
                                          className="inline-block h-2.5 w-2.5 rounded-sm"
                                          style={{
                                            backgroundColor:
                                              POPULATION_COLORS[pop] ??
                                              "#6b7280",
                                          }}
                                        />
                                        {pop}
                                      </span>
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {activeAllChartData.map((item, index) => (
                                  <tr
                                    key={item.allele}
                                    className={
                                      index % 2 === 0
                                        ? "bg-background"
                                        : "bg-muted/10"
                                    }
                                  >
                                    <td className="p-2 text-xs font-mono text-foreground">
                                      {item.allele}
                                    </td>
                                    {activeAllPops.map((pop) => (
                                      <td
                                        key={pop}
                                        className="p-2 text-xs font-normal text-foreground"
                                      >
                                        {item[pop] != null
                                          ? Number(item[pop]).toFixed(4)
                                          : "—"}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <table className="w-full">
                              <thead className="sticky top-0 z-10 border-b border-border bg-background">
                                <tr>
                                  <th className="text-left p-2 text-xs font-semibold text-foreground">
                                    {t("common.allele")}
                                  </th>
                                  <th className="text-left p-2 text-xs font-semibold text-foreground">
                                    {t("common.frequency")}
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {chartData
                                  .filter((item) => item.frequency > 0)
                                  .sort((a, b) => {
                                    const alleleA = Number.parseFloat(
                                      a.allele,
                                    );
                                    const alleleB = Number.parseFloat(
                                      b.allele,
                                    );
                                    if (!isNaN(alleleA) && !isNaN(alleleB)) {
                                      return alleleA - alleleB;
                                    }
                                    return a.allele.localeCompare(
                                      b.allele,
                                      undefined,
                                      { numeric: true },
                                    );
                                  })
                                  .map((item, index) => (
                                    <tr
                                      key={item.allele}
                                      className={
                                        index % 2 === 0
                                          ? "bg-background"
                                          : "bg-muted/10"
                                      }
                                    >
                                      <td className="p-2 text-xs font-mono text-foreground">
                                        {item.allele}
                                      </td>
                                      <td className="p-2 text-xs font-normal text-foreground">
                                        {item.frequency.toFixed(4)}
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          )}
                        </div>
                      </div>

                    {isNgsAllMode && (
                      <>
                        <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                          <p>{t("marker.frequencies.ngs1000G.intro")}</p>
                          <div className="space-y-1">
                            <p className="font-medium flex items-center gap-2">
                              <span>
                                {t(
                                  "marker.frequencies.ngs1000G.datasetNotesTitle",
                                )}
                              </span>
                            </p>
                            <p>
                              {t(
                                "marker.frequencies.ngs1000G.datasetNotesParagraph1",
                              )}
                            </p>
                            <p>
                              {t(
                                "marker.frequencies.ngs1000G.datasetNotesParagraph2",
                              )}
                            </p>
                          </div>
                          <p className="text-xs">
                            <span className="font-semibold">
                              {t(
                                "marker.frequencies.datasetNotes.referenceLabel",
                              )}
                              :
                            </span>
                            <br />
                            Frontanilla TS et al. Open-Access Worldwide
                            Population STR Database Constructed Using
                            High-Coverage Whole-Genome Sequencing Data from the
                            1000 Genomes Project. Genes. 2022;13(12):2205.
                            <br />
                            https://doi.org/10.3390/genes13122205
                          </p>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="text-xs"
                          >
                            <a
                              href={NGS_1000G_DATASET_LINKS.datasetUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {t(
                                "marker.frequencies.ngs1000G.originalDatasetButton",
                              )}
                            </a>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="text-xs"
                          >
                            <a
                              href={NGS_1000G_DATASET_LINKS.publicationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {t(
                                "marker.frequencies.ngs1000G.originalPublicationButton",
                              )}
                            </a>
                          </Button>
                        </div>
                      </>
                    )}

                    {showPopStrDatasetNotesAccordion &&
                      showAllPopulations &&
                      selectedTechnology === "CE" && (
                        <>
                          <p className="mt-4 text-sm text-muted-foreground">
                            {t("marker.frequencies.datasetNotes.provenance")}
                          </p>
                          {popStrDatasetNotesShortTitleAndAccordion}
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center py-10 space-y-4">
                    <p className="text-sm text-muted-foreground max-w-md">
                      {isLatamCE
                        ? latamSubpopForChart
                          ? "Allele frequencies for this LATAM subpopulation are being curated."
                          : "Allele frequencies for LATAM are being curated."
                        : t("marker.noFrequenciesMessage")}
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/about#contact">
                        <ExternalLink className="h-3 w-3 mr-2" />
                        {t("marker.contributeDataCta")}
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statistics" className="space-y-4">
            <Card className="border rounded-md shadow-none bg-card">
              <CardHeader className="pb-3 px-4">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  {t("marker.statistics.title")}
                </CardTitle>
                <CardDescription className="text-xs font-normal mt-1">
                  {t("marker.statistics.description")}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4">
                {(() => {
                  const stats = markerStatisticsCE[markerId];
                  if (!stats || Object.keys(stats).length === 0) {
                    return (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        {t("marker.statistics.noData")}
                      </p>
                    );
                  }
                  const pops = (["AFR", "NAM", "EAS", "CSA", "EUR", "MES", "OCE"] as const).filter(
                    (p) => stats[p] != null,
                  );
                  const rows = pops.map((p) => stats[p]!);
                  const showN = rows.some((r) => r.N != null);
                  const showHobs = rows.some((r) => r.Hobs != null);
                  const showHexp = rows.some((r) => r.Hexp != null);
                  const showFis = rows.some((r) => r.Fis != null);
                  const showFst = rows.some((r) => r.Fst != null);
                  const legendParts = [
                    showN && t("marker.statistics.legendN"),
                    showHobs && t("marker.statistics.legendHobs"),
                    showHexp && t("marker.statistics.legendHexp"),
                    showFis && t("marker.statistics.legendFis"),
                    showFst && t("marker.statistics.legendFst"),
                  ].filter(Boolean) as string[];
                  const footerText =
                    legendParts.length > 0
                      ? `${t("marker.statistics.sourceIntro")}. ${legendParts.join("; ")}.`
                      : `${t("marker.statistics.sourceIntro")}.`;
                  return (
                    <div className="space-y-4">
                      <div className="border border-border rounded-md overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-muted/50 border-b border-border">
                                <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">
                                  {t("marker.statistics.population")}
                                </th>
                                {showN ? (
                                  <th className="text-right px-3 py-2 text-xs font-semibold text-muted-foreground">
                                    N
                                  </th>
                                ) : null}
                                {showHobs ? (
                                  <th className="text-right px-3 py-2 text-xs font-semibold text-muted-foreground">
                                    H<sub>obs</sub>
                                  </th>
                                ) : null}
                                {showHexp ? (
                                  <th className="text-right px-3 py-2 text-xs font-semibold text-muted-foreground">
                                    H<sub>exp</sub>
                                  </th>
                                ) : null}
                                {showFis ? (
                                  <th className="text-right px-3 py-2 text-xs font-semibold text-muted-foreground">
                                    F<sub>is</sub>
                                  </th>
                                ) : null}
                                {showFst ? (
                                  <th className="text-right px-3 py-2 text-xs font-semibold text-muted-foreground">
                                    F<sub>st</sub>
                                  </th>
                                ) : null}
                              </tr>
                            </thead>
                            <tbody>
                              {pops.map((pop, i) => {
                                const s = stats[pop]!;
                                return (
                                  <tr
                                    key={pop}
                                    className={cn(
                                      "border-b border-border last:border-b-0",
                                      i % 2 === 0 ? "bg-background" : "bg-muted/30",
                                    )}
                                  >
                                    <td className="px-3 py-2 font-medium text-foreground">
                                      <span className="flex items-center gap-2">
                                        <span
                                          className="inline-block h-2.5 w-2.5 rounded-full"
                                          style={{
                                            backgroundColor:
                                              POPULATION_COLORS[pop] ?? "#888",
                                          }}
                                        />
                                        {pop}
                                      </span>
                                    </td>
                                    {showN ? (
                                      <td className="px-3 py-2 text-right tabular-nums text-foreground">
                                        {s.N != null ? s.N.toLocaleString() : "–"}
                                      </td>
                                    ) : null}
                                    {showHobs ? (
                                      <td className="px-3 py-2 text-right tabular-nums text-foreground">
                                        {s.Hobs != null ? s.Hobs.toFixed(3) : "–"}
                                      </td>
                                    ) : null}
                                    {showHexp ? (
                                      <td className="px-3 py-2 text-right tabular-nums text-foreground">
                                        {s.Hexp != null ? s.Hexp.toFixed(3) : "–"}
                                      </td>
                                    ) : null}
                                    {showFis ? (
                                      <td className="px-3 py-2 text-right tabular-nums text-foreground">
                                        {s.Fis != null ? s.Fis.toFixed(4) : "–"}
                                      </td>
                                    ) : null}
                                    {showFst ? (
                                      <td className="px-3 py-2 text-right tabular-nums text-foreground">
                                        {s.Fst != null ? s.Fst.toFixed(4) : "–"}
                                      </td>
                                    ) : null}
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{footerText}</p>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="variants" className="space-y-4">
            <Card className="border rounded-md shadow-none bg-card">
              <CardHeader className="pb-3 px-4">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  {t("marker.variantAlleles")}
                </CardTitle>
                <CardDescription className="text-xs font-normal mt-1">
                  {t("marker.variantAllelesDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4">
                {marker.sequences && marker.sequences.length > 0 ? (
                  <div className="space-y-4">
                    <div className="border border-border rounded-md overflow-hidden">
                      <div className="max-h-96 overflow-y-auto">
                        <table className="w-full">
                          <thead className="sticky top-0 z-10 border-b border-border bg-background">
                            <tr>
                              <th className="text-left px-3 py-2 text-xs font-semibold text-foreground">
                                {t("marker.alleleDesignation")}
                              </th>
                              <th className="text-left px-3 py-2 text-xs font-semibold text-foreground">
                                {t("marker.strNaming")}
                              </th>
                              <th className="text-left px-3 py-2 text-xs font-semibold text-foreground">
                                {t("marker.sequence")}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {marker.sequences.map((seq, index) => (
                              <tr
                                key={`${seq.allele}-${index}`}
                                className={
                                  index % 2 === 0
                                    ? "bg-background"
                                    : "bg-muted/10"
                                }
                              >
                                <td className="px-3 py-2 font-mono font-normal text-xs text-foreground">
                                  {seq.allele}
                                </td>
                                <td className="px-3 py-2 text-xs font-normal text-foreground">
                                  {seq.pattern || "—"}
                                </td>
                                <td className="px-3 py-2">
                                  <div className="font-mono text-xs font-normal break-all leading-relaxed text-foreground">
                                    {seq.sequence}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-2 pt-2">
                      <Button
                        variant="default"
                        className="h-7 text-xs font-normal rounded-sm px-3"
                        onClick={() => {
                          const csvContent = [
                            [
                              t("marker.alleleDesignation"),
                              t("marker.strNaming"),
                              t("marker.sequence"),
                            ],
                            ...marker.sequences.map((seq) => [
                              seq.allele,
                              seq.pattern || "",
                              seq.sequence,
                            ]),
                          ]
                            .map((row) =>
                              row.map((cell) => `"${cell}"`).join(","),
                            )
                            .join("\n");

                          const blob = new Blob([csvContent], {
                            type: "text/csv;charset=utf-8;",
                          });
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `${marker.name}_variant_alleles.csv`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          window.URL.revokeObjectURL(url);
                        }}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        {t("marker.download")}
                      </Button>

                      <p className="text-xs text-muted-foreground">
                        {t("marker.source")}:{" "}
                        <a
                          href="https://strbase.nist.gov/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          STRbase
                        </a>
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 py-8">
                    <p className="text-sm text-muted-foreground text-center">
                      {t("marker.noVariantsForMarker")}
                    </p>
                    <Button
                      variant="default"
                      className="h-8 text-xs font-normal rounded-sm px-4"
                      asChild
                    >
                      <Link href="/community#contact">
                        {t("marker.addNewVariant")}
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools" className="space-y-3">
            <Card className="border rounded-md shadow-none bg-card py-4">
              <CardHeader className="pb-0 pt-2 px-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <CardTitle className="text-sm font-semibold text-foreground leading-tight">
                      {t("marker.toolsCompatibility")}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs font-normal rounded-sm px-2.5 py-1.5"
                      asChild
                    >
                      <Link href="/tools">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        {t("marker.viewAllToolsPipelines")}
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs font-normal rounded-sm px-2.5 py-1.5"
                      asChild
                    >
                      <Link href="/about#contact">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        {t("marker.addNewTool")}
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground leading-snug">
                  <span>{t("marker.toolsDisclaimerShort")}</span>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <span
                        className="inline-flex shrink-0 cursor-help text-muted-foreground hover:text-foreground"
                        aria-label={t("marker.toolsDisclaimerShort")}
                      >
                        <Info className="h-3.5 w-3.5" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm text-xs">
                      {t("marker.toolsDisclaimer")}
                    </TooltipContent>
                  </UITooltip>
                </div>
                {toolsForMarker.length > 0 ? (
                  <div className="grid lg:grid-cols-2 gap-5">
                    {toolsForMarker.map((item) => {
                      const badgeLabel =
                        item.label === "curated_supported"
                          ? t("marker.supported")
                          : undefined;
                      const firstInterface = item.details?.interfaces?.[0];
                      const interfaceTeaser = firstInterface
                        ? { name: firstInterface.name, url: firstInterface.url }
                        : null;
                      return (
                        <ToolCardCompact
                          key={item.card.id}
                          variant="marker"
                          card={item.card}
                          badgeLabel={badgeLabel}
                          interfaceTeaser={interfaceTeaser}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    {t("marker.noCompatibleTools")}
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
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
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { markerData } from "./markerData";
import { useLanguage } from "@/contexts/language-context";
import { markerFrequencies } from "./markerFrequencies";
import { toolsData, type Tool } from "./toolsData";

export default function MarkerPage({ params }: { params: { id: string } }) {
  const { t } = useLanguage();
  const [selectedPopulation, setSelectedPopulation] = useState<string>("AFR");
  const [xstrFrequencies, setXstrFrequencies] = useState<any>(null);
  const [selectedTechnology, setSelectedTechnology] = useState<string>("NGS");
  const [selectedDataset, setSelectedDataset] = useState<string>("");
  const searchParams = useSearchParams();

  const markerId = params.id.toLowerCase();
  const marker = markerData[markerId as keyof typeof markerData];
  const tabValues = ["overview", "frequencies", "variants", "tools"] as const;
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
          console.error("[v0] Failed to load X-STR frequencies:", err)
        );
    }
  }, [markerId, marker]);

  // Reset selected dataset when technology or population changes
  useEffect(() => {
    setSelectedDataset("");
  }, [selectedTechnology, selectedPopulation]);

  useEffect(() => {
    setActiveTab(initialTabParam);
  }, [initialTabParam]);

  if (!marker) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link
              href="/catalog"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("marker.backToCatalog")}
            </Link>
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
        </header>
      </div>
    );
  }

  const markerFreqData =
    markerFrequencies[markerId as keyof typeof markerFrequencies];
  const availableTechnologies = markerFreqData?.technology
    ? [markerFreqData.technology]
    : [];

  const currentTechInfo =
    markerFreqData?.technology === selectedTechnology
      ? { technology: markerFreqData.technology, kit: markerFreqData.kit }
      : null;

  const isXSTR = marker.type === "X-STR" || marker.chromosome === "X";

  // Filter tools based on marker compatibility
  const getCompatibleTools = (): Tool[] => {
    const markerTech = markerFreqData?.technology;
    if (!markerTech) return [];

    // Map marker technology to tool technology
    let compatibleTechs: string[] = [];
    if (markerTech === "NGS") {
      compatibleTechs = ["Illumina"];
    } else if (markerTech === "CE") {
      compatibleTechs = ["CE"];
    }

    // Determine compatible input formats
    const compatibleInputs: string[] = [];
    if (markerTech === "NGS") {
      compatibleInputs.push("FASTQ", "BAM", "CRAM");
    } else if (markerTech === "CE") {
      compatibleInputs.push("CE_RFU");
    }

    // Filter tools
    return toolsData.filter((tool) => {
      // STRspy captures all autosomal and Y markers, so always include it
      if (tool.id === "strspy") return true;

      // Check if tool supports the marker's technology
      const techMatch = tool.tech.some((tech) =>
        compatibleTechs.includes(tech)
      );
      if (!techMatch) return false;

      // Check if tool supports at least one compatible input format
      const inputMatch = tool.input.some((input) =>
        compatibleInputs.includes(input)
      );
      return inputMatch;
    });
  };

  const compatibleTools = getCompatibleTools();

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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/catalog"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("marker.backToCatalog")}
          </Link>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
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
          <p className="text-base font-normal text-foreground mb-2">
            {marker.fullName}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {marker.description}
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as TabValue)}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4 h-9 bg-muted/50 p-1 rounded-md border-0">
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
                          Cytogenetic Location
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
                        {marker.type}
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
                        {marker.alleles}
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
                            <p className="text-sm font-normal font-mono text-foreground break-all">
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
                              <p className="text-sm font-normal font-mono text-foreground break-all">
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
                    {selectedTechnology !== "CE" && (
                      <div className="flex gap-2">
                        {["AFR", "AMR", "EAS", "SAS", "EUR", "MES", "OCE"].map(
                          (pop) => (
                            <Button
                              key={pop}
                              variant={
                                selectedPopulation === pop
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() => setSelectedPopulation(pop)}
                              className="h-7 text-xs font-normal rounded-sm px-2"
                            >
                              {pop}
                            </Button>
                          )
                        )}
                      </div>
                    )}
                    {selectedTechnology === "CE" && (
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
                            <SelectValue placeholder="No CE datasets available yet" />
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
                                  const n = study.n || study.sampleSize || 0;
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

                    {availableTechnologies.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-normal text-muted-foreground">
                          Technology:
                        </span>
                        <div className="flex gap-2">
                          {["NGS", "CE"].map((tech) => (
                            <Button
                              key={tech}
                              variant={
                                selectedTechnology === tech
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() => setSelectedTechnology(tech)}
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
                chartData.length > 0 ? (
                  <>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="allele" tick={{ fontSize: 12 }} />
                          <YAxis
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => Number(value).toFixed(3)}
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
                      </ResponsiveContainer>
                    </div>

                    {selectedPopulation === "AFR" && (
                      <p className="w-full text-xs text-muted-foreground text-left mt-2 py-2">
                        The African population dataset from pop.STR is composed
                        of the following population groups: C. African Republic
                        – Biaka Pygmies, D. R. of Congo – Mbuti Pygmies, Kenya –
                        Bantu N.E., Namibia – San, Nigeria – Yoruba, Senegal –
                        Mandenka, Somalia, and South Africa – Bantu.
                      </p>
                    )}
                    {selectedPopulation === "AMR" && (
                      <p className="w-full text-xs text-muted-foreground text-left mt-2 py-2">
                        The American population dataset from pop.STR is composed
                        of the following population groups: Brazil – Karitiana,
                        Brazil – Surui, Colombia – Colombian, Dominican
                        Republic, Mexico – Maya, Mexico – Pima.
                      </p>
                    )}

                    {selectedPopulation === "SAS" && (
                      <p className="w-full text-xs text-muted-foreground text-left mt-2 py-2">
                        The Central-South Asian population dataset from pop.STR
                        is composed of the following population groups: China –
                        Uygur, Pakistan – Balochi, Pakistan – Brahui, Pakistan –
                        Burusho, Pakistan – Hazara, Pakistan – Kalash, Pakistan
                        – Makrani, Pakistan – Pathan, Pakistan – Sindhi.
                      </p>
                    )}

                    {selectedPopulation === "MES" && (
                      <p className="w-full text-xs text-muted-foreground text-left mt-2 py-2">
                        The Middle East population dataset from pop.STR is
                        composed of the following population groups: Algeria
                        (Mzab) – Mozabite, Israel (Carmel) – Druze, Israel
                        (Central) – Palestinian, Israel (Negev) – Bedouin.
                      </p>
                    )}

                    {selectedPopulation === "EUR" && (
                      <p className="w-full text-xs text-muted-foreground text-left mt-2 py-2">
                        The European population dataset from pop.STR is composed
                        of the following population groups: France – Basque,
                        France – French, Italy (Bergamo) – North Italian, Italy
                        – Sardinian, Italy – Tuscan, N.W. Spain, Orkney Islands
                        – Orcadian, Russia – Russian, Russia Caucasus – Adygei,
                        Sweden, U.S. Europeans.
                      </p>
                    )}

                    {selectedPopulation === "EAS" && (
                      <p className="w-full text-xs text-muted-foreground text-left mt-2 py-2">
                        The East Asian population dataset from pop.STR is
                        composed of the following population groups: Cambodia –
                        Cambodian, China – Dai, China – Daur, China – Han, China
                        – Hezhen, China – Lahu, China – Miaozu, China – Mongola,
                        China – Naxi, China – Oroqen, China – She, China – Tu,
                        China – Tujia, China – Xibo, China – Yizu, Japan –
                        Japanese, Siberia – Yakut.
                      </p>
                    )}

                    <p className="text-xs text-muted-foreground">
                      Data source:{" "}
                      <a
                        href="http://spsmart.cesga.es/search.php?dataSet=strs_local&mapPopulation"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        pop.STR
                      </a>{" "}
                      - Illumina ForenSeq kit
                    </p>

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
                          }}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download CSV
                        </Button>
                      </div>

                      <div className="border border-border rounded-md overflow-hidden">
                        <div className="max-h-64 overflow-y-auto">
                          <table className="w-full">
                            <thead className="bg-muted/30 sticky top-0 border-b border-border">
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
                                  const alleleA = Number.parseFloat(a.allele);
                                  const alleleB = Number.parseFloat(b.allele);

                                  if (!isNaN(alleleA) && !isNaN(alleleB)) {
                                    return alleleA - alleleB;
                                  }

                                  return a.allele.localeCompare(
                                    b.allele,
                                    undefined,
                                    { numeric: true }
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
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    {t("common.notFound")}
                  </p>
                )}
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
                          <thead className="bg-muted/30 sticky top-0 border-b border-border">
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
                              row.map((cell) => `"${cell}"`).join(",")
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
                  <p className="text-sm text-muted-foreground text-center py-8">
                    {t("common.notFound")}
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools" className="space-y-4">
            <Card className="border rounded-md shadow-none bg-card">
              <CardHeader className="pb-3 px-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-semibold text-foreground">
                      {t("marker.toolsCompatibility")}
                    </CardTitle>
                    <CardDescription className="text-xs font-normal mt-1">
                      {t("marker.toolsDescription")}
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs font-normal rounded-sm px-3"
                    asChild
                  >
                    <Link href="/about#contact">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      {t("marker.addNewTool")}
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-4">
                <div className="mb-4 p-3 bg-muted/30 border border-border rounded-md">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {t("marker.toolsDisclaimer")}{" "}
                    <Link
                      href="/about#contact"
                      className="text-primary hover:underline"
                    >
                      {t("marker.contactUs")}
                    </Link>
                    .
                  </p>
                </div>
                {compatibleTools.length > 0 ? (
                  <div className="space-y-4">
                    {compatibleTools.map((tool) => (
                      <div
                        key={tool.id}
                        className="border border-border rounded-md p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold text-foreground">
                            {tool.name}
                          </h3>
                          <Badge
                            variant="outline"
                            className="text-xs font-normal px-2 py-0.5 border-muted-foreground/20"
                          >
                            {t("marker.supported")}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2">
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-normal text-muted-foreground">
                                {t("marker.technology")}:
                              </span>
                              {tool.tech.map((tech) => (
                                <Badge
                                  key={tech}
                                  variant="outline"
                                  className="text-xs font-normal px-2 py-0.5 border-muted-foreground/20"
                                >
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-normal text-muted-foreground">
                                {t("marker.inputFormat")}:
                              </span>
                              {tool.input.map((input) => (
                                <Badge
                                  key={input}
                                  variant="outline"
                                  className="text-xs font-normal px-2 py-0.5 border-muted-foreground/20"
                                >
                                  {input}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-normal text-muted-foreground">
                                {t("marker.outputFormat")}:
                              </span>
                              {tool.output.map((output) => (
                                <Badge
                                  key={output}
                                  variant="outline"
                                  className="text-xs font-normal px-2 py-0.5 border-muted-foreground/20"
                                >
                                  {output}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {tool.support.native_panels &&
                            tool.support.native_panels.length > 0 && (
                              <div className="space-y-1">
                                <span className="text-xs font-normal text-muted-foreground">
                                  {t("marker.nativePanels")}:
                                </span>
                                <div className="flex flex-wrap gap-2">
                                  {tool.support.native_panels.map(
                                    (panelUrl, idx) => (
                                      <Button
                                        key={idx}
                                        variant="outline"
                                        size="sm"
                                        className="h-7 text-xs font-normal rounded-sm px-2"
                                        asChild
                                      >
                                        <a
                                          href={panelUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          <ExternalLink className="h-3 w-3 mr-1" />
                                          {t("marker.panel")}
                                        </a>
                                      </Button>
                                    )
                                  )}
                                </div>
                              </div>
                            )}

                          <div className="space-y-2 pt-2 border-t border-border">
                            <div className="space-y-1">
                              <span className="text-xs font-semibold text-foreground">
                                {t("marker.configuration")}:
                              </span>
                              <div className="text-xs text-muted-foreground space-y-1">
                                <div>
                                  <span className="font-medium">
                                    {t("marker.targetFileFormat")}:
                                  </span>{" "}
                                  {tool.config.target_file_format}
                                </div>
                                {tool.config.flanking_bp_recommended && (
                                  <div>
                                    <span className="font-medium">
                                      {t("marker.flankingBpRecommended")}:
                                    </span>{" "}
                                    {tool.config.flanking_bp_recommended} bp
                                  </div>
                                )}
                                {tool.config.customizable_targets && (
                                  <div className="flex items-center gap-1">
                                    <Badge
                                      variant="secondary"
                                      className="text-xs font-normal px-2 py-0.5"
                                    >
                                      {t("marker.customizableTargetsLabel")}
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2 pt-2 border-t border-border">
                            <div className="space-y-1">
                              <span className="text-xs font-semibold text-foreground">
                                {t("marker.compatibility")}:
                              </span>
                              <div className="text-xs text-muted-foreground space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    {t("marker.status")}:
                                  </span>
                                  <Badge
                                    variant={
                                      tool.compatibility.status === "maintained"
                                        ? "default"
                                        : "secondary"
                                    }
                                    className="text-xs font-normal px-2 py-0.5"
                                  >
                                    {tool.compatibility.status === "maintained"
                                      ? t("marker.maintained")
                                      : t("marker.archived")}
                                  </Badge>
                                </div>
                                {tool.compatibility.maintainer && (
                                  <div>
                                    <span className="font-medium">
                                      {t("marker.maintainer")}:
                                    </span>{" "}
                                    {tool.compatibility.maintainer}
                                  </div>
                                )}
                                <div>
                                  <span className="font-medium">
                                    {t("marker.license")}:
                                  </span>{" "}
                                  {tool.compatibility.license}
                                </div>
                                {tool.compatibility.last_release && (
                                  <div>
                                    <span className="font-medium">
                                      {t("marker.lastRelease")}:
                                    </span>{" "}
                                    {tool.compatibility.last_release}
                                  </div>
                                )}
                                {tool.compatibility.ont_models &&
                                  tool.compatibility.ont_models.length > 0 && (
                                    <div>
                                      <span className="font-medium">
                                        {t("marker.ontModels")}:
                                      </span>{" "}
                                      {tool.compatibility.ont_models.join(", ")}
                                    </div>
                                  )}
                                {tool.compatibility.docker_image && (
                                  <div>
                                    <span className="font-medium">
                                      {t("marker.dockerImage")}:
                                    </span>{" "}
                                    <code className="text-xs bg-muted px-1 py-0.5 rounded">
                                      {tool.compatibility.docker_image}
                                    </code>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {tool.interfaces && tool.interfaces.length > 0 && (
                            <div className="space-y-2 pt-2 border-t border-border">
                              <span className="text-xs font-semibold text-foreground">
                                {t("marker.interfaces")}:
                              </span>
                              <div className="space-y-2">
                                {tool.interfaces.map((iface, idx) => (
                                  <div key={idx} className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 text-xs font-normal rounded-sm px-2"
                                        asChild
                                      >
                                        <a
                                          href={iface.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          <ExternalLink className="h-3 w-3 mr-1" />
                                          {iface.name}
                                        </a>
                                      </Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      {iface.description}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {tool.limitations && tool.limitations.length > 0 && (
                            <div className="space-y-2 pt-2 border-t border-border">
                              <span className="text-xs font-semibold text-foreground">
                                {t("marker.limitations")}:
                              </span>
                              <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                                {tool.limitations.map((limitation, idx) => (
                                  <li key={idx}>{limitation}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                            {tool.repo_url && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs font-normal rounded-sm px-2"
                                asChild
                              >
                                <a
                                  href={tool.repo_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  {t("marker.repository")}
                                </a>
                              </Button>
                            )}
                            {tool.paper_doi && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs font-normal rounded-sm px-2"
                                asChild
                              >
                                <a
                                  href={
                                    tool.paper_doi.startsWith("http")
                                      ? tool.paper_doi
                                      : `https://doi.org/${tool.paper_doi}`
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <FileText className="h-3 w-3 mr-1" />
                                  {t("marker.originalPublication")}
                                </a>
                              </Button>
                            )}
                            {tool.docs_url && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs font-normal rounded-sm px-2"
                                asChild
                              >
                                <a
                                  href={tool.docs_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <FileText className="h-3 w-3 mr-1" />
                                  {t("marker.documentation")}
                                </a>
                              </Button>
                            )}
                            {tool.online_version && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs font-normal rounded-sm px-2"
                                asChild
                              >
                                <a
                                  href={tool.online_version}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  {t("marker.onlineVersion")}
                                </a>
                              </Button>
                            )}
                          </div>

                          {tool.notes && (
                            <div className="space-y-1 pt-2 border-t border-border">
                              <span className="text-xs font-semibold text-foreground">
                                {t("marker.notes")}:
                              </span>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {tool.notes}
                              </p>
                            </div>
                          )}

                          <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                            {t("marker.lastChecked")}: {tool.last_checked}
                          </div>
                        </div>
                      </div>
                    ))}
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

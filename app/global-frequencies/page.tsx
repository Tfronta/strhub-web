"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Download,
  Info,
  Search,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useLanguage } from "@/contexts/language-context";
import {
  markerFrequenciesCE,
  markerFrequenciesNGS,
  type CEPop,
  type NGSPop,
  type AlleleEntry,
} from "@/app/marker/[id]/markerFrequencies";
import { getDatasetConfig } from "@/app/marker/[id]/datasetConfig";
import { markerData } from "@/lib/markerData";
import { getPopulationColor } from "@/lib/populationColors";

type DatasetId = "CE" | "1000G" | "RAO";

interface DatasetConfig {
  id: DatasetId;
  name: string;
  technology: "CE" | "NGS";
  populations: string[];
  internalPopMap?: Record<string, CEPop | NGSPop>;
}

const MAX_POPULATIONS_FOR_CHART = 7;

export default function GlobalFrequenciesPage() {
  const { t, language } = useLanguage();
  const [selectedDataset, setSelectedDataset] = useState<DatasetId>("CE");
  const [selectedPopulations, setSelectedPopulations] = useState<Set<string>>(
    new Set()
  );
  const [selectedMarker, setSelectedMarker] = useState<string>("");
  const [markerSearchQuery, setMarkerSearchQuery] = useState("");
  const [markerPopoverOpen, setMarkerPopoverOpen] = useState(false);

  // Dataset configurations
  const datasetConfigs: Record<DatasetId, DatasetConfig> = {
    CE: {
      id: "CE",
      name: "pop.STR (CE)",
      technology: "CE",
      populations: ["AFR", "NAM", "EAS", "SAS", "EUR", "MES", "OCE"],
    },
    "1000G": {
      id: "1000G",
      name: "1000 Genomes (NGS)",
      technology: "NGS",
      populations: ["AFR", "EUR", "AMR", "EAS", "SAS"],
      internalPopMap: {
        AFR: "AFR",
        EUR: "EUR",
        AMR: "NAM", // Map AMR to internal NAM
        EAS: "EAS",
        SAS: "SAS",
      },
    },
    RAO: {
      id: "RAO",
      name: "RAO (NGS)",
      technology: "NGS",
      populations: ["RAO"],
    },
  };

  const currentDataset = datasetConfigs[selectedDataset];

  // Initialize selected populations when dataset changes
  useEffect(() => {
    if (currentDataset.populations.length > 0) {
      setSelectedPopulations(new Set(currentDataset.populations));
    } else {
      setSelectedPopulations(new Set());
    }
  }, [selectedDataset]);

  // Get available markers for selected dataset
  const availableMarkers = useMemo(() => {
    const markers: Array<{ id: string; name: string }> = [];

    if (selectedDataset === "CE") {
      Object.keys(markerFrequenciesCE).forEach((markerId) => {
        const markerInfo = markerData[markerId as keyof typeof markerData];
        if (markerInfo) {
          markers.push({
            id: markerId,
            name: markerInfo.name,
          });
        }
      });
    } else if (selectedDataset === "1000G" || selectedDataset === "RAO") {
      Object.keys(markerFrequenciesNGS).forEach((markerId) => {
        const markerFreqData =
          markerFrequenciesNGS[markerId as keyof typeof markerFrequenciesNGS];
        if (!markerFreqData) return;

        // Check if marker has data for the selected dataset
        if (selectedDataset === "1000G") {
          // Check if marker has any 1000G populations (AFR, EUR, NAM, EAS, SAS)
          const has1000GData = ["AFR", "EUR", "NAM", "EAS", "SAS"].some(
            (pop) =>
              markerFreqData[pop as NGSPop] &&
              Array.isArray(markerFreqData[pop as NGSPop])
          );
          if (has1000GData) {
            const markerInfo = markerData[markerId as keyof typeof markerData];
            if (markerInfo) {
              markers.push({
                id: markerId,
                name: markerInfo.name,
              });
            }
          }
        } else if (selectedDataset === "RAO") {
          // Check if marker has RAO data
          if (markerFreqData.RAO && Array.isArray(markerFreqData.RAO)) {
            const markerInfo = markerData[markerId as keyof typeof markerData];
            if (markerInfo) {
              markers.push({
                id: markerId,
                name: markerInfo.name,
              });
            }
          }
        }
      });
    }

    return markers.sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedDataset]);

  // Filter markers by search query
  const filteredMarkers = useMemo(() => {
    if (!markerSearchQuery.trim()) return availableMarkers;
    const query = markerSearchQuery.toLowerCase();
    return availableMarkers.filter(
      (m) =>
        m.id.toLowerCase().includes(query) ||
        m.name.toLowerCase().includes(query)
    );
  }, [availableMarkers, markerSearchQuery]);

  // Set default marker when dataset changes
  useEffect(() => {
    if (availableMarkers.length > 0 && !selectedMarker) {
      setSelectedMarker(availableMarkers[0].id);
    } else if (
      availableMarkers.length > 0 &&
      !availableMarkers.find((m) => m.id === selectedMarker)
    ) {
      setSelectedMarker(availableMarkers[0].id);
    }
  }, [availableMarkers, selectedMarker]);

  // Toggle population selection
  const togglePopulation = (pop: string) => {
    const newSet = new Set(selectedPopulations);
    if (newSet.has(pop)) {
      newSet.delete(pop);
    } else {
      newSet.add(pop);
    }
    setSelectedPopulations(newSet);
  };

  // Select all populations
  const selectAllPopulations = () => {
    setSelectedPopulations(new Set(currentDataset.populations));
  };

  // Clear all populations
  const clearAllPopulations = () => {
    setSelectedPopulations(new Set());
  };

  // Get frequency data for selected marker and populations
  const getFrequencyData = (): Record<string, Record<string, number>> => {
    const result: Record<string, Record<string, number>> = {};
    if (!selectedMarker) return result;

    if (selectedDataset === "CE") {
      const markerFreqData =
        markerFrequenciesCE[selectedMarker as keyof typeof markerFrequenciesCE];
      if (!markerFreqData) return result;

      Array.from(selectedPopulations).forEach((pop) => {
        const popData = markerFreqData[pop as CEPop];
        if (popData && Array.isArray(popData)) {
          result[pop] = {};
          popData.forEach((entry) => {
            if (entry.frequency > 0) {
              result[pop][entry.allele] = entry.frequency;
            }
          });
        }
      });
    } else if (selectedDataset === "1000G" || selectedDataset === "RAO") {
      const markerFreqData =
        markerFrequenciesNGS[
          selectedMarker as keyof typeof markerFrequenciesNGS
        ];
      if (!markerFreqData) return result;

      Array.from(selectedPopulations).forEach((displayPop) => {
        let internalPop: NGSPop | null = null;

        if (selectedDataset === "1000G" && currentDataset.internalPopMap) {
          internalPop = currentDataset.internalPopMap[displayPop] as NGSPop;
        } else if (selectedDataset === "RAO" && displayPop === "RAO") {
          internalPop = "RAO";
        }

        if (internalPop) {
          const popData = markerFreqData[internalPop];
          if (popData && Array.isArray(popData)) {
            result[displayPop] = {};
            popData.forEach((entry) => {
              if (entry.frequency > 0) {
                result[displayPop][entry.allele] = entry.frequency;
              }
            });
          }
        }
      });
    }

    return result;
  };

  // Prepare chart data (grouped bars per allele)
  const chartData = useMemo(() => {
    const freqData = getFrequencyData();
    const allAlleles = new Set<string>();

    // Collect all alleles
    Object.values(freqData).forEach((popFreqs) => {
      Object.keys(popFreqs).forEach((allele) => allAlleles.add(allele));
    });

    // Sort alleles
    const sortedAlleles = Array.from(allAlleles).sort((a, b) => {
      const numA = Number.parseFloat(a);
      const numB = Number.parseFloat(b);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return a.localeCompare(b, undefined, { numeric: true });
    });

    // Build chart data
    return sortedAlleles.map((allele) => {
      const dataPoint: Record<string, string | number> = { allele };
      Array.from(selectedPopulations).forEach((pop) => {
        dataPoint[pop] = freqData[pop]?.[allele] ?? 0;
      });
      return dataPoint;
    });
  }, [selectedMarker, selectedPopulations, selectedDataset]);

  // Get all unique alleles for table
  const allAlleles = useMemo(() => {
    const alleles = new Set<string>();
    const freqData = getFrequencyData();
    Object.values(freqData).forEach((popFreqs) => {
      Object.keys(popFreqs).forEach((allele) => alleles.add(allele));
    });
    return Array.from(alleles).sort((a, b) => {
      const numA = Number.parseFloat(a);
      const numB = Number.parseFloat(b);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return a.localeCompare(b, undefined, { numeric: true });
    });
  }, [selectedMarker, selectedPopulations, selectedDataset]);

  const freqData = getFrequencyData();
  const selectedPopulationsArray = Array.from(selectedPopulations).sort();
  const selectedMarkerInfo = availableMarkers.find(
    (m) => m.id === selectedMarker
  );
  const tooManyPopulations =
    selectedPopulations.size > MAX_POPULATIONS_FOR_CHART;
  const chartPopulations = tooManyPopulations
    ? Array.from(selectedPopulations).slice(0, MAX_POPULATIONS_FOR_CHART)
    : selectedPopulationsArray;

  // Download CSV
  const handleDownloadCSV = () => {
    const rows: string[][] = [
      ["dataset", "technology", "population", "marker", "allele", "frequency"],
    ];

    Array.from(selectedPopulations).forEach((pop) => {
      const popFreqs = freqData[pop] || {};
      Object.entries(popFreqs).forEach(([allele, frequency]) => {
        rows.push([
          currentDataset.name,
          currentDataset.technology,
          pop,
          selectedMarker,
          allele,
          frequency.toString(),
        ]);
      });
    });

    const csvContent = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `global-frequencies_${selectedDataset}_${selectedMarker}_${selectedPopulationsArray.join(
      "-"
    )}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Download JSON
  const handleDownloadJSON = () => {
    const exportData = {
      dataset: currentDataset.name,
      datasetId: selectedDataset,
      technology: currentDataset.technology,
      marker: selectedMarker,
      markerName: selectedMarkerInfo?.name || selectedMarker,
      populations: Array.from(selectedPopulations),
      frequencies: freqData,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `global-frequencies_${selectedDataset}_${selectedMarker}_${selectedPopulationsArray.join(
      "-"
    )}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Get dataset info
  const getDatasetInfo = () => {
    if (selectedDataset === "CE") {
      return {
        name: "pop.STR (CE)",
        technology: "CE",
        source: t("globalFrequencies.ceDataset.source"),
        notes: t("globalFrequencies.ceDataset.notes"),
        comparability: t("globalFrequencies.ceDataset.comparability"),
        externalUrl: null,
      };
    } else if (selectedDataset === "1000G") {
      return {
        name: "1000 Genomes (NGS)",
        technology: "NGS",
        source: t("globalFrequencies.ngs1000G.source"),
        notes: t("globalFrequencies.ngs1000G.notes"),
        comparability: t("globalFrequencies.ngs1000G.comparability"),
        externalUrl: "https://www.internationalgenome.org/category/phase-3/",
      };
    } else if (selectedDataset === "RAO") {
      const config = getDatasetConfig("RAO");
      return {
        name: "RAO (NGS)",
        technology: "NGS",
        source: t("globalFrequencies.ngsRAO.source"),
        notes: t("globalFrequencies.ngsRAO.notes"),
        comparability: t("globalFrequencies.ngsRAO.comparability"),
        externalUrl: config?.metadata?.externalUrl || null,
      };
    }
    return null;
  };

  const datasetInfo = getDatasetInfo();

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t("globalFrequencies.title")}
          </h1>
          <p className="text-base text-muted-foreground mb-3">
            {t("globalFrequencies.heroLine")}
          </p>
          <p className="text-sm text-muted-foreground max-w-4xl leading-relaxed">
            {t("globalFrequencies.comparabilityNote")}
          </p>
        </div>

        {/* Controls Card */}
        <Card className="mb-6 border rounded-md shadow-none bg-card">
          <CardHeader className="pb-3 px-4">
            <CardTitle className="text-sm font-semibold text-foreground">
              {t("globalFrequencies.controls")}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 space-y-4">
            {/* Dataset Selector */}
            <div className="flex items-center gap-3">
              <Label className="text-sm font-medium whitespace-nowrap">
                {t("globalFrequencies.dataset")}:
              </Label>
              <Select
                value={selectedDataset}
                onValueChange={(value) => {
                  setSelectedDataset(value as DatasetId);
                  setSelectedMarker(""); // Reset marker when dataset changes
                }}
              >
                <SelectTrigger className="w-full md:w-[300px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CE">
                    {t("globalFrequencies.datasetCE")}
                  </SelectItem>
                  <SelectItem value="1000G">
                    {t("globalFrequencies.dataset1000G")}
                  </SelectItem>
                  <SelectItem value="RAO">
                    {t("globalFrequencies.datasetRAO")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Population Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  {t("globalFrequencies.selectPopulations")}:
                </Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={selectAllPopulations}
                    className="text-xs h-7"
                  >
                    {t("globalFrequencies.selectAll")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllPopulations}
                    className="text-xs h-7"
                  >
                    {t("globalFrequencies.clear")}
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentDataset.populations.map((pop) => {
                  const isSelected = selectedPopulations.has(pop);
                  return (
                    <Button
                      key={pop}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => togglePopulation(pop)}
                      className="text-xs h-7"
                    >
                      {pop}
                    </Button>
                  );
                })}
              </div>
              {selectedPopulations.size === 0 && (
                <p className="text-xs text-muted-foreground">
                  {t("globalFrequencies.noPopulationsSelected")}
                </p>
              )}
            </div>

            {/* Marker Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t("globalFrequencies.selectMarker")}:
              </Label>
              <Popover
                open={markerPopoverOpen}
                onOpenChange={setMarkerPopoverOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full md:w-[300px] justify-between"
                  >
                    {selectedMarkerInfo
                      ? selectedMarkerInfo.name
                      : t("globalFrequencies.selectMarkerPlaceholder")}
                    <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <div className="p-2">
                    <Input
                      placeholder={t("globalFrequencies.searchMarkers")}
                      value={markerSearchQuery}
                      onChange={(e) => setMarkerSearchQuery(e.target.value)}
                      className="mb-2"
                    />
                    <div className="max-h-[300px] overflow-y-auto">
                      {filteredMarkers.length === 0 ? (
                        <div className="p-4 text-sm text-muted-foreground text-center">
                          {t("globalFrequencies.noMarkersFound")}
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {filteredMarkers.map((marker) => (
                            <Button
                              key={marker.id}
                              variant="ghost"
                              className="w-full justify-start text-sm font-normal"
                              onClick={() => {
                                setSelectedMarker(marker.id);
                                setMarkerPopoverOpen(false);
                                setMarkerSearchQuery("");
                              }}
                            >
                              {marker.name}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>

        {/* Dataset Info */}
        {datasetInfo && (
          <Card className="mb-6 border rounded-md shadow-none bg-card">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="dataset-info" className="border-0">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-semibold">
                      {t("globalFrequencies.datasetInfo")}
                    </span>
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {datasetInfo.technology}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-1">
                        {t("globalFrequencies.datasetName")}
                      </h4>
                      <p>{datasetInfo.name}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-1">
                        {t("globalFrequencies.source")}
                      </h4>
                      <p>{datasetInfo.source}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-1">
                        {t("globalFrequencies.keyNotes")}
                      </h4>
                      <p>{datasetInfo.notes}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-1">
                        {t("globalFrequencies.comparability")}
                      </h4>
                      <p className="text-amber-600 dark:text-amber-500">
                        {datasetInfo.comparability}
                      </p>
                    </div>
                    {datasetInfo.externalUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="text-xs"
                      >
                        <a
                          href={datasetInfo.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-3 w-3 mr-2" />
                          {t("globalFrequencies.viewDataset")}
                        </a>
                      </Button>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>
        )}

        {/* Comparison Output */}
        {selectedMarker && selectedPopulations.size > 0 && (
          <>
            {/* Chart */}
            <Card className="mb-6 border rounded-md shadow-none bg-card">
              <CardHeader className="pb-3 px-4">
                <CardTitle className="text-sm font-semibold text-foreground">
                  {t("globalFrequencies.frequencyChart")} -{" "}
                  {selectedMarkerInfo?.name || selectedMarker}
                </CardTitle>
                {tooManyPopulations && (
                  <CardDescription className="text-xs text-amber-600 dark:text-amber-500 mt-2">
                    {t("globalFrequencies.tooManyPopulationsWarning", {
                      max: MAX_POPULATIONS_FOR_CHART.toString(),
                      total: selectedPopulations.size.toString(),
                    })}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="px-4">
                {chartData.length > 0 ? (
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="allele" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Legend />
                        {chartPopulations.map((pop) => (
                          <Bar
                            key={pop}
                            dataKey={pop}
                            fill={getPopulationColor(pop)}
                            fillOpacity={1}
                          />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[400px] flex items-center justify-center text-sm text-muted-foreground">
                    {t("globalFrequencies.noFrequencyData")}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Frequency Table */}
            <Card className="mb-6 border rounded-md shadow-none bg-card">
              <CardHeader className="pb-3 px-4">
                <CardTitle className="text-sm font-semibold text-foreground">
                  {t("globalFrequencies.frequencyTable")} -{" "}
                  {selectedMarkerInfo?.name || selectedMarker}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4">
                {allAlleles.length > 0 ? (
                  <div className="border border-border rounded-md overflow-hidden">
                    <div className="max-h-[500px] overflow-y-auto">
                      <Table>
                        <TableHeader className="bg-muted/30 sticky top-0">
                          <TableRow>
                            <TableHead className="text-xs font-semibold text-foreground">
                              {t("globalFrequencies.allele")}
                            </TableHead>
                            {selectedPopulationsArray.map((pop) => (
                              <TableHead
                                key={pop}
                                className="text-xs font-semibold text-foreground text-right"
                              >
                                {pop}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {allAlleles.map((allele) => (
                            <TableRow key={allele}>
                              <TableCell className="text-xs font-mono text-foreground">
                                {allele}
                              </TableCell>
                              {selectedPopulationsArray.map((pop) => (
                                <TableCell
                                  key={pop}
                                  className="text-xs text-right text-foreground"
                                >
                                  {freqData[pop]?.[allele]
                                    ? freqData[pop][allele].toFixed(6)
                                    : "—"}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-sm text-muted-foreground py-8">
                    {t("globalFrequencies.noFrequencyData")}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Export Buttons */}
            <div className="flex gap-2 mb-6">
              <Button variant="outline" size="sm" onClick={handleDownloadCSV}>
                <Download className="h-4 w-4 mr-2" />
                {t("globalFrequencies.downloadCSV")}
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadJSON}>
                <Download className="h-4 w-4 mr-2" />
                {t("globalFrequencies.downloadJSON")}
              </Button>
            </div>
          </>
        )}

        {/* Empty State */}
        {(!selectedMarker || selectedPopulations.size === 0) && (
          <Card className="border rounded-md shadow-none bg-card">
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">
                {!selectedMarker
                  ? t("globalFrequencies.selectMarkerToView")
                  : t("globalFrequencies.selectPopulationsToView")}
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

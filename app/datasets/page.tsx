"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Info,
  ExternalLink,
  AlertCircle,
  FileSpreadsheet,
  FileText,
  FileJson,
  Search,
  X,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useLanguage } from "@/contexts/language-context";
import { translations } from "@/lib/translations";
import {
  markerFrequenciesCE,
  markerFrequenciesNGS,
  type CEPop,
  type NGSPop,
  type AlleleEntry,
} from "@/app/marker/[id]/markerFrequencies";
import { getDatasetConfig } from "@/app/marker/[id]/datasetConfig";
import { markerData } from "@/lib/markerData";
import * as XLSX from "xlsx";

type DataType = "CE" | "NGS";
type DatasetId = "CE" | "1000G" | "RAO";

interface DatasetConfig {
  id: DatasetId;
  name: string;
  technology: DataType;
  populations: string[];
  internalPopMap?: Record<string, CEPop | NGSPop>;
  description?: string;
  publicationUrl?: string;
  sampleSize?: string;
}

interface FrequencyRow {
  locus: string;
  allele: string;
  frequency: number;
  population: string;
  sampleSize: number;
}

interface GenotypeRow {
  locus: string;
  genotype: string;
  count?: number;
  frequency?: number;
  population: string;
  sampleSize: number;
}

export default function DatasetsPage() {
  const { t, language } = useLanguage();
  const [dataType, setDataType] = useState<DataType | "">("");
  const [selectedDataset, setSelectedDataset] = useState<DatasetId | "">("");
  const [selectedPopulations, setSelectedPopulations] = useState<Set<string>>(
    new Set()
  );
  const [viewType, setViewType] = useState<"frequencies" | "genotypes">(
    "frequencies"
  );
  const [tableGenerated, setTableGenerated] = useState(false);
  const [locusFilter, setLocusFilter] = useState<string>("");
  const [alleleFilter, setAlleleFilter] = useState<string>("");
  const [locusPopoverOpen, setLocusPopoverOpen] = useState(false);
  const [datasetInfoDialogOpen, setDatasetInfoDialogOpen] = useState(false);

  // Dataset configurations
  const datasetConfigs: Record<DatasetId, DatasetConfig> = {
    CE: {
      id: "CE",
      name: "pop.STR (CE)",
      technology: "CE",
      populations: ["AFR", "NAM", "EAS", "SAS", "EUR", "MES", "OCE"],
      description: t("globalFrequencies.datasets.popstrCE.source"),
      sampleSize: "3,809",
    },
    "1000G": {
      id: "1000G",
      name: "1000 Genomes (NGS)",
      technology: "NGS",
      populations: ["AFR", "EUR", "AMR", "EAS", "SAS"],
      internalPopMap: {
        AFR: "AFR",
        EUR: "EUR",
        AMR: "NAM",
        EAS: "EAS",
        SAS: "SAS",
      },
      description: t("globalFrequencies.datasets.g1k.source"),
      publicationUrl:
        "https://www.mdpi.com/2073-4425/13/12/2205#app1-genes-13-02205",
      sampleSize: "2,504",
    },
    RAO: {
      id: "RAO",
      name: "RAO (NGS)",
      technology: "NGS",
      populations: ["RAO"],
      description: t("globalFrequencies.datasets.rao.source"),
      publicationUrl: "https://doi.org/10.1016/j.fsigen.2022.102676",
    },
  };

  // Get available datasets based on data type
  const availableDatasets = useMemo(() => {
    if (!dataType) return [];
    return Object.values(datasetConfigs).filter(
      (ds) => ds.technology === dataType
    );
  }, [dataType]);

  // Reset selections when data type changes
  useEffect(() => {
    if (dataType) {
      setSelectedDataset("");
      setSelectedPopulations(new Set());
      setTableGenerated(false);
    }
  }, [dataType]);

  // Reset populations when dataset changes
  useEffect(() => {
    if (selectedDataset) {
      const config = datasetConfigs[selectedDataset];
      if (config) {
        setSelectedPopulations(new Set(config.populations));
      }
      setTableGenerated(false);
    }
  }, [selectedDataset]);

  const currentDataset = selectedDataset
    ? datasetConfigs[selectedDataset]
    : null;

  // Get all markers for selected dataset
  const availableMarkers = useMemo(() => {
    if (!selectedDataset) return [];
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

        if (selectedDataset === "1000G") {
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

  // Get frequency data for all markers and selected populations
  const getFrequencyData = (): FrequencyRow[] => {
    if (!selectedDataset || selectedPopulations.size === 0) return [];

    const rows: FrequencyRow[] = [];

    if (selectedDataset === "CE") {
      availableMarkers.forEach((marker) => {
        const markerFreqData =
          markerFrequenciesCE[marker.id as keyof typeof markerFrequenciesCE];
        if (!markerFreqData) return;

        Array.from(selectedPopulations).forEach((pop) => {
          const popData = markerFreqData[pop as CEPop];
          if (popData && Array.isArray(popData)) {
            const totalCount = popData.reduce(
              (sum, entry) => sum + entry.count,
              0
            );
            popData.forEach((entry) => {
              if (entry.frequency > 0) {
                rows.push({
                  locus: marker.name,
                  allele: entry.allele,
                  frequency: entry.frequency,
                  population: pop,
                  sampleSize: totalCount,
                });
              }
            });
          }
        });
      });
    } else if (selectedDataset === "1000G" || selectedDataset === "RAO") {
      availableMarkers.forEach((marker) => {
        const markerFreqData =
          markerFrequenciesNGS[marker.id as keyof typeof markerFrequenciesNGS];
        if (!markerFreqData) return;

        Array.from(selectedPopulations).forEach((displayPop) => {
          let internalPop: NGSPop | null = null;

          if (selectedDataset === "1000G" && currentDataset?.internalPopMap) {
            internalPop = currentDataset.internalPopMap[displayPop] as NGSPop;
          } else if (selectedDataset === "RAO" && displayPop === "RAO") {
            internalPop = "RAO";
          }

          if (internalPop) {
            const popData = markerFreqData[internalPop];
            if (popData && Array.isArray(popData)) {
              const totalCount = popData.reduce(
                (sum, entry) => sum + entry.count,
                0
              );
              popData.forEach((entry) => {
                if (entry.frequency > 0) {
                  rows.push({
                    locus: marker.name,
                    allele: entry.allele,
                    frequency: entry.frequency,
                    population: displayPop,
                    sampleSize: totalCount,
                  });
                }
              });
            }
          }
        });
      });
    }

    return rows;
  };

  // Get genotype data (when available)
  // Note: Currently, genotype data is not available in the current data structure
  // This is a placeholder for future implementation
  const getGenotypeData = (): GenotypeRow[] => {
    // Genotype data not available in current datasets
    return [];
  };

  const frequencyData = useMemo(
    () => getFrequencyData(),
    [selectedDataset, selectedPopulations, availableMarkers, currentDataset]
  );

  const genotypeData = useMemo(
    () => getGenotypeData(),
    [selectedDataset, selectedPopulations]
  );

  const hasGenotypeData = genotypeData.length > 0;
  const tableData = viewType === "frequencies" ? frequencyData : genotypeData;

  // Get unique loci for filter
  const uniqueLoci = useMemo(() => {
    const loci = new Set<string>();
    tableData.forEach((row) => {
      loci.add(row.locus);
    });
    return Array.from(loci).sort();
  }, [tableData]);

  // Filter long-format data
  const filteredTableData = useMemo(() => {
    let filtered = [...tableData];

    if (locusFilter && locusFilter !== "all") {
      filtered = filtered.filter((row) => row.locus === locusFilter);
    }

    if (alleleFilter.trim()) {
      filtered = filtered.filter((row) => {
        if (viewType === "frequencies") {
          return (row as FrequencyRow).allele === alleleFilter.trim();
        }
        return (row as GenotypeRow).genotype === alleleFilter.trim();
      });
    }

    return filtered;
  }, [tableData, locusFilter, alleleFilter, viewType]);

  // Build pivot table structure
  interface PivotRow {
    locus: string;
    allele: string;
    [population: string]: string | number; // population columns with frequency values
  }

  const pivotTableData = useMemo(() => {
    if (filteredTableData.length === 0) return [];

    const pivotMap = new Map<string, PivotRow>();
    const populations = Array.from(selectedPopulations).sort();

    filteredTableData.forEach((row) => {
      const key = `${row.locus}::${
        viewType === "frequencies"
          ? (row as FrequencyRow).allele
          : (row as GenotypeRow).genotype
      }`;

      if (!pivotMap.has(key)) {
        pivotMap.set(key, {
          locus: row.locus,
          allele:
            viewType === "frequencies"
              ? (row as FrequencyRow).allele
              : (row as GenotypeRow).genotype,
        });
        // Initialize all population columns with "—"
        populations.forEach((pop) => {
          pivotMap.get(key)![pop] = "—";
        });
      }

      const pivotRow = pivotMap.get(key)!;
      if (viewType === "frequencies") {
        pivotRow[row.population] = (row as FrequencyRow).frequency;
      } else {
        const genotypeRow = row as GenotypeRow;
        pivotRow[row.population] =
          genotypeRow.frequency ?? genotypeRow.count ?? "—";
      }
    });

    // Convert to array and sort
    const pivotRows = Array.from(pivotMap.values());

    // Sort by locus (A-Z), then by allele (numeric)
    pivotRows.sort((a, b) => {
      const locusCompare = a.locus.localeCompare(b.locus);
      if (locusCompare !== 0) return locusCompare;

      // Numeric sort for alleles
      const alleleA = Number.parseFloat(a.allele);
      const alleleB = Number.parseFloat(b.allele);
      if (!isNaN(alleleA) && !isNaN(alleleB)) {
        return alleleA - alleleB;
      }
      return a.allele.localeCompare(b.allele, undefined, { numeric: true });
    });

    return pivotRows;
  }, [filteredTableData, selectedPopulations, viewType]);

  // Clear filters
  const clearFilters = () => {
    setLocusFilter("");
    setAlleleFilter("");
  };

  // Toggle population selection
  const togglePopulation = (pop: string) => {
    const newSet = new Set(selectedPopulations);
    if (newSet.has(pop)) {
      newSet.delete(pop);
    } else {
      newSet.add(pop);
    }
    setSelectedPopulations(newSet);
    setTableGenerated(false);
  };

  // Select all populations
  const selectAllPopulations = () => {
    if (currentDataset) {
      setSelectedPopulations(new Set(currentDataset.populations));
      setTableGenerated(false);
    }
  };

  // Clear all populations
  const clearAllPopulations = () => {
    setSelectedPopulations(new Set());
    setTableGenerated(false);
  };

  // Handle generate table
  const handleGenerateTable = () => {
    if (dataType && selectedDataset && selectedPopulations.size > 0) {
      setTableGenerated(true);
    }
  };

  // Download Excel
  const handleDownloadExcel = () => {
    if (pivotTableData.length === 0) return;

    // Use pivot table data where each population is a column
    const ws = XLSX.utils.json_to_sheet(pivotTableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");

    // Add metadata sheet
    const metadata = [
      { Key: "Dataset", Value: currentDataset?.name || "" },
      { Key: "Technology", Value: currentDataset?.technology || "" },
      { Key: "Populations", Value: Array.from(selectedPopulations).join(", ") },
      { Key: "Data Type", Value: viewType },
      { Key: "Generated", Value: new Date().toISOString() },
    ];
    const metadataWs = XLSX.utils.json_to_sheet(metadata);
    XLSX.utils.book_append_sheet(wb, metadataWs, "Metadata");

    XLSX.writeFile(
      wb,
      `datasets_${selectedDataset}_${viewType}_${Array.from(
        selectedPopulations
      ).join("-")}.xlsx`
    );
  };

  // Download CSV
  const handleDownloadCSV = () => {
    if (pivotTableData.length === 0) return;

    // Use pivot table data where each population is a column
    const headers = Object.keys(pivotTableData[0]);
    const rows = [
      headers.join(","),
      ...pivotTableData.map((row) =>
        headers
          .map((h) => {
            const value = row[h as keyof typeof row];
            // Format numbers appropriately, keep strings as-is
            if (typeof value === "number") {
              return value.toFixed(6);
            }
            return JSON.stringify(value);
          })
          .join(",")
      ),
    ];

    const csvContent = rows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `datasets_${selectedDataset}_${viewType}_${Array.from(
      selectedPopulations
    ).join("-")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Download JSON
  const handleDownloadJSON = () => {
    if (tableData.length === 0) return;

    const exportData = {
      dataset: currentDataset?.name || "",
      datasetId: selectedDataset,
      technology: currentDataset?.technology || "",
      populations: Array.from(selectedPopulations),
      dataType: viewType,
      generated: new Date().toISOString(),
      data: tableData,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `datasets_${selectedDataset}_${viewType}_${Array.from(
      selectedPopulations
    ).join("-")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const canGenerateTable =
    dataType && selectedDataset && selectedPopulations.size > 0;

  // Dataset-to-translation mapping
  type TranslationType = (typeof translations)[typeof language];
  const datasetI18nMap = {
    popstrCE: (t: TranslationType) => t.globalFrequencies.datasets.popstrCE,
    g1k: (t: TranslationType) => t.globalFrequencies.datasets.g1k,
    rao: (t: TranslationType) => t.globalFrequencies.datasets.rao,
  } as const;

  // Normalize dataset ID to translation key
  const normalizeDatasetId = (
    datasetId: DatasetId
  ): keyof typeof datasetI18nMap | null => {
    if (datasetId === "CE") return "popstrCE";
    if (datasetId === "1000G") return "g1k";
    if (datasetId === "RAO") return "rao";
    return null;
  };

  // Get dataset information from translations
  const getDatasetInfo = () => {
    if (!selectedDataset) return null;
    const datasetKey = normalizeDatasetId(selectedDataset);
    if (!datasetKey) return null;

    const t = translations[language];
    const getDatasetNode = datasetI18nMap[datasetKey];
    const datasetInfo = getDatasetNode(t);

    return (
      (datasetInfo as
        | {
            name?: string;
            source?: string;
            keyNotes?: Record<string, string>;
            populationGroups?: string;
            comparability?: string;
          }
        | undefined) || null
    );
  };

  const datasetInfo = getDatasetInfo();

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t("datasets.title")}
          </h1>
          <p className="text-base text-muted-foreground mb-3">
            {t("datasets.description")}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-2">
            {t("datasets.description2")}
          </p>
          <p className="text-sm text-muted-foreground max-w-4xl leading-relaxed">
            {t("datasets.description3")}
          </p>
        </div>

        {/* Selection Controls */}
        <Card className="mb-6 border rounded-md shadow-none bg-card">
          <CardHeader className="pb-3 px-4">
            <CardTitle className="text-sm font-semibold text-foreground">
              {t("datasets.selectCriteria")}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 space-y-4">
            {/* Data Type Selection */}
            <div className="flex items-center gap-3">
              <Label className="text-sm font-medium whitespace-nowrap">
                {t("datasets.dataType")}:
              </Label>
              <Select
                value={dataType}
                onValueChange={(value) => setDataType(value as DataType)}
              >
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder={t("datasets.selectDataType")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CE">CE</SelectItem>
                  <SelectItem value="NGS">NGS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Dataset Selection */}
            {dataType && (
              <div className="flex items-center gap-3">
                <Label className="text-sm font-medium whitespace-nowrap">
                  {t("datasets.selectDataset")}:
                </Label>
                <Select
                  value={selectedDataset}
                  onValueChange={(value) =>
                    setSelectedDataset(value as DatasetId)
                  }
                >
                  <SelectTrigger className="w-full md:w-[300px]">
                    <SelectValue placeholder={t("datasets.selectDataset")} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDatasets.map((ds) => (
                      <SelectItem key={ds.id} value={ds.id}>
                        {ds.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {currentDataset && datasetInfo && (
                  <Dialog
                    open={datasetInfoDialogOpen}
                    onOpenChange={setDatasetInfoDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-xs">
                        {t("datasets.viewDatasetInformation")}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <div className="flex items-center gap-2">
                          <Info className="h-4 w-4 text-muted-foreground" />
                          <DialogTitle className="text-sm font-semibold text-foreground">
                            {t("datasets.datasetInfo")}
                          </DialogTitle>
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {currentDataset.technology}
                          </Badge>
                        </div>
                      </DialogHeader>
                      <div className="space-y-3 text-sm">
                        {/* Dataset Name */}
                        {datasetInfo.name && (
                          <div>
                            <h4 className="text-sm font-semibold text-foreground mb-1">
                              {t("datasets.datasetName")}
                            </h4>
                            <p className="text-muted-foreground">
                              {datasetInfo.name}
                            </p>
                          </div>
                        )}

                        {/* Short Description */}
                        {datasetInfo.source && (
                          <div>
                            <h4 className="text-sm font-semibold text-foreground mb-1">
                              {t("datasets.shortDescription")}
                            </h4>
                            <p className="text-muted-foreground">
                              {datasetInfo.source}
                            </p>
                          </div>
                        )}

                        {/* Key Notes */}
                        {datasetInfo.keyNotes &&
                          Object.keys(datasetInfo.keyNotes).length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-foreground mb-1">
                                {t("globalFrequencies.keyNotes")}
                              </h4>
                              <div className="space-y-2">
                                {Object.keys(datasetInfo.keyNotes)
                                  .sort((a, b) => Number(a) - Number(b))
                                  .map((key) => (
                                    <p
                                      key={key}
                                      className="text-muted-foreground"
                                    >
                                      {datasetInfo.keyNotes![key]}
                                    </p>
                                  ))}
                              </div>
                            </div>
                          )}

                        {/* Population groups included */}
                        {"populationGroups" in datasetInfo &&
                          datasetInfo.populationGroups && (
                            <div>
                              <h4 className="text-sm font-semibold text-foreground mb-1">
                                {t(
                                  "globalFrequencies.populationGroupsIncluded"
                                )}
                              </h4>
                              <p className="text-muted-foreground whitespace-pre-line">
                                {datasetInfo.populationGroups}
                              </p>
                            </div>
                          )}

                        {/* Comparability note */}
                        {datasetInfo.comparability && (
                          <div>
                            <h4 className="text-sm font-semibold text-foreground mb-1">
                              {t("globalFrequencies.comparability")}
                            </h4>
                            <p className="text-muted-foreground">
                              {datasetInfo.comparability}
                            </p>
                          </div>
                        )}

                        {/* Publication URL (if available from dataset config) */}
                        {currentDataset.publicationUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="text-xs"
                          >
                            <a
                              href={currentDataset.publicationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-3 w-3 mr-2" />
                              {t("datasets.viewPublication")}
                            </a>
                          </Button>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            )}

            {/* Population Selection */}
            {currentDataset && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">
                    {t("datasets.selectPopulations")}:
                  </Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={selectAllPopulations}
                      className="text-xs h-7"
                    >
                      {t("datasets.selectAll")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearAllPopulations}
                      className="text-xs h-7"
                    >
                      {t("datasets.clear")}
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
                    {t("datasets.noPopulationsSelected")}
                  </p>
                )}
              </div>
            )}

            {/* Generate Table Button */}
            {canGenerateTable && (
              <div className="pt-2">
                <Button
                  onClick={handleGenerateTable}
                  className="w-full md:w-auto"
                >
                  {t("datasets.generateTable")}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Table Output */}
        {tableGenerated && canGenerateTable && (
          <>
            {/* View Type Toggle */}
            {hasGenotypeData && (
              <div className="mb-4">
                <Tabs
                  value={viewType}
                  onValueChange={(value) =>
                    setViewType(value as "frequencies" | "genotypes")
                  }
                >
                  <TabsList>
                    <TabsTrigger value="frequencies">
                      {t("datasets.frequencies")}
                    </TabsTrigger>
                    <TabsTrigger value="genotypes">
                      {t("datasets.genotypes")}
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            )}

            {!hasGenotypeData && viewType === "genotypes" && (
              <Card className="mb-6 border rounded-md shadow-none bg-card">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">
                    {t("datasets.genotypeDataNotAvailable")}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Download Buttons */}
            {tableData.length > 0 && (
              <div className="flex gap-2 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadExcel}
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  {t("datasets.downloadExcel")}
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownloadCSV}>
                  <FileText className="h-4 w-4 mr-2" />
                  {t("datasets.downloadCSV")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadJSON}
                >
                  <FileJson className="h-4 w-4 mr-2" />
                  {t("datasets.downloadJSON")}
                </Button>
              </div>
            )}

            {/* Filters */}
            {tableData.length > 0 && (
              <Card className="mb-4 border rounded-md shadow-none bg-card">
                <CardContent className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <Label className="text-xs font-medium text-muted-foreground">
                      Filters:
                    </Label>

                    {/* Locus Filter */}
                    <Popover
                      open={locusPopoverOpen}
                      onOpenChange={setLocusPopoverOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          role="combobox"
                          className="w-[200px] justify-between text-xs h-8"
                        >
                          {locusFilter && locusFilter !== "all"
                            ? locusFilter
                            : "All loci"}
                          <Search className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0" align="start">
                        <Command>
                          <CommandInput
                            placeholder="Search loci..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>No loci found.</CommandEmpty>
                            <CommandGroup>
                              <CommandItem
                                value="all"
                                onSelect={() => {
                                  setLocusFilter("");
                                  setLocusPopoverOpen(false);
                                }}
                              >
                                All loci
                              </CommandItem>
                              {uniqueLoci.map((locus) => (
                                <CommandItem
                                  key={locus}
                                  value={locus}
                                  onSelect={() => {
                                    setLocusFilter(locus);
                                    setLocusPopoverOpen(false);
                                  }}
                                >
                                  {locus}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    {/* Allele Filter */}
                    <div className="flex items-center gap-2">
                      <Input
                        type="text"
                        placeholder="Allele (exact match)"
                        value={alleleFilter}
                        onChange={(e) => setAlleleFilter(e.target.value)}
                        className="w-[150px] h-8 text-xs"
                      />
                    </div>

                    {/* Clear Filters */}
                    {(locusFilter || alleleFilter) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="h-8 text-xs"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Clear filters
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pivot Table */}
            {pivotTableData.length > 0 ? (
              <div className="mb-6">
                <div className="relative w-full overflow-x-auto overflow-y-auto max-h-[70vh] rounded-md border border-border">
                  <table
                    className="table-fixed caption-bottom text-sm"
                    style={{
                      width: "100%",
                      minWidth: `max(100%, ${
                        340 + 150 * selectedPopulations.size
                      }px)`,
                    }}
                  >
                    <colgroup>
                      <col style={{ width: "200px" }} />
                      <col style={{ width: "140px" }} />
                      {Array.from(selectedPopulations)
                        .sort()
                        .map((_, idx) => {
                          // Calculate equal width for population columns
                          // Distribute remaining space equally among all population columns
                          const popCount = selectedPopulations.size;
                          const totalFixedWidth = 340; // 200px (locus) + 140px (allele)
                          // Calculate width: remaining space divided by number of populations
                          // This ensures columns stretch to fill available space when few
                          // minWidth on table ensures horizontal scroll when many columns
                          const popWidth = `calc((100% - ${totalFixedWidth}px) / ${popCount})`;
                          return (
                            <col
                              key={idx}
                              style={{
                                width: popWidth,
                              }}
                            />
                          );
                        })}
                    </colgroup>
                    <TableHeader>
                      <TableRow className="border-b">
                        <TableHead className="text-xs font-semibold text-foreground bg-muted sticky top-0 left-0 z-30 border-r shadow-[2px_0_4px_rgba(0,0,0,0.05)] shadow-sm py-3">
                          {t("datasets.locus")}
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-foreground bg-muted sticky top-0 left-[200px] z-30 border-r shadow-[2px_0_4px_rgba(0,0,0,0.05)] shadow-sm text-center py-3">
                          {viewType === "frequencies"
                            ? t("datasets.allele")
                            : t("datasets.genotype")}
                        </TableHead>
                        {Array.from(selectedPopulations)
                          .sort()
                          .map((pop) => (
                            <TableHead
                              key={pop}
                              className="text-xs font-semibold text-foreground text-center bg-muted sticky top-0 z-30 shadow-sm py-3"
                            >
                              {pop}
                            </TableHead>
                          ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pivotTableData.map((row, idx) => (
                        <TableRow
                          key={idx}
                          className="border-b bg-white hover:bg-gray-50"
                        >
                          <TableCell className="text-xs font-mono text-foreground bg-white sticky left-0 z-20 border-r shadow-[2px_0_4px_rgba(0,0,0,0.05)]">
                            {row.locus}
                          </TableCell>
                          <TableCell className="text-xs font-mono text-foreground bg-white sticky left-[200px] z-20 border-r shadow-[2px_0_4px_rgba(0,0,0,0.05)] text-center">
                            {row.allele}
                          </TableCell>
                          {Array.from(selectedPopulations)
                            .sort()
                            .map((pop) => {
                              const value = row[pop];
                              return (
                                <TableCell
                                  key={pop}
                                  className="text-xs text-center text-foreground bg-white"
                                >
                                  {typeof value === "number"
                                    ? value.toFixed(6)
                                    : value}
                                </TableCell>
                              );
                            })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </table>
                </div>
              </div>
            ) : filteredTableData.length === 0 && tableData.length > 0 ? (
              <Card className="mb-6 border rounded-md shadow-none bg-card">
                <CardContent className="p-8 text-center">
                  <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">
                    No data matches the selected filters.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="mb-6 border rounded-md shadow-none bg-card">
                <CardContent className="p-8 text-center">
                  <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">
                    {t("datasets.noDataAvailable")}
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Empty State */}
        {!tableGenerated && (
          <Card className="border rounded-md shadow-none bg-card">
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">
                {t("datasets.selectCriteria")}
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

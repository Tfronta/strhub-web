"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Database, BarChart3, FileText, ExternalLink, Info, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { markerData } from "./markerData"
import { useLanguage } from "@/contexts/language-context"

export default function MarkerPage({ params }: { params: { id: string } }) {
  const { t } = useLanguage()
  const [selectedPopulation, setSelectedPopulation] = useState<string>("AFR")
  const [xstrFrequencies, setXstrFrequencies] = useState<any>(null)

  const markerId = params.id.toLowerCase()
  const marker = markerData[markerId as keyof typeof markerData]

  useEffect(() => {
    if (marker && (marker.type === "X-STR" || marker.chromosome === "X")) {
      fetch("/data/xstr_frequencies.json")
        .then((res) => res.json())
        .then((data) => {
          setXstrFrequencies(data[markerId])
          setSelectedPopulation("BRA")
        })
        .catch((err) => console.error("[v0] Failed to load X-STR frequencies:", err))
    }
  }, [markerId, marker])

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

        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">{t("common.notFound")}</h1>
            <p className="text-muted-foreground mb-4">The marker "{params.id}" was not found in our database.</p>
            <Link href="/catalog" className="text-primary hover:underline">
              {t("nav.catalog")}
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const isXSTR = marker.type === "X-STR" || marker.chromosome === "X"

  let chartData: any[] = []
  let citationUrl = ""
  let citationText = ""

  if (isXSTR && xstrFrequencies) {
    const popData = xstrFrequencies.populations?.[selectedPopulation]
    if (popData?.alleles) {
      chartData = Object.entries(popData.alleles)
        .map(([allele, frequency]) => ({
          allele,
          frequency: frequency as number,
          count: 0,
        }))
        .sort((a, b) => {
          const alleleA = Number.parseFloat(a.allele)
          const alleleB = Number.parseFloat(b.allele)
          if (!isNaN(alleleA) && !isNaN(alleleB)) {
            return alleleA - alleleB
          }
          return a.allele.localeCompare(b.allele, undefined, { numeric: true })
        })
    }
    citationUrl = popData?.url || ""

    if (selectedPopulation === "BRA") {
      citationText = "Nascimento et al., Forensic Science International: Genetics 66 (2023) 102704"
    } else if (selectedPopulation === "IBER") {
      citationText = "Freire-Aradas et al., Forensic Science International: Genetics 17 (2015) 110–120"
    } else if (selectedPopulation === "NOR") {
      citationText = "Bergseth et al., Forensic Science International: Genetics 59 (2022) 102685"
    } else if (selectedPopulation === "BOS_HER") {
      citationText = "PubMed ID 40253804"
    }
  } else {
    const populationData =
      marker?.populationFrequencies?.[selectedPopulation as keyof typeof marker.populationFrequencies] || []
    chartData = populationData.map((item) => ({
      allele: item.allele,
      frequency: item.frequency,
      count: item.count,
    }))
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/catalog" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            {t("marker.backToCatalog")}
          </Link>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-4xl font-bold">{marker.name}</h1>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              {marker.category}
            </Badge>
          </div>
          <p className="text-xl text-foreground mb-2">{marker.fullName}</p>
          <p className="text-base text-muted-foreground leading-relaxed">{marker.description}</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">{t("marker.tabs.overview")}</TabsTrigger>
            <TabsTrigger value="frequencies">{t("marker.tabs.frequencies")}</TabsTrigger>
            <TabsTrigger value="variants">{t("marker.variantAlleles")}</TabsTrigger>
            <TabsTrigger value="tools">{t("marker.tabs.tools")}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Info className="h-5 w-5" />
                    {t("marker.basicInfo")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-muted-foreground">{t("marker.chromosome")}</Label>
                      <p className="text-base font-semibold">{marker.chromosome}</p>
                    </div>
                    {marker.cytogeneticLocation && (
                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-muted-foreground">Cytogenetic Location</Label>
                        <p className="text-base font-semibold">{marker.cytogeneticLocation}</p>
                      </div>
                    )}
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-muted-foreground">{t("marker.motif")}</Label>
                      <p className="text-base font-semibold font-mono">[{marker.motif}]n</p>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-muted-foreground">{t("marker.type")}</Label>
                      <p className="text-base font-semibold">{marker.type}</p>
                    </div>
                    {marker.alternativeMotifs && marker.alternativeMotifs.length > 0 && (
                      <div className="col-span-2 space-y-1.5">
                        <Label className="text-sm font-medium text-muted-foreground">Alternative Motifs</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {marker.alternativeMotifs.map((motif, index) => (
                            <Badge key={index} variant="outline" className="font-mono text-sm px-2.5 py-1">
                              [{motif}]n
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-muted-foreground">{t("marker.alleleRange")}</Label>
                      <p className="text-base font-semibold">{marker.alleles}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Database className="h-5 w-5" />
                    {t("marker.genomicCoords")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  {marker.coordinates ? (
                    <div className="space-y-5">
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-foreground">GRCh38/hg38</h4>
                        <div className="space-y-3">
                          <div className="space-y-1.5">
                            <Label className="text-sm font-medium text-muted-foreground">{t("marker.position")}</Label>
                            <p className="text-base font-semibold font-mono break-all">{marker.position}</p>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-sm font-medium text-muted-foreground">{t("marker.strand")}</Label>
                            <p className="text-base font-semibold">{marker.coordinates.strand}</p>
                          </div>
                        </div>
                      </div>

                      {marker.coordinates["grch37"]?.start && (
                        <div className="pt-4 border-t space-y-3">
                          <h4 className="text-sm font-semibold text-foreground">GRCh37/hg19</h4>
                          <div className="space-y-3">
                            <div className="space-y-1.5">
                              <Label className="text-sm font-medium text-muted-foreground">
                                {t("marker.position")}
                              </Label>
                              <p className="text-base font-semibold font-mono break-all">
                                {marker.coordinates.grch37.start.toLocaleString()}-
                                {marker.coordinates.grch37.end.toLocaleString()}
                              </p>
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-sm font-medium text-muted-foreground">{t("marker.strand")}</Label>
                              <p className="text-base font-semibold">{marker.coordinates.strand}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">{t("common.notFound")}</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {marker.nistReference && (
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">{t("marker.nistReference")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-muted-foreground">{t("marker.referenceAllele")}</Label>
                      <p className="text-base font-semibold">{marker.nistReference.referenceAllele}</p>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-muted-foreground">{t("marker.lastUpdated")}</Label>
                      <p className="text-base font-semibold">{marker.nistReference.lastUpdated}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">{t("marker.commonAlleles")}</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {marker.nistReference.commonAlleles.map((allele) => (
                        <Badge key={allele} variant="outline" className="text-sm px-2.5 py-1">
                          {allele}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="frequencies" className="space-y-6">
            {marker.type === "Y-STR" || marker.chromosome === "Y" ? (
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Info className="h-5 w-5" />
                    {t("marker.ystrFrequenciesTitle")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-4 text-base leading-relaxed">
                    <p className="text-foreground">{t("marker.ystrFrequenciesDescription")}</p>
                    <p className="text-foreground">{t("marker.ystrYhrdInfo")}</p>
                    <p className="text-foreground">{t("marker.ystrExploreData")}</p>
                    <div className="flex items-center gap-2 py-2">
                      <Button variant="outline" size="default" asChild>
                        <a
                          href={marker.yhrdUrl || "https://yhrd.org/pages/resources/national_databases"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          {t("marker.ystrVisitYhrd")}
                        </a>
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground italic pt-2">{t("marker.ystrDisclaimer")}</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <BarChart3 className="h-5 w-5" />
                    {t("marker.alleleFreqDistribution")}
                  </CardTitle>
                  <CardDescription className="text-sm mt-1.5">{t("marker.populationGroup")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex gap-2 flex-wrap">
                      {isXSTR ? (
                        <>
                          {["BRA", "IBER", "NOR", "BOS_HER"].map((pop) => (
                            <Button
                              key={pop}
                              variant={selectedPopulation === pop ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedPopulation(pop)}
                              className="min-w-[60px]"
                            >
                              {t(`marker.xstrPopulations.${pop}` as any)}
                            </Button>
                          ))}
                        </>
                      ) : (
                        <>
                          {["AFR", "AMR", "EAS", "SAS", "EUR"].map((pop) => (
                            <Button
                              key={pop}
                              variant={selectedPopulation === pop ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedPopulation(pop)}
                              className="min-w-[60px]"
                            >
                              {pop}
                            </Button>
                          ))}
                        </>
                      )}
                    </div>

                    {chartData.length > 0 ? (
                      <>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="allele" />
                              <YAxis />
                              <Tooltip
                                formatter={(value: any, name: string) => [
                                  value,
                                  name === "frequency" ? t("common.frequency") : t("common.count"),
                                ]}
                              />
                              <Bar dataKey="frequency" fill="#6b7280" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>

                        {isXSTR && citationUrl && citationText && (
                          <div className="pt-2 pb-2 text-sm text-muted-foreground">
                            {t("marker.source")}:{" "}
                            <a
                              href={citationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline inline-flex items-center gap-1"
                            >
                              {citationText}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        )}

                        <div className="mt-6 space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">{t("marker.freqDescription")}</h3>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const csvContent = [
                                  [t("common.allele"), t("common.frequency")],
                                  ...chartData.map((item) => [item.allele, item.frequency.toString()]),
                                ]
                                  .map((row) => row.join(","))
                                  .join("\n")

                                const blob = new Blob([csvContent], { type: "text/csv" })
                                const url = window.URL.createObjectURL(blob)
                                const a = document.createElement("a")
                                a.href = url
                                a.download = `${marker.name}_${selectedPopulation}_frequencies.csv`
                                document.body.appendChild(a)
                                a.click()
                                document.body.removeChild(a)
                                window.URL.revokeObjectURL(url)
                              }}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download CSV
                            </Button>
                          </div>

                          <div className="border rounded-lg overflow-hidden">
                            <div className="max-h-64 overflow-y-auto">
                              <table className="w-full">
                                <thead className="bg-muted/50 sticky top-0">
                                  <tr>
                                    <th className="text-left px-4 py-3 font-semibold text-sm">{t("common.allele")}</th>
                                    <th className="text-left px-4 py-3 font-semibold text-sm">
                                      {t("common.frequency")}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {chartData
                                    .filter((item) => item.frequency > 0)
                                    .map((item, index) => (
                                      <tr
                                        key={item.allele}
                                        className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}
                                      >
                                        <td className="px-4 py-3 font-mono text-sm">{item.allele}</td>
                                        <td className="px-4 py-3 text-sm">{item.frequency.toFixed(4)}</td>
                                      </tr>
                                    ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">{t("common.notFound")}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="variants" className="space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Database className="h-5 w-5" />
                  {t("marker.variantAlleles")}
                </CardTitle>
                <CardDescription className="text-sm mt-1.5">{t("marker.variantAllelesDescription")}</CardDescription>
              </CardHeader>
              <CardContent>
                {marker.sequences && marker.sequences.length > 0 ? (
                  <div className="space-y-6">
                    <div className="border rounded-lg overflow-hidden">
                      <div className="max-h-96 overflow-y-auto">
                        <table className="w-full">
                          <thead className="bg-background sticky top-0 border-b shadow-sm">
                            <tr>
                              <th className="text-left px-4 py-3 font-semibold text-sm bg-background">
                                {t("marker.alleleDesignation")}
                              </th>
                              <th className="text-left px-4 py-3 font-semibold text-sm bg-background">
                                {t("marker.strNaming")}
                              </th>
                              <th className="text-left px-4 py-3 font-semibold text-sm bg-background">
                                {t("marker.sequence")}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {marker.sequences.map((seq, index) => (
                              <tr
                                key={`${seq.allele}-${index}`}
                                className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}
                              >
                                <td className="px-4 py-3 font-mono font-semibold text-sm">{seq.allele}</td>
                                <td className="px-4 py-3 text-sm">{seq.pattern || "—"}</td>
                                <td className="px-4 py-3">
                                  <div className="font-mono text-xs break-all leading-relaxed">{seq.sequence}</div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-3 pt-2">
                      <Button
                        variant="default"
                        onClick={() => {
                          const csvContent = [
                            [t("marker.alleleDesignation"), t("marker.strNaming"), t("marker.sequence")],
                            ...marker.sequences.map((seq) => [seq.allele, seq.pattern || "", seq.sequence]),
                          ]
                            .map((row) => row.map((cell) => `"${cell}"`).join(","))
                            .join("\n")

                          const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
                          const url = window.URL.createObjectURL(blob)
                          const a = document.createElement("a")
                          a.href = url
                          a.download = `${marker.name}_variant_alleles.csv`
                          document.body.appendChild(a)
                          a.click()
                          document.body.removeChild(a)
                          window.URL.revokeObjectURL(url)
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {t("marker.download")}
                      </Button>

                      <p className="text-sm text-muted-foreground">
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
                  <p className="text-muted-foreground text-center py-8">{t("common.notFound")}</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">{t("marker.toolsCompatibility")}</CardTitle>
                <CardDescription className="text-sm mt-1.5">{t("marker.toolsDescription")}</CardDescription>
              </CardHeader>
              <CardContent>
                {marker.toolsCompatibility && Object.keys(marker.toolsCompatibility).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(marker.toolsCompatibility).map(([toolKey, tool]) => (
                      <div key={toolKey} className="border rounded-lg p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-base">{tool.name}</h3>
                          <Badge variant="outline" className="text-sm">
                            {t("marker.supported")}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{tool.description}</p>
                        <div className="flex gap-2 pt-1">
                          {tool.github && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={tool.github} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                GitHub
                              </a>
                            </Button>
                          )}
                          {tool.publication && (
                            <Button variant="outline" size="sm" asChild>
                              <a
                                href={`https://doi.org/${tool.publication.doi}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                {t("marker.originalPublication")}
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">{t("common.notFound")}</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

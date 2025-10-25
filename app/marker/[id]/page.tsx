"use client"

import { useState } from "react"
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

  const markerId = params.id.toLowerCase()
  const marker = markerData[markerId as keyof typeof markerData]

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

  const populationData =
    marker?.populationFrequencies?.[selectedPopulation as keyof typeof marker.populationFrequencies] || []
  const chartData = populationData.map((item) => ({
    allele: item.allele,
    frequency: item.frequency,
    count: item.count,
  }))

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
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl font-bold">{marker.name}</h1>
            <Badge variant="secondary">{marker.category}</Badge>
          </div>
          <p className="text-lg text-muted-foreground mb-2">{marker.fullName}</p>
          <p className="text-muted-foreground">{marker.description}</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">{t("marker.tabs.overview")}</TabsTrigger>
            <TabsTrigger value="frequencies">{t("marker.tabs.frequencies")}</TabsTrigger>
            <TabsTrigger value="variants">{t("marker.variantAlleles")}</TabsTrigger>
            <TabsTrigger value="tools">{t("marker.tabs.tools")}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    {t("marker.basicInfo")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">{t("marker.chromosome")}</Label>
                      <p className="font-medium">{marker.chromosome}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">{t("marker.motif")}</Label>
                      <p className="font-medium font-mono">{marker.motif}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">{t("marker.type")}</Label>
                      <p className="font-medium">{marker.type}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">{t("marker.alleleRange")}</Label>
                      <p className="font-medium">{marker.alleles}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    {t("marker.genomicCoords")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {marker.coordinates ? (
                    <div className="space-y-2">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">{t("marker.build")}</Label>
                        <p className="font-medium">{marker.coordinates.build}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">{t("marker.position")}</Label>
                        <p className="font-medium font-mono">{marker.position}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">{t("marker.strand")}</Label>
                        <p className="font-medium">{marker.coordinates.strand}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">{t("common.notFound")}</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {marker.nistReference && (
              <Card>
                <CardHeader>
                  <CardTitle>{t("marker.nistReference")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">{t("marker.referenceAllele")}</Label>
                      <p className="font-medium">{marker.nistReference.referenceAllele}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">{t("marker.lastUpdated")}</Label>
                      <p className="font-medium">{marker.nistReference.lastUpdated}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">{t("marker.commonAlleles")}</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {marker.nistReference.commonAlleles.map((allele) => (
                        <Badge key={allele} variant="outline" className="text-xs">
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  {t("marker.alleleFreqDistribution")}
                </CardTitle>
                <CardDescription>{t("marker.populationGroup")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    {["AFR", "AMR", "EAS", "SAS", "EUR"].map((pop) => (
                      <Button
                        key={pop}
                        variant={selectedPopulation === pop ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedPopulation(pop)}
                      >
                        {pop}
                      </Button>
                    ))}
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

                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-4">
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
                                  <th className="text-left p-3 font-medium">{t("common.allele")}</th>
                                  <th className="text-left p-3 font-medium">{t("common.frequency")}</th>
                                </tr>
                              </thead>
                              <tbody>
                                {chartData
                                  .filter((item) => item.frequency > 0)
                                  .sort((a, b) => {
                                    // Handle numeric sorting for alleles (including decimals)
                                    const alleleA = Number.parseFloat(a.allele)
                                    const alleleB = Number.parseFloat(b.allele)

                                    // If both are valid numbers, sort numerically
                                    if (!isNaN(alleleA) && !isNaN(alleleB)) {
                                      return alleleA - alleleB
                                    }

                                    // If one or both are not numbers, fall back to string comparison
                                    return a.allele.localeCompare(b.allele, undefined, { numeric: true })
                                  })
                                  .map((item, index) => (
                                    <tr key={item.allele} className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                                      <td className="p-3 font-mono">{item.allele}</td>
                                      <td className="p-3">{item.frequency.toFixed(4)}</td>
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
          </TabsContent>

          <TabsContent value="variants" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  {t("marker.variantAlleles")}
                </CardTitle>
                <CardDescription>{t("marker.variantAllelesDescription")}</CardDescription>
              </CardHeader>
              <CardContent>
                {marker.sequences && marker.sequences.length > 0 ? (
                  <div className="space-y-4">
                    <div className="border rounded-lg overflow-hidden">
                      <div className="max-h-96 overflow-y-auto">
                        <table className="w-full">
                          <thead className="bg-background sticky top-0 border-b shadow-sm">
                            <tr>
                              <th className="text-left p-3 font-medium bg-background">
                                {t("marker.alleleDesignation")}
                              </th>
                              <th className="text-left p-3 font-medium bg-background">{t("marker.strNaming")}</th>
                              <th className="text-left p-3 font-medium bg-background">{t("marker.sequence")}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {marker.sequences.map((seq, index) => (
                              <tr
                                key={`${seq.allele}-${index}`}
                                className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}
                              >
                                <td className="p-3 font-mono font-semibold">{seq.allele}</td>
                                <td className="p-3 text-sm">{seq.pattern || "—"}</td>
                                <td className="p-3">
                                  <div className="font-mono text-xs break-all">{seq.sequence}</div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-3">
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
              <CardHeader>
                <CardTitle>{t("marker.toolsCompatibility")}</CardTitle>
                <CardDescription>{t("marker.toolsDescription")}</CardDescription>
              </CardHeader>
              <CardContent>
                {marker.toolsCompatibility && Object.keys(marker.toolsCompatibility).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(marker.toolsCompatibility).map(([toolKey, tool]) => (
                      <div key={toolKey} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{tool.name}</h3>
                          <Badge variant="outline">{t("marker.supported")}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{tool.description}</p>
                        <div className="flex gap-2">
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

"use client"

import { useState } from "react"
import { Eye, Play, Settings, ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import Link from "next/link"

export default function IgvViewerPage() {
  const [selectedMarker, setSelectedMarker] = useState("")
  const [selectedBuild, setSelectedBuild] = useState("hg38")
  const [igvLoaded, setIgvLoaded] = useState(false)

  const markers = [
    { id: "csf1po", name: "CSF1PO", chromosome: "5", position: "150073000-150074000" },
    { id: "d10s1248", name: "D10S1248", chromosome: "10", position: "131389200-131390200" },
    { id: "d12s391", name: "D12S391", chromosome: "12", position: "12462000-12463000" },
    { id: "d13s317", name: "D13S317", chromosome: "13", position: "82722000-82723000" },
    { id: "d16s539", name: "D16S539", chromosome: "16", position: "86386000-86387000" },
    { id: "d18s51", name: "D18S51", chromosome: "18", position: "60948000-60949000" },
    { id: "d19s433", name: "D19S433", chromosome: "19", position: "30417000-30418000" },
    { id: "d1s1656", name: "D1S1656", chromosome: "1", position: "230905000-230906000" },
    { id: "d21s11", name: "D21S11", chromosome: "21", position: "27333000-27334000" },
    { id: "d2s1338", name: "D2S1338", chromosome: "2", position: "218705000-218706000" },
    { id: "d2s441", name: "D2S441", chromosome: "2", position: "68231000-68232000" },
    { id: "d3s1358", name: "D3S1358", chromosome: "3", position: "45582000-45583000" },
    { id: "d5s818", name: "D5S818", chromosome: "5", position: "123139000-123140000" },
    { id: "d7s820", name: "D7S820", chromosome: "7", position: "83789000-83790000" },
    { id: "d8s1179", name: "D8S1179", chromosome: "8", position: "125907000-125908000" },
    { id: "fga", name: "FGA", chromosome: "4", position: "155508000-155509000" },
    { id: "th01", name: "TH01", chromosome: "11", position: "2192000-2193000" },
    { id: "tpox", name: "TPOX", chromosome: "2", position: "1493000-1494000" },
    { id: "vwa", name: "vWA", chromosome: "12", position: "6093000-6094000" },
  ]

  const launchIGV = () => {
    if (!selectedMarker) return

    const marker = markers.find((m) => m.id === selectedMarker)
    if (!marker) return

    // In a real implementation, this would initialize IGV.js
    setIgvLoaded(true)
  }

  const openInUCSC = () => {
    if (!selectedMarker) return

    const marker = markers.find((m) => m.id === selectedMarker)
    if (!marker) return

    const [start, end] = marker.position.split("-")
    const ucscUrl = `https://genome.ucsc.edu/cgi-bin/hgTracks?db=${selectedBuild}&position=chr${marker.chromosome}:${start}-${end}`
    window.open(ucscUrl, "_blank")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Eye className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              IGV Viewer
            </h1>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
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
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">IGV Viewer</h1>
            <p className="text-xl text-muted-foreground">
              One-click integration with IGV for genomic visualization and analysis.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Configuration Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Viewer Configuration
                </CardTitle>
                <CardDescription>Configure the IGV viewer settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="marker-select">STR Marker</Label>
                  <Select value={selectedMarker} onValueChange={setSelectedMarker}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a marker" />
                    </SelectTrigger>
                    <SelectContent>
                      {markers.map((marker) => (
                        <SelectItem key={marker.id} value={marker.id}>
                          {marker.name} (Chr {marker.chromosome})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="genome-build">Genome Build</Label>
                  <Select value={selectedBuild} onValueChange={setSelectedBuild}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hg38">hg38 (GRCh38)</SelectItem>
                      <SelectItem value="hg19">hg19 (GRCh37)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selectedMarker && (
                  <div className="space-y-2">
                    <Label>Marker Information</Label>
                    <div className="p-3 bg-muted rounded-lg space-y-2">
                      {(() => {
                        const marker = markers.find((m) => m.id === selectedMarker)
                        return marker ? (
                          <>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">Name:</span>
                              <Badge variant="outline">{marker.name}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">Chromosome:</span>
                              <span className="text-sm">{marker.chromosome}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">Position:</span>
                              <span className="text-sm font-mono">{marker.position}</span>
                            </div>
                          </>
                        ) : null
                      })()}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Button onClick={launchIGV} className="w-full" disabled={!selectedMarker}>
                    <Play className="h-4 w-4 mr-2" />
                    Launch IGV Viewer
                  </Button>

                  <Button
                    onClick={openInUCSC}
                    variant="outline"
                    className="w-full bg-transparent"
                    disabled={!selectedMarker}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in UCSC Browser
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* IGV Viewer Panel */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Interactive Genome Viewer</CardTitle>
                  <CardDescription>IGV.js integration for genomic visualization</CardDescription>
                </CardHeader>
                <CardContent>
                  {igvLoaded && selectedMarker ? (
                    <div className="border rounded-lg p-4 bg-muted/30 min-h-[400px] flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <Eye className="h-16 w-16 mx-auto text-muted-foreground" />
                        <div>
                          <h3 className="text-lg font-semibold">IGV Viewer Loading...</h3>
                          <p className="text-muted-foreground">
                            Interactive genome browser will load here showing the{" "}
                            {markers.find((m) => m.id === selectedMarker)?.name} locus
                          </p>
                        </div>
                        <Badge variant="secondary">
                          Chr {markers.find((m) => m.id === selectedMarker)?.chromosome}:{" "}
                          {markers.find((m) => m.id === selectedMarker)?.position}
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground min-h-[400px] flex items-center justify-center">
                      <div className="space-y-4">
                        <Eye className="h-16 w-16 mx-auto opacity-50" />
                        <div>
                          <h3 className="text-lg font-semibold">Select a marker to begin</h3>
                          <p>Choose an STR marker and click "Launch IGV Viewer" to start visualization</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Information Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>About IGV Integration</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none dark:prose-invert">
              <p>
                The IGV (Integrative Genomics Viewer) integration provides interactive genomic visualization for STR
                markers. This tool allows you to explore genomic context, view reference sequences, and analyze
                structural features around STR loci.
              </p>
              <h4>Features:</h4>
              <ul>
                <li>Interactive genomic visualization using IGV.js</li>
                <li>Support for multiple genome builds (hg38, hg19)</li>
                <li>Direct navigation to STR marker positions</li>
                <li>Integration with UCSC Genome Browser</li>
                <li>Customizable viewing regions and zoom levels</li>
              </ul>
              <h4>Supported Data Types:</h4>
              <ul>
                <li>Reference genome sequences</li>
                <li>Gene annotations</li>
                <li>STR marker positions</li>
                <li>Population variation data</li>
                <li>Custom track loading (BAM, VCF, BED files)</li>
              </ul>
              <h4>Use Cases:</h4>
              <ul>
                <li>Visual inspection of STR marker regions</li>
                <li>Primer design and validation</li>
                <li>Structural variant analysis</li>
                <li>Comparative genomics studies</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

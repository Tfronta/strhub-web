"use client"

import { useState } from "react"
import { FileText, Download, Copy, Settings } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import Link from "next/link"

export default function FastaGeneratorPage() {
  const [selectedMarker, setSelectedMarker] = useState("")
  const [flankingRegion, setFlankingRegion] = useState("100")
  const [outputFormat, setOutputFormat] = useState("standard")
  const [generatedSequence, setGeneratedSequence] = useState("")

  const markers = [
    { id: "csf1po", name: "CSF1PO", chromosome: "5" },
    { id: "d10s1248", name: "D10S1248", chromosome: "10" },
    { id: "d12s391", name: "D12S391", chromosome: "12" },
    { id: "d13s317", name: "D13S317", chromosome: "13" },
    { id: "d16s539", name: "D16S539", chromosome: "16" },
    { id: "d18s51", name: "D18S51", chromosome: "18" },
    { id: "d19s433", name: "D19S433", chromosome: "19" },
    { id: "d1s1656", name: "D1S1656", chromosome: "1" },
    { id: "d21s11", name: "D21S11", chromosome: "21" },
    { id: "d2s1338", name: "D2S1338", chromosome: "2" },
    { id: "d2s441", name: "D2S441", chromosome: "2" },
    { id: "d3s1358", name: "D3S1358", chromosome: "3" },
    { id: "d5s818", name: "D5S818", chromosome: "5" },
    { id: "d7s820", name: "D7S820", chromosome: "7" },
    { id: "d8s1179", name: "D8S1179", chromosome: "8" },
    { id: "fga", name: "FGA", chromosome: "4" },
    { id: "th01", name: "TH01", chromosome: "11" },
    { id: "tpox", name: "TPOX", chromosome: "2" },
    { id: "vwa", name: "vWA", chromosome: "12" },
  ]

  const generateFasta = () => {
    if (!selectedMarker) return

    const marker = markers.find((m) => m.id === selectedMarker)
    if (!marker) return

    // Mock FASTA generation - in a real implementation, this would fetch actual genomic sequences
    const mockSequence = `ATCGATCGATCGATCG${"AGAT".repeat(Math.floor(Math.random() * 10) + 8)}GCTAGCTAGCTAGCTAG`
    const flankingBp = Number.parseInt(flankingRegion)
    const leftFlanking = "A".repeat(flankingBp)
    const rightFlanking = "T".repeat(flankingBp)

    const fullSequence = leftFlanking + mockSequence + rightFlanking
    const fastaHeader = `>${marker.name}_Chr${marker.chromosome}_flanking_${flankingBp}bp`
    const formattedSequence = fullSequence.match(/.{1,80}/g)?.join("\n") || fullSequence

    setGeneratedSequence(`${fastaHeader}\n${formattedSequence}`)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedSequence)
  }

  const downloadFasta = () => {
    const blob = new Blob([generatedSequence], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${selectedMarker}_sequence.fasta`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              FASTA Generator
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
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">FASTA Generator</h1>
            <p className="text-xl text-muted-foreground">Generate custom FASTA sequences for research and analysis.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Configuration Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Sequence Configuration
                </CardTitle>
                <CardDescription>Configure the parameters for FASTA sequence generation</CardDescription>
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
                  <Label htmlFor="flanking-region">Flanking Region (bp)</Label>
                  <Input
                    id="flanking-region"
                    type="number"
                    value={flankingRegion}
                    onChange={(e) => setFlankingRegion(e.target.value)}
                    min="0"
                    max="1000"
                    placeholder="100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="output-format">Output Format</Label>
                  <Select value={outputFormat} onValueChange={setOutputFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard FASTA</SelectItem>
                      <SelectItem value="wrapped">Wrapped (80 chars/line)</SelectItem>
                      <SelectItem value="single-line">Single Line</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={generateFasta} className="w-full" disabled={!selectedMarker}>
                  <FileText className="h-4 w-4 mr-2" />
                  Generate FASTA Sequence
                </Button>
              </CardContent>
            </Card>

            {/* Output Panel */}
            <Card>
              <CardHeader>
                <CardTitle>Generated Sequence</CardTitle>
                <CardDescription>Your generated FASTA sequence will appear here</CardDescription>
              </CardHeader>
              <CardContent>
                {generatedSequence ? (
                  <div className="space-y-4">
                    <Textarea
                      value={generatedSequence}
                      readOnly
                      className="font-mono text-sm min-h-[300px]"
                      placeholder="Generated sequence will appear here..."
                    />
                    <div className="flex gap-2">
                      <Button onClick={copyToClipboard} variant="outline" size="sm">
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button onClick={downloadFasta} size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download FASTA
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a marker and click "Generate FASTA Sequence" to begin</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Information Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>About FASTA Generation</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none dark:prose-invert">
              <p>
                This tool generates FASTA sequences for STR markers with customizable flanking regions. The sequences
                include the STR repeat region along with specified upstream and downstream flanking sequences for
                comprehensive analysis.
              </p>
              <h4>Features:</h4>
              <ul>
                <li>Support for all CODIS core and extended STR markers</li>
                <li>Customizable flanking region lengths (0-1000 bp)</li>
                <li>Multiple output formats for different analysis needs</li>
                <li>Direct download and clipboard copy functionality</li>
              </ul>
              <h4>Use Cases:</h4>
              <ul>
                <li>Primer design for STR amplification</li>
                <li>In silico PCR validation</li>
                <li>Sequence alignment and comparison</li>
                <li>Custom analysis pipeline development</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

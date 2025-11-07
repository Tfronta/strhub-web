"use client";

import { useState, useRef } from "react";
import { Eye } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import Link from "next/link";

export default function IgvViewerPage() {
  const [selectedMarker, setSelectedMarker] = useState("");
  const selectedBuild = "hg38";
  const [selectedSample, setSelectedSample] = useState<string>("HG00097");
  const [igvLoaded, setIgvLoaded] = useState(false);
  const igvContainerRef = useRef<HTMLDivElement | null>(null);

  const markers = [
    {
      id: "csf1po",
      name: "CSF1PO",
      chromosome: "5",
      position: "150073000-150074000",
    },
    {
      id: "d10s1248",
      name: "D10S1248",
      chromosome: "10",
      position: "131389200-131390200",
    },
    {
      id: "d12s391",
      name: "D12S391",
      chromosome: "12",
      position: "12462000-12463000",
    },
    {
      id: "d13s317",
      name: "D13S317",
      chromosome: "13",
      position: "82722000-82723000",
    },
    {
      id: "d16s539",
      name: "D16S539",
      chromosome: "16",
      position: "86386000-86387000",
    },
    {
      id: "d18s51",
      name: "D18S51",
      chromosome: "18",
      position: "60948000-60949000",
    },
    {
      id: "d19s433",
      name: "D19S433",
      chromosome: "19",
      position: "30417000-30418000",
    },
    {
      id: "d1s1656",
      name: "D1S1656",
      chromosome: "1",
      position: "230905000-230906000",
    },
    {
      id: "d21s11",
      name: "D21S11",
      chromosome: "21",
      position: "27333000-27334000",
    },
    {
      id: "d2s1338",
      name: "D2S1338",
      chromosome: "2",
      position: "218705000-218706000",
    },
    {
      id: "d2s441",
      name: "D2S441",
      chromosome: "2",
      position: "68231000-68232000",
    },
    {
      id: "d3s1358",
      name: "D3S1358",
      chromosome: "3",
      position: "45582000-45583000",
    },
    {
      id: "d5s818",
      name: "D5S818",
      chromosome: "5",
      position: "123139000-123140000",
    },
    {
      id: "d7s820",
      name: "D7S820",
      chromosome: "7",
      position: "83789000-83790000",
    },
    {
      id: "d8s1179",
      name: "D8S1179",
      chromosome: "8",
      position: "125907000-125908000",
    },
    {
      id: "fga",
      name: "FGA",
      chromosome: "4",
      position: "155508000-155509000",
    },
    { id: "th01", name: "TH01", chromosome: "11", position: "2192000-2193000" },
    { id: "tpox", name: "TPOX", chromosome: "2", position: "1493000-1494000" },
    { id: "vwa", name: "vWA", chromosome: "12", position: "6093000-6094000" },
  ];

  const SAMPLES: Record<string, { label: string; bam: string; bai: string }> = {
    HG00097: {
      label: "HG00097 (1000G)",
      bam: "https://raw.githubusercontent.com/Tfronta/strhub-demo-data/main/data/HG00097_sort.bam",
      bai: "https://raw.githubusercontent.com/Tfronta/strhub-demo-data/main/data/HG00097_sort.bam.bai",
    },
    HG00145: {
      label: "HG00145 (1000G)",
      bam: "https://raw.githubusercontent.com/Tfronta/strhub-demo-data/main/data/HG00145_sort.bam",
      bai: "https://raw.githubusercontent.com/Tfronta/strhub-demo-data/main/data/HG00145_sort.bam.bai",
    },
    HG00263: {
      label: "HG00263 (1000G)",
      bam: "https://raw.githubusercontent.com/Tfronta/strhub-demo-data/main/data/HG00263_sort.bam",
      bai: "https://raw.githubusercontent.com/Tfronta/strhub-demo-data/main/data/HG00263_sort.bam.bai",
    },
    HG00372: {
      label: "HG00372 (1000G)",
      bam: "https://raw.githubusercontent.com/Tfronta/strhub-demo-data/main/data/HG00372_sort.bam",
      bai: "https://raw.githubusercontent.com/Tfronta/strhub-demo-data/main/data/HG00372_sort.bam.bai",
    },
    HG01063: {
      label: "HG01063 (1000G)",
      bam: "https://raw.githubusercontent.com/Tfronta/strhub-demo-data/main/data/HG01063_sort.bam",
      bai: "https://raw.githubusercontent.com/Tfronta/strhub-demo-data/main/data/HG01063_sort.bam.bai",
    },
  };

  const launchIGV = async () => {
    if (!selectedMarker || !igvContainerRef.current) return;
    const marker = markers.find((m) => m.id === selectedMarker);
    if (!marker) return;
    const [start, end] = marker.position.split("-");
    const locus = `chr${marker.chromosome}:${start}-${end}`;
    try {
      const mod: any = await import("igv/dist/igv.esm.js");
      const igv = (mod?.default ?? mod) as any;
      try {
        igv.removeAllBrowsers?.();
      } catch {}
      const sample = SAMPLES[selectedSample];
      const options: any = {
        genome: selectedBuild,
        locus,
        showNavigation: true,
        showRuler: true,
        tracks: [
          {
            name: `${sample.label} — STRhub demo`,
            type: "alignment",
            format: "bam",
            url: sample.bam,
            indexURL: sample.bai,
            height: 720,
            displayMode: "EXPANDED",
            showAllBases: true,
            samplingDepth: 0,
            samplingWindowSize: 0,
            visibilityWindow: 100000,
          },
        ],
      };
      console.log("[IGV] options", options);
      await igv.createBrowser(igvContainerRef.current, options);
      setIgvLoaded(true);
    } catch (e) {
      console.error("[IGV] error", e);
      alert("IGV could not load. Check browser console for details.");
    }
  };

  const openInUCSC = () => {
    if (!selectedMarker) return;
    const marker = markers.find((m) => m.id === selectedMarker);
    if (!marker) return;
    const [start, end] = marker.position.split("-");
    const url = `https://genome.ucsc.edu/cgi-bin/hgTracks?db=hg38&position=chr${marker.chromosome}:${start}-${end}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-background">
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

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold mb-2">IGV Viewer</h1>
            <p className="text-base md:text-lg text-muted-foreground">
              One-click integration with IGV for genomic visualization and
              analysis.
            </p>
          </div>

          {/* Controls bar */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                {/* Marker */}
                <div className="space-y-1">
                  <Label>STR Marker</Label>
                  <Select
                    value={selectedMarker}
                    onValueChange={setSelectedMarker}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a marker" />
                    </SelectTrigger>
                    <SelectContent className="max-h-80">
                      {markers.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.name} (Chr {m.chromosome})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sample */}
                <div className="space-y-1">
                  <Label>Sample</Label>
                  <Select
                    value={selectedSample}
                    onValueChange={setSelectedSample}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a sample" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(SAMPLES).map(([k, v]) => (
                        <SelectItem key={k} value={k}>
                          {v.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Actions */}
                <div className="flex md:block gap-2">
                  <Button onClick={launchIGV} className="w-full">
                    <svg
                      className="h-4 w-4 mr-2"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Launch IGV Viewer
                  </Button>
                  <Button
                    onClick={openInUCSC}
                    variant="outline"
                    className="w-full"
                  >
                    Open in UCSC Browser
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Viewer */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Interactive Genome Viewer</CardTitle>
              <CardDescription>
                IGV.js integration for genomic visualization
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border rounded-xl overflow-visible">
                <div
                  ref={igvContainerRef}
                  className="w-full h-[820px] md:h-[950px]"
                />
              </div>
              <div className="px-6 pt-3 text-xs md:text-sm text-muted-foreground border-t bg-muted/30">
                <p className="font-semibold text-foreground mb-1">
                  Data Integration
                </p>
                <p>
                  This viewer integrates the open-source <strong>IGV.js</strong>{" "}
                  library for interactive genomic visualization (
                  <a
                    href="https://github.com/igvteam/igv.js"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-primary"
                  >
                    github.com/igvteam/igv.js
                  </a>
                  ) and sample alignment data from the{" "}
                  <strong>1000 Genomes Project</strong>(
                  <a
                    href="https://www.internationalgenome.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-primary"
                  >
                    internationalgenome.org
                  </a>
                  ). Demo BAM/BAI files are open data resources, used here for
                  educational and research purposes.
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  IGV.js · 1000 Genomes Project (open data)
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  IGV status:{" "}
                  {igvLoaded ? "Ready" : "Idle (click Launch IGV Viewer)"}.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

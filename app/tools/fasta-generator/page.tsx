"use client";

import { useEffect, useState } from "react";
import { FileText, Download, Copy, Settings } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { parseAlleles, type ExportType } from "@/lib/fasta-export";
import { generateContentFromSlice } from "@/lib/fasta-export-from-slice";
import { markerData } from "@/lib/markerData";
import { useLanguage } from "@/contexts/language-context";
import { translations, type Language } from "@/lib/translations";

const languageNames: Record<Language, string> = {
  en: "English",
  es: "Español",
  pt: "Português",
};

export default function FastaGeneratorPage() {
  const [selectedMarker, setSelectedMarker] = useState("");
  const [allelesInput, setAllelesInput] = useState("");
  const [flankingRegion, setFlankingRegion] = useState("100");
  const [outputFormat, setOutputFormat] = useState<ExportType>("reference");
  const [generatedSequence, setGeneratedSequence] = useState("");
  const { language } = useLanguage();
  const languageContent = translations[language] as (typeof translations)["en"];
  const defaultPageContent = translations.en.fastaGeneratorPage;
  const pageContent = languageContent?.fastaGeneratorPage ?? defaultPageContent;
  const about = pageContent?.about ?? defaultPageContent.about;
  const configContent = pageContent?.config ?? defaultPageContent.config;
  const outputContent = pageContent?.output ?? defaultPageContent.output;
  const messages = pageContent?.messages ?? defaultPageContent.messages;

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
  ];

  const getMarkerInfo = (markerId: string) => {
    const uiMarker = markers.find((m) => m.id === markerId);
    const markerName = uiMarker?.name;
    const data =
      (markerData as Record<string, any>)[markerId] ||
      (markerName
        ? (markerData as Record<string, any>)[markerName]
        : undefined) ||
      (markerName
        ? (markerData as Record<string, any>)[markerName.toUpperCase()]
        : undefined);

    return { uiMarker, data };
  };

  useEffect(() => {
    if (!selectedMarker) return;

    const { data } = getMarkerInfo(selectedMarker);
    const defaultAlleles =
      typeof data?.alleles === "string" ? data.alleles.trim() : "";

    setAllelesInput(defaultAlleles || "");
  }, [selectedMarker]);

  const generateFasta = async () => {
    if (!selectedMarker) return;

    const alleles = parseAlleles(allelesInput);
    if (!alleles.length) {
      setGeneratedSequence(messages.enterAlleles);
      return;
    }

    try {
      // 1) Resolver el objeto del marcador para obtener el nombre EXACTO (CSF1PO, D21S11, etc.)
      const { uiMarker, data } = getMarkerInfo(selectedMarker);
      if (!uiMarker) {
        setGeneratedSequence(messages.markerNotFound);
        return;
      }
      const markerName = uiMarker.name; // "CSF1PO" / "D21S11" ...

      // 2) Obtener motivo desde markerData (aceptamos llave en id o en nombre)
      const motif: string = data?.motif ?? "[AGAT]n"; // fallback seguro

      // 3) Generar a partir del slice (usa detector robusto + normaliza nombre internamente)
      const { fasta } = await generateContentFromSlice(
        selectedMarker,
        motif,
        alleles,
        Number(flankingRegion) || 0,
        outputFormat
      );

      setGeneratedSequence(fasta);
    } catch (e: any) {
      setGeneratedSequence(
        `${messages.errorPrefix}: ${e?.message ?? String(e)}`
      );
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedSequence);
  };

  const downloadFasta = () => {
    const blob = new Blob([generatedSequence], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedMarker}_sequence.fasta`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/40">
      <div className="container mx-auto px-4 md:px-0 py-8 space-y-6">
        <div>
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2 tracking-tight">
              {pageContent.title}
            </h1>
            <p className="text-lg text-muted-foreground text-pretty">
              {pageContent.subtitle}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Configuration Panel */}
            <Card className="border-0 bg-card/70 backdrop-blur-sm shadow-lg">
              <CardHeader className="space-y-1.5 pb-4">
                <CardTitle className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
                  <Settings className="h-5 w-5" />
                  {configContent.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-0">
                <div className="space-y-2">
                  <Label
                    htmlFor="marker-select"
                    className="text-base font-semibold text-foreground"
                  >
                    {configContent.markerLabel}
                  </Label>
                  <Select
                    value={selectedMarker}
                    onValueChange={setSelectedMarker}
                  >
                    <SelectTrigger className="h-11 text-base">
                      <SelectValue
                        placeholder={configContent.markerPlaceholder}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {markers.map((marker) => (
                        <SelectItem
                          key={marker.id}
                          value={marker.id}
                          className="text-base"
                        >
                          {marker.name} (Chr {marker.chromosome})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="alleles"
                    className="text-base font-semibold text-foreground"
                  >
                    {configContent.allelesLabel}
                  </Label>
                  <Input
                    id="alleles"
                    type="text"
                    value={allelesInput}
                    onChange={(e) => setAllelesInput(e.target.value)}
                    placeholder={configContent.allelesPlaceholder}
                    className="h-11 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="flanking-region"
                    className="text-base font-semibold text-foreground"
                  >
                    {configContent.flankingLabel}
                  </Label>
                  <Input
                    id="flanking-region"
                    type="number"
                    value={flankingRegion}
                    onChange={(e) => setFlankingRegion(e.target.value)}
                    min="0"
                    max="1000"
                    placeholder="100"
                    className="h-11 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="output-format"
                    className="text-base font-semibold text-foreground"
                  >
                    {configContent.outputLabel}
                  </Label>
                  <Select
                    value={outputFormat}
                    onValueChange={(v) => setOutputFormat(v as ExportType)}
                  >
                    <SelectTrigger className="h-11 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard" className="text-base">
                        Standard FASTA
                      </SelectItem>
                      <SelectItem value="reference" className="text-base">
                        Reference-style FASTA
                      </SelectItem>
                      <SelectItem value="tabular" className="text-base">
                        Tabular (CSV)
                      </SelectItem>
                      <SelectItem value="multi" className="text-base">
                        Multi-FASTA
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={generateFasta}
                  className="w-full h-11 text-base font-semibold tracking-tight"
                  disabled={!selectedMarker}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {configContent.generateButton}
                </Button>
              </CardContent>
            </Card>

            {/* Output Panel */}
            <Card className="border-0 bg-card/70 backdrop-blur-sm shadow-lg">
              <CardHeader className="space-y-1.5 pb-4">
                <CardTitle className="text-2xl font-semibold tracking-tight">
                  {outputContent.title}
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  {outputContent.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                {generatedSequence ? (
                  <div className="space-y-4">
                    <Textarea
                      value={generatedSequence}
                      readOnly
                      className="font-mono text-base min-h-[320px] max-h-[520px] resize-y rounded-xl border border-border bg-gradient-to-br from-background via-muted/40 to-background shadow-inner focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:border-primary/80 transition-colors"
                      placeholder={outputContent.description}
                    />
                    <div className="flex flex-wrap gap-2">
                      <Button
                        onClick={copyToClipboard}
                        variant="outline"
                        className="text-base font-medium h-10 px-4"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        {outputContent.copyButton}
                      </Button>
                      <Button
                        onClick={downloadFasta}
                        className="text-base font-medium h-10 px-4"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {outputContent.downloadButton}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-base text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>{outputContent.emptyState}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Information Section */}
          <Card className="mt-10 border-0 bg-card/70 backdrop-blur-sm shadow-lg">
            <CardHeader className="space-y-1.5 pb-2">
              <CardTitle className="text-2xl font-semibold tracking-tight">
                {about.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 pt-0">
              <div className="space-y-4 text-base leading-relaxed text-foreground/90">
                <p>{about.intro}</p>
                <p>{about.detail}</p>
              </div>

              <section className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground tracking-tight">
                  {about.overview.title}
                </h3>
                <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
                  {about.overview.paragraphs.map((paragraph: string) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground tracking-tight">
                  {about.features.title}
                </h3>
                <ul className="grid gap-3 rounded-xl border border-muted/50 bg-background/80 p-5 text-base shadow-sm">
                  {about.features.items.map((item: string) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-foreground"
                    >
                      <span
                        className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"
                        aria-hidden="true"
                      />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground tracking-tight">
                  {about.useCases.title}
                </h3>
                <ul className="grid gap-3 rounded-xl border border-muted/50 bg-background/80 p-5 text-base shadow-sm">
                  {about.useCases.items.map((item: string) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-foreground"
                    >
                      <span
                        className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent"
                        aria-hidden="true"
                      />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

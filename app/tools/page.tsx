"use client";

import { Wrench, Code, Play, ExternalLink, Github } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";

export default function ToolsPage() {
  const { t } = useLanguage();

  const tools = [
    {
      name: t("tools.strider.title"),
      description: t("tools.strider.description"),
      tags: [
        t("tools.strider.tags.population"),
        t("tools.strider.tags.qc"),
        t("tools.strider.tags.webtool"),
      ],
      features: [
        t("tools.strider.features.1"),
        t("tools.strider.features.2"),
        t("tools.strider.features.3"),
        t("tools.strider.features.4"),
      ],
      website: "https://strider.online/",
      websiteLabel: t("tools.strider.buttons.website"),
      isWebTool: true,
    },
    {
      name: t("tools.strnaming.title"),
      description: t("tools.strnaming.description"),
      tags: [
        t("tools.strnaming.tags.annotation"),
        t("tools.strnaming.tags.forensic"),
        t("tools.strnaming.tags.webtool"),
      ],
      features: [
        t("tools.strnaming.features.1"),
        t("tools.strnaming.features.2"),
        t("tools.strnaming.features.3"),
      ],
      website: "https://www.fdstools.nl/strnaming/index.html",
      websiteLabel: t("tools.strnaming.buttons.website"),
      isWebTool: true,
    },
    {
      name: "HipSTR",
      description:
        "Tool for genotyping short tandem repeats from Illumina sequencing data",
      category: "Genotyping",
      language: "C++",
      features: [
        "High accuracy",
        "Handles complex STRs",
        "Population-scale analysis",
      ],
      github: "https://github.com/HipSTR-Tool/HipSTR",
      tutorial: true,
    },
    {
      name: t("tools.strspy.title"),
      description: t("tools.strspy.description"),
      category: t("tools.strspy.tags.category"),
      language: t("tools.strspy.tags.language"),
      features: [
        t("tools.strspy.features.1"),
        t("tools.strspy.features.2"),
        t("tools.strspy.features.3"),
        t("tools.strspy.features.4"),
      ],
      github: "https://github.com/unique379r/strspy/tree/main",
      paper: "https://pubmed.ncbi.nlm.nih.gov/34837788/",
      paperLabel: t("tools.strspy.buttons.paper"),
    },
    {
      name: "GangSTR",
      description:
        "Tool for genome-wide profiling of tandem repeats from short reads",
      category: "Profiling",
      language: "C++",
      features: [
        "Genome-wide analysis",
        "Short read support",
        "High throughput",
      ],
      github: "https://github.com/gymreklab/GangSTR",
      tutorial: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Wrench className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Tools & Pipelines
            </h1>
          </Link>
          <Link
            href="/"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            ← Back to STRhub
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-8 px-4">
        <div className="container mx-auto text-left">
          <h2 className="text-4xl font-bold mb-6">
            Powerful Tools for STR Analysis
          </h2>
          <p className="text-xl text-muted-foreground text-pretty mb-4">
            Comprehensive collection of tools, pipelines, and tutorials for
            Short Tandem Repeat analysis. From genotyping to visualization, find
            everything you need for your research.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs font-normal rounded-sm px-3"
            asChild
          >
            <Link href="/about#contact">
              <ExternalLink className="h-3 w-3 mr-1" />
              {t("tools.hero.ctaCollaborate")}
            </Link>
          </Button>
        </div>
      </section>

      {/* Tools Section */}
      <section className="pt-4 pb-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-12">Analysis Tools</h3>
          <div className="grid lg:grid-cols-2 gap-6">
            {tools.map((tool, index) => (
              <Card
                key={index}
                className="border-0 bg-gradient-to-br from-card to-card/50"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">
                        {tool.name}
                      </CardTitle>
                      <CardDescription className="text-base mb-4">
                        {tool.description}
                      </CardDescription>
                      <div className="flex items-center gap-2 mb-4 flex-wrap">
                        {tool.category && tool.language ? (
                          <>
                            <Badge variant="secondary">{tool.category}</Badge>
                            <Badge variant="outline">{tool.language}</Badge>
                          </>
                        ) : tool.tags ? (
                          tool.tags.map((tag, tagIdx) => (
                            <Badge key={tagIdx} variant="secondary">
                              {tag}
                            </Badge>
                          ))
                        ) : null}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Key Features:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {tool.features.map((feature, idx) => (
                          <li key={idx}>• {feature}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex gap-2">
                      {tool.github && (
                        <Button size="sm" variant="outline" asChild>
                          <a
                            href={tool.github}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Github className="h-4 w-4 mr-1" />
                            GitHub
                          </a>
                        </Button>
                      )}
                      {tool.website && (
                        <Button size="sm" variant="outline" asChild>
                          <a
                            href={tool.website}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            {tool.websiteLabel || "Website"}
                          </a>
                        </Button>
                      )}
                      {tool.paper && (
                        <Button size="sm" variant="outline" asChild>
                          <a
                            href={tool.paper}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            {tool.paperLabel || "Paper"}
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Essential Bioinformatics Commands Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold mb-12 text-left">
            {t("tools.commands.title")}
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Card 1 - Essential Read Processing Commands */}
            <div className="rounded-2xl border bg-muted/40 shadow-sm p-6 lg:p-8 text-left">
              <h4 className="text-2xl font-semibold text-gray-900 mb-2">
                {t("tools.commands.card1.title")}
              </h4>
              <p className="text-base text-muted-foreground mb-4">
                {t("tools.commands.card1.subtitle")}
              </p>
              <div className="space-y-4">
                <div>
                  <h5 className="font-semibold mb-2 text-sm">Key Features:</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• {t("tools.commands.card1.features.1")}</li>
                    <li>• {t("tools.commands.card1.features.2")}</li>
                    <li>• {t("tools.commands.card1.features.3")}</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <div>
                    <CodeBlock
                      label="Trimmomatic"
                      code={t("tools.commands.card1.commands.trimmomatic")}
                    />
                  </div>
                  <div>
                    <CodeBlock
                      label="fastp"
                      code={t("tools.commands.card1.commands.fastp")}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 - Alignment & BAM Processing Essentials */}
            <div className="rounded-2xl border bg-muted/40 shadow-sm p-6 lg:p-8 text-left">
              <h4 className="text-2xl font-semibold text-gray-900 mb-2">
                {t("tools.commands.card2.title")}
              </h4>
              <p className="text-base text-muted-foreground mb-4">
                {t("tools.commands.card2.subtitle")}
              </p>
              <div className="space-y-4">
                <div>
                  <h5 className="font-semibold mb-2 text-sm">Key Features:</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• {t("tools.commands.card2.features.1")}</li>
                    <li>• {t("tools.commands.card2.features.2")}</li>
                    <li>• {t("tools.commands.card2.features.3")}</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <div>
                    <CodeBlock
                      label="BWA-MEM2 alignment"
                      code={t("tools.commands.card2.commands.bwa")}
                    />
                  </div>
                  <div>
                    <CodeBlock
                      label="Convert / sort / index"
                      code={t("tools.commands.card2.commands.samtools")}
                    />
                  </div>
                  <div>
                    <CodeBlock
                      label="Remove duplicates"
                      code={t("tools.commands.card2.commands.rmdup")}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 - Inspecting STR Regions & Coverage */}
            <div className="rounded-2xl border bg-muted/40 shadow-sm p-6 lg:p-8 text-left">
              <h4 className="text-2xl font-semibold text-gray-900 mb-2">
                {t("tools.commands.card3.title")}
              </h4>
              <p className="text-base text-muted-foreground mb-4">
                {t("tools.commands.card3.subtitle")}
              </p>
              <div className="space-y-4">
                <div>
                  <h5 className="font-semibold mb-2 text-sm">Key Features:</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• {t("tools.commands.card3.features.1")}</li>
                    <li>• {t("tools.commands.card3.features.2")}</li>
                    <li>• {t("tools.commands.card3.features.3")}</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <div>
                    <CodeBlock
                      label="Depth coverage"
                      code={t("tools.commands.card3.commands.depth")}
                    />
                  </div>
                  <div>
                    <CodeBlock
                      label="Region inspection"
                      code={t("tools.commands.card3.commands.view")}
                    />
                  </div>
                  <div>
                    <CodeBlock
                      label="Quick visualization"
                      code={t("tools.commands.card3.commands.tview")}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Installation Requirements Block */}
          <div className="mt-10 rounded-xl border bg-muted/40 p-6">
            <h2 className="text-xl font-semibold mb-4">
              {t("tools.commands.installation.title")}
            </h2>

            <p className="text-sm leading-relaxed mb-6">
              {t("tools.commands.installation.intro")}
            </p>

            <div className="space-y-4 text-sm">
              <div>
                <CodeBlock
                  label={t("tools.commands.installation.linuxTitle")}
                  code="sudo apt update && sudo apt install samtools bcftools minimap2 trimmomatic fastp"
                />
              </div>

              <div>
                <CodeBlock
                  label={t("tools.commands.installation.macTitle")}
                  code={`brew install samtools bcftools minimap2 fastp\nbrew install --cask trimmomatic`}
                />
              </div>

              <div>
                <p className="mb-2">
                  {t("tools.commands.installation.windowsNote")}
                </p>
                <CodeBlock
                  label={t("tools.commands.installation.windowsTitle")}
                  code="sudo apt update && sudo apt install samtools bcftools minimap2 trimmomatic fastp"
                />
              </div>
            </div>

            <p className="text-xs mt-6 opacity-70">
              {t("tools.commands.installation.guideSoon")}
            </p>
          </div>
        </div>
      </section>

      {/* Tutorials Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-12">Interactive Tutorials</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-0 bg-gradient-to-br from-primary/10 to-accent/10">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mb-4">
                  <Code className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>HipSTR Basics</CardTitle>
                <CardDescription>
                  Learn the fundamentals of STR genotyping with HipSTR
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Start Tutorial
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-secondary/10 to-primary/10">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-lg flex items-center justify-center mb-4">
                  <Code className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle>Nextflow for STRs</CardTitle>
                <CardDescription>
                  Build scalable STR analysis pipelines with Nextflow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Start Tutorial
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-accent/10 to-secondary/10">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center mb-4">
                  <Code className="h-6 w-6 text-accent-foreground" />
                </div>
                <CardTitle>Python STR Analysis</CardTitle>
                <CardDescription>
                  Analyze STR data using Python and popular libraries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Start Tutorial
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

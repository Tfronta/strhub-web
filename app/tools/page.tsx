"use client";

import { Wrench, ExternalLink, Github, Info, FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";
import { toolsData } from "@/app/marker/[id]/toolsData";

export default function ToolsPage() {
  const { t } = useLanguage();

  // Get STrait Razor from tools catalog
  const straitRazorTool = toolsData.find((tool) => tool.id === "straitrazor");

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
      name: t("tools.hipstr.title"),
      description: t("tools.hipstr.description"),
      category: t("tools.hipstr.category"),
      language: t("tools.hipstr.language"),
      features: [
        t("tools.hipstr.features.1"),
        t("tools.hipstr.features.2"),
        t("tools.hipstr.features.3"),
      ],
      github: "https://github.com/HipSTR-Tool/HipSTR",
      paper: "https://www.nature.com/articles/nmeth.4267",
      paperLabel: t("tools.strspy.buttons.paper"),
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
      name: t("tools.gangstr.title"),
      description: t("tools.gangstr.description"),
      category: t("tools.gangstr.category"),
      language: t("tools.gangstr.language"),
      features: [
        t("tools.gangstr.features.1"),
        t("tools.gangstr.features.2"),
        t("tools.gangstr.features.3"),
      ],
      github: "https://github.com/gymreklab/GangSTR",
      paper: "https://pubmed.ncbi.nlm.nih.gov/31194863/",
      paperLabel: t("tools.strspy.buttons.paper"),
      tutorial: true,
    },
    {
      name: t("tools.straitrazor.title"),
      description: t("tools.straitrazor.description"),
      category: t("tools.straitrazor.tags.category"),
      language: t("tools.straitrazor.tags.language"),
      features: [
        t("tools.straitrazor.features.1"),
        t("tools.straitrazor.features.2"),
        t("tools.straitrazor.features.3"),
        t("tools.straitrazor.features.4"),
      ],
      github: straitRazorTool?.repo_url || "",
      paper: straitRazorTool?.paper_doi || "",
      paperLabel: t("tools.straitrazor.buttons.paper"),
      website: straitRazorTool?.online_version,
      websiteLabel: straitRazorTool?.online_version
        ? t("tools.straitrazor.buttons.online")
        : undefined,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-8 px-4">
        <div className="container mx-auto text-left">
          <h1 className="text-3xl font-bold mb-2 tracking-tight">
            {t("tools.title")}
          </h1>
          <p className="text-lg text-muted-foreground text-pretty mb-4">
            {t("tools.description")}
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
          <h3 className="text-3xl font-bold mb-12">
            {t("tools.categories.analysis")}
          </h3>
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
                      <h4 className="font-semibold mb-2">
                        {t("tools.common.keyFeatures")}
                      </h4>
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
                            {t("tools.common.github")}
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
                            {tool.websiteLabel || t("tools.common.website")}
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
                            <FileText className="h-4 w-4 mr-1" />
                            {tool.paperLabel ||
                              t("tools.common.originalPublication")}
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
      <section className="pt-16 pb-8 px-4 bg-muted/30">
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
                  <h5 className="font-semibold mb-2 text-sm">
                    {t("tools.common.keyFeatures")}
                  </h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• {t("tools.commands.card1.features.1")}</li>
                    <li>• {t("tools.commands.card1.features.2")}</li>
                    <li>• {t("tools.commands.card1.features.3")}</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <div>
                    <CodeBlock
                      label={t("tools.codeLabels.trimmomatic")}
                      code={t("tools.commands.card1.commands.trimmomatic")}
                    />
                  </div>
                  <div>
                    <CodeBlock
                      label={t("tools.codeLabels.fastp")}
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
                  <h5 className="font-semibold mb-2 text-sm">
                    {t("tools.common.keyFeatures")}
                  </h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• {t("tools.commands.card2.features.1")}</li>
                    <li>• {t("tools.commands.card2.features.2")}</li>
                    <li>• {t("tools.commands.card2.features.3")}</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <div>
                    <CodeBlock
                      label={t("tools.codeLabels.bwaAlignment")}
                      code={t("tools.commands.card2.commands.bwa")}
                    />
                  </div>
                  <div>
                    <CodeBlock
                      label={t("tools.codeLabels.convertSortIndex")}
                      code={t("tools.commands.card2.commands.samtools")}
                    />
                  </div>
                  <div>
                    <CodeBlock
                      label={t("tools.codeLabels.removeDuplicates")}
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
                  <h5 className="font-semibold mb-2 text-sm">
                    {t("tools.common.keyFeatures")}
                  </h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• {t("tools.commands.card3.features.1")}</li>
                    <li>• {t("tools.commands.card3.features.2")}</li>
                    <li>• {t("tools.commands.card3.features.3")}</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <div>
                    <CodeBlock
                      label={t("tools.codeLabels.depthCoverage")}
                      code={t("tools.commands.card3.commands.depth")}
                    />
                  </div>
                  <div>
                    <CodeBlock
                      label={t("tools.codeLabels.regionInspection")}
                      code={t("tools.commands.card3.commands.view")}
                    />
                  </div>
                  <div>
                    <CodeBlock
                      label={t("tools.codeLabels.quickVisualization")}
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
      <section className="pt-8 pb-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-12">
            {t("tools.tutorials.title")}
          </h3>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              {t("tools.tutorials.comingSoon")}
            </AlertDescription>
          </Alert>
        </div>
      </section>
    </div>
  );
}

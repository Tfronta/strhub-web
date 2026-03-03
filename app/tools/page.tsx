"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Github, Info, FileText, Filter } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import { CommandBlock } from "@/components/ui/command-block";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";
import { buildToolCards } from "@/lib/tools";
import type {
  TechnologyKey,
  ReadTypeKey,
  AnalysisKey,
  UsageKey,
  ToolCard,
} from "@/lib/tools";
import { ToolCardCompact } from "@/components/tools/ToolCardCompact";

export type { TechnologyKey, ReadTypeKey, AnalysisKey, UsageKey, ToolCard };

const TECHNOLOGY_OPTIONS: TechnologyKey[] = [
  "illumina",
  "ont",
  "pacbio",
  "multi_platform",
];
const ANALYSIS_OPTIONS: AnalysisKey[] = [
  "genotyping",
  "annotation",
  "qc_database",
];
const USAGE_OPTIONS: UsageKey[] = [
  "runs_locally",
  "online_tool",
  "graphical_interface",
];

export default function ToolsPage() {
  const { t } = useLanguage();
  const [filterTech, setFilterTech] = useState<string>("all");
  const [filterAnalysis, setFilterAnalysis] = useState<string>("all");
  const [filterUsage, setFilterUsage] = useState<string>("all");

  const tools: ToolCard[] = useMemo(() => buildToolCards(t), [t]);

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      if (filterTech !== "all" && !tool.technology.includes(filterTech as TechnologyKey))
        return false;
      if (
        filterAnalysis !== "all" &&
        !tool.analysis.includes(filterAnalysis as AnalysisKey)
      )
        return false;
      if (
        filterUsage !== "all" &&
        !tool.usage.includes(filterUsage as UsageKey)
      )
        return false;
      return true;
    });
  }, [tools, filterTech, filterAnalysis, filterUsage]);

  const hasActiveFilters =
    filterTech !== "all" ||
    filterAnalysis !== "all" ||
    filterUsage !== "all";

  const resetFilters = () => {
    setFilterTech("all");
    setFilterAnalysis("all");
    setFilterUsage("all");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-8 pb-2 px-4">
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
      <section className="pt-2 pb-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-start gap-2 mb-6">
            <h3 className="text-3xl font-bold">
              {t("tools.categories.analysis")}
            </h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex shrink-0 text-muted-foreground hover:text-foreground cursor-help mt-1.5">
                  <Info className="h-4 w-4" aria-hidden />
                </span>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm text-sm">
                {t("tools.hero.disclaimer")}
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Compact filter toolbar */}
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs rounded-sm gap-1.5"
                  aria-label={t("tools.filters.filtersButton")}
                >
                  <Filter className="h-3.5 w-3.5" />
                  {t("tools.filters.filtersButton")}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto max-w-[min(90vw,320px)] max-h-[70vh] overflow-y-auto"
                align="start"
              >
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                      {t("tools.filters.technology")}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      <Button
                        variant={filterTech === "all" ? "secondary" : "outline"}
                        size="sm"
                        className="h-7 text-xs rounded-full px-2.5"
                        onClick={() => setFilterTech("all")}
                      >
                        {t("tools.filters.all")}
                      </Button>
                      {TECHNOLOGY_OPTIONS.map((key) => (
                        <Button
                          key={key}
                          variant={filterTech === key ? "secondary" : "outline"}
                          size="sm"
                          className="h-7 text-xs rounded-full px-2.5"
                          onClick={() => setFilterTech(key)}
                        >
                          {t(`tools.badges.technology.${key}`)}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                      {t("tools.filters.analysis")}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      <Button
                        variant={
                          filterAnalysis === "all" ? "secondary" : "outline"
                        }
                        size="sm"
                        className="h-7 text-xs rounded-full px-2.5"
                        onClick={() => setFilterAnalysis("all")}
                      >
                        {t("tools.filters.all")}
                      </Button>
                      {ANALYSIS_OPTIONS.map((key) => (
                        <Button
                          key={key}
                          variant={
                            filterAnalysis === key ? "secondary" : "outline"
                          }
                          size="sm"
                          className="h-7 text-xs rounded-full px-2.5"
                          onClick={() => setFilterAnalysis(key)}
                        >
                          {t(`tools.badges.analysis.${key}`)}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                      {t("tools.filters.usage")}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      <Button
                        variant={filterUsage === "all" ? "secondary" : "outline"}
                        size="sm"
                        className="h-7 text-xs rounded-full px-2.5"
                        onClick={() => setFilterUsage("all")}
                      >
                        {t("tools.filters.all")}
                      </Button>
                      {USAGE_OPTIONS.map((key) => (
                        <Button
                          key={key}
                          variant={
                            filterUsage === key ? "secondary" : "outline"
                          }
                          size="sm"
                          className="h-7 text-xs rounded-full px-2.5"
                          onClick={() => setFilterUsage(key)}
                        >
                          {t(`tools.badges.usage.${key}`)}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Active filter chips (max 2 visible + "+N") */}
            {(() => {
              const activeChips: { id: string; label: string; fullLabel: string }[] = [];
              if (filterTech !== "all") {
                activeChips.push({
                  id: `tech-${filterTech}`,
                  label: t(`tools.badges.technology.${filterTech}`),
                  fullLabel: t(`tools.badges.technology.${filterTech}`),
                });
              }
              if (filterAnalysis !== "all") {
                activeChips.push({
                  id: `analysis-${filterAnalysis}`,
                  label: t(`tools.badges.analysis.${filterAnalysis}`),
                  fullLabel: t(`tools.badges.analysis.${filterAnalysis}`),
                });
              }
              if (filterUsage !== "all") {
                activeChips.push({
                  id: `usage-${filterUsage}`,
                  label: t(`tools.badges.usage.${filterUsage}`),
                  fullLabel: t(`tools.badges.usage.${filterUsage}`),
                });
              }
              const visibleChips = activeChips.slice(0, 2);
              const extraCount = activeChips.length - 2;

              return (
                <>
                  {visibleChips.map((chip) => (
                    <Badge
                      key={chip.id}
                      variant="secondary"
                      className="text-xs font-normal px-2 py-0.5 rounded-sm"
                    >
                      {chip.label}
                    </Badge>
                  ))}
                  {extraCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="text-xs font-normal px-2 py-0.5 rounded-sm"
                    >
                      +{extraCount}
                    </Badge>
                  )}
                </>
              );
            })()}

            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs rounded-sm ml-auto sm:ml-0"
                onClick={resetFilters}
                aria-label={t("tools.filters.resetFilters")}
              >
                {t("tools.filters.clear")}
              </Button>
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {filteredTools.map((tool) => (
              <div
                key={tool.id}
                id={`tool-${tool.id}`}
                className="scroll-mt-6"
              >
                <ToolCardCompact card={tool} />
              </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Card 1 - Essential Read Processing Commands */}
            <div className="rounded-2xl border bg-muted/40 shadow-sm p-6 lg:p-8 text-left flex flex-col">
              <h4 className="text-2xl font-semibold mb-2">
                {t("tools.commands.card1.title")}
              </h4>
              <p className="text-base text-muted-foreground mb-4">
                {t("tools.commands.card1.subtitle")}
              </p>
              <div className="space-y-4 flex-1">
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
                <div className="space-y-4">
                  <CommandBlock
                    titleKey="tools.codeLabels.trimmomatic"
                    command={t("tools.commands.card1.commands.trimmomatic")}
                    infoKey="tools.commands.card1.info.trimmomatic"
                  />
                  <CommandBlock
                    titleKey="tools.codeLabels.fastp"
                    command={t("tools.commands.card1.commands.fastp")}
                    infoKey="tools.commands.card1.info.fastp"
                  />
                </div>
              </div>
            </div>

            {/* Card 2 - Alignment & BAM Processing Essentials */}
            <div className="rounded-2xl border bg-muted/40 shadow-sm p-6 lg:p-8 text-left flex flex-col">
              <h4 className="text-2xl font-semibold mb-2">
                {t("tools.commands.card2.title")}
              </h4>
              <p className="text-base text-muted-foreground mb-4">
                {t("tools.commands.card2.subtitle")}
              </p>
              <div className="space-y-4 flex-1">
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
                <div className="space-y-4">
                  <CommandBlock
                    titleKey="tools.codeLabels.bwaAlignment"
                    command={t("tools.commands.card2.commands.bwa")}
                    infoKey="tools.commands.card2.info.bwa"
                  />
                  <CommandBlock
                    titleKey="tools.codeLabels.convertSortIndex"
                    command={t("tools.commands.card2.commands.samtools")}
                    infoKey="tools.commands.card2.info.samtools"
                  />
                  <CommandBlock
                    titleKey="tools.codeLabels.removeDuplicates"
                    command={t("tools.commands.card2.commands.rmdup")}
                    infoKey="tools.commands.card2.info.rmdup"
                  />
                </div>
              </div>
            </div>

            {/* Card 3 - Inspecting STR Regions & Coverage */}
            <div className="rounded-2xl border bg-muted/40 shadow-sm p-6 lg:p-8 text-left flex flex-col">
              <h4 className="text-2xl font-semibold mb-2">
                {t("tools.commands.card3.title")}
              </h4>
              <p className="text-base text-muted-foreground mb-4">
                {t("tools.commands.card3.subtitle")}
              </p>
              <div className="space-y-4 flex-1">
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
                <div className="space-y-4">
                  <CommandBlock
                    titleKey="tools.codeLabels.depthCoverage"
                    command={t("tools.commands.card3.commands.depth")}
                    infoKey="tools.commands.card3.info.depth"
                  />
                  <CommandBlock
                    titleKey="tools.codeLabels.regionInspection"
                    command={t("tools.commands.card3.commands.view")}
                    infoKey="tools.commands.card3.info.view"
                  />
                  <CommandBlock
                    titleKey="tools.codeLabels.quickVisualization"
                    command={t("tools.commands.card3.commands.tview")}
                    infoKey="tools.commands.card3.info.tview"
                  />
                </div>
              </div>
            </div>

            {/* Card 4 - Nanopore (ONT) Essentials */}
            <div className="rounded-2xl border bg-muted/40 shadow-sm p-6 lg:p-8 text-left flex flex-col">
              <h4 className="text-2xl font-semibold mb-2">
                {t("tools.commands.nanopore.title")}
              </h4>
              <p className="text-base text-muted-foreground mb-4">
                {t("tools.commands.nanopore.subtitle")}
              </p>
              <div className="space-y-4 flex-1">
                <div>
                  <h5 className="font-semibold mb-2 text-sm">
                    {t("tools.common.keyFeatures")}
                  </h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• {t("tools.commands.nanopore.features.1")}</li>
                    <li>• {t("tools.commands.nanopore.features.2")}</li>
                    <li>• {t("tools.commands.nanopore.features.3")}</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <CommandBlock
                    titleKey="tools.codeLabels.doradoBasecalling"
                    command={t("tools.commands.nanopore.commands.dorado")}
                    infoKey="tools.commands.nanopore.info.dorado"
                  />
                  <CommandBlock
                    titleKey="tools.codeLabels.minimap2Ont"
                    command={t("tools.commands.nanopore.commands.minimap2")}
                    infoKey="tools.commands.nanopore.info.minimap2"
                  />
                  <CommandBlock
                    titleKey="tools.codeLabels.nanoplot"
                    command={t("tools.commands.nanopore.commands.nanoplot")}
                    infoKey="tools.commands.nanopore.info.nanoplot"
                  />
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

              <div>
                <p className="mb-2">
                  {t("tools.commands.installation.nanoporePythonNote")}
                </p>
                <p className="mb-2">
                  {t("tools.commands.installation.nanoporeNote")}
                </p>
                <CodeBlock
                  label={t("tools.commands.installation.nanoporeTitle")}
                  code={t("tools.commands.installation.nanoporeCmd")}
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

"use client";

import { useState, useEffect } from "react";
import { Database, Globe2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/contexts/language-context";
import Link from "next/link";

interface Project {
  id: string;
  title: string;
  content: string;
  category: "Blog" | "Projects" | "Educational";
  date: string;
  published: boolean;
}

export default function ProjectsPage() {
  const { t } = useLanguage();
  const [adminProjects, setAdminProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const staticProjects = [
    {
      title: "1000 Genomes Project",
      descriptionKey: "projects.static.genomes1000.description",
      url: "https://www.internationalgenome.org/",
      icon: Database,
    },
    {
      title: "HGDP (Human Genome Diversity Project)",
      descriptionKey: "projects.static.hgdp.description",
      url: "https://www.internationalgenome.org/data-portal/data-collection/hgdp",
      icon: Globe2,
    },
    {
      title: "The STR Sequencing Project (NIST)",
      descriptionKey: "projects.static.strSequencingProject.description",
      url: "https://strbase.nist.gov/strseq.htm",
      icon: Database,
    },
    {
      title: "gnomAD (Genome Aggregation Database)",
      descriptionKey: "projects.static.gnomad.description",
      url: "https://gnomad.broadinstitute.org/",
      icon: Database,
    },
    {
      title: "Simons Genome Diversity Project (SGDP)",
      descriptionKey: "projects.static.sgdp.description",
      url: "https://www.simonsfoundation.org/simons-genome-diversity-project/",
      icon: Globe2,
    },
    {
      title: "All of Us (NIH, USA)",
      descriptionKey: "projects.static.allOfUs.description",
      url: "https://allofus.nih.gov/",
      icon: Users,
    },
    {
      title: "Human Pangenome Project",
      descriptionKey: "projects.static.humanPangenome.description",
      url: "https://humanpangenome.org/",
      icon: Database,
    },
    {
      title: "STRidER (STRs for Identity ENFSI Reference Database)",
      descriptionKey: "projects.static.strider.description",
      url: "https://strider.online/",
      icon: Database,
    },
    {
      title: "STRBase (NIST)",
      descriptionKey: "projects.static.strbase.description",
      url: "https://strbase.nist.gov/",
      icon: Database,
    },
  ];

  useEffect(() => {
    loadAdminProjects();
  }, []);

  const loadAdminProjects = async () => {
    try {
      const response = await fetch("/api/content?category=Projects");
      if (response.ok) {
        const data = await response.json();
        setAdminProjects(data.entries || []);
      }
    } catch (error) {
      console.error("Failed to load admin projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getExcerpt = (content: string, maxLength = 120) => {
    const plainText = content
      .replace(/!\[([^\]]*)\]$$([^)]+)$$/g, "") // Remove images
      .replace(/#{1,6}\s/g, "") // Remove headers
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
      .replace(/\*(.*?)\*/g, "$1") // Remove italic
      .replace(/`([^`]+)`/g, "$1") // Remove inline code
      .replace(/\[([^\]]+)\]$$([^)]+)$$/g, "$1") // Remove links, keep text
      .replace(/^\* /gm, "") // Remove list markers
      .replace(/^\d+\. /gm, "") // Remove numbered list markers
      .replace(/^> /gm, "") // Remove blockquote markers
      .trim();

    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength).trim() + "...";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Database className="h-5 w-5 text-primary-foreground" />
            </div>
            <Link href="/">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {t("home.title")}
              </h1>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/basics"
              className="text-base font-medium hover:text-primary transition-colors"
            >
              {t("nav.basics")}
            </Link>
            <Link
              href="/catalog"
              className="text-base font-medium hover:text-primary transition-colors"
            >
              {t("nav.catalog")}
            </Link>
            <Link
              href="/community"
              className="text-base font-medium hover:text-primary transition-colors"
            >
              {t("nav.blog")}
            </Link>
            <Link
              href="/tools"
              className="text-base font-medium hover:text-primary transition-colors"
            >
              {t("nav.tools")}
            </Link>
            <Link
              href="/mix-profiles"
              className="text-base font-medium hover:text-primary transition-colors"
            >
              {t("nav.mixProfiles")}
            </Link>
            <Link
              href="/projects"
              className="text-base font-medium hover:text-primary transition-colors"
            >
              {t("nav.projects")}
            </Link>
            <Link
              href="/about"
              className="text-base font-medium hover:text-primary transition-colors"
            >
              {t("nav.about")}
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10" />
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-5xl font-bold mb-6 text-balance">
            {t("projects.title")}
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            {t("projects.heroDescription")}
          </p>
        </div>
      </section>

      {adminProjects.length > 0 && (
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto">
            <h3 className="text-3xl font-bold mb-8 text-center">
              Featured Research Projects
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminProjects.map((project) => (
                <Card
                  key={project.id}
                  className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50"
                >
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mb-4">
                      <Database className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription className="mb-4">
                      {getExcerpt(project.content)}
                    </CardDescription>
                    <div className="text-sm text-muted-foreground">
                      {new Date(project.date).toLocaleDateString()}
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* International Projects Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-8 text-center">
            International Genomic Projects
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staticProjects.map((project, index) => {
              const IconComponent = project.icon;
              const gradients = [
                "from-primary to-accent",
                "from-secondary to-primary",
                "from-accent to-secondary",
                "from-primary to-secondary",
                "from-accent to-primary",
                "from-secondary to-accent",
              ];
              const gradient = gradients[index % gradients.length];

              return (
                <Card
                  key={index}
                  className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50"
                >
                  <CardHeader>
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center mb-4`}
                    >
                      <IconComponent className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription className="mb-4">
                      {t(project.descriptionKey as string)}
                    </CardDescription>
                    <Button asChild className="w-full">
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t("projects.visitProject")}
                      </a>
                    </Button>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4 bg-card/50">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground mb-2">
            © 2024 STRhub. Advancing genetic research through collaborative
            science.
          </p>
          <p className="text-sm text-muted-foreground">
            Built for the global research community
          </p>
        </div>
      </footer>
    </div>
  );
}

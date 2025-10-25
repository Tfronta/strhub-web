"use client"

import type React from "react"

import {
  Search,
  Database,
  BarChart3,
  FileText,
  Eye,
  Globe2,
  BookOpen,
  Users,
  Wrench,
  Heart,
  Layers,
  Beaker,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { t } = useLanguage()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

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
            <Link href="/basics" className="text-base font-medium hover:text-primary transition-colors">
              {t("nav.basics")}
            </Link>
            <Link href="/catalog" className="text-base font-medium hover:text-primary transition-colors">
              {t("nav.catalog")}
            </Link>
            <Link href="/blog" className="text-base font-medium hover:text-primary transition-colors">
              {t("nav.blog")}
            </Link>
            <Link href="/tools" className="text-base font-medium hover:text-primary transition-colors">
              {t("nav.tools")}
            </Link>
            <Link href="/mix-profiles" className="text-base font-medium hover:text-primary transition-colors">
              {t("nav.mixProfiles")}
            </Link>
            <Link href="/projects" className="text-base font-medium hover:text-primary transition-colors">
              {t("nav.projects")}
            </Link>
            <Link href="/about" className="text-base font-medium hover:text-primary transition-colors">
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
            {t("home.subtitle")}{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Short Tandem Repeats
            </span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">{t("home.description")}</p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-12">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={t("home.searchPlaceholder")}
                className="pl-10 h-12 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" className="absolute right-1 top-1 h-10">
                {t("nav.search")}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Explore STRhub Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">{t("home.exploreSectionTitle")}</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Back to Basics */}
            <Link href="/basics">
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-card to-card/50 h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mb-4">
                    <BookOpen className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle>{t("home.explore.basics.title")}</CardTitle>
                  <CardDescription>{t("home.explore.basics.description")}</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            {/* 2. Catalog */}
            <Link href="/catalog">
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-card to-card/50 h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-lg flex items-center justify-center mb-4">
                    <Database className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <CardTitle>{t("home.explore.catalog.title")}</CardTitle>
                  <CardDescription>{t("home.explore.catalog.description")}</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            {/* 3. Mix Profiles - NEW */}
            <Link href="/mix-profiles">
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-card to-card/50 h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center mb-4">
                    <Layers className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <CardTitle>{t("home.explore.mixProfiles.title")}</CardTitle>
                  <CardDescription>{t("home.explore.mixProfiles.description")}</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            {/* 4. Tools & Pipelines */}
            <Link href="/tools">
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-card to-card/50 h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4">
                    <Wrench className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle>{t("home.explore.tools.title")}</CardTitle>
                  <CardDescription>{t("home.explore.tools.description")}</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            {/* 5. FASTA Generator */}
            <Link href="/tools/fasta-generator">
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-card to-card/50 h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle>{t("home.explore.fastaGenerator.title")}</CardTitle>
                  <CardDescription>{t("home.explore.fastaGenerator.description")}</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            {/* 6. IGV Viewer */}
            <Link href="/tools/igv-viewer">
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-card to-card/50 h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center mb-4">
                    <Eye className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <CardTitle>{t("home.explore.igvViewer.title")}</CardTitle>
                  <CardDescription>{t("home.explore.igvViewer.description")}</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            {/* 7. Projects */}
            <Link href="/projects">
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-card to-card/50 h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center mb-4">
                    <Globe2 className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <CardTitle>{t("home.explore.projects.title")}</CardTitle>
                  <CardDescription>{t("home.explore.projects.description")}</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            {/* 8. Community Hub */}
            <Link href="/blog">
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-card to-card/50 h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <CardTitle>{t("home.explore.communityHub.title")}</CardTitle>
                  <CardDescription>{t("home.explore.communityHub.description")}</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            {/* 9. About */}
            <Link href="/about">
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-card to-card/50 h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <CardTitle>{t("home.explore.about.title")}</CardTitle>
                  <CardDescription>{t("home.explore.about.description")}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">{t("home.featuresSectionTitle")}</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Integrated STR Database */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50 h-full">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mb-4">
                  <Database className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>{t("home.features.integratedDatabase.title")}</CardTitle>
                <CardDescription>{t("home.features.integratedDatabase.description")}</CardDescription>
              </CardHeader>
            </Card>

            {/* 2. Visualization Suite */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50 h-full">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle>{t("home.features.visualizationSuite.title")}</CardTitle>
                <CardDescription>{t("home.features.visualizationSuite.description")}</CardDescription>
              </CardHeader>
            </Card>

            {/* 3. Mixture Simulation Engine */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50 h-full">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center mb-4">
                  <Beaker className="h-6 w-6 text-accent-foreground" />
                </div>
                <CardTitle>{t("home.features.mixtureSimulation.title")}</CardTitle>
                <CardDescription>{t("home.features.mixtureSimulation.description")}</CardDescription>
              </CardHeader>
            </Card>

            {/* 4. FASTA & Metadata Generator */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50 h-full">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>{t("home.features.fastaMetadata.title")}</CardTitle>
                <CardDescription>{t("home.features.fastaMetadata.description")}</CardDescription>
              </CardHeader>
            </Card>

            {/* 5. Educational Resources */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50 h-full">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-accent-foreground" />
                </div>
                <CardTitle>{t("home.features.educationalResources.title")}</CardTitle>
                <CardDescription>{t("home.features.educationalResources.description")}</CardDescription>
              </CardHeader>
            </Card>

            {/* 6. Community & Collaboration */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50 h-full">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle>{t("home.features.communityCollaboration.title")}</CardTitle>
                <CardDescription>{t("home.features.communityCollaboration.description")}</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4 bg-card/50">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground mb-2">
            © 2024 STRhub. Advancing genetic research through collaborative science.
          </p>
          <p className="text-sm text-muted-foreground">Built for the global research community</p>
        </div>
      </footer>
    </div>
  )
}

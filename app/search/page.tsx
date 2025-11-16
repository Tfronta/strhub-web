"use client";

import type React from "react";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Database, Wrench, FileText, Globe, Filter } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";
import { performSearch, getTotalResults, type SearchResultsByType } from "@/lib/search";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(query);
  const [results, setResults] = useState<SearchResultsByType>({
    markers: [],
    markerSections: [],
    tools: [],
    blog: [],
    page: [],
  });
  const { t, language } = useLanguage();

  useEffect(() => {
    if (query) {
      const searchResults = performSearch(query, t, language);
      setResults(searchResults);
    } else {
      setResults({
        markers: [],
        markerSections: [],
        tools: [],
        blog: [],
        page: [],
      });
    }
  }, [query, t, language]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(
        searchTerm.trim()
      )}`;
    }
  };

  const totalResults = getTotalResults(results);

  const renderResultCard = (
    item: typeof results.markers[0],
    icon: React.ReactNode
  ) => (
    <Link key={item.id} href={item.href}>
      <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-card to-card/50 hover:from-primary/5 hover:to-accent/5">
        <CardHeader>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-3 flex-1">
              <div className="mt-1">{icon}</div>
              <div className="flex-1">
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {item.title}
                </CardTitle>
                <CardDescription className="mt-1 line-clamp-2">
                  {item.description}
                </CardDescription>
              </div>
            </div>
            {item.type !== "marker-section" && (
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary border-primary/20 shrink-0"
              >
                {t(`search.types.${item.type === "blog" ? "blog" : item.type}`)}
              </Badge>
            )}
          </div>
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {item.tags.slice(0, 3).map((tag, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="text-xs"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>
      </Card>
    </Link>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Database className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              STRhub
            </h1>
          </Link>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{t("search.title")}</h1>
          {query && (
            <p className="text-lg text-muted-foreground">
              {t("search.resultsFor")}{" "}
              "<span className="font-semibold">{query}</span>"
            </p>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t("search.placeholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
            <Button type="submit" className="absolute right-1 top-1 h-10">
              {t("nav.search")}
            </Button>
          </form>
        </div>

        {/* Results Summary */}
        {query && totalResults > 0 && (
          <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            {t("search.found")} {totalResults}{" "}
            {totalResults === 1 ? t("search.result") : t("search.results")}
          </div>
        )}

        {/* Results */}
        {query && totalResults > 0 ? (
          <div className="space-y-8">
            {/* Markers */}
            {results.markers.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  {t("search.types.markers")} ({results.markers.length})
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.markers.map((marker) =>
                    renderResultCard(marker, <Database className="h-5 w-5 text-primary" />)
                  )}
                </div>
              </section>
            )}

            {/* Marker Sections */}
            {results.markerSections.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  {t("search.types.markerSections")} ({results.markerSections.length})
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.markerSections.map((section) =>
                    renderResultCard(section, <Database className="h-5 w-5 text-primary" />)
                  )}
                </div>
              </section>
            )}

            {/* Tools */}
            {results.tools.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  {t("search.types.tools")} ({results.tools.length})
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.tools.map((tool) =>
                    renderResultCard(tool, <Wrench className="h-5 w-5 text-primary" />)
                  )}
                </div>
              </section>
            )}

            {/* Blog/Articles */}
            {results.blog.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {t("search.types.blog")} ({results.blog.length})
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.blog.map((article) =>
                    renderResultCard(article, <FileText className="h-5 w-5 text-primary" />)
                  )}
                </div>
              </section>
            )}

            {/* Pages */}
            {results.page.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  {t("search.types.page")} ({results.page.length})
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.page.map((page) =>
                    renderResultCard(page, <Globe className="h-5 w-5 text-primary" />)
                  )}
                </div>
              </section>
            )}
          </div>
        ) : query ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {t("search.noResults")}
            </h3>
            <p className="text-muted-foreground mb-4">
              {t("search.noResultsDescription")}{" "}
              "<span className="font-semibold">{query}</span>"
            </p>
            <div className="space-y-2 text-sm text-muted-foreground mb-6">
              <p>{t("search.trySearching")}</p>
              <ul className="list-disc list-inside space-y-1">
                <li>{t("search.suggestions.markers")}</li>
                <li>{t("search.suggestions.tools")}</li>
                <li>{t("search.suggestions.topics")}</li>
              </ul>
            </div>
            <Link href="/catalog">
              <Button variant="outline" className="mt-4">
                {t("catalog.viewAll")}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {t("search.startSearch")}
            </h3>
            <p className="text-muted-foreground">
              {t("search.enterSearchTerm")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
}

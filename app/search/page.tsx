"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Search, Database, Filter } from "lucide-react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import Link from "next/link"

// Mock search data
const searchableMarkers = [
  {
    id: "fga",
    name: "FGA",
    fullName: "Fibrinogen Alpha Chain",
    chromosome: "4",
    motif: "TTTC",
    type: "Tetranucleotide",
    category: "CODIS Core",
    description: "Tetranucleotide STR located on chromosome 4, part of CODIS core loci",
  },
  {
    id: "d18s51",
    name: "D18S51",
    fullName: "DNA Segment on Chromosome 18",
    chromosome: "18",
    motif: "AGAA",
    type: "Tetranucleotide",
    category: "CODIS Core",
    description: "Tetranucleotide STR marker used in forensic genetics",
  },
  {
    id: "d21s11",
    name: "D21S11",
    fullName: "DNA Segment on Chromosome 21",
    chromosome: "21",
    motif: "TCTA/TCTG",
    type: "Complex",
    category: "CODIS Core",
    description: "Complex STR marker with multiple repeat motifs",
  },
  {
    id: "th01",
    name: "TH01",
    fullName: "Tyrosine Hydroxylase 1",
    chromosome: "11",
    motif: "TCAT",
    type: "Tetranucleotide",
    category: "CODIS Core",
    description: "Tetranucleotide STR in the tyrosine hydroxylase gene",
  },
  {
    id: "d3s1358",
    name: "D3S1358",
    fullName: "DNA Segment on Chromosome 3",
    chromosome: "3",
    motif: "TCTA/TCTG",
    type: "Complex",
    category: "CODIS Core",
    description: "Complex STR marker on chromosome 3",
  },
  {
    id: "vwa",
    name: "vWA",
    fullName: "von Willebrand Factor A",
    chromosome: "12",
    motif: "TCTA/TCTG",
    type: "Complex",
    category: "CODIS Core",
    description: "Complex STR in the von Willebrand factor gene",
  },
]

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [searchTerm, setSearchTerm] = useState(query)
  const [results, setResults] = useState<typeof searchableMarkers>([])

  useEffect(() => {
    if (query) {
      const filtered = searchableMarkers.filter((marker) => {
        const searchLower = query.toLowerCase()
        return (
          marker.name.toLowerCase().includes(searchLower) ||
          marker.fullName.toLowerCase().includes(searchLower) ||
          marker.description.toLowerCase().includes(searchLower) ||
          marker.motif.toLowerCase().includes(searchLower) ||
          marker.chromosome.includes(searchLower)
        )
      })
      setResults(filtered)
    }
  }, [query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchTerm.trim())}`
    }
  }

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
          <h1 className="text-4xl font-bold mb-4">Search Results</h1>
          {query && (
            <p className="text-lg text-muted-foreground">
              Results for "<span className="font-semibold">{query}</span>"
            </p>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search markers, descriptions, motifs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
            <Button type="submit" className="absolute right-1 top-1 h-10">
              Search
            </Button>
          </form>
        </div>

        {/* Results */}
        {query && (
          <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            Found {results.length} marker{results.length !== 1 ? "s" : ""}
          </div>
        )}

        {results.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((marker) => (
              <Link key={marker.id} href={`/marker/${marker.id}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-card to-card/50 hover:from-primary/5 hover:to-accent/5">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                          {marker.name}
                        </CardTitle>
                        <CardDescription className="font-medium">{marker.fullName}</CardDescription>
                      </div>
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                        {marker.category}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Chromosome:</span>
                        <span className="font-medium">{marker.chromosome}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Motif:</span>
                        <span className="font-mono font-medium">{marker.motif}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="font-medium">{marker.type}</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{marker.description}</p>

                    <div className="flex justify-end mt-4 pt-4 border-t">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <div className="w-2 h-2 bg-accent rounded-full"></div>
                        <div className="w-2 h-2 bg-secondary rounded-full"></div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No results found</h3>
            <p className="text-muted-foreground mb-4">
              No markers found for "<span className="font-semibold">{query}</span>"
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Try searching for:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Marker names (FGA, D18S51, TH01)</li>
                <li>Full names (Fibrinogen Alpha Chain)</li>
                <li>Chromosome numbers (4, 18, 21)</li>
                <li>Motifs (TTTC, AGAA, TCTA)</li>
              </ul>
            </div>
            <Link href="/catalog">
              <Button className="mt-4">Browse All Markers</Button>
            </Link>
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Start your search</h3>
            <p className="text-muted-foreground">Enter a search term to find STR markers</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResults />
    </Suspense>
  )
}

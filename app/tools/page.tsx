import { Wrench, Code, Play, Download, ExternalLink, Github } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ToolsPage() {
  const tools = [
    {
      name: "HipSTR",
      description: "Tool for genotyping short tandem repeats from Illumina sequencing data",
      category: "Genotyping",
      language: "C++",
      features: ["High accuracy", "Handles complex STRs", "Population-scale analysis"],
      github: "https://github.com/HipSTR-Tool/HipSTR",
      tutorial: true,
    },
    {
      name: "STRspy",
      description: "Python package for STR analysis and visualization",
      category: "Analysis",
      language: "Python",
      features: ["Interactive plots", "Statistical analysis", "Easy integration"],
      github: "https://github.com/example/strspy",
      tutorial: true,
    },
    {
      name: "GangSTR",
      description: "Tool for genome-wide profiling of tandem repeats from short reads",
      category: "Profiling",
      language: "C++",
      features: ["Genome-wide analysis", "Short read support", "High throughput"],
      github: "https://github.com/gymreklab/GangSTR",
      tutorial: true,
    },
  ]

  const pipelines = [
    {
      name: "STR-Nextflow",
      description: "Nextflow pipeline for comprehensive STR analysis",
      type: "Nextflow",
      features: ["Containerized", "Scalable", "Reproducible"],
      colab: true,
    },
    {
      name: "Forensic STR Workflow",
      description: "End-to-end pipeline for forensic STR analysis",
      type: "Snakemake",
      features: ["Quality control", "Allele calling", "Report generation"],
      colab: true,
    },
  ]

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
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            ← Back to STRhub
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-8 px-4">
        <div className="container mx-auto text-left">
          <h2 className="text-4xl font-bold mb-6">Powerful Tools for STR Analysis</h2>
          <p className="text-xl text-muted-foreground text-pretty">
            Comprehensive collection of tools, pipelines, and tutorials for Short Tandem Repeat analysis. From
            genotyping to visualization, find everything you need for your research.
          </p>
        </div>
      </section>

      {/* Tools Section */}
      <section className="pt-8 pb-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-12">Analysis Tools</h3>
          <div className="grid lg:grid-cols-2 gap-6">
            {tools.map((tool, index) => (
              <Card key={index} className="border-0 bg-gradient-to-br from-card to-card/50">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">{tool.name}</CardTitle>
                      <CardDescription className="text-base mb-4">{tool.description}</CardDescription>
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="secondary">{tool.category}</Badge>
                        <Badge variant="outline">{tool.language}</Badge>
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
                      <Button size="sm" variant="outline" asChild>
                        <a href={tool.github} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4 mr-1" />
                          GitHub
                        </a>
                      </Button>
                      {tool.tutorial && (
                        <Button size="sm">
                          <Play className="h-4 w-4 mr-1" />
                          Tutorial
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

      {/* Pipelines Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-12">Workflow Pipelines</h3>
          <div className="grid lg:grid-cols-2 gap-6">
            {pipelines.map((pipeline, index) => (
              <Card key={index} className="border-0 bg-gradient-to-br from-card to-card/50">
                <CardHeader>
                  <CardTitle className="text-xl mb-2">{pipeline.name}</CardTitle>
                  <CardDescription className="text-base mb-4">{pipeline.description}</CardDescription>
                  <Badge variant="secondary" className="w-fit">
                    {pipeline.type}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Features:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {pipeline.features.map((feature, idx) => (
                          <li key={idx}>• {feature}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      {pipeline.colab && (
                        <Button size="sm" variant="outline">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Colab Example
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
                <CardDescription>Learn the fundamentals of STR genotyping with HipSTR</CardDescription>
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
                <CardDescription>Build scalable STR analysis pipelines with Nextflow</CardDescription>
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
                <CardDescription>Analyze STR data using Python and popular libraries</CardDescription>
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
  )
}

"use client"

import { useState, useEffect } from "react"
import { Users, MessageSquare, BookOpen, Calendar, ArrowRight } from "lucide-react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface BlogPost {
  id: string
  title: string
  content: string
  category: "Blog" | "Projects" | "Educational"
  date: string
  published: boolean
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fallbackPosts = [
    {
      id: "fallback-1",
      title: "Getting Started with HipSTR: A Comprehensive Tutorial",
      content:
        "Learn how to use HipSTR for STR genotyping from sequencing data with practical examples and best practices.",
      author: "Dr. Sarah Chen",
      date: "2024-01-15",
      category: "Tutorial" as const,
      readTime: "12 min read",
      published: true,
    },
    {
      id: "fallback-2",
      title: "Population Genetics Insights from Global STR Databases",
      content:
        "Exploring allele frequency variations across different populations and their implications for forensic analysis.",
      author: "Prof. Miguel Rodriguez",
      date: "2024-01-10",
      category: "Research" as const,
      readTime: "8 min read",
      published: true,
    },
    {
      id: "fallback-3",
      title: "Community Collaboration: Building Better STR Pipelines",
      content: "How the forensic genetics community is working together to standardize STR analysis workflows.",
      author: "STRhub Team",
      date: "2024-01-05",
      category: "Community" as const,
      readTime: "6 min read",
      published: true,
    },
  ]

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      const response = await fetch("/api/content?category=Blog")
      if (response.ok) {
        const data = await response.json()
        setPosts(data.entries || [])
      }
    } catch (error) {
      console.error("Failed to load blog posts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const displayPosts = posts.length > 0 ? posts : fallbackPosts

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getExcerpt = (content: string, maxLength = 150) => {
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
      .trim()

    if (plainText.length <= maxLength) return plainText
    return plainText.substring(0, maxLength).trim() + "..."
  }

  const getCategoryBadge = (category: string) => {
    const categoryMap: Record<string, string> = {
      Blog: "Tutorial",
      Projects: "Research",
      Educational: "Community",
    }
    return categoryMap[category] || category
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Community Hub
            </h1>
          </Link>
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            ← Back to STRhub
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Connect, Learn, Collaborate</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Join the global community of researchers, forensic experts, and students advancing STR analysis through
            shared knowledge and collaborative research.
          </p>
        </div>
      </section>

      {/* Community Features */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card className="border-0 bg-gradient-to-br from-card to-card/50">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>User Experiences</CardTitle>
                <CardDescription>
                  Share your research findings, case studies, and practical insights with the community
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-card to-card/50">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle>Tutorials & Guides</CardTitle>
                <CardDescription>Step-by-step tutorials for tools, pipelines, and analysis techniques</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-card to-card/50">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-accent-foreground" />
                </div>
                <CardTitle>Collaborations</CardTitle>
                <CardDescription>
                  Connect with researchers worldwide for joint projects and data sharing
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-12">Recent Posts</h3>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-4">Loading posts...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {displayPosts.map((post) => (
                <Card
                  key={post.id}
                  className="border-0 bg-gradient-to-br from-card to-card/50 hover:shadow-lg transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{getCategoryBadge(post.category)}</Badge>
                        </div>
                        <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                        <CardDescription className="text-base">{getExcerpt(post.content)}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(post.date)}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        Read More <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold mb-6">Join the Conversation</h3>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Have insights to share? Want to collaborate on research? Join our growing community of STR enthusiasts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-primary to-accent">
              Share Your Experience
            </Button>
            <Button size="lg" variant="outline">
              Browse Discussions
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

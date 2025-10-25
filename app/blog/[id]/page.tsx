"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Calendar, ArrowLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import Link from "next/link"

interface BlogPost {
  id: string
  title: string
  content: string
  category: "Blog" | "Projects" | "Educational"
  date: string
  published: boolean
}

export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      loadPost(params.id as string)
    }
  }, [params.id])

  const loadPost = async (id: string) => {
    try {
      const response = await fetch("/api/content")
      if (response.ok) {
        const data = await response.json()
        const foundPost = data.entries.find((entry: BlogPost) => entry.id === id)
        setPost(foundPost || null)
      }
    } catch (error) {
      console.error("Failed to load post:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getCategoryBadge = (category: string) => {
    const categoryMap: Record<string, string> = {
      Blog: "Tutorial",
      Projects: "Research",
      Educational: "Community",
    }
    return categoryMap[category] || category
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading post...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist.</p>
          <Link href="/blog">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link href="/blog">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </header>

      {/* Article */}
      <article className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Article Header */}
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary">{getCategoryBadge(post.category)}</Badge>
          </div>
          <h1 className="text-4xl font-bold mb-6 text-balance">{post.title}</h1>
          <div className="flex items-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(post.date)}</span>
            </div>
          </div>
        </header>

        {/* Article Body */}
        <Card className="border-0 bg-gradient-to-br from-card to-card/50">
          <CardContent className="p-8">
            <MarkdownRenderer
              content={post.content}
              className="prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground"
            />
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="mt-12 flex justify-between">
          <Link href="/blog">
            <Badge variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-colors">
              ← Back to Blog
            </Badge>
          </Link>
        </div>
      </article>
    </div>
  )
}

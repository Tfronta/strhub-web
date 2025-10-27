"use client"
import { ArrowLeft, BookOpen, User, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { notFound } from "next/navigation"
import MarkdownArticle from "@/components/MarkdownArticle"
import { useEffect, useState } from "react"

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch("/api/back-to-basics/" + params.slug)
        const { item } = await res.json()
        setPost(item)
      } catch (error) {
        console.error("Error fetching post:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [params.slug])

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>
  }

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/basics" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Articles
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              STRhub
            </span>
          </Link>
        </div>
      </header>

      {/* Article Content */}
      <article className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Article Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4 text-balance">{post.fields.title}</h1>
          <p className="text-xl text-muted-foreground mb-6 text-pretty">{post.fields.summary}</p>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            {post.fields.authors && post.fields.authors.length > 0 && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {post.fields.authors.map((author, index) => (
                  <span key={index}>
                    {author.name}
                    {index < post.fields.authors.length - 1 && ", "}
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {post.fields.postReadMinutes} min read
            </div>
          </div>
        </header>

        {/* Article Body */}
        <Card className="border-0 bg-gradient-to-br from-card to-card/50">
          <CardContent className="p-8">
            <MarkdownArticle markdown={post.fields.bodyMd || ""} />
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="mt-12 flex justify-between">
          <Link href="/basics">
            <Badge variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-colors">
              Back to Articles
            </Badge>
          </Link>
        </div>
      </article>
    </div>
  )
}

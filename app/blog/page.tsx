"use client"

import { useState, useEffect } from "react"
import { Users, MessageSquare, BookOpen, Calendar, ArrowRight, Share2, Code, Handshake, Sparkles, FileText, Database, Wrench } from "lucide-react"
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

interface BlogPost {
  id: string
  title: string
  content: string
  category: "Blog" | "Projects" | "Educational"
  date: string
  published: boolean
}

export default function BlogPage() {
  const { t } = useLanguage()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const fallbackPosts: BlogPost[] = []

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      const response = await fetch("/api/content?category=Educational")
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission - you can implement this based on your backend
    console.log("Form submitted:", formData)
    // Reset form
    setFormData({ name: "", email: "", subject: "", message: "" })
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
              {t("nav.blog")}
            </h1>
          </Link>
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            ← {t("common.backToHome")}
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">{t("communityHub.hero.title")}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty mb-8">
            {t("communityHub.hero.subtitle")}
          </p>
          <Button size="lg" className="bg-gradient-to-r from-primary to-accent" asChild>
            <Link href="#contact">{t("communityHub.hero.cta")}</Link>
          </Button>
        </div>
      </section>

      {/* How You Can Be Part of This */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-4 text-center">{t("communityHub.howToJoin.title")}</h3>
          <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto text-center">
            {t("communityHub.howToJoin.intro")}
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="border-0 bg-gradient-to-br from-card to-card/50">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mb-4">
                  <Share2 className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>{t("communityHub.howToJoin.cards.experience.title")}</CardTitle>
                <CardDescription>{t("communityHub.howToJoin.cards.experience.body")}</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-card to-card/50">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle>{t("communityHub.howToJoin.cards.tutorials.title")}</CardTitle>
                <CardDescription>{t("communityHub.howToJoin.cards.tutorials.body")}</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-card to-card/50">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center mb-4">
                  <Handshake className="h-6 w-6 text-accent-foreground" />
                </div>
                <CardTitle>{t("communityHub.howToJoin.cards.collaborations.title")}</CardTitle>
                <CardDescription>{t("communityHub.howToJoin.cards.collaborations.body")}</CardDescription>
              </CardHeader>
            </Card>
          </div>
          <div className="text-center">
            <Button size="lg" variant="outline" asChild>
              <Link href="#contact">{t("communityHub.howToJoin.cta")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Early Contributors & Partner Labs */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-4 text-center">{t("communityHub.earlyContributors.title")}</h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto text-center">
            {t("communityHub.earlyContributors.body")}
          </p>
          <div className="flex justify-center">
            <Card className="border-0 bg-muted/50 max-w-md">
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">{t("communityHub.earlyContributors.comingSoon")}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-2">{t("communityHub.recentPosts.title")}</h3>
          <p className="text-muted-foreground mb-12">{t("communityHub.recentPosts.subtitle")}</p>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-4">{t("communityHub.recentPosts.loading")}</p>
            </div>
          ) : displayPosts.length > 0 ? (
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
                          <Badge variant="secondary">{post.category}</Badge>
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
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/basics/${post.id}`}>
                          {t("communityHub.recentPosts.readMore")} <ArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">{t("communityHub.recentPosts.loading")}</p>
            </div>
          )}
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-4 text-center">{t("communityHub.comingSoon.title")}</h3>
          <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto text-center">
            {t("communityHub.comingSoon.intro")}
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-0 bg-gradient-to-br from-card to-card/50">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mb-4">
                  <Database className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>{t("communityHub.comingSoon.cards.structureBrowser.title")}</CardTitle>
                <CardDescription>{t("communityHub.comingSoon.cards.structureBrowser.body")}</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-card to-card/50">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle>{t("communityHub.comingSoon.cards.caseStudies.title")}</CardTitle>
                <CardDescription>{t("communityHub.comingSoon.cards.caseStudies.body")}</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-card to-card/50">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center mb-4">
                  <Wrench className="h-6 w-6 text-accent-foreground" />
                </div>
                <CardTitle>{t("communityHub.comingSoon.cards.pipelines.title")}</CardTitle>
                <CardDescription>{t("communityHub.comingSoon.cards.pipelines.body")}</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact / Join the Conversation */}
      <section id="contact" className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-2xl">
          <Card className="border-0 bg-gradient-to-br from-card to-card/50">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">{t("communityHub.contact.title")}</CardTitle>
              <CardDescription className="mt-2">{t("communityHub.contact.intro")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("about.formName")}</Label>
                    <Input
                      id="name"
                      placeholder={t("about.formNamePlaceholder")}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("about.formEmail")}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("about.formEmailPlaceholder")}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">{t("about.formSubject")}</Label>
                  <Input
                    id="subject"
                    placeholder={t("about.formSubjectPlaceholder")}
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">{t("about.formMessage")}</Label>
                  <Textarea
                    id="message"
                    placeholder={t("communityHub.contact.messagePlaceholder")}
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  {t("about.formSend")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

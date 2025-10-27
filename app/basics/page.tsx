import { BookOpen, FileText, Dna, Search, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

function getIconForPost(keywords: string[]): typeof FileText {
  const keywordString = keywords.join(" ").toLowerCase()

  if (keywordString.includes("dna") || keywordString.includes("pcr") || keywordString.includes("str")) {
    return Dna
  }
  if (keywordString.includes("search") || keywordString.includes("terminology")) {
    return Search
  }
  return FileText
}

export default async function BasicsPage() {
  const res = await fetch('/api/back-to-basics', { next: { revalidate: 60 } });
  const { items: posts } = await res.json();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Back to Basics
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
          <h2 className="text-4xl font-bold mb-6">Understanding the Fundamentals</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Master the essential concepts in bioinformatics and forensic genetics. From file formats to flanking
            regions, build a solid foundation for STR analysis.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {posts.map((post) => {
              const IconComponent = getIconForPost(post.fields.keywords)
              const slug = post.fields.slug || post.sys.id

              return (
                <Card
                  key={post.sys.id}
                  className="border-0 bg-gradient-to-br from-card to-card/50 hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mb-4">
                      <IconComponent className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-2xl">{post.fields.title}</CardTitle>
                    <CardDescription>{post.fields.summary}</CardDescription>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {post.fields.postReadMinutes} min read
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Topics covered:</p>
                      <div className="flex flex-wrap gap-2">
                        {post.fields.keywords.map((keyword, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Link href={`/basics/${slug}`}>
                      <Button className="w-full mt-4">
                        Read Article
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

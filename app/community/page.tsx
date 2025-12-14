"use client";

import { useState, useEffect } from "react";
import {
  Users,
  MessageSquare,
  BookOpen,
  Calendar,
  ArrowRight,
  Share2,
  Code,
  Handshake,
  Sparkles,
  FileText,
  Database,
  Wrench,
} from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";
import {
  BackToBasicsCard,
  type BackToBasicsPost,
} from "@/components/back-to-basics/BackToBasicsCard";
import { PageTitle } from "@/components/page-title";
import { useToast } from "@/hooks/use-toast";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  category: "Blog" | "Projects" | "Educational";
  date: string;
  published: boolean;
}

export default function BlogPage() {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [recentPosts, setRecentPosts] = useState<BackToBasicsPost[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const fallbackPosts: BlogPost[] = [];

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    loadRecentPosts();
  }, [language]);

  const loadPosts = async () => {
    try {
      const response = await fetch("/api/content?category=Educational");
      if (response.ok) {
        const data = await response.json();
        setPosts(data.entries || []);
      }
    } catch (error) {
      console.error("Failed to load blog posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRecentPosts = async () => {
    setIsLoadingPosts(true);
    try {
      const response = await fetch(`/api/back-to-basics?locale=${language}`);
      if (response.ok) {
        const data = await response.json();
        const allPosts: BackToBasicsPost[] = data.items || [];

        // Show the most recent posts (limit to 2-4 posts)
        // Posts are already ordered by -sys.createdAt from the API
        const recentPosts = allPosts.slice(0, 4);

        setRecentPosts(recentPosts);
      }
    } catch (error) {
      console.error("Failed to load recent posts:", error);
      setRecentPosts([]);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const displayPosts = posts.length > 0 ? posts : fallbackPosts;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
      .trim();

    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength).trim() + "...";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Set form error to display in the form
        setFormError(data.error || "Failed to send message");
        return;
      }

      // Success
      toast({
        title: t("about.formSuccess") || "Message sent!",
        description:
          t("about.formSuccessDescription") ||
          "Thank you for contacting us. We'll get back to you soon.",
      });

      // Reset form and clear errors
      setFormData({ name: "", email: "", subject: "", message: "" });
      setFormError(null);
    } catch (error: any) {
      // Network or other errors
      setFormError(
        error.message || "Failed to send message. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 md:px-0 py-8 space-y-6">
        {/* Hero Section */}
        <section className="border-b border-border pb-4">
          <PageTitle
            title={t("nav.blog")}
            description={t("communityHub.hero.subtitle")}
          />
          <div className="mt-5">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-accent"
              asChild
            >
              <Link href="#contact">{t("communityHub.hero.cta")}</Link>
            </Button>
          </div>
        </section>

        {/* How You Can Be Part of This */}
        <section className="pt-4">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            {t("communityHub.howToJoin.title")}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            {t("communityHub.howToJoin.intro")}
          </p>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <Card className="border-0 bg-gradient-to-br from-card to-card/50">
              <CardHeader>
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <Share2 className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>
                  {t("communityHub.howToJoin.cards.experience.title")}
                </CardTitle>
                <CardDescription>
                  {t("communityHub.howToJoin.cards.experience.body")}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-card to-card/50">
              <CardHeader>
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>
                  {t("communityHub.howToJoin.cards.tutorials.title")}
                </CardTitle>
                <CardDescription>
                  {t("communityHub.howToJoin.cards.tutorials.body")}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-card to-card/50">
              <CardHeader>
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <Handshake className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>
                  {t("communityHub.howToJoin.cards.collaborations.title")}
                </CardTitle>
                <CardDescription>
                  {t("communityHub.howToJoin.cards.collaborations.body")}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
          <div className="mt-6">
            <Button size="lg" variant="outline" asChild>
              <Link href="#contact">{t("communityHub.howToJoin.cta")}</Link>
            </Button>
          </div>
        </section>

        {/* Early Contributors & Partner Labs */}
        <section className="border-t border-border pt-12">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            {t("communityHub.earlyContributors.title")}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            {t("communityHub.earlyContributors.body")}
          </p>
          <div className="mt-6">
            <Card className="border-0 bg-muted/50 max-w-md py-3">
              <CardContent className="py-0">
                <p className="text-muted-foreground">
                  {t("communityHub.earlyContributors.comingSoon")}
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Recent Posts */}
        <section className="border-t border-border pt-12">
          <div className="flex items-start justify-between mb-2">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              {t("communityHub.recentPosts.title")}
            </h2>
            <Link
              href="/basics"
              className="text-sm font-medium text-primary hover:underline mt-1"
            >
              {t("communityHub.recentPosts.viewAll")}
            </Link>
          </div>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground mb-8">
            {t("communityHub.recentPosts.subtitle")}
          </p>

          {isLoadingPosts ? (
            <div className="py-8">
              <p className="text-muted-foreground">
                {t("communityHub.recentPosts.loading")}
              </p>
            </div>
          ) : recentPosts.length > 0 ? (
            <div className="grid lg:grid-cols-2 gap-8">
              {recentPosts.map((post) => (
                <BackToBasicsCard key={post.sys.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="py-8">
              <p className="text-muted-foreground">
                {t("communityHub.recentPosts.noPosts")}
              </p>
            </div>
          )}
        </section>

        {/* Coming Soon */}
        <section className="border-t border-border pt-12">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            {t("communityHub.comingSoon.title")}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground mb-8">
            {t("communityHub.comingSoon.intro")}
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-0 bg-gradient-to-br from-card to-card/50">
              <CardHeader>
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <Database className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>
                  {t("communityHub.comingSoon.cards.structureBrowser.title")}
                </CardTitle>
                <CardDescription>
                  {t("communityHub.comingSoon.cards.structureBrowser.body")}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-card to-card/50">
              <CardHeader>
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>
                  {t("communityHub.comingSoon.cards.caseStudies.title")}
                </CardTitle>
                <CardDescription>
                  {t("communityHub.comingSoon.cards.caseStudies.body")}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-card to-card/50">
              <CardHeader>
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <Wrench className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>
                  {t("communityHub.comingSoon.cards.pipelines.title")}
                </CardTitle>
                <CardDescription>
                  {t("communityHub.comingSoon.cards.pipelines.body")}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Contact / Join the Conversation */}
        <section id="contact" className="border-t border-border pt-12">
          <Card className="border-0 bg-gradient-to-br from-card to-card/50">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">
                {t("communityHub.contact.title")}
              </CardTitle>
              <CardDescription className="mt-2">
                {t("communityHub.contact.intro")}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("about.formName")}</Label>
                    <Input
                      id="name"
                      placeholder={t("about.formNamePlaceholder")}
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("about.formEmail")}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("about.formEmailPlaceholder")}
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">{t("about.formSubject")}</Label>
                  <Input
                    id="subject"
                    placeholder={t("about.formSubjectPlaceholder")}
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">{t("about.formMessage")}</Label>
                  <Textarea
                    id="message"
                    placeholder={t("communityHub.contact.messagePlaceholder")}
                    rows={5}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                    disabled={isSubmitting}
                  />
                </div>
                {formError && (
                  <Alert variant="destructive">
                    <AlertDescription>{formError}</AlertDescription>
                  </Alert>
                )}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? t("about.formSending") || "Sending..."
                    : t("about.formSend")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}

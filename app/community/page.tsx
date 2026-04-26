"use client";

import { useState } from "react";
import { Github, Mail, MessageSquare, Users } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";
import { PageTitle } from "@/components/page-title";

const CONTACT_EMAIL = "contact@strhub.app";

const GITHUB_DISCUSSIONS_URL =
  "https://github.com/Tfronta/strhub-web/discussions";

/** Matches production / other STRhub cards: soft gradient surface, subtle border, generous padding. */
const communityCardShell =
  "rounded-xl border border-border bg-gradient-to-br from-card to-card/50 p-8 shadow-sm dark:border-white/10 dark:ring-1 dark:ring-white/10 dark:shadow-[0_20px_40px_rgba(0,0,0,0.6)]";

export default function CommunityPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(formData.subject);
    const body = encodeURIComponent(formData.message);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setFormData({ subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 md:px-0 py-8 space-y-4">
        {/* Section 1 — Hero */}
        <section className="border-b border-border pb-6">
          <PageTitle title={t("nav.blog")} />
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-4 shadow-sm">
              <span className="text-[28px] font-medium tabular-nums tracking-tight text-foreground">
                7+
              </span>
              <span className="text-xs text-muted-foreground">
                {t("communityHub.metrics.countries")}
              </span>
            </div>
            <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-4 shadow-sm">
              <span className="text-[28px] font-medium tabular-nums tracking-tight text-foreground">
                100%
              </span>
              <span className="text-xs text-muted-foreground">
                {t("communityHub.metrics.organicGrowth")}
              </span>
            </div>
            <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-4 shadow-sm">
              <span className="text-[28px] font-medium tabular-nums tracking-tight text-foreground">
                MIT
              </span>
              <span className="text-xs text-muted-foreground">
                {t("communityHub.metrics.openSourceLicense")}
              </span>
            </div>
          </div>
          <p className="mt-4 text-lg text-pretty leading-relaxed text-muted-foreground">
            {t("communityHub.hero.subtitle")}
          </p>
          <p className="mt-4 text-base text-pretty leading-relaxed text-muted-foreground">
            {t("communityHub.hero.reality")}
          </p>
        </section>

        {/* Left: GitHub + About teaser | Right: Contact (full row height) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch">
          <div className="flex h-full flex-col gap-4">
            <Card className={`h-full ${communityCardShell}`}>
              <CardHeader className="px-0 pb-4">
                <div className="mb-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary">
                  <Github
                    className="h-6 w-6 text-primary-foreground"
                    aria-hidden
                  />
                </div>
                <CardTitle className="text-2xl">
                  {t("communityHub.discussion.title")}
                </CardTitle>
                <CardDescription className="mt-2 text-base leading-relaxed">
                  {t("communityHub.discussion.body")}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0 pt-0">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                  <a
                    href={GITHUB_DISCUSSIONS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("communityHub.discussion.cta")}
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className={communityCardShell}>
              <CardHeader className="px-0 pb-2">
                <div className="mb-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary">
                  <Users
                    className="h-6 w-6 text-primary-foreground"
                    aria-hidden
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-3 px-0 pt-0 text-sm leading-relaxed text-muted-foreground">
                <p className="text-pretty">{t("communityHub.aboutTeaser.body")}</p>
                <Link
                  href="/about"
                  className="inline-block font-medium text-primary hover:underline"
                >
                  {t("communityHub.aboutTeaser.linkText")}
                </Link>
              </CardContent>
            </Card>
          </div>

          <Card
            id="contact"
            className={`flex h-full min-h-0 flex-col ${communityCardShell}`}
          >
            <CardHeader className="px-0 pb-4">
              <div className="mb-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary">
                <MessageSquare
                  className="h-6 w-6 text-primary-foreground"
                  aria-hidden
                />
              </div>
              <CardTitle className="text-2xl">
                {t("communityHub.contact.title")}
              </CardTitle>
              <CardDescription className="mt-2 text-base leading-relaxed">
                {t("communityHub.contact.intro")}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col px-0 pt-0">
              <form
                onSubmit={handleSubmit}
                className="flex flex-1 flex-col space-y-4"
                noValidate
              >
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
                  />
                </div>
                <Button
                  type="submit"
                  className="mt-auto inline-flex w-full items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Mail className="h-4 w-4 shrink-0" aria-hidden />
                  {t("about.formSend")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

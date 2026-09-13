"use client";

import type React from "react";
import {
  BookOpen,
  FlaskConical,
  Github,
  Heart,
  Mail,
  MessageSquare,
  Share2,
  Target,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import { translations } from "@/lib/translations";
import { PageTitle } from "@/components/page-title";
import { getCommunityContributorsForGrid, getContributorInstitutionLabel } from "@/lib/communityContributors";

const CONTACT_EMAIL = "contact@strhub.app";
const GITHUB_DISCUSSIONS_URL =
  "https://github.com/Tfronta/strhub-web/discussions";

const HOW_TO_JOIN = [
  { key: "experience", icon: Share2 },
  { key: "tutorials", icon: BookOpen },
  { key: "collaborations", icon: FlaskConical },
] as const;

export default function AboutPage() {
  const { language, t } = useLanguage();
  const trans = translations[language].about;
  const { firstRow, remaining } = getCommunityContributorsForGrid();
  const [formData, setFormData] = useState({ subject: "", message: "" });

  // Deep links: /about#get-involved, /about#contact (also used by the old
  // /community redirect).
  useEffect(() => {
    const id = window.location.hash.replace(/^#/, "");
    if (!id) return;
    const el = document.getElementById(id);
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(formData.subject);
    const body = encodeURIComponent(formData.message);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setFormData({ subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-0 py-8 space-y-6">
        <PageTitle title={t("about.title")} />
        <div className="space-y-8">
          {/* First row: Mission and Team */}
          <div className="grid items-stretch lg:grid-cols-2 gap-8">
            {/* Mission */}
            <Card className="border-0 bg-gradient-to-br from-card to-card/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary">
                    <Target className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-2xl">{trans.mission}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {trans.missionP1}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {trans.missionP2}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {trans.missionP3}
                </p>
              </CardContent>
            </Card>

            {/* Team */}
            <Card className="border-0 bg-gradient-to-br from-card to-card/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary">
                    <Users className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-2xl">{trans.team}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {trans.teamP1.split("**").map((part, index) => 
                    index % 2 === 1 ? (
                      <strong key={index}>{part}</strong>
                    ) : (
                      <span key={index}>{part}</span>
                    )
                  )}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {trans.teamP2}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {trans.teamP3}
                </p>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  <a
                    href="https://orcid.org/0000-0002-6873-7813"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {trans.teamP4}
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Community Contributors */}
          <section className="border-t border-border pt-12">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              {t("communityHub.communityContributors.title")}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              {t("communityHub.communityContributors.subtitle")}
            </p>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              {t("communityHub.communityContributors.disclaimer")}
            </p>
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {firstRow.map((contributor) => (
                  <Card
                    key={contributor.name}
                    className="border-0 border-l-4 border-solid border-l-[#0099a3] bg-gradient-to-br from-card to-card/50 h-full py-0"
                  >
                    <CardHeader className="gap-0.5 px-4 py-3">
                      <p className="font-bold text-foreground leading-snug">
                        {contributor.name}
                      </p>
                      <p className="text-sm leading-snug text-muted-foreground">
                        {getContributorInstitutionLabel(contributor, t)}
                      </p>
                      <p className="text-sm leading-snug text-muted-foreground">
                        {t(
                          `communityHub.communityContributors.countries.${contributor.country}`
                        )}
                      </p>
                    </CardHeader>
                  </Card>
                ))}
              </div>
              {remaining.length > 0 && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {remaining.map((contributor) => (
                    <Card
                      key={contributor.name}
                      className="border-0 border-l-4 border-solid border-l-[#0099a3] bg-gradient-to-br from-card to-card/50 h-full py-0"
                    >
                      <CardHeader className="gap-0.5 px-4 py-3">
                        <p className="font-bold text-foreground leading-snug">
                          {contributor.name}
                        </p>
                        <p className="text-sm leading-snug text-muted-foreground">
                          {getContributorInstitutionLabel(contributor, t)}
                        </p>
                        <p className="text-sm leading-snug text-muted-foreground">
                          {t(
                            `communityHub.communityContributors.countries.${contributor.country}`
                          )}
                        </p>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Get involved (formerly the Community page) */}
          <section id="get-involved" className="scroll-mt-24 border-t border-border pt-12">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              {t("communityHub.getInvolved")}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              {t("communityHub.hero.subtitle")}
            </p>

            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)]">
              {/* GitHub Discussions */}
              <Card className="border-0 bg-gradient-to-br from-card to-card/50 flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary">
                      <Github className="h-5 w-5 text-primary-foreground" aria-hidden />
                    </div>
                    <CardTitle className="text-2xl">{t("communityHub.discussion.title")}</CardTitle>
                  </div>
                  <CardDescription className="mt-2 text-base leading-relaxed">
                    {t("communityHub.discussion.body")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <Button className="w-full" asChild>
                    <a
                      href={GITHUB_DISCUSSIONS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-4 w-4" aria-hidden />
                      {t("communityHub.discussion.cta")}
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* How you can be part of this */}
              <Card className="border-0 bg-gradient-to-br from-card to-card/50">
                <CardHeader>
                  <CardTitle className="text-2xl">
                    {t("communityHub.howToJoin.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-4 sm:grid-cols-3">
                    {HOW_TO_JOIN.map(({ key, icon: Icon }) => (
                      <li key={key} className="flex flex-col gap-2">
                        <Icon className="h-5 w-5 text-primary" aria-hidden />
                        <p className="font-semibold text-foreground">
                          {t(`communityHub.howToJoin.cards.${key}.title`)}
                        </p>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {t(`communityHub.howToJoin.cards.${key}.body`)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Why This Matters and Contact */}
          <div className="grid lg:grid-cols-2 gap-8 border-t border-border pt-12">
            {/* Why This Matters */}
            <Card className="border-0 bg-gradient-to-br from-card to-card/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary">
                    <Heart className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-2xl">{trans.whyThisMatters}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {trans.whyP1}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {trans.whyP2}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {trans.whyP3}
                </p>
              </CardContent>
            </Card>

            {/* Contact (single form for the whole site) */}
            <Card
              id="contact"
              className="scroll-mt-24 border-0 bg-gradient-to-br from-card to-card/50 flex flex-col"
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary">
                    <MessageSquare className="h-5 w-5 text-primary-foreground" aria-hidden />
                  </div>
                  <CardTitle className="text-2xl">{t("communityHub.contact.title")}</CardTitle>
                </div>
                <CardDescription className="mt-2 text-base leading-relaxed">
                  {t("communityHub.contact.intro")}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-1 flex-col space-y-4"
                  noValidate
                >
                  <div className="space-y-2">
                    <Label htmlFor="subject">{trans.formSubject}</Label>
                    <Input
                      id="subject"
                      placeholder={trans.formSubjectPlaceholder}
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">{trans.formMessage}</Label>
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
                  <Button type="submit" className="mt-auto w-full">
                    <Mail className="h-4 w-4 shrink-0" aria-hidden />
                    {trans.formSend}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

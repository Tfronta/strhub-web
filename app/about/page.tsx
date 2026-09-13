"use client";

import type React from "react";
import {
  BookOpen,
  ExternalLink,
  FlaskConical,
  Github,
  Mail,
  MessageSquare,
  Share2,
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
          {/* Mission: short intro, no card, so People is visible without scrolling */}
          <section>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              {trans.mission}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              {trans.missionP1}
            </p>
          </section>

          {/* People: project lead, academic supervision, community contributors */}
          <section id="people" className="scroll-mt-24 border-t border-border pt-8">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              {t("about.people.title")}
            </h2>

            <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            {/* Project lead */}
            <Card className="border-0 border-l-4 border-solid border-l-[#0099a3] bg-gradient-to-br from-card to-card/50 py-0">
              <CardContent className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-start sm:gap-5">
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground"
                  aria-hidden
                >
                  TF
                </div>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    {t("about.people.lead")}
                  </p>
                  <p className="text-xl font-bold leading-tight text-foreground">
                    {t("about.people.leadName")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("about.people.affiliation")}. {t("about.people.country")}
                  </p>
                  <p className="pt-1 text-sm leading-relaxed text-muted-foreground">
                    {t("about.people.leadBio")}
                  </p>
                  <div className="flex flex-wrap gap-4 pt-1 text-sm">
                    <a
                      href="https://orcid.org/0000-0002-6873-7813"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-primary hover:underline"
                    >
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                      {t("about.people.orcid")}: 0000-0002-6873-7813
                    </a>
                    <a
                      href="https://github.com/Tfronta"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-primary hover:underline"
                    >
                      <Github className="h-3.5 w-3.5" aria-hidden />
                      {t("about.people.github")}: Tfronta
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Academic support */}
            <Card className="border-0 border-l-4 border-solid border-l-[#0099a3] bg-gradient-to-br from-card to-card/50 py-0">
              <CardContent className="px-5 py-4 space-y-1">
                <p className="text-lg font-bold text-foreground leading-snug">
                  {t("about.people.supportName")}
                </p>
                <p className="text-sm leading-snug text-muted-foreground">
                  {t("about.people.affiliation")}. {t("about.people.country")}
                </p>
                <p className="pt-1 text-sm leading-relaxed text-muted-foreground">
                  {t("about.people.supportBio")}
                </p>
              </CardContent>
            </Card>
            </div>

            {/* Community contributors */}
            <h3 className="mt-8 text-xl font-semibold tracking-tight sm:text-2xl">
              {t("communityHub.communityContributors.title")}
            </h3>
            <p className="mt-2 text-base leading-relaxed text-muted-foreground">
              {t("communityHub.communityContributors.subtitle")}{" "}
              {t("communityHub.communityContributors.disclaimer")}
            </p>
            <div className="mt-4 space-y-4">
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

            {/* Ways to take part: one tile each, details on hover/focus */}
            <ul className="mt-5 grid gap-3 sm:grid-cols-3">
              {HOW_TO_JOIN.map(({ key, icon: Icon }) => (
                <li key={key}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        tabIndex={0}
                        className="flex h-full items-center gap-3 rounded-lg border border-border bg-gradient-to-br from-card to-card/50 px-4 py-3 transition-colors hover:border-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10">
                          <Icon className="h-4 w-4 text-primary" aria-hidden />
                        </span>
                        <span className="font-medium text-foreground">
                          {t(`communityHub.howToJoin.cards.${key}.title`)}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-xs text-sm leading-relaxed">
                      {t(`communityHub.howToJoin.cards.${key}.body`)}
                    </TooltipContent>
                  </Tooltip>
                </li>
              ))}
            </ul>

            {/* GitHub Discussions, one row */}
            <Card className="mt-4 border-0 bg-gradient-to-br from-card to-card/50 py-0">
              <CardContent className="flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary">
                  <Github className="h-5 w-5 text-primary-foreground" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-semibold text-foreground">
                    {t("communityHub.discussion.title")}
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t("communityHub.discussion.body")}
                  </p>
                </div>
                <Button className="shrink-0" asChild>
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
          </section>

          {/* Contact */}
          <div className="border-t border-border pt-12">
            {/* Contact (single form for the whole site) */}
            <Card
              id="contact"
              className="scroll-mt-24 border-0 bg-gradient-to-br from-card to-card/50"
            >
              <CardContent className="grid gap-6 px-6 py-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-10">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary">
                      <MessageSquare className="h-5 w-5 text-primary-foreground" aria-hidden />
                    </div>
                    <CardTitle className="text-2xl">
                      {t("communityHub.contact.title")}
                    </CardTitle>
                  </div>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                    {t("communityHub.contact.intro")}
                  </p>
                </div>
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col space-y-4"
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
                  <Button type="submit" className="w-full sm:w-auto sm:self-end">
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

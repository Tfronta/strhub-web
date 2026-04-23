"use client";

import type React from "react";
import { Mail, Heart, Users, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";
import { translations } from "@/lib/translations";
import { PageTitle } from "@/components/page-title";
import { COMMUNITY_CONTRIBUTORS } from "@/lib/communityContributors";

export default function AboutPage() {
  const { language, t } = useLanguage();
  const trans = translations[language].about;

  // Scroll to contact section if hash is present
  useEffect(() => {
    if (window.location.hash === "#contact") {
      const contactElement = document.getElementById("contact");
      if (contactElement) {
        setTimeout(() => {
          contactElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, []);

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
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl">{trans.mission}</CardTitle>
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
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl">{trans.team}</CardTitle>
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
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {COMMUNITY_CONTRIBUTORS.map((contributor) => (
                <Card
                  key={contributor.name}
                  className="border-0 border-l-4 border-solid border-l-[#0099a3] bg-gradient-to-br from-card to-card/50 h-full"
                >
                  <CardHeader className="space-y-1.5">
                    <p className="font-bold text-foreground leading-snug">
                      {contributor.name}
                    </p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {contributor.institution}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t(
                        `communityHub.communityContributors.countries.${contributor.country}`
                      )}
                    </p>
                  </CardHeader>
                </Card>
              ))}
            </div>
            <div className="mt-6 w-full overflow-x-auto">
              <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm whitespace-nowrap">
                {t("communityHub.communityContributors.disclaimer")}
              </p>
            </div>
          </section>

          {/* Second row: Why This Matters and Contact */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Why This Matters */}
            <Card className="border-0 bg-gradient-to-br from-card to-card/50">
              <CardHeader>
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl">
                  {trans.whyThisMatters}
                </CardTitle>
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

            {/* Contact */}
            <Card
              id="contact"
              className="border-0 bg-gradient-to-br from-card to-card/50"
            >
              <CardHeader>
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl">{trans.contact}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {trans.contactP1}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {trans.contactP2}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {trans.contactP3}
                </p>
                <div className="pt-2">
                  <Button asChild>
                    <Link href="/community#contact">
                      {trans.contactButton}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

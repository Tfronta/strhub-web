"use client";

import type React from "react";
import { Mail, Heart, Users, Target, Send } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/language-context";
import { translations } from "@/lib/translations";
import { PageTitle } from "@/components/page-title";

export default function AboutPage() {
  const { language, t } = useLanguage();
  const trans = translations[language].about;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Scroll to contact form if hash is present
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-0 py-8 space-y-6">
        <PageTitle title={t("about.title")} />
        <div className="space-y-8">
          {/* First row: Mission and Team */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Mission */}
            <Card className="border-0 bg-gradient-to-br from-card to-card/50">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl">{trans.mission}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {trans.missionText}
                </p>
              </CardContent>
            </Card>

            {/* Team */}
            <Card className="border-0 bg-gradient-to-br from-card to-card/50">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle className="text-2xl">{trans.team}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {trans.teamText}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {trans.teamText2}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">GitHub profile:</Badge>
                  <Button variant="link" size="sm" className="p-0 h-auto">
                    Tamara Frontanilla
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Second row: Why This Matters and Contact */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Why This Matters */}
            <Card className="border-0 bg-gradient-to-br from-card to-card/50">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl">
                  {trans.whyThisMatters}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {trans.whyThisMattersText}
                </p>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card
              id="contact"
              className="border-0 bg-gradient-to-br from-card to-card/50"
            >
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl">{trans.contact}</CardTitle>
                <CardDescription className="mt-2">
                  {trans.contactDescription}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{trans.formName}</Label>
                      <Input
                        id="name"
                        placeholder={trans.formNamePlaceholder}
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{trans.formEmail}</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder={trans.formEmailPlaceholder}
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
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
                      placeholder={trans.formMessagePlaceholder}
                      rows={5}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    <Send className="h-4 w-4 mr-2" />
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

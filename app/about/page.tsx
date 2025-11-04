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
import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import { translations } from "@/lib/translations";

export default function AboutPage() {
  const { language, t } = useLanguage();
  const trans = translations[language].about;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t("about.title")}
            </h1>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              ← Back to STRhub
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
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
            <Card className="border-0 bg-gradient-to-br from-card to-card/50">
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

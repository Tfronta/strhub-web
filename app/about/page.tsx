"use client"

import type React from "react"
import { Mail, Heart, Users, Target, Send } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { translations } from "@/lib/translations"

export default function AboutPage() {
  const { language } = useLanguage()
  const t = translations[language]
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const getInTouchText = {
    en: "Get in Touch",
    pt: "Entre em Contato",
    es: "Ponte en Contacto",
  }

  const formDescriptionText = {
    en: "Send us a message and we'll get back to you soon.",
    pt: "Envie-nos uma mensagem e retornaremos em breve.",
    es: "Envíanos un mensaje y te responderemos pronto.",
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formData)
  }

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
              {t.about.title}
            </h1>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              ← Back to STRhub
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="space-y-8">
          {/* First row: Mission and Team side by side */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Mission */}
            <Card className="border-0 bg-gradient-to-br from-card to-card/50">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl">{t.about.mission}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{t.about.missionText}</p>
              </CardContent>
            </Card>

            {/* Team */}
            <Card className="border-0 bg-gradient-to-br from-card to-card/50">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle className="text-2xl">{t.about.team}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">{t.about.teamText}</p>
                <p className="text-muted-foreground leading-relaxed">
                  The project is led by Dr. Tamara Frontanilla, researcher in forensic genetics and bioinformatics, with
                  extensive experience in population genetics, sequencing technologies, and education.
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">GitHub profile:</Badge>
                  <Button variant="link" size="sm" className="p-0 h-auto">
                    👉 Tamara Frontanilla
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Second row: Contact centered */}
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <Card className="border-0 bg-gradient-to-br from-card to-card/50">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Mail className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-2xl text-center">{t.about.contact}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed text-center">{t.about.contactText}</p>
                  <ul className="space-y-2 text-sm text-muted-foreground text-center">
                    <li>• Use the contact form below to reach us directly</li>
                    <li>• For technical issues or feature requests, connect with us on GitHub</li>
                    <li>• We encourage contributions from the global community</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <Card className="border-0 bg-gradient-to-br from-card to-card/50">
                <CardHeader>
                  <CardTitle>{getInTouchText[language]}</CardTitle>
                  <CardDescription>{formDescriptionText[language]}</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">
                          {language === "en" ? "Name" : language === "pt" ? "Nome" : "Nombre"}
                        </Label>
                        <Input
                          id="name"
                          placeholder={language === "en" ? "Your name" : language === "pt" ? "Seu nome" : "Tu nombre"}
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">
                          {language === "en" ? "Email" : language === "pt" ? "E-mail" : "Correo electrónico"}
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder={
                            language === "en"
                              ? "your.email@example.com"
                              : language === "pt"
                                ? "seu.email@exemplo.com"
                                : "tu.correo@ejemplo.com"
                          }
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">
                        {language === "en" ? "Subject" : language === "pt" ? "Assunto" : "Asunto"}
                      </Label>
                      <Input
                        id="subject"
                        placeholder={
                          language === "en"
                            ? "What would you like to discuss?"
                            : language === "pt"
                              ? "Sobre o que você gostaria de falar?"
                              : "¿De qué te gustaría hablar?"
                        }
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">
                        {language === "en" ? "Message" : language === "pt" ? "Mensagem" : "Mensaje"}
                      </Label>
                      <Textarea
                        id="message"
                        placeholder={
                          language === "en"
                            ? "Tell us about your research, questions, or collaboration ideas..."
                            : language === "pt"
                              ? "Conte-nos sobre sua pesquisa, perguntas ou ideias de colaboração..."
                              : "Cuéntanos sobre tu investigación, preguntas o ideas de colaboración..."
                        }
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      <Send className="h-4 w-4 mr-2" />
                      {language === "en" ? "Send Message" : language === "pt" ? "Enviar mensagem" : "Enviar mensaje"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

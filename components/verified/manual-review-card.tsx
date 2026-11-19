"use client";

import { useState } from "react";
import { CheckCircle2, Clock, Loader2, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import type { TrialRole } from "@/lib/verified/trial";

interface ManualReviewCardProps {
  trialId: string;
  toolName: string;
  repo: string;
  refSha: string;
  role: TrialRole;
  reason: string;
  ciRun?: string;
}

export function ManualReviewCard({
  trialId,
  toolName,
  repo,
  refSha,
  role,
  reason,
  ciRun,
}: ManualReviewCardProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [website, setWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmedEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError(t("verified.trial.manualReview.errorInvalidEmail"));
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/verify/manual-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trialId,
          toolName,
          repo,
          ref: refSha,
          role,
          email: trimmedEmail,
          reason,
          notes: notes.trim(),
          ciRun,
          website,
        }),
      });
      if (!res.ok) {
        setError(t("verified.trial.manualReview.errorGeneric"));
        return;
      }
      setSent(true);
      setOpen(false);
    } catch {
      setError(t("verified.trial.manualReview.errorGeneric"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col justify-between rounded-lg border border-teal-600/35 bg-teal-50/35 p-4 dark:border-teal-800/60 dark:bg-teal-950/20">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-800 dark:text-teal-300">
            {t("verified.trial.manualReview.option2Tag")}
          </p>
          <Badge variant="outline" className="inline-flex items-center gap-1 text-xs">
            <Clock className="h-3 w-3" />
            {t("verified.trial.manualReview.option2Badge")}
          </Badge>
        </div>
        <h3 className="mt-2 text-base font-semibold">
          {t("verified.trial.manualReview.option2Title")}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          {t("verified.trial.manualReview.option2Body")}
        </p>
      </div>

      <div className="mt-4">
        {sent ? (
          <div className="rounded-md border border-teal-600/40 bg-teal-50 p-3 text-sm text-teal-900 dark:border-teal-800 dark:bg-teal-950/40 dark:text-teal-200">
            <p className="inline-flex items-center gap-1.5 font-semibold">
              <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              {t("verified.trial.manualReview.sentTitle")}
            </p>
            <p className="mt-1 text-xs leading-relaxed">
              {t("verified.trial.manualReview.sentBody")}
            </p>
          </div>
        ) : !open ? (
          <Button
            type="button"
            size="sm"
            className="w-full sm:w-auto"
            onClick={() => setOpen(true)}
          >
            <Send className="mr-1.5 h-3.5 w-3.5" />
            {t("verified.trial.manualReview.cta")}
          </Button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 pt-1">
            {/* Honeypot */}
            <input
              type="text"
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />
            <div>
              <label htmlFor={`manual-email-${trialId}`} className="block text-xs font-medium">
                {t("verified.trial.manualReview.emailLabel")}
              </label>
              <input
                id={`manual-email-${trialId}`}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("verified.trial.manualReview.emailPlaceholder")}
                className="mt-1 w-full rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor={`manual-notes-${trialId}`} className="block text-xs font-medium">
                {t("verified.trial.manualReview.notesLabel")}
              </label>
              <textarea
                id={`manual-notes-${trialId}`}
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t("verified.trial.manualReview.notesPlaceholder")}
                className="mt-1 w-full rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            {error && (
              <p role="alert" className="text-xs text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <Button type="submit" size="sm" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    {t("verified.trial.manualReview.sending")}
                  </>
                ) : (
                  <>
                    <Send className="mr-1.5 h-3.5 w-3.5" />
                    {t("verified.trial.manualReview.submit")}
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={submitting}
                onClick={() => {
                  setOpen(false);
                  setError(null);
                }}
              >
                {t("verified.trial.manualReview.cancel")}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

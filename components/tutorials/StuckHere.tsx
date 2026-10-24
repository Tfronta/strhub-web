"use client";

import { useId, useState } from "react";
import { LifeBuoy, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/language-context";
import { stuckMailto } from "@/lib/tutorials";

const SYSTEMS = ["macos", "wsl", "linux", "other"] as const;

/**
 * "Stuck here?" under a step: the reader picks their system, pastes the
 * error, and their email app opens addressed to the site's contact with the
 * tutorial and the step already named.
 */
export function StuckHere({
  tool,
  tutorialId,
  stepId,
  stepNumber,
  stepTitle,
}: {
  tool: string;
  tutorialId: string;
  stepId: string;
  /** Shown in the subject; the installation has none. */
  stepNumber: number | null;
  stepTitle: string;
}) {
  const { t } = useLanguage();
  const id = useId();
  const [open, setOpen] = useState(false);
  const [system, setSystem] = useState<(typeof SYSTEMS)[number]>("macos");
  const [what, setWhat] = useState("");

  const label = stepNumber != null ? `${stepNumber}. ${stepTitle}` : stepTitle;

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const pageUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}${window.location.pathname}#${stepId}`
        : "";
    window.location.href = stuckMailto({
      subject: t("tools.tutorialPage.stuck.subject", {
        tool,
        step: stepNumber != null ? String(stepNumber) : stepTitle,
      }),
      tutorialId,
      stepId,
      stepLabel: label,
      // The system name in English: it is for whoever answers, not the reader.
      system: {
        macos: "macOS",
        wsl: "Windows (WSL)",
        linux: "Linux",
        other: "Other",
      }[system],
      pageUrl,
      what,
    });
  };

  return (
    <div className="pt-1">
      <Button
        type="button"
        variant="outline"
        size="sm"
        // The outline variant hovers to bg-accent, the same teal as the text.
        className="rounded-full border-primary/60 text-primary hover:bg-primary/10 hover:text-primary"
        aria-expanded={open}
        aria-controls={`${id}-form`}
        onClick={() => setOpen((v) => !v)}
      >
        <LifeBuoy className="h-4 w-4" aria-hidden />
        {t("tools.tutorialPage.stuck.button")}
      </Button>
      {open && (
        <form
          id={`${id}-form`}
          onSubmit={send}
          className="mt-3 space-y-3 rounded-lg border bg-muted/40 p-4"
        >
          <p className="text-sm text-muted-foreground">
            {t("tools.tutorialPage.stuck.intro")}
          </p>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-system`}>{t("tools.tutorialPage.stuck.system")}</Label>
            <select
              id={`${id}-system`}
              value={system}
              onChange={(e) => setSystem(e.target.value as (typeof SYSTEMS)[number])}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm sm:w-64"
            >
              {SYSTEMS.map((s) => (
                <option key={s} value={s}>
                  {t(`tools.tutorialPage.stuck.systems.${s}`)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-what`}>{t("tools.tutorialPage.stuck.what")}</Label>
            <Textarea
              id={`${id}-what`}
              rows={4}
              value={what}
              onChange={(e) => setWhat(e.target.value)}
              className="bg-background font-mono text-xs"
            />
          </div>
          <Button type="submit" size="sm">
            <Mail className="h-4 w-4" aria-hidden />
            {t("tools.tutorialPage.stuck.send")}
          </Button>
        </form>
      )}
    </div>
  );
}

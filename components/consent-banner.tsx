"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { BarChart3, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConsent } from "@/contexts/consent-context";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";

// On arrival, let the page settle before the card slides in.
const ARRIVAL_DELAY_MS = 700;

/**
 * A small card in a corner, not a wall: it never covers the page, blocks
 * scrolling or takes focus on arrival. Accepting and declining are the same
 * size, one tap each.
 */
export function ConsentBanner() {
  const { bannerOpen, reopened, choice, choose, closeBanner } = useConsent();
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const textId = useId();

  useEffect(() => {
    if (!bannerOpen) {
      setVisible(false);
      return;
    }
    if (reopened) {
      setVisible(true);
      return;
    }
    const timer = setTimeout(() => setVisible(true), ARRIVAL_DELAY_MS);
    return () => clearTimeout(timer);
  }, [bannerOpen, reopened]);

  // Opened from "Cookie preferences": move focus here, and let Escape close it.
  useEffect(() => {
    if (!visible || !reopened) return;
    cardRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeBanner();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, reopened, closeBanner]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-50 print:hidden",
        "sm:inset-x-auto sm:bottom-6 sm:left-6 sm:w-[23rem]",
        "animate-in fade-in-0 slide-in-from-bottom-3 duration-500 ease-out motion-reduce:animate-none",
      )}
    >
      <div
        ref={cardRef}
        role="region"
        aria-label={t("consent.label")}
        aria-describedby={textId}
        tabIndex={-1}
        className="relative rounded-2xl border border-border/80 bg-background p-4 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.25)] outline-none sm:p-5 dark:shadow-[0_10px_40px_-12px_rgba(0,0,0,0.8)]"
      >
        {reopened && (
          <button
            type="button"
            onClick={closeBanner}
            aria-label={t("consent.close")}
            className="absolute right-2.5 top-2.5 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        )}
        <div className="flex items-start gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <BarChart3 className="h-4 w-4" aria-hidden />
          </span>
          <div className={cn("min-w-0 pt-px", reopened && "pr-6")}>
            <p id={textId} className="text-sm leading-relaxed text-foreground/85">
              {t("consent.body")}{" "}
              <Link
                href="/privacy"
                className="whitespace-nowrap font-medium text-primary underline-offset-2 hover:underline"
              >
                {t("consent.privacyLink")}
              </Link>
            </p>
            {reopened && choice && (
              <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    choice === "granted" ? "bg-emerald-500" : "bg-muted-foreground/50",
                  )}
                  aria-hidden
                />
                {t(`consent.current.${choice}`)}
              </p>
            )}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" onClick={() => choose("denied")}>
            {t("consent.decline")}
          </Button>
          <Button size="sm" onClick={() => choose("granted")}>
            {t("consent.accept")}
          </Button>
        </div>
      </div>
    </div>
  );
}

/** The footer's way back to the banner, for any visitor. */
export function ConsentPreferencesButton({ className }: { className?: string }) {
  const { openPreferences } = useConsent();
  const { t } = useLanguage();
  return (
    <button type="button" onClick={openPreferences} className={className}>
      {t("consent.preferences")}
    </button>
  );
}

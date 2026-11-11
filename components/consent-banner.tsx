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
 * A bar along the bottom of the screen, not a wall: it never covers the page
 * with an overlay, blocks scrolling or takes focus on arrival. Accepting and
 * declining are the same size, one tap each.
 */
export function ConsentBanner() {
  const { bannerOpen, reopened, choose, closeBanner } = useConsent();
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
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
    barRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeBanner();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, reopened, closeBanner]);

  if (!visible) return null;

  return (
    <div
      ref={barRef}
      role="region"
      aria-label={t("consent.label")}
      aria-describedby={textId}
      tabIndex={-1}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t bg-background pb-[env(safe-area-inset-bottom)] outline-none print:hidden",
        "shadow-[0_-8px_30px_-12px_rgba(0,0,0,0.18)] dark:shadow-[0_-8px_30px_-12px_rgba(0,0,0,0.7)]",
        "animate-in fade-in-0 slide-in-from-bottom-3 duration-500 ease-out motion-reduce:animate-none",
      )}
    >
      <div className="container relative mx-auto flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:gap-6 sm:py-4">
        <div className={cn("flex min-w-0 flex-1 items-start gap-3 sm:items-center", reopened && "pr-8 sm:pr-0")}>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <BarChart3 className="h-4 w-4" aria-hidden />
          </span>
          <p id={textId} className="text-sm leading-relaxed text-foreground/85">
            {t("consent.body")}{" "}
            <Link
              href="/privacy"
              className="whitespace-nowrap font-medium text-primary underline-offset-2 hover:underline"
            >
              {t("consent.privacyLink")}
            </Link>
          </p>
        </div>
        {/* Same width and weight: declining is as easy as accepting. */}
        <div className="grid shrink-0 grid-cols-2 gap-2 sm:flex">
          <Button
            variant="outline"
            size="sm"
            className="px-2 text-[13px] min-[360px]:text-sm sm:w-44"
            onClick={() => choose("denied")}
          >
            {t("consent.decline")}
          </Button>
          <Button
            size="sm"
            className="px-2 text-[13px] min-[360px]:text-sm sm:w-44"
            onClick={() => choose("granted")}
          >
            {t("consent.accept")}
          </Button>
        </div>
        {reopened && (
          <button
            type="button"
            onClick={closeBanner}
            aria-label={t("consent.close")}
            className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:static"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        )}
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

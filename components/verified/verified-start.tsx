"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Info, Lightbulb, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";
import { useTrackEvent } from "@/hooks/use-track-event";
import { PageTitle } from "@/components/page-title";
import type { TrialRole } from "@/lib/verified/trial";
import type { ExistingCatalogMatch } from "@/lib/verified/existing-match";
import { formatDate } from "@/lib/verified/format-date";
import { repoSlugOf } from "@/lib/verified/repo-url";
import { GUIDE_URL } from "@/lib/verified/step1";
import { VerificationStatusTags } from "./status-tags";

const ROLES: TrialRole[] = ["owner", "reviewer", "user"];

/** What the run will pin, as the form found it. */
interface ResolvedRef {
  sha: string;
  label: string;
  how: "given" | "release" | "tag" | "head";
  existing?: ExistingCatalogMatch;
}

export function VerifiedStart({
  role: initialRole,
  compact = false,
  initialRepo = "",
}: {
  role: TrialRole;
  compact?: boolean;
  /**
   * A repository already chosen — "Test another version" on a report. The
   * form then opens on the commit field, since the repository is settled and
   * the version is the question.
   */
  initialRepo?: string;
}) {
  const { t, language } = useLanguage();
  const track = useTrackEvent();
  const router = useRouter();
  const [role, setRole] = useState<TrialRole>(initialRole);
  const [repo, setRepo] = useState(initialRepo);
  const [ref, setRef] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // The commit the run would pin, resolved as the person types. A ref they
  // typed themselves is never overwritten; one the form filled in is.
  const [resolved, setResolved] = useState<ResolvedRef | null>(null);
  const [resolving, setResolving] = useState(false);
  const [unresolved, setUnresolved] = useState(false);
  const refTyped = useRef(false);

  useEffect(() => {
    const slug = repoSlugOf(repo);
    if (!slug) {
      setResolved(null);
      setUnresolved(false);
      return;
    }
    const typed = refTyped.current ? ref.trim() : "";
    let cancelled = false;
    setResolving(true);
    setUnresolved(false);
    const timer = setTimeout(async () => {
      try {
        const q = new URLSearchParams({ repo: repo.trim() });
        if (typed) q.set("ref", typed);
        const res = await fetch(`/api/verify/resolve-ref?${q}`);
        const data = await res.json();
        if (cancelled) return;
        if (res.ok && data.ok) {
          setResolved({
            sha: data.sha,
            label: data.label,
            how: data.how,
            existing: data.existing ?? undefined,
          });
          if (!refTyped.current) setRef(data.sha);
        } else {
          setResolved(null);
          setUnresolved(true);
        }
      } catch {
        if (!cancelled) setResolved(null);
      } finally {
        if (!cancelled) setResolving(false);
      }
    }, 600);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // `ref` is read through refTyped so a fill by the form does not re-fire.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repo, refTyped.current ? ref : ""]);

  async function start(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const effectiveRef = refTyped.current
        ? ref.trim()
        : resolved?.how === "release" || resolved?.how === "tag"
          ? resolved.label
          : "";
      const res = await fetch("/api/verify/trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo: repo.trim(), ref: effectiveRef, role }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        const code = typeof data.error === "string" ? data.error : "generic";
        const key = `verified.start.error.${code}`;
        const msg = t(key);
        setError(msg === key ? t("verified.start.error.generic") : msg);
        setBusy(false);
        return;
      }
      // No repository in the event: GA4 forbids anything that may identify a person.
      track("verified_submit", { form: "start", role });
      router.push(data.url as string);
    } catch {
      setError(t("verified.start.error.generic"));
      setBusy(false);
    }
  }

  return (
    <div className={compact ? "" : "container mx-auto max-w-3xl px-4 py-10"}>
      {!compact && (
        <>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-teal-700 dark:text-teal-400">
            {t("verified.start.eyebrow")}
          </p>
          <PageTitle
            title={t(`verified.start.title.${role}`)}
            description={
              <>
                {t(`verified.start.lead.${role}`)}{" "}
                {t("verified.start.introBeforeLink")}
                <Link
                  href={GUIDE_URL}
                  className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  {t("verified.start.introLinkLabel")}
                </Link>
                {t("verified.start.introMiddle")}
                <strong className="font-semibold text-foreground">
                  {t("verified.start.introBold")}
                </strong>
                {t("verified.start.introAfterBold")}
              </>
            }
          />
        </>
      )}

      <form onSubmit={start} className="mt-8 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="trial-repo">{t("verified.start.repoLabel")}</Label>
          <Input
            id="trial-repo"
            type="url"
            required
            inputMode="url"
            autoComplete="off"
            placeholder={t("verified.start.repoPlaceholder")}
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="trial-ref">{t("verified.start.refLabel")}</Label>
          <Input
            id="trial-ref"
            autoComplete="off"
            autoFocus={Boolean(initialRepo)}
            placeholder={t("verified.start.refPlaceholder")}
            value={ref}
            onChange={(e) => {
              refTyped.current = e.target.value.trim().length > 0;
              setRef(e.target.value);
            }}
          />
          {resolving ? (
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground" aria-live="polite">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-teal-600" />
              {t("verified.start.refResolving")}
            </p>
          ) : resolved ? (
            <div className="space-y-1 text-xs" aria-live="polite">
              <p>
                <span className="font-medium text-foreground">{t("verified.start.refPinnedLabel")}</span>{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono">{resolved.sha.slice(0, 7)}</code>{" "}
                <span className="text-muted-foreground">
                  {t("verified.start.refResolved", {
                    label: resolved.label,
                    how: t(`verified.start.refHow.${resolved.how}`),
                  })}
                </span>
              </p>
              <p className="text-muted-foreground">{t("verified.start.refHint")}</p>
              {resolved.existing && (
                <div className="mt-2.5 rounded-lg border border-sky-500/40 bg-sky-50/70 p-3.5 text-xs dark:border-sky-500/35 dark:bg-sky-950/30">
                  <div className="flex items-start gap-2">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-700 dark:text-sky-400" aria-hidden />
                    <div className="min-w-0 flex-1 space-y-2">
                      <div>
                        <p className="font-semibold text-foreground">
                          {t("verified.start.existing.title")}
                        </p>
                        {resolved.existing.generated && (
                          <p className="mt-0.5 text-muted-foreground">
                            {t("verified.start.existing.evaluatedOn", {
                              date: formatDate(resolved.existing.generated, language),
                            })}
                          </p>
                        )}
                      </div>
                      <VerificationStatusTags
                        autoRow={
                          resolved.existing.auto
                            ? {
                                level: resolved.existing.auto.level,
                                verdict: resolved.existing.auto.verdict,
                                errors_reported: resolved.existing.auto.errors_reported,
                                instrument: "documented",
                              }
                            : null
                        }
                        manualRow={
                          resolved.existing.manual
                            ? {
                                level: resolved.existing.manual.level,
                                verdict: resolved.existing.manual.verdict,
                                errors_reported: resolved.existing.manual.errors_reported,
                                instrument: "curated",
                              }
                            : null
                        }
                        size="sm"
                      />
                      <div className="flex flex-wrap items-center gap-3 pt-0.5">
                        <Link
                          href={resolved.existing.href}
                          className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                        >
                          {resolved.existing.manual
                            ? t("verified.start.existing.viewReportAndGuide")
                            : t("verified.start.existing.viewReport")}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                        {resolved.existing.manual &&
                          resolved.existing.manual.href !== resolved.existing.href && (
                            <Link
                              href={resolved.existing.manual.href}
                              className="inline-flex items-center gap-1 font-medium text-teal-700 hover:underline dark:text-teal-300"
                            >
                              {t("verified.start.existing.viewManualGuide")}
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          )}
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {t("verified.start.existing.canStillRun")}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : unresolved ? (
            <p className="text-xs text-amber-700 dark:text-amber-500" aria-live="polite">{t("verified.start.refUnresolved")}</p>
          ) : (
            <p className="text-xs text-muted-foreground">{t("verified.start.refHint")}</p>
          )}
        </div>
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">{t("verified.start.roleLabel")}</legend>
          <div className="flex flex-wrap items-center gap-2">
            {ROLES.map((r) => (
              <label
                key={r}
                className={`cursor-pointer rounded-md border px-3 py-2 text-sm ${
                  role === r ? "border-teal-600 bg-teal-50 dark:bg-teal-950" : "border-border"
                }`}
              >
                <input
                  type="radio"
                  name="trial-role"
                  id={`trial-role-${r}`}
                  className="sr-only"
                  checked={role === r}
                  onChange={() => setRole(r)}
                />
                {t(`verified.start.role.${r}`)}
              </label>
            ))}
          </div>
        </fieldset>

        {error && (
          <p role="alert" className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
            {error}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" disabled={busy || !repo.trim()}>
            {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {busy ? t("verified.start.starting") : t("verified.start.cta")}
          </Button>
          <p className="text-sm text-muted-foreground">{t("verified.start.noPublish")}</p>
        </div>
      </form>

      {!compact && <Card className="mt-6">
        <CardContent className="pt-6">
          <h2 className="mb-3 text-base font-semibold">{t("verified.start.howItWorks")}</h2>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
            <li>{t("verified.start.steps.read")}</li>
            <li>{t("verified.start.steps.evidence")}</li>
            <li>{t("verified.start.steps.run")}</li>
            <li>{t("verified.start.steps.verdict")}</li>
          </ol>
        </CardContent>
      </Card>}

      {!compact && (
        <Card id="readme-tips" className="mt-6 scroll-mt-8 border-teal-200/60 bg-teal-50/40 dark:border-teal-900/50 dark:bg-teal-950/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 mt-0.5 shrink-0 text-teal-600 dark:text-teal-400" />
              <div className="space-y-1">
                <h2 className="text-base font-semibold text-teal-950 dark:text-teal-200">
                  {t("verified.start.readmeTipsTitle")}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {t("verified.start.readmeTipsSubtitle")}
                </p>
                <ul className="mt-3 list-disc space-y-1.5 pl-4 text-xs text-muted-foreground">
                  <li>{t("verified.start.readmeTips.command")}</li>
                  <li>{t("verified.start.readmeTips.inputs")}</li>
                  <li>{t("verified.start.readmeTips.environment")}</li>
                  <li>{t("verified.start.readmeTips.nonInteractive")}</li>
                </ul>
                <div className="pt-3">
                  <Link
                    href={GUIDE_URL}
                    className="inline-flex items-center gap-1 text-xs font-medium text-teal-700 hover:underline dark:text-teal-400"
                  >
                    {t("verified.start.readmeTips.guideLink")}
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

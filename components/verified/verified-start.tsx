"use client";

/**
 * The one-field entry to STRhub Verified, for all three of its readers.
 *
 * A repository URL, an optional version, and who is asking. Everything the old
 * form asked for (Dockerfile, command, columns) is now worked out by the engine
 * from the repository and rehearsed in CI; the person watching sees a verdict,
 * not a form. The long form survives as "advanced" for maintainers who want to
 * write the recipe themselves.
 */
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ExternalLink, Lightbulb, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";
import { useTrackEvent } from "@/hooks/use-track-event";
import { PageTitle } from "@/components/page-title";
import type { TrialRole } from "@/lib/verified/trial";
import { repoSlugOf } from "@/lib/verified/repo-url";
import { GUIDE_URL } from "@/lib/verified/step1";

const ROLES: TrialRole[] = ["owner", "reviewer", "user"];

/** What the run will pin, as the form found it. */
interface ResolvedRef {
  sha: string;
  label: string;
  how: "given" | "release" | "tag" | "head";
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
  const { t } = useLanguage();
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
          setResolved({ sha: data.sha, label: data.label, how: data.how });
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
          <PageTitle title={t(`verified.start.title.${role}`)} description={t(`verified.start.lead.${role}`)} />
          {role === "owner" && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span>{t("verified.start.ownerNotice")}</span>
              <a
                href="#readme-tips"
                className="inline-flex items-center gap-1.5 rounded-md border border-teal-600/30 bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800 transition-colors hover:bg-teal-100 hover:text-teal-900 dark:border-teal-800 dark:bg-teal-950/40 dark:text-teal-300 dark:hover:bg-teal-900/60"
              >
                <Lightbulb className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                {t("verified.start.ownerNoticeLink")}
              </a>
            </div>
          )}
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
            {role === "owner" && !compact && (
              <a
                href="#readme-tips"
                className="ml-2 inline-flex items-center gap-1.5 rounded-md border border-teal-600/30 bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800 transition-colors hover:bg-teal-100 hover:text-teal-900 dark:border-teal-800 dark:bg-teal-950/40 dark:text-teal-300 dark:hover:bg-teal-900/60"
              >
                <Lightbulb className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                {t("verified.start.ownerNoticeLink")}
              </a>
            )}
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
            <li>{t("verified.start.steps.propose")}</li>
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
                  <a
                    href={GUIDE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-teal-700 hover:underline dark:text-teal-400"
                  >
                    {t("verified.start.readmeTips.guideLink")}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {role === "owner" && !compact && (
        <p className="mt-6 text-sm text-muted-foreground">
          <Link href="/verified/submit/advanced" className="underline underline-offset-2">
            {t("verified.start.advanced")}
          </Link>{" "}
          {t("verified.start.advancedHint")}
        </p>
      )}
    </div>
  );
}

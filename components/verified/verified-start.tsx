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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";
import { PageTitle } from "@/components/page-title";
import type { TrialRole } from "@/lib/verified/trial";
import { repoSlugOf } from "@/lib/verified/repo-url";

const ROLES: TrialRole[] = ["owner", "reviewer", "user"];

/** What the run will pin, as the form found it. */
interface ResolvedRef {
  sha: string;
  label: string;
  how: "given" | "release" | "tag" | "head";
}

export function VerifiedStart({ role: initialRole, compact = false }: { role: TrialRole; compact?: boolean }) {
  const { t } = useLanguage();
  const router = useRouter();
  const [role, setRole] = useState<TrialRole>(initialRole);
  const [repo, setRepo] = useState("");
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
      const res = await fetch("/api/verify/trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo: repo.trim(), ref: ref.trim(), role }),
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
            placeholder={t("verified.start.refPlaceholder")}
            value={ref}
            onChange={(e) => {
              refTyped.current = e.target.value.trim().length > 0;
              setRef(e.target.value);
            }}
          />
          {resolving ? (
            <p className="text-sm text-muted-foreground" aria-live="polite">{t("verified.start.refResolving")}</p>
          ) : resolved ? (
            <p className="text-sm" aria-live="polite">
              <span className="font-medium">{t("verified.start.refPinnedLabel")}</span>{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{resolved.sha.slice(0, 7)}</code>{" "}
              <span className="text-muted-foreground">
                — {t("verified.start.refResolved", {
                  label: resolved.label,
                  how: t(`verified.start.refHow.${resolved.how}`),
                })}
              </span>
            </p>
          ) : unresolved ? (
            <p className="text-sm text-amber-700 dark:text-amber-500" aria-live="polite">{t("verified.start.refUnresolved")}</p>
          ) : (
            <p className="text-sm text-muted-foreground">{t("verified.start.refHint")}</p>
          )}
        </div>
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">{t("verified.start.roleLabel")}</legend>
          <div className="flex flex-wrap gap-2">
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
            {busy ? t("verified.start.starting") : t("verified.start.cta")}
          </Button>
          <p className="text-sm text-muted-foreground">{t("verified.start.noPublish")}</p>
        </div>
      </form>

      {!compact && <Card className="mt-10">
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

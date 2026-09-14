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
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";
import { PageTitle } from "@/components/page-title";
import type { TrialRole } from "@/lib/verified/trial";

const ROLES: TrialRole[] = ["owner", "reviewer", "user"];

export function VerifiedStart({ role: initialRole, compact = false }: { role: TrialRole; compact?: boolean }) {
  const { t } = useLanguage();
  const router = useRouter();
  const [role, setRole] = useState<TrialRole>(initialRole);
  const [repo, setRepo] = useState("");
  const [ref, setRef] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
            onChange={(e) => setRef(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">{t("verified.start.refHint")}</p>
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

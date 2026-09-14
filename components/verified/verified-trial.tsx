"use client";

/**
 * A test run, watched live and then read.
 *
 * Polls /api/verify/trial until the run completes, then shows the one sentence
 * a reader who does not program needs (the verdict), what the README does not
 * say when that is the reason, the gate ladder, what was actually run, the
 * caveats (every guess the engine made), and the logs. An owner gets "Publish";
 * a reviewer gets a link to share.
 */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";
import { PageTitle } from "@/components/page-title";
import { VERIFIED_GATES } from "@/types/verified";
import type { TrialRole, TrialStatus, TrialVerdictCode } from "@/lib/verified/trial";
import { ownerIssueUrl, prepareSelfFix } from "@/lib/verified/trial-next-steps";
import { useRouter } from "next/navigation";

const POLL_MS = 8000;
const STALL_AFTER_MS = 6 * 60 * 1000;
const GIVE_UP_AFTER_MS = 45 * 60 * 1000;

const VERDICT_TONE: Record<TrialVerdictCode, string> = {
  runs: "bg-teal-600 text-white",
  fails: "bg-red-600 text-white",
  undetermined: "bg-amber-500 text-white",
  out_of_scope: "bg-slate-500 text-white",
};

function extractCmd(manifestYml: string): string | null {
  const m = manifestYml.match(/^run:\s*\n\s+cmd:\s*(.+)$/m);
  if (!m) return null;
  let cmd = m[1].trim().replace(/^["']|["']$/g, "");
  // The capture wrapper is engine plumbing; show the tool's own command.
  const inner = cmd.match(/&&\s*\(\s*(.+?)\s*\);\s*rc=\$\?/);
  if (inner) cmd = inner[1];
  return cmd;
}

export function VerifiedTrial({ id, role }: { id: string; role: TrialRole }) {
  const { t } = useLanguage();
  const router = useRouter();
  const [status, setStatus] = useState<TrialStatus | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [publishState, setPublishState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [publishMsg, setPublishMsg] = useState<string>("");
  const [showDockerfile, setShowDockerfile] = useState(false);
  const [openLog, setOpenLog] = useState<string | null>(null);
  const startedAt = useRef(Date.now());
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let stopped = false;
    async function poll() {
      try {
        const res = await fetch(`/api/verify/trial?id=${encodeURIComponent(id)}`);
        const data = await res.json();
        if (data.ok) {
          setStatus(data as TrialStatus);
          setFetchError(null);
          if (data.state === "completed" || data.state === "expired") return;
        } else if (res.status === 503) {
          setFetchError(t("verified.start.error.not_configured"));
          return;
        }
      } catch {
        // transient; keep polling
      }
      setNow(Date.now());
      if (!stopped && Date.now() - startedAt.current < GIVE_UP_AFTER_MS) {
        timer = setTimeout(poll, POLL_MS);
      }
    }
    poll();
    return () => {
      stopped = true;
      if (timer) clearTimeout(timer);
    };
  }, [id, t]);

  async function publish() {
    setPublishState("busy");
    try {
      const res = await fetch("/api/verify/trial/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setPublishState("done");
        setPublishMsg(t("verified.trial.published", { slug: data.slug }));
      } else {
        const key = `verified.trial.publishError.${data.error}`;
        const msg = t(key);
        setPublishState("error");
        setPublishMsg(msg === key ? t("verified.trial.publishError.generic") : msg);
      }
    } catch {
      setPublishState("error");
      setPublishMsg(t("verified.trial.publishError.generic"));
    }
  }

  const report = status?.report ?? null;
  const verdict = report?.verdict ?? null;
  const elapsedMin = Math.floor((now - startedAt.current) / 60000);
  const running = !status || (status.state !== "completed" && status.state !== "expired");
  const stalled = running && status?.state === "pending" && now - startedAt.current > STALL_AFTER_MS;
  const repoName = report?.source.repo?.replace(/\/+$/, "").split("/").pop();
  const cmd = status?.recipe ? extractCmd(status.recipe.manifest_yml) : null;
  const repoDockerfile = status?.recipe?.manifest_yml.includes("source: repository") ?? false;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <p className="mb-2 text-sm text-muted-foreground">
        <Link href="/verified" className="underline underline-offset-2">STRhub Verified</Link>
      </p>
      <PageTitle
        title={report ? `${t("verified.trial.title")}: ${repoName ?? report.tool.name}` : t("verified.trial.title")}
        description={
          report
            ? t("verified.trial.of", { repo: report.source.repo, ref: (report.source.ref_resolved ?? report.source.ref ?? "").slice(0, 12) })
            : undefined
        }
      />

      {/* What a verdict here does and does not say, before the verdict itself.
          The PDF opens with the same two sentences; the page used to leave a
          reader to find them at the foot of the catalogue entry. */}
      {report && (
        <aside className="mt-4 border-t pt-3 text-sm text-muted-foreground" aria-label={t("verified.trial.scopeTitle")}>
          <p className="text-xs uppercase tracking-wider">{t("verified.trial.scopeTitle")}</p>
          <p className="mt-1.5">{t("verified.trial.scope1")}</p>
          <p className="mt-1.5">{t("verified.trial.scope2")}</p>
        </aside>
      )}

      {fetchError && (
        <p role="alert" className="mt-6 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">{fetchError}</p>
      )}

      {running && !fetchError && (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-teal-600" aria-hidden />
              <p className="text-sm">{t(`verified.trial.state.${stalled ? "stalled" : status?.state ?? "pending"}`)}</p>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{t("verified.trial.elapsed", { minutes: String(elapsedMin) })}</p>
            {status?.runUrl && (
              <a href={status.runUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm underline underline-offset-2">
                {t("verified.trial.runLink")} <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </CardContent>
        </Card>
      )}

      {status?.state === "expired" && (
        <p className="mt-6 text-sm">{t("verified.trial.state.expired")}</p>
      )}

      {status?.state === "completed" && !report && (
        <Card className="mt-6">
          <CardContent className="pt-6 text-sm">
            <p>{t("verified.trial.noReport")}</p>
            {status.runUrl && (
              <a href={status.runUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 underline underline-offset-2">
                {t("verified.trial.runLink")} <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </CardContent>
        </Card>
      )}

      {report && verdict && (
        <>
          <section className="mt-6 rounded-lg border p-5" aria-labelledby="trial-verdict">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className={`${VERDICT_TONE[verdict.code]} border-transparent text-sm`}>{t(`verified.trial.verdict.${verdict.code}`)}</Badge>
              <h2 id="trial-verdict" className="text-lg font-semibold">{t(`verified.trial.verdictMeaning.${verdict.code}`)}</h2>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{verdict.reason}</p>
            {verdict.readme_gaps && verdict.readme_gaps.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold">{t("verified.trial.gapsTitle")}</h3>
                <p className="mb-2 text-xs text-muted-foreground">{t("verified.trial.gapsHint")}</p>
                <ul className="list-disc space-y-1 pl-5 text-sm">
                  {verdict.readme_gaps.map((g) => <li key={g.item}>{g.text}</li>)}
                </ul>
              </div>
            )}
          </section>

          {verdict.blockers && verdict.blockers.length > 0 && status?.recipe && (
            <Card className="mt-6 border-amber-300 dark:border-amber-800">
              <CardHeader>
                <CardTitle className="text-base">{t("verified.trial.stoppedTitle")}</CardTitle>
                <p className="text-xs text-muted-foreground">{t("verified.trial.stoppedHint")}</p>
              </CardHeader>
              <CardContent>
                <ol className="space-y-5">
                  {verdict.blockers.map((b) => {
                    const issue = ownerIssueUrl(report, b, typeof window !== "undefined" ? window.location.href.split("?")[0] : "");
                    return (
                      <li key={b.code} className="text-sm">
                        <p className="font-medium">{b.what}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {b.self_fix && (
                            <Button
                              size="sm"
                              onClick={() => router.push(prepareSelfFix(report, status.recipe!, b.self_fix!))}
                              title={t("verified.trial.selfFixHint")}
                            >
                              {t("verified.trial.selfFix")}
                            </Button>
                          )}
                          {issue && (
                            <Button asChild size="sm" variant="outline" title={t("verified.trial.askOwnerHint")}>
                              <a href={issue} target="_blank" rel="noopener noreferrer">
                                {t("verified.trial.askOwner")} <ExternalLink className="ml-1 h-3.5 w-3.5" />
                              </a>
                            </Button>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{b.self_fix_text}</p>
                      </li>
                    );
                  })}
                </ol>
              </CardContent>
            </Card>
          )}

          {role === "owner" && (
            <Card className="mt-6">
              <CardContent className="pt-6">
                {verdict.code === "runs" ? (
                  <>
                    <Button onClick={publish} disabled={publishState === "busy" || publishState === "done"}>
                      {t("verified.trial.publish")}
                    </Button>
                    <p className="mt-2 text-sm text-muted-foreground">{t("verified.trial.publishHint")}</p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">{t("verified.trial.publishOnlyRuns")}</p>
                )}
                {publishMsg && (
                  <p role="status" className={`mt-3 text-sm ${publishState === "error" ? "text-red-700" : "text-teal-700"}`}>{publishMsg}</p>
                )}
              </CardContent>
            </Card>
          )}
          {role === "reviewer" && (
            <p className="mt-4 text-sm text-muted-foreground">{t("verified.trial.share")}</p>
          )}
          {role === "user" && (
            <p className="mt-4 text-sm text-muted-foreground">
              <Link href={`/verified/trial/${id}?as=owner`} className="underline underline-offset-2">{t("verified.trial.asOwnerCta")}</Link>
            </p>
          )}

          <Card className="mt-6">
            <CardHeader><CardTitle className="text-base">{t("verified.trial.gates")}</CardTitle></CardHeader>
            <CardContent>
              <ul className="divide-y text-sm">
                {VERIFIED_GATES.map((g) => (
                  <li key={g.key} className="flex items-start gap-3 py-2">
                    <span className={`mt-0.5 inline-block h-2.5 w-2.5 shrink-0 rounded-full ${report.gates?.[g.key] ? "bg-teal-600" : "bg-slate-300"}`} aria-hidden />
                    <span className="w-40 shrink-0 font-medium">{g.label}</span>
                    <span className="text-muted-foreground">{t(g.meaningKey)}</span>
                  </li>
                ))}
                {"example" in (report.gates ?? {}) && (
                  <li className="flex items-start gap-3 py-2">
                    <span className={`mt-0.5 inline-block h-2.5 w-2.5 shrink-0 rounded-full ${(report.gates as Record<string, boolean>).example ? "bg-teal-600" : "bg-slate-300"}`} aria-hidden />
                    <span className="w-40 shrink-0 font-medium">{t("verified.trial.example")}</span>
                    <span className="text-muted-foreground">{t("verified.trial.exampleMeaning")}</span>
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>

          {status?.recipe && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-base">{t("verified.trial.recipeTitle")}</CardTitle>
                <p className="text-xs text-muted-foreground">{t("verified.trial.recipeHint")}</p>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {cmd && (
                  <div>
                    <p className="mb-1 font-medium">{t("verified.trial.recipeCmd")}</p>
                    <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs"><code>{cmd}</code></pre>
                  </div>
                )}
                <div>
                  <p className="mb-1 font-medium">{t("verified.trial.recipeDockerfile")}</p>
                  {repoDockerfile ? (
                    <p className="text-muted-foreground">{t("verified.trial.recipeRepoDockerfile")}</p>
                  ) : (
                    <>
                      <button type="button" className="text-xs underline underline-offset-2" onClick={() => setShowDockerfile((v) => !v)}>
                        {showDockerfile ? "−" : "+"} Dockerfile
                      </button>
                      {showDockerfile && (
                        <pre className="mt-2 overflow-x-auto rounded-md bg-muted p-3 text-xs"><code>{status.recipe.dockerfile}</code></pre>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {report.caveats?.items?.length ? (
            <Card className="mt-6">
              <CardHeader><CardTitle className="text-base">{t("verified.trial.caveatsTitle")}</CardTitle></CardHeader>
              <CardContent>
                <ul className="list-disc space-y-1 pl-5 text-sm">
                  {report.caveats.items.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </CardContent>
            </Card>
          ) : null}

          {Object.keys(status?.logs ?? {}).length > 0 && (
            <Card className="mt-6">
              <CardHeader><CardTitle className="text-base">{t("verified.trial.logsTitle")}</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(status!.logs).map((k) => (
                    <Button key={k} variant={openLog === k ? "default" : "outline"} size="sm" onClick={() => setOpenLog(openLog === k ? null : k)}>
                      {t(`verified.trial.log.${k}`)}
                    </Button>
                  ))}
                </div>
                {openLog && (
                  <pre className="mt-3 max-h-96 overflow-auto rounded-md bg-muted p-3 text-xs"><code>{status!.logs[openLog]}</code></pre>
                )}
              </CardContent>
            </Card>
          )}

          <p className="mt-6 flex flex-wrap gap-4 text-sm">
            {status?.files?.pdf && (
              <a href={status.files.pdf} className="inline-flex items-center gap-1 underline underline-offset-2">
                {t("verified.trial.pdf")}
              </a>
            )}
            {status?.files?.html && (
              <a href={status.files.html} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline underline-offset-2">
                {t("verified.trial.html")} <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
            {status?.runUrl && (
              <a href={status.runUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline underline-offset-2">
                {t("verified.trial.runLink")} <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
            <Link href={role === "reviewer" ? "/verified/review" : role === "user" ? "/verified/check" : "/verified/submit"} className="underline underline-offset-2">
              {t("verified.trial.again")}
            </Link>
          </p>
          <p className="mt-8 text-xs text-muted-foreground">{report.scope}</p>
        </>
      )}
    </div>
  );
}

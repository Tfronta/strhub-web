"use client";

/**
 * "Is it my setup, or the tool?" — the third entry.
 *
 * Someone who could not get a tool running has two things: the tool's URL and
 * an error. The URL is looked up in the catalogue; a published run shows the
 * exact environment, command and log that worked, which is the comparison they
 * need. The error is classified in the browser (lib/verified/log-kinds.ts) and,
 * when the catalogue has a run of that tool, compared with what STRhub itself
 * hit. Neither step needs an account or sends the log anywhere. If the tool is
 * not in the catalogue, the rehearsal form is one click down.
 */
import { useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";
import { PageTitle } from "@/components/page-title";
import { VerifiedStart } from "@/components/verified/verified-start";
import { classifyLog, type LogFinding } from "@/lib/verified/log-kinds";
import { VERIFIED_LEVELS, type VerifiedIndex, type VerifiedIndexEntry } from "@/types/verified";

function normalize(url: string): string {
  return url.trim().toLowerCase().replace(/\.git$/, "").replace(/\/+$/, "");
}

export function VerifiedCheck({ index }: { index: VerifiedIndex }) {
  const { t } = useLanguage();
  const [repo, setRepo] = useState("");
  const [log, setLog] = useState("");
  const [findings, setFindings] = useState<LogFinding[] | null>(null);
  const [showTrial, setShowTrial] = useState(false);

  const matches = useMemo<VerifiedIndexEntry[]>(() => {
    const key = normalize(repo);
    if (!key.startsWith("https://github.com/")) return [];
    return index.tools
      .filter((e) => e.source_repo && normalize(e.source_repo) === key)
      .sort((a, b) => (b.generated ?? "").localeCompare(a.generated ?? ""));
  }, [repo, index]);

  const looked = normalize(repo).startsWith("https://github.com/");
  // Kinds the published runs of this tool reported themselves. The index
  // carries only the flag, so "seen here" needs a run that reported errors and
  // a finding on the tool's side; a precise per-kind comparison is on the
  // report page each run links to.
  const anyReportedErrors = matches.some((m) => m.errors_reported);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <PageTitle title={t("verified.check.title")} description={t("verified.check.lead")} />

      <div className="mt-8 space-y-2">
        <Label htmlFor="check-repo">{t("verified.check.lookupLabel")}</Label>
        <Input
          id="check-repo"
          type="url"
          inputMode="url"
          autoComplete="off"
          placeholder={t("verified.start.repoPlaceholder")}
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
        />
      </div>

      {looked && matches.length > 0 && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-base">{t("verified.check.found")}</CardTitle>
            <p className="text-xs text-muted-foreground">{t("verified.check.foundHint")}</p>
          </CardHeader>
          <CardContent>
            <ul className="divide-y text-sm">
              {matches.map((m) => (
                <li key={m.slug} className="flex flex-wrap items-center gap-3 py-2">
                  <Badge variant="outline">{VERIFIED_LEVELS[m.level]?.label ?? m.level}</Badge>
                  <Link href={`/verified/${m.slug}`} className="font-medium underline underline-offset-2">{m.slug}</Link>
                  <span className="text-muted-foreground">{m.source_ref?.slice(0, 7)} · {(m.generated ?? "").slice(0, 10)}</span>
                  {m.ci_run && (
                    <a href={m.ci_run} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs underline underline-offset-2">
                      log <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      {looked && matches.length === 0 && (
        <p className="mt-3 text-sm text-muted-foreground">{t("verified.check.notFound")}</p>
      )}

      <div className="mt-8 space-y-2">
        <Label htmlFor="check-log">{t("verified.check.errorLabel")}</Label>
        <Textarea
          id="check-log"
          rows={6}
          placeholder={t("verified.check.errorPlaceholder")}
          value={log}
          onChange={(e) => setLog(e.target.value)}
          className="font-mono text-xs"
        />
        <Button type="button" variant="outline" onClick={() => setFindings(classifyLog(log))} disabled={!log.trim()}>
          {t("verified.check.errorCta")}
        </Button>
      </div>

      {findings && (
        <Card className="mt-4">
          <CardContent className="pt-6 text-sm">
            {findings.length === 0 ? (
              <p>{t("verified.check.errorNone")}</p>
            ) : (
              <ul className="space-y-3">
                {findings.map((f) => (
                  <li key={f.kind}>
                    <p className="font-medium">{t(`verified.check.errorKind.${f.kind}`)}</p>
                    <pre className="mt-1 overflow-x-auto rounded bg-muted p-2 text-xs"><code>{f.line}</code></pre>
                    {matches.length > 0 && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {f.side === "tool" || (f.side === "either" && anyReportedErrors)
                          ? t("verified.check.seenHere")
                          : t("verified.check.notSeenHere")}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}

      <div className="mt-10">
        {showTrial ? (
          <VerifiedStart role="user" compact />
        ) : (
          <Button type="button" onClick={() => setShowTrial(true)}>{t("verified.check.rehearse")}</Button>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Clock, Download, Play, PlayCircle, TriangleAlert, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import { youtubeEmbedUrl, type Tutorial, type TutorialError } from "@/lib/tutorials";
import { formatDate } from "@/lib/verified/format-date";
import { cn } from "@/lib/utils";
import { StuckHere } from "./StuckHere";
import { TerminalBlock } from "./TerminalBlock";
import { InlineCode, TutorialLine, TutorialMarkdown } from "./TutorialMarkdown";

const NUMBER_LOCALE: Record<string, string> = { en: "en-GB", es: "es", pt: "pt-BR" };

function ErrorBox({ error, title }: { error: TutorialError; title: string }) {
  return (
    <div className="rounded-lg border border-amber-300/70 bg-amber-50 p-4 text-sm dark:border-amber-700/60 dark:bg-amber-950/30">
      <p className="flex items-center gap-1.5 font-semibold">
        <TriangleAlert className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
        {title}
      </p>
      <pre className="mt-2 overflow-x-auto whitespace-pre-wrap font-mono text-xs [overflow-wrap:anywhere]">
        {error.error}
      </pre>
      <p className="mt-2 leading-relaxed">
        <TutorialLine text={error.fix} />
      </p>
    </div>
  );
}

/** Native details: works before hydration and needs no state. */
function Disclosure({ summary, children }: { summary: string; children: React.ReactNode }) {
  return (
    <details className="group">
      <summary className="flex w-fit cursor-pointer list-none items-center gap-1 text-sm font-semibold text-primary [&::-webkit-details-marker]:hidden">
        <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" aria-hidden />
        {summary}
      </summary>
      <div className="mt-2 space-y-2">{children}</div>
    </details>
  );
}

/**
 * A table from `sm` up; on a phone each row stacks, names first and the
 * explanation below, instead of squeezing the explanation off the screen.
 */
function Table({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <table className="w-full border-collapse text-sm">
      {head.length > 0 && (
        <thead className="hidden sm:table-header-group">
          <tr>
            {head.map((h) => (
              <th key={h} className="whitespace-nowrap border-b px-2 py-2 text-left text-xs font-semibold text-muted-foreground">
                {h}
              </th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {rows.map((cells, i) => (
          <tr key={i} className="block border-b py-2 align-top last:border-0 sm:table-row sm:py-0">
            {cells.map((c, j) =>
              j < cells.length - 1 ? (
                <td key={j} className="inline-block pr-2 sm:table-cell sm:whitespace-nowrap sm:px-2 sm:py-2">
                  {c}
                </td>
              ) : (
                <td key={j} className="block pt-1 leading-relaxed sm:table-cell sm:px-2 sm:py-2">
                  {c}
                </td>
              ),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/**
 * With a cover, the page shows it with a play button and loads YouTube only
 * on the click: the reader sees our cover rather than YouTube's thumbnail,
 * and nothing is fetched from YouTube until they ask for the video.
 */
function Video({ id, title, poster }: { id: string | null; title: string; poster?: string }) {
  const { language, t } = useLanguage();
  const [playing, setPlaying] = useState(false);
  if (!id) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-muted/40 px-4 py-10 text-center text-muted-foreground">
        <PlayCircle className="h-10 w-10" aria-hidden />
        <p className="text-sm">{t("tools.tutorialPage.videoSoon")}</p>
      </div>
    );
  }
  if (poster && !playing) {
    return (
      <button
        type="button"
        onClick={() => setPlaying(true)}
        aria-label={`${t("tools.tutorialPage.playVideo")}: ${title}`}
        className="group relative block aspect-video w-full overflow-hidden rounded-xl border bg-muted outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <img src={poster} alt="" width={1280} height={720} className="h-full w-full object-cover" />
        <span className="absolute inset-0 flex items-center justify-center transition-colors group-hover:bg-black/5">
          {/* Small on phones: it sits in the gap between the cover's title and its terminal. */}
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-2 ring-white/70 transition-transform group-hover:scale-110 sm:h-16 sm:w-16 sm:ring-4">
            <Play className="h-4 w-4 translate-x-px fill-current sm:h-7 sm:w-7 sm:translate-x-0.5" aria-hidden />
          </span>
        </span>
      </button>
    );
  }
  return (
    <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
      <iframe
        // Remount on a language change so the player picks up the new captions.
        key={language}
        src={youtubeEmbedUrl(id, language, { autoplay: playing })}
        title={title}
        className="h-full w-full"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}

/** `poster`: the video's cover in `public/`, shown until the reader presses play. */
export function TutorialPage({ tutorial, poster }: { tutorial: Tutorial; poster?: string }) {
  const { language, t } = useLanguage();
  const text = tutorial.i18n[language] ?? tutorial.i18n.en;
  const tp = (key: string, params?: Record<string, string>) =>
    t(`tools.tutorialPage.${key}`, params);
  const zip = tutorial.zip;
  const errorTitle = tp("errorTitle");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <nav aria-label="breadcrumb" className="mb-4 text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/tools" className="hover:text-foreground">
                {tp("breadcrumbTools")}
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li>
              <Link href={`/tools#tool-${tutorial.tool.toLowerCase()}`} className="hover:text-foreground">
                {tutorial.tool}
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li className="text-foreground" aria-current="page">
              {t("tools.common.tutorial")}
            </li>
          </ol>
        </nav>

        <header className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight">{text.title}</h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary" className="gap-1">
              <Wrench className="h-3 w-3" aria-hidden />
              {tp("toolLabel")}: {tutorial.tool} {tutorial.version}
            </Badge>
            <Badge variant="outline" className="gap-1 font-normal">
              <Clock className="h-3 w-3" aria-hidden />
              {tp("timeLabel")}: {text.duration}
            </Badge>
            <Badge variant="outline" className="font-normal">
              {tp("steps", { count: String(text.steps.length) })}
            </Badge>
          </div>
          <TutorialMarkdown text={text.summary} className="text-lg text-muted-foreground" />
          {language !== "en" && (
            <p className="text-sm text-muted-foreground">{tp("englishNote")}</p>
          )}
        </header>

        <section className="mt-6 space-y-2">
          <Video id={tutorial.youtube} title={tp("videoTitle", { tool: tutorial.tool })} poster={poster} />
          {tutorial.youtube && <p className="text-xs text-muted-foreground">{tp("subtitles")}</p>}
        </section>

        <section id="before-you-start" className="mt-10 scroll-mt-24 space-y-5">
          <h2 className="text-2xl font-semibold tracking-tight">{tp("beforeStart")}</h2>
          <TutorialMarkdown text={text.get_started} />

          {text.install.map((inst) => (
            <div key={inst.os} className="space-y-2">
              <h3 className="text-lg font-semibold">{tp("installHeading", { os: inst.os })}</h3>
              <TutorialMarkdown text={inst.note} className="text-sm" />
              <TerminalBlock code={inst.commands.trimEnd()} />
            </div>
          ))}

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">{tp("setupHeading")}</h3>
            {zip?.url && (
              <Button asChild size="sm">
                <a href={zip.url} download>
                  <Download className="h-4 w-4" aria-hidden />
                  {tp("download", {
                    name: zip.name,
                    size: new Intl.NumberFormat(NUMBER_LOCALE[language] ?? "en-GB").format(zip.size_mb),
                  })}
                </a>
              </Button>
            )}
            <TerminalBlock code={text.setup.trimEnd()} />
            <TutorialMarkdown text={text.setup_explain} className="text-sm" />
            {(text.install_errors ?? []).map((e) => (
              <ErrorBox key={e.error} error={e} title={errorTitle} />
            ))}
            <StuckHere
              tool={tutorial.tool}
              tutorialId={tutorial.id}
              stepId="before-you-start"
              stepNumber={null}
              stepTitle={tp("stuck.installStep")}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{tp("filesHeading")}</h3>
            <Table
              head={[]}
              rows={text.files.map((f) => [
                <InlineCode key="f">{f.file}</InlineCode>,
                <TutorialLine key="w" text={f.what} />,
              ])}
            />
          </div>
        </section>

        <section className="mt-10 space-y-5">
          <h2 className="text-2xl font-semibold tracking-tight">{tp("stepByStep")}</h2>
          {text.steps.map((step, i) => (
            <article
              key={step.id}
              id={step.id}
              className="scroll-mt-24 space-y-3 rounded-xl border bg-card p-4 sm:p-5"
            >
              <h3 className="flex items-baseline gap-2.5 text-lg font-semibold leading-snug">
                <span className="inline-flex h-7 min-w-7 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-sm text-primary-foreground">
                  {i + 1}
                </span>
                <span>
                  <TutorialLine text={step.title} />
                </span>
              </h3>
              <TutorialMarkdown text={step.explain} />
              <TerminalBlock code={step.command} />
              {!!step.parameters?.length && (
                <Table
                  head={[tp("option"), tp("inExample"), tp("withYourData")]}
                  rows={step.parameters.map((p) => [
                    <InlineCode key="o">{p.option}</InlineCode>,
                    p.example != null ? <InlineCode key="e">{p.example}</InlineCode> : null,
                    <TutorialLine key="w" text={p.what} />,
                  ])}
                />
              )}
              {!!step.fields?.length && (
                <Table
                  head={[tp("field"), tp("meaning")]}
                  rows={step.fields.map((f) => [
                    <InlineCode key="n">{f.name}</InlineCode>,
                    <TutorialLine key="w" text={f.what} />,
                  ])}
                />
              )}
              {step.output && (
                <Disclosure summary={tp("output")}>
                  {step.output_note && (
                    <p className="text-xs text-muted-foreground">{step.output_note}</p>
                  )}
                  <TerminalBlock code={step.output} variant="output" />
                </Disclosure>
              )}
              {step.extra && (
                <div className="space-y-3 border-t pt-3">
                  <TutorialMarkdown text={step.extra.intro} />
                  <TerminalBlock code={step.extra.command} />
                  {step.extra.output && (
                    <Disclosure summary={tp("output")}>
                      <TerminalBlock code={step.extra.output} variant="output" />
                    </Disclosure>
                  )}
                </div>
              )}
              {(step.errors ?? []).map((e) => (
                <ErrorBox key={e.error} error={e} title={errorTitle} />
              ))}
              <StuckHere
                tool={tutorial.tool}
                tutorialId={tutorial.id}
                stepId={step.id}
                stepNumber={i + 1}
                stepTitle={step.title}
              />
            </article>
          ))}
        </section>

        <section className="mt-10 space-y-3">
          <h2 className="text-2xl font-semibold tracking-tight">{tp("closingHeading")}</h2>
          <TutorialMarkdown text={text.closing} />
        </section>

        <p className="mt-10 border-t pt-4 text-xs text-muted-foreground">
          {tp("tested", {
            date: formatDate(tutorial.tested.date, language),
            system: tutorial.tested.system,
            tool: tutorial.tool,
            commit: tutorial.tested.commit,
            ok: String(tutorial.tested.ok),
            total: String(tutorial.tested.total),
          })}
        </p>
      </div>
    </div>
  );
}

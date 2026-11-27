"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, X } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import type { TerminalOutputSummary } from "@/lib/verified/output-evidence";

export interface ReportLog {
  leg: string;
  label: string;
  href: string;
  hasInvocation: boolean;
}

async function readTerminal(href: string, signal: AbortSignal): Promise<string | null> {
  const response = await fetch(href, { signal, redirect: "error" });
  if (!response.ok || !response.body) throw new Error("Log unavailable");

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8", { ignoreBOM: true });
  let bytes = 0;
  let text = "";
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) return text + decoder.decode();
      bytes += value.byteLength;
      if (bytes > 2_000_000) {
        await reader.cancel();
        return null;
      }
      text += decoder.decode(value, { stream: true });
    }
  } finally {
    reader.releaseLock();
  }
}

export function RecordedTerminal({
  logs,
  preferredLeg,
  preflight,
  outputSummary,
  outputSectionHref,
  scrollToEnd = false,
}: {
  logs: ReportLog[];
  preferredLeg: string;
  preflight: boolean;
  outputSummary?: TerminalOutputSummary | null;
  outputSectionHref?: string;
  scrollToEnd?: boolean;
}) {
  const { t, language } = useLanguage();
  const picker = useId();
  const preRef = useRef<HTMLPreElement>(null);
  const [leg, setLeg] = useState<string>();
  const [loaded, setLoaded] = useState<{ href: string; text?: string | null }>();
  const selected = logs.find((log) => log.leg === leg)
    ?? logs.find((log) => log.leg === preferredLeg)
    ?? logs[0];
  const href = preflight ? undefined : selected?.href;

  useEffect(() => {
    if (!href) return;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort("timeout"), 8_000);
    readTerminal(href, controller.signal).then(
      (text) => {
        if (!controller.signal.aborted) setLoaded({ href, text });
      },
      () => {
        if (!controller.signal.aborted || controller.signal.reason === "timeout") setLoaded({ href });
      },
    ).finally(() => clearTimeout(timer));
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [href]);

  if (!selected) return null;
  if (preflight) {
    return (
      <a href={selected.href} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm underline underline-offset-2">
        {t("verified.log.preflight")}
      </a>
    );
  }

  const result = loaded?.href === href ? loaded : undefined;

  useEffect(() => {
    if (scrollToEnd && typeof result?.text === "string" && preRef.current) {
      preRef.current.scrollTop = preRef.current.scrollHeight;
    }
  }, [scrollToEnd, result?.text, selected?.leg]);

  return (
    <figure className="mt-4 overflow-hidden rounded-lg border border-slate-800 bg-slate-950 text-slate-100">
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 px-4 py-3 text-sm">
        <span className="font-semibold">{t(selected.hasInvocation ? "verified.log.terminal" : "verified.log.savedOutput")}</span>
        {logs.length > 1 ? (
          <div className="flex items-center gap-2">
            <label htmlFor={picker}>{t("verified.log.stage")}</label>
            <select
              id={picker}
              value={selected.leg}
              onChange={(event) => setLeg(event.target.value)}
              className="max-w-56 rounded border border-slate-600 bg-slate-900 px-2 py-1 text-xs"
            >
              {logs.map((log) => <option key={log.leg} value={log.leg}>{log.label}</option>)}
            </select>
          </div>
        ) : <span className="text-xs text-slate-300">{selected.label}</span>}
        <a href={selected.href} target="_blank" rel="noopener noreferrer" className="text-xs underline underline-offset-2">
          {t("verified.log.openOriginal")}
        </a>
      </figcaption>
      {!selected.hasInvocation && (
        <p className="px-4 pt-3 text-xs text-slate-300">{t("verified.log.commandUnavailable")}</p>
      )}
      {typeof result?.text === "string" ? (
        <pre ref={preRef} tabIndex={0} className="max-h-96 overflow-auto whitespace-pre p-4 font-mono text-xs leading-relaxed">
          <code>{result.text}</code>
        </pre>
      ) : (
        <p role="status" className="p-4 text-sm">
          {t(!result ? "verified.log.loading" : result.text === null ? "verified.log.tooLarge" : "verified.log.unavailable")}
        </p>
      )}
      {outputSummary && selected.leg !== "build" && (() => {
        const fmt = (value: number) => new Intl.NumberFormat(language).format(value);
        const parts: string[] = [];
        if (typeof outputSummary.records === "number") {
          parts.push(t("verified.log.recordsCount", { count: fmt(outputSummary.records) }));
        }
        if (typeof outputSummary.strLoci === "number") {
          parts.push(t("verified.log.strLociCount", { count: fmt(outputSummary.strLoci) }));
        }
        if (typeof outputSummary.snps === "number") {
          parts.push(t("verified.log.snpsCount", { count: fmt(outputSummary.snps) }));
        }
        return (
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 bg-slate-900/70 px-4 py-2.5 text-xs text-slate-300">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              {outputSummary.passed ? (
                <Check className="h-3.5 w-3.5 shrink-0 text-teal-400" aria-hidden />
              ) : (
                <X className="h-3.5 w-3.5 shrink-0 text-red-400" aria-hidden />
              )}
              <span className="font-medium text-slate-200">
                {t(outputSummary.passed ? "verified.log.outputVerified" : "verified.log.outputFailed")}:
              </span>
              <code className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[11px] text-slate-100 break-all">
                {outputSummary.file}
              </code>
              {parts.length > 0 && (
                <span className="text-slate-400 tabular-nums">· {parts.join(" · ")}</span>
              )}
            </div>
            {outputSectionHref && (
              <a
                href={outputSectionHref}
                className="shrink-0 text-teal-400 underline-offset-2 hover:underline"
              >
                {t("verified.log.viewOutputDetails")}
              </a>
            )}
          </div>
        );
      })()}
    </figure>
  );
}

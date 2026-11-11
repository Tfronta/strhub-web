"use client";

import { useEffect, useId, useState } from "react";
import { useLanguage } from "@/contexts/language-context";

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

export function RecordedTerminal({ logs, preferredLeg, preflight }: {
  logs: ReportLog[];
  preferredLeg: string;
  preflight: boolean;
}) {
  const { t } = useLanguage();
  const picker = useId();
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
        <pre tabIndex={0} className="max-h-96 overflow-auto whitespace-pre-wrap break-words p-4 font-mono text-xs leading-relaxed">
          <code>{result.text}</code>
        </pre>
      ) : (
        <p role="status" className="p-4 text-sm">
          {t(!result ? "verified.log.loading" : result.text === null ? "verified.log.tooLarge" : "verified.log.unavailable")}
        </p>
      )}
    </figure>
  );
}

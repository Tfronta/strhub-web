"use client";

/**
 * Read a verification result, draft the issue it justifies, and hand it to a
 * person to send — or not.
 *
 * The button that matters here is the one this component does NOT have: nothing
 * is posted from the browser or the server. "Abrir en GitHub" prefills GitHub's
 * own new-issue form, in the reviewer's own session, with the Submit button
 * theirs to press. That is the whole design: a stranger's repository is not
 * somewhere an automated pipeline gets to write.
 */
import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, Check, Copy, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { VerifiedReport } from "@/types/verified";
import { buildIssueDraft, repoSlug, type IssueDraft } from "@/lib/verified/issue-draft";

const BASE =
  process.env.NEXT_PUBLIC_VERIFIED_BASE ??
  "https://raw.githubusercontent.com/Tfronta/strhub-verified/gh-pages";

/**
 * Above this, GitHub's prefill silently truncates or the request is refused, and
 * a half-sent issue is worse than a copied one. Well under the ~8k practical URL
 * ceiling, because the title and escaping ride along too.
 */
const MAX_PREFILL = 6000;

export function IssueDraftDialog({
  slug,
  open,
  onOpenChange,
}: {
  slug: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [report, setReport] = useState<VerifiedReport | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [includeRepoNotes, setIncludeRepoNotes] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open || !slug) return;
    let cancelled = false;
    setState("loading");
    setReport(null);
    setIncludeRepoNotes(false);
    fetch(`${BASE}/${slug}.json`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((data: VerifiedReport) => {
        if (cancelled) return;
        setReport(data);
        setState("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setState("error");
      });
    return () => {
      cancelled = true;
    };
  }, [open, slug]);

  // Rebuilt whenever the report or the notes toggle changes, which also discards
  // hand edits — deliberately: the toggle changes what the draft asserts, and
  // silently keeping an edited body would leave the checkbox lying about it.
  const draft: IssueDraft | null =
    report && slug ? buildIssueDraft(report, slug, { includeRepoNotes }) : null;

  useEffect(() => {
    if (!draft) return;
    setTitle(draft.title);
    setBody(draft.body);
    setCopied(false);
    // Rebuilding on the draft's own identity, not the object reference.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft?.title, includeRepoNotes, report]);

  const target = repoSlug(report?.source?.repo);
  const prefill = target
    ? `https://github.com/${target}/issues/new?title=${encodeURIComponent(
        title,
      )}&body=${encodeURIComponent(body)}`
    : "";
  const tooLong = prefill.length > MAX_PREFILL;

  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(`${title}\n\n${body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }, [title, body]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Borrador de issue para quien mantiene la herramienta</DialogTitle>
          <DialogDescription>
            Desde acá no se manda nada. Leelo, editalo y abrilo vos.
          </DialogDescription>
        </DialogHeader>

        {state === "loading" && (
          <p className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Leyendo el resultado publicado…
          </p>
        )}

        {state === "error" && (
          <p className="py-8 text-sm text-destructive">
            No hay resultado publicado para <code>{slug}</code>. Una herramienta tiene
            que haberse verificado antes de que haya algo que contar.
          </p>
        )}

        {state === "ready" && !draft && (
          <div className="space-y-2 py-6 text-sm">
            <p className="font-medium">No hay nada que contarles.</p>
            <p className="text-muted-foreground">
              Esta corrida pasó todas las compuertas y no reportó errores. Lo que
              escribiéramos no sería novedad para nadie: un issue que nadie necesitaba.
            </p>
          </div>
        )}

        {state === "ready" && draft && (
          <div className="space-y-4">
            <div className="rounded-md border-l-4 border-l-primary bg-muted/50 p-3 text-sm">
              <p className="font-medium">Por qué esta corrida amerita escribir</p>
              <ul className="mt-1 list-inside list-disc text-muted-foreground">
                {draft.reasons.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm">Título</Label>
              <Textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                rows={2}
                className="font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm">Cuerpo</Label>
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={16}
                className="font-mono text-xs"
              />
            </div>

            {report?.caveats?.items?.length ? (
              <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border p-2.5 text-sm">
                <Checkbox
                  checked={includeRepoNotes}
                  onCheckedChange={(v) => setIncludeRepoNotes(v === true)}
                  className="mt-0.5"
                />
                <span>
                  Incluir la(s) {report.caveats.items.length} nota(s) de la lectura
                  del repositorio
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    Extraídas automáticamente, nunca establecidas corriendo nada.
                    Leelas antes de agregarlas: una afirmación equivocada y segura de sí
                    misma sobre código ajeno es lo único que no hay que mandarle a nadie.
                  </span>
                </span>
              </label>
            ) : null}

            {tooLong && (
              <p className="flex items-start gap-2 text-xs text-amber-700 dark:text-amber-500">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                Demasiado largo para precargar el formulario de GitHub sin truncarlo.
                Copialo y pegalo allá.
              </p>
            )}
          </div>
        )}

        <DialogFooter className="gap-2 sm:justify-between">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
          {state === "ready" && draft && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={copy}>
                {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                {copied ? "Copiado" : "Copiar"}
              </Button>
              <Button asChild disabled={!prefill || tooLong}>
                <a
                  href={tooLong || !prefill ? undefined : prefill}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Abrir en GitHub
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { AlertTriangle, Check, FileText, Info, X } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useHeaded } from "./certificate";
import { InlineCodeText } from "./inline-code";
import { cn } from "@/lib/utils";
import type {
  VerifiedContentStats,
  VerifiedIoOutput,
  VerifiedLevel,
  VerifiedOutputPreview,
  VerifiedOutputVerification,
  VerifiedVerdict,
} from "@/types/verified";
import { ioChecks, panelCoverage, vcfFileEvidence } from "@/lib/verified/output-evidence";

const STANDARD_SLICE_NOTE_PREFIX = "Reference sample scope: STRhub's standard reference dataset is a bounded genomic slice";

function formatBytes(bytes: number, language: string): string {
  if (!Number.isFinite(bytes) || bytes < 1024) {
    return `${new Intl.NumberFormat(language).format(Math.max(0, Math.round(bytes || 0)))} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function OutputPreviewCard({
  preview,
}: {
  preview?: VerifiedOutputPreview | null;
}) {
  const { t, language } = useLanguage();
  if (!preview || !preview.file) return null;
  const legKey = `verified.trial.log.${preview.leg}`;
  const legLabel = t(legKey) !== legKey ? t(legKey) : preview.leg;
  return (
    <div className="mt-4 rounded-lg border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="inline-flex items-center gap-1.5 text-sm font-semibold">
          <FileText className="h-4 w-4 text-muted-foreground" aria-hidden />
          {t("verified.content.previewHeading")}
        </h3>
        {preview.truncated && !preview.binary && (
          <span className="rounded-full border border-amber-500/40 bg-amber-50/70 px-2.5 py-0.5 text-xs font-medium text-amber-900 dark:border-amber-600/50 dark:bg-amber-950/35 dark:text-amber-300">
            {t("verified.content.previewTruncated", {
              lines: String(preview.lines.length),
            })}
          </span>
        )}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        {t("verified.content.previewMeta", {
          leg: legLabel,
          file: preview.file,
          size: formatBytes(preview.size_bytes, language),
        })}
      </p>
      {preview.binary ? (
        <p className="mt-2.5 rounded border border-dashed bg-muted/30 px-3 py-2 text-xs italic text-muted-foreground">
          {t("verified.content.previewBinary")}
        </p>
      ) : preview.lines.length > 0 ? (
        <pre className="mt-2.5 max-h-80 overflow-auto rounded-md border bg-muted/60 p-3 font-mono text-xs leading-relaxed text-foreground">
          <code>{preview.lines.join("\n")}</code>
        </pre>
      ) : null}
    </div>
  );
}

export function SliceScopeNoteCard({
  note,
}: {
  note?: string | null;
}) {
  const { t } = useLanguage();
  if (!note?.trim()) return null;
  const body = note.startsWith(STANDARD_SLICE_NOTE_PREFIX)
    ? t("verified.content.sliceScopeDefault")
    : note;
  return (
    <div className="mt-4 rounded-lg border border-border bg-muted/35 p-4 text-sm">
      <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Info className="h-3.5 w-3.5 shrink-0" aria-hidden />
        {t("verified.content.sliceScopeHeading")}
      </p>
      <p className="mt-1.5 leading-relaxed text-muted-foreground">
        <InlineCodeText text={body} />
      </p>
    </div>
  );
}

export function VcfEvidence({ io }: { io?: VerifiedIoOutput }) {
  const { t, language } = useLanguage();
  const files = vcfFileEvidence(io);
  if (files.length === 0) return null;
  return (
    <section className="my-4 rounded-lg border p-4">
      <h3 className="font-semibold">{t("verified.vcfEvidence.heading")}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{t("verified.vcfEvidence.scope")}</p>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead><tr>{["file", "status", "records", "called", "uncalled", "withoutGt"].map((key) =>
            <th key={key} className="p-2">{t(`verified.vcfEvidence.${key}`)}</th>)}</tr></thead>
          <tbody>{files.map((file, index) => {
            const count = (value?: number) => file.validation_status === "valid" && typeof value === "number"
              ? new Intl.NumberFormat(language).format(value) : "—";
            return <tr key={`${file.resolved}-${index}`} className="border-t align-top">
              <td className="p-2"><code>{file.resolved}</code>
                {file.parse_error && <p className="mt-2 break-words text-muted-foreground">{file.parse_error}</p>}</td>
              <td className="p-2">{t(`verified.vcfEvidence.${file.validation_status ?? "unknown"}`)}</td>
              <td className="p-2">{count(file.records)}</td>
              <td className="p-2">{count(file.called_records)}</td>
              <td className="p-2">{count(file.uncalled_rows)}</td>
              <td className="p-2">{count(file.records_without_gt)}</td>
            </tr>;
          })}</tbody>
        </table>
      </div>
    </section>
  );
}

function Stat({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold tabular-nums mt-1">{value}</p>
      {detail && <p className="text-xs text-muted-foreground font-mono">{detail}</p>}
    </div>
  );
}

export function OutputContent({
  stats,
  io,
  panelLoci,
  outputVerification,
  verdict,
  gates,
  outputPreview,
  sliceScopeNote,
}: {
  stats: VerifiedContentStats | undefined;
  /** The Expected IO gate's record of the same file, when the gate ran. */
  io?: VerifiedIoOutput;
  /** The loci of STRhub's reference panel, to name what was not called. */
  panelLoci?: string[];
  outputVerification?: VerifiedOutputVerification | null;
  verdict?: VerifiedVerdict | null;
  gates?: Partial<Record<VerifiedLevel, boolean>>;
  outputPreview?: VerifiedOutputPreview | null;
  sliceScopeNote?: string | null;
}) {
  const { t, language } = useLanguage();
  const status = outputVerification?.status ?? verdict?.output_status;
  const runProducedOutput =
    verdict?.code === "runs" ||
    Boolean(gates?.runs && gates?.io) ||
    outputVerification?.io_passed === true ||
    io?.passed === true;
  const contentVerified =
    outputVerification?.content_verified ??
    verdict?.content_verified ??
    Boolean(gates?.content);
  const contentUnverified =
    runProducedOutput && !contentVerified;
  const isExampleOnly = status === "example_only_content_unverified" || verdict?.basis === "example";

  const checks = ioChecks(io);
  const vcfFiles = vcfFileEvidence(io);
  const outputFile = vcfFiles.length > 1
    ? vcfFiles.map((file) => file.resolved).join(", ")
    : io?.resolved ?? io?.path;
  const format = io?.format?.toUpperCase();

  const statusCallout = contentUnverified ? (
    <div className="mb-4 rounded-lg border border-amber-500/45 bg-amber-50/60 p-4 text-sm dark:border-amber-600/50 dark:bg-amber-950/25">
      <div className="flex items-start gap-2.5">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-400" aria-hidden />
        <div className="space-y-1">
          <p className="font-semibold text-amber-950 dark:text-amber-200">
            {t("verified.content.unverifiedTitle")}
          </p>
          <p className="text-muted-foreground leading-relaxed">
            {isExampleOnly
              ? t("verified.content.exampleUnverifiedBody")
              : t("verified.content.unverifiedBody")}
          </p>
        </div>
      </div>
    </div>
  ) : contentVerified && stats ? (
    <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-teal-600/40 bg-teal-50/75 px-3 py-1 text-xs font-semibold text-teal-900 dark:border-teal-500/45 dark:bg-teal-950/40 dark:text-teal-200">
      <Check className="h-3.5 w-3.5 shrink-0" aria-hidden />
      <span>{t("verified.content.verifiedBadge")}</span>
    </div>
  ) : null;

  const ioSummaryDl = (outputFile || checks.length > 0) ? (
    <dl className={cn("grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm", stats && "border-b pb-4 mb-4")}>
      {outputFile && (
        <>
          <dt className="text-muted-foreground">{t("verified.content.outputFile")}</dt>
          <dd>
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs break-all">{outputFile}</code>
            {format && <span className="ml-2 text-xs text-muted-foreground">{t("verified.content.format")}: {format}</span>}
          </dd>
        </>
      )}
      {checks.length > 0 && (
        <>
          <dt className="text-muted-foreground">{t("verified.content.ioChecksLabel")}</dt>
          <dd className="flex flex-wrap gap-1.5">
            {checks.map((c) => (
              <span
                key={c.key}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs",
                  c.passed
                    ? "border-teal-600/40 text-teal-700 dark:text-teal-400"
                    : "border-red-500/40 text-red-700 dark:text-red-400",
                )}
              >
                {c.passed ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                {c.key === "parses"
                  ? t("verified.content.ioCheck.parses", { format: c.format ?? "" })
                  : t(`verified.content.ioCheck.${c.key}`) === `verified.content.ioCheck.${c.key}`
                    ? c.key.replace(/_/g, " ")
                    : t(`verified.content.ioCheck.${c.key}`)}
              </span>
            ))}
          </dd>
        </>
      )}
    </dl>
  ) : null;

  if (!stats) {
    return (
      <>
        {!useHeaded() && (<h2 className="mt-10 text-xl font-semibold">{t("verified.content.heading")}</h2>)}
        {statusCallout}
        {vcfFiles.length > 0 ? (
          <VcfEvidence io={io} />
        ) : ioSummaryDl ? (
          <div className="mt-3 rounded-lg border bg-card p-5">
            {ioSummaryDl}
          </div>
        ) : !contentUnverified && !outputPreview ? (
          <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground bg-muted/20">
            <p className="italic">{t("verified.content.noOutputGenerated")}</p>
          </div>
        ) : null}
        <OutputPreviewCard preview={outputPreview} />
        <SliceScopeNoteCard note={sliceScopeNote} />
      </>
    );
  }

  const n = (v: number | undefined) => new Intl.NumberFormat(language).format(v ?? 0);
  const coverage = panelCoverage(stats, panelLoci);

  return (
    <>
      {!useHeaded() && (<h2 className="mt-10 text-xl font-semibold">{t("verified.content.heading")}</h2>)}
      <div className="mt-3 rounded-lg border bg-card p-5">
        {statusCallout}
        <VcfEvidence io={io} />
        {ioSummaryDl}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Stat label={t("verified.content.records")} value={n(stats.rows)} />
          <Stat label={t("verified.content.strLoci")} value={n(stats.distinct_str_loci ?? stats.distinct_loci)} />
          {(stats.distinct_snp_markers ?? 0) > 0 && (
            <Stat label={t("verified.content.snps")} value={n(stats.distinct_snp_markers)} />
          )}
        </div>

        {coverage && (
          <div className="mt-5 pt-4 border-t">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{t("verified.content.panelCoverage")}</p>
              <p className="text-sm font-semibold tabular-nums">
                {t("verified.content.panelCoverageValue", { hit: String(coverage.hit), given: String(coverage.given) })}
              </p>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted" role="img"
                 aria-label={t("verified.content.panelCoverageValue", { hit: String(coverage.hit), given: String(coverage.given) })}>
              <div className="h-full rounded-full bg-teal-600" style={{ width: `${Math.round((coverage.hit / coverage.given) * 100)}%` }} />
            </div>
            {coverage.notCalled.length > 0 && (
              <p className="mt-2 text-sm">
                <span className="text-muted-foreground">{t("verified.content.notCalled")}</span>{" "}
                <span className="font-mono text-xs">{coverage.notCalled.join(", ")}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{t("verified.content.notCalledHint")}</span>
              </p>
            )}
          </div>
        )}

        {stats.str_loci && stats.str_loci.length > 0 && (
          <div className="mt-5 pt-4 border-t">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{t("verified.content.strLociList")}</p>
            <p className="text-xs font-mono text-muted-foreground leading-relaxed">{stats.str_loci.join(", ")}</p>
          </div>
        )}
      </div>
      <OutputPreviewCard preview={outputPreview} />
      <SliceScopeNoteCard note={sliceScopeNote} />
    </>
  );
}

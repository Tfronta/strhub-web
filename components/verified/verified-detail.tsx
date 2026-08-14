"use client";

import Link from "next/link";
import { ArrowLeft, Check, Minus, ExternalLink, AlertTriangle, Info, XCircle, LifeBuoy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";
import { SiteFooter } from "@/components/site-footer";
import {
  VERIFIED_LEVELS,
  VERIFIED_GATES,
  type VerifiedReport,
} from "@/types/verified";
import { cn } from "@/lib/utils";
import {
  summarizeErrors,
  hasReportedErrors,
  externalLegNoteKeys,
  errorAwareLevel,
  installFaultKey,
} from "@/lib/verified/diagnostics";
import { isManualEligible, reasonI18nKey } from "@/lib/verified/manual";

const CODIS_CORE_LOCI = [
  "Amelogenin", "CSF1PO", "D1S1656", "D2S441", "D2S1338", "D3S1358",
  "D5S818", "D7S820", "D8S1179", "D10S1248", "D12S391", "D13S317",
  "D16S539", "D17S1301", "D18S51", "D19S433", "D20S482", "D21S11",
  "D22S1045", "FGA", "TH01", "TPOX", "vWA", "PentaD", "PentaE",
  "DYS391", "SE33",
];

const FORENSEQ_STR_LOCI = [
  "Amelogenin", "CSF1PO", "D1S1656", "D2S441", "D2S1338", "D3S1358",
  "D4S2408", "D5S818", "D6S1043", "D7S820", "D8S1179", "D9S1122",
  "D10S1248", "D12S391", "D13S317", "D16S539", "D17S1301", "D18S51",
  "D19S433", "D20S482", "D21S11", "D22S1045", "FGA", "TH01", "TPOX",
  "vWA", "PentaD", "PentaE",
  "DXS7132", "DXS7423", "DXS8378", "DXS10074", "DXS10103", "DXS10135",
  "DYF387S1", "DYS19", "DYS385", "DYS389I", "DYS389II", "DYS390",
  "DYS391", "DYS392", "DYS437", "DYS438", "DYS439", "DYS448",
  "DYS456", "DYS458", "DYS460", "DYS461", "DYS481", "DYS505",
  "DYS522", "DYS533", "DYS549", "DYS570", "DYS576", "DYS612",
  "DYS635", "DYS643", "HPRTB", "Y-GATA-H4",
];

const NA12878_AUTOSOMAL_LOCI = [
  "CSF1PO", "D1S1656", "D2S441", "D2S1338", "D3S1358", "D5S818",
  "D6S1043", "D7S820", "D8S1179", "D10S1248", "D12S391", "D13S317",
  "D16S539", "D18S51", "D19S433", "D21S11", "D22S1045", "FGA",
  "TH01", "TPOX", "vWA", "PentaD", "PentaE", "SE33",
];

const HG002_YSTR_LOCI = [
  "DYS19", "DYS385a/b", "DYS389I", "DYS389II", "DYS390", "DYS391",
  "DYS392", "DYS393", "DYS438", "DYS448", "DYS456", "DYS458",
  "DYS635", "Y-GATA-H4", "Y-GATA-A10",
];

interface DatasetProvenance {
  name: string;
  source: string;
  doi?: string;
  license: string;
  loci: string[];
  referenceGenome?: { assembly: string; mountPath: string };
}

const DATASET_PROVENANCE: Record<string, DatasetProvenance> = {
  "illumina-str-fastq": {
    name: "NIST mds2-2157, Illumina STR (ForenSeq slice, donor NTD01)",
    source: "https://data.nist.gov/od/id/mds2-2157",
    doi: "10.18434/M32157",
    license:
      "Research / training / education only (per NIST); not for donor identification or database searching.",
    loci: FORENSEQ_STR_LOCI,
  },
  "ont-bam-hg38": {
    name: "1000 Genomes ONT, hg38 CODIS slice (R10 SUP)",
    source:
      "https://s3.amazonaws.com/1000g-ont/index.html?prefix=PROCESSED_DATA/ALIGNED_TO_HG38/MINIMAP2_ALIGNED_BAMS/",
    license: "Open access (1000 Genomes / HPRC). Research use.",
    loci: CODIS_CORE_LOCI,
    referenceGenome: { assembly: "GRCh38 / hg38", mountPath: "/data/ref/hg38.fa" },
  },
  "illumina-bam-hg38": {
    name: "GIAB NA12878 300x, hg38 autosomal forensic slice",
    source:
      "https://ftp-trace.ncbi.nlm.nih.gov/ReferenceSamples/giab/data/NA12878/NIST_NA12878_HG001_HiSeq_300x/",
    license: "Open access (GIAB / NIST). Research use.",
    loci: NA12878_AUTOSOMAL_LOCI,
    referenceGenome: { assembly: "GRCh38 / hg38", mountPath: "/data/ref/hg38.fa" },
  },
  "illumina-bam-hg38-y": {
    name: "GIAB HG002 300x, hg38 Y-STR slice",
    source:
      "https://ftp-trace.ncbi.nlm.nih.gov/ReferenceSamples/giab/data/AshkenazimTrio/HG002_NA24385_son/",
    license: "Open access (GIAB / NIST). Research use.",
    loci: HG002_YSTR_LOCI,
    referenceGenome: { assembly: "GRCh38 / hg38", mountPath: "/data/ref/hg38.fa" },
  },
};

const LEGACY_SLUG_DATASETS: Record<string, string[]> = {
  "strait-razor-ForenSeqv1.27": ["illumina-str-fastq"],
};

const TONE: Record<string, string> = {
  green: "bg-teal-600 text-white border-transparent",
  amber: "bg-amber-500 text-white border-transparent",
  red: "bg-red-600 text-white border-transparent",
};

function getDiagnosticText(
  t: (key: string) => string,
  issue: { id: string; title: string; suggestion?: string },
): { title: string; suggestion?: string } {
  const i18nTitle = t(`verified.diagnostics.ids.${issue.id}.title`);
  const i18nSuggestion = t(`verified.diagnostics.ids.${issue.id}.suggestion`);
  const hasI18nTitle = i18nTitle !== `verified.diagnostics.ids.${issue.id}.title`;
  return {
    title: hasI18nTitle ? i18nTitle : issue.title,
    suggestion: hasI18nTitle && i18nSuggestion !== `verified.diagnostics.ids.${issue.id}.suggestion`
      ? i18nSuggestion
      : issue.suggestion,
  };
}

function extractToolDisplayName(report: VerifiedReport): string {
  if (report.source?.repo) {
    const segments = report.source.repo.replace(/\/+$/, "").split("/");
    const last = segments[segments.length - 1];
    if (last) return last;
  }
  return report.tool.name;
}

export function VerifiedDetail({
  report,
  slug,
  staticPageUrl,
}: {
  report: VerifiedReport;
  slug: string;
  staticPageUrl: string;
}) {
  const { t } = useLanguage();
  const toolDisplayName = extractToolDisplayName(report);
  const baseLevel = VERIFIED_LEVELS[report.level] ?? VERIFIED_LEVELS.none;

  // A run can clear its gates and still have reported errors (a tool that fails
  // some loci, writes a partial file and exits 0). The badge is the first thing a
  // reviewer sees, so a green level with errors is misleading: qualify it, exactly
  // as the static report and shields badge do.
  const errorSummary = summarizeErrors(report.diagnostics);
  const runHadErrors = hasReportedErrors(report.diagnostics);
  const level = errorAwareLevel(baseLevel, runHadErrors, t("verified.errorsBadgeSuffix"));
  const stats = report.content_detail?.outputs?.[0]?.stats;
  const ref = report.source.ref_resolved ?? report.source.ref ?? "";
  const logBaseUrl = staticPageUrl.replace(/\/[^/]+$/, "");

  // Narrowed rather than trusted: the report is fetched JSON, and an unexpected
  // value must render nothing rather than a missing translation key.
  const by = report.submission?.by;
  const submittedBy = by === "maintainer" || by === "third_party" ? by : null;

  // Mirrors harness/upstream.py::note. Empty when the check could not be made,
  // and then nothing is shown — a guess about how current somebody's software
  // is would be worse than the silence it replaces.
  const up = report.upstream;
  const upstreamNote = !up
    ? ""
    : up.repo_exists === false
      ? t("verified.upstream.repoGone")
      : up.ref_exists === false
        ? t("verified.upstream.refGone")
        : (up.behind_by ?? 0) > 0
          ? t("verified.upstream.behind", {
              n: String(up.behind_by),
              branch: up.default_branch ?? "",
            })
          : t("verified.upstream.head", { branch: up.default_branch ?? "" });

  const datasetTypes = new Set<string>();
  if (report.datasets) {
    for (const leg of report.datasets) {
      if (leg.type) datasetTypes.add(leg.type);
    }
  } else if (LEGACY_SLUG_DATASETS[slug]) {
    for (const t2 of LEGACY_SLUG_DATASETS[slug]) datasetTypes.add(t2);
  }

  // The tag is derived from the dataset type. Y-STR ends in "-y"; ONT (CODIS)
  // must not fall through to "autosomal" as it once did — STRspy's ont-bam-hg38
  // run was mislabelled "Autosomal STR".
  const types = Array.from(datasetTypes);
  const isYstr = types.some((dt) => dt.endsWith("-y"));
  const isOnt = types.some((dt) => dt.includes("ont"));
  const panelLabel = datasetTypes.size > 0
    ? isYstr
      ? t("verified.panel.ystr")
      : isOnt
      ? t("verified.panel.ont")
      : t("verified.panel.autosomal")
    : null;
  const provenanceEntries = Array.from(datasetTypes)
    .map((dt) => ({ type: dt, ...DATASET_PROVENANCE[dt] }))
    .filter((e) => e.name);

  const hasStrhubFixture = report.datasets?.some(
    (d) => d.fixture_source === "strhub"
  );

  const gateKeys = VERIFIED_GATES.map((g) => g.key);
  const gatesPassed = gateKeys.filter((k) => report.gates?.[k]).length;
  const gatesTotal = gateKeys.length;

  return (
    <div className="flex flex-col min-h-[60vh]">
      <div className="container mx-auto px-4 py-8 flex-1 max-w-3xl">
        {/* Back link */}
        <Link
          href="/verified"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> {t("verified.backToList")}
        </Link>

        {/* Header: badge + title */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={cn("w-fit", TONE[level.tone])}>{level.label}</Badge>
            {panelLabel && (
              <span className="inline-flex items-center text-xs border rounded-full px-2.5 py-0.5 text-muted-foreground">
                {panelLabel}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            {toolDisplayName}
          </h1>
          <p className="font-mono text-sm text-muted-foreground">{slug}</p>
        </div>

        {/* ── SUMMARY ── */}
        <div className="mt-6 rounded-lg border bg-card p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            {t("verified.summary.heading")}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{t("verified.summary.level")}</p>
              <Badge className={cn("mt-1.5", TONE[level.tone])}>{level.label}</Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{t("verified.gates")}</p>
              <p className="text-sm text-muted-foreground tabular-nums mt-1.5">
                {t("verified.summary.gatesPassed")
                  .replace("{passed}", String(gatesPassed))
                  .replace("{total}", String(gatesTotal))}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{t("verified.summary.datasets")}</p>
              <p className="text-sm text-muted-foreground tabular-nums mt-1.5">
                {provenanceEntries.length > 0
                  ? t("verified.summary.datasetsUsed").replace("{count}", String(provenanceEntries.length))
                  : t("verified.summary.noDatasets")}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{t("verified.verifiedOn")}</p>
              <p className="text-sm text-muted-foreground mt-1.5">
                {report.generated?.slice(0, 10)}
              </p>
            </div>
          </div>
          {report.scope && (
            <p className="mt-4 text-sm text-muted-foreground border-t pt-3">
              {report.scope}
            </p>
          )}
          {/* A result that stops short, on a run somebody else configured, is
              read as a verdict on the software unless this says otherwise. The
              error is asymmetric: a bad configuration produces false negatives,
              almost never false positives — so a green result needs no such
              line, and a short one does. */}
          {submittedBy === "third_party" && report.gates?.content !== true && (
            <p className="mt-3 text-sm text-muted-foreground border-t pt-3">
              {t("verified.thirdPartyShortfall")}
            </p>
          )}
        </div>

        {/* ── SOURCE ── */}
        <div className="mt-8 rounded-lg border bg-card p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            {t("verified.source")}
          </h2>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
            {report.tool.variant && (
              <>
                {/* Two cards for one tool otherwise differ by a few characters
                    of URL, which is not a distinction to make a reader squint at. */}
                <dt className="text-muted-foreground">{t("verified.variant")}</dt>
                <dd>{report.tool.variant}</dd>
              </>
            )}
            {report.tool.maintainer && (
              <>
                <dt className="text-muted-foreground">Maintainer</dt>
                <dd>{report.tool.maintainer}</dd>
              </>
            )}
            {/* Who asked for the run, kept next to who answers for the software
                so the first is never read as the second. Absent on reports from
                before the submission form asked, and then nothing is shown:
                there is no answer to fall back on. */}
            {submittedBy && (
              <>
                <dt className="text-muted-foreground">{t("verified.submittedBy")}</dt>
                <dd>{t(`verified.submittedByValue.${submittedBy}`)}</dd>
              </>
            )}
            <dt className="text-muted-foreground">Repository</dt>
            <dd>
              <a
                href={report.source.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline break-all"
              >
                {report.source.repo}
              </a>
            </dd>
            <dt className="text-muted-foreground">{t("verified.commit")}</dt>
            <dd>
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{ref}</code>
              {/* Where that commit sits now. Context for a reviewer comparing
                  the attestation against the version a manuscript cites — and,
                  when the ref has vanished, a finding: being fetchable is the
                  first thing the badge claims. */}
              {upstreamNote && (
                <span
                  className={cn(
                    "mt-1 block text-xs",
                    report.upstream?.ref_exists === false
                      ? "text-amber-700 dark:text-amber-500"
                      : "text-muted-foreground",
                  )}
                >
                  {upstreamNote}
                </span>
              )}
            </dd>
            {report.environment?.os && (
              <>
                <dt className="text-muted-foreground">{t("verified.environment")}</dt>
                <dd>{report.environment.os.join(", ")}</dd>
              </>
            )}
            <dt className="text-muted-foreground">{t("verified.verifiedOn")}</dt>
            <dd>{report.generated?.slice(0, 19).replace("T", " ")} UTC</dd>
            {report.ci_run && (
              <>
                <dt className="text-muted-foreground">{t("verified.ciRun")}</dt>
                <dd>
                  <a
                    href={report.ci_run}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    View run <ExternalLink className="h-3 w-3" />
                  </a>
                </dd>
              </>
            )}
            <dt className="text-muted-foreground">{t("verified.staticPage")}</dt>
            <dd>
              <a
                href={staticPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
              >
                View full report <ExternalLink className="h-3 w-3" />
              </a>
            </dd>
          </dl>
          {/* Said in full only for a third-party submission. The other case is
              what a reader already assumes, so the row above carries it; this one
              contradicts the assumption and has to say so where the maintainer's
              name is, not further down the page. */}
          {submittedBy === "third_party" && (
            <p className="mt-3 border-t pt-3 text-sm text-muted-foreground">
              {t("verified.submittedByThirdPartyNote")}
            </p>
          )}
        </div>

        {/* ── WHY THE BUILD FAILED ──
            Directly under the source block, because nothing below it ran. A
            "Installs — did not pass" with no cause tells a reviewer nothing they
            can act on and its maintainer nothing they can fix, and it used to be
            all we published: the build log was thrown away. */}
        {report.install_detail?.diagnostics?.length ? (
          <div className="mt-6 rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/20 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-500">
              {t("verified.install.heading")}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("verified.install.note")}
            </p>
            <p className="mt-2 text-sm">
              {t(installFaultKey(report.install_detail.faults, submittedBy))}
            </p>
            <ul className="mt-3 space-y-2 border-t border-amber-300/60 dark:border-amber-800/60 pt-3">
              {report.install_detail.diagnostics.map((issue) => (
                <li key={issue.id + issue.title} className="text-sm">
                  <span className="font-medium">{issue.title}</span>
                  {issue.suggestion && (
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {issue.suggestion}
                    </span>
                  )}
                </li>
              ))}
            </ul>
            {report.logs?.build && (
              <a
                href={`${logBaseUrl}/${report.logs.build}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                {t("verified.install.viewBuildLog")}
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        ) : null}

        {/* ── WHAT WAS VERIFIED / NOT VERIFIED ── */}
        <div className="mt-6 rounded-lg border bg-card p-5">
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-2">
                {t("verified.whatVerified.verifiedHeading")}
              </p>
              {[
                "verified.whatVerified.sourceAvailable",
                "verified.whatVerified.installation",
                "verified.whatVerified.execution",
                "verified.whatVerified.outputGenerated",
              ].map((key) => (
                <div key={key} className="flex items-center gap-1.5 py-0.5">
                  <Check className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                  <span className="text-muted-foreground">{t(key)}</span>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                {t("verified.whatVerified.notHeading")}
              </p>
              {[
                "verified.whatVerified.accuracy",
                "verified.whatVerified.concordance",
                "verified.whatVerified.forensicValidity",
                "verified.whatVerified.regulatory",
              ].map((key) => (
                <div key={key} className="flex items-center gap-1.5 py-0.5">
                  <Minus className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                  <span className="text-muted-foreground/70">{t(key)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── GATES ── */}
        <h2 className="mt-10 text-xl font-semibold">{t("verified.gates")}</h2>
        <div className="mt-3 divide-y rounded-lg border">
          {VERIFIED_GATES.map((g) => {
            const pass = report.gates?.[g.key];
            return (
              <div
                key={g.key}
                className="flex items-center gap-3 px-4 py-2.5 text-sm"
              >
                <span
                  className={cn(
                    "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                    pass
                      ? "bg-teal-600 text-white"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {pass ? <Check className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                </span>
                <span className="font-medium whitespace-nowrap">{g.label}</span>
                <span className="text-muted-foreground">{t(g.meaningKey)}</span>
              </div>
            );
          })}
        </div>

        {/* A run that stopped before the top step used to say nothing at all
            unless it was the content gate specifically. A reviewer then read the
            ladder as a verdict on the software, which is the one thing it is not
            entitled to be. The specific note wins where it applies; otherwise the
            general one covers stopping anywhere earlier. */}
        {(() => {
          const failed = VERIFIED_GATES.filter((g) => !report.gates?.[g.key]);
          if (failed.length === 0) return null;
          const onlyContent = failed.length === 1 && failed[0].key === "content";
          return (
            <p className="mt-3 text-sm text-muted-foreground italic rounded-lg border-l-4 border-amber-400 bg-amber-50 dark:bg-amber-950/20 px-4 py-3">
              {t(
                onlyContent
                  ? "verified.gate.contentFailNote"
                  : "verified.gate.stoppedEarlyNote"
              )}{" "}
              <Link
                href="/verified/how-to-read"
                className="not-italic font-medium text-foreground underline underline-offset-2"
              >
                {t("verified.gate.howToReadLink")}
              </Link>
            </p>
          );
        })()}

        {/* Execution logs */}
        {report.logs && Object.keys(report.logs).length > 0 && (() => {
          const visibleLogs = Object.entries(report.logs).filter(([leg]) => {
            if (!hasStrhubFixture) return true;
            const legData = report.datasets?.find((d) => d.leg === leg);
            return legData?.fixture_source !== "strhub";
          });
          if (visibleLogs.length === 0) return null;
          return (
            <div className="mt-4 flex flex-wrap gap-3">
              {visibleLogs.map(([leg, fname]) => {
                const legData = report.datasets?.find((d) => d.leg === leg);
                // Not every log is a verification leg. The build log joined this
                // map so a reader could open it, and fell into the `else`, which
                // labelled it as the reference dataset — two links, same name,
                // different files.
                const logLabel =
                  leg === "build"
                    ? t("verified.log.build")
                    : leg === "own"
                      ? t("verified.matrix.own")
                      : t("verified.matrix.external");
                return (
                  <a
                    key={leg}
                    href={`${logBaseUrl}/${fname}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    {t("verified.log.view")}
                    {visibleLogs.length > 1 ? ` (${logLabel})` : ""}
                  </a>
                );
              })}
            </div>
          );
        })()}

        {/* ── VERIFICATION MATRIX ── */}
        {report.datasets && report.datasets.length > 0 && (() => {
          const visibleLegs = report.datasets.filter(
            (leg) => leg.fixture_source !== "strhub"
          );
          if (visibleLegs.length === 0) return null;
          return (
            <>
              <h2 className="mt-10 text-xl font-semibold">
                {t("verified.matrix.heading")}
              </h2>
              <div className="mt-3 divide-y rounded-lg border">
                {visibleLegs.map((leg) => {
                  const state = !leg.available
                    ? "na"
                    : leg.passed
                    ? "pass"
                    : "fail";
                  return (
                    <div
                      key={leg.leg}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm"
                    >
                      <span
                        className={cn(
                          "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                          state === "pass"
                            ? "bg-teal-600 text-white"
                            : state === "fail"
                            ? "bg-amber-500 text-white"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {state === "pass" ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Minus className="h-3 w-3" />
                        )}
                      </span>
                      <span className="font-medium">
                        {leg.leg === "own"
                          ? t("verified.matrix.own")
                          : leg.leg === "external"
                          ? t("verified.matrix.external")
                          : leg.label}
                      </span>
                      <span className="text-muted-foreground">
                        {state === "na"
                          ? t("verified.matrix.na")
                          : state === "pass"
                          ? t("verified.matrix.pass")
                          : t("verified.matrix.fail")}
                      </span>
                      {leg.dataset && (
                        <span className="ml-auto truncate text-xs text-muted-foreground">
                          {leg.dataset}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          );
        })()}

        {/* ── VERIFICATION DATA (provenance) ── */}
        {(provenanceEntries.length > 0 || hasStrhubFixture) && (
          <>
            <h2 className="mt-10 text-xl font-semibold">
              {t("verified.data.heading")}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("verified.data.note")}
            </p>

            {hasStrhubFixture && (
              <p className="mt-3 text-sm text-muted-foreground italic rounded-lg border-l-4 border-blue-400 bg-blue-50 dark:bg-blue-950/20 px-4 py-3">
                {t("verified.data.noOwnData")}
              </p>
            )}

            {provenanceEntries.length > 0 && (
              <>
                <div className="mt-3 space-y-3">
                  {provenanceEntries.map((ds) => (
                    <div
                      key={ds.type}
                      className="rounded-lg border-l-4 border-border bg-muted/50 p-4"
                    >
                      <p className="text-sm font-medium">{ds.name}</p>
                      <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
                        <dt className="text-muted-foreground">Source</dt>
                        <dd>
                          <a
                            href={ds.source}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline break-all"
                          >
                            {ds.source}
                          </a>
                        </dd>
                        {ds.doi && (
                          <>
                            <dt className="text-muted-foreground">DOI</dt>
                            <dd>
                              <a
                                href={`https://doi.org/${ds.doi}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                {ds.doi}
                              </a>
                            </dd>
                          </>
                        )}
                        <dt className="text-muted-foreground">License</dt>
                        <dd className="text-muted-foreground">{ds.license}</dd>
                        {ds.referenceGenome && (
                          <>
                            <dt className="text-muted-foreground">{t("verified.data.refGenome")}</dt>
                            <dd>
                              <span className="font-medium">{ds.referenceGenome.assembly}</span>
                              <span className="text-muted-foreground ml-2">
                                ({ds.referenceGenome.mountPath})
                              </span>
                            </dd>
                          </>
                        )}
                        <dt className="text-muted-foreground pt-1">{t("verified.data.lociTested")}</dt>
                        <dd className="pt-1">
                          <p className="text-xs text-muted-foreground mb-1">
                            {ds.loci.length} {t("verified.data.lociCount")}
                          </p>
                          <p className="text-[10px] font-mono text-muted-foreground/70 leading-relaxed">
                            {ds.loci.join(", ")}
                          </p>
                        </dd>
                      </dl>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs text-muted-foreground italic">
                  {t("verified.data.lociScope")}
                </p>
              </>
            )}
          </>
        )}

        {/* ── OUTPUT CONTENT ── */}
        {stats && (
          <>
            <h2 className="mt-10 text-xl font-semibold">
              {t("verified.content.heading")}
            </h2>
            <div className="mt-3 rounded-lg border bg-card p-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    {t("verified.content.records")}
                  </p>
                  <p className="text-2xl font-bold tabular-nums mt-1">
                    {stats.rows ?? 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    {t("verified.content.strLoci")}
                  </p>
                  <p className="text-2xl font-bold tabular-nums mt-1">
                    {stats.distinct_str_loci ?? stats.distinct_loci ?? 0}
                  </p>
                </div>
                {(stats.distinct_snp_markers ?? 0) > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                      {t("verified.content.snps")}
                    </p>
                    <p className="text-2xl font-bold tabular-nums mt-1">
                      {stats.distinct_snp_markers}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    {t("verified.content.totalReads")}
                  </p>
                  <p className="text-2xl font-bold tabular-nums mt-1">
                    {stats.total_reads ?? 0}
                  </p>
                </div>
              </div>

              {stats.str_loci && stats.str_loci.length > 0 && (
                <div className="mt-5 pt-4 border-t">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                    {t("verified.content.strLociList")}
                  </p>
                  <p className="text-xs font-mono text-muted-foreground leading-relaxed">
                    {stats.str_loci.join(", ")}
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── AUTO-DIAGNOSTICS ── */}
        {report.diagnostics && Object.keys(report.diagnostics).length > 0 && (() => {
          const HIDDEN_IDS = new Set(["genotyping_summary"]);
          const seen = new Set<string>();
          const deduped = Object.values(report.diagnostics).flat().filter((issue) => {
            if (HIDDEN_IDS.has(issue.id)) return false;
            if (seen.has(issue.id)) return false;
            seen.add(issue.id);
            return true;
          });
          const hasActionable = deduped.some(
            (i) => i.severity === "error" || i.severity === "warning"
          );
          if (!hasActionable) return null;
          return (
            <>
              <h2 className="mt-10 text-xl font-semibold">
                {t("verified.diagnostics.heading")}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("verified.diagnostics.note")}
              </p>
              {hasStrhubFixture && (
                <div className="mt-3 rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/20 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-400 mb-1">
                    {t("verified.diagnostics.strhubNoteLabel")}
                  </p>
                  <p className="text-sm text-muted-foreground italic">
                    {t("verified.diagnostics.sampleNote")}
                  </p>
                </div>
              )}
              {deduped.length > 0 && (
                <>
                  <p className="mt-4 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t("verified.diagnostics.logIssuesLabel")}
                  </p>
                  <div className="space-y-2">
                    {deduped.map((issue) => {
                      const txt = getDiagnosticText(t, issue);
                      // The scale and the affected items (which loci) are what a
                      // reviewer needs; without them nine failed loci read as one
                      // stray error. Both are already stored on the diagnostic.
                      const summary = errorSummary.find((e) => e.id === issue.id);
                      const items = summary?.items ?? [];
                      const count = summary?.count ?? issue.count;
                      return (
                        <div
                          key={issue.id}
                          className={cn(
                            "rounded-lg border-l-4 px-4 py-3 text-sm",
                            issue.severity === "error"
                              ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                              : issue.severity === "warning"
                              ? "border-amber-400 bg-amber-50 dark:bg-amber-950/20"
                              : "border-blue-400 bg-blue-50 dark:bg-blue-950/20"
                          )}
                        >
                          <div className="flex items-start gap-2">
                            {issue.severity === "error" ? (
                              <XCircle className="h-4 w-4 mt-0.5 shrink-0 text-red-600" />
                            ) : issue.severity === "warning" ? (
                              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-amber-600" />
                            ) : (
                              <Info className="h-4 w-4 mt-0.5 shrink-0 text-blue-600" />
                            )}
                            <div className="min-w-0">
                              <p className="font-medium">
                                {txt.title}
                                {count && count > 1 && (
                                  <span className="ml-2 text-xs font-normal text-muted-foreground">
                                    {t("verified.diagnostics.timesLabel").replace("{n}", String(count))}
                                  </span>
                                )}
                              </p>
                              {items.length > 0 && (
                                <p className="mt-1 font-mono text-xs text-muted-foreground break-words">
                                  {t("verified.diagnostics.affectedLabel")} {items.join(", ")}
                                </p>
                              )}
                              {txt.suggestion && (
                                <p className="mt-1 text-muted-foreground">
                                  {txt.suggestion}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {(() => {
                    const noteKeys = externalLegNoteKeys(report.diagnostics);
                    if (noteKeys.length === 0) return null;
                    return (
                      <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                        {noteKeys.map((key) => (
                          <p key={key}>{t(`verified.diagnostics.${key}`)}</p>
                        ))}
                      </div>
                    );
                  })()}
                </>
              )}
            </>
          );
        })()}

        {/* ── MANUAL VERIFICATION (LEVEL 2) ──
            Rendered only when the ENGINE marked the run eligible. There is no
            path to this offer from the UI: an author who is merely stuck has no
            report yet, and a report whose run produced its expected output never
            carries the flag. So the paid tier cannot be reached by asking, only
            by the automated path structurally failing to express the tool. */}
        {isManualEligible(report) && (() => {
          const manual = report.manual_verification!;
          const key = reasonI18nKey(manual.reason_code);
          const translated = key ? t(key) : null;
          // Fall back to the engine's own wording when a reason id has no string
          // yet, so a new engine rule degrades to plain English, not a raw key.
          const reason =
            translated && translated !== key ? translated : manual.reason ?? "";
          return (
            <>
              <h2 className="mt-10 text-xl font-semibold">
                {t("verified.manual.heading")}
              </h2>
              <div className="mt-3 rounded-lg border border-border bg-muted/40 p-4">
                <div className="flex gap-3">
                  <LifeBuoy className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                  <div className="space-y-3 text-sm">
                    <p>{reason}</p>
                    <p className="text-muted-foreground">
                      {t("verified.manual.notAFault")}
                    </p>
                    <p className="text-muted-foreground">
                      {t("verified.manual.whatItIs")}
                    </p>
                    <Link
                      href={`/verified/manual?slug=${encodeURIComponent(slug)}`}
                      className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
                    >
                      {t("verified.manual.cta")}
                      <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
                    </Link>
                    <p className="pt-1 text-xs text-muted-foreground">
                      {t("verified.manual.reasonCodeLabel")}{" "}
                      <code className="rounded bg-muted px-1 py-0.5">
                        {manual.reason_code}
                      </code>{" "}
                      ({manual.basis})
                    </p>
                  </div>
                </div>
              </div>
            </>
          );
        })()}

        {/* ── README CHECK ── */}
        {report.readme_check && (
          <>
            <h2 className="mt-10 text-xl font-semibold">
              {t("verified.readme.heading")}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("verified.readme.note")} ({report.readme_check.score}/
              {report.readme_check.max})
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              {(
                [
                  ["install", "verified.readme.install"],
                  ["command", "verified.readme.command"],
                  ["input", "verified.readme.input"],
                  ["output", "verified.readme.output"],
                  ["dependencies", "verified.readme.deps"],
                ] as const
              ).map(([key, labelKey]) => {
                const present = report.readme_check?.checks?.[key]?.present;
                return (
                  <li key={key} className="flex items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                        present
                          ? "bg-teal-600 text-white"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {present ? (
                        <Check className="h-2.5 w-2.5" />
                      ) : (
                        <Minus className="h-2.5 w-2.5" />
                      )}
                    </span>
                    {t(labelKey)}
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {/* ── WHAT THIS RUN NEEDED BEYOND THE REPOSITORY ──
            Held next to the ladder on purpose. A green ladder reads as a property
            of the software and quietly folds in the work it took to get there:
            for one tool that was a configuration file built by hand over half a
            day against a repository that ships only an incompatible example. */}
        {report.needed_beyond_repo?.length ? (
          <>
            <h2 className="mt-10 text-xl font-semibold">
              {t("verified.needed.heading")}
            </h2>
            <div className="mt-3 rounded-lg border bg-muted/40 p-4">
              <p className="text-sm text-muted-foreground">
                {t("verified.needed.note")}
              </p>
              <ul className="mt-3 space-y-2">
                {report.needed_beyond_repo.map((item) => (
                  <li key={item} className="flex gap-2 text-sm">
                    <span aria-hidden="true" className="text-muted-foreground">
                      &ndash;
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : null}

        {/* ── NOTES FROM READING THE REPOSITORY ──
            Kept apart from the gates and the diagnostics, which record what
            running the tool established. Nothing here was run: it was read off
            the repository when the configuration was worked out, so the origin is
            named and the block says plainly that it is unverified. Last before
            the scope statement, where a reader has already seen what was
            actually tested. */}
        {report.caveats?.items?.length ? (
          <>
            <h2 className="mt-10 text-xl font-semibold">
              {t("verified.caveats.heading")}
            </h2>
            <div className="mt-3 rounded-lg border bg-muted/40 p-4">
              {/* The model id stays in the report JSON for auditing and out of
                  the prose: it means nothing to a reviewer, and naming it here
                  suggests the report was written by one when the gates above were
                  measured by running the tool. */}
              <p className="text-sm text-muted-foreground">
                {t("verified.caveats.note")}
              </p>
              <ul className="mt-3 space-y-2">
                {report.caveats.items.map((item) => (
                  <li key={item} className="flex gap-2 text-sm">
                    <span aria-hidden="true" className="text-muted-foreground">
                      &ndash;
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : null}

        {/* ── SCOPE ── */}
        <h2 className="mt-10 text-xl font-semibold">{t("verified.scope")}</h2>
        <div className="mt-3 rounded-lg border-l-4 border-teal-600 bg-muted/50 p-4 text-sm">
          <p>{report.scope}</p>
          <p className="mt-3 text-muted-foreground">{t("verified.scopeNote")}</p>
        </div>

        {/* Footer disclaimer */}
        <p className="mt-8 text-xs text-muted-foreground">
          {t("verified.disclaimer")}{" "}
          <a
            href={staticPageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {t("verified.staticPage")}
          </a>
        </p>
      </div>
      <SiteFooter />
    </div>
  );
}

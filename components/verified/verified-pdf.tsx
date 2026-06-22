import {
  Document,
  Page,
  Text,
  View,
  Image,
  Link,
  StyleSheet,
} from "@react-pdf/renderer";
import type { VerifiedReport, VerifiedLevel, VerifiedDiagnostic } from "@/types/verified";

// ── Palette: matches STRhub web (Tailwind grays + teal primary) ──
const TEAL = "#0d9488";
const EMERALD = "#059669";
const BODY = "#374151";       // gray-700 — main text, never black
const MUTED = "#6b7280";      // gray-500 — secondary text
const SUBTLE = "#9ca3af";     // gray-400 — labels, captions
const BORDER = "#e5e7eb";     // gray-200
const BG = "#f9fafb";         // gray-50  — card/row backgrounds
const LINK = "#0d9488";       // teal — same as primary
const DIAG_ERROR_BORDER = "#ef4444";
const DIAG_WARN_BORDER = "#f59e0b";
const DIAG_ERROR_BG = "#fef2f2";
const DIAG_WARN_BG = "#fffbeb";

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
    name: "NIST mds2-2157 — Illumina STR (ForenSeq slice, donor NTD01)",
    source: "https://data.nist.gov/od/id/mds2-2157",
    doi: "10.18434/M32157",
    license:
      "Research / training / education only (per NIST); not for donor identification or database searching.",
    loci: FORENSEQ_STR_LOCI,
  },
  "ont-bam-hg38": {
    name: "1000 Genomes ONT — hg38 CODIS slice (R10 SUP)",
    source:
      "https://s3.amazonaws.com/1000g-ont/index.html?prefix=PROCESSED_DATA/ALIGNED_TO_HG38/MINIMAP2_ALIGNED_BAMS/",
    license: "Open access (1000 Genomes / HPRC). Research use.",
    loci: CODIS_CORE_LOCI,
    referenceGenome: { assembly: "GRCh38 / hg38", mountPath: "/data/ref/hg38.fa" },
  },
  "illumina-bam-hg38": {
    name: "GIAB NA12878 300x — hg38 autosomal forensic slice",
    source:
      "https://ftp-trace.ncbi.nlm.nih.gov/ReferenceSamples/giab/data/NA12878/NIST_NA12878_HG001_HiSeq_300x/",
    license: "Open access (GIAB / NIST). Research use.",
    loci: NA12878_AUTOSOMAL_LOCI,
    referenceGenome: { assembly: "GRCh38 / hg38", mountPath: "/data/ref/hg38.fa" },
  },
  "illumina-bam-hg38-y": {
    name: "GIAB HG002 300x — hg38 Y-STR slice",
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

const s = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 56,
    paddingHorizontal: 45,
    fontFamily: "Helvetica",
    fontSize: 8.5,
    color: BODY,
  },
  coverPage: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
    fontFamily: "Helvetica",
    fontSize: 8.5,
    color: BODY,
    backgroundColor: "#ffffff",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 45,
    right: 45,
    borderTopWidth: 0.5,
    borderTopColor: BORDER,
    paddingTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7,
    color: SUBTLE,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  logo: { width: 28, height: 28, marginRight: 8 },
  headerTitle: { fontSize: 15, fontFamily: "Helvetica-Bold", color: TEAL },
  headerSub: { fontSize: 9, color: MUTED, marginTop: 1 },

  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: TEAL,
    marginTop: 16,
    marginBottom: 5,
    paddingBottom: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },

  card: {
    borderWidth: 0.5,
    borderColor: BORDER,
    borderRadius: 4,
    padding: 10,
    marginTop: 4,
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: SUBTLE,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 3,
  },

  tableRow: {
    flexDirection: "row",
    paddingVertical: 3.5,
    paddingHorizontal: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },
  tableRowAlt: { backgroundColor: BG },

  kvRow: { flexDirection: "row", marginBottom: 2 },
  kvLabel: { width: 110, fontSize: 8, color: MUTED },
  kvValue: { flex: 1, fontSize: 8, color: BODY },

  noteBox: {
    marginTop: 4,
    marginBottom: 6,
    padding: 8,
    backgroundColor: "#f0f9ff",
    borderLeftWidth: 3,
    borderLeftColor: "#38bdf8",
    borderRadius: 2,
  },
  noteText: { fontSize: 7.5, color: MUTED, fontStyle: "italic", lineHeight: 1.4 },

  datasetBox: {
    marginTop: 4,
    marginBottom: 4,
    padding: 8,
    backgroundColor: BG,
    borderLeftWidth: 2,
    borderLeftColor: BORDER,
    borderRadius: 2,
  },

  lociGrid: { flexDirection: "row", flexWrap: "wrap" },
  lociItem: { fontSize: 7, color: MUTED, width: "25%", marginBottom: 1 },
  snpItem: { fontSize: 6.5, color: MUTED, width: "20%", marginBottom: 1 },

  // Executive summary table
  execRow: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },
  execLabel: {
    width: 110,
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: SUBTLE,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  execValue: { flex: 1, fontSize: 8, color: BODY, lineHeight: 1.4 },

  // Limitation / out-of-scope bullet
  bulletRow: {
    flexDirection: "row",
    marginBottom: 2,
    paddingLeft: 4,
  },
  bulletDot: { width: 10, fontSize: 8, color: MUTED },
  bulletText: { flex: 1, fontSize: 8, color: MUTED, lineHeight: 1.35 },
});

const GATE_LABELS: Record<string, string> = {
  available: "The pinned public source exists",
  installs: "The environment builds from source",
  runs: "It executes end-to-end without crashing",
  io: "It produces a non-empty file in the declared format",
  content: "Its output structure matches expected genotype-bearing format",
};

const GATE_NAMES: Record<string, string> = {
  available: "Available",
  installs: "Installs",
  runs: "Runs",
  io: "Expected IO",
  content: "Output Structure Validation",
};

const LEVEL_LABELS: Record<VerifiedLevel, string> = {
  content: "Runs + Output Structure Validation",
  io: "Runs + Expected IO",
  runs: "Runs",
  installs: "Installs",
  available: "Available",
  none: "Not run",
};

const README_ITEMS: Record<string, string> = {
  install: "Install / environment setup",
  command: "Run command",
  input: "Expected input format",
  output: "Produced output format",
  dependencies: "Dependencies / versions",
};

const OUT_OF_SCOPE_ITEMS = [
  "Genotype correctness or accuracy",
  "Concordance against known truth sets",
  "Sensitivity, specificity, or stutter performance",
  "Allele calling accuracy",
  "Forensic casework suitability",
  "Regulatory compliance or ISO accreditation",
  "Multi-laboratory or multi-dataset reproducibility",
];

const LIMITATIONS_ITEMS = [
  "Single reference dataset per input type",
  "Single containerized environment (Docker / ubuntu-22.04)",
  "No truth-set comparison or ground-truth genotypes",
  "No accuracy or concordance assessment",
  "No forensic validation of results",
  "Short-read limitations apply (e.g. very long STR alleles may be unresolvable)",
];

interface Props {
  report: VerifiedReport;
  slug: string;
  logoSrc?: string;
}

function extractToolDisplayName(report: VerifiedReport): string {
  if (report.source?.repo) {
    const segments = report.source.repo.replace(/\/+$/, "").split("/");
    const last = segments[segments.length - 1];
    if (last) return last;
  }
  return report.tool.name;
}

function FooterView({ dateStr, permalink }: { dateStr: string; permalink: string }) {
  return (
    <View style={s.footer} fixed>
      <View>
        <Text>
          {"Generated automatically by "}
          <Link src="https://strhub.app">
            <Text style={{ color: LINK }}>STRhub</Text>
          </Link>
          {" Verified"}
        </Text>
        <Link src={permalink}>
          <Text style={{ color: LINK, marginTop: 1 }}>{permalink}</Text>
        </Link>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text>{dateStr}</Text>
        <Text
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          style={{ marginTop: 1 }}
        />
      </View>
    </View>
  );
}

export function VerifiedPDF({ report, slug, logoSrc }: Props) {
  const toolDisplayName = extractToolDisplayName(report);
  const ref = report.source.ref_resolved ?? report.source.ref ?? "";
  const shortRef = ref.length > 12 ? ref.slice(0, 12) : ref;
  const stats = report.content_detail?.outputs?.[0]?.stats;
  const ioDetail = report.io_detail as
    | {
        outputs?: {
          resolved?: string;
          format?: string;
          records?: number;
          checks?: Record<string, boolean>;
        }[];
      }
    | undefined;
  const ioOut = ioDetail?.outputs?.[0];
  const dateStr = report.generated?.slice(0, 10) ?? "N/A";
  const permalink = `https://strhub.app/verified/${slug}`;

  const gateOrder = ["available", "installs", "runs", "io", "content"] as const;
  const gatesPassed = gateOrder.filter((k) => report.gates?.[k]).length;

  const hasStats = !!stats;
  const hasStrhubFixture = report.datasets?.some(
    (d) => d.fixture_source === "strhub"
  );

  // Only surface warning/error diagnostics — info level is not actionable
  const actionableDiagnostics: VerifiedDiagnostic[] = [];
  if (report.diagnostics) {
    const HIDDEN_IDS = new Set(["genotyping_summary"]);
    const seen = new Set<string>();
    for (const issues of Object.values(report.diagnostics)) {
      for (const issue of issues) {
        if (HIDDEN_IDS.has(issue.id)) continue;
        if (issue.severity === "info") continue;
        if (!seen.has(issue.id)) {
          seen.add(issue.id);
          actionableDiagnostics.push(issue);
        }
      }
    }
  }

  const datasetTypes = new Set<string>();
  if (report.datasets) {
    for (const leg of report.datasets) {
      if (leg.type) datasetTypes.add(leg.type);
    }
  } else if (LEGACY_SLUG_DATASETS[slug]) {
    for (const t of LEGACY_SLUG_DATASETS[slug]) datasetTypes.add(t);
  }
  const provenanceEntries = Array.from(datasetTypes)
    .map((t) => ({ type: t, ...DATASET_PROVENANCE[t] }))
    .filter((e) => e.name);
  const hasProvenance = provenanceEntries.length > 0;

  const visibleLegs = report.datasets?.filter(
    (leg) => leg.fixture_source !== "strhub"
  ) ?? [];

  const isYstr = Array.from(datasetTypes).some((dt) => dt.endsWith("-y"));
  const panelLabel = datasetTypes.size > 0
    ? (isYstr ? "Y-STR" : "Autosomal STR")
    : null;

  let sn = 0;

  return (
    <Document
      title={`STRhub Verified — ${report.tool.name} (${slug})`}
      author="STRhub"
      subject="Technical Reproducibility Validation Report"
      producer="STRhub (strhub.app)"
    >
      {/* ══════════════════════════════════════════════
          COVER PAGE
      ══════════════════════════════════════════════ */}
      <Page size="A4" style={s.coverPage}>
        {/* Top accent bar */}
        <View style={{ height: 6, backgroundColor: TEAL }} />

        {/* Cover content */}
        <View style={{ flex: 1, paddingHorizontal: 52, paddingTop: 52, paddingBottom: 40 }}>

          {/* Brand */}
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
            {logoSrc && <Image style={{ width: 22, height: 22, marginRight: 7 }} src={logoSrc} />}
            <Text style={{ fontSize: 13, fontFamily: "Helvetica-Bold", color: TEAL, letterSpacing: 0.5 }}>
              STRhub VERIFIED
            </Text>
          </View>
          <Text style={{ fontSize: 9, color: MUTED, letterSpacing: 0.3, marginBottom: 56 }}>
            Technical Reproducibility Validation Report
          </Text>

          {/* Tool name */}
          <Text style={{ fontSize: 32, fontFamily: "Helvetica-Bold", color: BODY, lineHeight: 1.15, marginBottom: 8 }}>
            {toolDisplayName}
          </Text>
          {report.tool.version && (
            <Text style={{ fontSize: 12, color: MUTED, marginBottom: 4 }}>
              Version {report.tool.version}
            </Text>
          )}
          {panelLabel && (
            <Text style={{ fontSize: 9, color: SUBTLE, marginBottom: 40 }}>
              {panelLabel} panel
            </Text>
          )}

          {/* Metadata block */}
          <View style={{ borderTopWidth: 0.5, borderTopColor: BORDER, paddingTop: 16, marginBottom: 40 }}>
            <View style={s.kvRow}>
              <Text style={{ ...s.kvLabel, color: SUBTLE }}>Verification date</Text>
              <Text style={{ flex: 1, fontSize: 8.5, color: BODY }}>{dateStr}</Text>
            </View>
            <View style={s.kvRow}>
              <Text style={{ ...s.kvLabel, color: SUBTLE }}>Repository commit</Text>
              <Text style={{ flex: 1, fontSize: 8, color: MUTED, fontFamily: "Courier" }}>
                {ref.length > 40 ? ref.slice(0, 40) : ref}
              </Text>
            </View>
            <View style={s.kvRow}>
              <Text style={{ ...s.kvLabel, color: SUBTLE }}>Attestation level</Text>
              <Text style={{ flex: 1, fontSize: 8.5, fontFamily: "Helvetica-Bold", color: EMERALD }}>
                {LEVEL_LABELS[report.level]}
              </Text>
            </View>
            <View style={s.kvRow}>
              <Text style={{ ...s.kvLabel, color: SUBTLE }}>Permalink</Text>
              <Link src={permalink}>
                <Text style={{ fontSize: 8, color: LINK }}>{permalink}</Text>
              </Link>
            </View>
          </View>

          {/* Scope disclaimer box */}
          <View style={{
            padding: 14,
            backgroundColor: "#f0f9ff",
            borderLeftWidth: 4,
            borderLeftColor: TEAL,
            borderRadius: 2,
          }}>
            <Text style={{ fontSize: 8.5, fontFamily: "Helvetica-Bold", color: TEAL, marginBottom: 5 }}>
              SCOPE OF THIS REPORT
            </Text>
            <Text style={{ fontSize: 8, color: MUTED, lineHeight: 1.5 }}>
              Independent automated verification of reproducible execution. STRhub Verified confirms
              that this tool can be installed, executed end-to-end, and produces structurally valid output
              in a standardized environment.
            </Text>
            <Text style={{ fontSize: 8, color: MUTED, lineHeight: 1.5, marginTop: 5 }}>
              This is not an analytical validation. It does not assess genotype accuracy, concordance
              with truth sets, forensic suitability, or regulatory compliance.
            </Text>
          </View>
        </View>

        {/* Cover footer */}
        <View style={{ height: 6, backgroundColor: TEAL }} />
      </Page>

      {/* ══════════════════════════════════════════════
          MAIN REPORT PAGE(S)
      ══════════════════════════════════════════════ */}
      <Page size="A4" style={s.page}>
        {/* ── Page header ── */}
        <View style={s.headerRow}>
          {logoSrc && <Image style={s.logo} src={logoSrc} />}
          <View>
            <Text style={s.headerTitle}>STRhub Verified — {toolDisplayName}</Text>
            <Text style={s.headerSub}>Technical Reproducibility Validation Report · {dateStr}</Text>
          </View>
        </View>

        {/* ── 1. Executive Summary ── */}
        <Text style={s.sectionTitle}>{++sn}. Executive Summary</Text>
        <View style={{ borderWidth: 0.5, borderColor: BORDER, borderRadius: 4, overflow: "hidden" }}>
          {[
            ["Purpose", "Verify that this tool installs, runs end-to-end, and produces structurally valid output in a reproducible environment."],
            ["Result", `${gatesPassed}/${gateOrder.length} gates passed — ${LEVEL_LABELS[report.level]}`],
            ["Attestation level", LEVEL_LABELS[report.level]],
            ["Scope", "Installation, execution, and output structure verification."],
            ["Not evaluated", "Genotype accuracy · Concordance · Forensic validity · Regulatory compliance"],
          ].map(([label, value], i) => (
            <View key={label} style={[s.execRow, i % 2 === 0 ? { backgroundColor: BG } : {}]}>
              <Text style={s.execLabel}>{label}</Text>
              <Text style={{
                ...s.execValue,
                ...(label === "Result" ? { fontFamily: "Helvetica-Bold", color: EMERALD } : {}),
              }}>
                {value}
              </Text>
            </View>
          ))}
        </View>

        {/* ── 2. Reproducibility Metadata ── */}
        <Text style={s.sectionTitle}>{++sn}. Reproducibility Metadata</Text>
        <View style={s.kvRow}>
          <Text style={s.kvLabel}>Tool</Text>
          <Text style={{ ...s.kvValue, fontFamily: "Helvetica-Bold" }}>{toolDisplayName}</Text>
        </View>
        {report.tool.version && (
          <View style={s.kvRow}>
            <Text style={s.kvLabel}>Version</Text>
            <Text style={s.kvValue}>{report.tool.version}</Text>
          </View>
        )}
        {report.tool.maintainer && (
          <View style={s.kvRow}>
            <Text style={s.kvLabel}>Maintainer</Text>
            <Text style={s.kvValue}>{report.tool.maintainer}</Text>
          </View>
        )}
        <View style={s.kvRow}>
          <Text style={s.kvLabel}>Repository</Text>
          <Link src={report.source.repo}>
            <Text style={{ fontSize: 8, color: LINK }}>{report.source.repo}</Text>
          </Link>
        </View>
        <View style={s.kvRow}>
          <Text style={s.kvLabel}>Commit (pinned)</Text>
          <Text style={{ flex: 1, fontSize: 7.5, color: MUTED, fontFamily: "Courier" }}>{ref}</Text>
        </View>
        {report.environment?.os && (
          <View style={s.kvRow}>
            <Text style={s.kvLabel}>Container OS</Text>
            <Text style={s.kvValue}>{report.environment.os.join(", ")}</Text>
          </View>
        )}
        {panelLabel && (
          <View style={s.kvRow}>
            <Text style={s.kvLabel}>Marker panel</Text>
            <Text style={s.kvValue}>{panelLabel}</Text>
          </View>
        )}
        <View style={s.kvRow}>
          <Text style={s.kvLabel}>Verified on</Text>
          <Text style={s.kvValue}>{report.generated?.slice(0, 19).replace("T", " ")} UTC</Text>
        </View>
        {report.ci_run && (
          <View style={s.kvRow}>
            <Text style={s.kvLabel}>CI run</Text>
            <Link src={report.ci_run}>
              <Text style={{ fontSize: 8, color: LINK }}>{report.ci_run}</Text>
            </Link>
          </View>
        )}

        {/* ── 3. Verification Gates ── */}
        <View wrap={false}>
          <Text style={s.sectionTitle}>{++sn}. Verification Gates</Text>
          {gateOrder.map((key, i) => {
            const pass = report.gates?.[key];
            return (
              <View key={key} style={[s.tableRow, i % 2 === 0 ? s.tableRowAlt : {}]}>
                <Text style={{ width: 110, fontSize: 8, fontFamily: "Helvetica-Bold", color: BODY }}>
                  {GATE_NAMES[key]}
                </Text>
                <Text style={{ flex: 1, fontSize: 8, color: MUTED }}>
                  {GATE_LABELS[key]}
                </Text>
                <Text style={{ width: 30, fontSize: 8, textAlign: "right", color: pass ? EMERALD : MUTED }}>
                  {pass ? "PASS" : "—"}
                </Text>
              </View>
            );
          })}
          <Text style={{ fontSize: 8.5, fontFamily: "Helvetica-Bold", color: TEAL, marginTop: 6 }}>
            Attestation level: {LEVEL_LABELS[report.level]}
          </Text>
          {report.logs && (() => {
            const visLogs = Object.entries(report.logs).filter(([leg]) => {
              const legData = report.datasets?.find((d) => d.leg === leg);
              return legData?.fixture_source !== "strhub";
            });
            if (visLogs.length === 0) return null;
            return (
              <View style={{ marginTop: 4 }}>
                {visLogs.map(([leg, fname]) => (
                  <View key={leg} style={s.kvRow}>
                    <Text style={{ ...s.kvLabel, width: 80 }}>Execution log</Text>
                    <Link src={`https://raw.githubusercontent.com/Tfronta/strhub-verified/gh-pages/${fname}`}>
                      <Text style={{ fontSize: 7.5, color: LINK }}>{fname}</Text>
                    </Link>
                  </View>
                ))}
              </View>
            );
          })()}
        </View>

        {/* ── 4. Out of Scope ── */}
        <View wrap={false}>
          <Text style={s.sectionTitle}>{++sn}. Out of Scope</Text>
          <Text style={{ fontSize: 8, color: MUTED, marginBottom: 6, lineHeight: 1.4 }}>
            This report does not evaluate any of the following:
          </Text>
          {OUT_OF_SCOPE_ITEMS.map((item) => (
            <View key={item} style={s.bulletRow}>
              <Text style={s.bulletDot}>·</Text>
              <Text style={s.bulletText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* ── 5. Auto-diagnostics (warning/error only) ── */}
        {actionableDiagnostics.length > 0 && (
          <View wrap={false}>
            <Text style={s.sectionTitle}>{++sn}. Auto-diagnostics</Text>
            <Text style={{ fontSize: 7.5, fontFamily: "Helvetica-Bold", color: MUTED, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>
              Issues from execution log
            </Text>
            {actionableDiagnostics.map((issue) => {
              const sevColor = issue.severity === "error" ? DIAG_ERROR_BORDER : DIAG_WARN_BORDER;
              const sevBg = issue.severity === "error" ? DIAG_ERROR_BG : DIAG_WARN_BG;
              return (
                <View
                  key={issue.id}
                  style={{
                    marginBottom: 4,
                    paddingVertical: 5,
                    paddingHorizontal: 8,
                    backgroundColor: sevBg,
                    flexDirection: "row",
                    alignItems: "flex-start",
                  }}
                >
                  <View style={{ width: 3, backgroundColor: sevColor, marginRight: 8, minHeight: 14, borderRadius: 1 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: BODY }}>
                      {issue.title}
                    </Text>
                    {issue.suggestion && (
                      <Text style={{ fontSize: 7.5, color: MUTED, marginTop: 2 }}>
                        {issue.suggestion}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* ── Output Content Evidence ── */}
        {hasStats && (
          <View wrap={false}>
            <Text style={s.sectionTitle}>{++sn}. Output Content Evidence</Text>
            {ioOut && (
              <>
                <View style={s.kvRow}>
                  <Text style={s.kvLabel}>Output file</Text>
                  <Text style={{ flex: 1, fontSize: 7.5, color: MUTED, fontFamily: "Courier" }}>
                    {ioOut.resolved ?? "N/A"}
                  </Text>
                </View>
                <View style={s.kvRow}>
                  <Text style={s.kvLabel}>Format</Text>
                  <Text style={s.kvValue}>{(ioOut.format ?? "N/A").toUpperCase()}</Text>
                </View>
              </>
            )}
            <View style={s.kvRow}>
              <Text style={s.kvLabel}>Sequence records</Text>
              <Text style={s.kvValue}>{stats!.rows ?? 0}</Text>
            </View>
            <View style={s.kvRow}>
              <Text style={s.kvLabel}>Distinct STR loci</Text>
              <Text style={s.kvValue}>{stats!.distinct_str_loci ?? stats!.distinct_loci ?? 0}</Text>
            </View>
            {(stats!.distinct_snp_markers ?? 0) > 0 && (
              <View style={s.kvRow}>
                <Text style={s.kvLabel}>Identity SNP markers</Text>
                <Text style={s.kvValue}>{stats!.distinct_snp_markers}</Text>
              </View>
            )}
            <View style={s.kvRow}>
              <Text style={s.kvLabel}>Total reads</Text>
              <Text style={s.kvValue}>{stats!.total_reads ?? 0}</Text>
            </View>

            {stats!.top_loci_by_depth && stats!.top_loci_by_depth.length > 0 && (
              <>
                <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: TEAL, marginTop: 8, marginBottom: 3 }}>
                  Top loci by read depth
                </Text>
                {stats!.top_loci_by_depth.map(([locus, depth], i) => (
                  <View key={locus} style={[s.tableRow, i % 2 === 0 ? s.tableRowAlt : {}]}>
                    <Text style={{ flex: 1, fontSize: 8, color: BODY }}>{locus}</Text>
                    <Text style={{ width: 60, fontSize: 8, color: MUTED, textAlign: "right" }}>{depth}</Text>
                  </View>
                ))}
              </>
            )}
          </View>
        )}

        {/* ── Verification Data (provenance) ── */}
        {hasProvenance && (
          <View wrap={false}>
            <Text style={s.sectionTitle}>{++sn}. Verification Data</Text>
            <Text style={{ fontSize: 8, color: MUTED, marginBottom: 4 }}>
              Public reference datasets used as input. Sourced from open-access repositories;
              see upstream licenses for terms of use.
            </Text>
            {hasStrhubFixture && (
              <View style={{ ...s.noteBox, borderLeftColor: "#60a5fa", marginBottom: 6 }}>
                <Text style={s.noteText}>
                  This tool does not include its own demo or test data in its repository. STRhub ran
                  the verification using a pre-built slice from the public reference data listed below.
                </Text>
              </View>
            )}
            {provenanceEntries.map((ds) => (
              <View key={ds.type} style={s.datasetBox}>
                <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: TEAL, marginBottom: 3 }}>
                  {ds.name}
                </Text>
                <View style={s.kvRow}>
                  <Text style={{ ...s.kvLabel, width: 60 }}>Source</Text>
                  <Link src={ds.source}>
                    <Text style={{ fontSize: 7.5, color: LINK }}>{ds.source}</Text>
                  </Link>
                </View>
                {ds.doi && (
                  <View style={s.kvRow}>
                    <Text style={{ ...s.kvLabel, width: 60 }}>DOI</Text>
                    <Link src={`https://doi.org/${ds.doi}`}>
                      <Text style={{ fontSize: 7.5, color: LINK }}>{ds.doi}</Text>
                    </Link>
                  </View>
                )}
                <View style={s.kvRow}>
                  <Text style={{ ...s.kvLabel, width: 60 }}>License</Text>
                  <Text style={{ flex: 1, fontSize: 7.5, color: MUTED }}>{ds.license}</Text>
                </View>
                {ds.referenceGenome && (
                  <View style={s.kvRow}>
                    <Text style={{ ...s.kvLabel, width: 60 }}>Ref. genome</Text>
                    <Text style={{ flex: 1, fontSize: 7.5, color: MUTED }}>
                      {ds.referenceGenome.assembly} ({ds.referenceGenome.mountPath})
                    </Text>
                  </View>
                )}
                <View style={{ ...s.kvRow, marginTop: 2 }}>
                  <Text style={{ ...s.kvLabel, width: 60 }}>Loci tested</Text>
                  <Text style={{ flex: 1, fontSize: 7.5, color: MUTED }}>
                    {ds.loci.length} forensic STR loci
                  </Text>
                </View>
                <Text style={{ fontSize: 6.5, color: SUBTLE, marginTop: 2 }}>
                  {ds.loci.join(", ")}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* ── Verification Matrix ── */}
        {visibleLegs.length > 0 && (
          <View wrap={false}>
            <Text style={s.sectionTitle}>{++sn}. Verification Matrix</Text>
            {visibleLegs.map((leg, i) => {
              const state = !leg.available ? "N/A" : leg.passed ? "PASS" : "FAIL";
              return (
                <View key={leg.leg} style={[s.tableRow, i % 2 === 0 ? s.tableRowAlt : {}]}>
                  <Text style={{ width: 30, fontSize: 8, color: state === "PASS" ? EMERALD : MUTED }}>
                    {state}
                  </Text>
                  <Text style={{ width: 100, fontSize: 8, fontFamily: "Helvetica-Bold", color: BODY }}>
                    {leg.leg === "own" ? "Tool test data" : "Reference dataset"}
                  </Text>
                  <Text style={{ flex: 1, fontSize: 7.5, color: MUTED }}>{leg.dataset ?? "—"}</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* ── README check ── */}
        {report.readme_check && (
          <View wrap={false}>
            <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: TEAL, marginTop: 12, marginBottom: 3 }}>
              README check (advisory, {report.readme_check.score}/{report.readme_check.max})
            </Text>
            {Object.entries(README_ITEMS).map(([key, label]) => {
              const present = report.readme_check?.checks?.[key]?.present;
              return (
                <View key={key} style={s.kvRow}>
                  <Text style={{ ...s.kvLabel, width: 160 }}>{label}</Text>
                  <Text style={{ fontSize: 8, color: present ? EMERALD : MUTED }}>
                    {present ? "Present" : "Missing"}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {/* ── Limitations ── */}
        <View wrap={false}>
          <Text style={s.sectionTitle}>{++sn}. Limitations</Text>
          {LIMITATIONS_ITEMS.map((item) => (
            <View key={item} style={s.bulletRow}>
              <Text style={s.bulletDot}>·</Text>
              <Text style={s.bulletText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* ── Scope and Disclaimers ── */}
        <Text style={s.sectionTitle}>{++sn}. Scope and Disclaimers</Text>
        <View style={{ padding: 8, backgroundColor: BG, borderLeftWidth: 3, borderLeftColor: TEAL, borderRadius: 2, marginBottom: 6 }}>
          <Text style={{ fontSize: 8, color: MUTED, lineHeight: 1.5 }}>{report.scope}</Text>
        </View>
        <Text style={{ fontSize: 7.5, color: MUTED, marginBottom: 3, lineHeight: 1.4 }}>
          Each result is a dated snapshot, verified on the tool's public repository at a pinned commit.
          STRhub does not store tool source code.
        </Text>

        <FooterView dateStr={dateStr} permalink={permalink} />
      </Page>

      {/* ══════════════════════════════════════════════
          APPENDIX: DETECTED MARKERS
      ══════════════════════════════════════════════ */}
      {stats &&
        ((stats.str_loci && stats.str_loci.length > 0) ||
          (stats.snp_markers && stats.snp_markers.length > 0)) && (
          <Page size="A4" style={s.page}>
            <Text style={{ fontSize: 12, fontFamily: "Helvetica-Bold", color: TEAL }}>
              Appendix — Detected Markers
            </Text>
            <Text style={{ fontSize: 8, color: MUTED, marginTop: 4, marginBottom: 8 }}>
              {toolDisplayName} ({slug}) — verified {dateStr}
            </Text>

            {stats.str_loci && stats.str_loci.length > 0 && (
              <>
                <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: TEAL, marginTop: 6, marginBottom: 4 }}>
                  STR Loci ({stats.str_loci.length})
                </Text>
                <View style={s.lociGrid}>
                  {stats.str_loci.map((l) => (
                    <Text key={l} style={s.lociItem}>{l}</Text>
                  ))}
                </View>
              </>
            )}

            {stats.snp_markers && stats.snp_markers.length > 0 && (
              <>
                <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: TEAL, marginTop: 10, marginBottom: 4 }}>
                  Identity SNP Markers ({stats.snp_markers.length})
                </Text>
                <View style={s.lociGrid}>
                  {stats.snp_markers.map((m) => (
                    <Text key={m} style={s.snpItem}>{m}</Text>
                  ))}
                </View>
              </>
            )}

            <FooterView dateStr={dateStr} permalink={permalink} />
          </Page>
        )}
    </Document>
  );
}

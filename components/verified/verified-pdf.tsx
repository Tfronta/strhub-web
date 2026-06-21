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
const DIAG_INFO_BORDER = "#3b82f6";
const DIAG_ERROR_BG = "#fef2f2";
const DIAG_WARN_BG = "#fffbeb";
const DIAG_INFO_BG = "#eff6ff";

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
    name: "1000 Genomes Illumina 30x — hg38 CODIS slice",
    source:
      "https://www.internationalgenome.org/data-portal/data-collection/30x-grch38",
    license: "Open access (1000 Genomes). Research use.",
    loci: CODIS_CORE_LOCI,
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
});

const GATE_LABELS: Record<string, string> = {
  available: "The pinned public source exists",
  installs: "The environment builds from source",
  runs: "It executes end-to-end without crashing",
  io: "It produces a non-empty file in the declared format",
  content: "Its output looks like plausible genotype-bearing data",
};

const GATE_NAMES: Record<string, string> = {
  available: "Available",
  installs: "Installs",
  runs: "Runs",
  io: "Expected IO",
  content: "Plausible Output",
};

const LEVEL_LABELS: Record<VerifiedLevel, string> = {
  content: "Runs + Plausible output",
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

export function VerifiedPDF({ report, slug, logoSrc }: Props) {
  const toolDisplayName = extractToolDisplayName(report);
  const ref = report.source.ref_resolved ?? report.source.ref ?? "";
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
  const hasDatasets = !!(report.datasets && report.datasets.length > 0);
  const hasStrhubFixture = report.datasets?.some(
    (d) => d.fixture_source === "strhub"
  );

  const HIDDEN_IDS = new Set(["genotyping_summary"]);
  const dedupedDiagnostics: VerifiedDiagnostic[] = [];
  if (report.diagnostics) {
    const seen = new Set<string>();
    for (const issues of Object.values(report.diagnostics)) {
      for (const issue of issues) {
        if (HIDDEN_IDS.has(issue.id)) continue;
        if (!seen.has(issue.id)) {
          seen.add(issue.id);
          dedupedDiagnostics.push(issue);
        }
      }
    }
  }
  const hasDiagnostics = dedupedDiagnostics.length > 0;

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

  let sn = 0;

  return (
    <Document
      title={`STRhub Verified — ${report.tool.name} (${slug})`}
      author="STRhub"
      subject="Reproducible-execution attestation"
      producer="STRhub (strhub.app)"
    >
      <Page size="A4" style={s.page}>
        {/* ── Header ── */}
        <View style={s.headerRow}>
          {logoSrc && <Image style={s.logo} src={logoSrc} />}
          <View>
            <Text style={s.headerTitle}>STRhub Verified</Text>
            <Text style={s.headerSub}>Reproducible-Execution Attestation Report</Text>
          </View>
        </View>

        {/* ── Tool hero ── */}
        <View style={{ marginTop: 10, marginBottom: 6, paddingBottom: 10, borderBottomWidth: 0.5, borderBottomColor: BORDER }}>
          <Text style={{ fontSize: 18, fontFamily: "Helvetica-Bold", color: TEAL }}>
            {toolDisplayName}
          </Text>
          {report.tool.version && (
            <Text style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>
              Version {report.tool.version}
            </Text>
          )}
        </View>

        {/* ── 1. Tool Under Verification ── */}
        <Text style={s.sectionTitle}>{++sn}. Tool Under Verification</Text>
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
          <Text style={s.kvLabel}>Commit</Text>
          <Text style={{ flex: 1, fontSize: 7.5, color: MUTED, fontFamily: "Courier" }}>{ref}</Text>
        </View>
        {report.environment?.os && (
          <View style={s.kvRow}>
            <Text style={s.kvLabel}>Environment</Text>
            <Text style={s.kvValue}>{report.environment.os.join(", ")}</Text>
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

        {/* ── 2. Summary ── */}
        <Text style={s.sectionTitle}>{++sn}. Summary</Text>
        <View style={s.card}>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={s.cardLabel}>Level</Text>
              <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: EMERALD }}>
                {LEVEL_LABELS[report.level]}
              </Text>
            </View>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={s.cardLabel}>Gates</Text>
              <Text style={{ fontSize: 8.5, color: MUTED }}>
                {gatesPassed}/{gateOrder.length} passed
              </Text>
            </View>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={s.cardLabel}>Datasets</Text>
              <Text style={{ fontSize: 8.5, color: MUTED }}>
                {provenanceEntries.length > 0 ? `${provenanceEntries.length} reference` : "None"}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.cardLabel}>Verified on</Text>
              <Text style={{ fontSize: 8.5, color: MUTED }}>{dateStr}</Text>
            </View>
          </View>
          {report.scope && (
            <View style={{ borderTopWidth: 0.5, borderTopColor: BORDER, marginTop: 8, paddingTop: 6 }}>
              <Text style={{ fontSize: 7.5, color: MUTED, lineHeight: 1.4 }}>
                {report.scope}
              </Text>
            </View>
          )}
        </View>

        {/* ── 3. Verification Gates ── */}
        <View wrap={false}>
        <Text style={s.sectionTitle}>{++sn}. Verification Gates</Text>
        {gateOrder.map((key, i) => {
          const pass = report.gates?.[key];
          return (
            <View key={key} style={[s.tableRow, i % 2 === 0 ? s.tableRowAlt : {}]}>
              <Text style={{ width: 85, fontSize: 8, fontFamily: "Helvetica-Bold", color: BODY }}>
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
        {report.gates?.content === false && (
          <Text style={{ fontSize: 7.5, color: MUTED, marginTop: 4, fontStyle: "italic", lineHeight: 1.4 }}>
            Note: The "Plausible Output" check did not pass because the output did not fully match
            the expected genotype pattern. This may be due to differences in parameters, tool version,
            or configuration.
          </Text>
        )}
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

        {/* ── 4. Auto-diagnostics ── */}
        {hasDiagnostics && (
          <View wrap={false}>
            <Text style={s.sectionTitle}>{++sn}. Auto-diagnostics</Text>
            {hasStrhubFixture && (
              <View style={{ marginBottom: 6, padding: 8, backgroundColor: "#f0fdfa", borderRadius: 2 }}>
                <Text style={{ fontSize: 7, fontFamily: "Helvetica-Bold", color: TEAL, marginBottom: 2 }}>
                  STRHUB VERIFIED — NOTE
                </Text>
                <Text style={s.noteText}>
                  These messages reflect the behavior observed during verification with a small test BAM
                  slice provided by STRhub. With full-coverage sequencing data, the tool is expected to
                  genotype significantly more loci. The warnings do not indicate a problem with the tool itself.
                </Text>
              </View>
            )}
            <Text style={{ fontSize: 7.5, fontFamily: "Helvetica-Bold", color: MUTED, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>
              Issues from execution log
            </Text>
            {dedupedDiagnostics.map((issue) => {
              const sevColor =
                issue.severity === "error" ? DIAG_ERROR_BORDER :
                issue.severity === "warning" ? DIAG_WARN_BORDER : DIAG_INFO_BORDER;
              const sevBg =
                issue.severity === "error" ? DIAG_ERROR_BG :
                issue.severity === "warning" ? DIAG_WARN_BG : DIAG_INFO_BG;
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
        {stats && (
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
              <Text style={s.kvValue}>{stats.rows ?? 0}</Text>
            </View>
            <View style={s.kvRow}>
              <Text style={s.kvLabel}>Distinct STR loci</Text>
              <Text style={s.kvValue}>{stats.distinct_str_loci ?? stats.distinct_loci ?? 0}</Text>
            </View>
            {(stats.distinct_snp_markers ?? 0) > 0 && (
              <View style={s.kvRow}>
                <Text style={s.kvLabel}>Identity SNP markers</Text>
                <Text style={s.kvValue}>{stats.distinct_snp_markers}</Text>
              </View>
            )}
            <View style={s.kvRow}>
              <Text style={s.kvLabel}>Total reads</Text>
              <Text style={s.kvValue}>{stats.total_reads ?? 0}</Text>
            </View>

            {stats.top_loci_by_depth && stats.top_loci_by_depth.length > 0 && (
              <>
                <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: TEAL, marginTop: 8, marginBottom: 3 }}>
                  Top loci by read depth
                </Text>
                {stats.top_loci_by_depth.map(([locus, depth], i) => (
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

        {/* ── Scope and Disclaimers ── */}
        <Text style={s.sectionTitle}>{++sn}. Scope and Disclaimers</Text>
        <View style={{ padding: 8, backgroundColor: BG, borderLeftWidth: 3, borderLeftColor: TEAL, borderRadius: 2, marginBottom: 6 }}>
          <Text style={{ fontSize: 8, color: MUTED, lineHeight: 1.5 }}>{report.scope}</Text>
        </View>
        <Text style={{ fontSize: 7.5, color: MUTED, marginBottom: 3, lineHeight: 1.4 }}>
          This attestation concerns reproducible execution only. It is not a claim that the genotypes
          produced are correct, nor that the tool is fit for casework or meets any regulatory standard.
        </Text>
        <Text style={{ fontSize: 7.5, color: MUTED, marginBottom: 3, lineHeight: 1.4 }}>
          Concordance against known truth is out of scope. The verification checks that the tool installs,
          runs end-to-end, and produces output whose structure is plausible for genotype-bearing data.
        </Text>
        <Text style={{ fontSize: 7.5, color: MUTED, lineHeight: 1.4 }}>
          Each result is a dated snapshot, verified on the tool's public repository at a pinned commit.
          STRhub does not store tool source code.
        </Text>

        {/* ── Footer ── */}
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
      </Page>

      {/* ── Appendix: Detected Markers ── */}
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
          </Page>
        )}
    </Document>
  );
}

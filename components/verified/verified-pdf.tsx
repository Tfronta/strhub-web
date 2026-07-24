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

// ── Palette ───────────────────────────────────────────────────────────────────
// Green = TEAL only (#0d9488 — matches STRhub logo). No EMERALD.
// Black is never used; darkest text is BODY = gray-700.
const TEAL   = "#0d9488";
const BODY   = "#374151";   // gray-700 — main text
const MUTED  = "#6b7280";   // gray-500 — secondary text
const SUBTLE = "#9ca3af";   // gray-400 — captions / placeholders
const BORDER = "#e5e7eb";   // gray-200
const BG     = "#f9fafb";   // gray-50
const LINK   = "#0d9488";

// ── Datasets ──────────────────────────────────────────────────────────────────
const CODIS_CORE_LOCI = [
  "Amelogenin","CSF1PO","D1S1656","D2S441","D2S1338","D3S1358","D5S818",
  "D7S820","D8S1179","D10S1248","D12S391","D13S317","D16S539","D17S1301",
  "D18S51","D19S433","D20S482","D21S11","D22S1045","FGA","TH01","TPOX",
  "vWA","PentaD","PentaE","DYS391","SE33",
];
const FORENSEQ_STR_LOCI = [
  "Amelogenin","CSF1PO","D1S1656","D2S441","D2S1338","D3S1358","D4S2408",
  "D5S818","D6S1043","D7S820","D8S1179","D9S1122","D10S1248","D12S391",
  "D13S317","D16S539","D17S1301","D18S51","D19S433","D20S482","D21S11",
  "D22S1045","FGA","TH01","TPOX","vWA","PentaD","PentaE","DXS7132",
  "DXS7423","DXS8378","DXS10074","DXS10103","DXS10135","DYF387S1","DYS19",
  "DYS385","DYS389I","DYS389II","DYS390","DYS391","DYS392","DYS437",
  "DYS438","DYS439","DYS448","DYS456","DYS458","DYS460","DYS461","DYS481",
  "DYS505","DYS522","DYS533","DYS549","DYS570","DYS576","DYS612","DYS635",
  "DYS643","HPRTB","Y-GATA-H4",
];
const NA12878_AUTOSOMAL_LOCI = [
  "CSF1PO","D1S1656","D2S441","D2S1338","D3S1358","D5S818","D6S1043",
  "D7S820","D8S1179","D10S1248","D12S391","D13S317","D16S539","D18S51",
  "D19S433","D21S11","D22S1045","FGA","TH01","TPOX","vWA","PentaD","PentaE","SE33",
];
const HG002_YSTR_LOCI = [
  "DYS19","DYS385a/b","DYS389I","DYS389II","DYS390","DYS391","DYS392",
  "DYS393","DYS438","DYS448","DYS456","DYS458","DYS635","Y-GATA-H4","Y-GATA-A10",
];

interface DatasetProvenance {
  name: string; source: string; doi?: string; license: string;
  loci: string[]; referenceGenome?: { assembly: string; mountPath: string };
}
const DATASET_PROVENANCE: Record<string, DatasetProvenance> = {
  "illumina-str-fastq": {
    name: "NIST mds2-2157, Illumina STR (ForenSeq slice, donor NTD01)",
    source: "https://data.nist.gov/od/id/mds2-2157", doi: "10.18434/M32157",
    license: "Research / training / education only (per NIST).",
    loci: FORENSEQ_STR_LOCI,
  },
  "ont-bam-hg38": {
    name: "1000 Genomes ONT, hg38 CODIS slice (R10 SUP)",
    source: "https://s3.amazonaws.com/1000g-ont/index.html",
    license: "Open access (1000 Genomes / HPRC). Research use.",
    loci: CODIS_CORE_LOCI,
    referenceGenome: { assembly: "GRCh38 / hg38", mountPath: "/data/ref/hg38.fa" },
  },
  "illumina-bam-hg38": {
    name: "GIAB NA12878 300x, hg38 autosomal forensic slice",
    source: "https://ftp-trace.ncbi.nlm.nih.gov/ReferenceSamples/giab/data/NA12878/NIST_NA12878_HG001_HiSeq_300x/",
    license: "Open access (GIAB / NIST). Research use.",
    loci: NA12878_AUTOSOMAL_LOCI,
    referenceGenome: { assembly: "GRCh38 / hg38", mountPath: "/data/ref/hg38.fa" },
  },
  "illumina-bam-hg38-y": {
    name: "GIAB HG002 300x, hg38 Y-STR slice",
    source: "https://ftp-trace.ncbi.nlm.nih.gov/ReferenceSamples/giab/data/AshkenazimTrio/HG002_NA24385_son/",
    license: "Open access (GIAB / NIST). Research use.",
    loci: HG002_YSTR_LOCI,
    referenceGenome: { assembly: "GRCh38 / hg38", mountPath: "/data/ref/hg38.fa" },
  },
};
const LEGACY_SLUG_DATASETS: Record<string, string[]> = {
  "strait-razor-ForenSeqv1.27": ["illumina-str-fastq"],
};

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    paddingTop: 36, paddingBottom: 52, paddingHorizontal: 44,
    fontFamily: "Helvetica", fontSize: 9, color: BODY,
    backgroundColor: "#ffffff",
  },
  coverPage: {
    fontFamily: "Helvetica", fontSize: 9, color: BODY,
    backgroundColor: "#ffffff", flexDirection: "column",
  },
  footer: {
    position: "absolute", bottom: 18, left: 44, right: 44,
    borderTopWidth: 0.5, borderTopColor: BORDER, paddingTop: 5,
    flexDirection: "row", justifyContent: "space-between",
    fontSize: 7.5, color: SUBTLE,
  },
  // Section title — dark gray, uppercase, thin underline
  sec: {
    fontSize: 8.5, fontFamily: "Helvetica-Bold", color: BODY,
    marginTop: 14, marginBottom: 5,
    paddingBottom: 3, borderBottomWidth: 0.5, borderBottomColor: BORDER,
    textTransform: "uppercase", letterSpacing: 0.5,
  },
  // Key–value
  kv: { flexDirection: "row", marginBottom: 3 },
  kl: { width: 112, fontSize: 8.5, color: MUTED },
  kv2: { flex: 1, fontSize: 8.5, color: BODY },
  // Table rows
  tr: {
    flexDirection: "row", paddingVertical: 4, paddingHorizontal: 6,
    borderBottomWidth: 0.5, borderBottomColor: BORDER,
  },
  trAlt: { backgroundColor: BG },
  // Plain gray box
  box: { backgroundColor: BG, borderRadius: 3, padding: 9, marginTop: 3, marginBottom: 3 },
  // Bullet
  bullet: { flexDirection: "row", marginBottom: 2.5, paddingLeft: 6 },
  bulletDot: { width: 12, fontSize: 8.5, color: MUTED },
  bulletTxt: { flex: 1, fontSize: 8.5, color: MUTED, lineHeight: 1.4 },
  // Appendix
  lociGrid: { flexDirection: "row", flexWrap: "wrap" },
  lociItem: { fontSize: 7.5, color: MUTED, width: "25%", marginBottom: 1.5 },
});

// ── Constants ─────────────────────────────────────────────────────────────────
const GATE_NAME: Record<string, string> = {
  available: "Available",
  installs:  "Installs",
  runs:      "Runs",
  io:        "Expected IO",
  content:   "Output Structure Validation",
};
const GATE_DESC: Record<string, string> = {
  available: "The pinned public source exists",
  installs:  "The environment builds from source",
  runs:      "It executes end-to-end without crashing",
  io:        "It produces a non-empty file in the declared format",
  content:   "Its output structure matches expected genotype-bearing format",
};
const LEVEL_LABEL: Record<VerifiedLevel, string> = {
  content:  "Runs + Output Structure Validation",
  io:       "Runs + Expected IO",
  runs:     "Runs",
  installs: "Installs",
  available:"Available",
  none:     "Not run",
};
const OUT_OF_SCOPE = [
  "Genotype correctness or accuracy",
  "Concordance against known truth sets",
  "Sensitivity, specificity, or stutter performance",
  "Allele calling accuracy or forensic casework suitability",
  "Regulatory compliance or ISO accreditation",
  "Multi-laboratory or multi-dataset reproducibility",
];
const LIMITATIONS = [
  "Single reference dataset per input type",
  "Single containerized environment (Docker / ubuntu-22.04)",
  "No truth-set comparison or ground-truth genotypes",
  "No accuracy or concordance assessment",
  "No forensic validation of results",
  "Short-read limitations apply (very long STR alleles may not span reads)",
];
const README_ITEMS: Record<string, string> = {
  install: "Install / environment setup",
  command: "Run command",
  input: "Expected input format",
  output: "Produced output format",
  dependencies: "Dependencies / versions",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function toolName(report: VerifiedReport): string {
  if (report.source?.repo) {
    const seg = report.source.repo.replace(/\/+$/, "").split("/");
    if (seg[seg.length - 1]) return seg[seg.length - 1];
  }
  return report.tool.name;
}

function Footer({ dateStr, permalink }: { dateStr: string; permalink: string }) {
  return (
    <View style={s.footer} fixed>
      <Text style={{ color: MUTED }}>
        <Text style={{ color: BODY, fontFamily: "Helvetica-Bold" }}>STR</Text>
        <Text style={{ color: TEAL, fontFamily: "Helvetica-Bold" }}>hub</Text>
        {" Verified · "}
        <Text style={{ color: LINK }}>{permalink}</Text>
      </Text>
      <Text>
        {dateStr}{"  "}
        <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
      </Text>
    </View>
  );
}

function Kv({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={s.kv}>
      <Text style={s.kl}>{label}</Text>
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
}

function BulletList({ items, color = MUTED }: { items: string[]; color?: string }) {
  return (
    <>
      {items.map((item) => (
        <View key={item} style={s.bullet}>
          <Text style={{ ...s.bulletDot, color }}>–</Text>
          <Text style={{ ...s.bulletTxt, color }}>{item}</Text>
        </View>
      ))}
    </>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function VerifiedPDF({ report, slug, logoSrc }: {
  report: VerifiedReport; slug: string; logoSrc?: string;
}) {
  const name      = toolName(report);
  const ref       = report.source.ref_resolved ?? report.source.ref ?? "";
  const dateStr   = report.generated?.slice(0, 10) ?? "N/A";
  const permalink = `https://strhub.app/verified/${slug}`;
  const stats     = report.content_detail?.outputs?.[0]?.stats;
  const ioDetail  = report.io_detail as { outputs?: { resolved?: string; format?: string }[] } | undefined;
  const ioOut     = ioDetail?.outputs?.[0];
  const gates     = ["available","installs","runs","io","content"] as const;
  const passed    = gates.filter((k) => report.gates?.[k]).length;

  const hasStrhubFixture = report.datasets?.some((d) => d.fixture_source === "strhub");
  const visibleLegs = report.datasets?.filter((d) => d.fixture_source !== "strhub") ?? [];

  // Only warning/error diagnostics
  const actionable: VerifiedDiagnostic[] = [];
  if (report.diagnostics) {
    const seen = new Set<string>();
    const HIDE = new Set(["genotyping_summary"]);
    for (const issues of Object.values(report.diagnostics)) {
      for (const issue of issues) {
        if (HIDE.has(issue.id) || issue.severity === "info" || seen.has(issue.id)) continue;
        seen.add(issue.id);
        actionable.push(issue);
      }
    }
  }

  const datasetTypes = new Set<string>();
  if (report.datasets) {
    for (const leg of report.datasets) { if (leg.type) datasetTypes.add(leg.type); }
  } else if (LEGACY_SLUG_DATASETS[slug]) {
    for (const t of LEGACY_SLUG_DATASETS[slug]) datasetTypes.add(t);
  }
  const provenance = Array.from(datasetTypes)
    .map((t) => ({ type: t, ...DATASET_PROVENANCE[t] }))
    .filter((e) => e.name);

  const isYstr = Array.from(datasetTypes).some((t) => t.endsWith("-y"));
  const panelLabel = datasetTypes.size > 0 ? (isYstr ? "Y-STR" : "Autosomal STR") : null;

  // Build full depth map for appendix (all loci if harness provides it, top N otherwise)
  const depthMap = new Map<string, number>();
  if (stats?.top_loci_by_depth) {
    for (const [locus, depth] of stats.top_loci_by_depth) {
      depthMap.set(locus, depth as number);
    }
  }

  let sn = 0;

  // ── COVER PAGE ──────────────────────────────────────────────────────────────
  return (
    <Document
      title={`STRhub Verified — ${report.tool.name} (${slug})`}
      author="STRhub"
      subject="Technical Reproducibility Validation Report"
      producer="STRhub (strhub.app)"
    >
      <Page size="A4" style={s.coverPage}>
        {/* Top teal bar */}
        <View style={{ height: 5, backgroundColor: TEAL }} />

        <View style={{ flex: 1, paddingHorizontal: 50, paddingTop: 44, paddingBottom: 32, flexDirection: "column" }}>

          {/* Brand */}
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
            {logoSrc && <Image style={{ width: 26, height: 26, marginRight: 9 }} src={logoSrc} />}
            <View>
              <Text style={{ fontSize: 13, fontFamily: "Helvetica-Bold", letterSpacing: 0.3 }}>
                <Text style={{ color: BODY }}>STR</Text>
                <Text style={{ color: TEAL }}>hub</Text>
                <Text style={{ fontSize: 9, color: TEAL, letterSpacing: 0.6 }}> VERIFIED</Text>
              </Text>
            </View>
          </View>
          <Text style={{ fontSize: 8.5, color: MUTED, marginBottom: 34 }}>
            Technical Reproducibility Validation Report
          </Text>

          {/* Tool identity */}
          <Text style={{ fontSize: 22, fontFamily: "Helvetica-Bold", color: BODY, lineHeight: 1.2, marginBottom: 5 }}>
            {name}
          </Text>
          {report.tool.version && (
            <Text style={{ fontSize: 10.5, color: MUTED, marginBottom: 3 }}>Version {report.tool.version}</Text>
          )}
          {panelLabel && (
            <Text style={{ fontSize: 9, color: SUBTLE, marginBottom: 24 }}>{panelLabel} panel</Text>
          )}

          {/* Metadata */}
          <View style={{ borderTopWidth: 0.5, borderTopColor: BORDER, paddingTop: 14, marginBottom: 22 }}>
            {([
              ["Verification date", dateStr, false],
              ["Repository commit", ref,      true],
              ["Attestation level", LEVEL_LABEL[report.level], false],
              ["Permalink",        permalink,  false],
            ] as [string, string, boolean][]).map(([label, value, mono]) => (
              <View key={label} style={[s.kv, { marginBottom: 6 }]}>
                <Text style={{ ...s.kl, fontSize: 9, color: SUBTLE }}>{label}</Text>
                {label === "Attestation level" ? (
                  <Text style={{ flex: 1, fontSize: 9, fontFamily: "Helvetica-Bold", color: TEAL }}>{value}</Text>
                ) : label === "Permalink" ? (
                  <Link src={value} style={{ flex: 1 }}>
                    <Text style={{ fontSize: 9, color: LINK }}>{value}</Text>
                  </Link>
                ) : (
                  <Text style={{ flex: 1, fontSize: mono ? 8 : 9, color: BODY,
                    fontFamily: mono ? "Courier" : "Helvetica" }}>
                    {value}
                  </Text>
                )}
              </View>
            ))}
          </View>

          {/* Scope box */}
          <View style={{ backgroundColor: BG, borderRadius: 3, padding: 12, marginBottom: 18 }}>
            <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: BODY,
              letterSpacing: 0.4, textTransform: "uppercase", marginBottom: 5 }}>
              Scope of this report
            </Text>
            <Text style={{ fontSize: 8.5, color: MUTED, lineHeight: 1.55, marginBottom: 5 }}>
              Independent automated verification of reproducible execution — confirms the tool installs,
              runs end-to-end, and produces structurally valid output in a standardized environment.
            </Text>
            <Text style={{ fontSize: 8.5, color: MUTED, lineHeight: 1.55 }}>
              This is not an analytical validation. Genotype accuracy, concordance with truth sets,
              forensic suitability, and regulatory compliance are out of scope.
            </Text>
          </View>

          {/* Two-column checklist */}
          <View style={{ flexDirection: "row", gap: 10 }}>
            {/* Verified — light teal bg, teal dashes */}
            <View style={{ flex: 1, backgroundColor: "#f0fdf9", borderRadius: 3,
              borderWidth: 0.5, borderColor: "#b2e8e0", padding: 10 }}>
              <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: TEAL,
                letterSpacing: 0.3, marginBottom: 7, textTransform: "uppercase" }}>
                What was verified
              </Text>
              {["Source available","Installation successful","End-to-end execution","Output generated"].map((item) => (
                <View key={item} style={{ flexDirection: "row", marginBottom: 3.5 }}>
                  <Text style={{ fontSize: 9, color: TEAL, width: 14 }}>–</Text>
                  <Text style={{ fontSize: 8.5, color: MUTED, flex: 1 }}>{item}</Text>
                </View>
              ))}
            </View>
            {/* Not verified — white bg, gray border, readable gray text */}
            <View style={{ flex: 1, backgroundColor: "#ffffff", borderRadius: 3,
              borderWidth: 0.5, borderColor: BORDER, padding: 10 }}>
              <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: MUTED,
                letterSpacing: 0.3, marginBottom: 7, textTransform: "uppercase" }}>
                Not verified
              </Text>
              {["Genotype accuracy","Concordance","Forensic validity","Regulatory compliance"].map((item) => (
                <View key={item} style={{ flexDirection: "row", marginBottom: 3.5 }}>
                  <Text style={{ fontSize: 9, color: SUBTLE, width: 14 }}>–</Text>
                  <Text style={{ fontSize: 8.5, color: MUTED, flex: 1 }}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={{ flexGrow: 1 }} />

          <Text style={{ fontSize: 7.5, color: SUBTLE, textAlign: "center", marginTop: 12 }}>
            Generated automatically by{" "}
            <Text style={{ color: BODY, fontFamily: "Helvetica-Bold" }}>STR</Text>
            <Text style={{ color: TEAL, fontFamily: "Helvetica-Bold" }}>hub</Text>
            {" · strhub.app · Each result is a dated snapshot verified at a pinned commit."}
          </Text>
        </View>

        {/* Bottom teal bar */}
        <View style={{ height: 5, backgroundColor: TEAL }} />
      </Page>

      {/* ── MAIN REPORT ─────────────────────────────────────────────────────── */}
      <Page size="A4" style={s.page}>

        {/* Running header */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12,
          borderBottomWidth: 0.5, borderBottomColor: BORDER, paddingBottom: 8 }}>
          {logoSrc && <Image style={{ width: 16, height: 16, marginRight: 6 }} src={logoSrc} />}
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 10.5, fontFamily: "Helvetica-Bold", color: BODY }}>{name}</Text>
            <Text style={{ fontSize: 8, color: SUBTLE, marginTop: 1 }}>
              <Text style={{ color: BODY, fontFamily: "Helvetica-Bold" }}>STR</Text>
              <Text style={{ color: TEAL, fontFamily: "Helvetica-Bold" }}>hub</Text>
              {" Verified · Technical Reproducibility Validation Report · "}{dateStr}
            </Text>
          </View>
          <View style={{ backgroundColor: TEAL, borderRadius: 3, paddingHorizontal: 7, paddingVertical: 3 }}>
            <Text style={{ fontSize: 7.5, fontFamily: "Helvetica-Bold", color: "#ffffff", letterSpacing: 0.3 }}>
              {LEVEL_LABEL[report.level]}
            </Text>
          </View>
        </View>

        {/* 1. Executive Summary */}
        <Text style={s.sec}>{++sn}. Executive Summary</Text>
        <View style={{ borderWidth: 0.5, borderColor: BORDER, borderRadius: 3, overflow: "hidden" }}>
          {([
            ["Purpose",          "Verify that the tool installs, runs end-to-end, and produces structurally valid output."],
            ["Result",           `${passed}/${gates.length} gates passed — ${LEVEL_LABEL[report.level]}`],
            ["Attestation level",LEVEL_LABEL[report.level]],
            ["Scope",            "Installation, execution, and output structure verification."],
            ["Not evaluated",    "Genotype accuracy · Concordance · Forensic validity · Regulatory compliance"],
          ] as [string, string][]).map(([label, value], i) => (
            <View key={label} style={{
              flexDirection: "row", paddingVertical: 5, paddingHorizontal: 9,
              backgroundColor: i % 2 === 0 ? BG : "#ffffff",
              borderBottomWidth: i < 4 ? 0.5 : 0, borderBottomColor: BORDER,
            }}>
              <Text style={{ width: 105, fontSize: 8, fontFamily: "Helvetica-Bold",
                color: SUBTLE, textTransform: "uppercase", letterSpacing: 0.3 }}>
                {label}
              </Text>
              <Text style={{ flex: 1, fontSize: 8.5, lineHeight: 1.35,
                color: (label === "Result" || label === "Attestation level") ? TEAL : BODY,
                fontFamily: (label === "Result" || label === "Attestation level") ? "Helvetica-Bold" : "Helvetica",
              }}>
                {value}
              </Text>
            </View>
          ))}
        </View>

        {/* 2. Reproducibility Metadata */}
        <Text style={s.sec}>{++sn}. Reproducibility Metadata</Text>
        <Kv label="Tool">
          <Text style={{ fontSize: 8.5, fontFamily: "Helvetica-Bold", color: BODY }}>{name}</Text>
        </Kv>
        {report.tool.version && <Kv label="Version"><Text style={s.kv2}>{report.tool.version}</Text></Kv>}
        {report.tool.maintainer && <Kv label="Maintainer"><Text style={s.kv2}>{report.tool.maintainer}</Text></Kv>}
        <Kv label="Repository">
          <Link src={report.source.repo}>
            <Text style={{ fontSize: 8.5, color: LINK }}>{report.source.repo}</Text>
          </Link>
        </Kv>
        <Kv label="Commit (pinned)">
          <Text style={{ fontSize: 8, color: MUTED, fontFamily: "Courier" }}>{ref}</Text>
        </Kv>
        {report.environment?.os && (
          <Kv label="Container OS"><Text style={s.kv2}>{report.environment.os.join(", ")}</Text></Kv>
        )}
        {panelLabel && <Kv label="Marker panel"><Text style={s.kv2}>{panelLabel}</Text></Kv>}
        <Kv label="Verified on">
          <Text style={s.kv2}>{report.generated?.slice(0, 19).replace("T", " ")} UTC</Text>
        </Kv>
        {report.ci_run && (
          <Kv label="CI run">
            <Link src={report.ci_run}>
              <Text style={{ fontSize: 8.5, color: LINK }}>{report.ci_run}</Text>
            </Link>
          </Kv>
        )}

        {/* 3. Verification Gates */}
        <View wrap={false}>
          <Text style={s.sec}>{++sn}. Verification Gates</Text>
          {gates.map((key, i) => {
            const pass = report.gates?.[key];
            return (
              <View key={key} style={[s.tr, i % 2 === 0 ? s.trAlt : {}]}>
                <Text style={{ width: 115, fontSize: 8.5, fontFamily: "Helvetica-Bold", color: BODY }}>
                  {GATE_NAME[key]}
                </Text>
                <Text style={{ flex: 1, fontSize: 8.5, color: MUTED }}>{GATE_DESC[key]}</Text>
                <Text style={{ width: 32, fontSize: 8.5, textAlign: "right",
                  fontFamily: pass ? "Helvetica-Bold" : "Helvetica",
                  color: pass ? TEAL : SUBTLE }}>
                  {pass ? "PASS" : "—"}
                </Text>
              </View>
            );
          })}
          {report.logs && (() => {
            const vis = Object.entries(report.logs).filter(([leg]) =>
              report.datasets?.find((d) => d.leg === leg)?.fixture_source !== "strhub"
            );
            if (!vis.length) return null;
            return (
              <View style={{ marginTop: 4 }}>
                {vis.map(([leg, fname]) => (
                  <Kv key={leg} label="Execution log">
                    <Link src={`https://raw.githubusercontent.com/Tfronta/strhub-verified/gh-pages/${fname}`}>
                      <Text style={{ fontSize: 8, color: LINK }}>{fname}</Text>
                    </Link>
                  </Kv>
                ))}
              </View>
            );
          })()}
        </View>

        {/* 4. Out of Scope */}
        <View wrap={false}>
          <Text style={s.sec}>{++sn}. Out of Scope</Text>
          <Text style={{ fontSize: 8.5, color: MUTED, marginBottom: 5, lineHeight: 1.4 }}>
            This report does not evaluate any of the following:
          </Text>
          <BulletList items={OUT_OF_SCOPE} />
        </View>

        {/* 5. Auto-diagnostics (warning/error only) */}
        {actionable.length > 0 && (
          <View wrap={false}>
            <Text style={s.sec}>{++sn}. Auto-diagnostics</Text>
            {actionable.map((issue) => (
              <View key={issue.id} style={{
                ...s.box,
                backgroundColor: issue.severity === "error" ? "#fef2f2" : "#fffbeb",
                marginBottom: 4,
              }}>
                <Text style={{ fontSize: 8.5, fontFamily: "Helvetica-Bold", color: BODY }}>
                  [{issue.severity.toUpperCase()}] {issue.title}
                </Text>
                {issue.suggestion && (
                  <Text style={{ fontSize: 8, color: MUTED, marginTop: 2, lineHeight: 1.4 }}>
                    {issue.suggestion}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Output Content Evidence */}
        {stats && (
          <View wrap={false}>
            <Text style={s.sec}>{++sn}. Output Content Evidence</Text>
            {ioOut?.resolved && (
              <Kv label="Output file">
                <Text style={{ fontSize: 8, color: MUTED, fontFamily: "Courier" }}>{ioOut.resolved}</Text>
              </Kv>
            )}
            {ioOut?.format && (
              <Kv label="Format"><Text style={s.kv2}>{ioOut.format.toUpperCase()}</Text></Kv>
            )}
            <Kv label="Sequence records"><Text style={s.kv2}>{stats.rows ?? 0}</Text></Kv>
            <Kv label="Distinct STR loci">
              <Text style={s.kv2}>{stats.distinct_str_loci ?? stats.distinct_loci ?? 0}</Text>
            </Kv>
            {(stats.distinct_snp_markers ?? 0) > 0 && (
              <Kv label="Identity SNPs"><Text style={s.kv2}>{stats.distinct_snp_markers}</Text></Kv>
            )}
            <Kv label="Total reads"><Text style={s.kv2}>{stats.total_reads ?? 0}</Text></Kv>
            <Kv label="Max depth (single locus)">
              <Text style={s.kv2}>{stats.max_sequence_depth ?? "N/A"}</Text>
            </Kv>
          </View>
        )}

        {/* Verification Data */}
        {provenance.length > 0 && (
          <View wrap={false}>
            <Text style={s.sec}>{++sn}. Verification Data</Text>
            {hasStrhubFixture && (
              <View style={{ ...s.box, marginBottom: 6 }}>
                <Text style={{ fontSize: 8.5, color: MUTED, lineHeight: 1.5, fontStyle: "italic" }}>
                  This tool does not include its own demo or test data. STRhub ran the verification
                  using the public reference dataset listed below for both legs.
                </Text>
              </View>
            )}
            {provenance.map((ds) => (
              <View key={ds.type} style={{ ...s.box, marginBottom: 5 }}>
                <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: BODY, marginBottom: 5 }}>
                  {ds.name}
                </Text>
                <Kv label="Source">
                  <Link src={ds.source}>
                    <Text style={{ fontSize: 8, color: LINK }}>{ds.source}</Text>
                  </Link>
                </Kv>
                {ds.doi && (
                  <Kv label="DOI">
                    <Link src={`https://doi.org/${ds.doi}`}>
                      <Text style={{ fontSize: 8, color: LINK }}>{ds.doi}</Text>
                    </Link>
                  </Kv>
                )}
                <Kv label="License">
                  <Text style={{ fontSize: 8.5, color: MUTED }}>{ds.license}</Text>
                </Kv>
                {ds.referenceGenome && (
                  <Kv label="Ref. genome">
                    <Text style={{ fontSize: 8.5, color: MUTED }}>
                      {ds.referenceGenome.assembly}  ({ds.referenceGenome.mountPath})
                    </Text>
                  </Kv>
                )}
                <Kv label="Loci tested">
                  <Text style={{ fontSize: 8.5, color: MUTED }}>{ds.loci.length} forensic STR loci</Text>
                </Kv>
                <Text style={{ fontSize: 7.5, color: SUBTLE, marginTop: 3, lineHeight: 1.4 }}>
                  {ds.loci.join("  ·  ")}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Verification Matrix */}
        {visibleLegs.length > 0 && (
          <View wrap={false}>
            <Text style={s.sec}>{++sn}. Verification Matrix</Text>
            {visibleLegs.map((leg, i) => {
              const state = !leg.available ? "N/A" : leg.passed ? "PASS" : "FAIL";
              return (
                <View key={leg.leg} style={[s.tr, i % 2 === 0 ? s.trAlt : {}]}>
                  <Text style={{ width: 36, fontSize: 8.5,
                    fontFamily: state === "PASS" ? "Helvetica-Bold" : "Helvetica",
                    color: state === "PASS" ? TEAL : SUBTLE }}>
                    {state}
                  </Text>
                  <Text style={{ width: 100, fontSize: 8.5, fontFamily: "Helvetica-Bold", color: BODY }}>
                    {leg.leg === "own" ? "Tool test data" : "Reference dataset"}
                  </Text>
                  <Text style={{ flex: 1, fontSize: 8, color: MUTED }}>{leg.dataset ?? "—"}</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* README check */}
        {report.readme_check && (
          <View wrap={false}>
            <Text style={{ fontSize: 8.5, fontFamily: "Helvetica-Bold", color: BODY, marginTop: 10, marginBottom: 4 }}>
              README check (advisory — {report.readme_check.score}/{report.readme_check.max})
            </Text>
            {Object.entries(README_ITEMS).map(([key, label]) => {
              const present = report.readme_check?.checks?.[key]?.present;
              return (
                <View key={key} style={s.kv}>
                  <Text style={{ ...s.kl, width: 158 }}>{label}</Text>
                  <Text style={{ fontSize: 8.5, color: present ? TEAL : SUBTLE,
                    fontFamily: present ? "Helvetica-Bold" : "Helvetica" }}>
                    {present ? "Present" : "Missing"}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Limitations */}
        <View wrap={false}>
          <Text style={s.sec}>{++sn}. Limitations</Text>
          <BulletList items={LIMITATIONS} />
        </View>

        {/* Scope and Disclaimers */}
        <View wrap={false}>
          <Text style={s.sec}>{++sn}. Scope and Disclaimers</Text>
          <View style={s.box}>
            <Text style={{ fontSize: 8.5, color: MUTED, lineHeight: 1.5 }}>{report.scope}</Text>
          </View>
          <Text style={{ fontSize: 8, color: SUBTLE, marginTop: 4, lineHeight: 1.4 }}>
            Each result is a dated snapshot, verified on the tool's public repository at a pinned commit.
            STRhub does not store tool source code.
          </Text>
        </View>

        <Footer dateStr={dateStr} permalink={permalink} />
      </Page>

      {/* ── APPENDIX: detected markers with read depth ───────────────────── */}
      {stats && (stats.str_loci?.length ?? 0) > 0 && (
        <Page size="A4" style={s.page}>
          <Text style={{ fontSize: 13, fontFamily: "Helvetica-Bold", color: BODY }}>
            Appendix — Detected Markers with Read Depth
          </Text>
          <Text style={{ fontSize: 8.5, color: SUBTLE, marginTop: 3, marginBottom: 14 }}>
            {name} ({slug}) · verified {dateStr} ·{" "}
            <Text style={{ color: BODY, fontFamily: "Helvetica-Bold" }}>STR</Text>
            <Text style={{ color: TEAL, fontFamily: "Helvetica-Bold" }}>hub</Text>
          </Text>

          {/* Loci table with depth */}
          {stats.str_loci && stats.str_loci.length > 0 && (() => {
            // Sort: depth desc for those with depth, then alphabetically
            const withDepth = stats.str_loci!
              .map((l) => ({ locus: l, depth: depthMap.get(l) ?? null }))
              .sort((a, b) => {
                if (a.depth !== null && b.depth !== null) return b.depth - a.depth;
                if (a.depth !== null) return -1;
                if (b.depth !== null) return 1;
                return a.locus.localeCompare(b.locus);
              });
            const hasAnyDepth = withDepth.some((r) => r.depth !== null);
            return (
              <>
                <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: BODY, marginBottom: 5 }}>
                  STR Loci ({stats.str_loci!.length})
                  {hasAnyDepth ? " — sorted by read depth" : ""}
                </Text>
                {/* Header row */}
                <View style={{ flexDirection: "row", paddingVertical: 4, paddingHorizontal: 6,
                  borderBottomWidth: 1, borderBottomColor: BORDER, backgroundColor: BG }}>
                  <Text style={{ flex: 1, fontSize: 8, fontFamily: "Helvetica-Bold", color: MUTED, textTransform: "uppercase", letterSpacing: 0.3 }}>
                    Locus
                  </Text>
                  {hasAnyDepth && (
                    <Text style={{ width: 70, fontSize: 8, fontFamily: "Helvetica-Bold", color: MUTED,
                      textTransform: "uppercase", letterSpacing: 0.3, textAlign: "right" }}>
                      Read depth
                    </Text>
                  )}
                </View>
                {withDepth.map(({ locus, depth }, i) => (
                  <View key={locus} style={[
                    { flexDirection: "row", paddingVertical: 3.5, paddingHorizontal: 6,
                      borderBottomWidth: 0.5, borderBottomColor: BORDER },
                    i % 2 === 0 ? s.trAlt : {},
                  ]}>
                    <Text style={{ flex: 1, fontSize: 8.5, color: BODY }}>{locus}</Text>
                    {hasAnyDepth && (
                      <Text style={{ width: 70, fontSize: 8.5, color: depth !== null ? BODY : SUBTLE,
                        textAlign: "right" }}>
                        {depth !== null ? String(depth) : "—"}
                      </Text>
                    )}
                  </View>
                ))}
                {!hasAnyDepth && (
                  <Text style={{ fontSize: 8, color: SUBTLE, marginTop: 5, fontStyle: "italic" }}>
                    Read depth per locus not available in this report version.
                  </Text>
                )}
              </>
            );
          })()}

          {/* SNP markers (if any) */}
          {stats.snp_markers && stats.snp_markers.length > 0 && (
            <>
              <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: BODY, marginTop: 14, marginBottom: 5 }}>
                Identity SNP Markers ({stats.snp_markers.length})
              </Text>
              <View style={s.lociGrid}>
                {stats.snp_markers.map((m) => (
                  <Text key={m} style={{ fontSize: 7.5, color: MUTED, width: "20%", marginBottom: 1.5 }}>{m}</Text>
                ))}
              </View>
            </>
          )}

          <Footer dateStr={dateStr} permalink={permalink} />
        </Page>
      )}
    </Document>
  );
}

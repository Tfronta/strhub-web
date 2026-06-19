"use client";

import {
  Document,
  Page,
  Text,
  View,
  Image,
  Link,
  StyleSheet,
} from "@react-pdf/renderer";
import type { VerifiedReport, VerifiedLevel } from "@/types/verified";

const TEAL = "#0099a3";
const BODY = "#333";
const SECONDARY = "#555";
const SUBTLE = "#888";
const LINK = "#666";
const BORDER = "#d0d0d0";
const BG_LIGHT = "#f5f5f5";

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
  },
  "illumina-bam-hg38": {
    name: "1000 Genomes Illumina 30x — hg38 CODIS slice",
    source:
      "https://www.internationalgenome.org/data-portal/data-collection/30x-grch38",
    license: "Open access (1000 Genomes). Research use.",
    loci: CODIS_CORE_LOCI,
  },
};

const LEGACY_SLUG_DATASETS: Record<string, string[]> = {
  "strait-razor-ForenSeqv1.27": ["illumina-str-fastq"],
};

const s = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 50,
    paddingHorizontal: 45,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: BODY,
  },
  footer: {
    position: "absolute",
    bottom: 25,
    left: 45,
    right: 45,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7,
    color: SUBTLE,
  },

  // Header
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  logo: { width: 32, height: 32, marginRight: 10 },
  headerTitle: { fontSize: 16, fontFamily: "Helvetica-Bold", color: TEAL },
  headerSub: { fontSize: 10, color: SECONDARY, marginTop: 2 },
  headerMeta: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    fontSize: 8,
    color: SECONDARY,
  },

  // Sections
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: TEAL,
    marginTop: 18,
    marginBottom: 6,
    paddingBottom: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },

  // Tables
  tableHeader: {
    flexDirection: "row",
    backgroundColor: TEAL,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  tableHeaderText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    color: "#fff",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },
  tableRowAlt: {
    backgroundColor: BG_LIGHT,
  },

  // Key-value rows
  kvRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  kvLabel: {
    width: 140,
    fontSize: 8,
    color: SUBTLE,
    fontFamily: "Helvetica-Bold",
  },
  kvValue: { flex: 1, fontSize: 8, color: BODY },
  kvMono: { flex: 1, fontSize: 7.5, color: SECONDARY },

  // Scope block
  scopeBox: {
    marginTop: 4,
    padding: 10,
    backgroundColor: BG_LIGHT,
    borderLeftWidth: 3,
    borderLeftColor: TEAL,
  },
  scopeText: { fontSize: 8, color: SECONDARY, lineHeight: 1.5 },

  // Disclaimer
  disclaimerBlock: { marginTop: 10 },
  disclaimerItem: {
    fontSize: 7.5,
    color: SECONDARY,
    marginBottom: 3,
    lineHeight: 1.4,
  },

  // Appendix
  appendixTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: TEAL,
    marginTop: 8,
    marginBottom: 4,
  },
  lociGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  lociItem: {
    fontSize: 7,
    color: SECONDARY,
    width: "25%",
    marginBottom: 1,
  },
  snpItem: {
    fontSize: 6.5,
    color: SECONDARY,
    width: "20%",
    marginBottom: 1,
  },

  // Level badge (text)
  levelBadge: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: TEAL,
    marginTop: 6,
  },

  // Dataset provenance
  datasetBox: {
    marginTop: 4,
    marginBottom: 4,
    padding: 8,
    backgroundColor: BG_LIGHT,
    borderLeftWidth: 2,
    borderLeftColor: BORDER,
  },
  datasetName: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: BODY,
    marginBottom: 2,
  },
  datasetMeta: { fontSize: 7.5, color: SECONDARY, marginBottom: 1 },
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

function sectionNumber(
  hasStats: boolean,
  hasProvenance: boolean,
  hasDatasets: boolean,
  base: "data" | "matrix" | "scope"
): number {
  let n = 3;
  if (hasStats) n++;
  if (base === "data") return n;
  if (hasProvenance) n++;
  if (base === "matrix") return n;
  if (hasDatasets) n++;
  return n;
}

interface Props {
  report: VerifiedReport;
  slug: string;
  logoSrc?: string;
}

export function VerifiedPDF({ report, slug, logoSrc }: Props) {
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

  const gateOrder = [
    "available",
    "installs",
    "runs",
    "io",
    "content",
  ] as const;

  const hasStats = !!stats;
  const hasDatasets = !!(report.datasets && report.datasets.length > 0);

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

  return (
    <Document
      title={`STRhub Verified — ${report.tool.name} (${slug})`}
      author="STRhub"
      subject="Reproducible-execution attestation"
      producer="STRhub (strhub.app)"
    >
      {/* Page 1: Main report */}
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.headerRow}>
          {logoSrc && <Image style={s.logo} src={logoSrc} />}
          <View>
            <Text style={s.headerTitle}>STRhub Verified</Text>
            <Text style={s.headerSub}>
              Reproducible-Execution Attestation Report
            </Text>
          </View>
        </View>

        <View style={s.headerMeta}>
          <View style={s.kvRow}>
            <Text style={s.kvLabel}>Report date</Text>
            <Text style={s.kvValue}>
              {report.generated?.slice(0, 19).replace("T", " ")} UTC
            </Text>
          </View>
          <View style={s.kvRow}>
            <Text style={s.kvLabel}>Report identifier</Text>
            <Text style={s.kvMono}>{slug}</Text>
          </View>
          <View style={s.kvRow}>
            <Text style={s.kvLabel}>Permalink</Text>
            <Link src={permalink}>
              <Text style={{ ...s.kvValue, color: LINK }}>{permalink}</Text>
            </Link>
          </View>
        </View>

        {/* Section: Tool */}
        <Text style={s.sectionTitle}>1. Tool Under Verification</Text>
        <View style={s.kvRow}>
          <Text style={s.kvLabel}>Tool name</Text>
          <Text style={s.kvValue}>{report.tool.name}</Text>
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
        {report.tool.contact && (
          <View style={s.kvRow}>
            <Text style={s.kvLabel}>Contact</Text>
            <Link src={report.tool.contact}>
              <Text style={{ ...s.kvValue, color: LINK }}>
                {report.tool.contact}
              </Text>
            </Link>
          </View>
        )}
        <View style={s.kvRow}>
          <Text style={s.kvLabel}>Source repository</Text>
          <Link src={report.source.repo}>
            <Text style={{ ...s.kvValue, color: LINK }}>
              {report.source.repo}
            </Text>
          </Link>
        </View>
        <View style={s.kvRow}>
          <Text style={s.kvLabel}>Pinned commit</Text>
          <Text style={s.kvMono}>{ref}</Text>
        </View>
        {report.environment?.os && (
          <View style={s.kvRow}>
            <Text style={s.kvLabel}>Environment</Text>
            <Text style={s.kvValue}>
              {report.environment.os.join(", ")}
            </Text>
          </View>
        )}

        {/* Section: Gates */}
        <Text style={s.sectionTitle}>2. Verification Gates</Text>
        <View style={s.tableHeader}>
          <Text style={{ ...s.tableHeaderText, width: 90 }}>Gate</Text>
          <Text style={{ ...s.tableHeaderText, width: 50 }}>Result</Text>
          <Text style={{ ...s.tableHeaderText, flex: 1 }}>Description</Text>
        </View>
        {gateOrder.map((key, i) => {
          const pass = report.gates?.[key];
          return (
            <View
              key={key}
              style={[s.tableRow, i % 2 === 1 ? s.tableRowAlt : {}]}
            >
              <Text
                style={{
                  width: 90,
                  fontSize: 8,
                  fontFamily: "Helvetica-Bold",
                }}
              >
                {GATE_NAMES[key]}
              </Text>
              <Text
                style={{
                  width: 50,
                  fontSize: 8,
                  fontFamily: "Helvetica-Bold",
                }}
              >
                {pass ? "PASS" : "FAIL"}
              </Text>
              <Text style={{ flex: 1, fontSize: 8, color: SECONDARY }}>
                {GATE_LABELS[key]}
              </Text>
            </View>
          );
        })}
        <Text style={s.levelBadge}>
          Overall attestation level: {LEVEL_LABELS[report.level]}
        </Text>

        {/* Section: Output evidence */}
        {stats && (
          <>
            <Text style={s.sectionTitle}>3. Output Content Evidence</Text>
            {ioOut && (
              <>
                <View style={s.kvRow}>
                  <Text style={s.kvLabel}>Output file</Text>
                  <Text style={s.kvMono}>{ioOut.resolved ?? "N/A"}</Text>
                </View>
                <View style={s.kvRow}>
                  <Text style={s.kvLabel}>Format</Text>
                  <Text style={s.kvValue}>
                    {(ioOut.format ?? "N/A").toUpperCase()}
                  </Text>
                </View>
              </>
            )}
            <View style={s.kvRow}>
              <Text style={s.kvLabel}>Sequence records</Text>
              <Text style={s.kvValue}>{stats.rows ?? 0}</Text>
            </View>
            <View style={s.kvRow}>
              <Text style={s.kvLabel}>Distinct STR loci</Text>
              <Text style={s.kvValue}>
                {stats.distinct_str_loci ?? stats.distinct_loci ?? 0}
              </Text>
            </View>
            {(stats.distinct_snp_markers ?? 0) > 0 && (
              <View style={s.kvRow}>
                <Text style={s.kvLabel}>Identity SNP markers</Text>
                <Text style={s.kvValue}>{stats.distinct_snp_markers}</Text>
              </View>
            )}
            <View style={s.kvRow}>
              <Text style={s.kvLabel}>Total reads across calls</Text>
              <Text style={s.kvValue}>{stats.total_reads ?? 0}</Text>
            </View>
            {stats.max_sequence_depth != null && (
              <View style={s.kvRow}>
                <Text style={s.kvLabel}>Max sequence depth</Text>
                <Text style={s.kvValue}>{stats.max_sequence_depth}</Text>
              </View>
            )}

            {stats.top_loci_by_depth &&
              stats.top_loci_by_depth.length > 0 && (
                <>
                  <Text
                    style={{
                      fontSize: 8,
                      fontFamily: "Helvetica-Bold",
                      color: SECONDARY,
                      marginTop: 8,
                      marginBottom: 3,
                    }}
                  >
                    Top loci by read depth
                  </Text>
                  <View style={s.tableHeader}>
                    <Text style={{ ...s.tableHeaderText, flex: 1 }}>
                      Locus
                    </Text>
                    <Text
                      style={{
                        ...s.tableHeaderText,
                        width: 80,
                        textAlign: "right",
                      }}
                    >
                      Reads
                    </Text>
                  </View>
                  {stats.top_loci_by_depth.map(([locus, depth], i) => (
                    <View
                      key={locus}
                      style={[
                        s.tableRow,
                        i % 2 === 1 ? s.tableRowAlt : {},
                      ]}
                    >
                      <Text style={{ flex: 1, fontSize: 8, color: BODY }}>
                        {locus}
                      </Text>
                      <Text
                        style={{
                          width: 80,
                          fontSize: 8,
                          textAlign: "right",
                        }}
                      >
                        {depth}
                      </Text>
                    </View>
                  ))}
                </>
              )}
          </>
        )}

        {/* Section: Verification Data (provenance) */}
        {provenanceEntries.length > 0 && (
          <>
            <Text style={s.sectionTitle}>
              {sectionNumber(hasStats, hasProvenance, hasDatasets, "data")}. Verification Data
            </Text>
            <Text style={{ fontSize: 8, color: SECONDARY, marginBottom: 6 }}>
              The following reference datasets were used as input for this
              verification run. STRhub is not the data provider; see upstream
              sources for terms of use.
            </Text>
            {provenanceEntries.map((ds) => (
              <View key={ds.type} style={s.datasetBox}>
                <Text style={s.datasetName}>{ds.name}</Text>
                <View style={s.kvRow}>
                  <Text style={{ ...s.kvLabel, width: 60 }}>Source</Text>
                  <Link src={ds.source}>
                    <Text style={{ fontSize: 7.5, color: LINK }}>
                      {ds.source}
                    </Text>
                  </Link>
                </View>
                {ds.doi && (
                  <View style={s.kvRow}>
                    <Text style={{ ...s.kvLabel, width: 60 }}>DOI</Text>
                    <Link src={`https://doi.org/${ds.doi}`}>
                      <Text style={{ fontSize: 7.5, color: LINK }}>
                        {ds.doi}
                      </Text>
                    </Link>
                  </View>
                )}
                <View style={s.kvRow}>
                  <Text style={{ ...s.kvLabel, width: 60 }}>License</Text>
                  <Text style={s.datasetMeta}>{ds.license}</Text>
                </View>
                <View style={{ ...s.kvRow, marginTop: 2 }}>
                  <Text style={{ ...s.kvLabel, width: 60 }}>Loci tested</Text>
                  <Text style={s.datasetMeta}>
                    {ds.loci.length} forensic STR loci
                  </Text>
                </View>
                <Text style={{ fontSize: 6.5, color: SUBTLE, marginTop: 1 }}>
                  {ds.loci.join(", ")}
                </Text>
              </View>
            ))}
            <Text
              style={{
                fontSize: 7.5,
                color: SECONDARY,
                fontStyle: "italic",
                marginTop: 4,
              }}
            >
              This verification only covers the specific STR loci listed above.
              The tool may support additional loci not tested by this reference
              dataset.
            </Text>
          </>
        )}

        {/* Section: Matrix (Fase 3) */}
        {hasDatasets && (
          <>
            <Text style={s.sectionTitle}>
              {sectionNumber(hasStats, hasProvenance, hasDatasets, "matrix")}. Verification
              Matrix
            </Text>
            <View style={s.tableHeader}>
              <Text style={{ ...s.tableHeaderText, width: 100 }}>
                Data source
              </Text>
              <Text style={{ ...s.tableHeaderText, width: 50 }}>Result</Text>
              <Text style={{ ...s.tableHeaderText, flex: 1 }}>Dataset</Text>
            </View>
            {report.datasets!.map((leg, i) => {
              const state = !leg.available
                ? "N/A"
                : leg.passed
                  ? "PASS"
                  : "FAIL";
              return (
                <View
                  key={leg.leg}
                  style={[s.tableRow, i % 2 === 1 ? s.tableRowAlt : {}]}
                >
                  <Text
                    style={{
                      width: 100,
                      fontSize: 8,
                      fontFamily: "Helvetica-Bold",
                    }}
                  >
                    {leg.leg === "own" ? "Author's data" : "External data"}
                  </Text>
                  <Text
                    style={{
                      width: 50,
                      fontSize: 8,
                      fontFamily: "Helvetica-Bold",
                    }}
                  >
                    {state}
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 7.5,
                      color: SECONDARY,
                    }}
                  >
                    {leg.dataset ?? "--"}
                  </Text>
                </View>
              );
            })}
          </>
        )}

        {/* README check */}
        {report.readme_check && (
          <>
            <Text
              style={{
                fontSize: 8,
                fontFamily: "Helvetica-Bold",
                color: SECONDARY,
                marginTop: 10,
                marginBottom: 3,
              }}
            >
              README minimum-to-run check (advisory,{" "}
              {report.readme_check.score}/{report.readme_check.max})
            </Text>
            {Object.entries(README_ITEMS).map(([key, label]) => {
              const present = report.readme_check?.checks?.[key]?.present;
              return (
                <View key={key} style={s.kvRow}>
                  <Text style={{ ...s.kvLabel, width: 180 }}>{label}</Text>
                  <Text
                    style={{ fontSize: 8, fontFamily: "Helvetica-Bold" }}
                  >
                    {present ? "Present" : "Missing"}
                  </Text>
                </View>
              );
            })}
          </>
        )}

        {/* Section: Scope & Disclaimers */}
        <Text style={s.sectionTitle}>
          {sectionNumber(hasStats, hasProvenance, hasDatasets, "scope")}. Scope and
          Disclaimers
        </Text>
        <View style={s.scopeBox}>
          <Text style={s.scopeText}>{report.scope}</Text>
        </View>

        <View style={s.disclaimerBlock}>
          <Text style={s.disclaimerItem}>
            This attestation concerns reproducible execution only. It is not
            a claim that the genotypes produced are correct, nor that the tool
            is fit for casework or meets any regulatory standard.
          </Text>
          <Text style={s.disclaimerItem}>
            Concordance against known truth is out of scope. The verification
            checks that the tool installs, runs end-to-end, and produces
            output whose structure is plausible for genotype-bearing data.
          </Text>
          <Text style={s.disclaimerItem}>
            Each result is a dated snapshot, verified on the tool's public
            repository at a pinned commit. The tool author may close the
            repository after verification. STRhub does not store tool source
            code.
          </Text>
          {report.ci_run && (
            <View style={s.kvRow}>
              <Text style={s.kvLabel}>CI run</Text>
              <Link src={report.ci_run}>
                <Text style={{ fontSize: 7.5, color: LINK }}>
                  {report.ci_run}
                </Text>
              </Link>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={s.footer} fixed>
          <Text>
            Generated by STRhub (strhub.app) -- This document was produced
            automatically from verification data.
          </Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
          />
        </View>
      </Page>

      {/* Page 2+: Appendix — full loci lists */}
      {stats &&
        ((stats.str_loci && stats.str_loci.length > 0) ||
          (stats.snp_markers && stats.snp_markers.length > 0)) && (
          <Page size="A4" style={s.page}>
            <Text style={s.headerTitle}>Appendix — Detected Markers</Text>
            <Text
              style={{
                fontSize: 8,
                color: SECONDARY,
                marginTop: 4,
                marginBottom: 4,
              }}
            >
              {report.tool.name} ({slug}) -- verified {dateStr}
            </Text>

            {stats.str_loci && stats.str_loci.length > 0 && (
              <>
                <Text style={s.appendixTitle}>
                  STR Loci ({stats.str_loci.length})
                </Text>
                <View style={s.lociGrid}>
                  {stats.str_loci.map((l) => (
                    <Text key={l} style={s.lociItem}>
                      {l}
                    </Text>
                  ))}
                </View>
              </>
            )}

            {stats.snp_markers && stats.snp_markers.length > 0 && (
              <>
                <Text style={s.appendixTitle}>
                  Identity SNP Markers ({stats.snp_markers.length})
                </Text>
                <View style={s.lociGrid}>
                  {stats.snp_markers.map((m) => (
                    <Text key={m} style={s.snpItem}>
                      {m}
                    </Text>
                  ))}
                </View>
              </>
            )}

            <View style={s.footer} fixed>
              <Text>
                Generated by STRhub (strhub.app) -- This document was
                produced automatically from verification data.
              </Text>
              <Text
                render={({ pageNumber, totalPages }) =>
                  `${pageNumber} / ${totalPages}`
                }
              />
            </View>
          </Page>
        )}
    </Document>
  );
}

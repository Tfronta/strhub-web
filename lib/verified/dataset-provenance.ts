/**
 * What STRhub's reference datasets are, so a report can name what a tool was
 * run on.
 *
 * A verification run reads the tool's input type off its manifest and STRhub
 * supplies the sample; the report then has to say which sample, where it comes
 * from, under what licence, and which loci it covers — because "plausible
 * output" means "names loci this sample contains", and a reader checking that
 * claim needs the list. Lived inside the catalogue page until the trial report
 * needed the same table.
 */
import type { VerifiedReport } from "@/types/verified";

// Mirrors datasets/{ont-bam-hg38,ont-fastq,pacbio-hifi-bam-hg38}/loci.bed: the
// Illumina panel loci inside the CODIS ±10 kb windows the long-read slices
// were cut with (the ONT FASTQ holds the reads over those loci). It used to be a general CODIS list naming five loci (SE33,
// PentaD, PentaE, D17S1301, D20S482) the ONT slice does not hold. Source of
// truth is those BEDs; keep in sync.
const CODIS_SLICE_PANEL_LOCI = [
  "D1S1656", "TPOX", "D2S441", "D2S1338", "D3S1358", "FGA", "D5S818",
  "CSF1PO", "D7S820", "D8S1179", "D10S1248", "TH01", "vWA", "D12S391",
  "D13S317", "D16S539", "D18S51", "D19S433", "D21S11", "D22S1045",
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

export interface DatasetProvenance {
  name: string;
  source: string;
  doi?: string;
  license: string;
  loci: string[];
  referenceGenome?: { assembly: string; mountPath: string };
}

export const DATASET_PROVENANCE: Record<string, DatasetProvenance> = {
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
    loci: CODIS_SLICE_PANEL_LOCI,
    referenceGenome: { assembly: "GRCh38 / hg38", mountPath: "/data/ref/hg38.fa" },
  },
  "ont-fastq": {
    name: "1000 Genomes ONT, HG00113 reads over the CODIS panel loci (FASTQ)",
    source:
      "https://s3.amazonaws.com/1000g-ont/index.html?prefix=PROCESSED_DATA/ALIGNED_TO_HG38/MINIMAP2_ALIGNED_BAMS/",
    license: "Open access (1000 Genomes / HPRC). Research use.",
    loci: CODIS_SLICE_PANEL_LOCI,
    referenceGenome: { assembly: "GRCh38 / hg38", mountPath: "/data/ref/hg38.fa" },
  },
  "pacbio-hifi-bam-hg38": {
    name: "GIAB HG002 PacBio HiFi (Revio), hg38 CODIS slice",
    source:
      "https://ftp-trace.ncbi.nlm.nih.gov/ReferenceSamples/giab/data/AshkenazimTrio/HG002_NA24385_son/PacBio_HiFi-Revio_20231031/",
    license: "Open access (GIAB / NIST). Research use.",
    loci: CODIS_SLICE_PANEL_LOCI,
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

/** Reports written before `datasets` existed: the input type, by slug. */
const LEGACY_SLUG_DATASETS: Record<string, string[]> = {
  "strait-razor-ForenSeqv1.27": ["illumina-str-fastq"],
};

export type PanelKind = "ystr" | "ont" | "hifi" | "autosomal";

/**
 * Which panel family a run's input types belong to, for its tag. The one place
 * this is decided: the catalogue list, the history rows and the report header
 * each had a copy, and the list's never learned ONT, so nanopore runs were
 * listed as "Autosomal STR" while their pages said "ONT CODIS".
 */
export function panelKind(types: string[] | null | undefined): PanelKind | null {
  if (!types || types.length === 0) return null;
  if (types.some((dt) => dt.endsWith("-y"))) return "ystr";
  if (types.some((dt) => dt.startsWith("ont-"))) return "ont";
  if (types.some((dt) => dt.startsWith("pacbio-"))) return "hifi";
  return "autosomal";
}

export interface DatasetSummary {
  /** Input types across every leg of the run. */
  types: string[];
  /** Which panel family the run belongs to, for the header tag. */
  panel: PanelKind | null;
  /** Provenance for each type STRhub knows, in leg order. */
  provenance: (DatasetProvenance & { type: string })[];
  /** A leg ran on a sample STRhub supplied in place of the tool's own. */
  hasStrhubFixture: boolean;
}

/** What a run was fed, read off the report (or, for old reports, the slug). */
export function summarizeDatasets(report: VerifiedReport, slug: string): DatasetSummary {
  const types: string[] = [];
  if (report.datasets) {
    for (const leg of report.datasets) {
      if (leg.type && !types.includes(leg.type)) types.push(leg.type);
    }
  } else if (LEGACY_SLUG_DATASETS[slug]) {
    types.push(...LEGACY_SLUG_DATASETS[slug]);
  }

  const panel = panelKind(types);

  const provenance = types
    .map((type) => ({ type, ...DATASET_PROVENANCE[type] }))
    .filter((e) => e.name);

  const hasStrhubFixture = report.datasets?.some((d) => d.fixture_source === "strhub") ?? false;

  return { types, panel, provenance, hasStrhubFixture };
}

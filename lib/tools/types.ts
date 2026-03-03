// Canonical types for tools catalog and marker Tools tab.
// ToolCard = master list (UI catalog). ToolDetails = optional extended metadata.

export type TechnologyKey =
  | "illumina"
  | "ont"
  | "pacbio"
  | "multi_platform"
  | "targeted";
export type ReadTypeKey = "short_read" | "long_read" | "any";
export type AnalysisKey = "genotyping" | "annotation" | "qc_database";
export type UsageKey =
  | "runs_locally"
  | "online_tool"
  | "graphical_interface";

export interface ToolCard {
  id: string;
  name: string;
  summary: string;
  technology: TechnologyKey[];
  read_type: ReadTypeKey[];
  analysis: AnalysisKey[];
  usage: UsageKey[];
  features: string[];
  input?: string;
  output?: string;
  github?: string;
  publication?: string;
  uiPublication?: string;
  website?: string;
  websiteLabel?: string;
}

/** NGS-only view for marker Tools tab. Not derived from frequency data. */
export type MarkerToolViewTechFilter =
  | "ngs_any"
  | "illumina"
  | "ont"
  | "pacbio"
  | "multi_platform";

export interface MarkerToolView {
  techFilter: MarkerToolViewTechFilter;
}

export const DEFAULT_MARKER_TOOL_VIEW: MarkerToolView = {
  techFilter: "ngs_any",
};

export type CompatibilityMode = "curated" | "configurable" | "not_applicable";

export interface ToolSupportModel {
  isGenotyper: boolean;
  requiresTargets: boolean;
  supportedTechnologies: TechnologyKey[];
  compatibilityMode: CompatibilityMode;
}

/** Only "curated_supported" may be shown as "Supported" in UI. */
export type CompatibilityLabel =
  | "curated_supported"
  | "configurable"
  | "utility";

// --- ToolDetails (optional extended metadata for marker tab) ---

export interface ToolDetailsConfig {
  target_file_format: string;
  customizable_targets: boolean;
  flanking_bp_recommended?: number;
}

export interface ToolDetailsCompatibility {
  status: "maintained" | "archived";
  maintenance: "active" | "community-maintained" | "limited" | "unmaintained";
  maintainer?: string;
  license: string;
  last_release?: string;
  ont_models?: string[];
  docker_image?: string;
}

export interface ToolDetailsInterface {
  name: string;
  url: string;
  description: string;
}

export interface ToolDetailsSupport {
  native_panels?: string[];
  configurable?: boolean;
  wrapper?: boolean;
}

export interface ToolDetails {
  id: string;
  name: string;
  tech: string[];
  input: string[];
  output: string[];
  support: ToolDetailsSupport;
  config: ToolDetailsConfig;
  compatibility: ToolDetailsCompatibility;
  interfaces?: ToolDetailsInterface[];
  limitations?: string[];
  repo_url: string | null;
  paper_doi: string | null;
  last_checked: string;
  online_version?: string;
  docs_url?: string;
  notes?: string;
}

export interface ToolForMarker {
  card: ToolCard;
  supportModel: ToolSupportModel;
  details: ToolDetails | null;
  label: CompatibilityLabel;
}

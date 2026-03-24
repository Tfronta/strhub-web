// Per-tool support model for marker Tools tab.
// Used to resolve CompatibilityLabel (configurable vs curated_supported).
// No marker taxonomy (CODIS/Y/X) — only tech and compatibility mode.

import type { ToolSupportModel, TechnologyKey } from "./types";

export const supportModelByToolId: Record<string, ToolSupportModel> = {
  strider: {
    isGenotyper: false,
    requiresTargets: false,
    supportedTechnologies: ["multi_platform"],
    compatibilityMode: "not_applicable",
  },
  strnaming: {
    isGenotyper: false,
    requiresTargets: false,
    supportedTechnologies: ["multi_platform"],
    compatibilityMode: "not_applicable",
  },
  hipstr: {
    isGenotyper: true,
    requiresTargets: true,
    supportedTechnologies: ["illumina"],
    compatibilityMode: "configurable",
  },
  longtr: {
    isGenotyper: true,
    requiresTargets: true,
    supportedTechnologies: ["ont", "pacbio"],
    compatibilityMode: "configurable",
  },
  strspy: {
    isGenotyper: true,
    requiresTargets: true,
    supportedTechnologies: ["ont", "pacbio"],
    compatibilityMode: "configurable",
  },
  gangstr: {
    isGenotyper: true,
    requiresTargets: true,
    supportedTechnologies: ["illumina"],
    compatibilityMode: "configurable",
  },
  straitrazor: {
    isGenotyper: true,
    requiresTargets: true,
    supportedTechnologies: ["illumina", "targeted"],
    compatibilityMode: "configurable",
  },
  toastr: {
    isGenotyper: true,
    requiresTargets: true,
    supportedTechnologies: ["illumina"],
    compatibilityMode: "configurable",
  },
  nanomnt: {
    isGenotyper: true,
    requiresTargets: true,
    supportedTechnologies: ["ont"],
    compatibilityMode: "configurable",
  },
  strkit: {
    isGenotyper: true,
    requiresTargets: true,
    supportedTechnologies: ["ont", "pacbio"],
    compatibilityMode: "configurable",
  },
  nastra: {
    isGenotyper: true,
    requiresTargets: true,
    supportedTechnologies: ["ont"],
    compatibilityMode: "configurable",
  },
  nanostr: {
    isGenotyper: true,
    requiresTargets: true,
    supportedTechnologies: ["ont"],
    compatibilityMode: "configurable",
  },
};

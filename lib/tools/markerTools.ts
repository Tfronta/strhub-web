// Marker Tools tab: filtered view of master catalog (genotyping only, NGS).
// No CE context; no derivation from frequency data.

import type {
  ToolCard,
  ToolDetails,
  ToolForMarker,
  ToolSupportModel,
  MarkerToolView,
  CompatibilityLabel,
} from "./types";
import { DEFAULT_MARKER_TOOL_VIEW } from "./types";

const NGS_TECHS = [
  "illumina",
  "ont",
  "pacbio",
  "multi_platform",
  "targeted",
] as const;

function techFilterAllows(view: MarkerToolView, card: ToolCard): boolean {
  if (view.techFilter === "ngs_any") {
    return card.technology.some((t) =>
      (NGS_TECHS as readonly string[]).includes(t)
    );
  }
  return card.technology.includes(view.techFilter);
}

function defaultSupportModel(card: ToolCard): ToolSupportModel {
  return {
    isGenotyper: true,
    requiresTargets: true,
    supportedTechnologies: [...card.technology],
    compatibilityMode: "configurable",
  };
}

function resolveCompatibilityLabel(
  model: ToolSupportModel,
  _toolId: string
): CompatibilityLabel {
  if (model.compatibilityMode === "curated") return "curated_supported";
  if (model.compatibilityMode === "configurable" && model.isGenotyper)
    return "configurable";
  return "utility";
}

/**
 * Returns only NGS genotyping tools for the marker Tools tab.
 * No utilities (STRidER, STRNaming, annotation, qc_database).
 */
export function getToolsForMarker(
  toolCards: ToolCard[],
  supportModels: Record<string, ToolSupportModel>,
  view: MarkerToolView = DEFAULT_MARKER_TOOL_VIEW,
  getDetails?: (id: string) => ToolDetails | null
): ToolForMarker[] {
  const result: ToolForMarker[] = [];

  const genotypingCards = toolCards.filter(
    (card) =>
      card.analysis.includes("genotyping") && techFilterAllows(view, card)
  );

  for (const card of genotypingCards) {
    const model = supportModels[card.id] ?? defaultSupportModel(card);
    const label = resolveCompatibilityLabel(model, card.id);
    result.push({
      card,
      supportModel: model,
      details: getDetails?.(card.id) ?? null,
      label,
    });
  }

  return result;
}

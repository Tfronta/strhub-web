// Optional extended metadata for tools (config, compatibility, limitations, etc.).
// Tool existence comes from ToolCards; this enriches the marker tab when available.

import type { ToolDetails } from "./types";
import { toolsDetailsData } from "./toolsDetailsData";

let detailsById: Record<string, ToolDetails> | null = null;

function buildDetailsMap(): Record<string, ToolDetails> {
  if (detailsById) return detailsById;
  detailsById = Object.fromEntries(
    toolsDetailsData.map((t) => [t.id, t])
  );
  return detailsById;
}

export function getToolDetails(toolId: string): ToolDetails | null {
  return buildDetailsMap()[toolId] ?? null;
}

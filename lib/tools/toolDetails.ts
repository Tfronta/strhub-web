// Optional extended metadata for tools (config, compatibility, limitations, etc.).
// Tool existence comes from ToolCards; this enriches the marker tab when available.

import type { ToolDetails } from "./types";
import { toolsData } from "@/app/marker/[id]/toolsData";

let detailsById: Record<string, ToolDetails> | null = null;

function buildDetailsMap(): Record<string, ToolDetails> {
  if (detailsById) return detailsById;
  detailsById = Object.fromEntries(
    toolsData.map((t) => [t.id, t as unknown as ToolDetails])
  );
  return detailsById;
}

export function getToolDetails(toolId: string): ToolDetails | null {
  return buildDetailsMap()[toolId] ?? null;
}

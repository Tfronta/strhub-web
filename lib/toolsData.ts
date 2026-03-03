// Shared tools data for search index
// Derived from the canonical catalog (lib/tools) so search stays in sync.

import { buildToolCards } from "@/lib/tools";

export type ToolData = {
  name: string;
  description: string;
  category?: string;
  language?: string;
  tags?: string[];
  features?: string[];
  github?: string;
  paper?: string;
  website?: string;
  id?: string;
};

export function getToolsData(t: (key: string) => string): ToolData[] {
  const cards = buildToolCards(t);
  return cards.map((card) => ({
    id: card.id,
    name: card.name,
    description: card.summary,
    tags: [...card.technology, ...card.analysis],
    features: card.features,
    github: card.github,
    paper: card.publication,
    website: card.website,
  }));
}

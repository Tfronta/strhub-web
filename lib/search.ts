// Global search utility for STRhub
// Performs client-side search across all content types

import { SearchIndexItem, buildSearchIndex } from "./searchIndex";

export type SearchResult = SearchIndexItem & {
  score: number;
};

export type SearchResultsByType = {
  markers: SearchResult[];
  tools: SearchResult[];
  blog: SearchResult[];
  page: SearchResult[];
};

/**
 * Normalizes a search query (trim, lowercase)
 */
function normalizeQuery(query: string): string {
  return query.trim().toLowerCase();
}

/**
 * Calculates a relevance score for a search result
 * Higher scores = more relevant
 */
function calculateScore(
  item: SearchIndexItem,
  normalizedQuery: string
): number {
  let score = 0;
  const titleLower = item.title.toLowerCase();
  const descriptionLower = item.description.toLowerCase();
  const tagsLower = (item.tags || []).map((t) => t.toLowerCase());

  // Exact title match gets highest priority
  if (titleLower === normalizedQuery) {
    score += 100;
  } else if (titleLower.startsWith(normalizedQuery)) {
    score += 50;
  } else if (titleLower.includes(normalizedQuery)) {
    score += 30;
  }

  // Description match
  if (descriptionLower.includes(normalizedQuery)) {
    score += 10;
  }

  // Tag matches
  tagsLower.forEach((tag) => {
    if (tag === normalizedQuery) {
      score += 20;
    } else if (tag.includes(normalizedQuery)) {
      score += 5;
    }
  });

  // For markers: prioritize exact name matches
  if (item.type === "marker") {
    const markerName = item.title.toUpperCase();
    const queryUpper = normalizedQuery.toUpperCase();
    if (markerName === queryUpper) {
      score += 200; // Very high priority for exact marker name match
    }
  }

  return score;
}

/**
 * Performs a global search across all content types
 */
export function performSearch(
  query: string,
  t: (key: string) => string
): SearchResultsByType {
  const normalizedQuery = normalizeQuery(query);
  if (!normalizedQuery) {
    return {
      markers: [],
      tools: [],
      blog: [],
      page: [],
    };
  }

  const index = buildSearchIndex(t);
  const results: SearchResult[] = [];

  // Filter and score results
  index.forEach((item) => {
    const titleLower = item.title.toLowerCase();
    const descriptionLower = item.description.toLowerCase();
    const tagsLower = (item.tags || []).map((t) => t.toLowerCase());

    // Check if query matches
    const matches =
      titleLower.includes(normalizedQuery) ||
      descriptionLower.includes(normalizedQuery) ||
      tagsLower.some((tag) => tag.includes(normalizedQuery));

    if (matches) {
      const score = calculateScore(item, normalizedQuery);
      results.push({
        ...item,
        score,
      });
    }
  });

  // Sort by score (highest first)
  results.sort((a, b) => b.score - a.score);

  // Group by type
  const grouped: SearchResultsByType = {
    markers: [],
    tools: [],
    blog: [],
    page: [],
  };

  results.forEach((result) => {
    if (result.type === "marker") {
      grouped.markers.push(result);
    } else if (result.type === "tool") {
      grouped.tools.push(result);
    } else if (result.type === "blog") {
      grouped.blog.push(result);
    } else if (result.type === "page") {
      grouped.page.push(result);
    }
  });

  return grouped;
}

/**
 * Gets total count of search results
 */
export function getTotalResults(results: SearchResultsByType): number {
  return (
    results.markers.length +
    results.tools.length +
    results.blog.length +
    results.page.length
  );
}


export type BasicsArticle = {
  sys: { id: string; updatedAt?: string };
  fields: {
    title?: string;
    summary?: string;
    postReadMinutes?: number;
    keywords?: string[];
    bodyMd?: string;
    slug?: string;
    authors?: Array<{ name?: string }>;
  };
  /** Localized slug per site locale, when known. */
  slugs?: Record<"en" | "es" | "pt", string>;
};

/** Card-level article data for index pages (no body). */
export type BasicsListItem = {
  sys: { id: string };
  fields: {
    title: string;
    summary: string;
    postReadMinutes: number;
    keywords: string[];
    slug?: string;
  };
};

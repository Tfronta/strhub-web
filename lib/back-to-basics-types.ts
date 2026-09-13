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

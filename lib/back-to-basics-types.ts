export type BasicsArticle = {
  sys: { id: string };
  fields: {
    title?: string;
    summary?: string;
    postReadMinutes?: number;
    keywords?: string[];
    bodyMd?: string;
    slug?: string;
    authors?: Array<{ name?: string }>;
  };
};

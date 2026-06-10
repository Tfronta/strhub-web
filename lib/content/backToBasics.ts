// Static data for Back to Basics articles
// This matches the structure returned by the API route

export type BackToBasicsPost = {
  sys: { id: string };
  fields: {
    title: string;
    summary: string;
    postReadMinutes: number;
    keywords: string[];
    slug?: string;
    authors?: Array<{
      name: string;
      bio?: string;
    }>;
  };
};

// Static Back to Basics articles
// These are sample articles that match the structure from Contentful
export const backToBasicsArticles: BackToBasicsPost[] = [
  {
    sys: { id: "sam-files" },
    fields: {
      title: "SAM files",
      summary: "Learn about Sequence Alignment/Map (SAM) format, a text-based format for storing biological sequences aligned to a reference sequence. Understand its structure, common fields, and how it's used in bioinformatics workflows.",
      postReadMinutes: 8,
      keywords: ["SAM", "alignment", "bioinformatics", "file formats"],
      slug: "sam-files",
      authors: [],
    },
  },
  {
    sys: { id: "fastq-files" },
    fields: {
      title: "FASTQ files",
      summary: "Explore the FASTQ format, a text-based format for storing both biological sequences and their corresponding quality scores. Discover how it's structured and why it's essential for sequencing data analysis.",
      postReadMinutes: 10,
      keywords: ["FASTQ", "sequencing", "quality scores", "file formats"],
      slug: "fastq-files",
      authors: [],
    },
  },
  {
    sys: { id: "understanding-sequencing-formats" },
    fields: {
      title: "Understanding Sequencing File Formats: An Introductory Guide",
      summary: "A comprehensive introduction to common sequencing file formats including SAM, BAM, FASTQ, and CRAM. Learn when to use each format and how they relate to forensic genetics and STR analysis.",
      postReadMinutes: 15,
      keywords: ["file formats", "sequencing", "SAM", "BAM", "CRAM", "FASTQ", "terminology"],
      slug: "understanding-sequencing-formats",
      authors: [],
    },
  },
];


import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/projects", {
  title: "International Genomic Projects",
  description:
    "Major international genomic projects advancing the understanding of human genetic diversity and STR analysis, with links to their data resources.",
});

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

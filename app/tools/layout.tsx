import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/tools", {
  title: "Tools & Pipelines for STR Analysis",
  description:
    "Bioinformatics tools, pipelines and tutorials for Short Tandem Repeat analysis, from raw sequencing data processing to genotyping and population genetics.",
});

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

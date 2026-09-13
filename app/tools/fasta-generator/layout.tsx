import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/tools/fasta-generator", {
  title: "FASTA Generator",
  description:
    "Generate custom FASTA sequences for STR markers with configurable flanking regions and export marker metadata for research and analysis.",
});

export default function FastaGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

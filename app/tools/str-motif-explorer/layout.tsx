import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/tools/str-motif-explorer", {
  title: "STR Motif Explorer",
  description:
    "Explore the internal structure of each STR marker on the GRCh38 reference over the ISFG minimum range: canonical motifs, compound and interrupted repeats, and STRNaming bracketed nomenclature.",
});

export default function StrMotifExplorerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

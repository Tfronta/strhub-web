import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/tools/str-motif-explorer", {
  title: "STR Motif Explorer",
  description:
    "Explore the internal structure of each STR marker on the GRCh38 reference over the ISFG minimum range: the STRNaming name of the reference allele, compound and interrupted repeats, and STRidER's templates for common alleles.",
});

export default function StrMotifExplorerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

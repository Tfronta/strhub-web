import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/tools/fasta-generator", {
  title: "FASTA Generator",
  description:
    "Simplified STR allele constructs for user-defined CE allele numbers, built on the GRCh38 reference over the ISFG minimum range. Not validated forensic allele sequences.",
});

export default function FastaGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/tools/fasta-generator", {
  title: "FASTA Generator",
  description:
    "Simplified motif-based STR sequence constructs with GRCh38 reference flanks and a user-defined repeat count. Not validated forensic allele sequences.",
});

export default function FastaGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

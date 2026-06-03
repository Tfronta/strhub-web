import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/tools/fasta-generator");

export default function FastaGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

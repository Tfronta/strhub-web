import type { Metadata } from "next";
import { Suspense } from "react";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/tools/igv-viewer", {
  title: "IGV Viewer",
  description:
    "Browse STR loci in the Integrative Genomics Viewer with hg38 reference and example sequencing alignments.",
});

export default function IgvViewerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={null}>{children}</Suspense>;
}

import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/catalog", {
  title: "STR Marker Catalog",
  description:
    "Database of forensic STR markers: CODIS core loci, other autosomal STRs, X-STRs and Y-STRs, with motifs, allele ranges, GRCh38 coordinates and population frequencies from STRbase, STRidER and pop.STR.",
});

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

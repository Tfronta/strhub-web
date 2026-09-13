import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = pageMetadata("/datasets", {
  title: "STR Datasets",
  description:
    "Download curated STR allele frequency and genotype datasets in standard formats, kept separate by technology (CE and NGS) with consistent allele nomenclature.",
});

export default function DatasetsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Dataset",
          name: "STRhub STR allele frequency and genotype datasets",
          description:
            "Curated STR allele frequency and genotype datasets for forensic loci, kept separate by technology (capillary electrophoresis and NGS), downloadable in standard formats.",
          url: "https://strhub.app/datasets",
          isAccessibleForFree: true,
          creator: { "@type": "Organization", name: "STRhub", url: "https://strhub.app" },
        }}
      />
      {children}
    </>
  );
}

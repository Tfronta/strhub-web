import type { Metadata } from "next";
import { Suspense } from "react";
import { DATASET_CREATOR, DATASET_LICENSE, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = pageMetadata("/datasets", {
  title: "STR Allele Frequency Data",
  description:
    "Explore STR allele frequency variation across populations in charts, or download curated frequency and genotype datasets in standard formats, kept separate by technology (CE and NGS).",
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
            "Curated STR allele frequency and genotype datasets for forensic loci (pop.STR for CE, sequence-based datasets for NGS), organized by technology and study design, explorable in charts and downloadable in standard formats.",
          url: "https://strhub.app/datasets",
          isAccessibleForFree: true,
          license: DATASET_LICENSE,
          creator: DATASET_CREATOR,
          publisher: { "@id": "https://strhub.app/#organization" },
          isBasedOn: [
            "http://spsmart.cesga.es/",
            "https://www.internationalgenome.org/category/phase-3/",
          ],
        }}
      />
      {/* The page reads ?tab= on the client. */}
      <Suspense fallback={null}>{children}</Suspense>
    </>
  );
}

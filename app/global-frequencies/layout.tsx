import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = pageMetadata("/global-frequencies", {
  title: "Global Allele Frequencies",
  description:
    "Explore STR allele frequency variation across populations within well-defined forensic datasets, organized by technology (CE and NGS) and study design.",
});

export default function GlobalFrequenciesLayout({
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
          name: "STRhub global STR allele frequencies",
          description:
            "STR allele frequency variation across populations in well-defined forensic datasets (pop.STR for CE, sequence-based datasets for NGS), organized by technology and study design.",
          url: "https://strhub.app/global-frequencies",
          isAccessibleForFree: true,
          creator: { "@type": "Organization", name: "STRhub", url: "https://strhub.app" },
        }}
      />
      {children}
    </>
  );
}

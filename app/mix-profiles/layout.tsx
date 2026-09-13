import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/mix-profiles", {
  title: "DNA Mixture Simulator",
  description:
    "Simulate two- and three-person DNA mixtures in capillary electrophoresis and NGS: peak heights, stutter, allele sharing and minor contributor detection, using open 1000 Genomes profiles.",
});

export default function MixProfilesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

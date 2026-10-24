import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { HIPSTR_TUTORIAL_PATH } from "@/lib/tutorials";

export const metadata: Metadata = pageMetadata(HIPSTR_TUTORIAL_PATH, {
  title: "HipSTR tutorial: genotyping forensic STRs from a BAM",
  description:
    "Genotype 24 forensic STRs of NA12878 with HipSTR in your own terminal, step by step: read the VCF, filter it and look at the reads with VizAln.",
});

export default function HipstrTutorialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

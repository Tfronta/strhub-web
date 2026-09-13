import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/basics", {
  title: "Foundations of STR Analysis",
  description:
    "Explore STR loci across human chromosomes and learn the core concepts behind forensic genetics, sequencing file formats and bioinformatics workflows.",
});

export default function BasicsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/strbase", {
  title: "NIST STRBase Integration",
  description:
    "How STRhub integrates the NIST STRBase database: authoritative STR marker data, allele frequency distributions and reference sequences for forensic loci.",
});

export default function StrbaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

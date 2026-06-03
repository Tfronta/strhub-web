import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/tools/str-motif-explorer");

export default function StrMotifExplorerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

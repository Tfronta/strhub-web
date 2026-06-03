import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/tools/igv-viewer");

export default function IgvViewerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

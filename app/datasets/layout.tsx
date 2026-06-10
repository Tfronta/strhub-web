import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/datasets");

export default function DatasetsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

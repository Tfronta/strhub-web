import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/catalog");

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

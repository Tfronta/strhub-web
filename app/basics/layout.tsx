import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/basics");

export default function BasicsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

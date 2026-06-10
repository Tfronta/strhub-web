import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/tools");

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/community");

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

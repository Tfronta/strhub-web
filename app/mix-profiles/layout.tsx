import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/mix-profiles");

export default function MixProfilesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/community", {
  title: "Community Hub",
  description:
    "Latest developments in STR analysis and forensic genetics research, community discussions and ways to collaborate with STRhub.",
});

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

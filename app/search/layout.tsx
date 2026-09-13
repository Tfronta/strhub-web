import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/search", {
  title: "Search",
  description:
    "Search STR markers, tools, datasets and articles on STRhub.",
  index: false,
});

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

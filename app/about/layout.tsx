import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/about", {
  title: "About STRhub",
  description:
    "STRhub is an open-access platform advancing STR research and education in forensic genetics. Learn about the mission, the team and how to contribute.",
});

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

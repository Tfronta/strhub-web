import type { Metadata } from "next";
import HomePageClient from "./HomePageClient";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/", {
  title: { absolute: "STRhub - Central Hub for Short Tandem Repeats" },
  description:
    "Open-access platform for forensic STR analysis: marker catalog, allele frequencies, DNA mixture simulator, STR motif explorer, tools, datasets and educational articles.",
});

export default function HomePage() {
  return <HomePageClient />;
}

import type { Metadata } from "next";
import HomePageClient from "./HomePageClient";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/");

export default function HomePage() {
  return <HomePageClient />;
}

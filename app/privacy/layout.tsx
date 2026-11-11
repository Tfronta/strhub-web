import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/privacy", {
  title: "Privacy",
  description:
    "What STRhub measures with Google Analytics, when it asks for consent, what the site keeps in your browser and how to switch analytics off.",
});

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}

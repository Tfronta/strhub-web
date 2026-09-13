import type { Metadata } from "next";
import { VERIFIED_PUBLIC } from "@/lib/seo";

// While Verified is in its tester phase it stays out of search engines. Pages
// keep their own title/description; only the robots directive comes from here.
export const metadata: Metadata = VERIFIED_PUBLIC
  ? {}
  : { robots: { index: false, follow: false } };

export default function VerifiedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

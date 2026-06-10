import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

type Props = {
  params: { id: string };
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return pageMetadata(`/marker/${params.id}`);
}

export default function MarkerLayout({ children }: Props) {
  return children;
}

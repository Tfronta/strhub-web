import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { markerData } from "@/lib/markerData";
import { markerFrequenciesCE } from "@/app/marker/[id]/markerFrequencies";

type Props = {
  params: { id: string };
  children: React.ReactNode;
};

function getMarker(id: string) {
  const key = id.toLowerCase() as keyof typeof markerData;
  return markerData[key];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const marker = getMarker(params.id);
  // Internal links and the sitemap use the lowercase key; make it the canonical
  // form so /marker/CSF1PO and /marker/csf1po are not indexed as two pages.
  const canonicalPath = `/marker/${params.id.toLowerCase()}`;
  if (!marker) {
    return pageMetadata(canonicalPath, {
      title: "Marker not found",
      description: "This STR marker is not in the STRhub catalog.",
      index: false,
    });
  }

  const name = marker.name || params.id.toUpperCase();
  const parts: string[] = [];
  if (marker.chromosome) parts.push(`chromosome ${marker.chromosome}`);
  if (marker.cytogeneticLocation) parts.push(marker.cytogeneticLocation);
  const where = parts.length ? ` (${parts.join(", ")})` : "";
  const kind = [marker.type, marker.category].filter(Boolean).join(", ");
  const motif = marker.motif ? ` Repeat motif ${marker.motif}.` : "";
  const alleles = marker.alleles ? ` Allele range ${marker.alleles}.` : "";

  // A marker page with no coordinates, no reference sequences and no
  // frequency data is a near-empty page; keep it out of the index (links are
  // still followed) until the record is filled in.
  const key = params.id.toLowerCase();
  const hasContent =
    marker.coordinates?.start != null ||
    (marker.sequences?.length ?? 0) > 0 ||
    key in markerFrequenciesCE;

  return pageMetadata(canonicalPath, {
    index: hasContent,
    title: `${name} STR marker`,
    description:
      `${name}${where}: ${kind || "STR"} marker.${motif}${alleles} ` +
      "GRCh38 coordinates, population allele frequencies, variant alleles and analysis tools.",
    openGraph: {
      title: `${name} STR marker | STRhub`,
      description: `${name}${where}: ${kind || "STR"} marker.${motif}${alleles}`,
    },
  });
}

export default function MarkerLayout({ params, children }: Props) {
  if (!getMarker(params.id)) {
    notFound();
  }
  // The marker page reads query params on the client; keep it inside a
  // Suspense boundary so the rest of the shell can stream.
  return <Suspense fallback={null}>{children}</Suspense>;
}

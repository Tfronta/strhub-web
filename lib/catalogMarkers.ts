import { markerData } from "@/lib/markerData";

// Helper function to normalize category names
function normalizeCategory(category: string): string {
  if (category === "CODIS Core") return "CODIS Core";
  if (
    category === "Other Autosomal STRs" ||
    category === "European Standard Set"
  )
    return "Other Autosomal";
  if (category === "X STRs" || category === "X-Chromosome STRs") return "X-STR";
  if (category === "Y STRs" || category === "Y-Chromosome STRs") return "Y-STR";
  return category;
}

/** Catalog marker rows derived from `markerData` (shared by Catalog page, search index, karyotype explorer). */
export const markers = Object.entries(markerData)
  .map(([id, marker]) => ({
    id,
    name: marker.name,
    fullName: marker.fullName,
    chromosome: marker.chromosome,
    motif: marker.motif ?? "",
    type: marker.type ?? "",
    alleles: marker.alleles ?? "",
    category: normalizeCategory(marker.category),
    nistVerified:
      marker.sequences?.some((seq) => seq.nistVerified === true) ?? false,
  }))
  .filter(
    (marker) =>
      !!marker.motif || ["F13A1", "FESFPS", "LPL"].includes(marker.name),
  );

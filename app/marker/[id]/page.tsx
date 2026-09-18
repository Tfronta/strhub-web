import { JsonLd } from "@/components/json-ld";
import { buildMarkerSummary, type MarkerSummary } from "@/lib/marker-summary";
import { DATASET_CREATOR, DATASET_LICENSE, SITE_URL } from "@/lib/seo";
import { MarkerView } from "./MarkerView";

const POPULATION_NAMES: Record<string, string> = {
  AFR: "Africa",
  NAM: "Native American",
  EAS: "East Asia",
  CSA: "Central and South Asia",
  EUR: "Europe",
  MES: "Middle East",
  OCE: "Oceania",
};

function markerJsonLd(summary: MarkerSummary) {
  const url = `${SITE_URL}/marker/${summary.id}`;
  const graph: Record<string, unknown>[] = [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "STRhub", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "STR Marker Catalog",
          item: `${SITE_URL}/catalog`,
        },
        { "@type": "ListItem", position: 3, name: summary.name, item: url },
      ],
    },
  ];
  if (summary.ce) {
    const pops = summary.ce.populations.map(
      (p) => POPULATION_NAMES[p.pop] ?? p.pop
    );
    graph.push({
      "@type": "Dataset",
      "@id": `${url}#frequencies`,
      license: DATASET_LICENSE,
      creator: DATASET_CREATOR,
      name: `${summary.name} allele frequencies (capillary electrophoresis)`,
      description:
        `Allele frequencies of the ${summary.name} STR locus in ${pops.length} population groups ` +
        `(${pops.join(", ")}), from the STRs Local dataset of pop.STR / SP-SMART (CESGA), ` +
        "with sample sizes and expected heterozygosity per population.",
      url,
      isAccessibleForFree: true,
      isBasedOn: "http://spsmart.cesga.es/",
      keywords: [
        summary.name,
        "STR",
        "short tandem repeat",
        "allele frequency",
        "forensic genetics",
        "population genetics",
      ],
      variableMeasured: "allele frequency",
      includedInDataCatalog: {
        "@type": "DataCatalog",
        name: "STRhub Data",
        url: `${SITE_URL}/datasets`,
      },
      publisher: { "@id": `${SITE_URL}/#organization` },
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

export default function MarkerPage({ params }: { params: { id: string } }) {
  // Computed on the server so the FSSG file and the frequency tables stay out
  // of the client bundle; MarkerView only receives the compact summary.
  const summary = buildMarkerSummary(params.id);
  return (
    <>
      {summary && <JsonLd data={markerJsonLd(summary)} />}
      <MarkerView params={params} summary={summary} />
    </>
  );
}

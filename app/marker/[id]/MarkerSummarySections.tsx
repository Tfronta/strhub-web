// Overview-tab content built from the server-computed MarkerSummary: a prose
// description of the locus, its FSSG sequence structure, a compact allele
// frequency table and links to related markers. All of it is static markup, so
// it is part of the server-rendered HTML that search engines index.

import Link from "next/link";
import { BarChart3, Database, Link2, Waypoints } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { InfoTip } from "@/components/InfoTip";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { MarkerSummary } from "@/lib/marker-summary";

type Translate = (key: string, params?: Record<string, string>) => string;

const FSSG_URL = "https://strider.online/";
const POPSTR_URL = "http://spsmart.cesga.es/";

/** Fixed locale so server and client render the same digits (no hydration drift). */
const formatInt = (n: number) => n.toLocaleString("en-US");
const formatFreq = (f: number) => f.toFixed(3);

function joinList(items: string[], and: string): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} ${and} ${items[items.length - 1]}`;
}

function populationName(pop: string, t: Translate): string {
  const key = `marker.populationLabels.${pop}`;
  const label = t(key);
  return label && label !== key ? label : pop;
}

function repeatTypeName(type: string | null, t: Translate): string | null {
  if (!type) return null;
  const key = `marker.repeatTypes.${type.toLowerCase()}`;
  const label = t(key);
  return label && label !== key ? label.toLowerCase() : type.toLowerCase();
}

/** Sentences describing the locus; each one only appears when its data exists. */
export function describeMarker(summary: MarkerSummary, t: Translate): string[] {
  const s = (key: string, params?: Record<string, string>) =>
    t(`marker.summary.${key}`, params);
  const and = s("and");
  const sentences: string[] = [];

  const type = repeatTypeName(summary.repeatType, t);
  const cytoband = summary.cytogeneticLocation
    ? ` (${summary.cytogeneticLocation})`
    : "";
  const kind = s(`kind.${summary.kind}`);
  sentences.push(
    type
      ? s("introTyped", {
          name: summary.name,
          type,
          chromosome: summary.chromosome,
          cytoband,
          kind,
        })
      : s("introUntyped", {
          name: summary.name,
          chromosome: summary.chromosome,
          cytoband,
          kind,
        })
  );

  if (summary.motif) {
    sentences.push(
      summary.alternativeMotifs.length
        ? s("motifAlternatives", {
            motif: summary.motif,
            alternatives: joinList(summary.alternativeMotifs, and),
          })
        : s("motif", { motif: summary.motif })
    );
  }

  const forms = summary.fssg?.canonicalBracketing ?? [];
  if (forms.length === 1) {
    sentences.push(s("canonical", { canonical: forms[0] }));
  } else if (forms.length > 1) {
    sentences.push(
      s("canonicalMany", {
        canonical: forms[0],
        count: String(forms.length - 1),
      })
    );
  }

  // The range names its source: alleles observed in the pop.STR CE frequency data,
  // or the curated markerData range when no CE frequencies back it (common for
  // Y/X loci).
  const fromFreq = summary.alleleRangeSource === "frequencies";
  if (summary.alleleRange && summary.referenceAllele) {
    sentences.push(
      s(fromFreq ? "allelesFreqWithReference" : "allelesWithReference", {
        range: summary.alleleRange,
        reference: summary.referenceAllele,
      })
    );
  } else if (summary.alleleRange) {
    sentences.push(s(fromFreq ? "allelesFreq" : "alleles", { range: summary.alleleRange }));
  } else if (summary.referenceAllele) {
    sentences.push(s("referenceOnly", { reference: summary.referenceAllele }));
  }

  if (summary.grch38) {
    const params = {
      chromosome: summary.chromosome,
      start: formatInt(summary.grch38.start),
      end: formatInt(summary.grch38.end),
      length: formatInt(summary.grch38.lengthBp),
      strand: summary.strand ?? "+",
    };
    sentences.push(
      summary.grch37
        ? s("coordinatesBoth", {
            ...params,
            start37: formatInt(summary.grch37.start),
            end37: formatInt(summary.grch37.end),
          })
        : s("coordinates", params)
    );
  }

  // The per-population modal alleles, expected heterozygosity, NGS availability,
  // MPS kit coverage and STRbase variant count are deliberately kept out of the
  // intro prose: each already has its own tab or card (Frequencies, Statistics,
  // Variant Alleles, Structure), where the numbers are interactive and cite their
  // source. The intro stays a stable locus identity. Note also that the NGS
  // frequency sets are reported by fragment size, not sequence, so the old
  // "sequence-based (NGS) frequencies are also available" wording is dropped; the
  // Frequencies panel carries that clarification.

  return sentences;
}

export function MarkerSummaryDescription({
  summary,
  t,
}: {
  summary: MarkerSummary;
  t: Translate;
}) {
  return (
    <p className="text-sm text-muted-foreground leading-relaxed">
      {describeMarker(summary, t).join(" ")}
    </p>
  );
}

function StructureCard({ summary, t }: { summary: MarkerSummary; t: Translate }) {
  const fssg = summary.fssg;
  if (!fssg) return null;
  const s = (key: string, params?: Record<string, string>) =>
    t(`marker.summary.${key}`, params);
  return (
    <Card className="border rounded-md shadow-none bg-card">
      <CardHeader className="pb-3 px-4">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Waypoints className="h-4 w-4 text-muted-foreground" />
          {s("structureTitle")}
        </CardTitle>
        <CardDescription className="text-xs font-normal mt-1">
          {s("structureSource")}{" "}
          <a
            href={FSSG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            STRidER
          </a>
          .
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 space-y-4">
        <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
          {fssg.canonicalBracketing.length > 0 && (
            <div className="space-y-1 sm:col-span-2">
              <Label className="text-xs font-normal text-muted-foreground">
                {s("canonicalLabel")}
              </Label>
              <div className="flex flex-wrap gap-1">
                {fssg.canonicalBracketing.map((form) => (
                  <Badge
                    key={form}
                    variant="outline"
                    className="font-mono text-xs font-normal px-2 py-0.5 border-muted-foreground/20"
                  >
                    {form}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {fssg.referenceName && (
            <div className="space-y-1 sm:col-span-2">
              <div className="flex items-center gap-1">
                <Label className="text-xs font-normal text-muted-foreground">
                  {s("referenceNameLabel")}
                </Label>
                <InfoTip term="strnamingName" />
              </div>
              <p className="overflow-x-auto whitespace-nowrap font-mono text-sm font-semibold text-foreground">
                {fssg.referenceName}
              </p>
            </div>
          )}
          {fssg.historicalBracketing && (
            <div className="space-y-1">
              <Label className="text-xs font-normal text-muted-foreground">
                {s("historicalLabel")}
              </Label>
              <p className="text-sm font-mono text-foreground">
                {fssg.historicalBracketing}
              </p>
            </div>
          )}
          {fssg.minimumRange && (
            <div className="space-y-1">
              <Label className="text-xs font-normal text-muted-foreground">
                {s("minimumRangeLabel")}
              </Label>
              <p className="text-sm text-foreground">
                {fssg.minimumRange.chrom}:{formatInt(fssg.minimumRange.start)}-
                {formatInt(fssg.minimumRange.end)}{" "}
                <span className="text-muted-foreground">
                  ({s("basePairs", { n: formatInt(fssg.minimumRange.lengthBp) })})
                </span>
              </p>
            </div>
          )}
          {fssg.kits.length > 0 && (
            <div className="space-y-1 sm:col-span-2">
              <Label className="text-xs font-normal text-muted-foreground">
                {s("kitsLabel")}
              </Label>
              <TooltipProvider delayDuration={100}>
                <ul className="flex flex-wrap gap-1">
                  {fssg.kits.map((kit) => (
                    <li key={kit.name}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge
                            variant="secondary"
                            className="cursor-help text-xs font-normal px-2 py-0.5 bg-muted text-foreground border-0"
                          >
                            {kit.name}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent className="text-xs">
                          {s("kitRange", {
                            chrom: kit.chrom,
                            start: formatInt(kit.start),
                            end: formatInt(kit.end),
                            length: formatInt(kit.length),
                          })}
                        </TooltipContent>
                      </Tooltip>
                    </li>
                  ))}
                </ul>
              </TooltipProvider>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function FrequenciesCard({
  summary,
  t,
  onOpenFrequencies,
}: {
  summary: MarkerSummary;
  t: Translate;
  onOpenFrequencies: () => void;
}) {
  const ce = summary.ce;
  if (!ce) return null;
  const s = (key: string, params?: Record<string, string>) =>
    t(`marker.summary.${key}`, params);
  return (
    <Card className="border rounded-md shadow-none bg-card">
      <CardHeader className="pb-3 px-4">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
          {s("frequenciesTitle")}
        </CardTitle>
        <CardDescription className="text-xs font-normal mt-1">
          {s("frequenciesIntro")}{" "}
          <a
            href={POPSTR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            pop.STR / SP-SMART
          </a>
          .
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 space-y-4">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 lg:grid-cols-4">
          {ce.populations.map((p) => (
            <div key={p.pop} className="space-y-0.5">
              <dt className="text-xs font-normal text-muted-foreground">
                {populationName(p.pop, t)}
              </dt>
              <dd className="text-sm text-foreground">
                {s("modalAlleleShort", { allele: p.modalAllele })}{" "}
                <span className="text-muted-foreground">
                  ({formatFreq(p.modalFrequency)}
                  {p.sampleSize != null
                    ? `, ${s("sampleSize", { n: formatInt(p.sampleSize) })}`
                    : ""}
                  )
                </span>
              </dd>
            </div>
          ))}
        </dl>

        <div className="border border-border rounded-md overflow-hidden">
          <div className="max-h-80 overflow-auto">
            <table className="w-full text-xs">
              <caption className="sr-only">{s("frequenciesTableCaption")}</caption>
              <thead className="sticky top-0 z-10 bg-background border-b border-border">
                <tr>
                  <th scope="col" className="text-left px-3 py-2 font-semibold text-muted-foreground">
                    {t("common.allele")}
                  </th>
                  {ce.table.pops.map((pop) => (
                    <th
                      key={pop}
                      scope="col"
                      className="text-right px-3 py-2 font-semibold text-muted-foreground"
                      title={populationName(pop, t)}
                    >
                      <abbr className="no-underline" title={populationName(pop, t)}>
                        {pop}
                      </abbr>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ce.table.rows.map((row, index) => (
                  <tr
                    key={row.allele}
                    className={index % 2 === 0 ? "bg-background" : "bg-muted/10"}
                  >
                    <th scope="row" className="text-left px-3 py-1.5 font-mono font-normal text-foreground">
                      {row.allele}
                    </th>
                    {ce.table.pops.map((pop) => {
                      const value = row.byPop[pop];
                      return (
                        <td key={pop} className="text-right px-3 py-1.5 font-mono text-foreground">
                          {value != null ? formatFreq(value) : <span className="text-muted-foreground">0</span>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{s("frequenciesTableCaption")}</p>

        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-8 px-3 text-xs font-semibold"
          onClick={onOpenFrequencies}
        >
          {s("openFrequencies")}
        </Button>
      </CardContent>
    </Card>
  );
}

function VariantsNote({
  summary,
  t,
  onOpenVariants,
}: {
  summary: MarkerSummary;
  t: Translate;
  onOpenVariants: () => void;
}) {
  if (!summary.variants) return null;
  const s = (key: string, params?: Record<string, string>) =>
    t(`marker.summary.${key}`, params);
  return (
    <Card className="border rounded-md shadow-none bg-card">
      <CardHeader className="pb-3 px-4">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Database className="h-4 w-4 text-muted-foreground" />
          {t("marker.variantAlleles")}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 space-y-3">
        <p className="text-sm text-muted-foreground">
          {s("variants", {
            count: String(summary.variants.count),
            alleleCount: String(summary.variants.alleles.length),
          })}
        </p>
        <div className="flex flex-wrap gap-1">
          {summary.variants.alleles.map((allele) => (
            <Badge
              key={allele}
              variant="outline"
              className="font-mono text-xs font-normal px-2 py-0.5 border-muted-foreground/20"
            >
              {allele}
            </Badge>
          ))}
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-8 px-3 text-xs font-semibold"
          onClick={onOpenVariants}
        >
          {s("openVariants")}
        </Button>
      </CardContent>
    </Card>
  );
}

function RelatedCard({ summary, t }: { summary: MarkerSummary; t: Translate }) {
  const { sameChromosome, sameKind } = summary.related;
  if (sameChromosome.length === 0 && sameKind.length === 0) return null;
  const s = (key: string, params?: Record<string, string>) =>
    t(`marker.summary.${key}`, params);
  const groups = [
    {
      key: "chromosome",
      title: s("relatedSameChromosome", { chromosome: summary.chromosome }),
      items: sameChromosome,
    },
    { key: "kind", title: s(`relatedKind.${summary.kind}`), items: sameKind },
  ].filter((g) => g.items.length > 0);
  return (
    <Card className="border rounded-md shadow-none bg-card">
      <CardHeader className="pb-3 px-4">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Link2 className="h-4 w-4 text-muted-foreground" />
          {s("relatedTitle")}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 space-y-4">
        {groups.map((group) => (
          <div key={group.key} className="space-y-1.5">
            <p className="text-xs font-normal text-muted-foreground">{group.title}</p>
            <ul className="flex flex-wrap gap-1.5">
              {group.items.map((m) => (
                <li key={m.id}>
                  <Link
                    href={`/marker/${m.id}`}
                    className="inline-flex items-center rounded-md border border-border px-2 py-0.5 text-xs text-foreground hover:bg-muted transition-colors"
                  >
                    {m.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <p className="text-xs text-muted-foreground">
          <Link href="/catalog" className="text-primary hover:underline">
            {s("relatedCatalog")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export function MarkerSummarySections({
  summary,
  t,
  onOpenFrequencies,
  onOpenVariants,
}: {
  summary: MarkerSummary;
  t: Translate;
  onOpenFrequencies: () => void;
  onOpenVariants: () => void;
}) {
  return (
    <>
      <StructureCard summary={summary} t={t} />
      <FrequenciesCard summary={summary} t={t} onOpenFrequencies={onOpenFrequencies} />
      <VariantsNote summary={summary} t={t} onOpenVariants={onOpenVariants} />
      <RelatedCard summary={summary} t={t} />
    </>
  );
}

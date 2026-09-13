"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLanguage } from "@/contexts/language-context";
import {
  markerFrequenciesCE,
  markerFrequenciesNGS,
} from "@/app/marker/[id]/markerFrequencies";
import { markerData } from "@/lib/markerData";
import { MarkerView } from "@/app/marker/[id]/MarkerView";

/** Markers that have CE or NGS frequency data, in catalog order. */
const MARKERS_WITH_FREQUENCIES = Object.entries(markerData)
  .filter(([id]) => id in markerFrequenciesCE || id in markerFrequenciesNGS)
  .map(([id, marker]) => ({ id, name: marker.name, chromosome: marker.chromosome }));

/**
 * "Explore frequencies" tab of the Data page. It renders the very same
 * Frequencies panel a marker page shows (MarkerView in embed mode), so charts,
 * dataset cards, tooltips and technical notes are identical in both places.
 */
export function ExplorePanel() {
  const { t } = useLanguage();
  const [selectedMarker, setSelectedMarker] = useState<string>(
    MARKERS_WITH_FREQUENCIES[0]?.id ?? ""
  );
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MARKERS_WITH_FREQUENCIES;
    return MARKERS_WITH_FREQUENCIES.filter((m) => m.name.toLowerCase().includes(q));
  }, [query]);

  const current = MARKERS_WITH_FREQUENCIES.find((m) => m.id === selectedMarker);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-base text-muted-foreground">
          {t("globalFrequencies.heroLine")}
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t("globalFrequencies.comparabilityNote")}
        </p>
      </div>

      <Card className="border rounded-md shadow-none bg-card">
        <CardContent className="px-4 py-4 flex flex-wrap items-end gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {t("globalFrequencies.selectMarker")}
            </Label>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={popoverOpen}
                  className="w-full md:w-[300px] justify-between"
                >
                  {current
                    ? `${current.name} (Chr ${current.chromosome})`
                    : t("globalFrequencies.selectMarkerPlaceholder")}
                  <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0" align="start">
                <div className="p-2">
                  <Input
                    placeholder={t("globalFrequencies.searchMarkers")}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="mb-2"
                    autoFocus
                  />
                  <div className="max-h-[300px] overflow-y-auto">
                    {filtered.length === 0 ? (
                      <div className="p-4 text-sm text-muted-foreground text-center">
                        {t("globalFrequencies.noMarkersFound")}
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {filtered.map((m) => (
                          <Button
                            key={m.id}
                            variant="ghost"
                            className="w-full justify-start text-sm font-normal"
                            onClick={() => {
                              setSelectedMarker(m.id);
                              setPopoverOpen(false);
                              setQuery("");
                            }}
                          >
                            {m.name}
                            <span className="ml-auto text-xs text-muted-foreground">
                              Chr {m.chromosome}
                            </span>
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          {current && (
            <Button variant="ghost" size="sm" className="h-9 text-xs" asChild>
              <Link href={`/marker/${current.id}?tab=frequencies`}>
                <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                {t("globalFrequencies.openMarkerPage")}
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>

      {current ? (
        <MarkerView key={current.id} params={{ id: current.id }} embed="frequencies" />
      ) : (
        <p className="text-sm text-muted-foreground">
          {t("globalFrequencies.selectMarkerToView")}
        </p>
      )}
    </div>
  );
}

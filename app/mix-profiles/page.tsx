// app/mix-profiles/page.tsx
"use client";
import { useLanguage } from "@/contexts/language-context";
import MixProfilesDemo from "@/sections/mix-profiles/MixProfilesDemo";
import { HelpCircle } from "lucide-react";
import { PageTitle } from "@/components/page-title";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function Page() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 md:px-0 py-8 space-y-6">
        <div className="mb-3 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <PageTitle title={t("mixProfiles.title")} />
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
                  aria-label={t("mixProfiles.quickGuide.title")}
                >
                  <HelpCircle className="h-4 w-4" />
                  {t("mixProfiles.quickGuide.button")}
                </button>
              </PopoverTrigger>
              <PopoverContent
                side="bottom"
                align="end"
                sideOffset={8}
                className="w-[420px] max-h-96 overflow-y-auto p-4 text-sm text-foreground"
              >
                <div className="space-y-4">
                  <h3 className="text-base font-semibold mb-1">
                    {t("mixProfiles.quickGuide.title")}
                  </h3>

                  <div>
                    <h4 className="font-semibold mb-1">
                      {t("mixProfiles.quickGuide.thresholds.title")}
                    </h4>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>{t("mixProfiles.quickGuide.thresholds.at")}</li>
                      <li>{t("mixProfiles.quickGuide.thresholds.st")}</li>
                      <li>{t("mixProfiles.quickGuide.thresholds.ranges")}</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">
                      {t("mixProfiles.quickGuide.mixture.title")}
                    </h4>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>{t("mixProfiles.quickGuide.mixture.balanced")}</li>
                      <li>{t("mixProfiles.quickGuide.mixture.moderate")}</li>
                      <li>{t("mixProfiles.quickGuide.mixture.strong")}</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-1">
                      {t("mixProfiles.quickGuide.markers.title")}
                    </h4>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>{t("mixProfiles.quickGuide.markers.fga")}</li>
                      <li>{t("mixProfiles.quickGuide.markers.d18s51")}</li>
                      <li>{t("mixProfiles.quickGuide.markers.d21s11")}</li>
                      <li>{t("mixProfiles.quickGuide.markers.d2s1338")}</li>
                    </ul>
                    <p className="mt-1">
                      {t("mixProfiles.quickGuide.markers.description")}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-1">
                      {t("mixProfiles.quickGuide.simulation.title")}
                    </h4>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>{t("mixProfiles.quickGuide.simulation.ratio")}</li>
                      <li>
                        {t("mixProfiles.quickGuide.simulation.degradation")}
                      </li>
                      <li>{t("mixProfiles.quickGuide.simulation.stutter")}</li>
                      <li>{t("mixProfiles.quickGuide.simulation.loci")}</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-1">
                      {t("mixProfiles.quickGuide.notes.title")}
                    </h4>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>{t("mixProfiles.quickGuide.notes.longerAlleles")}</li>
                      <li>
                        {t("mixProfiles.quickGuide.notes.minorContributors")}
                      </li>
                      <li>{t("mixProfiles.quickGuide.notes.stutter")}</li>
                      <li>{t("mixProfiles.quickGuide.notes.notAllLoci")}</li>
                    </ul>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <p className="w-full max-w-none break-words text-base text-muted-foreground">
            {t("mixProfiles.simulatorDescription")}
          </p>
        </div>
        <MixProfilesDemo />
      </main>
    </div>
  );
}

"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BarChart3, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/language-context";
import { ExplorePanel } from "./ExplorePanel";
import { DownloadPanel } from "./DownloadPanel";

type DataTab = "explore" | "download";
const TABS: DataTab[] = ["explore", "download"];

/**
 * One "Data" section with two views of the same frequency data:
 * explore it in charts, or download it as tables. The active tab lives in the
 * URL (?tab=explore|download) so each view stays linkable.
 */
export default function DataPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const param = searchParams?.get("tab");
  const activeTab: DataTab = TABS.includes(param as DataTab)
    ? (param as DataTab)
    : "explore";

  const setTab = useCallback(
    (value: string) => {
      const next = new URLSearchParams(searchParams?.toString());
      next.set("tab", value);
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t("datasets.hub.title")}
          </h1>
          <p className="text-base text-muted-foreground max-w-4xl">
            {t("datasets.hub.description")}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setTab} className="space-y-6">
          <TabsList className="h-10 bg-muted/50 p-0 rounded-md border-0">
            <TabsTrigger
              value="explore"
              className="h-10 gap-2 px-4 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-sm"
            >
              <BarChart3 className="h-4 w-4" aria-hidden />
              {t("datasets.hub.tabExplore")}
            </TabsTrigger>
            <TabsTrigger
              value="download"
              className="h-10 gap-2 px-4 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-sm"
            >
              <Download className="h-4 w-4" aria-hidden />
              {t("datasets.hub.tabDownload")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="explore">
            <ExplorePanel />
          </TabsContent>
          <TabsContent value="download">
            <DownloadPanel />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

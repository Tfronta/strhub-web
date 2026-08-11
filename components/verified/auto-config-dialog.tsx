"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ALL_AUTOCONFIG_GROUPS,
  autoConfigRows,
  groupsWithRows,
  type AutoConfigGroup,
  type AutoConfigRow,
} from "@/lib/verified/autoconfig-apply";
import type { AutoConfigEntry } from "@/lib/verified/autoconfig-store";

interface Props {
  entry: AutoConfigEntry | null;
  open: boolean;
  currentRef: string;
  currentFingerprint: string | null;
  onOpenChange: (open: boolean) => void;
  onApply: (groups: Record<AutoConfigGroup, boolean>) => void;
}

function ConfidenceBadge({ level }: { level: AutoConfigRow["confidence"] }) {
  const { t } = useLanguage();
  const high = level === "high";
  return (
    <span
      className={
        high
          ? "h-fit shrink-0 rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground"
          : "h-fit shrink-0 rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[11px] text-amber-700 dark:text-amber-400"
      }
    >
      {t(high ? "verified.submit.autoConfigHigh" : "verified.submit.autoConfigLow")}
    </span>
  );
}

export function AutoConfigDialog({
  entry,
  open,
  currentRef,
  currentFingerprint,
  onOpenChange,
  onApply,
}: Props) {
  const { t } = useLanguage();
  const [groups, setGroups] = useState<Record<AutoConfigGroup, boolean>>(
    ALL_AUTOCONFIG_GROUPS,
  );

  // Every opening starts from all groups ticked; a group unticked while
  // reviewing one configuration says nothing about the next.
  useEffect(() => {
    if (open) setGroups(ALL_AUTOCONFIG_GROUPS);
  }, [open, entry]);

  if (!entry) return null;

  const rows = autoConfigRows(entry.config);
  const present = groupsWithRows(rows);
  const fromAnotherRef = entry.ref !== currentRef;
  const stale =
    currentFingerprint !== null && currentFingerprint !== entry.manifestFingerprint;
  const nothingTicked = !present.some((g) => groups[g]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            {t("verified.submit.autoConfigTitle")}
          </DialogTitle>
          <DialogDescription>
            {t("verified.submit.autoConfigReviewHint")}
          </DialogDescription>
        </DialogHeader>

        {fromAnotherRef && (
          <p className="text-xs text-muted-foreground">
            {t("verified.submit.autoConfigFromRef", { ref: entry.ref })}
          </p>
        )}

        {stale && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{t("verified.submit.autoConfigStaleTitle")}</AlertTitle>
            <AlertDescription>
              {t("verified.submit.autoConfigStaleBody")}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-5">
          {present.map((group) => (
            <section key={group} className="space-y-2">
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  className="h-4 w-4 shrink-0 accent-primary"
                  checked={groups[group]}
                  onChange={(e) =>
                    setGroups((prev) => ({ ...prev, [group]: e.target.checked }))
                  }
                />
                {t(`verified.submit.autoConfigGroup.${group}`)}
              </label>

              <div className="space-y-2 border-l border-border pl-4">
                {rows
                  .filter((r) => r.group === group)
                  .map((r) => (
                    <div
                      key={r.field}
                      className="flex items-start justify-between gap-3"
                    >
                      <div className="min-w-0 space-y-0.5">
                        <p className="text-sm font-medium">{t(r.labelKey)}</p>
                        {r.value === null ? (
                          <p className="text-sm italic text-muted-foreground">
                            {t("verified.submit.autoConfigNotFound")}
                          </p>
                        ) : r.valueKey ? (
                          <p className="text-sm">{t(r.valueKey)}</p>
                        ) : (
                          <code className="block break-all text-sm">{r.value}</code>
                        )}
                        {r.evidence && (
                          <p className="text-xs text-muted-foreground">{r.evidence}</p>
                        )}
                      </div>
                      <ConfidenceBadge level={r.confidence} />
                    </div>
                  ))}
              </div>
            </section>
          ))}
        </div>

        {entry.config.caveats.length > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{t("verified.submit.autoConfigCaveats")}</AlertTitle>
            <AlertDescription>
              <ul className="list-disc space-y-1 pl-4">
                {entry.config.caveats.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
            {t("verified.submit.autoConfigCancel")}
          </Button>
          <Button type="button" disabled={nothingTicked} onClick={() => onApply(groups)}>
            {t("verified.submit.autoConfigApply")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

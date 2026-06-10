"use client";

import { ExternalLink, Github, FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";
import type { ToolCard } from "@/lib/tools";

export interface ToolCardCompactProps {
  card: ToolCard;
  /** "marker" = compact compare view (3 chips, badge in header, split footer). "catalog" = default /tools layout. */
  variant?: "catalog" | "marker";
  /** e.g. "Supported" or "Configurable (requires targets)" */
  badgeLabel?: string;
  /** Extra actions (e.g. "View full tool profile" link). In marker variant rendered on row 2. */
  actions?: React.ReactNode;
  /** If tool has interfaces (e.g. HipSTR-UI), show one-line teaser with link. */
  interfaceTeaser?: { name: string; url: string } | null;
}

export function ToolCardCompact({
  card,
  variant = "catalog",
  badgeLabel,
  actions,
  interfaceTeaser,
}: ToolCardCompactProps) {
  const { t } = useLanguage();
  const isMarker = variant === "marker";

  const techKey = card.technology[0];
  const readKey = card.read_type[0];
  const showReadType =
    readKey && readKey !== "any" && !card.technology.includes("multi_platform");
  const analysisKey = card.analysis[0];

  const headerPadding = isMarker ? "pt-2 px-4 pb-2" : "";
  const contentPadding = isMarker ? "px-4 pb-4 pt-0" : "";
  const bodySpacing = isMarker ? "space-y-3" : "space-y-4";
  const headerDescMargin = isMarker ? "mb-1.5" : "mb-4";
  const chipsMargin = isMarker ? "mb-0" : "mb-4";

  return (
    <Card
      className={`border-0 bg-gradient-to-br from-card to-card/50 ${isMarker ? "border border-border py-4" : ""}`}
    >
      <CardHeader className={headerPadding}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <CardTitle
              className={`text-xl ${isMarker ? "text-lg mb-1" : "mb-2"}`}
            >
              {card.name}
            </CardTitle>
            <CardDescription
              className={`text-base ${headerDescMargin} ${isMarker ? "text-sm" : ""}`}
            >
              {card.summary}
            </CardDescription>
            <div
              className={`flex items-center flex-wrap ${isMarker ? "gap-1.5" : "gap-2"} ${chipsMargin}`}
            >
              {!isMarker && badgeLabel && (
                <Badge
                  variant="outline"
                  className="text-xs font-normal px-2 py-0.5 border-muted-foreground/20"
                >
                  {badgeLabel}
                </Badge>
              )}
              {techKey && (
                <Badge
                  variant="secondary"
                  className={isMarker ? "text-xs px-1.5 py-0" : "text-xs"}
                >
                  {t(`tools.badges.technology.${techKey}`)}
                </Badge>
              )}
              {showReadType && readKey && (
                <Badge
                  variant="outline"
                  className={
                    isMarker
                      ? "text-xs font-normal px-1.5 py-0"
                      : "text-xs font-normal"
                  }
                >
                  {t(`tools.badges.readType.${readKey}`)}
                </Badge>
              )}
              {analysisKey && (
                <Badge
                  variant="outline"
                  className={
                    isMarker
                      ? "text-xs font-normal px-1.5 py-0"
                      : "text-xs font-normal"
                  }
                >
                  {t(`tools.badges.analysis.${analysisKey}`)}
                </Badge>
              )}
              {!isMarker &&
                card.usage.map((u) => (
                  <Badge
                    key={u}
                    variant="outline"
                    className="font-normal text-xs"
                  >
                    {t(`tools.badges.usage.${u}`)}
                  </Badge>
                ))}
            </div>
          </div>
          {isMarker && badgeLabel && (
            <Badge
              variant="outline"
              className="shrink-0 text-[11px] font-normal px-1.5 py-0 border-muted-foreground/20"
            >
              {badgeLabel}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className={contentPadding}>
        <div className={bodySpacing}>
          <div>
            <h4
              className={`font-semibold text-sm ${isMarker ? "mb-1.5 mt-0" : "mb-2"}`}
            >
              {t("tools.common.keyFeatures")}
            </h4>
            <ul
              className={`text-sm text-muted-foreground ${isMarker ? "space-y-2" : "space-y-1"}`}
            >
              {card.features.slice(0, 3).map((feature, idx) => (
                <li key={idx}>• {feature}</li>
              ))}
            </ul>
          </div>
          {(card.input != null || card.output != null) && (
            <div
              className={`text-sm text-muted-foreground ${isMarker ? "space-y-0.5" : "space-y-1"}`}
            >
              {card.input != null && (
                <div>
                  {t("tools.common.inputLabel")}: {card.input}
                </div>
              )}
              {card.output != null && (
                <div>
                  {t("tools.common.outputLabel")}: {card.output}
                </div>
              )}
            </div>
          )}
          {interfaceTeaser && (
            <div className="text-xs text-muted-foreground">
              {isMarker ? (
                <>
                  {t("marker.interfaceAvailable")}{" "}
                  <a
                    href={interfaceTeaser.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {interfaceTeaser.name}
                  </a>
                </>
              ) : (
                <>
                  {t("marker.interfaces")}:{" "}
                  <a
                    href={interfaceTeaser.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    {interfaceTeaser.name}
                  </a>
                </>
              )}
            </div>
          )}
          {isMarker ? (
            <>
              <div className="flex flex-wrap gap-2">
                {card.github && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-7 py-1.5 px-2.5"
                    asChild
                  >
                    <a
                      href={card.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-3.5 w-3.5 mr-1" />
                      {t("tools.common.github")}
                    </a>
                  </Button>
                )}
                {card.publication && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-7 py-1.5 px-2.5"
                    asChild
                  >
                    <a
                      href={card.publication}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FileText className="h-3.5 w-3.5 mr-1" />
                      {t("tools.common.originalPublication")}
                    </a>
                  </Button>
                )}
                {card.uiPublication && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-7 py-1.5 px-2.5"
                    asChild
                  >
                    <a
                      href={card.uiPublication}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FileText className="h-3.5 w-3.5 mr-1" />
                      {t("tools.common.uiPublication")}
                    </a>
                  </Button>
                )}
              </div>
              {actions && <div className="pt-0.5">{actions}</div>}
            </>
          ) : (
            <div className="flex gap-2 flex-wrap">
              {card.github && (
                <Button size="sm" variant="outline" asChild>
                  <a
                    href={card.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-4 w-4 mr-1" />
                    {t("tools.common.github")}
                  </a>
                </Button>
              )}
              {card.website && (
                <Button size="sm" variant="outline" asChild>
                  <a
                    href={card.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    {card.websiteLabel || t("tools.common.website")}
                  </a>
                </Button>
              )}
              {card.publication && (
                <Button size="sm" variant="outline" asChild>
                  <a
                    href={card.publication}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    {t("tools.common.originalPublication")}
                  </a>
                </Button>
              )}
              {card.uiPublication && (
                <Button size="sm" variant="outline" asChild>
                  <a
                    href={card.uiPublication}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    {t("tools.common.uiPublication")}
                  </a>
                </Button>
              )}
              {actions}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

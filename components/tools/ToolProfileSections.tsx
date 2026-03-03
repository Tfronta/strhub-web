"use client";

import { ExternalLink, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ToolDetails } from "@/lib/tools";

export interface ToolProfileSectionsProps {
  details: ToolDetails;
  t: (key: string) => string;
}

function translateToolText(
  t: (key: string) => string,
  toolId: string,
  field: "interfaces" | "limitations" | "notes" | "config",
  key: string | undefined,
  originalText?: string
): string {
  let translationKey = `marker.tools.${toolId}.${field}`;
  if (field === "interfaces" && key) {
    translationKey += `.${key}.description`;
  } else if (key) {
    translationKey += `.${key}`;
  }
  const translation = t(translationKey);
  if (translation && translation !== translationKey) return translation;
  return originalText ?? translation;
}

function limitationTranslationKey(limitation: string): string {
  if (limitation.includes("Requires aligned BAM/CRAM")) return "requiresAligned";
  if (limitation.includes("Designed for Illumina") && limitation.includes("not compatible")) return "illuminaOnly";
  if (limitation.includes("Optimized for Illumina")) return "illuminaOnly";
  if (limitation.includes("Requires BAM/CRAM alignment")) return "requiresBamBed";
  if (limitation.includes("Optimized for ONT")) return "ontOptimized";
  if (limitation.includes("Not designed for whole-genome")) return "notWgs";
  if (limitation.includes("Designed for Illumina data") && limitation.includes("panel configuration")) return "illuminaData";
  if (limitation.includes("Does not perform read alignment")) return "noAlignment";
  if (limitation.includes("Designed for forensic NGS")) return "forensicNgs";
  if (limitation.includes("Web interface inactive")) return "webInterfaceInactive";
  return "";
}

function interfaceKey(name: string): string {
  return name === "HipSTR-UI" ? "hipstrUi" : name.replace(/[-\s]+/g, "").replace(/^([a-z])/i, (m) => m.toLowerCase()).replace(/([A-Z])/g, (m) => m.toLowerCase());
}

export function ToolProfileSections({ details, t }: ToolProfileSectionsProps) {
  const toolId = details.id;
  const sep = "pt-3 mt-3 border-t border-border";

  return (
    <div className="space-y-3 text-sm">
      {/* Configuration */}
      <div>
        <span className="text-xs font-semibold text-foreground">
          {t("marker.configuration")}:
        </span>
        <div className="text-xs text-muted-foreground space-y-1 mt-1">
          <div>
            <span className="font-medium">{t("marker.targetFileFormat")}:</span>{" "}
            {translateToolText(t, toolId, "config", "targetFileFormat", details.config.target_file_format)}
          </div>
          {details.config.flanking_bp_recommended != null && (
            <div>
              <span className="font-medium">{t("marker.flankingBpRecommended")}:</span>{" "}
              {details.config.flanking_bp_recommended} bp
            </div>
          )}
          {details.config.customizable_targets && (
            <div className="flex items-center gap-1 mt-1">
              <Badge variant="secondary" className="text-xs font-normal px-2 py-0.5">
                {t("marker.customizableTargetsLabel")}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Compatibility */}
      <div className={sep}>
        <span className="text-xs font-semibold text-foreground">
          {t("marker.compatibility")}:
        </span>
        <div className="text-xs text-muted-foreground space-y-1 mt-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{t("marker.status")}:</span>
            <Badge
              variant={details.compatibility.status === "maintained" ? "default" : "secondary"}
              className="text-xs font-normal px-2 py-0.5"
            >
              {details.compatibility.status === "maintained" ? t("marker.maintained") : t("marker.archived")}
            </Badge>
          </div>
          {details.compatibility.maintainer && (
            <div>
              <span className="font-medium">{t("marker.maintainer")}:</span> {details.compatibility.maintainer}
            </div>
          )}
          <div>
            <span className="font-medium">{t("marker.license")}:</span> {details.compatibility.license}
          </div>
          {details.compatibility.last_release && (
            <div>
              <span className="font-medium">{t("marker.lastRelease")}:</span> {details.compatibility.last_release}
            </div>
          )}
          {details.compatibility.ont_models?.length ? (
            <div>
              <span className="font-medium">{t("marker.ontModels")}:</span> {details.compatibility.ont_models.join(", ")}
            </div>
          ) : null}
          {details.compatibility.docker_image && (
            <div>
              <span className="font-medium">{t("marker.dockerImage")}:</span>{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">{details.compatibility.docker_image}</code>
            </div>
          )}
        </div>
      </div>

      {/* Interfaces */}
      {details.interfaces && details.interfaces.length > 0 && (
        <div className={sep}>
          <span className="text-xs font-semibold text-foreground">
            {t("marker.interfaces")}:
          </span>
          <div className="space-y-2 mt-1">
            {details.interfaces.map((iface, idx) => (
              <div key={idx} className="space-y-1">
                <Button variant="outline" size="sm" className="h-7 text-xs font-normal rounded-sm px-2" asChild>
                  <a href={iface.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    {iface.name}
                  </a>
                </Button>
                <p className="text-xs text-muted-foreground">
                  {translateToolText(t, toolId, "interfaces", interfaceKey(iface.name), iface.description)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Limitations */}
      {details.limitations && details.limitations.length > 0 && (
        <div className={sep}>
          <span className="text-xs font-semibold text-foreground">
            {t("marker.limitations")}:
          </span>
          <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground mt-1">
            {details.limitations.map((limitation, idx) => {
              const key = limitationTranslationKey(limitation);
              const text = key ? translateToolText(t, toolId, "limitations", key, limitation) : limitation;
              return <li key={idx}>{text}</li>;
            })}
          </ul>
        </div>
      )}

      {/* Links */}
      <div className={`${sep} flex flex-wrap gap-2`}>
        {details.repo_url && (
          <Button size="sm" variant="outline" className="h-7 text-xs font-normal rounded-sm px-2" asChild>
            <a href={details.repo_url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3 w-3 mr-1" />
              {t("marker.repository")}
            </a>
          </Button>
        )}
        {details.paper_doi && (
          <Button size="sm" variant="outline" className="h-7 text-xs font-normal rounded-sm px-2" asChild>
            <a
              href={details.paper_doi.startsWith("http") ? details.paper_doi : `https://doi.org/${details.paper_doi}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FileText className="h-3 w-3 mr-1" />
              {t("marker.originalPublication")}
            </a>
          </Button>
        )}
        {details.docs_url && (
          <Button size="sm" variant="outline" className="h-7 text-xs font-normal rounded-sm px-2" asChild>
            <a href={details.docs_url} target="_blank" rel="noopener noreferrer">
              <FileText className="h-3 w-3 mr-1" />
              {t("marker.documentation")}
            </a>
          </Button>
        )}
        {details.online_version && (
          <Button size="sm" variant="outline" className="h-7 text-xs font-normal rounded-sm px-2" asChild>
            <a href={details.online_version} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3 w-3 mr-1" />
              {t("marker.onlineVersion")}
            </a>
          </Button>
        )}
      </div>

      {/* Notes */}
      {details.notes && (
        <div className={sep}>
          <span className="text-xs font-semibold text-foreground">
            {t("marker.notes")}:
          </span>
          <p className="text-xs text-muted-foreground leading-relaxed mt-1">
            {translateToolText(t, toolId, "notes", undefined, details.notes)}
          </p>
        </div>
      )}

      {/* Last checked */}
      <div className={`${sep} text-xs text-muted-foreground`}>
        {t("marker.lastChecked")}: {details.last_checked}
      </div>
    </div>
  );
}

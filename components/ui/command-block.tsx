"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";

export type CommandBlockVariant = "default";

export interface CommandBlockProps {
  /** i18n key for the block title (e.g. tools.codeLabels.trimmomatic). */
  titleKey: string;
  /** Raw command string to display and copy (no commented lines). */
  command: string;
  /** Optional i18n key for tooltip text. If omitted, no info icon is shown. */
  infoKey?: string;
  /** Optional language for syntax (e.g. "bash"). Reserved for future use. */
  language?: string;
  /** Optional id for the block container. */
  id?: string;
  /** Optional variant. */
  variant?: CommandBlockVariant;
  className?: string;
  /** Callback when copy button is clicked (e.g. analytics). */
  onCopyButtonClick?: () => void;
}

export function CommandBlock({
  titleKey,
  command,
  infoKey,
  language: _language,
  id: propsId,
  variant = "default",
  className,
  onCopyButtonClick,
}: CommandBlockProps) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onCopyButtonClick?.();
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const title = t(titleKey);
  const infoContent = infoKey ? t(infoKey) : "";

  return (
    <div
      id={propsId}
      className={cn("mt-2", className)}
      data-variant={variant}
    >
      <div className="flex items-center justify-between gap-2 min-h-8 mb-1">
        <p className="text-xs font-semibold text-foreground truncate">
          {title}
        </p>
        <div className="flex items-center gap-0.5 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={handleCopy}
            aria-label="Copy code"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
          {infoKey != null && infoContent ? (
            <InfoTooltip content={infoContent} side="top" ariaLabel="Command info" />
          ) : null}
        </div>
      </div>
      <pre className="bg-background border rounded-md p-3 overflow-x-auto text-xs whitespace-pre font-mono">
        <code>{command}</code>
      </pre>
    </div>
  );
}

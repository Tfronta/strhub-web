"use client";

import * as React from "react";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/components/ui/use-mobile";
import { cn } from "@/lib/utils";

export type InfoTooltipPlacement = "top" | "right" | "bottom" | "left";

export interface InfoTooltipProps {
  /** Translated tooltip text (2–3 lines). */
  content: string;
  /** Placement relative to trigger. */
  side?: InfoTooltipPlacement;
  /** Max width for multiline text. */
  maxWidth?: number | string;
  /** Optional id for aria-describedby. */
  id?: string;
  /** Optional class for the trigger button. */
  triggerClassName?: string;
  /** Optional aria-label for the info trigger (default: "More information"). */
  ariaLabel?: string;
}

const placementToSide = (p: InfoTooltipPlacement): "top" | "right" | "bottom" | "left" => p;

export function InfoTooltip({
  content,
  side = "top",
  maxWidth = 280,
  id: propsId,
  triggerClassName,
  ariaLabel = "More information",
}: InfoTooltipProps) {
  const isMobile = useIsMobile();
  const generatedId = React.useId();
  const id = propsId ?? generatedId;
  const [open, setOpen] = React.useState(false);

  const contentStyle: React.CSSProperties = {
    maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
    minWidth: "12rem",
  };

  const contentNode = (
    <div
      id={id}
      role="tooltip"
      className="text-xs whitespace-pre-line"
      style={contentStyle}
    >
      {content}
    </div>
  );

  const trigger = (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={cn("h-6 w-6 p-0 shrink-0", triggerClassName)}
      aria-label={ariaLabel}
      aria-describedby={open ? id : undefined}
    >
      <Info className="h-3.5 w-3.5" aria-hidden />
    </Button>
  );

  if (isMobile) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent
          side={placementToSide(side)}
          align="end"
          sideOffset={6}
          className="py-2 px-3 text-xs w-auto max-w-[min(280px,85vw)]"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {contentNode}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{trigger}</TooltipTrigger>
      <TooltipContent
        side={placementToSide(side)}
        sideOffset={6}
        className="max-w-[min(320px,85vw)] [text-wrap:initial]"
        style={contentStyle}
      >
        {contentNode}
      </TooltipContent>
    </Tooltip>
  );
}

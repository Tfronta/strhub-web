"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";

/**
 * What the student types: dark like their terminal, with a copy button.
 * `variant="output"` is what the terminal answers: light, no copy button,
 * so the two never look alike.
 */
export function TerminalBlock({
  code,
  variant = "command",
  className,
}: {
  code: string;
  variant?: "command" | "output";
  className?: string;
}) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const isCommand = variant === "command";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div
      className={cn(
        "relative rounded-lg border",
        isCommand ? "border-zinc-800 bg-[#0b1419] text-zinc-100 dark:border-zinc-700" : "bg-muted/50",
        className,
      )}
    >
      {isCommand && (
        <button
          type="button"
          onClick={handleCopy}
          className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-md border border-zinc-700 bg-zinc-800/80 px-2 py-0.5 text-xs text-zinc-100 hover:bg-zinc-700"
        >
          {copied ? <Check className="h-3 w-3" aria-hidden /> : <Copy className="h-3 w-3" aria-hidden />}
          {copied ? t("tools.tutorialPage.copied") : t("tools.tutorialPage.copy")}
        </button>
      )}
      <pre
        className={cn(
          "overflow-x-auto whitespace-pre font-mono text-[13px] leading-relaxed",
          isCommand ? "px-4 pb-3 pt-9" : "px-4 py-3",
        )}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  className?: string;
  label?: string;
  onCopyButtonClick?: () => void;
}

export function CodeBlock({ code, className, label, onCopyButtonClick }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onCopyButtonClick?.();
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className={cn("mt-2", className)}>
      {label && (
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-semibold text-foreground">{label}</p>
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
        </div>
      )}
      <pre className="bg-background border rounded-md p-3 overflow-x-auto text-xs whitespace-pre font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
}

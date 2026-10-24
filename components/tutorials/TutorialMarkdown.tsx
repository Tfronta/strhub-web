import type React from "react";
import {
  parseBlocks,
  parseLine,
  type Inline,
} from "@/lib/tutorials/minimal-markdown";
import { cn } from "@/lib/utils";
import { TerminalBlock } from "./TerminalBlock";

// Short codes do not break: otherwise "--bam-libs" ends a line with "-".
const NOWRAP_MAX = 30;

export function InlineCode({ children }: { children: string }) {
  return (
    <code
      className={cn(
        "rounded border bg-muted px-1 py-0.5 font-mono text-[0.85em]",
        children.length <= NOWRAP_MAX ? "whitespace-nowrap" : "[overflow-wrap:anywhere]",
      )}
    >
      {children}
    </code>
  );
}

function renderInline(nodes: Inline[]): React.ReactNode {
  return nodes.map((n, i) => {
    switch (n.type) {
      case "text":
        return n.text;
      case "code":
        return <InlineCode key={i}>{n.text}</InlineCode>;
      case "strong":
        return (
          <strong key={i} className="font-semibold text-foreground">
            {renderInline(n.children)}
          </strong>
        );
      case "em":
        return <em key={i}>{renderInline(n.children)}</em>;
    }
  });
}

/** One line of text (table cells, error fixes). */
export function TutorialLine({ text }: { text: string | null | undefined }) {
  return <>{renderInline(parseLine(text))}</>;
}

/** Paragraphs, lists and command blocks. */
export function TutorialMarkdown({
  text,
  className,
}: {
  text: string | null | undefined;
  className?: string;
}) {
  const blocks = parseBlocks(text);
  if (!blocks.length) return null;
  return (
    <div className={cn("space-y-3 leading-relaxed", className)}>
      {blocks.map((b, i) => {
        if (b.type === "code") return <TerminalBlock key={i} code={b.text} />;
        if (b.type === "list")
          return (
            <ul key={i} className="list-disc space-y-1 pl-5">
              {b.items.map((item, j) => (
                <li key={j}>{renderInline(item)}</li>
              ))}
            </ul>
          );
        return <p key={i}>{renderInline(b.children)}</p>;
      })}
    </div>
  );
}

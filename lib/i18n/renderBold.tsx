import React from "react";

/**
 * Renders a translated string, turning `**…**` spans into bold `<strong>`
 * elements. Everything outside the markers is kept as plain text.
 *
 * Keeps the emphasis inside the i18n string so it stays with each locale's
 * translation instead of being hard-coded in the component.
 */
export function renderBold(text: string): React.ReactNode {
  // Splitting on a capturing group keeps the captured (bold) parts at odd
  // indices and the surrounding plain text at even indices.
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-foreground">
        {part}
      </strong>
    ) : (
      part
    )
  );
}

import { HARMONIZATION_PAPER_URL } from "@/lib/nomenclatureHarmonization";

/**
 * A marker.nomenclatureNotes string with its {citation} placeholder linked to
 * Bodner et al. 2024. Shared by the marker page and the Motif Explorer so both
 * explain the D6S474 / DYS612 designation the same way.
 */
export function NomenclatureNote({ text, className }: { text: string; className?: string }) {
  const [before, after = ""] = text.split("{citation}");
  return (
    <p className={className}>
      {before}
      <a
        href={HARMONIZATION_PAPER_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline"
      >
        Bodner et al. 2024
      </a>
      {after}
    </p>
  );
}

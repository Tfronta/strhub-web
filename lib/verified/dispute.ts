/**
 * Let a reader say a STRhub attestation is wrong.
 *
 * Everything else in Verified is built so a reader does not have to take our
 * word for a claim: the evidence links open the README at the pinned line, the
 * logs are there to read. This is the other half of that — the way to talk back
 * when a line still reads wrong. The tool's author and an attentive reviewer are
 * the two people who catch a false claim fastest, and the point of this button
 * is to give them the path instead of waiting for an email that never comes.
 *
 * The dispute goes to STRhub's OWN engine repository, not the tool's. A reader
 * is questioning what STRhub published, so it belongs where STRhub answers for
 * it. (The separate maintainer draft in `issue-draft.ts` is the opposite arrow:
 * telling a tool's author about a fault in their tool, on their repo.)
 *
 * Nothing is sent from here. This builds a URL that prefills GitHub's own
 * new-issue form, in the reader's own session, with the Submit button theirs to
 * press — the same rule as every other outward action in Verified.
 */
import type { VerifiedReport } from "@/types/verified";

/** Where a disputed attestation is answered for. */
const ENGINE_REPO = "https://github.com/Tfronta/strhub-verified";

/**
 * GitHub truncates a prefilled form silently past roughly this, and a
 * half-filled report is worse than none. The body is only context plus two
 * empty prompts, so it sits far below this; the guard is here for the day a
 * field grows.
 */
const MAX_PREFILL = 6000;

export interface DisputeLink {
  /** The prefilled new-issue URL on the engine repo, or "" when it cannot fit. */
  url: string;
  /** True when the prefill would be truncated, so the UI can fall back to plain. */
  tooLong: boolean;
}

function toolLabel(report: VerifiedReport): string {
  const name = report.tool?.name ?? "the tool";
  const v = report.tool?.version;
  return v ? `${name} ${v}` : name;
}

/**
 * The issue a reader would file to dispute `slug`.
 *
 * `staticPageUrl` is the published report the reader is looking at: it travels
 * in the body so whoever reads the issue lands on the exact attestation being
 * questioned, not a search for it.
 */
export function buildDisputeLink(
  report: VerifiedReport,
  slug: string,
  staticPageUrl: string,
): DisputeLink {
  const ref = report.source?.ref_resolved ?? report.source?.ref ?? "";
  const title = `Possible error in the ${toolLabel(report)} attestation (${slug})`;

  const L: string[] = [
    "<!-- Opened from a STRhub Verified report. Say what reads wrong; you do not",
    "     need to know why, and you do not need an account with the tool. -->",
    "",
    "## The attestation",
    "",
    `- Tool: ${toolLabel(report)}`,
    `- Slug: \`${slug}\``,
    `- Source: ${report.source?.repo ?? "—"} @ \`${ref || "—"}\``,
    `- Report: ${staticPageUrl}`,
  ];
  if (report.ci_run) L.push(`- CI run: ${report.ci_run}`);
  L.push(`- Verified on: ${report.generated?.slice(0, 10) ?? "—"}`);

  L.push(
    "",
    "## What looks wrong",
    "",
    "<!-- Which sentence, gate, diagnostic or evidence line reads wrong, and what",
    "     it should say instead. If it is an evidence claim, paste the line and its",
    "     link from the Evidence section of the report. -->",
    "",
    "",
    "## How you know",
    "",
    "<!-- You are the tool's author, you ran it yourself, the README says",
    "     otherwise — anything that lets us check and correct it. -->",
    "",
  );

  const body = L.join("\n");
  const url = `${ENGINE_REPO}/issues/new?title=${encodeURIComponent(
    title,
  )}&body=${encodeURIComponent(body)}`;

  return { url, tooLong: url.length > MAX_PREFILL };
}

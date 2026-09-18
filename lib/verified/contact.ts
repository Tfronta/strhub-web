/**
 * The other way to talk back: a person, not an issue tracker.
 *
 * The dispute link files against STRhub's engine repository, which is right
 * for a claim that reads wrong — it is public, and the tool's author can see
 * it. But it presumes a GitHub account and a reader willing to post in public.
 * A reviewer with a question, an author who would rather write first, or
 * anyone who simply does not use GitHub had no path at all from the report.
 * The address is the same one the manual-verification page uses; a report
 * should not invent a second front door.
 *
 * Only a mailto: nothing is sent from here, and the reader's own client opens
 * with the attestation already named so the message arrives locatable.
 */
import type { VerifiedReport } from "@/types/verified";

export const CONTACT_EMAIL = "contact@strhub.app";

export function attestationContactMailto(
  report: Pick<VerifiedReport, "tool" | "source" | "ci_run">,
  slug: string,
  reportUrl: string,
  subjectLabel: string,
): string {
  const name = report.tool?.name ?? slug;
  const version = report.tool?.version;
  const label = version ? `${name} ${version}` : name;
  const subject = `${subjectLabel}: ${label} (${slug})`;
  const ref = report.source?.ref_resolved ?? report.source?.ref ?? "";
  // Context first, then room to write: the reader's cursor lands under it.
  const body =
    [
      `Attestation: ${slug}`,
      `Tool: ${label}`,
      report.source?.repo ? `Source: ${report.source.repo}${ref ? ` @ ${ref}` : ""}` : "",
      reportUrl ? `Report: ${reportUrl}` : "",
      report.ci_run ? `CI run: ${report.ci_run}` : "",
    ]
      .filter(Boolean)
      .join("\n") + "\n\n";
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

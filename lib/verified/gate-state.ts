/**
 * What each rung of the ladder shows: it passed, it is where the run stopped,
 * or it never ran because something earlier stopped it.
 *
 * Every unpassed gate used to be the same grey dot, which read as five
 * separate shortcomings of the software. Only the first one is a finding: the
 * rungs above it were not attempted, and saying otherwise blames a tool for
 * steps nobody gave it the chance to take.
 */
import type { VerifiedReport } from "@/types/verified";

export type GateState = "pass" | "blocked" | "stopped" | "not-reached";

export function blockedBeforeInstall(report: VerifiedReport): boolean {
  return report.procedure_validation?.valid === true &&
    report.procedure_review?.install_ready === false &&
    report.verdict?.code === "undetermined" &&
    report.verdict.basis === "strhub" &&
    report.gates.available === true &&
    !report.gates.installs && !report.gates.runs && !report.gates.io && !report.gates.content &&
    report.run?.step_outcome !== "success" && report.run?.step_outcome !== "failure";
}

export function gateStates(
  gates: Partial<Record<string, boolean>> | undefined,
  keys: string[],
  blockedAt?: string,
): Record<string, GateState> {
  const out: Record<string, GateState> = {};
  let stopped = false;
  for (const k of keys) {
    if (gates?.[k]) {
      out[k] = "pass";
    } else if (!stopped) {
      out[k] = k === blockedAt ? "blocked" : "stopped";
      stopped = true;
    } else {
      out[k] = "not-reached";
    }
  }
  return out;
}

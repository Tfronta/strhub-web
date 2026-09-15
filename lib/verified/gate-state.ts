/**
 * What each rung of the ladder shows: it passed, it is where the run stopped,
 * or it never ran because something earlier stopped it.
 *
 * Every unpassed gate used to be the same grey dot, which read as five
 * separate shortcomings of the software. Only the first one is a finding: the
 * rungs above it were not attempted, and saying otherwise blames a tool for
 * steps nobody gave it the chance to take.
 */
export type GateState = "pass" | "stopped" | "not-reached";

export function gateStates(
  gates: Partial<Record<string, boolean>> | undefined,
  keys: string[],
): Record<string, GateState> {
  const out: Record<string, GateState> = {};
  let stopped = false;
  for (const k of keys) {
    if (gates?.[k]) {
      out[k] = "pass";
    } else if (!stopped) {
      out[k] = "stopped";
      stopped = true;
    } else {
      out[k] = "not-reached";
    }
  }
  return out;
}

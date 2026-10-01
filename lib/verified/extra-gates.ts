/**
 * The checks the engine runs outside the gate ladder, as rows under it:
 * whether the installed program starts (`--help` answers), and whether the
 * README's own example reproduces. Present only when the run made them, so a
 * report from before either existed shows the ladder alone.
 */
import type { ExtraGateRow } from "@/components/verified/report/gates";

type Translate = (key: string, params?: Record<string, string>) => string;

export const EXTRA_GATES = ["starts", "example"] as const;

export function extraGateRowsFor(gates: Record<string, boolean> | undefined, t: Translate): ExtraGateRow[] {
  const g = gates ?? {};
  return EXTRA_GATES.filter((key) => key in g).map((key) => ({
    key,
    label: t(`verified.trial.${key}`),
    meaning: t(`verified.trial.${key}Meaning`),
    passed: !!g[key],
  }));
}

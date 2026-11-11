export const LOG_LEGS = ["external", "own", "example", "starts", "build"] as const;
type LogLeg = (typeof LOG_LEGS)[number];
export type TrialFileName = "pdf" | "html" | `log-${LogLeg}` | `terminal-${LogLeg}`;

export const TRIAL_FILE_NAMES: TrialFileName[] = [
  "pdf", "html",
  ...LOG_LEGS.flatMap((leg) => [`log-${leg}`, `terminal-${leg}`] as const),
];

export function isTrialFileName(name: string): name is TrialFileName {
  return TRIAL_FILE_NAMES.some((file) => file === name);
}

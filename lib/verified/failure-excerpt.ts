/**
 * Extracts a concise terminal excerpt from the execution logs when a run fails.
 *
 * Provides immediate evidence of the failure on the report page so users and
 * reviewers do not need to inspect raw CI logs in GitHub Actions.
 */

export interface FailureExcerpt {
  leg: string;
  text: string;
  hintKey?: string;
}

export const LOG_TAIL_LENGTH = 20_000;

export function failureLogLegs(gates?: { installs?: boolean }): string[] {
  if (gates?.installs === false) return ["build"];
  const legs = ["external", "own", "example", "starts"];
  if (gates?.installs !== true) legs.push("build");
  return legs;
}

const HINT_PATTERNS: Array<{
  pattern: RegExp;
  key: string;
}> = [
  {
    pattern: /(?:command not found|(?:^|\/|\b)sh:\s*\d+:\s*\S+:\s*not found|executable file not found|modulenotfounderror|importerror|no module named|cannot execute binary|error while loading shared libraries|cannot open shared object file|unable to locate package|no matching distribution found)/i,
    key: "verified.trial.hint.missingDependency",
  },
  {
    pattern: /(?:unrecognized option|unknown option|invalid option|illegal option|no arguments provided|error:\s*argument|unrecognized arguments)/i,
    key: "verified.trial.hint.invalidOption",
  },
  {
    pattern: /(?:permission denied|operation not permitted|read-only file system)/i,
    key: "verified.trial.hint.permission",
  },
  {
    pattern: /(?:out of memory|memory limit|oomkilled|killed process|cannot allocate memory|no space left on device|disk quota exceeded|stopped at the time limit)/i,
    key: "verified.trial.hint.resourceLimit",
  },
  {
    pattern: /(?:no such file or directory|cannot open|failed to open|unable to open|not a directory|does not exist|doesn't exist|same directory of|file not found)/i,
    key: "verified.trial.hint.pathOrFile",
  },
  {
    pattern: /(?:traceback \(most recent call last\)|\b(?:\w+error|\w+exception):|fatal error|panic:|segmentation fault|sigsegv|core dumped)/i,
    key: "verified.trial.hint.runtimeError",
  },
];

/** Show the recorded error with context, or the tail when no error is recognized. */
export function extractFailureExcerpt(
  logs:
    | Record<string, string>
    | Array<{ leg: string; text?: string }>
    | undefined
    | null,
  maxLines = 14,
  gates?: {
    installs?: boolean;
    starts?: boolean;
    example?: boolean;
    runs?: boolean;
  },
): FailureExcerpt | null {
  if (!logs || maxLines <= 0) return null;

  const entries: Array<{ leg: string; text: string }> = Array.isArray(logs)
    ? logs
        .filter(
          (l): l is { leg: string; text: string } =>
            typeof l.text === "string" && l.text.trim().length > 0,
        )
    : Object.entries(logs)
        .filter(([, text]) => typeof text === "string" && text.trim().length > 0)
        .map(([leg, text]) => ({ leg, text }));

  for (const leg of failureLogLegs(gates)) {
    const entry = entries.find((item) => item.leg === leg);
    if (!entry) continue;

    const lines = entry.text.trimEnd().split(/\r?\n/);
    const tailStart = Math.max(0, lines.length - maxLines);
    let start = tailStart;
    let hintKey: string | undefined;
    for (let index = lines.length - 1; index >= 0; index--) {
      const hint = HINT_PATTERNS.find(({ pattern }) => pattern.test(lines[index]));
      if (!hint) continue;
      if (index < tailStart) start = Math.max(0, index - Math.min(3, maxLines - 1));
      hintKey = hint.key;
      break;
    }

    if (leg === "starts" && gates?.starts === true && !hintKey) continue;
    if (leg === "example" && gates?.example === true && !hintKey) continue;

    return {
      leg,
      text: lines.slice(start, start + maxLines).join("\n"),
      hintKey,
    };
  }

  return null;
}


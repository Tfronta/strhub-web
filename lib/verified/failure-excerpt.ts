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

const HINT_PATTERNS: Array<{
  pattern: RegExp;
  key: string;
}> = [
  {
    pattern: /(?:no such file or directory|cannot open|failed to open|unable to open|not a directory|does not exist|doesn't exist|same directory of|file not found)/i,
    key: "verified.trial.hint.pathOrFile",
  },
  {
    pattern: /(?:command not found|(?:^|\/|\b)sh:\s*\d+:\s*\S+:\s*not found|executable file not found|modulenotfounderror|importerror|no module named|cannot execute binary|error while loading shared libraries|cannot open shared object file)/i,
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
    pattern: /(?:out of memory|memory limit|oomkilled|killed process|cannot allocate memory|segmentation fault|sigsegv|core dumped|no space left on device|disk quota exceeded|stopped at the time limit)/i,
    key: "verified.trial.hint.resourceLimit",
  },
  {
    pattern: /(?:traceback \(most recent call last\)|\b(?:\w+error|\w+exception):|fatal error|panic:)/i,
    key: "verified.trial.hint.runtimeError",
  },
];

/**
 * Extracts the tail lines of the failing log, preferring external or own data execution.
 */
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
  if (!logs) return null;

  const entries: Array<{ leg: string; text: string }> = Array.isArray(logs)
    ? logs
        .filter(
          (l): l is { leg: string; text: string } =>
            typeof l.text === "string" && l.text.trim().length > 0,
        )
    : Object.entries(logs)
        .filter(([, text]) => typeof text === "string" && text.trim().length > 0)
        .map(([leg, text]) => ({ leg, text }));

  if (entries.length === 0) return null;

  // Prioritize execution runs where failures typically happen: external, own, example, then build.
  const legOrder = ["external", "own", "example", "starts", "build"];
  entries.sort((a, b) => {
    const ai = legOrder.indexOf(a.leg);
    const bi = legOrder.indexOf(b.leg);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  for (const entry of entries) {
    const lines = entry.text
      .split(/\r?\n/)
      .map((l) => l.trimEnd())
      .filter((l) => l.trim().length > 0);

    if (lines.length === 0) continue;

    const tail = lines.slice(-maxLines);
    const joinedTail = tail.join("\n");

    let hintKey: string | undefined;
    for (const h of HINT_PATTERNS) {
      if (h.pattern.test(joinedTail)) {
        hintKey = h.key;
        break;
      }
    }

    if (gates) {
      if (entry.leg === "build" && gates.installs === true && !hintKey) continue;
      if (entry.leg === "starts" && gates.starts === true && !hintKey) continue;
      if (entry.leg === "example" && gates.example === true && !hintKey) continue;
    }

    return {
      leg: entry.leg,
      text: joinedTail,
      hintKey,
    };
  }

  return null;
}


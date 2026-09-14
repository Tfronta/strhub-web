/**
 * What kind of error a pasted terminal log shows.
 *
 * A compact mirror of the rules in the engine's harness/diagnose_log.py, for the
 * one question a user who cannot get a tool running needs answered in their
 * browser: is this the kind of failure that comes from my machine, or from the
 * tool? The engine's table is the reference; this carries the ids a person is
 * likely to hit locally and the same ids the published reports use, so a match
 * can be compared with what STRhub saw when it ran the tool.
 *
 * Pure and offline: nothing the user pastes leaves the page.
 */

export type LogKind =
  | "cmd_not_found"
  | "missing_module"
  | "bad_option"
  | "file_not_found"
  | "cannot_open"
  | "permission_denied"
  | "oom"
  | "requires_gpu"
  | "conda_unsatisfiable"
  | "pip_unresolvable"
  | "missing_header";

/** Which side each kind usually sits on. Advice, not a verdict. */
export const KIND_SIDE: Record<LogKind, "setup" | "tool" | "either"> = {
  cmd_not_found: "setup",
  missing_module: "setup",
  bad_option: "either",
  file_not_found: "setup",
  cannot_open: "either",
  permission_denied: "setup",
  oom: "setup",
  requires_gpu: "setup",
  conda_unsatisfiable: "tool",
  pip_unresolvable: "tool",
  missing_header: "setup",
};

const RULES: [LogKind, RegExp][] = [
  ["cmd_not_found", /(\S+):\s+command not found|exec: ['"]?([^'"\s]+)['"]?: executable file not found|'(\S+)' is not recognized as an internal or external command/i],
  ["missing_module", /ModuleNotFoundError:\s+No module named ['"]([^'"]+)['"]|ImportError:\s+cannot import name/i],
  ["bad_option", /(?:^|error\b[^\n]{0,40}?|:\s*)(?:unrecognized|unknown|invalid) (?:option|argument)s?\s*['"]?(--?[\w-]+)/im],
  ["cannot_open", /(?:cannot|could not|failed to|unable to) open\s+['"]?(\S+)/i],
  ["file_not_found", /No such file or directory|(?:file|path)\s+['"]?\S+['"]?\s+(?:does not exist|not found|doesn'?t exist)/i],
  ["permission_denied", /Permission denied|EACCES/i],
  ["oom", /Out of memory|Killed process|MemoryError|std::bad_alloc|Cannot allocate memory/i],
  ["requires_gpu", /CUDA|no NVIDIA driver|cuDNN|GPU (?:not|is not) available|libcudart/i],
  ["conda_unsatisfiable", /ResolvePackageNotFound|PackagesNotFoundError|UnsatisfiableError|libmamba Could not solve/i],
  ["pip_unresolvable", /No matching distribution found for|Could not find a version that satisfies the requirement/i],
  ["missing_header", /fatal error:\s+\S+\.h(?:pp)?:\s+No such file or directory/i],
];

const HELP_LINE = /^(?:usage:|options?:|arguments?:|-{1,2}[a-z])/i;

export interface LogFinding {
  kind: LogKind;
  side: "setup" | "tool" | "either";
  line: string;
}

/** Distinct kinds found, first matching line each, in order of appearance. */
export function classifyLog(text: string): LogFinding[] {
  const found = new Map<LogKind, string>();
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || HELP_LINE.test(line)) continue;
    // One line, one kind: the first rule in the table that matches, so a line
    // like "cannot open x: No such file or directory" is filed once, under the
    // more specific "cannot open", not also under "file not found".
    for (const [kind, rx] of RULES) {
      if (rx.test(line)) {
        if (!found.has(kind)) found.set(kind, line.slice(0, 200));
        break;
      }
    }
  }
  return [...found].map(([kind, line]) => ({ kind, side: KIND_SIDE[kind], line }));
}

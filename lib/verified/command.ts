/**
 * The command a run executed, as a reader should see it.
 *
 * Two readings of one line. `toolCommand` strips the harness's capture wrapper
 * (see prepare.example_wrapper in the engine: it marks the time, runs the
 * README's command, and copies whatever appeared) so the page shows the tool's
 * own command and not STRhub's plumbing around it. `formatCommand` breaks a
 * long one at its flags, joined with the shell's continuation so what is shown
 * still runs as written.
 */

/** The inner command of a wrapped `run.cmd`; the command itself when it is not wrapped. */
export function toolCommand(cmd: string): string {
  const inner = cmd.match(/&&\s*\(\s*(.+?)\s*\);\s*rc=\$\?/);
  return (inner ? inner[1] : cmd).trim();
}

/** `run.cmd` as written in a manifest's YAML, unwrapped; null when there is none. */
export function commandFromManifest(manifestYml: string): string | null {
  const m = manifestYml.match(/^run:\s*\n\s+cmd:\s*(.+)$/m);
  if (!m) return null;
  return toolCommand(m[1].trim().replace(/^["']|["']$/g, ""));
}

/**
 * One flag per line once a command no longer fits on one. A single
 * 200-character line is verbatim too, but nobody can read which path went to
 * which flag.
 */
export function formatCommand(cmd: string): string {
  const flat = cmd.trim().replace(/\s+/g, " ");
  if (flat.length <= 80) return flat;
  return flat.split(/ (?=--?[A-Za-z])/).join(" \\\n  ");
}

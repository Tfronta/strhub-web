/**
 * Bumped whenever the system prompt changes. Lives apart from autoconfig.ts so
 * the browser can compare a stored entry against it without pulling the
 * Anthropic SDK into the client bundle.
 */
export const PROMPT_VERSION = 3;

export const MODEL = "claude-opus-5";

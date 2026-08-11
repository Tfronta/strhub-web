export type AutoConfigErrorCode =
  | "not_a_github_repo"
  | "repo_not_found"
  | "ref_not_found"
  | "empty_repo"
  | "declined"
  | "empty"
  | "invalid"
  | "upstream";

export class AutoConfigError extends Error {
  readonly code: AutoConfigErrorCode;

  constructor(code: AutoConfigErrorCode, message?: string) {
    super(message ?? code);
    this.name = "AutoConfigError";
    this.code = code;
  }
}

/** HTTP status the API route answers with for each failure. */
export function statusForCode(code: AutoConfigErrorCode): number {
  switch (code) {
    case "not_a_github_repo":
      return 400;
    case "repo_not_found":
    case "ref_not_found":
    case "empty_repo":
      return 404;
    default:
      return 502;
  }
}

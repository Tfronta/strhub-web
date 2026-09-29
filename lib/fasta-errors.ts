// Errors the FASTA Generator can show. Each carries a code that the page maps
// to a translated message (fastaGeneratorPage.messages.<code>), so no error
// text is hard-coded in one language.

export type FastaErrorCode =
  | "configMissing"
  | "sliceUnavailable"
  | "sliceInvalid"
  | "genomeUnavailable"
  | "coreNotFound";

export class FastaGeneratorError extends Error {
  readonly code: FastaErrorCode;
  readonly params: Record<string, string>;

  constructor(code: FastaErrorCode, params: Record<string, string> = {}) {
    super(`${code}: ${JSON.stringify(params)}`);
    this.name = "FastaGeneratorError";
    this.code = code;
    this.params = params;
  }
}

// Shape of a tutorial JSON exported by the strhub-tutorials project
// (`construir.py web`). Long text fields are minimal markdown: see
// `minimal-markdown.ts`. Commands and outputs are the same in every language.

import type { Language } from "@/lib/translations";

export interface TutorialParameter {
  /** The option as typed (`--bams`), or a positional argument's name. */
  option: string;
  /** Its value in the example command; null for flags without a value. */
  example: string | null;
  /** What the reader puts there with their own data. */
  what: string;
}

export interface TutorialField {
  name: string;
  what: string;
}

export interface TutorialError {
  error: string;
  fix: string;
}

/** A second command that only the page shows, with its real output. */
export interface TutorialExtra {
  intro: string;
  command: string;
  output?: string | null;
}

export interface TutorialStep {
  id: string;
  title: string;
  explain: string;
  /** The full command, as typed; can span lines (`\`) or be several commands. */
  command: string;
  parameters?: TutorialParameter[];
  fields?: TutorialField[];
  /** Real output from the automatic test. */
  output?: string | null;
  /** E.g. "Last 24 of 972 lines". */
  output_note?: string | null;
  errors?: TutorialError[];
  extra?: TutorialExtra | null;
}

export interface TutorialInstall {
  os: string;
  note?: string | null;
  commands: string;
}

export interface TutorialText {
  title: string;
  summary: string;
  duration: string;
  get_started: string;
  install: TutorialInstall[];
  setup: string;
  setup_explain?: string | null;
  install_errors?: TutorialError[];
  files: { file: string; what: string }[];
  steps: TutorialStep[];
  closing: string;
}

export interface Tutorial {
  id: string;
  tool: string;
  version: string;
  /** YouTube video id, null until the video is uploaded. */
  youtube: string | null;
  /** Example data to download; null when readers use their own files. */
  zip: { name: string; url: string | null; size_mb: number } | null;
  tested: {
    date: string;
    system: string;
    commit: string;
    ok: number;
    total: number;
  };
  i18n: Record<Language, TutorialText>;
}

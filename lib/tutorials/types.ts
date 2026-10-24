// Shape of a tutorial JSON exported by the strhub-tutorials project
// (`construir.py web`). Long text fields are minimal markdown: see
// `minimal-markdown.ts`. Commands and outputs are the same in every language.

import type { Language } from "@/lib/translations";

export interface TutorialParameter {
  name: string;
  option: string;
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

export interface TutorialStep {
  id: string;
  title: string;
  explain: string;
  command: string;
  /** What `make` prints and runs, when the command is a make target. */
  make_runs?: string | null;
  parameters?: TutorialParameter[];
  fields?: TutorialField[];
  /** Real output from the automatic test. */
  output?: string | null;
  /** E.g. "Last 24 of 972 lines". */
  output_note?: string | null;
  errors?: TutorialError[];
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
  zip: { name: string; url: string | null; size_mb: number };
  tested: {
    date: string;
    system: string;
    commit: string;
    ok: number;
    total: number;
  };
  i18n: Record<Language, TutorialText>;
}

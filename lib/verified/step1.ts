/**
 * Step 1, the documented run, in the reader's language.
 *
 * The engine decides which of the four things happened and writes it into the
 * report (harness/certificate_text.py::step1_says); this only says it in es,
 * en or pt. The wording is fixed in the engine's docs/PLAN-Paso-1.md, and two
 * rules survive translation:
 *
 *   - no sentence says the tool does not work, because no run established
 *     that. `does_not_run` says a third party following the README did not
 *     reach the end, and invites a fix;
 *   - `ours` is a limitation of STRhub's reference data or of its own reader.
 *     It is never rendered as the tool failing, and it asks nothing of the
 *     author's README.
 *
 * A report written before the engine carried `step1` returns null, and the
 * page shows the verdict alone rather than inventing a sentence for it.
 */
import type { VerifiedReport, VerifiedStep1, VerifiedStep1Block } from "@/types/verified";

export type Step1Tone = "green" | "red" | "grey";

export interface Step1Display {
  code: VerifiedStep1["code"];
  headline: string;
  body: string;
  /** The guide's blocks, named in the reader's language. Empty unless the gap is the commit's. */
  missing: string[];
  missingTitle: string;
  guideHref: string;
  guideLabel: string;
  tone: Step1Tone;
}

const TONE: Record<VerifiedStep1["code"], Step1Tone> = {
  runs: "green",
  does_not_run: "red",
  cannot_tell: "grey",
  ours: "grey",
  none: "grey",
};

/** The guide lives in the engine repository, which is public. */
export const GUIDE_URL =
  "https://github.com/Tfronta/strhub-verified/blob/main/docs/GUIA-PASO-1.md";

type Translate = (key: string, params?: Record<string, string>) => string;

export function step1For(step1: VerifiedStep1 | null | undefined, t: Translate): Step1Display | null {
  if (!step1?.code || step1.code === "none") return null;
  const blocks: VerifiedStep1Block[] = step1.missing ?? [];
  return {
    code: step1.code,
    headline: t(`verified.trial.step1.headline.${step1.code}`),
    body: t(`verified.trial.step1.body.${step1.code}`),
    missing: blocks.map((b) => t(`verified.trial.step1.blocks.${b}`)),
    missingTitle: t("verified.trial.step1.missingTitle"),
    guideHref: GUIDE_URL,
    guideLabel: t("verified.trial.step1.guideLink"),
    tone: TONE[step1.code],
  };
}

/**
 * Build a ready-to-paste Markdown snippet containing the 4 blocks from
 * docs/GUIA-PASO-1.md (Install, Quick run command, Input, Output).
 * Pre-fills any block already detected in `report.evidence` and marks
 * missing blocks with explicit placeholders so the maintainer can fill them.
 */
export function buildReadmeTemplate(
  report: Pick<VerifiedReport, "tool" | "step1" | "evidence" | "io_detail" | "run">
): string {
  const toolName = report.tool?.name || "mytool";
  const bin = toolName.toLowerCase().replace(/[^a-z0-9_-]/g, "") || "mytool";
  const missing = new Set(report.step1?.missing ?? []);
  const installEv = report.evidence?.find(
    (e) => e.claim === "install_method" || e.claim === "bioconda_package",
  );
  const cmdEv = report.evidence?.find((e) => e.claim === "run_command");
  const outSpec = report.io_detail?.outputs?.[0];
  const outFile =
    outSpec?.resolved ||
    (outSpec?.format && outSpec.format !== "text"
      ? `results/sample.${outSpec.format}`
      : "results/sample.vcf");

  const installBlock = missing.has("install")
    ? `# TODO: replace with the exact commands to install ${toolName}\nconda env create -f environment.yml\nconda activate ${bin}\npip install .`
    : installEv?.text
      ? `# Detected in ${installEv.path}${installEv.line ? ` (line ${installEv.line})` : ""}:\n${installEv.text}`
      : `# Build / install ${toolName}:\nconda env create -f environment.yml\nconda activate ${bin}`;

  const cmdBlock = missing.has("command")
    ? `# TODO: one concrete command for a single sample (no [optional] synopsis brackets):\n${bin} --bam example/sample.bam --ref hg38.fa --regions regions.bed --out ${outFile}`
    : cmdEv?.text ||
      report.run?.cmd ||
      `${bin} --bam sample.bam --ref hg38.fa --out ${outFile}`;

  const inputLine = missing.has("input")
    ? `- **Input** *(TODO: declare input format & genome assembly)*: Aligned BAM (\`hg38\`), reference FASTA (\`hg38.fa\`), and target regions (\`regions.bed\`). *(Optional: commit a small example slice under \`example/\` or \`test/\` so anyone can run the command above out of the box.)*`
    : `- **Input**: Aligned reads (\`BAM\` / \`FASTQ\`, \`hg38\`) and reference FASTA (\`hg38.fa\`). *(Optional: committing a small test file under \`example/\` lets STRhub Verified and reviewers run the command above directly.)*`;

  const outputLine = missing.has("output")
    ? `- **Output** *(TODO: name the output file explicitly)*: Writes \`${outFile}\` in the output directory.`
    : `- **Output**: Writes \`${outFile}\`.`;

  return [
    `## Installation`,
    ``,
    "```bash",
    installBlock,
    "```",
    ``,
    `## Quick Start`,
    ``,
    "```bash",
    cmdBlock,
    "```",
    ``,
    inputLine,
    outputLine,
  ].join("\n");
}

import { INPUT_TYPES } from "./submission";
import { COMPATIBILITY_FLAGS, type CompatibilityAnswers } from "./manual";
import type { AutoConfig, Confidence, Suggested } from "./autoconfig";

/**
 * Not ReuseGroup: `tool` and `compat` have no reuse equivalent, and `outputs`
 * covers only the filename. The column layout under it stays with the
 * sample-file detector, which reads the content rather than guessing at it.
 */
export const AUTOCONFIG_GROUPS = ["tool", "env", "run", "inputs", "outputs", "compat"] as const;
export type AutoConfigGroup = (typeof AUTOCONFIG_GROUPS)[number];

export const ALL_AUTOCONFIG_GROUPS: Record<AutoConfigGroup, boolean> = {
  tool: true,
  env: true,
  run: true,
  inputs: true,
  outputs: true,
  compat: true,
};

/** The subset of the submit form's fields an automatic configuration can fill. */
export interface AutoConfigFields {
  name?: string;
  maintainer?: string;
  contact?: string;
  language?: string;
  buildCmd?: string;
  checkCmd?: string;
  cmd?: string;
  timeout?: string;
  inputType?: string;
  inputTypeCustom?: string;
  fixtureFilePath?: string;
  outputPath?: string;
  outputFormat?: string;
}

export interface AutoConfigApplied {
  fields: AutoConfigFields;
  needsBuild?: boolean;
  compat?: CompatibilityAnswers;
}

export interface AutoConfigRow {
  group: AutoConfigGroup;
  field: string;
  labelKey: string;
  value: string | null;
  /** Set when the value is a phrase to translate rather than repository text. */
  valueKey?: string;
  confidence: Confidence;
  evidence: string;
}

function take<T>(s: Suggested<T>): T | undefined {
  return s.value === null ? undefined : s.value;
}

/**
 * What an output filename implies about its format. A sample results file
 * settles this properly by reading the content; this is the fallback for an
 * author who has not uploaded one. `.txt` is deliberately absent — it is either
 * a table or prose, and only the content says which.
 */
function formatFromPath(path: string): string | undefined {
  const lower = path.toLowerCase();
  if (lower.endsWith(".vcf") || lower.endsWith(".vcf.gz")) return "vcf";
  if (lower.endsWith(".tsv")) return "tsv";
  if (lower.endsWith(".csv")) return "csv";
  if (lower.endsWith(".json")) return "json";
  return undefined;
}

export function fieldsFromAutoConfig(
  config: AutoConfig,
  groups: Record<AutoConfigGroup, boolean>,
): AutoConfigApplied {
  const fields: AutoConfigFields = {};
  let needsBuild: boolean | undefined;

  if (groups.tool) {
    const name = take(config.tool.name);
    if (name) fields.name = name;
    const maintainer = take(config.tool.maintainer);
    if (maintainer) fields.maintainer = maintainer;
    const contact = take(config.tool.contact);
    if (contact) fields.contact = contact;
  }

  if (groups.env) {
    const language = take(config.docker.language);
    if (language) fields.language = language;
    const declared = take(config.docker.needs_build);
    const buildCmd = take(config.docker.build_cmd);
    const checkCmd = take(config.docker.check_cmd);
    if (buildCmd) fields.buildCmd = buildCmd;
    if (checkCmd) fields.checkCmd = checkCmd;
    // A build command is itself the statement that a build is needed; the flag
    // alone, with no command to run, would only hide empty inputs.
    if (declared !== undefined || buildCmd) needsBuild = declared === true || Boolean(buildCmd);
  }

  if (groups.run) {
    const cmd = take(config.run.cmd);
    if (cmd) fields.cmd = cmd;
    const timeout = take(config.run.timeout_minutes);
    if (timeout !== undefined) fields.timeout = String(timeout);
  }

  if (groups.inputs) {
    const type = take(config.inputs.type);
    if (type) {
      if (INPUT_TYPES.some((it) => it.slug === type)) {
        fields.inputType = type;
        fields.inputTypeCustom = "";
      } else {
        fields.inputType = "__other__";
        fields.inputTypeCustom = type;
      }
    }
    const fixture = take(config.inputs.fixture_path);
    if (fixture) fields.fixtureFilePath = fixture;
  }

  if (groups.outputs) {
    const outputPath = take(config.outputs.path);
    if (outputPath) {
      // A bare filename: the engine mounts /data/out and the manifest stores the
      // name, so a path the model wrote with its directory still lands right.
      fields.outputPath = outputPath.replace(/^.*\/data\/out\//, "").replace(/^\/+/, "");
      const format = formatFromPath(fields.outputPath);
      if (format) fields.outputFormat = format;
    }
  }

  const raised = new Set(config.compatibility.map((c) => c.flag));
  const compat = groups.compat
    ? (Object.fromEntries(
        COMPATIBILITY_FLAGS.map((flag) => [flag, raised.has(flag)]),
      ) as CompatibilityAnswers)
    : undefined;

  return { fields, needsBuild, compat };
}

function row(
  group: AutoConfigGroup,
  field: string,
  labelKey: string,
  s: Suggested<string | number | boolean>,
  display?: (value: string | number | boolean) => string,
): AutoConfigRow {
  return {
    group,
    field,
    labelKey,
    value: s.value === null ? null : display ? display(s.value) : String(s.value),
    confidence: s.confidence,
    evidence: s.evidence,
  };
}

export function autoConfigRows(config: AutoConfig): AutoConfigRow[] {
  const rows: AutoConfigRow[] = [
    row("tool", "name", "verified.submit.name", config.tool.name),
    row("tool", "maintainer", "verified.submit.maintainer", config.tool.maintainer),
    row("tool", "contact", "verified.submit.contact", config.tool.contact),
    row("env", "language", "verified.submit.language", config.docker.language),
    row("env", "buildCmd", "verified.submit.buildCmd", config.docker.build_cmd),
    row("env", "checkCmd", "verified.submit.checkCmd", config.docker.check_cmd),
    row("run", "cmd", "verified.submit.cmd", config.run.cmd),
    row("run", "timeout", "verified.submit.timeout", config.run.timeout_minutes),
    row("inputs", "inputType", "verified.submit.inputType", config.inputs.type),
    row(
      "inputs",
      "fixtureFilePath",
      "verified.submit.fixturePathInRepo",
      config.inputs.fixture_path,
    ),
    row("outputs", "outputPath", "verified.submit.outputPath", config.outputs.path),
  ];

  for (const raised of config.compatibility) {
    rows.push({
      group: "compat",
      field: raised.flag,
      labelKey: `verified.submit.preflight.${raised.flag}`,
      value: "",
      valueKey: "verified.submit.autoConfigApplies",
      confidence: raised.confidence,
      evidence: raised.evidence,
    });
  }

  return rows;
}

export function groupsWithRows(rows: AutoConfigRow[]): AutoConfigGroup[] {
  return AUTOCONFIG_GROUPS.filter((g) => rows.some((r) => r.group === g));
}

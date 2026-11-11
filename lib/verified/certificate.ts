/**
 * The certificate's words for a report that predates the engine writing
 * them. Mirrors harness/certificate_text.py; keep the two in step. A report
 * that carries `certificate` is printed as it is when no translator is
 * supplied; when `t` is given, every summary, conclusion, scope, limitation,
 * and out-of-scope item is localized into the active UI language.
 */
import type { VerifiedCertificate, VerifiedReport } from "@/types/verified";
import { VERIFIED_LEVELS } from "@/types/verified";
import { blockedBeforeInstall } from "./gate-state";

export const PURPOSE = "Verify that the tool installs, runs end-to-end, and produces structurally valid output.";
export const EXEC_SCOPE = "Installation, execution, and output structure verification.";
export const NOT_EVALUATED = ["Genotype accuracy", "Concordance", "Forensic validity", "Regulatory compliance"];
export const SCOPE_STATEMENT =
  "Independent automated verification of reproducible execution. It confirms the tool installs, runs end-to-end, and produces structurally valid output in a standardized environment.";
export const SCOPE_NOT =
  "This is not an analytical validation. Genotype accuracy, concordance, forensic suitability, and regulatory compliance are out of scope.";
export const DISCLAIMER =
  "Each result is a dated snapshot, verified on the tool's public repository at a pinned commit. STRhub does not store tool source code.";
export const OUT_OF_SCOPE = [
  "Genotype correctness or accuracy",
  "Concordance against known truth sets",
  "Sensitivity, specificity, or stutter performance",
  "Allele calling accuracy or forensic casework suitability",
  "Regulatory compliance or ISO accreditation",
  "Multi-laboratory or multi-dataset reproducibility",
];
export const LIMITATIONS = [
  "Single reference dataset per input type",
  "Single containerized environment (Docker / ubuntu-22.04)",
  "No truth-set comparison or ground-truth genotypes",
  "No accuracy or concordance assessment",
  "No forensic validation of results",
  "Short-read limitations apply (very long STR alleles may not span reads)",
];

const GATES = ["available", "installs", "runs", "io", "content"] as const;

type Translate = (key: string, params?: Record<string, string>) => string;

const VERDICT_REASON_EXACT: Record<string, string> = {
  "The tool installed and its run produced its documented output.":
    "verified.engineText.verdictReason.runs",
  "The build from the pinned commit failed. A published image was not counted as that commit running.":
    "verified.engineText.verdictReason.fallbackFailed",
  "STRhub could not work out how to install or run this tool from its repository. The README does not say enough for a stranger to run it; each missing item is listed below.":
    "verified.engineText.verdictReason.readmeInsufficient",
  "The pinned source could not be fetched.":
    "verified.engineText.verdictReason.sourceNotFetched",
  "The environment did not build from the declared install steps.":
    "verified.engineText.verdictReason.buildFailed",
  "The tool did not finish within the run's time limit, so it was stopped.":
    "verified.engineText.verdictReason.timeout",
  "The tool exited with an error before producing its documented output.":
    "verified.engineText.verdictReason.runFailed",
  "The tool ran to completion but produced no output in the documented format.":
    "verified.engineText.verdictReason.noOutput",
  "STRhub did not attempt a run it could attribute to the tool.":
    "verified.engineText.verdictReason.notAttributed",
};

const VERDICT_SUFFIXES: [string, string][] = [
  [
    " The installed program starts: it answers --help.",
    "verified.engineText.verdictSuffix.startsPass",
  ],
  [
    " The installed program does not start: --help fails.",
    "verified.engineText.verdictSuffix.startsFail",
  ],
  [
    " The repository's own documented example ran and produced its output.",
    "verified.engineText.verdictSuffix.examplePass",
  ],
];

export function localizeVerdictReason(
  reason: string | undefined,
  t: Translate,
): string | undefined {
  if (!reason) return undefined;
  let core = reason.trim();
  const suffixKeys: string[] = [];

  for (const [suffix, key] of VERDICT_SUFFIXES) {
    if (core.endsWith(suffix)) {
      core = core.slice(0, -suffix.length).trim();
      suffixKeys.unshift(key);
    }
  }

  let translatedCore = core;
  const exactKey = VERDICT_REASON_EXACT[core];
  if (exactKey) {
    const candidate = t(exactKey);
    if (candidate !== exactKey) translatedCore = candidate;
  } else {
    const mRaisedTimeout = core.match(
      /^The tool raised (.+), then did not finish within the run's time limit, so it was stopped\.$/,
    );
    const mRaised = core.match(
      /^The tool raised (.+) before producing its documented output\.$/,
    );
    const mLimits = core.match(
      /^STRhub could not complete a way to run this tool: (.+)\.$/,
    );
    const mInfra = core.match(
      /^STRhub's own infrastructure failed before the tool could be tested \((.+)\)\. Nothing here is a finding about the software; the run has to be repeated\.$/,
    );
    const mOutOfScope = core.match(
      /^The tool needs something the automated runner cannot provide: (.+)\. A manual verification can cover it\.$/,
    );
    const mProposal = core.match(
      /^The proposed way of running this tool did not work \((.+)\)\. That may be the proposal rather than the tool: a maintainer-supplied command would settle it\.$/,
    );

    if (mRaisedTimeout) {
      translatedCore = t("verified.engineText.verdictReason.raisedTimeout", {
        err: mRaisedTimeout[1],
      });
    } else if (mRaised) {
      translatedCore = t("verified.engineText.verdictReason.raised", {
        err: mRaised[1],
      });
    } else if (mLimits) {
      translatedCore = t("verified.engineText.verdictReason.incompleteRecipe", {
        detail: mLimits[1],
      });
    } else if (mInfra) {
      translatedCore = t("verified.engineText.verdictReason.infraFailed", {
        fault: mInfra[1],
      });
    } else if (mOutOfScope) {
      translatedCore = t("verified.engineText.verdictReason.outOfScope", {
        what: mOutOfScope[1],
      });
    } else if (mProposal) {
      translatedCore = t("verified.engineText.verdictReason.proposalFailed", {
        ids: mProposal[1],
      });
    }
  }

  const translatedSuffixes = suffixKeys
    .map((k) => {
      const s = t(k);
      return s !== k ? ` ${s}` : "";
    })
    .join("");

  return `${translatedCore}${translatedSuffixes}`;
}

export function localizeNeededItem(item: string, t: Translate): string {
  const exact: Record<string, string> = {
    "A regions configuration file, supplied with the submission rather than taken from the repository.":
      "verified.engineText.needed.regionsSubmitted",
    "Test data: no sample from the repository was used, so a public reference sample stood in.":
      "verified.engineText.needed.referenceDataUsed",
    "A container environment, built from the tool's declared install steps rather than from a recipe the repository ships.":
      "verified.engineText.needed.envGenerated",
    "A container environment, supplied with the submission.":
      "verified.engineText.needed.envSubmitted",
    'A container environment and a command written by STRhub, not taken from the repository\'s instructions; what they do differently is listed under "What STRhub had to do to run this tool".':
      "verified.engineText.needed.curatedRecipe",
  };
  if (exact[item]) {
    const val = t(exact[item]);
    if (val !== exact[item]) return val;
  }
  const mFallback = item.match(
    /^A container environment: the build from the pinned commit failed, so (.+) was built instead\. What ran is the version that environment holds, not necessarily the pinned commit\.$/,
  );
  if (mFallback) {
    return t("verified.engineText.needed.envFallback", { reason: mFallback[1] });
  }
  return item;
}

export function localizeCaveatItem(item: string, t: Translate): string {
  let m: RegExpMatchArray | null;

  if (
    (m = item.match(
      /^Environment: generated by STRhub from the repository's (.+) \((.+)\), at the pinned commit\.$/,
    ))
  ) {
    return t("verified.engineText.caveats.envGenerated", {
      source: m[1],
      method: m[2],
    });
  }
  if (
    (m = item.match(
      /^Input: the README documents (.+) \(line (\d+)\); this run used STRhub's (\S+) reference data\. The author recommends (.+) \(line (\d+): "(.+)"\)\.$/,
    ))
  ) {
    return t("verified.engineText.caveats.inputWithAuthorRec", {
      docFormat: m[1],
      line: m[2],
      dataset: m[3],
      recFormat: m[4],
      recLine: m[5],
      quote: m[6],
    });
  }
  if (
    (m = item.match(
      /^Input: the README documents (.+) \(line (\d+)\); this run used STRhub's (\S+) reference data\.$/,
    ))
  ) {
    return t("verified.engineText.caveats.inputUsed", {
      docFormat: m[1],
      line: m[2],
      dataset: m[3],
    });
  }
  if (
    (m = item.match(
      /^Panel: the loci file the documented command reads, shipped in the repository, lists coordinates inside STRhub's medical STR slice and none inside the forensic one; this run used the medical slice of the same sample \((.+)\)\.$/,
    ))
  ) {
    return t("verified.engineText.caveats.medicalPanelUsed", { dataset: m[1] });
  }
  if (
    (m = item.match(
      /^The output directory the command writes into \((.+)\) was created first\.$/,
    ))
  ) {
    return t("verified.engineText.caveats.outputDirCreated", { dir: m[1] });
  }
  if (
    (m = item.match(
      /^(\d+) input path\(s\) in the README command replaced with (.+)\.$/,
    ))
  ) {
    return t("verified.engineText.caveats.inputPathsReplaced", {
      n: m[1],
      path: m[2],
    });
  }
  if (
    (m = item.match(
      /^(\d+) input placeholder\(s\) in the README command replaced with (.+)\.$/,
    ))
  ) {
    return t("verified.engineText.caveats.inputPlaceholdersReplaced", {
      n: m[1],
      path: m[2],
    });
  }
  if (
    (m = item.match(
      /^(\d+) reference FASTA path\(s\) replaced with (.+)\.$/,
    ))
  ) {
    return t("verified.engineText.caveats.refPathsReplaced", {
      n: m[1],
      path: m[2],
    });
  }
  if ((m = item.match(/^(\d+) BED path\(s\) replaced with (.+)\.$/))) {
    return t("verified.engineText.caveats.bedPathsReplaced", {
      n: m[1],
      path: m[2],
    });
  }
  if (
    item ===
    "Run command: the README's own command, rewritten to STRhub's mounts; everything it created was captured as output."
  ) {
    return t("verified.engineText.caveats.runCmdReadme");
  }
  if (
    (m = item.match(
      /^Run command: the one documented in (.+) \(line (\d+)\), rewritten to STRhub's mounts; everything it created was captured as output\.$/,
    ))
  ) {
    return t("verified.engineText.caveats.runCmdDoc", {
      file: m[1],
      line: m[2],
    });
  }
  if (
    (m = item.match(
      /^Regions: STRhub's ready-made (\S+) file for the dataset's panel loci \(STRhub records the \S+ layout for a program of this name\)\.$/,
    ))
  ) {
    return t("verified.engineText.caveats.regionsReadyMade", { layout: m[1] });
  }
  if (
    item ===
    "A comma-separated input list in the documented command was reduced to its first file."
  ) {
    return t("verified.engineText.caveats.commaInputReduced");
  }
  if (
    (m = item.match(
      /^'(.+)' run as '(.+)' from the PATH: the build puts it there, not in the directory the documentation runs it from\.$/,
    ))
  ) {
    return t("verified.engineText.caveats.runFromPath", {
      orig: m[1],
      bin: m[2],
    });
  }
  if (
    (m = item.match(
      /^'str8rzr' config placeholder resolved to (.+) \(matches the dataset's ForenSeq kit\)\.$/,
    ))
  ) {
    return t("verified.engineText.caveats.str8rzrConfig", { config: m[1] });
  }

  return item;
}

export function localizeReadmeGap(
  gap: { item: string; text: string },
  t: Translate,
): string {
  const key = `verified.engineText.readmeGaps.${gap.item}`;
  const translated = t(key);
  return translated !== key ? translated : gap.text;
}

export function localizeBlocker(
  blocker: { code: string; what: string },
  t: Translate,
): string {
  const whatKey = `verified.engineText.blockers.${blocker.code}.what`;
  const what = t(whatKey);
  return what !== whatKey ? what : blocker.what;
}

function buildLocalizedConclusion(
  report: VerifiedReport,
  t: Translate,
): { title: string; body: string }[] {
  if (blockedBeforeInstall(report)) {
    return [{
      title: t("verified.certificate.conclusion.blockedTitle"),
      body: t("verified.certificate.conclusion.blockedBody"),
    }];
  }
  if (report.procedure_validation && (
    !report.procedure_validation.valid ||
    report.procedure_review?.may_say_runs !== true ||
    report.verdict?.basis === "strhub" ||
    (report.verdict?.code !== "runs" && report.verdict?.code !== "fails")
  )) {
    return report.certificate?.conclusion ?? [];
  }
  const toolDisplay = `${report.tool.name}${report.tool.version ? ` ${report.tool.version}` : ""}`.trim();
  const where = report.environment?.fallback_used
    ? t("verified.certificate.conclusion.whereFallback", {
        reason:
          report.environment?.fallback?.reason ??
          t("verified.trial.recipeFallbackReason"),
      })
    : t("verified.certificate.conclusion.whereClean");

  const gates = report.gates ?? {
    available: false,
    installs: false,
    runs: false,
    io: false,
    content: false,
  };

  const ran = gates.runs
    ? {
        title: t("verified.certificate.conclusion.runsTitle"),
        body: t("verified.certificate.conclusion.runsBody", {
          tool: toolDisplay,
          where,
        }),
      }
    : gates.installs
      ? {
          title: t("verified.certificate.conclusion.notRunsTitle"),
          body: t("verified.certificate.conclusion.notRunsBody", {
            tool: toolDisplay,
            where,
          }),
        }
      : {
          title: t("verified.certificate.conclusion.notInstallsTitle"),
          body: t("verified.certificate.conclusion.notInstallsBody", {
            tool: toolDisplay,
          }),
        };

  const stats = report.content_detail?.outputs?.[0]?.stats;
  const nLoci = String(stats?.distinct_str_loci ?? stats?.distinct_loci ?? 0);
  const rawFmt = (report.io_detail?.outputs?.[0]?.format ?? "").trim().toUpperCase();
  const fmt = rawFmt && rawFmt !== "—" ? `${rawFmt} ` : "";

  const produced = gates.content
    ? {
        title: t("verified.certificate.conclusion.plausibleTitle"),
        body: t("verified.certificate.conclusion.plausibleBody", {
          format: fmt,
          loci: nLoci,
        }),
      }
    : gates.io
      ? {
          title: t("verified.certificate.conclusion.ioTitle"),
          body: t("verified.certificate.conclusion.ioBody", { format: fmt }),
        }
      : {
          title: t("verified.certificate.conclusion.noOutputTitle"),
          body: t("verified.certificate.conclusion.noOutputBody"),
        };

  const items: { title: string; body: string }[] = [ran, produced];

  if (report.verdict?.code && report.verdict?.reason) {
    const vTitleKey = `verified.trial.verdict.${report.verdict.code}`;
    const vTitle = t(vTitleKey) !== vTitleKey ? t(vTitleKey) : report.verdict.title;
    const vReason =
      localizeVerdictReason(report.verdict.reason, t) ?? report.verdict.reason;
    items.push({
      title: t("verified.certificate.conclusion.verdictTitle", {
        verdict: vTitle,
      }),
      body: vReason,
    });
  }

  const td = report.repo_test_data;
  if (!td?.known) {
    items.push({
      title: t("verified.certificate.conclusion.refInputTitle"),
      body: t("verified.certificate.conclusion.refInputBody"),
    });
  } else if (td.present) {
    items.push({
      title: t("verified.certificate.conclusion.repoDataNotUsedTitle"),
      body: t("verified.certificate.conclusion.repoDataNotUsedBody", {
        count: String(td.count ?? 0),
      }),
    });
  } else {
    items.push({
      title: t("verified.certificate.conclusion.noDemoDataTitle"),
      body: t("verified.certificate.conclusion.noDemoDataBody", {
        tool: report.tool.name,
      }),
    });
  }

  items.push({
    title: t("verified.certificate.conclusion.reproTitle"),
    body: t("verified.certificate.conclusion.reproBody"),
  });

  return items;
}

/** The block the report carries, or the same texts assembled for an older one. */
export function certificateOf(
  report: VerifiedReport,
  label: string,
  t?: Translate,
): VerifiedCertificate {
  if (!t) {
    if (report.certificate?.schema) return report.certificate;
    const reached = (VERIFIED_LEVELS[report.level] ?? VERIFIED_LEVELS.none).label;
    const passed = GATES.filter((g) => report.gates?.[g]).length;
    return {
      schema: "strhub-verified/certificate/fallback",
      label,
      reached,
      summary: {
        purpose: PURPOSE,
        result: label,
        reached: `${reached}, ${passed}/${GATES.length} gates passed`,
        ...(report.verdict?.reason ? { why: report.verdict.reason } : {}),
        scope: EXEC_SCOPE,
        not_evaluated: NOT_EVALUATED,
      },
      conclusion: [],
      out_of_scope: OUT_OF_SCOPE,
      limitations: LIMITATIONS,
      scope: { statement: SCOPE_STATEMENT, not: SCOPE_NOT, disclaimer: DISCLAIMER },
    };
  }

  const levelKey = `verified.level.${report.level}`;
  const localizedLevel = t(levelKey);
  const reached =
    localizedLevel && localizedLevel !== levelKey
      ? localizedLevel
      : (VERIFIED_LEVELS[report.level] ?? VERIFIED_LEVELS.none).label;
  const passed = GATES.filter((g) => report.gates?.[g]).length;
  const gatesPassed = t("verified.summary.gatesPassed", {
    passed: String(passed),
    total: String(GATES.length),
  });
  const base = report.certificate;
  const rawWhy = base?.summary?.why ?? report.verdict?.reason;
  const why = localizeVerdictReason(rawWhy, t);

  return {
    schema: base?.schema ?? "strhub-verified/certificate/fallback",
    label,
    reached,
    summary: {
      purpose: t("verified.certificate.text.purpose"),
      result: label,
      reached: `${reached}, ${gatesPassed}`,
      ...(why ? { why } : {}),
      scope: t("verified.certificate.text.execScope"),
      not_evaluated: [
        t("verified.whatVerified.accuracy"),
        t("verified.whatVerified.concordance"),
        t("verified.whatVerified.forensicValidity"),
        t("verified.whatVerified.regulatory"),
      ],
    },
    conclusion: buildLocalizedConclusion(report, t),
    out_of_scope: [
      t("verified.certificate.outOfScopeItems.item1"),
      t("verified.certificate.outOfScopeItems.item2"),
      t("verified.certificate.outOfScopeItems.item3"),
      t("verified.certificate.outOfScopeItems.item4"),
      t("verified.certificate.outOfScopeItems.item5"),
      t("verified.certificate.outOfScopeItems.item6"),
    ],
    limitations: [
      t("verified.certificate.limitationItems.item1"),
      t("verified.certificate.limitationItems.item2"),
      t("verified.certificate.limitationItems.item3"),
      t("verified.certificate.limitationItems.item4"),
      t("verified.certificate.limitationItems.item5"),
      t("verified.certificate.limitationItems.item6"),
    ],
    scope: {
      statement: t("verified.trial.scope1"),
      not: t("verified.trial.scope2"),
      disclaimer: t("verified.disclaimer"),
    },
  };
}

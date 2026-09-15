export default {
  verified: {
    title: "STRhub Verified",
    description:
      "Independent, automated attestations that a forensic STR tool installs and runs end-to-end and produces plausible output, checked on its public source at a pinned commit. Not a claim of genotype accuracy or casework fitness.",
    summary: {
      heading: "Summary",
      level: "Level",
      datasets: "Datasets",
      gatesPassed: "{passed}/{total} gates passed",
      datasetsUsed: "{count} reference dataset(s)",
      noDatasets: "No datasets",
      verifiedDate: "Verified on {date}",
    },
    empty: "No attestations published yet.",
    verifiedOn: "Verified on",
    backToList: "All verified tools",
    source: "Source",
    variant: "Kit / variant",
    submittedBy: "Submitted by",
    submittedByValue: {
      maintainer: "The tool's maintainer",
      third_party: "A third party (not the tool's maintainer)",
    },
    thirdPartyShortfall:
      "This run was configured by a third party, not by the tool's maintainer. A result that stops short of the top step may reflect that configuration rather than the software itself.",
    submittedByThirdPartyNote:
      "This tool was submitted for verification by somebody other than its maintainer. The maintainer took no part in the run and supplied none of what it used: the command, the environment, and any target regions were chosen by the submitter. Any maintainer named above is who answers for the software — not who asked for this report, and not an endorsement of it.",
    commit: "Commit",
    environment: "Environment",
    environmentFallback: "Plan B: {reason}, after the build from the pinned commit failed.",
    ciRun: "CI run",
    gates: "Gates",
    scope: "Scope",
    scopeNote:
      "This is not a claim that the genotypes are correct, nor that the tool is fit for casework or meets any regulatory standard. Concordance against known truth is out of scope.",
    staticPage: "static report",
    disclaimer:
      "Each result is a dated snapshot, verified on the tool's public repository at a pinned commit. STRhub stores no tool source code.",
    group: {
      runs: "verification runs",
      runSingular: "1 verification run",
    },
    panel: {
      autosomal: "Autosomal STR",
      ont: "ONT CODIS",
      ystr: "Y-STR",
    },
    whatVerified: {
      verifiedHeading: "What was verified",
      notHeading: "Not verified",
      sourceAvailable: "Source available",
      installation: "Installation successful",
      execution: "End-to-end execution",
      outputGenerated: "Output generated",
      accuracy: "Genotype accuracy",
      concordance: "Concordance with truth sets",
      forensicValidity: "Forensic validity",
      regulatory: "Regulatory compliance",
    },
    col: {
      strLoci: "STR loci",
      snps: "SNPs",
      reads: "reads",
    },
    gate: {
      stoppedHere: "the run stopped here",
      notReached: "not attempted — the run had already stopped",
      available: "the pinned public source exists",
      installs: "the environment builds from source",
      runs: "it executes end-to-end without crashing",
      io: "it produces a non-empty file in the declared format",
      content: "its output looks like plausible genotype-bearing data",
      contentFailNote:
        "Note: The \"Plausible Output\" check did not pass because the output did not fully match the expected genotype pattern. This may be due to differences in parameters, tool version, or configuration. It does not necessarily indicate a serious error.",
      stoppedEarlyNote:
        "Stopping at this step is not a finding that the software is faulty. It records how far this particular attempt got. Software can stop early because a dependency it names is no longer available, because it expects input arranged differently from the reference sample, or because the automated environment cannot supply something it needs.",
      howToReadLink: "How to read this result",
    },
    howToRead: {
      title: "How to read a result",
      lede:
        "A result is a dated record of what happened when STRhub installed a piece of forensic STR software and ran it, at one fixed version of the source code, on reference data the developer did not choose. It is produced automatically, and anyone can repeat it.",
      stoppedHeading: "When a result stops early",
      stoppedBody:
        "A result below the top step is not a finding that the software is faulty. It records how far this particular attempt got. Software can stop early because a dependency it names is no longer available, because it expects input arranged differently from the reference sample, or because the automated environment cannot provide something it needs, such as commercially licensed components.",
      stoppedBody2:
        "Every result names where it stopped and shows the messages on screen when it did. That detail is the point. The step reached is only the headline.",
      canHeading: "Questions a result can answer",
      can1: "Is the code public at the version the manuscript cites, today?",
      can2: "Can somebody other than the authors install it from the instructions given?",
      can3: "Does it run to completion on data the authors did not select?",
      can4: "Does it return output that looks like real marker calls?",
      can5: "What did it need that a standard environment could not supply?",
      can6: "Who submitted it for verification — its maintainer, or somebody else?",
      cannotHeading: "Questions it cannot answer",
      cannot1: "Are the genotypes correct?",
      cannot2: "Does it agree with a reference profile or another method?",
      cannot3: "Is it suitable for casework, or accredited for it?",
      cannot4: "Is it better or worse than another tool?",
      cannot5: "Does it perform as reported in the manuscript?",
      cannot6: "Does its maintainer stand behind this result?",
      developerHeading: "For a developer",
      developerBody:
        "A result describes one environment, and software that works on the machine it was written on can still stop here. That gap is usually the useful part: it is what a new user meets on their first day. Every result links the full log and the exact commands used, so a result can be reproduced locally.",
    },
    needed: {
      heading: "What this run needed beyond the repository",
      note: "The result above describes a run configured as follows. Anyone repeating it needs the same things.",
    },
    caveats: {
      heading: "Notes from reading the repository",
      note: "Recorded automatically from the tool's public files when this run was configured. Not verified by execution, and not part of the gates above. Useful for what to check by hand.",
    },
    log: {
      build: "Build",
      view: "View execution log",
    },
    errorsBadgeSuffix: "(errors reported)",
    upstream: {
      head: "This is the head of {branch} today.",
      behind: "{n} commit(s) have landed on {branch} since. That is context, not a fault — a pinned release is often meant to sit behind.",
      refGone: "This commit is no longer reachable in the repository. The result still describes what ran, but the source cannot be fetched to repeat it.",
      repoGone: "The public repository is no longer reachable at this URL, so nothing here can be re-checked against its source.",
    },
    install: {
      heading: "Why the environment did not build",
      note: "The container could not be built from the declared install steps, so nothing below the Installs gate ran.",
      headingFallback: "Why the pinned commit did not build",
      noteFallback:
        "The container could not be built from the declared install steps at the pinned commit; {reason} was built instead, and every gate below ran on it. What ran is the version that environment holds, not necessarily the pinned commit.",
      faultStrhub:
        "At least one cause is STRhub's, not the tool's: the container recipe for a generated environment is ours. Nothing here is a finding about the software, and nothing needs fixing on the author's side.",
      faultHarness:
        "At least one cause is a ceiling of the free automated environment rather than a fault in the tool.",
      faultAuthor:
        "Every cause identified sits in what the submission declared — its pinned versions, package names or build steps. These are correctable, and re-verifying afterwards is free.",
      faultAuthorThirdParty:
        "Every cause identified sits in what the submission declared — its pinned versions, package names or build steps — and that submission came from a third party, not from the tool's maintainer. They are faults in how the tool was set up here rather than in the software. Re-verifying after correcting them is free.",
      faultUnknown:
        "The cause could not be classified automatically. The full build output is linked below.",
      viewBuildLog: "View build log",
    },
    diagnostics: {
      heading: "Auto-diagnostics",
      note: "Issues detected automatically from the execution log. Suggestions may help resolve failures.",
      strhubNoteLabel: "STRhub Verified note",
      logIssuesLabel: "Issues from execution log",
      timesLabel: "{n}×",
      affectedLabel: "Affected:",
      sliceCaveat:
        "Some of these errors occurred on STRhub's reference sample, which is a slice around the panel loci rather than a whole genome, so they may reflect the sample's coverage rather than the tool.",
      structuralNote:
        "Structural errors, such as a file that will not open, an unrecognized command-line flag, or an incomplete build, do not depend on the sample: a coverage-limited slice yields fewer reads, but it cannot cause them. These are not attributable to STRhub's reference sample.",
      demoDataRecommendation:
        "A small test file in the tool's own repository lets a new user run it on their first day and see it working before trusting it with their own data, and it lets a verification run against the author's sample as well as STRhub's slice. Publishing the output that file should produce helps just as much: it shows what the results are meant to look like, which is what a reader needs to tell a correct run from one that merely finished.",
      sampleNote:
        "These messages reflect the behavior observed during verification with a small test BAM slice provided by STRhub. With full-coverage sequencing data, the tool is expected to genotype significantly more loci. The warnings do not indicate a problem with the tool itself.",
      ids: {
        too_few_reads: { title: "Loci skipped (too few reads)", suggestion: "Some loci had insufficient reads after quality filtering. Try lowering --min-reads or relaxing quality filters. The input BAM may also need more coverage at STR regions." },
        low_bq_reads: { title: "Reads filtered by base quality", suggestion: "Many reads are being removed by the base quality filter. For HipSTR, use --read-qual-trim '!' to lower the quality trimming threshold." },
        unpaired_reads: { title: "Reads filtered (no mate pair)", suggestion: "Reads without mate pairs are being filtered. This is common with BAM slices where mates fall outside the sliced region." },
        no_read_groups: { title: "BAM/CRAM missing read groups (@RG)", suggestion: "Add read groups with: samtools addreplacerg -r '@RG\\tID:sample\\tSM:sample' input.bam -o output.bam" },
        bad_bam: { title: "Invalid or truncated BAM file", suggestion: "The BAM file may be corrupted or incomplete. Re-download or re-index it." },
        file_not_found: { title: "File not found", suggestion: "Check that the input path matches the manifest and that the fixture was staged correctly." },
        cannot_open: { title: "Cannot open file", suggestion: "Verify the path exists and the file format is correct." },
        segfault: { title: "Tool crashed (segmentation fault)", suggestion: "This may indicate incompatible input data, a bug in the tool, or insufficient memory." },
        oom: { title: "Out of memory", suggestion: "Try reducing the input data size or increasing the timeout." },
        cmd_not_found: { title: "Command not found", suggestion: "Check the Dockerfile installs it and the PATH includes its location." },
        zero_genotyped: { title: "No loci were genotyped", suggestion: "All loci were filtered out. Check read quality filters, minimum read thresholds, and input data coverage." },
        genotyping_summary: { title: "Genotyping summary", suggestion: "" },
        bad_option: { title: "Unrecognized command-line option", suggestion: "Check the tool's --help or README for the correct option name." },
      },
    },
    content: {
      heading: "Output content (plausibility evidence)",
      records: "Sequence records",
      strLoci: "STR loci detected",
      snps: "identity SNPs (rsNNNN)",
      totalReads: "Total reads across calls",
      strLociList: "STR loci",
    },
    data: {
      heading: "Verification data",
      note: "Public reference datasets used as input for this verification run. Sourced from open-access repositories; see upstream licenses for terms of use.",
      lociTested: "Loci tested",
      lociCount: "forensic STR loci",
      lociScope: "This verification only covers the specific STR loci listed above. The tool may support additional loci not tested by this reference dataset.",
      refGenome: "Ref. genome",
      noOwnData: "This tool does not include its own demo or test data in its repository. STRhub ran the verification using a pre-built slice from public reference data (listed below). A small test file in the repository lets a new user run the tool on their first day and see it working before trusting it with their own data, and it lets a verification run against the author's own sample as well as this one. Publishing the output that file should produce helps just as much: it shows what the results are meant to look like.",
    },
    matrix: {
      heading: "Verification matrix",
      own: "Tool test data",
      external: "Reference dataset",
      readme: "README",
      na: "N/A",
      pass: "Pass",
      fail: "Fail",
      dataset: "Dataset",
      strhubFixture: "STRhub fixture",
      strhubFixtureNote:
        "This tool does not include its own demo or test data in its repository. STRhub ran the verification using a pre-built slice from public reference data.",
    },
    readme: {
      heading: "README check (advisory)",
      note: "Presence checklist on the tool's README, advisory only, never pass/fail.",
      install: "Install / environment setup",
      command: "Run command",
      input: "Expected input",
      output: "Produced output",
      deps: "Dependencies / versions",
    },
    manual: {
      heading: "Manual verification available",
      pageTitle: "Manual verification",
      pageSubtitle:
        "The automated verification could not be run for this tool. STRhub can run it by hand instead and issue a separate certificate.",
      backToReport: "Back to the attestation",
      whyHeading: "Why the automated run does not apply",
      notAFault:
        "This is a limit of the automated environment, not a fault found in your tool. The free automated check remains available and unchanged for tools it can run.",
      whatItIs:
        "Manual verification is a separate, paid service: STRhub runs the tool by hand and issues a certificate explicitly labelled as manually verified, never presented as an automated attestation.",
      cta: "Request manual verification",
      reasonCodeLabel: "Eligibility reason code:",
      toolLabel: "Tool",
      whatYouGetHeading: "What manual verification includes",
      whatYouGet1:
        "STRhub runs your tool by hand in an environment that meets its requirements, and records what was done.",
      whatYouGet2:
        "A certificate explicitly labelled manual verification, stating the environment, the data used, and the date.",
      whatYouGet3:
        "The same scope limits as the automated attestation: reproducible execution only, with no claim about genotype accuracy or casework fitness.",
      emailCta: "Email a request",
      emailHint:
        "Opens your email client with the tool and reason code already filled in.",
      mailSubject: "Manual verification request",
      mailIntro:
        "Hello, I would like to request manual verification for the tool below.",
      notEligibleHeading: "The free automated verification still applies here",
      notEligibleBody:
        "This tool has not hit a limit of the automated environment, so manual verification does not apply. If a run failed, the report lists what went wrong and how to fix it. Corrections to a submission are free to re-run as often as you need.",
      freeHelp:
        "Stuck on the form or unsure what a field wants? That is our documentation to fix, not a reason to pay: write to us and we will help at no cost.",
      freeHelpCta: "Ask for help (free)",
      helpMailSubject: "Help with the STRhub Verified submission form",
      reasons: {
        requires_gui:
          "The tool needs a graphical display or an interactive step. The automated runner is headless and runs unattended, so it cannot execute or evidence that step.",
        requires_gpu:
          "The tool needs GPU hardware. Public CI runners are CPU-only, so the automated environment cannot provide it.",
        requires_runtime_network:
          "The tool fetches data over the network while running. An attestation is a pinned snapshot, so anything downloaded at run time cannot be recorded or reproduced.",
        requires_licensed_reference:
          "The tool needs licensed or restricted reference data that cannot be published in a public verification run.",
        requires_unsupported_os:
          "The tool needs an operating system the automated runner does not provide.",
        opaque_output_format:
          "The tool writes a binary or proprietary output with no text or tabular export, so the automated IO and content checks cannot inspect it.",
        oom: "The run exhausted the CI runner's memory. The automated environment has a fixed memory budget that cannot be raised from the form.",
        disk_full:
          "The run filled the CI runner's disk. The automated environment has a fixed disk budget that cannot be raised from the form.",
        runtime_network:
          "The tool reached for the network while running. An attestation is a pinned snapshot, so anything downloaded at run time cannot be recorded or reproduced.",
        requires_license:
          "The tool needs a license or licensed data that cannot be published in a public verification run.",
      },
    },
    submit: {
      preflightTitle: "Does your tool need something we cannot provide?",
      preflightHint:
        "Only tick a box if it is true of your tool. These are things the automated runner genuinely cannot do: it is headless, CPU-only, and has fixed memory and disk. Leave them all unticked if none apply. If you are simply unsure about a field on this form, leave these alone and write to us: form questions are answered free.",
      preflight: {
        requires_gui:
          "It needs a graphical display or an interactive step (it cannot run unattended).",
        requires_gpu: "It needs a GPU (CUDA).",
        requires_runtime_network:
          "It downloads data over the network while running (build-time downloads are fine).",
        requires_licensed_reference:
          "It needs licensed or restricted reference data that cannot be made public.",
        requires_unsupported_os:
          "It needs Windows, macOS, or another OS other than Linux.",
        opaque_output_format:
          "Its output is binary or proprietary, with no text or tabular export.",
      },
      preflightBlockedTitle: "The automated run cannot verify this tool",
      preflightBlockedBody:
        "Based on what you ticked, the automated environment cannot run your tool, so submitting would only spend a run on a failure you have already described. Manual verification exists for exactly this case.",
      cta: "Verify a tool",
      title: "Verify a tool",
      subtitle:
        "Self-service certification that your tool installs and runs end-to-end on its public source at a pinned commit.",
      disclaimerSnapshot:
        "The result is a dated snapshot. You may make the repo private afterwards. The attestation records the conditions at run time.",
      disclaimerNoSource:
        "STRhub never stores your source code. The Dockerfile clones your public repo at the pinned commit only at build time.",
      required: "required",
      optional: "optional",
      sectionTool: "Tool",
      sectionSource: "Public source",
      sectionSourceHint: "The public GitHub repository that contains your tool's source code.",
      sectionEnv: "Environment",
      sectionRun: "Execution",
      sectionInputs: "Input data",
      sectionInputsHint:
        "Choose your assay type and the path to a test file in your public repository. STRhub runs your tool on that data. If we have a compatible open-source reference dataset, we add a second run for an extra validation layer.",
      referenceDatasetsTitle: "STRhub reference datasets (open access, STR loci only)",
      referenceDatasetsIntro:
        "For compatible assay types, STRhub also tests your tool against an open-source STR reference dataset. There are currently two:",
      referenceDatasetsIntro3:
        "For compatible assay types, STRhub also tests your tool against an open-source STR reference dataset. There are currently three:",
      referenceDatasetsIntro4:
        "For compatible assay types, STRhub also tests your tool against an open-source STR reference dataset. There are currently four:",
      referenceDatasetIllumina:
        "NIST Forensic DNA Open Dataset (ForenSeq & PowerSeq 46GY, research/training use)",
      referenceDatasetOnt:
        "1000 Genomes ONT CODIS slice (open access on AWS)",
      referenceDatasetIlluminaBamDesc:
        "GIAB NA12878 300x hg38 slice (open access, 24 autosomal forensic loci)",
      referenceDatasetIlluminaBamYDesc:
        "GIAB HG002 300x hg38 slice (open access, 14 Y-STR loci)",
      referenceDatasetsScope:
        "No reference datasets for SNP panels, raw ONT FASTQ, or capillary FSA/HID. For those types, verification uses only your test file (not a failure). STRhub is not a data custodian. See upstream licenses.",
      inputTypeGroupWithReference: "STRhub reference datasets",
      inputTypeGroupOwnOnly: "Your test file only",
      inputTypeGroupAdvanced: "Advanced",
      inputTypeSuffixWithReference: ", includes STRhub test",
      inputTypeSuffixOwnOnly: ", your fixture only",
      sectionOutputs: "Expected output",
      sectionOutputsHint:
        "Tell us what file your run command writes and what type of data it contains. You do not need to know STRhub internals, just match your tool's own documentation.",
      name: "Tool name",
      variant: "Kit or configuration variant",
      variantTooltip:
        "Use this when the same tool at the same commit is verified more than once with different configurations — STRait Razor with ForenSeq and with PowerSeq, for example. Each variant gets its own attestation and its own permanent link. Leave it blank if there is only one.",
      slugPreview: "This will be published at",
      submitterRole: "Your relationship to this tool",
      submitterRoleTooltip:
        "Everything below — the command, the environment, the target regions — is published as part of the attestation, and this is what says whose choices they were. A GitHub account tells us who owns a repository; it never tells us who filled in this form.",
      submitterRoleOption: {
        maintainer: "I maintain this tool",
        third_party: "I am not its maintainer",
      },
      submitterRoleDesc: {
        maintainer:
          "You wrote it, or you answer for it. The attestation records that its maintainer submitted it.",
        third_party:
          "You are verifying somebody else's tool. The attestation says so, and records that its maintainer was not involved and did not supply the configuration.",
      },
      maintainer: "Maintainer",
      maintainerThirdParty: "Maintainer of the tool (not you)",
      maintainerThirdPartyNote:
        "Published as the person who answers for the software, alongside a note that they took no part in this verification.",
      contact: "Contact (issue tracker or email)",
      repo: "Public GitHub repo URL",
      ref: "Commit SHA or release tag (immutable)",
      refHint: "A specific commit hash or tag. Ensures we always test the exact same code.",
      fetchLastSha: "Fetch last commit SHA",
      useLatestTag: "Use the latest release tag ({tag})",
      versionDerived: "Recorded on the attestation as version {version}.",
      repoLookupLoading: "Reading the repository…",
      repoLookupError:
        "We couldn't read that repository. Check the URL — it must be a public GitHub repo. You can still fill the form in by hand.",
      lockedUntilSource:
        "Fill in the public source above first. The rest of this form is built from your repository and the commit you pin.",
      prefillConflictTitle: "Keep what you typed, or use your repository's details?",
      prefillConflictBody:
        "These fields already had a value, so nothing was changed. Here is what we found:",
      prefillAccept: "Use these values",
      prefillKeep: "Keep mine",
      preflightSummaryNone: "Nothing ticked — the automated run applies to this tool.",
      preflightSummarySelected: "{n} ticked.",
      reuseTitle: "Reuse a previous run",
      reuseHint:
        "This repository has been verified before. Bring those answers back and change only what moved.",
      reuseGroup: {
        env: "Environment",
        inputs: "Input data",
        run: "Execution",
        outputs: "Expected output",
      },
      reuseApply: "Reuse",
      reuseShowMore: "Show {n} more run(s)",
      reuseApplied:
        "Answers refilled from that run. Check them before submitting — the commit you pinned above is untouched.",
      reuseUnavailable:
        "We couldn't load that run's settings. It may predate saved submissions — fill the form in by hand.",
      reuseRegionsFile: "regions.bed (reused from a previous run)",
      autoConfigTitle: "Automatic configuration",
      autoConfigHint:
        "Optional. We read your repository at the commit you pinned and propose the answers below. Nothing is filled in until you have reviewed it.",
      autoConfigSummaryIdle: "Not used — fill the form in by hand, or let us propose the answers.",
      autoConfigSummaryApplied: "Applied. Check every field before submitting.",
      autoConfigOwnDockerfile: "I will provide the Dockerfile",
      autoConfigDockerfileHint:
        "Paste the complete Dockerfile. STRhub builds it unchanged, so nothing about your environment is guessed.",
      autoConfigSampleLabel: "Sample results file from a previous run",
      autoConfigLocalOnly:
        "Read in your browser to work out the output format and column layout. The file is never uploaded.",
      autoConfigSampleApplied: "Read {file} — the expected-output section below is filled in.",
      autoConfigGenerate: "Configure automatically",
      autoConfigUseSaved: "Use a saved configuration ({n})",
      autoConfigWorking: "Reading the repository and working out how your tool builds and runs. This can take a couple of minutes.",
      autoConfigAppliedNote:
        "Answers filled in from the automatic configuration. Check them before submitting — the commit you pinned above is untouched.",
      autoConfigReview: "Review",
      autoConfigReviewHint:
        "Everything here was read out of your repository. Tick the groups you want, check the values, then fill the form in.",
      autoConfigExactRef: "This exact commit",
      autoConfigFromRef: "Generated from {ref}",
      autoConfigMayBeStale: "may be out of date",
      autoConfigOldVersion: "generated by an earlier version",
      autoConfigWhatIsSent:
        "Only the repository URL and the commit are sent to our server. Your sample results file and your Dockerfile are read in your browser and stay there.",
      autoConfigStaleTitle: "The build files have changed since this was generated",
      autoConfigStaleBody:
        "A Dockerfile, manifest or Makefile differs at the commit you pinned. The build answers below may no longer be right — check them, or configure again.",
      autoConfigNotFound: "Not found in the repository",
      autoConfigApplies: "Applies to this tool",
      autoConfigCaveats: "Worth checking by hand",
      autoConfigApply: "Fill in the form",
      autoConfigCancel: "Cancel",
      autoConfigHigh: "Cited",
      autoConfigLow: "Uncertain",
      autoConfigGroup: {
        tool: "Tool",
        env: "Environment",
        run: "Execution",
        inputs: "Input data",
        outputs: "Expected output",
        compat: "Limitations",
      },
      autoConfigRepoNotFound: "We could not read that repository. Check it is public and the URL is right.",
      autoConfigRefNotFound: "That commit or tag does not exist in the repository.",
      autoConfigEmptyRepo: "That repository looks empty at the commit you pinned.",
      autoConfigDeclined: "We could not configure this repository automatically. Fill the form in by hand.",
      autoConfigDisabled: "Automatic configuration is not available right now.",
      autoConfigFailed: "Automatic configuration failed. Try again, or fill the form in by hand.",
      refTooltip:
        "On GitHub, open your public repository. For a release: go to Releases and copy the tag name (e.g. v3.0). For a commit: open Code, click a commit in the history, and copy the full SHA (40 characters) or the short hash shown at the top. Paste it here. STRhub will clone exactly that version every time.",
      refTooltipAria: "How to find a commit SHA or release tag on GitHub",
      dockerMode: "How should the environment be built?",
      dockerModeTooltip:
        "STRhub runs your tool inside Docker. Generate it for me: you choose the language and install command; STRhub writes the Dockerfile, clones your repo at the pinned ref, and runs the build. I'll provide a Dockerfile: you paste a complete Dockerfile and STRhub builds it unchanged. Use that if you already ship one or need full control.",
      dockerModeTooltipAria: "What the two environment build options mean",
      dockerProvided: "I'll provide a Dockerfile",
      dockerGenerated: "Generate it for me",
      dockerProvidedHint: "Paste a complete Dockerfile (camino A, maximum control).",
      dockerGeneratedHint:
        "STRhub builds the Dockerfile from a template (camino B, pip/conda/make).",
      dockerfile: "Dockerfile contents",
      language: "Language / stack",
      needsBuild: "My tool needs to be built from source code",
      needsBuildHint:
        "Tick this if your tool has to be compiled or installed before it can run — pip install, make, cargo build. Leave it unticked for a script or a committed binary that runs straight from the clone.",
      buildCmd: "Build / install command",
      buildCmdTooltip:
        "Command run while building the Docker image, after cloning your repo. Usually your install steps, e.g. pip install, make, or conda env create. If it fails, verification stops at the Installs gate.",
      buildCmdTooltipAria: "What the build or install command is for",
      buildCmdNone: "no build step",
      checkCmd: "Build-time sanity check command",
      checkCmdTooltip:
        "Optional. A short command run once during the image build to confirm the install worked, e.g. mytool --help or mytool --version. Leave blank if you are not sure.",
      checkCmdTooltipAria: "What the build-time sanity check command is for",
      cmd: "Run command (reads /data/in, writes /data/out)",
      cmdTooltip:
        "Command STRhub runs inside the container at verification time. Input files are read-only under /data/in/; write outputs under /data/out/. Use container paths, not paths on your computer or in the GitHub tree.",
      cmdTooltipAria: "What the run command is and how paths work",
      cmdReplaceMytool: "Replace \"mytool\" with the actual binary or command that runs your tool (e.g. hipstr, strait_razor, toastr). The rest of the paths are correct.",
      cmdFetchingReadme: "Reading your repo's README…",
      cmdSuggestFromReadme: "Suggested from your README — click to use:",
      cmdHint: "Your tool reads input from /data/in/ and writes output to /data/out/.",
      cmdHintWithRef: "Your tool reads input from /data/in/, the reference genome from {mountPath}, and writes output to /data/out/.",
      refGenomeTitle: "Reference genome: {assembly}",
      refGenomeDescription: "STRhub automatically provides the reference genome indexed and ready at {mountPath}. Use this path for --fasta or equivalent parameters in your run command.",
      refGenomeNote: "The reference genome ({assembly}) is automatically downloaded, indexed, and mounted by STRhub.",
      canonicalPathsTitle: "Use these standard paths in your run command",
      canonicalPathsDescription: "STRhub renames all input files to standard names so the same command works for both your data and our reference dataset. Use exactly these paths:",
      sliceNoticeTitle: "Our reference sample is a slice, not a whole genome",
      sliceNoticeBody:
        "STRhub does not host full genomes. The reference data for this input type is a small extract around forensic STR markers. A tool aimed outside those markers finds no reads there, so the run says nothing about the tool.",
      sliceNoticeDownload: "Download the supported coordinates (BED, GRCh38)",
      timeout: "Timeout (minutes)",
      inputType: "What kind of data does your tool take?",
      inputTypeSelect: "Select input type",
      inputTypeDescIlluminaStrFastq:
        "Illumina MiSeq/MiniSeq STR FASTQ: Verogen ForenSeq or Promega PowerSeq 46GY (the only two kits in our NIST reference dataset for now)",
      inputTypeDescOntBamHg38: "Oxford Nanopore BAM aligned to hg38 (CODIS regions)",
      inputTypeDescIlluminaBamHg38: "Illumina WGS BAM aligned to hg38 (autosomal forensic STR loci)",
      inputTypeDescIlluminaBamHg38Y: "Illumina WGS BAM aligned to hg38 (Y-chromosome STR loci)",
      inputTypeDescOntFastq: "Oxford Nanopore raw FASTQ reads",
      inputTypeDescIlluminaSnpFastq: "Illumina FASTQ for identity/ancestry SNP panels",
      inputTypeDescCapillaryFsa: "ABI .fsa or .hid capillary fragment analysis files",
      inputTypeOther: "Other (I'll type it)",
      inputTypeCustom: "Custom input type slug",
      inputTypeCustomHint:
        "A short identifier, e.g. 'pacbio-hifi-bam'. No STRhub reference dataset exists for custom types.",
      externalRunsBoth:
        "STRhub will run two verifications: one on your test file, and one on our reference dataset.",
      externalRunsOurs:
        "STRhub will run one verification, on our reference dataset — you said the repository has no test file.",
      externalDetailIllumina:
        "The reference is NIST mds2-2157 Illumina STR data, which covers ForenSeq and PowerSeq 46GY only; use kit-matched reads in your own fixture.",
      externalDetailOnt:
        "The reference is a 1000 Genomes ONT hg38 CODIS slice (~30 MB).",
      externalDetailIlluminaBam:
        "The reference is a GIAB NA12878 300x hg38 slice covering 24 autosomal forensic STR loci (female sample, no Y markers).",
      externalDetailIlluminaBamY:
        "The reference is a GIAB HG002 300x hg38 slice covering 14 Y-STR forensic loci (male sample).",
      externalNoteIllumina:
        "STRhub will run two tests: on your file and on NIST mds2-2157 Illumina STR data. Our NIST reference covers ForenSeq and PowerSeq 46GY only. Use kit-matched reads in your own fixture.",
      externalNoteOnt:
        "STRhub will run two tests: on the test BAM from the tool's repository (if provided) and on a 1000 Genomes ONT hg38 CODIS slice (~30 MB).",
      externalNoteIlluminaBam:
        "STRhub will run two tests: on the test BAM from the tool's repository (if provided) and on a GIAB NA12878 300x hg38 slice. The reference dataset covers 24 autosomal forensic STR loci (female sample, no Y markers).",
      externalNoteIlluminaBamY:
        "STRhub will run two tests: on the test BAM from the tool's repository (if provided) and on a GIAB HG002 300x hg38 slice. The reference dataset covers 14 Y-STR forensic loci (male sample).",
      externalNoteOwnOnly:
        "STRhub will run one test with your file only. There is no STRhub reference dataset for this input type (not a failure).",
      fixtureLabel: "Your test file (required)",
      fixtureLabelRecommended: "Your test file (recommended)",
      fixtureExplainer:
        "Required. Point to a small, publicly accessible test file at the ref you specified.",
      fixtureExplainerOptional:
        "Recommended. For a stronger verification, point to a test file in your repo — STRhub will run both your data and our reference dataset. If your repo doesn't include test data, leave blank and STRhub will run with our reference dataset only.",
      fixtureRequiredError: "A test file is required for this input type (no STRhub reference dataset available).",
      fixtureSameRepo: "It's in my tool's repo",
      fixtureOtherRepo: "It's in a different repo",
      fixtureNone: "I don't have a test file",
      fixtureNoneNote:
        "STRhub will verify your tool on our reference dataset only. That is a valid result, just a narrower one: it shows your tool runs on our data, not on yours.",
      fixtureSameRepoNote: "Using repo {repo} at ref {ref}.",
      fixturePathInRepo: "Path to the test file in the repo",
      fixturePathInRepoTooltip:
        "Path to your small test file inside the repo and ref you specified, relative to the repo root. Example: test/data/sample.fastq. The file must exist at that ref on GitHub so STRhub can fetch it for the run.",
      fixturePathInRepoTooltipAria: "How to specify the test file path in the repository",
      fixturePathHint: "Relative path from the repo root, e.g. test/data/sample.fastq",
      fixtureRepo: "Test data repo URL",
      fixtureRef: "Commit / tag",

      // Regions BED — required for coordinate-based tools.
      regionsLabel: "Your regions BED file",
      regionsExplainer:
        "Required for tools that read BAM files. Every tool expects its own BED layout (HipSTR, GangSTR and others use different columns), so the BED is yours to define. STRhub supplies the coordinates: download the panel below, convert it to your tool's format, and upload it.",
      regionsLibraryLabel: "Regions file",
      regionsLibraryHint: "STRhub has the reference sample's forensic loci ready in each of these layouts, generated from hg38. Pick the one your tool reads; upload your own only if none fits.",
      regionsLibraryOption: {
        hipstr: "7 columns: chrom, start, end, period, reference copies, name, motif",
        gangstr: "5 columns: chrom, start, end, period, motif",
        strsearch: "11 columns: coordinates, period, allele, names, structure, strand, 5' and 3' flanking sequences",
        bed4: "4 columns: chrom, start, end, name (plain BED)",
        upload: "None of these: upload my own regions file",
      },
      regionsLibraryUsedBy: {
        hipstr: "The layout HipSTR reads with --regions.",
        gangstr: "The layout GangSTR reads with --regions.",
        strsearch: "The layout STRsearch reads with --ref_bed.",
        bed4: "Plain BED; most tools that take a BED read this.",
      },
      regionsPreview: "Preview the first lines",
      regionsPreviewHide: "Hide preview",
      regionsPreviewError: "Could not load the preview.",
      regionsDetected: "This looks like the {format}, with {count} regions. STRhub has a ready-made file in that layout with only the loci the reference sample covers.",
      regionsUseLibrary: "Use STRhub's file instead",
      regionsUploadLabel: "Upload your BED",
      regionsUploadPlaceholder: "Choose a .bed file…",
      regionsUploadHint:
        "The file you built from the panel above, in your tool's format. Plain-text .bed — not gzipped. Checked against the panel here before you submit.",
      regionsGzip:
        "That file is gzipped. Decompress it first (gunzip) and upload the plain-text .bed.",
      supportedLociTitle: "Loci our sample supports ({count})",
      supportedLociExplainer:
        "Our test sample is a slice around these forensic loci, not a whole genome. Your BED must target these regions: outside them there are no reads, so your tool could not call anything.",
      supportedLociDownload: "Download coordinates (BED, GRCh38)",
      panelLoading: "Loading supported loci…",
      panelError:
        "We couldn't load the supported-loci panel. You can still submit: STRhub validates your BED before running.",
      regionsMalformed: "The BED is malformed:",
      regionsMalformedGeneric: "We couldn't parse that file as a BED.",
      regionsUnconverted:
        "This looks like our coordinate panel, uploaded as-is. The coordinates are right, but the columns are still ours — most tools (HipSTR, GangSTR) expect their own layout and would reject it. Convert it to your tool's format before running.",
      regionsRepoTip:
        "Tip: commit this BED to your tool's repo (e.g. regions/strhub-verified.bed) so anyone using your tool has the exact regions this attestation covers. STRhub verifies the file you upload here, not the repo copy.",
      regionsOk: "Your BED covers {covered} of {total} supported loci. Ready to verify.",
      regionsRejectedTitle: "This BED targets regions outside our sample",
      regionsRejectedExplainer:
        "These regions aren't covered by our slice, so your tool would find no reads there. This is not a problem with your tool — adjust the BED to the panel above.",
      regionsLinePrefix: "line {line}:",
      regionsAndMore: "…and {n} more.",
      regionsTooFewLoci:
        "Your BED covers {covered} supported loci; we need at least {min} to verify.",
      regionsRequiredError: "Provide your regions BED for this input type.",
      outputPath: "Output filename (pattern)",
      outputPathHint:
        "The name (or pattern) of the file your tool writes under /data/out/, e.g. *.allsequences.txt or result.vcf.",
      outputPathTooltip:
        "Use the same filename or wildcard your run command creates inside the container. STRhub looks for that file after the run. It does not need to match the file extension in the next field.",
      outputPathTooltipAria: "How to name the output file your tool produces",
      outputFormat: "Output content type",
      outputFormatHint:
        "How the file is structured inside, not necessarily its extension. Tab-separated columns → TSV (even if the file ends in .txt).",
      outputFormatTooltip:
        "Pick the structure that matches your tool's output. TSV: columns separated by tabs (STRait Razor .allsequences.txt is TSV). CSV: comma-separated. VCF: variant calls. JSON: JSON data. Text: plain lines with no special parser.",
      outputFormatTooltipAria: "How to choose the output content type",
      outputFormatOptions: {
        tsv: "TSV (tab-separated columns)",
        csv: "CSV (comma-separated columns)",
        vcf: "VCF (variant call format)",
        json: "JSON",
        text: "Plain text (lines, no table parser)",
      },
      minRecords: "Minimum records",
      detectTitle: "Detect this from a sample output file",
      detectHint:
        "If your tool has already produced a result, pick that file and we'll work out the format and the column layout for you. It is read in your browser and never uploaded.",
      detectChoose: "Choose a sample output file…",
      detectReading: "Reading the file…",
      detectError: "We couldn't read that file. Pick a plain-text result file.",
      detectGzip:
        "That file is gzipped. Decompress it first (gunzip) and pick the plain-text file.",
      detectResult: "Detected {format} — {rows} data rows.",
      detectLoci: "Found {n} distinct markers: {sample}…",
      detectNote: {
        contentNeedsTabs:
          "The content checks read tab-separated columns, so they can't inspect this format. The format itself is still verified.",
        vcfColumnsVary:
          "Columns per row was left blank: a VCF has one column per sample, and the verification run won't have the same number as your file.",
        tooFewRows: "Too few rows to identify the sequence column with confidence.",
        noLocusColumn:
          "No column looked like marker names, so the marker checks were left blank.",
        readsNotInferred:
          "Minimum total reads was left blank on purpose: your file is a full run, while STRhub verifies against a small slice with far fewer reads.",
        truncated: "Only the first part of the file was read.",
      },
      contentZeroBased:
        "Column positions are counted from 0 — the first column is 0. Rows are split on tabs, and lines starting with # are ignored.",
      contentField: {
        columns: "Columns per row",
        columnsTip:
          "Every data row must have exactly this many tab-separated columns. A row with any other number counts as malformed and fails the check. Leave blank to skip it.",
        dnaColumn: "Sequence column",
        dnaColumnTip:
          "Position of the column holding the DNA sequence. Every row's value must be only A, C, G, T or N — a single row that isn't fails the check. Positions start at 0.",
        countColumns: "Read-count columns",
        countColumnsTip:
          "Positions of the integer read-count columns, comma-separated. They are added together to give each row's depth, which is what the total-reads check counts. Positions start at 0.",
        locusColumn: "Marker name column",
        locusColumnTip:
          "Position of the column carrying the locus or marker name. Anything after the first colon is dropped, so \"TH01:9\" counts as TH01. Positions start at 0.",
        minDistinctLoci: "Minimum distinct markers",
        minDistinctLociTip:
          "The run must report at least this many different markers. Keep it at or below what STRhub's reference slice covers — it is a floor, not a target.",
        minTotalReads: "Minimum total reads",
        minTotalReadsTip:
          "The read-count columns, summed across every row, must reach at least this. Leave blank unless you know what STRhub's reference slice yields — it holds far fewer reads than a full run.",
        expectLoci: "Markers that must appear",
        expectLociTip:
          "Comma-separated marker names. Every single one listed must be present or the check fails, so list only markers you are sure your tool reports on our reference data.",
      },
      contentToggle: "Check output content plausibility (recommended)",
      contentToggleTooltip:
        "Recommended. Checks that the output looks like plausible genotype data — enough recognizable loci, and any named loci you expect — not just a non-empty file. Passing this earns the stronger \"Plausible output\" badge. Uncheck to verify format only.",
      contentToggleTooltipAria: "What the content plausibility check does",
      contentDefaultsHint:
        "Prefilled with sensible defaults for the selected output format and assay. Edit any field to match your tool, or clear one to skip that check.",
      contentDefaultsReset: "Reset to recommended",
      submit: "Submit for verification",
      submitting: "Submitting…",
      statePendingApproval:
        "This repository is new and awaits admin approval before its first run. You can resubmit once approved.",
      stateDispatched: "Submitted. Tracking the verification run…",
      stateQueued: "Queued…",
      stateInProgress: "Running gates…",
      statePolling: "Checking status…",
      stateCompletedSuccess: "Verification completed successfully.",
      rejectStoppedTitle: "We stopped before running your tool",
      rejectOursTitle: "This one is on us, not on your tool",
      rejectNotJudged:
        "No gate was judged, so this says nothing about your tool: it was not run.",
      rejectCoverage:
        "Your BED covers {covered} of {total} supported loci (at least {min} are needed).",
      rejectOutOfPanel: "{n} interval(s) fall outside the panel:",
      stateCompletedFailure: "The run finished but did not pass all gates.",
      viewRun: "View CI run",
      viewReport: "View attestation",
      errorGeneric: "Something went wrong. Please try again.",
      errorValidation: "Please fix the highlighted fields.",
      pdfDownload: "Download PDF report",
      pdfGenerating: "Generating PDF…",
      pdfDone: "PDF downloaded",
      pdfError: "PDF failed — retry",
      pdfErrorHint: "The report may not be published yet. Try again in a few seconds.",
      resubmit: "Edit & re-submit",
      resubmitHint: "Go back to the form with the same parameters pre-filled.",
      paramsToggle: "Submission parameters",
      paramsToolName: "Tool",
      paramsRepo: "Repository",
      paramsRef: "Ref",
      paramsCmd: "Run command",
      paramsInputType: "Input type",
      paramsFixture: "Test file",
      paramsOutput: "Output",
      paramsBuild: "Build",
      paramsDockerMode: "Docker mode",
      paramsTimeout: "Timeout",
    },
    start: {
      eyebrow: "STRhub Verified",
      title: {
        owner: "Verify my tool",
        reviewer: "Check a tool for a paper review",
        user: "Is it my setup, or the tool?",
      },
      lead: {
        owner: "Paste your repository. STRhub reads it, works out how to install and run it, and tries that out in a clean environment. Nothing is published until you say so.",
        reviewer: "Paste the repository the manuscript cites. In a few minutes you get a plain answer: does it install and run as documented? No code, no account, nothing published.",
        user: "Paste the tool's repository. STRhub shows what a clean environment does with it, so you can tell a failure of the tool from a problem on your machine.",
      },
      repoLabel: "Public GitHub repository",
      repoPlaceholder: "https://github.com/owner/tool",
      refLabel: "Version, tag or commit (optional)",
      refPlaceholder: "v2.1.0, or a commit SHA",
      refHint: "Leave it empty to use the latest release. A paper usually cites one.",
      roleLabel: "I am",
      role: {
        owner: "the tool's maintainer",
        reviewer: "reviewing a paper about it",
        user: "trying to run it",
      },
      cta: "Start the test run",
      starting: "Starting…",
      advanced: "Advanced: write the recipe yourself",
      advancedHint: "For maintainers who want to control the Dockerfile, the command and the expected output.",
      howItWorks: "What happens",
      steps: {
        read: "STRhub reads the repository at the pinned commit: Dockerfile, environment files, README, example data.",
        propose: "It proposes a recipe: how to install, what to run, on which of its open reference datasets.",
        run: "It runs that in an isolated container, with no network, and checks what came out.",
        verdict: "You get one of four answers: runs, fails, could not be determined (with what the README does not say), or out of scope.",
      },
      noPublish: "A test run publishes nothing and is private to whoever has its link. It expires after 30 days.",
      error: {
        not_a_github_repo: "That is not a public GitHub repository URL.",
        repo_not_found: "That repository does not exist or is not public.",
        ref_not_found: "That version, tag or commit was not found in the repository.",
        rate_limited: "Too many test runs from here for now. Try again in a while.",
        not_configured: "Test runs are not available on this server yet.",
        generic: "Could not start the test run. Try again.",
      },
    },
    trial: {
      title: "Test run",
      of: "Test run of {repo} at {ref}",
      state: {
        pending: "Queued. GitHub Actions is picking up the run.",
        queued: "Queued. GitHub Actions is picking up the run.",
        in_progress: "Running: installing the tool and running it in a clean container. Usually 2 to 10 minutes.",
        completed: "Finished.",
        expired: "This test run's result has expired (results are kept 30 days). Start a new one.",
        stalled: "Still no run after several minutes. GitHub may be busy; the link keeps working.",
      },
      elapsed: "Elapsed: {minutes} min",
      verdict: {
        runs: "Runs",
        fails: "Fails",
        undetermined: "Could not be determined",
        out_of_scope: "Out of scope for automated verification",
      },
      verdictMeaning: {
        runs: "It installed from its public source and produced its documented output in a clean environment.",
        runsFallback: "It produced its documented output in a clean environment — on the published environment the README points at, not on a build of the pinned commit.",
        fails: "It did not. The evidence points at the tool or its documented way of running.",
        undetermined: "STRhub could not work out how to run it from the repository. That is a finding about the documentation, not about the software.",
        out_of_scope: "It needs something the automated runner cannot provide. A manual verification can cover it.",
      },
      gapsTitle: "What the README does not say",
      knownIssuesTitle: "What the author documents as a known issue",
      knownIssuesHint: "Quoted from the repository's README at the verified commit. STRhub did not establish any of this by running the tool; it is the author's own note about their own software.",
      knownIssuesLine: "README line {line}",
      evidenceTitle: "Evidence",
      evidenceHint: "What this run's configuration rests on, each item at the verified commit. Open any of them to check the claim it supports.",
      evidenceClaim: {
        install_method: "Install method",
        published_image: "Published image",
        bioconda_package: "Bioconda package",
        fallback_environment: "Fallback environment",
        run_command: "Run command",
        example_data: "Example data",
        known_issue: "Known issue",
      },
      gapsHint: "Each line is something a stranger needs before they can run the tool. For a reviewer, these are review findings; for a maintainer, a short to-do.",
      noReport: "The run finished without producing a report. This usually means it stopped before its first gate; the run log has the details.",
      runLink: "Open the run on GitHub",
      recipeTitle: "What was run",
      recipeHint: "Proposed by STRhub from the repository. Every guess is listed under the caveats.",
      recipeCmd: "Command",
      recipeDockerfile: "Environment (Dockerfile)",
      recipeRepoDockerfile: "The repository's own Dockerfile was built as-is.",
      recipeFallbackUsed: "The build from the pinned commit failed (see the build log). What ran is this fallback environment: {reason}.",
      recipeFallbackAvailable: "Plan B, not needed this time: if the build above had failed, STRhub would have used {reason}.",
      recipeFallbackReason: "the fallback environment the recipe declares",
      caveatsTitle: "Caveats: what STRhub guessed",
      logsTitle: "Logs",
      log: {
        build: "Build",
        external: "Run on STRhub reference data",
        own: "Run on the repository's data",
        example: "The README's own example",
      },
      publish: "Publish this result",
      publishHint: "Files exactly this recipe for a STRhub admin to approve. Approval runs the real verification and lists the tool in the catalogue with a permanent link.",
      publishOnlyRuns: "Only a test run that ended in \"Runs\" can be published with one click. Fix what the report says and run it again, or use the advanced form.",
      published: "Filed for approval as {slug}. You do not need to come back; approval starts the run.",
      publishError: {
        slug_taken: "A tool with this name and version is already registered to another repository.",
        verdict_not_runs: "This test run did not end in \"Runs\".",
        trial_not_finished: "The test run has not finished.",
        generic: "Could not file the result. Try again.",
      },
      share: "Share this link with the editor or a co-reviewer. It needs no account.",
      again: "Test another tool",
      asOwnerCta: "Are you this tool's maintainer? Publish it from this page.",
      gates: "Gates",
      example: "Reproduces own example",
      exampleMeaning: "the README's own command produced its documented output on the repository's own data",
      stoppedTitle: "What stopped it, and what you can do",
      stoppedHint: "Each item is one missing piece. You can supply it yourself and try again without publishing anything, or ask the tool's owner for it on GitHub.",
      selfFix: "I'll add it and try again",
      askOwner: "Ask the owner on GitHub",
      askOwnerHint: "Opens a pre-written issue in the tool's repository for you to review and post. Nothing is sent by STRhub.",
      selfFixHint: "Opens the recipe STRhub proposed, with everything filled in, at the section to complete. The next run is a test run again.",
      pdf: "Download the PDF report",
      html: "Open the full report",
      scopeTitle: "Scope of this report",
      scope1:
        "Independent automated verification of reproducible execution. It confirms the tool installs, runs end-to-end, and produces structurally valid output in a standardized environment.",
      scope2:
        "This is not an analytical validation. Genotype accuracy, concordance, forensic suitability, and regulatory compliance are out of scope.",
    },
    check: {
      title: "Is it my setup, or the tool?",
      lead: "Two ways to find out. If the tool is already in the catalogue, compare with the environment that ran it. If not, try it out in a clean container. Either way, paste your error and STRhub tells you what kind it is.",
      lookupLabel: "Look the tool up",
      found: "In the catalogue",
      foundHint: "These runs list the exact environment, command and log. If yours differs from what worked here, the difference is the first place to look.",
      notFound: "Not in the catalogue yet. Try it out below.",
      errorLabel: "Paste the error you see",
      errorPlaceholder: "The last lines of your terminal…",
      errorCta: "What is this?",
      errorNone: "Nothing STRhub recognises. Compare your command and environment with a run that worked.",
      errorKind: {
        cmd_not_found: "The program is not on your PATH. Usually the install did not finish, or the environment (conda, venv) is not activated.",
        missing_module: "A Python module is missing: the tool's dependencies are not installed in the environment you are running from.",
        bad_option: "A command-line flag the tool does not recognise. Check the version: flags change between releases.",
        file_not_found: "The tool cannot find an input file at the path you gave.",
        cannot_open: "The tool could not open a file. Check the path and that the file is what the tool expects.",
        permission_denied: "A permissions problem on your machine, not the tool.",
        oom: "The process ran out of memory on your machine.",
        requires_gpu: "The tool needs a GPU, which your machine may not have.",
        conda_unsatisfiable: "conda could not solve the environment: usually a dependency that no longer resolves. That is a finding about the tool's pins.",
        pip_unresolvable: "pip could not find a pinned dependency. That is a finding about the tool's pins, not your setup.",
        missing_header: "A C/C++ build is missing a development library on your machine.",
      },
      seenHere: "STRhub saw the same kind of error when it ran this tool: it is likely the tool, not you.",
      notSeenHere: "STRhub did not hit this when it ran this tool: look at your environment first.",
      rehearse: "Try it out in a clean container",
    },
  },
};

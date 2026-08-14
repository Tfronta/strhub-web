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
    submittedBy: "Submitted by",
    submittedByValue: {
      maintainer: "The tool's maintainer",
      third_party: "A third party (not the tool's maintainer)",
    },
    submittedByThirdPartyNote:
      "This tool was submitted for verification by somebody other than its maintainer. The maintainer took no part in the run and supplied none of what it used: the command, the environment, and any target regions were chosen by the submitter. Any maintainer named above is who answers for the software — not who asked for this report, and not an endorsement of it.",
    commit: "Commit",
    environment: "Environment",
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
      view: "View execution log",
    },
    errorsBadgeSuffix: "(errors reported)",
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
  },
};

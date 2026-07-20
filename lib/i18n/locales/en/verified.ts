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
      demoDataRecommendation:
        "For this reason we strongly recommend the tool ship its own demo or test data in its official repository, so it can be evaluated against complete data rather than a coverage-limited slice.",
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
      noOwnData: "This tool does not include its own demo or test data in its repository. STRhub ran the verification using a pre-built slice from public reference data (listed below). Including a small test file in the repository is recommended for a stronger, self-contained verification.",
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
    submit: {
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
      version: "Version",
      maintainer: "Maintainer",
      contact: "Contact (issue tracker or email)",
      repo: "Public GitHub repo URL",
      ref: "Commit SHA or release tag (immutable)",
      refHint: "A specific commit hash or tag. Ensures we always test the exact same code.",
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
      buildCmd: "Build / install command",
      buildCmdTooltip:
        "Command run while building the Docker image, after cloning your repo. Usually your install steps, e.g. pip install, make, or conda env create. If it fails, verification stops at the Installs gate.",
      buildCmdTooltipAria: "What the build or install command is for",
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
      paramsVersion: "Version",
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

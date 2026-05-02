export default {
mixProfiles: {
  title: "DNA Mixture Simulator",
  subtitle: "beta",
  description: "Using demo data — you can load your own samples when available.",
  simulatorDescription:
    "This simulator shows how two or three DNA profiles behave when mixed, in both capillary electrophoresis (CE) and NGS. It helps users understand how peak heights shift, how stutter artifacts appear, and how minor alleles can become hidden or confused with noise, illustrating the real complexity of interpreting mixed profiles in forensic genetics. Profiles are derived from open-access 1000 Genomes samples, except for the simulated triallelic pattern example.",
  controls: {
    locus: "Locus",
    sampleA: "Sample A",
    sampleB: "Sample B",
    ratioA: "Ratio A",
    contributor: "Contributor {label}",
    searchSample: "Search {label} sample...",
    noSampleFound: "No sample found.",
  },
  actions: {
    reSimulate: "Re-simulate",
    resetToDemo: "Reset to demo",
    exportJson: "Export JSON",
  },
  results: {
    title: "Mixture Results for",
    allele: "Allele",
  },
  charts: {
    ceTitle: "Capillary Electrophoresis Analysis (RFU)",
    ngsTitle: "Next-Generation Sequencing Analysis",
  },
  ngs: {
    disclaimer:
      "Individual haplotypes inferred from Illumina short-read NGS data using specialized STR genotyping software (HipSTR, hg38), displayed for educational purposes only.",
    tableAllele: "Allele",
    tableCoverage: "Allelic Coverage (PDP)",
    tableCoverageTooltipAria: "Explanation about allelic coverage",
    tableCoverageTooltip:
      "Probabilistic read support per allele from HipSTR PDP (fractional values possible).",
    tableRepeatSequence: "Repeat Sequence",
    axisLabelAllele: "Allele",
    axisLabelCoverage: "Allelic Coverage (PDP)",
    fullSequenceColumnLabel: "Full Sequence",
    fullSequenceTooltipAria: "Explanation about full amplicon sequence",
    fullSequenceNote:
      "Complete amplicon haplotype sequence inferred from NGS data, including flanking regions (hg38), repeat region, and internal variants. Total length may differ between alleles even with similar repeat counts.",
    fullSequenceDidacticNote:
      "Flanks do not count toward the CE allele call; the repeat region is what is used for allele calling.",
    isoTooltip:
      "Isoallele: same allele designation but different repeat sequence (internal variation).",
    lowPdpBadge: "low PDP",
    lowPdpTooltip:
      "Low allelic coverage (PDP < 10).\nThis haplotype may reflect sequencing noise or alignment artifacts and is not used for isoallele detection.",
    lowPdpTooltipAria: "Explanation about low allelic coverage",
    flank5Tooltip: "5' flank",
    repeatRegionTooltip: "Repeat region",
    flank3Tooltip: "3' flank",
    igvGuideTitle: "Inspect reads in IGV",
    igvGuideBody:
      "STRhub provides an integrated IGV viewer to explore the sequencing reads behind these haplotypes.",
    igvGuideStep1: "Open the IGV viewer",
    igvGuideStep2: "Select a sample",
    igvGuideStep3: "Select the STR marker",
    igvGuideNote:
      "Note: IGV displays one sample at a time. For mixture profiles, inspect each sample separately.",
    igvGuideCta: "Open IGV Viewer →",
  },
  trueGenotypes: {
    toggleLabel: "Show true genotypes",
    title: "True genotypes at {locus}",
    notSelected: "Not selected",
    none: "—",
    na: "No genotype available",
    naHelp: "No true alleles found for this locus in the demo dataset.",
    noSample: "None",
  },
  ceChart: {
    advancedModeLabel: "Advanced",
    advancedModeTooltip:
      "Simulates real CE view. Stutters are not shown in a different color. Useful for advanced practice.",
    axisAllele: "Allele",
    axisRFU: "RFU",
    legendBaselineNoise: "Baseline noise (RFU)",
    legendTrueAlleles: "True alleles / Signal (RFU)",
    legendStutter: "Stutter (RFU)",
    legendCalled: "Called",
    legendDropoutRisk: "Drop-out risk",
    legendStutterPeak: "Stutter peak",
    thresholdAT: "AT",
    thresholdST: "ST",
    tooltipAllele: "Allele {allele}",
    tooltipAlleleMarker: "Allele {allele} — {marker}",
    tooltipTrue: "Allele {label} — {rfu} RFU",
    tooltipTrueWithStutter: "Allele {label} — {trueRfu} RFU + {stutterRfu} St. RFU",
    tooltipStutter: "Stutter at {allele} — {rfu} RFU (from {parent})",
    tooltipStutterTotal: "Stutter at {allele} — {rfu} RFU total",
    tooltipStutterFromParent: "From {parent} ({deltaLabel}): {rfu} RFU",
    tooltipCalled: "Called",
    tooltipDropout: "Drop-out risk",
    tooltipArea: "Peak area: {area} (CE-equivalent)",
    infoLabel: "Show stutter modeling note",
    infoText:
      "Educational simulator\n\nStutter is modeled as a locus-specific fraction of the true peak height (typically ~6–11%, higher for some long loci). Stutter at a given position can come from more than one allele (e.g. −1 from the next allele, +1 from the previous); the tooltip shows the breakdown by parent and delta.\n\nPeak area values are reported as CE-equivalent signal, obtained by scaling peak height using a typical CE area/height ratio (≈4.25).\n\nThese are educational approximations, not validated parameters for any specific kit.",
  },
  parameters: {
    at: "AT (RFU)",
    st: "ST (RFU)",
    degradationK: "Degradation k (per 100 bp)",
    noiseBase: "Noise / Base (RFU)",
    stutterLevel: "Stutter level (×)",
    autoScale: "Auto-scale Y",
    fixedScale: "Fixed forensic scale (0–800 RFU)",
    atTooltip: "Analytical Threshold (AT): Minimum RFU value above which a peak is considered reliable signal (not noise). Defined by internal laboratory validation (varies by fluorophore color, instrument, and kit). Typical values: 50–175 RFU. Peaks below AT are ignored or interpreted with caution.",
    stTooltip: "Stochastic Threshold (ST): RFU threshold above which significant allele dropout or pronounced heterozygote imbalance is unlikely in low-DNA samples. Defined by internal validation. Between AT and ST, interpret with caution due to stochastic effects. Typical values: 150–600 RFU.",
    autoScaleTooltip: "Automatically adjusts the Y axis to fit all peaks.\n\nUseful to visualize low RFU minor peaks or degraded profiles.",
    degradationKTooltip: "Degradation coefficient k (per 100 bp): Simulates preferential signal loss in longer fragments due to DNA damage. Typical values: 0.010 (good quality), 0.015–0.020 (difficult samples), >0.020 (severely degraded). Higher k results in greater peak height loss for longer alleles.",
    noiseBaseTooltip: "Baseline noise (RFU): Simulates background fluorescence noise in capillary electrophoresis. Higher values produce more small peaks and baseline fluctuation, as seen in real samples with inhibitors or contamination.",
    stutterLevelTooltip: "Stutter level (×): Didactic factor that multiplies or reduces the modeled stutter intensity for this marker. 1.0 = realistic rate (per kit validation). >1.0 = exaggerated for teaching (e.g., to show how stutter can be confused with a minor allele).",
  },
  quickGuide: {
    title: "Quick Guide for DNA Mixture Configuration",
    button: "Quick Guide",
    thresholds: {
      title: "Thresholds in practice",
      at: "AT (Analytical Threshold): Lower values allow detection of minor peaks; higher values suppress background noise.",
      st: "ST (Stochastic Threshold): Peaks below ST may indicate heterozygote imbalance or allele dropout.",
      important: "Important: These thresholds must be determined by internal laboratory validation and vary by instrument, protocol, and analytical conditions.",
    },
    mixture: {
      title: "Mixture ratios",
      balanced: "50/50: Balanced mixture",
      moderate: "70/30: Moderate imbalance",
      strong: "80/20 or 90/10: Strong imbalance (ideal for demonstrating mixture behavior in teaching scenarios)",
    },
    markers: {
      title: "Loci with clearer stutter behavior",
      description: "Longer alleles generally show more noticeable stutter.",
      fga: "FGA",
      d18s51: "D18S51",
      d21s11: "D21S11",
      d2s1338: "D2S1338",
    },
    simulation: {
      title: "How to simulate stutter from major contributor similar to true allele of minor contributor",
      ratio: "Mixture ratio ≥ 80/20 (strong imbalance)",
      degradation: "Degradation k: 0.015–0.030",
      stutter: "Stutter rate multiplier: 1.5–2.0 (for illustrative/didactic purposes)",
      loci: "Prefer loci where contributors differ by one repeat unit (e.g., 10 vs 9)",
      scenario: "This scenario illustrates a common interpretation challenge: stutter from the major contributor can resemble a true allele from the minor contributor.",
    },
    notes: {
      title: "Practical notes",
      longerAlleles: "Longer alleles lose signal intensity earlier under degradation.",
      minorContributors: "Minor contributors drop in RFU faster in degraded samples.",
      stutter: "Stutter is easier to detect when there is a large imbalance between major and minor contributors.",
      notAllLoci: "Not all loci exhibit these effects equally.",
      validation: "For realistic simulations, adjust parameters based on your laboratory's validated thresholds and stutter rates.",
    },
  },
},
mixtures: {
  presets: {
    stutterMinor: "Stutter ≈ Minor",
    stutterAmbiguity: "Masked mixture",
    dropout: "Low minor allele",
    overlap: "Allele overlap",
    triallelic: "Triallelic pattern",
  },
  tooltips: {
    stutterMinor:
      "Shows a scenario where the stutter from the major contributor resembles the true allele of the minor contributor, potentially leading to interpretation confusion in mixed profiles.",
    stutterAmbiguity:
      "Shows a case where a mixture may appear single-source at this locus due to stutter masking of minor alleles.",
    lowMinor:
      "Shows a minor contributor allele very close to the detection threshold.",
    overlap:
      "Shows two contributors sharing one allele, creating a combined high peak in the middle.",
    triallelic:
      "Synthetic single-source profile with a triallelic locus. May resemble a two-person mixture.",
  },
},
} as const

export default {
nav: {
  home: "Home",
  catalog: "Catalog",
  basics: "Foundations",
  blog: "Community",
  tools: "Tools",
  projects: "Resources",
  about: "About",
  search: "Search",
  strbase: "STRBase Integration",
  mixProfiles: "Mixtures",
  globalFrequencies: "Global Frequencies",
  datasets: "Data",
},
search: {
  title: "Search Results",
  placeholder: "Search markers, tools, articles...",
  noResults: "No results found",
  noResultsDescription: "No content found for",
  trySearching: "Try searching for:",
  resultsFor: "Results for",
  found: "Found",
  result: "result",
  results: "results",
  startSearch: "Start your search",
  enterSearchTerm: "Enter a search term to find content across STRhub",
  types: {
    markers: "Markers",
    markerSections: "Marker Sections",
    tools: "Tools",
    blog: "Articles",
    page: "Pages",
  },
  suggestions: {
    markers: "Marker names (FGA, D18S51, TH01)",
    tools: "Tool names (HipSTR, STRspy, GangSTR)",
    topics: "Topics (frequencies, genotyping, analysis)",
  },
},
home: {
  title: "STRhub",
  subtitle: "Central Hub for",
  tagline: "Open-access platform for forensic STR analysis and visualization",
  description: "From CE to NGS: integrated tools for forensic genetics and population studies",
  searchPlaceholder: "Search markers, tools, articles...",
  searchButton: "Search Database",
  exploreButton: "Explore Catalog",
  exploreSectionTitle: "Explore STRhub",
  featuresSectionTitle: "Platform Features",
  explore: {
    basics: {
      title: "Back to Basics",
      description: "Learn fundamental concepts: CRAM/BAM/SAM, flanking regions, and key bioinformatics terms",
    },
    catalog: {
      title: "Catalog",
      description:
        "Browse STR markers with complete genomic context, population data, allele frequencies, variant structures and advanced analysis features.",
    },
    mixProfiles: {
      title: "Mix Profiles",
      description: "Simulate, visualize, and compare STR mixture profiles for CE and NGS data",
    },
    tools: {
      title: "Tools & Pipelines",
      description:
        "Tools and analysis workflows for STR marker genotyping and evaluation.",
    },
    fastaGenerator: {
      title: "FASTA Generator",
      description: "Generate custom FASTA sequences for your research and analysis needs",
    },
    igvViewer: {
      title: "IGV Viewer",
      description: "One-click integration with IGV for genomic visualization and analysis",
    },
    projects: {
      title: "Projects",
      description:
        "Explore major international genomic projects advancing STR research and human genetic diversity",
    },
    motifExplorer: {
      title: "STR Motif Explorer",
      description: "Interactively explore STR repeat motifs across markers and allele structures.",
    },
    communityHub: {
      title: "Community Hub",
      description: "User experiences, tutorials, updates, and collaborative research discussions",
    },
    about: {
      title: "About",
      description: "Learn about our mission, team, and how to contribute to the STRhub community",
    },
  },
  features: {
    integratedDatabase: {
      title: "Integrated STR Database",
      description:
        "Access CODIS and non-CODIS markers with allele frequencies, flanking sequences, and population data across AFR, NAM, EAS, CSA, and EUR groups",
    },
    visualizationSuite: {
      title: "Visualization Suite",
      description:
        "Interactive charts, electropherograms, and IGV integration for comprehensive genomic visualization and analysis",
    },
    mixtureSimulation: {
      title: "Mixture Simulation Engine",
      description:
        "Generate and compare STR mixture profiles for both CE and NGS data with customizable contributor ratios",
    },
    fastaMetadata: {
      title: "FASTA & Metadata Generator",
      description:
        "Create custom FASTA sequences with configurable flanking regions and export comprehensive marker metadata",
    },
    educationalResources: {
      title: "Educational Resources",
      description:
        "Comprehensive tutorials covering bioinformatics fundamentals, file formats, and STR analysis best practices",
    },
    communityCollaboration: {
      title: "Community & Collaboration",
      description:
        "Stay updated with latest research, share experiences, and collaborate with the global forensic genetics community",
    },
  },
  featuredTitle: "Featured Markers",
  viewAll: "View All Markers",
  getStarted: "Get Started",
  learnMore: "Learn More",
  footer: {
    mission: "Advancing genetic research through collaborative science.",
    community: "Built for the global research community",
  },
},
} as const

/**
 * Dataset metadata for Global Frequencies page.
 * This is the single source of truth for dataset information.
 */

export type DatasetMetadata = {
  id: string;
  technology: "CE" | "NGS";
  nameKey: string; // Translation key for dataset name
  sourceKey: string; // Translation key for source/provenance
  keyNotesKeys: string[]; // Array of translation keys for key notes (each is a paragraph)
  populationGroupsKey?: string; // Translation key for population groups list (optional)
  comparabilityKey: string; // Translation key for comparability statement
  sampleSizeKey?: string; // Translation key for sample size (optional)
  referenceKey?: string; // Translation key for reference (optional)
  viewDatasetUrl?: string; // External URL (optional)
};

export const globalFrequenciesDatasets: Record<string, DatasetMetadata> = {
  CE: {
    id: "CE",
    technology: "CE",
    nameKey: "globalFrequencies.datasets.popstrCE.name",
    sourceKey: "globalFrequencies.datasets.popstrCE.source",
    keyNotesKeys: [
      "globalFrequencies.datasets.popstrCE.keyNotes.0",
      "globalFrequencies.datasets.popstrCE.keyNotes.1",
    ],
    populationGroupsKey: "globalFrequencies.datasets.popstrCE.populationGroups",
    comparabilityKey: "globalFrequencies.datasets.popstrCE.comparability",
    viewDatasetUrl: undefined,
  },
  "1000G": {
    id: "1000G",
    technology: "NGS",
    nameKey: "globalFrequencies.datasets.g1k.name",
    sourceKey: "globalFrequencies.datasets.g1k.source",
    keyNotesKeys: [
      "globalFrequencies.datasets.g1k.keyNotes.0",
    ],
    comparabilityKey: "globalFrequencies.datasets.g1k.comparability",
    viewDatasetUrl: "https://www.internationalgenome.org/category/phase-3/",
  },
  RAO: {
    id: "RAO",
    technology: "NGS",
    nameKey: "globalFrequencies.datasets.rao.name",
    sourceKey: "globalFrequencies.datasets.rao.source",
    keyNotesKeys: [
      "globalFrequencies.datasets.rao.keyNotes.0",
    ],
    comparabilityKey: "globalFrequencies.datasets.rao.comparability",
    viewDatasetUrl: "https://doi.org/10.1016/j.fsigen.2022.102676",
  },
};

/**
 * Get dataset metadata by dataset ID
 */
export function getGlobalFrequenciesDataset(
  datasetId: string
): DatasetMetadata | undefined {
  return globalFrequenciesDatasets[datasetId];
}


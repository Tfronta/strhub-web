// Dataset configuration with metadata for descriptions and external links
// Each dataset can define its own description and optional external link

export type DatasetMetadata = {
  descriptionKey?: string; // i18n key for dataset-specific description
  sourceType?: "publication" | "public_db" | "internal";
  externalUrl?: string; // URL to open (e.g. DOI)
};

export type AlleleFrequencyDataset = {
  id: string; // e.g. "RAO", "AFR", etc.
  label: string; // visible tag text
  technology: "CE" | "NGS";
  metadata?: DatasetMetadata;
};

// Dataset configurations
// For CE datasets, we typically don't need metadata as they use the generic pop.STR description
// For NGS datasets, we can add specific metadata
export const datasetConfigs: Record<string, AlleleFrequencyDataset> = {
  // NGS datasets
  RAO: {
    id: "RAO",
    label: "RAO",
    technology: "NGS",
    metadata: {
      descriptionKey: "ngsDatasetDescription_raoValleSilva2022",
      sourceType: "publication",
      externalUrl: "https://doi.org/10.1016/j.fsigen.2022.102676",
    },
  },
  // CE datasets - no metadata needed, they use generic pop.STR description
  AFR: {
    id: "AFR",
    label: "AFR",
    technology: "CE",
  },
  NAM: {
    id: "NAM",
    label: "NAM",
    technology: "CE",
  },
  EAS: {
    id: "EAS",
    label: "EAS",
    technology: "CE",
  },
  SAS: {
    id: "SAS",
    label: "SAS",
    technology: "CE",
  },
  EUR: {
    id: "EUR",
    label: "EUR",
    technology: "CE",
  },
  MES: {
    id: "MES",
    label: "MES",
    technology: "CE",
  },
  OCE: {
    id: "OCE",
    label: "OCE",
    technology: "CE",
  },
  LATAM: {
    id: "LATAM",
    label: "LATAM",
    technology: "CE",
  },
};

// Helper function to get dataset config by ID
export function getDatasetConfig(
  datasetId: string
): AlleleFrequencyDataset | undefined {
  return datasetConfigs[datasetId];
}

import type { AlleleEntry } from "./markerFrequencies";

export type LatamPopulationId =
  | "paraguay_dc_identifiler"
  | "paraguay_varias_regiones_globalfiler"
  | "argentina_region_central_powerplex"
  | "argentina_valles_calchaquies_identifiler"
  | "mexico_regiones_powerplex"
  | "mexico_tijuana_sonora_globalfiler"
  | "mexico_monterrey_globalfiler"
  | "mexico_west_mexico_powerplex"
  | "ecuador_azuay_ngm_select"
  | "brasil_rio_grande_do_sul_powerplex"
  | "brasil_centro_sudeste_sur_pro_cofiler";

export interface LatamPopulation {
  id: LatamPopulationId;
  region: "LATAM";
  countryCode: string;
  kitName: string;
  n: number;
  markerCount: number;
  technology: "CE";
  frequenciesByLocus: Partial<Record<string, AlleleEntry[]>>;
  label: {
    en: string;
    es: string;
    pt: string;
  };
}

export const LATAM_POPULATIONS: LatamPopulation[] = [
  {
    id: "paraguay_dc_identifiler",
    region: "LATAM",
    countryCode: "PY",
    kitName: "Identifiler",
    n: 259,
    markerCount: 15,
    technology: "CE",
    label: {
      en: "Paraguay – DC (Identifiler)",
      es: "Paraguay – DC (Identifiler)",
      pt: "Paraguai – DC (Identifiler)",
    },
    frequenciesByLocus: {},
  },
  {
    id: "paraguay_varias_regiones_globalfiler",
    region: "LATAM",
    countryCode: "PY",
    kitName: "GlobalFiler",
    n: 546,
    markerCount: 23,
    technology: "CE",
    label: {
      en: "Paraguay – Various regions (GlobalFiler)",
      es: "Paraguay – Varias regiones (GlobalFiler)",
      pt: "Paraguai – Várias regiões (GlobalFiler)",
    },
    frequenciesByLocus: {},
  },
  {
    id: "argentina_region_central_powerplex",
    region: "LATAM",
    countryCode: "AR",
    kitName: "PowerPlex",
    n: 639,
    markerCount: 15,
    technology: "CE",
    label: {
      en: "Argentina – Central region (PowerPlex)",
      es: "Argentina – Región central (PowerPlex)",
      pt: "Argentina – Região central (PowerPlex)",
    },
    frequenciesByLocus: {},
  },
  {
    id: "argentina_valles_calchaquies_identifiler",
    region: "LATAM",
    countryCode: "AR",
    kitName: "AmpFSTR Identifiler",
    n: 110,
    markerCount: 15,
    technology: "CE",
    label: {
      en: "Argentina – Calchaquí Valleys (Identifiler)",
      es: "Argentina – Valles Calchaquíes (Identifiler)",
      pt: "Argentina – Vales Calchaquíes (Identifiler)",
    },
    frequenciesByLocus: {},
  },
  {
    id: "mexico_regiones_powerplex",
    region: "LATAM",
    countryCode: "MX",
    kitName: "PowerPlex",
    n: 1183,
    markerCount: 21,
    technology: "CE",
    label: {
      en: "Mexico – Multiple regions (PowerPlex)",
      es: "México – Varias regiones (PowerPlex)",
      pt: "México – Várias regiões (PowerPlex)",
    },
    frequenciesByLocus: {},
  },
  {
    id: "mexico_tijuana_sonora_globalfiler",
    region: "LATAM",
    countryCode: "MX",
    kitName: "GlobalFiler",
    n: 784,
    markerCount: 21,
    technology: "CE",
    label: {
      en: "Mexico – Tijuana/Sonora (GlobalFiler)",
      es: "México – Tijuana/Sonora (GlobalFiler)",
      pt: "México – Tijuana/Sonora (GlobalFiler)",
    },
    frequenciesByLocus: {},
  },
  {
    id: "mexico_monterrey_globalfiler",
    region: "LATAM",
    countryCode: "MX",
    kitName: "GlobalFiler",
    n: 326,
    markerCount: 23,
    technology: "CE",
    label: {
      en: "Mexico – Monterrey (GlobalFiler)",
      es: "México – Monterrey (GlobalFiler)",
      pt: "México – Monterrey (GlobalFiler)",
    },
    frequenciesByLocus: {},
  },
  {
    id: "mexico_west_mexico_powerplex",
    region: "LATAM",
    countryCode: "MX",
    kitName: "PowerPlex",
    n: 238,
    markerCount: 23,
    technology: "CE",
    label: {
      en: "Mexico – West Mexico (PowerPlex)",
      es: "México – Oeste (PowerPlex)",
      pt: "México – Oeste (PowerPlex)",
    },
    frequenciesByLocus: {},
  },
  {
    id: "ecuador_azuay_ngm_select",
    region: "LATAM",
    countryCode: "EC",
    kitName: "AmpFLSTR NGM Select",
    n: 254,
    markerCount: 17,
    technology: "CE",
    label: {
      en: "Ecuador – Azuay (NGM Select)",
      es: "Ecuador – Azuay (NGM Select)",
      pt: "Equador – Azuay (NGM Select)",
    },
    frequenciesByLocus: {},
  },
  {
    id: "brasil_rio_grande_do_sul_powerplex",
    region: "LATAM",
    countryCode: "BR",
    kitName: "PowerPlex 16 / PowerPlex CS7",
    n: 760,
    markerCount: 21,
    technology: "CE",
    label: {
      en: "Brazil – Rio Grande do Sul (PowerPlex 16 / CS7)",
      es: "Brasil – Rio Grande do Sul (PowerPlex 16 / CS7)",
      pt: "Brasil – Rio Grande do Sul (PowerPlex 16 / CS7)",
    },
    frequenciesByLocus: {},
  },
  {
    id: "brasil_centro_sudeste_sur_pro_cofiler",
    region: "LATAM",
    countryCode: "BR",
    kitName: "AmpFISTR ProFiler Plus / CoFiler",
    n: 800,
    markerCount: 13,
    technology: "CE",
    label: {
      en: "Brazil – Central, southeastern & southern (ProFiler/CoFiler)",
      es: "Brasil – Centro, sudeste y sur (ProFiler/CoFiler)",
      pt: "Brasil – Centro, sudeste e sul (ProFiler/CoFiler)",
    },
    frequenciesByLocus: {},
  },
];


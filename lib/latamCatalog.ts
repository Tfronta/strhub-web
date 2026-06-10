export type LatamTechnology = "CE" | "NGS";

export type LatamSubpop = {
  id: string;
  country: string;
  region: string;
  N: number;
  kit: string;
  technology: LatamTechnology;
};

export const LATAMCatalog: LatamSubpop[] = [
  // PARAGUAY
  {
    id: "PY-central-identifiler",
    country: "Paraguay",
    region: "Central Department",
    N: 259,
    kit: "Identifiler",
    technology: "CE",
  },
  {
    id: "PY-eastern-identifiler",
    country: "Paraguay",
    region: "Eastern Region of Paraguay",
    N: 546,
    kit: "Identifiler",
    technology: "CE",
  },

  // ARGENTINA
  {
    id: "AR-central-identifiler",
    country: "Argentina",
    region: "Central Region",
    N: 639,
    kit: "Identifiler",
    technology: "CE",
  },
  {
    id: "AR-calchaqui-identifiler",
    country: "Argentina",
    region: "Calchaquí Valleys (North-Western Argentina)",
    N: 110,
    kit: "Identifiler",
    technology: "CE",
  },

  // MEXICO
  {
    id: "MX-multi-identifiler",
    country: "Mexico",
    region: "Different geographic regions",
    N: 1183,
    kit: "Identifiler",
    technology: "CE",
  },
  {
    id: "MX-tijuana-sonora-identifiler",
    country: "Mexico",
    region: "Tijuana, Sonora (Northwest)",
    N: 784,
    kit: "Identifiler",
    technology: "CE",
  },
  {
    id: "MX-monterrey-nuevo-leon-identifiler",
    country: "Mexico",
    region: "Monterrey, Nuevo León (Northeast)",
    N: 326,
    kit: "Identifiler",
    technology: "CE",
  },
  {
    id: "MX-west-identifiler",
    country: "Mexico",
    region: "West Mexico",
    N: 238,
    kit: "Identifiler",
    technology: "CE",
  },

  // ECUADOR
  {
    id: "EC-azuay-sierra-identifiler",
    country: "Ecuador",
    region: "Azuay (Sierra Region)",
    N: 254,
    kit: "Identifiler",
    technology: "CE",
  },

  // BRAZIL
  {
    id: "BR-ribeirao-preto-se-identifiler",
    country: "Brazil",
    region: "Ribeirão Preto (Southeastern Region)",
    N: 340,
    kit: "Identifiler",
    technology: "CE",
  },
  {
    id: "BR-rio-grande-do-sul-s-identifiler",
    country: "Brazil",
    region: "Rio Grande do Sul (Southern Region)",
    N: 760,
    kit: "Identifiler",
    technology: "CE",
  },
  {
    id: "BR-central-se-s-identifiler",
    country: "Brazil",
    region: "Central, Southeastern and Southern regions",
    N: 800,
    kit: "Identifiler",
    technology: "CE",
  },
];


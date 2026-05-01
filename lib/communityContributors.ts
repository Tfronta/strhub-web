export interface CommunityContributor {
  name: string;
  institution: string;
  country: string;
}

/** Single-letter tokens (e.g. middle initials) are skipped so the second remaining token is the first surname. */
function isInitialToken(token: string): boolean {
  const letters = token.replace(/\./g, "").trim();
  return letters.length === 1 && /^\p{L}$/u.test(letters);
}

/**
 * First surname for sorting: after dropping initials, uses the second token (given name + first surname pattern).
 */
export function getFirstSurnameForSort(fullName: string): string {
  const tokens = fullName
    .trim()
    .split(/\s+/)
    .filter((t) => !isInitialToken(t));
  if (tokens.length >= 2) return tokens[1];
  return tokens[0] ?? "";
}

export function compareContributorsByFirstSurname(
  a: CommunityContributor,
  b: CommunityContributor
): number {
  return getFirstSurnameForSort(a.name).localeCompare(
    getFirstSurnameForSort(b.name),
    undefined,
    { sensitivity: "base" }
  );
}

export const COMMUNITY_CONTRIBUTORS: CommunityContributor[] = [
  {
    name: "John M. Butler",
    institution: "NIST",
    country: "USA",
  },
  {
    name: "Melissa Gymrek",
    institution: "UC San Diego",
    country: "USA",
  },
  {
    name: "Ángel Carracedo",
    institution: "CIMUS / Universidad de Santiago de Compostela",
    country: "Spain",
  },
  {
    name: "Sebastian Ganschow",
    institution: "Oxford Nanopore Technologies",
    country: "Germany",
  },
  {
    name: "Luciellen Davila Giacomel Kobachuk",
    institution: "Polícia Científica do Paraná",
    country: "Brazil",
  },
  {
    name: "Marianna Maia Taulois do Rosário",
    institution: "Polícia Científica do Paraná",
    country: "Brazil",
  },
  {
    name: "Juliane Carlotto",
    institution: "Polícia Científica do Paraná",
    country: "Brazil",
  },
  {
    name: "Jonathan King",
    institution: "University of North Texas",
    country: "USA",
  },
];

export interface CommunityContributor {
  name: string;
  /** Key under `communityHub.communityContributors.institutions` in locale files. */
  institutionKey: string;
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

export function getContributorInstitutionLabel(
  contributor: CommunityContributor,
  t: (key: string) => string
): string {
  return t(
    `communityHub.communityContributors.institutions.${contributor.institutionKey}`
  );
}

export const COMMUNITY_CONTRIBUTORS: CommunityContributor[] = [
  {
    name: "John M. Butler",
    institutionKey: "john_m_butler",
    country: "USA",
  },
  {
    name: "Melissa Gymrek",
    institutionKey: "melissa_gymrek",
    country: "USA",
  },
  {
    name: "Sebastian Ganschow",
    institutionKey: "sebastian_ganschow",
    country: "Germany",
  },
  {
    name: "Luciellen Davila Giacomel Kobachuk",
    institutionKey: "parana_scientific_police",
    country: "Brazil",
  },
  {
    name: "Marianna Maia Taulois do Rosário",
    institutionKey: "parana_scientific_police",
    country: "Brazil",
  },
  {
    name: "Juliane Carlotto",
    institutionKey: "parana_scientific_police",
    country: "Brazil",
  },
  {
    name: "Jonathan King",
    institutionKey: "jonathan_king",
    country: "USA",
  },
  {
    name: "Ángel Carracedo Álvarez",
    institutionKey: "angel_carracedo_alvarez",
    country: "Spain",
  },
];

/** Shown first, same row (md+), left to right. Must match `name` in `COMMUNITY_CONTRIBUTORS`. */
const COMMUNITY_CONTRIBUTORS_FIRST_ROW_NAMES: readonly string[] = [
  "John M. Butler",
  "Sebastian Ganschow",
  "Melissa Gymrek",
  "Ángel Carracedo Álvarez",
];

export function getCommunityContributorsForGrid(): {
  firstRow: CommunityContributor[];
  remaining: CommunityContributor[];
} {
  const byName = new Map(
    COMMUNITY_CONTRIBUTORS.map((c) => [c.name, c] as const)
  );
  const firstRow = COMMUNITY_CONTRIBUTORS_FIRST_ROW_NAMES.map((name) =>
    byName.get(name)
  ).filter((c): c is CommunityContributor => c != null);

  const firstSet = new Set(firstRow.map((c) => c.name));
  const remaining = [...COMMUNITY_CONTRIBUTORS]
    .filter((c) => !firstSet.has(c.name))
    .sort(compareContributorsByFirstSurname);

  return { firstRow, remaining };
}

import { describe, expect, it } from "vitest";
import { shouldShowIsoBadge, shouldShowIsoBadgeOnMinorRow } from "./strFormatting";

// HG00097 vWA 17/17 from the Mix Profiles data: same CE designation, two
// different repeat sequences (PDP 23.44 and 26.56 there). Support is set low
// here on purpose.
const MINOR = "CE17_GGAT[3]AGAT[1]GGAT[1]AGAT[11]AGAC[4]AGAT[2]";
const MAJOR = "CE17_GGAT[3]AGAT[1]GGAT[1]AGAT[12]AGAC[3]AGAT[2]";

describe("educational isoallele indication", () => {
  it("keeps distinct sequences with the same CE designation visible at low read support", () => {
    const rows = [
      { allele: "17", coverage: 1.5, repeatSequence: MINOR },
      { allele: "17", coverage: 2.5, repeatSequence: MAJOR },
    ];
    expect(shouldShowIsoBadge(rows[0], rows)).toBe(true);
    expect(shouldShowIsoBadgeOnMinorRow(rows[0], rows)).toBe(true);
    expect(shouldShowIsoBadgeOnMinorRow(rows[1], rows)).toBe(false);
  });

  it("keeps it visible when read support is missing", () => {
    const rows = [
      { allele: "17", repeatSequence: MAJOR },
      { allele: "17", repeatSequence: MINOR },
    ];
    expect(shouldShowIsoBadge(rows[0], rows)).toBe(true);
    expect(rows.filter((r) => shouldShowIsoBadgeOnMinorRow(r, rows))).toHaveLength(1);
  });

  it("does not report it for identical sequences or rows without a sequence", () => {
    const same = [
      { allele: "17", coverage: 2, repeatSequence: MAJOR },
      { allele: "17", coverage: 3, repeatSequence: MAJOR },
    ];
    expect(shouldShowIsoBadge(same[0], same)).toBe(false);
    expect(same.some((r) => shouldShowIsoBadgeOnMinorRow(r, same))).toBe(false);

    const unknown = [
      { allele: "17", coverage: 2, repeatSequence: MAJOR },
      { allele: "17", coverage: 3, repeatSequence: "—" as const },
    ];
    expect(shouldShowIsoBadge(unknown[0], unknown)).toBe(false);
    expect(unknown.some((r) => shouldShowIsoBadgeOnMinorRow(r, unknown))).toBe(false);
  });
});

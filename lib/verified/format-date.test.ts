import { describe, expect, it } from "vitest";
import { formatDate, formatDateTime } from "./format-date";

describe("dates in the reader's convention", () => {
  it("formats by the site's language, in UTC", () => {
    expect(formatDate("2026-09-19T18:21:59+00:00", "en")).toBe("19 Sept 2026");
    expect(formatDate("2026-09-19T23:30:00+00:00", "en")).toBe("19 Sept 2026");
    expect(formatDate("2021-05-10T16:02:08Z", "es")).toMatch(/^10 may/);
    expect(formatDate("2021-05-10T16:02:08Z", "pt")).toMatch(/^10 de mai/);
    expect(formatDate("2026-09-19", "en")).toBe("19 Sept 2026");
  });

  it("says nothing for a date it was not given", () => {
    expect(formatDate(null, "en")).toBe("");
    expect(formatDate("not a date", "en")).toBe("");
  });

  it("keeps the time of day, marked as UTC", () => {
    expect(formatDateTime("2026-09-19T18:21:59+00:00", "en")).toBe("19 Sept 2026, 18:21 UTC");
  });
});

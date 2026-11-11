import { afterEach, describe, expect, it, vi } from "vitest";

const { sendGAEvent } = vi.hoisted(() => ({ sendGAEvent: vi.fn() }));
vi.mock("@next/third-parties/google", () => ({ sendGAEvent }));

import { buildEventParams, trackEvent } from "./analytics";

describe("buildEventParams", () => {
  it("adds the interface language", () => {
    expect(buildEventParams("es", { marker: "CSF1PO" })).toEqual({
      marker: "CSF1PO",
      site_language: "es",
    });
  });

  it("drops empty values and keeps numbers and booleans", () => {
    expect(
      buildEventParams("pt", { a: undefined, b: null, c: "", d: 0, e: false }),
    ).toEqual({ d: 0, e: false, site_language: "pt" });
  });

  it("trims values to the 100 characters GA4 keeps", () => {
    const params = buildEventParams("en", { block: "x".repeat(150) });
    expect(params.block).toHaveLength(100);
  });

  it("does not let a parameter override site_language", () => {
    expect(buildEventParams("en", { site_language: "fr" }).site_language).toBe("en");
  });
});

describe("trackEvent", () => {
  afterEach(() => {
    sendGAEvent.mockReset();
    vi.unstubAllGlobals();
  });

  it("does nothing on the server", () => {
    trackEvent("verified_submit", "en");
    expect(sendGAEvent).not.toHaveBeenCalled();
  });

  it("sends a gtag event in the browser", () => {
    vi.stubGlobal("window", {});
    trackEvent("tutorial_copy_command", "es", { tutorial_block: "genotype" });
    expect(sendGAEvent).toHaveBeenCalledWith("event", "tutorial_copy_command", {
      tutorial_block: "genotype",
      site_language: "es",
    });
  });

  it("never throws when gtag fails", () => {
    vi.stubGlobal("window", {});
    sendGAEvent.mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(() => trackEvent("tutorial_video_play", "pt")).not.toThrow();
  });
});

import { describe, expect, it } from "vitest";
import { stuckMailto, youtubeEmbedUrl } from "./index";

describe("youtubeEmbedUrl", () => {
  it("uses youtube-nocookie and asks for captions in the page language", () => {
    const url = new URL(youtubeEmbedUrl("abc123XYZ_-", "pt"));
    expect(url.origin).toBe("https://www.youtube-nocookie.com");
    expect(url.pathname).toBe("/embed/abc123XYZ_-");
    expect(url.searchParams.get("cc_load_policy")).toBe("1");
    expect(url.searchParams.get("cc_lang_pref")).toBe("pt");
    expect(url.searchParams.get("hl")).toBe("pt");
    expect(url.searchParams.has("autoplay")).toBe(false);
  });

  it("autoplays only when the player is loaded by a click on the cover", () => {
    const url = new URL(youtubeEmbedUrl("abc", "es", { autoplay: true }));
    expect(url.searchParams.get("autoplay")).toBe("1");
    expect(url.searchParams.get("cc_lang_pref")).toBe("es");
  });
});

describe("stuckMailto", () => {
  it("writes to the contact address with the step and system in the body", () => {
    const href = stuckMailto({
      subject: "HipSTR tutorial, step 5",
      tutorialId: "hipstr-first-steps",
      stepId: "genotype-readme",
      stepLabel: "5. Genotype with the official command",
      system: "macOS",
      pageUrl: "https://strhub.app/tools/hipstr/tutorial#genotype-readme",
      what: "  make: *** [genotype] Error 1 \n",
    });
    expect(href.startsWith("mailto:contact@strhub.app?subject=")).toBe(true);
    const query = new URLSearchParams(href.slice(href.indexOf("?") + 1));
    expect(query.get("subject")).toBe("HipSTR tutorial, step 5");
    expect(query.get("body")).toBe(
      "Tutorial: hipstr-first-steps/genotype-readme\n" +
        "Step: 5. Genotype with the official command\n" +
        "System: macOS\n" +
        "Page: https://strhub.app/tools/hipstr/tutorial#genotype-readme\n\n" +
        "make: *** [genotype] Error 1\n",
    );
  });
});

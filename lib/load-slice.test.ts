import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { parseSliceHeader } from "./load-slice";

const SLICES = path.join(import.meta.dirname, "..", "public", "slices");

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("fetchSliceFA", () => {
  it("fetches from this site's /slices/, whatever NEXT_PUBLIC_SLICES_BASE says", async () => {
    // Vercel still has the old jsDelivr base set; it must not be used.
    vi.stubEnv(
      "NEXT_PUBLIC_SLICES_BASE",
      "https://cdn.jsdelivr.net/gh/Tfronta/strhub-demo-data@main/slices/",
    );
    vi.resetModules();
    const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) =>
      new Response(">vWA_|chr12:5983778-5983785(+)\nACGT\nacgt\n"),
    );
    vi.stubGlobal("fetch", fetchMock);
    const { fetchSliceFA } = await import("./load-slice");

    const out = await fetchSliceFA("vWA");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe("/slices/vWA__slice.fa");
    expect(out).toEqual({
      header: "vWA_|chr12:5983778-5983785(+)",
      seq: "ACGTACGT",
      url: "/slices/vWA__slice.fa",
      region: { chrom: "chr12", start: 5983778, end: 5983785, strand: "+" },
    });
  });

  it("reports the HTTP status when a slice cannot be loaded", async () => {
    vi.stubGlobal("fetch", async () => new Response("", { status: 404 }));
    const { fetchSliceFA } = await import("./load-slice");
    await expect(fetchSliceFA("FGA")).rejects.toMatchObject({
      code: "sliceUnavailable",
      params: { marker: "FGA", status: "404" },
    });
  });
});

describe("public/slices", () => {
  const files = readdirSync(SLICES).filter((f) => f.endsWith("__slice.fa"));

  it("holds the 91 slices of strhub-demo-data", () => {
    expect(files).toHaveLength(91);
  });

  it.each(files)("%s is a plus-strand slice exactly as long as its header says", (file) => {
    const [header, ...lines] = readFileSync(path.join(SLICES, file), "utf8").trim().split("\n");
    expect(header.startsWith(`>${file.replace(/__slice\.fa$/, "")}_|`)).toBe(true);
    const region = parseSliceHeader(header.slice(1))!;
    const seq = lines.join("");
    expect(region.strand).toBe("+");
    expect(seq).toMatch(/^[ACGT]+$/i);
    expect(seq.length).toBe(region.end - region.start + 1);
  });
});

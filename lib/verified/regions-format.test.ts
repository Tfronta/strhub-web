import { describe, expect, it } from "vitest";
import { detectRegionsFormat, countRegions } from "./regions-format";

describe("detectRegionsFormat", () => {
  it("recognises the four library layouts", () => {
    expect(detectRegionsFormat("chr1\t10\t50\t4\t10.0\tD1S1656\tCTAT\n")).toBe("hipstr");
    expect(detectRegionsFormat("chr1\t10\t50\t4\tCTAT\n")).toBe("gangstr");
    expect(detectRegionsFormat("#Chr\tStart\tEnd\tPeriod\tRef\tMarker\tName\tStruct\tStrand\t5'\t3'\nchr1\t10\t50\t4\t10\tX\tX\t[CTAT]n\t+\tAAAA\tCCCC\n")).toBe("strsearch");
    expect(detectRegionsFormat("chr1\t10\t50\tD1S1656\n")).toBe("bed4");
  });

  it("recognises a 590-locus HipSTR reference as hipstr", () => {
    const big = Array.from({ length: 590 }, (_, i) => `chr1\t${i * 1000}\t${i * 1000 + 40}\t4\t10.0\tL${i}\tACGT`).join("\n");
    expect(detectRegionsFormat(big)).toBe("hipstr");
    expect(countRegions(big)).toBe(590);
  });

  it("returns null for something that is not a regions file", () => {
    expect(detectRegionsFormat("hello world\n")).toBeNull();
    expect(detectRegionsFormat("")).toBeNull();
  });
});

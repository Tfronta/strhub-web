import { describe, expect, it } from "vitest";
import { classifyLog } from "./log-kinds";

describe("classifyLog", () => {
  it("names the shell's command-not-found and where it usually comes from", () => {
    const f = classifyLog("bash: HipSTR: command not found");
    expect(f.map((x) => x.kind)).toEqual(["cmd_not_found"]);
    expect(f[0].side).toBe("setup");
  });

  it("finds several kinds in one log, once each, in order", () => {
    const log = [
      "Traceback (most recent call last):",
      "ModuleNotFoundError: No module named 'pysam'",
      "ModuleNotFoundError: No module named 'numpy'",
      "[E::hts_open] cannot open /data/in.bam",
    ].join("\n");
    expect(classifyLog(log).map((x) => x.kind)).toEqual(["missing_module", "cannot_open"]);
  });

  it("does not read a usage block as an error", () => {
    expect(classifyLog("usage: tool [--bams] An invalid option --x is rejected")).toEqual([]);
    expect(classifyLog("tool: error: unrecognized argument --min-reads")[0]?.kind).toBe("bad_option");
  });

  it("puts unresolvable pins on the tool's side", () => {
    const f = classifyLog("ERROR: No matching distribution found for pysam==0.15.0");
    expect(f[0]).toMatchObject({ kind: "pip_unresolvable", side: "tool" });
  });

  it("files one line under one kind only, the most specific", () => {
    const f = classifyLog("[E::hts_open] cannot open /x/vWA.bam: No such file or directory");
    expect(f.map((x) => x.kind)).toEqual(["cannot_open"]);
  });

  it("returns nothing for a clean log", () => {
    expect(classifyLog("Processing complete: not found any errors\nDone.")).toEqual([]);
  });
});

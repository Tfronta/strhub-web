import { describe, expect, it } from "vitest";
import { extractFailureExcerpt } from "./failure-excerpt";

describe("extractFailureExcerpt", () => {
  it("returns null on missing or empty logs", () => {
    expect(extractFailureExcerpt(undefined)).toBeNull();
    expect(extractFailureExcerpt({})).toBeNull();
    expect(extractFailureExcerpt([])).toBeNull();
  });

  it("extracts the tail lines and matches path error from STRspy log", () => {
    const strspyLog = `
#BEDTOOLS :
#MINIMAP :
#SAMTOOLS :
#XATLAS :
#PARALLEL :
please make sure you are in the same directory of STRspy
`;
    const excerpt = extractFailureExcerpt({ external: strspyLog });
    expect(excerpt).not.toBeNull();
    expect(excerpt?.leg).toBe("external");
    expect(excerpt?.text).toContain("please make sure you are in the same directory of STRspy");
    expect(excerpt?.hintKey).toBe("verified.trial.hint.pathOrFile");
  });

  it("matches missing dependency error", () => {
    const log = `
Running pipeline...
/bin/bash: line 1: minimap2: command not found
`;
    const excerpt = extractFailureExcerpt([{ leg: "own", text: log }]);
    expect(excerpt).not.toBeNull();
    expect(excerpt?.leg).toBe("own");
    expect(excerpt?.hintKey).toBe("verified.trial.hint.missingDependency");
  });

  it("prioritizes external execution over build log", () => {
    const logs = {
      build: "Successfully built image",
      external: "FATAL: cannot open /data/in/input.bam",
    };
    const excerpt = extractFailureExcerpt(logs);
    expect(excerpt?.leg).toBe("external");
    expect(excerpt?.hintKey).toBe("verified.trial.hint.pathOrFile");
  });

  it("matches /bin/sh command not found (e.g. STRsearch sh: 1: YOUR: not found)", () => {
    const logs = {
      build: "#12 naming to docker.io/library/toolimg:ci done\n#12 DONE 2.4s",
      example:
        "mesg: ttyname failed: Inappropriate ioctl for device\nsh: 1: YOUR: not found\nsh: 1: YOUR: not found\n",
    };
    const excerpt = extractFailureExcerpt(logs, 14, {
      installs: true,
      runs: false,
      example: true,
    });
    expect(excerpt).not.toBeNull();
    expect(excerpt?.leg).toBe("example");
    expect(excerpt?.text).toContain("sh: 1: YOUR: not found");
    expect(excerpt?.hintKey).toBe("verified.trial.hint.missingDependency");
  });

  it("skips a successful build log when installs passed and no execution failed", () => {
    const logs = {
      build: "#12 naming to docker.io/library/toolimg:ci done\n#12 DONE 2.4s",
      starts: "usage: mytool [--help]",
    };
    const excerpt = extractFailureExcerpt(logs, 14, {
      installs: true,
      starts: true,
      runs: false,
    });
    expect(excerpt).toBeNull();
  });
});


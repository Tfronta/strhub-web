import { describe, expect, it } from "vitest";
import { commandFromManifest, formatCommand, toolCommand } from "./command";

const WRAPPED =
  "cd '/opt/tool' && touch /tmp/.strhub_mark && ( ./HipSTR --bams /data/in/input.bam --str-vcf str_calls.vcf.gz ); rc=$?; " +
  "find . -type f -newer /tmp/.strhub_mark -size +0 ! -path './.git/*' 2>/dev/null | head -500 | " +
  'while IFS= read -r f; do mkdir -p "/data/out/$(dirname "$f")" && cp "$f" "/data/out/$f"; done; exit $rc';

describe("the tool's own command", () => {
  it("is what sits inside the capture wrapper", () => {
    expect(toolCommand(WRAPPED)).toBe("./HipSTR --bams /data/in/input.bam --str-vcf str_calls.vcf.gz");
  });

  it("is the command itself when nothing wraps it", () => {
    expect(toolCommand("  GangSTR --bam in.bam --out out ")).toBe("GangSTR --bam in.bam --out out");
  });

  it("can be read off a manifest, quoted or not", () => {
    expect(commandFromManifest(`tool:\n  name: x\nrun:\n  cmd: "${WRAPPED.replace(/"/g, '\\"')}"\n  timeout_minutes: 5\n`))
      .toContain("./HipSTR --bams");
    expect(commandFromManifest("run:\n  cmd: GangSTR --bam in.bam\n")).toBe("GangSTR --bam in.bam");
    expect(commandFromManifest("tool:\n  name: x\n")).toBeNull();
  });
});

describe("formatting", () => {
  it("leaves a short command on one line", () => {
    expect(formatCommand("GangSTR   --bam in.bam --out out")).toBe("GangSTR --bam in.bam --out out");
  });

  it("breaks a long command before each flag, with a continuation the shell accepts", () => {
    const cmd = "./HipSTR --bams /data/in/input.bam --fasta /data/ref/hg38.fa --regions /data/in/regions.bed --str-vcf str_calls.vcf.gz";
    expect(formatCommand(cmd)).toBe(
      "./HipSTR \\\n  --bams /data/in/input.bam \\\n  --fasta /data/ref/hg38.fa \\\n  --regions /data/in/regions.bed \\\n  --str-vcf str_calls.vcf.gz",
    );
  });
});

import { describe, expect, it } from "vitest";
import { parseBlocks, parseInline, parseLine } from "./minimal-markdown";
import { hipstrTutorial } from "./index";

describe("minimal markdown", () => {
  it("reads code, bold and italics, with code winning over asterisks", () => {
    expect(parseInline("the *read group* (`@RG`), **no** header, `ls /tmp/*.html`")).toEqual([
      { type: "text", text: "the " },
      { type: "em", children: [{ type: "text", text: "read group" }] },
      { type: "text", text: " (" },
      { type: "code", text: "@RG" },
      { type: "text", text: "), " },
      { type: "strong", children: [{ type: "text", text: "no" }] },
      { type: "text", text: " header, " },
      { type: "code", text: "ls /tmp/*.html" },
    ]);
  });

  it("joins wrapped lines into one paragraph and keeps a line that starts with >", () => {
    const blocks = parseBlocks("split them at `:` (Data\n> Text to Columns).\n");
    expect(blocks).toEqual([
      {
        type: "paragraph",
        children: [
          { type: "text", text: "split them at " },
          { type: "code", text: ":" },
          { type: "text", text: " (Data > Text to Columns)." },
        ],
      },
    ]);
  });

  it("reads lists with continuation lines and 4-space command blocks", () => {
    const blocks = parseBlocks(
      "Intro.\n\n- **2 loci**: SE33 and D21S11\n  (127 bp).\n- one more\n\n    make genotype\n    make table\n",
    );
    expect(blocks.map((b) => b.type)).toEqual(["paragraph", "list", "code"]);
    expect(blocks[1]).toEqual({
      type: "list",
      items: [
        [
          { type: "strong", children: [{ type: "text", text: "2 loci" }] },
          { type: "text", text: ": SE33 and D21S11 (127 bp)." },
        ],
        [{ type: "text", text: "one more" }],
      ],
    });
    expect(blocks[2]).toEqual({ type: "code", text: "make genotype\nmake table" });
  });

  it("flattens one-line text", () => {
    expect(parseLine("Linux with a\n  recent compiler.\n")).toEqual([
      { type: "text", text: "Linux with a recent compiler." },
    ]);
  });
});

describe("the HipSTR tutorial JSON", () => {
  it("has the same steps, commands and outputs in every language", () => {
    const { en, es, pt } = hipstrTutorial.i18n;
    for (const other of [es, pt]) {
      expect(other.steps.map((s) => s.id)).toEqual(en.steps.map((s) => s.id));
      expect(other.steps.map((s) => s.command)).toEqual(en.steps.map((s) => s.command));
      expect(other.steps.map((s) => s.output ?? null)).toEqual(en.steps.map((s) => s.output ?? null));
      expect(other.setup).toBe(en.setup);
    }
  });

  it("has a title, a summary and an explanation for every step", () => {
    for (const text of Object.values(hipstrTutorial.i18n)) {
      expect(text.title.trim()).not.toBe("");
      expect(text.summary.trim()).not.toBe("");
      for (const step of text.steps) {
        expect(step.title.trim(), step.id).not.toBe("");
        expect(parseBlocks(step.explain).length, step.id).toBeGreaterThan(0);
      }
    }
  });
});

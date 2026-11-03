import { describe, expect, it } from "vitest";
import en from "@/lib/i18n/locales/en/verified";
import es from "@/lib/i18n/locales/es/verified";
import pt from "@/lib/i18n/locales/pt/verified";
import { buildReadmeTemplate, step1For } from "./step1";
import type { VerifiedReport, VerifiedStep1 } from "@/types/verified";

/** Reads the real locale files, so a missing key fails here and not in a page. */
const translator = (locale: Record<string, unknown>) => (key: string) => {
  let node: unknown = locale;
  for (const part of key.split(".")) {
    if (typeof node !== "object" || node === null) return key;
    node = (node as Record<string, unknown>)[part];
  }
  return typeof node === "string" ? node : key;
};

const LOCALES = { en, es, pt } as Record<string, Record<string, unknown>>;

const step1 = (over: Partial<VerifiedStep1> = {}): VerifiedStep1 => ({
  code: "runs",
  headline: "",
  body: "",
  missing: [],
  guide: "docs/GUIA-PASO-1.md",
  ...over,
});

describe("step 1, the documented run", () => {
  it("is absent on a report written before the engine carried it", () => {
    expect(step1For(null, translator(en))).toBeNull();
    expect(step1For(step1({ code: "none" }), translator(en))).toBeNull();
  });

  it("names the missing block in the reader's language", () => {
    const t = translator(es);
    const got = step1For(step1({ code: "cannot_tell", missing: ["command"] }), t);
    expect(got?.headline).toBe("Así como está documentado, un tercero no puede saber cómo correrla.");
    expect(got?.missing).toEqual(["Un comando"]);
    expect(got?.tone).toBe("grey");
  });

  it("carries every sentence and every block in all three locales", () => {
    for (const [name, locale] of Object.entries(LOCALES)) {
      const t = translator(locale);
      for (const code of ["runs", "does_not_run", "cannot_tell", "ours"] as const) {
        const got = step1For(step1({ code, missing: ["install", "command", "input", "output"] }), t);
        expect(got, `${name}/${code}`).not.toBeNull();
        // An untranslated key comes back as the key itself.
        expect(got!.headline, `${name}/${code} headline`).not.toContain("verified.");
        expect(got!.body, `${name}/${code} body`).not.toContain("verified.");
        for (const block of got!.missing) {
          expect(block, `${name}/${code} block`).not.toContain("verified.");
        }
      }
    }
  });

  it("never says the tool does not work, in any locale", () => {
    // The phrase may appear only inside the sentence that denies it.
    const denials: Record<string, RegExp> = {
      en: /does not mean the tool does not work/,
      es: /no significa que la herramienta no funcione/,
      pt: /não significa que a ferramenta não funcione/,
    };
    const claims: Record<string, RegExp> = {
      en: /the tool does not work/,
      es: /la herramienta no funcione|la herramienta no funciona/,
      pt: /a ferramenta não funcione|a ferramenta não funciona/,
    };
    for (const [name, locale] of Object.entries(LOCALES)) {
      const t = translator(locale);
      for (const code of ["runs", "does_not_run", "cannot_tell", "ours"] as const) {
        const body = step1For(step1({ code }), t)!.body;
        if (claims[name].test(body)) {
          expect(body, `${name}/${code}`).toMatch(denials[name]);
        }
      }
    }
  });

  it("does not ask the author for anything when the limitation is ours", () => {
    for (const [name, locale] of Object.entries(LOCALES)) {
      const got = step1For(step1({ code: "ours" }), translator(locale))!;
      expect(got.tone, name).toBe("grey");
      expect(got.missing, name).toEqual([]);
    }
  });

  it("builds a ready-to-paste README template pre-filling detected evidence and marking missing blocks", () => {
    const snippet = buildReadmeTemplate({
      tool: { id: "my-tool", name: "MyTool" } as VerifiedReport["tool"],
      step1: step1({ code: "cannot_tell", missing: ["command", "output"] }),
      evidence: [
        {
          claim: "install_method",
          kind: "readme",
          path: "README.md",
          line: 12,
          text: "conda install -c bioconda mytool=1.2.0",
          url: "https://github.com/example/mytool/blob/main/README.md#L12",
        },
      ],
      io_detail: undefined,
      run: undefined,
    });
    expect(snippet).toContain("## Installation");
    expect(snippet).toContain("conda install -c bioconda mytool=1.2.0");
    expect(snippet).toContain("# TODO: one concrete command for a single sample");
    expect(snippet).toContain("TODO: name the output file explicitly");
  });
});

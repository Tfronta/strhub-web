import { describe, expect, it } from "vitest";
import { translate, translations, type Language } from "./translations";
import { countNoun } from "./plural";

const LANGS: Language[] = ["en", "es", "pt"];

/** The marker Overview sentence, composed exactly as MarkerSummarySections does. */
function variantsSentence(lang: Language, variants: number, designations: number) {
  const s = (key: string, params?: Record<string, string>) =>
    translate(lang, `marker.summary.${key}`, params);
  return s("variants", {
    variants: s("variantCount", { count: String(variants) }),
    designations: s("designationCount", { count: String(designations) }),
  });
}

describe("plural forms", () => {
  it("writes the STRbase variants sentence in the singular and the plural", () => {
    expect(variantsSentence("en", 1, 1)).toBe(
      "STRbase reports 1 sequence variant across 1 allele designation.",
    );
    expect(variantsSentence("en", 12, 8)).toBe(
      "STRbase reports 12 sequence variants across 8 allele designations.",
    );
    expect(variantsSentence("es", 1, 1)).toBe(
      "STRbase recoge 1 variante de secuencia en 1 designación alélica.",
    );
    expect(variantsSentence("es", 12, 8)).toBe(
      "STRbase recoge 12 variantes de secuencia en 8 designaciones alélicas.",
    );
    expect(variantsSentence("pt", 1, 1)).toBe(
      "O STRbase registra 1 variante de sequência em 1 designação alélica.",
    );
    expect(variantsSentence("pt", 12, 8)).toBe(
      "O STRbase registra 12 variantes de sequência em 8 designações alélicas.",
    );
  });

  it("uses the singular form for count 1 in the Verified strings", () => {
    const one = { format: "X", count: "1", sample: "D3S1358" };
    const many = { format: "X", count: "3", sample: "D3S1358" };
    expect(translate("en", "verified.submit.detectLoci", one)).toBe("Found 1 marker: D3S1358…");
    expect(translate("en", "verified.submit.detectLoci", many)).toBe(
      "Found 3 distinct markers: D3S1358…",
    );
    expect(translate("es", "verified.submit.detectLoci", one)).toBe(
      "Encontramos 1 marcador: D3S1358…",
    );
    expect(translate("pt", "verified.submit.detectLoci", many)).toBe(
      "Encontramos 3 marcadores distintos: D3S1358…",
    );
    for (const lang of LANGS) {
      expect(translate(lang, "verified.submit.regionsDetected", one)).not.toMatch(
        /\b1 (regions|regiones|regiões)\b/,
      );
    }
  });

  it("never prints the number 1 before a plural noun in the count templates", () => {
    const keys = [
      "marker.summary.variantCount",
      "marker.summary.designationCount",
      "verified.submit.detectLoci",
      "verified.submit.regionsDetected",
    ];
    for (const lang of LANGS) {
      for (const key of keys) {
        const text = translate(lang, key, { count: "1", format: "X", sample: "Y" });
        expect(text, `${lang} ${key}`).not.toMatch(
          /\b1 (sequence variants|allele designations|distinct markers|regions|variantes|designaciones|designações|marcadores|regiones|regiões)\b/,
        );
      }
    }
  });

  it("defines every plural key in all three languages", () => {
    const pluralKeys = (obj: unknown, prefix = ""): string[] =>
      Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
        v && typeof v === "object"
          ? pluralKeys(v, `${prefix}${k}.`)
          : /_(one|other)$/.test(k)
            ? [`${prefix}${k}`]
            : [],
      );
    const lookup = (lang: Language, path: string) =>
      path.split(".").reduce<unknown>((o, k) => (o as Record<string, unknown>)?.[k], translations[lang]);
    const all = new Set(LANGS.flatMap((lang) => pluralKeys(translations[lang])));
    expect(all.size).toBeGreaterThan(0);
    for (const key of all) {
      for (const lang of LANGS) {
        expect(typeof lookup(lang, key), `${lang} ${key}`).toBe("string");
      }
    }
  });

  it("leaves lookups without a count unchanged", () => {
    expect(translate("en", "common.notAvailable")).toBe("Not available");
    expect(translate("es", "common.notAvailable")).toBe("No disponible");
    expect(translate("pt", "common.notAvailable")).toBe("Não disponível");
    expect(translate("en", "no.such.key")).toBe("no.such.key");
  });

  it("builds English count phrases for server-side text", () => {
    expect(countNoun(1, "population", "populations")).toBe("1 population");
    expect(countNoun(7, "population", "populations")).toBe("7 populations");
  });
});

describe("FSSG citation strings", () => {
  it("cite the same version and file in every language", () => {
    for (const lang of LANGS) {
      const source = translate(lang, "marker.summary.structureSource");
      expect(source, lang).toContain("{version}");
      expect(source, lang).toContain("{strider}");
      expect(source, lang).toContain("{file}");
      expect(source, lang).not.toMatch(/beta|2024-09-05|05\/09\/2024/);
      const value = translate(lang, "motifExplorerPage.sourceValue");
      expect(value, lang).toMatch(/^\{version\} \(\{publisher\}; .+ \{file\}\)$/);
    }
  });
});

import { describe, expect, it } from "vitest";
import en from "./en/verified";
import es from "./es/verified";
import pt from "./pt/verified";

type Tree = { [key: string]: string | Tree };

function flatten(tree: Tree, prefix = ""): string[] {
  return Object.entries(tree).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === "string" ? [path] : flatten(value, path);
  });
}

const keys = {
  en: flatten(en as unknown as Tree).sort(),
  es: flatten(es as unknown as Tree).sort(),
  pt: flatten(pt as unknown as Tree).sort(),
};

describe("verified translations", () => {
  it("es carries every key en does", () => {
    expect(keys.es.filter((k) => !keys.en.includes(k))).toEqual([]);
    expect(keys.en.filter((k) => !keys.es.includes(k))).toEqual([]);
  });

  it("pt carries every key en does", () => {
    expect(keys.pt.filter((k) => !keys.en.includes(k))).toEqual([]);
    expect(keys.en.filter((k) => !keys.pt.includes(k))).toEqual([]);
  });

  it("includes the automatic-configuration keys", () => {
    expect(keys.en).toContain("verified.submit.autoConfigTitle");
    expect(keys.en).toContain("verified.submit.autoConfigGroup.compat");
  });
});

import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import names from "@/data/strnaming_names.json";
import { markerData } from "@/lib/markerData";
import referenceCopy from "@/data/strnaming_reference_names.json";
import { FSSG_MARKERS } from "@/app/tools/str-motif-explorer/data/fssgData";
import {
  parseStrNamingName,
  templateIndexOf,
} from "@/app/tools/str-motif-explorer/utils/bracketing";

type Row = { h: string; name: string | null; status: string; isfg?: string; heldCe?: string };
const strbase = names.strbase as Record<string, Row[]>;
const reference = names.reference as Record<string, string>;
const markers = markerData as unknown as Record<string, { sequences: { allele: string; sequence: string }[] }>;

const hash = (seq: string) => createHash("sha1").update(seq.toUpperCase()).digest("hex").slice(0, 10);
const ceOf = (name: string) => name.match(/^CE([\d.]+)_/)?.[1];

describe("STRNaming names (data/strnaming_names.json)", () => {
  it("stays index-aligned with the STRbase sequences in markerData", () => {
    for (const [id, rows] of Object.entries(strbase)) {
      const seqs = markers[id]?.sequences ?? [];
      expect(rows.length, id).toBe(seqs.length);
      rows.forEach((row, i) => expect(row.h, `${id}[${i}]`).toBe(hash(seqs[i].sequence)));
    }
  });

  it("only publishes names whose CE equals the STRbase allele designation", () => {
    for (const [id, rows] of Object.entries(strbase)) {
      rows.forEach((row, i) => {
        if (row.status !== "ok") {
          expect(row.name, `${id}[${i}]`).toBeNull();
          return;
        }
        const ce = ceOf(row.name ?? "");
        expect(Number(ce), `${id}[${i}] ${row.name}`).toBe(Number(markers[id].sequences[i].allele));
      });
    }
  });

  it("stores the ISFG window that produced each name, cut from the STRbase sequence", () => {
    for (const [id, rows] of Object.entries(strbase)) {
      rows.forEach((row, i) => {
        const where = `${id}[${i}]`;
        if (row.status === "not_covered") {
          expect(row.isfg, where).toBeUndefined();
          return;
        }
        expect(markers[id].sequences[i].sequence.toUpperCase(), where).toContain(row.isfg);
        if (row.status === "held") {
          expect(Number(row.heldCe), where).not.toBe(Number(markers[id].sequences[i].allele));
        }
      });
    }
  });

  it("names the reference allele with the FSSG CE", () => {
    for (const [locus, name] of Object.entries(reference)) {
      const fssg = FSSG_MARKERS[locus];
      expect(fssg, locus).toBeDefined();
      expect(Number(ceOf(name)), `${locus} ${name}`).toBe(Number(fssg.ce));
    }
  });

  it("keeps the Motif Explorer's copy of the reference names identical", () => {
    expect(referenceCopy.reference).toEqual(reference);
  });

  it("spells out a stretch of the reference sequence over the ISFG minimum range", () => {
    for (const [locus, name] of Object.entries(reference)) {
      const { blocks } = parseStrNamingName(name)!;
      const expanded = blocks.map((b) => b.motif.repeat(b.count ?? 0)).join("");
      expect(FSSG_MARKERS[locus].minimumRangeSequence, `${locus} ${name}`).toContain(expanded);
    }
  });

  it("fits one of STRidER's STRNaming-formatted templates for the locus", () => {
    for (const [locus, name] of Object.entries(reference)) {
      const forms = FSSG_MARKERS[locus].canonicalBracketing;
      expect(templateIndexOf(name, forms), `${locus} ${name}`).toBeGreaterThanOrEqual(0);
    }
  });
});

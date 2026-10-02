import { describe, expect, it } from "vitest";
import { buildMarkerSummary } from "@/lib/marker-summary";
import { markerData } from "@/lib/markerData";
import { markerFrequenciesNGS } from "./markerFrequencies";
import {
  FREQUENCY_CSV_COLUMNS,
  NGS_1000G,
  POPSTR_CE,
  VARIANT_CSV_COLUMNS,
  frequencyCsv,
  frequencyCsvFilename,
  toCsv,
  variantAllelesCsv,
} from "./csvExport";

// Every cell is quoted by toCsv, so splitting on '","' is enough here.
const parse = (csv: string) =>
  csv.split("\n").map((line) => line.slice(1, -1).split('","').map((c) => c.replace(/""/g, '"')));

const variantRows = (id: string) => {
  const marker = markerData[id as keyof typeof markerData] as unknown as {
    name: string;
    sequences: Array<{ allele: string; sequence: string }>;
  };
  const summary = buildMarkerSummary(id)!;
  const [header, ...rows] = parse(
    variantAllelesCsv({
      locus: marker.name,
      sequences: marker.sequences,
      names: summary.variantNames,
      minimumRange: summary.fssg?.components[0]?.minimumRange ?? null,
      fssgVersion: "FSSG v6.1",
    }),
  );
  return { header, rows: rows.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i]]))) };
};

describe("toCsv", () => {
  it("quotes every cell and doubles inner quotes", () => {
    expect(toCsv([["a", 'b"c', null, 3]])).toBe('"a","b""c","","3"');
  });
});

describe("variant alleles CSV", () => {
  it("has stable columns", () => {
    expect(variantRows("csf1po").header).toEqual([...VARIANT_CSV_COLUMNS]);
  });

  it("gives, for a named allele, the exact STRNaming input and its range", () => {
    const row = variantRows("csf1po").rows[4];
    expect(row).toMatchObject({
      locus: "CSF1PO",
      strbase_allele: "8",
      isfg_minimum_range: "chr5:150076318-150076380 (GRCh38, forward strand)",
      isfg_minimum_sequence: "CTTCCTATCTATCTATCTATCTATCTATCTATCTATCTAATCT",
      strnaming_name: "CE8_TCTA[8]",
      status: "ok",
      strnaming_version: "STRNaming 1.2.1",
      fssg_version: "FSSG v6.1",
    });
    // The STRbase sequence is kept as published, over its own window.
    expect(row.strbase_sequence.length).toBe(157);
    expect(row.strbase_sequence.toUpperCase()).toContain(row.isfg_minimum_sequence);
  });

  it("never makes a held or not-covered row look validated", () => {
    const held = variantRows("vwa").rows[28];
    expect(held).toMatchObject({ strbase_allele: "16", strnaming_name: "", status: "held" });
    expect(held.status_note).toBe(
      "Held for review: STRNaming gives CE8.3 for isfg_minimum_sequence, the STRbase designation is 16; no name published",
    );
    expect(held.isfg_minimum_sequence).not.toBe("");

    const notCovered = variantRows("tpox").rows[11];
    expect(notCovered).toMatchObject({
      strnaming_name: "",
      status: "not_covered",
      isfg_minimum_sequence: "",
      isfg_minimum_range: "",
      fssg_version: "",
    });
  });

  it("names all 1569 published alleles and no other row", () => {
    let named = 0;
    for (const [id, marker] of Object.entries(markerData)) {
      if (!(marker as { sequences?: readonly unknown[] }).sequences?.length) continue;
      for (const row of variantRows(id).rows) {
        if (row.strnaming_name) {
          named++;
          expect(row.status, `${id} ${row.strbase_allele}`).toBe("ok");
          expect(row.isfg_minimum_sequence).not.toBe("");
        }
      }
    }
    expect(named).toBe(1569);
  });
});

describe("frequency CSV", () => {
  it("carries technology, allele type and source on every row, and the stored precision", () => {
    const entries = markerFrequenciesNGS.csf1po.AFR!;
    const csv = frequencyCsv(
      "CSF1PO",
      entries.map((e) => ({ population: "AFR", ...e })),
      () => NGS_1000G,
    );
    const [header, first] = parse(csv);
    expect(header).toEqual([...FREQUENCY_CSV_COLUMNS]);
    expect(first).toEqual([
      "CSF1PO",
      "NGS",
      "Length-based allele (fragment length from NGS data; no sequence reported)",
      "AFR",
      "7",
      "0.06647",
      "67",
      NGS_1000G.source,
      NGS_1000G.reference,
    ]);
  });

  it("leaves the count empty where the dataset gives none, instead of writing 0", () => {
    const [, row] = parse(
      frequencyCsv("CSF1PO", [{ population: "AFR", allele: "10", frequency: 0.274, count: 0 }], () => POPSTR_CE),
    );
    expect(row[1]).toBe("CE");
    expect(row[5]).toBe("0.274");
    expect(row[6]).toBe("");
  });

  it("puts the technology in the file name, so CE and NGS files for one population differ", () => {
    expect(frequencyCsvFilename("CSF1PO", "CE", "AFR")).toBe("CSF1PO_CE_AFR_frequencies.csv");
    expect(frequencyCsvFilename("CSF1PO", "NGS", "AFR")).toBe("CSF1PO_NGS_AFR_frequencies.csv");
  });
});

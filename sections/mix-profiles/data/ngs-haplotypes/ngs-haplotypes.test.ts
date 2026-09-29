import { describe, expect, it, vi } from "vitest";
import HG00097 from "./HG00097.json";
import HG00145 from "./HG00145.json";
import HG00372 from "./HG00372.json";
import HG01063 from "./HG01063.json";
import HG02944 from "./HG02944.json";
import { getSampleNgsLocus, isNoCall } from "./index";
import type { LocusRecord } from "./parseNgsHaplotypes";
import {
  LOCI_ORDER,
  SAMPLE_DATABASE,
  cePeaksToNGSRowsWithSeq,
  getTrueGenotype,
  type LocusId,
  type Peak,
  type SampleId,
} from "../../data";
import { shouldShowIsoBadgeOnMinorRow } from "@/lib/strFormatting";

type Doc = { sample: string; loci: LocusRecord[] };
const SAMPLES = [HG00097, HG00145, HG00372, HG01063, HG02944] as unknown as Doc[];

const alleles = () =>
  SAMPLES.flatMap((doc) =>
    doc.loci.flatMap((L) =>
      ([1, 2] as const).map((k) => ({ sample: doc.sample, L, k, tag: `${doc.sample} ${L.locus} a${k}` }))
    )
  );
const field = <T,>(L: LocusRecord, name: string) => L[name] as T;
const ceOf = (name: string) => name.match(/^CE([\d.]+)_/)?.[1];

describe("Mix Profiles NGS haplotypes", () => {
  it("shows only observed sequence: each ISFG window is the HipSTR allele trimmed to the range", () => {
    for (const { L, k, tag } of alleles()) {
      const allele = field<string>(L, `allele_seq${k}`).toUpperCase();
      const trim5 = field<number>(L, `isfg_trim5_bp_${k}`);
      const trim3 = field<number>(L, `isfg_trim3_bp_${k}`);
      expect(field<number>(L, `isfg_ref5_bp_${k}`), tag).toBe(0);
      expect(field<number>(L, `isfg_ref3_bp_${k}`), tag).toBe(0);
      expect(allele.slice(trim5, allele.length - trim3), tag).toBe(field<string>(L, `isfg_seq${k}`));
    }
  });

  it("records each no-call consistently in the data and the simulator", () => {
    const docs = SAMPLES as unknown as Array<Doc & { source: { no_calls: Array<{ locus: string }> } }>;
    let total = 0;
    for (const doc of docs) {
      for (const { locus } of doc.source.no_calls) {
        total++;
        const tag = `${doc.sample} ${locus}`;
        expect(doc.loci.some((L) => L.locus === locus), tag).toBe(false);
        expect(getTrueGenotype(doc.sample as SampleId, locus as LocusId), tag).toBeNull();
        expect(isNoCall(doc.sample, locus), tag).toBe(true);
        // a no-call must not remove the locus from the simulator
        expect(LOCI_ORDER, tag).toContain(locus);
      }
      // every simulator locus of the sample is either called or a recorded no-call
      for (const locus of Object.keys(SAMPLE_DATABASE[doc.sample as SampleId]?.loci ?? {})) {
        if (locus === "D21S11") continue; // not a Mix Profiles locus
        expect(doc.loci.some((L) => L.locus === locus), `${doc.sample} ${locus}`).toBe(true);
      }
    }
    expect(total).toBe(2);
    expect(LOCI_ORDER).toHaveLength(21);
  });

  it("keeps the allele whole inside full_seq (no flank bases trimmed)", () => {
    for (const { L, k, tag } of alleles()) {
      const allele = field<string>(L, `allele_seq${k}`);
      expect(field<number>(L, `overlap_left_bp_${k}`), tag).toBe(0);
      expect(field<number>(L, `overlap_right_bp_${k}`), tag).toBe(0);
      expect(field<string>(L, `full_seq${k}`).slice(25, 25 + allele.length), tag).toBe(allele);
    }
  });

  it("colours exactly the ISFG window", () => {
    for (const { L, k, tag } of alleles()) {
      const segs = field<Array<{ t: string; c: string }>>(L, `isfgSegments${k}`);
      expect(segs.map((s) => s.t).join(""), tag).toBe(field<string>(L, `isfg_seq${k}`));
    }
  });

  it("names every allele with its own CE call", () => {
    for (const { L, k, tag } of alleles()) {
      expect(ceOf(field<string>(L, `bracketed${k}`)), tag).toBe(field<string>(L, `allele_call${k}`));
    }
    for (const doc of SAMPLES) {
      for (const L of doc.loci) {
        const calls = [String(L.allele_call1), String(L.allele_call2)].sort((a, b) => Number(a) - Number(b));
        expect(L.genotype_forense, `${doc.sample} ${L.locus}`).toBe(calls.join("/"));
      }
    }
  });

  it("agrees with the CE genotype the simulator uses", () => {
    for (const doc of SAMPLES) {
      for (const L of doc.loci) {
        const g = getTrueGenotype(doc.sample as SampleId, L.locus as LocusId);
        expect(g, `${doc.sample} ${L.locus}`).not.toBeNull();
        const ce = [String(g!.allele1), String(g!.allele2)].sort();
        expect(ce, `${doc.sample} ${L.locus}`).toEqual([String(L.allele_call1), String(L.allele_call2)].sort());
      }
    }
  });

  it("shows each NGS table row with the haplotype of its own allele", () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    for (const doc of SAMPLES) {
      const sampleId = doc.sample as SampleId;
      for (const locus of Object.keys(SAMPLE_DATABASE[sampleId]?.loci ?? {}) as LocusId[]) {
        if (!getSampleNgsLocus(sampleId, locus)) continue;
        const g = getTrueGenotype(sampleId, locus)!;
        const peaks: Peak[] = [g.allele1, g.allele2].map((a) => ({ allele: a, rfu: 1000, kind: "true", source: "A" }));
        const rows = cePeaksToNGSRowsWithSeq(locus, peaks, [{ sampleId, proportion: 1, label: "A" }]);
        for (const r of rows) {
          if (typeof r.repeatSequence === "string" && r.repeatSequence.startsWith("CE")) {
            expect(ceOf(r.repeatSequence), `${sampleId} ${locus} row ${r.allele}`).toBe(String(r.allele));
          }
        }
      }
    }
  });
});

describe("NGS table read support (PDP vs simulated)", () => {
  const truePeaks = (alleles: Array<string | number>): Peak[] =>
    alleles.map((a) => ({ allele: a, rfu: 1000, kind: "true", source: "A" }) as Peak);

  it("gives real samples their single-source HipSTR PDP, which sums to DP and ignores the mixture proportion", () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    for (const doc of SAMPLES) {
      const sampleId = doc.sample as SampleId;
      for (const L of doc.loci) {
        const locus = L.locus as LocusId;
        const g = getTrueGenotype(sampleId, locus)!;
        const peaks = truePeaks([g.allele1, g.allele2]);
        const full = cePeaksToNGSRowsWithSeq(locus, peaks, [{ sampleId, proportion: 1, label: "A" }]);
        const minor = cePeaksToNGSRowsWithSeq(locus, peaks, [{ sampleId, proportion: 0.1, label: "A" }]);
        const tag = `${doc.sample} ${L.locus}`;
        expect(full.every((r) => r.coverageSource === "hipstr"), tag).toBe(true);
        const sum = full.reduce((s, r) => s + r.coverage, 0);
        expect(sum, tag).toBeCloseTo(field<number>(L, "DP"), 1);
        expect(minor.map((r) => r.coverage), tag).toEqual(full.map((r) => r.coverage));
      }
    }
  });

  it("shows the HG00097 vWA isoalleles whatever the read support", () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    const sampleId = "HG00097" as SampleId;
    const g = getTrueGenotype(sampleId, "vWA")!;
    const rows = cePeaksToNGSRowsWithSeq("vWA", truePeaks([g.allele1, g.allele2]), [
      { sampleId, proportion: 1, label: "A" },
    ]);
    const isoRows = (rs: typeof rows) => rs.filter((r) => shouldShowIsoBadgeOnMinorRow(r, rs));
    expect(new Set(rows.map((r) => r.repeatSequence)).size).toBe(2);
    expect(isoRows(rows)).toHaveLength(1);
    // Same example with very low support: the sequence distinction stays visible.
    const low = rows.map((r) => ({ ...r, coverage: r.coverage / 20 }));
    expect(Math.max(...low.map((r) => r.coverage))).toBeLessThan(2);
    expect(isoRows(low)).toHaveLength(1);
    expect(isoRows(low)[0].repeatSequence).toBe(isoRows(rows)[0].repeatSequence);
  });

  it("marks the synthetic triallelic sample as simulated read support, never PDP", () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    for (const locus of ["TPOX", "TH01"] as LocusId[]) {
      const g = getTrueGenotype("SYN_TRI01" as SampleId, locus)!;
      const rows = cePeaksToNGSRowsWithSeq(locus, truePeaks([g.allele1, g.allele2, g.allele3!]), [
        { sampleId: "SYN_TRI01" as SampleId, proportion: 1, label: "A" },
      ]);
      expect(rows).toHaveLength(3);
      expect(rows.every((r) => r.coverageSource === "simulated"), locus).toBe(true);
    }
  });
});

/**
 * Regenerates markerFrequenciesCE in markerFrequencies.ts from TEMP-strpop/*.json
 * Run: npx tsx TEMP-strpop/generate-ce-from-json.ts
 */
import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");
const TS_PATH = path.join(ROOT, "app/marker/[id]/markerFrequencies.ts");
const JSON_DIR = path.join(ROOT, "TEMP-strpop");

const POP_MAP: Record<string, string> = {
  AFRICA: "AFR",
  AMERICA: "NAM",
  EAST_ASIA: "EAS",
  CENTRAL_SOUTH_ASIA: "CSA",
  EUROPE: "EUR",
  MIDDLE_EAST: "MES",
  OCEANIA: "OCE",
};

const MARKER_NAME_MAP: Record<string, string> = {
  CSF1PO: "csf1po",
  D1S1656: "d1s1656",
  D2S1338: "d2s1338",
  D2S441: "d2s441",
  D3S1358: "d3s1358",
  D4S2408: "d4s2408",
  D5S818: "d5s818",
  D6S1043: "d6s1043",
  D7S820: "d7s820",
  D8S1179: "d8s1179",
  D9S1122: "d9s1122",
  D10S1248: "d10s1248",
  D12S391: "d12s391",
  D13S317: "d13s317",
  D16S539: "d16s539",
  D17S1301: "d17s1301",
  D18S51: "d18s51",
  D19S433: "d19s433",
  D20S482: "d20s482",
  D21S11: "d21s11",
  D22S1045: "d22s1045",
  FGA: "fga",
  "Penta D": "pentad",
  "Penta E": "pentae",
  TH01: "th01",
  TPOX: "tpox",
  vWA: "vwa",
};

/** Order of markers in markerFrequencies.ts (CE block) */
const MARKER_ORDER = [
  "csf1po",
  "d10s1248",
  "d12s391",
  "d13s317",
  "d16s539",
  "d17s1301",
  "d18s51",
  "d19s433",
  "d1s1656",
  "d20s482",
  "d21s11",
  "d22s1045",
  "d2s1338",
  "d2s441",
  "d3s1358",
  "d4s2408",
  "d5s818",
  "d6s1043",
  "d7s820",
  "d8s1179",
  "d9s1122",
  "fga",
  "pentad",
  "pentae",
  "th01",
  "tpox",
  "vwa",
] as const;

const CE_POP_ORDER = ["AFR", "NAM", "EAS", "CSA", "EUR", "MES", "OCE"] as const;

interface JsonAllele {
  allele: string;
  frequency: number;
}

interface JsonFile {
  population: string;
  frequencies: Record<string, JsonAllele[]>;
}

function formatFreq(f: number): string {
  const s = f.toFixed(6).replace(/\.?0+$/, "");
  return s === "" ? "0" : s;
}

function buildMerged(): Record<string, Partial<Record<(typeof CE_POP_ORDER)[number], JsonAllele[]>>> {
  const merged: Record<
    string,
    Partial<Record<(typeof CE_POP_ORDER)[number], JsonAllele[]>>
  > = {};

  const files = fs
    .readdirSync(JSON_DIR)
    .filter((f) => f.endsWith(".json") && f.startsWith("forenseq"));

  for (const file of files) {
    const raw = fs.readFileSync(path.join(JSON_DIR, file), "utf-8");
    const data: JsonFile = JSON.parse(raw);
    const pop = POP_MAP[data.population];
    if (!pop) {
      console.warn(`Skip unknown population: ${data.population} (${file})`);
      continue;
    }
    for (const [jsonMarker, alleles] of Object.entries(data.frequencies)) {
      const tsKey = MARKER_NAME_MAP[jsonMarker];
      if (!tsKey) continue;
      if (!merged[tsKey]) merged[tsKey] = {};
      merged[tsKey][pop as (typeof CE_POP_ORDER)[number]] = alleles;
    }
  }
  return merged;
}

function serialize(): string {
  const merged = buildMerged();
  const lines: string[] = [];

  for (const marker of MARKER_ORDER) {
    const pops = merged[marker];
    if (!pops) {
      throw new Error(`Missing JSON data for marker ${marker}`);
    }
    lines.push(`  ${marker}: {`);
    lines.push(`    kit: "Illumina ForenSeq",`);
    lines.push(`    technology: "CE",`);
    for (const pop of CE_POP_ORDER) {
      const alleles = pops[pop];
      if (!alleles || alleles.length === 0) {
        throw new Error(`Missing ${pop} for marker ${marker}`);
      }
      lines.push(`    ${pop}: [`);
      const inner = alleles
        .map(
          (a) =>
            `      { allele: "${a.allele}", frequency: ${formatFreq(a.frequency)}, count: 0 }`,
        )
        .join(",\n");
      lines.push(inner);
      lines.push(`    ],`);
    }
    lines.push(`  },`);
  }
  return lines.join("\n");
}

function main() {
  const content = fs.readFileSync(TS_PATH, "utf-8");
  const ngsIdx = content.indexOf("export const markerFrequenciesNGS");
  if (ngsIdx === -1) {
    throw new Error("Could not find markerFrequenciesNGS in TS file");
  }
  const ngsPart = content.slice(ngsIdx);

  const header = `// CE allele frequencies (Illumina ForenSeq) sourced from pop.STR JSON exports in TEMP-strpop/.
// Counts are not provided by pop.STR JSON; set to 0.

export type CEPop = "AFR" | "NAM" | "EAS" | "CSA" | "EUR" | "MES" | "OCE";
export type NGSPop = "AFR" | "NAM" | "EUR" | "EAS" | "SAS" | "RAO";
export type Pop = CEPop | NGSPop;
export type AlleleEntry = { allele: string; frequency: number; count: number };

// CE (Capillary Electrophoresis) frequency data
export const markerFrequenciesCE: Record<string, { kit: string; technology: string; } & Partial<Record<CEPop, AlleleEntry[]>>> = {

`;

  const body = serialize();
  const out =
    header +
    body +
    "\n} as const;\n\n" +
    ngsPart;

  fs.writeFileSync(TS_PATH, out, "utf-8");
  console.log("Wrote", TS_PATH);
}

main();

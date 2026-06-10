/**
 * Extracts statistics from TEMP-strpop/*.json and writes markerStatisticsCE.ts
 * Run: npx tsx TEMP-strpop/generate-statistics-from-json.ts
 */
import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");
const OUT_PATH = path.join(ROOT, "app/marker/[id]/markerStatisticsCE.ts");
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

const CE_POP_ORDER = ["AFR", "NAM", "EAS", "CSA", "EUR", "MES", "OCE"] as const;

interface StatEntry {
  marker: string;
  population: string;
  N: number;
  Hobs: number | null;
  Hexp: number | null;
  Fis: number | null;
  Fst: number | null;
}

interface JsonFile {
  population: string;
  statistics: StatEntry[];
}

type PopStats = {
  N: number;
  Hobs: number | null;
  Hexp: number | null;
  Fis: number | null;
  Fst: number | null;
};

const merged: Record<string, Partial<Record<string, PopStats>>> = {};

const files = fs
  .readdirSync(JSON_DIR)
  .filter((f) => f.endsWith(".json") && f.startsWith("forenseq"));

for (const file of files) {
  const raw = fs.readFileSync(path.join(JSON_DIR, file), "utf-8");
  const data: JsonFile = JSON.parse(raw);
  const pop = POP_MAP[data.population];
  if (!pop) continue;

  for (const stat of data.statistics) {
    const tsKey = MARKER_NAME_MAP[stat.marker];
    if (!tsKey) continue;
    if (!merged[tsKey]) merged[tsKey] = {};
    merged[tsKey][pop] = {
      N: stat.N,
      Hobs: stat.Hobs,
      Hexp: stat.Hexp,
      Fis: stat.Fis,
      Fst: stat.Fst,
    };
  }
}

function fmt(v: number | null): string {
  if (v === null) return "null";
  return String(v);
}

const markerKeys = Object.keys(merged).sort();
const lines: string[] = [];
lines.push(`import type { CEPop } from "./markerFrequencies";`);
lines.push(``);
lines.push(`export type MarkerStatEntry = {`);
lines.push(`  N: number;`);
lines.push(`  Hobs: number | null;`);
lines.push(`  Hexp: number | null;`);
lines.push(`  Fis: number | null;`);
lines.push(`  Fst: number | null;`);
lines.push(`};`);
lines.push(``);
lines.push(`export const markerStatisticsCE: Record<string, Partial<Record<CEPop, MarkerStatEntry>>> = {`);

for (const marker of markerKeys) {
  const pops = merged[marker]!;
  lines.push(`  ${marker}: {`);
  for (const pop of CE_POP_ORDER) {
    const s = pops[pop];
    if (!s) continue;
    lines.push(`    ${pop}: { N: ${s.N}, Hobs: ${fmt(s.Hobs)}, Hexp: ${fmt(s.Hexp)}, Fis: ${fmt(s.Fis)}, Fst: ${fmt(s.Fst)} },`);
  }
  lines.push(`  },`);
}

lines.push(`};`);
lines.push(``);

fs.writeFileSync(OUT_PATH, lines.join("\n"), "utf-8");
console.log(`Wrote ${OUT_PATH} (${markerKeys.length} markers)`);

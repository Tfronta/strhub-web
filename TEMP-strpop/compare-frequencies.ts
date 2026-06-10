import * as fs from "fs";
import * as path from "path";
import { markerFrequenciesCE } from "../app/marker/[id]/markerFrequencies";

const JSON_DIR = path.resolve(__dirname);

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
  "CSF1PO": "csf1po",
  "D1S1656": "d1s1656",
  "D2S1338": "d2s1338",
  "D2S441": "d2s441",
  "D3S1358": "d3s1358",
  "D4S2408": "d4s2408",
  "D5S818": "d5s818",
  "D6S1043": "d6s1043",
  "D7S820": "d7s820",
  "D8S1179": "d8s1179",
  "D9S1122": "d9s1122",
  "D10S1248": "d10s1248",
  "D12S391": "d12s391",
  "D13S317": "d13s317",
  "D16S539": "d16s539",
  "D17S1301": "d17s1301",
  "D18S51": "d18s51",
  "D19S433": "d19s433",
  "D20S482": "d20s482",
  "D21S11": "d21s11",
  "D22S1045": "d22s1045",
  "FGA": "fga",
  "Penta D": "pentad",
  "Penta E": "pentae",
  "TH01": "th01",
  "TPOX": "tpox",
  "vWA": "vwa",
};

interface JsonAllele {
  allele: string;
  frequency: number;
}

interface JsonFile {
  population: string;
  frequencies: Record<string, JsonAllele[]>;
}

type DiffEntry = {
  marker: string;
  pop: string;
  allele: string;
  jsonFreq: number;
  tsFreq: number;
  diff: number;
};

const jsonFiles = fs
  .readdirSync(JSON_DIR)
  .filter((f) => f.endsWith(".json"));

let totalComparisons = 0;
let totalMatches = 0;
let totalMismatches = 0;
const allDiffs: DiffEntry[] = [];
const missingMarkers: { pop: string; marker: string; source: string }[] = [];
const missingAlleles: {
  pop: string;
  marker: string;
  allele: string;
  source: string;
  frequency?: number;
}[] = [];

for (const file of jsonFiles) {
  const raw = fs.readFileSync(path.join(JSON_DIR, file), "utf-8");
  const data: JsonFile = JSON.parse(raw);
  const popCode = POP_MAP[data.population];

  if (!popCode) {
    console.log(`⚠ Unknown population "${data.population}" in ${file}`);
    continue;
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log(`📂 ${file} — population: ${data.population} → ${popCode}`);
  console.log("=".repeat(60));

  for (const [jsonMarker, jsonAlleles] of Object.entries(data.frequencies)) {
    const tsMarkerKey = MARKER_NAME_MAP[jsonMarker];
    if (!tsMarkerKey) {
      missingMarkers.push({
        pop: popCode,
        marker: jsonMarker,
        source: "marker name not in mapping",
      });
      continue;
    }

    const tsMarkerData = markerFrequenciesCE[tsMarkerKey];
    if (!tsMarkerData) {
      missingMarkers.push({
        pop: popCode,
        marker: tsMarkerKey,
        source: "marker not in markerFrequenciesCE",
      });
      continue;
    }

    const tsAlleles: { allele: string; frequency: number; count: number }[] =
      (tsMarkerData as any)[popCode] ?? [];

    if (tsAlleles.length === 0) {
      missingMarkers.push({
        pop: popCode,
        marker: tsMarkerKey,
        source: `no ${popCode} data in TS`,
      });
      continue;
    }

    const tsMap = new Map(tsAlleles.map((a) => [a.allele, a.frequency]));
    const jsonMap = new Map(jsonAlleles.map((a) => [a.allele, a.frequency]));

    const allAlleles = new Set([...tsMap.keys(), ...jsonMap.keys()]);

    for (const allele of allAlleles) {
      const jsonFreq = jsonMap.get(allele);
      const tsFreq = tsMap.get(allele);

      if (jsonFreq === undefined) {
        missingAlleles.push({
          pop: popCode,
          marker: tsMarkerKey,
          allele,
          source: "only in TS",
          frequency: tsFreq,
        });
        continue;
      }
      if (tsFreq === undefined) {
        missingAlleles.push({
          pop: popCode,
          marker: tsMarkerKey,
          allele,
          source: "only in JSON",
          frequency: jsonFreq,
        });
        continue;
      }

      totalComparisons++;
      const diff = Math.abs(jsonFreq - tsFreq);
      if (diff < 1e-9) {
        totalMatches++;
      } else {
        totalMismatches++;
        allDiffs.push({
          marker: tsMarkerKey,
          pop: popCode,
          allele,
          jsonFreq,
          tsFreq,
          diff,
        });
      }
    }
  }
}

console.log(`\n\n${"#".repeat(60)}`);
console.log("SUMMARY");
console.log("#".repeat(60));
console.log(`Total comparisons: ${totalComparisons}`);
console.log(`  ✅ Matches:    ${totalMatches}`);
console.log(`  ❌ Mismatches: ${totalMismatches}`);

if (allDiffs.length > 0) {
  console.log(`\n--- FREQUENCY DIFFERENCES (${allDiffs.length}) ---`);
  allDiffs.sort((a, b) => b.diff - a.diff);
  console.log(
    "Marker".padEnd(14) +
      "Pop".padEnd(6) +
      "Allele".padEnd(10) +
      "JSON freq".padEnd(14) +
      "TS freq".padEnd(14) +
      "Δ"
  );
  for (const d of allDiffs) {
    console.log(
      d.marker.padEnd(14) +
        d.pop.padEnd(6) +
        d.allele.padEnd(10) +
        d.jsonFreq.toFixed(6).padEnd(14) +
        d.tsFreq.toFixed(6).padEnd(14) +
        d.diff.toFixed(6)
    );
  }
}

if (missingMarkers.length > 0) {
  console.log(`\n--- MISSING MARKERS (${missingMarkers.length}) ---`);
  for (const m of missingMarkers) {
    console.log(`  ${m.pop} / ${m.marker}: ${m.source}`);
  }
}

if (missingAlleles.length > 0) {
  console.log(`\n--- ALLELES PRESENT IN ONLY ONE SOURCE (${missingAlleles.length}) ---`);
  for (const a of missingAlleles) {
    console.log(
      `  ${a.pop} / ${a.marker} / allele ${a.allele}: ${a.source} (freq=${a.frequency})`
    );
  }
}

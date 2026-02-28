const fs = require("fs");
const path = require("path");

const csvDir = "/Users/tfronta/Desktop";
const jsonDir = path.join(__dirname, "../sections/mix-profiles/data/ngs-haplotypes");
const samples = ["HG02944", "HG00145", "HG00372", "HG00097", "HG01063"];

function parseCsv(filePath) {
  const text = fs.readFileSync(filePath, "utf8");
  const lines = text.trim().split("\n");
  const rows = {};
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(",");
    const marker = parts[0].trim();
    rows[marker] = {
      coverage1: parseFloat(parts[1]),
      coverage2: parseFloat(parts[2]),
    };
  }
  return rows;
}

for (const sample of samples) {
  const csvPath = path.join(csvDir, sample + ".csv");
  const jsonPath = path.join(jsonDir, sample + ".json");
  if (!fs.existsSync(csvPath) || !fs.existsSync(jsonPath)) {
    console.warn("Skip", sample);
    continue;
  }
  const csv = parseCsv(csvPath);
  const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  for (const loc of data.loci) {
    const row = csv[loc.locus];
    if (row) {
      loc.coverage1 = row.coverage1;
      loc.coverage2 = row.coverage2;
    }
  }
  fs.writeFileSync(jsonPath, JSON.stringify(data));
  console.log("Merged", sample);
}
console.log("Done");

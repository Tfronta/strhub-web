/**
 * Markers available in the built-in IGV viewer, with the hg38 window shown on
 * launch (narrow enough for individual bases to be visible).
 */
export const IGV_MARKERS = [
  {
    id: "csf1po",
    name: "CSF1PO",
    chromosome: "5",
    position: "150076258-150076440",
  },
  {
    id: "d10s1248",
    name: "D10S1248",
    chromosome: "10",
    position: "129294179-129294359",
  },
  {
    id: "d12s391",
    name: "D12S391",
    chromosome: "12",
    position: "12296951-12297159",
  },
  {
    id: "d13s317",
    name: "D13S317",
    chromosome: "13",
    position: "82147961-82148164",
  },
  {
    id: "d16s539",
    name: "D16S539",
    chromosome: "16",
    position: "86352638-86352809",
  },
  {
    id: "d18s51",
    name: "D18S51",
    chromosome: "18",
    position: "63281603-63281816",
  },
  {
    id: "d19s433",
    name: "D19S433",
    chromosome: "19",
    position: "29926152-29926363",
  },
  {
    id: "d1s1656",
    name: "D1S1656",
    chromosome: "1",
    position: "230769541-230769747",
  },
  {
    id: "d21s11",
    name: "D21S11",
    chromosome: "21",
    position: "19181909-19182165",
  },
  {
    id: "d2s1338",
    name: "D2S1338",
    chromosome: "2",
    position: "218014795-218015014",
  },
  {
    id: "d2s441",
    name: "D2S441",
    chromosome: "2",
    position: "68011883-68012059",
  },
  {
    id: "d3s1358",
    name: "D3S1358",
    chromosome: "3",
    position: "45540673-45540867",
  },
  {
    id: "d5s818",
    name: "D5S818",
    chromosome: "5",
    position: "123775488-123775663",
  },
  {
    id: "d7s820",
    name: "D7S820",
    chromosome: "7",
    position: "84160140-84160341",
  },
  {
    id: "d8s1179",
    name: "D8S1179",
    chromosome: "8",
    position: "124894799-124894982",
  },
  {
    id: "fga",
    name: "FGA",
    chromosome: "4",
    position: "154587669-154587887",
  },
  { id: "th01", name: "TH01", chromosome: "11", position: "2171022-2171180" },
  { id: "tpox", name: "TPOX", chromosome: "2", position: "1489587-1489752" },
  { id: "vwa", name: "vWA", chromosome: "12", position: "5983894-5984109" },
] as const;

export type IgvMarker = (typeof IGV_MARKERS)[number];

export const IGV_MARKER_IDS: ReadonlySet<string> = new Set(
  IGV_MARKERS.map((m) => m.id)
);

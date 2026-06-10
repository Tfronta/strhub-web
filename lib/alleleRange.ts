export interface AlleleFrequencyPoint {
  allele: string;
  frequency: number;
  population?: string;
}

/**
 * Computes the allele range from frequency data points.
 * Returns the min-max range of alleles observed across all populations,
 * excluding alleles with frequency 0 or missing frequency.
 *
 * @param points - Array of allele frequency data points
 * @returns Formatted string like "9-17" or "12.2-17.3", or null if no valid alleles found
 */
export function computeAlleleRangeFromFrequencies(
  points: AlleleFrequencyPoint[]
): string | null {
  const numericAlleles: number[] = [];

  for (const p of points) {
    if (p == null) continue;
    if (p.frequency == null || p.frequency <= 0) continue;

    const value = parseFloat(String(p.allele).replace(",", "."));
    if (!Number.isFinite(value)) continue;

    numericAlleles.push(value);
  }

  if (numericAlleles.length === 0) {
    return null;
  }

  const min = Math.min(...numericAlleles);
  const max = Math.max(...numericAlleles);

  // Format as integers if they are whole numbers, otherwise keep decimals.
  const format = (x: number) =>
    Number.isInteger(x) ? String(x) : x.toString();

  return `${format(min)}-${format(max)}`;
}

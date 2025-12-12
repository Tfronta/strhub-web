/**
 * Centralized population color mapping using STRhub design system colors.
 * 
 * Uses CSS variables from the design system (chart-1 through chart-5, plus
 * primary/secondary/accent) to ensure consistency across all charts and UI elements.
 */

// Map population codes to CSS variable names from the design system
const POPULATION_COLOR_VARS: Record<string, string> = {
  AFR: "--chart-1",
  EUR: "--chart-2",
  EAS: "--chart-3",
  SAS: "--chart-4",
  NAM: "--chart-5",
  AMR: "--chart-5", // AMR maps to NAM (same internal code)
  MES: "--primary",
  OCE: "--secondary",
  RAO: "--accent", // RAO uses accent color
};

/**
 * Resolve a CSS variable to its computed color value (RGB/hex).
 * Similar to the approach used in NGSChart.
 * 
 * @param varName - CSS variable name (e.g., "--chart-1")
 * @param fallback - Fallback color if resolution fails
 * @returns Resolved color value (RGB string or hex)
 */
function resolveThemeColor(varName: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;

  // Try the variable name as-is, and also try with --color- prefix
  const varsToTry = [varName, `--color-${varName.slice(2)}`];
  
  for (const v of varsToTry) {
    const probe = document.createElement("span");
    probe.style.position = "absolute";
    probe.style.visibility = "hidden";
    probe.style.color = `var(${v})`;
    document.body.appendChild(probe);
    const resolved = getComputedStyle(probe).color; // e.g., "rgb(5, 150, 105)"
    probe.remove();
    
    if (resolved && resolved !== "rgba(0, 0, 0, 0)" && resolved !== "rgb(0, 0, 0)") {
      return resolved;
    }
  }
  
  return fallback;
}

/**
 * Get the resolved color value for a population.
 * Returns the computed RGB/hex color that can be used directly in Recharts.
 * 
 * @param pop - Population code (AFR, EUR, EAS, SAS, NAM, AMR, MES, OCE, RAO)
 * @returns Resolved color value (RGB string)
 */
export function getPopulationColor(pop: string): string {
  const varName = POPULATION_COLOR_VARS[pop] || "--muted-foreground";
  const fallback = "#888888"; // Gray fallback
  return resolveThemeColor(varName, fallback);
}

/**
 * Get all population color mappings as a record (for reference).
 * Note: These are CSS variable names, not resolved colors.
 */
export const POPULATION_COLOR_VARIABLES: Record<string, string> = {
  ...POPULATION_COLOR_VARS,
};


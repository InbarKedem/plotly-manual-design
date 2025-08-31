// =============================================================================
// MODERN COLORSCALES FOR DATA VISUALIZATION
// =============================================================================
// This file contains predefined color scales optimized for data visualization.
// These colorscales are perceptually uniform and accessible, suitable for
// scientific plotting and data analysis.

/**
 * Type definition for colorscale arrays
 * Each colorscale is an array of [position, color] tuples where position is 0-1
 */
export type ColorScale = Array<[number, string]>;

/**
 * Collection of modern, perceptually uniform colorscales
 * These colorscales are designed to be:
 * - Perceptually uniform (equal steps appear equally different)
 * - Colorblind-friendly where possible
 * - Suitable for both screen and print
 */
export const MODERN_COLORSCALES: Record<string, ColorScale> = {
  /**
   * Viridis colorscale - excellent default choice
   * Purple to blue to green to yellow
   * Perceptually uniform and colorblind-friendly
   */
  viridis: [
    [0, "#440154"], // Deep purple
    [0.25, "#31688e"], // Blue
    [0.5, "#35b779"], // Green
    [0.75, "#fde725"], // Yellow
    [1, "#fde725"], // Bright yellow
  ],

  /**
   * Plasma colorscale - high contrast option
   * Purple to magenta to orange to yellow
   * Good for highlighting features and patterns
   */
  plasma: [
    [0, "#0d0887"], // Deep purple
    [0.25, "#7e03a8"], // Magenta
    [0.5, "#cc4778"], // Pink
    [0.75, "#f89441"], // Orange
    [1, "#f0f921"], // Bright yellow
  ],

  /**
   * Turbo colorscale - rainbow alternative
   * Dark blue through cyan, green, yellow, orange to red
   * Modern replacement for problematic rainbow scales
   */
  turbo: [
    [0, "#23171b"], // Very dark purple
    [0.25, "#1e6091"], // Blue
    [0.5, "#00a76c"], // Teal/cyan
    [0.75, "#bfbc00"], // Yellow-green
    [1, "#b30000"], // Red
  ],

  /**
   * Cividis colorscale - colorblind-safe option
   * Blue to gray to yellow
   * Specifically designed to be accessible to colorblind users
   */
  cividis: [
    [0, "#00224e"], // Dark blue
    [0.25, "#123570"], // Blue
    [0.5, "#3b496c"], // Blue-gray
    [0.75, "#575d6d"], // Gray
    [1, "#ffea46"], // Yellow
  ],

  /**
   * Rainbow colorscale - use sparingly
   * Classic rainbow from red through ROYGBIV to violet
   * Can be problematic for colorblind users and perception
   * Included for compatibility but consider alternatives
   */
  rainbow: [
    [0, "#ff0000"], // Red
    [0.17, "#ff8c00"], // Orange
    [0.33, "#ffd700"], // Gold/Yellow
    [0.5, "#00ff00"], // Green
    [0.67, "#0000ff"], // Blue
    [0.83, "#4b0082"], // Indigo
    [1, "#9400d3"], // Violet
  ],

  /**
   * Red to Gray colorscale - for curve colorbar feature
   * Red through orange to gray
   * Provides good contrast for curve distinction
   */
  redgray: [
    [0, "#dc2626"], // Red
    [0.25, "#ea580c"], // Orange-red
    [0.5, "#f97316"], // Orange
    [0.75, "#94a3b8"], // Light gray
    [1, "#64748b"], // Gray
  ],
};

/**
 * Get a colorscale by name with fallback
 * @param name - Name of the colorscale
 * @param fallback - Fallback colorscale name (default: 'viridis')
 * @returns The requested colorscale or fallback
 */
export const getColorScale = (
  name: string,
  fallback: string = "viridis"
): ColorScale => {
  return (
    MODERN_COLORSCALES[name] ||
    MODERN_COLORSCALES[fallback] ||
    MODERN_COLORSCALES.viridis
  );
};

/**
 * Get all available colorscale names
 * @returns Array of colorscale names
 */
export const getColorScaleNames = (): string[] => {
  return Object.keys(MODERN_COLORSCALES);
};

/**
 * Check if a colorscale name is valid
 * @param name - Colorscale name to check
 * @returns True if the colorscale exists
 */
export const isValidColorScale = (name: string): boolean => {
  return name in MODERN_COLORSCALES;
};

/**
 * Create a custom colorscale from an array of colors
 * Automatically spaces colors evenly from 0 to 1
 * @param colors - Array of color strings
 * @returns ColorScale array
 */
export const createCustomColorScale = (colors: string[]): ColorScale => {
  if (colors.length === 0) {
    return MODERN_COLORSCALES.viridis;
  }

  if (colors.length === 1) {
    return [
      [0, colors[0]],
      [1, colors[0]],
    ];
  }

  const step = 1 / (colors.length - 1);
  return colors.map(
    (color, index) => [index * step, color] as [number, string]
  );
};

// =============================================================================
// CURVE COLORING UTILITIES
// =============================================================================

/**
 * Generate colors for curves using a gradient distribution
 * @param curveCount - Number of curves to generate colors for
 * @param colorScale - Color scale to use for generation
 * @param colorPalette - Optional custom color palette
 * @param colorBarValues - Values used for colorbar mapping (for consistent coloring)
 * @returns Array of colors for each curve
 */
export const generateCurveColors = (
  curveCount: number,
  colorScale?: string | ColorScale,
  colorPalette?: string[],
  colorBarValues?: number[]
): string[] => {
  if (colorPalette && colorPalette.length > 0) {
    // Use provided palette, cycling through if needed
    return Array.from(
      { length: curveCount },
      (_, index) => colorPalette[index % colorPalette.length]
    );
  }

  if (curveCount === 1) {
    return ["#3b82f6"]; // Default blue for single curve
  }

  // Use color scale for gradient distribution
  const scale =
    typeof colorScale === "string"
      ? MODERN_COLORSCALES[colorScale] || MODERN_COLORSCALES.viridis
      : colorScale || MODERN_COLORSCALES.viridis;

  // If colorBarValues are provided, use them to ensure consistent mapping with colorbar
  if (colorBarValues && colorBarValues.length >= curveCount) {
    const minValue = Math.min(...colorBarValues);
    const maxValue = Math.max(...colorBarValues);
    const valueRange = maxValue - minValue;

    return Array.from({ length: curveCount }, (_, index) => {
      const curveValue = colorBarValues[index] || index;
      const position =
        valueRange === 0 ? 0 : (curveValue - minValue) / valueRange;
      return interpolateColorScale(scale, position);
    });
  }

  return Array.from({ length: curveCount }, (_, index) => {
    const position = curveCount === 1 ? 0 : index / (curveCount - 1);
    return interpolateColorScale(scale, position);
  });
};

/**
 * Interpolate a color from a color scale at a given position
 * @param colorScale - Array of [position, color] tuples
 * @param position - Position to interpolate (0-1)
 * @returns Interpolated color
 */
export const interpolateColorScale = (
  colorScale: ColorScale,
  position: number
): string => {
  // Clamp position to 0-1
  position = Math.max(0, Math.min(1, position));

  // Find the two colors to interpolate between
  for (let i = 0; i < colorScale.length - 1; i++) {
    const [pos1, color1] = colorScale[i];
    const [pos2, color2] = colorScale[i + 1];

    if (position <= pos2) {
      if (position <= pos1) return color1;

      // Interpolate between the two colors
      const t = (position - pos1) / (pos2 - pos1);
      return interpolateColors(color1, color2, t);
    }
  }

  // Return last color if position is beyond range
  return colorScale[colorScale.length - 1][1];
};

/**
 * Interpolate between two hex colors
 * @param color1 - First color (hex)
 * @param color2 - Second color (hex)
 * @param t - Interpolation factor (0-1)
 * @returns Interpolated color
 */
const interpolateColors = (
  color1: string,
  color2: string,
  t: number
): string => {
  // Simple hex color interpolation
  const hex1 = color1.replace("#", "");
  const hex2 = color2.replace("#", "");

  const r1 = parseInt(hex1.substr(0, 2), 16);
  const g1 = parseInt(hex1.substr(2, 2), 16);
  const b1 = parseInt(hex1.substr(4, 2), 16);

  const r2 = parseInt(hex2.substr(0, 2), 16);
  const g2 = parseInt(hex2.substr(2, 2), 16);
  const b2 = parseInt(hex2.substr(4, 2), 16);

  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);

  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

/**
 * Generate line style patterns for curves
 * @param curveCount - Number of curves
 * @param stylePattern - Pattern of line styles to cycle through
 * @returns Array of line styles for each curve
 */
export const generateCurveLineStyles = (
  curveCount: number,
  stylePattern?: Array<"solid" | "dash" | "dot" | "dashdot" | "longdash">
): Array<"solid" | "dash" | "dot" | "dashdot" | "longdash"> => {
  const defaultPattern: Array<
    "solid" | "dash" | "dot" | "dashdot" | "longdash"
  > = ["solid", "dash", "dot", "dashdot", "longdash"];

  const pattern = stylePattern || defaultPattern;

  return Array.from(
    { length: curveCount },
    (_, index) => pattern[index % pattern.length]
  );
};

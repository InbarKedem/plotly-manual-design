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

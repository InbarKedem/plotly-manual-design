// =============================================================================
// CONSOLIDATED PLOTTER UTILITIES
// =============================================================================
// Merged utilities from legacy components for consistent patterns

import type { DataPoint, SeriesConfig } from "../types/PlotterTypes";

/**
 * Generate sample data for different curve types
 */
export const generateCurveData = (
  pointCount: number,
  curveType: "linear" | "exponential" | "logarithmic" | "sinusoidal" = "linear",
  baseParams?: {
    xRange?: [number, number];
    yRange?: [number, number];
    noise?: number;
  }
): DataPoint[] => {
  const {
    xRange = [0, 100],
    yRange = [0, 100],
    noise = 0.1,
  } = baseParams || {};

  return Array.from({ length: pointCount }, (_, i) => {
    const progress = i / (pointCount - 1);
    const x = xRange[0] + progress * (xRange[1] - xRange[0]);

    let y: number;
    switch (curveType) {
      case "exponential":
        y = yRange[0] + (yRange[1] - yRange[0]) * Math.pow(progress, 2);
        break;
      case "logarithmic":
        y =
          yRange[0] +
          ((yRange[1] - yRange[0]) * Math.log(progress + 0.1)) / Math.log(1.1);
        break;
      case "sinusoidal":
        y =
          yRange[0] +
          (yRange[1] - yRange[0]) *
            (0.5 + 0.5 * Math.sin(progress * Math.PI * 4));
        break;
      default: // linear
        y = yRange[0] + progress * (yRange[1] - yRange[0]);
    }

    // Add noise if specified
    if (noise > 0) {
      y += (Math.random() - 0.5) * noise * (yRange[1] - yRange[0]);
    }

    return {
      x,
      y,
      text: `X: ${x.toFixed(2)}, Y: ${y.toFixed(2)}`,
    };
  });
};

/**
 * Create a series configuration with sensible defaults
 */
export const createSeriesConfig = (
  data: DataPoint[],
  overrides: Partial<SeriesConfig> = {}
): SeriesConfig => {
  return {
    name: "Data Series",
    data,
    type: "scatter",
    mode: "lines+markers",
    marker: {
      size: 6,
      opacity: 0.7,
    },
    line: {
      width: 2,
    },
    showInLegend: true,
    visible: true,
    ...overrides,
  };
};

/**
 * Validate series data for common issues
 */
export const validateSeriesData = (
  series: SeriesConfig[]
): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (series.length === 0) {
    errors.push("No series data provided");
  }

  series.forEach((s, index) => {
    if (!s.data || s.data.length === 0) {
      errors.push(`Series ${index}: No data points provided`);
    }

    if (s.data && s.data.length > 10000) {
      warnings.push(
        `Series ${index}: Large dataset (${s.data.length} points) may impact performance`
      );
    }

    if (!s.name) {
      warnings.push(`Series ${index}: No name provided`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Calculate optimal chunk size for progressive loading
 */
export const calculateOptimalChunkSize = (totalPoints: number): number => {
  if (totalPoints < 1000) return totalPoints;
  if (totalPoints < 10000) return 500;
  if (totalPoints < 100000) return 1000;
  return 2000;
};

/**
 * Debounce function for performance optimization
 */
export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | number | undefined;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout as number);
    timeout = setTimeout(() => func(...args), wait);
  };
};

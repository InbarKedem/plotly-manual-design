// =============================================================================
// UTILITY FUNCTIONS FOR DATA PROCESSING AND STATISTICS
// =============================================================================
// This file contains utility functions for data analysis, statistics,
// and various calculations used throughout the UnifiedPlotter system.

import type { SeriesConfig, DataStats } from "../types/PlotterTypes";

/**
 * Calculate comprehensive statistics for all series data
 * Provides insights into data distribution, ranges, and memory usage
 * @param series - Array of series configurations with data
 * @returns DataStats object containing calculated statistics
 */
export const calculateDataStats = (series: SeriesConfig[]): DataStats => {
  // Flatten all data points from all series
  const allPoints = series.flatMap((s) => s.data);
  const totalPoints = allPoints.length;
  const seriesCount = series.length;

  // Extract coordinate values, filtering out null/undefined values
  const xValues = allPoints.map((p) => p.x).filter((x) => x != null);
  const yValues = allPoints.map((p) => p.y).filter((y) => y != null);
  const zValues = allPoints.map((p) => p.z).filter((z) => z != null);

  // Calculate ranges for each axis
  const xRange: [number, number] =
    xValues.length > 0 ? [Math.min(...xValues), Math.max(...xValues)] : [0, 0];

  const yRange: [number, number] =
    yValues.length > 0 ? [Math.min(...yValues), Math.max(...yValues)] : [0, 0];

  const zRange: [number, number] | null =
    zValues.length > 0 ? [Math.min(...zValues), Math.max(...zValues)] : null;

  // Estimate memory usage (rough calculation for visualization purposes)
  // Each data point roughly takes ~100 bytes considering object overhead
  const estimatedBytes = totalPoints * 100;
  const memoryUsage = estimatedBytes / (1024 * 1024); // Convert to MB

  return {
    totalPoints,
    processedPoints: totalPoints,
    seriesCount,
    memoryUsage,
    processingTime: 0, // Will be set by caller if needed
    xRange,
    yRange,
    zRange,
    memoryUsageMB: formatBytes(estimatedBytes),
  };
};

/**
 * Format byte count into human-readable string
 * @param bytes - Number of bytes
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted string (e.g., "1.5 MB")
 */
export const formatBytes = (bytes: number, decimals: number = 1): string => {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

/**
 * Format large numbers with appropriate suffixes
 * @param num - Number to format
 * @returns Formatted string (e.g., "1.5K", "2.3M")
 */
export const formatLargeNumber = (num: number): string => {
  if (num < 1000) return num.toString();
  if (num < 1000000) return (num / 1000).toFixed(1) + "K";
  if (num < 1000000000) return (num / 1000000).toFixed(1) + "M";
  return (num / 1000000000).toFixed(1) + "B";
};

/**
 * Calculate statistical measures for an array of numbers
 * @param values - Array of numeric values
 * @returns Object with statistical measures
 */
export const calculateStatistics = (values: number[]) => {
  if (values.length === 0) {
    return {
      min: 0,
      max: 0,
      mean: 0,
      median: 0,
      std: 0,
      count: 0,
    };
  }

  const sorted = [...values].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;

  // Calculate median
  const mid = Math.floor(sorted.length / 2);
  const median =
    sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];

  // Calculate standard deviation
  const squaredDiffs = values.map((val) => Math.pow(val - mean, 2));
  const avgSquaredDiff =
    squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  const std = Math.sqrt(avgSquaredDiff);

  return {
    min,
    max,
    mean,
    median,
    std,
    count: values.length,
  };
};

/**
 * Debounce function to limit how often a function can be called
 * Useful for performance optimization with frequent events
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
};

/**
 * Throttle function to ensure a function is called at most once per interval
 * @param func - Function to throttle
 * @param limit - Time limit in milliseconds
 * @returns Throttled function
 */
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Deep clone an object (simple implementation for data structures)
 * @param obj - Object to clone
 * @returns Deep cloned object
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array)
    return obj.map((item) => deepClone(item)) as unknown as T;
  if (typeof obj === "object") {
    const cloned = {} as T;
    Object.keys(obj).forEach((key) => {
      (cloned as Record<string, unknown>)[key] = deepClone(
        (obj as Record<string, unknown>)[key]
      );
    });
    return cloned;
  }
  return obj;
};

/**
 * Generate an array of evenly spaced numbers
 * @param start - Start value
 * @param stop - Stop value
 * @param num - Number of points to generate
 * @returns Array of evenly spaced numbers
 */
export const linspace = (
  start: number,
  stop: number,
  num: number
): number[] => {
  if (num <= 0) return [];
  if (num === 1) return [start];

  const step = (stop - start) / (num - 1);
  return Array.from({ length: num }, (_, i) => start + step * i);
};

/**
 * Check if a value is a valid number (not NaN, Infinity, etc.)
 * @param value - Value to check
 * @returns True if value is a valid finite number
 */
export const isValidNumber = (value: unknown): value is number => {
  return typeof value === "number" && isFinite(value) && !isNaN(value);
};

/**
 * Clamp a value between min and max bounds
 * @param value - Value to clamp
 * @param min - Minimum bound
 * @param max - Maximum bound
 * @returns Clamped value
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Generate a unique identifier string
 * @param prefix - Optional prefix for the ID
 * @returns Unique identifier string
 */
export const generateId = (prefix: string = "id"): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Convert hex color to RGB values
 * @param hex - Hex color string (e.g., "#ff0000")
 * @returns RGB object or null if invalid
 */
export const hexToRgb = (
  hex: string
): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

/**
 * Convert RGB values to hex color string
 * @param r - Red value (0-255)
 * @param g - Green value (0-255)
 * @param b - Blue value (0-255)
 * @returns Hex color string
 */
export const rgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (c: number) => {
    const hex = Math.round(clamp(c, 0, 255)).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

// =============================================================================
// 📊 UTILITY FUNCTIONS FOR DATA PROCESSING AND STATISTICS - OPTIMIZED
// =============================================================================
// High-performance utility functions for data analysis, statistics, and
// calculations used throughout the UnifiedPlotter system.
// Following GitHub Copilot standards for clean, reusable, and performant code.
//
// 🎯 Design Goals:
// - DRY-compliant: Reusable statistical functions
// - Performance-oriented: O(n) time complexity where possible
// - Bug-resistant: Comprehensive input validation and error handling
// - Test-friendly: Pure functions with predictable outputs

import type { SeriesConfig, DataStats } from "../types/PlotterTypes";

// =============================================================================
// 📈 DATA STATISTICS FUNCTIONS
// =============================================================================

/**
 * 📊 Calculate comprehensive statistics for all series data with performance optimization
 *
 * Provides deep insights into data distribution, ranges, memory usage, and performance metrics.
 * Optimized for large datasets with efficient single-pass algorithms.
 *
 * 🚀 Performance Features:
 * - Single-pass computation for O(n) time complexity
 * - Memory-efficient processing without intermediate arrays
 * - Null/undefined value filtering with type safety
 * - Accurate memory usage estimation
 *
 * 🛡️ Error Handling:
 * - Graceful handling of empty datasets
 * - Type-safe value extraction and filtering
 * - Robust range calculations with edge case protection
 *
 * @param series - Array of series configurations with data points
 * @returns DataStats object containing comprehensive calculated statistics
 *
 * 🧪 Test Coverage: Handles edge cases including empty data, single points, and null values
 */
export const calculateDataStats = (series: SeriesConfig[]): DataStats => {
  // 🛡️ Input validation for bug resistance
  if (!series || series.length === 0) {
    return {
      totalPoints: 0,
      processedPoints: 0,
      seriesCount: 0,
      memoryUsage: 0,
      processingTime: 0,
      xRange: [0, 0],
      yRange: [0, 0],
      zRange: null,
      memoryUsageMB: "0 B",
    };
  }

  // 🚀 Performance optimization: Single-pass computation for O(n) complexity
  let totalPoints = 0;
  let xMin = Number.POSITIVE_INFINITY;
  let xMax = Number.NEGATIVE_INFINITY;
  let yMin = Number.POSITIVE_INFINITY;
  let yMax = Number.NEGATIVE_INFINITY;
  let zMin = Number.POSITIVE_INFINITY;
  let zMax = Number.NEGATIVE_INFINITY;
  let hasZValues = false;

  // Single pass through all data points for optimal performance
  for (const seriesConfig of series) {
    if (!seriesConfig.data) continue;

    for (const point of seriesConfig.data) {
      totalPoints++;

      // Process X values
      if (point.x != null && typeof point.x === "number") {
        xMin = Math.min(xMin, point.x);
        xMax = Math.max(xMax, point.x);
      }

      // Process Y values
      if (point.y != null && typeof point.y === "number") {
        yMin = Math.min(yMin, point.y);
        yMax = Math.max(yMax, point.y);
      }

      // Process Z values (optional)
      if (point.z != null && typeof point.z === "number") {
        zMin = Math.min(zMin, point.z);
        zMax = Math.max(zMax, point.z);
        hasZValues = true;
      }
    }
  }

  // 🔧 Handle edge cases for robust behavior
  const xRange: [number, number] =
    xMin === Number.POSITIVE_INFINITY ? [0, 0] : [xMin, xMax];
  const yRange: [number, number] =
    yMin === Number.POSITIVE_INFINITY ? [0, 0] : [yMin, yMax];
  const zRange: [number, number] | null =
    hasZValues && zMin !== Number.POSITIVE_INFINITY ? [zMin, zMax] : null;

  // 💾 Memory usage estimation (optimized calculation)
  const estimatedBytes = totalPoints * 100; // ~100 bytes per data point with object overhead
  const memoryUsage = estimatedBytes / (1024 * 1024); // Convert to MB

  return {
    totalPoints,
    processedPoints: totalPoints,
    seriesCount: series.length,
    memoryUsage,
    processingTime: 0, // Will be set by caller if needed
    xRange,
    yRange,
    zRange,
    memoryUsageMB: formatBytes(estimatedBytes),
  };
};

// =============================================================================
// 🧮 FORMATTING AND MATHEMATICAL UTILITIES
// =============================================================================

/**
 * 💾 Format byte count into human-readable string with performance optimization
 *
 * Converts raw byte counts to user-friendly format (B, KB, MB, GB, TB).
 * Optimized for consistent formatting across the application.
 *
 * @param bytes - Number of bytes to format
 * @param decimals - Number of decimal places to display (default: 1)
 * @returns Human-readable formatted string (e.g., "1.5 MB", "256 KB")
 *
 * 🧪 Test Cases: Handles 0 bytes, small values, and very large numbers
 */
export const formatBytes = (bytes: number, decimals: number = 1): string => {
  // 🛡️ Edge case handling
  if (bytes === 0) return "0 B";
  if (!Number.isFinite(bytes) || bytes < 0) return "Invalid";

  const k = 1024;
  const dm = Math.max(0, decimals); // Ensure non-negative decimals
  const sizes = ["B", "KB", "MB", "GB", "TB"] as const;

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const sizeIndex = Math.min(i, sizes.length - 1); // Prevent array overflow

  return (
    parseFloat((bytes / Math.pow(k, sizeIndex)).toFixed(dm)) +
    " " +
    sizes[sizeIndex]
  );
};

/**
 * 🔢 Format large numbers with appropriate suffixes for compact display
 *
 * Converts large numeric values to readable format with K, M, B suffixes.
 * Essential for displaying point counts and statistics in limited UI space.
 *
 * @param num - Number to format
 * @returns Formatted string with appropriate suffix (e.g., "1.5K", "2.3M")
 *
 * 🧪 Test Cases: Small numbers, thousands, millions, billions, edge cases
 */
export const formatLargeNumber = (num: number): string => {
  // 🛡️ Input validation
  if (!Number.isFinite(num)) return "Invalid";

  const absNum = Math.abs(num);
  const sign = num < 0 ? "-" : "";

  if (absNum < 1000) return num.toString();
  if (absNum < 1000000) return sign + (absNum / 1000).toFixed(1) + "K";
  if (absNum < 1000000000) return sign + (absNum / 1000000).toFixed(1) + "M";
  return sign + (absNum / 1000000000).toFixed(1) + "B";
};

/**
 * 📈 Calculate comprehensive statistical measures for numeric arrays
 *
 * Computes essential statistical metrics with robust error handling.
 * Optimized for performance with single-pass algorithms where possible.
 *
 * @param values - Array of numeric values to analyze
 * @returns Statistical measures object with all key metrics
 *
 * 🚀 Performance: O(n log n) for median, O(n) for other metrics
 * 🛡️ Error Handling: Graceful handling of empty arrays and invalid values
 * 🧪 Test Coverage: Comprehensive edge case handling
 */
export const calculateStatistics = (values: number[]) => {
  // 🛡️ Edge case handling for empty arrays
  if (!values || values.length === 0) {
    return {
      min: 0,
      max: 0,
      mean: 0,
      median: 0,
      std: 0,
      count: 0,
    };
  }

  // 🚀 Performance optimization: Filter and sort in single operation
  const validValues = values.filter((val) => Number.isFinite(val));

  if (validValues.length === 0) {
    return {
      min: 0,
      max: 0,
      mean: 0,
      median: 0,
      std: 0,
      count: 0,
    };
  }

  // Single-pass computation for min, max, and sum for O(n) performance
  let min = validValues[0];
  let max = validValues[0];
  let sum = 0;

  for (const val of validValues) {
    min = Math.min(min, val);
    max = Math.max(max, val);
    sum += val;
  }

  const mean = sum / validValues.length;

  // Calculate median (requires sorting - O(n log n))
  const sorted = [...validValues].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median =
    sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];

  // Calculate standard deviation in single pass
  let sumSquaredDiffs = 0;
  for (const val of validValues) {
    sumSquaredDiffs += Math.pow(val - mean, 2);
  }
  const std = Math.sqrt(sumSquaredDiffs / validValues.length);

  return {
    min,
    max,
    mean,
    median,
    std,
    count: validValues.length,
  };
};

// =============================================================================
// ⚡ PERFORMANCE OPTIMIZATION UTILITIES
// =============================================================================

/**
 * 🔄 Debounce function to limit how often a function can be called
 *
 * Essential for performance optimization with frequent events like resize,
 * scroll, or user input. Prevents excessive function calls that could
 * impact application responsiveness.
 *
 * 🎯 Use Cases:
 * - Search input handlers
 * - Window resize events
 * - API call throttling
 * - Real-time data processing
 *
 * @param func - Function to debounce with full type safety
 * @param wait - Wait time in milliseconds before execution
 * @returns Debounced function with same signature as original
 *
 * 🚀 Performance: Prevents rapid successive calls, improves UX
 * 🧪 Test-friendly: Predictable timing behavior
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  // 🛡️ Input validation
  if (wait < 0) wait = 0;

  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
};

/**
 * 🚦 Throttle function to ensure a function is called at most once per interval
 *
 * Guarantees consistent execution rate for high-frequency events.
 * Different from debounce - ensures regular execution rather than delaying.
 *
 * 🎯 Use Cases:
 * - Animation frame callbacks
 * - Progress updates
 * - Real-time monitoring
 * - Rate-limited API calls
 *
 * @param func - Function to throttle with full type safety
 * @param limit - Time limit in milliseconds between calls
 * @returns Throttled function
 */
export const throttle = <T extends (...args: any[]) => any>(
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
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (obj instanceof Array) return obj.map((item) => deepClone(item)) as T;
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
export const isValidNumber = (value: any): value is number => {
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

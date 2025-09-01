// =============================================================================
// 🛠️ TRACE GENERATION UTILITIES - MODULAR VERSION
// =============================================================================

import type { SeriesConfig, DataStats } from "../../types/plotting/core-types";

// Re-export original utilities for backward compatibility
export { createAllTraces } from "../traceGeneration";

/**
 * 📊 Calculate data statistics for performance monitoring
 */
export const calculateDataStats = (series: SeriesConfig[]): DataStats => {
  const allDataPoints = series.flatMap((s) => s.data || []);
  const xValues = allDataPoints.map((d) => d.x);
  const yValues = allDataPoints.map((d) => d.y);
  const zValues = allDataPoints
    .map((d) => d.z)
    .filter((z) => z !== undefined) as number[];

  return {
    totalPoints: allDataPoints.length,
    processedPoints: allDataPoints.length,
    seriesCount: series.length,
    xRange:
      allDataPoints.length > 0
        ? ([Math.min(...xValues), Math.max(...xValues)] as [number, number])
        : ([0, 1] as [number, number]),
    yRange:
      allDataPoints.length > 0
        ? ([Math.min(...yValues), Math.max(...yValues)] as [number, number])
        : ([0, 1] as [number, number]),
    zRange:
      zValues.length > 0
        ? ([Math.min(...zValues), Math.max(...zValues)] as [number, number])
        : null,
    memoryUsageMB: `${(allDataPoints.length * 0.1).toFixed(2)}`,
  };
};

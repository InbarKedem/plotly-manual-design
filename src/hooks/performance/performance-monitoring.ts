// =============================================================================
// 📊 PERFORMANCE MONITORING - METRICS & MEASUREMENT UTILITIES
// =============================================================================

import { useState, useCallback, useRef, useEffect } from "react";
import type {
  PerformanceMetrics,
  SeriesConfig,
} from "../../types/plotting/core-types";

/**
 * 📈 Performance monitoring hook with real-time metrics tracking
 *
 * Provides measurement utilities for tracking rendering performance,
 * memory usage, and interaction response times in data visualizations.
 */
export const usePerformanceMonitoring = (
  series: SeriesConfig[],
  enabled: boolean = true
) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const measurementsRef = useRef<Map<string, number>>(new Map());

  const startMeasurement = useCallback(
    (key: string = "default") => {
      if (!enabled) return;
      measurementsRef.current.set(key, performance.now());
    },
    [enabled]
  );

  const endMeasurement = useCallback(
    (key: string = "default") => {
      if (!enabled) return;

      const startTime = measurementsRef.current.get(key);
      if (startTime) {
        const duration = performance.now() - startTime;
        setMetrics((prev) => ({
          ...prev,
          [key]: duration,
        }));
        measurementsRef.current.delete(key);
      }
    },
    [enabled]
  );

  // Calculate data statistics for performance tracking
  useEffect(() => {
    if (!enabled) return;

    const totalPoints = series.reduce(
      (sum, s) => sum + (s.data?.length || 0),
      0
    );
    const memoryEstimate = totalPoints * 0.1; // Rough estimate in MB

    setMetrics((prev) => ({
      ...prev,
      totalPoints,
      memoryUsage: memoryEstimate,
    }));
  }, [series, enabled]);

  return {
    metrics,
    startMeasurement,
    endMeasurement,
  };
};

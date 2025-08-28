// =============================================================================
// PERFORMANCE UTILITIES
// =============================================================================
// Performance optimization helpers for large datasets and complex interactions

import { useCallback, useMemo } from "react";

/**
 * Performance thresholds for automatic optimizations
 */
export const PERFORMANCE_THRESHOLDS = {
  SMALL_DATASET: 100,
  MEDIUM_DATASET: 1000,
  LARGE_DATASET: 10000,
  VERY_LARGE_DATASET: 50000,

  HOVER_DEBOUNCE_MS: 50,
  RESIZE_DEBOUNCE_MS: 100,
  SEARCH_DEBOUNCE_MS: 300,
} as const;

/**
 * Performance metrics tracking
 */
export interface PerformanceMetrics {
  renderTime: number;
  dataProcessingTime: number;
  memoryUsage: number;
  totalPoints: number;
  chunksLoaded: number;
}

/**
 * Hook for debounced callbacks
 */
export const useDebouncedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList
) => {
  return useCallback(debounce(callback, delay), [delay, ...deps]);
};

/**
 * Hook for memoized data processing
 */
export const useMemoizedDataProcessing = <TInput, TOutput>(
  data: TInput,
  processor: (data: TInput) => TOutput,
  deps: React.DependencyList = []
) => {
  return useMemo(() => {
    const result = processor(data);
    return result;
  }, [data, ...deps]);
};

/**
 * Simple debounce implementation
 */
function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number | undefined;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait) as any;
  };
}

/**
 * Virtualization helper for large datasets
 */
export const calculateVisibleRange = (
  totalItems: number,
  containerHeight: number,
  itemHeight: number,
  scrollTop: number,
  overscan: number = 5
) => {
  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    totalItems - 1,
    visibleStart + Math.ceil(containerHeight / itemHeight)
  );

  const start = Math.max(0, visibleStart - overscan);
  const end = Math.min(totalItems - 1, visibleEnd + overscan);

  return { start, end, visibleStart, visibleEnd };
};

/**
 * Memory usage estimation for datasets
 */
export const estimateMemoryUsage = (
  dataPoints: number,
  fieldsPerPoint: number = 3
) => {
  // Rough estimation: each number takes ~8 bytes, plus object overhead
  const bytesPerPoint = fieldsPerPoint * 8 + 32; // 32 bytes object overhead
  const totalBytes = dataPoints * bytesPerPoint;

  return {
    bytes: totalBytes,
    kb: totalBytes / 1024,
    mb: totalBytes / (1024 * 1024),
    readable: formatBytes(totalBytes),
  };
};

/**
 * Format bytes into human readable string
 */
const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

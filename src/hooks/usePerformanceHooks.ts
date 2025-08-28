// =============================================================================
// PERFORMANCE OPTIMIZATION HOOKS
// =============================================================================
// Custom hooks for optimizing plotter performance with large datasets

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  SeriesConfig,
  DataPoint,
  PerformanceConfig,
  PlotlyHoverEvent,
  PlotlyZoomEvent,
} from "../types/PlotterTypes";
import {
  PERFORMANCE_THRESHOLDS,
  estimateMemoryUsage,
} from "../utils/performance";

/**
 * Hook for virtualized data rendering
 */
export const useVirtualization = (
  data: DataPoint[],
  containerRef: React.RefObject<HTMLDivElement>,
  enabled: boolean = true
) => {
  const [visibleRange] = useState({ start: 0, end: 1000 });
  const [scrollTop, setScrollTop] = useState(0);

  const handleScroll = useCallback((event: Event) => {
    const target = event.target as HTMLDivElement;
    setScrollTop(target.scrollTop);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) return;

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll, enabled]);

  const visibleData = useMemo(() => {
    if (!enabled || data.length <= PERFORMANCE_THRESHOLDS.MEDIUM_DATASET) {
      return data;
    }

    return data.slice(visibleRange.start, visibleRange.end);
  }, [data, visibleRange, enabled]);

  return {
    visibleData,
    visibleRange,
    scrollTop,
    isVirtualized:
      enabled && data.length > PERFORMANCE_THRESHOLDS.MEDIUM_DATASET,
  };
};

/**
 * Hook for debounced interactions
 */
export const useDebouncedInteractions = (
  onHover?: (data: PlotlyHoverEvent) => void,
  onZoom?: (data: PlotlyZoomEvent) => void,
  debounceMs: number = PERFORMANCE_THRESHOLDS.HOVER_DEBOUNCE_MS
) => {
  const hoverTimeoutRef = useRef<number>();
  const zoomTimeoutRef = useRef<number>();

  const debouncedHover = useCallback(
    (data: PlotlyHoverEvent) => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }

      hoverTimeoutRef.current = window.setTimeout(() => {
        onHover?.(data);
      }, debounceMs);
    },
    [onHover, debounceMs]
  );

  const debouncedZoom = useCallback(
    (data: PlotlyZoomEvent) => {
      if (zoomTimeoutRef.current) {
        clearTimeout(zoomTimeoutRef.current);
      }

      zoomTimeoutRef.current = window.setTimeout(() => {
        onZoom?.(data);
      }, PERFORMANCE_THRESHOLDS.RESIZE_DEBOUNCE_MS);
    },
    [onZoom]
  );

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (zoomTimeoutRef.current) {
        clearTimeout(zoomTimeoutRef.current);
      }
    };
  }, []);

  return { debouncedHover, debouncedZoom };
};

/**
 * Hook for performance monitoring
 */
export const usePerformanceMonitoring = (
  series: SeriesConfig[],
  enabled: boolean = true
) => {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    dataProcessingTime: 0,
    memoryUsage: 0,
    totalPoints: 0,
    chunksLoaded: 0,
  });

  const startTime = useRef<number>();

  const startMeasurement = useCallback(() => {
    if (!enabled) return;
    startTime.current = performance.now();
  }, [enabled]);

  const endMeasurement = useCallback(
    (operation: string) => {
      if (!enabled || !startTime.current) return;

      const duration = performance.now() - startTime.current;

      setMetrics((prev) => ({
        ...prev,
        [operation]: duration,
      }));
    },
    [enabled]
  );

  const calculateMetrics = useMemo(() => {
    const totalPoints = series.reduce(
      (sum, s) => sum + (s.data?.length || 0),
      0
    );
    const fieldsPerPoint = 3; // Assuming x, y, z
    const memoryEstimate = estimateMemoryUsage(totalPoints, fieldsPerPoint);

    return {
      totalPoints,
      memoryUsage: memoryEstimate.mb,
      seriesCount: series.length,
      averagePointsPerSeries: Math.round(totalPoints / series.length) || 0,
    };
  }, [series]);

  return {
    metrics: { ...metrics, ...calculateMetrics },
    startMeasurement,
    endMeasurement,
  };
};

/**
 * Hook for optimized data processing
 */
export const useOptimizedDataProcessing = <TInput, TOutput>(
  data: TInput,
  processor: (data: TInput) => TOutput,
  dependencies: React.DependencyList = [],
  performanceConfig?: PerformanceConfig
) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<TOutput | null>(null);
  const workerRef = useRef<Worker>();

  const processData = useCallback(async () => {
    setIsProcessing(true);

    try {
      // Use web worker for large datasets if enabled
      if (
        performanceConfig?.useWebWorkers &&
        Array.isArray(data) &&
        data.length > PERFORMANCE_THRESHOLDS.LARGE_DATASET
      ) {
        // Web worker implementation would go here
        // For now, fall back to main thread
        const processed = processor(data);
        setResult(processed);
      } else {
        // Process on main thread
        const processed = processor(data);
        setResult(processed);
      }
    } catch (error) {
      console.error("Data processing error:", error);
      setResult(null);
    } finally {
      setIsProcessing(false);
    }
  }, [data, processor, performanceConfig, ...dependencies]);

  useEffect(() => {
    processData();
  }, [processData]);

  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  return { result, isProcessing };
};

/**
 * Hook for memory usage monitoring
 */
export const useMemoryMonitoring = (enabled: boolean = true) => {
  const [memoryInfo, setMemoryInfo] = useState({
    used: 0,
    total: 0,
    percentage: 0,
  });

  useEffect(() => {
    if (!enabled) return;

    const updateMemoryInfo = () => {
      // @ts-ignore - performance.memory is not in all browsers
      if (performance.memory) {
        // @ts-ignore
        const { usedJSHeapSize, totalJSHeapSize } = performance.memory;
        setMemoryInfo({
          used: usedJSHeapSize / 1024 / 1024, // MB
          total: totalJSHeapSize / 1024 / 1024, // MB
          percentage: (usedJSHeapSize / totalJSHeapSize) * 100,
        });
      }
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [enabled]);

  return memoryInfo;
};

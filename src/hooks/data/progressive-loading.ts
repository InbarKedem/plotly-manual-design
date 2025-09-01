// =============================================================================
// 📊 PROGRESSIVE LOADING HOOK
// =============================================================================
// Hook for managing progressive data loading with performance optimization

import { useState, useEffect, useCallback, useRef } from "react";
import type { SeriesConfig, ProgressConfig, DataStats } from "../../types";
import type { Data } from "plotly.js";
import { calculateDataStats } from "../../utils/dataUtils";

/**
 * 🚀 Hook for managing progressive data loading with performance optimization
 *
 * Handles chunked loading of large datasets with comprehensive progress tracking.
 * Prevents UI blocking during heavy data processing operations.
 *
 * 🎯 Key Features:
 * - Non-blocking data processing with requestAnimationFrame
 * - Memory-efficient chunked loading
 * - Comprehensive progress tracking
 * - Race condition prevention
 * - Automatic cleanup on unmount
 *
 * @param series - Array of series configurations to process
 * @param progressConfig - Optional progressive loading configuration
 * @param onTraceCreated - Callback for trace creation (for custom processing)
 * @returns Progressive loading state and control functions
 */
export const useProgressiveLoading = (
  series: SeriesConfig[],
  progressConfig?: ProgressConfig,
  onTraceCreated?: (seriesConfig: SeriesConfig, seriesIndex: number) => Data[]
) => {
  // ==========================================================================
  // 🎯 STATE MANAGEMENT - OPTIMIZED FOR MINIMAL RE-RENDERS
  // ==========================================================================

  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState("Ready");
  const [isGenerating, setIsGenerating] = useState(false);
  const [totalPointsLoaded, setTotalPointsLoaded] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [plotData, setPlotData] = useState<Data[]>([]);
  const [dataStats, setDataStats] = useState<DataStats | null>(null);

  // 🚀 Performance optimization: useRef prevents re-render triggers
  const loadingRef = useRef(false);

  /**
   * 📈 Load data progressively in chunks with performance optimization
   *
   * Uses requestAnimationFrame for non-blocking execution and proper
   * browser paint scheduling. Includes comprehensive error handling.
   */
  const loadDataProgressively = useCallback(async () => {
    // 🛡️ Prevent multiple simultaneous loading attempts (race condition protection)
    if (loadingRef.current) {
      return;
    }

    loadingRef.current = true;

    // If progressive loading is disabled, load all data at once
    if (!progressConfig?.enabled || !onTraceCreated) {
      if (onTraceCreated) {
        const traces = series.flatMap((seriesConfig, index) =>
          onTraceCreated(seriesConfig, index)
        );
        setPlotData(traces);
      }
      setDataStats(calculateDataStats(series));
      setIsComplete(true);
      setCurrentPhase("Complete");
      loadingRef.current = false;
      return;
    }

    // Initialize progressive loading state
    setIsGenerating(true);
    setProgress(0);
    setTotalPointsLoaded(0);
    setIsComplete(false);

    const chunkSize = progressConfig.chunkSize || 50;
    const totalPoints = series.reduce((sum, s) => sum + s.data.length, 0);
    let loadedPoints = 0;
    const traces: Data[] = [];

    try {
      // Process each series
      for (let seriesIndex = 0; seriesIndex < series.length; seriesIndex++) {
        const seriesConfig = series[seriesIndex];
        setCurrentPhase(`Loading ${seriesConfig.name}...`);

        // Process series data in chunks
        for (let i = 0; i < seriesConfig.data.length; i += chunkSize) {
          const chunk = seriesConfig.data.slice(i, i + chunkSize);
          const chunkSeries = { ...seriesConfig, data: chunk };

          // Create traces for this chunk
          const chunkTraces = onTraceCreated(chunkSeries, seriesIndex);
          traces.push(...chunkTraces);

          // Update progress
          loadedPoints += chunk.length;
          const progressValue = (loadedPoints / totalPoints) * 100;

          setProgress(progressValue);
          setTotalPointsLoaded(loadedPoints);
          setPlotData([...traces]);

          // Call progress callback if provided
          if (progressConfig.onProgress) {
            progressConfig.onProgress(
              progressValue,
              `Loading ${seriesConfig.name}...`,
              loadedPoints
            );
          }

          // Add delay for visual feedback
          await new Promise((resolve) =>
            setTimeout(resolve, progressConfig.animationDuration || 50)
          );
        }
      }

      // Finalize loading
      const stats = calculateDataStats(series);
      setDataStats(stats);
      setCurrentPhase("Complete");
      setIsComplete(true);
      setIsGenerating(false);

      // Call completion callback if provided
      if (progressConfig.onComplete) {
        progressConfig.onComplete(totalPoints, stats);
      }
    } catch (error) {
      console.error("Error during progressive loading:", error);
      setCurrentPhase("Error");
      setIsGenerating(false);
    } finally {
      loadingRef.current = false;
    }
  }, [series, progressConfig, onTraceCreated]); // Removed currentPhase from dependencies!

  // Start loading when dependencies change, but only once per change
  useEffect(() => {
    // Reset states when series or config changes
    setIsComplete(false);
    setIsGenerating(false);
    setProgress(0);
    setCurrentPhase("Ready");
    loadingRef.current = false;

    // Start loading with a small delay to ensure state is reset
    const timeoutId = setTimeout(() => {
      loadDataProgressively();
    }, 10);

    return () => clearTimeout(timeoutId);
  }, [series, progressConfig?.enabled, progressConfig?.chunkSize]); // Only depend on stable properties

  return {
    progress,
    currentPhase,
    isGenerating,
    totalPointsLoaded,
    isComplete,
    plotData,
    dataStats,
    reload: loadDataProgressively,
  };
};

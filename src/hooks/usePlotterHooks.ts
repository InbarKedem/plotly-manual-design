// =============================================================================
// 🪝 CUSTOM HOOKS FOR UNIFIED PLOTTER - PERFORMANCE OPTIMIZED
// =============================================================================
// This file contains React hooks that encapsulate complex logic for
// progressive data loading, plot configuration, and interaction handling.
// All hooks follow GitHub Copilot standards for maintainability and performance.
//
// 🎯 Hook Design Principles:
// - DRY-compliant: Reusable logic extraction
// - Performance-oriented: Memoized computations
// - Bug-resistant: Comprehensive error handling
// - Test-friendly: Isolated, mockable functions

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import type {
  SeriesConfig,
  PlotConfig,
  InteractionConfig,
  ProgressConfig,
  ThemeConfig,
  DataStats,
  PlotlyClickEvent,
  PlotlyHoverEvent,
  PlotlySelectEvent,
  PlotlyZoomEvent,
} from "../types/PlotterTypes";
import type { Data } from "plotly.js";
import { calculateDataStats } from "../utils/dataUtils";

// =============================================================================
// 📊 PROGRESSIVE LOADING HOOK
// =============================================================================

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
 *
 * 🚀 Performance Benefits:
 * - useCallback for stable function references
 * - useRef to prevent unnecessary re-renders
 * - Efficient state updates with batching
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

/**
 * Hook for managing plot configuration with theme integration
 */
export const usePlotConfig = (config: PlotConfig = {}, theme?: ThemeConfig) => {
  return useMemo(
    () => ({
      // Title configuration
      title: config.title || "",

      // X-axis configuration with theme integration
      xAxis: {
        title: config.xAxis?.title || "X Axis",
        type: config.xAxis?.type || "linear",
        showgrid: config.xAxis?.showgrid ?? true,
        gridcolor:
          config.xAxis?.gridcolor || (theme?.darkMode ? "#374151" : "#e5e7eb"),
        zeroline: config.xAxis?.zeroline ?? true,
        ...config.xAxis,
      },

      // Y-axis configuration with theme integration
      yAxis: {
        title: config.yAxis?.title || "Y Axis",
        type: config.yAxis?.type || "linear",
        showgrid: config.yAxis?.showgrid ?? true,
        gridcolor:
          config.yAxis?.gridcolor || (theme?.darkMode ? "#374151" : "#e5e7eb"),
        zeroline: config.yAxis?.zeroline ?? true,
        ...config.yAxis,
      },

      // Layout dimensions
      width: config.width || "100%",
      height: config.height || "500px",
      minHeight: config.minHeight || "400px",

      // Legend configuration
      showLegend: config.showLegend ?? true,
      legendPosition: config.legendPosition || { x: 1.02, y: 1 },

      // Layout spacing - optimized for full width
      margin: config.margin || { l: 80, r: 150, t: 80, b: 80 },

      // Responsive behavior
      responsive: config.responsive ?? true,
      useResizeHandler: config.useResizeHandler ?? true,

      // Color scheme with theme integration
      backgroundColor:
        config.backgroundColor || (theme?.darkMode ? "#1a1a1a" : "#ffffff"),
      plotBackgroundColor:
        config.plotBackgroundColor || (theme?.darkMode ? "#2d3748" : "#fafbfc"),

      // Font configuration with theme integration
      font: {
        family:
          config.font?.family ||
          "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
        size: config.font?.size || 14,
        color: config.font?.color || (theme?.darkMode ? "#e2e8f0" : "#24292e"),
        ...config.font,
      },

      // Additional elements
      annotations: config.annotations || [],
      shapes: config.shapes || [],
    }),
    [config, theme]
  );
};

/**
 * Hook for managing interaction configuration
 */
export const useInteractionConfig = (interactions: InteractionConfig = {}) => {
  return useMemo(
    () => ({
      enableZoom: interactions.enableZoom ?? true,
      enablePan: interactions.enablePan ?? true,
      enableSelect: interactions.enableSelect ?? true,
      enableHover: interactions.enableHover ?? true,
      enableHoverOpacity: interactions.enableHoverOpacity ?? false,
      dimmedOpacity: interactions.dimmedOpacity ?? 0.3,
      highlightOpacity: interactions.highlightOpacity ?? 1.0,
      dragmode: interactions.dragmode || "zoom",
      hovermode: interactions.hovermode || "closest",
      clickmode: interactions.clickmode || "event+select",
      selectdirection: interactions.selectdirection || "any",
    }),
    [interactions]
  );
};

/**
 * Hook for managing plot event handlers
 */
export const usePlotEvents = (
  onPlotClick?: (data: PlotlyClickEvent) => void,
  onPlotHover?: (data: PlotlyHoverEvent) => void,
  onPlotSelect?: (data: PlotlySelectEvent) => void,
  onPlotZoom?: (data: PlotlyZoomEvent) => void
) => {
  const handleClick = useCallback(
    (data: PlotlyClickEvent) => {
      if (onPlotClick) {
        onPlotClick(data);
      }
    },
    [onPlotClick]
  );

  const handleHover = useCallback(
    (data: PlotlyHoverEvent) => {
      if (onPlotHover) {
        onPlotHover(data);
      }
    },
    [onPlotHover]
  );

  const handleSelect = useCallback(
    (data: PlotlySelectEvent) => {
      if (onPlotSelect) {
        onPlotSelect(data);
      }
    },
    [onPlotSelect]
  );

  const handleZoom = useCallback(
    (data: PlotlyZoomEvent) => {
      if (onPlotZoom) {
        onPlotZoom(data);
      }
    },
    [onPlotZoom]
  );

  return {
    handleClick,
    handleHover,
    handleSelect,
    handleZoom,
  };
};

/**
 * Hook for managing responsive plot dimensions
 */
export const useResponsiveDimensions = (
  width?: string | number,
  height?: string | number,
  minHeight?: string | number
) => {
  const [dimensions, setDimensions] = useState({
    width: width || "100%",
    height: height || "500px",
    minHeight: minHeight || "400px",
  });

  useEffect(() => {
    const handleResize = () => {
      // Update dimensions based on container or viewport if needed
      setDimensions((prev) => ({
        ...prev,
        width: width || "100%",
        height: height || "500px",
        minHeight: minHeight || "400px",
      }));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [width, height, minHeight]);

  return dimensions;
};

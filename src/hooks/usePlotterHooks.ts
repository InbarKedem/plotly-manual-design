// =============================================================================
// CUSTOM HOOKS FOR UNIFIED PLOTTER
// =============================================================================
// This file contains React hooks that encapsulate complex logic for
// progressive data loading, plot configuration, and interaction handling.

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import type {
  SeriesConfig,
  PlotConfig,
  InteractionConfig,
  ProgressConfig,
  ThemeConfig,
  DataStats,
} from "../types/PlotterTypes";
import { calculateDataStats } from "../utils/dataUtils";

/**
 * Hook for managing progressive data loading
 * Handles chunked loading of large datasets with progress tracking
 */
export const useProgressiveLoading = (
  series: SeriesConfig[],
  progressConfig?: ProgressConfig,
  onTraceCreated?: (seriesConfig: SeriesConfig, seriesIndex: number) => any[]
) => {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState("Ready");
  const [isGenerating, setIsGenerating] = useState(false);
  const [totalPointsLoaded, setTotalPointsLoaded] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [plotData, setPlotData] = useState<any[]>([]);
  const [dataStats, setDataStats] = useState<DataStats | null>(null);
  const loadingRef = useRef(false);

  /**
   * Load data progressively in chunks
   */
  const loadDataProgressively = useCallback(async () => {
    // Prevent multiple simultaneous loading attempts
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
    const traces: any[] = [];

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

      // Layout spacing
      margin: config.margin || { l: 60, r: 180, t: 60, b: 60 },

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
        size: config.font?.size || 12,
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
  onPlotClick?: (data: any) => void,
  onPlotHover?: (data: any) => void,
  onPlotSelect?: (data: any) => void,
  onPlotZoom?: (data: any) => void
) => {
  const handleClick = useCallback(
    (data: any) => {
      if (onPlotClick) {
        onPlotClick(data);
      }
    },
    [onPlotClick]
  );

  const handleHover = useCallback(
    (data: any) => {
      if (onPlotHover) {
        onPlotHover(data);
      }
    },
    [onPlotHover]
  );

  const handleSelect = useCallback(
    (data: any) => {
      if (onPlotSelect) {
        onPlotSelect(data);
      }
    },
    [onPlotSelect]
  );

  const handleZoom = useCallback(
    (data: any) => {
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

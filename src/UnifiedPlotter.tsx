import Plot from "react-plotly.js";
import { useMemo, useRef, useState, useCallback, useEffect } from "react";

// Declare Plotly global type
declare const Plotly: any;

// Type imports
import type { UnifiedPlotterProps } from "./types/PlotterTypes";

// Custom hooks
import {
  useProgressiveLoading,
  usePlotConfig,
  useInteractionConfig,
  usePlotEvents,
} from "./hooks/usePlotterHooks";

// UI Components
import ProgressIndicator from "./components/ProgressIndicator";
import DebugPanel from "./components/DebugPanel";
import CompletionIndicator from "./components/CompletionIndicator";

// Utilities
import { createTracesForSeries } from "./utils/traceGeneration";
import { validatePlotterInputs } from "./utils/validation";

// Performance hooks
import {
  usePerformanceMonitoring,
  useDebouncedInteractions,
} from "./hooks/usePerformanceHooks";

// Styles
import "./styles/animations.css";

// =============================================================================
// MAIN UNIFIED PLOTTER COMPONENT
// =============================================================================

/**
 * UnifiedPlotter - A comprehensive plotting solution for React applications
 *
 * This component provides a powerful interface for creating interactive data
 * visualizations with support for large datasets, progressive loading,
 * modern styling, and extensive customization options.
 *
 * Key Features:
 * - Progressive loading prevents UI blocking with large datasets
 * - Modern color scales optimized for accessibility
 * - Responsive design adapts to container size
 * - Debug mode for development and troubleshooting
 * - Comprehensive theming support
 * - Advanced interaction modes
 *
 * @param props - UnifiedPlotterProps configuration object
 * @returns JSX.Element - Rendered plot component
 */
const UnifiedPlotter: React.FC<UnifiedPlotterProps> = ({
  // Data and configuration props
  series,
  config = {},
  interactions = {},
  progressiveLoading,
  theme,

  // Performance and accessibility props
  validation,

  // Styling props
  className,
  style,

  // Event handlers
  onPlotClick,
  onPlotHover,
  onPlotSelect,
  onPlotZoom,
  onError,

  // Development props
  debug = false,
}) => {
  /** Reference to the Plotly component for direct access */
  const plotRef = useRef<any>(null);

  /** State for hover opacity feature */
  const [hoveredTrace, setHoveredTrace] = useState<number | null>(null);

  /** Performance monitoring */
  const { metrics, startMeasurement, endMeasurement } =
    usePerformanceMonitoring(series, debug);

  /** Debounced interactions for performance */
  const { debouncedHover, debouncedZoom } = useDebouncedInteractions(
    onPlotHover,
    onPlotZoom
  );

  /** Validation check on mount and data changes */
  useEffect(() => {
    if (validation?.enabled !== false) {
      const validationResult = validatePlotterInputs(
        series,
        config,
        interactions
      );

      if (!validationResult.isValid && validation?.throwOnError) {
        const error = new Error(
          `Validation failed: ${validationResult.errors
            .map((e) => e.message)
            .join(", ")}`
        );
        onError?.(error);
        if (validation.throwOnError) throw error;
      }

      if (validation?.showWarnings && validationResult.warnings.length > 0) {
        console.warn("Plotter validation warnings:", validationResult.warnings);
      }
    }
  }, [series, config, interactions, validation, onError]);

  /** Check Plotly availability on mount */
  useEffect(() => {
    // Simple check that will work with our new approach
    console.log("UnifiedPlotter mounted - hover effects will use React state");
  }, []);

  /** Enhanced plot configuration with theme integration */
  const plotConfig = usePlotConfig(config, theme);

  /** User interaction configuration */
  const interactionConfig = useInteractionConfig(interactions);

  /** Custom hover handler for opacity feature */
  const handleCustomHover = useCallback(
    (data: any) => {
      try {
        // Use debounced hover for performance
        debouncedHover(data);

        // Handle hover opacity if enabled
        if (interactionConfig.enableHoverOpacity && data?.points?.[0]) {
          const traceIndex = data.points[0].curveNumber;
          console.log("Hover event triggered for trace:", traceIndex);

          if (traceIndex !== hoveredTrace) {
            setHoveredTrace(traceIndex);
            console.log("Setting hovered trace to:", traceIndex);
          }
        }

        // Call original hover handler
        if (onPlotHover) {
          onPlotHover(data);
        }
      } catch (error) {
        console.error("Error in hover handler:", error);
      }
    },
    [interactionConfig, hoveredTrace, onPlotHover]
  );

  /** Custom unhover handler to reset opacities */
  const handleCustomUnhover = useCallback(() => {
    console.log("UNHOVER triggered - Resetting to original state");
    try {
      if (interactionConfig.enableHoverOpacity && hoveredTrace !== null) {
        setHoveredTrace(null);
        console.log(
          "Hover trace reset to null - plot will re-render with original data"
        );
      }
    } catch (error) {
      console.error("Error in unhover handler:", error);
    }
  }, [interactionConfig, hoveredTrace]);

  /** Event handlers with proper memoization */
  const { handleClick, handleSelect, handleZoom } = usePlotEvents(
    onPlotClick,
    undefined, // We'll handle hover ourselves
    onPlotSelect,
    (data: any) => {
      debouncedZoom(data); // Use debounced zoom for performance
      onPlotZoom?.(data);
    }
  );

  /**
   * Trace creation function - converts series data to Plotly traces
   * Memoized to prevent recreation on every render
   */
  const createTraces = useMemo(
    () => (seriesConfig: any, seriesIndex: number) =>
      createTracesForSeries(seriesConfig, seriesIndex, theme, plotConfig),
    [theme, plotConfig]
  );

  /**
   * Progressive loading state and data management
   * Handles chunked loading for performance with large datasets
   */
  const {
    progress,
    currentPhase,
    isGenerating,
    totalPointsLoaded,
    isComplete,
    plotData: originalPlotData,
    dataStats,
  } = useProgressiveLoading(series, progressiveLoading, createTraces);

  /**
   * Modified plot data for hover effects
   * Either returns original data or data with hover modifications
   */
  const plotData = useMemo(() => {
    startMeasurement();

    if (
      !interactionConfig.enableHoverOpacity ||
      hoveredTrace === null ||
      !originalPlotData
    ) {
      return originalPlotData;
    }

    // Create modified data for hover effect
    const modifiedData = originalPlotData.map((trace: any, index: number) => {
      const isHovered = index === hoveredTrace;

      if (isHovered) {
        // Make hovered trace prominent
        return {
          ...trace,
          opacity: 1.0,
          line: {
            ...trace.line,
            width: 8,
            color: "#FF0000",
            dash: "solid",
          },
          marker: {
            ...trace.marker,
            size: 12,
            color: "#FF0000",
            opacity: 1.0,
          },
        };
      } else {
        // Make other traces faded
        return {
          ...trace,
          opacity: 0.05,
          line: {
            ...trace.line,
            width: 0.5,
            color: "#CCCCCC",
            dash: "dot",
          },
          marker: {
            ...trace.marker,
            size: 2,
            color: "#CCCCCC",
            opacity: 0.1,
          },
        };
      }
    });

    endMeasurement("renderTime");
    return modifiedData;
  }, [
    originalPlotData,
    hoveredTrace,
    interactionConfig.enableHoverOpacity,
    startMeasurement,
    endMeasurement,
  ]);

  /**
   * Plotly layout configuration
   * Defines axes, styling, legends, and overall plot appearance
   */
  const plotLayout = useMemo(
    () => ({
      // Title configuration
      title: {
        text: plotConfig.title,
        font: plotConfig.font,
        x: 0.5,
        xanchor: "center" as const,
      },

      // Interaction modes - configured for single point hover
      dragmode: interactionConfig.dragmode,
      hovermode: "closest" as const, // Force closest point only, override any other settings
      hoverdistance: 20, // Increase hover sensitivity radius
      spikedistance: 20, // Increase spike sensitivity radius
      clickmode: interactionConfig.clickmode,
      selectdirection: interactionConfig.selectdirection,

      // Crosshair configuration - adds dashed lines on both axes
      xaxis: {
        ...plotConfig.xAxis,
        title: { text: plotConfig.xAxis.title, font: plotConfig.font },
        showspikes: true, // Enable spike lines (crosshairs)
        spikemode: "across" as const, // Draw spike across the plot
        spikesnap: "cursor" as const, // Snap to cursor position
        spikecolor: "#666666", // Dark gray color
        spikethickness: 1,
        spikedash: "dash" as const, // Dashed line style
      },
      yaxis: {
        ...plotConfig.yAxis,
        title: { text: plotConfig.yAxis.title, font: plotConfig.font },
        showspikes: true, // Enable spike lines (crosshairs)
        spikemode: "across" as const, // Draw spike across the plot
        spikesnap: "cursor" as const, // Snap to cursor position
        spikecolor: "#666666", // Dark gray color
        spikethickness: 1,
        spikedash: "dash" as const, // Dashed line style
      },

      // Legend configuration
      showlegend: plotConfig.showLegend,
      legend: {
        ...plotConfig.legendPosition,
        font: plotConfig.font,
        bgcolor: plotConfig.backgroundColor,
        bordercolor: plotConfig.font.color,
        borderwidth: 1,
      },

      // Layout and spacing
      margin: plotConfig.margin,
      paper_bgcolor: plotConfig.backgroundColor,
      plot_bgcolor: plotConfig.plotBackgroundColor,
      font: plotConfig.font,

      // Additional elements
      annotations: plotConfig.annotations,
      shapes: plotConfig.shapes,
    }),
    [plotConfig, interactionConfig]
  );

  /**
   * Plotly configuration options
   * Controls plot behavior, responsiveness, and toolbar options
   */
  const plotlyConfig = useMemo(
    () => ({
      // Responsive behavior
      responsive: plotConfig.responsive,

      // Toolbar configuration
      displayModeBar: true,
      displaylogo: false,

      // Interaction settings
      scrollZoom: interactionConfig.enableZoom,
      doubleClick: "reset+autosize" as const,

      // Export options
      toImageButtonOptions: {
        format: "png" as const,
        filename: "unified_plot",
        height: 500,
        width: 700,
        scale: 1,
      },
    }),
    [plotConfig, interactionConfig]
  );

  return (
    <div
      className={className}
      style={{
        // Container positioning and layout
        position: "relative",
        width: plotConfig.width,
        height: plotConfig.height,
        minHeight: plotConfig.minHeight,

        // Visual feedback for completion state
        border: "3px solid transparent",
        borderRadius: "8px",

        // Smooth transitions
        transition: "all 0.3s ease-in-out",

        // Background styling
        backgroundColor: plotConfig.backgroundColor,

        // Apply custom styles
        ...style,
      }}
    >
      <ProgressIndicator
        progress={progress}
        currentPhase={currentPhase}
        totalPointsLoaded={totalPointsLoaded}
        isGenerating={isGenerating}
        progressConfig={progressiveLoading}
        dataStats={dataStats}
      />

      <CompletionIndicator isComplete={isComplete} message="Complete" />

      <DebugPanel
        debug={debug}
        dataStats={dataStats}
        performanceMetrics={metrics}
        additionalInfo={{
          "Plot Type": "UnifiedPlotter",
          "Plotly Version": "Latest",
          "Theme Mode": theme?.darkMode ? "Dark" : "Light",
          "Progressive Loading": progressiveLoading?.enabled
            ? "Enabled"
            : "Disabled",
          "Performance Monitoring": debug ? "Enabled" : "Disabled",
        }}
      />

      <Plot
        ref={plotRef}
        // Data and layout
        data={plotData}
        layout={plotLayout}
        config={plotlyConfig}
        // Styling
        style={{ width: "100%", height: "100%" }}
        // Event handlers
        onClick={handleClick}
        onHover={handleCustomHover}
        onUnhover={handleCustomUnhover}
        onSelected={handleSelect}
        onRelayout={handleZoom}
      />
    </div>
  );
};

export default UnifiedPlotter;

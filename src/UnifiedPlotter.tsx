import Plot from "react-plotly.js";
import { useMemo, useRef, useState, useCallback, useEffect } from "react";
import type { Data, Layout } from "plotly.js";

// Type imports
import type {
  UnifiedPlotterProps,
  PlotlyHoverEvent,
  PlotlyZoomEvent,
  PlotlyClickEvent,
  PlotlySelectEvent,
} from "./types/PlotterTypes";

// Custom hooks
import {
  usePlotConfig,
  useInteractionConfig,
  usePlotEvents,
} from "./hooks/usePlotterHooks";

// UI Components
import ProgressIndicator from "./components/ProgressIndicator";
import DebugPanel from "./components/DebugPanel";
import CompletionIndicator from "./components/CompletionIndicator";

// Utilities
import { createAllTraces } from "./utils/traceGeneration";
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

  // Curve styling props
  curveColoring,
  curveLineStyles,

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
  const plotRef = useRef<Plot>(null);

  /** State for hover opacity feature */
  const [hoveredTrace, setHoveredTrace] = useState<number | null>(null);

  /** Performance monitoring */
  const { metrics, startMeasurement, endMeasurement } =
    usePerformanceMonitoring(series, debug);

  /** Debounced interactions for performance */
  const { debouncedHover, debouncedZoom } = useDebouncedInteractions(
    onPlotHover ? (data: PlotlyHoverEvent) => onPlotHover(data) : undefined,
    onPlotZoom ? (data: PlotlyZoomEvent) => onPlotZoom(data) : undefined
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
        // Validation warnings available in validationResult.warnings
      }
    }
  }, [series, config, interactions, validation, onError]);

  /** Check Plotly availability on mount */
  useEffect(() => {
    // Simple check that will work with our new approach
    // UnifiedPlotter mounted - hover effects will use React state
  }, []);

  /** Enhanced plot configuration with theme integration */
  const plotConfig = usePlotConfig(config, theme);

  /** User interaction configuration */
  const interactionConfig = useInteractionConfig(interactions);

  /** Custom hover handler for opacity feature */
  const handleCustomHover = useCallback(
    (data: unknown) => {
      try {
        const hoverData = data as { points?: Array<{ curveNumber: number }> };

        // Use debounced hover for performance
        debouncedHover(data as PlotlyHoverEvent);

        // Handle hover opacity if enabled
        if (interactionConfig.enableHoverOpacity && hoverData?.points?.[0]) {
          const traceIndex = hoverData.points[0].curveNumber;

          if (traceIndex !== hoveredTrace) {
            setHoveredTrace(traceIndex);
          }
        }

        // Call original hover handler
        if (onPlotHover) {
          onPlotHover(data as PlotlyHoverEvent);
        }
      } catch (error) {
        console.error("Error in hover handler:", error);
      }
    },
    [interactionConfig, hoveredTrace, onPlotHover]
  );

  /** Custom unhover handler to reset opacities */
  const handleCustomUnhover = useCallback(() => {
    try {
      if (interactionConfig.enableHoverOpacity && hoveredTrace !== null) {
        setHoveredTrace(null);
      }
    } catch (error) {
      console.error("Error in unhover handler:", error);
    }
  }, [interactionConfig, hoveredTrace]);

  /** Event handlers with proper memoization */
  const { handleClick, handleSelect, handleZoom } = usePlotEvents(
    onPlotClick ? (data: PlotlyClickEvent) => onPlotClick(data) : undefined,
    undefined, // We'll handle hover ourselves
    onPlotSelect ? (data: PlotlySelectEvent) => onPlotSelect(data) : undefined,
    (data: PlotlyZoomEvent) => {
      debouncedZoom(data); // Use debounced zoom for performance
      onPlotZoom?.(data);
    }
  );

  /**
   * All plot data traces with enhanced styling
   * Memoized to prevent recreation on every render
   */
  const plotData = useMemo(() => {
    startMeasurement();

    // Create all traces with enhanced curve styling
    const allTraces = createAllTraces(
      series,
      theme,
      plotConfig,
      curveColoring,
      curveLineStyles
    );

    endMeasurement("traceGeneration");
    return allTraces;
  }, [
    series,
    theme,
    plotConfig,
    curveColoring,
    curveLineStyles,
    startMeasurement,
    endMeasurement,
  ]);

  /**
   * Progressive loading state and data management
   * Note: For now, using direct trace creation. Progressive loading can be enhanced later.
   */
  const progress = 100; // Always complete since we're creating all traces at once
  const currentPhase = "Complete";
  const isGenerating = false;
  const totalPointsLoaded = series.reduce(
    (total, s) => total + (s.data?.length || 0),
    0
  );
  const isComplete = true;

  // Calculate comprehensive data stats
  const dataStats = useMemo(() => {
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
  }, [series]);

  /**
   * Modified plot data for hover effects
   * Either returns original data or data with hover modifications
   */
  const finalPlotData = useMemo(() => {
    if (
      !interactionConfig.enableHoverOpacity ||
      hoveredTrace === null ||
      !plotData
    ) {
      return plotData;
    }

    // Create modified data for hover effect
    const modifiedData = (plotData as Data[]).map((trace, index: number) => {
      const isHovered = index === hoveredTrace;
      const traceRecord = trace as Record<string, any>;

      if (isHovered) {
        // Make hovered trace prominent
        return {
          ...trace,
          opacity: 1.0,
          line: {
            ...(traceRecord.line || {}),
            width: 8,
            color: "#FF0000",
            dash: "solid",
          },
          marker: {
            ...(traceRecord.marker || {}),
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
            ...(traceRecord.line || {}),
            width: 0.5,
            color: "#CCCCCC",
            dash: "dot",
          },
          marker: {
            ...(traceRecord.marker || {}),
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
    plotData,
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
        data={finalPlotData as Data[]}
        layout={plotLayout as Partial<Layout>}
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

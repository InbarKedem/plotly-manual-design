import Plot from "react-plotly.js";
import { useMemo, useRef, useState, useCallback } from "react";

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

  // Styling props
  className,
  style,

  // Event handlers
  onPlotClick,
  onPlotHover,
  onPlotSelect,
  onPlotZoom,

  // Development props
  debug = false,
}) => {
  /** Reference to the Plotly component for direct access */
  const plotRef = useRef<any>(null);

  /** State for hover opacity feature */
  const [hoveredTrace, setHoveredTrace] = useState<number | null>(null);

  /** Enhanced plot configuration with theme integration */
  const plotConfig = usePlotConfig(config, theme);

  /** User interaction configuration */
  const interactionConfig = useInteractionConfig(interactions);

  /** Custom hover handler for opacity feature */
  const handleCustomHover = useCallback(
    (data: any) => {
      // Handle hover opacity if enabled
      if (interactionConfig.enableHoverOpacity && data?.points?.[0]) {
        const traceIndex = data.points[0].curveNumber;
        if (traceIndex !== hoveredTrace) {
          setHoveredTrace(traceIndex);

          // Update trace opacities for entire lines/traces
          if (plotRef.current) {
            const update: any = {};
            const plotlyData = plotRef.current.data;

            plotlyData.forEach((_: any, index: number) => {
              const opacity =
                index === traceIndex
                  ? interactionConfig.highlightOpacity ?? 1.0
                  : interactionConfig.dimmedOpacity ?? 0.3;

              // Set opacity for the entire trace (affects both markers and lines)
              update[`opacity[${index}]`] = opacity;

              // For lines, also update line opacity specifically
              if (plotlyData[index].line) {
                update[`line.opacity[${index}]`] = opacity;
              }

              // For markers, also update marker opacity specifically
              if (plotlyData[index].marker) {
                update[`marker.opacity[${index}]`] = opacity;
              }
            });

            plotRef.current.restyle(update);
          }
        }
      }

      // Call original hover handler
      if (onPlotHover) {
        onPlotHover(data);
      }
    },
    [interactionConfig, hoveredTrace, onPlotHover]
  );

  /** Custom unhover handler to reset opacities */
  const handleCustomUnhover = useCallback(() => {
    if (interactionConfig.enableHoverOpacity && hoveredTrace !== null) {
      setHoveredTrace(null);

      // Reset all trace opacities to their original values
      if (plotRef.current) {
        const update: any = {};
        const plotlyData = plotRef.current.data;

        plotlyData.forEach((_: any, index: number) => {
          // Reset opacity for the entire trace
          update[`opacity[${index}]`] = 1.0;

          // Reset line opacity if it exists
          if (plotlyData[index].line) {
            update[`line.opacity[${index}]`] = 1.0;
          }

          // Reset marker opacity if it exists
          if (plotlyData[index].marker) {
            update[`marker.opacity[${index}]`] = 1.0;
          }
        });

        plotRef.current.restyle(update);
      }
    }
  }, [interactionConfig, hoveredTrace]);

  /** Event handlers with proper memoization */
  const { handleClick, handleSelect, handleZoom } = usePlotEvents(
    onPlotClick,
    undefined, // We'll handle hover ourselves
    onPlotSelect,
    onPlotZoom
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
    plotData,
    dataStats,
  } = useProgressiveLoading(series, progressiveLoading, createTraces);

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
        additionalInfo={{
          "Plot Type": "UnifiedPlotter",
          "Plotly Version": "Latest",
          "Theme Mode": theme?.darkMode ? "Dark" : "Light",
          "Progressive Loading": progressiveLoading?.enabled
            ? "Enabled"
            : "Disabled",
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

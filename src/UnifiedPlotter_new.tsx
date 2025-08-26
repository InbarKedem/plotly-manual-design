// =============================================================================
// UNIFIED PLOTTER - MAIN COMPONENT
// =============================================================================
// A comprehensive, high-performance plotting component built on Plotly.js
// Features:
// - Progressive loading for large datasets (10K+ points)
// - Modern color scales and theming
// - Interactive features (zoom, pan, hover, select)
// - Error bars and gradient lines
// - Responsive design with glass-morphism UI
// - Comprehensive TypeScript support
// - Debug mode for development
//
// Author: AI Assistant
// Last Updated: 2025
// =============================================================================

import Plot from "react-plotly.js";
import { useMemo, useRef } from "react";

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
  // ==========================================================================
  // REFS & MEMOIZED VALUES
  // ==========================================================================

  /** Reference to the Plotly component for direct access */
  const plotRef = useRef<any>(null);

  /** Enhanced plot configuration with theme integration */
  const plotConfig = usePlotConfig(config, theme);

  /** User interaction configuration */
  const interactionConfig = useInteractionConfig(interactions);

  /** Event handlers with proper memoization */
  const { handleClick, handleHover, handleSelect, handleZoom } = usePlotEvents(
    onPlotClick,
    onPlotHover,
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

  // ==========================================================================
  // PLOTLY CONFIGURATION OBJECTS
  // ==========================================================================

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

      // Axis configurations with theme integration
      xaxis: {
        ...plotConfig.xAxis,
        title: { text: plotConfig.xAxis.title, font: plotConfig.font },
      },
      yaxis: {
        ...plotConfig.yAxis,
        title: { text: plotConfig.yAxis.title, font: plotConfig.font },
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

      // Interaction modes
      dragmode: interactionConfig.dragmode,
      hovermode: interactionConfig.hovermode,
      clickmode: interactionConfig.clickmode,
      selectdirection: interactionConfig.selectdirection,
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

  // ==========================================================================
  // MAIN COMPONENT RENDER
  // ==========================================================================

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
        border: isComplete ? "3px solid #22c55e" : "3px solid transparent",
        borderRadius: "8px",

        // Smooth transitions
        transition: "all 0.3s ease-in-out",

        // Background styling
        backgroundColor: plotConfig.backgroundColor,

        // Apply custom styles
        ...style,
      }}
    >
      {/* =================================================================== */}
      {/* PROGRESS INDICATOR OVERLAY */}
      {/* Shows loading progress during data processing */}
      {/* =================================================================== */}
      <ProgressIndicator
        progress={progress}
        currentPhase={currentPhase}
        totalPointsLoaded={totalPointsLoaded}
        isGenerating={isGenerating}
        progressConfig={progressiveLoading}
        dataStats={dataStats}
      />

      {/* =================================================================== */}
      {/* COMPLETION INDICATOR */}
      {/* Shows success state when loading is finished */}
      {/* =================================================================== */}
      <CompletionIndicator isComplete={isComplete} message="Complete" />

      {/* =================================================================== */}
      {/* DEBUG INFORMATION PANEL */}
      {/* Development tool for monitoring plot statistics */}
      {/* =================================================================== */}
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

      {/* =================================================================== */}
      {/* MAIN PLOTLY COMPONENT */}
      {/* The core plotting component with all data and interactions */}
      {/* =================================================================== */}
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
        onHover={handleHover}
        onSelected={handleSelect}
        onRelayout={handleZoom}
      />
    </div>
  );
};

export default UnifiedPlotter;

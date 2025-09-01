// =============================================================================
// 📈 UNIFIED PLOTTER - MODULAR ARCHITECTURE
// =============================================================================
// Refactored UnifiedPlotter with new modular architecture for larger app integration.

import React, { useMemo, useRef, useState, useCallback } from "react";
import Plot from "react-plotly.js";
import type { Data, Layout } from "plotly.js";

// 📊 Core types from new modular structure
import type {
  SeriesData,
  PlotConfig,
  InteractionConfig,
  ThemeConfig,
  PlotlyHoverEvent,
  PlotlyZoomEvent,
  PlotlyClickEvent,
  PlotlySelectEvent,
} from "../../../types/plotting/core";

// 🎣 Modular hooks
import {
  useDebouncedInteractions,
  usePerformanceMonitoring,
} from "../../../hooks/performance";
import {
  usePlotConfig,
  useInteractionConfig,
  useThemeConfig,
  usePlotEvents,
} from "../../../hooks/plotting";

// 🛠️ Utilities
import {
  createAllTraces,
  applyHoverOpacity,
  generateDataStats,
} from "../../../utils/plotting";

// ⚙️ Configuration
import { DEFAULT_PLOT_CONFIG, LEGEND_POSITION } from "../../../config/plotting";

// 🎨 Styles
import "../../../styles/animations.css";

// =============================================================================
// 🎯 COMPONENT INTERFACE
// =============================================================================

/**
 * Props interface for the UnifiedPlotter component
 */
export interface UnifiedPlotterProps {
  /** Array of data series to plot */
  series: SeriesData[];

  /** Plot configuration overrides */
  config?: Partial<PlotConfig>;

  /** Interaction settings */
  interactions?: Partial<InteractionConfig>;

  /** Theme configuration */
  theme?: Partial<ThemeConfig>;

  /** CSS class name */
  className?: string;

  /** Inline styles */
  style?: React.CSSProperties;

  /** Event handlers */
  onPlotClick?: (data: PlotlyClickEvent) => void;
  onPlotHover?: (data: PlotlyHoverEvent) => void;
  onPlotSelect?: (data: PlotlySelectEvent) => void;
  onPlotZoom?: (data: PlotlyZoomEvent) => void;
  onError?: (error: Error) => void;

  /** Debug mode */
  debug?: boolean;
}

// =============================================================================
// 🎯 MAIN COMPONENT
// =============================================================================

/**
 * 📊 UnifiedPlotter - Modular, Enterprise-Ready Visualization Component
 *
 * Refactored with new architecture for seamless integration into larger applications.
 * Features debounced interactions, performance monitoring, and modular design.
 */
export const UnifiedPlotter: React.FC<UnifiedPlotterProps> = ({
  series,
  config = {},
  interactions = {},
  theme = {},
  className,
  style,
  onPlotClick,
  onPlotHover,
  onPlotSelect,
  onPlotZoom,
  onError,
  debug = false,
}) => {
  // =============================================================================
  // 🎣 HOOK INTEGRATION
  // =============================================================================

  /** 📊 Plot configuration with intelligent defaults */
  const plotConfig = usePlotConfig(config);

  /** 🎮 Interaction configuration management */
  const { interactionConfig } = useInteractionConfig(interactions);

  /** 🎨 Theme configuration management */
  const { themeConfig } = useThemeConfig(theme);

  /** 🎯 Plot event handlers with error boundaries */
  const { handleClick, handleHover, handleSelect, handleZoom } = usePlotEvents({
    onPlotClick,
    onPlotHover,
    onPlotSelect,
    onPlotZoom,
    onError,
  });

  // =============================================================================
  // 🔄 STATE MANAGEMENT
  // =============================================================================

  /** 🎯 Hover state for opacity effects */
  const [hoveredTrace, setHoveredTrace] = useState<number | null>(null);

  /** 📊 Plot reference for imperative operations */
  const plotRef = useRef<Plot>(null);

  // =============================================================================
  // ⚡ PERFORMANCE OPTIMIZATION
  // =============================================================================

  /** 📈 Performance monitoring */
  const totalDataSize = useMemo(
    () => series.reduce((sum, s) => sum + s.data.length, 0),
    [series]
  );

  const { metrics, startMeasurement, endMeasurement } =
    usePerformanceMonitoring(totalDataSize, debug);

  /** 🔄 Debounced interactions for smooth UX */
  const { debouncedHover, debouncedZoom } = useDebouncedInteractions(
    handleHover,
    handleZoom,
    interactionConfig.debounceMs
  );

  // =============================================================================
  // 📊 DATA PROCESSING
  // =============================================================================

  /** 🎨 Generate Plotly traces */
  const plotData = useMemo(() => {
    startMeasurement();
    const traces = createAllTraces(series, themeConfig, plotConfig);
    const finalTraces = applyHoverOpacity(traces, hoveredTrace);
    endMeasurement("traceGeneration");
    return finalTraces;
  }, [
    series,
    themeConfig,
    plotConfig,
    hoveredTrace,
    startMeasurement,
    endMeasurement,
  ]);

  /** 📐 Plot layout configuration */
  const plotLayout = useMemo(
    (): Partial<Layout> => ({
      // 🎨 Visual styling
      paper_bgcolor: themeConfig.backgroundColor,
      plot_bgcolor: themeConfig.backgroundColor,

      // 📊 Layout structure
      margin: plotConfig.margin,

      // 🎯 Legend configuration
      legend: {
        ...LEGEND_POSITION,
        bgcolor: "rgba(255,255,255,0.9)",
        bordercolor: "#e5e7eb",
        borderwidth: 1,
        font: { size: 12, color: themeConfig.textColor },
      },

      // 🔍 Axis configuration with crosshair support
      xaxis: {
        title: "X Values",
        showgrid: true,
        gridcolor: themeConfig.gridColor,
        showspikes: interactionConfig.enableCrosshair, // Vertical crosshair
        spikecolor: "#6b7280",
        spikedash: "solid",
        spikethickness: 1,
      },

      yaxis: {
        title: "Y Values",
        showgrid: true,
        gridcolor: themeConfig.gridColor,
        showspikes: interactionConfig.enableCrosshair, // Horizontal crosshair
        spikecolor: "#6b7280",
        spikedash: "solid",
        spikethickness: 1,
      },

      // 🎯 Hover configuration
      hovermode: interactionConfig.enableHover ? "closest" : false,
      hoverdistance: interactionConfig.hoverDistance,

      // 📱 Responsive configuration
      autosize: plotConfig.responsive,
    }),
    [themeConfig, plotConfig, interactionConfig]
  );

  /** ⚙️ Plotly configuration */
  const plotlyConfig = useMemo(
    () => ({
      responsive: plotConfig.responsive,
      displayModeBar: true,
      displaylogo: false,
      scrollZoom: interactionConfig.enableZoom,
      doubleClick: "reset+autosize" as const,
      hoverData: true,
      showTips: true,
      staticPlot: false,
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

  // =============================================================================
  // 🎯 HOVER INTERACTION HANDLERS
  // =============================================================================

  /** 🔍 Custom hover handler with trace tracking */
  const handleCustomHover = useCallback(
    (data: PlotlyHoverEvent) => {
      const traceIndex = data.points?.[0]?.curveNumber;
      setHoveredTrace(traceIndex ?? null);
      debouncedHover(data);
    },
    [debouncedHover]
  );

  /** 🚫 Custom unhover handler */
  const handleCustomUnhover = useCallback(() => {
    setHoveredTrace(null);
  }, []);

  // =============================================================================
  // 🎨 RENDER
  // =============================================================================

  return (
    <div
      className={className}
      data-testid="unified-plotter"
      style={{
        position: "relative",
        width: plotConfig.width,
        height: plotConfig.height,
        minHeight: plotConfig.minHeight,
        border: "3px solid transparent",
        borderRadius: "8px",
        transition: "all 0.3s ease-in-out",
        backgroundColor: plotConfig.backgroundColor,
        ...style,
      }}
    >
      {/* 📊 Performance Debug Info */}
      {debug && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "rgba(0,0,0,0.8)",
            color: "white",
            padding: "8px",
            borderRadius: "4px",
            fontSize: "12px",
            zIndex: 1004,
          }}
        >
          <div>📊 Points: {totalDataSize.toLocaleString()}</div>
          <div>⏱️ Render: {metrics.renderTime.toFixed(1)}ms</div>
          <div>💾 Memory: {(metrics.memoryUsage / 1024).toFixed(1)}KB</div>
          <div>🎯 Events: {metrics.eventCount}</div>
        </div>
      )}

      {/* 📈 Main Plot Component */}
      <Plot
        ref={plotRef}
        data={plotData as Data[]}
        layout={plotLayout as Partial<Layout>}
        config={plotlyConfig}
        style={{ width: "100%", height: "100%" }}
        onClick={handleClick}
        onHover={handleCustomHover}
        onUnhover={handleCustomUnhover}
        onSelected={handleSelect}
        onRelayout={debouncedZoom}
      />
    </div>
  );
};

export default UnifiedPlotter;

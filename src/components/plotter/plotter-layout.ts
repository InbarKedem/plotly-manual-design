// =============================================================================
// 🎯 UNIFIED PLOTTER - LAYOUT CONFIGURATION
// =============================================================================
// Extracted plot layout logic for cleaner main component

import { useMemo } from "react";
import { PLOT_LAYOUT } from "./plotter-constants";
import type { PlotConfig, InteractionConfig } from "../../types";

/**
 * Custom hook for generating Plotly layout configuration
 */
export const usePlotLayout = (
  plotConfig: PlotConfig,
  interactionConfig: InteractionConfig
) => {
  return useMemo(
    () => ({
      // Title configuration
      title: {
        text: plotConfig.title || "",
        font: plotConfig.font,
        x: 0.02, // Left-aligned for professional look
        xanchor: "left",
      },

      // Axis configuration
      xaxis: {
        title: plotConfig.xAxis?.title || "X Axis",
        type: plotConfig.xAxis?.type || "linear",
        showgrid: plotConfig.xAxis?.showgrid ?? true,
        gridcolor: plotConfig.xAxis?.gridcolor || "#e5e7eb",
        zeroline: plotConfig.xAxis?.zeroline ?? true,
        ...plotConfig.xAxis,
      },

      yaxis: {
        title: plotConfig.yAxis?.title || "Y Axis",
        type: plotConfig.yAxis?.type || "linear",
        showgrid: plotConfig.yAxis?.showgrid ?? true,
        gridcolor: plotConfig.yAxis?.gridcolor || "#e5e7eb",
        zeroline: plotConfig.yAxis?.zeroline ?? true,
        ...plotConfig.yAxis,
      },

      // Legend configuration
      showlegend: plotConfig.showLegend ?? true,
      legend: {
        ...PLOT_LAYOUT.LEGEND,
        ...plotConfig.legendPosition,
      },

      // Interactive behavior
      dragmode: interactionConfig.dragmode,
      hovermode: interactionConfig.hovermode,
      clickmode: interactionConfig.clickmode,
      selectdirection: interactionConfig.selectdirection,

      // Layout and spacing
      margin: plotConfig.margin || PLOT_LAYOUT.DEFAULT_MARGINS,
      paper_bgcolor: PLOT_LAYOUT.BACKGROUNDS.PAPER,
      plot_bgcolor: PLOT_LAYOUT.BACKGROUNDS.PLOT,
      font: plotConfig.font,

      // Additional elements
      annotations: plotConfig.annotations,
      shapes: plotConfig.shapes,
    }),
    [plotConfig, interactionConfig]
  );
};

/**
 * Custom hook for generating Plotly config options
 */
export const usePlotlyConfig = (
  plotConfig: PlotConfig,
  interactionConfig: InteractionConfig
) => {
  return useMemo(
    () => ({
      // Responsive behavior
      responsive: plotConfig.responsive,

      // Toolbar configuration
      displayModeBar: true,
      displaylogo: false,

      // Interaction settings
      scrollZoom: interactionConfig.enableZoom,
      doubleClick: "reset+autosize" as const,

      // Enhanced hover configuration for smooth transitions
      hoverData: true,
      showTips: true,
      staticPlot: false,

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
};

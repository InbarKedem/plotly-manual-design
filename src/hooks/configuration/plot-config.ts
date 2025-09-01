// =============================================================================
// ⚙️ CONFIGURATION HOOKS
// =============================================================================
// Hooks for managing plot and interaction configuration with theme integration

import { useMemo } from "react";
import type { PlotConfig, InteractionConfig, ThemeConfig } from "../../types";

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

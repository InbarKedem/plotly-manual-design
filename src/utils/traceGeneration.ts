// =============================================================================
// TRACE GENERATION UTILITIES
// =============================================================================
// This file contains functions for converting SeriesConfig data into
// Plotly.js trace objects with enhanced styling and features.

import type {
  SeriesConfig,
  ThemeConfig,
  PlotConfig,
} from "../types/PlotterTypes";
import { MODERN_COLORSCALES } from "./colorscales";

/**
 * Create Plotly traces for all series
 * @param series - Array of series configurations
 * @param theme - Theme configuration
 * @param plotConfig - Plot configuration
 * @returns Array of Plotly trace objects
 */
export const createAllTraces = (
  series: SeriesConfig[],
  theme?: ThemeConfig,
  plotConfig?: PlotConfig
): any[] => {
  return series.flatMap((seriesConfig, index) =>
    createTracesForSeries(seriesConfig, index, theme, plotConfig)
  );
};

/**
 * Create Plotly traces for a single series
 * Handles various visualization modes including gradient lines,
 * color mapping, error bars, and multiple marker configurations
 *
 * @param seriesConfig - Configuration for the series
 * @param seriesIndex - Index of the series (for color cycling)
 * @param theme - Theme configuration
 * @param plotConfig - Plot configuration
 * @returns Array of Plotly trace objects
 */
export const createTracesForSeries = (
  seriesConfig: SeriesConfig,
  seriesIndex: number,
  theme?: ThemeConfig,
  plotConfig?: PlotConfig
): any[] => {
  const {
    name,
    data,
    type = "scatter",
    mode = "lines+markers",
    line = {},
    marker = {},
    errorBars,
    fill = "none",
    fillcolor,
    connectDots = true,
    gradientLines = false,
    visible = true,
    showInLegend = true,
    hoverinfo,
    hovertemplate,
    textposition,
    textfont,
    opacity,
  } = seriesConfig;

  // Return empty array if no data or not visible
  if (!data || data.length === 0 || !visible) {
    return [];
  }

  // Extract coordinate arrays from data points
  const xValues = data.map((d) => d.x);
  const yValues = data.map((d) => d.y);
  const zValues = data.map((d) => d.z);
  const textValues = data.map((d) => d.text);

  const traces: any[] = [];

  // ==========================================================================
  // GRADIENT LINES IMPLEMENTATION
  // ==========================================================================
  // Creates individual line segments with different colors for gradient effect
  if (gradientLines && connectDots && mode.includes("lines")) {
    const segmentColor = determineSegmentColor(marker, zValues, line, theme);

    // Create a trace for each line segment
    for (let i = 0; i < data.length - 1; i++) {
      traces.push({
        x: [xValues[i], xValues[i + 1]],
        y: [yValues[i], yValues[i + 1]],
        mode: "lines",
        type: type,
        name: i === 0 ? `${name} (gradient)` : "", // Only show legend for first segment
        line: {
          width: line.width || 2,
          color: Array.isArray(segmentColor) ? segmentColor[i] : segmentColor,
          dash: line.dash || "solid",
          shape: line.shape || "linear",
        },
        showlegend: i === 0 && showInLegend,
        hoverinfo: "skip", // Skip hover for gradient segments
      });
    }
  }

  // ==========================================================================
  // MAIN TRACE CONFIGURATION
  // ==========================================================================
  const mainTrace: any = {
    x: xValues,
    y: yValues,
    // Remove 'lines' from mode if using gradient lines to avoid duplication
    mode: gradientLines && connectDots ? mode.replace("lines+", "") : mode,
    type: type,
    name: `${name} (${data.length.toLocaleString()} pts)`,
    showlegend: showInLegend,
    text: textValues,
    textposition: textposition,
    textfont: textfont,
    hoverinfo: hoverinfo,
    hovertemplate: hovertemplate,
    fill: fill,
    fillcolor: fillcolor,
    opacity: opacity,
  };

  // ==========================================================================
  // LINE CONFIGURATION
  // ==========================================================================
  if (mode.includes("lines") && !(gradientLines && connectDots)) {
    mainTrace.line = createLineConfig(line, theme);
  }

  // ==========================================================================
  // MARKER CONFIGURATION
  // ==========================================================================
  if (mode.includes("markers")) {
    mainTrace.marker = createMarkerConfig(
      marker,
      data,
      line,
      theme,
      plotConfig,
      seriesIndex
    );
  }

  // ==========================================================================
  // ERROR BARS CONFIGURATION
  // ==========================================================================
  if (errorBars) {
    addErrorBars(mainTrace, errorBars, data, plotConfig);
  }

  traces.push(mainTrace);
  return traces;
};

/**
 * Determine color for gradient line segments
 */
const determineSegmentColor = (
  marker: any,
  zValues: any[],
  line: any,
  theme?: ThemeConfig
): string | any[] => {
  if (marker.colorFeature && zValues.some((z) => z != null)) {
    return zValues;
  }
  return line.color || theme?.primary || "#3b82f6";
};

/**
 * Create line configuration object
 */
const createLineConfig = (line: any, theme?: ThemeConfig) => ({
  width: line.width || 2,
  color: line.color || theme?.primary || "#3b82f6",
  dash: line.dash || "solid",
  shape: line.shape || "linear",
  smoothing: line.smoothing,
});

/**
 * Create marker configuration object with color mapping support
 */
const createMarkerConfig = (
  marker: any,
  data: any[],
  line: any,
  theme?: ThemeConfig,
  plotConfig?: PlotConfig,
  seriesIndex: number = 0
) => {
  const markerConfig: any = {
    size: marker.size || 6,
    symbol: marker.symbol || "circle",
    opacity: marker.opacity || 0.8,
    line: marker.line,
  };

  // ==========================================================================
  // COLOR MAPPING CONFIGURATION
  // ==========================================================================
  if (
    marker.colorFeature &&
    data.some((d) => d[marker.colorFeature!] != null)
  ) {
    const colorValues = data.map((d) => d[marker.colorFeature!]);
    const colorMin =
      marker.colorMin ?? Math.min(...colorValues.filter((v) => v != null));
    const colorMax =
      marker.colorMax ?? Math.max(...colorValues.filter((v) => v != null));

    markerConfig.color = colorValues;

    // Apply colorscale
    if (
      marker.colorScale &&
      typeof marker.colorScale === "string" &&
      marker.colorScale in MODERN_COLORSCALES
    ) {
      markerConfig.colorscale =
        MODERN_COLORSCALES[
          marker.colorScale as keyof typeof MODERN_COLORSCALES
        ];
    } else {
      markerConfig.colorscale = marker.colorScale || "viridis";
    }

    // Show colorbar only for first series to avoid clutter
    markerConfig.showscale = marker.showColorBar && seriesIndex === 0;

    if (markerConfig.showscale) {
      markerConfig.colorbar = createColorBarConfig(marker, plotConfig);
    }

    markerConfig.cmin = colorMin;
    markerConfig.cmax = colorMax;
  } else {
    // Use solid color
    markerConfig.color =
      marker.color || line.color || theme?.primary || "#3b82f6";
  }

  return markerConfig;
};

/**
 * Create colorbar configuration
 */
const createColorBarConfig = (marker: any, plotConfig?: PlotConfig) => ({
  title: {
    text: marker.colorBarTitle || marker.colorFeature,
    font: {
      size: 12,
      color: plotConfig?.font?.color || "#24292e",
    },
  },
  x: 1.02,
  y: 0.5,
  len: 0.8,
  thickness: 20,
  borderwidth: 0,
  bgcolor: plotConfig?.backgroundColor || "#ffffff",
  bordercolor: plotConfig?.font?.color || "#24292e",
  tickfont: {
    size: 10,
    color: plotConfig?.font?.color || "#24292e",
  },
});

/**
 * Add error bars to trace configuration
 */
const addErrorBars = (
  trace: any,
  errorBars: any,
  data: any[],
  plotConfig?: PlotConfig
) => {
  if (errorBars.x?.visible) {
    trace.error_x = {
      type: errorBars.x.type || "data",
      array: data.map((d) => d.error_x),
      visible: true,
      color: errorBars.x.color || plotConfig?.font?.color || "#24292e",
      thickness: errorBars.x.width || 2,
    };
  }

  if (errorBars.y?.visible) {
    trace.error_y = {
      type: errorBars.y.type || "data",
      array: data.map((d) => d.error_y),
      visible: true,
      color: errorBars.y.color || plotConfig?.font?.color || "#24292e",
      thickness: errorBars.y.width || 2,
    };
  }
};

// =============================================================================
// TRACE GENERATION UTILITIES
// =============================================================================
// This file contains functions for converting SeriesConfig data into
// Plotly.js trace objects with enhanced styling and features.

import type {
  SeriesConfig,
  ThemeConfig,
  PlotConfig,
  ErrorBarOptions,
  DataPoint,
  MarkerOptions,
  LineOptions,
  CurveColoringConfig,
  CurveLineStyleConfig,
} from "../types/PlotterTypes";
import type { Data } from "plotly.js";
import {
  MODERN_COLORSCALES,
  generateCurveColors,
  generateCurveLineStyles,
} from "./colorscales";
import { DEFAULT_SERIES_CONFIG } from "../config/defaults";

/**
 * Create Plotly traces for all series with enhanced curve styling
 * @param series - Array of series configurations
 * @param theme - Theme configuration
 * @param plotConfig - Plot configuration
 * @param curveColoring - Curve-by-curve coloring configuration
 * @param curveLineStyles - Curve-by-curve line styling configuration
 * @returns Array of Plotly trace objects
 */
export const createAllTraces = (
  series: SeriesConfig[],
  theme?: ThemeConfig,
  plotConfig?: PlotConfig,
  curveColoring?: CurveColoringConfig,
  curveLineStyles?: CurveLineStyleConfig
): Data[] => {
  // Generate colors and line styles for all curves if enabled
  const curveColors = curveColoring?.enabled
    ? generateCurveColors(
        series.length,
        curveColoring.colorScale,
        curveColoring.colorPalette
      )
    : [];

  const lineStyles = curveLineStyles?.enabled
    ? generateCurveLineStyles(series.length, curveLineStyles.stylePattern)
    : [];

  return series.flatMap((seriesConfig, index) =>
    createTracesForSeries(
      seriesConfig,
      index,
      theme,
      plotConfig,
      curveColoring?.enabled ? curveColors[index] : undefined,
      curveLineStyles?.enabled ? lineStyles[index] : undefined
    )
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
 * @param curveColor - Override color for this curve (curve-by-curve coloring)
 * @param curveLineStyle - Override line style for this curve
 * @returns Array of Plotly trace objects
 */
export const createTracesForSeries = (
  seriesConfig: SeriesConfig,
  seriesIndex: number,
  theme?: ThemeConfig,
  plotConfig?: PlotConfig,
  curveColor?: string,
  curveLineStyle?: "solid" | "dash" | "dot" | "dashdot" | "longdash"
): Data[] => {
  const {
    name,
    data,
    type = "scatter",
    mode = "lines+markers", // Default to lines with markers for smooth curves
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
  } = { ...DEFAULT_SERIES_CONFIG, ...seriesConfig };

  // Return empty array if no data or not visible
  if (!data || data.length === 0 || !visible) {
    return [];
  }

  // Extract coordinate arrays from data points
  const xValues = data.map((d) => d.x);
  const yValues = data.map((d) => d.y);
  const zValues = data.map((d) => d.z);
  const textValues = data.map((d) => d.text);

  const traces: Data[] = [];

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
        type: type as Data["type"],
        name: i === 0 ? `${name} (gradient)` : "", // Only show legend for first segment
        line: {
          width: line.width || 2,
          color: Array.isArray(segmentColor) ? segmentColor[i] : segmentColor,
          dash: line.dash || "solid",
          shape: line.shape || "linear",
        },
        showlegend: i === 0 && showInLegend,
        hoverinfo: "skip", // Skip hover for gradient segments
      } as Data);
    }
  }

  // ==========================================================================
  // MAIN TRACE CONFIGURATION
  // ==========================================================================
  const mainTrace = {
    x: xValues,
    y: yValues,
    // Remove 'lines' from mode if using gradient lines to avoid duplication
    mode: gradientLines && connectDots ? mode.replace("lines+", "") : mode,
    type: type as Data["type"],
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
    (mainTrace as Record<string, unknown>).line = createLineConfig(
      line,
      theme,
      curveColor,
      curveLineStyle
    );
  }

  // ==========================================================================
  // MARKER CONFIGURATION
  // ==========================================================================
  if (mode.includes("markers")) {
    (mainTrace as Record<string, unknown>).marker = createMarkerConfig(
      marker,
      data,
      line,
      theme,
      plotConfig,
      seriesIndex,
      curveColor
    );
  }

  // ==========================================================================
  // ERROR BARS CONFIGURATION
  // ==========================================================================
  if (errorBars) {
    addErrorBars(
      mainTrace as Record<string, unknown>,
      errorBars,
      data,
      plotConfig
    );
  }

  traces.push(mainTrace as Data);
  return traces;
};

/**
 * Determine color for gradient line segments
 */
const determineSegmentColor = (
  marker: MarkerOptions,
  zValues: (number | string | undefined)[],
  line: LineOptions,
  theme?: ThemeConfig
): string | (number | string)[] => {
  const markerObj = marker;
  const lineObj = line;

  if (markerObj.colorFeature && zValues.some((z) => z != null)) {
    return zValues as (number | string)[];
  }
  return (lineObj.color as string) || theme?.primary || "#3b82f6";
};

/**
 * Create line configuration object
 */
const createLineConfig = (
  line: LineOptions,
  theme?: ThemeConfig,
  curveColor?: string,
  curveLineStyle?: "solid" | "dash" | "dot" | "dashdot" | "longdash"
) => {
  const lineObj = line;
  return {
    width: lineObj.width || 2,
    color: curveColor || lineObj.color || theme?.primary || "#3b82f6",
    dash: curveLineStyle || lineObj.dash || "solid",
    shape: lineObj.shape || "spline", // Use spline for smooth curves by default
    smoothing: lineObj.smoothing !== undefined ? lineObj.smoothing : 0.8, // Default smoothing
  };
};

/**
 * Create marker configuration object with color mapping support
 */
const createMarkerConfig = (
  marker: MarkerOptions,
  data: DataPoint[],
  line: LineOptions,
  theme?: ThemeConfig,
  plotConfig?: PlotConfig,
  seriesIndex: number = 0,
  curveColor?: string
) => {
  const markerObj = marker;
  const lineObj = line;

  interface MarkerConfig {
    size?: number | number[];
    symbol?: string | string[];
    opacity?: number;
    line?: any;
    color?: any; // Allow flexible color types for Plotly compatibility
    colorscale?: string | any[][];
    showscale?: boolean;
    colorbar?: any;
    cmin?: number;
    cmax?: number;
  }

  const markerConfig: MarkerConfig = {
    size: markerObj.size || 6,
    symbol: markerObj.symbol || "circle",
    opacity: markerObj.opacity || 0.8,
    line: markerObj.line,
  };

  // ==========================================================================
  // COLOR MAPPING CONFIGURATION
  // ==========================================================================
  if (
    markerObj.colorFeature &&
    data.some((d) => (d as DataPoint)[markerObj.colorFeature as string] != null)
  ) {
    const colorValues = data.map((d) => d[markerObj.colorFeature as string]);
    const colorMin =
      (markerObj.colorMin as number) ??
      Math.min(...(colorValues.filter((v) => v != null) as number[]));
    const colorMax =
      (markerObj.colorMax as number) ??
      Math.max(...(colorValues.filter((v) => v != null) as number[]));

    markerConfig.color = colorValues;

    // Apply colorscale
    if (
      markerObj.colorScale &&
      typeof markerObj.colorScale === "string" &&
      markerObj.colorScale in MODERN_COLORSCALES
    ) {
      markerConfig.colorscale =
        MODERN_COLORSCALES[
          markerObj.colorScale as keyof typeof MODERN_COLORSCALES
        ];
    } else {
      markerConfig.colorscale = (markerObj.colorScale as string) || "viridis";
    }

    // Show colorbar only for first series to avoid clutter
    markerConfig.showscale = markerObj.showColorBar && seriesIndex === 0;

    if (markerConfig.showscale) {
      markerConfig.colorbar = createColorBarConfig(markerObj, plotConfig);
    }

    markerConfig.cmin = colorMin;
    markerConfig.cmax = colorMax;
  } else {
    // Use solid color - prioritize curve color, then marker color, then line color, then theme
    markerConfig.color =
      curveColor ||
      (markerObj.color as string) ||
      (lineObj.color as string) ||
      theme?.primary ||
      "#3b82f6";
  }

  return markerConfig;
};

/**
 * Create colorbar configuration
 */
const createColorBarConfig = (
  marker: MarkerOptions,
  plotConfig?: PlotConfig
) => ({
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
  trace: Record<string, unknown>,
  errorBars: ErrorBarOptions,
  data: DataPoint[],
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

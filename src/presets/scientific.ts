// =============================================================================
// 🧪 CHART PRESETS - SCIENTIFIC & BUSINESS CONFIGURATIONS
// =============================================================================
// Predefined configurations for common chart types following GitHub Copilot
// standards for clean, reusable, and well-documented code.
//
// 🎯 Design Goals:
// - DRY-compliant: Reusable preset configurations
// - Performance-oriented: Pre-configured for optimal rendering
// - Bug-resistant: Comprehensive default values and validation
// - Test-friendly: Predictable, consistent styling across demos

import type {
  SeriesConfig,
  PlotConfig,
  InteractionConfig,
} from "../types/PlotterTypes";
import { SCIENTIFIC_THEME } from "../config/themes";

// =============================================================================
// 🔬 SCIENTIFIC CHART PRESETS
// =============================================================================

/**
 * 📊 Scientific scatter plot preset with professional error bar styling
 *
 * Optimized for research data presentation, measurement analysis, and
 * publication-ready scientific visualizations.
 *
 * 🎯 Key Features:
 * - Error bar support for measurement uncertainties
 * - Professional grid styling for accurate reading
 * - Publication-ready font and spacing
 * - Optimal zoom and pan interactions for data exploration
 *
 * 🧪 Best Use Cases:
 * - Experimental data with uncertainties
 * - Research measurements and analysis
 * - Scientific publication figures
 */
export const scientificScatterPreset = {
  config: {
    title: "Scientific Measurements",
    xAxis: {
      title: "Independent Variable",
      showgrid: true,
      zeroline: false,
    },
    yAxis: {
      title: "Dependent Variable",
      showgrid: true,
      zeroline: false,
    },
    margin: { l: 80, r: 150, t: 80, b: 80 },
    showLegend: true,
    legendPosition: { x: 1.02, y: 1 },
    font: {
      family: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
      size: 14,
      color: "#24292e",
    },
  } as PlotConfig,

  interactions: {
    enableZoom: true,
    enablePan: true,
    hovermode: "closest",
    dragmode: "zoom",
  } as InteractionConfig,

  theme: SCIENTIFIC_THEME,

  seriesDefaults: {
    mode: "markers",
    marker: {
      size: 8,
      opacity: 0.7,
      line: { width: 1, color: "#374151" },
    },
    errorBars: {
      x: { visible: true, type: "data", color: "#6b7280" },
      y: { visible: true, type: "data", color: "#6b7280" },
    },
  } as Partial<SeriesConfig>,
};

/**
 * Time series analysis preset
 */
export const timeSeriesPreset = {
  config: {
    title: "Time Series Analysis",
    xAxis: {
      title: "Time",
      type: "date",
      showgrid: true,
    },
    yAxis: {
      title: "Value",
      showgrid: true,
    },
    margin: { l: 80, r: 150, t: 80, b: 80 },
    legendPosition: { x: 1.02, y: 1 },
    font: {
      family: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
      size: 14,
      color: "#24292e",
    },
  } as PlotConfig,

  interactions: {
    enableZoom: true,
    enablePan: true,
    hovermode: "x unified",
    dragmode: "zoom",
  } as InteractionConfig,

  theme: SCIENTIFIC_THEME,

  seriesDefaults: {
    mode: "lines",
    line: { width: 2, shape: "linear" },
    connectDots: true,
  } as Partial<SeriesConfig>,
};

/**
 * Spectral analysis preset
 */
export const spectralAnalysisPreset = {
  config: {
    title: "Spectral Analysis",
    xAxis: {
      title: "Frequency (Hz)",
      type: "log",
      showgrid: true,
    },
    yAxis: {
      title: "Power (dB)",
      showgrid: true,
    },
    margin: { l: 80, r: 150, t: 80, b: 80 },
    legendPosition: { x: 1.02, y: 1 },
    font: {
      family: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
      size: 14,
      color: "#24292e",
    },
  } as PlotConfig,

  interactions: {
    enableZoom: true,
    enablePan: true,
    hovermode: "closest",
  } as InteractionConfig,

  theme: SCIENTIFIC_THEME,

  seriesDefaults: {
    mode: "lines",
    line: { width: 1.5 },
  } as Partial<SeriesConfig>,
};

/**
 * Correlation plot preset
 */
export const correlationPlotPreset = {
  config: {
    title: "Correlation Analysis",
    xAxis: { title: "Variable X", showgrid: true },
    yAxis: { title: "Variable Y", showgrid: true },
    showLegend: false,
    margin: { l: 80, r: 150, t: 80, b: 80 },
    font: {
      family: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
      size: 14,
      color: "#24292e",
    },
  } as PlotConfig,

  interactions: {
    enableZoom: true,
    enableSelect: true,
    hovermode: "closest",
  } as InteractionConfig,

  theme: SCIENTIFIC_THEME,

  seriesDefaults: {
    mode: "markers",
    marker: {
      size: 6,
      opacity: 0.6,
      colorFeature: "density", // Color by point density
      colorScale: "viridis",
      showColorBar: true,
    },
  } as Partial<SeriesConfig>,
};

/**
 * Multi-variable analysis preset
 */
export const multiVariablePreset = {
  config: {
    title: "Multi-Variable Analysis",
    xAxis: { title: "Primary Variable" },
    yAxis: { title: "Response Variable" },
    margin: { l: 80, r: 200, t: 80, b: 80 }, // Extra space for colorbar
    legendPosition: { x: 1.02, y: 1 },
    font: {
      family: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
      size: 14,
      color: "#24292e",
    },
  } as PlotConfig,

  interactions: {
    enableZoom: true,
    enablePan: true,
    hovermode: "closest",
  } as InteractionConfig,

  theme: SCIENTIFIC_THEME,

  seriesDefaults: {
    mode: "markers",
    marker: {
      size: 8,
      colorFeature: "z", // Color by Z value
      colorScale: "plasma",
      showColorBar: true,
      colorBarTitle: "Third Variable",
    },
  } as Partial<SeriesConfig>,
};

/**
 * Single line chart preset
 * Perfect for temperature data, stock prices, sensor readings, or any continuous measurement
 */
export const singleLinePreset = {
  config: {
    title: "Continuous Data Analysis",
    xAxis: {
      title: "Time/Sequence",
      showgrid: true,
      gridcolor: "rgba(128,128,128,0.2)",
    },
    yAxis: {
      title: "Measurement Value",
      showgrid: true,
      gridcolor: "rgba(128,128,128,0.2)",
    },
    margin: { l: 80, r: 150, t: 80, b: 80 },
    legendPosition: { x: 1.02, y: 1 },
    font: {
      family: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
      size: 14,
      color: "#24292e",
    },
  } as PlotConfig,

  interactions: {
    enableZoom: true,
    enablePan: true,
    hovermode: "closest",
    dragmode: "zoom",
  } as InteractionConfig,

  theme: SCIENTIFIC_THEME,

  seriesDefaults: {
    mode: "lines",
    line: {
      color: "#dc2626",
      width: 2,
      smoothing: 1.3,
    },
    marker: {
      size: 6,
      color: "#dc2626",
      symbol: "circle",
    },
  } as Partial<SeriesConfig>,
};

/**
 * Business metrics preset
 * Ideal for KPIs, performance metrics, sales data, or any time-based business analytics
 */
export const businessMetricsPreset = {
  config: {
    title: "Business Metrics Dashboard",
    xAxis: {
      title: "Time Period",
      showgrid: true,
      gridcolor: "rgba(128,128,128,0.2)",
    },
    yAxis: {
      title: "Metric Value",
      showgrid: true,
      gridcolor: "rgba(128,128,128,0.2)",
    },
    margin: { l: 80, r: 150, t: 80, b: 80 },
    legendPosition: { x: 1.02, y: 1 },
    font: {
      family: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
      size: 14,
      color: "#24292e",
    },
  } as PlotConfig,

  interactions: {
    enableZoom: true,
    enablePan: true,
    hovermode: "closest",
    dragmode: "zoom",
  } as InteractionConfig,

  theme: SCIENTIFIC_THEME,

  seriesDefaults: {
    mode: "lines+markers",
    line: {
      color: "#2563eb",
      width: 2,
    },
    marker: {
      size: 4,
      color: "#2563eb",
      symbol: "circle",
    },
  } as Partial<SeriesConfig>,
};

/**
 * Environmental data preset
 * Great for environmental monitoring, sensor networks, IoT data, or multi-parameter analysis
 */
export const environmentalDataPreset = {
  config: {
    title: "Environmental Data Analysis",
    xAxis: {
      title: "Primary Parameter",
      showgrid: true,
      gridcolor: "rgba(128,128,128,0.2)",
    },
    yAxis: {
      title: "Secondary Parameter",
      showgrid: true,
      gridcolor: "rgba(128,128,128,0.2)",
    },
    margin: { l: 80, r: 150, t: 80, b: 80 },
    legendPosition: { x: 1.02, y: 1 },
    font: {
      family: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
      size: 14,
      color: "#24292e",
    },
  } as PlotConfig,

  interactions: {
    enableZoom: true,
    enablePan: true,
    hovermode: "closest",
    dragmode: "zoom",
    enableSelect: true,
  } as InteractionConfig,

  theme: SCIENTIFIC_THEME,

  seriesDefaults: {
    mode: "markers",
    marker: {
      size: 6,
      color: "#059669",
      symbol: "circle",
      opacity: 0.7,
      line: {
        width: 1,
        color: "rgba(255,255,255,0.8)",
      },
    },
  } as Partial<SeriesConfig>,
};

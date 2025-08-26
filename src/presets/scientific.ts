// =============================================================================
// CHART PRESETS - SCIENTIFIC
// =============================================================================
// Predefined configurations for common scientific chart types

import type {
  SeriesConfig,
  PlotConfig,
  InteractionConfig,
} from "../types/PlotterTypes";
import { SCIENTIFIC_THEME } from "../config/themes";

/**
 * Scientific scatter plot preset with error bars
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
    margin: { l: 80, r: 60, t: 80, b: 80 },
    showLegend: true,
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
    margin: { l: 60, r: 40, t: 60, b: 80 },
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
    margin: { l: 70, r: 200, t: 70, b: 70 }, // Extra space for colorbar
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

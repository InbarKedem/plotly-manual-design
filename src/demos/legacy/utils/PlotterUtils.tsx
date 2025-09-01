// =============================================================================
// PLOTTER UTILS (LEGACY)
// =============================================================================
// Basic utilities for legacy demo compatibility

import type { SeriesConfig, DataPoint } from "../../../types/PlotterTypes";
import {
  generateTemperatureData,
  generateLinearData,
  generateSinusoidalData,
} from "../../../data/generators";

// Basic data generation functions
export const generateData = (
  name: string,
  options: Record<string, any> = {}
): SeriesConfig => ({
  name,
  data: generateLinearData(options.count || 100),
  type: "scatter",
  mode: "markers",
});

export const generateClimateData = (
  name: string,
  days: number = 365
): SeriesConfig => ({
  name,
  data: generateTemperatureData(days),
  type: "scatter",
  mode: "lines+markers",
});

export const generateFuelData = (
  name: string,
  options: Record<string, any> = {}
): SeriesConfig => ({
  name,
  data: generateLinearData(options.count || 50, 0.8, 10, 0.5),
  type: "scatter",
  mode: "lines",
});

export const generateScientificData = (
  name: string,
  options: Record<string, any> = {}
): SeriesConfig => ({
  name,
  data: generateSinusoidalData(options.count || 200),
  type: "scatter",
  mode: "lines",
});

export const generateLargeDataset = (
  name: string,
  count: number = 10000
): SeriesConfig => ({
  name,
  data: generateLinearData(count, 1, 0, 2),
  type: "scatter",
  mode: "markers",
});

export const createSeriesFromData = (
  name: string,
  data: DataPoint[]
): SeriesConfig => ({
  name,
  data,
  type: "scatter",
  mode: "lines+markers",
});

export const createMultiSeriesChart = (series: SeriesConfig[]) => series;

export const createFuelConsumptionChart = (data: DataPoint[]) =>
  createSeriesFromData("Fuel Consumption", data);

export const generateMultiVariantData = (
  names: string[],
  count: number = 100
) => names.map((name) => generateData(name, { count }));

// Basic presets
export const PRESET_THEMES = {
  light: {
    colors: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd"],
    backgroundColor: "#ffffff",
    gridColor: "#e6e6e6",
    textColor: "#000000",
  },
  dark: {
    colors: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd"],
    backgroundColor: "#2d3748",
    gridColor: "#4a5568",
    textColor: "#ffffff",
  },
};

export const PRESET_CONFIGS = {
  basic: {
    title: "Basic Chart",
    showLegend: true,
    height: 400,
    margins: { l: 60, r: 60, t: 60, b: 60 },
  },
  climate: {
    title: "Climate Data",
    showLegend: true,
    height: 500,
    xAxisLabel: "Time",
    yAxisLabel: "Temperature (°C)",
    margins: { l: 80, r: 80, t: 80, b: 80 },
  },
};

export const PRESET_INTERACTIONS = {
  basic: {
    hovermode: "x",
    dragmode: "zoom",
  },
  scientific: {
    hovermode: "x unified",
    dragmode: "pan",
    showSpikes: true,
  },
};

export const PRESET_PROGRESSIVE = {
  fast: {
    enabled: true,
    chunkSize: 500,
    interval: 10,
  },
  smooth: {
    enabled: true,
    chunkSize: 1000,
    interval: 50,
  },
};

// Utility functions
export const combineConfigs = (
  base: Record<string, any>,
  override: Record<string, any>
) => ({
  ...base,
  ...override,
});

export const getColorPalette = (type: string, count: number): string[] => {
  const palettes = {
    vibrant: [
      "#1f77b4",
      "#ff7f0e",
      "#2ca02c",
      "#d62728",
      "#9467bd",
      "#8c564b",
      "#e377c2",
      "#7f7f7f",
    ],
    pastel: [
      "#aec7e8",
      "#ffbb78",
      "#98df8a",
      "#ff9896",
      "#c5b0d5",
      "#c49c94",
      "#f7b6d3",
      "#c7c7c7",
    ],
    warm: ["#d62728", "#ff7f0e", "#e377c2", "#8c564b", "#bcbd22", "#17becf"],
  };

  const palette = palettes[type as keyof typeof palettes] || palettes.vibrant;
  return Array.from({ length: count }, (_, i) => palette[i % palette.length]);
};

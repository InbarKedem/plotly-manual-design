// =============================================================================
// UNIFIED PLOTTER - MODULE EXPORTS
// =============================================================================
// Central export file for the UnifiedPlotter component system
// Provides easy access to all types, utilities, components, and hooks

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export { default as UnifiedPlotter } from "./UnifiedPlotter";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
export type {
  DataPoint,
  LineOptions,
  MarkerOptions,
  ErrorBarOptions,
  SeriesConfig,
  AxisConfig,
  PlotConfig,
  InteractionConfig,
  ProgressConfig,
  ThemeConfig,
  UnifiedPlotterProps,
  DataStats,
} from "./types/PlotterTypes";

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================
export {
  calculateDataStats,
  formatBytes,
  formatLargeNumber,
  calculateStatistics,
  debounce,
  throttle,
  deepClone,
  linspace,
  isValidNumber,
  clamp,
  generateId,
  hexToRgb,
  rgbToHex,
} from "./utils/dataUtils";

export {
  MODERN_COLORSCALES,
  getColorScale,
  getColorScaleNames,
  isValidColorScale,
  createCustomColorScale,
  type ColorScale,
} from "./utils/colorscales";

export {
  createAllTraces,
  createTracesForSeries,
} from "./utils/traceGeneration";

// =============================================================================
// CUSTOM HOOKS
// =============================================================================
export {
  useProgressiveLoading,
  usePlotConfig,
  useInteractionConfig,
  usePlotEvents,
  useResponsiveDimensions,
} from "./hooks/usePlotterHooks";

// =============================================================================
// UI COMPONENTS
// =============================================================================
export { default as ProgressIndicator } from "./components/ProgressIndicator";
export { default as DebugPanel } from "./components/DebugPanel";
export { default as CompletionIndicator } from "./components/CompletionIndicator";

// =============================================================================
// CONFIGURATION & DEFAULTS
// =============================================================================
export {
  DEFAULT_PLOT_CONFIG,
  DEFAULT_INTERACTION_CONFIG,
  DEFAULT_PROGRESS_CONFIG,
  DEFAULT_THEME_CONFIG,
  PERFORMANCE_THRESHOLDS,
  SIZE_CONSTRAINTS,
  ANIMATION_DURATIONS,
} from "./config/defaults";

export {
  THEMES,
  LIGHT_THEME,
  DARK_THEME,
  SCIENTIFIC_THEME,
  BUSINESS_THEME,
  HIGH_CONTRAST_THEME,
  COLORBLIND_FRIENDLY_THEME,
  MINIMAL_THEME,
  OCEAN_THEME,
  WARM_THEME,
  getTheme,
  getThemeNames,
  type ThemeName,
} from "./config/themes";

// =============================================================================
// DATA GENERATION & PROCESSING
// =============================================================================
export {
  generateLinearData,
  generateSinusoidalData,
  generateTemperatureData,
  generateClimateData,
  generateFuelData,
  generateScientificData,
  generateStockData,
  generate3DData,
  generateTimeSeriesData,
  generateLargeDataset,
  generateMultiSeriesData,
} from "./data/generators";

// =============================================================================
// CHART PRESETS
// =============================================================================
export {
  scientificScatterPreset,
  timeSeriesPreset,
  spectralAnalysisPreset,
  correlationPlotPreset,
  multiVariablePreset,
} from "./presets/scientific";

// =============================================================================
// DEMO COMPONENTS
// =============================================================================
export { default as OrganizedScientificDemo } from "./demos/OrganizedScientificDemo";

// =============================================================================
// DEFAULT EXPORT (Main Component)
// =============================================================================
export { default } from "./UnifiedPlotter";

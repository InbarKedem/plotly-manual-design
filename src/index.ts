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
// DEFAULT EXPORT (Main Component)
// =============================================================================
export { default } from "./UnifiedPlotter";

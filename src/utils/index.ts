// =============================================================================
// UTILS BARREL EXPORT
// =============================================================================
// Centralized export for all utility functions

// Data utilities
export * from "./dataUtils";
export * from "./traceGeneration";
export * from "./colorscales";

// Plotter utilities (consolidated from legacy files) - exclude debounce to avoid conflict
export {
  generateCurveData,
  createSeriesConfig,
  validateSeriesData,
  calculateOptimalChunkSize,
} from "./plotterUtils";

// Performance utilities
export * from "./performance";

// Validation utilities
export * from "./validation";

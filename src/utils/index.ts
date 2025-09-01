// =============================================================================
// 📦 UTILS MODULE - MAIN EXPORTS
// =============================================================================
// Central export point for all utility functions used across the application

// Data utilities
export * from "./dataUtils";
export * from "./colorscales";
export * from "./validation";

// Legacy trace generation (for backward compatibility)
export { createAllTraces as legacyCreateAllTraces } from "./traceGeneration";

// Plotter utilities (consolidated from legacy files) - exclude debounce to avoid conflict
export {
  generateCurveData,
  createSeriesConfig,
  validateSeriesData,
  calculateOptimalChunkSize,
} from "./plotterUtils";

// Performance utilities
export * from "./performance";

// Modular utilities (new architecture) - specific exports to avoid conflicts
export { createAllTraces, validatePlotterInputs } from "./plotting";

// Validation utilities
export * from "./validation";

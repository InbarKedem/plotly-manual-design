// =============================================================================
// 📦 HOOKS MODULE - MAIN EXPORTS
// =============================================================================
// Central export point for all custom hooks used across the application

// Legacy hooks (for backward compatibility)
export {
  useProgressiveLoading,
  useResponsiveDimensions,
} from "./usePlotterHooks";

// Modular hooks (new architecture) - organized by concern
export * from "./plotting";
export * from "./performance";
export * from "./data";

// =============================================================================
// 📦 COMPONENTS MODULE - MAIN EXPORTS
// =============================================================================
// Central export point for all components used across the application

// UI Components
export { default as ProgressIndicator } from "./ProgressIndicator";
export { default as DebugPanel } from "./DebugPanel";
export { default as CompletionIndicator } from "./CompletionIndicator";
export { default as PlotterControls } from "./PlotterControls";
export { default as PlotterControlsNew } from "./PlotterControlsNew";

// Hover Components
export { default as StableHover } from "./StableHover";
export { default as CssStableHover } from "./CssStableHover";

// Plotter-specific components and utilities
export * from "./plotter";

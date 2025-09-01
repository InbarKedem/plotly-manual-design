// =============================================================================
// 📦 TYPES MODULE - MAIN EXPORTS
// =============================================================================
// Central export point for all type definitions used across the application.
// Provides clean, organized access to types without deep import paths.

// Core types and interfaces (legacy - for backward compatibility)
export * from "./PlotterTypes";

// Modular type system (new architecture) - namespaced to avoid conflicts
export * as Events from "./events";
export * as Performance from "./performance";
export * as Data from "./data";
export * as Styling from "./styling";
export * as Config from "./config";
export * as Component from "./component";

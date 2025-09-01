// =============================================================================
// 📦 CONFIG MODULE - MAIN EXPORTS
// =============================================================================
// Central export point for all configuration files used across the application

// Theme configurations
export * from "./themes";

// Legacy defaults (for backward compatibility)
export { DEFAULT_SERIES_CONFIG, DEFAULT_PROGRESS_CONFIG } from "./defaults";

// Modular configurations (new architecture) - specific exports to avoid conflicts
export * from "./plotting";

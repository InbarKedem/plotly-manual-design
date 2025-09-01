// =============================================================================
// ⚙️ PLOTTING CONFIGURATION - MODULAR DEFAULTS
// =============================================================================
// Extracted plotting configuration for larger application integration.
// Provides consistent, performance-optimized defaults.

import type {
  PlotConfig,
  InteractionConfig,
  ThemeConfig
} from "../../types/plotting/core";

// =============================================================================
// 📊 DEFAULT CONFIGURATIONS
// =============================================================================

/**
 * 📈 Default plot configuration
 */
export const DEFAULT_PLOT_CONFIG: PlotConfig = {
  width: "100%",
  height: 600,
  minHeight: 400,
  responsive: true,
  backgroundColor: "#ffffff",
  margin: {
    l: 80,
    r: 200, // Increased for legend protection
    t: 80,
    b: 80,
  },
};

/**
 * 🎮 Default interaction configuration
 */
export const DEFAULT_INTERACTION_CONFIG: InteractionConfig = {
  enableHover: true,
  enableZoom: true,
  enableSelection: false,
  enableCrosshair: true,
  hoverDistance: 30,
  debounceMs: 150,
};

/**
 * 🎨 Default theme configuration
 */
export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  darkMode: false,
  colorPalette: [
    "#3b82f6", // Blue
    "#ef4444", // Red
    "#10b981", // Green
    "#f59e0b", // Yellow
    "#8b5cf6", // Purple
    "#06b6d4", // Cyan
    "#f97316", // Orange
    "#ec4899", // Pink
  ],
  backgroundColor: "#ffffff",
  textColor: "#1f2937",
  gridColor: "#e5e7eb",
};

/**
 * 🎯 Legend positioning for optimal layout
 */
export const LEGEND_POSITION = {
  x: 1.08,
  y: 1,
  orientation: "v" as const,
  xanchor: "left" as const,
  yanchor: "top" as const,
};

/**
 * 📱 Responsive breakpoints
 */
export const RESPONSIVE_BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
} as const;

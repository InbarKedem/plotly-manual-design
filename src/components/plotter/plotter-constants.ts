// =============================================================================
// 🎯 UNIFIED PLOTTER - CONSTANTS & CONFIGURATION
// =============================================================================
// Extracted constants and configuration logic for cleaner main component

/**
 * Performance thresholds for optimization decisions
 */
export const PERFORMANCE_THRESHOLDS = {
  /** Point threshold for enabling virtualization */
  VIRTUALIZATION: 10000,
  /** Point threshold for progressive loading */
  PROGRESSIVE_LOADING: 5000,
  /** Debounce delays for interactions */
  HOVER_DEBOUNCE: 150,
  ZOOM_DEBOUNCE: 200,
} as const;

/**
 * Plot layout constants
 */
export const PLOT_LAYOUT = {
  /** Default margins */
  DEFAULT_MARGINS: { l: 80, r: 150, t: 80, b: 80 },
  /** Background colors */
  BACKGROUNDS: {
    PAPER: "#f9fafb", // Neutral, clean background (gray-50)
    PLOT: "#ffffff", // Clean white plot background
  },
  /** Legend positioning */
  LEGEND: {
    x: 1.02,
    y: 1,
    orientation: "v" as const,
    xanchor: "left" as const,
    yanchor: "top" as const,
  },
} as const;

/**
 * Plotly config options
 */
export const PLOTLY_CONFIG_OPTIONS = {
  /** Default export options */
  EXPORT: {
    format: "png" as const,
    filename: "unified_plot",
    height: 500,
    width: 700,
    scale: 1,
  },
  /** Toolbar settings */
  TOOLBAR: {
    displayModeBar: true,
    displaylogo: false,
    doubleClick: "reset+autosize" as const,
  },
} as const;

/**
 * UI positioning constants
 */
export const UI_POSITIONING = {
  /** Controls positioning */
  CONTROLS: {
    position: "absolute" as const,
    top: "15px",
    left: "15px",
    zIndex: 1003,
  },
  /** Container styling */
  CONTAINER: {
    position: "relative" as const,
    border: "3px solid transparent",
    borderRadius: "8px",
    transition: "all 0.3s ease-in-out",
  },
} as const;

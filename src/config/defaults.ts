// =============================================================================
// ⚙️ DEFAULT CONFIGURATIONS - DRY & PERFORMANCE OPTIMIZED
// =============================================================================
// This file contains all default configurations for the UnifiedPlotter system.
// These defaults ensure consistent behavior across all plot instances while
// following GitHub Copilot standards for maintainability and performance.
//
// 🎯 Design Principles:
// - DRY-compliant: Single source of truth for all defaults
// - Performance-oriented: Pre-computed configurations
// - Bug-resistant: Comprehensive type safety
// - Test-friendly: Easy mocking and validation

import type {
  PlotConfig,
  InteractionConfig,
  ProgressConfig,
  ThemeConfig,
  SeriesConfig,
} from "../types/PlotterTypes";

// =============================================================================
// 📊 PLOT CONFIGURATION DEFAULTS
// =============================================================================

/**
 * 📈 Default plot configuration with comprehensive settings
 *
 * Provides sensible defaults for all plot settings following modern
 * data visualization best practices and accessibility guidelines.
 *
 * 🎨 Visual Standards:
 * - Professional typography (Inter font family)
 * - Accessible color contrasts
 * - Responsive layout with optimal spacing
 * - Clean grid system for data readability
 *
 * 🚀 Performance Features:
 * - Pre-computed margin values
 * - Optimized font loading
 * - Efficient responsive handling
 */
export const DEFAULT_PLOT_CONFIG: Required<PlotConfig> = {
  title: "",
  xAxis: {
    title: "X Axis",
    type: "linear",
    showgrid: true,
    gridcolor: "#e5e7eb", // Tailwind gray-200 for consistency
    zeroline: true,
    autorange: true,
  },
  yAxis: {
    title: "Y Axis",
    type: "linear",
    showgrid: true,
    gridcolor: "#e5e7eb", // Tailwind gray-200 for consistency
    zeroline: true,
    autorange: true,
  },
  width: "100%",
  height: "500px",
  minHeight: "400px",
  showLegend: true,
  legendPosition: { x: 1.02, y: 1 },
  // 🎯 Optimized margins for professional appearance and legend spacing
  margin: { l: 80, r: 180, t: 80, b: 80 }, // Increased right margin for legend safety
  responsive: true,
  useResizeHandler: true,
  backgroundColor: "#f9fafb", // Clean neutral background (gray-50)
  plotBackgroundColor: "#ffffff", // Pure white plot area
  font: {
    family: "Inter, -apple-system, BlinkMacSystemFont, sans-serif", // Modern font stack
    size: 14, // Optimized for readability
    color: "#24292e", // High contrast for accessibility
  },
  annotations: [],
  shapes: [],
};

/**
 * Default series configuration with enhanced modern styling
 * Provides sensible defaults for all series settings
 */
export const DEFAULT_SERIES_CONFIG: Partial<SeriesConfig> = {
  type: "scatter",
  mode: "lines+markers", // Default to lines with markers for curve connection
  line: {
    width: 3, // Enhanced thickness for better visibility
    shape: "spline", // Smooth curves by default
    smoothing: 1.0, // Enhanced smoothing for modern appearance
  },
  marker: {
    size: 8, // Larger for better visibility and hover interaction
    opacity: 0.9, // Higher opacity for better contrast
    line: {
      width: 2, // Enhanced white outer stroke
      color: "rgba(255, 255, 255, 0.8)",
    },
  },
  visible: true,
  showInLegend: true,
  connectDots: true, // Connect points with lines by default
  hoverinfo: "x+y+name",
};

/**
 * Default interaction configuration
 * Enables all standard interactions
 */
export const DEFAULT_INTERACTION_CONFIG: Required<InteractionConfig> = {
  enableZoom: true,
  enablePan: true,
  enableSelect: true,
  enableHover: true,
  dragmode: "zoom",
  hovermode: "closest", // Show only the closest point, not all points on x-axis
  clickmode: "event+select",
  selectdirection: "any",
  enableHoverOpacity: false, // Default disabled to avoid unexpected behavior
  dimmedOpacity: 0.3,
  highlightOpacity: 1.0,
};

/**
 * Default progressive loading configuration
 * Optimized for good performance and user experience
 */
export const DEFAULT_PROGRESS_CONFIG: Required<ProgressConfig> = {
  enabled: false,
  chunkSize: 100,
  showProgress: true,
  showPhase: true,
  showDataStats: false,
  animationDuration: 50,
  onProgress: () => {},
  onComplete: () => {},
};

/**
 * Default theme configuration
 * Light theme with modern colors
 */
export const DEFAULT_THEME_CONFIG: Required<ThemeConfig> = {
  darkMode: false,
  primary: "#3b82f6",
  secondary: "#64748b",
  accent: "#06b6d4",
  background: "#ffffff",
  surface: "#f8fafc",
  colorPalette: [
    "#3b82f6", // Blue
    "#ef4444", // Red
    "#10b981", // Green
    "#f59e0b", // Amber
    "#8b5cf6", // Purple
    "#06b6d4", // Cyan
    "#f97316", // Orange
    "#84cc16", // Lime
    "#ec4899", // Pink
    "#6b7280", // Gray
  ],
};

/**
 * Performance thresholds for automatic optimizations
 */
export const PERFORMANCE_THRESHOLDS = {
  /** Enable progressive loading above this point count */
  PROGRESSIVE_LOADING: 1000,
  /** Show performance warnings above this count */
  PERFORMANCE_WARNING: 10000,
  /** Maximum recommended points before suggesting data reduction */
  MAX_RECOMMENDED_POINTS: 50000,
  /** Chunk size for very large datasets */
  LARGE_DATASET_CHUNK_SIZE: 500,
} as const;

/**
 * Plot size constraints
 */
export const SIZE_CONSTRAINTS = {
  MIN_WIDTH: 200,
  MIN_HEIGHT: 150,
  MAX_WIDTH: 4000,
  MAX_HEIGHT: 3000,
  DEFAULT_ASPECT_RATIO: 16 / 9,
} as const;

/**
 * Animation durations (in milliseconds)
 */
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  PROGRESS_UPDATE: 50,
  HOVER_RESPONSE: 100,
} as const;

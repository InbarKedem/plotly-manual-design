// =============================================================================
// DEFAULT CONFIGURATIONS
// =============================================================================
// This file contains all default configurations for the UnifiedPlotter system.
// These defaults ensure consistent behavior across all plot instances.

import type {
  PlotConfig,
  InteractionConfig,
  ProgressConfig,
  ThemeConfig,
  SeriesConfig,
} from "../types/PlotterTypes";

/**
 * Default plot configuration
 * Provides sensible defaults for all plot settings
 */
export const DEFAULT_PLOT_CONFIG: Required<PlotConfig> = {
  title: "",
  xAxis: {
    title: "X Axis",
    type: "linear",
    showgrid: true,
    gridcolor: "#e5e7eb",
    zeroline: true,
    autorange: true,
  },
  yAxis: {
    title: "Y Axis",
    type: "linear",
    showgrid: true,
    gridcolor: "#e5e7eb",
    zeroline: true,
    autorange: true,
  },
  width: "100%",
  height: "500px",
  minHeight: "400px",
  showLegend: true,
  legendPosition: { x: 1.02, y: 1 },
  margin: { l: 60, r: 180, t: 60, b: 60 },
  responsive: true,
  useResizeHandler: true,
  backgroundColor: "#ffffff",
  plotBackgroundColor: "#fafbfc",
  font: {
    family: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
    size: 12,
    color: "#24292e",
  },
  annotations: [],
  shapes: [],
};

/**
 * Default series configuration
 * Provides sensible defaults for all series settings
 */
export const DEFAULT_SERIES_CONFIG: Partial<SeriesConfig> = {
  type: "scatter",
  mode: "lines+markers", // Default to lines with markers for curve connection
  line: {
    width: 2,
    shape: "spline", // Smooth curves by default
    smoothing: 0.8,
  },
  marker: {
    size: 6,
    opacity: 0.7,
    line: {
      width: 1,
      color: "rgba(255,255,255,0.8)",
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

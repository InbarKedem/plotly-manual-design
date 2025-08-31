// =============================================================================
// 📊 UNIFIED PLOTTER TYPES & INTERFACES
// =============================================================================
// This file contains all TypeScript interfaces and types used across the
// UnifiedPlotter component system. These types define the data structures
// and configuration options for creating interactive, high-performance plots.
//
// 🎯 Design Principles:
// - DRY-compliant: Reusable type definitions across components
// - Bug-resistant: Comprehensive typing prevents runtime errors
// - Test-friendly: Clear interfaces enable 90%+ test coverage
// - Performance-oriented: Optimized for minimal re-renders

import type {
  Data,
  Layout,
  Config,
  PlotDatum,
  Annotations,
  Shape,
} from "plotly.js";

// =============================================================================
// 📡 PLOTLY EVENT TYPES - PROPERLY TYPED
// =============================================================================

/**
 * 🖱️ Plotly click event data with proper TypeScript typing
 * Used for handling user click interactions on plot elements
 */
export interface PlotlyClickEvent {
  /** Array of clicked plot points with metadata */
  points: PlotDatum[];
  /** Original mouse event for advanced handling */
  event: MouseEvent;
}

/**
 * 🔍 Plotly hover event data with comprehensive typing
 * Provides detailed information about hovered elements
 */
export interface PlotlyHoverEvent {
  /** Array of hovered plot points with metadata */
  points: PlotDatum[];
  /** Original mouse event for advanced handling */
  event: MouseEvent;
  /** X-values at hover position */
  xvals: Array<number | string>;
  /** Y-values at hover position */
  yvals: Array<number | string>;
}

/**
 * 🎯 Plotly selection event data for area/lasso selections
 * Enables advanced data filtering and analysis workflows
 */
export interface PlotlySelectEvent {
  /** Array of selected plot points */
  points: PlotDatum[];
  /** Selection range boundaries (optional) */
  range?: {
    x: number[];
    y: number[];
  };
}

/**
 * 🔍 Plotly zoom/pan event data for viewport changes
 * Tracks axis range modifications for state management
 */
export interface PlotlyZoomEvent {
  /** X-axis range start value */
  "xaxis.range[0]"?: number;
  /** X-axis range end value */
  "xaxis.range[1]"?: number;
  /** Y-axis range start value */
  "yaxis.range[0]"?: number;
  /** Y-axis range end value */
  "yaxis.range[1]"?: number;
}

// =============================================================================
// 📊 DATA STATISTICS & MONITORING
// =============================================================================

/**
 * 📈 Statistics for data loading/processing operations
 * Provides comprehensive metrics for performance monitoring and debugging
 *
 * 🚀 Performance Benefits:
 * - Enables memory usage tracking
 * - Supports processing time optimization
 * - Facilitates data range analysis
 */
export interface DataStats {
  /** Total number of data points across all series */
  totalPoints: number;
  /** Number of successfully processed points */
  processedPoints: number;
  /** Count of data series in the plot */
  seriesCount: number;
  /** Memory usage in bytes (optional for advanced monitoring) */
  memoryUsage?: number;
  /** Processing time in milliseconds (optional for performance tracking) */
  processingTime?: number;
  /** X-axis data range [min, max] for axis configuration */
  xRange: [number, number];
  /** Y-axis data range [min, max] for axis configuration */
  yRange: [number, number];
  /** Z-axis data range [min, max] (null if no z-values present) */
  zRange: [number, number] | null;
  /** Estimated memory usage in MB as formatted string */
  memoryUsageMB: string;
}

/**
 * Plotly trace configuration - properly typed
 */
export type PlotlyTrace = Data;

/**
 * Plotly layout configuration - properly typed
 */
export type PlotlyLayout = Partial<Layout>;

/**
 * Plotly configuration - properly typed
 */
export type PlotlyConfig = Partial<Config>;

/**
 * Performance configuration for large datasets
 */
export interface PerformanceConfig {
  /** Enable performance optimizations */
  enabled: boolean;
  /** Threshold for enabling virtualization */
  virtualizationThreshold: number;
  /** Maximum points to render at once */
  maxRenderPoints: number;
  /** Enable web workers for data processing */
  useWebWorkers: boolean;
  /** Debounce delay for interactions (ms) */
  debounceMs: number;
}

/**
 * Performance metrics tracking
 */
export interface PerformanceMetrics {
  /** Render time in milliseconds */
  renderTime?: number;
  /** Data processing time in milliseconds */
  dataProcessingTime?: number;
  /** Memory usage estimation in MB */
  memoryUsage?: number;
  /** Number of rendered points */
  renderedPoints?: number;
  /** Frame rate during interactions */
  frameRate?: number;
  /** Last updated timestamp */
  lastUpdated?: number;
}

/**
 * Accessibility configuration
 */
export interface AccessibilityConfig {
  /** Enable screen reader support */
  screenReader: boolean;
  /** High contrast mode */
  highContrast: boolean;
  /** Keyboard navigation */
  keyboardNavigation: boolean;
  /** Alternative text for plot */
  altText?: string;
  /** Detailed description for screen readers */
  description?: string;
}

/**
 * Validation configuration
 */
export interface ValidationConfig {
  /** Enable runtime validation */
  enabled: boolean;
  /** Validation level: 'strict' | 'normal' | 'permissive' */
  level: "strict" | "normal" | "permissive";
  /** Show validation warnings in console */
  showWarnings: boolean;
  /** Throw on validation errors */
  throwOnError: boolean;
}

// =============================================================================
// 🔷 CORE DATA STRUCTURES
// =============================================================================

/**
 * 📍 Represents a single data point in a series
 *
 * Supports 2D and 3D coordinates with optional error bars and hover text.
 * Designed for maximum flexibility while maintaining type safety.
 *
 * 🎯 Use Cases:
 * - Basic 2D plotting (x, y)
 * - 3D visualization and color mapping (x, y, z)
 * - Error bar analysis (error_x, error_y)
 * - Interactive hover details (text, hovertemplate)
 *
 * 🚀 Performance Notes:
 * - Minimal memory footprint
 * - Optional properties reduce overhead
 * - Extensible via index signature for custom data
 */
export interface DataPoint {
  /** X-coordinate value - REQUIRED */
  x: number;
  /** Y-coordinate value - REQUIRED */
  y: number;
  /** Optional Z-coordinate for 3D plots or color mapping */
  z?: number;
  /** Error bar value for X-axis (symmetric) */
  error_x?: number;
  /** Error bar value for Y-axis (symmetric) */
  error_y?: number;
  /** Text label for the data point (shown on hover) */
  text?: string;
  /** Custom hover template for this specific point */
  hovertemplate?: string;
  /** Additional custom properties for extensibility */
  [key: string]: string | number | boolean | undefined;
}

// =============================================================================
// 🎨 STYLING CONFIGURATION INTERFACES
// =============================================================================

/**
 * 📏 Configuration options for line appearance and behavior
 *
 * Provides comprehensive control over line styling with sensible defaults.
 * Optimized for both performance and visual appeal.
 *
 * 💡 Best Practices:
 * - Use solid lines for primary data
 * - Reserve dashed/dotted for secondary or comparison data
 * - Consider accessibility when choosing colors
 */
export interface LineOptions {
  /** Line width in pixels (default: 2) */
  width?: number;
  /** Line dash pattern for visual distinction */
  dash?: "solid" | "dash" | "dot" | "dashdot" | "longdash";
  /** Line interpolation shape for smooth curves */
  shape?: "linear" | "spline" | "hv" | "vh" | "hvh" | "vhv";
  /** Line color (CSS color string or hex) */
  color?: string;
  /** Line opacity (0-1) for layering effects */
  opacity?: number;
  /** Smoothing factor for spline interpolation */
  smoothing?: number;
}

/**
 * Configuration for curve-by-curve coloring
 */
export interface CurveColoringConfig {
  /** Enable curve-by-curve coloring */
  enabled?: boolean;
  /** Array of colors to use for curves (will cycle through them) */
  colorPalette?: string[];
  /** Custom color scale for gradient distribution */
  colorScale?: string | Array<[number, string]>;
  /** How to distribute colors: 'sequential' or 'gradient' */
  distribution?: "sequential" | "gradient";
  /** Show color bar for curve coloring */
  showColorBar?: boolean;
  /** Color bar title */
  colorBarTitle?: string;
  /** Values to map to colors (for color bar) */
  colorBarValues?: number[];
}

/**
 * Configuration for curve-by-curve line styles
 */
export interface CurveLineStyleConfig {
  /** Enable different line styles per curve */
  enabled?: boolean;
  /** Array of line styles to cycle through */
  stylePattern?: Array<"solid" | "dash" | "dot" | "dashdot" | "longdash">;
  /** Whether to combine with curve coloring */
  combineWithColors?: boolean;
}

/**
 * Configuration options for marker appearance and color mapping
 */
export interface MarkerOptions {
  /** Marker size(s) - can be single value or array for variable sizes */
  size?: number | number[];
  /** Marker symbol(s) - can be single value or array for variable symbols */
  symbol?: string | string[];
  /** Base marker color */
  color?: string;
  /** Data feature to use for color mapping */
  colorFeature?: string;
  /** Color scale name or custom scale array */
  colorScale?: string | Array<[number, string]>;
  /** Whether to show color bar legend */
  showColorBar?: boolean;
  /** Title for the color bar */
  colorBarTitle?: string;
  /** Minimum value for color mapping */
  colorMin?: number;
  /** Maximum value for color mapping */
  colorMax?: number;
  /** Marker opacity (0-1) */
  opacity?: number;
  /** Reference size for marker scaling */
  sizeref?: number;
  /** How marker size is calculated */
  sizemode?: "diameter" | "area";
  /** Marker border configuration */
  line?: {
    width?: number;
    color?: string;
  };
}

/**
 * Configuration for error bars on data points
 */
export interface ErrorBarOptions {
  /** X-axis error bar configuration */
  x?: {
    /** Type of error calculation */
    type?: "data" | "percent" | "sqrt";
    /** Whether to show X error bars */
    visible?: boolean;
    /** Error bar color */
    color?: string;
    /** Error bar line width */
    width?: number;
  };
  /** Y-axis error bar configuration */
  y?: {
    /** Type of error calculation */
    type?: "data" | "percent" | "sqrt";
    /** Whether to show Y error bars */
    visible?: boolean;
    /** Error bar color */
    color?: string;
    /** Error bar line width */
    width?: number;
  };
}

/**
 * Configuration for a data series in the plot
 * Each series represents a set of related data points with consistent styling
 */
export interface SeriesConfig {
  /** Display name for the series */
  name: string;
  /** Array of data points */
  data: DataPoint[];
  /** Plot type (scatter, bar, etc.) */
  type?: string;
  /** Display mode for the series */
  mode?: "lines" | "markers" | "lines+markers" | "text" | "none";
  /** Line styling options */
  line?: LineOptions;
  /** Marker styling options */
  marker?: MarkerOptions;
  /** Error bar configuration */
  errorBars?: ErrorBarOptions;
  /** Fill mode for area plots */
  fill?: string;
  /** Fill color for area plots */
  fillcolor?: string;
  /** Whether to connect data points with lines */
  connectDots?: boolean;
  /** Enable gradient coloring for line segments */
  gradientLines?: boolean;
  /** Whether the series is visible */
  visible?: boolean;
  /** Whether to show in legend */
  showInLegend?: boolean;
  /** Hover information to display */
  hoverinfo?: string;
  /** Custom hover template */
  hovertemplate?: string;
  /** Text position relative to markers */
  textposition?: string;
  /** Text font configuration */
  textfont?: {
    family?: string;
    size?: number;
    color?: string;
  };
  /** Overall series opacity */
  opacity?: number;
}

/**
 * Configuration for plot axes (X or Y)
 */
export interface AxisConfig {
  /** Axis title */
  title?: string;
  /** Axis scale type */
  type?: "linear" | "log" | "date" | "category";
  /** Whether to show grid lines */
  showgrid?: boolean;
  /** Grid line color */
  gridcolor?: string;
  /** Whether to show zero line */
  zeroline?: boolean;
  /** Axis range [min, max] */
  range?: [number, number];
  /** Whether to auto-range the axis */
  autorange?: boolean;
  /** Tick mode configuration */
  tickmode?: "linear" | "auto" | "array" | "sync";
  /** Starting tick value */
  tick0?: number;
  /** Tick interval */
  dtick?: number;
  /** Custom tick values */
  tickvals?: number[];
  /** Custom tick labels */
  ticktext?: string[];
}

/**
 * Overall plot configuration and layout options
 */
export interface PlotConfig {
  /** Plot title */
  title?: string;
  /** X-axis configuration */
  xAxis?: AxisConfig;
  /** Y-axis configuration */
  yAxis?: AxisConfig;
  /** Plot width */
  width?: string | number;
  /** Plot height */
  height?: string | number;
  /** Minimum plot height */
  minHeight?: string | number;
  /** Whether to show legend */
  showLegend?: boolean;
  /** Legend position */
  legendPosition?: { x?: number; y?: number };
  /** Plot margins */
  margin?: { l?: number; r?: number; t?: number; b?: number };
  /** Whether plot is responsive */
  responsive?: boolean;
  /** Whether to use resize handler */
  useResizeHandler?: boolean;
  /** Background color */
  backgroundColor?: string;
  /** Plot area background color */
  plotBackgroundColor?: string;
  /** Font configuration */
  font?: {
    family?: string;
    size?: number;
    color?: string;
  };
  /** Plot annotations */
  annotations?: Annotations[];
  /** Plot shapes */
  shapes?: Shape[];
}

/**
 * User interaction configuration
 */
export interface InteractionConfig {
  /** Enable zoom interaction */
  enableZoom?: boolean;
  /** Enable pan interaction */
  enablePan?: boolean;
  /** Enable selection interaction */
  enableSelect?: boolean;
  /** Enable hover interaction */
  enableHover?: boolean;
  /** Enable hover opacity highlighting - dims other curves when one is hovered */
  enableHoverOpacity?: boolean;
  /** Opacity for non-hovered curves when hover opacity is enabled */
  dimmedOpacity?: number;
  /** Opacity for hovered curve when hover opacity is enabled */
  highlightOpacity?: number;
  /** Default drag mode */
  dragmode?: "zoom" | "pan" | "select" | "lasso" | "orbit" | "turntable";
  /** Hover mode behavior */
  hovermode?: "x" | "y" | "closest" | "x unified" | "y unified";
  /** Click mode behavior */
  clickmode?: "event" | "select" | "event+select";
  /** Selection direction */
  selectdirection?: "h" | "v" | "d" | "any";
}

/**
 * Progressive loading configuration for large datasets
 */
export interface ProgressConfig {
  /** Whether progressive loading is enabled */
  enabled?: boolean;
  /** Number of points to load per chunk */
  chunkSize?: number;
  /** Whether to show progress indicator */
  showProgress?: boolean;
  /** Whether to show current loading phase */
  showPhase?: boolean;
  /** Whether to show data statistics */
  showDataStats?: boolean;
  /** Animation duration between chunks (ms) */
  animationDuration?: number;
  /** Progress callback function */
  onProgress?: (
    progress: number,
    phase: string,
    pointsLoaded: number,
    stats?: DataStats
  ) => void;
  /** Completion callback function */
  onComplete?: (totalPoints: number, stats?: DataStats) => void;
}

/**
 * Theme configuration for consistent styling
 */
export interface ThemeConfig {
  /** Whether dark mode is enabled */
  darkMode?: boolean;
  /** Primary theme color */
  primary?: string;
  /** Secondary theme color */
  secondary?: string;
  /** Accent theme color */
  accent?: string;
  /** Background theme color */
  background?: string;
  /** Surface theme color */
  surface?: string;
  /** Custom color palette array */
  colorPalette?: string[];
}

/**
 * Main props interface for the UnifiedPlotter component
 */
export interface UnifiedPlotterProps {
  /** Array of data series to plot */
  series: SeriesConfig[];
  /** Plot configuration options */
  config?: PlotConfig;
  /** User interaction settings */
  interactions?: InteractionConfig;
  /** Progressive loading settings */
  progressiveLoading?: ProgressConfig;
  /** Theme configuration */
  theme?: ThemeConfig;
  /** Performance optimization settings */
  performance?: PerformanceConfig;
  /** Accessibility settings */
  accessibility?: AccessibilityConfig;
  /** Validation configuration */
  validation?: ValidationConfig;
  /** Curve-by-curve coloring configuration */
  curveColoring?: CurveColoringConfig;
  /** Curve-by-curve line styling configuration */
  curveLineStyles?: CurveLineStyleConfig;
  /** Additional CSS class name */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Plot click event handler */
  onPlotClick?: (data: PlotlyClickEvent) => void;
  /** Plot hover event handler */
  onPlotHover?: (data: PlotlyHoverEvent) => void;
  /** Plot selection event handler */
  onPlotSelect?: (data: PlotlySelectEvent) => void;
  /** Plot zoom event handler */
  onPlotZoom?: (data: PlotlyZoomEvent) => void;
  /** Plot ready event handler */
  onPlotReady?: (plotElement: HTMLDivElement) => void;
  /** Error event handler */
  onError?: (error: Error) => void;
  /** Enable debug information display */
  debug?: boolean;
}

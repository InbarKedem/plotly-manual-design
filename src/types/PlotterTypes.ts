// =============================================================================
// UNIFIED PLOTTER TYPES & INTERFACES
// =============================================================================
// This file contains all TypeScript interfaces and types used across the
// UnifiedPlotter component system. These types define the data structures
// and configuration options for creating interactive plots.

/**
 * Represents a single data point in a series
 * Supports 2D and 3D coordinates with optional error bars and hover text
 */
export interface DataPoint {
  /** X-coordinate value */
  x: number;
  /** Y-coordinate value */
  y: number;
  /** Optional Z-coordinate for 3D plots or color mapping */
  z?: number;
  /** Error bar value for X-axis */
  error_x?: number;
  /** Error bar value for Y-axis */
  error_y?: number;
  /** Text label for the data point */
  text?: string;
  /** Custom hover template for this specific point */
  hovertemplate?: string;
  /** Additional custom properties */
  [key: string]: any;
}

/**
 * Configuration options for line appearance and behavior
 */
export interface LineOptions {
  /** Line width in pixels */
  width?: number;
  /** Line dash pattern */
  dash?: "solid" | "dash" | "dot" | "dashdot" | "longdash";
  /** Line interpolation shape */
  shape?: "linear" | "spline" | "hv" | "vh" | "hvh" | "vhv";
  /** Line color (CSS color string or hex) */
  color?: string;
  /** Line opacity (0-1) */
  opacity?: number;
  /** Smoothing factor for spline interpolation */
  smoothing?: number;
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
  textfont?: any;
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
  annotations?: any[];
  /** Plot shapes */
  shapes?: any[];
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
    stats?: any
  ) => void;
  /** Completion callback function */
  onComplete?: (totalPoints: number, stats?: any) => void;
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
  /** Additional CSS class name */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Plot click event handler */
  onPlotClick?: (data: any) => void;
  /** Plot hover event handler */
  onPlotHover?: (data: any) => void;
  /** Plot selection event handler */
  onPlotSelect?: (data: any) => void;
  /** Plot zoom event handler */
  onPlotZoom?: (data: any) => void;
  /** Enable debug information display */
  debug?: boolean;
}

/**
 * Data statistics interface for debugging and monitoring
 */
export interface DataStats {
  /** Total number of data points across all series */
  totalPoints: number;
  /** Number of data series */
  seriesCount: number;
  /** X-axis data range */
  xRange: [number, number];
  /** Y-axis data range */
  yRange: [number, number];
  /** Z-axis data range (if applicable) */
  zRange: [number, number] | null;
  /** Estimated memory usage */
  memoryUsage: string;
}

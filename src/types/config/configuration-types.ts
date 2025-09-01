// =============================================================================
// ⚙️ CONFIGURATION TYPES
// =============================================================================
// Plot configuration and behavioral settings

import type { Annotations, Shape } from "plotly.js";
import type {
  LineOptions,
  MarkerOptions,
  ErrorBarOptions,
} from "../styling/styling-types";
import type { DataPoint } from "../data/data-types";
import type { PerformanceMetrics } from "../performance/performance-types";

/**
 * Individual data series configuration
 */
export interface SeriesConfig {
  /** Unique identifier for the series */
  id?: string;
  /** Display name for the series (appears in legend) */
  name: string;
  /** Array of data points */
  data: DataPoint[];
  /** Chart type for this series */
  type?:
    | "scatter"
    | "line"
    | "bar"
    | "histogram"
    | "box"
    | "heatmap"
    | "surface"
    | "mesh3d";
  /** Line styling options */
  line?: LineOptions;
  /** Marker styling options */
  marker?: MarkerOptions;
  /** Error bar configuration */
  error_x?: ErrorBarOptions;
  error_y?: ErrorBarOptions;
  /** Series visibility */
  visible?: boolean | "legendonly";
  /** Whether series appears in legend */
  showlegend?: boolean;
  /** Series opacity */
  opacity?: number;
  /** Fill configuration */
  fill?:
    | "none"
    | "tozeroy"
    | "tozerox"
    | "tonexty"
    | "tonextx"
    | "toself"
    | "tonext";
  /** Fill color */
  fillcolor?: string;
  /** Hover information display */
  hoverinfo?: string;
  /** Custom hover template */
  hovertemplate?: string;
  /** Text positioning */
  textposition?: string;
  /** Y-axis reference */
  yaxis?: string;
  /** X-axis reference */
  xaxis?: string;
}

/**
 * Configuration for plot axes (X or Y)
 */
export interface AxisConfig {
  /** Axis title */
  title?: string;
  /** Axis type */
  type?: "linear" | "log" | "date" | "category" | "-";
  /** Whether to show grid lines */
  showgrid?: boolean;
  /** Grid line color */
  gridcolor?: string;
  /** Grid line width */
  gridwidth?: number;
  /** Whether to show zero line */
  zeroline?: boolean;
  /** Zero line color */
  zerolinecolor?: string;
  /** Zero line width */
  zerolinewidth?: number;
  /** Tick configuration */
  showticklabels?: boolean;
  tickangle?: number;
  tickcolor?: string;
  tickfont?: { family?: string; size?: number; color?: string };
  /** Axis range */
  range?: [number, number];
  /** Auto-range behavior */
  autorange?: boolean | "reversed";
  /** Axis positioning */
  side?: "top" | "bottom" | "left" | "right";
  /** Axis line visibility */
  showline?: boolean;
  linecolor?: string;
  linewidth?: number;
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
  /** Enable zoom functionality */
  enableZoom?: boolean;
  /** Enable pan functionality */
  enablePan?: boolean;
  /** Enable selection functionality */
  enableSelect?: boolean;
  /** Enable hover effects */
  enableHover?: boolean;
  /** Enable hover opacity effects */
  enableHoverOpacity?: boolean;
  /** Opacity for dimmed traces during hover */
  dimmedOpacity?: number;
  /** Opacity for highlighted traces during hover */
  highlightOpacity?: number;
  /** Default drag mode */
  dragmode?: "zoom" | "pan" | "select" | "lasso" | "orbit" | "turntable";
  /** Hover mode configuration */
  hovermode?: "closest" | "x" | "y" | "x unified" | "y unified" | false;
  /** Click mode configuration */
  clickmode?: "event" | "select" | "event+select" | "none";
  /** Selection direction */
  selectdirection?: "any" | "horizontal" | "vertical" | "diagonal";
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
    stats?: PerformanceMetrics
  ) => void;
  /** Completion callback function */
  onComplete?: (totalPoints: number, stats?: PerformanceMetrics) => void;
}

/**
 * Theme configuration for consistent visual styling
 */
export interface ThemeConfig {
  /** Enable dark mode */
  darkMode?: boolean;
  /** Color palette for data series */
  colorPalette?: string[];
  /** Background color */
  backgroundColor?: string;
  /** Text color */
  textColor?: string;
  /** Grid line color */
  gridColor?: string;
  /** Accent color for highlights */
  accentColor?: string;
  /** Font family */
  fontFamily?: string;
  /** Font size scale factor */
  fontScale?: number;
}

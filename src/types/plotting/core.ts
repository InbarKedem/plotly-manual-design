// =============================================================================
// 📊 CORE PLOTTING TYPES - ENTERPRISE-GRADE TYPE DEFINITIONS
// =============================================================================
// Core data structures and interfaces for the plotting system.
// Designed for maximum reusability across larger applications.

import type { PlotDatum } from "plotly.js";

// =============================================================================
// 📡 FUNDAMENTAL DATA STRUCTURES
// =============================================================================

/**
 * 📍 Individual data point structure
 * Core building block for all visualization data
 */
export interface DataPoint {
  /** X-coordinate value */
  x: number;
  /** Y-coordinate value */
  y: number;
  /** Optional Z-coordinate for 3D visualizations */
  z?: number;
  /** Optional timestamp for time-series data */
  timestamp?: number;
  /** Optional metadata for advanced features */
  metadata?: Record<string, any>;
}

/**
 * 📊 Data series configuration
 * Defines a complete data series with styling and metadata
 */
export interface SeriesData {
  /** Array of data points */
  data: DataPoint[];
  /** Display name for the series */
  name: string;
  /** Primary color for the series */
  color?: string;
  /** Optional series-specific styling */
  style?: SeriesStyle;
  /** Optional metadata for the series */
  metadata?: Record<string, any>;
}

/**
 * 🎨 Series styling configuration
 * Comprehensive styling options for individual series
 */
export interface SeriesStyle {
  /** Line width in pixels */
  lineWidth?: number;
  /** Line style pattern */
  lineStyle?: "solid" | "dashed" | "dotted" | "dashdot";
  /** Marker size */
  markerSize?: number;
  /** Marker symbol */
  markerSymbol?: string;
  /** Fill area under curve */
  fill?: boolean;
  /** Opacity value (0-1) */
  opacity?: number;
}

// =============================================================================
// 📡 PLOTLY EVENT INTERFACES
// =============================================================================

/**
 * 🖱️ Plotly click event data with proper TypeScript typing
 */
export interface PlotlyClickEvent {
  points: PlotDatum[];
  event: MouseEvent;
}

/**
 * 🔍 Plotly hover event data with comprehensive typing
 */
export interface PlotlyHoverEvent {
  points: PlotDatum[];
  event: MouseEvent;
  xvals: Array<number | string>;
  yvals: Array<number | string>;
}

/**
 * 🎯 Plotly selection event data for area selections
 */
export interface PlotlySelectEvent {
  points: PlotDatum[];
  range?: {
    x: number[];
    y: number[];
  };
}

/**
 * 🔍 Plotly zoom/pan event data for viewport changes
 */
export interface PlotlyZoomEvent {
  "xaxis.range[0]"?: number;
  "xaxis.range[1]"?: number;
  "yaxis.range[0]"?: number;
  "yaxis.range[1]"?: number;
}

// =============================================================================
// 📊 PERFORMANCE & MONITORING TYPES
// =============================================================================

/**
 * 📈 Performance metrics for monitoring
 */
export interface PerformanceMetrics {
  renderTime: number;
  dataProcessingTime: number;
  memoryUsage: number;
  eventCount: number;
  lastUpdate: number;
}

/**
 * 📊 Data statistics for analysis
 */
export interface DataStats {
  totalPoints: number;
  processedPoints: number;
  seriesCount: number;
  memoryEstimate: number;
  processingTime: number;
}

// =============================================================================
// 🎛️ CONFIGURATION INTERFACES
// =============================================================================

/**
 * 🎯 Core plotter configuration
 */
export interface PlotConfig {
  width?: string | number;
  height?: string | number;
  minHeight?: string | number;
  responsive?: boolean;
  backgroundColor?: string;
  margin?: {
    l?: number;
    r?: number;
    t?: number;
    b?: number;
  };
}

/**
 * 🎮 Interaction configuration
 */
export interface InteractionConfig {
  enableHover?: boolean;
  enableZoom?: boolean;
  enableSelection?: boolean;
  enableCrosshair?: boolean;
  hoverDistance?: number;
  debounceMs?: number;
}

/**
 * 🎨 Theme configuration
 */
export interface ThemeConfig {
  darkMode?: boolean;
  colorPalette?: string[];
  backgroundColor?: string;
  textColor?: string;
  gridColor?: string;
}

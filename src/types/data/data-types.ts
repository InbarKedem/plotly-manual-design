// =============================================================================
// 📊 DATA TYPES
// =============================================================================
// Core data structures and statistics for plotting

/**
 * Statistical information about the dataset
 * Used for performance optimizations and data insights
 */
export interface DataStats {
  /** Total number of data points across all series */
  totalPoints: number;
  /** Number of data series */
  seriesCount: number;
  /** Estimated memory usage in MB */
  memoryUsage: number;
  /** X-axis data range */
  xRange: [number, number];
  /** Y-axis data range */
  yRange: [number, number];
  /** Z-axis data range (for 3D plots) */
  zRange?: [number, number];
  /** Timestamp of when stats were calculated */
  calculatedAt: number;
}

/**
 * 📈 Individual data point structure with enhanced metadata support
 * Supports 2D, 3D, and complex multi-dimensional datasets
 */
export interface DataPoint {
  /** X-coordinate value (required) */
  x: number | string | Date;
  /** Y-coordinate value (required) */
  y: number;
  /** Z-coordinate for 3D plots (optional) */
  z?: number;
  /** Additional custom data fields */
  customdata?: any;
  /** Text labels for data points */
  text?: string | string[];
  /** Hover text override */
  hovertext?: string | string[];
  /** Hover information template */
  hovertemplate?: string;
  /** Point-specific error bars */
  error_x?: number | { array: number[]; type: string };
  error_y?: number | { array: number[]; type: string };
  /** Point-specific marker styling */
  marker?: {
    size?: number;
    color?: string;
    symbol?: string;
    opacity?: number;
    line?: {
      color?: string;
      width?: number;
    };
  };
  /** Metadata for analysis */
  metadata?: Record<string, any>;
}

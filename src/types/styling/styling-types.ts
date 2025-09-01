// =============================================================================
// 🎨 STYLING TYPES
// =============================================================================
// Visual styling and appearance configuration types

/**
 * Line styling configuration for plot traces
 */
export interface LineOptions {
  /** Line color (CSS color, hex, rgba, etc.) */
  color?: string;
  /** Line width in pixels */
  width?: number;
  /** Line style pattern */
  dash?: "solid" | "dot" | "dash" | "longdash" | "dashdot" | "longdashdot";
  /** Line smoothing algorithm */
  smoothing?: number;
  /** Line shape interpolation */
  shape?: "linear" | "spline" | "hv" | "vh" | "hvh" | "vhv";
}

/**
 * Advanced curve-by-curve coloring configuration
 */
export interface CurveColoringConfig {
  /** Enable automatic coloring */
  enabled: boolean;
  /** Color palette for automatic assignment */
  palette?: string[];
  /** Color mapping strategy */
  strategy?: "sequential" | "categorical" | "gradient" | "custom";
  /** Custom color function */
  colorFunction?: (index: number, seriesName: string) => string;
  /** Opacity for all curves */
  opacity?: number;
}

/**
 * Curve-by-curve line styling configuration
 */
export interface CurveLineStyleConfig {
  /** Enable automatic line styling */
  enabled: boolean;
  /** Available line styles for cycling */
  styles?: LineOptions[];
  /** Style assignment strategy */
  strategy?: "sequential" | "random" | "custom";
  /** Custom style function */
  styleFunction?: (index: number, seriesName: string) => LineOptions;
}

/**
 * Marker (data point) styling configuration
 */
export interface MarkerOptions {
  /** Marker size (pixels or array of sizes) */
  size?: number | number[];
  /** Marker color (single color or array) */
  color?: string | string[] | number[];
  /** Marker symbol type */
  symbol?:
    | "circle"
    | "square"
    | "diamond"
    | "cross"
    | "x"
    | "triangle-up"
    | "triangle-down"
    | "triangle-left"
    | "triangle-right"
    | "pentagon"
    | "hexagon"
    | "star"
    | "hourglass"
    | "bowtie"
    | string
    | string[];
  /** Marker opacity */
  opacity?: number | number[];
  /** Marker border configuration */
  line?: {
    /** Border color */
    color?: string | string[];
    /** Border width */
    width?: number | number[];
    /** Border opacity */
    opacity?: number | number[];
  };
  /** Color scale for marker coloring */
  colorscale?:
    | "Viridis"
    | "Cividis"
    | "Blues"
    | "Greens"
    | "Greys"
    | "Oranges"
    | "Purples"
    | "Reds"
    | "YlOrRd"
    | "Hot"
    | "Jet"
    | "Rainbow"
    | Array<[number, string]>;
  /** Show color scale bar */
  showscale?: boolean;
  /** Color axis reference */
  coloraxis?: string;
  /** Minimum color value */
  cmin?: number;
  /** Maximum color value */
  cmax?: number;
}

/**
 * Error bar configuration for uncertainty visualization
 */
export interface ErrorBarOptions {
  /** Error bar visibility */
  visible?: boolean;
  /** Error bar type */
  type?: "percent" | "constant" | "sqrt" | "data";
  /** Error values (for constant/data types) */
  array?: number[];
  /** Error bar width */
  thickness?: number;
  /** Error bar color */
  color?: string;
  /** Error bar cap width */
  width?: number;
  /** Error bar opacity */
  opacity?: number;
}

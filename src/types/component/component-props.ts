// =============================================================================
// 🎯 MAIN COMPONENT PROPS
// =============================================================================
// Main props interface for the UnifiedPlotter component

import type {
  PlotlyClickEvent,
  PlotlyHoverEvent,
  PlotlySelectEvent,
  PlotlyZoomEvent,
} from "../events";

import type {
  SeriesConfig,
  PlotConfig,
  InteractionConfig,
  ProgressConfig,
  ThemeConfig,
} from "../config";

import type { CurveColoringConfig, CurveLineStyleConfig } from "../styling";

import type {
  PerformanceConfig,
  AccessibilityConfig,
  ValidationConfig,
} from "../performance";

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

// =============================================================================
// 📡 PLOTTER EVENT TYPES
// =============================================================================
// Event-related type definitions for Plotly interactions

import type { PlotDatum } from "plotly.js";

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
 * 📋 Plotly selection event data for multi-point selections
 * Enables advanced data analysis features
 */
export interface PlotlySelectEvent {
  /** Array of selected plot points */
  points: PlotDatum[];
  /** Selection range information */
  range?: {
    x: [number, number];
    y: [number, number];
  };
}

/**
 * 🔍 Plotly zoom event data for viewport changes
 * Includes axis range information for zoom operations
 */
export interface PlotlyZoomEvent {
  /** Updated X-axis range after zoom */
  "xaxis.range[0]": number;
  "xaxis.range[1]": number;
  /** Updated Y-axis range after zoom */
  "yaxis.range[0]": number;
  "yaxis.range[1]": number;
  /** Original relayout event data */
  relayoutData?: Record<string, any>;
}

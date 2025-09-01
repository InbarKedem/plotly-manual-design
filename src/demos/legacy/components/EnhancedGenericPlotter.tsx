// =============================================================================
// ENHANCED GENERIC PLOTTER (LEGACY)
// =============================================================================
// Compatibility wrapper around UnifiedPlotter for legacy demos

import React from "react";
import UnifiedPlotter from "../../../UnifiedPlotter";
import type { SeriesConfig } from "../../../types/PlotterTypes";

// Legacy interface compatibility
export interface PlotConfig {
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  showLegend?: boolean;
  width?: number;
  height?: number;
  margins?: {
    l?: number;
    r?: number;
    t?: number;
    b?: number;
  };
}

export interface InteractionConfig {
  hovermode?: string;
  dragmode?: string;
  showSpikes?: boolean;
  crossfilter?: boolean;
}

export interface ProgressConfig {
  enabled?: boolean;
  chunkSize?: number;
  interval?: number;
}

export interface ThemeConfig {
  colors?: string[];
  backgroundColor?: string;
  gridColor?: string;
  textColor?: string;
}

export interface EnhancedGenericPlotterProps {
  data: SeriesConfig[];
  config?: PlotConfig;
  interactions?: InteractionConfig;
  progressiveLoading?: ProgressConfig;
  theme?: ThemeConfig;
}

// Legacy wrapper component
const EnhancedGenericPlotter: React.FC<EnhancedGenericPlotterProps> = ({
  data,
  config,
  interactions,
  progressiveLoading,
  theme,
}) => {
  // Convert legacy props to UnifiedPlotter format
  const unifiedProps = {
    series: data,
    title: config?.title,
    xAxisLabel: config?.xAxisLabel,
    yAxisLabel: config?.yAxisLabel,
    showLegend: config?.showLegend !== false,
    width: config?.width,
    height: config?.height || 400,
    margins: config?.margins,
    hoverMode: interactions?.hovermode as
      | "closest"
      | "x"
      | "y"
      | "x unified"
      | "y unified"
      | false,
    dragMode: interactions?.dragmode as
      | "zoom"
      | "pan"
      | "select"
      | "lasso"
      | "orbit"
      | "turntable",
    progressiveLoading: progressiveLoading?.enabled
      ? {
          enabled: true,
          chunkSize: progressiveLoading.chunkSize || 1000,
          interval: progressiveLoading.interval || 50,
        }
      : undefined,
    colors: theme?.colors,
  };

  return <UnifiedPlotter {...unifiedProps} />;
};

export default EnhancedGenericPlotter;

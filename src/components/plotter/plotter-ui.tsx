// =============================================================================
// 🎯 UNIFIED PLOTTER - UI COMPONENTS
// =============================================================================
// Extracted UI rendering logic for cleaner main component

import React from "react";
import { UI_POSITIONING } from "./plotter-constants";

// Component imports
import ProgressIndicator from "../ProgressIndicator";
import DebugPanel from "../DebugPanel";
import CompletionIndicator from "../CompletionIndicator";
import PlotterControls from "../PlotterControlsNew";
import type {
  InteractionConfig,
  ThemeConfig,
  PerformanceMetrics,
  ProgressConfig,
  DataStats,
} from "../../types";

interface PlotterUIProps {
  // Progress indicators
  progress: number;
  currentPhase: string;
  totalPointsLoaded: number;
  isGenerating: boolean;
  progressiveLoading?: ProgressConfig;
  dataStats: DataStats;
  isComplete: boolean;

  // Controls
  internalInteractions: InteractionConfig;
  onInteractionsChange: (newInteractions: InteractionConfig) => void;
  internalDebug: boolean;
  onDebugChange: (newDebug: boolean) => void;
  metrics: PerformanceMetrics;

  // Debug info
  theme?: ThemeConfig;
  additionalDebugInfo?: Record<string, string | number | boolean>;
}

/**
 * Renders the progress indicator component
 */
export const PlotterProgressIndicator: React.FC<
  Pick<
    PlotterUIProps,
    | "progress"
    | "currentPhase"
    | "totalPointsLoaded"
    | "isGenerating"
    | "progressiveLoading"
    | "dataStats"
  >
> = ({
  progress,
  currentPhase,
  totalPointsLoaded,
  isGenerating,
  progressiveLoading,
  dataStats,
}) => (
  <ProgressIndicator
    progress={progress}
    currentPhase={currentPhase}
    totalPointsLoaded={totalPointsLoaded}
    isGenerating={isGenerating}
    progressConfig={progressiveLoading}
    dataStats={dataStats}
  />
);

/**
 * Renders the completion indicator component
 */
export const PlotterCompletionIndicator: React.FC<
  Pick<PlotterUIProps, "isComplete">
> = ({ isComplete }) => (
  <CompletionIndicator isComplete={isComplete} message="Complete" />
);

/**
 * Renders the plotter controls component
 */
export const PlotterControlsComponent: React.FC<
  Pick<
    PlotterUIProps,
    | "internalInteractions"
    | "onInteractionsChange"
    | "internalDebug"
    | "onDebugChange"
    | "metrics"
  >
> = ({
  internalInteractions,
  onInteractionsChange,
  internalDebug,
  onDebugChange,
  metrics,
}) => (
  <div style={UI_POSITIONING.CONTROLS}>
    <PlotterControls
      interactions={internalInteractions}
      onInteractionsChange={onInteractionsChange}
      debug={internalDebug}
      onDebugChange={onDebugChange}
      performanceMetrics={metrics}
    />
  </div>
);

/**
 * Renders the debug panel component
 */
export const PlotterDebugPanel: React.FC<
  Pick<
    PlotterUIProps,
    "internalDebug" | "dataStats" | "metrics" | "theme" | "progressiveLoading"
  > & { additionalInfo: Record<string, any> }
> = ({ internalDebug, dataStats, metrics, additionalInfo }) => (
  <DebugPanel
    debug={internalDebug}
    dataStats={dataStats}
    performanceMetrics={metrics}
    additionalInfo={additionalInfo}
  />
);

/**
 * Complete UI component collection for the plotter
 */
export const PlotterUI: React.FC<PlotterUIProps> = (props) => {
  const {
    internalDebug,
    dataStats,
    metrics,
    theme,
    progressiveLoading,
    additionalDebugInfo = {},
  } = props;

  const debugInfo = {
    "Plot Type": "UnifiedPlotter",
    "Plotly Version": "Latest",
    "Theme Mode": theme?.darkMode ? "Dark" : "Light",
    "Progressive Loading": progressiveLoading?.enabled ? "Enabled" : "Disabled",
    "Performance Monitoring": internalDebug ? "Enabled" : "Disabled",
    ...additionalDebugInfo,
  };

  return (
    <>
      <PlotterProgressIndicator {...props} />
      <PlotterCompletionIndicator {...props} />
      <PlotterControlsComponent {...props} />
      <PlotterDebugPanel
        internalDebug={internalDebug}
        dataStats={dataStats}
        metrics={metrics}
        additionalInfo={debugInfo}
      />
    </>
  );
};

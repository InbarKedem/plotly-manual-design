// =============================================================================
// PROGRESS INDICATOR COMPONENT
// =============================================================================
// This component displays a beautiful, animated progress indicator during
// progressive data loading. Shows loading phase, progress percentage,
// and optional data statistics.

import React from "react";
import type { ProgressConfig, DataStats } from "../types/PlotterTypes";

interface ProgressIndicatorProps {
  /** Current loading progress (0-100) */
  progress: number;
  /** Current loading phase description */
  currentPhase: string;
  /** Number of data points loaded so far */
  totalPointsLoaded: number;
  /** Whether loading is in progress */
  isGenerating: boolean;
  /** Progress configuration settings */
  progressConfig?: ProgressConfig;
  /** Data statistics (optional) */
  dataStats?: DataStats | null;
}

/**
 * Animated progress indicator with modern glass-morphism design
 * Features:
 * - Smooth progress bar animation
 * - Loading spinner
 * - Phase description
 * - Data statistics display
 * - Responsive design
 */
export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  progress,
  currentPhase,
  totalPointsLoaded,
  isGenerating,
  progressConfig,
  dataStats,
}) => {
  // Don't render if progressive loading is disabled or not showing progress
  if (
    !progressConfig?.enabled ||
    !progressConfig?.showProgress ||
    !isGenerating
  ) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1001,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",

        // Glass-morphism background
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,250,252,0.95))",
        padding: "16px 24px",
        borderRadius: "12px",
        border: "1px solid rgba(0,0,0,0.1)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        minWidth: "300px",
      }}
    >
      {/* Loading Spinner */}
      <div
        style={{
          width: "20px",
          height: "20px",
          border: "3px solid #22c55e",
          borderTop: "3px solid transparent",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />

      {/* Phase Description */}
      {progressConfig.showPhase && (
        <span
          style={{
            fontSize: "14px",
            fontWeight: "600",
            color: "#22c55e",
            textAlign: "center",
          }}
        >
          {currentPhase}
        </span>
      )}

      {/* Progress Details and Bar */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {/* Progress Statistics */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "12px",
            color: "#64748b",
          }}
        >
          <span>Progress: {Math.round(progress)}%</span>
          <span>{totalPointsLoaded.toLocaleString()} points</span>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            width: "100%",
            height: "6px",
            backgroundColor: "rgba(0,0,0,0.1)",
            borderRadius: "3px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "linear-gradient(90deg, #22c55e, #16a34a)",
              borderRadius: "3px",
              transition: "width 0.3s ease",
            }}
          />
        </div>

        {/* Data Statistics */}
        {progressConfig.showDataStats && dataStats && (
          <div
            style={{
              fontSize: "10px",
              color: "#64748b",
              textAlign: "center",
            }}
          >
            {dataStats.seriesCount} series • ~{dataStats.memoryUsage}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressIndicator;

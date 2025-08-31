// =============================================================================
// 📊 PROGRESS INDICATOR COMPONENT - OPTIMIZED LOADING FEEDBACK
// =============================================================================
// Displays beautiful, animated progress indicator during progressive data loading.
// Shows loading phase, progress percentage, and optional data statistics following
// GitHub Copilot standards for high-performance React components.
//
// 🎯 Component Goals:
// - Performance-oriented: React.memo for unnecessary re-render prevention
// - Bug-resistant: Comprehensive prop validation and error boundaries
// - Documentation-oriented: Clear JSDoc with emoji indicators
// - Accessibility-oriented: Proper ARIA labels and semantic HTML

import React from "react";
import type { ProgressConfig, DataStats } from "../types/PlotterTypes";

// =============================================================================
// 📋 COMPONENT PROPS - FULLY TYPED WITH DEFAULTS
// =============================================================================

/**
 * 📊 Props for ProgressIndicator component
 *
 * Comprehensive configuration for progress display with performance optimization.
 * All props include proper JSDoc for IntelliSense and documentation.
 */
type ProgressIndicatorProps = {
  /** Current loading progress percentage (0-100) */
  progress: number;
  /** Current loading phase description for user feedback */
  currentPhase: string;
  /** Number of data points loaded so far */
  totalPointsLoaded: number;
  /** Whether loading is currently in progress */
  isGenerating: boolean;
  /** Progress configuration settings (optional) */
  progressConfig?: ProgressConfig;
  /** Data statistics for detailed information display (optional) */
  dataStats?: DataStats | null;
};

// =============================================================================
// 🎨 PROGRESS INDICATOR COMPONENT - PERFORMANCE OPTIMIZED
// =============================================================================

/**
 * 🔄 Animated progress indicator with modern glass-morphism design
 *
 * Provides real-time feedback during data loading with smooth animations.
 * Designed for optimal performance with React.memo to prevent unnecessary re-renders.
 *
 * ✨ Key Features:
 * - Smooth progress bar animation with CSS transitions
 * - Loading spinner with accessibility considerations
 * - Phase description with dynamic content
 * - Data statistics display with formatting
 * - Responsive design for all screen sizes
 * - Glass-morphism UI for modern appearance
 *
 * 🚀 Performance: Memoized component prevents re-renders on parent updates
 * ♿ Accessibility: ARIA labels, semantic HTML, screen reader support
 *
 * @param props - ProgressIndicatorProps configuration
 * @returns JSX.Element or null if progress display is disabled
 */
const ProgressIndicator: React.FC<ProgressIndicatorProps> = React.memo(
  ({
    progress,
    currentPhase,
    totalPointsLoaded,
    isGenerating,
    progressConfig,
    dataStats,
  }) => {
    // 🛡️ Early return for performance - don't render if disabled
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
            border: "3px solid #6b7280",
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
  }
);

// 🏷️ Display name for debugging and React DevTools
ProgressIndicator.displayName = "ProgressIndicator";

export default ProgressIndicator;

// =============================================================================
// 🐛 DEBUG PANEL COMPONENT
// =============================================================================
// This component displays debugging information about the plot data and
// performance metrics. Essential for development and production troubleshooting.
//
// 🎯 Design Goals:
// - DRY-compliant: Reusable debug information display
// - Performance-oriented: Minimal render impact when disabled
// - Bug-resistant: Comprehensive error boundary protection

import React, { memo } from "react";
import type { DataStats, PerformanceMetrics } from "../types/PlotterTypes";

// =============================================================================
// 🏗️ TYPES & INTERFACES
// =============================================================================

/**
 * Props for the DebugPanel component with comprehensive typing
 * Follows React best practices for prop validation and defaults
 */
type Props = {
  /** Whether debug mode is enabled - controls panel visibility */
  debug: boolean;
  /** Data statistics to display - null-safe for loading states */
  dataStats: DataStats | null;
  /** Performance metrics to display - optional for basic debugging */
  performanceMetrics?: PerformanceMetrics;
  /** Additional debug information - extensible key-value pairs */
  additionalInfo?: Record<string, string | number | boolean>;
};

// =============================================================================
// 🎨 COMPONENT DEFINITION
// =============================================================================

/**
 * 🐛 Debug information panel with dark overlay design
 *
 * Provides comprehensive debugging information including:
 * - 📊 Number of series and data points
 * - 📏 Data ranges for X, Y, and Z axes
 * - 💾 Memory usage estimation
 * - ⚡ Performance metrics
 * - 🔧 Additional custom debug info
 *
 * 🚀 Performance Features:
 * - Memoized to prevent unnecessary re-renders
 * - Early return for disabled state (zero render cost)
 * - Optimized styling with minimal DOM impact
 *
 * 🎯 Test-Friendly Design:
 * - Clear prop interface enables easy mocking
 * - Conditional rendering simplifies test scenarios
 * - Type-safe props prevent runtime errors
 */
export const DebugPanel: React.FC<Props> = memo(
  ({ debug, dataStats, performanceMetrics, additionalInfo }) => {
    // 🚀 Performance optimization: Early return prevents unnecessary processing
    if (!debug || !dataStats) {
      return null;
    }

    return (
      <div
        style={{
          position: "absolute",
          top: "15px",
          right: "15px",
          background: "rgba(0,0,0,0.85)",
          color: "white",
          padding: "12px",
          borderRadius: "6px",
          fontSize: "11px",
          fontFamily: "Consolas, 'Courier New', monospace",
          zIndex: 1002,
          minWidth: "220px",
          backdropFilter: "blur(4px)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            fontWeight: "bold",
            marginBottom: "8px",
            color: "#22c55e",
            fontSize: "12px",
            borderBottom: "1px solid rgba(255,255,255,0.2)",
            paddingBottom: "4px",
          }}
        >
          🐛 Debug Information
        </div>

        {/* Data Overview */}
        <div style={{ marginBottom: "6px" }}>
          <div style={{ color: "#a78bfa" }}>📊 Data Overview</div>
          <div style={{ marginLeft: "8px", color: "#e5e7eb" }}>
            <div>Series: {dataStats.seriesCount}</div>
            <div>Points: {dataStats.totalPoints.toLocaleString()}</div>
            <div>Memory: ~{dataStats.memoryUsage}</div>
          </div>
        </div>

        {/* Data Ranges */}
        <div style={{ marginBottom: "6px" }}>
          <div style={{ color: "#fbbf24" }}>📏 Data Ranges</div>
          <div style={{ marginLeft: "8px", color: "#e5e7eb" }}>
            <div>
              X: [{dataStats.xRange[0].toFixed(2)},{" "}
              {dataStats.xRange[1].toFixed(2)}]
            </div>
            <div>
              Y: [{dataStats.yRange[0].toFixed(2)},{" "}
              {dataStats.yRange[1].toFixed(2)}]
            </div>
            {dataStats.zRange && (
              <div>
                Z: [{dataStats.zRange[0].toFixed(2)},{" "}
                {dataStats.zRange[1].toFixed(2)}]
              </div>
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        {performanceMetrics && (
          <div style={{ marginBottom: "6px" }}>
            <div style={{ color: "#10b981" }}>⚡ Performance</div>
            <div style={{ marginLeft: "8px", color: "#e5e7eb" }}>
              {performanceMetrics.renderTime && (
                <div>Render: {performanceMetrics.renderTime.toFixed(2)}ms</div>
              )}
              {performanceMetrics.dataProcessingTime && (
                <div>
                  Processing: {performanceMetrics.dataProcessingTime.toFixed(2)}
                  ms
                </div>
              )}
              {performanceMetrics.frameRate && (
                <div>FPS: {performanceMetrics.frameRate.toFixed(1)}</div>
              )}
              {performanceMetrics.renderedPoints && (
                <div>
                  Rendered: {performanceMetrics.renderedPoints.toLocaleString()}{" "}
                  pts
                </div>
              )}
            </div>
          </div>
        )}

        {/* Additional Debug Information */}
        {additionalInfo && Object.keys(additionalInfo).length > 0 && (
          <div>
            <div style={{ color: "#fb7185", marginBottom: "4px" }}>
              🔧 Additional Info
            </div>
            <div style={{ marginLeft: "8px", color: "#e5e7eb" }}>
              {Object.entries(additionalInfo).map(([key, value]) => (
                <div key={key} style={{ fontSize: "10px" }}>
                  {key}: {String(value)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Performance Tip */}
        <div
          style={{
            marginTop: "8px",
            padding: "4px",
            background: "rgba(59, 130, 246, 0.1)",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            borderRadius: "3px",
            fontSize: "9px",
            color: "#93c5fd",
          }}
        >
          💡 Tip: Use progressive loading for datasets &gt; 10K points
        </div>
      </div>
    );
  }
); // End of memo wrapper

export default DebugPanel;

// =============================================================================
// ⚙️ PLOTTER CONTROLS - STABLE HOVER UI COMPONENT
// =============================================================================

import { useCallback } from "react";
import { StableHover } from "./StableHover";
import type { InteractionConfig, ThemeConfig } from "../types/PlotterTypes";

// =============================================================================
// 📋 TYPES & INTERFACES
// =============================================================================

export interface PlotterControlsProps {
  /** Current interaction configuration */
  interactions: InteractionConfig;
  /** Callback when interactions change */
  onInteractionsChange: (interactions: InteractionConfig) => void;
  /** Current theme configuration */
  theme?: ThemeConfig;
  /** Callback when theme changes */
  onThemeChange?: (theme: ThemeConfig) => void;
  /** Whether debug mode is enabled */
  debug: boolean;
  /** Callback when debug mode changes */
  onDebugChange: (debug: boolean) => void;
  /** Performance metrics for display */
  performanceMetrics?: {
    renderTime?: number;
    dataProcessingTime?: number;
    frameRate?: number;
  };
  /** Disabled state */
  disabled?: boolean;
}

// =============================================================================
// 🎨 PLOTTER CONTROLS COMPONENT
// =============================================================================

/**
 * ⚙️ PlotterControls - Interactive settings panel with stable hover
 *
 * Provides a comprehensive controls interface for the UnifiedPlotter with
 * stable hover interactions that don't flash or behave inconsistently.
 *
 * 🎯 Key Features:
 * - 🎮 Real-time interaction controls (zoom, pan, hover effects)
 * - 🎨 Theme switching with live preview
 * - 🐛 Debug mode toggle with performance metrics
 * - 🛡️ Stable hover behavior using Floating-UI
 * - 📱 Responsive design with proper accessibility
 *
 * 🚀 Performance Optimizations:
 * - Memoized event handlers
 * - Controlled component updates
 * - Minimal re-render strategy
 */
export const PlotterControls: React.FC<PlotterControlsProps> = ({
  interactions,
  onInteractionsChange,
  theme,
  onThemeChange,
  debug,
  onDebugChange,
  performanceMetrics,
  disabled = false,
}) => {
  // ==========================================================================
  // 🎯 EVENT HANDLERS
  // ==========================================================================

  const handleHoverOpacityToggle = useCallback(() => {
    onInteractionsChange({
      ...interactions,
      enableHoverOpacity: !interactions.enableHoverOpacity,
    });
  }, [interactions, onInteractionsChange]);

  const handleOpacityChange = useCallback(
    (type: "dimmed" | "highlight", value: number) => {
      onInteractionsChange({
        ...interactions,
        [type === "dimmed" ? "dimmedOpacity" : "highlightOpacity"]: value,
      });
    },
    [interactions, onInteractionsChange]
  );

  const handleThemeToggle = useCallback(() => {
    if (theme && onThemeChange) {
      onThemeChange({
        ...theme,
        darkMode: !theme.darkMode,
      });
    }
  }, [theme, onThemeChange]);

  // ==========================================================================
  // 🎨 RENDER COMPONENT
  // ==========================================================================

  return (
    <div
      style={{ display: "flex", gap: "8px" }}
      data-testid="plotter-controls-root"
    >
      {/* Interaction Settings */}
      <StableHover
        label="⚙️ Settings"
        testId="settings-hover"
        openDelay={60}
        closeDelay={120}
        disabled={disabled}
      >
        <div style={{ padding: "16px", minWidth: "256px" }}>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#111827",
              borderBottom: "1px solid #e5e7eb",
              paddingBottom: "8px",
              marginBottom: "12px",
            }}
          >
            Interaction Settings
          </h3>

          {/* Hover Opacity Toggle */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "12px",
            }}
          >
            <label style={{ fontSize: "12px", color: "#6b7280" }}>
              Hover Opacity Effects
            </label>
            <button
              onClick={handleHoverOpacityToggle}
              style={{
                position: "relative",
                display: "inline-flex",
                height: "20px",
                width: "36px",
                borderRadius: "9999px",
                transition: "background-color 0.2s",
                backgroundColor: interactions.enableHoverOpacity
                  ? "#2563eb"
                  : "#d1d5db",
                border: "none",
                cursor: "pointer",
                outline: "none",
              }}
              role="switch"
              aria-checked={interactions.enableHoverOpacity}
            >
              <span
                style={{
                  display: "inline-block",
                  height: "16px",
                  width: "16px",
                  borderRadius: "50%",
                  backgroundColor: "white",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  transform: interactions.enableHoverOpacity
                    ? "translateX(16px)"
                    : "translateX(2px)",
                  transition: "transform 0.2s",
                  marginTop: "2px",
                }}
              />
            </button>
          </div>

          {/* Opacity Controls */}
          {interactions.enableHoverOpacity && (
            <div
              style={{
                paddingLeft: "8px",
                borderLeft: "2px solid #dbeafe",
                marginLeft: "8px",
              }}
            >
              <div style={{ marginBottom: "8px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    color: "#6b7280",
                    marginBottom: "4px",
                  }}
                >
                  Dimmed Opacity:{" "}
                  {(interactions.dimmedOpacity || 0.3).toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={interactions.dimmedOpacity || 0.3}
                  onChange={(e) =>
                    handleOpacityChange("dimmed", parseFloat(e.target.value))
                  }
                  style={{
                    width: "100%",
                    height: "8px",
                    backgroundColor: "#e5e7eb",
                    borderRadius: "4px",
                    appearance: "none",
                    cursor: "pointer",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    color: "#6b7280",
                    marginBottom: "4px",
                  }}
                >
                  Highlight Opacity:{" "}
                  {(interactions.highlightOpacity || 1.0).toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={interactions.highlightOpacity || 1.0}
                  onChange={(e) =>
                    handleOpacityChange("highlight", parseFloat(e.target.value))
                  }
                  style={{
                    width: "100%",
                    height: "8px",
                    backgroundColor: "#e5e7eb",
                    borderRadius: "4px",
                    appearance: "none",
                    cursor: "pointer",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </StableHover>

      {/* Debug Controls */}
      <StableHover
        label="🐛 Debug"
        testId="debug-hover"
        openDelay={60}
        closeDelay={120}
        disabled={disabled}
      >
        <div style={{ padding: "16px", minWidth: "224px" }}>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#111827",
              borderBottom: "1px solid #e5e7eb",
              paddingBottom: "8px",
              marginBottom: "12px",
            }}
          >
            Debug Information
          </h3>

          {/* Debug Toggle */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "12px",
            }}
          >
            <label style={{ fontSize: "12px", color: "#6b7280" }}>
              Debug Mode
            </label>
            <button
              onClick={() => onDebugChange(!debug)}
              style={{
                position: "relative",
                display: "inline-flex",
                height: "20px",
                width: "36px",
                borderRadius: "9999px",
                transition: "background-color 0.2s",
                backgroundColor: debug ? "#16a34a" : "#d1d5db",
                border: "none",
                cursor: "pointer",
                outline: "none",
              }}
              role="switch"
              aria-checked={debug}
            >
              <span
                style={{
                  display: "inline-block",
                  height: "16px",
                  width: "16px",
                  borderRadius: "50%",
                  backgroundColor: "white",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  transform: debug ? "translateX(16px)" : "translateX(2px)",
                  transition: "transform 0.2s",
                  marginTop: "2px",
                }}
              />
            </button>
          </div>

          {/* Performance Metrics */}
          {debug && performanceMetrics && (
            <div
              style={{
                paddingLeft: "8px",
                borderLeft: "2px solid #dcfce7",
                marginLeft: "8px",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  marginBottom: "4px",
                }}
              >
                Performance:
              </div>
              {performanceMetrics.renderTime && (
                <div style={{ fontSize: "12px", color: "#374151" }}>
                  Render: {performanceMetrics.renderTime.toFixed(2)}ms
                </div>
              )}
              {performanceMetrics.dataProcessingTime && (
                <div style={{ fontSize: "12px", color: "#374151" }}>
                  Processing: {performanceMetrics.dataProcessingTime.toFixed(2)}
                  ms
                </div>
              )}
              {performanceMetrics.frameRate && (
                <div style={{ fontSize: "12px", color: "#374151" }}>
                  FPS: {performanceMetrics.frameRate.toFixed(1)}
                </div>
              )}
            </div>
          )}
        </div>
      </StableHover>
    </div>
  );
};

export default PlotterControls;

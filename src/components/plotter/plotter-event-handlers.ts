// =============================================================================
// 🎯 UNIFIED PLOTTER - EVENT HANDLERS
// =============================================================================
// Extracted event handling logic for cleaner main component

import { useCallback, useMemo } from "react";
import type {
  PlotlyHoverEvent,
  PlotlyZoomEvent,
  PlotlyClickEvent,
  PlotlySelectEvent,
} from "../../types/plotting/plotting-types";

/**
 * Custom hook for managing hover effects with opacity changes
 */
export const useHoverEffects = (
  plotData: any[],
  hoveredTrace: number | null,
  interactionConfig: any,
  performanceHooks: any
) => {
  const { startMeasurement, endMeasurement } = performanceHooks;

  return useMemo(() => {
    if (!interactionConfig.enableHoverOpacity || hoveredTrace === null) {
      return plotData;
    }

    startMeasurement();

    const modifiedData = plotData.map((trace, index) => {
      const traceRecord = trace as any;

      if (index === hoveredTrace) {
        // Enhance hovered trace
        return {
          ...trace,
          opacity: 1.0,
          line: {
            ...(traceRecord.line || {}),
            width: Math.max((traceRecord.line?.width || 3) * 1.4, 4),
            color: traceRecord.line?.color || "#3b82f6",
          },
          marker: {
            ...(traceRecord.marker || {}),
            size: Array.isArray(traceRecord.marker?.size)
              ? traceRecord.marker.size.map((s: number) => s * 1.3)
              : (traceRecord.marker?.size || 8) * 1.3,
            color:
              traceRecord.marker?.color || traceRecord.line?.color || "#3b82f6",
            opacity: 1.0,
            line: {
              ...(traceRecord.marker?.line || {}),
              width: 3,
              color: "#ffffff",
            },
          },
        };
      } else {
        // Dim other traces
        return {
          ...trace,
          opacity: 0.5,
          line: {
            ...(traceRecord.line || {}),
            width: Math.max((traceRecord.line?.width || 3) * 0.8, 2),
            color: traceRecord.line?.color || "#9ca3af",
          },
          marker: {
            ...(traceRecord.marker || {}),
            size: Array.isArray(traceRecord.marker?.size)
              ? traceRecord.marker.size.map((s: number) => s * 0.85)
              : (traceRecord.marker?.size || 8) * 0.85,
            color: traceRecord.marker?.color || traceRecord.line?.color,
            opacity: 0.4,
            line: {
              ...(traceRecord.marker?.line || {}),
              width: 1,
              color: "rgba(255, 255, 255, 0.6)",
            },
          },
        };
      }
    });

    endMeasurement("renderTime");
    return modifiedData;
  }, [
    plotData,
    hoveredTrace,
    interactionConfig.enableHoverOpacity,
    startMeasurement,
    endMeasurement,
  ]);
};

/**
 * Custom hook for managing plot event handlers
 */
export const usePlotEventHandlers = (
  interactionConfig: any,
  debouncedHover: any,
  debouncedZoom: any,
  setHoveredTrace: (trace: number | null) => void,
  onPlotClick?: (data: PlotlyClickEvent) => void,
  onPlotHover?: (data: PlotlyHoverEvent) => void,
  onPlotSelect?: (data: PlotlySelectEvent) => void,
  onPlotZoom?: (data: PlotlyZoomEvent) => void
) => {
  /** Custom hover handler for opacity feature */
  const handleCustomHover = useCallback(
    (data: unknown) => {
      try {
        const hoverData = data as { points?: Array<{ curveNumber: number }> };

        // Use debounced hover for performance
        debouncedHover(data as PlotlyHoverEvent);

        // Handle hover opacity if enabled
        if (interactionConfig.enableHoverOpacity && hoverData?.points?.[0]) {
          const curveNumber = hoverData.points[0].curveNumber;
          setHoveredTrace(curveNumber);
        }

        // Call user-provided hover handler
        if (onPlotHover) {
          onPlotHover(data as PlotlyHoverEvent);
        }
      } catch (error) {
        console.warn("Hover event error:", error);
      }
    },
    [
      debouncedHover,
      interactionConfig.enableHoverOpacity,
      setHoveredTrace,
      onPlotHover,
    ]
  );

  /** Custom unhover handler to reset opacity */
  const handleCustomUnhover = useCallback(() => {
    setHoveredTrace(null);
  }, [setHoveredTrace]);

  /** Click event handler */
  const handleClick = useCallback(
    (data: PlotlyClickEvent) => {
      onPlotClick?.(data);
    },
    [onPlotClick]
  );

  /** Select event handler */
  const handleSelect = useCallback(
    (data: PlotlySelectEvent) => {
      onPlotSelect?.(data);
    },
    [onPlotSelect]
  );

  /** Zoom event handler with debouncing */
  const handleZoom = useCallback(
    (data: PlotlyZoomEvent) => {
      debouncedZoom(data);
      onPlotZoom?.(data);
    },
    [debouncedZoom, onPlotZoom]
  );

  return {
    handleCustomHover,
    handleCustomUnhover,
    handleClick,
    handleSelect,
    handleZoom,
  };
};

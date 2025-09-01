// =============================================================================
// 🎯 EVENT HANDLING HOOKS
// =============================================================================
// Hooks for managing plot event handlers and responsive dimensions

import { useCallback, useState, useEffect } from "react";
import type {
  PlotlyClickEvent,
  PlotlyHoverEvent,
  PlotlySelectEvent,
  PlotlyZoomEvent,
} from "../../types";

/**
 * Hook for managing plot event handlers
 */
export const usePlotEvents = (
  onPlotClick?: (data: PlotlyClickEvent) => void,
  onPlotHover?: (data: PlotlyHoverEvent) => void,
  onPlotSelect?: (data: PlotlySelectEvent) => void,
  onPlotZoom?: (data: PlotlyZoomEvent) => void
) => {
  const handleClick = useCallback(
    (data: PlotlyClickEvent) => {
      if (onPlotClick) {
        onPlotClick(data);
      }
    },
    [onPlotClick]
  );

  const handleHover = useCallback(
    (data: PlotlyHoverEvent) => {
      if (onPlotHover) {
        onPlotHover(data);
      }
    },
    [onPlotHover]
  );

  const handleSelect = useCallback(
    (data: PlotlySelectEvent) => {
      if (onPlotSelect) {
        onPlotSelect(data);
      }
    },
    [onPlotSelect]
  );

  const handleZoom = useCallback(
    (data: PlotlyZoomEvent) => {
      if (onPlotZoom) {
        onPlotZoom(data);
      }
    },
    [onPlotZoom]
  );

  return {
    handleClick,
    handleHover,
    handleSelect,
    handleZoom,
  };
};

/**
 * Hook for managing responsive plot dimensions
 */
export const useResponsiveDimensions = (
  width?: string | number,
  height?: string | number,
  minHeight?: string | number
) => {
  const [dimensions, setDimensions] = useState({
    width: width || "100%",
    height: height || "500px",
    minHeight: minHeight || "400px",
  });

  useEffect(() => {
    const handleResize = () => {
      // Update dimensions based on container or viewport if needed
      setDimensions((prev) => ({
        ...prev,
        width: width || "100%",
        height: height || "500px",
        minHeight: minHeight || "400px",
      }));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [width, height, minHeight]);

  return dimensions;
};

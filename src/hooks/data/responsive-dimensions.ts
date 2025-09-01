// =============================================================================
// 🎣 RESPONSIVE DIMENSIONS HOOK - MODULAR VERSION
// =============================================================================
// Extracted responsive dimensions functionality for larger application integration

import { useState, useEffect, useCallback } from "react";
import type { RefObject } from "react";

/**
 * Hook for responsive plot dimensions
 */
export const useResponsiveDimensions = (
  containerRef: RefObject<HTMLDivElement>,
  minWidth: number = 300,
  minHeight: number = 200,
  aspectRatio?: number
) => {
  const [dimensions, setDimensions] = useState({
    width: minWidth,
    height: minHeight,
  });

  const updateDimensions = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    let newWidth = Math.max(rect.width || minWidth, minWidth);
    let newHeight = Math.max(rect.height || minHeight, minHeight);

    // Apply aspect ratio if specified
    if (aspectRatio) {
      const ratioHeight = newWidth / aspectRatio;
      if (ratioHeight >= minHeight) {
        newHeight = ratioHeight;
      } else {
        newWidth = newHeight * aspectRatio;
      }
    }

    setDimensions({ width: newWidth, height: newHeight });
  }, [containerRef, minWidth, minHeight, aspectRatio]);

  // Set up resize observer
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(containerRef.current);

    // Initial measurement
    updateDimensions();

    return () => resizeObserver.disconnect();
  }, [updateDimensions]);

  // Also listen to window resize as backup
  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [updateDimensions]);

  return {
    dimensions,
    updateDimensions,
  };
};

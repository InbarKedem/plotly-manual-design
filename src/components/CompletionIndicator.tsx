// =============================================================================
// COMPLETION INDICATOR COMPONENT
// =============================================================================
// This component displays a success indicator when data loading is complete.
// Shows a green checkmark with completion message, then auto-hides after delay.

import React, { useState, useEffect } from "react";

interface CompletionIndicatorProps {
  /** Whether data loading is complete */
  isComplete: boolean;
  /** Custom completion message */
  message?: string;
  /** Duration to show the indicator in milliseconds (default: 3000) */
  duration?: number;
}

/**
 * Animated completion indicator with success styling
 * Features:
 * - Smooth fade-in animation
 * - Green gradient background
 * - Checkmark icon
 * - Auto-fade and hide after specified duration
 */
export const CompletionIndicator: React.FC<CompletionIndicatorProps> = ({
  isComplete,
  message = "Complete",
  duration = 3000,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    if (isComplete) {
      // Show the indicator
      setIsVisible(true);
      setIsAnimatingOut(false);

      // Set timer to start fade-out animation
      const fadeOutTimer = setTimeout(() => {
        setIsAnimatingOut(true);
      }, duration);

      // Set timer to completely hide the component
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
        setIsAnimatingOut(false);
      }, duration + 500); // Add 500ms for fade-out animation

      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(hideTimer);
      };
    } else {
      setIsVisible(false);
      setIsAnimatingOut(false);
    }
  }, [isComplete, duration]);

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        top: "15px",
        right: "15px",
        zIndex: 1001,
        background: "linear-gradient(135deg, #22c55e, #16a34a)",
        color: "white",
        padding: "8px 16px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "600",
        boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        animation: isAnimatingOut
          ? "fadeOutSuccess 0.5s ease-in forwards"
          : "fadeInSuccess 0.5s ease-out",
      }}
    >
      {/* Checkmark Icon with additional scaling animation */}
      <span
        style={{
          fontSize: "14px",
          animation: isAnimatingOut
            ? "none"
            : "scaleIn 0.3s ease-out 0.2s both",
        }}
      >
        ✓
      </span>

      {/* Message */}
      <span>{message}</span>
    </div>
  );
};

export default CompletionIndicator;

// =============================================================================
// COMPLETION INDICATOR COMPONENT
// =============================================================================
// This component displays a success indicator when data loading is complete.
// Shows a green checkmark with completion message.

import React from "react";

interface CompletionIndicatorProps {
  /** Whether data loading is complete */
  isComplete: boolean;
  /** Custom completion message */
  message?: string;
}

/**
 * Animated completion indicator with success styling
 * Features:
 * - Smooth fade-in animation
 * - Green gradient background
 * - Checkmark icon
 * - Auto-fade after delay (optional)
 */
export const CompletionIndicator: React.FC<CompletionIndicatorProps> = ({
  isComplete,
  message = "Complete",
}) => {
  // Don't render if not complete
  if (!isComplete) {
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
        animation: "fadeInSuccess 0.5s ease-out",
      }}
    >
      {/* Checkmark Icon */}
      <span style={{ fontSize: "14px" }}>✓</span>

      {/* Message */}
      <span>{message}</span>
    </div>
  );
};

export default CompletionIndicator;

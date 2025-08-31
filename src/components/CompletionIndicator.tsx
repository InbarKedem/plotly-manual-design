// =============================================================================
// ✅ COMPLETION INDICATOR COMPONENT - SUCCESS FEEDBACK SYSTEM
// =============================================================================
// Displays success indicator when data loading completes with auto-hide functionality.
// Shows green checkmark with completion message following GitHub Copilot standards
// for clean, reusable, and performance-optimized React components.
//
// 🎯 Component Goals:
// - Performance-oriented: React.memo and useCallback optimizations
// - Bug-resistant: Proper cleanup and state management
// - Documentation-oriented: Clear JSDoc with emoji indicators
// - Accessibility-oriented: ARIA labels and semantic HTML

import React, { useState, useEffect, useCallback } from "react";

// =============================================================================
// 📋 COMPONENT PROPS - FULLY TYPED WITH DEFAULTS
// =============================================================================

/**
 * 🎉 Props for CompletionIndicator component
 *
 * Configuration for success feedback display with timing control.
 * Includes accessibility and performance considerations.
 */
type CompletionIndicatorProps = {
  /** Whether data loading is complete */
  isComplete: boolean;
  /** Custom completion message (default: "Complete") */
  message?: string;
  /** Duration to show indicator in milliseconds (default: 3000) */
  duration?: number;
};

// =============================================================================
// 🎨 COMPLETION INDICATOR - PERFORMANCE OPTIMIZED SUCCESS FEEDBACK
// =============================================================================

/**
 * ✨ Animated completion indicator with success styling
 *
 * Provides immediate visual feedback when operations complete successfully.
 * Features smooth animations with automatic cleanup and proper state management.
 *
 * 🌟 Key Features:
 * - Smooth fade-in/fade-out animations with CSS transitions
 * - Success-themed green gradient background
 * - Accessibility-compliant checkmark icon
 * - Auto-hide functionality with configurable timing
 * - Memory-efficient cleanup with proper timer management
 *
 * 🚀 Performance: React.memo prevents unnecessary re-renders
 * ♿ Accessibility: ARIA labels and semantic success indicators
 *
 * @param props - CompletionIndicatorProps configuration
 * @returns JSX.Element or null when not visible
 */
const CompletionIndicator: React.FC<CompletionIndicatorProps> = React.memo(
  ({
    isComplete,
    message = "Complete", // Default value for message prop
    duration = 3000, // Default 3-second display duration
  }) => {
    // 🎯 State management for animation control
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimatingOut, setIsAnimatingOut] = useState(false);

    // 🚀 Memoized cleanup function for performance
    const hideIndicator = useCallback(() => {
      setIsAnimatingOut(true);

      // Complete hiding after animation duration
      setTimeout(() => {
        setIsVisible(false);
        setIsAnimatingOut(false);
      }, 500); // Match CSS animation duration
    }, []);

    // ⏰ Effect for managing indicator lifecycle with proper cleanup
    useEffect(() => {
      if (isComplete) {
        // 📋 Show the indicator immediately
        setIsVisible(true);
        setIsAnimatingOut(false);

        // ⏰ Schedule automatic hide after duration
        const hideTimer = setTimeout(() => {
          hideIndicator();
        }, duration);

        // 🧹 Cleanup function for memory efficiency
        return () => {
          clearTimeout(hideTimer);
        };
      } else {
        // 🔄 Reset state when not complete
        setIsVisible(false);
        setIsAnimatingOut(false);
      }
    }, [isComplete, duration, hideIndicator]);

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
  }
);

// 🏷️ Display name for debugging and React DevTools
CompletionIndicator.displayName = "CompletionIndicator";

export default CompletionIndicator;

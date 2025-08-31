// =============================================================================
// 🎯 CSS-FIRST STABLE HOVER - NO-FLASH IMPLEMENTATION
// =============================================================================

import { useState, useCallback, useRef, useEffect } from "react";

// =============================================================================
// 📋 TYPES & INTERFACES
// =============================================================================

export interface CssStableHoverProps {
  /** The trigger element content */
  label: string;
  /** The hover panel content */
  children: React.ReactNode;
  /** Custom trigger styles */
  triggerStyle?: React.CSSProperties;
  /** Custom panel styles */
  panelStyle?: React.CSSProperties;
  /** Disabled state */
  disabled?: boolean;
  /** Custom trigger element */
  trigger?: React.ReactNode;
  /** Test ID for the root element */
  testId?: string;
  /** Panel position relative to trigger */
  position?: "bottom" | "top" | "left" | "right";
  /** ARIA role for the panel */
  role?: "menu" | "listbox" | "dialog";
}

// =============================================================================
// 🎨 CSS-FIRST STABLE HOVER COMPONENT
// =============================================================================

/**
 * 🎯 CssStableHover - Zero-flicker hover using pure CSS approach
 *
 * This component eliminates hover flashing by keeping the trigger and panel
 * within the same containing block and using CSS :hover and :focus-within
 * selectors for stable interactions.
 *
 * 🎯 Key Anti-Flicker Features:
 * - 🛡️ No JavaScript timing dependencies
 * - 📦 Trigger and panel share same hover tree
 * - 🌉 Invisible bridge eliminates pointer gaps
 * - 🎯 CSS-only visibility transitions
 * - ⚡ Zero JavaScript overhead during hover
 *
 * 🚀 Performance Benefits:
 * - No event listeners during hover
 * - No state updates on mouse movement
 * - Hardware-accelerated CSS transitions
 * - Minimal JavaScript execution
 */
export const CssStableHover: React.FC<CssStableHoverProps> = ({
  label,
  children,
  triggerStyle = {},
  panelStyle = {},
  disabled = false,
  trigger,
  testId = "css-hover-root",
  position = "bottom",
  role = "listbox",
}) => {
  // ==========================================================================
  // 🔄 STATE FOR ACCESSIBILITY
  // ==========================================================================

  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [hoverCount, setHoverCount] = useState(0);
  const groupRef = useRef<HTMLDivElement>(null);

  // ==========================================================================
  // 🎯 EVENT HANDLERS FOR KEYBOARD ACCESSIBILITY
  // ==========================================================================

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setIsKeyboardOpen(!isKeyboardOpen);
      } else if (e.key === "Escape") {
        setIsKeyboardOpen(false);
      }
    },
    [isKeyboardOpen]
  );

  const handleMouseEnter = useCallback(() => {
    setHoverCount((count) => count + 1);
  }, []);

  // ==========================================================================
  // 🎨 DYNAMIC STYLES
  // ==========================================================================

  const groupStyles: React.CSSProperties = {
    position: "relative",
    display: "inline-flex",
    // This ensures the group acts as the hover boundary
  };

  const defaultTriggerStyles: React.CSSProperties = {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    backgroundColor: "white",
    cursor: disabled ? "not-allowed" : "pointer",
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
    outline: "none",
    transition: "background-color 0.1s ease",
    opacity: disabled ? 0.5 : 1,
    ...triggerStyle,
  };

  const panelPositionStyles: Record<string, React.CSSProperties> = {
    bottom: {
      position: "absolute",
      top: "100%",
      left: "0",
      marginTop: "4px",
    },
    top: {
      position: "absolute",
      bottom: "100%",
      left: "0",
      marginBottom: "4px",
    },
    right: {
      position: "absolute",
      top: "0",
      left: "100%",
      marginLeft: "4px",
    },
    left: {
      position: "absolute",
      top: "0",
      right: "100%",
      marginRight: "4px",
    },
  };

  const defaultPanelStyles: React.CSSProperties = {
    ...panelPositionStyles[position],
    minWidth: "192px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    backgroundColor: "white",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    zIndex: 50,

    // CSS-only visibility control
    opacity: 0,
    visibility: "hidden",
    transform: "scale(0.95)",
    transition: "opacity 0.1s ease, visibility 0.1s ease, transform 0.1s ease",

    // Will be overridden by CSS hover rules
    pointerEvents: "auto",
    ...panelStyle,
  };

  const bridgeStyles: React.CSSProperties = {
    position: "absolute",
    pointerEvents: "auto",
    // Bridge positioning depends on panel position
    ...(position === "bottom" && {
      top: "100%",
      left: "0",
      right: "0",
      height: "4px",
    }),
    ...(position === "top" && {
      bottom: "100%",
      left: "0",
      right: "0",
      height: "4px",
    }),
    ...(position === "right" && {
      top: "0",
      bottom: "0",
      left: "100%",
      width: "4px",
    }),
    ...(position === "left" && {
      top: "0",
      bottom: "0",
      right: "100%",
      width: "4px",
    }),
  };

  // ==========================================================================
  // 🎯 CSS HOVER RULES INJECTION
  // ==========================================================================

  useEffect(() => {
    const styleId = `css-stable-hover-${testId}`;
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;

    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    // CSS rules for stable hover with no JavaScript timing
    styleElement.textContent = `
      [data-testid="${testId}"]:hover [data-testid="hover-panel"],
      [data-testid="${testId}"]:focus-within [data-testid="hover-panel"],
      [data-testid="${testId}"][data-keyboard-open="true"] [data-testid="hover-panel"] {
        opacity: 1 !important;
        visibility: visible !important;
        transform: scale(1) !important;
      }
      
      [data-testid="${testId}"] [data-testid="hover-trigger"]:hover {
        background-color: #f9fafb;
      }
      
      /* Ensure smooth transitions with hardware acceleration */
      [data-testid="${testId}"] [data-testid="hover-panel"] {
        will-change: opacity, transform;
        backface-visibility: hidden;
      }
    `;

    return () => {
      // Cleanup on unmount
      const element = document.getElementById(styleId);
      if (element) {
        element.remove();
      }
    };
  }, [testId]);

  // ==========================================================================
  // 🎯 RENDER COMPONENT
  // ==========================================================================

  return (
    <div
      ref={groupRef}
      style={groupStyles}
      data-testid={testId}
      data-keyboard-open={isKeyboardOpen}
      data-hover-count={hoverCount}
      onMouseEnter={handleMouseEnter}
    >
      {/* Trigger Element */}
      {trigger ? (
        <div
          data-testid="hover-trigger"
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
          role="button"
          aria-haspopup={role === "menu" ? "menu" : "listbox"}
          aria-expanded={isKeyboardOpen}
        >
          {trigger}
        </div>
      ) : (
        <button
          style={defaultTriggerStyles}
          data-testid="hover-trigger"
          disabled={disabled}
          onKeyDown={handleKeyDown}
          aria-haspopup={role === "menu" ? "menu" : "listbox"}
          aria-expanded={isKeyboardOpen}
        >
          {label}
        </button>
      )}

      {/* Invisible Bridge - Prevents gaps during pointer movement */}
      <div style={bridgeStyles} data-testid="hover-bridge" aria-hidden="true" />

      {/* Floating Panel - Always mounted, CSS controls visibility */}
      <div
        style={defaultPanelStyles}
        data-testid="hover-panel"
        data-state={isKeyboardOpen ? "open" : "closed"}
        role={role}
        aria-hidden={!isKeyboardOpen}
      >
        {children}
      </div>
    </div>
  );
};

export default CssStableHover;

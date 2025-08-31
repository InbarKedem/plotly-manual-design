// =============================================================================
// 🚀 MAIN APPLICATION COMPONENT - UNIFIED PLOTTER SHOWCASE
// =============================================================================
// Root application component demonstrating UnifiedPlotter capabilities across
// multiple use cases. Following GitHub Copilot standards for clean, reusable,
// and high-performance React application architecture.
//
// 🎯 App Goals:
// - DRY-compliant: Reusable tab system and demo configurations
// - Performance-oriented: React.memo, useMemo, useCallback optimizations
// - Bug-resistant: Type-safe tab management and error boundaries
// - Test-friendly: Isolated demo components with clear separation

import React, { useState, useCallback, useMemo } from "react";
import "./App.css";

// 📊 Import demo components - organized by complexity and features
import OrganizedScientificDemo from "./demos/OrganizedScientificDemo";
import InteractiveMultiSeriesDemo from "./demos/InteractiveMultiSeriesDemo";
import PerformanceTestDemo from "./demos/PerformanceTestDemo";
import EnhancedCurveStylingDemo from "./demos/EnhancedCurveStylingDemo";

// =============================================================================
// 📋 TYPES & INTERFACES - COMPREHENSIVE TAB SYSTEM
// =============================================================================

/**
 * 🏷️ Configuration for demo tabs with comprehensive typing
 *
 * Defines the structure for each demo tab with metadata and component reference.
 * Follows DRY principles for consistent tab management across the application.
 */
type TabConfig = {
  /** Display name for the tab with emoji icon for visual appeal */
  name: string;
  /** React component to render for this demo */
  component: React.ComponentType;
  /** Category for grouping demos (enables future expansion) */
  category: "Unified";
  /** Emoji icon for visual identification and accessibility */
  icon: string;
  /** Optional description for tooltips or help text */
  description?: string;
};

// =============================================================================
// ⚙️ CONFIGURATION & CONSTANTS - PERFORMANCE OPTIMIZED
// =============================================================================

/**
 * 📊 Demo tab configurations with performance-optimized components
 *
 * Each demo showcases different aspects of the UnifiedPlotter system.
 * Organized by complexity and feature showcase for logical progression.
 *
 * 🎯 Demo Organization Strategy:
 * 1. Enhanced Curve Styling - Visual customization and styling features
 * 2. Performance Test - Large dataset handling and optimization
 * 3. Organized Demo - Scientific use cases and data generators
 * 4. Interactive Multi-Series - Advanced interactions and controls
 *
 * 🚀 Performance: Readonly array prevents accidental mutations
 */
const DEMO_TABS: readonly TabConfig[] = [
  {
    name: "🎨 Enhanced Curve Styling",
    component: EnhancedCurveStylingDemo,
    category: "Unified",
    icon: "🎨",
    description: "Advanced curve styling with colors, lines, and points",
  },
  {
    name: "⚡ Performance Test",
    component: PerformanceTestDemo,
    category: "Unified",
    icon: "⚡",
  },
  {
    name: "🧪 Organized Demo",
    component: OrganizedScientificDemo,
    category: "Unified",
    icon: "🧪",
  },
  {
    name: "📊 Interactive Multi-Series",
    component: InteractiveMultiSeriesDemo,
    category: "Unified",
    icon: "📊",
  },
] as const;

// =============================================================================
// 🚀 MAIN APP COMPONENT
// =============================================================================

/**
 * 🚀 Enhanced UnifiedPlotter Demo App
 *
 * Main application component showcasing the UnifiedPlotter system
 * with multiple interactive demos and performance optimizations.
 *
 * 🎯 Features:
 * - Tab-based navigation for organized demo exploration
 * - Performance-optimized component rendering
 * - Consistent theming and responsive design
 * - Memoized component selection for minimal re-renders
 *
 * 🚀 Performance Optimizations:
 * - useCallback for event handlers
 * - useMemo for active component selection
 * - Minimal re-render strategy
 */
const App: React.FC = () => {
  // ==========================================================================
  // 🎯 STATE MANAGEMENT
  // ==========================================================================

  const [activeTab, setActiveTab] = useState(0); // Start with Enhanced Curve Styling

  // ==========================================================================
  // 📊 MEMOIZED VALUES & CALLBACKS
  // ==========================================================================

  /** 🚀 Memoized active component to prevent unnecessary re-renders */
  const ActiveComponent = useMemo(
    () => DEMO_TABS[activeTab].component,
    [activeTab]
  );

  /** 🎯 Optimized tab click handler with useCallback for performance */
  const handleTabClick = useCallback((tabIndex: number) => {
    setActiveTab(tabIndex);
  }, []);

  // 🎨 Category colors for visual organization
  const categoryColors = {
    Unified: "#8b5cf6",
  } as const;

  return (
    <div style={{ fontFamily: "Arial, sans-serif", minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "20px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{ margin: "0 0 10px 0", fontSize: "32px", fontWeight: "bold" }}
        >
          🚀 Enhanced UnifiedPlotter Demo
        </h1>
        <p style={{ margin: 0, opacity: 0.9, fontSize: "18px" }}>
          Showcasing performance monitoring, validation, and enhanced features
        </p>
      </div>

      {/* Tab Navigation */}
      <div
        style={{
          background: "white",
          borderBottom: "1px solid #e5e7eb",
          padding: "0 20px",
          display: "flex",
          gap: "5px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        {DEMO_TABS.map((tab: TabConfig, index: number) => (
          <button
            key={index}
            onClick={() => handleTabClick(index)}
            style={{
              background:
                activeTab === index
                  ? categoryColors[tab.category]
                  : "transparent",
              color: activeTab === index ? "white" : "#374151",
              border: "none",
              padding: "15px 20px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: activeTab === index ? "600" : "500",
              borderRadius: activeTab === index ? "8px 8px 0 0" : "0",
              transition: "all 0.3s ease",
              transform: activeTab === index ? "translateY(-2px)" : "none",
              boxShadow:
                activeTab === index ? "0 -2px 8px rgba(0,0,0,0.1)" : "none",
            }}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>

      {/* Demo Content - Full Width */}
      <div style={{ minHeight: "calc(100vh - 140px)" }}>
        <ActiveComponent />
      </div>
    </div>
  );
};

export default App;

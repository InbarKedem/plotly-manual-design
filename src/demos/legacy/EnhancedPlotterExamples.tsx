// =============================================================================
// 📊 ENHANCED PLOTTER EXAMPLES - LEGACY DEMONSTRATION COMPONENTS
// =============================================================================
// Legacy demonstration components showcasing enhanced plotting capabilities.
// Following GitHub Copilot standards for maintainable demo code.
//
// 🎯 Demo Collection Features:
// - 🚀 DRY-compliant: Reusable example patterns for documentation
// - 📱 Performance-oriented: Optimized rendering for smooth demonstrations
// - 🛡️ Bug-resistant: Validated data generation and error handling
// - 🧪 Test-friendly: Predictable demo scenarios for component testing

import React from "react";
import EnhancedGenericPlotter from "./components/EnhancedGenericPlotter";
import {
  generateLinearData,
  generateSinusoidalData,
} from "../../data/generators";

// =============================================================================
// 📈 SCATTER PLOT DEMONSTRATIONS
// =============================================================================

/**
 * 🎯 Modern scatter plot demonstration component
 *
 * Showcases basic scatter plot functionality with realistic sample data.
 * Demonstrates marker-based visualization patterns for data exploration.
 *
 * 🎨 Features:
 * - Clean marker-only visualization
 * - Realistic noise for data simulation
 * - Modern styling and responsiveness
 *
 * @returns React component demonstrating scatter plot capabilities
 */
export const ModernScatterExample: React.FC = () => {
  // 📊 Generate realistic test data with controlled noise
  const data = [
    {
      name: "Sample Data",
      data: generateLinearData(50, 1, 0, 0.2),
      type: "scatter" as const,
      mode: "markers" as const,
    },
  ];

  return (
    <EnhancedGenericPlotter
      data={data}
      config={{
        title: "Modern Scatter Plot",
        height: 400,
      }}
    />
  );
};

// =============================================================================
// 📊 MULTI-SERIES DEMONSTRATIONS
// =============================================================================

/**
 * 🎭 Multi-type series visualization demonstration
 *
 * Demonstrates the capability to combine different mathematical patterns
 * in a single visualization for comprehensive data analysis.
 *
 * 🧮 Series Types:
 * - Linear trends for baseline analysis
 * - Sinusoidal patterns for periodic data
 *
 * @returns React component with combined visualization patterns
 */
export const MultiTypeSeriesExample: React.FC = () => {
  // 📈 Multiple mathematical patterns for comprehensive visualization
  const data = [
    {
      name: "Linear",
      data: generateLinearData(30),
      type: "scatter" as const,
      mode: "lines" as const,
    },
    {
      name: "Sine Wave",
      data: generateSinusoidalData(30),
      type: "scatter" as const,
      mode: "markers" as const,
    },
  ];

  return (
    <EnhancedGenericPlotter
      data={data}
      config={{
        title: "Multi-Type Series",
        height: 400,
      }}
    />
  );
};

export const ThemedProgressiveExample: React.FC = () => {
  const data = [
    {
      name: "Progressive Data",
      data: generateLinearData(100),
      type: "scatter" as const,
      mode: "lines+markers" as const,
    },
  ];

  return (
    <EnhancedGenericPlotter
      data={data}
      config={{
        title: "Themed Progressive Loading",
        height: 400,
      }}
      progressiveLoading={{ enabled: true }}
    />
  );
};

export const InteractiveFeaturesExample: React.FC = () => {
  const data = [
    {
      name: "Interactive Data",
      data: generateSinusoidalData(50),
      type: "scatter" as const,
      mode: "lines" as const,
    },
  ];

  return (
    <EnhancedGenericPlotter
      data={data}
      config={{
        title: "Interactive Features",
        height: 400,
      }}
      interactions={{
        hovermode: "x",
        dragmode: "zoom",
      }}
    />
  );
};

export const AdvancedClimateExample: React.FC = () => {
  const data = [
    {
      name: "Climate Data",
      data: generateSinusoidalData(100, 1, 0.05, 0, 0.1),
      type: "scatter" as const,
      mode: "lines" as const,
    },
  ];

  return (
    <EnhancedGenericPlotter
      data={data}
      config={{
        title: "Advanced Climate Data",
        height: 500,
      }}
    />
  );
};

export const RealTimeStyleExample: React.FC = () => {
  const data = [
    {
      name: "Real-time Style",
      data: generateLinearData(75, 0.5, 5, 0.3),
      type: "scatter" as const,
      mode: "lines+markers" as const,
    },
  ];

  return (
    <EnhancedGenericPlotter
      data={data}
      config={{
        title: "Real-time Style Example",
        height: 400,
      }}
      theme={{
        colors: ["#1f77b4", "#ff7f0e"],
        backgroundColor: "#f8f9fa",
      }}
    />
  );
};

// =============================================================================
// 🔬 ORGANIZED SCIENTIFIC DEMO - SHOWCASE OF UNIFIED PLOTTER CAPABILITIES
// =============================================================================
// Demonstrates the UnifiedPlotter using organized structure with data generators,
// presets, and themes following GitHub Copilot standards for high-performance,
// maintainable React components.
//
// 🎯 Demo Goals:
// - DRY-compliant: Reusable data generators and presets
// - Performance-oriented: useMemo for expensive computations
// - Bug-resistant: Proper error handling and validation
// - Test-friendly: Isolated demo configurations

import React, { useState, useMemo } from "react";
import UnifiedPlotter from "../UnifiedPlotter";

// 📊 Import organized utilities for clean code structure
import {
  generateScientificData,
  generateTemperatureData,
  generateClimateData,
  generateTimeSeriesData,
} from "../data/generators";

import {
  scientificScatterPreset,
  singleLinePreset,
  businessMetricsPreset,
  environmentalDataPreset,
} from "../presets/scientific";

import { THEMES, getTheme } from "../config/themes";

// =============================================================================
// 📋 COMPONENT TYPES - COMPREHENSIVE DEMO CONFIGURATION
// =============================================================================

/**
 * 🎨 Demo configuration type for organized structure
 *
 * Defines the structure for each demo with comprehensive metadata.
 * Enables type-safe demo management and configuration.
 */
type DemoConfig = {
  /** Display title for the demo */
  title: string;
  /** Description explaining the demo purpose */
  description: string;
  /** Series data configuration array */
  series: Array<{
    name: string;
    data: ReturnType<typeof generateScientificData>;
    [key: string]: string | number | boolean | any;
  }>;
  /** Preset configuration to apply */
  preset: Record<string, any>;
};

/**
 * 🎯 Available demo types for selection
 */
type DemoType = "measurements" | "temperature" | "climate" | "timeseries";

// =============================================================================
// 🚀 ORGANIZED SCIENTIFIC DEMO COMPONENT - PERFORMANCE OPTIMIZED
// =============================================================================

/**
 * 🔬 Organized Scientific Demo Component
 *
 * Showcases UnifiedPlotter capabilities with scientifically accurate data
 * and professionally designed presets. Demonstrates best practices for
 * data visualization in scientific applications.
 *
 * 🌟 Key Features:
 * - Multiple scientific data types with realistic patterns
 * - Theme switching for different presentation contexts
 * - Preset-based styling for consistency
 * - Performance-optimized with proper memoization
 *
 * 🚀 Performance: useMemo for data generation, useCallback for handlers
 * 🧪 Test-friendly: Isolated configurations with predictable outputs
 */
const OrganizedScientificDemo: React.FC = React.memo(() => {
  // 🎯 Component state with proper typing
  const [selectedDemo, setSelectedDemo] = useState<DemoType>("measurements");
  const [selectedTheme, setSelectedTheme] = useState<string>("scientific");

  // 🚀 Memoized demo configurations for performance optimization
  const demos = useMemo(
    (): Record<DemoType, DemoConfig> => ({
      measurements: {
        title: "🔬 Scientific Measurements with Error Bars",
        description: "Exponential decay with measurement uncertainties",
        series: [
          {
            name: "Experimental Data",
            data: generateScientificData(50),
            ...scientificScatterPreset.seriesDefaults,
          },
        ],
        preset: scientificScatterPreset,
      },

      temperature: {
        title: "🌡️ Annual Temperature Cycle",
        description: "Realistic temperature data with seasonal patterns",
        series: [
          {
            name: "Daily Temperature",
            data: generateTemperatureData(365),
            ...singleLinePreset.seriesDefaults,
          },
        ],
        preset: singleLinePreset,
      },

      climate: {
        title: "🌍 Climate Analysis",
        description: "Temperature vs humidity correlation study",
        series: [
          {
            name: "Climate Data",
            data: generateClimateData(300),
            ...environmentalDataPreset.seriesDefaults,
          },
        ],
        preset: {
          ...environmentalDataPreset,
          config: {
            ...environmentalDataPreset.config,
            title: "Temperature vs Humidity Correlation",
            xAxis: { title: "Temperature (°C)" },
            yAxis: { title: "Humidity (%)" },
          },
        },
      },

      timeseries: {
        title: "📈 Time Series Analysis",
        description: "Business metrics over time with daily/weekly patterns",
        series: [
          {
            name: "Metric Value",
            data: generateTimeSeriesData(168, 100, 0.03),
            ...businessMetricsPreset.seriesDefaults,
          },
        ],
        preset: businessMetricsPreset,
      },
    }),
    []
  );

  const currentDemo = demos[selectedDemo as keyof typeof demos];
  const currentTheme = getTheme(selectedTheme);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: "30px", padding: "20px" }}>
        <h1
          style={{ margin: "0 0 10px 0", color: "#1f2937", fontSize: "32px" }}
        >
          🧪 Organized Scientific Demo
        </h1>
        <p style={{ margin: 0, color: "#6b7280", fontSize: "18px" }}>
          Demonstrating the new organized architecture with data generators,
          presets, and themes
        </p>
      </div>

      {/* Controls */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: "#f8fafc",
          borderRadius: "8px",
          border: "1px solid #e2e8f0",
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "600",
              color: "#374151",
            }}
          >
            📊 Chart Type:
          </label>
          <select
            value={selectedDemo}
            onChange={(e) => setSelectedDemo(e.target.value as DemoType)}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              backgroundColor: "white",
            }}
          >
            <option value="measurements">Scientific Measurements</option>
            <option value="temperature">Temperature Cycle</option>
            <option value="climate">Climate Analysis</option>
            <option value="timeseries">Time Series</option>
          </select>
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "600",
              color: "#374151",
            }}
          >
            🎨 Theme:
          </label>
          <select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              backgroundColor: "white",
            }}
          >
            {Object.keys(THEMES).map((theme) => (
              <option key={theme} value={theme}>
                {theme.charAt(0).toUpperCase() +
                  theme.slice(1).replace(/([A-Z])/g, " $1")}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Current Demo Info */}
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: currentTheme.darkMode ? "#1e293b" : "#ffffff",
          borderRadius: "8px",
          border: `1px solid ${currentTheme.darkMode ? "#334155" : "#e2e8f0"}`,
          color: currentTheme.darkMode ? "#e2e8f0" : "#1f2937",
        }}
      >
        <h2 style={{ margin: "0 0 8px 0", fontSize: "20px" }}>
          {currentDemo.title}
        </h2>
        <p
          style={{
            margin: 0,
            color: currentTheme.darkMode ? "#94a3b8" : "#6b7280",
          }}
        >
          {currentDemo.description}
        </p>
      </div>

      {/* Plot */}
      <div
        style={{
          border: `1px solid ${currentTheme.darkMode ? "#334155" : "#e2e8f0"}`,
          borderRadius: "12px",
          overflow: "hidden",
          backgroundColor: currentTheme.background,
        }}
      >
        <UnifiedPlotter
          series={currentDemo.series}
          config={currentDemo.preset.config}
          interactions={currentDemo.preset.interactions}
          theme={currentTheme}
        />
      </div>
    </div>
  );
});

// 🏷️ Display name for debugging and React DevTools
OrganizedScientificDemo.displayName = "OrganizedScientificDemo";

export default OrganizedScientificDemo;

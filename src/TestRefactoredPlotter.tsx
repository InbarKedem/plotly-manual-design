// =============================================================================
// TEST FILE FOR REFACTORED UNIFIED PLOTTER
// =============================================================================
// This file tests the refactored UnifiedPlotter with the new modular structure

import React from "react";
import UnifiedPlotter from "./UnifiedPlotter";
import type { SeriesConfig } from "./types/PlotterTypes";

/**
 * Simple test component to verify the refactored UnifiedPlotter works
 */
const TestRefactoredPlotter: React.FC = () => {
  // Generate simple test data
  const testSeries: SeriesConfig[] = [
    {
      name: "Sample Data",
      data: [
        { x: 1, y: 2 },
        { x: 2, y: 5 },
        { x: 3, y: 3 },
        { x: 4, y: 8 },
        { x: 5, y: 7 },
      ],
      mode: "lines+markers",
      line: { color: "#3b82f6", width: 2 },
      marker: { size: 8, color: "#ef4444" },
    },
    {
      name: "Second Series",
      data: [
        { x: 1, y: 1 },
        { x: 2, y: 3 },
        { x: 3, y: 6 },
        { x: 4, y: 4 },
        { x: 5, y: 9 },
      ],
      mode: "markers",
      marker: { size: 10, color: "#10b981", symbol: "diamond" },
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>🧪 Refactored UnifiedPlotter Test</h1>

      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          padding: "20px",
          marginTop: "20px",
        }}
      >
        <h2>Basic Plot Test</h2>
        <UnifiedPlotter
          series={testSeries}
          config={{
            title: "Test Plot - Refactored Architecture",
            xAxis: { title: "X Values" },
            yAxis: { title: "Y Values" },
            width: "100%",
            height: "400px",
          }}
          theme={{ darkMode: false }}
          debug={true}
        />
      </div>

      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          padding: "20px",
          marginTop: "20px",
          backgroundColor: "#1a1a1a",
          color: "white",
        }}
      >
        <h2 style={{ color: "white" }}>Dark Mode Test</h2>
        <UnifiedPlotter
          series={testSeries}
          config={{
            title: "Dark Mode Test",
            xAxis: { title: "X Values" },
            yAxis: { title: "Y Values" },
            width: "100%",
            height: "400px",
          }}
          theme={{
            darkMode: true,
            primary: "#60a5fa",
            secondary: "#34d399",
          }}
          debug={true}
        />
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          backgroundColor: "#f0f9ff",
          borderRadius: "6px",
          border: "1px solid #0ea5e9",
        }}
      >
        <h3 style={{ margin: "0 0 10px 0", color: "#0c4a6e" }}>
          ✅ Refactoring Complete
        </h3>
        <ul style={{ margin: 0, color: "#0369a1" }}>
          <li>
            <strong>Types</strong>: Moved to <code>types/PlotterTypes.ts</code>
          </li>
          <li>
            <strong>Utils</strong>: Split into <code>utils/</code> directory
          </li>
          <li>
            <strong>Hooks</strong>: Custom hooks in <code>hooks/</code>
          </li>
          <li>
            <strong>Components</strong>: UI components in{" "}
            <code>components/</code>
          </li>
          <li>
            <strong>Styles</strong>: CSS animations in <code>styles/</code>
          </li>
          <li>
            <strong>Main Component</strong>: Simplified and well-documented
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TestRefactoredPlotter;

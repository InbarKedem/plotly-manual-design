// =============================================================================
// 🎨 ENHANCED HOVER DEMO - SHOWCASE OF IMPROVED STYLING
// =============================================================================

import React from "react";
import UnifiedPlotter from "../UnifiedPlotter";
import type { SeriesConfig } from "../types/PlotterTypes";

// Generate sample data for demonstration
const generateDemoData = (points: number = 50): SeriesConfig[] => [
  {
    name: "Temperature",
    data: Array.from({ length: points }, (_, i) => ({
      x: i,
      y: 20 + 10 * Math.sin(i * 0.2) + Math.random() * 5,
    })),
    line: { color: "#ef4444", width: 3 }, // red-500
    marker: { size: 8 },
  },
  {
    name: "Humidity",
    data: Array.from({ length: points }, (_, i) => ({
      x: i,
      y: 60 + 15 * Math.cos(i * 0.15) + Math.random() * 8,
    })),
    line: { color: "#3b82f6", width: 3 }, // blue-500
    marker: { size: 8 },
  },
  {
    name: "Pressure",
    data: Array.from({ length: points }, (_, i) => ({
      x: i,
      y: 1013 + 5 * Math.sin(i * 0.1) + Math.random() * 3,
    })),
    line: { color: "#10b981", width: 3 }, // emerald-500
    marker: { size: 8 },
  },
];

/**
 * 🎨 Enhanced Hover Demo Component
 *
 * Demonstrates the improved hover mode styling with:
 * - Floating tooltip cards with smooth animations
 * - Thin vertical crosshair for precise data reading
 * - Data points that grow on hover with white outer strokes
 * - Clean modern background with subtle gridlines
 * - Smooth spline curves with enhanced visibility
 */
const EnhancedHoverDemo: React.FC = () => {
  const demoData = generateDemoData(75);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🎨 Enhanced Hover Mode Styling
          </h1>
          <p className="text-gray-600 text-lg">
            Hover over the data points to experience the improved styling:
          </p>
          <ul className="mt-4 text-sm text-gray-600 space-y-2">
            <li>
              • <strong>Floating tooltips</strong> with rounded corners and
              shadows
            </li>
            <li>
              • <strong>Vertical crosshair</strong> for precise x-axis alignment
            </li>
            <li>
              • <strong>Data points grow</strong> on hover with white outer
              strokes
            </li>
            <li>
              • <strong>Smooth curves</strong> with spline interpolation
            </li>
            <li>
              • <strong>Clean background</strong> with subtle gridlines
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <UnifiedPlotter
            series={demoData}
            config={{
              title: "Environmental Data - Enhanced Hover Styling Demo",
              height: "600px",
              xAxis: { title: "Time (hours)" },
              yAxis: { title: "Measurements" },
              showLegend: true,
              responsive: true,
            }}
            interactions={{
              enableHoverOpacity: true,
              enableZoom: true,
              enablePan: true,
              hovermode: "closest",
            }}
            className="hover-demo-plot"
          />
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">
              🎯 Tooltip Features
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Semi-transparent white background</li>
              <li>• Rounded corners (8px)</li>
              <li>• Subtle shadow effects</li>
              <li>• Smooth fade-in animation</li>
              <li>• High contrast text</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">
              ➖ Crosshair Design
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Thin vertical dashed line</li>
              <li>• Cursor-aligned positioning</li>
              <li>• Subtle gray-400 coloring</li>
              <li>• 20px sensitivity radius</li>
              <li>• X-axis only for clarity</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">🔘 Data Points</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 8px base size (enhanced)</li>
              <li>• 30% growth on hover</li>
              <li>• White outer stroke (2px)</li>
              <li>• High opacity (0.9)</li>
              <li>• Smooth size transitions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedHoverDemo;

// =============================================================================
// PERFORMANCE TEST DEMO
// =============================================================================
// Demo component to test and showcase the enhanced performance monitoring
// features of the UnifiedPlotter

import React from "react";
import UnifiedPlotter from "../UnifiedPlotter";
import { generateScientificData } from "../data/generators";

/**
 * Performance test demo with various dataset sizes
 * Tests the performance monitoring and debug panel functionality
 */
export const PerformanceTestDemo: React.FC = () => {
  // Generate different sized datasets for performance testing
  const smallDataset = generateScientificData(100);
  const mediumDataset = generateScientificData(1000);
  const largeDataset = generateScientificData(5000);

  const performanceTestSeries = [
    {
      name: "Small Dataset (100 pts)",
      data: smallDataset,
      type: "scatter" as const,
      mode: "lines+markers" as const,
      line: { color: "#3b82f6", width: 3 },
      marker: { size: 6, color: "#3b82f6" },
    },
    {
      name: "Medium Dataset (1K pts)",
      data: mediumDataset,
      type: "scatter" as const,
      mode: "lines" as const,
      line: { color: "#10b981", width: 2 },
    },
    {
      name: "Large Dataset (5K pts)",
      data: largeDataset,
      type: "scatter" as const,
      mode: "lines" as const,
      line: { color: "#f59e0b", width: 1 },
    },
  ];

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
        }}
      >
        {/* Header Section */}
        <div
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            padding: "24px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              color: "white",
              marginBottom: "8px",
              fontSize: "32px",
              fontWeight: "bold",
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            🚀 Performance Test Demo
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.9)",
              marginBottom: "0",
              fontSize: "16px",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Testing enhanced UnifiedPlotter with performance monitoring,
            progressive loading, and real-time metrics
          </p>
        </div>

        {/* Chart Container */}
        <div style={{ padding: "24px" }}>
          <div
            style={{
              height: "600px",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              position: "relative",
              backgroundColor: "#fafafa",
              overflow: "hidden",
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)",
            }}
          >
            <UnifiedPlotter
              series={performanceTestSeries}
              config={{
                title: "Performance Test - Multi-Dataset Visualization",
                xAxis: { title: "X Values" },
                yAxis: { title: "Y Values" },
              }}
              interactions={{
                enableZoom: true,
                enableHover: true,
                enableHoverOpacity: true,
              }}
              progressiveLoading={{
                enabled: true,
                chunkSize: 500,
                animationDuration: 50,
                showProgress: true,
                showPhase: true,
                showDataStats: true,
              }}
              validation={{
                enabled: true,
                level: "normal",
                showWarnings: true,
                throwOnError: false,
              }}
              debug={false} // Hide debug panel but keep functionality
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceTestDemo;

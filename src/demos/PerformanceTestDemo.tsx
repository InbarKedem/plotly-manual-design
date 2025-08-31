// =============================================================================
// ⚡ PERFORMANCE TEST DEMO - OPTIMIZED FOR LARGE DATASETS
// =============================================================================
// Comprehensive performance testing component showcasing the UnifiedPlotter's
// ability to handle various dataset sizes with monitoring and optimization.
// Following GitHub Copilot standards for high-performance React components.
//
// 🎯 Testing Goals:
// - Performance monitoring across different dataset sizes
// - Memory usage tracking and optimization
// - Debug panel functionality validation
// - Progressive loading demonstration

import React, { useMemo } from "react";
import UnifiedPlotter from "../UnifiedPlotter";
import { generateScientificData } from "../data/generators";
import type { SeriesConfig } from "../types/PlotterTypes";

// =============================================================================
// 📊 DATASET SIZE CONFIGURATIONS - PERFORMANCE TESTING
// =============================================================================

/**
 * Dataset size configuration for comprehensive performance testing
 * Carefully chosen sizes to demonstrate performance characteristics
 */
const DATASET_CONFIGS = {
  small: { size: 100, color: "#3b82f6", label: "Small Dataset" },
  medium: { size: 1000, color: "#10b981", label: "Medium Dataset" },
  large: { size: 5000, color: "#f59e0b", label: "Large Dataset" },
} as const;

/**
 * ⚡ Performance Test Demo Component
 *
 * Showcases UnifiedPlotter performance with datasets of varying sizes.
 * Includes comprehensive performance monitoring and debug capabilities.
 *
 * 🚀 Features:
 * - Multiple dataset size testing (100, 1K, 5K points)
 * - Performance monitoring with detailed metrics
 * - Memory usage tracking and optimization
 * - Progressive loading demonstration
 * - Debug panel with real-time statistics
 *
 * 🎯 Performance Optimizations:
 * - useMemo for expensive data generation
 * - Optimized series configuration
 * - Minimal re-render strategy
 *
 * @returns React component for performance testing demonstration
 */
export const PerformanceTestDemo: React.FC = () => {
  // ==========================================================================
  // 📊 DATA GENERATION - MEMOIZED FOR PERFORMANCE
  // ==========================================================================

  /**
   * 🚀 Generate performance test datasets with memoization
   * Prevents expensive regeneration on each render
   */
  const performanceTestSeries = useMemo((): SeriesConfig[] => {
    // Generate datasets with different sizes for performance testing
    const smallDataset = generateScientificData(DATASET_CONFIGS.small.size);
    const mediumDataset = generateScientificData(DATASET_CONFIGS.medium.size);
    const largeDataset = generateScientificData(DATASET_CONFIGS.large.size);

    return [
      {
        name: `${
          DATASET_CONFIGS.small.label
        } (${DATASET_CONFIGS.small.size.toLocaleString()} pts)`,
        data: smallDataset,
        type: "scatter" as const,
        mode: "lines+markers" as const,
        line: { color: DATASET_CONFIGS.small.color, width: 3 },
        marker: { size: 6, color: DATASET_CONFIGS.small.color },
      },
      {
        name: `${
          DATASET_CONFIGS.medium.label
        } (${DATASET_CONFIGS.medium.size.toLocaleString()} pts)`,
        data: mediumDataset,
        type: "scatter" as const,
        mode: "lines" as const,
        line: { color: DATASET_CONFIGS.medium.color, width: 2 },
      },
      {
        name: `${
          DATASET_CONFIGS.large.label
        } (${DATASET_CONFIGS.large.size.toLocaleString()} pts)`,
        data: largeDataset,
        type: "scatter" as const,
        mode: "lines" as const,
        line: { color: DATASET_CONFIGS.large.color, width: 1 },
      },
    ];
  }, []); // Empty dependency array since we want stable data

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
              fontSize: "18px",
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
              progressiveLoading={{
                enabled: true,
                chunkSize: 500,
                showProgress: true,
                showPhase: true,
                showDataStats: true,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceTestDemo;

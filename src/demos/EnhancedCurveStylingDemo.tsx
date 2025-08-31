import React, { useState } from "react";
import UnifiedPlotter from "../UnifiedPlotter";
import type {
  SeriesConfig,
  CurveColoringConfig,
  CurveLineStyleConfig,
} from "../types/PlotterTypes";

/**
 * Enhanced Curve Styling Demo
 * Demonstrates the three new curve styling features:
 * 1. Curve-by-curve base coloring
 * 2. Curve line style variations
 * 3. Point-based color mapping (existing feature)
 */
const EnhancedCurveStylingDemo: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<
    "curves" | "lines" | "points"
  >("curves");

  // Sample data for multiple curves
  const generateSampleData = () => {
    const curves: SeriesConfig[] = [];

    // Generate 5 different curves with different mathematical functions
    for (let i = 0; i < 5; i++) {
      const data = [];
      for (let x = 0; x <= 100; x += 2) {
        let y;
        let z = Math.random() * 50 + 25; // Random z values for color mapping

        switch (i) {
          case 0:
            y = Math.sin(x * 0.1) * 20 + 50;
            break;
          case 1:
            y = Math.cos(x * 0.08) * 15 + 40;
            break;
          case 2:
            y = Math.log(x + 1) * 10 + 30;
            break;
          case 3:
            y = Math.sqrt(x) * 5 + 20;
            break;
          case 4:
            y = (x * 0.1) ** 1.5 + 10;
            break;
          default:
            y = x * 0.3 + 25;
        }

        data.push({ x, y, z });
      }

      curves.push({
        name: `Curve ${i + 1}`,
        data: data,
        mode: activeFeature === "points" ? "lines+markers" : "lines",
        marker:
          activeFeature === "points"
            ? {
                colorFeature: "z",
                colorScale: "viridis",
                showColorBar: i === 0,
              }
            : undefined,
      });
    }

    return curves;
  };

  const series = generateSampleData();

  // Configuration for curve-by-curve coloring
  const curveColoring: CurveColoringConfig = {
    enabled: activeFeature === "curves",
    colorPalette: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"],
    distribution: "sequential",
  };

  // Configuration for line style variations
  const curveLineStyles: CurveLineStyleConfig = {
    enabled: activeFeature === "lines",
    stylePattern: ["solid", "dash", "dot", "dashdot", "longdash"],
    combineWithColors: true,
  };

  const getFeatureDescription = () => {
    switch (activeFeature) {
      case "curves":
        return "Each curve gets a different base color from the color palette. All points and lines in a curve share the same color.";
      case "lines":
        return "Each curve gets a different line style (solid, dashed, dotted, etc.) to distinguish them visually.";
      case "points":
        return "Individual points are colored based on their Z-value using a color scale, while maintaining the same curve structure.";
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "40px" }}>
        <h1
          style={{
            color: "#2C3E50",
            marginBottom: "15px",
            fontSize: "32px",
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          🎨 Enhanced Curve Styling Features
        </h1>
        <p
          style={{
            color: "#7F8C8D",
            fontSize: "18px",
            lineHeight: "1.6",
            textAlign: "center",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          Explore three powerful ways to style your data visualization curves.
          Switch between features to see how each one affects the appearance of
          multiple data series.
        </p>
      </div>

      {/* Feature Selection Controls */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "25px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => setActiveFeature("curves")}
          style={{
            padding: "12px 20px",
            backgroundColor: activeFeature === "curves" ? "#3498DB" : "#ECF0F1",
            color: activeFeature === "curves" ? "white" : "#2C3E50",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "500",
            transition: "all 0.3s ease",
          }}
        >
          🌈 Curve Base Colors
        </button>

        <button
          onClick={() => setActiveFeature("lines")}
          style={{
            padding: "12px 20px",
            backgroundColor: activeFeature === "lines" ? "#E74C3C" : "#ECF0F1",
            color: activeFeature === "lines" ? "white" : "#2C3E50",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "500",
            transition: "all 0.3s ease",
          }}
        >
          📏 Line Style Patterns
        </button>

        <button
          onClick={() => setActiveFeature("points")}
          style={{
            padding: "12px 20px",
            backgroundColor: activeFeature === "points" ? "#27AE60" : "#ECF0F1",
            color: activeFeature === "points" ? "white" : "#2C3E50",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "500",
            transition: "all 0.3s ease",
          }}
        >
          🎯 Point Color Mapping
        </button>
      </div>

      {/* Feature Description */}
      <div
        style={{
          backgroundColor: "#F8F9FA",
          padding: "20px 25px",
          borderRadius: "10px",
          marginBottom: "30px",
          borderLeft: "5px solid #3498DB",
        }}
      >
        <h3
          style={{
            margin: "0 0 12px 0",
            color: "#2C3E50",
            fontSize: "20px",
            fontWeight: "600",
          }}
        >
          Current Feature:{" "}
          {activeFeature === "curves"
            ? "Curve Base Colors"
            : activeFeature === "lines"
            ? "Line Style Patterns"
            : "Point Color Mapping"}
        </h3>
        <p
          style={{
            margin: 0,
            color: "#5D6D7E",
            fontSize: "16px",
            lineHeight: "1.5",
          }}
        >
          {getFeatureDescription()}
        </p>
      </div>

      {/* Plot Container */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
        <UnifiedPlotter
          series={series}
          config={{
            title: `Enhanced Curve Styling: ${
              activeFeature === "curves"
                ? "Base Colors"
                : activeFeature === "lines"
                ? "Line Styles"
                : "Point Mapping"
            }`,
            xAxis: { title: "X Values" },
            yAxis: { title: "Y Values" },
            height: "650px",
          }}
          curveColoring={curveColoring}
          curveLineStyles={curveLineStyles}
        />
      </div>

      {/* Feature Details */}
      <div
        style={{
          marginTop: "30px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        <div
          style={{
            backgroundColor: "#FFF9E6",
            padding: "25px",
            borderRadius: "10px",
            border: "1px solid #FFE066",
          }}
        >
          <h3
            style={{
              color: "#B8860B",
              marginTop: 0,
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "12px",
            }}
          >
            🌈 Curve Base Colors
          </h3>
          <p
            style={{
              color: "#666",
              fontSize: "15px",
              lineHeight: "1.6",
              margin: 0,
            }}
          >
            Apply different colors to entire curves using gradient distribution
            or custom palettes. Perfect for distinguishing multiple data series
            at a glance.
          </p>
        </div>

        <div
          style={{
            backgroundColor: "#FFE6E6",
            padding: "25px",
            borderRadius: "10px",
            border: "1px solid #FF9999",
          }}
        >
          <h3
            style={{
              color: "#C0392B",
              marginTop: 0,
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "12px",
            }}
          >
            📏 Line Style Patterns
          </h3>
          <p
            style={{
              color: "#666",
              fontSize: "15px",
              lineHeight: "1.6",
              margin: 0,
            }}
          >
            Use different line styles (solid, dashed, dotted, etc.) to
            differentiate curves. Especially useful for black-and-white printing
            or accessibility.
          </p>
        </div>

        <div
          style={{
            backgroundColor: "#E6F9E6",
            padding: "25px",
            borderRadius: "10px",
            border: "1px solid #99CC99",
          }}
        >
          <h3
            style={{
              color: "#27AE60",
              marginTop: 0,
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "12px",
            }}
          >
            🎯 Point Color Mapping
          </h3>
          <p
            style={{
              color: "#666",
              fontSize: "15px",
              lineHeight: "1.6",
              margin: 0,
            }}
          >
            Color individual points based on data values using advanced color
            scales. Ideal for showing additional dimensions in your data
            visualization.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedCurveStylingDemo;

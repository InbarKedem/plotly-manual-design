import React from "react";
import EnhancedGenericPlotter from "./components/EnhancedGenericPlotter";
import type {
  SeriesConfig,
  PlotConfig,
} from "./components/EnhancedGenericPlotter";

const WorkingEnhancedDemo: React.FC = () => {
  // Simple test data without progressive loading
  const generateSimpleData = (name: string, points: number = 50) => {
    return Array.from({ length: points }, (_, i) => {
      const x = i * 10;
      const y = Math.sin(i * 0.1) * 10 + Math.random() * 5;
      const z = Math.abs(y) + Math.random() * 3;
      return {
        x,
        y,
        z,
        text: `${name}<br>X: ${x}<br>Y: ${y.toFixed(2)}<br>Z: ${z.toFixed(2)}`,
      };
    });
  };

  const series: SeriesConfig[] = [
    {
      name: "Enhanced Series 1",
      data: generateSimpleData("Series 1", 30),
      mode: "lines+markers",
      line: {
        width: 3,
        color: "#8b5cf6",
        opacity: 0.8,
      },
      marker: {
        size: 6,
        colorFeature: "z",
        colorScale: "viridis",
        showColorBar: true,
        colorBarTitle: "Z Values",
        opacity: 0.9,
      },
    },
    {
      name: "Enhanced Series 2",
      data: generateSimpleData("Series 2", 30),
      mode: "lines+markers",
      line: {
        width: 2,
        color: "#06b6d4",
        opacity: 0.7,
        dash: "dash",
      },
      marker: {
        size: 4,
        opacity: 0.8,
      },
    },
  ];

  const config: PlotConfig = {
    title: "🚀 Enhanced Generic Plotter Demo",
    xAxis: {
      title: "X Axis",
      showgrid: true,
      gridcolor: "#f3f4f6",
    },
    yAxis: {
      title: "Y Axis",
      showgrid: true,
      gridcolor: "#f3f4f6",
    },
    font: {
      family: "Inter, sans-serif",
      size: 12,
    },
    margin: { l: 80, r: 150, t: 80, b: 60 },
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)",
          color: "white",
          padding: "30px",
          borderRadius: "16px",
          marginBottom: "30px",
          textAlign: "center",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "2.2em" }}>
          🚀 Enhanced Generic Plotter
        </h1>
        <p style={{ margin: "10px 0 0 0", fontSize: "1.1em", opacity: 0.95 }}>
          Working demo with modern features
        </p>
      </div>

      {/* Chart */}
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "16px",
          border: "2px solid #e5e7eb",
          marginBottom: "30px",
        }}
      >
        <EnhancedGenericPlotter
          series={series}
          config={config}
          interactions={{ hovermode: "closest" }}
          style={{ height: "500px" }}
        />
      </div>

      {/* Features */}
      <div
        style={{
          background: "#f8fafc",
          padding: "30px",
          borderRadius: "16px",
        }}
      >
        <h2 style={{ color: "#1e293b", marginBottom: "20px" }}>
          ✨ Enhanced Features
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              border: "2px solid #e5e7eb",
            }}
          >
            <h3 style={{ color: "#8b5cf6", marginBottom: "10px" }}>
              🎨 Modern Colorscales
            </h3>
            <p style={{ margin: 0, color: "#64748b" }}>
              Viridis, Plasma, Turbo, Cividis colorscales with proper color bars
            </p>
          </div>

          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              border: "2px solid #e5e7eb",
            }}
          >
            <h3 style={{ color: "#06b6d4", marginBottom: "10px" }}>
              📊 Advanced Markers
            </h3>
            <p style={{ margin: 0, color: "#64748b" }}>
              Variable sizes, opacity control, and feature-based coloring
            </p>
          </div>

          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              border: "2px solid #e5e7eb",
            }}
          >
            <h3 style={{ color: "#22c55e", marginBottom: "10px" }}>
              🎯 TypeScript
            </h3>
            <p style={{ margin: 0, color: "#64748b" }}>
              Strict typing with modern interfaces and enhanced IntelliSense
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkingEnhancedDemo;

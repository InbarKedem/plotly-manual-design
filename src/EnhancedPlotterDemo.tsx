import React, { useState } from "react";
import {
  ModernScatterExample,
  MultiTypeSeriesExample,
  ThemedProgressiveExample,
  InteractiveFeaturesExample,
  AdvancedClimateExample,
  RealTimeStyleExample,
} from "./EnhancedPlotterExamples";

interface EnhancedExampleConfig {
  name: string;
  component: React.ComponentType;
  description: string;
  features: string[];
  borderColor: string;
  category: "Modern" | "Interactive" | "Performance" | "Advanced";
}

const enhancedExamples: EnhancedExampleConfig[] = [
  {
    name: "Modern Scatter Plot",
    component: ModernScatterExample,
    description:
      "Scientific scatter plot with error bars, modern colorscales, and annotations",
    features: [
      "Viridis colorscale",
      "Error bars",
      "Annotations",
      "Debug panel",
      "Custom hover",
    ],
    borderColor: "#6366f1",
    category: "Modern",
  },
  {
    name: "Multi-Type Series",
    component: MultiTypeSeriesExample,
    description: "Mixed visualization with lines, markers, and filled areas",
    features: [
      "Spline smoothing",
      "Variable marker sizes",
      "Filled areas",
      "Unified hover",
      "Multiple symbols",
    ],
    borderColor: "#8b5cf6",
    category: "Modern",
  },
  {
    name: "Themed Progressive Loading",
    component: ThemedProgressiveExample,
    description: "Large dataset with dark theme and smooth progressive loading",
    features: [
      "1500 points",
      "Dark theme",
      "Turbo colorscale",
      "Data statistics",
      "Smooth animation",
    ],
    borderColor: "#06b6d4",
    category: "Performance",
  },
  {
    name: "Interactive Features",
    component: InteractiveFeaturesExample,
    description: "Full interactivity showcase with shapes and event handlers",
    features: [
      "Event handlers",
      "Shapes overlay",
      "Multiple interactions",
      "Custom annotations",
      "Selection tools",
    ],
    borderColor: "#ef4444",
    category: "Interactive",
  },
  {
    name: "Advanced Climate Data",
    component: AdvancedClimateExample,
    description:
      "Atmospheric data visualization with gradient lines and multi-parameter coloring",
    features: [
      "Realistic data model",
      "Gradient lines",
      "Multi-parameter",
      "Advanced tooltips",
      "Climate simulation",
    ],
    borderColor: "#22c55e",
    category: "Advanced",
  },
  {
    name: "Real-time Style",
    component: RealTimeStyleExample,
    description:
      "Signal processing visualization with smooth curves and dark theme",
    features: [
      "Spline smoothing",
      "Rainbow colorscale",
      "Dark UI",
      "Monospace font",
      "Signal processing",
    ],
    borderColor: "#f59e0b",
    category: "Advanced",
  },
];

const categoryColors = {
  Modern: "#6366f1",
  Interactive: "#ef4444",
  Performance: "#06b6d4",
  Advanced: "#22c55e",
};

const EnhancedGenericPlotterDemo: React.FC = () => {
  const [activeExample, setActiveExample] = useState<number | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("All");

  const filteredExamples =
    filterCategory === "All"
      ? enhancedExamples
      : enhancedExamples.filter((ex) => ex.category === filterCategory);

  return (
    <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Hero Section */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "40px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "40px",
          borderRadius: "16px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><polygon fill="rgba(255,255,255,0.05)" points="0,0 1000,300 1000,1000 0,700"/></svg>\')',
            backgroundSize: "cover",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <h1
            style={{
              margin: 0,
              fontSize: "3em",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            🚀 Enhanced Generic Plotter
          </h1>
          <p style={{ margin: "0 0 20px 0", fontSize: "1.3em", opacity: 0.95 }}>
            Next-generation data visualization with modern features and best
            practices
          </p>
          <div
            style={{
              display: "inline-flex",
              gap: "20px",
              fontSize: "0.9em",
              opacity: 0.9,
            }}
          >
            <span>✨ Modern UI/UX</span>
            <span>⚡ High Performance</span>
            <span>🎨 Advanced Theming</span>
            <span>🔧 Full Interactivity</span>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div style={{ marginBottom: "30px", textAlign: "center" }}>
        <div
          style={{
            display: "inline-flex",
            gap: "10px",
            padding: "8px",
            background: "#f8fafc",
            borderRadius: "12px",
            border: "2px solid #e2e8f0",
          }}
        >
          {["All", ...Object.keys(categoryColors)].map((category) => (
            <button
              key={category}
              onClick={() => setFilterCategory(category)}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                background:
                  filterCategory === category
                    ? category === "All"
                      ? "#64748b"
                      : categoryColors[category as keyof typeof categoryColors]
                    : "transparent",
                color: filterCategory === category ? "white" : "#64748b",
                fontWeight: filterCategory === category ? "600" : "normal",
                cursor: "pointer",
                transition: "all 0.2s ease",
                fontSize: "14px",
              }}
            >
              {category}{" "}
              {category !== "All" &&
                `(${
                  enhancedExamples.filter((ex) => ex.category === category)
                    .length
                })`}
            </button>
          ))}
        </div>
      </div>

      {/* Enhanced Features Grid */}
      <div
        style={{
          background: "#f8fafc",
          padding: "30px",
          borderRadius: "16px",
          marginBottom: "40px",
          border: "2px solid #e2e8f0",
        }}
      >
        <h2
          style={{
            color: "#1e293b",
            marginBottom: "25px",
            textAlign: "center",
          }}
        >
          🎯 Enhanced Features & Capabilities
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {[
            {
              icon: "🎨",
              title: "Modern Colorscales",
              desc: "Viridis, Plasma, Turbo, Cividis, and Rainbow colorscales",
            },
            {
              icon: "📊",
              title: "Error Bars & Annotations",
              desc: "Statistical error bars and interactive annotations",
            },
            {
              icon: "🎭",
              title: "Advanced Theming",
              desc: "Dark mode, custom themes, and typography control",
            },
            {
              icon: "⚡",
              title: "Smart Progressive Loading",
              desc: "Chunked loading with statistics and memory optimization",
            },
            {
              icon: "🖱️",
              title: "Full Interactivity",
              desc: "Click, hover, zoom, pan, and selection event handlers",
            },
            {
              icon: "🔧",
              title: "Multiple Chart Types",
              desc: "Scatter, line, bar, histogram, box, violin plots",
            },
            {
              icon: "📐",
              title: "Shapes & Overlays",
              desc: "Rectangles, circles, lines, and custom shapes",
            },
            {
              icon: "🎯",
              title: "Debug & Analytics",
              desc: "Real-time debug panel with performance metrics",
            },
          ].map((feature, index) => (
            <div
              key={index}
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "12px",
                border: "2px solid #e5e7eb",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0px)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>
                {feature.icon}
              </div>
              <h3
                style={{
                  margin: "0 0 8px 0",
                  color: "#1e293b",
                  fontSize: "16px",
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                  fontSize: "14px",
                  lineHeight: "1.4",
                }}
              >
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Examples Grid */}
      <h2
        style={{ color: "#1e293b", marginBottom: "25px", textAlign: "center" }}
      >
        📈 Interactive Examples ({filteredExamples.length})
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(650px, 1fr))",
          gap: "30px",
        }}
      >
        {filteredExamples.map((example, index) => {
          const ExampleComponent = example.component;
          const isActive = activeExample === index;
          const categoryColor = categoryColors[example.category];

          return (
            <div
              key={index}
              style={{
                border: `3px solid ${example.borderColor}`,
                borderRadius: "16px",
                overflow: "hidden",
                background: "white",
                transition: "all 0.3s ease",
                transform: isActive ? "scale(1.02)" : "scale(1)",
                boxShadow: isActive
                  ? `0 12px 35px rgba(0,0,0,0.15)`
                  : "0 4px 15px rgba(0,0,0,0.08)",
              }}
            >
              {/* Header with Category Badge */}
              <div
                style={{
                  background: `linear-gradient(135deg, ${example.borderColor}, ${categoryColor})`,
                  color: "white",
                  padding: "20px",
                  cursor: "pointer",
                  position: "relative",
                }}
                onClick={() => setActiveExample(isActive ? null : index)}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "15px",
                    background: "rgba(255,255,255,0.2)",
                    padding: "4px 10px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                >
                  {example.category}
                </div>

                <h3
                  style={{
                    margin: "0 0 8px 0",
                    fontSize: "1.4em",
                    fontWeight: "700",
                  }}
                >
                  {example.name}
                  <span
                    style={{
                      float: "right",
                      fontSize: "0.7em",
                      marginTop: "4px",
                    }}
                  >
                    {isActive ? "🔽" : "▶️"}
                  </span>
                </h3>
                <p
                  style={{
                    margin: 0,
                    opacity: 0.95,
                    fontSize: "1em",
                    lineHeight: "1.4",
                  }}
                >
                  {example.description}
                </p>
              </div>

              {/* Features Tags */}
              <div
                style={{
                  padding: "16px 20px",
                  background: "#f8fafc",
                  borderBottom: `2px solid ${example.borderColor}20`,
                }}
              >
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {example.features.map((feature, fIndex) => (
                    <span
                      key={fIndex}
                      style={{
                        background: "white",
                        padding: "6px 12px",
                        borderRadius: "16px",
                        fontSize: "12px",
                        border: `2px solid ${example.borderColor}30`,
                        color: example.borderColor,
                        fontWeight: "600",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                      }}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Chart Container */}
              <div
                style={{
                  height: isActive ? "550px" : "450px",
                  padding: "20px",
                  transition: "height 0.3s ease",
                  overflow: "hidden",
                  background: "#ffffff",
                }}
              >
                <ExampleComponent />
              </div>
            </div>
          );
        })}
      </div>

      {/* Usage Guide */}
      <div
        style={{
          background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
          color: "white",
          padding: "40px",
          borderRadius: "16px",
          marginTop: "50px",
        }}
      >
        <h2 style={{ marginBottom: "25px", textAlign: "center" }}>
          🛠️ Enhanced Usage Guide
        </h2>

        <div
          style={{
            background: "rgba(255,255,255,0.08)",
            padding: "25px",
            borderRadius: "12px",
            fontFamily: "Monaco, Menlo, monospace",
            fontSize: "14px",
            overflow: "auto",
            marginBottom: "30px",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <pre
            style={{ margin: 0, whiteSpace: "pre-wrap", color: "#e2e8f0" }}
          >{`import EnhancedGenericPlotter from "./EnhancedGenericPlotter";
import type { SeriesConfig, PlotConfig, ThemeConfig } from "./EnhancedGenericPlotter";

// Advanced configuration
const series: SeriesConfig[] = [{
  name: "Enhanced Data",
  data: myDataPoints, // { x, y, z, text, error_x, error_y }
  mode: "lines+markers",
  type: "scatter", // scatter, scattergl, bar, histogram, etc.
  line: { width: 3, shape: "spline", smoothing: 0.5 },
  marker: { 
    size: 8, 
    colorFeature: "z", 
    colorScale: "viridis",
    showColorBar: true 
  },
  errorBars: { 
    x: { type: "data", visible: true },
    y: { type: "data", visible: true } 
  },
  fill: "tozeroy",
  gradientLines: true
}];

const config: PlotConfig = {
  title: "My Enhanced Plot",
  xAxis: { 
    title: "X Axis", 
    type: "linear",
    showgrid: true,
    gridcolor: "#e5e7eb" 
  },
  yAxis: { 
    title: "Y Axis",
    showgrid: true 
  },
  annotations: [{
    x: 50, y: 100,
    text: "Important Point",
    showarrow: true
  }],
  shapes: [{
    type: "rect",
    x0: 10, y0: 20, x1: 30, y1: 40,
    fillcolor: "rgba(255,0,0,0.2)"
  }]
};

const theme: ThemeConfig = {
  darkMode: true,
  primary: "#8b5cf6",
  colorPalette: ["#8b5cf6", "#06b6d4", "#10b981"]
};

// Use the enhanced component
<EnhancedGenericPlotter
  series={series}
  config={config}
  theme={theme}
  interactions={{
    enableZoom: true,
    hovermode: "closest",
    dragmode: "zoom"
  }}
  progressiveLoading={{
    enabled: true,
    chunkSize: 100,
    showProgress: true,
    showDataStats: true
  }}
  onPlotClick={(data) => console.log("Clicked:", data)}
  onPlotHover={(data) => console.log("Hovered:", data)}
  debug={true}
/>`}</pre>
        </div>

        {/* Feature Comparison */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          <div>
            <h4 style={{ marginBottom: "15px", color: "#06b6d4" }}>
              📊 Chart Types:
            </h4>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                color: "#cbd5e1",
              }}
            >
              <li>• scatter / scattergl</li>
              <li>• bar / histogram</li>
              <li>• box / violin</li>
              <li>• All Plotly types</li>
            </ul>
          </div>

          <div>
            <h4 style={{ marginBottom: "15px", color: "#8b5cf6" }}>
              🎨 Modern Colorscales:
            </h4>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                color: "#cbd5e1",
              }}
            >
              <li>• viridis / plasma</li>
              <li>• turbo / cividis</li>
              <li>• rainbow / custom</li>
              <li>• ColorBrewer compatible</li>
            </ul>
          </div>

          <div>
            <h4 style={{ marginBottom: "15px", color: "#22c55e" }}>
              ⚡ Performance:
            </h4>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                color: "#cbd5e1",
              }}
            >
              <li>• Progressive loading</li>
              <li>• Memory optimization</li>
              <li>• Animation frames</li>
              <li>• WebGL support</li>
            </ul>
          </div>

          <div>
            <h4 style={{ marginBottom: "15px", color: "#f59e0b" }}>
              🔧 Advanced Features:
            </h4>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                color: "#cbd5e1",
              }}
            >
              <li>• Error bars</li>
              <li>• Annotations & shapes</li>
              <li>• Event handlers</li>
              <li>• Debug panel</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedGenericPlotterDemo;

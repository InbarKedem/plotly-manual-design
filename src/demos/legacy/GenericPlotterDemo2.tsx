import React, { useState } from "react";
import {
  SimpleScatterExample,
  MultipleLineStylesExample,
  GradientLinesExample,
  ProgressiveLoadingExample,
  AllFeaturesExample,
  TemperatureHeightExample,
} from "./GenericPlotterExamples";

interface ExampleConfig {
  name: string;
  component: React.ComponentType;
  description: string;
  features: string[];
  borderColor: string;
}

const examples: ExampleConfig[] = [
  {
    name: "Simple Scatter Plot",
    component: SimpleScatterExample,
    description: "Basic scatter plot with third-feature color mapping",
    features: [
      "Markers only",
      "Color by Z-value",
      "Color bar",
      "Hot colorscale",
    ],
    borderColor: "#3498db",
  },
  {
    name: "Multiple Line Styles",
    component: MultipleLineStylesExample,
    description: "Different line styles and colors per series",
    features: [
      "5 line styles",
      "Lines + markers",
      "Custom colors",
      "Bezier curves",
    ],
    borderColor: "#e74c3c",
  },
  {
    name: "Gradient Lines",
    component: GradientLinesExample,
    description: "Speed-colored gradient line segments",
    features: [
      "Gradient lines",
      "Speed coloring",
      "Multiple series",
      "Custom colorscales",
    ],
    borderColor: "#27ae60",
  },
  {
    name: "Progressive Loading",
    component: ProgressiveLoadingExample,
    description: "High-density data with chunked loading",
    features: [
      "2000 points",
      "Progressive loading",
      "Loading indicator",
      "Temperature coloring",
    ],
    borderColor: "#f39c12",
  },
  {
    name: "All Features Demo",
    component: AllFeaturesExample,
    description: "Comprehensive demo with all available features",
    features: [
      "Multi-climate",
      "Gradient + solid lines",
      "Multiple colorscales",
      "Progressive loading",
    ],
    borderColor: "#9b59b6",
  },
  {
    name: "Temperature Profile",
    component: TemperatureHeightExample,
    description: "Atmospheric temperature vs height (realistic data)",
    features: [
      "500 points",
      "Pressure coloring",
      "Physical model",
      "Custom colorscale",
    ],
    borderColor: "#1abc9c",
  },
];

const GenericPlotterDemo: React.FC = () => {
  const [activeExample, setActiveExample] = useState<number | null>(null);

  return (
    <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>
      <div
        style={{
          textAlign: "center",
          marginBottom: "40px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "30px",
          borderRadius: "12px",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "2.5em", fontWeight: "bold" }}>
          🚀 Generic Plotter Component
        </h1>
        <p style={{ margin: "10px 0 0 0", fontSize: "1.2em", opacity: 0.9 }}>
          Universal plotting component with all features from your existing
          graphs
        </p>
      </div>

      {/* Feature Overview */}
      <div
        style={{
          background: "#f8f9fa",
          padding: "25px",
          borderRadius: "12px",
          marginBottom: "30px",
        }}
      >
        <h2 style={{ color: "#2c3e50", marginBottom: "20px" }}>
          ✨ Key Features
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "15px",
          }}
        >
          {[
            "🎨 Multiple line styles & colors",
            "🌈 Third-feature color mapping",
            "📈 Gradient line segments",
            "⚡ Progressive loading for big data",
            "🎛️ Configurable markers & lines",
            "📊 Multiple series support",
            "🔧 Bezier curve generation",
            "📐 Custom colorscales & colorbars",
          ].map((feature, index) => (
            <div
              key={index}
              style={{
                background: "white",
                padding: "12px",
                borderRadius: "8px",
                border: "2px solid #e3f2fd",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              {feature}
            </div>
          ))}
        </div>
      </div>

      {/* Examples Grid */}
      <h2 style={{ color: "#2c3e50", marginBottom: "25px" }}>
        📊 Interactive Examples
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(600px, 1fr))",
          gap: "30px",
        }}
      >
        {examples.map((example, index) => {
          const ExampleComponent = example.component;
          const isActive = activeExample === index;

          return (
            <div
              key={index}
              style={{
                border: `3px solid ${example.borderColor}`,
                borderRadius: "12px",
                overflow: "hidden",
                background: "white",
                transition: "all 0.3s ease",
                transform: isActive ? "scale(1.02)" : "scale(1)",
                boxShadow: isActive
                  ? `0 8px 25px rgba(0,0,0,0.15)`
                  : "0 4px 15px rgba(0,0,0,0.1)",
              }}
            >
              {/* Header */}
              <div
                style={{
                  background: example.borderColor,
                  color: "white",
                  padding: "15px 20px",
                  cursor: "pointer",
                }}
                onClick={() => setActiveExample(isActive ? null : index)}
              >
                <h3 style={{ margin: 0, fontSize: "1.3em" }}>
                  {example.name}
                  <span style={{ float: "right", fontSize: "0.8em" }}>
                    {isActive ? "🔽" : "▶️"}
                  </span>
                </h3>
                <p
                  style={{
                    margin: "5px 0 0 0",
                    opacity: 0.9,
                    fontSize: "0.9em",
                  }}
                >
                  {example.description}
                </p>
              </div>

              {/* Features List */}
              <div
                style={{
                  padding: "15px 20px",
                  background: "#f8f9fa",
                  borderBottom: `1px solid ${example.borderColor}30`,
                }}
              >
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {example.features.map((feature, fIndex) => (
                    <span
                      key={fIndex}
                      style={{
                        background: "white",
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        border: `1px solid ${example.borderColor}50`,
                        color: example.borderColor,
                        fontWeight: "500",
                      }}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Chart */}
              <div
                style={{
                  height: isActive ? "500px" : "400px",
                  padding: "15px",
                  transition: "height 0.3s ease",
                  overflow: "hidden",
                }}
              >
                <ExampleComponent />
              </div>
            </div>
          );
        })}
      </div>

      {/* Usage Instructions */}
      <div
        style={{
          background: "#2c3e50",
          color: "white",
          padding: "30px",
          borderRadius: "12px",
          marginTop: "40px",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>🛠️ Usage Instructions</h2>
        <div
          style={{
            background: "rgba(255,255,255,0.1)",
            padding: "20px",
            borderRadius: "8px",
            fontFamily: "monospace",
            fontSize: "14px",
            overflow: "auto",
          }}
        >
          <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
            {`import GenericPlotter from "./GenericPlotter";
import type { SeriesConfig, PlotConfig } from "./GenericPlotter";

// Define your data series
const series: SeriesConfig[] = [
  {
    name: "My Data",
    data: [ { x: 1, y: 2, z: 10 }, { x: 2, y: 4, z: 20 } ],
    mode: "lines+markers",
    line: { width: 3, dash: "solid", color: "blue" },
    marker: {
      size: 6,
      colorFeature: "z", // Color by z-values
      colorScale: "Hot",
      showColorBar: true,
    },
    gradientLines: true, // Optional gradient effect
  }
];

// Configure the plot
const config: PlotConfig = {
  title: "My Plot",
  xAxisTitle: "X Axis", 
  yAxisTitle: "Y Axis",
};

// Use the component
<GenericPlotter 
  series={series} 
  config={config} 
  progressiveLoading={{
    enabled: true,
    chunkSize: 100,
    showProgress: true
  }}
/>`}
          </pre>
        </div>

        <div
          style={{
            marginTop: "20px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "15px",
          }}
        >
          <div>
            <h4 style={{ marginBottom: "10px", color: "#3498db" }}>
              📊 Supported Modes:
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li>• "lines" - Lines only</li>
              <li>• "markers" - Markers only</li>
              <li>• "lines+markers" - Both</li>
            </ul>
          </div>

          <div>
            <h4 style={{ marginBottom: "10px", color: "#e74c3c" }}>
              🎨 Line Styles:
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li>• "solid"</li>
              <li>• "dash"</li>
              <li>• "dot"</li>
              <li>• "dashdot"</li>
              <li>• "longdash"</li>
            </ul>
          </div>

          <div>
            <h4 style={{ marginBottom: "10px", color: "#27ae60" }}>
              🌈 Colorscales:
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li>• "Hot"</li>
              <li>• "Viridis"</li>
              <li>• "Jet"</li>
              <li>• "RdBu"</li>
              <li>• Custom arrays</li>
            </ul>
          </div>

          <div>
            <h4 style={{ marginBottom: "10px", color: "#f39c12" }}>
              ⚡ Special Features:
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li>• Progressive loading</li>
              <li>• Gradient lines</li>
              <li>• Third-feature coloring</li>
              <li>• Custom colorbars</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenericPlotterDemo;

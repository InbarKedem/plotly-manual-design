import React, { useState, useMemo } from "react";
import UnifiedPlotter from "./UnifiedPlotter";
import type { SeriesConfig } from "./types/PlotterTypes";
import {
  generateData,
  generateClimateData,
  generateFuelData,
  generateScientificData,
  generateLargeDataset,
  generateMultiSeriesData,
  createSeriesFromData,
  createMultiSeriesChart,
  createFuelConsumptionChart,
  generateMultiVariantData,
  PRESET_THEMES,
  PRESET_CONFIGS,
  PRESET_INTERACTIONS,
  PRESET_PROGRESSIVE,
  combineConfigs,
  getColorPalette,
} from "./PlotterUtils";

// =============================================================================
// EXAMPLE COMPONENTS
// =============================================================================

const BasicScatterExample: React.FC = () => {
  const data = useMemo(
    () =>
      generateData("Basic Scatter", {
        count: 100,
        xRange: [0, 100],
        yRange: [0, 100],
        addNoise: true,
        pattern: "linear",
      }),
    []
  );

  const series: SeriesConfig[] = useMemo(
    () => [
      createSeriesFromData(data, {
        name: "Basic Data",
        mode: "markers",
        marker: {
          size: 8,
          colorFeature: "z",
          colorScale: "viridis",
          showColorBar: true,
          colorBarTitle: "Z Values",
        },
      }),
    ],
    [data]
  );

  return (
    <UnifiedPlotter
      series={series}
      config={PRESET_CONFIGS.basic}
      theme={PRESET_THEMES.light}
      interactions={PRESET_INTERACTIONS.basic}
    />
  );
};

const ClimateDataExample: React.FC = () => {
  const data = useMemo(() => generateClimateData(150), []);

  const series: SeriesConfig[] = useMemo(
    () => [
      createSeriesFromData(data, {
        name: "Atmospheric Temperature",
        mode: "lines+markers",
        line: { width: 3, shape: "spline", smoothing: 0.5 },
        marker: {
          size: 6,
          colorFeature: "speed",
          colorScale: "plasma",
          showColorBar: true,
          colorBarTitle: "Wind Speed (km/h)",
        },
        errorBars: {
          y: { visible: true, type: "data" as const },
        },
      }),
    ],
    [data]
  );

  const config = useMemo(
    () =>
      combineConfigs(PRESET_CONFIGS.climate, {
        title: "Atmospheric Temperature vs Altitude",
        xAxis: { title: "Altitude (m)" },
        yAxis: { title: "Temperature (°C)" },
      }),
    []
  );

  return (
    <UnifiedPlotter
      series={series}
      config={config}
      theme={PRESET_THEMES.light}
      interactions={PRESET_INTERACTIONS.scientific}
      progressiveLoading={PRESET_PROGRESSIVE.smooth}
    />
  );
};

const FuelConsumptionExample: React.FC = () => {
  const data = useMemo(() => generateFuelData(200), []);

  const series: SeriesConfig[] = useMemo(
    () => [
      createSeriesFromData(data, {
        name: "Fuel Consumption",
        mode: "lines+markers",
        line: { width: 2, dash: "solid" },
        marker: {
          size: 5,
          colorFeature: "temperature",
          colorScale: "turbo",
          showColorBar: true,
          colorBarTitle: "Temperature (°C)",
        },
        gradientLines: true,
      }),
    ],
    [data]
  );

  const config = useMemo(
    () =>
      combineConfigs(PRESET_CONFIGS.basic, {
        title: "Vehicle Fuel Consumption Analysis",
        xAxis: { title: "Distance/Altitude (m)" },
        yAxis: { title: "Fuel Consumption (L/100km)" },
      }),
    []
  );

  return (
    <UnifiedPlotter
      series={series}
      config={config}
      theme={PRESET_THEMES.light}
      interactions={PRESET_INTERACTIONS.basic}
      progressiveLoading={PRESET_PROGRESSIVE.fast}
    />
  );
};

const MultiSeriesExample: React.FC = () => {
  const seriesData = useMemo(() => generateMultiSeriesData(4, 80), []);
  const colors = useMemo(() => getColorPalette("vibrant", 4), []);

  const series: SeriesConfig[] = useMemo(
    () =>
      seriesData.map((s, index) =>
        createSeriesFromData(s.data, {
          name: s.name,
          mode: "lines+markers",
          line: {
            width: 2 + index,
            color: colors[index],
            dash: index % 2 === 0 ? "solid" : "dash",
          },
          marker: {
            size: 6,
            color: colors[index],
            symbol: ["circle", "square", "diamond", "triangle-up"][index],
          },
        })
      ),
    [seriesData, colors]
  );

  return (
    <UnifiedPlotter
      series={series}
      config={combineConfigs(PRESET_CONFIGS.basic, {
        title: "Multi-Series Comparison",
        legendPosition: { x: 1.05, y: 1 },
      })}
      theme={PRESET_THEMES.vibrant}
      interactions={PRESET_INTERACTIONS.scientific}
    />
  );
};

const LargeDatasetExample: React.FC = () => {
  const data = useMemo(() => generateLargeDataset(2000), []);

  const series: SeriesConfig[] = useMemo(
    () => [
      createSeriesFromData(data, {
        name: "Large Dataset",
        mode: "markers",
        marker: {
          size: 4,
          colorFeature: "z",
          colorScale: "cividis",
          showColorBar: true,
          opacity: 0.7,
        },
      }),
    ],
    [data]
  );

  return (
    <UnifiedPlotter
      series={series}
      config={combineConfigs(PRESET_CONFIGS.performance, {
        title: "Large Dataset Performance Demo (2000 points)",
      })}
      theme={PRESET_THEMES.dark}
      interactions={PRESET_INTERACTIONS.basic}
      progressiveLoading={PRESET_PROGRESSIVE.detailed}
      debug={true}
    />
  );
};

const ScientificExample: React.FC = () => {
  const data = useMemo(() => generateScientificData(300), []);

  const series: SeriesConfig[] = useMemo(
    () => [
      createSeriesFromData(data, {
        name: "Scientific Measurements",
        mode: "lines+markers",
        type: "scatter",
        line: { width: 2, shape: "spline", smoothing: 0.3 },
        marker: {
          size: [6, 8, 7, 9, 6, 10], // Variable sizes
          colorFeature: "frequency",
          colorScale: "rainbow",
          showColorBar: true,
          colorBarTitle: "Frequency (Hz)",
          symbol: "diamond",
        },
        errorBars: {
          x: { visible: true, type: "data" as const },
          y: { visible: true, type: "data" as const },
        },
      }),
    ],
    [data]
  );

  const config = useMemo(
    () =>
      combineConfigs(PRESET_CONFIGS.scientific, {
        title: "Scientific Data with Error Bars",
        annotations: [
          {
            x: 50,
            y: 25,
            text: "Peak Region",
            showarrow: true,
            arrowhead: 2,
            ax: 20,
            ay: -30,
          },
        ],
        shapes: [
          {
            type: "rect",
            x0: 40,
            y0: -60,
            x1: 60,
            y1: 60,
            fillcolor: "rgba(255, 0, 0, 0.1)",
            line: { color: "rgba(255, 0, 0, 0.5)" },
          },
        ],
      }),
    []
  );

  return (
    <UnifiedPlotter
      series={series}
      config={config}
      theme={PRESET_THEMES.scientific}
      interactions={PRESET_INTERACTIONS.scientific}
      onPlotClick={(data) => console.log("Plot clicked:", data)}
      onPlotHover={(data) => console.log("Plot hovered:", data)}
      debug={true}
    />
  );
};

const ComplexFuelChartExample: React.FC = () => {
  const chartData = useMemo(() => createFuelConsumptionChart(), []);

  return (
    <UnifiedPlotter
      series={chartData.series}
      config={chartData.config}
      theme={chartData.theme}
      interactions={chartData.interactions}
      progressiveLoading={chartData.progressiveLoading}
      debug={false}
    />
  );
};

const CustomMultiSeriesExample: React.FC = () => {
  const chartData = useMemo(() => {
    // Example: Create a custom multi-variant chart
    const variants = generateMultiVariantData(
      {
        xRange: [0, 100],
        yRange: [0, 1000],
        count: 80,
      },
      [
        {
          name: "Linear Growth",
          xFunction: (t) => t,
          yFunction: (t) => t,
          color: "#3b82f6",
          style: "solid",
          noiseLevel: 0.05,
        },
        {
          name: "Exponential",
          xFunction: (t) => t,
          yFunction: (t) => Math.pow(t, 2),
          color: "#ef4444",
          style: "dash",
          noiseLevel: 0.03,
        },
        {
          name: "Logarithmic",
          xFunction: (t) => t,
          yFunction: (t) => Math.log(1 + t * 9) / Math.log(10),
          color: "#10b981",
          style: "dot",
          noiseLevel: 0.04,
        },
      ]
    );

    return createMultiSeriesChart({
      title: "Custom Multi-Variant Analysis",
      subtitle: "Comparison of Different Growth Patterns",
      xAxis: { title: "Time", unit: "units" },
      yAxis: { title: "Value", unit: "measurement" },
      groups: [
        {
          name: "Growth Patterns",
          baseColor: "#6366f1",
          variants: variants,
        },
      ],
      theme: "light",
      interactions: "scientific",
    });
  }, []);

  return (
    <UnifiedPlotter
      series={chartData.series}
      config={chartData.config}
      theme={chartData.theme}
      interactions={chartData.interactions}
      debug={false}
    />
  );
};

// =============================================================================
// EXAMPLE REGISTRY
// =============================================================================

interface ExampleConfig {
  name: string;
  component: React.ComponentType;
  description: string;
  features: string[];
  category: "Basic" | "Advanced" | "Performance" | "Scientific";
  borderColor: string;
}

const EXAMPLES: ExampleConfig[] = [
  {
    name: "Basic Scatter Plot",
    component: BasicScatterExample,
    description:
      "Simple scatter plot with color mapping and hover interactions",
    features: [
      "Color mapping",
      "Hover effects",
      "Viridis colorscale",
      "Basic interactions",
    ],
    category: "Basic",
    borderColor: "#3b82f6",
  },
  {
    name: "Climate Data Visualization",
    component: ClimateDataExample,
    description:
      "Atmospheric temperature vs altitude with error bars and progressive loading",
    features: [
      "Spline smoothing",
      "Error bars",
      "Progressive loading",
      "Plasma colorscale",
    ],
    category: "Advanced",
    borderColor: "#22c55e",
  },
  {
    name: "Fuel Consumption Analysis",
    component: FuelConsumptionExample,
    description:
      "Vehicle fuel consumption with gradient lines and temperature coloring",
    features: [
      "Gradient lines",
      "Temperature mapping",
      "Turbo colorscale",
      "Fast loading",
    ],
    category: "Advanced",
    borderColor: "#f59e0b",
  },
  {
    name: "Multi-Series Comparison",
    component: MultiSeriesExample,
    description: "Multiple data series with different patterns and styling",
    features: [
      "Multiple series",
      "Custom symbols",
      "Pattern variations",
      "Vibrant theme",
    ],
    category: "Basic",
    borderColor: "#ec4899",
  },
  {
    name: "Large Dataset Performance",
    component: LargeDatasetExample,
    description:
      "Performance demo with 2000 points, dark theme, and debug panel",
    features: [
      "2000 points",
      "Dark theme",
      "Debug panel",
      "Progressive loading",
    ],
    category: "Performance",
    borderColor: "#8b5cf6",
  },
  {
    name: "Scientific Measurements",
    component: ScientificExample,
    description:
      "Advanced scientific plot with error bars, annotations, and shapes",
    features: [
      "Error bars",
      "Annotations",
      "Shapes overlay",
      "Variable markers",
    ],
    category: "Scientific",
    borderColor: "#06b6d4",
  },
  {
    name: "Complex Fuel Consumption Chart",
    component: ComplexFuelChartExample,
    description:
      "Recreation of the complex multi-climate fuel consumption chart with 12 curves",
    features: [
      "Multi-climate data",
      "3 variants per climate",
      "Mixed line styles",
      "Temperature coloring",
    ],
    category: "Advanced",
    borderColor: "#f97316",
  },
  {
    name: "Custom Multi-Variant Analysis",
    component: CustomMultiSeriesExample,
    description:
      "Demonstrates the generic multi-series function with custom growth patterns",
    features: [
      "Generic function usage",
      "Multiple growth patterns",
      "Custom styling",
      "Flexible configuration",
    ],
    category: "Advanced",
    borderColor: "#84cc16",
  },
  {
    name: "Complex Fuel Chart",
    component: ComplexFuelChartExample,
    description:
      "Advanced fuel consumption chart with multiple series and interactions",
    features: [
      "Custom chart creation",
      "Multiple series",
      "Interactive legend",
      "Progressive loading",
    ],
    category: "Advanced",
    borderColor: "#f43f5e",
  },
  {
    name: "Custom Multi-Series Example",
    component: CustomMultiSeriesExample,
    description:
      "Demonstration of custom multi-variant chart with scientific interactions",
    features: [
      "Multi-variant data",
      "Customizable series",
      "Scientific interactions",
      "Light theme",
    ],
    category: "Scientific",
    borderColor: "#3b82f6",
  },
];

// =============================================================================
// MAIN DEMO COMPONENT
// =============================================================================

const UnifiedDemo: React.FC = () => {
  const [activeExample, setActiveExample] = useState<number | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("All");

  const categories = ["All", "Basic", "Advanced", "Performance", "Scientific"];
  const categoryColors = {
    Basic: "#3b82f6",
    Advanced: "#22c55e",
    Performance: "#8b5cf6",
    Scientific: "#06b6d4",
  };

  const filteredExamples =
    filterCategory === "All"
      ? EXAMPLES
      : EXAMPLES.filter((ex) => ex.category === filterCategory);

  return (
    <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header */}
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
            🚀 Unified Plotter
          </h1>
          <p style={{ margin: "0 0 20px 0", fontSize: "1.3em", opacity: 0.95 }}>
            Modern data visualization with unified functionality and best
            practices
          </p>
          <div
            style={{
              display: "inline-flex",
              gap: "20px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                background: "rgba(255,255,255,0.2)",
                padding: "8px 16px",
                borderRadius: "20px",
                fontSize: "14px",
              }}
            >
              ⚡ Progressive Loading
            </span>
            <span
              style={{
                background: "rgba(255,255,255,0.2)",
                padding: "8px 16px",
                borderRadius: "20px",
                fontSize: "14px",
              }}
            >
              🎨 Modern Colorscales
            </span>
            <span
              style={{
                background: "rgba(255,255,255,0.2)",
                padding: "8px 16px",
                borderRadius: "20px",
                fontSize: "14px",
              }}
            >
              📊 Multiple Chart Types
            </span>
            <span
              style={{
                background: "rgba(255,255,255,0.2)",
                padding: "8px 16px",
                borderRadius: "20px",
                fontSize: "14px",
              }}
            >
              🔧 Debug Tools
            </span>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div style={{ marginBottom: "30px", textAlign: "center" }}>
        <h3 style={{ marginBottom: "15px", color: "#1e293b" }}>
          Filter by Category
        </h3>
        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilterCategory(category)}
              style={{
                padding: "8px 16px",
                borderRadius: "20px",
                border: "2px solid",
                borderColor:
                  filterCategory === category
                    ? category === "All"
                      ? "#64748b"
                      : categoryColors[category as keyof typeof categoryColors]
                    : "transparent",
                background:
                  filterCategory === category
                    ? category === "All"
                      ? "#64748b"
                      : categoryColors[category as keyof typeof categoryColors]
                    : "#f8fafc",
                color: filterCategory === category ? "white" : "#64748b",
                fontWeight: filterCategory === category ? "600" : "normal",
                cursor: "pointer",
                transition: "all 0.2s ease",
                fontSize: "14px",
              }}
            >
              {category}{" "}
              {category !== "All" &&
                `(${EXAMPLES.filter((ex) => ex.category === category).length})`}
            </button>
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
          const categoryColor =
            categoryColors[example.category as keyof typeof categoryColors];

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
              {/* Header */}
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

              {/* Features */}
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

              {/* Chart */}
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
          🛠️ Usage Guide
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
          <pre style={{ margin: 0, whiteSpace: "pre-wrap", color: "#e2e8f0" }}>
            {`import UnifiedPlotter from "./UnifiedPlotter";
import { generateClimateData, createSeriesFromData, PRESET_THEMES } from "./PlotterUtils";

// Generate data
const data = generateClimateData(150);

// Create series
const series = [createSeriesFromData(data, {
  name: "Climate Data",
  mode: "lines+markers",
  marker: { colorFeature: "temperature", colorScale: "plasma" }
})];

// Use the plotter
<UnifiedPlotter
  series={series}
  config={{ title: "My Plot" }}
  theme={PRESET_THEMES.light}
  progressiveLoading={{ enabled: true }}
  debug={true}
/>`}
          </pre>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          <div>
            <h4 style={{ marginBottom: "15px", color: "#60a5fa" }}>
              ✨ Key Features:
            </h4>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                color: "#cbd5e1",
              }}
            >
              <li>• Unified API for all chart types</li>
              <li>• Built-in data generators</li>
              <li>• Modern colorscales</li>
              <li>• Progressive loading</li>
              <li>• Error bars & annotations</li>
              <li>• Dark/light themes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedDemo;

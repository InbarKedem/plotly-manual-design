import React, { useMemo } from "react";
import EnhancedGenericPlotter from "./components/EnhancedGenericPlotter";
import type {
  SeriesConfig,
  PlotConfig,
  InteractionConfig,
  ProgressConfig,
  ThemeConfig,
} from "./components/EnhancedGenericPlotter";

// =============================================================================
// ENHANCED EXAMPLES WITH MODERN FEATURES
// =============================================================================

// Example 1: Advanced Scatter Plot with Modern Colorscales
export const ModernScatterExample: React.FC = () => {
  const series: SeriesConfig[] = useMemo(
    () => [
      {
        name: "Scientific Data",
        data: Array.from({ length: 200 }, (_, i) => ({
          x: i * 0.5,
          y:
            Math.sin(i * 0.1) * 30 +
            Math.cos(i * 0.05) * 15 +
            Math.random() * 10,
          z: 20 + Math.random() * 80, // For color mapping
          text: `Point ${i + 1}<br>Value: ${(Math.sin(i * 0.1) * 30).toFixed(
            2
          )}`,
          error_x: Math.random() * 2,
          error_y: Math.random() * 3,
        })),
        mode: "markers",
        marker: {
          size: 8,
          colorFeature: "z",
          colorScale: "viridis",
          showColorBar: true,
          colorBarTitle: "Intensity",
          opacity: 0.8,
          line: { width: 1, color: "#ffffff" },
        },
        errorBars: {
          x: { type: "data", visible: true },
          y: { type: "data", visible: true },
        },
        hovertemplate:
          "<b>%{text}</b><br>X: %{x:.2f}<br>Y: %{y:.2f}<br>Z: %{marker.color:.1f}<extra></extra>",
      },
    ],
    []
  );

  const config: PlotConfig = {
    title: "Advanced Scientific Scatter Plot",
    xAxis: {
      title: "Time (seconds)",
      showgrid: true,
      gridcolor: "#e8e8e8",
      zeroline: true,
    },
    yAxis: {
      title: "Amplitude",
      showgrid: true,
      gridcolor: "#e8e8e8",
      zeroline: true,
    },
    annotations: [
      {
        x: 50,
        y: 40,
        text: "Peak Region",
        showarrow: true,
        arrowhead: 2,
        ax: 20,
        ay: -30,
      },
    ],
  };

  const interactions: InteractionConfig = {
    enableZoom: true,
    enablePan: true,
    enableSelect: true,
    hovermode: "closest",
    dragmode: "zoom",
  };

  return (
    <EnhancedGenericPlotter
      series={series}
      config={config}
      interactions={interactions}
      debug={true}
    />
  );
};

// Example 2: Multi-Series with Different Types
export const MultiTypeSeriesExample: React.FC = () => {
  const series: SeriesConfig[] = useMemo(
    () => [
      // Line series
      {
        name: "Trend Line",
        data: Array.from({ length: 50 }, (_, i) => ({
          x: i,
          y: 10 + i * 0.5 + Math.sin(i * 0.3) * 5,
          z: i,
        })),
        mode: "lines",
        line: {
          width: 3,
          color: "#3b82f6",
          shape: "spline",
          smoothing: 0.3,
        },
      },
      // Scatter series
      {
        name: "Data Points",
        data: Array.from({ length: 30 }, (_, i) => ({
          x: i * 1.7,
          y: 15 + Math.random() * 20,
          z: Math.random() * 100,
          text: `Sample ${i + 1}`,
        })),
        mode: "markers",
        marker: {
          size: [
            8, 12, 6, 10, 9, 14, 7, 11, 13, 8, 9, 12, 6, 15, 8, 10, 7, 9, 11,
            13, 8, 12, 6, 14, 9, 10, 7, 11, 13, 8,
          ],
          symbol: "diamond",
          colorFeature: "z",
          colorScale: "plasma",
          opacity: 0.8,
        },
      },
      // Filled area series
      {
        name: "Confidence Band",
        data: Array.from({ length: 50 }, (_, i) => ({
          x: i,
          y: 5 + i * 0.3 + Math.sin(i * 0.2) * 3,
          z: i,
        })),
        mode: "lines",
        fill: "tozeroy",
        fillcolor: "rgba(34, 197, 94, 0.2)",
        line: {
          width: 2,
          color: "#22c55e",
          opacity: 0.6,
        },
      },
    ],
    []
  );

  const config: PlotConfig = {
    title: "Multi-Series Visualization with Different Types",
    xAxis: { title: "Index" },
    yAxis: { title: "Value" },
    backgroundColor: "#fafafa",
    plotBackgroundColor: "#ffffff",
  };

  return (
    <EnhancedGenericPlotter
      series={series}
      config={config}
      interactions={{ hovermode: "x unified" }}
    />
  );
};

// Example 3: Progressive Loading with Theme
export const ThemedProgressiveExample: React.FC = () => {
  const series: SeriesConfig[] = useMemo(
    () => [
      {
        name: "Large Dataset",
        data: Array.from({ length: 1500 }, (_, i) => {
          const t = i * 0.01;
          return {
            x: t,
            y: Math.sin(t * 2) * Math.exp(-t * 0.1) + Math.random() * 0.2,
            z: Math.cos(t * 3) * 50 + 50,
            text: `t=${t.toFixed(3)}`,
          };
        }),
        mode: "lines+markers",
        line: {
          width: 2,
          color: "#8b5cf6",
          opacity: 0.8,
        },
        marker: {
          size: 4,
          colorFeature: "z",
          colorScale: "turbo",
          showColorBar: true,
          colorBarTitle: "Phase",
          opacity: 0.9,
        },
      },
    ],
    []
  );

  const config: PlotConfig = {
    title: "Themed Progressive Loading Demo",
    xAxis: {
      title: "Time",
      type: "linear",
      showgrid: true,
    },
    yAxis: {
      title: "Damped Oscillation",
      showgrid: true,
    },
  };

  const theme: ThemeConfig = {
    darkMode: true,
    primary: "#8b5cf6",
    secondary: "#06b6d4",
    background: "#1e293b",
    surface: "#334155",
    colorPalette: ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"],
  };

  const progressConfig: ProgressConfig = {
    enabled: true,
    chunkSize: 75,
    showProgress: true,
    showPhase: true,
    showDataStats: true,
    animationDuration: 30,
  };

  return (
    <EnhancedGenericPlotter
      series={series}
      config={config}
      theme={theme}
      progressiveLoading={progressConfig}
      style={{ height: "500px" }}
    />
  );
};

// Example 4: Interactive Features Showcase
export const InteractiveFeaturesExample: React.FC = () => {
  const series: SeriesConfig[] = useMemo(
    () => [
      {
        name: "Interactive Data",
        data: Array.from({ length: 100 }, (_, i) => ({
          x: i,
          y:
            50 +
            Math.sin(i * 0.2) * 20 +
            Math.cos(i * 0.1) * 10 +
            Math.random() * 5,
          z: Math.abs(Math.sin(i * 0.15)) * 100,
          text: `Point ${i}<br>Interactive hover`,
          category: i % 3 === 0 ? "A" : i % 3 === 1 ? "B" : "C",
        })),
        mode: "lines+markers",
        line: {
          width: 3,
          color: "#ef4444",
          shape: "spline",
        },
        marker: {
          size: 6,
          colorFeature: "z",
          colorScale: "cividis",
          showColorBar: true,
          colorBarTitle: "Category Value",
        },
        hovertemplate:
          "<b>%{text}</b><br>X: %{x}<br>Y: %{y:.2f}<br>Z: %{marker.color:.1f}<extra></extra>",
      },
    ],
    []
  );

  const config: PlotConfig = {
    title: "Interactive Features Demo - Try zooming, panning, and hovering!",
    xAxis: {
      title: "Sample Index",
      showgrid: true,
      gridcolor: "#e5e7eb",
    },
    yAxis: {
      title: "Measured Value",
      showgrid: true,
      gridcolor: "#e5e7eb",
    },
    shapes: [
      {
        type: "rect",
        x0: 20,
        y0: 60,
        x1: 40,
        y1: 80,
        fillcolor: "rgba(239, 68, 68, 0.1)",
        opacity: 0.5,
      },
    ],
    annotations: [
      {
        x: 30,
        y: 85,
        text: "Region of Interest",
        showarrow: true,
        arrowhead: 1,
        ax: 0,
        ay: -20,
      },
    ],
  };

  const interactions: InteractionConfig = {
    enableZoom: true,
    enablePan: true,
    enableSelect: true,
    enableHover: true,
    hovermode: "closest",
    dragmode: "zoom",
    selectdirection: "any",
  };

  return (
    <EnhancedGenericPlotter
      series={series}
      config={config}
      interactions={interactions}
      onPlotClick={(data: any) => console.log("Plot clicked:", data)}
      onPlotHover={(data: any) => console.log("Plot hovered:", data)}
      onPlotSelect={(data: any) => console.log("Plot selected:", data)}
      onPlotZoom={(data: any) => console.log("Plot zoomed:", data)}
    />
  );
};

// Example 5: Climate Data with Advanced Features (Based on your original)
export const AdvancedClimateExample: React.FC = () => {
  const generateClimateData = (
    name: string,
    baseTemp: number,
    variation: number,
    points: number
  ) => {
    return Array.from({ length: points }, (_, i) => {
      const altitude = i * 50; // 0-25000m
      const temp =
        baseTemp - altitude * 0.0065 + (Math.random() - 0.5) * variation;
      const pressure =
        1013.25 * Math.pow(1 - (0.0065 * altitude) / 288.15, 5.255);
      const humidity = Math.max(
        0,
        Math.min(100, 80 - altitude * 0.001 + Math.random() * 20)
      );

      return {
        x: altitude,
        y: temp,
        z: pressure,
        humidity,
        windSpeed: 10 + Math.random() * 40,
        text: `${name}<br>Alt: ${altitude}m<br>Temp: ${temp.toFixed(
          1
        )}°C<br>Pressure: ${pressure.toFixed(1)} hPa`,
      };
    });
  };

  const series: SeriesConfig[] = useMemo(
    () => [
      {
        name: "Tropical Climate",
        data: generateClimateData("Tropical", 25, 8, 150),
        mode: "lines+markers",
        line: {
          width: 3,
          color: "#22c55e",
          opacity: 0.8,
        },
        marker: {
          size: 4,
          colorFeature: "z",
          colorScale: "viridis",
          showColorBar: true,
          colorBarTitle: "Pressure (hPa)",
          opacity: 0.9,
        },
        gradientLines: true,
      },
      {
        name: "Arctic Climate",
        data: generateClimateData("Arctic", -10, 12, 150),
        mode: "lines+markers",
        line: {
          width: 3,
          color: "#3b82f6",
          opacity: 0.8,
        },
        marker: {
          size: 4,
          colorFeature: "humidity",
          colorScale: "plasma",
          opacity: 0.9,
        },
        gradientLines: true,
      },
    ],
    []
  );

  const config: PlotConfig = {
    title: "Advanced Atmospheric Profile Analysis",
    xAxis: {
      title: "Altitude (meters)",
      type: "linear",
      showgrid: true,
      gridcolor: "#f3f4f6",
    },
    yAxis: {
      title: "Temperature (°C)",
      showgrid: true,
      gridcolor: "#f3f4f6",
    },
    font: {
      family: "Inter, sans-serif",
      size: 12,
    },
    margin: { l: 80, r: 200, t: 80, b: 60 },
  };

  const progressConfig: ProgressConfig = {
    enabled: true,
    chunkSize: 25,
    showProgress: true,
    showPhase: true,
    showDataStats: true,
  };

  return (
    <EnhancedGenericPlotter
      series={series}
      config={config}
      progressiveLoading={progressConfig}
      interactions={{ hovermode: "closest" }}
      style={{ height: "600px" }}
    />
  );
};

// Example 6: Real-time Style Updates
export const RealTimeStyleExample: React.FC = () => {
  const series: SeriesConfig[] = useMemo(
    () => [
      {
        name: "Real-time Signal",
        data: Array.from({ length: 200 }, (_, i) => ({
          x: i * 0.1,
          y: Math.sin(i * 0.3) * Math.exp(-i * 0.01) + Math.random() * 0.1,
          z: Math.abs(Math.sin(i * 0.2)) * 100,
          signal_strength: 50 + Math.sin(i * 0.1) * 30,
        })),
        mode: "lines+markers",
        line: {
          width: 2,
          shape: "spline",
          smoothing: 0.5,
        },
        marker: {
          size: 3,
          colorFeature: "signal_strength",
          colorScale: "rainbow",
          showColorBar: true,
          colorBarTitle: "Signal Strength",
        },
      },
    ],
    []
  );

  const config: PlotConfig = {
    title: "Real-time Signal Processing Visualization",
    xAxis: {
      title: "Time (s)",
      showgrid: true,
      gridwidth: 1,
    },
    yAxis: {
      title: "Amplitude",
      showgrid: true,
      gridwidth: 1,
    },
    backgroundColor: "#0f172a",
    plotBackgroundColor: "#1e293b",
    font: {
      color: "#e2e8f0",
      family: "Monaco, monospace",
    },
  };

  const theme: ThemeConfig = {
    darkMode: true,
    primary: "#06b6d4",
    secondary: "#8b5cf6",
    accent: "#f59e0b",
  };

  return (
    <EnhancedGenericPlotter
      series={series}
      config={config}
      theme={theme}
      interactions={{
        hovermode: "x unified",
        dragmode: "pan",
      }}
    />
  );
};

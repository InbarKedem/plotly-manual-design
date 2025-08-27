// =============================================================================
// INTERACTIVE MULTI-SERIES DEMO
// =============================================================================
// Advanced demonstration of the UnifiedPlotter with multi-series data,
// unit conversion capabilities, and color mapping features.

import React, { useState, useMemo } from "react";
import UnifiedPlotter from "../UnifiedPlotter";
import type { SeriesConfig, DataPoint } from "../types/PlotterTypes";

// Unit conversion factors
const UNIT_CONVERSIONS = {
  temperature: {
    celsius: { name: "°C", factor: 1, offset: 0 },
    fahrenheit: { name: "°F", factor: 9 / 5, offset: 32 },
    kelvin: { name: "K", factor: 1, offset: 273.15 },
  },
  length: {
    meters: { name: "m", factor: 1, offset: 0 },
    feet: { name: "ft", factor: 3.28084, offset: 0 },
    kilometers: { name: "km", factor: 0.001, offset: 0 },
  },
  pressure: {
    kpa: { name: "kPa", factor: 1, offset: 0 },
    psi: { name: "PSI", factor: 0.145038, offset: 0 },
    bar: { name: "bar", factor: 0.01, offset: 0 },
  },
};

// Color mapping options
const COLOR_MAPPINGS = {
  none: { name: "No Color Mapping", feature: null },
  altitude: { name: "Altitude", feature: "z" },
  temperature: { name: "Temperature", feature: "temperature" },
  pressure: { name: "Pressure", feature: "pressure" },
  humidity: { name: "Humidity", feature: "humidity" },
};

// Generate realistic multi-dimensional data
const generateMultiSeriesData = (
  seriesCount: number = 4,
  pointsPerSeries: number = 80
) => {
  const seriesTypes = ["linear", "sine", "cosine", "exponential"];
  const colors = ["#e91e63", "#9c27b0", "#2196f3", "#009688"];

  return Array.from({ length: seriesCount }, (_, seriesIndex) => {
    const seriesType = seriesTypes[seriesIndex % seriesTypes.length];
    const baseColor = colors[seriesIndex % colors.length];

    const data = Array.from({ length: pointsPerSeries }, (_, i) => {
      const x = i;
      let y: number;

      // Generate different patterns for each series
      switch (seriesType) {
        case "linear":
          y = x * 0.8 + Math.random() * 10;
          break;
        case "sine":
          y = 50 + 30 * Math.sin(x * 0.2) + Math.random() * 8;
          break;
        case "cosine":
          y = 60 + 40 * Math.cos(x * 0.15) + Math.random() * 12;
          break;
        case "exponential":
          y = 60 + Math.exp(x * 0.05) + Math.random() * 15;
          break;
        default:
          y = Math.random() * 100;
      }

      // Add additional dimensions for color mapping
      const altitude = 1000 + i * 50 + Math.random() * 200; // meters
      const temperature = 20 - (altitude / 1000) * 6.5 + Math.random() * 5; // °C
      const pressure = 101.325 * Math.pow(1 - altitude / 44330, 5.255); // kPa
      const humidity = 40 + Math.random() * 40; // %

      return {
        x,
        y,
        z: altitude,
        temperature,
        pressure,
        humidity,
        text: `Point ${i + 1}<br>Altitude: ${altitude.toFixed(
          0
        )}m<br>Temp: ${temperature.toFixed(1)}°C`,
      } as DataPoint & {
        temperature: number;
        pressure: number;
        humidity: number;
      };
    });

    return {
      name: `Series ${seriesIndex + 1} (${seriesType})`,
      data,
      type: "scatter" as const,
      mode: "lines+markers" as const,
      line: { color: baseColor, width: 2 },
      marker: {
        size: 6,
        color: baseColor,
        line: { width: 1, color: "white" },
      },
    } as SeriesConfig;
  });
};

const InteractiveMultiSeriesDemo: React.FC = () => {
  const [yAxisUnit, setYAxisUnit] =
    useState<keyof typeof UNIT_CONVERSIONS>("temperature");
  const [yAxisSubUnit, setYAxisSubUnit] = useState<string>("celsius");
  const [colorMapping, setColorMapping] =
    useState<keyof typeof COLOR_MAPPINGS>("altitude");
  const [showMarkers, setShowMarkers] = useState(true);
  const [showLines, setShowLines] = useState(true);

  // Generate base data
  const baseData = useMemo(() => generateMultiSeriesData(), []);

  // Convert data based on selected units and color mapping
  const processedSeries = useMemo(() => {
    const unitConfig = (UNIT_CONVERSIONS[yAxisUnit] as any)[yAxisSubUnit];
    const colorConfig = COLOR_MAPPINGS[colorMapping];

    return baseData.map((series) => {
      const processedData = series.data.map((point) => {
        const convertedY = point.y * unitConfig.factor + unitConfig.offset;

        return {
          ...point,
          y: convertedY,
          text: `${series.name}<br>X: ${point.x}<br>Y: ${convertedY.toFixed(
            2
          )} ${unitConfig.name}<br>Altitude: ${point.z?.toFixed(0)}m`,
        };
      });

      // Configure mode based on user preferences
      let mode: string = "";
      if (showLines && showMarkers) mode = "lines+markers";
      else if (showLines) mode = "lines";
      else if (showMarkers) mode = "markers";
      else mode = "lines+markers";

      const updatedSeries: SeriesConfig = {
        ...series,
        data: processedData,
        mode: mode as any,
        marker: colorConfig.feature
          ? {
              ...series.marker,
              colorFeature: colorConfig.feature,
              colorScale:
                colorConfig.feature === "altitude"
                  ? "Viridis"
                  : colorConfig.feature === "temperature"
                  ? "RdBu_r"
                  : colorConfig.feature === "pressure"
                  ? "Plasma"
                  : colorConfig.feature === "humidity"
                  ? "Blues"
                  : "Viridis",
              showColorBar: true,
              colorBarTitle: colorConfig.name,
              size: showMarkers ? 8 : 0,
            }
          : {
              ...series.marker,
              size: showMarkers ? 6 : 0,
            },
      };

      return updatedSeries;
    });
  }, [baseData, yAxisUnit, yAxisSubUnit, colorMapping, showMarkers, showLines]);

  const plotConfig = useMemo(() => {
    const unitConfig = (UNIT_CONVERSIONS[yAxisUnit] as any)[yAxisSubUnit];

    return {
      title: "Multi-Series Comparison with Interactive Controls",
      xAxis: {
        title: "X Axis",
        showgrid: true,
        gridcolor: "#e0e0e0",
      },
      yAxis: {
        title: `Y Axis (${unitConfig.name})`,
        showgrid: true,
        gridcolor: "#e0e0e0",
      },
      showLegend: true,
      legendPosition: { x: 1.02, y: 1 },
      margin: { l: 80, r: 250, t: 80, b: 60 },
      width: "100%",
      height: "600px",
    };
  }, [yAxisUnit, yAxisSubUnit]);

  return (
    <div style={{ padding: "20px" }}>
      {/* Control Panel */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          marginBottom: "20px",
          padding: "20px",
          backgroundColor: "#f8fafc",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
              color: "#374151",
              fontSize: "14px",
            }}
          >
            📊 Y-Axis Unit Type:
          </label>
          <select
            value={yAxisUnit}
            onChange={(e) => {
              setYAxisUnit(e.target.value as keyof typeof UNIT_CONVERSIONS);
              setYAxisSubUnit(
                Object.keys(
                  UNIT_CONVERSIONS[
                    e.target.value as keyof typeof UNIT_CONVERSIONS
                  ]
                )[0]
              );
            }}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              backgroundColor: "white",
              minWidth: "120px",
              fontSize: "14px",
            }}
          >
            <option value="temperature">Temperature</option>
            <option value="length">Length</option>
            <option value="pressure">Pressure</option>
          </select>
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
              color: "#374151",
              fontSize: "14px",
            }}
          >
            🔄 Unit:
          </label>
          <select
            value={yAxisSubUnit}
            onChange={(e) => setYAxisSubUnit(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              backgroundColor: "white",
              minWidth: "100px",
              fontSize: "14px",
            }}
          >
            {Object.entries(UNIT_CONVERSIONS[yAxisUnit]).map(
              ([key, config]) => (
                <option key={key} value={key}>
                  {config.name}
                </option>
              )
            )}
          </select>
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
              color: "#374151",
              fontSize: "14px",
            }}
          >
            🎨 Color Mapping:
          </label>
          <select
            value={colorMapping}
            onChange={(e) =>
              setColorMapping(e.target.value as keyof typeof COLOR_MAPPINGS)
            }
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              backgroundColor: "white",
              minWidth: "140px",
              fontSize: "14px",
            }}
          >
            {Object.entries(COLOR_MAPPINGS).map(([key, config]) => (
              <option key={key} value={key}>
                {config.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
              color: "#374151",
              fontSize: "14px",
            }}
          >
            👁️ Display Options:
          </label>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "14px",
              }}
            >
              <input
                type="checkbox"
                checked={showLines}
                onChange={(e) => setShowLines(e.target.checked)}
                style={{ marginRight: "5px" }}
              />
              Lines
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "14px",
              }}
            >
              <input
                type="checkbox"
                checked={showMarkers}
                onChange={(e) => setShowMarkers(e.target.checked)}
                style={{ marginRight: "5px" }}
              />
              Markers
            </label>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: "#f0f9ff",
          borderRadius: "8px",
          border: "1px solid #0ea5e9",
        }}
      >
        <h3 style={{ margin: "0 0 10px 0", color: "#0369a1" }}>
          🔬 Interactive Multi-Series Analysis
        </h3>
        <p style={{ margin: 0, color: "#0c4a6e", fontSize: "14px" }}>
          This demo showcases advanced features:{" "}
          <strong>unit conversion</strong> across different measurement systems,
          <strong> color mapping</strong> using additional data dimensions, and{" "}
          <strong>interactive controls</strong> for customizing the
          visualization. Try changing the units and color mapping to explore the
          data from different perspectives.
        </p>
      </div>

      {/* Plot Component */}
      <div
        style={{
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          overflow: "visible",
          backgroundColor: "white",
          minWidth: "1000px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <UnifiedPlotter
          series={processedSeries}
          config={plotConfig}
          interactions={{
            dragmode: "zoom",
            hovermode: "closest",
            clickmode: "event",
          }}
          theme={{
            darkMode: false,
            primary: "#3b82f6",
            secondary: "#64748b",
            accent: "#06b6d4",
            background: "#ffffff",
            surface: "#f8fafc",
          }}
          progressiveLoading={{
            enabled: false,
            chunkSize: 100,
            showProgress: true,
          }}
          debug={false}
        />
      </div>

      {/* Feature Information */}
      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          backgroundColor: "#f9fafb",
          borderRadius: "8px",
          border: "1px solid #e5e7eb",
        }}
      >
        <h3 style={{ margin: "0 0 15px 0", color: "#374151" }}>
          ✨ Key Features
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "15px",
          }}
        >
          <div>
            <strong style={{ color: "#059669" }}>🔄 Unit Conversion</strong>
            <p
              style={{
                margin: "5px 0 0 0",
                fontSize: "14px",
                color: "#6b7280",
              }}
            >
              Real-time conversion between temperature (°C, °F, K), length (m,
              ft, km), and pressure (kPa, PSI, bar) units.
            </p>
          </div>
          <div>
            <strong style={{ color: "#dc2626" }}>🎨 Color Mapping</strong>
            <p
              style={{
                margin: "5px 0 0 0",
                fontSize: "14px",
                color: "#6b7280",
              }}
            >
              Map point colors to additional data dimensions like altitude,
              temperature, pressure, or humidity.
            </p>
          </div>
          <div>
            <strong style={{ color: "#7c3aed" }}>👁️ Display Control</strong>
            <p
              style={{
                margin: "5px 0 0 0",
                fontSize: "14px",
                color: "#6b7280",
              }}
            >
              Toggle between lines, markers, or both to customize the visual
              representation of your data.
            </p>
          </div>
          <div>
            <strong style={{ color: "#0891b2" }}>📊 Multi-Series</strong>
            <p
              style={{
                margin: "5px 0 0 0",
                fontSize: "14px",
                color: "#6b7280",
              }}
            >
              Compare multiple data series with different mathematical patterns
              and characteristics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMultiSeriesDemo;

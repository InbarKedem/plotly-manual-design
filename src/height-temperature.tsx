import Plot from "react-plotly.js";
import { useMemo } from "react";

// Types for better code organization
interface ClimateData {
  heights: number[];
  temperatures: number[];
  speeds: number[];
  pressures: number[];
}

interface BezierControlPoints {
  p0: number;
  p1: number;
  p2: number;
  p3: number;
}

// Utility functions
const calculateCubicBezier = (
  t: number,
  { p0, p1, p2, p3 }: BezierControlPoints
): number => {
  const u = 1 - t;
  return (
    u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3
  );
};

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

const HeightTemperaturePlot = () => {
  // Generate data only once using useMemo to prevent regeneration on every render
  const plotData = useMemo(() => {
    // Configuration constants
    const NUM_POINTS = 1000;
    const MAX_HEIGHT = 10000;

    // Climate control points for Bézier curves
    const climateConfigs = {
      temperate: { p0: 25, p1: 15, p2: -20, p3: -45 },
      desert: { p0: 55, p1: 45, p2: 10, p3: -20 },
      arctic: { p0: 5, p1: -30, p2: -15, p3: -80 },
      storm: { p0: 35, p1: 5, p2: 25, p3: -50 },
    } as const;

    // Initialize data arrays
    const climateData: Record<string, ClimateData> = {
      temperate: { heights: [], temperatures: [], speeds: [], pressures: [] },
      desert: { heights: [], temperatures: [], speeds: [], pressures: [] },
      arctic: { heights: [], temperatures: [], speeds: [], pressures: [] },
      storm: { heights: [], temperatures: [], speeds: [], pressures: [] },
    };

    // Generate data for all climate types
    for (let i = 0; i < NUM_POINTS; i++) {
      const t = i / NUM_POINTS; // Parameter for Bézier curves (0 to 1)
      const currentHeight = t * MAX_HEIGHT;

      // Generate temperate climate data
      generateTemperateClimate(
        i,
        t,
        currentHeight,
        climateData.temperate,
        climateConfigs.temperate
      );

      // Generate desert/tropical climate data
      generateDesertClimate(
        i,
        t,
        currentHeight,
        climateData.desert,
        climateConfigs.desert
      );

      // Generate arctic/polar climate data
      generateArcticClimate(
        i,
        t,
        currentHeight,
        climateData.arctic,
        climateConfigs.arctic
      );

      // Generate storm system data
      generateStormClimate(
        i,
        t,
        currentHeight,
        climateData.storm,
        climateConfigs.storm
      );
    }

    // Helper function for temperate climate generation
    function generateTemperateClimate(
      i: number,
      t: number,
      height: number,
      data: ClimateData,
      controlPoints: BezierControlPoints
    ): void {
      data.heights.push(height);

      // Calculate base temperature using Bézier curve
      let temperature = calculateCubicBezier(t, controlPoints);

      // Add gentle atmospheric oscillations
      temperature +=
        Math.sin(t * Math.PI * 2 + 0.5) * 4 +
        Math.cos(t * Math.PI * 1.5 + 1.2) * 3;
      temperature += (Math.random() - 0.5) * 2; // Minimal noise
      data.temperatures.push(clamp(temperature, -70, 40));

      // Generate atmospheric pressure for gradient
      const basePressure = 1013 * Math.exp(-height / 8000); // Standard atmospheric model
      const pressureVariation =
        Math.sin(t * Math.PI * 2) * 50 + Math.cos(t * Math.PI * 1.5) * 30;
      data.pressures.push(basePressure + pressureVariation);

      // Generate speed data
      const baseSpeed =
        45 + Math.sin(i * 0.18 + 0.7) * 28 + Math.cos(i * 0.12 + 1.5) * 20;
      data.speeds.push(clamp(baseSpeed + (Math.random() - 0.5) * 15, 15, 130));
    }

    // Helper function for desert climate generation
    function generateDesertClimate(
      i: number,
      t: number,
      height: number,
      data: ClimateData,
      controlPoints: BezierControlPoints
    ): void {
      data.heights.push(height);

      // Calculate base temperature using Bézier curve
      let temperature = calculateCubicBezier(t, controlPoints);

      // Add thermal spikes and inversions
      temperature +=
        Math.sin(t * Math.PI * 3 + 2.3) * 8 +
        Math.cos(t * Math.PI * 2.5 + 0.9) * 6;

      // Sharp thermal boundary at mid-altitude
      if (t > 0.3 && t < 0.6) {
        temperature += Math.sin((t - 0.3) * Math.PI * 6) * 10;
      }
      temperature += (Math.random() - 0.5) * 3;
      data.temperatures.push(clamp(temperature, -25, 60));

      // Generate humidity levels for gradient
      const baseHumidity = 80 - height / 150; // Decreases with altitude
      const humidityVariation = Math.sin(t * Math.PI * 3) * 25 + (1 - t) * 40;
      data.pressures.push(clamp(baseHumidity + humidityVariation, 10, 100));

      // Generate speed data
      const baseSpeed =
        85 + Math.sin(i * 0.11 + 1.4) * 35 + Math.cos(i * 0.31 + 2.6) * 25;
      data.speeds.push(clamp(baseSpeed + (Math.random() - 0.5) * 18, 25, 160));
    }

    // Helper function for arctic climate generation
    function generateArcticClimate(
      i: number,
      t: number,
      height: number,
      data: ClimateData,
      controlPoints: BezierControlPoints
    ): void {
      data.heights.push(height);

      // Calculate base temperature using Bézier curve
      let temperature = calculateCubicBezier(t, controlPoints);

      // Add chaotic polar vortex effects
      temperature +=
        Math.sin(t * Math.PI * 4 + 1.1) * 12 +
        Math.cos(t * Math.PI * 3 + 2.4) * 10;
      temperature += Math.sin(t * Math.PI * 6 + 0.6) * 8;

      // Polar stratospheric cloud effects
      if (t > 0.6) {
        temperature += Math.cos((t - 0.6) * Math.PI * 8) * 15;
      }
      temperature += (Math.random() - 0.5) * 5;
      data.temperatures.push(clamp(temperature, -95, 15));

      // Generate wind intensity for gradient
      const baseWindIntensity = 30 + height / 100;
      const windVariation =
        t * 100 +
        Math.sin(t * Math.PI * 2) * 40 +
        Math.cos(t * Math.PI * 1.2) * 25;
      data.pressures.push(clamp(baseWindIntensity + windVariation, 20, 200));

      // Generate speed data
      const baseSpeed =
        25 + Math.sin(i * 0.28 + 2.1) * 32 + Math.cos(i * 0.16 + 0.5) * 28;
      data.speeds.push(clamp(baseSpeed + (Math.random() - 0.5) * 20, 10, 110));
    }

    // Helper function for storm system generation
    function generateStormClimate(
      i: number,
      t: number,
      height: number,
      data: ClimateData,
      controlPoints: BezierControlPoints
    ): void {
      data.heights.push(height);

      // Calculate base temperature using Bézier curve
      let temperature = calculateCubicBezier(t, controlPoints);

      // Add violent storm oscillations
      temperature +=
        Math.sin(t * Math.PI * 6 + 1.6) * 10 +
        Math.cos(t * Math.PI * 5 + 2.9) * 12;
      temperature +=
        Math.sin(t * Math.PI * 8 + 0.2) * 6 +
        Math.cos(t * Math.PI * 7 + 1.3) * 8;

      // Cumulonimbus anvil effects
      if (t > 0.7) {
        temperature += Math.sin((t - 0.7) * Math.PI * 10 + 2.7) * 12;
      }

      // Mesocyclone effects in mid-levels
      if (t > 0.2 && t < 0.5) {
        temperature += Math.cos((t - 0.2) * Math.PI * 15) * 10;
      }
      temperature += (Math.random() - 0.5) * 4;
      data.temperatures.push(clamp(temperature, -65, 50));

      // Generate storm intensity for gradient
      const baseStormIntensity = 40 + height / 80;
      const stormVariation =
        Math.sin(t * Math.PI * 4) * 60 +
        Math.cos(t * Math.PI * 2.5) * 30 +
        t * t * 50;
      data.pressures.push(clamp(baseStormIntensity + stormVariation, 30, 180));

      // Generate speed data
      const baseSpeed =
        110 + Math.sin(i * 0.22 + 0.8) * 45 + Math.cos(i * 0.17 + 1.9) * 38;
      data.speeds.push(clamp(baseSpeed + (Math.random() - 0.5) * 25, 40, 200));
    }

    // 2. Return the plot data configuration
    return [
      {
        x: climateData.temperate.temperatures,
        y: climateData.temperate.heights,
        mode: "lines+markers" as const,
        type: "scatter" as const,
        name: "Temperate Climate",
        line: {
          width: 3,
          color: "rgba(55, 126, 184, 0.3)", // More transparent line
        },
        marker: {
          size: 4,
          color: climateData.temperate.pressures, // Use pressure for color gradient
          colorscale: [
            [0, "rgba(55, 126, 184, 0.3)"], // Light blue
            [1, "rgba(55, 126, 184, 1.0)"], // Dark blue
          ],
          showscale: true,
          colorbar: {
            title: "Pressure (hPa)",
            x: 1.02,
            y: 0.8,
            len: 0.2,
          },
        },
      },
      {
        x: climateData.desert.temperatures,
        y: climateData.desert.heights,
        mode: "lines+markers" as const,
        type: "scatter" as const,
        name: "Desert/Tropical",
        line: {
          width: 3,
          color: "rgba(228, 26, 28, 0.3)", // More transparent line
        },
        marker: {
          size: 4,
          color: climateData.desert.pressures, // Use humidity for color gradient
          colorscale: [
            [0, "rgba(228, 26, 28, 0.3)"], // Light red
            [1, "rgba(228, 26, 28, 1.0)"], // Dark red
          ],
          showscale: true,
          colorbar: {
            title: "Humidity (%)",
            x: 1.02,
            y: 0.6,
            len: 0.2,
          },
        },
      },
      {
        x: climateData.arctic.temperatures,
        y: climateData.arctic.heights,
        mode: "lines+markers" as const,
        type: "scatter" as const,
        name: "Arctic/Polar",
        line: {
          width: 3,
          color: "rgba(77, 175, 74, 0.3)", // More transparent line
        },
        marker: {
          size: 4,
          color: climateData.arctic.pressures, // Use wind intensity for color gradient
          colorscale: [
            [0, "rgba(77, 175, 74, 0.3)"], // Light green
            [1, "rgba(77, 175, 74, 1.0)"], // Dark green
          ],
          showscale: true,
          colorbar: {
            title: "Wind Intensity",
            x: 1.02,
            y: 0.4,
            len: 0.2,
          },
        },
      },
      {
        x: climateData.storm.temperatures,
        y: climateData.storm.heights,
        mode: "lines+markers" as const,
        type: "scatter" as const,
        name: "Storm System",
        line: {
          width: 3,
          color: "rgba(152, 78, 163, 0.3)", // More transparent line
        },
        marker: {
          size: 4,
          color: climateData.storm.pressures, // Use storm intensity for color gradient
          colorscale: [
            [0, "rgba(152, 78, 163, 0.3)"], // Light purple
            [1, "rgba(152, 78, 163, 1.0)"], // Dark purple
          ],
          showscale: true,
          colorbar: {
            title: "Storm Intensity",
            x: 1.02,
            y: 0.2,
            len: 0.2,
          },
        },
      },
    ];
  }, []); // Empty dependency array means this runs only once

  const plotLayout = {
    title: {
      text: "Height vs. Temperature - Multiple Flight Behaviors",
    },
    xaxis: {
      title: {
        text: "Temperature (°C)",
      },
    },
    yaxis: {
      title: {
        text: "Height (meters)",
      },
    },
    showlegend: true,
    legend: {
      x: 0.02,
      y: 0.98,
    },
  };

  console.log(
    "HeightTemperaturePlot rendering with",
    plotData.length,
    "traces"
  );
  return (
    <Plot
      data={plotData}
      layout={plotLayout}
      config={{
        responsive: true,
      }}
    />
  );
};

export default HeightTemperaturePlot;

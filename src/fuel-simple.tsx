import Plot from "react-plotly.js";
import { useMemo } from "react";

// Types for better code organization
interface ClimateData {
  heights: number[];
  temperatures: number[];
  speeds: number[];
  pressures: number[];
  fuelConsumption: number[]; // Added fuel consumption
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

const FuelConsumptionSimple = () => {
  // Generate data with 10 points using consistent colors for all curves
  const plotData = useMemo(() => {
    // Configuration constants - 10 points per curve
    const NUM_POINTS = 10;
    const MAX_HEIGHT = 10000;

    // Climate control points for Bézier curves (fuel efficiency curves)
    const climateConfigs = {
      temperate: { p0: 2.5, p1: 3.2, p2: 4.8, p3: 6.5 }, // Fuel consumption L/100km equivalent
      desert: { p0: 3.8, p1: 5.2, p2: 7.1, p3: 9.2 }, // Higher consumption in extreme heat
      arctic: { p0: 4.2, p1: 6.8, p2: 5.5, p3: 8.9 }, // Variable consumption in cold
      storm: { p0: 5.5, p1: 8.2, p2: 12.1, p3: 15.8 }, // Highest consumption in storms
    } as const;

    // Initialize data arrays with fuel consumption
    const climateData: Record<string, ClimateData> = {
      temperate: {
        heights: [],
        temperatures: [],
        speeds: [],
        pressures: [],
        fuelConsumption: [],
      },
      desert: {
        heights: [],
        temperatures: [],
        speeds: [],
        pressures: [],
        fuelConsumption: [],
      },
      arctic: {
        heights: [],
        temperatures: [],
        speeds: [],
        pressures: [],
        fuelConsumption: [],
      },
      storm: {
        heights: [],
        temperatures: [],
        speeds: [],
        pressures: [],
        fuelConsumption: [],
      },
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

    // Generate shared pressure values that all curves will use for identical coloring
    const sharedPressures: number[] = [];
    for (let i = 0; i < NUM_POINTS; i++) {
      const t = i / NUM_POINTS;
      const height = t * MAX_HEIGHT;
      const basePressure = 1013 * Math.exp(-height / 8000);
      const pressureVariation =
        Math.sin(t * Math.PI * 2) * 50 + Math.cos(t * Math.PI * 1.5) * 30;
      sharedPressures.push(basePressure + pressureVariation);
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

      // Calculate base temperature using original Bézier curve
      let temperature = calculateCubicBezier(t, {
        p0: 25,
        p1: 15,
        p2: -20,
        p3: -45,
      });
      temperature +=
        Math.sin(t * Math.PI * 2 + 0.5) * 4 +
        Math.cos(t * Math.PI * 1.5 + 1.2) * 3;
      temperature += (Math.random() - 0.5) * 2;
      data.temperatures.push(clamp(temperature, -70, 40));

      // Calculate fuel consumption using Bézier curve (L/100km equivalent)
      let fuelConsumption = calculateCubicBezier(t, controlPoints);

      // Add altitude-based fuel consumption factors
      const altitudeFactor = 1 + (height / 10000) * 0.3; // 30% increase at max altitude
      const temperatureFactor = 1 + Math.abs(temperature - 15) * 0.005; // Optimal at 15°C

      // Add atmospheric conditions impact
      fuelConsumption *= altitudeFactor * temperatureFactor;
      fuelConsumption += Math.sin(t * Math.PI * 3) * 0.5; // Minor oscillations
      fuelConsumption += (Math.random() - 0.5) * 0.3; // Small random variation

      data.fuelConsumption.push(clamp(fuelConsumption, 1.5, 12.0));

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

      // Calculate base temperature using original Bézier curve
      let temperature = calculateCubicBezier(t, {
        p0: 55,
        p1: 45,
        p2: 10,
        p3: -20,
      });
      temperature +=
        Math.sin(t * Math.PI * 3 + 2.3) * 8 +
        Math.cos(t * Math.PI * 2.5 + 0.9) * 6;

      if (t > 0.3 && t < 0.6) {
        temperature += Math.sin((t - 0.3) * Math.PI * 6) * 10;
      }
      temperature += (Math.random() - 0.5) * 3;
      data.temperatures.push(clamp(temperature, -25, 60));

      // Calculate fuel consumption for extreme heat conditions
      let fuelConsumption = calculateCubicBezier(t, controlPoints);

      // Extreme heat increases fuel consumption significantly
      const heatStressFactor = 1 + Math.max(0, temperature - 30) * 0.02; // 2% increase per degree above 30°C
      const altitudeFactor = 1 + (height / 10000) * 0.25;
      const thermalTurbulenceFactor =
        1 + Math.abs(Math.sin(t * Math.PI * 4)) * 0.3;

      fuelConsumption *=
        heatStressFactor * altitudeFactor * thermalTurbulenceFactor;
      fuelConsumption += Math.sin(t * Math.PI * 2.5) * 0.8; // Thermal effects
      fuelConsumption += (Math.random() - 0.5) * 0.5;

      data.fuelConsumption.push(clamp(fuelConsumption, 2.5, 18.0));

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

      // Calculate base temperature using original Bézier curve
      let temperature = calculateCubicBezier(t, {
        p0: 5,
        p1: -30,
        p2: -15,
        p3: -80,
      });
      temperature +=
        Math.sin(t * Math.PI * 4 + 1.1) * 12 +
        Math.cos(t * Math.PI * 3 + 2.4) * 10;
      temperature += Math.sin(t * Math.PI * 6 + 0.6) * 8;

      if (t > 0.6) {
        temperature += Math.cos((t - 0.6) * Math.PI * 8) * 15;
      }
      temperature += (Math.random() - 0.5) * 5;
      data.temperatures.push(clamp(temperature, -95, 15));

      // Calculate fuel consumption for extreme cold conditions
      let fuelConsumption = calculateCubicBezier(t, controlPoints);

      // Cold weather increases fuel consumption due to engine warm-up and air density
      const coldStressFactor = 1 + Math.max(0, -temperature) * 0.015; // 1.5% increase per degree below 0°C
      const altitudeFactor = 1 + (height / 10000) * 0.4; // More significant at altitude
      const windResistanceFactor =
        1 + Math.abs(Math.sin(t * Math.PI * 3)) * 0.25;

      fuelConsumption *=
        coldStressFactor * altitudeFactor * windResistanceFactor;
      fuelConsumption += Math.cos(t * Math.PI * 1.8) * 0.6; // Cold weather variations
      fuelConsumption += (Math.random() - 0.5) * 0.4;

      data.fuelConsumption.push(clamp(fuelConsumption, 3.0, 16.0));

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

      // Calculate base temperature using original Bézier curve
      let temperature = calculateCubicBezier(t, {
        p0: 35,
        p1: 5,
        p2: 25,
        p3: -50,
      });
      temperature +=
        Math.sin(t * Math.PI * 6 + 1.6) * 10 +
        Math.cos(t * Math.PI * 5 + 2.9) * 12;
      temperature +=
        Math.sin(t * Math.PI * 8 + 0.2) * 6 +
        Math.cos(t * Math.PI * 7 + 1.3) * 8;

      if (t > 0.7) {
        temperature += Math.sin((t - 0.7) * Math.PI * 10 + 2.7) * 12;
      }

      if (t > 0.2 && t < 0.5) {
        temperature += Math.cos((t - 0.2) * Math.PI * 15) * 10;
      }
      temperature += (Math.random() - 0.5) * 4;
      data.temperatures.push(clamp(temperature, -65, 50));

      // Calculate fuel consumption for storm conditions (highest consumption)
      let fuelConsumption = calculateCubicBezier(t, controlPoints);

      // Storm conditions dramatically increase fuel consumption
      const stormIntensityFactor = 1 + Math.sin(t * Math.PI * 4) * 0.8 + 0.5; // Variable storm intensity
      const altitudeFactor = 1 + (height / 10000) * 0.6;
      const turbulenceFactor = 1 + Math.abs(Math.cos(t * Math.PI * 6)) * 0.5;
      const windShearFactor = 1 + Math.abs(Math.sin(t * Math.PI * 8)) * 0.4;

      fuelConsumption *=
        stormIntensityFactor *
        altitudeFactor *
        turbulenceFactor *
        windShearFactor;
      fuelConsumption += Math.sin(t * Math.PI * 7) * 1.2; // Storm turbulence effects
      fuelConsumption += (Math.random() - 0.5) * 0.8;

      data.fuelConsumption.push(clamp(fuelConsumption, 4.0, 25.0));

      // Generate speed data
      const baseSpeed =
        110 + Math.sin(i * 0.22 + 0.8) * 45 + Math.cos(i * 0.17 + 1.9) * 38;
      data.speeds.push(clamp(baseSpeed + (Math.random() - 0.5) * 25, 40, 200));
    }

    // Define consistent dark colors for all curves
    const baseColor = "rgba(40, 40, 40, 0.9)"; // Dark gray/black - same color for all lines

    // Define 5 different line styles for each curve
    const lineStyles = ["solid", "dash", "dot", "dashdot", "longdash"] as const;

    const lineWidths = [4, 4, 4, 4, 4]; // Same thickness for all

    // Define a consistent dark colorscale for all curves
    const darkColorScale = [
      [0, "rgb(20, 20, 20)"], // Very dark (high pressure)
      [0.2, "rgb(60, 60, 60)"], // Dark gray
      [0.4, "rgb(100, 100, 100)"], // Medium gray
      [0.6, "rgb(140, 140, 140)"], // Light gray
      [0.8, "rgb(180, 180, 180)"], // Very light gray
      [1, "rgb(220, 220, 220)"], // Almost white (low pressure)
    ];

    // Return the plot data configuration with 5 curves using identical colors
    return [
      // Temperate Climate - Style 1 with shared pressure gradient
      {
        x: climateData.temperate.fuelConsumption,
        y: climateData.temperate.heights,
        mode: "lines+markers" as const,
        type: "scatter" as const,
        name: "Temperate - Style 1",
        line: {
          width: lineWidths[0],
          color: baseColor,
          dash: lineStyles[0],
        },
        marker: {
          size: 8,
          color: sharedPressures,
          colorscale: darkColorScale,
          showscale: true,
          colorbar: {
            title: "Atmospheric Pressure (hPa)",
            x: 1.02,
            y: 0.9,
            len: 0.15,
          },
        },
      },

      // Desert Climate - Style 2 with identical pressure gradient
      {
        x: climateData.desert.fuelConsumption,
        y: climateData.desert.heights,
        mode: "lines+markers" as const,
        type: "scatter" as const,
        name: "Desert - Style 2",
        line: {
          width: lineWidths[1],
          color: baseColor,
          dash: lineStyles[1],
        },
        marker: {
          size: 8,
          color: sharedPressures,
          colorscale: darkColorScale,
          showscale: false, // Hide duplicate colorbar
        },
      },

      // Arctic Climate - Style 3 with identical pressure gradient
      {
        x: climateData.arctic.fuelConsumption,
        y: climateData.arctic.heights,
        mode: "lines+markers" as const,
        type: "scatter" as const,
        name: "Arctic - Style 3",
        line: {
          width: lineWidths[2],
          color: baseColor,
          dash: lineStyles[2],
        },
        marker: {
          size: 8,
          color: sharedPressures,
          colorscale: darkColorScale,
          showscale: false, // Hide duplicate colorbar
        },
      },

      // Storm System - Style 4 with identical pressure gradient
      {
        x: climateData.storm.fuelConsumption,
        y: climateData.storm.heights,
        mode: "lines+markers" as const,
        type: "scatter" as const,
        name: "Storm - Style 4",
        line: {
          width: lineWidths[3],
          color: baseColor,
          dash: lineStyles[3],
        },
        marker: {
          size: 8,
          color: sharedPressures,
          colorscale: darkColorScale,
          showscale: false, // Hide duplicate colorbar
        },
      },

      // Additional variant - Temperate Optimized - Style 5 with identical pressure gradient
      {
        x: climateData.temperate.fuelConsumption.map((val) => val * 0.85), // Optimized consumption
        y: climateData.temperate.heights,
        mode: "lines+markers" as const,
        type: "scatter" as const,
        name: "Temperate Optimized - Style 5",
        line: {
          width: lineWidths[4],
          color: baseColor,
          dash: lineStyles[4],
        },
        marker: {
          size: 8,
          color: sharedPressures,
          colorscale: darkColorScale,
          showscale: false, // Hide duplicate colorbar
        },
      },
    ];
  }, []); // Empty dependency array means this runs only once

  const plotLayout = {
    title: {
      text: "Fuel Consumption vs. Height - 5 Line Styles with Same Pressure Scale",
    },
    xaxis: {
      title: {
        text: "Fuel Consumption (L/100km equivalent)",
      },
    },
    yaxis: {
      title: {
        text: "Height (meters)",
      },
    },
    showlegend: true,
    legend: {
      x: 1.15, // Position legend outside the plot area to the right
      y: 1.0, // Position at the top
      xanchor: "left" as const,
      yanchor: "top" as const,
    },
    margin: {
      r: 250, // Increased margin for larger legend with 12 entries
    },
  };

  console.log(
    "FuelConsumptionSimple rendering with",
    plotData.length,
    "traces (5 curves with different line styles) using consistent colors and 10 points per curve"
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

export default FuelConsumptionSimple;

// =============================================================================
// 🌡️ TEMPERATURE VS SPEED INTERACTIVE DEMO - PERFORMANCE OPTIMIZED
// =============================================================================
// Interactive demonstration showing the relationship between temperature and speed
// with altitude-based color mapping and integrated unit conversion controls.
// Following GitHub Copilot standards for clean, reusable, and performant code.
//
// 🎯 Features:
// - Real-time unit conversion with performance optimization
// - Multi-series data with altitude-based color mapping
// - Interactive controls with memoized state management
// - Type-safe unit conversion system

import React, { useState, useMemo, useCallback } from "react";
import UnifiedPlotter from "../UnifiedPlotter";
import type { SeriesConfig, DataPoint } from "../types/PlotterTypes";

// =============================================================================
// 🔧 TYPES & INTERFACES - COMPREHENSIVE TYPE SAFETY
// =============================================================================

/**
 * 🌡️ Temperature unit configuration with conversion factors
 * Type-safe unit conversion system for temperature measurements
 */
interface TemperatureUnit {
  /** Display name with symbol */
  name: string;
  /** Conversion factor from Celsius */
  factor: number;
  /** Conversion offset from Celsius */
  offset: number;
}

/**
 * 💨 Speed unit configuration with conversion factors
 * Type-safe unit conversion system for speed measurements
 */
interface SpeedUnit {
  /** Display name with symbol */
  name: string;
  /** Conversion factor from m/s */
  factor: number;
  /** Conversion offset (always 0 for speed) */
  offset: number;
}

/**
 * 🏔️ Altitude unit configuration with conversion factors
 * Type-safe unit conversion system for altitude measurements
 */
interface AltitudeUnit {
  /** Display name with symbol */
  name: string;
  /** Conversion factor from meters */
  factor: number;
  /** Conversion offset (always 0 for altitude) */
  offset: number;
}

// =============================================================================
// 📊 UNIT CONVERSION CONFIGURATIONS - REUSABLE CONSTANTS
// =============================================================================

/** 🌡️ Temperature unit conversion factors (base: Celsius) */
const TEMPERATURE_UNITS: Record<string, TemperatureUnit> = {
  celsius: { name: "°C", factor: 1, offset: 0 },
  fahrenheit: { name: "°F", factor: 9 / 5, offset: 32 },
  kelvin: { name: "K", factor: 1, offset: 273.15 },
} as const;

/** 💨 Speed unit conversion factors (base: m/s) */
const SPEED_UNITS: Record<string, SpeedUnit> = {
  mps: { name: "m/s", factor: 1, offset: 0 },
  kmh: { name: "km/h", factor: 3.6, offset: 0 },
  mph: { name: "mph", factor: 2.237, offset: 0 },
  kts: { name: "knots", factor: 1.944, offset: 0 },
} as const;

/** 🏔️ Altitude unit conversion factors (base: meters) */
const ALTITUDE_UNITS: Record<string, AltitudeUnit> = {
  meters: { name: "m", factor: 1, offset: 0 },
  feet: { name: "ft", factor: 3.28084, offset: 0 },
  kilometers: { name: "km", factor: 0.001, offset: 0 },
  miles: { name: "mi", factor: 0.000621371, offset: 0 },
} as const;

// =============================================================================
// 🧮 DATA GENERATION FUNCTIONS - OPTIMIZED ALGORITHMS
// =============================================================================

/**
 * 📊 Generate realistic temperature vs speed data with altitude correlation
 *
 * Creates scientifically plausible datasets with different curve characteristics
 * for testing multi-series visualizations and unit conversions.
 *
 * 🎯 Algorithm Features:
 * - Realistic temperature-speed-altitude correlations
 * - Configurable curve characteristics for variety
 * - Performance-optimized data generation
 * - Type-safe point creation
 *
 * @param pointCount - Number of data points to generate (default: 50)
 * @param curveType - Type of curve characteristics to apply
 * @returns Array of DataPoint objects with temperature, speed, and altitude
 *
 * 🚀 Performance: O(n) generation with efficient mathematical functions
 * 🧪 Test-friendly: Deterministic patterns with controlled randomness
 */
const generateTemperatureSpeedData = (
  pointCount: number = 50,
  curveType: string = "low"
): DataPoint[] => {
  // Define different curve characteristics
  const curveParams = {
    low: {
      altRange: { min: 0, max: 3000 },
      tempBase: 20,
      speedBase: 15,
      pattern: "linear",
    },
    medium: {
      altRange: { min: 2500, max: 7000 },
      tempBase: 10,
      speedBase: 25,
      pattern: "exponential",
    },
    high: {
      altRange: { min: 6000, max: 12000 },
      tempBase: -10,
      speedBase: 35,
      pattern: "logarithmic",
    },
  };

  const params =
    curveParams[curveType as keyof typeof curveParams] || curveParams.low;

  return Array.from({ length: pointCount }, (_, i) => {
    // Generate altitude within the specified range
    const altitudeProgress = i / (pointCount - 1);
    const altitude =
      params.altRange.min +
      altitudeProgress * (params.altRange.max - params.altRange.min) +
      (Math.random() - 0.5) * 300;

    // Different temperature patterns for each curve
    let temperature: number;
    switch (params.pattern) {
      case "exponential":
        temperature =
          params.tempBase -
          (altitude / 1000) * 5 +
          Math.sin(altitudeProgress * Math.PI * 2) * 3 +
          (Math.random() - 0.5) * 4;
        break;
      case "logarithmic":
        temperature =
          params.tempBase -
          Math.log(altitude / 1000 + 1) * 8 +
          (Math.random() - 0.5) * 6;
        break;
      default: // linear
        temperature =
          params.tempBase - (altitude / 1000) * 6.5 + (Math.random() - 0.5) * 5;
    }

    // Different speed patterns for each curve
    let speed: number;
    switch (params.pattern) {
      case "exponential":
        speed =
          params.speedBase +
          Math.pow(altitude / 1000, 1.2) * 8 +
          (Math.random() - 0.5) * 8;
        break;
      case "logarithmic":
        speed =
          params.speedBase +
          Math.log(altitude / 1000 + 1) * 12 +
          (Math.random() - 0.5) * 10;
        break;
      default: // linear
        speed =
          params.speedBase + (altitude / 1000) * 12 + (Math.random() - 0.5) * 6;
    }

    return {
      x: temperature,
      y: Math.max(0, speed), // Ensure non-negative speed
      z: altitude,
      text: `Temperature: ${temperature.toFixed(1)}°C<br>Speed: ${speed.toFixed(
        1
      )} m/s<br>Altitude: ${altitude.toFixed(0)}m`,
    } as DataPoint;
  });
};

const InteractiveMultiSeriesDemo: React.FC = () => {
  const [temperatureUnit, setTemperatureUnit] =
    useState<keyof typeof TEMPERATURE_UNITS>("celsius");
  const [speedUnit, setSpeedUnit] = useState<keyof typeof SPEED_UNITS>("mps");
  const [altitudeUnit, setAltitudeUnit] =
    useState<keyof typeof ALTITUDE_UNITS>("meters");

  // Generate base data for 3 completely different curves
  const baseData = useMemo(() => {
    return [
      generateTemperatureSpeedData(60, "low"), // Low altitude curve - linear pattern
      generateTemperatureSpeedData(50, "medium"), // Medium altitude curve - exponential pattern
      generateTemperatureSpeedData(55, "high"), // High altitude curve - logarithmic pattern
    ];
  }, []);

  // Convert data based on selected units
  const processedSeries = useMemo(() => {
    const tempConfig = TEMPERATURE_UNITS[temperatureUnit];
    const speedConfig = SPEED_UNITS[speedUnit];
    const altConfig = ALTITUDE_UNITS[altitudeUnit];

    const curveNames = [
      "Low Altitude (Linear)",
      "Medium Altitude (Exponential)",
      "High Altitude (Logarithmic)",
    ];

    return baseData.map((curveData, curveIndex) => {
      const convertedData = curveData.map((point) => {
        const convertedTemp = point.x * tempConfig.factor + tempConfig.offset;
        const convertedSpeed =
          point.y * speedConfig.factor + speedConfig.offset;
        const convertedAlt =
          (point.z || 0) * altConfig.factor + altConfig.offset;

        return {
          ...point,
          x: convertedTemp,
          y: convertedSpeed,
          z: convertedAlt,
          text: `Temperature: ${convertedTemp.toFixed(1)} ${
            tempConfig.name
          }<br>Speed: ${convertedSpeed.toFixed(1)} ${
            speedConfig.name
          }<br>Altitude: ${convertedAlt.toFixed(0)} ${altConfig.name}`,
        };
      });

      // Extract altitude values for color mapping
      const altitudeValues = convertedData.map((point) => point.z || 0);
      const minAlt = Math.min(...altitudeValues);
      const maxAlt = Math.max(...altitudeValues);

      const series: SeriesConfig = {
        name: curveNames[curveIndex],
        data: convertedData,
        type: "scatter",
        mode: "lines+markers" as const, // Use both markers and lines to show color mapping
        marker: {
          size: 8,
          colorFeature: "z", // Use the z property (altitude) for coloring
          colorScale: "viridis", // Use lowercase to match MODERN_COLORSCALES
          showColorBar: true, // Show color bar for all series - the traceGeneration will handle display
          colorBarTitle: `Altitude (${altConfig.name})`,
          colorMin: minAlt,
          colorMax: maxAlt,
          line: { width: 1, color: "rgba(255,255,255,0.8)" },
        },
        line: {
          width: 2,
          color: `rgba(${
            curveIndex === 0
              ? "255,107,107"
              : curveIndex === 1
              ? "78,205,196"
              : "156,39,176"
          }, 0.7)`, // Semi-transparent line colors
        },
        showInLegend: true,
        visible: true,
      };

      return series;
    });
  }, [baseData, temperatureUnit, speedUnit, altitudeUnit]);

  const plotConfig = useMemo(() => {
    const tempConfig = TEMPERATURE_UNITS[temperatureUnit];
    const speedConfig = SPEED_UNITS[speedUnit];

    return {
      title:
        "Temperature vs Speed Analysis - Three Different Curves with Altitude Coloring",
      xAxis: {
        title: `Temperature (${tempConfig.name})`,
      },
      yAxis: {
        title: `Speed (${speedConfig.name})`,
      },
      height: "650px",
    };
  }, [temperatureUnit, speedUnit]);

  // ==========================================================================
  // 🎯 EVENT HANDLERS - PERFORMANCE OPTIMIZED WITH useCallback
  // ==========================================================================

  /**
   * 🌡️ Handle temperature unit changes with performance optimization
   * Prevents unnecessary re-renders by memoizing the handler function
   */
  const handleTemperatureUnitChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setTemperatureUnit(e.target.value as keyof typeof TEMPERATURE_UNITS);
    },
    []
  );

  /**
   * 💨 Handle speed unit changes with performance optimization
   * Prevents unnecessary re-renders by memoizing the handler function
   */
  const handleSpeedUnitChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSpeedUnit(e.target.value as keyof typeof SPEED_UNITS);
    },
    []
  );

  /**
   * 🏔️ Handle altitude unit changes with performance optimization
   * Prevents unnecessary re-renders by memoizing the handler function
   */
  const handleAltitudeUnitChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setAltitudeUnit(e.target.value as keyof typeof ALTITUDE_UNITS);
    },
    []
  );

  return (
    <div>
      {/* Integrated Control Panel */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "25px",
          marginBottom: "25px",
          padding: "25px 20px",
          backgroundColor: "#ffffff",
          borderBottom: "2px solid #e3f2fd",
          boxShadow: "0 2px 8px rgba(33, 150, 243, 0.1)",
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "10px",
              fontWeight: "700",
              color: "#1565c0",
              fontSize: "15px",
              textAlign: "center",
            }}
          >
            🌡️ Temperature Unit (X-Axis):
          </label>
          <select
            value={temperatureUnit}
            onChange={handleTemperatureUnitChange}
            style={{
              padding: "10px 15px",
              borderRadius: "8px",
              border: "2px solid #2196f3",
              backgroundColor: "white",
              minWidth: "140px",
              fontSize: "14px",
              fontWeight: "600",
              color: "#1565c0",
              cursor: "pointer",
            }}
          >
            <option value="celsius">Celsius (°C)</option>
            <option value="fahrenheit">Fahrenheit (°F)</option>
            <option value="kelvin">Kelvin (K)</option>
          </select>
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "10px",
              fontWeight: "700",
              color: "#2e7d32",
              fontSize: "15px",
              textAlign: "center",
            }}
          >
            🚀 Speed Unit (Y-Axis):
          </label>
          <select
            value={speedUnit}
            onChange={handleSpeedUnitChange}
            style={{
              padding: "10px 15px",
              borderRadius: "8px",
              border: "2px solid #4caf50",
              backgroundColor: "white",
              minWidth: "140px",
              fontSize: "14px",
              fontWeight: "600",
              color: "#2e7d32",
              cursor: "pointer",
            }}
          >
            <option value="mps">Meters/sec (m/s)</option>
            <option value="kmh">Kilometers/hour (km/h)</option>
            <option value="mph">Miles/hour (mph)</option>
            <option value="kts">Knots (kts)</option>
          </select>
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "10px",
              fontWeight: "700",
              color: "#7b1fa2",
              fontSize: "15px",
              textAlign: "center",
            }}
          >
            �️ Altitude Unit (Coloring):
          </label>
          <select
            value={altitudeUnit}
            onChange={handleAltitudeUnitChange}
            style={{
              padding: "10px 15px",
              borderRadius: "8px",
              border: "2px solid #9c27b0",
              backgroundColor: "white",
              minWidth: "140px",
              fontSize: "14px",
              fontWeight: "600",
              color: "#7b1fa2",
              cursor: "pointer",
            }}
          >
            <option value="meters">Meters (m)</option>
            <option value="feet">Feet (ft)</option>
            <option value="kilometers">Kilometers (km)</option>
            <option value="miles">Miles (mi)</option>
          </select>
        </div>
      </div>

      {/* Info Panel */}
      <div
        style={{
          marginBottom: "25px",
          padding: "20px",
          backgroundColor: "#f3e5f5",
          borderBottom: "2px solid #9c27b0",
        }}
      >
        <h3
          style={{
            margin: "0 0 12px 0",
            color: "#7b1fa2",
            textAlign: "center",
            fontSize: "20px",
          }}
        >
          🔬 Temperature vs Speed Analysis - Three Curves
        </h3>
        <p
          style={{
            margin: 0,
            color: "#4a148c",
            fontSize: "15px",
            textAlign: "center",
            lineHeight: "1.5",
          }}
        >
          Explore the relationship between <strong>temperature</strong> and{" "}
          <strong>speed</strong> across
          <strong> three completely different curves</strong>. Each curve
          follows a different mathematical pattern (linear, exponential,
          logarithmic) with <strong>altitude-based color mapping</strong> on the
          markers. Change units in real-time for temperature, speed, and
          altitude measurements.
        </p>
      </div>

      {/* Full Width Plot Component */}
      <div
        style={{
          backgroundColor: "white",
          overflow: "visible",
          boxShadow: "0 2px 8px rgba(3, 169, 244, 0.15)",
        }}
      >
        <UnifiedPlotter
          series={processedSeries}
          config={plotConfig}
          interactions={{
            enableHoverOpacity: true,
            dimmedOpacity: 0.02,
            highlightOpacity: 5.0,
          }}
        />
      </div>
    </div>
  );
};

export default InteractiveMultiSeriesDemo;

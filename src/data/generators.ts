// =============================================================================
// 📊 DATA GENERATORS - HIGH-PERFORMANCE TEST DATA CREATION
// =============================================================================
// Extracted and improved data generation functions from demo components.
// These functions create realistic test data for various chart types following
// GitHub Copilot standards for clean, reusable, and well-documented code.
//
// 🎯 Design Goals:
// - DRY-compliant: Reusable across all demo components
// - Performance-oriented: Efficient array generation
// - Bug-resistant: Input validation and error handling
// - Test-friendly: Predictable outputs with configurable parameters

import type { DataPoint } from "../types/PlotterTypes";

// =============================================================================
// 🔢 MATHEMATICAL DATA GENERATORS
// =============================================================================

/**
 * 📈 Generate linear data with configurable noise and parameters
 *
 * Creates realistic linear datasets with optional noise for testing
 * scatter plots, trend analysis, and regression visualizations.
 *
 * @param count - Number of data points to generate (default: 100)
 * @param slope - Linear slope coefficient (default: 1)
 * @param intercept - Y-intercept value (default: 0)
 * @param noise - Random noise amplitude 0-1 (default: 0.1)
 * @returns Array of DataPoint objects with linear relationship
 *
 * 🚀 Performance: O(n) time complexity, optimized for large datasets
 * 🧪 Test-friendly: Deterministic base + controlled randomness
 */
export const generateLinearData = (
  count: number = 100,
  slope: number = 1,
  intercept: number = 0,
  noise: number = 0.1
): DataPoint[] => {
  // 🛡️ Input validation for bug resistance
  if (count <= 0) return [];
  if (noise < 0) noise = 0;

  return Array.from({ length: count }, (_, i) => ({
    x: i,
    y: slope * i + intercept + (Math.random() - 0.5) * noise,
  }));
};

/**
 * 🌊 Generate sinusoidal data with realistic wave patterns
 *
 * Creates smooth sinusoidal datasets perfect for demonstrating
 * curve fitting, frequency analysis, and periodic data visualization.
 *
 * @param count - Number of data points to generate (default: 200)
 * @param amplitude - Wave amplitude (default: 1)
 * @param frequency - Wave frequency (default: 0.1)
 * @param phase - Phase shift in radians (default: 0)
 * @param noise - Random noise amplitude (default: 0.05)
 * @returns Array of DataPoint objects with sinusoidal relationship
 *
 * 🎯 Use Cases: Signal processing, time series, periodic phenomena
 * 🚀 Performance: Vectorized math operations for efficiency
 */
export const generateSinusoidalData = (
  count: number = 200,
  amplitude: number = 1,
  frequency: number = 0.1,
  phase: number = 0,
  noise: number = 0.05
): DataPoint[] => {
  // 🛡️ Input validation
  if (count <= 0) return [];
  if (amplitude < 0) amplitude = Math.abs(amplitude);

  return Array.from({ length: count }, (_, i) => ({
    x: i * 0.1,
    y:
      amplitude * Math.sin(frequency * i + phase) +
      (Math.random() - 0.5) * noise,
  }));
};

// =============================================================================
// 🌡️ REALISTIC DATA GENERATORS
// =============================================================================

/**
 * 🌡️ Generate realistic temperature data with seasonal patterns
 *
 * Creates weather-like temperature data following natural patterns:
 * - Seasonal variations (annual cycle)
 * - Daily random fluctuations
 * - Realistic temperature ranges
 *
 * @param days - Number of days to generate (default: 365)
 * @returns Array of DataPoint objects representing daily temperatures
 *
 * 🎯 Perfect for: Weather analysis, climate studies, time series demos
 * 📊 Data Quality: Follows real-world temperature distribution patterns
 */
export const generateTemperatureData = (days: number = 365): DataPoint[] => {
  // 🛡️ Input validation
  if (days <= 0) return [];

  const baseTemp = 15; // Base temperature in Celsius
  const seasonalAmplitude = 20; // Seasonal variation amplitude
  const dailyVariation = 5; // Daily random variation range

  return Array.from({ length: days }, (_, day) => {
    const seasonalFactor = Math.sin((day / 365) * 2 * Math.PI - Math.PI / 2);
    const randomVariation = (Math.random() - 0.5) * dailyVariation;
    const temperature =
      baseTemp + seasonalAmplitude * seasonalFactor + randomVariation;

    return {
      x: day,
      y: Math.round(temperature * 10) / 10, // Round to 1 decimal place
      text: `Day ${day + 1}: ${temperature.toFixed(1)}°C`,
    };
  });
};

/**
 * Generate climate data (temperature vs humidity)
 */
export const generateClimateData = (count: number = 500): DataPoint[] => {
  return Array.from({ length: count }, () => {
    const temperature = 10 + Math.random() * 30; // 10-40°C
    const humidity = Math.max(
      20,
      Math.min(95, 60 + (temperature - 25) * -1.5 + (Math.random() - 0.5) * 30)
    ); // Realistic temp-humidity relationship

    return {
      x: temperature,
      y: humidity,
      text: `${temperature.toFixed(1)}°C, ${humidity.toFixed(1)}%`,
    };
  });
};

/**
 * Generate fuel consumption data
 */
export const generateFuelData = (count: number = 1000): DataPoint[] => {
  return Array.from({ length: count }, () => {
    const speed = 10 + Math.random() * 110; // 10-120 km/h
    // Realistic fuel consumption curve (more fuel at very low and high speeds)
    const baseFuelConsumption = 4 + Math.pow(speed - 60, 2) / 500;
    const fuelConsumption = Math.max(
      3,
      baseFuelConsumption + (Math.random() - 0.5) * 2
    );

    return {
      x: speed,
      y: fuelConsumption,
      text: `${speed.toFixed(0)} km/h: ${fuelConsumption.toFixed(1)} L/100km`,
    };
  });
};

/**
 * Generate scientific measurement data with error bars
 */
export const generateScientificData = (count: number = 50): DataPoint[] => {
  return Array.from({ length: count }, (_, i) => {
    const x = i * 0.5;
    const y = Math.exp(-x * 0.1) * Math.cos(x) + (Math.random() - 0.5) * 0.1;
    const errorX = Math.random() * 0.05;
    const errorY = Math.random() * 0.02;

    return {
      x,
      y,
      error_x: errorX,
      error_y: errorY,
      text: `Measurement ${i + 1}`,
    };
  });
};

/**
 * Generate stock price data (realistic OHLC patterns)
 */
export const generateStockData = (days: number = 252): DataPoint[] => {
  let price = 100; // Starting price
  const data: DataPoint[] = [];

  for (let i = 0; i < days; i++) {
    // Random walk with slight upward trend
    const change = (Math.random() - 0.48) * 5; // Slight upward bias
    price = Math.max(10, price + change); // Don't go below $10

    data.push({
      x: i,
      y: Math.round(price * 100) / 100,
      text: `Day ${i + 1}: $${price.toFixed(2)}`,
    });
  }

  return data;
};

/**
 * Generate 3D scatter data (x, y, z coordinates)
 */
export const generate3DData = (count: number = 200): DataPoint[] => {
  return Array.from({ length: count }, (_, i) => {
    const theta = (i / count) * 4 * Math.PI;
    const phi = Math.random() * Math.PI;
    const r = 5 + Math.random() * 3;

    return {
      x: r * Math.sin(phi) * Math.cos(theta),
      y: r * Math.sin(phi) * Math.sin(theta),
      z: r * Math.cos(phi),
      text: `Point ${i + 1}`,
    };
  });
};

/**
 * Generate time series data
 */
export const generateTimeSeriesData = (
  hours: number = 168, // 1 week
  baseValue: number = 100,
  volatility: number = 0.02
): DataPoint[] => {
  let value = baseValue;
  const startTime = new Date().getTime();

  return Array.from({ length: hours }, (_, i) => {
    // Add some realistic patterns (daily/weekly cycles)
    const hourOfDay = i % 24;
    const dayOfWeek = Math.floor(i / 24) % 7;

    // Daily pattern (higher activity during business hours)
    const dailyFactor = hourOfDay >= 9 && hourOfDay <= 17 ? 1.1 : 0.9;
    // Weekly pattern (lower on weekends)
    const weeklyFactor = dayOfWeek >= 5 ? 0.8 : 1.0;

    // Random walk
    const change = (Math.random() - 0.5) * volatility * value;
    value = Math.max(0, value + change * dailyFactor * weeklyFactor);

    return {
      x: startTime + i * 60 * 60 * 1000, // Milliseconds
      y: Math.round(value * 100) / 100,
      text: `Hour ${i + 1}: ${value.toFixed(2)}`,
    };
  });
};

/**
 * Generate large dataset for performance testing
 */
export const generateLargeDataset = (count: number = 10000): DataPoint[] => {
  return Array.from({ length: count }, (_, i) => {
    const x = i / 100;
    const y =
      Math.sin(x * 0.5) * Math.exp(-x * 0.01) + (Math.random() - 0.5) * 0.1;

    return {
      x,
      y,
      // Only add text to some points to save memory
      ...(i % 100 === 0 ? { text: `Point ${i}` } : {}),
    };
  });
};

/**
 * Generate multi-series data for comparison charts
 */
export const generateMultiSeriesData = (
  seriesCount: number = 3,
  pointsPerSeries: number = 100
) => {
  return Array.from({ length: seriesCount }, (_, seriesIndex) => ({
    name: `Series ${seriesIndex + 1}`,
    data: Array.from({ length: pointsPerSeries }, (_, pointIndex) => {
      const x = pointIndex;
      const y =
        (seriesIndex + 1) * Math.sin(pointIndex * 0.1) +
        (Math.random() - 0.5) * (seriesIndex + 1);

      return { x, y };
    }),
  }));
};

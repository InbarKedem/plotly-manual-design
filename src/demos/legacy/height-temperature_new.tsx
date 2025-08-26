import React, { useMemo } from "react";
import UnifiedPlotter from "../../UnifiedPlotter";
import type { SeriesConfig } from "../../types/PlotterTypes";
import { SCIENTIFIC_THEME } from "../../config/themes";
import { timeSeriesPreset } from "../../presets/scientific";

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

const HeightTemperaturePlot: React.FC = () => {
  // Generate climate data using modern architecture
  const climateSeriesData = useMemo(() => {
    const NUM_POINTS = 1000;
    const MAX_HEIGHT = 10000;

    // Climate control points for Bézier curves
    const climateConfigs = {
      temperate: { p0: 25, p1: 15, p2: -20, p3: -45 },
      desert: { p0: 55, p1: 45, p2: 10, p3: -20 },
      arctic: { p0: 5, p1: -30, p2: -15, p3: -80 },
      storm: { p0: 35, p1: 5, p2: 25, p3: -50 },
    } as const;

    const climateData: Record<string, any[]> = {};

    Object.entries(climateConfigs).forEach(([climateName, config]) => {
      const data = [];

      for (let i = 0; i < NUM_POINTS; i++) {
        const t = i / (NUM_POINTS - 1);
        const height = t * MAX_HEIGHT;

        // Base temperature from Bézier curve
        const baseTemp = calculateCubicBezier(t, config);

        // Add realistic variations
        const tempVariation = (Math.random() - 0.5) * 8;
        const seasonalVariation = Math.sin(t * Math.PI * 4) * 3;
        const temperature = baseTemp + tempVariation + seasonalVariation;

        // Calculate other properties
        const pressure = 1013.25 * Math.exp(-height / 8400);
        const speed = 20 + Math.random() * 60 + (height / 1000) * 5;

        data.push({
          x: height,
          y: temperature,
          metadata: {
            height: height.toFixed(0),
            temperature: temperature.toFixed(1),
            pressure: pressure.toFixed(1),
            speed: speed.toFixed(1),
            climate: climateName,
          },
        });
      }

      climateData[climateName] = data;
    });

    return climateData;
  }, []);

  // Create series for each climate type
  const series: SeriesConfig[] = useMemo(() => {
    const colors = {
      temperate: "#22c55e",
      desert: "#f59e0b",
      arctic: "#3b82f6",
      storm: "#8b5cf6",
    };

    return Object.entries(climateSeriesData).map(([climateName, data]) => ({
      name: `${
        climateName.charAt(0).toUpperCase() + climateName.slice(1)
      } Climate`,
      data,
      type: "scatter",
      mode: "lines+markers" as const,
      marker: {
        size: 3,
        color: colors[climateName as keyof typeof colors],
        opacity: 0.7,
      },
      line: {
        color: colors[climateName as keyof typeof colors],
        width: 1,
        shape: "spline",
        smoothing: 0.8,
      },
      hovertemplate:
        "<b>%{fullData.name}</b><br>" +
        "<b>Height:</b> %{x:.0f}m<br>" +
        "<b>Temperature:</b> %{y:.1f}°C<br>" +
        "<extra></extra>",
    }));
  }, [climateSeriesData]);

  return (
    <div style={{ width: "100%", height: "600px", padding: "20px" }}>
      <h3>🏔️ Height vs Temperature by Climate (Migrated to UnifiedPlotter)</h3>
      <UnifiedPlotter
        series={series}
        config={{
          ...timeSeriesPreset.config,
          title: "Temperature vs Altitude Across Different Climate Zones",
          xAxis: {
            title: "Height (meters)",
            showgrid: true,
            range: [0, 10000],
          },
          yAxis: {
            title: "Temperature (°C)",
            showgrid: true,
            range: [-80, 60],
          },
          showLegend: true,
        }}
        interactions={{
          ...timeSeriesPreset.interactions,
          enableZoom: true,
          enablePan: true,
        }}
        theme={SCIENTIFIC_THEME}
        debug={false}
        progressiveLoading={{
          enabled: true,
          chunkSize: 200,
          showProgress: true,
        }}
      />
    </div>
  );
};

export default HeightTemperaturePlot;

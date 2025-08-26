import React, { useMemo } from "react";
import GenericPlotter from "./components/GenericPlotter";
import type {
  SeriesConfig,
  PlotConfig,
  DataPoint,
  ProgressConfig,
} from "./components/GenericPlotter";

// =============================================================================
// UTILITY FUNCTIONS FOR DATA GENERATION
// =============================================================================

interface BezierControlPoints {
  p0: number;
  p1: number;
  p2: number;
  p3: number;
}

const calculateCubicBezier = (
  t: number,
  { p0, p1, p2, p3 }: BezierControlPoints
): number => {
  const u = 1 - t;
  return (
    u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3
  );
};

const generateBezierData = (
  numPoints: number,
  bezierConfig: BezierControlPoints,
  maxX: number,
  _maxY: number
): DataPoint[] => {
  const data: DataPoint[] = [];

  for (let i = 0; i < numPoints; i++) {
    const t = i / numPoints;
    const x = t * maxX;
    const y = calculateCubicBezier(t, bezierConfig);

    // Add additional features for coloring
    const speed = 15 + Math.random() * 115; // 15-130 km/h
    const pressure = 800 + Math.random() * 400; // 800-1200 hPa
    const temperature = -50 + Math.random() * 100; // -50 to 50°C

    data.push({
      x,
      y,
      z: speed, // Using 'z' as the third feature for coloring
      speed,
      pressure,
      temperature,
    });
  }

  return data;
};

// =============================================================================
// EXAMPLE 1: SIMPLE SCATTER PLOT
// =============================================================================

export const SimpleScatterExample: React.FC = () => {
  const series: SeriesConfig[] = useMemo(
    () => [
      {
        name: "Simple Points",
        data: Array.from({ length: 100 }, (_, i) => ({
          x: i,
          y: Math.sin(i * 0.1) * 20 + Math.random() * 10,
          z: Math.random() * 100, // Random values for coloring
          temperature: -20 + Math.random() * 80,
        })),
        mode: "markers",
        marker: {
          size: 6,
          colorFeature: "z",
          colorScale: "Hot",
          showColorBar: true,
          colorBarTitle: "Random Value",
        },
      },
    ],
    []
  );

  const plotConfig: PlotConfig = {
    title: "Simple Scatter Plot with Color Mapping",
    xAxisTitle: "Index",
    yAxisTitle: "Sin Wave + Noise",
    showLegend: true,
  };

  return <GenericPlotter series={series} config={plotConfig} />;
};

// =============================================================================
// EXAMPLE 2: MULTIPLE LINE STYLES
// =============================================================================

export const MultipleLineStylesExample: React.FC = () => {
  const series: SeriesConfig[] = useMemo(() => {
    const lineStyles = ["solid", "dash", "dot", "dashdot", "longdash"] as const;
    const colors = [
      "rgba(31, 119, 180, 0.8)",
      "rgba(255, 127, 14, 0.8)",
      "rgba(44, 160, 44, 0.8)",
      "rgba(214, 39, 40, 0.8)",
      "rgba(148, 103, 189, 0.8)",
    ];

    return Array.from({ length: 5 }, (_, i) => ({
      name: `Style ${i + 1}`,
      data: generateBezierData(
        50,
        { p0: 2 + i, p1: 4 + i * 0.8, p2: 6 + i * 1.2, p3: 8 + i * 1.5 },
        100,
        15
      ),
      mode: "lines+markers" as const,
      line: {
        width: 3,
        dash: lineStyles[i],
        color: colors[i],
      },
      marker: {
        size: 4,
      },
    }));
  }, []);

  const plotConfig: PlotConfig = {
    title: "Different Line Styles and Colors",
    xAxisTitle: "X Values",
    yAxisTitle: "Generated Values",
    legendPosition: { x: 1.15, y: 1.0 },
  };

  return <GenericPlotter series={series} config={plotConfig} />;
};

// =============================================================================
// EXAMPLE 3: SPEED-COLORED GRADIENT LINES
// =============================================================================

export const GradientLinesExample: React.FC = () => {
  const series: SeriesConfig[] = useMemo(
    () => [
      {
        name: "Desert Climate",
        data: generateBezierData(
          100,
          { p0: 3.8, p1: 5.2, p2: 7.1, p3: 9.2 },
          10000,
          15
        ),
        mode: "lines+markers",
        connectDots: true,
        gradientLines: true,
        line: {
          width: 2,
          dash: "solid",
        },
        marker: {
          size: 3,
          colorFeature: "z", // Speed coloring
          colorScale: [
            [0, "rgba(0, 0, 255, 0.8)"],
            [0.3, "rgba(128, 128, 255, 0.8)"],
            [0.6, "rgba(255, 128, 0, 0.8)"],
            [1, "rgba(255, 0, 0, 0.8)"],
          ],
          showColorBar: true,
          colorBarTitle: "Speed (km/h)",
          colorMin: 15,
          colorMax: 130,
        },
      },
      {
        name: "Arctic Climate",
        data: generateBezierData(
          100,
          { p0: 4.2, p1: 6.8, p2: 5.5, p3: 8.9 },
          10000,
          15
        ),
        mode: "lines+markers",
        connectDots: true,
        gradientLines: true,
        line: {
          width: 2,
          dash: "dash",
        },
        marker: {
          size: 3,
          colorFeature: "z",
          colorScale: [
            [0, "rgba(128, 0, 255, 0.8)"],
            [0.5, "rgba(255, 0, 128, 0.8)"],
            [1, "rgba(255, 128, 0, 0.8)"],
          ],
          colorMin: 15,
          colorMax: 130,
        },
      },
    ],
    []
  );

  const plotConfig: PlotConfig = {
    title: "Speed-Colored Gradient Lines",
    xAxisTitle: "Height (meters)",
    yAxisTitle: "Fuel Consumption (L/100km)",
    margin: { r: 300 },
  };

  return <GenericPlotter series={series} config={plotConfig} />;
};

// =============================================================================
// EXAMPLE 4: HIGH-DENSITY PROGRESSIVE LOADING
// =============================================================================

export const ProgressiveLoadingExample: React.FC = () => {
  const series: SeriesConfig[] = useMemo(
    () => [
      {
        name: "High-Density Dataset",
        data: generateBezierData(
          2000,
          { p0: 0, p1: 50, p2: -20, p3: 100 },
          1000,
          150
        ),
        mode: "markers",
        marker: {
          size: 2,
          colorFeature: "temperature",
          colorScale: "Viridis",
          showColorBar: true,
          colorBarTitle: "Temperature (°C)",
          colorMin: -50,
          colorMax: 50,
        },
      },
    ],
    []
  );

  const plotConfig: PlotConfig = {
    title: "Progressive Loading Demo (2000 Points)",
    xAxisTitle: "X Coordinate",
    yAxisTitle: "Y Coordinate",
  };

  const progressConfig: ProgressConfig = {
    enabled: true,
    chunkSize: 50,
    showProgress: true,
    showPhase: true,
    onProgress: (progress: any, phase: any, pointsLoaded: any) => {
      console.log(
        `Progress: ${progress}%, Phase: ${phase}, Points: ${pointsLoaded}`
      );
    },
    onComplete: (totalPoints: any) => {
      console.log(`Loading complete! Total points: ${totalPoints}`);
    },
  };

  return (
    <GenericPlotter
      series={series}
      config={plotConfig}
      progressiveLoading={progressConfig}
    />
  );
};

// =============================================================================
// EXAMPLE 5: ALL FEATURES COMBINED
// =============================================================================

export const AllFeaturesExample: React.FC = () => {
  const series: SeriesConfig[] = useMemo(
    () => [
      {
        name: "Temperate Climate",
        data: generateBezierData(
          200,
          { p0: 2.5, p1: 3.2, p2: 4.8, p3: 6.5 },
          8000,
          12
        ),
        mode: "lines+markers",
        connectDots: true,
        gradientLines: true,
        line: {
          width: 3,
          dash: "solid",
        },
        marker: {
          size: 4,
          colorFeature: "speed",
          colorScale: "Jet",
          showColorBar: true,
          colorBarTitle: "Speed (km/h)",
          colorMin: 15,
          colorMax: 130,
        },
      },
      {
        name: "Desert Climate",
        data: generateBezierData(
          200,
          { p0: 3.8, p1: 5.2, p2: 7.1, p3: 9.2 },
          8000,
          12
        ),
        mode: "lines+markers",
        connectDots: true,
        gradientLines: false,
        line: {
          width: 2,
          dash: "dash",
          color: "rgba(255, 127, 14, 0.8)",
        },
        marker: {
          size: 3,
          colorFeature: "pressure",
          colorScale: "Hot",
          colorMin: 800,
          colorMax: 1200,
        },
      },
      {
        name: "Storm Climate",
        data: generateBezierData(
          150,
          { p0: 5.5, p1: 8.2, p2: 12.1, p3: 15.8 },
          8000,
          12
        ),
        mode: "lines+markers",
        line: {
          width: 4,
          dash: "longdash",
          color: "rgba(214, 39, 40, 0.8)",
        },
        marker: {
          size: 5,
          colorFeature: "temperature",
          colorScale: "RdBu",
          showColorBar: false,
          colorMin: -50,
          colorMax: 50,
        },
      },
    ],
    []
  );

  const plotConfig: PlotConfig = {
    title: "All Features Demo - Multi-Climate Fuel Consumption",
    xAxisTitle: "Altitude (meters)",
    yAxisTitle: "Fuel Consumption (L/100km)",
    width: "100%",
    height: "600px",
    legendPosition: { x: 1.1, y: 1.0 },
    margin: { r: 350 },
  };

  const progressConfig: ProgressConfig = {
    enabled: true,
    chunkSize: 30,
    showProgress: true,
    showPhase: true,
  };

  return (
    <GenericPlotter
      series={series}
      config={plotConfig}
      progressiveLoading={progressConfig}
    />
  );
};

// =============================================================================
// EXAMPLE 6: TEMPERATURE VS HEIGHT (LIKE YOUR ORIGINAL)
// =============================================================================

export const TemperatureHeightExample: React.FC = () => {
  const series: SeriesConfig[] = useMemo(
    () => [
      {
        name: "Temperature Profile",
        data: Array.from({ length: 500 }, (_, i) => {
          const height = i * 20; // 0-10000m
          const baseTemp = 15 - height * 0.0065; // Standard lapse rate
          const noise = (Math.random() - 0.5) * 5;
          const pressure =
            1013.25 * Math.pow(1 - (0.0065 * height) / 288.15, 5.255);

          return {
            x: height,
            y: baseTemp + noise,
            z: pressure,
            pressure,
            altitude: height,
          };
        }),
        mode: "lines+markers",
        line: {
          width: 2,
          dash: "solid",
          color: "rgba(31, 119, 180, 0.8)",
        },
        marker: {
          size: 2,
          colorFeature: "z", // Pressure coloring
          colorScale: [
            [0, "rgba(255, 0, 255, 0.8)"], // High pressure - magenta
            [0.5, "rgba(0, 255, 0, 0.8)"], // Medium pressure - green
            [1, "rgba(255, 255, 0, 0.8)"], // Low pressure - yellow
          ],
          showColorBar: true,
          colorBarTitle: "Pressure (hPa)",
        },
      },
    ],
    []
  );

  const plotConfig: PlotConfig = {
    title: "Atmospheric Temperature vs Height",
    xAxisTitle: "Height (meters)",
    yAxisTitle: "Temperature (°C)",
  };

  return <GenericPlotter series={series} config={plotConfig} />;
};

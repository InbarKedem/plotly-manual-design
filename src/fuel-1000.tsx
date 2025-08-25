import Plot from "react-plotly.js";
import { useMemo, useState, useEffect, useCallback, useRef } from "react";

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

const FuelConsumption1000 = () => {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState("Ready to load");
  const [isGenerating, setIsGenerating] = useState(false);
  const [totalPointsLoaded, setTotalPointsLoaded] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Use refs to store data to avoid re-render loops
  const climateDataRef = useRef<Record<string, ClimateData>>({
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
  });

  const [plotData, setPlotData] = useState<any[]>([]);

  // Configuration
  const config = useMemo(
    () => ({
      NUM_POINTS: 1000, // 1000 points per curve
      MAX_HEIGHT: 10000,
      CHUNK_SIZE: 100, // Process in chunks for smooth loading
      climateTypes: ["temperate", "desert", "arctic", "storm"] as const,
    }),
    []
  );

  // Climate control points for Bézier curves (fuel efficiency curves)
  const climateConfigs = useMemo(
    () => ({
      temperate: { p0: 2.5, p1: 3.2, p2: 4.8, p3: 6.5 },
      desert: { p0: 3.8, p1: 5.2, p2: 7.1, p3: 9.2 },
      arctic: { p0: 4.2, p1: 6.8, p2: 5.5, p3: 8.9 },
      storm: { p0: 5.5, p1: 8.2, p2: 12.1, p3: 15.8 },
    }),
    []
  );

  // Generate climate data chunk function
  const generateClimateDataChunk = useCallback(
    (
      startIndex: number,
      chunkSize: number,
      totalPoints: number,
      maxHeight: number,
      climateType: "temperate" | "desert" | "arctic" | "storm"
    ): ClimateData => {
      const data: ClimateData = {
        heights: [],
        temperatures: [],
        speeds: [],
        pressures: [],
        fuelConsumption: [],
      };

      for (let i = 0; i < chunkSize; i++) {
        const globalIndex = startIndex + i;
        const t = globalIndex / totalPoints;
        const currentHeight = t * maxHeight;

        data.heights.push(currentHeight);

        // Generate climate-specific data based on type
        let temperature, fuelConsumption;

        switch (climateType) {
          case "temperate":
            temperature = calculateCubicBezier(t, {
              p0: 25,
              p1: 15,
              p2: -20,
              p3: -45,
            });
            temperature +=
              Math.sin(t * Math.PI * 2 + 0.5) * 4 +
              Math.cos(t * Math.PI * 1.5 + 1.2) * 3;
            temperature += (Math.random() - 0.5) * 2;
            temperature = clamp(temperature, -70, 40);

            fuelConsumption = calculateCubicBezier(t, climateConfigs.temperate);
            const altitudeFactor = 1 + (currentHeight / 10000) * 0.3;
            const temperatureFactor = 1 + Math.abs(temperature - 15) * 0.005;
            fuelConsumption *= altitudeFactor * temperatureFactor;
            fuelConsumption += Math.sin(t * Math.PI * 3) * 0.5;
            fuelConsumption += (Math.random() - 0.5) * 0.3;
            fuelConsumption = clamp(fuelConsumption, 1.5, 12.0);
            break;

          case "desert":
            temperature = calculateCubicBezier(t, {
              p0: 55,
              p1: 45,
              p2: 10,
              p3: -20,
            });
            temperature +=
              Math.sin(t * Math.PI * 3 + 2.3) * 8 +
              Math.cos(t * Math.PI * 2.5 + 0.9) * 6;
            if (t > 0.3 && t < 0.6)
              temperature += Math.sin((t - 0.3) * Math.PI * 6) * 10;
            temperature += (Math.random() - 0.5) * 3;
            temperature = clamp(temperature, -25, 60);

            fuelConsumption = calculateCubicBezier(t, climateConfigs.desert);
            const heatStressFactor = 1 + Math.max(0, temperature - 30) * 0.02;
            const altitudeFactorDesert = 1 + (currentHeight / 10000) * 0.25;
            const thermalTurbulenceFactor =
              1 + Math.abs(Math.sin(t * Math.PI * 4)) * 0.3;
            fuelConsumption *=
              heatStressFactor * altitudeFactorDesert * thermalTurbulenceFactor;
            fuelConsumption += Math.sin(t * Math.PI * 2.5) * 0.8;
            fuelConsumption += (Math.random() - 0.5) * 0.5;
            fuelConsumption = clamp(fuelConsumption, 2.5, 18.0);
            break;

          case "arctic":
            temperature = calculateCubicBezier(t, {
              p0: 5,
              p1: -30,
              p2: -15,
              p3: -80,
            });
            temperature +=
              Math.sin(t * Math.PI * 4 + 1.1) * 12 +
              Math.cos(t * Math.PI * 3 + 2.4) * 10;
            temperature += Math.sin(t * Math.PI * 6 + 0.6) * 8;
            if (t > 0.6) temperature += Math.cos((t - 0.6) * Math.PI * 8) * 15;
            temperature += (Math.random() - 0.5) * 5;
            temperature = clamp(temperature, -95, 15);

            fuelConsumption = calculateCubicBezier(t, climateConfigs.arctic);
            const coldStressFactor = 1 + Math.max(0, -temperature) * 0.015;
            const altitudeFactorArctic = 1 + (currentHeight / 10000) * 0.4;
            const windResistanceFactor =
              1 + Math.abs(Math.sin(t * Math.PI * 3)) * 0.25;
            fuelConsumption *=
              coldStressFactor * altitudeFactorArctic * windResistanceFactor;
            fuelConsumption += Math.cos(t * Math.PI * 1.8) * 0.6;
            fuelConsumption += (Math.random() - 0.5) * 0.4;
            fuelConsumption = clamp(fuelConsumption, 3.0, 16.0);
            break;

          case "storm":
            temperature = calculateCubicBezier(t, {
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
            if (t > 0.7)
              temperature += Math.sin((t - 0.7) * Math.PI * 10 + 2.7) * 12;
            if (t > 0.2 && t < 0.5)
              temperature += Math.cos((t - 0.2) * Math.PI * 15) * 10;
            temperature += (Math.random() - 0.5) * 4;
            temperature = clamp(temperature, -65, 50);

            fuelConsumption = calculateCubicBezier(t, climateConfigs.storm);
            const stormIntensityFactor =
              1 + Math.sin(t * Math.PI * 4) * 0.8 + 0.5;
            const altitudeFactorStorm = 1 + (currentHeight / 10000) * 0.6;
            const turbulenceFactor =
              1 + Math.abs(Math.cos(t * Math.PI * 6)) * 0.5;
            const windShearFactor =
              1 + Math.abs(Math.sin(t * Math.PI * 8)) * 0.4;
            fuelConsumption *=
              stormIntensityFactor *
              altitudeFactorStorm *
              turbulenceFactor *
              windShearFactor;
            fuelConsumption += Math.sin(t * Math.PI * 7) * 1.2;
            fuelConsumption += (Math.random() - 0.5) * 0.8;
            fuelConsumption = clamp(fuelConsumption, 4.0, 25.0);
            break;
        }

        data.temperatures.push(temperature);
        data.fuelConsumption.push(fuelConsumption);

        // Generate pressure and speed
        const basePressure = 1013 * Math.exp(-currentHeight / 8000);
        const pressureVariation =
          Math.sin(t * Math.PI * 2) * 50 + Math.cos(t * Math.PI * 1.5) * 30;
        data.pressures.push(basePressure + pressureVariation);

        const baseSpeed =
          45 +
          Math.sin(globalIndex * 0.18 + 0.7) * 28 +
          Math.cos(globalIndex * 0.12 + 1.5) * 20;
        data.speeds.push(
          clamp(baseSpeed + (Math.random() - 0.5) * 15, 15, 130)
        );
      }

      return data;
    },
    [climateConfigs]
  );

  // Function to update plot data from current climate data
  const updatePlotData = useCallback(() => {
    const currentData = climateDataRef.current;

    // Define consistent dark colors and line widths
    const baseColor = "rgba(40, 40, 40, 0.9)";
    const lineWidths = [4, 4, 4, 4, 4];

    const createTrace = (
      climateType: string,
      name: string,
      styleIndex: number
    ) => {
      const data = currentData[climateType];
      if (data.heights.length === 0) return null;

      // Function to convert speed to color
      const speedToColor = (speed: number, alpha = 0.7) => {
        const minSpeed = 15;
        const maxSpeed = 130;
        const normalized = Math.min(
          Math.max((speed - minSpeed) / (maxSpeed - minSpeed), 0),
          1
        );
        const red = Math.round(255 * normalized);
        const blue = Math.round(255 * (1 - normalized));
        const green = Math.round(128 * Math.sin(normalized * Math.PI)); // Create gradient effect
        return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
      };

      // Create line segments with gradient colors based on adjacent points
      const lineSegments = [];
      for (let i = 0; i < data.speeds.length - 1; i++) {
        const currentSpeed = data.speeds[i];
        const nextSpeed = data.speeds[i + 1];
        const avgSpeed = (currentSpeed + nextSpeed) / 2;

        lineSegments.push({
          x: [data.fuelConsumption[i], data.fuelConsumption[i + 1]],
          y: [data.heights[i], data.heights[i + 1]],
          mode: "lines" as const,
          type: "scatter" as const,
          line: {
            width: lineWidths[styleIndex],
            color: speedToColor(avgSpeed, 0.8),
          },
          showlegend: false,
          hoverinfo: "skip" as const,
        });
      }

      // Main trace for markers only
      const markerTrace = {
        x: data.fuelConsumption,
        y: data.heights,
        mode: "markers" as const,
        type: "scatter" as const,
        name: `${name} (${data.heights.length.toLocaleString()} pts) - Speed Colored`,
        marker: {
          size: 4,
          color: data.speeds, // Color markers by speed (third feature)
          colorscale: [
            [0, `rgba(0, 0, 255, 0.8)`], // Low speed - blue
            [0.3, `rgba(128, 128, 255, 0.8)`], // Medium-low speed - light blue
            [0.6, `rgba(255, 128, 0, 0.8)`], // Medium-high speed - orange
            [1, `rgba(255, 0, 0, 0.8)`], // High speed - red
          ],
          showscale: styleIndex === 0, // Show colorbar only for first trace
          colorbar:
            styleIndex === 0
              ? {
                  title: "Speed (km/h)",
                  x: 1.02,
                  y: 0.5,
                  len: 0.8,
                  thickness: 15,
                }
              : undefined,
          cmin: 15,
          cmax: 130,
        },
      };

      return [markerTrace, ...lineSegments];
    };

    const traces = [
      ...(createTrace("temperate", "Temperate", 0) || []),
      ...(createTrace("desert", "Desert", 1) || []),
      ...(createTrace("arctic", "Arctic", 2) || []),
      ...(createTrace("storm", "Storm", 3) || []),
      // Optimized temperate variant with similar gradient approach
      ...(currentData.temperate.heights.length > 0
        ? (() => {
            const optimizedData = {
              ...currentData.temperate,
              fuelConsumption: currentData.temperate.fuelConsumption.map(
                (val) => val * 0.85
              ),
            };

            // Function to convert speed to color for optimized version
            const speedToColorOptimized = (speed: number, alpha = 0.7) => {
              const minSpeed = 15;
              const maxSpeed = 130;
              const normalized = Math.min(
                Math.max((speed - minSpeed) / (maxSpeed - minSpeed), 0),
                1
              );
              // Use green-based gradient for optimized version
              const red = Math.round(100 * normalized);
              const green = Math.round(200 + 55 * (1 - normalized));
              const blue = Math.round(100 + 100 * normalized);
              return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
            };

            // Create line segments for optimized version
            const optimizedLineSegments = [];
            for (let i = 0; i < optimizedData.speeds.length - 1; i++) {
              const currentSpeed = optimizedData.speeds[i];
              const nextSpeed = optimizedData.speeds[i + 1];
              const avgSpeed = (currentSpeed + nextSpeed) / 2;

              optimizedLineSegments.push({
                x: [
                  optimizedData.fuelConsumption[i],
                  optimizedData.fuelConsumption[i + 1],
                ],
                y: [optimizedData.heights[i], optimizedData.heights[i + 1]],
                mode: "lines" as const,
                type: "scatter" as const,
                line: {
                  width: lineWidths[4],
                  color: speedToColorOptimized(avgSpeed, 0.8),
                },
                showlegend: false,
                hoverinfo: "skip" as const,
              });
            }

            const optimizedMarkerTrace = {
              x: optimizedData.fuelConsumption,
              y: optimizedData.heights,
              mode: "markers" as const,
              type: "scatter" as const,
              name: `Temperate Optimized (${optimizedData.heights.length.toLocaleString()} pts) - Speed Colored`,
              marker: {
                size: 4,
                color: optimizedData.speeds,
                colorscale: [
                  [0, `rgba(0, 0, 255, 0.8)`], // Low speed - blue
                  [0.3, `rgba(128, 128, 255, 0.8)`], // Medium-low speed - light blue
                  [0.6, `rgba(255, 128, 0, 0.8)`], // Medium-high speed - orange
                  [1, `rgba(255, 0, 0, 0.8)`], // High speed - red
                ],
                showscale: false, // Don't show duplicate colorbar
                cmin: 15,
                cmax: 130,
              },
            };

            return [optimizedMarkerTrace, ...optimizedLineSegments];
          })()
        : []),
    ].filter((trace) => trace !== null);

    setPlotData(traces);
  }, []);

  // Progressive data generation
  const generateDataProgressive = useCallback(async () => {
    setIsGenerating(true);
    setProgress(0);
    setTotalPointsLoaded(0);
    setIsComplete(false);
    setCurrentPhase("Starting fuel consumption data generation...");

    // Reset data
    climateDataRef.current = {
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

    const { NUM_POINTS, MAX_HEIGHT, CHUNK_SIZE, climateTypes } = config;
    const totalChunks =
      Math.ceil(NUM_POINTS / CHUNK_SIZE) * climateTypes.length;
    let completedChunks = 0;

    // Process each climate type
    for (const climateType of climateTypes) {
      setCurrentPhase(`Loading ${climateType} fuel data...`);

      for (
        let startIndex = 0;
        startIndex < NUM_POINTS;
        startIndex += CHUNK_SIZE
      ) {
        const remainingPoints = Math.min(CHUNK_SIZE, NUM_POINTS - startIndex);

        // Small delay for smooth visualization
        await new Promise((resolve) => {
          requestAnimationFrame(() => {
            setTimeout(resolve, 50); // 50ms delay to see progress
          });
        });

        const chunkData = generateClimateDataChunk(
          startIndex,
          remainingPoints,
          NUM_POINTS,
          MAX_HEIGHT,
          climateType
        );

        // Add chunk to existing data
        const currentClimateData = climateDataRef.current[climateType];
        currentClimateData.heights.push(...chunkData.heights);
        currentClimateData.temperatures.push(...chunkData.temperatures);
        currentClimateData.speeds.push(...chunkData.speeds);
        currentClimateData.pressures.push(...chunkData.pressures);
        currentClimateData.fuelConsumption.push(...chunkData.fuelConsumption);

        completedChunks++;
        const newProgress = (completedChunks / totalChunks) * 100;
        const newTotalPoints = Object.values(climateDataRef.current).reduce(
          (sum, data) => sum + data.heights.length,
          0
        );

        setProgress(newProgress);
        setTotalPointsLoaded(newTotalPoints);
        updatePlotData();
      }
    }

    setCurrentPhase("Finalizing fuel consumption visualization...");
    updatePlotData();
    setProgress(100);

    setTimeout(() => {
      setIsGenerating(false);
      setIsComplete(true);
      setCurrentPhase(`Complete - 5,000 fuel consumption points loaded`);
    }, 200);
  }, [config, generateClimateDataChunk, updatePlotData]);

  // Start generation on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      generateDataProgressive();
    }, 100);

    return () => clearTimeout(timer);
  }, [generateDataProgressive]);

  const plotLayout = {
    title: {
      text: "Fuel Consumption vs. Height - Speed-Colored Points & Gradient Lines (1000 Points)",
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
      r: 280, // Increased margin for colorbar and legend
    },
  };

  console.log(
    "FuelConsumption1000 rendering with",
    plotData.length,
    "traces including gradient line segments and speed-colored markers with 1000 points per curve"
  );
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Plot
        data={plotData}
        layout={plotLayout}
        config={{
          responsive: true,
        }}
        style={{
          width: "100%",
          height: "100%",
          minHeight: "450px",
        }}
        useResizeHandler={true}
      />
    </div>
  );
};

export default FuelConsumption1000;
